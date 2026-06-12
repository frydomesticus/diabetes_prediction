# Equilibrium Projesine Katkıda Bulunma Rehberi

Equilibrium projesine katkıda bulunmak istediğiniz için teşekkür ederiz. Bu belge, yerel geliştirme ortamınızı kurmanıza ve kodlama standartlarımıza uyum sağlamanıza yardımcı olmak amacıyla hazırlanmıştır.

---

## 📂 Proje Yapısı

Proje iki ana katmandan oluşmaktadır:

1. **Veri Bilimi ve Makine Öğrenmesi Katmanı (`data/`, `notebooks/`, `scripts/`):** Python ile CDC BRFSS veri seti üzerinde model analizi, hiperparametre optimizasyonu ve katsayı tespiti yapılan kısımdır.
2. **Kullanıcı Arayüzü Katmanı (`web/`):** Model katsayılarının istemci tarafında (client-side) çalıştırıldığı React + Vite + TypeScript web uygulamasıdır.

---

## 🐍 1. Veri Bilimi Katmanı Kurulumu (Python)

Makine öğrenmesi modellerini yeniden eğitmek, veri görselleştirme Jupyter defterlerini çalıştırmak veya veri analizi yapmak için Python geliştirme ortamını kurmanız gerekir:

### Gereksinimler

- Python v3.9 veya üzeri sürüm.

### Geliştirme Ortamı Kurulumu

1. Projenin ana dizininde bir sanal ortam (virtual environment) oluşturun ve aktif edin:

   ```bash
   # Windows için
   python -m venv .venv
   .\.venv\Scripts\activate

   # macOS / Linux için
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Gerekli kütüphaneleri yükleyin:
   ```bash
   pip install -r requirements.txt
   ```
3. Jupyter Notebook arayüzünü başlatarak çalışmaları inceleyin veya düzenleyin:
   ```bash
   jupyter notebook
   ```

### Veri Bilimi Aşamaları

Katkıda bulunurken veri analitiği adımlarının şu sırayla incelenmesi tavsiye edilir:

- **Study-1:** Keşifsel Veri Analizi, korelasyonlar ve aykırı değer analizi.
- **Study-2:** Model seçimi, hiperparametre optimizasyonu ve Stratified K-Fold çapraz doğrulama süreçleri.
- **Study-3:** Sınıf dengesizliği (class imbalance) çözümleri ve Lojistik Regresyon katsayı analizi.

---

## 💻 2. Arayüz Katmanı Kurulumu (React + Vite + TS)

İstemci tarafındaki tahmin motorunu, simülasyon panellerini ve tasarımı güncellemek için web arayüzü ortamını kurmanız gerekir:

### Gereksinimler

- Node.js v18 veya üzeri sürüm.

### Geliştirme Ortamı Kurulumu

1. `web` klasörüne geçiş yapın:
   ```bash
   cd web
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Yerel geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Uygulama yerel olarak `http://localhost:3000/` adresinde çalışmaya başlayacaktır.

---

## 📝 Kodlama Standartları ve Git Kuralları

- **Tip Güvenliği (TypeScript):** React tarafında yazılan tüm yeni bileşenlerin ve veri yapılarının tip tanımları `types.ts` dosyası kurallarına uygun olmalıdır. Kod göndermeden önce mutlaka statik tip kontrollerini çalıştırın:
  ```bash
  npm run lint
  ```
- **Çoklu Dil Desteği:** Yeni bir metin eklediğinizde veya düzenlediğinizde, `src/utils/translations.ts` dosyasında hem `tr` hem de `en` sözlük yapılarını güncellediğinizden emin olun.
- **Emoji Kullanımı:** Arayüz metinlerinde, başlıklarında veya butonlarında emoji kullanılmamaktadır. Lütfen ekleyeceğiniz yeni metinlerin resmi, sade ve akademik standartlarda olmasına dikkat edin.
- **Yazma Kuralları (Commit Messages):** Gönderilen commit mesajlarının açıklayıcı ve amaca yönelik olması gerekmektedir (Örn. `git commit -m "Fix layout contrast bug inside light theme"`).
