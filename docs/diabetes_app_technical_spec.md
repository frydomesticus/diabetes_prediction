# Google AI Studio - Diyabet Tahmin Web Uygulaması Master Kılavuzu

Bu döküman, Google AI Studio'da doğrudan kullanılmak üzere tasarlanmıştır. İçerisinde uygulamanın tüm veri yapısı, matematiksel formülleri, API tasarımı ve **hiçbir satırı veya kodu atlanmamış (placeholder içermeyen)** tam kaynak kodları bulunmaktadır.

Google AI Studio'ya bu dökümanı yükleyip:

> _"Aşağıdaki teknik şartnameyi ve kodları temel alarak bu web uygulamasını incele, benden gelecek talimatlara göre doğrudan kod güncellemesi yap veya yeni özellikler ekle."_

demeniz yeterlidir. AI Studio doğrudan aksiyona geçebilecektir.

---

## 1. PROJE MİMARİSİ VE DOSYA YAPISI

Uygulamanın proje dizinindeki yerleşimi şu şekildedir:

```
Diabetes Prediction Week1/
├── outputs/
│   └── models/
│       └── best_diabetes_model.pkl    ← Eğitilmiş Model + Scaler Nesnesi
├── web/
│   ├── app.py                         ← FastAPI API Sunucusu
│   └── static/
│       ├── index.html                 ← Arayüz (HTML)
│       ├── style.css                  ← Tasarım Sistemi (CSS)
│       └── app.js                     ← İstemci Mantığı (JS)
```

---

## 2. VERİ MODELİ VE MATEMATİKSEL ALTYAPI

### A. Girdi Parametreleri ve Veri Tipleri (21 Adet Özellik)

Model tahmini için FastAPI backendine gönderilen JSON nesnesi aşağıdaki alanları tam olarak bu isimlerle ve tiplerle içerir:

1. `HighBP` (int, 0 veya 1): Yüksek tansiyon teşhisi var mı? (0: Hayır, 1: Evet)
2. `HighChol` (int, 0 veya 1): Yüksek kolesterol teşhisi var mı? (0: Hayır, 1: Evet)
3. `CholCheck` (int, 0 veya 1): Son 5 yılda kolesterol ölçümü yapıldı mı? (0: Hayır, 1: Evet)
4. `BMI` (float, 10.0 - 100.0): Vücut Kitle İndeksi.
5. `Smoker` (int, 0 veya 1): Hayatı boyunca en az 100 adet sigara içti mi? (0: Hayır, 1: Evet)
6. `Stroke` (int, 0 veya 1): Daha önce felç geçirdi mi? (0: Hayır, 1: Evet)
7. `HeartDiseaseorAttack` (int, 0 veya 1): Koroner kalp hastalığı veya kalp krizi geçmişi var mı? (0: Hayır, 1: Evet)
8. `PhysActivity` (int, 0 veya 1): Son 30 günde egzersiz veya fiziksel aktivite yaptı mı? (0: Hayır, 1: Evet)
9. `Fruits` (int, 0 veya 1): Günde en az bir kez meyve tüketiyor mu? (0: Hayır, 1: Evet)
10. `Veggies` (int, 0 veya 1): Günde en az bir kez sebze tüketiyor mu? (0: Hayır, 1: Evet)
11. `HvyAlcoholConsump` (int, 0 veya 1): Aşırı alkol tüketimi var mı? (0: Hayır, 1: Evet)
12. `AnyHealthcare` (int, 0 veya 1): Herhangi bir sağlık güvencesi var mı? (0: Hayır, 1: Evet)
13. `NoDocbcCost` (int, 0 veya 1): Maddi yetersizlikten dolayı doktora gidemediği oldu mu? (0: Hayır, 1: Evet)
14. `GenHlth` (int, 1 - 5): Genel sağlık puanı (1: Mükemmel, 2: Çok İyi, 3: İyi, 4: Orta, 5: Kötü)
15. `MentHlth` (int, 0 - 30): Son 30 günde ruh sağlığının kötü olduğu gün sayısı.
16. `PhysHlth` (int, 0 - 30): Son 30 günde fiziksel hastalık/yaralanma yaşanan gün sayısı.
17. `DiffWalk` (int, 0 veya 1): Yürümede veya merdiven çıkmada ciddi zorluk var mı? (0: Hayır, 1: Evet)
18. `Sex` (int, 0 veya 1): Biyolojik Cinsiyet (0: Kadın, 1: Erkek)
19. `Age` (int, 1 - 13): Yaş kategorisi (1: 18-24, 2: 25-29, 3: 30-34, 4: 35-39, 5: 40-44, 6: 45-49, 7: 50-54, 8: 55-59, 9: 60-64, 10: 65-69, 11: 70-74, 12: 75-79, 13: 80+)
20. `Education` (int, 1 - 6): Eğitim seviyesi (1: Okuma yazma yok - 6: Üniversite mezunu)
21. `Income` (int, 1 - 8): Yıllık hane halkı geliri (1: <10.000$, ..., 8: >=75.000$)

### B. Preprocessing (Ölçeklendirme)

Girdiler modele sokulmadan önce `best_diabetes_model.pkl` dosyasından yüklenen `StandardScaler` nesnesi ile dönüştürülmelidir. Scaler fit edilirken sütun isimlerini referans aldığı için girdi verisi bir Pandas DataFrame'i biçiminde ve yukarıdaki sıralı sütun isimleriyle `scaler.transform(df)` fonksiyonuna sokulmalıdır.

### C. Özellik Katkısı (Feature Contribution) Analizi

Bireysel risk faktörlerini açıklamak için Logistic Regression katsayıları kullanılır.

$$
\text{Katkı}_i = \beta_i \cdot X_{\text{scaled}, i}
$$

- $\beta_i$: Model katsayısı (`model.coef_[0][i]`)
- $X_{\text{scaled}, i}$: StandardScaler sonrası girdinin ölçeklenmiş değeri.
- $\text{Katkı}_i > 0$ ise risk artıran faktördür.
- $\text{Katkı}_i < 0$ ise koruyucu faktördür.

---

## 3. TAM YAZILIM KODLARI (Sıfır Kesinti)

### A. FastAPI Backend (`web/app.py`)

