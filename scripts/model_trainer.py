"""
model_trainer.py
================
Model egitimi, hyperparameter tuning ve class imbalance stratejileri.

NEDEN BU MODUL VAR?
-------------------
Study-2 ve Study-3'te 3 modeli (LR, DT, RF) tekrar tekrar egitiyorduk.
Her seferinde GridSearchCV parametrelerini, class_weight ayarlarini elden
yaziyorduk. Bu modulde tum bu mantik bir yere toplandi:
- Default modeller (baseline)
- Class-weight balanced modeller
- GridSearch ile tuned modeller
- RandomizedSearch ile hizli tarama
Tek bir cagiriyla butun varyantlari elde edebiliriz.
"""

import numpy as np
import pandas as pd
from scipy.stats import randint, uniform
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import (
    GridSearchCV, RandomizedSearchCV, StratifiedKFold, cross_val_score
)
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score


# Tum projede sabit random_state — tekrarlanabilirlik icin SART
RANDOM_STATE = 42


# ============================================================
# 1. MODEL FABRIKALARI (Factory Functions)
# ============================================================

def get_default_models():
    """
    Default (varsayilan parametreli) 3 modeli dict olarak doner.

    NEDEN FACTORY PATTERN?
    ----------------------
    Her seferinde "models = {...}" yazip class'lari instantiate etmek yerine
    tek bir fonksiyondan istiyoruz. Boylece:
    - Random state'i tek noktadan kontrol ediyoruz
    - Yeni model eklemek istersek (mesela GradientBoosting) tek yere ekleriz
    - Notebook'lar bu fonksiyona bagli, kod cesidi yok
    """
    return {
        'Logistic Regression': LogisticRegression(
            max_iter=1000, random_state=RANDOM_STATE
        ),
        'Decision Tree': DecisionTreeClassifier(
            random_state=RANDOM_STATE
        ),
        'Random Forest': RandomForestClassifier(
            n_estimators=100, random_state=RANDOM_STATE, n_jobs=-1
        ),
    }


def get_balanced_models():
    """
    class_weight='balanced' parametresi ile dengesizlige duyarli modeller.

    NEDEN class_weight='balanced'?
    -------------------------------
    Veri %86 saglikli, %14 diyabetli (dengesiz). Default modeller bu durumda
    "her hastayi saglikli tahmin et, %86 accuracy alirim" mantigina kayar.
    class_weight='balanced' azinlik sinifa daha fazla agirlik vererek bunu
    duzeltir. Sonuc: recall (diyabetli yakalama orani) ciddi artar.

    NEDEN RF ICIN 'balanced_subsample'?
    ------------------------------------
    RandomForest bootstrap sampling yapar; 'balanced' her agacta ayni weight'i
    uygular, 'balanced_subsample' ise HER BOOTSTRAP'TA weight'i yeniden hesaplar.
    Bizim deneylerimizde RF icin 'balanced_subsample' daha iyi recall verdi.
    """
    return {
        'LR (Balanced)': LogisticRegression(
            max_iter=1000, random_state=RANDOM_STATE, class_weight='balanced'
        ),
        'DT (Balanced)': DecisionTreeClassifier(
            random_state=RANDOM_STATE, class_weight='balanced'
        ),
        'RF (Balanced)': RandomForestClassifier(
            n_estimators=100, random_state=RANDOM_STATE, n_jobs=-1,
            class_weight='balanced_subsample'  # Bootstrap'ta her seferinde yeniden hesapla
        ),
    }


# ============================================================
# 2. EGITIM + DEGERLENDIRME (TEK FONKSIYON)
# ============================================================

