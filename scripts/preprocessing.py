"""
preprocessing.py
================
Veri on isleme adimlari: olcekleme (scaling), aykiri deger tespiti,
ozellik secimi (feature selection).

NEDEN BU MODUL VAR?
-------------------
Notebook'lara dagilmis sklearn import'larini ve preprocessing kodunu
tek bir merkezi modulde topluyoruz. Boylece:
- Tum studyler ayni scaler'i, ayni feature selection'i kullanir
- Onceden olusturulmus scaler'lar pickle'a kaydedilip yeniden yuklenebilir
- Bir baskasi projeyi okurken preprocessing mantigini tek dosyada gorur
"""

import numpy as np
import pandas as pd
from scipy import stats
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, chi2, RFE
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression


# ============================================================
# 1. OLCEKLEME (SCALING)
# ============================================================

def fit_scaler(X_train):
    """
    StandardScaler'i train veri uzerinde fit eder.

    NEDEN STANDARDSCALER?
    ---------------------
    - LR, KNN, SVM gibi modeller feature olcegine duyarli
    - Mesela BMI (15-50) ve income (1-8) ayni olcege getirilmezse
      buyuk degerli feature'lar modeli dominate eder
    - StandardScaler her feature'i mean=0, std=1 yapar (z-score)

    DIKKAT — SADECE TRAIN UZERINDE FIT!
    ------------------------------------
    Eger test setini de fit'e dahil edersek "data leakage" olur.
    Test verisi modelin hic gormedigi veri olmali, bu yuzden
    sadece train istatistikleriyle scaler kurulur.

    PARAMETRELER:
    -------------
    X_train : pd.DataFrame veya np.ndarray
        Egitim setinin ozellikleri.

    DONUS:
    ------
    scaler : StandardScaler -> fit edilmis scaler objesi
    """
    scaler = StandardScaler()
    scaler.fit(X_train)
    return scaler


def scale_features(X_train, X_test, return_dataframe=True):
    """
    Train ve test setlerini StandardScaler ile olcekler.

    PARAMETRELER:
    -------------
    X_train, X_test : pd.DataFrame
    return_dataframe : bool
        True ise sutun adlarini koruyan DataFrame doner (SHAP icin onemli).
        False ise sklearn varsayilan ndarray doner.

    DONUS:
    ------
    X_train_scaled, X_test_scaled, scaler (uclu tuple)

    NEDEN scaler'i DA DONDURUYORUZ?
    -------------------------------
    Egitim sonrasi yeni bir hasta tahmin etmek istedigimizde, o hastanin
    verisini de ayni scaler ile olceklemek zorundayiz. Scaler'i kaybedersek
    modeli kullanamaz hale geliriz. Bu yuzden saklamak SART.
    """
    # Train uzerinde fit, ikisini de transform
    scaler = fit_scaler(X_train)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # DataFrame olarak doner (sutun adlari korunur)
    # Bu, SHAP / Permutation Importance gibi yorumlama araclari icin sart
    if return_dataframe and isinstance(X_train, pd.DataFrame):
        X_train_scaled = pd.DataFrame(X_train_scaled, columns=X_train.columns, index=X_train.index)
        X_test_scaled = pd.DataFrame(X_test_scaled, columns=X_test.columns, index=X_test.index)

    return X_train_scaled, X_test_scaled, scaler


# ============================================================
# 2. AYKIRI DEGER TESPITI (OUTLIER DETECTION)
# ============================================================

