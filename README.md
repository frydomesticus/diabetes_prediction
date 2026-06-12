# Equilibrium: Diyabet Risk Analiz ve Değerlendirme Platformu

<div align="center">
  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80" alt="Equilibrium Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-Apache_2.0-D22128?style=for-the-badge)](LICENSE)
</div>

---

## Akademik Bilgiler ve Proje Künyesi

Bu proje, **Ankara Yıldırım Beyazıt Üniversitesi Mühendislik ve Doğa Bilimleri Fakültesi Endüstri Mühendisliği Bölümü** bünyesinde yürütülen **IE410 Advanced Computer Programming** dersi final çalışması kapsamında geliştirilmiştir.

* **Öğrenci:** İbrahim Hakkı Keleş (Öğrenci No: 22050351013)
* **Ders Danışmanı:** Prof. Dr. Servet Soygüder
* **Araştırma Görevlisi:** Bülent Herdem
* **Tarih:** Haziran 2026

---

## Proje Genel Bakışı (Project Overview)

**Equilibrium**, ABD Hastalık Kontrol ve Önleme Merkezleri (CDC) tarafından gerçekleştirilen **BRFSS 2015** (Behavioral Risk Factor Surveillance System) sağlık anket verileri üzerinde eğitilmiş yüksek performanslı bir makine öğrenmesi modelini temel alır. 

Geliştirilen bu web uygulaması, kullanıcıların demografik, klinik ve yaşam tarzı nitelikteki **21 farklı parametresini** alarak, diyabet geliştirme olasılıklarını **sunucusuz ve tamamen tarayıcı tarafında (client-side)** milisaniyeler içerisinde hesaplar ve kullanıcıya anlaşılır analizler sunar.

### Neden İstemci Tabanlı (Client-Side) Tahmin Mimarisi?
Geleneksel makine öğrenmesi uygulamaları, tahmin üretmek için girdileri arka plandaki bir API sunucusuna (Python/Flask/FastAPI vb.) gönderir. Equilibrium ise eğitilmiş modelin tüm matematiksel katsayılarını ve standardizasyon parametrelerini tarayıcıya (TypeScript katmanına) gömer. Bu mimarinin avantajları:
1. **Sıfır Sunucu Maliyeti (Serverless):** API sunucusu ihtiyacı ortadan kalktığı için proje, GitHub Pages gibi statik web sunucularında ücretsiz olarak barındırılabilir.
2. **Kişisel Veri Gizliliği (Privacy-First):** Kullanıcının boyu, kilosu, yaş grubu veya kronik hastalık geçmişi gibi hassas sağlık verileri hiçbir sunucuya gönderilmez, tamamen kullanıcının bilgisayarında işlenir.
3. **Sıfır Gecikme (Zero Latency):** Ağ gecikmeleri (ping/network lag) olmaksızın anlık tahmin üretilir.

---

## Öne Çıkan Premium Özellikler

Uygulama, en üst düzey kullanıcı deneyimi için aşağıdaki gelişmiş özelliklerle donatılmıştır:

### 1. Çoklu Dil Desteği (TR / EN)
* Arayüzün sağ üst köşesindeki dil seçim butonu ile tüm platform anında Türkçe ve İngilizce arasında geçiş yapar.
* Tüm sorular, seçenekler, açıklayıcı metinler, tıbbi öneriler ve katsayı panelleri lokalize edilmiştir.
* Tarayıcının büyük harfe çevirme (`text-transform: uppercase`) kurallarını Türkçe dil standartlarına göre (örn. `i` -> `İ`, `ı` -> `I`) işleyebilmesi için, seçilen dil `document.documentElement.lang` ile dinamik olarak senkronize edilmiştir.

### 2. Duyarlılık Analizi (What-If Simulator)
* Sonuç sayfasında, kullanıcının o anki durumuna dayalı dinamik bir simülasyon paneli yer alır.
* Kullanıcılar BMI (Vücut Kitle İndeksi), Sigara kullanımı, Fiziksel Aktivite, Yüksek Tansiyon ve Yüksek Kolesterol değişkenlerini değiştirerek risklerinin gerçek zamanlı olarak nasıl değişeceğini simüle edebilir.
* Risk düşüşü durumunda yeşil renkli bir **İyileşme (Improvement)** rozeti, risk artışı durumunda ise kırmızı renkli bir **Artış (Increase)** rozeti görüntülenir.

