/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiabetesFeatures {
  HighBP: number;
  HighChol: number;
  CholCheck: number;
  BMI: number;
  Smoker: number;
  Stroke: number;
  HeartDiseaseorAttack: number;
  PhysActivity: number;
  Fruits: number;
  Veggies: number;
  HvyAlcoholConsump: number;
  AnyHealthcare: number;
  NoDocbcCost: number;
  GenHlth: number;
  MentHlth: number;
  PhysHlth: number;
  DiffWalk: number;
  Sex: number;
  Age: number;
  Education: number;
  Income: number;
}

export interface Contribution {
  feature: keyof DiabetesFeatures;
  label: string;
  desc: string;
  value: number;
  contribution: number;
  type: 'risk' | 'protective';
}

export interface PredictionResult {
  prediction: number;
  probability: number;
  risk_level: string;
  risk_color: string;
  contributions: Contribution[];
}

export interface ModelMetrics {
  Accuracy: string;
  Recall: string;
  F1Score: string;
  RocAuc: string;
  ClassWeightStrategy: string;
  DatasetSize: string;
}

export const FEATURE_METADATA: Record<keyof DiabetesFeatures, { label: string; desc: string }> = {
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
    desc: 'Son 5 yıl içerisinde kolesterol seviyesinin en az bir kez ölçülmüş olması.',
  },
  BMI: {
    label: 'Vücut Kitle İndeksi (BMI)',
    desc: 'Kilonuzun (kg) boyunuzun karesine (m²) oranı. (>30 obezite kabul edilir).',
  },
  Smoker: {
    label: 'Sigara Kullanımı',
    desc: 'Hayatı boyunca en az 100 adet (5 paket) sigara içmiş olmak.',
  },
  Stroke: {
    label: 'Felç Geçmişi',
    desc: 'Daha önce geçici ya da kalıcı inme/felç öyküsünün olması.',
  },
  HeartDiseaseorAttack: {
    label: 'Kalp Rahatsızlığı',
    desc: 'Koroner kalp hastalığı veya kalp krizi geçirmiş olmak.',
  },
  PhysActivity: {
    label: 'Fiziksel Aktivite',
    desc: 'Son 30 günde rutin iş dışında yürüyüş, koşu veya egzersiz yapmış olmak.',
  },
  Fruits: {
    label: 'Meyve Tüketimi',
    desc: 'Günde en az bir kez taze veya dondurulmuş meyve tüketmek.',
  },
  Veggies: {
    label: 'Sebze Tüketimi',
    desc: 'Günde en az bir kez yeşil yapraklı veya taze sebze tüketmek.',
  },
  HvyAlcoholConsump: {
    label: 'Aşırı Alkol Tüketimi',
    desc: 'Haftada erkekler için 14, kadınlar için 8 kadehten fazla alkol kullanımı.',
  },
  AnyHealthcare: {
    label: 'Sağlık Güvencesi',
    desc: 'SGK, özel sağlık sigortası veya benzeri kapsayıcı bir güvencenin olması.',
  },
  NoDocbcCost: {
    label: 'Maddi Engeller',
    desc: 'Son 12 ayda parasal imkansızlıklar nedeniyle doktora gidememiş olmak.',
  },
  GenHlth: {
    label: 'Genel Sağlık Değerlendirmesi',
    desc: 'Bireyin kendi sağlık durumunu 1 (Mükemmel) ile 5 (Kötü) arasında puanlaması.',
  },
  MentHlth: {
    label: 'Ruh Sağlığı Şikayeti',
    desc: 'Son 30 günün kaç gününde depresyon, stres veya ruhsal sıkıntı yaşandığı (0-30).',
  },
  PhysHlth: {
    label: 'Fiziksel Sağlık Şikayeti',
    desc: 'Son 30 günün kaç gününde hastalık, ağrı veya yaralanma yaşandığı (0-30).',
  },
  DiffWalk: {
    label: 'Yürüme/Merdiven Zorluğu',
    desc: 'Düz yolda yürürken veya merdiven çıkarken ciddi düzeyde zorlanma yaşamak.',
  },
  Sex: {
    label: 'Biyolojik Cinsiyet',
    desc: 'Doğuştan gelen biyolojik cinsiyet tercihi (Biyolojik Kadın / Biyolojik Erkek).',
  },
  Age: {
    label: 'Yaş Grubu',
    desc: '18 yaşından başlayan 13 farklı kategoride yaş grubu aralıkları.',
  },
  Education: {
    label: 'Eğitim Seviyesi',
    desc: 'Bireyin aldığı en yüksek eğitim derecesi (Okuma-yazma yok ile Üniversite arası).',
  },
  Income: {
    label: 'Yıllık Hane Geliri',
    desc: 'Tüm hane halkının toplam yıllık brüt kazanç grubu (1 (Düşük) ile 8 (Yüksek)).',
  },
};
