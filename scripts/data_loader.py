"""
data_loader.py
==============
CSV veri setini yukleme, train-test split olusturma ve sinif dagilim
analizini yapmaya yarayan yardimci fonksiyonlar.

NEDEN BU MODUL VAR?
-------------------
Her notebook'ta (Study-1, Study-2, Study-3) ayni CSV'yi okuyup ayni
train-test split'i yaratiyorduk. Bu kod tekraridir (DRY ihlali).
Burada tek bir guvenli "kaynak" tanimlayarak tum studyler ayni veriyi
ayni sekilde yukluyor — boylece sonuclar tekrarlanabilir oluyor.

REPRODUCIBILITY (TEKRARLANABILIRLIK):
-------------------------------------
random_state=42 tum projede sabit. Bu sayede bir baskasi (veya bizim
ileride) ayni kodu calistirinca AYNI train-test split'i, AYNI sonuclari
elde eder. Akademik calismada bu zorunludur.
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# ---------------------------------------------------------------
# SABITLER
# ---------------------------------------------------------------
# Tum proje boyunca ayni random seed'i kullaniyoruz.
# Bu sabiti tek bir yerde tanimlamak, ileride degistirmek gerekirse
# (mesela random_state=0 yapmak) sadece BURAYI degistirmek yeterli olur.
RANDOM_STATE = 42

# Varsayilan CSV yolu (proje koklu calistirildiginda)
DEFAULT_CSV_PATH = '../data/raw/cdc_diabetes_health_indicators.csv'

# Hedef degisken (label) sutununun adi
TARGET_COLUMN = 'Diabetes_binary'


def load_diabetes_data(csv_path=DEFAULT_CSV_PATH, verbose=True):
    """
    CDC BRFSS 2015 diyabet veri setini CSV'den yukler.

    PARAMETRELER:
    -------------
    csv_path : str
        CSV dosyasinin yolu. Default: '../data/raw/cdc_diabetes_health_indicators.csv'
        (notebook'lardan calistirildiginda dogru olur).
    verbose : bool
        True ise veri seti hakkinda ozet bilgi yazdirir.

    DONUS:
    ------
    df : pd.DataFrame
        Tum veri setini iceren DataFrame (253,680 x 22).

    HATA YONETIMI:
    --------------
    Dosya bulunamazsa anlasilir bir mesajla FileNotFoundError firlatir.
    """
    # Dosya gercekten var mi? Yoksa kullaniciya net bir hata mesaji ver.
    if not os.path.exists(csv_path):
        raise FileNotFoundError(
            f"CSV dosyasi bulunamadi: {csv_path}\n"
            f"Lutfen 'data/raw/cdc_diabetes_health_indicators.csv' yolunu kontrol edin."
        )

    # CSV'yi pandas ile oku
    df = pd.read_csv(csv_path)

    # Ozet bilgi yazdir (debug ve gozlem icin)
    if verbose:
        print(f"[data_loader] Veri yuklendi: {df.shape[0]:,} satir x {df.shape[1]} sutun")
        print(f"[data_loader] Sutunlar: {list(df.columns)[:5]}... (+{len(df.columns)-5} adet)")

    return df


def split_features_target(df, target_col=TARGET_COLUMN):
    """
    DataFrame'i ozellikler (X) ve hedef (y) olarak ayirir.

    NEDEN AYRI BIR FONKSIYON?
    -------------------------
    Bu islem tek satirla yapilabilir ama:
    - target_col adini sabit tutar (typo onler)
    - Birden fazla yerde kullanildiginda tek noktadan bakim saglanir
    - Hedef sutununu yanlislikla X'e koyma riskini ortadan kaldirir

    PARAMETRELER:
    -------------
    df : pd.DataFrame
        Tum veri seti.
    target_col : str
        Hedef sutun adi. Default: 'Diabetes_binary'

    DONUS:
    ------
    X : pd.DataFrame -> 21 ozellik sutunu
    y : pd.Series    -> Hedef sutun (0/1)
    """
    # Hedef sutun gercekten var mi kontrol et
    if target_col not in df.columns:
        raise KeyError(f"Hedef sutun '{target_col}' DataFrame'de yok!")

    # X = tum sutunlar EKSI hedef sutun
    X = df.drop(columns=[target_col])
    # y = sadece hedef sutun
    y = df[target_col]

    return X, y


def create_train_test_split(X, y, test_size=0.2, stratify=True, verbose=True):
    """
    Stratified train-test split olusturur.

    NEDEN STRATIFIED?
    -----------------
    Veri setimiz dengesiz (~%86 saglikli, ~%14 diyabetli).
    Eger normal random split yaparsak, sansa bagli olarak test setinde
    diyabetli oran %10'a dusebilir veya %18'e cikabilir.
    stratify=y ile train ve test setlerinde sinif orani AYNI kalir.

    PARAMETRELER:
    -------------
    X : pd.DataFrame -> Ozellikler
    y : pd.Series    -> Hedef
    test_size : float -> Test setinin orani (default 0.2 = %20)
    stratify : bool -> True ise stratified split yapar
    verbose : bool -> True ise sinif dagilimini yazdirir

    DONUS:
    ------
    X_train, X_test, y_train, y_test : standart sklearn formati
    """
    # stratify parametresi: True ise y'yi referans al, False ise None
    stratify_param = y if stratify else None

    # Sklearn'in train_test_split fonksiyonu ile ayir
    # random_state sabit oldugu icin her cagirmada AYNI split olusur
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=RANDOM_STATE,
        stratify=stratify_param
    )

    # Verbose modda dagilim bilgisi yazdir (validasyon icin onemli)
    if verbose:
        print(f"[data_loader] Train: {X_train.shape[0]:,} satir | Test: {X_test.shape[0]:,} satir")
        print(f"[data_loader] Train sinif dagilimi: "
              f"{(y_train == 0).sum():,} saglikli | {(y_train == 1).sum():,} diyabetli "
              f"({(y_train == 1).mean()*100:.2f}%)")
        print(f"[data_loader] Test sinif dagilimi:  "
              f"{(y_test == 0).sum():,} saglikli | {(y_test == 1).sum():,} diyabetli "
              f"({(y_test == 1).mean()*100:.2f}%)")

    return X_train, X_test, y_train, y_test


def get_class_distribution(y):
    """
    Sinif dagilimini hesaplar ve bir dictionary olarak doner.

    NE ICIN KULLANILIR?
    -------------------
    - Imbalance oranini hesaplamak icin (mesela 6.2:1)
    - Class weight stratejisine karar vermeden once dengesizligi olcmek icin
    - Grafiklerde pie/bar chart cizmek icin

    DONUS:
    ------
    dict: {'healthy': int, 'diabetic': int, 'imbalance_ratio': float, 'diabetic_pct': float}
    """
    healthy = int((y == 0).sum())
    diabetic = int((y == 1).sum())

    # Dengesizlik orani: cogunluk / azinlik (bizde ~6.2)
    # ZeroDivisionError korumasi
    imbalance_ratio = healthy / diabetic if diabetic > 0 else float('inf')

    # Yuzde olarak diyabetli orani
    diabetic_pct = diabetic / (healthy + diabetic) * 100

    return {
        'healthy': healthy,
        'diabetic': diabetic,
        'imbalance_ratio': round(imbalance_ratio, 2),
        'diabetic_pct': round(diabetic_pct, 2),
    }


def load_and_split(csv_path=DEFAULT_CSV_PATH, test_size=0.2, verbose=True):
    """
    KISAYOL FONKSIYON: Tum yukleme + split islemini tek cagiriyla yapar.

    NEDEN BU FONKSIYON?
    -------------------
    Notebook'larda 3 ayri fonksiyonu (load -> split_features -> split_train_test)
    cagirmak yerine, tek satirda hepsini halletmek icin.

    KULLANIM:
    ---------
    from scripts.data_loader import load_and_split
    X_train, X_test, y_train, y_test = load_and_split()

    DONUS:
    ------
    (X_train, X_test, y_train, y_test) tuple
    """
    df = load_diabetes_data(csv_path, verbose=verbose)
    X, y = split_features_target(df)
    return create_train_test_split(X, y, test_size=test_size, verbose=verbose)


# ============================================================
# Bu modul direkt calistirildiginda (python data_loader.py) test et
# ============================================================
if __name__ == '__main__':
    # Hizli sanity check: modul tek basina calisiyor mu?
    print("=" * 60)
    print("data_loader.py - Hizli Test")
    print("=" * 60)
    X_train, X_test, y_train, y_test = load_and_split(verbose=True)
    print("\n[OK] data_loader modulu calisiyor.")
