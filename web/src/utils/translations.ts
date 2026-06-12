/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TRANSLATIONS = {
  tr: {
    logoTitle: 'Equilibrium',
    logoSub: 'Diyabet Risk Analizi • IE410 Advanced Computer Programming',
    navPredict: 'Risk Hesaplayıcı',
    navDashboard: 'Model Gösterge Paneli',
    
    // Steps
    step1Label: 'Demografi',
    step1Title: 'Demografik ve Sosyal Bilgiler',
    step1Desc: 'Lütfen yaş grubu, biyolojik cinsiyete bağlı değişkenler ve eğitim/gelir düzeylerinizi belirtin.',
    
    step2Label: 'Vücut & Sağlık',
    step2Title: 'Vücut Ölçüleri ve Genel Sağlık',
    step2Desc: 'Biyolojik ölçümlerinizi ve kişisel sağlık durumunuzu belirleyin.',
    
    step3Label: 'Geçmiş',
    step3Title: 'Klinik ve Tıbbi Öykü',
    step3Desc: 'Lütfen resmi tıp kuruluşlarınca konmuş tanı veya vasküler durumlarınızı belirtin.',
    
    step4Label: 'Yaşam Tarzı',
    step4Title: 'Yaşam Tarzı ve Alışkanlıklar',
    step4Desc: 'Günlük beslenme, egzersiz alışkanlıklarınız ve sağlık sistemiyle olan ilişkileriniz.',
    
    // Buttons
    btnPrev: 'Geri',
    btnNext: 'İleri',
    btnSubmit: 'Analiz Raporunu Al',
    btnRestart: 'Yeniden Hesapla',
    
    // Form Step 1
    labelSex: 'Biyolojik Cinsiyet',
    sexFemale: 'Kadın',
    sexMale: 'Erkek',
    labelAge: 'Yaş Aralığı',
    labelEducation: 'Öğrenim Durumu',
    labelIncome: 'Yıllık Hane Gelir Düzeyi',
    
    // Form Step 2
    labelHeightWeight: 'Boy & Kilo (BMI Hesaplayıcı)',
    labelHeight: 'Boy',
    labelWeight: 'Kilo',
    labelBMI: 'Vücut Kitle İndeksi (BMI)',
    labelGenHlth: 'Genel Sağlık Değerlendirmeniz',
    descGenHlth: 'Genel sağlık durumunuzu nasıl nitelendirirsiniz (1 Mükemmel - 5 Kötü)?',
    genHlthExcellent: 'Mükemmel',
    genHlthVeryGood: 'Çok İyi',
    genHlthGood: 'İyi',
    genHlthFair: 'Orta',
    genHlthPoor: 'Kötü',
    labelMentHlth: 'Ruh Sağlığı Şikayeti',
    descMentHlth: 'Son 30 günde kaç gün stres, depresyon veya ruhsal açıdan kötü hissettiniz?',
    labelPhysHlth: 'Fiziksel Sağlık Şikayeti',
    descPhysHlth: 'Son 30 günde kaç gün hastalık, ağrı veya bedensel yaralanma yaşadınız?',
    unitDays: 'Gün',
    
    // Results
    resultHeader: 'Hesaplama Özeti',
    gaugeTitle: 'Diyabet Risk Göstergesi',
    gaugeLabel: 'Risk Olasılığı',
    riskLow: 'Düşük Risk',
    riskMedium: 'Orta Risk',
    riskHigh: 'Yüksek Risk',
    explanationLow: 'Biyometrik verileriniz, diyabet risk profilinizin düşük seviyede olduğunu göstermektedir. Mevcut sağlıklı yaşam tarzınızı korumanızı öneririz.',
    explanationMedium: 'Eldeki veriler, diyabet riskinizin orta düzeyde olduğunu göstermektedir. Yaşam tarzınızda ve metabolik değerlerinizde iyileştirilebilecek alanlar bulunmaktadır.',
    explanationHigh: 'Dikkat: Analiz sonuçları yüksek diyabet riski göstermektedir. Detaylı kontroller ve kesin tanı için en kısa sürede bir uzman hekime başvurmanızı öneririz.',
    
    // Contributions Tab
    contributionsTitle: 'Kişisel Risk Faktörleri Analizi',
    contributionsSub: 'Özelliklerin risk katsayılarına göre bireysel ağırlık dağılımı',
    tabRisk: 'Risk Artıranlar',
    tabProtective: 'Koruyucu Faktörler',
    noFactors: 'Bu kategoride belirleyici bir faktör saptanmadı.',
    posCorr: 'Riski Artıran Faktör',
    negCorr: 'Riski Azaltan (Koruyucu) Faktör',
    
    // Recommendations
    recTitle: 'Yaşam Tarzı ve Sağlık Önerileri',
    recHighBP: '<strong>Tansiyon Kontrolü:</strong> Yüksek tansiyonunuz bulunmaktadır. Tuz tüketimini sınırlandırmak ve hekiminizin önerdiği tedaviyi aksatmamak diyabet riskini azaltmaya yardımcı olur.',
    recHighChol: '<strong>Kolesterol Yönetimi:</strong> Yüksek kolesterol, insülin direncini ve damar sağlığı risklerini tetikler. Doymuş yağ tüketimini azaltmalı; lifli gıdalar, yulaf ve baklagiller tüketmeye özen göstermelisiniz.',
    recObese: '<strong>Kilo Yönetimi:</strong> Vücut kitle indeksiniz obezite aralığındadır. Vücut ağırlığınızda sağlayacağınız %5 ila %8 oranında bir azalma bile insülin duyarlılığınızı önemli ölçüde artıracaktır.',
    recOverweight: '<strong>Kilo Kontrolü:</strong> Vücut kitle indeksiniz fazla kilolu aralığındadır. Beslenmenizde porsiyon kontrolü uygulayarak kilonuzu dengede tutmanız önemli bir koruyucu önlemdir.',
    recNoPhys: '<strong>Fiziksel Aktivite:</strong> Düzenli fiziksel aktivite yapmadığınızı belirttiniz. Haftalık en az 150 dakika orta tempolu egzersiz (yürüyüş, bisiklet vb.) kaslarınızın glukoz kullanımını artırarak kan şekerini düzenler.',
    recSmoker: '<strong>Sigarayı Bırakma:</strong> Nikotin, hücre düzeyinde insülin reseptörlerine zarar vererek diyabet riskini artırır. Sigarayı bırakarak bu önemli risk faktörünü ortadan kaldırabilirsiniz.',
    recNoDiet: '<strong>Sebze ve Meyve Tüketimi:</strong> Günlük sebze ve meyve tüketiminizin düşük olduğunu belirttiniz. Lif ve antioksidan yönünden zengin beslenmek sindirim sistemini destekler ve kan şekeri dalgalanmalarını önler.',
    recAcademicNote: '<strong>Akademik Bilgi Notu:</strong> Bu platform tıbbi bir teşhis veya tedavi önerisi niteliği taşımamaktadır. Kesin tanı ve değerlendirme için lütfen uzman bir hekime başvurarak kan tetkiklerinizi (HbA1c vb.) yaptırınız.',
    
    // Dashboard
    dashHeader: 'Metrikler',
    dashTitle: 'Model Performans Raporu',
    dashSub: 'IE410 Advanced Computer Programming dersi kapsamında CDC BRFSS veri kümesiyle eğitilen Lojistik Regresyon modeli',
    dashModelStrategy: 'Sınıf ağırlıkları dengelenmiş (balanced) parametrik olasılık modeli',
    dashParamsHeader: 'Model Eğitim Parametreleri',
    dashParamSize: '<strong>Veri Seti Boyutu:</strong> CDC BRFSS 2015 anket verileri (253.680 adet kayıt)',
    dashParamWeight: '<strong>Sınıf Dengeleme:</strong> Veri setindeki dengesizliği gidermek için class_weight="balanced" parametresi kullanılmıştır.',
    dashParamSplit: '<strong>Veri Bölme Oranı:</strong> %80 Eğitim (202.944 satır), %20 Test (50.736 satır)',
    dashParamValidation: '<strong>Hiperparametre Optimizasyonu:</strong> Stratified 5-Fold Cross-Validation ve Grid Search uygulanmıştır.',
    
    // Paradox
    paradoxTitle: 'Doğruluk Paradoksu (Accuracy Paradox)',
    paradoxSub: 'Klinik taramalarda neden doğruluk tek başına yanıltıcı bir ölçüttür?',
    paradoxP1: 'CDC BRFSS popülasyon tarama verilerinde test grubunun <strong>%86.1\'i sağlıklı</strong>, yalnızca <strong>%13.9\'u diyabet</strong> hastasıdır.',
    paradoxP2: 'Herhangi bir makine öğrenmesi modeli kurmadan herkese peşinen "Diyabet Değil" diyen basit bir yaklaşım, test verisinde <strong>%86.1 doğruluk (accuracy)</strong> oranına ulaşırdı. Ancak hasta olan bireylerin hiçbirini tespit edemezdi (%0 Duyarlılık/Recall).',
    paradoxP3: 'Geliştirdiğimiz dengeli tahmin modeli, duyarlılık (Recall) oranını normal modeldeki %15.2 seviyesinden <strong>%76.2\'ye</strong> yükselterek, tarama süreçlerinde gerçek hastaları kaçırmayacak hassas bir eşiğe taşınmıştır.',
    
    // Global coefficients
    globalCoeffTitle: 'Genel Risk Katsayıları (Model Katsayı Ağırlıkları)',
    globalCoeffSub: 'Modelin diyabet olasılığını hesaplarken tüm veri kümesinde en çok önem verdiği özellikler',
    coeff1Name: 'Genel Sağlık Değerlendirmesi (GenHlth)',
    coeff2Name: 'Teşhis Edilmiş Yüksek Tansiyon (HighBP)',
    coeff3Name: 'Vücut Kitle İndeksi (BMI)',
    coeff4Name: 'Yaş Grubu (Age)',
    coeff5Name: 'Yüksek Kolesterol Teşhisi (HighChol)',

    // What-If Simulator
    whatIfTitle: 'Yaşam Tarzı Senaryo Simülatörü (Duyarlılık Analizi)',
    whatIfDesc: 'Aşağıdaki alışkanlıklarınızı veya ölçümlerinizi değiştirerek risk oranınızın nasıl değişeceğini anlık simüle edin:',
    whatIfBaseline: 'Başlangıç Riski',
    whatIfSimulated: 'Simüle Edilen Risk',
    whatIfImprovement: 'İyileşme Oranı',
    whatIfNoImprovement: 'Değişim Yok',
    whatIfHigherRisk: 'Artan Risk',
    whatIfLowerRisk: 'İyileşme',
    whatIfInstructions: 'Aşağıdaki butonları ve sürgüyü kullanarak alternatif yaşam tarzı senaryoları simüle edebilirsiniz:',
    
    // PDF Report
    pdfPatientNameLabel: 'Hastanın Adı Soyadı:',
    pdfPatientNamePlaceholder: 'Rapor için ad soyad giriniz...',
    pdfPrintBtn: 'Raporu Yazdır',
    pdfReportTitle: 'DİYABET RİSK DEĞERLENDİRME VE TAVSİYE RAPORU',
    pdfReportSub: 'IE410 Proje Çıktısı • Equilibrium Analiz Raporu',
    pdfGeneratedAt: 'Rapor Oluşturma Tarihi:',
    pdfSignature: 'Onaylayan Hekim / Analist İmzası:',
    
    // BMI WHO Categories
    bmiUnderweight: 'Zayıf',
    bmiNormal: 'Normal',
    bmiOverweight: 'Fazla Kilolu',
    bmiObese: 'Obez'
  },
  en: {
    logoTitle: 'Equilibrium',
    logoSub: 'Diabetes Risk Analysis • IE410 Advanced Computer Programming',
    navPredict: 'Risk Calculator',
    navDashboard: 'Model Dashboard',
    
    // Steps
    step1Label: 'Demography',
    step1Title: 'Demographic and Social Information',
    step1Desc: 'Please specify your age group, sex-related variables, and education/income levels.',
    
    step2Label: 'Body & Health',
    step2Title: 'Body Measurements and General Health',
    step2Desc: 'Define your biological mass and personal health status.',
    
    step3Label: 'History',
    step3Title: 'Clinical and Medical History',
    step3Desc: 'Please specify diagnoses or vascular conditions confirmed by medical organizations.',
    
    step4Label: 'Lifestyle',
    step4Title: 'Lifestyle and Habits',
    step4Desc: 'Daily diet, exercise cycle, and basic healthcare system interactions.',
    
    // Buttons
    btnPrev: 'Back',
    btnNext: 'Next',
    btnSubmit: 'Get Analysis Report',
    btnRestart: 'Recalculate',
    
    // Form Step 1
    labelSex: 'Biological Sex',
    sexFemale: 'Female',
    sexMale: 'Male',
    labelAge: 'Age Range',
    labelEducation: 'Education Level',
    labelIncome: 'Annual Household Income',
    
    // Form Step 2
    labelHeightWeight: 'Height & Weight (BMI Calculator)',
    labelHeight: 'Height',
    labelWeight: 'Weight',
    labelBMI: 'Body Mass Index (BMI)',
    labelGenHlth: 'General Health Self-Evaluation',
    descGenHlth: 'How would you describe your general health (1 Excellent - 5 Poor)?',
    genHlthExcellent: 'Excellent',
    genHlthVeryGood: 'Very Good',
    genHlthGood: 'Good',
    genHlthFair: 'Fair',
    genHlthPoor: 'Poor',
    labelMentHlth: 'Mental Health Issues',
    descMentHlth: 'How many of the past 30 days did you experience stress, depression, or mental decline?',
    labelPhysHlth: 'Physical Health Issues',
    descPhysHlth: 'How many of the past 30 days did you experience illness, pain, or physical injury?',
    unitDays: 'Days',
    
    // Results
    resultHeader: 'Calculation Summary',
    gaugeTitle: 'Diabetes Risk Indicator',
    gaugeLabel: 'Risk Probability',
    riskLow: 'Low Risk',
    riskMedium: 'Medium Risk',
    riskHigh: 'High Risk',
    explanationLow: 'Your biometric models show your diabetes risk profile is in the safe / low range. Maintain your current healthy routine.',
    explanationMedium: 'Our model places your diabetes risk in the moderate range. There are lifestyle areas that can be optimized for better health.',
    explanationHigh: 'Caution: The model detected a high diabetes susceptibility. We advise consulting a physician to measure HbA1c levels.',
    
    // Contributions Tab
    contributionsTitle: 'Personal Risk Factors Analysis',
    contributionsSub: 'Individual feature impact weights based on model coefficients',
    tabRisk: 'Risk Promoters',
    tabProtective: 'Protective Factors',
    noFactors: 'No defining factor was detected in this category.',
    posCorr: 'Risk Increasing Factor',
    negCorr: 'Risk Decreasing (Protective) Factor',
    
    // Recommendations
    recTitle: 'Lifestyle and Health Recommendations',
    recHighBP: '<strong>Blood Pressure Control:</strong> You have high blood pressure. Limiting sodium and taking prescribed medication drastically reduces diabetes onset risk.',
    recHighChol: '<strong>Cholesterol Management:</strong> High cholesterol triggers insulin resistance. Avoid trans-fats and increase fiber intake (oats, legumes).',
    recObese: '<strong>Weight Management:</strong> Your BMI is in the obese range. Losing just 5% to 8% of body weight significantly improves insulin sensitivity.',
    recOverweight: '<strong>Weight Control:</strong> Your BMI indicates you are overweight. Controlling carbohydrate portions to prevent weight gain is highly recommended.',
    recNoPhys: '<strong>Exercise Transition:</strong> You noted no regular exercise. Doing 150 minutes of moderate activity per week improves muscle glucose absorption.',
    recSmoker: '<strong>Smoking Cessation:</strong> Nicotine damages insulin receptors. Joining a smoking cessation program can eliminate this major risk factor.',
    recNoDiet: '<strong>Dietary Optimization:</strong> Daily fruit and vegetable intake is low. Dietary fiber and antioxidants stabilize glycemic fluctuations.',
    recAcademicNote: '<strong>Academic Disclaimer:</strong> This system is not a substitute for clinical diagnostics. Regardless of your score, consult a physician for official HbA1c testing.',
    
    // Dashboard
    dashHeader: 'Metrics',
    dashTitle: 'Academic Model Report',
    dashSub: 'Most balanced Logistic Regression trained with the CDC BRFSS dataset under IE410 Advanced Computer Programming',
    dashModelStrategy: 'Class weights balanced parametric probability model',
    dashParamsHeader: 'Analysis Specifications',
    dashParamSize: '<strong>Dataset Size:</strong> CDC BRFSS 2015 Health Indicators (253,680 records)',
    dashParamWeight: '<strong>Imbalance Strategy:</strong> Balanced class weights (class_weight="balanced") applied to training.',
    dashParamSplit: '<strong>Data Split Ratio:</strong> 80% Train (202,944 rows), 20% Test (50,736 rows)',
    dashParamValidation: '<strong>Validation Method:</strong> Hyperparameters optimized via Stratified 5-Fold Grid Search.',
    
    // Paradox
    paradoxTitle: 'Accuracy Paradox',
    paradoxSub: 'Why accuracy alone is a misleading metric in clinical screenings',
    paradoxP1: 'In the CDC BRFSS cohort, <strong>86.1% are healthy</strong> and only <strong>13.9% have diabetes</strong>.',
    paradoxP2: 'A naive baseline model predicting "Healthy" for everyone achieves a high **86.1% accuracy** but detects zero actual cases (0% Recall).',
    paradoxP3: 'By applying balanced class penalties, our optimized model trades minor accuracy to boost patient sensitivity (Recall) from 15.6% to **76.2%**, crucial for early screening.',
    
    // Global coefficients
    globalCoeffTitle: 'Global Coefficient Weights',
    globalCoeffSub: 'The most dominant feature coefficients utilized by the model to evaluate population-wide diabetes probability',
    coeff1Name: 'General Health Rating (GenHlth)',
    coeff2Name: 'High Blood Pressure Status (HighBP)',
    coeff3Name: 'Body Mass Index (BMI)',
    coeff4Name: 'Age Category (Age)',
    coeff5Name: 'High Cholesterol Diagnosis (HighChol)',

    // What-If Simulator
    whatIfTitle: 'Lifestyle Scenario Simulator (Sensitivity Analysis)',
    whatIfDesc: 'Simulate how changing your clinical measurements or habits would dynamically impact your diabetes risk:',
    whatIfBaseline: 'Baseline Risk',
    whatIfSimulated: 'Hypothetical Risk',
    whatIfImprovement: 'Improvement',
    whatIfNoImprovement: 'No Change',
    whatIfHigherRisk: 'Risk Increase',
    whatIfLowerRisk: 'Improvement',
    whatIfInstructions: 'Toggle the switches or move the slider below to simulate alternative scenarios:',
    
    // PDF Report
    pdfPatientNameLabel: "Patient's Full Name:",
    pdfPatientNamePlaceholder: 'Enter patient name for report...',
    pdfPrintBtn: 'Print Report',
    pdfReportTitle: 'DIABETES RISK ASSESSMENT AND RECOMMENDATIONS REPORT',
    pdfReportSub: 'IE410 Project Outcome • Equilibrium Analysis Output',
    pdfGeneratedAt: 'Report Generated On:',
    pdfSignature: 'Approving Physician / Analyst Signature:',
    
    // BMI WHO Categories
    bmiUnderweight: 'Underweight',
    bmiNormal: 'Normal',
    bmiOverweight: 'Overweight',
    bmiObese: 'Obese'
  }
};