### 3. Karanlık / Aydınlık Tema Toggleyicisi
* Sağ üstteki buton sayesinde obsidian siyahı cam (glassmorphism) karanlık tema ile yumuşak kum/kağıt tonlarındaki aydınlık tema arasında geçiş yapılabilir.
* Tailwind v4'ün `@custom-variant dark (&:where(.dark, .dark *));` özelliği kullanılarak, sistem renk tercihlerinden bağımsız olarak gövdeye eklenen `.dark` sınıfına göre kararlı bir tema yönetimi sağlanmıştır.

### 4. Profesyonel PDF Sağlık Raporu
* Tarayıcının yazdırma altyapısını kullanan `@media print` stil kuralları entegre edilmiştir.
* Kullanıcı ismini girip "Raporu Yazdır / Print Report" tıkladığında, menüler, butonlar ve simülatör gibi yazdırılması gerekmeyen bileşenler gizlenir. Sadece hastanın girmiş olduğu veriler, risk yüzdesi göstergesi ve tıbbi öneriler profesyonel bir hekim raporu formatında yazdırılır.

---

## Bireysel Risk Tahmini Matematiksel Altyapısı

Modelin tarayıcı tarafındaki tahmin motoru, Python scikit-learn kütüphanesinde eğitilen en iyi **Dengeli Lojistik Regresyon (Balanced Logistic Regression)** parametrelerini kullanır. 

Veri setindeki sürekli değişkenlerin (özellikle BMI) ve diğer kategorik özelliklerin katsayılarla uyumlu çalışabilmesi için önce **StandardScaler (Z-Score Normalizasyonu)** işlemi uygulanır ve ardından Sigmoid fonksiyonundan geçirilerek olasılık değeri üretilir:

$$z = \beta_0 + \sum_{i=1}^{21} \beta_i \cdot \left(\frac{X_i - \mu_i}{\sigma_i}\right)$$

$$P(\text{Diyabet} = 1) = \frac{1}{1 + e^{-z}}$$

### Model Parametreleri ve Katsayı Tablosu

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
| 11 | `HvyAlcoholConsump` | Aşırı Alkol Tüketimi (Haftalık) | 0.055730 | 0.229399 | -0.172950 | 🛡️ İstatistiksel Koruyucu |
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

---

## Metodoloji ve Veri Bilimi Aşamaları (CRISP-DM)

Proje süresince 3 bağımsız akademik çalışma (Study-1, Study-2, Study-3) yürütülmüştür. Bu çalışmaların detayları aşağıda özetlenmiştir:

```
[Veri Katmanı: CDC BRFSS (253,680 Kayıt)]
              │
              ▼
[STUDY-1: Keşifsel Veri Analizi ve Aykırı Değerler (IQR/Z-Score)]
              │
              ▼
[STUDY-2: Model Eleme & GridSearchCV (Nested 5-Fold CV)]
              │
              ▼
[STUDY-3: Dengesiz Sınıf Çözümleri (Class-Weight Balanced)]
              │
              ▼
[Açıklanabilir Yapay Zeka (XAI) & SHAP Analizleri]
              │
              ▼
[Arayüz Katmanı: TypeScript + React Client-Side Karar Motoru]
```

### Study-1: Veri Ön İşleme ve Aykırı Değer Analizi
* **Aykırı Değer Filtresi:** Z-Skoru ve IQR yöntemleriyle sürekli değişken olan BMI üzerindeki uç değerler analiz edilmiştir.
* **Korelasyon Analizi:** `GenHlth` (Genel Sağlık Algısı: 0.308), `HighBP` (Yüksek Tansiyon: 0.273) ve `BMI` (Vücut Kitle Endeksi: 0.221) diyabet ile en yüksek doğrusal ilişkiye sahip özellikler olarak tespit edilmiştir.
* **Özellik Seçimi:** SelectKBest (Ki-Kare), RFE ve PCA karşılaştırılarak veri setindeki tüm 21 özelliğin bilgi içeriğinin yüksek olduğu saptanmış ve modelde korunmasına karar verilmiştir.