```python
import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# Klasör yollarını çöz
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "outputs", "models", "best_diabetes_model.pkl")

# FastAPI uygulamasını başlat
app = FastAPI(
    title="Diyabet Risk Tahmin API",
    description="CDC BRFSS 2015 veri setiyle eğitilmiş makine öğrenmesi modeli API'si.",
    version="1.0.0"
)

# Modeli ve Scaler'ı yükle
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model dosyası bulunamadı: {MODEL_PATH}")

with open(MODEL_PATH, "rb") as f:
    model_data = pickle.load(f)

ml_model = model_data["model"]
scaler = model_data["scaler"]
features = model_data["features"]

# Türkçe Özellik İsimleri ve Açıklamaları
FEATURE_METADATA = {
    'HighBP': {'label': 'Yüksek Tansiyon', 'desc': 'Kişide yüksek tansiyon teşhisi bulunması.'},
    'HighChol': {'label': 'Yüksek Kolesterol', 'desc': 'Kişide yüksek kolesterol teşhisi bulunması.'},
    'CholCheck': {'label': 'Kolesterol Kontrolü', 'desc': 'Son 5 yıl içinde kolesterol seviyesinin ölçülmüş olması.'},
    'BMI': {'label': 'Vücut Kitle İndeksi (BMI)', 'desc': 'Kilo / Boy² oranı.'},
    'Smoker': {'label': 'Sigara Kullanımı', 'desc': 'Hayatı boyunca en az 100 adet sigara içmiş olmak.'},
    'Stroke': {'label': 'Felç Geçmişi', 'desc': 'Daha önce felç (inme) geçirmiş olmak.'},
    'HeartDiseaseorAttack': {'label': 'Kalp Rahatsızlığı', 'desc': 'Koroner kalp hastalığı veya kalp krizi geçmişi.'},
    'PhysActivity': {'label': 'Fiziksel Aktivite', 'desc': 'Son 30 günde düzenli egzersiz veya fiziksel aktivite yapılmış olması.'},
    'Fruits': {'label': 'Meyve Tüketimi', 'desc': 'Günde 1 veya daha fazla kez meyve tüketmek.'},
    'Veggies': {'label': 'Sebze Tüketimi', 'desc': 'Günde 1 veya daha fazla kez sebze tüketmek.'},
    'HvyAlcoholConsump': {'label': 'Aşırı Alkol Tüketimi', 'desc': 'Haftada erkekler için 14, kadınlar için 8 bardaktan fazla alkol.'},
    'AnyHealthcare': {'label': 'Sağlık Güvencesi', 'desc': 'Özel sigara veya SGK gibi bir sağlık güvencesinin olması.'},
    'NoDocbcCost': {'label': 'Maddi Engeller', 'desc': 'Son 12 ayda maddi yetersizlikten dolayı doktora gidememiş olmak.'},
    'GenHlth': {'label': 'Genel Sağlık Değerlendirmesi', 'desc': 'Kişinin kendi sağlığını nasıl gördüğü (1: Mükemmel - 5: Kötü).'},
    'MentHlth': {'label': 'Ruh Sağlığı Şikayeti', 'desc': 'Son 30 günde ruh sağlığının kötü olduğu gün sayısı (0-30).'},
    'PhysHlth': {'label': 'Fiziksel Sağlık Şikayeti', 'desc': 'Son 30 günde fiziksel hastalık veya yaralanma yaşanan gün sayısı (0-30).'},
    'DiffWalk': {'label': 'Yürüme/Merdiven Zorluğu', 'desc': 'Yürümede veya merdiven çıkmada ciddi zorluk yaşanması.'},
    'Sex': {'label': 'Cinsiyet', 'desc': 'Biyolojik cinsiyet (Kadın / Erkek).'},
    'Age': {'label': 'Yaş Grubu', 'desc': '18 yaşından başlayan 13 farklı yaş kategorisi.'},
    'Education': {'label': 'Eğitim Seviyesi', 'desc': 'Eğitim düzeyi (1: Okuma yazma yok - 6: Üniversite mezunu).'},
    'Income': {'label': 'Gelir Grubu', 'desc': 'Yıllık hane halkı geliri (1: <10bin$, 8: >=75bin$).'}
}

class PredictRequest(BaseModel):
    HighBP: int = Field(..., ge=0, le=1)
    HighChol: int = Field(..., ge=0, le=1)
    CholCheck: int = Field(..., ge=0, le=1)
    BMI: float = Field(..., ge=10, le=100)
    Smoker: int = Field(..., ge=0, le=1)
    Stroke: int = Field(..., ge=0, le=1)
    HeartDiseaseorAttack: int = Field(..., ge=0, le=1)
    PhysActivity: int = Field(..., ge=0, le=1)
    Fruits: int = Field(..., ge=0, le=1)
    Veggies: int = Field(..., ge=0, le=1)
    HvyAlcoholConsump: int = Field(..., ge=0, le=1)
    AnyHealthcare: int = Field(..., ge=0, le=1)
    NoDocbcCost: int = Field(..., ge=0, le=1)
    GenHlth: int = Field(..., ge=1, le=5)
    MentHlth: int = Field(..., ge=0, le=30)
    PhysHlth: int = Field(..., ge=0, le=30)
    DiffWalk: int = Field(..., ge=0, le=1)
    Sex: int = Field(..., ge=0, le=1)
    Age: int = Field(..., ge=1, le=13)
    Education: int = Field(..., ge=1, le=6)
    Income: int = Field(..., ge=1, le=8)

@app.post("/api/predict")
def predict_diabetes(req: PredictRequest):
    try:
        # Girdiyi sözlük yapıp Pandas DataFrame'e çevir
        input_data = req.model_dump()
        input_df = pd.DataFrame([input_data], columns=features)

        # Scaling uygulayalım
        input_scaled = scaler.transform(input_df)

        # Tahmin ve Olasılık hesapla
        prob = float(ml_model.predict_proba(input_scaled)[0][1])
        prediction = int(ml_model.predict(input_scaled)[0])

        # Risk seviyesini sınıflandır
        if prob < 0.35:
            risk_level = "Düşük Risk"
            risk_color = "#10B981"  # Yeşil
        elif prob < 0.60:
            risk_level = "Orta Risk"
            risk_color = "#F59E0B"  # Turuncu
        else:
            risk_level = "Yüksek Risk"
            risk_color = "#EF4444"  # Kırmızı

        # Özellik Katkısı Hesaplama (coefficients * scaled_value)
        coefs = ml_model.coef_[0]
        scaled_row = input_scaled[0]

        contributions = []
        for feat_name, coef, val in zip(features, coefs, scaled_row):
            contrib = float(coef * val)
            meta = FEATURE_METADATA.get(feat_name, {'label': feat_name, 'desc': ''})

            contributions.append({
                "feature": feat_name,
                "label": meta["label"],
                "desc": meta["desc"],
                "value": input_data[feat_name],
                "contribution": contrib,
                "type": "risk" if contrib > 0 else "protective"
            })

        # Katkıları mutlak değer büyüklüklerine göre sıralayalım
        contributions = sorted(contributions, key=lambda x: abs(x["contribution"]), reverse=True)

        return {
            "prediction": prediction,
            "probability": prob,
            "risk_level": risk_level,
            "risk_color": risk_color,
            "contributions": contributions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tahmin yürütülürken hata oluştu: {str(e)}")

@app.get("/api/info")
def get_model_info():
    return {
        "model_name": "Logistic Regression (Balanced)",
        "features_count": len(features),
        "test_metrics": {
            "Accuracy": "86.4%",
            "Recall (Sensitivity)": "76.2%",
            "F1-Score": "0.443",
            "ROC AUC": "0.8226",
            "Class Weight Strategy": "balanced",
            "Dataset Size": "253,680 records (CDC BRFSS 2015)"
        }
    }

# Statik dosyaları bağlama
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
def read_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Diyabet Risk Tahmin API çalışıyor. Lütfen static/index.html dosyasını oluşturun."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
```

### B. Frontend HTML (`web/static/index.html`)

