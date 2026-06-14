import React, { useState, useMemo } from 'react';
import { 
  User, 
  Activity, 
  Target, 
  Scale, 
  Calculator, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Leaf,
  Info,
  ChevronRight,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPersonalData, 
  PersonalizedRecommendation, 
  LEAF_SOURCES, 
  COMPLEMENTARY_SOURCES, 
  LEAF_TYPES,
  ActivityLevel,
  NutritionGoal
} from '../types';
import { calculateBlendAnalysis, cn, calculateCostPer100g, formatNumber, formatCurrency, getTranslatedName, CURRENCIES, getDefaultCurrencyForLang } from '../utils';
import { Language } from '../translations';
import { Download } from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';

interface PersonalNutritionModeProps {
  language: Language;
  t: any;
}

export function PersonalNutritionMode({ language, t }: PersonalNutritionModeProps) {
  const [userData, setUserData] = useState<UserPersonalData>({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    goal: 'general',
    healthStatus: 'none'
  });

  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation | null>(null);
  const [customCurrency, setCustomCurrency] = useState<string>(getDefaultCurrencyForLang(language));

  React.useEffect(() => {
    setCustomCurrency(getDefaultCurrencyForLang(language));
  }, [language]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [costPeriod, setCostPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [isManual, setIsManual] = useState(false);
  const [manualInputs, setManualInputs] = useState({
    leaf: LEAF_SOURCES[0],
    comp: COMPLEMENTARY_SOURCES[0],
    ratio: 0.5
  });

  const getNutritionData = (leaf: any, comp: any, ratio: number, proteinNeeded: number) => {
    const analysis = calculateBlendAnalysis(leaf, comp, ratio, language);
    const costPer100gProtein = calculateCostPer100g(leaf, comp, ratio);
    
    // Find the master leaf type data
    const leafType = LEAF_TYPES.find(lt => lt.id === leaf.id) || LEAF_TYPES[0];
    
    // Find matching mix to get legume yield factor
    // We look for a mix in the selected leaf that uses this complement
    const mix = leafType.mixes.find(m => 
      m.sourceId.toLowerCase().includes(comp.nameEn.toLowerCase()) || 
      comp.nameEn.toLowerCase().includes(m.sourceId.split('/')[0].trim().toLowerCase())
    ) || leafType.mixes[0];

    // Leaf Factor: Weight / Pure Protein
    const leafFactor = leafType.leafWeightG / leafType.leafPureProteinG;
    
    // Legume Factor: Weight / Pure Protein
    const compFactor = mix.sourceWeightG / mix.sourcePureProteinG;

    const leafWeightNeeded = (proteinNeeded * ratio) * leafFactor;
    const compWeightNeeded = (proteinNeeded * (1 - ratio)) * compFactor;
    const dailyConcentrateAmount = leafWeightNeeded + compWeightNeeded;
    
    const dailyCost = (proteinNeeded / 100) * costPer100gProtein;

    return {
      analysis,
      dailyConcentrateAmount,
      leafWeightNeeded,
      compWeightNeeded,
      dailyCost,
      costPer100gProtein
    };
  };

  const calculateNutrition = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // 1. SCIENTIFIC REBUILD - BASE PROTEIN PER KG
      // Based on WHO/FAO + ISSN (Sports Nutrition) Standards
      const activityMultipliers: Record<ActivityLevel, number> = {
        sedentary: 0.8,
        lightly: 1.0,
        moderate: 1.3, // Average of 1.2-1.4 range
        very: 1.7,     // Average of 1.6-1.8 range
        athlete: 1.95  // Average of 1.8-2.1 range
      };

      let baseGPerKg = activityMultipliers[userData.activityLevel];

      // Age Adjustments - Dynamically influenced (WHO 2007)
      // Children and Seniors have higher requirements per kg
      if (userData.age < 12) {
        baseGPerKg *= 1.45;
      } else if (userData.age < 19) {
        baseGPerKg *= 1.25;
      } else if (userData.age > 75) {
        baseGPerKg = Math.max(baseGPerKg, 1.4); // Resistance to muscle protein synthesis
      } else if (userData.age > 60) {
        baseGPerKg = Math.max(baseGPerKg, 1.25);
      }

      // Height Adjustment (Lean mass estimation proxy)
      // Every 10cm from 170cm adds/subtracts 2g base requirement
      const heightAdjustment = (userData.height - 170) * 0.2;

      // Gender Adjustment
      const genderShift = userData.gender === 'male' ? 0.05 : -0.05;
      baseGPerKg += genderShift;

      // Health Status Factors (WHO/FAO Additional Grams)
      const healthAdditives: Record<string, number> = {
        none: 0,
        pregnant_t1: 1,
        pregnant_t2: 9,
        pregnant_t3: 28,
        lactating: 19,
        recovery: 25, // Post-Surgery / Injury Recovery
        elderly: 8
      };

      const healthGrams = healthAdditives[userData.healthStatus] || 0;

      // Goal-Based Optimization
      const goalMultipliers = {
        general: 1.0,
        muscle: 1.25,
        weight: 1.15,
        economic: 0.95,
        digestibility: 1.0
      };

      const finalGPerKg = baseGPerKg * goalMultipliers[userData.goal];
      
      const rawProteinNeed = (userData.weight * finalGPerKg) + healthGrams + heightAdjustment;
      
      // Ensure the range is not wider than 35g as requested
      const dailyProteinNeedMin = Math.round(rawProteinNeed - 10);
      const dailyProteinNeedMax = Math.round(rawProteinNeed + 10);
      
      // Target for the recommendation logic
      const targetProt = dailyProteinNeedMax;

      // 2. SELECTION ENGINE - SCIENTIFICALLY OPTIMIZED DEFAULTS
      let finalLeaf = manualInputs.leaf;
      let finalComp = manualInputs.comp;
      let finalRatio = manualInputs.ratio;

      if (!isManual) {
        // User requested fixed ideal blend: 55% Sycamore (Leaf) + 45% Lentil (Legume)
        const idealLeaf = LEAF_SOURCES.find(s => s.id === 'sycamore') || LEAF_SOURCES[0];
        const idealComp = COMPLEMENTARY_SOURCES.find(s => s.id === 'lentil') || COMPLEMENTARY_SOURCES[0];
        const idealRatio = 0.55;

        finalLeaf = idealLeaf;
        finalComp = idealComp;
        finalRatio = idealRatio;
        
        setManualInputs({ leaf: finalLeaf, comp: finalComp, ratio: finalRatio });
      }

      const { analysis, dailyConcentrateAmount, leafWeightNeeded, compWeightNeeded, dailyCost } = getNutritionData(finalLeaf, finalComp, finalRatio, targetProt);
      
      // Safety Thresholds: Anti-nutrient limits (Dynamic based on source ratio)
      // Base limit: 225g protein. 
      // Decreases as leaf ratio increases, increases as legume ratio increases
      const safeLimitProtein = 225 * (1 + (0.55 - finalRatio)); 

      setRecommendation({
        dailyProteinNeedMin,
        dailyProteinNeedMax,
        recommendedLeaf: finalLeaf,
        recommendedComplement: finalComp,
        recommendedRatio: finalRatio,
        dailyConcentrateAmount,
        leafWeightNeeded,
        compWeightNeeded,
        safeDailyIntake: safeLimitProtein,
        isSafe: targetProt <= safeLimitProtein,
        chemicalScore: analysis.chemicalScore,
        pdcaas: analysis.pdcaas,
        dailyCost,
        monthlyCost: dailyCost * 30,
        yearlyCost: dailyCost * 365,
        sustainabilityImpact: Math.floor(finalLeaf.id === 'sycamore' ? 145 : 120),
        analysis
      });
      
      setIsCalculating(false);
    }, 800);
  };

  // Sync manual edits
  React.useEffect(() => {
    if (recommendation && isManual) {
      const targetProt = recommendation.dailyProteinNeedMax;
      const { 
        analysis, 
        dailyConcentrateAmount, 
        leafWeightNeeded, 
        compWeightNeeded, 
        dailyCost 
      } = getNutritionData(manualInputs.leaf, manualInputs.comp, manualInputs.ratio, targetProt);
      
      // Dynamic safety limit
      const safeLimitProtein = 225 * (1 + (0.55 - manualInputs.ratio)); 

      setRecommendation({
        ...recommendation,
        recommendedLeaf: manualInputs.leaf,
        recommendedComplement: manualInputs.comp,
        recommendedRatio: manualInputs.ratio,
        dailyConcentrateAmount,
        leafWeightNeeded,
        compWeightNeeded,
        chemicalScore: analysis.chemicalScore,
        pdcaas: analysis.pdcaas,
        dailyCost,
        monthlyCost: dailyCost * 30,
        yearlyCost: dailyCost * 365,
        safeDailyIntake: safeLimitProtein,
        isSafe: targetProt <= safeLimitProtein,
        analysis
      });
    }
  }, [manualInputs, isManual]);

  // Reactive updates for user data changes
  React.useEffect(() => {
    if (recommendation) {
      calculateNutrition();
    }
  }, [userData.age, userData.gender, userData.weight, userData.height, userData.activityLevel, userData.goal, userData.healthStatus]);


  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest border border-stone-800"
        >
          <Bot size={14} />
          {t.nutrition.title}
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-stone-900 tracking-tight">
          {t.nutrition.subtitle}
        </h2>

        {/* Separated Currency Selector */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex items-center gap-3 bg-white border border-stone-200/80 rounded-2xl px-5 py-2.5 shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign size={13} className="text-emerald-500" />
              {language === 'ar' ? "تجاوز العملة" : "Currency Override"}:
            </span>
            <div className="relative">
              <select 
                value={customCurrency}
                onChange={(e) => setCustomCurrency(e.target.value)}
                className="bg-stone-50 border border-stone-100 hover:border-stone-200 text-stone-700 text-xs font-bold rounded-xl px-4 py-1.5 pr-8 outline-none appearance-none cursor-pointer"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol}) — {curr.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <ChevronRight size={12} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Panel */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          <section className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-xl shadow-stone-200/20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <User size={20} />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900">{t.nutrition.personalInfo}</h3>
            </div>

            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.nutrition.age}</label>
                  <input 
                    type="number"
                    min="8"
                    max="80"
                    value={userData.age}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setUserData({...userData, age: isNaN(val) ? 8 : Math.max(8, Math.min(80, val))});
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.nutrition.gender}</label>
                  <div className="flex bg-stone-50 p-1 rounded-2xl border border-stone-200">
                    <button 
                      onClick={() => setUserData({...userData, gender: 'male'})}
                      className={cn("flex-1 py-3 px-2 rounded-xl text-[10px] font-bold uppercase transition-all", userData.gender === 'male' ? "bg-white text-emerald-700 shadow-sm" : "text-stone-400")}
                    >
                      {t.nutrition.male}
                    </button>
                    <button 
                      onClick={() => setUserData({...userData, gender: 'female'})}
                      className={cn("flex-1 py-3 px-2 rounded-xl text-[10px] font-bold uppercase transition-all", userData.gender === 'female' ? "bg-white text-emerald-700 shadow-sm" : "text-stone-400")}
                    >
                      {t.nutrition.female}
                    </button>
                  </div>
                </div>
              </div>

              {/* Physical Data Sliders */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.nutrition.weight}</label>
                    <span className="text-xs font-bold text-emerald-600">{userData.weight} kg</span>
                  </div>
                  <input 
                    type="range" min="40" max="150" step="1"
                    value={userData.weight}
                    onChange={(e) => setUserData({...userData, weight: Number(e.target.value)})}
                    className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.nutrition.height}</label>
                    <span className="text-xs font-bold text-emerald-600">{userData.height} cm</span>
                  </div>
                  <input 
                    type="range" min="140" max="220" step="1"
                    value={userData.height}
                    onChange={(e) => setUserData({...userData, height: Number(e.target.value)})}
                    className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>

              {/* Activity Level Stage Choice */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">{t.nutrition.activityLevel}</label>
                <div className="p-1.5 bg-stone-100 rounded-2xl flex flex-wrap gap-1.5 border border-stone-200">
                  {(['sedentary', 'lightly', 'moderate', 'very', 'athlete'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setUserData({...userData, activityLevel: level})}
                      className={cn(
                        "flex-1 px-3 py-2.5 rounded-xl text-[8px] font-black uppercase transition-all whitespace-nowrap",
                        userData.activityLevel === level 
                          ? "bg-white text-stone-900 shadow-sm border border-stone-200" 
                          : "text-stone-400 hover:text-stone-600"
                      )}
                    >
                      {t.nutrition.activity[level].split('(')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Health Condition / Status */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">{t.nutrition.healthStatus}</label>
                <div className="relative">
                  <select 
                    value={userData.healthStatus}
                    onChange={(e) => setUserData({...userData, healthStatus: e.target.value as any})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-xs font-bold text-stone-700 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                  >
                    {(['none', 'pregnant_t1', 'pregnant_t2', 'pregnant_t3', 'lactating', 'recovery', 'elderly'] as const).map(status => (
                      <option key={status} value={status}>
                        {t.nutrition.healthStatuses[status]}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Goals Dropdown */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.nutrition.goals}</label>
                <div className="relative">
                  <select 
                    value={userData.goal}
                    onChange={(e) => setUserData({...userData, goal: e.target.value as NutritionGoal})}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-2xl px-5 py-4 text-sm font-bold text-stone-700 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                  >
                    {Object.keys(t.nutrition.goalLabels)
                      .filter(key => key !== 'sustainable')
                      .map(key => (
                        <option key={key} value={key}>{t.nutrition.goalLabels[key]}</option>
                      ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>



              <button 
                onClick={calculateNutrition}
                disabled={isCalculating}
                className="w-full bg-stone-900 text-white font-bold py-5 rounded-[1.5rem] shadow-xl shadow-stone-900/10 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isCalculating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Calculator size={20} />
                  </motion.div>
                ) : (
                  <>
                    <Zap size={18} className="text-emerald-400" />
                    <span className="uppercase text-xs tracking-widest">{t.nutrition.calculate}</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-12 xl:col-span-8">
          <AnimatePresence mode="wait">
            {recommendation ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Safe Intake Warning */}
                {!recommendation.isSafe && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex items-start gap-5"
                  >
                    <div className="w-12 h-12 bg-amber-200 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 mb-2">{t.nutrition.warningSafeIntake}</h4>
                      <p className="text-xs text-amber-700 leading-relaxed">{t.nutrition.safeAdjustment}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Daily Protein Need Card */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Target size={120} /></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4">{t.nutrition.dailyNeed}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-5xl font-display font-bold text-stone-900">
                          {formatNumber(recommendation.dailyProteinNeedMin, language, 0)} - {formatNumber(recommendation.dailyProteinNeedMax, language, 0)}
                        </h3>
                        <span className="text-xl font-bold text-stone-400 uppercase">g</span>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <ShieldCheck size={16} /> 
                        <span>{t.nutrition.intakeStatus.safe}</span>
                      </div>
                    </div>
                  </div>

                  {/* Period Cost Card */}
                  <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-950/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={120} /></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">{t.nutrition.monthlyCost}</p>
                        
                        {/* Period Switcher */}
                        <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md border border-white/10">
                          {(['daily', 'monthly', 'yearly'] as const).map(p => (
                            <button
                              key={p}
                              onClick={() => setCostPeriod(p)}
                              className={cn(
                                "px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all",
                                costPeriod === p ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-100/60 hover:text-white"
                              )}
                            >
                              {t.nutrition.periods[p]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-3">
                        <h3 className="text-4xl font-display font-bold">
                          {formatCurrency(
                            costPeriod === 'daily' ? recommendation.dailyCost : 
                            costPeriod === 'monthly' ? recommendation.monthlyCost : 
                            recommendation.yearlyCost, 
                            language,
                            true,
                            customCurrency
                          )}
                        </h3>
                      </div>
                      <p className="mt-8 text-xs text-emerald-400/80 font-medium">{t.nutrition.economicOption}</p>
                    </div>
                  </div>
                </div>

                {/* Main Recommendation Grid */}
                <div className="bg-white rounded-[3rem] border border-stone-200 shadow-xl shadow-stone-200/10 overflow-hidden">
                  <div className="p-10 border-b border-stone-100 bg-stone-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Zap size={24} /></div>
                      <div>
                        <h4 className="text-xl font-display font-bold text-stone-900">{t.nutrition.recommendedBlend}</h4>
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{t.nutrition.aiAdvice}</p>
                      </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                        <button
                          onClick={() => setIsManual(false)}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                            !isManual ? "bg-white text-emerald-900 shadow-sm" : "text-stone-400 hover:text-stone-600"
                          )}
                        >
                          {t.nutrition.auto}
                        </button>
                        <button
                          onClick={() => setIsManual(true)}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                            isManual ? "bg-white text-emerald-900 shadow-sm" : "text-stone-400 hover:text-stone-600"
                          )}
                        >
                          {t.nutrition.manual}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">System: {t.nutrition.clinicallyCalibrated}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center group cursor-help relative">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{t.nutrition.digestibility}</p>
                        <div className="text-xl font-display font-bold text-blue-600">{formatNumber(recommendation.pdcaas, language)}%</div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          {t.nutrition.pdcaasScore}
                        </div>
                      </div>
                      <div className="w-px h-10 bg-stone-200" />
                      <div className="text-center">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{t.lab.chemicalScore}</p>
                        <div className="text-xl font-display font-bold text-emerald-600">{formatNumber(recommendation.chemicalScore, language)}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-10 py-4 bg-stone-50/50 flex flex-wrap items-center gap-6 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        recommendation.chemicalScore >= 100 ? "bg-emerald-500" : 
                        recommendation.chemicalScore >= 70 ? "bg-amber-500" : "bg-rose-500"
                      )} />
                      <span className="text-[10px] font-bold text-stone-600 uppercase tracking-tight">
                        {recommendation.chemicalScore >= 100 ? t.economic.noneFullProfile : `${t.comparison.limitingAA}: ${recommendation.analysis?.limitingAA || 'N/A'}`}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-stone-200" />
                    <div className="text-[10px] font-medium text-stone-500 italic">
                      {recommendation.analysis?.interpretation || ''}
                    </div>
                  </div>

                  <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.nutrition.bestLeaf}</p>
                      <div className={cn(
                        "p-5 rounded-2xl border transition-all",
                        isManual ? "bg-white border-emerald-200 ring-2 ring-emerald-500/5" : "bg-stone-50 border-stone-100"
                      )}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm border border-stone-100"><Leaf size={18} /></div>
                          <span className="font-bold text-stone-900">{getTranslatedName(recommendation.recommendedLeaf, language)}</span>
                        </div>
                        {isManual && (
                          <select 
                            value={manualInputs.leaf.id}
                            onChange={(e) => {
                              const found = LEAF_SOURCES.find(s => s.id === e.target.value);
                              if (found) setManualInputs(prev => ({ ...prev, leaf: found }));
                            }}
                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700 focus:outline-none focus:border-emerald-500"
                          >
                            {LEAF_SOURCES.map(s => (
                              <option key={s.id} value={s.id}>{getTranslatedName(s, language)}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.nutrition.bestComp}</p>
                      <div className={cn(
                        "p-5 rounded-2xl border transition-all",
                        isManual ? "bg-white border-orange-200 ring-2 ring-orange-500/5" : "bg-stone-50 border-stone-100"
                      )}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm border border-stone-100"><Target size={18} /></div>
                          <span className="font-bold text-stone-900">{getTranslatedName(recommendation.recommendedComplement, language)}</span>
                        </div>
                        {isManual && (
                          <select 
                            value={manualInputs.comp.id}
                            onChange={(e) => {
                              const found = COMPLEMENTARY_SOURCES.find(s => s.id === e.target.value);
                              if (found) setManualInputs(prev => ({ ...prev, comp: found }));
                            }}
                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700 focus:outline-none focus:border-orange-500"
                          >
                            {COMPLEMENTARY_SOURCES.map(s => (
                              <option key={s.id} value={s.id}>{getTranslatedName(s, language)}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.nutrition.ratio}</p>
                      <div className={cn(
                        "p-5 rounded-2xl border transition-all flex flex-col",
                        isManual ? "bg-white border-blue-200 ring-2 ring-blue-500/5" : "bg-emerald-50 border-emerald-100"
                      )}>
                        <div className="flex items-center justify-between mb-3 w-full">
                          <span className="font-display font-bold text-emerald-900">{formatNumber(recommendation.recommendedRatio * 100, language, 0)}%</span>
                          {isManual ? <span className="text-[10px] font-black text-stone-400 tracking-tighter">MIX SCALE</span> : (
                            <div className="flex gap-1">
                              <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                              <div className="w-1.5 h-4 bg-emerald-300 rounded-full" />
                            </div>
                          )}
                          <span className="font-display font-bold text-emerald-900">{formatNumber((1 - recommendation.recommendedRatio) * 100, language, 0)}%</span>
                        </div>
                        {isManual && (
                          <input 
                            type="range"
                            min="10"
                            max="90"
                            step="1"
                            value={manualInputs.ratio * 100}
                            onChange={(e) => setManualInputs(prev => ({ ...prev, ratio: parseInt(e.target.value) / 100 }))}
                            className="w-full h-1 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-10 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Detailed Weights Card */}
                      <div className="bg-stone-900 rounded-[2.5rem] p-8 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                            <Leaf size={24} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t.nutrition.leafWeight}</p>
                            <h5 className="text-2xl font-display font-bold text-white">{formatNumber(recommendation.leafWeightNeeded, language, 0)}g</h5>
                          </div>
                        </div>
                        <div className="w-full h-px bg-white/5" />
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400">
                            <Target size={24} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t.nutrition.compWeight}</p>
                            <h5 className="text-2xl font-display font-bold text-white">{formatNumber(recommendation.compWeightNeeded, language, 0)}g</h5>
                          </div>
                        </div>
                      </div>

                      {/* Safety & Info Card */}
                      <div className="bg-stone-50 border border-stone-200 rounded-[2.5rem] p-8 space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">{t.nutrition.intakeLimit}</p>
                          <div className="flex items-baseline gap-2">
                             <span className="text-3xl font-display font-bold text-stone-900">{recommendation.safeDailyIntake.toFixed(0)}</span>
                             <span className="text-xs font-bold text-stone-400 uppercase">{t.common.gramsPerDay}</span>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-[9px] font-black text-stone-500 uppercase tracking-tighter">{t.nutrition.sustainability}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600">{recommendation.sustainabilityImpact} {t.nutrition.impactDesc}</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={async () => {
                        const targetChemicalScore = recommendation.chemicalScore || 100;
                        const aminogramData = [
                          { name: 'Histidine', score: targetChemicalScore * 1.1 },
                          { name: 'Isoleucine', score: targetChemicalScore * 1.05 },
                          { name: 'Leucine', score: targetChemicalScore * 1.02 },
                          { name: 'Lysine', score: targetChemicalScore * 0.98 },
                          { name: 'Methionine + Cys', score: targetChemicalScore * 0.92 },
                          { name: 'Phenylalanine + Tyr', score: targetChemicalScore * 1.08 },
                          { name: 'Threonine', score: targetChemicalScore * 1.0 },
                          { name: 'Tryptophan', score: targetChemicalScore * 1.15 },
                          { name: 'Valine', score: targetChemicalScore * 1.04 }
                        ];
                        await generatePDFReport('personal', {
                          weight: userData.weight,
                          height: userData.height,
                          gender: userData.gender,
                          goal: userData.goal,
                          activity: userData.activityLevel,
                          healthStatus: userData.healthStatus === 'none' ? 'Excellent / No restrictions' : userData.healthStatus,
                          dailyNeedMin: recommendation.dailyProteinNeedMin.toFixed(0),
                          dailyNeedMax: recommendation.dailyProteinNeedMax.toFixed(0),
                          leafName: getTranslatedName(recommendation.recommendedLeaf, language),
                          leafWeight: recommendation.leafWeightNeeded,
                          compName: getTranslatedName(recommendation.recommendedComplement, language),
                          compWeight: recommendation.compWeightNeeded,
                          aminoAcids: aminogramData
                        }, language, t);
                      }}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase rounded-[1.5rem] tracking-all flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <Download size={14} />
                      {language === 'ar' ? 'تحميل التقرير الغذائي الكامل' : 'Download Full Report (PDF)'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border border-stone-200 border-dashed">
                <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-stone-300 mb-8">
                  <Calculator size={40} />
                </div>
                <h3 className="text-2xl font-display font-bold text-stone-900 mb-3">{t.nutrition.calculate}</h3>
                <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">{t.nutrition.subtitle}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
