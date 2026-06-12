# 🩺 Equilibrium: Diyabet Risk Analiz ve Değerlendirme Platformu

<div align="center">
  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80" alt="Equilibrium Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />

  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-Apache_2.0-D22128?style=for-the-badge)](LICENSE)
</div>

---

## 🏫 Akademik Bilgiler & Proje Künyesi

Bu proje, **Ankara Yıldırım Beyazıt Üniversitesi Mühendislik ve Doğa Bilimleri Fakültesi Endüstri Mühendisliği Bölümü** bünyesinde yürütülen **IE410 Advanced Computer Programming** dersi final çalışması kapsamında geliştirilmiştir.

* **Öğrenci:** İbrahim Hakkı Keleş (Öğrenci No: 22050351013)
* **Ders Danışmanı:** Prof. Dr. Servet Soygüder
* **Araştırma Görevlisi:** Bülent Herdem
* **Tarih:** Haziran 2026

---

## 📌 Proje Genel Bakışı (Project Overview)

**Equilibrium**, ABD Hastalık Kontrol ve Önleme Merkezleri (CDC) tarafından gerçekleştirilen **BRFSS 2015** (Behavioral Risk Factor Surveillance System) sağlık anket verileri üzerinde eğitilmiş yüksek performanslı bir makine öğrenmesi modelini temel alır. 

Geliştirilen bu web uygulaması, kullanıcıların demografik, klinik ve yaşam tarzı nitelikteki **21 farklı parametresini** alarak, diyabet geliştirme olasılıklarını **sunucusuz ve tamamen tarayıcı tarafında (client-side)** milisaniyeler içerisinde hesaplar ve kullanıcıya anlaşılır analizler sunar.

### 🌐 Neden İstemci Tabanlı (Client-Side) Tahmin Mimarisi?
Geleneksel makine öğrenmesi uygulamaları, tahmin üretmek için girdileri arka plandaki bir API sunucusuna (Python/Flask/FastAPI vb.) gönderir. Equilibrium ise eğitilmiş modelin tüm matematiksel katsayılarını ve standardizasyon parametrelerini tarayıcıya (TypeScript katmanına) gömer. Bu mimarinin avantajları:
1. **Sıfır Sunucu Maliyeti (Serverless):** API sunucusu ihtiyacı ortadan kalktığı için proje, GitHub Pages gibi statik web sunucularında ücretsiz olarak barındırılabilir.
2. **Kişisel Veri Gizliliği (Privacy-First):** Kullanıcının boyu, kilosu, yaş grubu veya kronik hastalık geçmişi gibi hassas sağlık verileri hiçbir sunucuya gönderilmez, tamamen kullanıcının bilgisayarında işlenir.
3. **Sıfır Gecikme (Zero Latency):** Ağ gecikmeleri (ping/network lag) olmaksızın anlık tahmin üretilir.

---

## 📐 Bireysel Risk Tahmini Matematiksel Altyapısı

Modelin tarayıcı tarafındaki tahmin motoru, Python scikit-learn kütüphanesinde eğitilen en iyi **Dengeli Lojistik Regresyon (Balanced Logistic Regression)** parametrelerini kullanır. 

Veri setindeki sürekli değişkenlerin (özellikle BMI) ve diğer kategorik özelliklerin katsayılarla uyumlu çalışabilmesi için önce **StandardScaler (Z-Score Normalizasyonu)** işlemi uygulanır ve ardından Sigmoid fonksiyonundan geçirilerek olasılık değeri üretilir:

$$z = \beta_0 + \sum_{i=1}^{21} \beta_i \cdot \left(\frac{X_i - \mu_i}{\sigma_i}\right)$$

$$P(\text{Diyabet} = 1) = \frac{1}{1 + e^{-z}}$$

### 📊 Model Parametreleri ve Katsayı Tablosu

Uygulamanın `src/utils/model.ts` dosyasında tanımlı olan ve CDC BRFSS veri setinin tamamında eğitilen katsayılar ($\beta_i$), ortalamalar ($\mu_i$) ve standart sapmalar ($\sigma_i$) aşağıda listelenmiştir:

| Sıra | Özellik (Feature) | Açıklama | Ortalama ($\mu_i$) | Standart Sapma ($\sigma_i$) | Katsayı ($\beta_i$) | Riske Etkisi (Yönü) |
|---|---|---|---|---|---|---|
| **0** | **Intercept ($\beta_0$)** | Sabit Terim (Kesim Noktası) | — | — | **-0.659673** | Sabit azaltıcı etki |
| 1 | `HighBP` | Yüksek Tansiyon Tanısı | 0.428995 | 0.494933 | 0.364257 | 📈 Risk Artırıcı |
| 2 | `HighChol` | Yüksek Kolesterol Tanısı | 0.424304 | 0.494237 | 0.287265 | 📈 Risk Artırıcı |
| 3 | `CholCheck` | Son 5 Yılda Kolesterol Kontrolü | 0.962418 | 0.190183 | 0.247702 | 📈 Risk Artırıcı |
| 4 | `BMI` | Vücut Kitle Endeksi | 28.377961 | 6.598277 | 0.490585 | 📈 Güçlü Risk Artırıcı |
| 5 | `Smoker` | Hayatı Boyunca ≥ 100 Sigara | 0.442861 | 0.496724 | 0.002148 | 📈 Hafif Risk Artırıcı |
| 6 | `Stroke` | İnme/Felç Geçirme Öyküsü | 0.040405 | 0.196908 | 0.037238 | 📈 Risk Artırıcı |
| 7 | `HeartDiseaseorAttack` | Kalp Hastalığı veya Enfarktüs | 0.094248 | 0.292173 | 0.073048 | 📈 Risk Artırıcı |
| 8 | `PhysActivity` | Son 30 Günde Fiziksel Aktivite | 0.756992 | 0.428900 | -0.019449 | 🛡️ Koruyucu Etki |
| 9 | `Fruits` | Günde ≥ 1 Porsiyon Meyve | 0.634426 | 0.481591 | -0.034836 | 🛡️ Koruyucu Etki |
| 10 | `Veggies` | Günde ≥ 1 Porsiyon Sebze | 0.811426 | 0.391170 | -0.007297 | 🛡️ Koruyucu Etki |
| 11 | `HvyAlcoholConsump` | Aşırı Alkol Tüketimi (Haftalık) | 0.055730 | 0.229399 | -0.172950 | 🛡️ İstatistiksel Koruyucu (Yanıltıcı katsayı)* |
| 12 | `AnyHealthcare` | Sağlık Sigortası Sahipliği | 0.951149 | 0.215556 | 0.013940 | 📈 Hafif Risk Artırıcı |
| 13 | `NoDocbcCost` | Maddi Nedenle Doktora Gidememe | 0.084624 | 0.278322 | 0.013420 | 📈 Hafif Risk Artırıcı |
| 14 | `GenHlth` | Genel Sağlık Durumu Algısı (1-5) | 2.511836 | 1.068375 | 0.618830 | 📈 En Güçlü Risk Artırıcı |
| 15 | `MentHlth` | Son 30 Günde Kötü Ruh Hali (Gün) | 3.189796 | 7.417595 | -0.032294 | 🛡️ Hafif Azaltıcı |
| 16 | `PhysHlth` | Son 30 Günde Kötü Beden Hali (Gün) | 4.250818 | 8.725625 | -0.058374 | 🛡️ Hafif Azaltıcı |
| 17 | `DiffWalk` | Yürümede/Merdiven Çıkmada Zorluk| 0.168160 | 0.374008 | 0.037371 | 📈 Risk Artırıcı |
| 18 | `Sex` | Cinsiyet (Erkek: 1, Kadın: 0) | 0.441013 | 0.496508 | 0.139168 | 📈 Risk Artırıcı |
| 19 | `Age` | Yaş Grubu (1-13 Skalası) | 8.032827 | 3.051380 | 0.457428 | 📈 Güçlü Risk Artırıcı |
| 20 | `Education` | Eğitim Durumu (1-6 Skalası) | 5.049925 | 0.986382 | -0.037379 | 🛡️ Koruyucu Etki |
| 21 | `Income` | Gelir Seviyesi (1-8 Skalası) | 6.050832 | 2.072656 | -0.119336 | 🛡️ Koruyucu Etki |

> \* *Not: `HvyAlcoholConsump` özelliğinin katsayısının negatif çıkması veri tabanındaki karmaşık değişken (confounding variable) etkilerinden kaynaklanmaktadır ve tıbbi bir öneri niteliği taşımaz.*

---

## 🔍 Metodoloji ve Veri Bilimi Aşamaları (CRISP-DM)