def detect_outliers_zscore(X, threshold=3.0):
    """
    Z-Score yontemi ile aykiri degerleri tespit eder.

    NASIL CALISIR?
    --------------
    Bir degerin mean'den kac std uzakta oldugunu hesaplar.
    |z| > 3 ise o gozlem "aykiri" sayilir (normal dagilim varsayimi).

    NEDEN 3?
    --------
    Normal dagilimda gozlemlerin %99.7'si mean +/- 3*std araliginda olur.
    Disinda kalanlar nadir olaylar veya gercek aykirilik.

    PARAMETRELER:
    -------------
    X : pd.DataFrame
    threshold : float -> z-score esigi (default 3.0)

    DONUS:
    ------
    outlier_mask : np.ndarray (bool) -> True olan satirlar aykiri
    """
    # Sadece sayisal sutunlari al
    numeric_X = X.select_dtypes(include=[np.number])

    # Her satirin her sutununa z-score uygula
    z_scores = np.abs(stats.zscore(numeric_X, nan_policy='omit'))

    # Herhangi bir sutununda |z| > threshold olan satir = aykiri
    outlier_mask = (z_scores > threshold).any(axis=1)

    return outlier_mask


def detect_outliers_iqr(X, k=1.5):
    """
    IQR (Interquartile Range) yontemi ile aykiri degerleri tespit eder.

    NASIL CALISIR?
    --------------
    Q1 (25. yuzdelik) ve Q3 (75. yuzdelik) hesaplanir.
    IQR = Q3 - Q1
    Alt sinir: Q1 - 1.5*IQR
    Ust sinir: Q3 + 1.5*IQR
    Bu sinirlarin disindaki degerler aykiri.

    Z-SCORE'A GORE AVANTAJI:
    ------------------------
    Normal dagilim varsayimi yapmaz. Carpik dagilimlarda daha guvenilir.

    PARAMETRELER:
    -------------
    X : pd.DataFrame
    k : float -> IQR carpani (default 1.5, daha gevsek icin 3.0 kullanilabilir)
    """
    numeric_X = X.select_dtypes(include=[np.number])
    Q1 = numeric_X.quantile(0.25)
    Q3 = numeric_X.quantile(0.75)
    IQR = Q3 - Q1

    # Alt ve ust sinirlar
    lower_bound = Q1 - k * IQR
    upper_bound = Q3 + k * IQR

    # Sinirlarin disinda mi?
    outlier_mask = ((numeric_X < lower_bound) | (numeric_X > upper_bound)).any(axis=1)

    return outlier_mask.values


def outlier_summary(X, y=None):
    """
    Z-score ve IQR yontemlerini birlikte uygulayip ozet rapor verir.

    NEDEN HER IKISI?
    ----------------
    Iki yontem farkli sonuc verebilir. Carpisma noktalarini gormek faydali:
    - Sadece Z-score'da aykiri: muhtemelen normal dagilimsa gercek aykiri
    - Sadece IQR'de aykiri: dagilim carpik olabilir
    - Her ikisinde de aykiri: cok yuksek olasilikla gercek aykiri

    DONUS:
    ------
    dict -> Tum aykiri istatistikleri
    """
    z_mask = detect_outliers_zscore(X)
    iqr_mask = detect_outliers_iqr(X)

    # Mantiksal AND / OR
    both = z_mask & iqr_mask
    either = z_mask | iqr_mask

    return {
        'zscore_count': int(z_mask.sum()),
        'iqr_count': int(iqr_mask.sum()),
        'both_count': int(both.sum()),
        'either_count': int(either.sum()),
        'zscore_pct': round(z_mask.mean() * 100, 2),
        'iqr_pct': round(iqr_mask.mean() * 100, 2),
    }


# ============================================================
# 3. OZELLIK SECIMI (FEATURE SELECTION)
# ============================================================

def select_features_kbest(X, y, k=10):
    """
    Chi-Square (Chi2) testi ile en iyi K ozelligi secer.

    NE ZAMAN KULLANILIR?
    --------------------
    - Hedef KATEGORIK (bizdeki gibi binary 0/1)
    - Ozellikler POZITIF olmali (chi2 negatif kabul etmez)
    - Hizli ve filter tabanli yontem

    DONUS:
    ------
    selected_features : list -> En iyi K ozelligin adi
    scores : pd.Series -> Tum ozelliklerin chi2 skorlari
    """
    # SelectKBest objesini olustur (chi2 = chi-square test fonksiyonu)
    selector = SelectKBest(score_func=chi2, k=k)
    selector.fit(X, y)

    # Secilen ozelliklerin adlarini al
    feature_names = X.columns if hasattr(X, 'columns') else [f'f{i}' for i in range(X.shape[1])]
    selected_mask = selector.get_support()
    selected_features = [name for name, sel in zip(feature_names, selected_mask) if sel]

    # Skorlari pd.Series olarak doner (siralama icin)
    scores = pd.Series(selector.scores_, index=feature_names).sort_values(ascending=False)

    return selected_features, scores