def train_and_evaluate(models, X_train, X_test, y_train, y_test, verbose=True):
    """
    Verilen model dict'ini egitir, test seti uzerinde degerlendirir.

    NEDEN TEK FONKSIYONDA HEM EGIT HEM DEGERLENDIR?
    ------------------------------------------------
    Notebook'larda her zaman bu ikili birlikte yapiliyor. Ayri tutmak
    gereksiz tekrar yaratir. fit -> predict -> metric hesapla -> dict sakla
    seklinde standart bir flow var, onu sabitliyoruz.

    DONUS:
    ------
    results : dict
        {
            'Model Adi': {
                'model': <egitilmis sklearn model>,
                'y_pred': <test tahminleri>,
                'y_prob': <test olasiliklari>,
                'acc': accuracy,
                'f1': f1-score,
                'auc': roc_auc,
            },
            ...
        }
    """
    results = {}

    # Her modeli sirayla egit ve degerlendir
    for name, model in models.items():
        # Modeli egit (fit)
        model.fit(X_train, y_train)

        # Tahmin yap (predict + predict_proba)
        y_pred = model.predict(X_test)
        # predict_proba her zaman olmayabilir (mesela SVC default), kontrol et
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None

        # Metrikleri hesapla
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_prob) if y_prob is not None else None

        # Tek bir dict altinda sakla
        results[name] = {
            'model': model,
            'y_pred': y_pred,
            'y_prob': y_prob,
            'acc': acc,
            'f1': f1,
            'auc': auc,
        }

        if verbose:
            auc_str = f"{auc:.4f}" if auc is not None else "N/A"
            print(f"[model_trainer] {name}: Acc={acc:.4f} | F1={f1:.4f} | AUC={auc_str}")

    return results


# ============================================================
# 3. HYPERPARAMETER TUNING — GRID SEARCH
# ============================================================

def tune_logistic_regression(X_train, y_train, cv=5, scoring='f1'):
    """
    LogisticRegression icin GridSearchCV ile hyperparameter tuning.

    HANGI PARAMETRELERI ARIYORUZ?
    ------------------------------
    - C: Regularization gucu (kucuk C = guclu reg, buyuk C = zayif reg)
    - penalty: L1 (lasso, feature secimi yapar) veya L2 (ridge, kucultur)
    - solver: liblinear (kucuk veri) veya lbfgs (buyuk veri)

    NEDEN FARKLI SOLVER'LAR?
    ------------------------
    L1 + lbfgs uyumsuz oldugu icin valid kombinasyonlari ayri ayri tanimliyoruz.
    """
    param_grid = [
        # L2 penalty + lbfgs (cogu durum icin uygun)
        {
            'C': [0.01, 0.1, 1, 10],
            'penalty': ['l2'],
            'solver': ['lbfgs'],
            'max_iter': [1000],
        },
        # L1 penalty + liblinear (feature selection yapar)
        {
            'C': [0.01, 0.1, 1, 10],
            'penalty': ['l1'],
            'solver': ['liblinear'],
            'max_iter': [1000],
        },
    ]

    grid = GridSearchCV(
        LogisticRegression(random_state=RANDOM_STATE),
        param_grid,
        cv=StratifiedKFold(n_splits=cv, shuffle=True, random_state=RANDOM_STATE),
        scoring=scoring,
        n_jobs=-1,
        verbose=0,
    )
    grid.fit(X_train, y_train)
    return grid