Proje süresince 3 bağımsız akademik çalışma (Study-1, Study-2, Study-3) yürütülmüştür. Bu çalışmaların detayları aşağıda özetlenmiştir:

```
[Veri Katmanı: CDC BRFSS (253,680 Kayıt)]
              │
              ▼
[STUDY-1: Keşifsel Veri Analizi ve Aykırı Değerler (IQR/Z-Score)]
              │
              ▼
[STUDY-2: Model Eleme (SVM, KNN, GB Elendi) & GridSearchCV (Nested 5-Fold CV)]
              │
              ▼
[STUDY-3: Dengesiz Sınıf Çözümleri (Class-Weight Balanced & SMOTE)]
              │
              ▼
[Açıklanabilir Yapay Zeka (XAI) & SHAP Analizleri]
              │
              ▼
[Arayüz Katmanı: TypeScript + React Client-Side Karar Motoru]
```

### 📈 Study-1: Veri Ön İşleme ve Aykırı Değer Analizi
* **Aykırı Değer Filtresi:** Z-Skoru ve IQR yöntemleriyle sürekli değişken olan BMI üzerindeki uç değerler analiz edilmiştir.
* **Korelasyon Analizi:** `GenHlth` (Genel Sağlık Algısı: 0.308), `HighBP` (Yüksek Tansiyon: 0.273) ve `BMI` (Vücut Kitle Endeksi: 0.221) diyabet ile en yüksek doğrusal ilişkiye sahip özellikler olarak tespit edilmiştir.
* **Özellik Seçimi:** SelectKBest (Ki-Kare), RFE (Recursive Feature Elimination) ve PCA (Temel Bileşenler Analizi) karşılaştırılarak veri setindeki tüm 21 özelliğin bilgi içeriğinin yüksek olduğu saptanmış ve modelde korunmasına karar verilmiştir.

### ⚖️ Study-2: Model Tarama ve Hiperparametre Optimizasyonu
* **Model Eleme Aşaması:** 6 farklı algoritma (Lojistik Regresyon, Karar Ağaçları, Rastgele Orman, Gradyan Artırma, SVM ve KNN) 5.000 örneklemlik alt kümede taranmıştır. 
  * *SVM* yavaşlığı (O(n²)), *KNN* bellek tüketimi, *Gradient Boosting* ise Random Forest ile benzer performansı daha yüksek işlem yüküyle vermesi sebebiyle elenmiştir.
* **GridSearchCV ve Nested Cross-Validation:** Geriye kalan 3 model (LR, DT, RF) 30.000 örneklemlik veri üzerinde hiperparametre taramasına tabi tutulmuştur. Sınıf dağılımını korumak adına **Stratified 5-Fold CV** kullanılmıştır. Karar Ağaçları modelinde maksimum derinlik sınırlaması yapılarak aşırı öğrenme (overfitting) engellenmiş ve test skoru %7.9 iyileştirilmiştir.

### 🎯 Study-3: Sınıf Dengesizliği (Class Imbalance) ve Doğruluk Paradoksu (Accuracy Paradox)
Veri setinde sağlıklı bireyler %86.07 iken, diyabet hastaları yalnızca %13.93 oranındadır (yaklaşık 6.2 : 1 oranında dengesizlik). 
* **Doğruluk Paradoksu:** Standart modeller eğitildiğinde **%86.4 doğruluk (accuracy)** oranına ulaşmakta, ancak diyabet hastalarını yakalama oranı (Recall/Duyarlılık) **%15 civarında kalmaktadır**. Yani model, neredeyse tüm diyabet hastalarını ıskalamaktadır.
* **Çözüm:** Modelin hata fonksiyonunda azınlık sınıfına (diyabetliler) daha yüksek ceza puanı veren `class_weight='balanced'` stratejisi uygulanmıştır. Böylece diyabetli hastaları doğru tahmin etme oranı (Recall) **%15.2'den %76.2'ye** yükseltilmiş ve ROC AUC skoru **0.8226** olarak optimize edilmiştir.

---

## 🛠️ Kullanılan Teknolojiler ve Kütüphaneler

