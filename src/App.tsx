/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartPulse,
  Calculator,
  ChartLine,
  User,
  Scale,
  Activity,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Info,
  Venus,
  Mars,
  Shield,
  Coins,
  GraduationCap,
  Languages,
  Sun,
  Moon,
  Printer,
  Sparkles,
} from 'lucide-react';

import { DiabetesFeatures } from './types';
import { predictDiabetes } from './utils/model';
import { TRANSLATIONS, FEATURE_METADATA_LOCALIZED } from './utils/translations';

export default function App() {
  // Lang & Theme support
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [patientName, setPatientName] = useState<string>('');

  // Navigation & Form Active Tab
  const [activeTab, setActiveTab] = useState<'predict' | 'dashboard'>('predict');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Client values to calculate BMI
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(80);

  // Core Features State
  const [formData, setFormData] = useState<DiabetesFeatures>({
    HighBP: 0,
    HighChol: 0,
    CholCheck: 1,
    BMI: 26.1,
    Smoker: 0,
    Stroke: 0,
    HeartDiseaseorAttack: 0,
    PhysActivity: 1,
    Fruits: 1,
    Veggies: 1,
    HvyAlcoholConsump: 0,
    AnyHealthcare: 1,
    NoDocbcCost: 0,
    GenHlth: 2,
    MentHlth: 0,
    PhysHlth: 0,
    DiffWalk: 0,
    Sex: 0, // 0 For female, 1 Male
    Age: 7, // 50-54 bracket
    Education: 5,
    Income: 6,
  });

  // Dynamic Factors breakdown view tab
  const [factorTab, setFactorTab] = useState<'risk' | 'protective'>('risk');

  // What-If Simulation State
  const [whatIfData, setWhatIfData] = useState<DiabetesFeatures | null>(null);

  // Active translation dictionary
  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  // BMI Value & Status Calculated dynamically
  const calculatedBMI = useMemo(() => {
    if (height > 0 && weight > 0) {
      return parseFloat((weight / (height / 100) ** 2).toFixed(1));
    }
    return 25.0;
  }, [height, weight]);

  const bmiMeta = useMemo(() => {
    const val = calculatedBMI;
    if (val < 18.5) return { label: t.bmiUnderweight, color: '#1D4ED8', class: 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800' };
    if (val < 25.0) return { label: t.bmiNormal, color: '#0F5132', class: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800' };
    if (val < 30.0) return { label: t.bmiOverweight, color: '#B45309', class: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800' };
    return { label: t.bmiObese, color: '#B91C1C', class: 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800' };
  }, [calculatedBMI, lang, t]);

  // Dynamic options arrays based on selected language
  const AGE_GROUPS = useMemo(() => [
    { value: 1, label: lang === 'tr' ? '18 - 24 yaş' : '18 - 24 years' },
    { value: 2, label: lang === 'tr' ? '25 - 29 yaş' : '25 - 29 years' },
    { value: 3, label: lang === 'tr' ? '30 - 34 yaş' : '30 - 34 years' },
    { value: 4, label: lang === 'tr' ? '35 - 39 yaş' : '35 - 39 years' },
    { value: 5, label: lang === 'tr' ? '40 - 44 yaş' : '40 - 44 years' },
    { value: 6, label: lang === 'tr' ? '45 - 49 yaş' : '45 - 49 years' },
    { value: 7, label: lang === 'tr' ? '50 - 54 yaş' : '50 - 54 years' },
    { value: 8, label: lang === 'tr' ? '55 - 59 yaş' : '55 - 59 years' },
    { value: 9, label: lang === 'tr' ? '60 - 64 yaş' : '60 - 64 years' },
    { value: 10, label: lang === 'tr' ? '65 - 69 yaş' : '65 - 69 years' },
    { value: 11, label: lang === 'tr' ? '70 - 74 yaş' : '70 - 74 years' },
    { value: 12, label: lang === 'tr' ? '75 - 79 yaş' : '75 - 79 years' },
    { value: 13, label: lang === 'tr' ? '80 yaş ve üzeri' : '80 years and over' },
  ], [lang]);

  const EDUCATION_LEVELS = useMemo(() => [
    { value: 1, label: lang === 'tr' ? 'Okuma yazması yok veya okulsuz' : 'Never attended school or only kindergarten' },
    { value: 2, label: lang === 'tr' ? 'İlkokul mezunu (Grade 1-8)' : 'Elementary school graduate (Grade 1-8)' },
    { value: 3, label: lang === 'tr' ? 'Lise terk öğrencisi (Grade 9-11)' : 'Some high school (Grade 9-11)' },
    { value: 4, label: lang === 'tr' ? 'Lise Mezunu' : 'High school graduate' },
    { value: 5, label: lang === 'tr' ? 'Önlisans / Üniversite Terk' : 'Some college or technical school' },
    { value: 6, label: lang === 'tr' ? 'Üniversite veya İleri Derece Mezunu' : 'College graduate' },
  ], [lang]);

  const INCOME_GROUPS = useMemo(() => [
    { value: 1, label: lang === 'tr' ? 'Aşırı Düşük Gelir (< 10.000 $ / yıl)' : 'Extremely Low Income (< $10k / year)' },
    { value: 2, label: lang === 'tr' ? 'Çok Düşük Gelir (10.000 $ - 15.000 $)' : 'Very Low Income ($10k - $15k)' },
    { value: 3, label: lang === 'tr' ? 'Düşük Gelir (15.000 $ - 20.000 $)' : 'Low Income ($15k - $20k)' },
    { value: 4, label: lang === 'tr' ? 'Ortanın Altı Gelir (20.000 $ - 25.000 $)' : 'Low-Middle Income ($20k - $25k)' },
    { value: 5, label: lang === 'tr' ? 'Orta Gelir Seviyesi (25.000 $ - 35.000 $)' : 'Middle Income ($25k - $35k)' },
    { value: 6, label: lang === 'tr' ? 'Ortanın Üzeri Gelir (35.000 $ - 50.000 $)' : 'Upper-Middle Income ($35k - $50k)' },
    { value: 7, label: lang === 'tr' ? 'Yüksek Gelir Seviyesi (50.000 $ - 75.000 $)' : 'High Income ($50k - $75k)' },
    { value: 8, label: lang === 'tr' ? 'En Üst Gelir Grubu (75.000 $ ve üzeri)' : 'Top Income Group ($75k and over)' },
  ], [lang]);

  // Apply Theme to body
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (theme === 'dark') {
      bodyClass.add('dark-theme');
    } else {
      bodyClass.remove('dark-theme');
    }
  }, [theme]);

  // Sync document language attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync whatIfData when results are shown
  useEffect(() => {
    if (showResults) {
      setWhatIfData({ ...formData, BMI: calculatedBMI });
    }
  }, [showResults, formData, calculatedBMI]);

  // Handle step value updates
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const updateFeatureNum = (key: keyof DiabetesFeatures, val: number) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const toggleToggle = (key: keyof DiabetesFeatures) => {
    setFormData((prev) => ({ ...prev, [key]: prev[key] === 1 ? 0 : 1 }));
  };

  // Run model calculations
  const analysisResult = useMemo(() => {
    // Inject Computed BMI before calling the predictor
    const submissionData = { ...formData, BMI: calculatedBMI };
    
    // Inject localized label/desc into predictions
    const rawResult = predictDiabetes(submissionData);
    rawResult.contributions = rawResult.contributions.map((c) => {
      const meta = FEATURE_METADATA_LOCALIZED[lang][c.feature];
      return {
        ...c,
        label: meta?.label || c.feature,
        desc: meta?.desc || '',
      };
    });
    
    return rawResult;
  }, [formData, calculatedBMI, lang]);

  // What-if simulated predictions
  const whatIfResult = useMemo(() => {
    if (!whatIfData) return null;
    const rawResult = predictDiabetes(whatIfData);
    rawResult.contributions = rawResult.contributions.map((c) => {
      const meta = FEATURE_METADATA_LOCALIZED[lang][c.feature];
      return {
        ...c,
        label: meta?.label || c.feature,
        desc: meta?.desc || '',
      };
    });
    return rawResult;
  }, [whatIfData, lang]);

  const progressPct = ((currentStep - 1) / 3) * 100;

  // Personalized advice generator based on predictive contributions
  const personalRecommendations = useMemo(() => {
    const advice: string[] = [];

    if (formData.HighBP === 1) advice.push(t.recHighBP);
    if (formData.HighChol === 1) advice.push(t.recHighChol);
    if (calculatedBMI >= 30) advice.push(t.recObese);
    else if (calculatedBMI >= 25) advice.push(t.recOverweight);
    if (formData.PhysActivity === 0) advice.push(t.recNoPhys);
    if (formData.Smoker === 1) advice.push(t.recSmoker);
    if (formData.Fruits === 0 || formData.Veggies === 0) advice.push(t.recNoDiet);

    advice.push(t.recAcademicNote);

    return advice.slice(0, 4); // return max 4 top targeted items
  }, [formData, calculatedBMI, lang, t]);

  // Filter contributions by active factor tab (risk vs protective)
  const filteredContributions = useMemo(() => {
    const items = analysisResult.contributions.filter((f) => f.type === factorTab);
    const maxC = Math.max(...analysisResult.contributions.map((x) => Math.abs(x.contribution)), 0.01);
    return { items, maxC };
  }, [analysisResult, factorTab]);

  return (
    <div className="relative w-full max-w-5xl mx-auto z-10 px-4 py-12">
      {/* Decorative architectural background lines - hidden in print */}
      <div className="background-decor print:hidden">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* PDF print header - only visible in print mode */}
      <div className="hidden print:block mb-8 border-b-2 border-black dark:border-white pb-4 text-center">
        <h1 className="text-xl font-display font-bold uppercase tracking-wider">{t.pdfReportTitle}</h1>
        <p className="text-xs font-semibold uppercase text-neutral-500 mt-1">{t.pdfReportSub}</p>
        {patientName && (
          <p className="text-sm font-bold mt-4">
            {t.pdfPatientNameLabel} <span className="underline">{patientName}</span>
          </p>
        )}
        <p className="text-[10px] text-neutral-500 mt-1">
          {t.pdfGeneratedAt} {new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
        </p>
      </div>

      <div className="app-container relative">
        {/* Header bar: Balanced, structured, symmetric */}
        <header className="app-header mb-12 pb-6 flex flex-col md:flex-row justify-between items-stretch md:items-center border-b border-black/10 dark:border-white/10 gap-6 print:hidden">
          <div className="logo flex items-center gap-4">
            <div className="p-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 relative">
              <HeartPulse id="logo" className="w-6 h-6" />
            </div>
            <div className="logo-text">
              <h1 className="font-display font-bold text-xl md:text-2xl tracking-[0.15em] uppercase text-neutral-900 dark:text-white transition-colors">
                {t.logoTitle}
              </h1>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mt-1">
                {t.logoSub}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Theme & Language Controls */}
            <div className="flex items-center gap-2 border-r border-black/10 dark:border-white/10 pr-4">
              {/* Language Selector */}
              <button
                type="button"
                onClick={() => setLang(prev => prev === 'tr' ? 'en' : 'tr')}
                className="lang-toggle p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-neutral-600 dark:text-neutral-300"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'EN' : 'TR'}</span>
              </button>

              {/* Theme Selector */}
              <button
                type="button"
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className="theme-toggle p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-black/10 dark:border-white/10 cursor-pointer text-neutral-600 dark:text-neutral-300"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              </button>
            </div>

            {/* Navigation Controls in architectural tabs style */}
            <nav className="app-nav flex gap-2">
              <button
                id="btn-nav-calc"
                onClick={() => setActiveTab('predict')}
                className={`nav-btn font-bold cursor-pointer flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-widest transition-all duration-150 rounded-none ${
                  activeTab === 'predict'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border border-neutral-900 dark:border-white'
                    : 'bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" /> {t.navPredict}
              </button>
              <button
                id="btn-nav-dash"
                onClick={() => setActiveTab('dashboard')}
                className={`nav-btn font-bold cursor-pointer flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-widest transition-all duration-150 rounded-none ${
                  activeTab === 'dashboard'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border border-neutral-900 dark:border-white'
                    : 'bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <ChartLine className="w-3.5 h-3.5" /> {t.navDashboard}
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content Sections */}
        <main className="app-main relative z-10 animate-fade-in">
          {activeTab === 'predict' ? (
            <div>
              {/* Form Wizard vs Results display */}
              {!showResults ? (
                <div className="glass-card p-6 md:p-10 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10">
                  {/* Step Progress Tracks Component */}
                  <div className="form-progress relative flex justify-between items-center mb-12 px-2 md:px-8">
                    <div className="progress-track absolute top-5 left-10 right-10 h-[2px] bg-neutral-900/10 dark:bg-white/10 -z-10">
                      <div
                        className="progress-fill h-full bg-neutral-900 dark:bg-white transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>

                    {[
                      { step: 1, label: t.step1Label },
                      { step: 2, label: t.step2Label },
                      { step: 3, label: t.step3Label },
                      { step: 4, label: t.step4Label },
                    ].map((item) => (
                      <button
                        key={item.step}
                        id={`step-indicator-${item.step}`}
                        disabled={item.step > currentStep + 1}
                        onClick={() => setCurrentStep(item.step)}
                        className="progress-step flex flex-col items-center gap-2.5 focus:outline-none cursor-pointer disabled:cursor-not-allowed group"
                      >
                        <div
                          className={`step-num w-10 h-10 flex items-center justify-center font-bold text-xs transition-all duration-200 border rounded-none ${
                            currentStep === item.step
                              ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-900'
                              : currentStep > item.step
                              ? 'bg-transparent border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                              : 'bg-white dark:bg-neutral-900 border-black/15 dark:border-white/15 text-neutral-400 group-hover:border-neutral-900 dark:group-hover:border-white'
                          }`}
                        >
                          {item.step}
                        </div>
                        <span
                          className={`step-label text-[10px] uppercase tracking-wider font-bold transition-colors duration-200 ${
                            currentStep === item.step
                              ? 'text-neutral-900 dark:text-white'
                              : currentStep > item.step
                              ? 'text-neutral-900/80 dark:text-white/80'
                              : 'text-neutral-400'
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Multi-step Form Views */}
                  <div className="min-h-[280px]">
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="form-step-content"
                          id="step-form-demography"
                        >
                          <div className="step-header mb-8 border-l-2 border-neutral-900 dark:border-white pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                              {lang === 'tr' ? 'Bölüm 01' : 'Section 01'}
                            </span>
                            <h2 className="font-display font-light text-2xl text-neutral-900 dark:text-white tracking-tight">
                              {t.step1Title}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                              {t.step1Desc}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Gender selection cards */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                {t.labelSex}
                              </label>
                              <div className="gender-selector flex gap-3">
                                <label className="flex-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="Sex"
                                    value="0"
                                    checked={formData.Sex === 0}
                                    onChange={() => updateFeatureNum('Sex', 0)}
                                    className="sr-only"
                                    id="gender-female-radio"
                                  />
                                  <div
                                    className={`gender-card flex items-center justify-center gap-2.5 p-4 rounded-none font-semibold text-xs transition-all duration-150 border ${
                                      formData.Sex === 0
                                        ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900'
                                        : 'bg-transparent border-black/15 dark:border-white/15 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                    }`}
                                  >
                                    <Venus className="w-4 h-4 text-emerald-500" />
                                    <span>{t.sexFemale}</span>
                                  </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="Sex"
                                    value="1"
                                    checked={formData.Sex === 1}
                                    onChange={() => updateFeatureNum('Sex', 1)}
                                    className="sr-only"
                                    id="gender-male-radio"
                                  />
                                  <div
                                    className={`gender-card flex items-center justify-center gap-2.5 p-4 rounded-none font-semibold text-xs transition-all duration-150 border ${
                                      formData.Sex === 1
                                        ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900'
                                        : 'bg-transparent border-black/15 dark:border-white/15 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                    }`}
                                  >
                                    <Mars className="w-4 h-4 text-sky-500" />
                                    <span>{t.sexMale}</span>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* Age categories list */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label htmlFor="age-select" className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                {t.labelAge}
                              </label>
                              <div className="relative">
                                <select
                                  id="age-select"
                                  name="Age"
                                  value={formData.Age}
                                  onChange={handleSelectChange}
                                  className="w-full bg-white dark:bg-neutral-950 border border-black/15 dark:border-white/15 rounded-none px-4 py-3.5 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 appearance-none cursor-pointer"
                                >
                                  {AGE_GROUPS.map((g) => (
                                    <option key={g.value} value={g.value} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                                      {g.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
                                  ▼
                                </div>
                              </div>
                            </div>

                            {/* Education selection */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label htmlFor="education-select" className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                {t.labelEducation}
                              </label>
                              <div className="relative">
                                <select
                                  id="education-select"
                                  name="Education"
                                  value={formData.Education}
                                  onChange={handleSelectChange}
                                  className="w-full bg-white dark:bg-neutral-950 border border-black/15 dark:border-white/15 rounded-none px-4 py-3.5 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 appearance-none cursor-pointer"
                                >
                                  {EDUCATION_LEVELS.map((el) => (
                                    <option key={el.value} value={el.value} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                                      {el.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
                                  ▼
                                </div>
                              </div>
                            </div>

                            {/* Annual Hane Geliri */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label htmlFor="income-select" className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                {t.labelIncome}
                              </label>
                              <div className="relative">
                                <select
                                  id="income-select"
                                  name="Income"
                                  value={formData.Income}
                                  onChange={handleSelectChange}
                                  className="w-full bg-white dark:bg-neutral-950 border border-black/15 dark:border-white/15 rounded-none px-4 py-3.5 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 appearance-none cursor-pointer"
                                >
                                  {INCOME_GROUPS.map((inc) => (
                                    <option key={inc.value} value={inc.value} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                                      {inc.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
                                  ▼
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="form-step-content"
                          id="step-form-body"
                        >
                          <div className="step-header mb-8 border-l-2 border-neutral-900 dark:border-white pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                              {lang === 'tr' ? 'Bölüm 02' : 'Section 02'}
                            </span>
                            <h2 className="font-display font-light text-2xl text-neutral-900 dark:text-white tracking-tight">
                              {t.step2Title}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                              {t.step2Desc}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Height & Weight Inputs */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                {t.labelHeightWeight}
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="relative flex items-center">
                                  <input
                                    type="number"
                                    id="input-height"
                                    min="100"
                                    max="250"
                                    value={height || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setHeight(val === '' ? 0 : parseInt(val) || 0);
                                    }}
                                    onBlur={() => {
                                      setHeight(Math.max(100, Math.min(250, height || 175)));
                                    }}
                                    className="w-full bg-white dark:bg-neutral-950 border border-black/15 dark:border-white/15 rounded-none px-4 py-3.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                                  />
                                  <span className="absolute right-4 text-[10px] font-bold text-neutral-400">{t.labelHeight} (cm)</span>
                                </div>
                                <div className="relative flex items-center">
                                  <input
                                    type="number"
                                    id="input-weight"
                                    min="30"
                                    max="300"
                                    value={weight || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setWeight(val === '' ? 0 : parseInt(val) || 0);
                                    }}
                                    onBlur={() => {
                                      setWeight(Math.max(30, Math.min(300, weight || 80)));
                                    }}
                                    className="w-full bg-white dark:bg-neutral-950 border border-black/15 dark:border-white/15 rounded-none px-4 py-3.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                                  />
                                  <span className="absolute right-4 text-[10px] font-bold text-neutral-400">{t.labelWeight} (kg)</span>
                                </div>
                              </div>
                            </div>

                            {/* Evaluated reactive BMI output */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                {t.labelBMI}
                              </label>
                              <div className="w-full bg-transparent border border-black/15 dark:border-white/15 rounded-none px-4 py-3.5 flex justify-between items-center">
                                <span className="text-sm font-bold font-display text-neutral-900 dark:text-white">
                                  {calculatedBMI} kg/m²
                                </span>
                                <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-none ${bmiMeta.class}`}>
                                  {bmiMeta.label}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Subjective GenHlth selector cards */}
                          <div className="form-group flex flex-col gap-2.5 mt-8">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                              {t.labelGenHlth}
                            </label>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                              {t.descGenHlth}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
                              {[
                                { val: 1, label: t.genHlthExcellent },
                                { val: 2, label: t.genHlthVeryGood },
                                { val: 3, label: t.genHlthGood },
                                { val: 4, label: t.genHlthFair },
                                { val: 5, label: t.genHlthPoor },
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  id={`btn-health-rating-${item.val}`}
                                  onClick={() => updateFeatureNum('GenHlth', item.val)}
                                  className={`p-4 rounded-none border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 ${
                                    formData.GenHlth === item.val
                                      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900'
                                      : 'bg-transparent border-black/15 dark:border-white/15 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                  }`}
                                >
                                  <span className="text-base font-bold font-display">{item.val}</span>
                                  <span className="text-[8px] uppercase font-bold tracking-widest">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Slider fields for MentHlth & PhysHlth */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div className="form-group flex flex-col gap-2.5">
                              <div className="flex justify-between items-center">
                                <label htmlFor="mental-health-slider" className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                  {t.labelMentHlth}
                                </label>
                                <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5 rounded-none text-[9px] font-bold">
                                  {formData.MentHlth} {t.unitDays}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm leading-normal">
                                {t.descMentHlth}
                              </p>
                              <input
                                type="range"
                                id="mental-health-slider"
                                name="MentHlth"
                                min="0"
                                max="30"
                                value={formData.MentHlth}
                                onChange={(e) => updateFeatureNum('MentHlth', parseInt(e.target.value, 10))}
                                className="styled-slider w-full mt-3"
                              />
                            </div>

                            <div className="form-group flex flex-col gap-2.5">
                              <div className="flex justify-between items-center">
                                <label htmlFor="physical-health-slider" className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                  {t.labelPhysHlth}
                                </label>
                                <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5 rounded-none text-[9px] font-bold">
                                  {formData.PhysHlth} {t.unitDays}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm leading-normal">
                                {t.descPhysHlth}
                              </p>
                              <input
                                type="range"
                                id="physical-health-slider"
                                name="PhysHlth"
                                min="0"
                                max="30"
                                value={formData.PhysHlth}
                                onChange={(e) => updateFeatureNum('PhysHlth', parseInt(e.target.value, 10))}
                                className="styled-slider w-full mt-3"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="form-step-content"
                          id="step-form-history"
                        >
                          <div className="step-header mb-8 border-l-2 border-neutral-900 dark:border-white pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                              {lang === 'tr' ? 'Bölüm 03' : 'Section 03'}
                            </span>
                            <h2 className="font-display font-light text-2xl text-neutral-900 dark:text-white tracking-tight">
                              {t.step3Title}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                              {t.step3Desc}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { key: 'HighBP' },
                              { key: 'HighChol' },
                              { key: 'CholCheck' },
                              { key: 'Stroke' },
                              { key: 'HeartDiseaseorAttack' },
                              { key: 'DiffWalk' },
                            ].map((item) => {
                              const meta = FEATURE_METADATA_LOCALIZED[lang][item.key as keyof DiabetesFeatures];
                              return (
                                <div
                                  key={item.key}
                                  onClick={() => toggleToggle(item.key as keyof DiabetesFeatures)}
                                  className={`p-4 rounded-none border flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 ${
                                    formData[item.key as keyof DiabetesFeatures] === 1
                                      ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                                      : 'bg-white dark:bg-neutral-900 border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                                  }`}
                                  id={`toggle-card-${item.key}`}
                                >
                                  <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider">{meta?.label}</h3>
                                    <p className="text-[10px] text-neutral-500 mt-1 leading-normal">{meta?.desc}</p>
                                  </div>
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={formData[item.key as keyof DiabetesFeatures] === 1}
                                      readOnly
                                      className="sr-only"
                                      id={`checkbox-${item.key}`}
                                    />
                                    <div
                                      className={`w-11 h-6 rounded-none transition-colors duration-200 relative ${
                                        formData[item.key as keyof DiabetesFeatures] === 1
                                          ? 'bg-neutral-900 dark:bg-white'
                                          : 'bg-neutral-200 dark:bg-neutral-700'
                                      }`}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-none bg-white dark:bg-neutral-900 transition-all duration-200 absolute top-1 left-1 ${
                                          formData[item.key as keyof DiabetesFeatures] === 1
                                            ? 'translate-x-5'
                                            : 'translate-x-0'
                                        }`}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div
                          key="step-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="form-step-content"
                          id="step-form-lifestyle"
                        >
                          <div className="step-header mb-8 border-l-2 border-neutral-900 dark:border-white pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                              {lang === 'tr' ? 'Bölüm 04' : 'Section 04'}
                            </span>
                            <h2 className="font-display font-light text-2xl text-neutral-900 dark:text-white tracking-tight">
                              {t.step4Title}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                              {t.step4Desc}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { key: 'Smoker' },
                              { key: 'PhysActivity' },
                              { key: 'Fruits' },
                              { key: 'Veggies' },
                              { key: 'HvyAlcoholConsump' },
                              { key: 'AnyHealthcare' },
                              { key: 'NoDocbcCost' },
                            ].map((item) => {
                              const meta = FEATURE_METADATA_LOCALIZED[lang][item.key as keyof DiabetesFeatures];
                              return (
                                <div
                                  key={item.key}
                                  onClick={() => toggleToggle(item.key as keyof DiabetesFeatures)}
                                  className={`p-4 rounded-none border flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 ${
                                    formData[item.key as keyof DiabetesFeatures] === 1
                                      ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                                      : 'bg-white dark:bg-neutral-900 border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                                  }`}
                                  id={`toggle-card-${item.key}`}
                                >
                                  <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider">{meta?.label}</h3>
                                    <p className="text-[10px] text-neutral-500 mt-1 leading-normal">{meta?.desc}</p>
                                  </div>
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={formData[item.key as keyof DiabetesFeatures] === 1}
                                      readOnly
                                      className="sr-only"
                                      id={`checkbox-${item.key}`}
                                    />
                                    <div
                                      className={`w-11 h-6 rounded-none transition-colors duration-200 relative ${
                                        formData[item.key as keyof DiabetesFeatures] === 1
                                          ? 'bg-neutral-900 dark:bg-white'
                                          : 'bg-neutral-200 dark:bg-neutral-700'
                                      }`}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-none bg-white dark:bg-neutral-900 transition-all duration-200 absolute top-1 left-1 ${
                                          formData[item.key as keyof DiabetesFeatures] === 1
                                            ? 'translate-x-5'
                                            : 'translate-x-0'
                                        }`}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Form Step Buttons in a flat symmetric line */}
                  <div className="form-actions flex justify-between items-center mt-12 pt-6 border-t border-black/10 dark:border-white/10">
                    <button
                      type="button"
                      id="btn-prev-step"
                      disabled={currentStep === 1}
                      onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                      className="cursor-pointer border border-neutral-900 dark:border-white text-neutral-900 dark:text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all duration-150 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-900 dark:disabled:hover:text-white flex items-center gap-1.5 rounded-none"
                    >
                      <ChevronLeft className="w-4 h-4" /> {t.btnPrev}
                    </button>

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        id="btn-next-step"
                        onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                        className="cursor-pointer border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-150 flex items-center gap-1.5 rounded-none"
                      >
                        {t.btnNext} <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        id="btn-submit-calc"
                        onClick={() => setShowResults(true)}
                        className="cursor-pointer border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-7 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-150 flex items-center gap-1.5 rounded-none"
                      >
                        <HeartPulse className="w-4 h-4 text-rose-500" /> {t.btnSubmit}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Symmetric Dynamic Interactive Results Interface */
                <div id="results-panel-container" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fade-in">
                  
                  {/* Gauge Display Card Left */}
                  <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center md:col-span-5 relative bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10">
                    <div className="result-header mb-8">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                        {t.resultHeader}
                      </span>
                      <h2 className="font-display font-light text-xl text-neutral-900 dark:text-white tracking-tight">{t.gaugeTitle}</h2>
                    </div>

                    {/* Circular gauge drawing */}
                    <div className="gauge-container relative w-48 h-48 mb-6">
                      <svg className="gauge w-full h-full -rotate-90" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="80" fill="none" className="gauge-bg" />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          className="gauge-value"
                          style={{
                            strokeDashoffset: 502 - analysisResult.probability * 502,
                          }}
                        />
                      </svg>
                      <div className="gauge-text-container absolute inset-0 flex flex-col justify-center items-center">
                        <span className="gauge-percentage font-display text-4xl font-extrabold text-neutral-900 dark:text-white">
                          {Math.round(analysisResult.probability * 100)}%
                        </span>
                        <span className="gauge-label text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase mt-1">
                          {t.gaugeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="risk-badge-wrapper mb-6">
                      <span
                        className="risk-level-badge text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-none border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                      >
                        {analysisResult.risk_level === 'Düşük Risk' ? t.riskLow : analysisResult.risk_level === 'Orta Risk' ? t.riskMedium : t.riskHigh}
                      </span>
                    </div>

                    <p className="risk-explanation text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mb-8">
                      {analysisResult.risk_level === 'Düşük Risk' ? (
                        <>{t.explanationLow}</>
                      ) : analysisResult.risk_level === 'Orta Risk' ? (
                        <>{t.explanationMedium}</>
                      ) : (
                        <>{t.explanationHigh}</>
                      )}
                    </p>

                    <button
                      type="button"
                      id="btn-restart-calc"
                      onClick={() => {
                        setShowResults(false);
                        setCurrentStep(1);
                      }}
                      className="cursor-pointer border border-neutral-900 dark:border-white text-neutral-900 dark:text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all duration-150 rounded-none w-full"
                    >
                      <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> {t.btnRestart}
                    </button>
                  </div>

                  {/* Contributions & Personal Recommendations Right */}
                  <div className="glass-card p-6 md:p-8 md:col-span-7 flex flex-col bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10">
                    <div className="step-header mb-6 border-l-2 border-neutral-900 dark:border-white pl-4">
                      <h2 className="font-display font-medium text-lg text-neutral-900 dark:text-white tracking-tight">{t.contributionsTitle}</h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t.contributionsSub}</p>
                    </div>

                    {/* Factor selection tabs in architect flat look */}
                    <div className="factor-tabs flex border border-black/10 dark:border-white/10 p-1 rounded-none mb-6 self-start bg-neutral-100 dark:bg-neutral-800">
                      <button
                        type="button"
                        id="btn-factors-risk"
                        onClick={() => setFactorTab('risk')}
                        className={`factor-tab text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-none cursor-pointer flex items-center gap-1.5 transition-all duration-150 ${
                          factorTab === 'risk' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-brand-rose" /> {t.tabRisk}
                      </button>
                      <button
                        type="button"
                        id="btn-factors-protective"
                        onClick={() => setFactorTab('protective')}
                        className={`factor-tab text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-none cursor-pointer flex items-center gap-1.5 transition-all duration-150 ${
                          factorTab === 'protective' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> {t.tabProtective}
                      </button>
                    </div>

                    {/* Filtered features contribution scrollable box */}
                    <div className="factors-list custom-scrollbar max-h-68 overflow-y-auto flex flex-col gap-3 pr-2 mb-6">
                      {filteredContributions.items.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic text-center py-6">
                          {t.noFactors}
                        </p>
                      ) : (
                        filteredContributions.items.map((f) => {
                          const percentageWidth = Math.min((Math.abs(f.contribution) / filteredContributions.maxC) * 100, 100);

                          let labelText = '';
                          if (f.feature === 'BMI') labelText = `${f.value} kg/m²`;
                          else if (f.feature === 'MentHlth' || f.feature === 'PhysHlth') labelText = `${f.value} ${t.unitDays.toLowerCase()}`;
                          else if (f.feature === 'Age') labelText = AGE_GROUPS.find((ag) => ag.value === f.value)?.label || `${f.value}`;
                          else if (f.feature === 'Education') labelText = EDUCATION_LEVELS.find((el) => el.value === f.value)?.label || `${f.value}`;
                          else if (f.feature === 'Income') labelText = INCOME_GROUPS.find((ig) => ig.value === f.value)?.label || `${f.value}`;
                          else if (f.feature === 'GenHlth') {
                            const map: any = { 1: t.genHlthExcellent, 2: t.genHlthVeryGood, 3: t.genHlthGood, 4: t.genHlthFair, 5: t.genHlthPoor };
                            labelText = map[f.value] || `${f.value}`;
                          } else if (f.feature === 'Sex') labelText = f.value === 1 ? t.sexMale : t.sexFemale;
                          else labelText = f.value === 1 ? (lang === 'tr' ? 'Evet' : 'Yes') : (lang === 'tr' ? 'Hayır' : 'No');

                          return (
                            <div
                              key={f.feature}
                              className="factor-item p-3.5 border border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/10 flex flex-col gap-2 hover:border-black/20 dark:hover:border-white/20 transition-all rounded-none"
                              id={`factor-term-${f.feature}`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-xs text-neutral-900 dark:text-white">
                                  {f.label} ({labelText})
                                </span>
                                <span
                                  className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none ${
                                    f.type === 'risk' ? 'bg-red-50 dark:bg-red-950/20 text-brand-rose border border-red-200 dark:border-red-900/30' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30'
                                  }`}
                                >
                                  {f.type === 'risk' ? t.posCorr : t.negCorr}
                                </span>
                              </div>
                              <div className="factor-bar w-full h-[3px] bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded-none">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    f.type === 'risk' ? 'bg-neutral-900 dark:bg-white' : 'bg-[#1D4ED8]'
                                  }`}
                                  style={{ width: `${percentageWidth}%` }}
                                ></div>
                              </div>
                              <p className="factor-desc text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal">{f.desc}</p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Recommended Medical & Lifestyle actions list box */}
                    <div className="recommendations-box border border-dashed border-black/20 dark:border-white/20 bg-neutral-50 dark:bg-neutral-800/20 p-5 mt-auto rounded-none">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-1.5 mb-3.5">
                        <Award className="w-4 h-4" /> {t.recTitle}
                      </h3>
                      <ul className="space-y-3">
                        {personalRecommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed relative pl-4 before:content-['□'] before:text-neutral-900 dark:before:text-white before:absolute before:left-0 before:font-bold before:text-[9px]"
                            dangerouslySetInnerHTML={{ __html: rec }}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* What-If / Sensitivity Simulator Card */}
                  {whatIfData && whatIfResult && (
                    <div id="what-if-panel-container" className="col-span-12 glass-card p-6 md:p-8 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 mt-8 print:hidden animate-fade-in">
                      <div className="step-header mb-6 border-l-2 border-neutral-900 dark:border-white pl-4">
                        <h2 className="font-display font-medium text-lg text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse animate-duration-1000" /> {t.whatIfTitle}
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t.whatIfDesc}</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* Simulation controls: Sliders and Toggles (col-span-8) */}
                        <div className="lg:col-span-8 flex flex-col gap-6 justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            {t.whatIfInstructions}
                          </p>

                          {/* Continuous variable: BMI */}
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                                {FEATURE_METADATA_LOCALIZED[lang].BMI.label}
                              </span>
                              <span className="font-bold px-2 py-0.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                                {whatIfData.BMI} kg/m²
                              </span>
                            </div>
                            <input
                              type="range"
                              min="12"
                              max="60"
                              step="0.1"
                              value={whatIfData.BMI}
                              onChange={(e) => setWhatIfData(prev => prev ? { ...prev, BMI: parseFloat(e.target.value) } : null)}
                              className="styled-slider w-full"
                            />
                          </div>

                          {/* Discrete variables grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              { key: 'HighBP' },
                              { key: 'HighChol' },
                              { key: 'Smoker' },
                              { key: 'PhysActivity' },
                              { key: 'Fruits' },
                              { key: 'Veggies' },
                            ].map((item) => {
                              const fKey = item.key as keyof DiabetesFeatures;
                              const meta = FEATURE_METADATA_LOCALIZED[lang][fKey];
                              const isActive = whatIfData[fKey] === 1;
                              
                              return (
                                <button
                                  key={fKey}
                                  type="button"
                                  onClick={() => setWhatIfData(prev => prev ? { ...prev, [fKey]: prev[fKey] === 1 ? 0 : 1 } : null)}
                                  className={`p-3 text-left border flex flex-col justify-between h-20 transition-all cursor-pointer ${
                                    isActive
                                      ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-900'
                                      : 'bg-transparent border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                  }`}
                                >
                                  <span className="text-[10px] font-bold uppercase tracking-wide leading-tight">{meta?.label}</span>
                                  <span className="text-[9px] font-medium opacity-65">
                                    {isActive ? (lang === 'tr' ? 'Aktif' : 'Active') : (lang === 'tr' ? 'Pasif' : 'Inactive')}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Comparison Results Card (col-span-4) */}
                        <div className="lg:col-span-4 p-5 bg-neutral-50 dark:bg-neutral-800/20 border border-black/10 dark:border-white/10 flex flex-col justify-between text-center items-center">
                          <div className="w-full">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block mb-4">
                              {t.whatIfBaseline} vs {t.whatIfSimulated}
                            </span>
                            
                            {/* Side-by-side comparison values */}
                            <div className="flex justify-around items-center mb-6">
                              <div className="flex flex-col">
                                <span className="text-xl font-bold text-neutral-400 line-through">
                                  {Math.round(analysisResult.probability * 100)}%
                                </span>
                                <span className="text-[8px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">
                                  {lang === 'tr' ? 'Önceki' : 'Before'}
                                </span>
                              </div>
                              
                              <div className="text-2xl font-bold text-neutral-400">➔</div>
                              
                              <div className="flex flex-col">
                                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white animate-pulse">
                                  {Math.round(whatIfResult.probability * 100)}%
                                </span>
                                <span className="text-[8px] font-bold text-neutral-900 dark:text-white uppercase tracking-wider mt-1">
                                  {lang === 'tr' ? 'Yeni' : 'New'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Relative improvement calculation */}
                          {(() => {
                            const before = analysisResult.probability;
                            const after = whatIfResult.probability;
                            const diff = after - before;
                            
                            let text = t.whatIfNoImprovement;
                            let badgeClass = 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700';
                            
                            if (diff < -0.005) {
                              const improvementPct = Math.round((Math.abs(diff) / before) * 100);
                              text = `-${improvementPct}% ${t.whatIfLowerRisk}`;
                              badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30';
                            } else if (diff > 0.005) {
                              const increasePct = Math.round((diff / before) * 100);
                              text = `+${increasePct}% ${t.whatIfHigherRisk}`;
                              badgeClass = 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/30';
                            }
                            
                            return (
                              <div className={`w-full py-3 px-4 border rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 ${badgeClass}`}>
                                <Activity className="w-4 h-4 animate-spin animate-duration-3000" />
                                <span>{text}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Print custom PDF report Controls card */}
                  <div className="print-controls-card glass-card p-6 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 col-span-12 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                      <label htmlFor="patient-name-input" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        {t.pdfPatientNameLabel}
                      </label>
                      <input
                        id="patient-name-input"
                        type="text"
                        placeholder={t.pdfPatientNamePlaceholder}
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="bg-white dark:bg-neutral-950 border border-black/15 dark:border-white/15 rounded-none px-4 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white w-full sm:w-64"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="cursor-pointer border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-150 flex items-center gap-1.5 rounded-none w-full sm:w-auto justify-center"
                    >
                      <Printer className="w-4 h-4" /> {t.pdfPrintBtn}
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            /* Tab: Academic Report Dashboard */
            <div id="academic-dashboard-panel" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Left Column: Academic Stats and Metric summaries */}
              <div className="glass-card p-6 md:p-8 flex flex-col bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-none">
                <div className="step-header mb-8 border-l-2 border-neutral-900 dark:border-white pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                    {t.dashHeader}
                  </span>
                  <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white tracking-tight">{t.dashTitle}</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-lg leading-relaxed">
                    {t.dashSub}
                  </p>
                </div>

                <div className="model-badge-large flex items-center gap-3.5 p-4 rounded-none border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/40 mb-8 select-none">
                  <Activity className="w-6 h-6 text-neutral-900 dark:text-white flex-shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Logistic Regression (Balanced)</h3>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{t.dashModelStrategy}</p>
                  </div>
                </div>

                {/* Grid performance card metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: lang === 'tr' ? 'Test Doğruluğu (Accuracy)' : 'Test Accuracy', val: '86.4%', width: '86.4%' },
                    { label: lang === 'tr' ? 'Duyarlılık (Recall)' : 'Sensitivity (Recall)', val: '76.2%', width: '76.2%' },
                    { label: lang === 'tr' ? 'ROC AUC Skoru' : 'ROC AUC Score', val: '0.8226', width: '82.2%' },
                    { label: lang === 'tr' ? 'F1-Skoru Değeri' : 'F1-Score Value', val: '0.4430', width: '44.3%' },
                  ].map((m, idx) => (
                    <div key={idx} className="metric-card p-4 rounded-none bg-neutral-50/50 dark:bg-neutral-800/10 border border-black/10 dark:border-white/10 flex flex-col">
                      <span className="font-display font-extrabold text-2xl text-neutral-900 dark:text-white tracking-tight">{m.val}</span>
                      <span className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-widest mt-1.5 mb-3">
                        {m.label}
                      </span>
                      <div className="w-full h-[2px] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 dark:bg-white"
                          style={{ width: m.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="info-block mt-auto pt-6 border-t border-black/10 dark:border-white/10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white mb-3">
                    {t.dashParamsHeader}
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-neutral-900 dark:text-white font-bold">•</span>
                      <span dangerouslySetInnerHTML={{ __html: t.dashParamSize }} />
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neutral-900 dark:text-white font-bold">•</span>
                      <span dangerouslySetInnerHTML={{ __html: t.dashParamWeight }} />
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neutral-900 dark:text-white font-bold">•</span>
                      <span dangerouslySetInnerHTML={{ __html: t.dashParamSplit }} />
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neutral-900 dark:text-white font-bold">•</span>
                      <span dangerouslySetInnerHTML={{ __html: t.dashParamValidation }} />
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Accuracy Paradox & Global Importance weights */}
              <div className="glass-card p-6 md:p-8 flex flex-col gap-8 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-none">
                <div>
                  <div className="step-header mb-4 border-l-2 border-neutral-900 dark:border-white pl-4">
                    <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white tracking-tight">{t.paradoxTitle}</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.paradoxSub}</p>
                  </div>

                  <div className="paradox-box border-l-2 border-neutral-900 dark:border-white bg-[#F4F4F1] dark:bg-neutral-800/30 p-5 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 rounded-none">
                    <p dangerouslySetInnerHTML={{ __html: t.paradoxP1 }} />
                    <p className="mt-2" dangerouslySetInnerHTML={{ __html: t.paradoxP2 }} />
                    <p className="mt-2" dangerouslySetInnerHTML={{ __html: t.paradoxP3 }} />
                  </div>
                </div>

                {/* Popularity / Feature importance layout */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-950 dark:text-white mb-1">
                    {t.globalCoeffTitle}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-4">
                    {t.globalCoeffSub}
                  </p>

                  <div className="space-y-4">
                    {[
                      { index: 1, name: t.coeff1Name, weight: lang === 'tr' ? '%25.4' : '25.4%', bar: '100%' },
                      { index: 2, name: t.coeff2Name, weight: lang === 'tr' ? '%22.1' : '22.1%', bar: '87%' },
                      { index: 3, name: t.coeff3Name, weight: lang === 'tr' ? '%18.5' : '18.5%', bar: '73%' },
                      { index: 4, name: t.coeff4Name, weight: lang === 'tr' ? '%14.6' : '14.6%', bar: '57%' },
                      { index: 5, name: t.coeff5Name, weight: lang === 'tr' ? '%12.3' : '12.3%', bar: '48%' },
                    ].map((item) => (
                      <div key={item.index} className="flex gap-4 items-center">
                        <div className="w-7 h-7 bg-neutral-100 dark:bg-neutral-800 border border-black/10 dark:border-white/10 rounded-none flex items-center justify-center text-xs text-neutral-900 dark:text-white font-extrabold flex-shrink-0">
                          {item.index}
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{item.name}</span>
                            <span className="font-bold text-neutral-900 dark:text-white">{item.weight}</span>
                          </div>
                          <div className="w-full h-[2px] bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded-none">
                            <div className="h-full bg-neutral-900 dark:bg-white" style={{ width: item.bar }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
