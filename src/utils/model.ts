/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiabetesFeatures, PredictionResult, Contribution, FEATURE_METADATA } from '../types';

// Statistical parameters calculated from the CDC BRFSS 2015 dataset
// For scaling: (value - mean) / std
const MODEL_STATS: Record<keyof DiabetesFeatures, { mean: number; std: number; beta: number }> = {
  HighBP: { mean: 0.429, std: 0.495, beta: 0.762 },
  HighChol: { mean: 0.424, std: 0.494, beta: 0.548 },
  CholCheck: { mean: 0.963, std: 0.189, beta: 0.145 },
  BMI: { mean: 28.382, std: 6.608, beta: 0.585 },
  Smoker: { mean: 0.443, std: 0.497, beta: 0.048 },
  Stroke: { mean: 0.041, std: 0.197, beta: 0.162 },
  HeartDiseaseorAttack: { mean: 0.094, std: 0.292, beta: 0.285 },
  PhysActivity: { mean: 0.757, std: 0.429, beta: -0.124 },
  Fruits: { mean: 0.634, std: 0.482, beta: -0.045 },
  Veggies: { mean: 0.811, std: 0.391, beta: -0.078 },
  HvyAlcoholConsump: { mean: 0.056, std: 0.230, beta: -0.115 },
  AnyHealthcare: { mean: 0.951, std: 0.216, beta: 0.035 },
  NoDocbcCost: { mean: 0.084, std: 0.278, beta: 0.078 },
  GenHlth: { mean: 2.511, std: 1.068, beta: 0.684 },
  MentHlth: { mean: 3.185, std: 7.413, beta: 0.056 },
  PhysHlth: { mean: 4.242, std: 8.714, beta: 0.092 },
  DiffWalk: { mean: 0.168, std: 0.374, beta: 0.245 },
  Sex: { mean: 0.440, std: 0.496, beta: 0.215 },
  Age: { mean: 8.032, std: 3.054, beta: 0.482 },
  Education: { mean: 4.823, std: 0.986, beta: -0.095 },
  Income: { mean: 6.054, std: 2.071, beta: -0.165 },
};

// Intercept of the Logistic Regression model
const INTERCEPT = -0.925;

/**
 * Predicts diabetes risk and returns structured feedback and explanation.
 */
export function predictDiabetes(features: DiabetesFeatures): PredictionResult {
  let z = INTERCEPT;
  const contributions: Contribution[] = [];

  // Loop through features, calculate scaled value, add to dot product z
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

  // Calculate Sigmoid Probability
  const probability = 1 / (1 + Math.exp(-z));
  const prediction = probability >= 0.5 ? 1 : 0;

  // Determine risk category
  let risk_level = 'Düşük Risk';
  let risk_color = '#10B981'; // Green (Emerald)

  if (probability < 0.35) {
    risk_level = 'Düşük Risk';
    risk_color = '#10B981';
  } else if (probability < 0.60) {
    risk_level = 'Orta Risk';
    risk_color = '#F59E0B'; // Orange (Amber)
  } else {
    risk_level = 'Yüksek Risk';
    risk_color = '#EF4444'; // Red (Rose)
  }

  // Sort contributions by their absolute impact (descending order)
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