```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Diyabet Risk Analiz Platformu - IE410</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <!-- FontAwesome Icons -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="background-decor">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="logo">
          <i class="fa-solid fa-heart-pulse logo-icon"></i>
          <div class="logo-text">
            <h1>Diyabet Risk Analizi</h1>
            <span>IE410 Advanced Computer Programming</span>
          </div>
        </div>
        <nav class="app-nav">
          <button class="nav-btn active" data-target="predict-tab">
            <i class="fa-solid fa-calculator"></i> Risk Hesaplayıcı
          </button>
          <button class="nav-btn" data-target="dashboard-tab">
            <i class="fa-solid fa-chart-line"></i> Model Dashboard
          </button>
        </nav>
      </header>

      <!-- Main Content Area -->
      <main class="app-main">
        <!-- Predictor Tab -->
        <section id="predict-tab" class="tab-content active">
          <div class="glass-card main-card">
            <!-- Progress Bar -->
            <div class="form-progress">
              <div class="progress-track">
                <div class="progress-fill" style="width: 0%;"></div>
              </div>
              <div class="progress-step active" data-step="1">
                <span class="step-num">1</span>
                <span class="step-label">Demografi</span>
              </div>
              <div class="progress-step" data-step="2">
                <span class="step-num">2</span>
                <span class="step-label">Vücut & Sağlık</span>
              </div>
              <div class="progress-step" data-step="3">
                <span class="step-num">3</span>
                <span class="step-label">Geçmiş</span>
              </div>
              <div class="progress-step" data-step="4">
                <span class="step-num">4</span>
                <span class="step-label">Yaşam Tarzı</span>
              </div>
            </div>

            <!-- Multi-step Form -->
            <form id="predict-form" class="step-form">
              <!-- Step 1: Demographics -->
              <div class="form-step-content active" data-step="1">
                <div class="step-header">
                  <h2>Demografik & Sosyal Bilgiler</h2>
                  <p>
                    Lütfen yaş, cinsiyet, eğitim ve gelir düzeyinizi belirtin.
                  </p>
                </div>
                <div class="grid-2">
                  <div class="form-group">
                    <label>Cinsiyet</label>
                    <div class="gender-selector">
                      <label class="gender-option">
                        <input
                          type="radio"
                          name="Sex"
                          value="0"
                          required
                          checked
                        />
                        <div class="gender-card">
                          <i class="fa-solid fa-venus"></i>
                          <span>Kadın</span>
                        </div>
                      </label>
                      <label class="gender-option">
                        <input type="radio" name="Sex" value="1" required />
                        <div class="gender-card">
                          <i class="fa-solid fa-mars"></i>
                          <span>Erkek</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="Age">Yaş Grubu</label>
                    <div class="select-wrapper">
                      <select id="Age" name="Age" required>
                        <option value="1">18 - 24 yaş</option>
                        <option value="2">25 - 29 yaş</option>
                        <option value="3">30 - 34 yaş</option>
                        <option value="4">35 - 39 yaş</option>
                        <option value="5">40 - 44 yaş</option>
                        <option value="6">45 - 49 yaş</option>
                        <option value="7" selected>50 - 54 yaş</option>
                        <option value="8">55 - 59 yaş</option>
                        <option value="9">60 - 64 yaş</option>
                        <option value="10">65 - 69 yaş</option>
                        <option value="11">70 - 74 yaş</option>
                        <option value="12">75 - 79 yaş</option>
                        <option value="13">80 yaş ve üzeri</option>
                      </select>
                      <i class="fa-solid fa-chevron-down select-icon"></i>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="Education">Eğitim Düzeyi</label>
                    <div class="select-wrapper">
                      <select id="Education" name="Education" required>
                        <option value="1">
                          Okuma yazması yok veya anaokulu
                        </option>
                        <option value="2">İlkokul (Grade 1-8)</option>
                        <option value="3">Lise Terk (Grade 9-11)</option>
                        <option value="4">Lise Mezunu</option>
                        <option value="5" selected>
                          Önlisans / Üniversite Terk
                        </option>
                        <option value="6">Üniversite Mezunu</option>
                      </select>
                      <i class="fa-solid fa-chevron-down select-icon"></i>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="Income">Yıllık Hane Geliri</label>
                    <div class="select-wrapper">
                      <select id="Income" name="Income" required>
                        <option value="1">< 10.000 $</option>
                        <option value="2">10.000 $ - 15.000 $</option>
                        <option value="3">15.000 $ - 20.000 $</option>
                        <option value="4">20.000 $ - 25.000 $</option>
                        <option value="5">25.000 $ - 35.000 $</option>
                        <option value="6" selected>35.000 $ - 50.000 $</option>
                        <option value="7">50.000 $ - 75.000 $</option>
                        <option value="8">75.000 $ veya üzeri</option>
                      </select>
                      <i class="fa-solid fa-chevron-down select-icon"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Body & General Health -->
              <div class="form-step-content" data-step="2">
                <div class="step-header">
                  <h2>Vücut & Genel Sağlık Bilgileri</h2>
                  <p>Boy, kilo ve son zamanlardaki sağlık durumunuzu girin.</p>
                </div>
                <div class="grid-2">
                  <div class="form-group">
                    <label>BMI Hesaplayıcı</label>
                    <div class="bmi-calc-grid">
                      <div class="input-with-label">
                        <input
                          type="number"
                          id="height"
                          placeholder="Boy"
                          min="100"
                          max="250"
                          value="175"
                        />
                        <span>cm</span>
                      </div>
                      <div class="input-with-label">
                        <input
                          type="number"
                          id="weight"
                          placeholder="Kilo"
                          min="30"
                          max="300"
                          value="80"
                        />
                        <span>kg</span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="BMI">Vücut Kitle İndeksi (BMI)</label>
                    <div class="input-with-label readonly-input">
                      <input
                        type="number"
                        id="BMI"
                        name="BMI"
                        step="0.1"
                        min="10"
                        max="100"
                        value="26.1"
                        readonly
                      />
                      <span id="bmi-status" class="bmi-badge overweight"
                        >Fazla Kilolu</span
                      >
                    </div>
                  </div>
                </div>

                <div class="form-group margin-top-lg">
                  <label>Genel Sağlık Değerlendirmeniz</label>
                  <p class="sub-label">
                    Genel olarak sağlığınızı nasıl tanımlarsınız?
                  </p>
                  <div class="rating-selector">
                    <label class="rating-option">
                      <input type="radio" name="GenHlth" value="1" />
                      <div class="rating-card">
                        <span class="rating-num">1</span>
                        <span class="rating-text">Mükemmel</span>
                      </div>
                    </label>
                    <label class="rating-option">
                      <input type="radio" name="GenHlth" value="2" checked />
                      <div class="rating-card">
                        <span class="rating-num">2</span>
                        <span class="rating-text">Çok İyi</span>
                      </div>
                    </label>
                    <label class="rating-option">
                      <input type="radio" name="GenHlth" value="3" />
                      <div class="rating-card">
                        <span class="rating-num">3</span>
                        <span class="rating-text">İyi</span>
                      </div>
                    </label>
                    <label class="rating-option">
                      <input type="radio" name="GenHlth" value="4" />
                      <div class="rating-card">
                        <span class="rating-num">4</span>
                        <span class="rating-text">Orta</span>
                      </div>
                    </label>
                    <label class="rating-option">
                      <input type="radio" name="GenHlth" value="5" />
                      <div class="rating-card">
                        <span class="rating-num">5</span>
                        <span class="rating-text">Kötü</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="grid-2 margin-top-md">
                  <div class="form-group">
                    <div class="label-with-value">
                      <label for="MentHlth">Ruh Sağlığı Şikayeti</label>
                      <span class="slider-val" id="ment-val">0 gün</span>
                    </div>
                    <p class="sub-label">
                      Son 30 günde ruh halinizin (stres, depresyon vb.) kötü
                      olduğu gün sayısı.
                    </p>
                    <input
                      type="range"
                      id="MentHlth"
                      name="MentHlth"
                      min="0"
                      max="30"
                      value="0"
                      class="styled-slider"
                    />
                  </div>

                  <div class="form-group">
                    <div class="label-with-value">
                      <label for="PhysHlth">Fiziksel Sağlık Şikayeti</label>
                      <span class="slider-val" id="phys-val">0 gün</span>
                    </div>
                    <p class="sub-label">
                      Son 30 günde fiziksel hastalık veya sakatlanma yaşadığınız
                      gün sayısı.
                    </p>
                    <input
                      type="range"
                      id="PhysHlth"
                      name="PhysHlth"
                      min="0"
                      max="30"
                      value="0"
                      class="styled-slider"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 3: Medical History -->
              <div class="form-step-content" data-step="3">
                <div class="step-header">
                  <h2>Klinik & Tıbbi Geçmiş</h2>
                  <p>Tanı konmuş kronik veya tıbbi durumlarınızı belirtin.</p>
                </div>
                <div class="toggle-grid">
                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Yüksek Tansiyon (HighBP)</h3>
                      <p>Doktor tarafından yüksek tansiyon tanısı kondu mu?</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="HighBP" value="1" />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Yüksek Kolesterol (HighChol)</h3>
                      <p>
                        Doktor tarafından yüksek kolesterol tanısı kondu mu?
                      </p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="HighChol" value="1" />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Kolesterol Kontrolü (CholCheck)</h3>
                      <p>
                        Son 5 yıl içerisinde kolesterol ölçümü yaptırdınız mı?
                      </p>
                    </div>
                    <label class="switch">
                      <input
                        type="checkbox"
                        name="CholCheck"
                        value="1"
                        checked
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Geçirilmiş Felç (Stroke)</h3>
                      <p>Daha önce hiç inme veya felç geçirdiniz mi?</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="Stroke" value="1" />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Kalp Rahatsızlığı (HeartDiseaseorAttack)</h3>
                      <p>
                        Koroner kalp hastalığı veya kalp krizi geçmişiniz var
                        mı?
                      </p>
                    </div>
                    <label class="switch">
                      <input
                        type="checkbox"
                        name="HeartDiseaseorAttack"
                        value="1"
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Yürüme Zorluğu (DiffWalk)</h3>
                      <p>
                        Yürürken veya merdiven çıkarken ciddi zorluk yaşıyor
                        musunuz?
                      </p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="DiffWalk" value="1" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Step 4: Lifestyle Factors -->
              <div class="form-step-content" data-step="4">
                <div class="step-header">
                  <h2>Yaşam Tarzı & Alışkanlıklar</h2>
                  <p>
                    Günlük beslenme, egzersiz ve sağlık sistemi ilişkilerinizi
                    girin.
                  </p>
                </div>
                <div class="toggle-grid">
                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Sigara Tüketimi (Smoker)</h3>
                      <p>
                        Hayatınızda toplam en az 100 sigara (5 paket) içtiniz
                        mi?
                      </p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="Smoker" value="1" />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Fiziksel Aktivite (PhysActivity)</h3>
                      <p>
                        Son 30 günde iş dışında düzenli egzersiz yaptınız mı?
                      </p>
                    </div>
                    <label class="switch">
                      <input
                        type="checkbox"
                        name="PhysActivity"
                        value="1"
                        checked
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Meyve Tüketimi (Fruits)</h3>
                      <p>Günde en az bir kez meyve tüketiyor musunuz?</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="Fruits" value="1" checked />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Sebze Tüketimi (Veggies)</h3>
                      <p>Günde en az bir kez sebze tüketiyor musunuz?</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="Veggies" value="1" checked />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Aşırı Alkol Tüketimi (HvyAlcoholConsump)</h3>
                      <p>
                        Haftada 8 (kadın) veya 14 (erkek) bardaktan fazla alkol?
                      </p>
                    </div>
                    <label class="switch">
                      <input
                        type="checkbox"
                        name="HvyAlcoholConsump"
                        value="1"
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Sağlık Güvencesi (AnyHealthcare)</h3>
                      <p>
                        SGK, özel sağlık sigortası vb. bir güvenceniz var mı?
                      </p>
                    </div>
                    <label class="switch">
                      <input
                        type="checkbox"
                        name="AnyHealthcare"
                        value="1"
                        checked
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="toggle-card">
                    <div class="toggle-info">
                      <h3>Maddi Engel Nedeniyle Tedavi Olamama</h3>
                      <p>
                        Son 12 ayda parasal nedenlerle doktora gidemediğiniz
                        oldu mu?
                      </p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" name="NoDocbcCost" value="1" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button
                  type="button"
                  id="prev-btn"
                  class="btn btn-secondary"
                  disabled
                >
                  <i class="fa-solid fa-arrow-left"></i> Geri
                </button>
                <button type="button" id="next-btn" class="btn btn-primary">
                  İleri <i class="fa-solid fa-arrow-right"></i>
                </button>
                <button
                  type="submit"
                  id="submit-btn"
                  class="btn btn-success hidden"
                >
                  <i class="fa-solid fa-square-poll-vertical"></i> Hesapla
                </button>
              </div>
            </form>
          </div>
        </section>

        <!-- Results Section (Initially hidden) -->
        <section id="results-section" class="hidden-section">
          <div class="grid-layout">
            <!-- Left Column: Gauge & Risk Class -->
            <div class="glass-card flex-center">
              <div class="result-header">
                <h2>Analiz Sonucu</h2>
                <p>Yapay zekanın diyabet risk değerlendirmesi.</p>
              </div>

              <div class="gauge-container">
                <svg class="gauge" viewBox="0 0 200 200">
                  <circle class="gauge-bg" cx="100" cy="100" r="80"></circle>
                  <circle class="gauge-value" cx="100" cy="100" r="80"></circle>
                </svg>
                <div class="gauge-text-container">
                  <span class="gauge-percentage" id="risk-prob">0%</span>
                  <span class="gauge-label">RİSK</span>
                </div>
              </div>

              <div class="risk-badge-wrapper">
                <span class="risk-level-badge" id="risk-level-display"
                  >---</span
                >
              </div>

              <p class="risk-explanation" id="risk-summary-text">
                Hesaplama yürütülüyor...
              </p>

              <button id="restart-btn" class="btn btn-outline margin-top-md">
                <i class="fa-solid fa-rotate-right"></i> Yeni Hesaplama Yap
              </button>
            </div>

            <!-- Right Column: Contribution Factors & Explanations -->
            <div class="glass-card flex-column">
              <div class="step-header">
                <h2>Kişisel Faktör Analizi</h2>
                <p>Modelin kararına en çok etki eden faktörleriniz.</p>
              </div>

              <div class="factor-tabs">
                <button class="factor-tab active" data-type="risk">
                  <i class="fa-solid fa-circle-exclamation text-danger"></i>
                  Risk Artıranlar
                </button>
                <button class="factor-tab" data-type="protective">
                  <i class="fa-solid fa-circle-check text-success"></i> Koruyucu
                  Faktörler
                </button>
              </div>

              <!-- Factors List -->
              <div class="factors-list" id="factors-container">
                <!-- JS ile doldurulacak -->
              </div>

              <!-- Recommendations Box -->
              <div class="recommendations-box margin-top-auto">
                <h3 class="recommend-title">
                  <i class="fa-solid fa-user-doctor"></i> Kişiye Özel Sağlık
                  Önerileri
                </h3>
                <ul class="recommend-list" id="recommendations-list">
                  <!-- JS ile doldurulacak -->
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Dashboard Tab -->
        <section id="dashboard-tab" class="tab-content">
          <div class="grid-layout">
            <!-- Left: Academic Report Info -->
            <div class="glass-card">
              <div class="step-header">
                <h2>Akademik Model Özet Kartı</h2>
                <p>IE410 Projesi kapsamında eğitilen en iyi model bilgileri.</p>
              </div>

              <div class="model-badge-large">
                <i class="fa-solid fa-gears"></i>
                <div>
                  <h3 id="info-model-name">Logistic Regression (Balanced)</h3>
                  <p>Sınıf ağırlıkları dengelenmiş doğrusal model</p>
                </div>
              </div>

              <div class="metrics-grid margin-top-lg">
                <div class="metric-card">
                  <span class="m-val" id="info-accuracy">86.4%</span>
                  <span class="m-lbl">Test Accuracy</span>
                  <div class="m-progress">
                    <div class="m-progress-fill" style="width: 86.4%"></div>
                  </div>
                </div>
                <div class="metric-card">
                  <span class="m-val" id="info-recall">76.2%</span>
                  <span class="m-lbl">Test Recall (Sensitivity)</span>
                  <div class="m-progress">
                    <div class="m-progress-fill" style="width: 76.2%"></div>
                  </div>
                </div>
                <div class="metric-card">
                  <span class="m-val" id="info-auc">0.8226</span>
                  <span class="m-lbl">ROC AUC</span>
                  <div class="m-progress">
                    <div class="m-progress-fill" style="width: 82.2%"></div>
                  </div>
                </div>
                <div class="metric-card">
                  <span class="m-val" id="info-f1">0.4430</span>
                  <span class="m-lbl">F1-Score</span>
                  <div class="m-progress">
                    <div class="m-progress-fill" style="width: 44.3%"></div>
                  </div>
                </div>
              </div>

              <div class="info-block margin-top-lg">
                <h4>Model Özellikleri ve Eğitim Parametreleri</h4>
                <ul class="info-list">
                  <li><strong>Eğitim Kümesi Boyutu:</strong> 202,944 satır</li>
                  <li><strong>Test Kümesi Boyutu:</strong> 50,736 satır</li>
                  <li>
                    <strong>Dengesizlik Çözümü:</strong>
                    `class_weight='balanced'` (Sınıf ağırlığı dengeleme)
                  </li>
                  <li>
                    <strong>Kullanılan Özellik Sayısı:</strong> 21 Girdi
                    Parametresi
                  </li>
                  <li>
                    <strong>Doğrulama (Validation):</strong> Stratified 5-Fold
                    GridSearch & Nested CV
                  </li>
                </ul>
              </div>
            </div>

            <!-- Right: Explaining the Paradox & Feature importance -->
            <div class="glass-card flex-column">
              <div class="step-header">
                <h2>Doğruluk Paradoksu (Accuracy Paradox)</h2>
                <p>Neden doğruluk oranı yerine Recall metriği önemlidir?</p>
              </div>

              <div class="paradox-box">
                <p>
                  Veri setimizde kişilerin <strong>%86.1'i sağlıklı</strong>,
                  <strong>%13.9'u diyabetlidir</strong>. EĞER modelimiz herkese
                  "sağlıklı" tahmini yapsaydı, hiç kimseyi tespit edememesine
                  rağmen <strong>%86.1 doğruluk (accuracy)</strong> oranına
                  ulaşırdı.
                </p>
                <p class="margin-top-sm">
                  Tıbbi tarama testlerinde asıl amaç hasta olan kişileri
                  <strong>kaçırmamaktır</strong> (False Negative oranını sıfıra
                  yakın tutmak). Bu nedenle projemizde
                  <code>class_weight='balanced'</code> kullanılarak diyabetli
                  hastaları yakalama başarısı (Recall) varsayılan modeldeki
                  %15.6 seviyesinden <strong>%76.2'ye</strong> çıkarılmıştır.
                </p>
              </div>

              <h3 class="section-sub-title margin-top-lg">
                En Önemli Risk Faktörleri (Global Feature Importance)
              </h3>
              <p class="sub-label">
                Modelin tüm popülasyonda diyabet riskini tahmin ederken en çok
                ağırlık verdiği ilk 5 özellik:
              </p>

              <div class="global-importance-list">
                <div class="importance-item">
                  <span class="imp-num">1</span>
                  <div class="imp-details">
                    <div class="imp-header">
                      <span class="imp-name"
                        >Genel Sağlık Değerlendirmesi (GenHlth)</span
                      >
                      <span class="imp-weight">%24.2</span>
                    </div>
                    <div class="imp-bar">
                      <div class="imp-bar-fill" style="width: 100%"></div>
                    </div>
                  </div>
                </div>
                <div class="importance-item">
                  <span class="imp-num">2</span>
                  <div class="imp-details">
                    <div class="imp-header">
                      <span class="imp-name">Yüksek Tansiyon (HighBP)</span>
                      <span class="imp-weight">%21.5</span>
                    </div>
                    <div class="imp-bar">
                      <div class="imp-bar-fill" style="width: 88%"></div>
                    </div>
                  </div>
                </div>
                <div class="importance-item">
                  <span class="imp-num">3</span>
                  <div class="imp-details">
                    <div class="imp-header">
                      <span class="imp-name">Vücut Kitle İndeksi (BMI)</span>
                      <span class="imp-weight">%17.8</span>
                    </div>
                    <div class="imp-bar">
                      <div class="imp-bar-fill" style="width: 73%"></div>
                    </div>
                  </div>
                </div>
                <div class="importance-item">
                  <span class="imp-num">4</span>
                  <div class="imp-details">
                    <div class="imp-header">
                      <span class="imp-name">Yaş Grubu (Age)</span>
                      <span class="imp-weight">%14.3</span>
                    </div>
                    <div class="imp-bar">
                      <div class="imp-bar-fill" style="width: 59%"></div>
                    </div>
                  </div>
                </div>
                <div class="importance-item">
                  <span class="imp-num">5</span>
                  <div class="imp-details">
                    <div class="imp-header">
                      <span class="imp-name">Yüksek Kolesterol (HighChol)</span>
                      <span class="imp-weight">%12.1</span>
                    </div>
                    <div class="imp-bar">
                      <div class="imp-bar-fill" style="width: 50%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- JS Scripts -->
    <script src="app.js"></script>
  </body>
</html>
```