def tune_decision_tree(X_train, y_train, cv=5, scoring='f1'):
    """
    DecisionTree icin GridSearchCV.

    KILIT PARAMETRELER:
    -------------------
    - max_depth: Agacin maks derinligi (overfit'i onler)
    - min_samples_split: Bir dugumun bolunmesi icin gereken min ornek sayisi
    - criterion: gini veya entropy (her ikisi de iyi, gini biraz daha hizli)
    """
    param_grid = {
        'max_depth': [5, 10, 15, 20, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'criterion': ['gini', 'entropy'],
    }

    grid = GridSearchCV(
        DecisionTreeClassifier(random_state=RANDOM_STATE),
        param_grid,
        cv=StratifiedKFold(n_splits=cv, shuffle=True, random_state=RANDOM_STATE),
        scoring=scoring,
        n_jobs=-1,
        verbose=0,
    )
    grid.fit(X_train, y_train)
    return grid


def tune_random_forest(X_train, y_train, cv=3, scoring='f1', n_iter=20):
    """
    RandomForest icin RandomizedSearchCV (Grid yerine).

    NEDEN RANDOMIZEDSEARCH?
    -----------------------
    RF'nin hyperparameter sayisi cok (n_estimators, max_depth, min_samples...)
    Tam grid arama saatler surer. RandomizedSearch ortusen kombinasyonlardan
    n_iter kadarini rastgele dener, %90 kalitede %10 surede sonuc verir.

    SUREYE BAGLI CV=3:
    ------------------
    RF zaten yavas (n_estimators=200 + 200k satir). CV=5 yerine CV=3 ile
    yaklasik 2x hizlanir, kalite cok dusmez.
    """
    param_distributions = {
        'n_estimators': randint(50, 300),          # 50-300 arasi rastgele
        'max_depth': [10, 20, 30, None],
        'min_samples_split': randint(2, 11),
        'min_samples_leaf': randint(1, 5),
        'max_features': ['sqrt', 'log2'],
    }

    random_search = RandomizedSearchCV(
        RandomForestClassifier(random_state=RANDOM_STATE, n_jobs=-1),
        param_distributions,
        n_iter=n_iter,                              # Toplam dene sayisi
        cv=StratifiedKFold(n_splits=cv, shuffle=True, random_state=RANDOM_STATE),
        scoring=scoring,
        random_state=RANDOM_STATE,
        n_jobs=-1,
        verbose=0,
    )
    random_search.fit(X_train, y_train)
    return random_search


# ============================================================
# 4. NESTED CROSS-VALIDATION
# ============================================================

def nested_cv_score(model, X, y, outer_cv=5, inner_cv=3, scoring='f1', param_grid=None):
    """
    Nested CV: model'in genel performansini OVERFITTING'siz olcer.

    NORMAL CV VS NESTED CV:
    ------------------------
    Normal CV: GridSearchCV ayni veriyle hem parametre seciyor hem skorluyor
               -> SECILEN parametre, SKOR'a "overfit" olabilir.
    Nested CV: Dis dongu skor olcer, ic dongu parametre tunes eder.
               -> Birbirinden bagimsiz, gercek genelleme performansini gosterir.

    NE ZAMAN KULLANIRIZ?
    --------------------
    Akademik calismalarda "modelimin gercek performansi nedir?" sorusuna
    dogru cevap vermek icin. Final raporda nested CV skoru kullanilmali.
    """
    # Ic CV: hyperparameter tuning
    inner = StratifiedKFold(n_splits=inner_cv, shuffle=True, random_state=RANDOM_STATE)
    grid = GridSearchCV(model, param_grid or {}, cv=inner, scoring=scoring, n_jobs=-1)

    # Dis CV: performans olcer
    outer = StratifiedKFold(n_splits=outer_cv, shuffle=True, random_state=RANDOM_STATE)
    scores = cross_val_score(grid, X, y, cv=outer, scoring=scoring, n_jobs=-1)

    return {
        'scores': scores,
        'mean': scores.mean(),
        'std': scores.std(),
    }


# ============================================================
# 5. EN IYI MODELI SEC
# ============================================================

def select_best_model(results, metric='f1', verbose=True):
    """
    Birden cok modelin sonuclarindan belirtilen metrige gore en iyiyi secer.

    NEDEN METRIK PARAMETRESI?
    -------------------------
    "En iyi" model probleme gore degisir:
    - Tibbi tarama -> recall (kacirma maliyeti yuksek)
    - Sahtekar tespiti -> precision (yanlis pozitif maliyeti yuksek)
    - Genel kullanim -> f1 (dengeli)
    - Probability calibration -> auc
    Bu fonksiyon hangi metriği istiyorsak ona gore secer.

    DONUS:
    ------
    (best_name, best_result_dict) tuple
    """
    best_name = None
    best_score = -np.inf

    for name, res in results.items():
        score = res.get(metric)
        if score is not None and score > best_score:
            best_score = score
            best_name = name

    if verbose and best_name:
        print(f"[model_trainer] En iyi model ({metric} = {best_score:.4f}): {best_name}")

    return best_name, results[best_name]