### Veri Bilimi & Python Katmanı
* **Pandas & NumPy:** Veri işleme, manipülasyon ve matris hesaplamaları.
* **Scikit-Learn:** Model eğitimi, StandardScaler, GridSearchCV, Metrik hesaplama.
* **Matplotlib & Seaborn:** Keşifsel veri analiz grafikleri, ROC ve Korelasyon matrisleri.
* **SHAP (SHapley Additive exPlanations):** Global ve local model kararlarının matematiksel yorumlanması.
* **Pickle:** Eğitilen nihai modellerin serileştirilmesi.

### Arayüz & Web Geliştirme Katmanı
* **React 18 & Vite:** Hızlı, modüler ve bileşen tabanlı SPA (Single Page Application) geliştirme.
* **TypeScript:** Güvenli veri tipleri ve model katsayılarının hatasız yönetimi.
* **Tailwind CSS:** Modern, duyarlı (responsive) ve şık kullanıcı arayüzü tasarımı.
* **Framer Motion:** Yumuşak sayfa geçişleri, adım ilerlemeleri ve etkileşimli mikro-animasyonlar.
* **Lucide Icons:** Modern ve minimalist vektörel ikon kütüphanesi.

---

## 📂 Proje Dizin Yapısı

Web uygulamasının kaynak kodları ve bileşen yapısı aşağıdaki gibidir:

```
src/
├── assets/             # Logo ve görsel materyaller
├── components/         # Yeniden kullanılabilir React bileşenleri
│   ├── FormStep.tsx    # Kademeli form yapısının adımları
│   ├── ModelMetrics.tsx# Akademik performans ve doğruluk paradoksu paneli
│   └── ResultCard.tsx  # Tahmin sonuçları, olasılık barı ve etki analiz grafikleri
├── data/
│   └── questions.ts    # Formda sorulan Türkçe sorular ve seçenek veri yapısı
├── types.ts            # TypeScript arabirim tanımları ve UTF-8 Türkçe sözlük
├── utils/
│   └── model.ts        # Z-Skoru Normalizasyonu ve Lojistik Regresyon tahmin motoru
├── App.tsx             # Ana uygulama bileşeni ve durum yönetimi
├── main.tsx            # React DOM başlatma noktası
└── index.css           # Tailwind CSS ve özel cam efekti (glassmorphism) stilleri
```

---

## 💻 Yerel Geliştirme ve Kurulum Kılavuzu

Projenin web uygulamasını kendi bilgisayarınızda yerel olarak çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Gereksinimler
* Bilgisayarınızda **Node.js** (v18 veya üzeri tavsiye edilir) yüklü olmalıdır.

### Adım Adım Kurulum

1. **Projeyi Klonlayın:**
   ```bash
   git clone https://github.com/frydomesticus/diabetes_prediction.git
   cd diabetes_prediction
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Yerel Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   *Sunucu varsayılan olarak `http://localhost:5173` (veya terminalde belirtilen başka bir portta) yayına başlayacaktır.*

4. **Üretim Derlemesi Alın (Production Build):**
   ```bash
   npm run build
   ```
   *Bu komut, uygulamanın optimize edilmiş statik HTML, JS ve CSS dosyalarını `dist` klasörü içerisine çıkarır. Bu klasörü doğrudan herhangi bir statik sunucuda barındırabilirsiniz.*

---

## 🎨 Arayüz Tasarımı ve Kullanıcı Deneyimi (UX/UI)

Uygulama, modern web tasarımının en son trendleri kullanılarak tasarlanmıştır:
* **Glassmorphism (Cam Efekti):** Yarı saydam arka planlar ve yumuşak kenarlıklar ile derinlik hissi oluşturulmuştur.
* **Dark Mode:** Göz yormayan, kontrastı yüksek koyu tema renk paleti.
* **Responsive Layout:** Hem mobil cihazlarda hem de masaüstü ekranlarda kusursuz çalışan esnek ızgara (flex/grid) sistemi.
* **Canlı Grafik Analizleri:** Kullanıcının hangi alışkanlığının (örneğin BMI veya yüksek tansiyon) risk oranını ne kadar artırdığını gösteren anlık, renk kodlu yatay çubuk grafikler.
* **Akademik Performans Paneli:** Projenin arka planındaki makine öğrenmesi metriklerini (ROC eğrisi açıklaması, Recall değerleri, Doğruluk Paradoksu analizi) merak eden geliştiriciler ve akademisyenler için detaylı bir teknik bilgi sekmesi.

---

## 📄 Lisans

Bu proje **Apache License 2.0** lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.
