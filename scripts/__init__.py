# ============================================================
# scripts/ paketi
# ============================================================
# Bu klasor "Diabetes Prediction" projesinin tum yeniden kullanilabilir
# Python modullerini barindirir. Notebook'larda (Study-1, Study-2, Study-3)
# tekrar tekrar yazilan veri yukleme, on isleme, model egitimi, degerlendirme
# kodlari buraya soyutlanmistir.
#
# NEDEN BOYLE BIR YAPI?
# - Tek bir notebook'ta yuzlerce satir kodu bir araya getirmek yerine,
#   her sorumlulugu kendi modulune ayirdik (Single Responsibility Principle).
# - Notebook'lar artik 5-10 satirla ayni isi yapabiliyor.
# - Kod tekrari (DRY - Don't Repeat Yourself) onlendi.
# - Test edilebilir ve bakimi kolay bir mimari saglandi.
#
# MODUL HARITASI:
#   data_loader.py    -> CSV yukleme + train-test split
#   preprocessing.py  -> Scaler, outlier detection, feature selection
#   model_trainer.py  -> Model egitimi + hyperparameter tuning
#   evaluator.py      -> Confusion matrix, ROC, classification report
# ============================================================

from . import data_loader
from . import preprocessing
from . import model_trainer
from . import evaluator

__all__ = ['data_loader', 'preprocessing', 'model_trainer', 'evaluator']
__version__ = '1.0.0'
__author__ = 'Ibrahim Hakki Keles'
