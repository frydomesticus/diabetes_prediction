"""
evaluator.py
============
Model degerlendirme: Confusion Matrix, ROC Curve, Classification Report,
metrik tablolari ve threshold optimization.

NEDEN BU MODUL VAR?
-------------------
Study-2 ve Study-3'te ayni grafikleri (CM, ROC, F1 bar chart) tekrar tekrar
ciziyorduk. Burada hepsini fonksiyon hale getirip:
- Tek satirla cizdirilebilir
- Stil/renk degisikligi tek yerde yapilir
- Grafikler standart bir format'a sahip olur (akademik tutarlilik)
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, classification_report, roc_curve, precision_recall_curve,
)


# Tum projede tutarli renk paleti
COLORS = {
    'lr': '#3498db',     # mavi
    'dt': '#2ecc71',     # yesil
    'rf': '#e74c3c',     # kirmizi
    'baseline': '#95a5a6',  # gri (diagonal cizgi vs.)
}


# ============================================================
# 1. CONFUSION MATRIX
# ============================================================

def plot_confusion_matrix(y_true, y_pred, model_name='Model', ax=None,
                            normalize=False, cmap='Blues'):
    """
    Tek bir modelin confusion matrix'ini cizer.

    NEDEN ANNOTATION'LI?
    --------------------
    Numerik degerlerin yaninda TN, FP, FN, TP etiketleri de gorulsun ki
    okuyan kisi "hangi koselerin ne anlama geldigini" anlasin. Tibbi
    yorumda FN (kacirilan diyabetli) en kritik hucredir.

    PARAMETRELER:
    -------------
    normalize : bool -> True ise yuzde olarak gosterir
    """
    cm = confusion_matrix(y_true, y_pred)

    # Normalize: her satiri (gercek sinifi) yuzde olarak goster
    if normalize:
        cm_display = cm.astype('float') / cm.sum(axis=1, keepdims=True) * 100
        fmt = '.1f'
    else:
        cm_display = cm
        fmt = 'd'

    # Eksenleri olustur (eger verilmediyse)
    if ax is None:
        fig, ax = plt.subplots(figsize=(6, 5))

    # Heatmap olarak ciz
    sns.heatmap(
        cm_display, annot=True, fmt=fmt, cmap=cmap, cbar=False,
        xticklabels=['Saglikli (0)', 'Diyabetli (1)'],
        yticklabels=['Saglikli (0)', 'Diyabetli (1)'],
        ax=ax, annot_kws={'size': 14, 'weight': 'bold'},
    )
    ax.set_xlabel('Tahmin', fontsize=11)
    ax.set_ylabel('Gercek', fontsize=11)
    ax.set_title(f'{model_name}\nConfusion Matrix', fontweight='bold')

    return ax


def plot_confusion_matrices_grid(results, y_test, ncols=3, figsize=None):
    """
    Birden cok modelin CM'lerini tek bir figure'da yan yana cizer.

    NEDEN GRID?
    -----------
    3-6 modeli karsilastirmak icin tek tek bakmaktansa hepsini yan yana
    gormek "hangi model false negative'i azaltmis" yorumunu kolaylastirir.
    """
    n = len(results)
    nrows = (n + ncols - 1) // ncols  # tavana yuvarlama
    figsize = figsize or (6 * ncols, 5 * nrows)

    fig, axes = plt.subplots(nrows, ncols, figsize=figsize)
    axes = np.array(axes).flatten()

    for i, (name, res) in enumerate(results.items()):
        plot_confusion_matrix(y_test, res['y_pred'], model_name=name, ax=axes[i])

    # Bos axes'leri gizle
    for j in range(i + 1, len(axes)):
        axes[j].axis('off')

    plt.tight_layout()
    return fig


# ============================================================
# 2. ROC CURVE
# ============================================================

def plot_roc_curves(results, y_test, ax=None, title='ROC Curves'):
    """
    Birden cok modelin ROC egrilerini tek grafikte ciz.

    ROC NEDIR?
    ----------
    True Positive Rate (recall) ile False Positive Rate arasindaki iliski.
    Diagonal cizgi (y=x) random guess'i temsil eder.
    Egri ne kadar sol-ust koseye yakin = model o kadar iyi.

    AUC NEDIR?
    ----------
    Area Under Curve. 0.5 = random, 1.0 = perfect.
    Imbalanced data'da accuracy'den daha guvenilir bir genel ozet.
    """
    if ax is None:
        fig, ax = plt.subplots(figsize=(8, 6))

    # Diagonal random-guess cizgisi
    ax.plot([0, 1], [0, 1], 'k--', alpha=0.4, label='Random (AUC=0.500)')

    # Her model icin ROC + AUC
    palette = list(COLORS.values())
    for i, (name, res) in enumerate(results.items()):
        if res.get('y_prob') is None:
            continue  # predict_proba yoksa atla

        fpr, tpr, _ = roc_curve(y_test, res['y_prob'])
        auc = roc_auc_score(y_test, res['y_prob'])
        ax.plot(fpr, tpr, lw=2, color=palette[i % len(palette)],
                label=f"{name} (AUC={auc:.4f})")

    ax.set_xlabel('False Positive Rate', fontsize=11)
    ax.set_ylabel('True Positive Rate (Recall)', fontsize=11)
    ax.set_title(title, fontweight='bold')
    ax.legend(loc='lower right')
    ax.grid(alpha=0.3)

    return ax


# ============================================================
# 3. METRIK TABLOSU
# ============================================================

def compute_all_metrics(y_true, y_pred, y_prob=None):
    """
    Tum standart metrikleri tek bir dict olarak hesaplar.

    NEDEN HEPSINI BIRDEN?
    ---------------------
    Notebook'larda her seferinde 5-6 farkli metric fonksiyonu cagiriyoruz.
    Bunlari tek bir fonksiyona toplamak tekrari onler.
    """
    metrics = {
        'accuracy': accuracy_score(y_true, y_pred),
        'precision': precision_score(y_true, y_pred, zero_division=0),
        'recall': recall_score(y_true, y_pred, zero_division=0),
        'f1': f1_score(y_true, y_pred, zero_division=0),
    }
    # AUC sadece probability varsa hesaplanabilir
    if y_prob is not None:
        metrics['auc'] = roc_auc_score(y_true, y_prob)
    return metrics


def build_metrics_table(results, y_test):
    """
    Tum modellerin metriklerini tek bir DataFrame olarak doner.

    NEDEN DATAFRAME?
    ----------------
    - .to_excel() ile rapora kaydedilebilir
    - .style.background_gradient() ile renkli tablolar yapilabilir
    - Pandas siralamasiyla "en iyi model" hizlica bulunur

    KULLANIM:
    ---------
    df = build_metrics_table(results, y_test)
    df.sort_values('f1', ascending=False)
    df.to_excel('../outputs/tables/model_metrics.xlsx')
    """
    rows = []
    for name, res in results.items():
        metrics = compute_all_metrics(y_test, res['y_pred'], res.get('y_prob'))
        metrics['model'] = name
        rows.append(metrics)

    # 'model' sutununu basa al
    df = pd.DataFrame(rows)
    cols = ['model'] + [c for c in df.columns if c != 'model']
    return df[cols]


# ============================================================
# 4. CLASSIFICATION REPORT (Yazdirma)
# ============================================================

def print_classification_reports(results, y_test):
    """
    Tum modeller icin sklearn classification_report'u yazdirir.

    NE YAZAR?
    ---------
    Her sinif (0 ve 1) icin: precision, recall, f1, support.
    Ayrica macro/weighted avg'ler.
    """
    for name, res in results.items():
        print("=" * 60)
        print(f"{name} - Classification Report")
        print("=" * 60)
        print(classification_report(y_test, res['y_pred'],
                                       target_names=['Saglikli', 'Diyabetli']))


# ============================================================
# 5. THRESHOLD OPTIMIZATION
# ============================================================

def find_optimal_threshold(y_true, y_prob, method='youden'):
    """
    Optimal karar esigini bul.

    YONTEM SECENEKLERI:
    -------------------
    - 'youden': TPR - FPR maksimum (sensitivity-specificity dengesi)
    - 'f1': F1-score maksimum (precision-recall dengesi)

    NEDEN OPTIMUM 0.5 DEGIL?
    ------------------------
    Dengeli veri icin sklearn default 0.5 iyi ama imbalanced (%14)
    durumda 0.3-0.4 araliginda optimal threshold cikar — recall'i ciddi
    arttirir.
    """
    if method == 'youden':
        # ROC uzerinde Youden's J = TPR - FPR maksimum
        fpr, tpr, thresholds = roc_curve(y_true, y_prob)
        j_scores = tpr - fpr
        best_idx = np.argmax(j_scores)
        return float(thresholds[best_idx])

    elif method == 'f1':
        # Precision-Recall egrisinde F1 maksimum
        prec, rec, thresholds = precision_recall_curve(y_true, y_prob)
        # Son eleman threshold'suz oldugu icin [:-1]
        f1_scores = 2 * (prec * rec) / (prec + rec + 1e-10)
        best_idx = np.argmax(f1_scores[:-1])
        return float(thresholds[best_idx])

    else:
        raise ValueError(f"Bilinmeyen method: {method} (kullan: 'youden' veya 'f1')")


def apply_threshold(y_prob, threshold):
    """
    Verilen threshold ile predict_proba sonuclarini binary'e cevirir.

    KULLANIM:
    ---------
    optimal_thr = find_optimal_threshold(y_test, y_prob, method='youden')
    y_pred_new = apply_threshold(y_prob, optimal_thr)
    """
    return (y_prob >= threshold).astype(int)


# ============================================================
# 6. METRIK KARSILASTIRMA BAR CHART
# ============================================================

def plot_metrics_comparison(results_dict_by_strategy, y_test, metric='recall',
                              figsize=(10, 5), title=None):
    """
    Birden cok strateji (default vs balanced vs SMOTE gibi) ve modeli
    bar chart olarak karsilastirir.

    PARAMETRELER:
    -------------
    results_dict_by_strategy : dict
        {
            'Default': {model_name: result_dict, ...},
            'Balanced': {model_name: result_dict, ...},
            'SMOTE': {model_name: result_dict, ...},
        }
    metric : str -> 'recall', 'precision', 'f1', 'accuracy', 'auc'

    NEDEN STRATEJI x MODEL?
    -----------------------
    "Sadece accuracy yetmez" vurgusunu yapacaksin -> recall'i goster
    Strateji bazli karsilastirma "class_weight cozumu gercekten ise yariyor mu?"
    sorusuna gorsel cevap verir.
    """
    fig, ax = plt.subplots(figsize=figsize)

    strategies = list(results_dict_by_strategy.keys())
    model_names = list(next(iter(results_dict_by_strategy.values())).keys())
    n_strats = len(strategies)
    n_models = len(model_names)

    x = np.arange(n_models)
    width = 0.8 / n_strats

    # Her strateji icin bir bar grubu
    for i, strat in enumerate(strategies):
        scores = []
        for mname in model_names:
            res = results_dict_by_strategy[strat][mname]
            if metric == 'recall':
                # Recall'i anlik hesapla (dict'te yoksa)
                score = recall_score(y_test, res['y_pred'])
            elif metric == 'precision':
                score = precision_score(y_test, res['y_pred'])
            else:
                score = res.get(metric, 0)
            scores.append(score)

        ax.bar(x + i * width, scores, width, label=strat)

    ax.set_xticks(x + width * (n_strats - 1) / 2)
    ax.set_xticklabels(model_names)
    ax.set_ylabel(metric.capitalize())
    ax.set_title(title or f'{metric.capitalize()} Karsilastirmasi', fontweight='bold')
    ax.legend()
    ax.grid(axis='y', alpha=0.3)
    ax.set_ylim(0, 1)

    return fig
