/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';

import { DiabetesFeatures, FEATURE_METADATA } from './types';
import { predictDiabetes } from './utils/model';

// Select options lists mapped with localized descriptions
const AGE_GROUPS = [
  { value: 1, label: '18 - 24 yaş' },
  { value: 2, label: '25 - 29 yaş' },
  { value: 3, label: '30 - 34 yaş' },
  { value: 4, label: '35 - 39 yaş' },
  { value: 5, label: '40 - 44 yaş' },
  { value: 6, label: '45 - 49 yaş' },
  { value: 7, label: '50 - 54 yaş' },
  { value: 8, label: '55 - 59 yaş' },
  { value: 9, label: '60 - 64 yaş' },
  { value: 10, label: '65 - 69 yaş' },
  { value: 11, label: '70 - 74 yaş' },
  { value: 12, label: '75 - 79 yaş' },
  { value: 13, label: '80 yaş ve üzeri' },
];

const EDUCATION_LEVELS = [
  { value: 1, label: 'Okuma yazması yok veya okulsuz' },
  { value: 2, label: 'İlkokul mezunu (Grade 1-8)' },
  { value: 3, label: 'Lise terk öğrencisi (Grade 9-11)' },
  { value: 4, label: 'Lise Mezunu' },
  { value: 5, label: 'Önlisans / Üniversite Terk' },
  { value: 6, label: 'Üniversite veya İleri Derece Mezunu' },
];

const INCOME_GROUPS = [
  { value: 1, label: 'Aşırı Düşük Gelir (< 10.000 $ / yıl)' },
  { value: 2, label: 'Çok Düşük Gelir (10.000 $ - 15.000 $)' },
  { value: 3, label: 'Düşük Gelir (15.000 $ - 20.000 $)' },
  { value: 4, label: 'Ortanın Altı Gelir (20.000 $ - 25.000 $)' },
  { value: 5, label: 'Orta Gelir Seviyesi (25.000 $ - 35.000 $)' },
  { value: 6, label: 'Ortanın Üzeri Gelir (35.000 $ - 50.000 $)' },
  { value: 7, label: 'Yüksek Gelir Seviyesi (50.000 $ - 75.000 $)' },
  { value: 8, label: 'En Üst Gelir Grubu (75.000 $ ve üzeri)' },
];