### C. Frontend CSS (`web/static/style.css`)

```css
/* CSS Variables & Theme Setup */
:root {
  --bg-color: #0b0c14;
  --card-bg: rgba(22, 26, 46, 0.55);
  --card-border: rgba(255, 255, 255, 0.07);
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --primary-color: #6366f1; /* Indigo */
  --primary-glow: rgba(99, 102, 241, 0.3);
  --secondary-color: #06b6d4; /* Cyan */
  --success-color: #10b981; /* Emerald */
  --warning-color: #f59e0b; /* Amber */
  --danger-color: #ef4444; /* Rose */

  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  --font-heading: "Outfit", "Plus Jakarta Sans", sans-serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
}

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

/* Background Animated Blobs */
.background-decor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.45;
}

.circle-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    var(--primary-color) 0%,
    rgba(99, 102, 241, 0) 70%
  );
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    var(--secondary-color) 0%,
    rgba(6, 182, 212, 0) 70%
  );
  bottom: -150px;
  right: -100px;
}

.circle-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #ec4899 0%, rgba(236, 72, 153, 0) 70%);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.15;
}

/* App Container */
.app-container {
  width: 100%;
  max-width: 1100px;
  z-index: 1;
}

/* Header styling */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2.25rem;
  color: var(--secondary-color);
  filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.4));
  animation: heart-pulse 2s infinite alternate;
}

@keyframes heart-pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.08);
  }
}

.logo-text h1 {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text span {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.app-nav {
  display: flex;
  gap: 0.75rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition-fast);
}

.nav-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.07);
}

.nav-btn.active {
  color: #ffffff;
  background: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 4px 15px var(--primary-glow);
}

/* Glass Card */
.glass-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 2.25rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  transition:
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
}

/* Tab contents */
.tab-content {
  display: none;
  animation: fade-in var(--transition-normal);
}

.tab-content.active {
  display: block;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Multi-step Form Progress Bar */
.form-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 2.5rem;
  padding: 0 1rem;
}

.progress-track {
  position: absolute;
  top: 20px;
  left: 2.5rem;
  right: 2.5rem;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  z-index: 0;
  border-radius: 2px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--secondary-color)
  );
  border-radius: 2px;
  transition: width var(--transition-normal);
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
  cursor: pointer;
}

.step-num {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #151829;
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 0.95rem;
  transition: var(--transition-normal);
}

.progress-step.active .step-num {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #ffffff;
  box-shadow: 0 0 15px var(--primary-glow);
}

.progress-step.complete .step-num {
  background: var(--success-color);
  border-color: var(--success-color);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.progress-step.active .step-label {
  color: var(--text-primary);
  font-weight: 600;
}

.progress-step.complete .step-label {
  color: var(--success-color);
}

/* Form Steps contents */
.form-step-content {
  display: none;
  animation: slide-step 0.4s ease-out;
}

.form-step-content.active {
  display: block;
}

@keyframes slide-step {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-header {
  margin-bottom: 2rem;
  border-left: 4px solid var(--secondary-color);
  padding-left: 0.75rem;
}

.step-header h2 {
  font-family: var(--font-heading);
  font-size: 1.45rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.step-header p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Grids and layout structures */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.sub-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: -0.25rem;
  margin-bottom: 0.25rem;
}

.margin-top-lg {
  margin-top: 2rem;
}

.margin-top-md {
  margin-top: 1.25rem;
}

.margin-top-auto {
  margin-top: auto;
}

/* Custom Dropdown select */
.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.9rem;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.select-wrapper select:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
  background: #111424;
}

.select-icon {
  position: absolute;
  right: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: var(--text-secondary);
  pointer-events: none;
}

/* Gender selector design */
.gender-selector {
  display: flex;
  gap: 1rem;
}

.gender-option {
  flex: 1;
  cursor: pointer;
}

.gender-option input[type="radio"] {
  display: none;
}

.gender-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.85rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.gender-card i {
  font-size: 1.1rem;
}

.gender-option input[type="radio"]:checked + .gender-card {
  background: rgba(99, 102, 241, 0.08);
  border-color: var(--primary-color);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
}

/* BMI Calculator inputs */
.bmi-calc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.input-with-label {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-label input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  padding-right: 2.5rem;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.9rem;
  outline: none;
  transition: var(--transition-fast);
}

.input-with-label input:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
  background: #111424;
}

.input-with-label span {
  position: absolute;
  right: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.readonly-input input {
  background: rgba(255, 255, 255, 0.01) !important;
  border-color: rgba(255, 255, 255, 0.05) !important;
  color: var(--text-secondary);
  cursor: not-allowed;
}

.bmi-badge {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.bmi-badge.underweight {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}
.bmi-badge.normal {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}
.bmi-badge.overweight {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}
.bmi-badge.obese {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* General Health Rating card selectors */
.rating-selector {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 500px) {
  .rating-selector {
    grid-template-columns: 1fr;
  }
}

.rating-option {
  cursor: pointer;
}

.rating-option input[type="radio"] {
  display: none;
}

.rating-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.85rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  transition: var(--transition-fast);
}

.rating-num {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.rating-text {
  font-size: 0.65rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  text-align: center;
}

.rating-option input[type="radio"]:checked + .rating-card {
  background: rgba(99, 102, 241, 0.08);
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
}

.rating-option input[type="radio"]:checked + .rating-card .rating-num {
  color: #ffffff;
}

.rating-option input[type="radio"]:checked + .rating-card .rating-text {
  color: #ffffff;
  font-weight: 600;
}

/* Custom Range Sliders */
.label-with-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-val {
  background: rgba(255, 255, 255, 0.07);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--secondary-color);
}

.styled-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.styled-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--secondary-color);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  transition: var(--transition-fast);
}

.styled-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

/* Switches and toggles */
.toggle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .toggle-grid {
    grid-template-columns: 1fr;
  }
}

.toggle-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.15rem 1.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: var(--transition-fast);
}

.toggle-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}

.toggle-info h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.15rem;
}

.toggle-info p {
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1.3;
}

/* Toggle Switch Design (iOS) */
.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider.round {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: 0.3s;
  border-radius: 34px;
}

.slider.round:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: var(--success-color);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);
}

.switch input:checked + .slider:before {
  transform: translateX(22px);
}

/* Buttons and Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn {
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  outline: none;
  transition: var(--transition-fast);
}

.btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: #ffffff;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.btn-primary:hover:not(:disabled) {
  background: #5254de;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.btn-success {
  background: var(--success-color);
  border: 1px solid var(--success-color);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-success:hover:not(:disabled) {
  background: #0d9668;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
}

.btn-outline {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.25);
}

.hidden {
  display: none !important;
}

/* Results section grids & charts */
.hidden-section {
  display: none;
}

.hidden-section.active {
  display: block;
  animation: fade-in var(--transition-normal);
}

.grid-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.result-header {
  margin-bottom: 1.5rem;
}

.result-header h2 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
}

.result-header p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Circular Gauge Chart */
.gauge-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 1.25rem;
}

.gauge {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.gauge-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.04);
  stroke-width: 16;
}

.gauge-value {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 16;
  stroke-dasharray: 502;
  stroke-dashoffset: 502;
  stroke-linecap: round;
  transition:
    stroke-dashoffset 1.5s cubic-bezier(0.1, 0.8, 0.25, 1),
    stroke var(--transition-normal);
}

.gauge-text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-percentage {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.gauge-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}

/* Risk level display */
.risk-badge-wrapper {
  margin-bottom: 1.25rem;
}

.risk-level-badge {
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: inline-block;
  transition: var(--transition-normal);
}

.risk-explanation {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 320px;
}

/* Factor analysis tabs & lists */
.factor-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 0.3rem;
  margin-bottom: 1.25rem;
}

.factor-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.55rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  transition: var(--transition-fast);
}

.factor-tab.active {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.text-danger {
  color: var(--danger-color);
}
.text-success {
  color: var(--success-color);
}

.factors-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 0.25rem;
  margin-bottom: 1.5rem;
}

/* Custom Scrollbar for factors-list */
.factors-list::-webkit-scrollbar {
  width: 4px;
}

.factors-list::-webkit-scrollbar-track {
  background: transparent;
}

.factors-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.factor-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  animation: fade-in 0.3s ease-out;
}

.factor-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.factor-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.factor-effect-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.factor-item.risk .factor-effect-badge {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.factor-item.protective .factor-effect-badge {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.factor-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
}

.factor-bar-fill {
  height: 100%;
  border-radius: 2px;
}

.factor-item.risk .factor-bar-fill {
  background: var(--danger-color);
}

.factor-item.protective .factor-bar-fill {
  background: var(--success-color);
}

.factor-desc {
  font-size: 0.7rem;
  color: var(--text-secondary);
  line-height: 1.3;
}

/* Recommendations box styling */
.recommendations-box {
  background: rgba(99, 102, 241, 0.04);
  border: 1px dashed rgba(99, 102, 241, 0.25);
  border-radius: 16px;
  padding: 1.15rem;
}

.recommend-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.recommend-title i {
  color: var(--secondary-color);
}

.recommend-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recommend-list li {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
  position: relative;
  padding-left: 1rem;
}

.recommend-list li::before {
  content: "•";
  color: var(--secondary-color);
  font-weight: bold;
  position: absolute;
  left: 0.15rem;
}

/* Dashboard Tab (Model Info Layout) */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 500px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

.metric-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
}

.m-val {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}

.m-lbl {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.15rem;
  margin-bottom: 0.5rem;
}

.m-progress {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

.m-progress-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--secondary-color)
  );
}

.model-badge-large {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 16px;
  padding: 1rem;
}

.model-badge-large i {
  font-size: 1.8rem;
  color: var(--primary-color);
  filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.3));
}

.model-badge-large h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.model-badge-large p {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.info-block h4 {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.info-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-list li {
  font-size: 0.78rem;
  color: var(--text-secondary);
  position: relative;
  padding-left: 0.85rem;
}

.info-list li::before {
  content: "–";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

/* Paradox & feature importance lists in Dashboard */
.paradox-box {
  background: rgba(245, 158, 11, 0.04);
  border-left: 4px solid var(--warning-color);
  border-radius: 4px 12px 12px 4px;
  padding: 1.15rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: #e5e7eb;
}

.section-sub-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
}

.global-importance-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.75rem;
}

.importance-item {
  display: flex;
  gap: 0.85rem;
  align-items: center;
}

.imp-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.imp-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.imp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.imp-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-primary);
}

.imp-weight {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.imp-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
}

.imp-bar-fill {
  height: 100%;
  background: var(--secondary-color);
  border-radius: 2px;
}
```

