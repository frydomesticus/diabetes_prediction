# 🎤 Diabetes Prediction — Sunum Planı

## Sunum Yapısı (15-20 dakika)

---

## 📌 Slayt 1: Kapak
- **IE410 — Advanced Computer Programming**
- **Diabetes Prediction Using Machine Learning**
- İbrahim Hakkı Keleş — Mayıs 2026
- Ankara Yıldırım Beyazıt Üniversitesi

---

## 📌 Slayt 2: Problem Tanımı (30 saniye)
**Söyle:** "Dünya genelinde 537 milyon yetişkin diyabet hastası. Erken teşhis hayat kurtarıyor ama mevcut araştırmalar küçük ve yetersiz veri setleriyle yapılıyor."

**Vurgula:**
- Diyabet = sessiz katil (komplikasyonlar: böbrek, körlük, kalp)
- Erken müdahale riski %58 azaltabiliyor (DPP çalışması)
- **Bu projenin amacı:** ML ile erken risk tespiti

---

## 📌 Slayt 3: Veri Seti Seçimi — CAN ALICI! ⭐
**Söyle:** "Klasik yaklaşım Pima Indians veri setini kullanır — 768 hasta, sadece tıbbi. Ben CDC BRFSS kullandım — 253 bin kişi, tıbbi + yaşam tarzı + sosyoekonomik."

| | Pima Indians | CDC BRFSS (Bizim) |
|---|---|---|
| Kayıt | 768 | **253,680** (330x) |
| Özellik | 8 (sadece tıbbi) | **21 (çok boyutlu)** |
| Popülasyon | Pima kadınları | **ABD genel** |

**Vurgula:** "Bu veri seti sayesinde diyabetin sadece tıbbi değil, yaşam tarzı ve gelir düzeyiyle de ilişkili olduğunu gösterebildik."

> [!IMPORTANT]
> Bu slayt hocayı ETKİLEYECEK en önemli nokta. Herkes Pima kullanıyor — sen 330 kat daha büyük, çok boyutlu bir veri setiyle çalıştın.

---

## 📌 Slayt 4: Proje Mimarisi (15 saniye)
**3 Study pipeline'ını göster:**
```
Study-1 (Veri Hazırlama) → Study-2 (Model Seçimi) → Study-3 (Eğitim & Sonuç)
```
- MVC yapısı: data/ → notebooks/ → outputs/
- "Her adımda sistematik, veri tabanlı kararlar aldık"

---

## 📌 Slayt 5: Study-1 — Temel Bulgular (1 dakika)
**Söyle:** "253 bin satır, 21 özellik, sıfır eksik değer."

**3 kritik bulgu:**
1. **Sınıf dengesizliği:** %86 sağlıklı vs %14 diyabetli (6.2:1)
2. **Tıbbi ilişkiler:** HighBP (%67 vs %39), BMI (32 vs 28)
3. **Sosyoekonomik ilişki:** Düşük gelir → yüksek diyabet riski

**Korelasyon tablosu göster:**
- GenHlth (0.308), HighBP (0.273), BMI (0.221)
- Income (-0.159), Education (-0.130) → NEGATİF korelasyon!

**Vurgula:** "Gelir ve eğitim seviyesi düştükçe diyabet riski artıyor — bu sadece CDC veri setiyle gösterilebilir."

---

## 📌 Slayt 6: Study-2 — Model Seçimi (2 dakika)

### 4 Adımlı Sistematik Pipeline:

**Adım 1 — Tarama (6 model, 5K örnek):**
- LR, DT, RF, GB, SVM, KNN test edildi
- Hepsi %85-87 arasında → benzer

**Adım 2 — Eleme (3 model elendi):**
- ❌ SVM: O(n²) → 253K satırda saatler sürer
- ❌ KNN: En düşük accuracy + bellek sorunu
- ❌ GB: RF ile benzer ama daha yavaş

**Adım 3 — Tuning (GridSearchCV, 30K örnek):**
- DT: max_depth=5 → **+%7.9 iyileşme** (overfitting önlendi!)

**Adım 4 — Final karşılaştırma**

> [!TIP]
> Hoca "neden SVM elendi?" diye soracak. Cevap: "O(n²) karmaşıklık. 253K² = 64 milyar işlem. Telco'da 51K ile kullandık ama burada pratik değil."

---

## 📌 Slayt 7: Study-3 — ACCURACY PARADOX ⭐⭐⭐

**Bu sunumun EN ETKİLEYİCİ kısmı!**

**Söyle:** "3 modeli eğittik. Hepsi %86 accuracy verdi. Harika değil mi? HAYIR!"

| Model | Accuracy | Recall (Diyabetli) |
|-------|----------|-------------------|
| LR | %86.2 | **%15.8** |
| DT | %86.4 | **%13.1** |
| RF | %86.4 | **%8.8** |

**Dramatik açıklama:**
> "Bu modeller 100 diyabetli hastadan sadece 9-16'sını yakalıyor. Kalan 84-91'ini 'sağlıklısınız' diye eve gönderiyor. Bu hastalar tedavi görmeyecek, komplikasyonlar gelişecek."

> "%86 accuracy bir YANILSAMA. Çünkü veride zaten %86 sağlıklı var. Hiç model kullanmadan, herkese 'sağlıklı' desem de %86 accuracy alırım. Buna **Accuracy Paradox** denir."

> [!WARNING]
> Bu noktada SUS ve hocaya baksın. Bu "aha moment" — herkes accuracy'nin iyi bir metrik olduğunu sanır. Sen bunun yanıltıcı olduğunu kanıtlıyorsun.