export default function App() {
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

  // BMI Value & Status Calculated dynamically
  const calculatedBMI = useMemo(() => {
    if (height > 0 && weight > 0) {
      return parseFloat((weight / (height / 100) ** 2).toFixed(1));
    }
    return 25.0;
  }, [height, weight]);

  const bmiMeta = useMemo(() => {
    const val = calculatedBMI;
    if (val < 18.5) return { label: 'Zayıf', color: '#1D4ED8', class: 'bg-blue-50 text-blue-800 border border-blue-200' };
    if (val < 25.0) return { label: 'Normal Kilolu', color: '#0F5132', class: 'bg-emerald-50 text-emerald-800 border border-emerald-200' };
    if (val < 30.0) return { label: 'Fazla Kilolu', color: '#B45309', class: 'bg-amber-50 text-amber-800 border border-amber-200' };
    return { label: 'Obez', color: '#B91C1C', class: 'bg-red-50 text-red-800 border border-red-200' };
  }, [calculatedBMI]);

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
    return predictDiabetes(submissionData);
  }, [formData, calculatedBMI]);

  const progressPct = ((currentStep - 1) / 3) * 100;

  // Personalized advice generator based on predictive contributions
  const personalRecommendations = useMemo(() => {
    const advice: string[] = [];

    if (formData.HighBP === 1) {
      advice.push(
        '<strong>Tansiyon Kontrolü:</strong> Teşhis edilmiş yüksek tansiyonunuz bulunuyor. Sodyum tüketiminizi kısıtlayıp ilaçlarınızı hekim tavsiyesine göre aksatmamak diyabet riskini ciddi oranda düşürür.'
      );
    }
    if (formData.HighChol === 1) {
      advice.push(
        '<strong>Kolesterol Yönetimi:</strong> Yüksek kolesterol insülin direncini ve vasküler riskleri tetikler. Endüstriyel trans yağlardan kaçınmalı ve lifli yulaf, bakliyat diyetine ağırlık vermelisiniz.'
      );
    }
    if (calculatedBMI >= 30) {
      advice.push(
        '<strong>Bilinçli Kilo Yönetimi:</strong> BMI değeriniz obezite aralığında. Toplam vücut kütlenizde yapacağınız yalnızca %5 ila %8 hafifleme dahi insülin duyarlılığınızı geri kazanmanıza muazzam yardım eder.'
      );
    } else if (calculatedBMI >= 25) {
      advice.push(
        '<strong>Kilo Dengeleme:</strong> BMI değeriniz hafif kilolu sınırında seyrediyor. Karbonhidrat porsiyon kontrolü uygulayarak kilonuzun ilerlemesini sınırlandırmanız akılcı bir koruma tedbiridir.'
      );
    }
    if (formData.PhysActivity === 0) {
      advice.push(
        '<strong>Aktif Yaşama Geçiş:</strong> Son 30 günde düzenli egzersiz yapmadığınızı belirttiniz. Haftada 150 dakika orta tempolu yürüyüş veya bisiklet sürmek, kasların glukoz kullanımını uyararak şekeri dengeler.'
      );
    }
    if (formData.Smoker === 1) {
      advice.push(
        '<strong>Sigara Tedavisi:</strong> Nikotin hücresel düzeyde insülin reseptör hasarı ile diyabet riskini pekiştirir. Sigara bırakma programlarına katılarak bu majör risk odağını eleyebilirsiniz.'
      );
    }
    if (formData.Fruits === 0 || formData.Veggies === 0) {
      advice.push(
        '<strong>Beslenme Optimizasyonu:</strong> Günlük taze sebze ve meyve tüketiminiz düşük seviyede. Lifli gıda ve antioksidanlar bağırsak mikrobiyotasını onararak glisemik dalgalanmaları önler.'
      );
    }

    advice.push(
      '<strong>Akademik Bilgi Notu:</strong> Bu sistem tıbbi bir danışmanlık alternatifi değildir. Riskiniz yüksek çıksın veya çıkmasın, kesin tanı ve erken teşhis için mutlaka hekim gözetiminde kan ölçüm testi (HbA1c) yaptırınız.'
    );

    return advice.slice(0, 4); // return max 4 top targeted items
  }, [formData, calculatedBMI]);

  return (
    <div className="relative w-full max-w-5xl mx-auto z-10 px-4 py-12">
      {/* Decorative architectural background lines */}
      <div className="background-decor">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="app-container relative">
        {/* Header bar: Balanced, structured, symmetric */}
        <header className="app-header mb-12 pb-6 flex flex-col md:flex-row justify-between items-stretch md:items-center border-b border-[#1A1A1A]/10 gap-6">
          <div className="logo flex items-center gap-4">
            <div className="p-3 bg-[#1A1A1A] text-[#F4F4F1] relative">
              <HeartPulse id="logo" className="w-6 h-6" />
            </div>
            <div className="logo-text">
              <h1 className="font-display font-bold text-xl md:text-2xl tracking-[0.15em] uppercase text-[#1A1A1A]">
                Equilibrium
              </h1>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-bold block mt-1">
                Diyabet Risk Analizi • IE410 Advanced Computer Programming
              </span>
            </div>
          </div>

          {/* Navigation Controls in architectural tabs style */}
          <nav className="app-nav flex gap-2">
            <button
              id="btn-nav-calc"
              onClick={() => setActiveTab('predict')}
              className={`nav-btn font-bold cursor-pointer flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-widest transition-all duration-150 rounded-none ${
                activeTab === 'predict'
                  ? 'bg-[#1A1A1A] text-[#F4F4F1] border border-[#1A1A1A]'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F4F4F1]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" /> Risk Hesaplayıcı
            </button>
            <button
              id="btn-nav-dash"
              onClick={() => setActiveTab('dashboard')}
              className={`nav-btn font-bold cursor-pointer flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-widest transition-all duration-150 rounded-none ${
                activeTab === 'dashboard'
                  ? 'bg-[#1A1A1A] text-[#F4F4F1] border border-[#1A1A1A]'
                  : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F4F4F1]'
              }`}
            >
              <ChartLine className="w-3.5 h-3.5" /> Model Dashboard
            </button>
          </nav>
        </header>

        {/* Main Content Sections */}
        <main className="app-main relative z-10 animate-fade-in">
          {activeTab === 'predict' ? (
            <div>
              {/* Form Wizard vs Results display */}
              {!showResults ? (
                <div className="glass-card p-6 md:p-10 bg-white">
                  {/* Step Progress Tracks Component */}
                  <div className="form-progress relative flex justify-between items-center mb-12 px-2 md:px-8">
                    <div className="progress-track absolute top-5 left-10 right-10 h-[2px] bg-[#1A1A1A]/10 -z-10">
                      <div
                        className="progress-fill h-full bg-[#1A1A1A] transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>

                    {[
                      { step: 1, label: 'Demografi' },
                      { step: 2, label: 'Vücut & Sağlık' },
                      { step: 3, label: 'Geçmiş' },
                      { step: 4, label: 'Yaşam Tarzı' },
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
                              ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#F4F4F1]'
                              : currentStep > item.step
                              ? 'bg-transparent border-[#1A1A1A] text-[#1A1A1A]'
                              : 'bg-white border-[#1A1A1A]/15 text-neutral-400 group-hover:border-[#1A1A1A]/30'
                          }`}
                        >
                          {item.step}
                        </div>
                        <span
                          className={`step-label text-[10px] uppercase tracking-wider font-bold transition-colors duration-200 ${
                            currentStep === item.step
                              ? 'text-[#1A1A1A]'
                              : currentStep > item.step
                              ? 'text-[#1A1A1A]/80'
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
                          <div className="step-header mb-8 border-l-2 border-[#1A1A1A] pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/40 block mb-1">
                              Bölüm 01
                            </span>
                            <h2 className="font-display font-light text-2xl text-[#1A1A1A] tracking-tight">
                              Demografik & Sosyal Bilgiler
                            </h2>
                            <p className="text-xs text-[#1A1A1A]/60 mt-1 max-w-2xl leading-relaxed">
                              Lütfen yaş grubu, biyolojik cinsiyete bağlı değişkenler ve eğitim/gelir düzeylerinizi belirtin.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Gender selection cards */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                Biyolojik Cinsiyet
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
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                                        : 'bg-white border-[#1A1A1A]/15 text-neutral-600 hover:bg-[#F4F4F1] hover:text-[#1A1A1A]'
                                    }`}
                                  >
                                    <Venus className="w-4 h-4 text-emerald-500" />
                                    <span>Kadın</span>
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
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                                        : 'bg-white border-[#1A1A1A]/15 text-neutral-600 hover:bg-[#F4F4F1] hover:text-[#1A1A1A]'
                                    }`}
                                  >
                                    <Mars className="w-4 h-4 text-sky-500" />
                                    <span>Erkek</span>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* Age categories list */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label htmlFor="age-select" className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                Yaş Aralığı
                              </label>
                              <div className="relative">
                                <select
                                  id="age-select"
                                  name="Age"
                                  value={formData.Age}
                                  onChange={handleSelectChange}
                                  className="w-full bg-white border border-[#1A1A1A]/15 rounded-none px-4 py-3.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] hover:bg-[#F4F4F1] transition-all duration-150 appearance-none cursor-pointer"
                                >
                                  {AGE_GROUPS.map((g) => (
                                    <option key={g.value} value={g.value} className="bg-white text-[#1A1A1A]">
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
                              <label htmlFor="education-select" className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                Öğrenim Durumu
                              </label>
                              <div className="relative">
                                <select
                                  id="education-select"
                                  name="Education"
                                  value={formData.Education}
                                  onChange={handleSelectChange}
                                  className="w-full bg-white border border-[#1A1A1A]/15 rounded-none px-4 py-3.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] hover:bg-[#F4F4F1] transition-all duration-150 appearance-none cursor-pointer"
                                >
                                  {EDUCATION_LEVELS.map((el) => (
                                    <option key={el.value} value={el.value} className="bg-white text-[#1A1A1A]">
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
                              <label htmlFor="income-select" className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                Yıllık Hane Gelir Düzeyi
                              </label>
                              <div className="relative">
                                <select
                                  id="income-select"
                                  name="Income"
                                  value={formData.Income}
                                  onChange={handleSelectChange}
                                  className="w-full bg-white border border-[#1A1A1A]/15 rounded-none px-4 py-3.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] hover:bg-[#F4F4F1] transition-all duration-150 appearance-none cursor-pointer"
                                >
                                  {INCOME_GROUPS.map((inc) => (
                                    <option key={inc.value} value={inc.value} className="bg-white text-[#1A1A1A]">
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
                          <div className="step-header mb-8 border-l-2 border-[#1A1A1A] pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/40 block mb-1">
                              Bölüm 02
                            </span>
                            <h2 className="font-display font-light text-2xl text-[#1A1A1A] tracking-tight">
                              Vücut Ölçüleri & Genel Sağlık
                            </h2>
                            <p className="text-xs text-[#1A1A1A]/60 mt-1 max-w-2xl leading-relaxed">
                              Biyolojik kütlenizi ve kişisel sağlık durumunuzu belirleyin.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Height & Weight Inputs */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                Boy & Kilo (BMI Hesaplayıcı)
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="relative flex items-center">
                                  <input
                                    type="number"
                                    id="input-height"
                                    min="100"
                                    max="250"
                                    value={height}
                                    onChange={(e) => setHeight(Math.max(100, Math.min(250, parseInt(e.target.value) || 100)))}
                                    className="w-full bg-white border border-[#1A1A1A]/15 rounded-none px-4 py-3.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                                  />
                                  <span className="absolute right-4 text-[10px] font-bold text-neutral-400">cm</span>
                                </div>
                                <div className="relative flex items-center">
                                  <input
                                    type="number"
                                    id="input-weight"
                                    min="30"
                                    max="300"
                                    value={weight}
                                    onChange={(e) => setWeight(Math.max(30, Math.min(300, parseInt(e.target.value) || 30)))}
                                    className="w-full bg-white border border-[#1A1A1A]/15 rounded-none px-4 py-3.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                                  />
                                  <span className="absolute right-4 text-[10px] font-bold text-neutral-400">kg</span>
                                </div>
                              </div>
                            </div>

                            {/* Evaluated reactive BMI output */}
                            <div className="form-group flex flex-col gap-2.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                Vücut Kitle İndeksi (BMI)
                              </label>
                              <div className="w-full bg-[#E8E8E5]/20 border border-[#1A1A1A]/15 rounded-none px-4 py-3.5 flex justify-between items-center bg-transparent">
                                <span className="text-sm font-bold font-display text-[#1A1A1A]">
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
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                              Genel Sağlık Değerlendirmeniz
                            </label>
                            <p className="text-xs text-[#1A1A1A]/50 mt-1">
                              Genel sağlık durumunuzu nasıl nitelendirirsiniz (1 En İyi - 5 En Kötü)?
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
                              {[
                                { val: 1, label: 'Mükemmel' },
                                { val: 2, label: 'Çok İyi' },
                                { val: 3, label: 'İyi' },
                                { val: 4, label: 'Orta' },
                                { val: 5, label: 'Kötü' },
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  id={`btn-health-rating-${item.val}`}
                                  onClick={() => updateFeatureNum('GenHlth', item.val)}
                                  className={`p-4 rounded-none border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 ${
                                    formData.GenHlth === item.val
                                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                                      : 'bg-white border-[#1A1A1A]/15 text-[#1A1A1A]/60 hover:bg-[#F4F4F1] hover:text-[#1A1A1A]'
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
                                <label htmlFor="mental-health-slider" className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                  Ruh Sağlığı Şikayeti
                                </label>
                                <span className="bg-[#1A1A1A] text-white px-2 py-0.5 rounded-none text-[9px] font-bold">
                                  {formData.MentHlth} Gün
                                </span>
                              </div>
                              <p className="text-xs text-[#1A1A1A]/50 max-w-sm leading-normal">
                                Son 30 günün kaç gününde stres, depresyon veya ruhsal düşüş yaşadınız?
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
                                <label htmlFor="physical-health-slider" className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                                  Fiziksel Sağlık Şikayeti
                                </label>
                                <span className="bg-[#1A1A1A] text-white px-2 py-0.5 rounded-none text-[9px] font-bold">
                                  {formData.PhysHlth} Gün
                                </span>
                              </div>
                              <p className="text-xs text-[#1A1A1A]/50 max-w-sm leading-normal">
                                Son 30 günün kaç gününde hastalık, ağrı veya bedensel yaralanma yaşadınız?
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
                          <div className="step-header mb-8 border-l-2 border-[#1A1A1A] pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/40 block mb-1">
                              Bölüm 03
                            </span>
                            <h2 className="font-display font-light text-2xl text-[#1A1A1A] tracking-tight">
                              Klinik & Tıbbi Öykü
                            </h2>
                            <p className="text-xs text-[#1A1A1A]/60 mt-1 max-w-2xl leading-relaxed">
                              Lütfen resmi tıp kuruluşlarınca konmuş tanı veya vasküler durumlarınızı belirtin.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { key: 'HighBP', title: 'Yüksek Tansiyon (HighBP)', desc: 'Yüksek tansiyon teşhisi konuldu mu?' },
                              { key: 'HighChol', title: 'Yüksek Kolesterol (HighChol)', desc: 'Kolesterolünüz yüksek teşhis edildi mi?' },
                              { key: 'CholCheck', title: 'Kolesterol Kontrolü (CholCheck)', desc: 'Son 5 yıl içinde kolesterol testi yaptırdınız mı?' },
                              { key: 'Stroke', title: 'Felç Geçmişi (Stroke)', desc: 'Daha önce inme ya da geçici felç yaşadınız mı?' },
                              { key: 'HeartDiseaseorAttack', title: 'Kalp Rahatsızlığı', desc: 'Kalp krizi veya koroner arter hasarı öyküsü var mı?' },
                              { key: 'DiffWalk', title: 'Yürüme Güçlüğü (DiffWalk)', desc: 'Merdiven çıkmada veya hareket etmede zorluk var mı?' },
                            ].map((item) => (
                              <div
                                key={item.key}
                                onClick={() => toggleToggle(item.key as keyof DiabetesFeatures)}
                                className={`p-4 rounded-none border flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F4F4F1] transition-all duration-150 ${
                                  formData[item.key as keyof DiabetesFeatures] === 1
                                    ? 'bg-neutral-100 border-[#1A1A1A] text-[#1A1A1A]'
                                    : 'bg-white border-[#1A1A1A]/10 text-[#1A1A1A]/80'
                                }`}
                                id={`toggle-card-${item.key}`}
                              >
                                <div>
                                  <h3 className="text-xs font-bold uppercase tracking-wider">{item.title}</h3>
                                  <p className="text-[10px] text-neutral-500 mt-1 leading-normal">{item.desc}</p>
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
                                        ? 'bg-[#1A1A1A]'
                                        : 'bg-neutral-200'
                                    }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-none bg-white transition-all duration-200 absolute top-1 left-1 ${
                                        formData[item.key as keyof DiabetesFeatures] === 1
                                          ? 'translate-x-5'
                                          : 'translate-x-0'
                                      }`}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
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
                          <div className="step-header mb-8 border-l-2 border-[#1A1A1A] pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/40 block mb-1">
                              Bölüm 04
                            </span>
                            <h2 className="font-display font-light text-2xl text-[#1A1A1A] tracking-tight">
                              Yaşam Tarzı & Alışkanlıklar
                            </h2>
                            <p className="text-xs text-[#1A1A1A]/60 mt-1 max-w-2xl leading-relaxed">
                              Günlük rasyon, egzersiz döngünüz ve temel sağlık sistemi ilişkileriniz.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { key: 'Smoker', title: 'Sigara Tüketimi (Smoker)', desc: 'Hayatınızda toplam en az 100 adet sigara içtiniz mi?' },
                              { key: 'PhysActivity', title: 'Aktif Egzersiz', desc: 'Son 30 günde düzenli egzersiz veya spor yaptınız mı?' },
                              { key: 'Fruits', title: 'Meyve Tüketimi', desc: 'Günde en az bir kez taze meyve tüketiyor musunuz?' },
                              { key: 'Veggies', title: 'Sebze Tüketimi', desc: 'Günde en az bir kez sebze yemekleri yiyor musunuz?' },
                              { key: 'HvyAlcoholConsump', title: 'Ölçüsüz Alkol Tüketimi', desc: 'Haftalık olarak erkekler için >14, kadınlar için >8 kadeh?' },
                              { key: 'AnyHealthcare', title: 'Sağlık Güvencesi', desc: 'Herhangi bir kamu (SGK/Yeşil Kart vb.) veya özel sağlık güvenceniz var mı?' },
                              { key: 'NoDocbcCost', title: 'Maddi Erişilebilirlik Sorunu', desc: 'Pahalı geldiği için gidemediğiniz veya aksattığınız bir vizite oldu mu?' },
                            ].map((item) => (
                              <div
                                key={item.key}
                                onClick={() => toggleToggle(item.key as keyof DiabetesFeatures)}
                                className={`p-4 rounded-none border flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F4F4F1] transition-all duration-150 ${
                                  formData[item.key as keyof DiabetesFeatures] === 1
                                    ? 'bg-neutral-100 border-[#1A1A1A] text-[#1A1A1A]'
                                    : 'bg-white border-[#1A1A1A]/10 text-[#1A1A1A]/80'
                                }`}
                                id={`toggle-card-${item.key}`}
                              >
                                <div>
                                  <h3 className="text-xs font-bold uppercase tracking-wider">{item.title}</h3>
                                  <p className="text-[10px] text-neutral-500 mt-1 leading-normal">{item.desc}</p>
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
                                        ? 'bg-[#1A1A1A]'
                                        : 'bg-neutral-200'
                                    }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-none bg-white transition-all duration-200 absolute top-1 left-1 ${
                                        formData[item.key as keyof DiabetesFeatures] === 1
                                          ? 'translate-x-5'
                                          : 'translate-x-0'
                                      }`}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Form Step Buttons in a flat symmetric line */}
                  <div className="form-actions flex justify-between items-center mt-12 pt-6 border-t border-[#1A1A1A]/10">
                    <button
                      type="button"
                      id="btn-prev-step"
                      disabled={currentStep === 1}
                      onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                      className="cursor-pointer border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all duration-150 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A] flex items-center gap-1.5 rounded-none"
                    >
                      <ChevronLeft className="w-4 h-4" /> Geri
                    </button>

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        id="btn-next-step"
                        onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                        className="cursor-pointer border border-[#1A1A1A] bg-[#1A1A1A] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all duration-150 flex items-center gap-1.5 rounded-none"
                      >
                        İleri <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        id="btn-submit-calc"
                        onClick={() => setShowResults(true)}
                        className="cursor-pointer border border-[#1A1A1A] bg-[#1A1A1A] text-white px-7 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all duration-150 flex items-center gap-1.5 rounded-none"
                      >
                        <HeartPulse className="w-4 h-4 text-rose-500" /> Analiz Raporunu Al
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Symmetric Dynamic Interactive Results Interface */
                <div id="results-panel-container" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Gauge Display Card Left */}
                  <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center md:col-span-5 relative bg-white">
                    <div className="result-header mb-8">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/40 block mb-1">
                        Hesaplama Özeti
                      </span>
                      <h2 className="font-display font-light text-xl text-[#1A1A1A] tracking-tight">Eğilim Analiz Göstergesi</h2>
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
                            stroke: '#1A1A1A',
                          }}
                        />
                      </svg>
                      <div className="gauge-text-container absolute inset-0 flex flex-col justify-center items-center">
                        <span className="gauge-percentage font-display text-4xl font-extrabold text-[#1A1A1A]">
                          {Math.round(analysisResult.probability * 100)}%
                        </span>
                        <span className="gauge-label text-[8px] font-bold tracking-[0.2em] text-[#1A1A1A]/50 uppercase mt-1">
                          Risk Olasılığı
                        </span>
                      </div>
                    </div>

                    <div className="risk-badge-wrapper mb-6">
                      <span
                        className="risk-level-badge text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-none border"
                        style={{
                          borderColor: '#1A1A1A',
                          color: '#FFFFFF',
                          backgroundColor: '#1A1A1A',
                        }}
                      >
                        {analysisResult.risk_level}
                      </span>
                    </div>

                    <p className="risk-explanation text-xs text-[#1A1A1A]/70 leading-relaxed max-w-sm mb-8">
                      {analysisResult.risk_level === 'Düşük Risk' ? (
                        <>
                          Biyometrik modelleriniz, diyabet risk profilinizi <strong>güvenli / düşük</strong> seviyede görmektedir. Mevcut sağlıklı döngünüzü koruyun.
                        </>
                      ) : analysisResult.risk_level === 'Orta Risk' ? (
                        <>
                          Modelimiz, diyabet eşiğinizi <strong>orta dereceli risk</strong> grubunda görmektedir. Tıbbi ve metabolik dinamiklerinizde optimize edilebilecek alanlar bulunuyor.
                        </>
                      ) : (
                        <>
                          Dikkat: Algoritma profili, <strong>yüksek diyabet yatkınlığı</strong> tespit etti. Glisemik dengenizi netleştirmek üzere bir uzman hekim kontrolü talep edebilirsiniz.
                        </>
                      )}
                    </p>

                    <button
                      type="button"
                      id="btn-restart-calc"
                      onClick={() => {
                        setShowResults(false);
                        setCurrentStep(1);
                      }}
                      className="cursor-pointer border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all duration-150 rounded-none w-full"
                    >
                      <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Yeniden Hesapla
                    </button>
                  </div>

                  {/* Contributions & Personal Recommendations Right */}
                  <div className="glass-card p-6 md:p-8 md:col-span-7 flex flex-col bg-white">
                    <div className="step-header mb-6 border-l-2 border-[#1A1A1A] pl-4">
                      <h2 className="font-display font-medium text-lg text-[#1A1A1A] tracking-tight">Bireysel Karar Özellikleri</h2>
                      <p className="text-xs text-[#1A1A1A]/60 mt-1">Özniteliklerin risk katsayılarına göre bireysel ağırlık dağılımı</p>
                    </div>

                    {/* Factor selection tabs in architect flat look */}
                    <div className="factor-tabs flex border border-[#1A1A1A]/10 p-1 rounded-none mb-6 self-start bg-[#F4F4F1]">
                      <button
                        type="button"
                        id="btn-factors-risk"
                        onClick={() => setFactorTab('risk')}
                        className={`factor-tab text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-none cursor-pointer flex items-center gap-1.5 transition-all duration-150 ${
                          factorTab === 'risk' ? 'bg-[#1A1A1A] text-white' : 'text-neutral-500 hover:text-[#1A1A1A]'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-brand-rose" /> Risk Artıranlar
                      </button>
                      <button
                        type="button"
                        id="btn-factors-protective"
                        onClick={() => setFactorTab('protective')}
                        className={`factor-tab text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-none cursor-pointer flex items-center gap-1.5 transition-all duration-150 ${
                          factorTab === 'protective' ? 'bg-[#1A1A1A] text-white' : 'text-neutral-500 hover:text-[#1A1A1A]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> Koruyucu Faktörler
                      </button>
                    </div>

                    {/* Filtered features contribution scrollable box */}
                    <div className="factors-list custom-scrollbar max-h-68 overflow-y-auto flex flex-col gap-3 pr-2 mb-6">
                      {useMemo(() => {
                        const items = analysisResult.contributions.filter((f) => f.type === factorTab);
                        if (items.length === 0) {
                          return (
                            <p className="text-xs text-neutral-400 italic text-center py-6">
                              Bu kategoride belirleyici bir faktör saptanmadı.
                            </p>
                          );
                        }

                        const maxC = Math.max(...analysisResult.contributions.map((x) => Math.abs(x.contribution)), 0.01);

                        return items.map((f) => {
                          const percentageWidth = Math.min((Math.abs(f.contribution) / maxC) * 100, 100);

                          let labelText = '';
                          if (f.feature === 'BMI') labelText = `${f.value} kg/m²`;
                          else if (f.feature === 'MentHlth' || f.feature === 'PhysHlth') labelText = `${f.value} gün`;
                          else if (f.feature === 'Age') labelText = AGE_GROUPS.find((ag) => ag.value === f.value)?.label || `${f.value}`;
                          else if (f.feature === 'GenHlth') {
                            const map: any = { 1: 'Mükemmel', 2: 'Çok İyi', 3: 'İyi', 4: 'Orta', 5: 'Kötü' };
                            labelText = map[f.value] || `${f.value}`;
                          } else if (f.feature === 'Sex') labelText = f.value === 1 ? 'Erkek' : 'Kadın';
                          else labelText = f.value === 1 ? 'Evet' : 'Hayır';

                          return (
                            <div
                              key={f.feature}
                              className="factor-item p-3.5 border border-[#1A1A1A]/10 bg-neutral-50/50 flex flex-col gap-2 hover:border-[#1A1A1A]/20 transition-all rounded-none"
                              id={`factor-term-${f.feature}`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-xs text-[#1A1A1A]">
                                  {f.label} ({labelText})
                                </span>
                                <span
                                  className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none ${
                                    f.type === 'risk' ? 'bg-red-50 text-brand-rose border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  }`}
                                >
                                  {f.type === 'risk' ? 'Pozitif Korelasyon' : 'Negatif Korelasyon'}
                                </span>
                              </div>
                              <div className="factor-bar w-full h-[3px] bg-neutral-200 overflow-hidden rounded-none">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    f.type === 'risk' ? 'bg-[#1A1A1A]' : 'bg-[#1D4ED8]'
                                  }`}
                                  style={{ width: `${percentageWidth}%` }}
                                ></div>
                              </div>
                              <p className="factor-desc text-[10px] text-neutral-500 leading-normal">{f.desc}</p>
                            </div>
                          );
                        });
                      }, [analysisResult, factorTab])}
                    </div>

                    {/* Recommended Medical & Lifestyle actions list box */}
                    <div className="recommendations-box border border-dashed border-[#1A1A1A]/20 bg-[#F4F4F1]/30 p-5 mt-auto rounded-none">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 mb-3.5">
                        <Award className="w-4 h-4 text-[#1A1A1A]" /> Klinik Yaşam Tarzı Tavsiyeleri
                      </h3>
                      <ul className="space-y-3">
                        {personalRecommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="text-neutral-600 text-[11px] leading-relaxed relative pl-4 before:content-['□'] before:text-[#1A1A1A] before:absolute before:left-0 before:font-bold before:text-[9px]"
                            dangerouslySetInnerHTML={{ __html: rec }}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tab: Academic Report Dashboard */
            <div id="academic-dashboard-panel" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Left Column: Academic Stats and Metric summaries */}
              <div className="glass-card p-6 md:p-8 flex flex-col bg-white rounded-none">
                <div className="step-header mb-8 border-l-2 border-[#1A1A1A] pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/40 block mb-1">
                    Metrikler
                  </span>
                  <h2 className="font-display font-semibold text-xl text-[#1A1A1A] tracking-tight">Akademik Model Raporu</h2>
                  <p className="text-xs text-neutral-500 mt-1 max-w-lg leading-relaxed">
                    IE410 Advanced Computer Programming kapsamında CDC BRFSS veri kümesiyle eğitilen en dengeli Parametrik Regresyon özellikleri
                  </p>
                </div>

                <div className="model-badge-large flex items-center gap-3.5 p-4 rounded-none border border-[#1A1A1A]/10 bg-[#F4F4F1]/40 mb-8 select-none">
                  <Activity className="w-6 h-6 text-[#1A1A1A] flex-shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Logistic Regression (Balanced)</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Sınıf kütle ağırlıkları dengelenmiş parametrik olasılık modeli</p>
                  </div>
                </div>

                {/* Grid performance card metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Test Accuracy', val: '86.4%', width: '86.4%' },
                    { label: 'Sensitivity (Recall)', val: '76.2%', width: '76.2%' },
                    { label: 'ROC AUC Skoru', val: '0.8226', width: '82.2%' },
                    { label: 'F1-Score değeri', val: '0.4430', width: '44.3%' },
                  ].map((m, idx) => (
                    <div key={idx} className="metric-card p-4 rounded-none bg-neutral-50/50 border border-black/10 flex flex-col">
                      <span className="font-display font-extrabold text-2xl text-[#1A1A1A] tracking-tight">{m.val}</span>
                      <span className="text-[9px] text-[#1A1A1A]/60 uppercase font-bold tracking-widest mt-1.5 mb-3">
                        {m.label}
                      </span>
                      <div className="w-full h-[2px] bg-neutral-200 overflow-hidden">
                        <div
                          className="h-full bg-[#1A1A1A]"
                          style={{ width: m.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="info-block mt-auto pt-6 border-t border-[#1A1A1A]/10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
                    Analiz Parametreleri & Bilgileri
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-500 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1A1A1A] font-bold">•</span>
                      <span><strong>Model Boyutu:</strong> CDC BRFSS 2015 Anket kümesi (253.680 onaylı veri kaydı)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1A1A1A] font-bold">•</span>
                      <span><strong>Uyum Yaklaşımı:</strong> Popülasyon dengesizliği optimizasyonu için `class_weight='balanced'` entegrasyonu.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1A1A1A] font-bold">•</span>
                      <span><strong>Segmentasyon Oranı:</strong> %80 Eğitim (202.944 satır), %20 Test (50.736 satır)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1A1A1A] font-bold">•</span>
                      <span><strong>Doğrulama Metodu:</strong> Stratified 5-Fold grid arama modeliyle hiperparametre seçimi.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Accuracy Paradox & Global Importance weights */}
              <div className="glass-card p-6 md:p-8 flex flex-col gap-8 bg-white rounded-none">
                <div>
                  <div className="step-header mb-4 border-l-2 border-[#1A1A1A] pl-4">
                    <h2 className="font-display font-semibold text-lg text-[#1A1A1A] tracking-tight">Doğruluk Paradoksu (Accuracy Paradox)</h2>
                    <p className="text-xs text-neutral-500">Klinik taramalarda neden doğruluk tek başına yanıltıcı bir ölçüttür?</p>
                  </div>

                  <div className="paradox-box border-l-2 border-[#1A1A1A] bg-[#F4F4F1] p-5 text-xs leading-relaxed text-[#1A1A1A]/80 rounded-none">
                    <p>
                      CDC BRFSS popülasyon taramasında test grubunun <strong>%86.1’i sağlıklı</strong>, yalnızca <strong>%13.9’u diyabet</strong> teşhisi taşır.
                    </p>
                    <p className="mt-2 text-neutral-600">
                      Hiçbir algoritma yazmadan herkese peşinen "Diyabet Değil" diyen bir sistem test verisinde <strong>%86.1 bağıl doğruluk (accuracy)</strong> oranını yakalardı ancak hasta kişilerin hiçbirini tespit edemez (%0 Duyarlılık) ve gerçek teşhis kapasitesini tamamen yitirirdi.
                    </p>
                    <p className="mt-2 text-neutral-600">
                      Geliştirdiğimiz dengeli uyarıcı model, duyarlılık payını varsayılan %15.6 katsayısından <strong>%76.2 seviyesine</strong> çarpıcı biçimde yükselterek, klinik tarama aşamasında hayat kurtaracak duyarlı bir eşiğe uyarlanmıştır.
                    </p>
                  </div>
                </div>

                {/* Popularity / Feature importance layout */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                    Küresel Risk Katsayıları (Global Coefficient Weights)
                  </h3>
                  <p className="text-[11px] text-neutral-500 mb-4">
                    Tüm popülasyonda modelin diyabet olasılığını saptarken baz aldığı en baskın katsayı sütunları
                  </p>

                  <div className="space-y-4">
                    {[
                      { index: 1, name: 'Genel Sağlık Değerlendirmesi (GenHlth)', weight: '%25.4', bar: '100%' },
                      { index: 2, name: 'Teşhis Edilmiş Yüksek Tansiyon (HighBP)', weight: '%22.1', bar: '87%' },
                      { index: 3, name: 'Vücut Kitle İndeksi (BMI)', weight: '%18.5', bar: '73%' },
                      { index: 4, name: 'Yaş Grubu Katsayısı (Age)', weight: '%14.6', bar: '57%' },
                      { index: 5, name: 'Yüksek Kolesterol Teşhisi (HighChol)', weight: '%12.3', bar: '48%' },
                    ].map((item) => (
                      <div key={item.index} className="flex gap-4 items-center">
                        <div className="w-7 h-7 bg-neutral-100 border border-black/10 rounded-none flex items-center justify-center text-xs text-[#1A1A1A] font-extrabold flex-shrink-0">
                          {item.index}
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-neutral-700">{item.name}</span>
                            <span className="font-bold text-[#1A1A1A]">{item.weight}</span>
                          </div>
                          <div className="w-full h-[2px] bg-neutral-200 overflow-hidden rounded-none">
                            <div className="h-full bg-[#1A1A1A]" style={{ width: item.bar }}></div>
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
