/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiabetesFeatures, PredictionResult, Contribution, FEATURE_METADATA } from '../types';

// Study-3'te eğitilen en iyi Logistic Regression modelinin ve StandardScaler nesnesinin gerçek parametreleri
const MODEL_STATS: Record<keyof DiabetesFeatures, { mean: number; std: number; beta: number }> = {
  HighBP: { mean: 0.428995, std: 0.494933, beta: 0.364257 },
  HighChol: { mean: 0.424304, std: 0.494237, beta: 0.287265 },
  CholCheck: { mean: 0.962418, std: 0.190183, beta: 0.247702 },
  BMI: { mean: 28.377961, std: 6.598277, beta: 0.490585 },
  Smoker: { mean: 0.442861, std: 0.496724, beta: 0.002148 },
  Stroke: { mean: 0.040405, std: 0.196908, beta: 0.037238 },
  HeartDiseaseorAttack: { mean: 0.094248, std: 0.292173, beta: 0.073048 },
  PhysActivity: { mean: 0.756992, std: 0.428900, beta: -0.019449 },
  Fruits: { mean: 0.634426, std: 0.481591, beta: -0.034836 },
  Veggies: { mean: 0.811426, std: 0.391170, beta: -0.007297 },
  HvyAlcoholConsump: { mean: 0.055730, std: 0.229399, beta: -0.172950 },
  AnyHealthcare: { mean: 0.951149, std: 0.215556, beta: 0.013940 },
  NoDocbcCost: { mean: 0.084624, std: 0.278322, beta: 0.013420 },
  GenHlth: { mean: 2.511836, std: 1.068375, beta: 0.618830 },
  MentHlth: { mean: 3.189796, std: 7.417595, beta: -0.032294 },
  PhysHlth: { mean: 4.250818, std: 8.725625, beta: -0.058374 },
  DiffWalk: { mean: 0.168160, std: 0.374008, beta: 0.037371 },
  Sex: { mean: 0.441013, std: 0.496508, beta: 0.139168 },
  Age: { mean: 8.032827, std: 3.051380, beta: 0.457428 },
  Education: { mean: 5.049925, std: 0.986382, beta: -0.037379 },
  Income: { mean: 6.050832, std: 2.072656, beta: -0.119336 },
};

// Modelin gerçek intercept (kesim noktası) sabiti
const INTERCEPT = -0.659673;

/**
 * Diyabet riskini tarayıcı tarafında hesaplar ve risk faktörlerini listeler.
 */
export function predictDiabetes(features: DiabetesFeatures): PredictionResult {
  let z = INTERCEPT;
  const contributions: Contribution[] = [];

  (Object.keys(MODEL_STATS) as Array<keyof DiabetesFeatures>).forEach((key) => {
    const value = features[key];
    const { mean, std, beta } = MODEL_STATS[key];
    const scaledValue = (value - mean) / std;
    const contributionValue = beta * scaledValue;

    z += contributionValue;

    const meta = FEATURE_METADATA[key];

    contributions.push({
      feature: key,
      label: meta?.label || key,
      desc: meta?.desc || '',
      value,
      contribution: contributionValue,
      type: contributionValue > 0 ? 'risk' : 'protective',
    });
  });

  // Sigmoid Olasılık Fonksiyonu
  const probability = 1 / (1 + Math.exp(-z));
  const prediction = probability >= 0.5 ? 1 : 0;

  // Risk Seviyesi Belirleme
  let risk_level = 'Düşük Risk';
  let risk_color = '#10B981'; // Yeşil

  if (probability < 0.35) {
    risk_level = 'Düşük Risk';
    risk_color = '#10B981';
  } else if (probability < 0.60) {
    risk_level = 'Orta Risk';
    risk_color = '#F59E0B'; // Turuncu
  } else {
    risk_level = 'Yüksek Risk';
    risk_color = '#EF4444'; // Kırmızı
  }

  // Katkıları mutlak değere göre büyükten küçüğe sırala
  const sortedContributions = contributions.sort(
    (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
  );

  return {
    prediction,
    probability,
    risk_level,
    risk_color,
    contributions: sortedContributions,
  };
}