export const FEATURE_METADATA_LOCALIZED = {
  tr: {
    HighBP: {
      label: 'Yüksek Tansiyon',
      desc: 'Bireyde doktor tarafından teşhis edilmiş yüksek tansiyon (hipertansiyon) bulunması.',
    },
    HighChol: {
      label: 'Yüksek Kolesterol',
      desc: 'Bireyde doktor tarafından teşhis edilmiş yüksek kolesterol bulunması.',
    },
    CholCheck: {
      label: 'Kolesterol Kontrolü',
      desc: 'Son 5 yılda en az bir kez kolesterol ölçümü yaptırmış olmak.',
    },
    BMI: {
      label: 'Vücut Kitle İndeksi (BMI)',
      desc: 'Kilonuzun boyunuzun karesine oranı (kg/m²). 30 ve üzeri obezite olarak kabul edilir.',
    },
    Smoker: {
      label: 'Sigara Kullanımı',
      desc: 'Hayatınız boyunca en az 100 adet (5 paket) sigara içmiş olmak.',
    },
    Stroke: {
      label: 'Felç Geçmişi',
      desc: 'Daha önce inme (felç) geçirmiş olmak.',
    },
    HeartDiseaseorAttack: {
      label: 'Kalp Rahatsızlığı',
      desc: 'Koroner kalp hastalığı veya kalp krizi öyküsünün bulunması.',
    },
    PhysActivity: {
      label: 'Fiziksel Aktivite',
      desc: 'Son 30 günde iş dışındaki zamanlarda düzenli egzersiz veya fiziksel aktivite yapmış olmak.',
    },
    Fruits: {
      label: 'Meyve Tüketimi',
      desc: 'Günde en az bir kez meyve tüketmek.',
    },
    Veggies: {
      label: 'Sebze Tüketimi',
      desc: 'Günde en az bir kez sebze tüketmek.',
    },
    HvyAlcoholConsump: {
      label: 'Aşırı Alkol Tüketimi',
      desc: 'Aşırı alkol tüketimi (Erkekler için haftada 14, kadınlar için 8 kadehten fazla).',
    },
    AnyHealthcare: {
      label: 'Sağlık Güvencesi',
      desc: 'Herhangi bir sağlık güvencesine (SGK, özel sigorta vb.) sahip olmak.',
    },
    NoDocbcCost: {
      label: 'Maddi Engeller',
      desc: 'Son 12 ayda mali nedenlerden dolayı doktora gidilemeyen bir durum yaşanmış olması.',
    },
    GenHlth: {
      label: 'Genel Sağlık Değerlendirmesi',
      desc: 'Kendi genel sağlık durumunuzu nasıl değerlendirdiğiniz (1: Mükemmel, 5: Kötü).',
    },
    MentHlth: {
      label: 'Ruh Sağlığı Şikayeti',
      desc: 'Son 30 günde stres, depresyon veya ruhsal açıdan kötü hissettiğiniz gün sayısı (0-30).',
    },
    PhysHlth: {
      label: 'Fiziksel Sağlık Şikayeti',
      desc: 'Son 30 günde hastalık, ağrı veya bedensel yaralanma nedeniyle fiziksel olarak kötü hissettiğiniz gün sayısı (0-30).',
    },
    DiffWalk: {
      label: 'Yürüme/Merdiven Zorluğu',
      desc: 'Yürürken veya merdiven çıkarken ciddi düzeyde zorlanma yaşanması.',
    },
    Sex: {
      label: 'Biyolojik Cinsiyet',
      desc: 'Biyolojik cinsiyet (Biyolojik Kadın / Biyolojik Erkek).',
    },
    Age: {
      label: 'Yaş Grubu',
      desc: 'Yaş grubu kategorisi (18 yaşından itibaren).',
    },
    Education: {
      label: 'Eğitim Seviyesi',
      desc: 'En yüksek eğitim derecesi.',
    },
    Income: {
      label: 'Yıllık Hane Geliri',
      desc: 'Yıllık hane halkı toplam brüt gelir grubu.',
    },
  },
  en: {
    HighBP: {
      label: 'High Blood Pressure',
      desc: 'Whether the individual has been diagnosed with high blood pressure by a medical doctor.',
    },
    HighChol: {
      label: 'High Cholesterol',
      desc: 'Whether the individual has been diagnosed with high blood cholesterol levels.',
    },
    CholCheck: {
      label: 'Cholesterol Check',
      desc: 'Whether the individual had a blood cholesterol test in the past 5 years.',
    },
    BMI: {
      label: 'Body Mass Index (BMI)',
      desc: 'The ratio of weight (kg) to the square of height (m²). (>30 indicates obesity).',
    },
    Smoker: {
      label: 'Smoking Status',
      desc: 'Whether the individual has smoked at least 100 cigarettes (5 packs) in their lifetime.',
    },
    Stroke: {
      label: 'Stroke History',
      desc: 'Whether the individual has ever had a stroke or temporary cerebral paralysis.',
    },
    HeartDiseaseorAttack: {
      label: 'Heart Condition',
      desc: 'Whether the individual has ever had coronary heart disease or a myocardial infarction (heart attack).',
    },
    PhysActivity: {
      label: 'Physical Activity',
      desc: 'Whether the individual engaged in regular physical activity or exercise in the past 30 days.',
    },
    Fruits: {
      label: 'Fruit Consumption',
      desc: 'Whether the individual consumes fresh or frozen fruit at least once a day.',
    },
    Veggies: {
      label: 'Vegetable Consumption',
      desc: 'Whether the individual consumes fresh vegetables or leafy greens at least once a day.',
    },
    HvyAlcoholConsump: {
      label: 'Heavy Alcohol Use',
      desc: 'Heavy drinking defined as >14 drinks/week for men, >8 drinks/week for women.',
    },
    AnyHealthcare: {
      label: 'Health Insurance',
      desc: 'Whether the individual has any healthcare coverage, public or private.',
    },
    NoDocbcCost: {
      label: 'Cost Barriers',
      desc: 'Whether the individual could not see a doctor in the past 12 months due to cost.',
    },
    GenHlth: {
      label: 'General Health Rating',
      desc: 'Subjective self-rating of health, scaled 1 (Excellent) to 5 (Poor).',
    },
    MentHlth: {
      label: 'Mental Health Days',
      desc: 'Number of days in the past 30 days with stress, depression, or emotional issues (0-30).',
    },
    PhysHlth: {
      label: 'Physical Health Days',
      desc: 'Number of days in the past 30 days with illnesses, pain, or bodily injuries (0-30).',
    },
    DiffWalk: {
      label: 'Difficulty Walking',
      desc: 'Whether the individual has serious difficulty walking or climbing stairs.',
    },
    Sex: {
      label: 'Biological Sex',
      desc: 'Biological sex assigned at birth (Biological Female / Biological Male).',
    },
    Age: {
      label: 'Age Bracket',
      desc: 'Age grouped into 13 distinct categories starting from 18 years old.',
    },
    Education: {
      label: 'Education Level',
      desc: 'Highest education degree completed (scaled 1 (No school) to 6 (College graduate)).',
    },
    Income: {
      label: 'Annual Income',
      desc: 'Annual household income bracket (scaled 1 (Under $10k) to 8 (Over $75k)).',
    },
  }
};
