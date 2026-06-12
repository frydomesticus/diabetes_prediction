# scripts/ — Yeniden Kullanilabilir Python Modulleri

Bu klasor projenin **katmanli mimarisini** olusturan Python modullerini icerir. Notebook'lar (Study-1, Study-2, Study-3) bu modulleri import ederek calisir — yani **isin mantigi** burada, **sunum/analiz** notebook'larda.

## Neden Bu Yapi?

Hocanin ders notlarinda gectigi gibi:
- **"Katman katman ayiracaz"** → her sorumluluk ayri modulde
- **"Birbirine benzer yapilari bir yere topla"** → tekrar eden kod fonksiyonlara cekildi
- **"En iyi dokumantasyon yazacaksin, neden sectik raporda yazacaz"** → her fonksiyonun docstring'inde **NEDEN** acikladigi var
- **"Bizden sonra cocuklar anlasin"** → Turkce yorum + bol aciklama

## Modul Haritasi

| Dosya | Sorumluluk | Hangi Notebook'ta Kullanilir? |
|-------|------------|-------------------------------|
| `__init__.py` | Paket tanitimi | (import edildiginde otomatik) |
| `data_loader.py` | CSV yukleme + train-test split + sinif dagilimi | Study-1, Study-2, Study-3 |
| `preprocessing.py` | StandardScaler + outlier (Z-score/IQR) + feature selection | Study-1, Study-2 |
| `model_trainer.py` | 3 model + GridSearch + RandomizedSearch + Nested CV | Study-2, Study-3 |
| `evaluator.py` | CM + ROC + classification report + threshold optim. | Study-3 |

## Kullanim Ornekleri

### 1. Veriyi yukle ve split et (tek satirla)

```python
from scripts.data_loader import load_and_split

X_train, X_test, y_train, y_test = load_and_split()
# Cikti:
# [data_loader] Veri yuklendi: 253,680 satir x 22 sutun
# [data_loader] Train: 202,944 satir | Test: 50,736 satir
# [data_loader] Train sinif dagilimi: 174,667 saglikli | 28,277 diyabetli (13.93%)
```

### 2. Olcekleme

```python
from scripts.preprocessing import scale_features

X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
```

### 3. Aykiri deger raporu

```python
from scripts.preprocessing import outlier_summary

summary = outlier_summary(X_train)
print(summary)
# {'zscore_count': 12453, 'iqr_count': 45678, 'both_count': 8921, ...}
```

### 4. Ozellik secimi (3 yontem karsilastirma)

```python
from scripts.preprocessing import compare_feature_selection_methods

result = compare_feature_selection_methods(X_train, y_train, n_features=10)
print(result['intersection'])  # Her uc yontemde de secilen feature'lar
```

### 5. Modelleri egit + degerlendir

```python
from scripts.model_trainer import get_balanced_models, train_and_evaluate

models = get_balanced_models()
results = train_and_evaluate(models, X_train_scaled, X_test_scaled, y_train, y_test)
# Cikti:
# [model_trainer] LR (Balanced): Acc=0.7234 | F1=0.4521 | AUC=0.8141
# [model_trainer] DT (Balanced): Acc=0.6889 | F1=0.3998 | AUC=0.7012
# [model_trainer] RF (Balanced): Acc=0.7345 | F1=0.4632 | AUC=0.8226
```

### 6. Grafikler ve raporlar

```python
from scripts.evaluator import (
    plot_confusion_matrices_grid, plot_roc_curves,
    build_metrics_table, print_classification_reports
)

# Confusion matrix grid
plot_confusion_matrices_grid(results, y_test)
plt.show()

# ROC karsilastirmasi
plot_roc_curves(results, y_test)
plt.show()

# Metric tablosu (Excel'e kaydedilebilir)
df = build_metrics_table(results, y_test)
df.to_excel('../outputs/tables/model_metrics.xlsx', index=False)
```

### 7. Threshold optimization

```python
from scripts.evaluator import find_optimal_threshold, apply_threshold

# Youden's J ile optimal threshold bul
y_prob = results['LR (Balanced)']['y_prob']
optimal_thr = find_optimal_threshold(y_test, y_prob, method='youden')

# Yeni threshold ile tahminleri yeniden uret
y_pred_new = apply_threshold(y_prob, optimal_thr)
```

### 8. Hyperparameter tuning

```python
from scripts.model_trainer import (
    tune_logistic_regression, tune_decision_tree, tune_random_forest
)

# LR icin GridSearchCV
lr_grid = tune_logistic_regression(X_train_scaled, y_train, cv=5)
print(f"En iyi parametreler: {lr_grid.best_params_}")
print(f"En iyi F1 skoru:     {lr_grid.best_score_:.4f}")

# RF icin RandomizedSearchCV (daha hizli)
rf_search = tune_random_forest(X_train_scaled, y_train, n_iter=20)
```

## Tasarim Prensipleri

1. **DRY (Don't Repeat Yourself):** Notebook'larda tekrarlanan tum kod buraya cekildi.
2. **Single Responsibility:** Her modul TEK bir sorumluluk tasir (data, prep, model, eval).
3. **Tekrarlanabilirlik:** `RANDOM_STATE = 42` her modulde sabit.
4. **Data Leakage Onleme:** Scaler SADECE train uzerinde fit edilir.
5. **Yorumlanabilirlik:** Tum docstring'ler "NE yapar + NEDEN yapilir" formatinda.

## Modulleri Tek Basina Test Etme

`data_loader.py` direkt calistirilabilir:

```bash
cd scripts
python data_loader.py
```

Cikti:
```
============================================================
data_loader.py - Hizli Test
============================================================
[data_loader] Veri yuklendi: 253,680 satir x 22 sutun
[data_loader] Train: 202,944 satir | Test: 50,736 satir
...
[OK] data_loader modulu calisiyor.
```

## Notebook'lardan Import

Notebook'lar `notebooks/` klasorunde, scripts ise bir ust seviyede. Bu yuzden notebook'un ilk hucresinde:

```python
import sys
sys.path.append('..')   # Bir ust dizini path'e ekle
from scripts.data_loader import load_and_split
from scripts.preprocessing import scale_features
from scripts.model_trainer import get_balanced_models, train_and_evaluate
from scripts.evaluator import plot_roc_curves, build_metrics_table
```

## Gelecek Iyilestirmeler (Opsiyonel)

- `config.py`: Tum sabitleri (RANDOM_STATE, paths, hyperparameters) tek yere topla
- `utils.py`: Logger, timer, file I/O yardimcilari
- `tests/`: pytest ile unit testler
- `pipeline.py`: Tum adimlari tek bir Pipeline objesinde toplama

---

**Yazan:** Ibrahim Hakki Keles
**Tarih:** Mayis 2026
**Ders:** IE410 Advanced Computer Programming