def select_features_rfe(X, y, n_features=10, base_estimator=None):
    """
    Recursive Feature Elimination (RFE) ile ozellik secimi.

    NASIL CALISIR?
    --------------
    1. Tum ozelliklerle bir model egit
    2. En zayif ozelligi ele (coefficient/importance bazinda)
    3. Kalan ozelliklerle yeniden egit
    4. n_features sayisina dusene kadar tekrarla

    AVANTAJI:
    ---------
    Modelin "neyi onemli buldugunu" bizzat modele soruyor.
    Filter tabanli yontemlerden (chi2 gibi) daha akilli ama daha yavas.

    PARAMETRELER:
    -------------
    base_estimator : sklearn modeli (None ise LogisticRegression kullanilir)
    """
    # Default model: LogisticRegression (hizli ve yorumlanabilir)
    if base_estimator is None:
        base_estimator = LogisticRegression(max_iter=1000, random_state=42)

    rfe = RFE(estimator=base_estimator, n_features_to_select=n_features)
    rfe.fit(X, y)

    # Secilen ozellikler
    feature_names = X.columns if hasattr(X, 'columns') else [f'f{i}' for i in range(X.shape[1])]
    selected_features = [name for name, sel in zip(feature_names, rfe.support_) if sel]

    # Ranking (1 = secildi, yuksek = elendi)
    rankings = pd.Series(rfe.ranking_, index=feature_names).sort_values()

    return selected_features, rankings


def apply_pca(X, n_components=10):
    """
    PCA (Principal Component Analysis) ile boyut indirgeme.

    NEDEN PCA?
    ----------
    - Yuksek boyutlu veriyi daha az bilesenle ifade etmek
    - Korelasyonlu feature'lari birlestirip gurultuyu azaltmak
    - Modeli hizlandirmak

    DEZAVANTAJ:
    -----------
    PCA bilesenleri "yorumlanabilir" degil. "BMI" ozelligi yerine
    "PC1" gibi soyut bir eksen elde edersin. Tibbi modellerde dikkatli ol.

    DONUS:
    ------
    X_pca : np.ndarray -> Donusum sonrasi veri
    pca : PCA objesi    -> Sonradan transform veya ters cevirme icin
    """
    pca = PCA(n_components=n_components, random_state=42)
    X_pca = pca.fit_transform(X)

    return X_pca, pca


def compare_feature_selection_methods(X, y, n_features=10):
    """
    3 yontem (SelectKBest, RFE, PCA) sonuclarini yan yana karsilastirir.

    NEDEN UC YONTEMI BIRDEN?
    ------------------------
    Her yontem farkli ozellikler secebilir. Ortak secilenler "kesin onemli"
    sayilir. Sadece bir yontemin sectikleri ise o yonteme ozel olabilir.
    Bu yuzden uc yontemi karsilastirip "kesisim" almak en saglam yaklasim.

    DONUS:
    ------
    dict -> {'kbest': [...], 'rfe': [...], 'intersection': [...]}
    """
    # 1. SelectKBest
    kbest_features, _ = select_features_kbest(X, y, k=n_features)
    # 2. RFE
    rfe_features, _ = select_features_rfe(X, y, n_features=n_features)
    # 3. PCA (PCA feature secmiyor, donusum yapiyor — sadece bilgi amacli)

    # Iki yontemin de sectikleri (kesisim = en guvenilir feature'lar)
    intersection = list(set(kbest_features) & set(rfe_features))

    return {
        'kbest': kbest_features,
        'rfe': rfe_features,
        'intersection': sorted(intersection),
        'intersection_count': len(intersection),
    }