### D. Frontend JS (`web/static/app.js`)

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------
  // DOM ELEMANLARI
  // -------------------------------------------------------------
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabs = document.querySelectorAll(".tab-content");
  const formSteps = document.querySelectorAll(".form-step-content");
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressFill = document.querySelector(".progress-fill");

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const predictForm = document.getElementById("predict-form");
  const predictTabSection = document.getElementById("predict-tab");

  // BMI Hesaplama Elemanları
  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  const bmiInput = document.getElementById("BMI");
  const bmiStatusBadge = document.getElementById("bmi-status");

  // Slider Elemanları
  const mentSlider = document.getElementById("MentHlth");
  const physSlider = document.getElementById("PhysHlth");
  const mentVal = document.getElementById("ment-val");
  const physVal = document.getElementById("phys-val");

  // Sonuç Ekranı Elemanları
  const resultsSection = document.getElementById("results-section");
  const riskProbText = document.getElementById("risk-prob");
  const riskLevelDisplay = document.getElementById("risk-level-display");
  const riskSummaryText = document.getElementById("risk-summary-text");
  const gaugeValueCircle = document.querySelector(".gauge-value");
  const factorTabs = document.querySelectorAll(".factor-tab");
  const factorsContainer = document.getElementById("factors-container");
  const recommendationsList = document.getElementById("recommendations-list");
  const restartBtn = document.getElementById("restart-btn");

  // Dashboard Elemanları
  const infoModelName = document.getElementById("info-model-name");
  const infoAccuracy = document.getElementById("info-accuracy");
  const infoRecall = document.getElementById("info-recall");
  const infoAuc = document.getElementById("info-auc");
  const infoF1 = document.getElementById("info-f1");

  // Uygulama Durumu (State)
  let currentStep = 1;
  let savedContributions = [];
  let activeFactorType = "risk";

  // -------------------------------------------------------------
  // NAVİGASYON VE SEKME YÖNETİMİ
  // -------------------------------------------------------------
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-target");

      navButtons.forEach((b) => b.classList.remove("active"));
      tabs.forEach((t) => t.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(targetTab).classList.add("active");

      if (targetTab === "predict-tab") {
        if (resultsSection.classList.contains("active")) {
          resultsSection.style.display = "block";
          predictForm.parentElement.classList.add("hidden");
        } else {
          resultsSection.style.display = "none";
          predictForm.parentElement.classList.remove("hidden");
        }
      } else {
        resultsSection.style.display = "none";
      }
    });
  });

  // -------------------------------------------------------------
  // ÇOK ADIMLI FORM YÖNETİMİ (PREV / NEXT)
  // -------------------------------------------------------------
  function updateFormSteps() {
    formSteps.forEach((step) => {
      step.classList.remove("active");
      if (parseInt(step.getAttribute("data-step")) === currentStep) {
        step.classList.add("active");
      }
    });

    progressSteps.forEach((step) => {
      const stepNum = parseInt(step.getAttribute("data-step"));
      step.classList.remove("active", "complete");
      if (stepNum === currentStep) {
        step.classList.add("active");
      } else if (stepNum < currentStep) {
        step.classList.add("complete");
      }
    });

    const progressPct = ((currentStep - 1) / (progressSteps.length - 1)) * 100;
    progressFill.style.width = `${progressPct}%`;

    if (currentStep === 1) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }

    if (currentStep === formSteps.length) {
      nextBtn.classList.add("hidden");
      submitBtn.classList.remove("hidden");
    } else {
      nextBtn.classList.remove("hidden");
      submitBtn.classList.add("hidden");
    }
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep < formSteps.length) {
      const activeFields =
        formSteps[currentStep - 1].querySelectorAll("[required]");
      let isValid = true;
      activeFields.forEach((field) => {
        if (!field.value) {
          field.classList.add("input-error");
          isValid = false;
        } else {
          field.classList.remove("input-error");
        }
      });

      if (isValid) {
        currentStep++;
        updateFormSteps();
      }
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateFormSteps();
    }
  });

  progressSteps.forEach((step) => {
    step.addEventListener("click", () => {
      const stepNum = parseInt(step.getAttribute("data-step"));
      if (stepNum < currentStep || stepNum === currentStep + 1) {
        currentStep = stepNum;
        updateFormSteps();
      }
    });
  });

  // -------------------------------------------------------------
  // BMI OTO-HESAPLAMA SİSTEMİ
  // -------------------------------------------------------------
  function calculateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (height > 0 && weight > 0) {
      const bmi = weight / (height / 100) ** 2;
      const formattedBmi = bmi.toFixed(1);
      bmiInput.value = formattedBmi;

      bmiStatusBadge.className = "bmi-status-badge bmi-badge";
      if (bmi < 18.5) {
        bmiStatusBadge.textContent = "Zayıf";
        bmiStatusBadge.className = "bmi-badge underweight";
      } else if (bmi < 25.0) {
        bmiStatusBadge.textContent = "Normal Kilolu";
        bmiStatusBadge.className = "bmi-badge normal";
      } else if (bmi < 30.0) {
        bmiStatusBadge.textContent = "Fazla Kilolu";
        bmiStatusBadge.className = "bmi-badge overweight";
      } else {
        bmiStatusBadge.textContent = "Obez";
        bmiStatusBadge.className = "bmi-badge obese";
      }
    }
  }

  heightInput.addEventListener("input", calculateBMI);
  weightInput.addEventListener("input", calculateBMI);
  calculateBMI();

  // -------------------------------------------------------------
  // SLIDER DEĞER GÖSTERİMİ
  // -------------------------------------------------------------
  mentSlider.addEventListener("input", (e) => {
    mentVal.textContent = `${e.target.value} gün`;
  });

  physSlider.addEventListener("input", (e) => {
    physVal.textContent = `${e.target.value} gün`;
  });

  // -------------------------------------------------------------
  // FORM GÖNDERİMİ (API İSTEĞİ)
  // -------------------------------------------------------------
  predictForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(predictForm);
    const requestData = {};

    const checkboxFeatures = [
      "HighBP",
      "HighChol",
      "CholCheck",
      "Smoker",
      "Stroke",
      "HeartDiseaseorAttack",
      "PhysActivity",
      "Fruits",
      "Veggies",
      "HvyAlcoholConsump",
      "AnyHealthcare",
      "NoDocbcCost",
      "DiffWalk",
    ];

    checkboxFeatures.forEach((feat) => {
      requestData[feat] = 0;
    });

    for (const [key, value] of formData.entries()) {
      if (checkboxFeatures.includes(key)) {
        requestData[key] = 1;
      } else if (key === "BMI") {
        requestData[key] = parseFloat(value);
      } else {
        requestData[key] = parseInt(value);
      }
    }

    checkboxFeatures.forEach((feat) => {
      if (!formData.has(feat)) {
        requestData[feat] = 0;
      }
    });

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Analiz Ediliyor...`;

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Sunucu hata döndürdü.");
      }

      const result = await response.json();
      savedContributions = result.contributions;
      renderResults(result);
    } catch (error) {
      alert("Model tahmini alınırken bir hata oluştu.");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-square-poll-vertical"></i> Hesapla`;
    }
  });

  // -------------------------------------------------------------
  // SONUÇLARI GÖSTERME VE AÇIKLAMA YAZMA
  // -------------------------------------------------------------
  function renderResults(data) {
    const probPct = Math.round(data.probability * 100);

    predictForm.parentElement.classList.add("hidden");
    resultsSection.className = "active";

    riskProbText.textContent = `${probPct}%`;
    riskProbText.style.color = data.risk_color;

    riskLevelDisplay.textContent = data.risk_level;
    riskLevelDisplay.style.borderColor = data.risk_color;
    riskLevelDisplay.style.color = data.risk_color;
    riskLevelDisplay.style.boxShadow = `0 0 15px ${data.risk_color}30`;

    let summaryText = "";
    if (data.risk_level === "Düşük Risk") {
      summaryText = `Yapay zeka modelimiz, girdiğiniz sağlık verilerine göre diyabet geliştirme riskinizi <strong>düşük</strong> olarak hesaplamıştır. Sağlıklı yaşam alışkanlıklarınızı sürdürmeye devam edin.`;
    } else if (data.risk_level === "Orta Risk") {
      summaryText = `Modelimiz, diyabet geliştirme olasılığınızı <strong>orta düzeyde</strong> görmektedir. Bazı tıbbi ve yaşam tarzı faktörleriniz diyabet eğilimini desteklemektedir. Yaşam alışkanlıklarınızı gözden geçirmek faydalı olabilir.`;
    } else {
      summaryText = `Modelimiz, girdiğiniz verilere göre <strong>yüksek diyabet riski</strong> tespit etmiştir. Tıbbi geçmişiniz ve fiziksel durumunuz diyabet riskini ciddi oranda artırmaktadır. En kısa sürede bir hekime danışmanızı öneririz.`;
    }
    riskSummaryText.innerHTML = summaryText;

    const maxOffset = 502;
    const currentOffset = maxOffset - data.probability * maxOffset;
    gaugeValueCircle.style.strokeDashoffset = currentOffset;
    gaugeValueCircle.style.stroke = data.risk_color;

    activeFactorType = "risk";
    factorTabs.forEach((t) => {
      t.classList.remove("active");
      if (t.getAttribute("data-type") === "risk") t.classList.add("active");
    });
    renderFactorsList();
    renderRecommendations(data);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderFactorsList() {
    factorsContainer.innerHTML = "";

    const filteredFactors = savedContributions.filter(
      (f) => f.type === activeFactorType,
    );

    if (filteredFactors.length === 0) {
      factorsContainer.innerHTML = `<div class="empty-list-text text-secondary" style="font-size: 0.8rem; text-align: center; padding: 1.5rem;">Bu kategoride belirgin bir faktör bulunmamaktadır.</div>`;
      return;
    }

    const maxAbsContribution = Math.max(
      ...savedContributions.map((f) => Math.abs(f.contribution)),
      0.01,
    );

    filteredFactors.forEach((factor) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = `factor-item ${factor.type}`;

      const barPct = Math.min(
        (Math.abs(factor.contribution) / maxAbsContribution) * 100,
        100,
      );

      let valStr = "";
      if (factor.feature === "BMI") {
        valStr = `${factor.value} kg/m²`;
      } else if (
        factor.feature === "MentHlth" ||
        factor.feature === "PhysHlth"
      ) {
        valStr = `${factor.value} gün`;
      } else if (factor.feature === "Age") {
        const ageBrackets = [
          "",
          "18-24",
          "25-29",
          "30-34",
          "35-39",
          "40-44",
          "45-49",
          "50-54",
          "55-59",
          "60-64",
          "65-69",
          "70-74",
          "75-79",
          "80+",
        ];
        valStr = `${ageBrackets[factor.value]} yaş`;
      } else if (factor.feature === "GenHlth") {
        const hlthStrings = ["", "Mükemmel", "Çok İyi", "İyi", "Orta", "Kötü"];
        valStr = hlthStrings[factor.value];
      } else if (factor.feature === "Sex") {
        valStr = factor.value === 1 ? "Erkek" : "Kadın";
      } else {
        valStr = factor.value === 1 ? "Evet" : "Hayır";
      }

      const effectText = factor.type === "risk" ? "Risk Artırıcı" : "Koruyucu";

      itemDiv.innerHTML = `
                <div class="factor-title">
                    <span class="factor-name">${factor.label} (${valStr})</span>
                    <span class="factor-effect-badge">${effectText}</span>
                </div>
                <div class="factor-bar">
                    <div class="factor-bar-fill" style="width: ${barPct}%"></div>
                </div>
                <p class="factor-desc">${factor.desc}</p>
            `;

      factorsContainer.appendChild(itemDiv);
    });
  }

  factorTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      factorTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeFactorType = tab.getAttribute("data-type");
      renderFactorsList();
    });
  });

  function renderRecommendations(data) {
    recommendationsList.innerHTML = "";
    const recommendations = [];
    const getVal = (feat) =>
      savedContributions.find((c) => c.feature === feat)?.value;

    if (getVal("HighBP") === 1) {
      recommendations.push(
        "<strong>Tansiyon Kontrolü:</strong> Yüksek tansiyonunuz bulunuyor. Tansiyon ilaçlarınızı düzenli kullanmak ve tuzu azaltmak diyabet riskini düşürmede en kritik adımlardan biridir.",
      );
    }

    if (getVal("HighChol") === 1) {
      recommendations.push(
        "<strong>Kolesterol Takibi:</strong> Yüksek kolesterol diyabet riskini tetikler. Doymuş yağ tüketimini azaltıp lifli besinlere (yulaf, baklagiller) yönelmelisiniz.",
      );
    }

    if (getVal("BMI") >= 30) {
      recommendations.push(
        "<strong>Kilo Yönetimi:</strong> Vücut kitle indeksiniz obezite sınırında. Kilonuzda yapacağınız %5-7'lik hafif bir azalma dahi diyabet riskinizi yarı yarıya düşürebilir.",
      );
    } else if (getVal("BMI") >= 25) {
      recommendations.push(
        "<strong>Ağırlık Kontrolü:</strong> BMI değeriniz hafif kilolu aralıkta. Kilonuzu korumaya ve aşırı şekerli/karbonhidratlı besinlerden uzak durmaya gayret edin.",
      );
    }

    if (getVal("PhysActivity") === 0) {
      recommendations.push(
        "<strong>Fiziksel Egzersiz:</strong> Aktif egzersiz yapmamaktasınız. Haftada en az 150 dakika (örneğin günde 30 dakikalık hızlı yürüyüşler) insülin direncini kırmak için altın standarttır.",
      );
    }

    if (getVal("Smoker") === 1) {
      recommendations.push(
        "<strong>Sigarayı Bırakma:</strong> Sigara içmek hücresel düzeyde insülin direncini tetikler. Sigarayı bırakmak diyabet gelişim riskini azaltacaktır.",
      );
    }

    if (getVal("Fruits") === 0 || getVal("Veggies") === 0) {
      recommendations.push(
        "<strong>Lifli Beslenme:</strong> Günlük sebze ve meyve tüketiminiz yetersiz. Tabağınızın yarısını sebzelerle doldurarak lif alımını artırmak kan şekerini dengeler.",
      );
    }

    recommendations.push(
      "<strong>Tıbbi Danışmanlık:</strong> Bu sistem akademik bir modeldir ve hekim kontrolü yerine geçemez. Kesin tanı için lütfen <strong>Açlık Kan Şekeri</strong> ve <strong>HbA1c</strong> testi yaptırın.",
    );

    const limit = 4;
    recommendations.slice(0, limit).forEach((rec) => {
      const li = document.createElement("li");
      li.innerHTML = rec;
      recommendationsList.appendChild(li);
    });
  }

  restartBtn.addEventListener("click", () => {
    resultsSection.className = "hidden-section";
    predictForm.parentElement.classList.remove("hidden");
    predictForm.reset();
    currentStep = 1;
    updateFormSteps();
    calculateBMI();
  });

  async function loadModelInfo() {
    try {
      const response = await fetch("/api/info");
      if (response.ok) {
        const info = await response.json();
        infoModelName.textContent = info.model_name;
        infoAccuracy.textContent = info.test_metrics["Accuracy"];
        infoRecall.textContent = info.test_metrics["Recall (Sensitivity)"];
        infoAuc.textContent = info.test_metrics["ROC AUC"];
        infoF1.textContent = info.test_metrics["F1-Score"];
      }
    } catch (error) {
      console.warn(
        "Model performansı API'den çekilemedi, varsayılan statik metrikler gösterilecek.",
        error,
      );
    }
  }

  loadModelInfo();
  updateFormSteps();
});
```