### Study-2: Model Tarama ve Hiperparametre Optimizasyonu
* **Model Eleme Aşaması:** 6 farklı algoritma (Lojistik Regresyon, Karar Ağaçları, Rastgele Orman, Gradyan Artırma, SVM ve KNN) 5.000 örneklemlik alt kümede taranmıştır. SVM ve KNN yüksek işlem yükü sebebiyle elenmiştir.
* **GridSearchCV ve Nested Cross-Validation:** Geriye kalan modeller 30.000 örneklemlik veri üzerinde hiperparametre taramasına tabi tutulmuştur. Sınıf dağılımını korumak adına **Stratified 5-Fold CV** kullanılmıştır.

### Study-3: Sınıf Dengesizliği (Class Imbalance) ve Doğruluk Paradoksu (Accuracy Paradox)
Veri setinde sağlıklı bireyler %86.07 iken, diyabet hastaları yalnızca %13.93 oranındadır.
* **Doğruluk Paradoksu:** Standart modeller eğitildiğinde %86.4 doğruluk oranına ulaşmakta, ancak diyabet hastalarını yakalama oranı (Recall/Duyarlılık) %15 civarında kalmaktadır.
* **Çözüm:** Modelin hata fonksiyonunda azınlık sınıfına (diyabetliler) daha yüksek ceza puanı veren `class_weight='balanced'` stratejisi uygulanmıştır. Böylece diyabetli hastaları doğru tahmin etme oranı (Recall) **%15.2'den %76.2'ye** yükseltilmiş ve ROC AUC skoru **0.8226** olarak optimize edilmiştir.

---

## Proje Genel Klasör Yapısı (Project Structure)

Proje, hem veri bilimi çalışmalarını hem de tarayıcı tabanlı tahmin uygulamasını içeren monorepo tarzı bir yapıya sahiptir:

```
├── data/               # CDC BRFSS 2015 ham veri setleri (raw/)
├── notebooks/          # Model ön işleme ve eğitim çalışmaları (Study-1, Study-2, Study-3)
├── outputs/            # Eğitilen modelin katsayıları ve istatistiksel parametreleri
├── scripts/            # Veri ön işleme ve model eğitim betikleri
├── docs/               # Akademik ve teknik dökümantasyonlar
└── web/                # React + Vite + TypeScript web uygulamasının ana klasörü
    ├── src/
    │   ├── assets/     # Logo ve görsel materyaller
    │   ├── types.ts    # TypeScript arabirim tanımları
    │   ├── utils/
    │   │   ├── model.ts        # Z-Skoru ve Lojistik Regresyon tahmin motoru
    │   │   └── translations.ts # Türkçe/İngilizce dil sözlüğü
    │   ├── App.tsx     # Ana uygulama ve durum yönetimi
    │   └── main.tsx    # React DOM başlatma noktası
    ├── index.html      # Favicon tanımlı ana şablon
    └── tsconfig.json   # TypeScript yapılandırması
```

---

## Yerel Geliştirme ve Kurulum Kılavuzu

Projenin web uygulamasını kendi bilgisayarınızda yerel olarak çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Gereksinimler
* Bilgisayarınızda **Node.js** (v18 veya üzeri tavsiye edilir) yüklü olmalıdır.

### Adım Adım Kurulum

1. **Projeyi Klonlayın:**
   ```bash
   git clone https://github.com/frydomesticus/diabetes_prediction.git
   cd diabetes_prediction/web
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Yerel Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   *Sunucu varsayılan olarak `http://localhost:3000/` adresinde yayına başlayacaktır.*

4. **Üretim Derlemesi Alın (Production Build):**
   ```bash
   npm run build
   ```
   *Bu komut, uygulamanın optimize edilmiş statik HTML, JS ve CSS dosyalarını `dist` klasörü içerisine çıkarır.*

---

## Lisans

Bu proje **Apache License 2.0** lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.