---

## 📌 Slayt 8: Çözüm — class_weight='balanced' ⭐⭐

**Söyle:** "Çözüm basit ama çok etkili: her diyabetli örneği 3.59 kat daha önemli kılıyoruz."

```
weight_sağlıklı  = 253,680 / (2 × 218,334) = 0.58
weight_diyabetli = 253,680 / (2 × 35,346)  = 3.59
```

**Sonuç tablosu — BÜYÜK GÖSTER:**

| Model | Default Recall | Balanced Recall | İyileşme |
|-------|---------------|----------------|----------|
| LR | %15.8 | **%76.1** | **+%381** |
| DT | %13.1 | **%77.0** | **+%489** |
| RF | %8.8 | **%76.8** | **+%773** |

**Söyle:** "Recall %380-773 arttı. Artık 100 diyabetliden 76'sını yakalıyoruz."

**AUC sabit kaldı:** 0.82 → modelin ayırt etme yeteneği korundu, sadece karar eşiği değişti.

---

## 📌 Slayt 9: Confusion Matrix Karşılaştırma (görsel)

Notebook'tan Default vs Balanced Confusion Matrix'leri göster.
- Default: FN çok yüksek (kaçırılan hasta)  
- Balanced: TP çok arttı (yakalanan hasta)

**Söyle:** "Sol taraf: modeli eve gönderdiğimiz hastalar. Sağ taraf: yakaladığımız hastalar. Balanced ile sağ taraf dramatik arttı."

---

## 📌 Slayt 10: Feature Importance (1 dakika)

**Top 5 göster:**
1. GenHlth (0.235) — Genel sağlık algısı
2. HighBP (0.216) — Yüksek tansiyon
3. BMI (0.137) — Obezite
4. HighChol (0.099) — Kolesterol
5. Age (0.095) — Yaş

**Söyle:** "Top 3 tek başına %58.8 açıklıyor. Ve bu bulgular tıp literatürüyle tutarlı — metabolik sendrom bileşenleri (tansiyon + obezite + kolesterol) diyabetin bilinen risk faktörleri."

**Vurgula:** "Income ve Education da top 10'da — sosyoekonomik faktörlerin önemi, CDC veri setiyle kanıtlandı."

---

## 📌 Slayt 11: Demo (30 saniye)

Notebook'tan demo hücresini göster:
- Obez, tansiyonlu, düşük gelirli hasta profili
- Model tahmini: "YÜKSEK DİYABET RİSKİ"
- **Söyle:** "Bu modeli bir kliniğe entegre ederseniz, hastalar muayeneden önce risk skorunu görebilir."

---

## 📌 Slayt 12: Başarı Kriterleri (son slayt)

| Metrik | Hedef | Ulaşılan | Durum |
|--------|-------|----------|-------|
| AUC | > 0.80 | **0.82** | ✅ Aşıldı |
| Recall | > 0.70 | **0.76** | ✅ Aşıldı |
| Feature | Top 5 | GenHlth, HighBP, BMI, HighChol, Age | ✅ Tamamlandı |

**Kapanış cümlesi:**
> "Tıpta accuracy değil, Recall önemlidir. %86 accuracy ile %15 Recall veren bir model işe yaramaz. Biz accuracy'den feragat ederek Recall'ü %380 artırdık — ve bu, gerçek dünyada hayat kurtaran bir karardır."

---

## 🔥 SUNUMDA ÖNE ÇIKARILACAK 5 CAN ALICI NOKTA

1. **253K veri seti** — Pima'nın 330 katı. Herkes Pima kullanıyor, sen gerçek dünya verisiyle çalıştın.

2. **Accuracy Paradox** — %86 accuracy'nin aslında işe yaramadığını kanıtlamak. Bu bilgiyi bilen az öğrenci var.

3. **Recall %380 artış** — class_weight='balanced' ile dramatik iyileşme. Basit bir parametre değişikliğinin gücü.

4. **Sosyoekonomik faktörler** — Gelir ve eğitim seviyesi diyabeti etkiliyor. Bu sadece CDC veri setiyle gösterilebilir.

5. **Tıp literatürüyle tutarlılık** — Feature Importance sonuçları bilinen risk faktörleriyle örtüşüyor → model güvenilir.

---

## ⚠️ HOCA SORARSA

**S: "Neden SMOTE kullanmadınız?"**
> class_weight='balanced' veri yapısını bozmadan çalışır. SMOTE sentetik veri üretir — 253K veride 35K diyabetli zaten yeterli, yapay veri üretmeye gerek yok.

**S: "Accuracy düştü, bu kötü değil mi?"**
> Tıpta Recall > Accuracy. Yanlış alarm (FP) = ek test. Kaçırılan hasta (FN) = tedavisiz kalma, komplikasyon, ölüm riski.

**S: "Bu model gerçekte kullanılabilir mi?"**
> Evet. .pkl dosyası olarak kaydedildi. REST API ile web servisine dönüştürülebilir. Ama klinik onay için daha fazla validasyon gerekir (FDA/CE gibi).

**S: "Pima ile karşılaştırma yaptınız mı?"**
> Doğrudan karşılaştırma yapmadık çünkü farklı özellik setleri var. Ama literatürdeki Pima çalışmaları genelde AUC 0.75-0.80 arasında — bizim 0.82 ile rekabetçiyiz, üstelik 330x daha büyük ve çok boyutlu bir veri setiyle.
