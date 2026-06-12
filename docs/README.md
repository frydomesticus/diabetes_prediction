# Diabetes Prediction — IE410 Project

**Student:** Ibrahim Hakki Keles  
**Course:** IE410 - Advanced Computer Programming  
**University:** Ankara Yildirim Beyazit University  
**Date:** May 2026

---

## Project Overview

This project predicts whether a person has diabetes using machine learning models trained on the **CDC BRFSS 2015 Health Indicators** dataset (253,680 people × 22 features).

## Dataset

- **Source:** CDC Behavioral Risk Factor Surveillance System (BRFSS) 2015
- **Size:** 253,680 rows × 22 columns
- **Target:** `Diabetes_binary` (0 = No Diabetes, 1 = Diabetes)
- **Class Distribution:** 86.1% Healthy, 13.9% Diabetic (6.2:1 imbalance)

## Project Structure

```
Diabetes Prediction Week1/
├── data/
│   └── raw/
│       └── cdc_diabetes_health_indicators.csv   ← 253,680 records
│
├── notebooks/
│   ├── Study1_Report_CDC.ipynb    ← Data Preparation & EDA (13 cells)
│   ├── Study2_Report.ipynb        ← Model Selection & Tuning (15 cells)
│   └── Study3_Report.ipynb        ← Model Training & Evaluation (10 cells)
│
├── outputs/
│   ├── plots/                     ← 7 PNG charts
│   ├── tables/                    ← 2 Excel result files
│   └── models/                    ← Saved model + scaler (.pkl)
│
└── docs/
    ├── README.md                  ← This file
    └── IE410_Final_Project_*.docx ← Academic Word report
```

## Studies Summary

### Study-1: Data Preparation and Preprocessing ✅
- Loaded CDC BRFSS 2015 dataset (253K rows × 22 columns)
- Exploratory Data Analysis (EDA): distribution, correlation, class balance
- Key finding: No missing values; severe class imbalance (86% vs 14%)
- Correlation: GenHlth (0.308), HighBP (0.273), BMI (0.221) are top predictors

### Study-2: Model Selection and Setup ✅
1. **Screening:** Tested 6 models (LR, DT, RF, GB, SVM, KNN) on 5K sample
2. **Elimination:** Removed 3 with data-driven justification
   - SVM: O(n²) — too slow for 253K rows
   - KNN: Low accuracy + memory issues
   - GB: Similar to RF but slower (redundant ensemble)
3. **Tuning:** GridSearchCV on selected 3 (LR, DT, RF) with 30K sample
4. **Result:** Decision Tree improved +7.9% after depth limiting

### Study-3: Model Training and Evaluation ✅
- Trained 3 models on full training data (202,944 samples)
- **Accuracy Paradox:** Default models get ~86% accuracy but catch only 9-16% of diabetic patients
- **Solution:** `class_weight='balanced'` improved Recall from ~15% to ~76%
- **Best Model:** LR (Balanced) — AUC 0.8196, Recall 0.7611
- Feature Importance: GenHlth, HighBP, BMI, HighChol, Age are top 5
- Model saved as `best_diabetes_model.pkl`

## Models Used

| Model | Family | Role |
|-------|--------|------|
| Logistic Regression | Linear | Baseline (interpretable) |
| Decision Tree | Tree-based | Visual rules |
| Random Forest | Ensemble | Feature importance |

## How to Run

### Local Jupyter
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
cd notebooks
jupyter notebook
# Run Study1 → Study2 → Study3 in order
```

### Google Colab
1. Upload the entire project folder to Google Drive
2. Open any `.ipynb` with Colab
3. Run all cells in order

---

*IE410 Advanced Computer Programming — Ankara Yildirim Beyazit University, 2026*
