import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Settings2, 
  Zap, 
  Scale,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Factory,
  ChevronRight,
  Flame,
  Wind,
  ShieldCheck,
  RefreshCw,
  Sprout,
  Calculator,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { LEAF_TYPES, COMPLEMENTARY_SOURCES, FAO_2013_ADULT_STANDARD } from '../types';
import { cn, formatNumber, formatCurrency, getTranslatedName, CURRENCIES, getCurrencyInfoByCode, getDefaultCurrencyForLang } from '../utils';
import { Language, translations } from '../translations';
import { Download } from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';

interface EconomicDefaults {
  leafPricePerKg: number;
  lentilPricePerKg: number;
  chickpeaPricePerKg: number;
  lupinPricePerKg: number;
  soyPricePerKg: number;
  favaPricePerKg: number;
  filterClothCost: number;
  waterCostPerL: number;
  lemonCost: number;
  vinegarCost: number;
  electricityCost: number;
  gasCost: number;
  laborRate: number;
  wheyPrice: number;
}

const DEFAULT_PARAMS: EconomicDefaults = {
  leafPricePerKg: 0,
  lentilPricePerKg: 45,
  chickpeaPricePerKg: 55,
  lupinPricePerKg: 55,
  soyPricePerKg: 70,
  favaPricePerKg: 60,
  filterClothCost: 4,
  waterCostPerL: 0.0039 / 6,
  lemonCost: 0.75,
  vinegarCost: 0.60,
  electricityCost: 0.30,
  gasCost: 0.20,
  laborRate: 15,
  wheyPrice: 150
};

export const EconomicAnalysis = ({ language = 'en', t = translations.en }: { language?: Language, t?: any }) => {
  const [leafId, setLeafId] = useState(LEAF_TYPES[0].id);
  const [leafQuantity, setLeafQuantity] = useState(1750);
  const [complementId, setComplementId] = useState(COMPLEMENTARY_SOURCES[1].id); // Default to Lentils
  const [isAdmin, setIsAdmin] = useState(false);
  const [params, setParams] = useState<EconomicDefaults>(DEFAULT_PARAMS);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [complementRatio, setComplementRatio] = useState(0.45); // 45% complement

  const [customCurrency, setCustomCurrency] = useState<string>(getDefaultCurrencyForLang(language));

  React.useEffect(() => {
    setCustomCurrency(getDefaultCurrencyForLang(language));
  }, [language]);

  const currencyInfo = useMemo(() => getCurrencyInfoByCode(customCurrency), [customCurrency]);
  const rate = currencyInfo.rate;

  const selectedLeaf = useMemo(() => LEAF_TYPES.find(l => l.id === leafId)!, [leafId]);
  const selectedComplement = useMemo(() => COMPLEMENTARY_SOURCES.find(c => c.id === complementId)!, [complementId]);

  const results = useMemo(() => {
    // Base batch size from the reference image
    const BASE_LEAF_BATCH = selectedLeaf.leafWeightG;
    const scaleFactor = leafQuantity / BASE_LEAF_BATCH;

    // 1. Calculate extractable leaf protein
    const leafProteinContent = selectedLeaf.leafProteinPercent / 100; 
    const extractionEfficiency = 0.65; 
    const dryMatterConversion = 0.22; 
    
    const leafProteinYield = selectedLeaf.leafPureProteinG * scaleFactor;
    
    // 2. Blend Analysis (Manual Ratio)
    const blendAA = Object.keys(FAO_2013_ADULT_STANDARD).map(aa => {
      const leafAA = selectedLeaf.aminoAcids[aa as keyof typeof selectedLeaf.aminoAcids] || 0;
      const compAA = selectedComplement.aminoAcids[aa as keyof typeof selectedComplement.aminoAcids] || 0;
      const blendValue = (leafAA * (1 - complementRatio)) + (compAA * complementRatio);
      const target = FAO_2013_ADULT_STANDARD[aa as keyof typeof FAO_2013_ADULT_STANDARD];
      return { aa, score: (blendValue / target) * 100 };
    });

    const minScore = Math.min(...blendAA.map(a => a.score));
    const isComplete = minScore >= 100;
    const limitingAA = isComplete ? "" : blendAA.reduce((prev, curr) => prev.score < curr.score ? prev : curr).aa;

    // 3. Economic Engine
    const totalProteinProduced = leafProteinYield / (1 - complementRatio || 1);
    const complementProteinNeeded = totalProteinProduced * complementRatio;
    
    // Yield factors (grams of raw material per gram of pure protein)
    const leafYieldFactor = 31.818181818181817; 
    const legumeYieldFactor = 6.666666666666667; 

    const rawLeafWeight = leafProteinYield * leafYieldFactor;
    const rawComplementWeight = complementProteinNeeded * legumeYieldFactor;
    
    const leafCost = (rawLeafWeight / 1000) * params.leafPricePerKg;
    
    // Get complement price from params
    let complementPrice = params.lentilPricePerKg;
    if (selectedComplement.id === 'chickpea') complementPrice = params.chickpeaPricePerKg;
    else if (selectedComplement.id === 'lupin') complementPrice = params.lupinPricePerKg;
    else if (selectedComplement.id === 'soy') complementPrice = params.soyPricePerKg;
    else if (selectedComplement.id === 'fava') complementPrice = params.favaPricePerKg;

    const complementCost = (rawComplementWeight / 1000) * complementPrice;
    
    const totalRawMaterialCost = leafCost + complementCost;

    // Scaling costs based on leaf quantity
    const processingCosts = {
      filterCloth: (leafQuantity / selectedLeaf.leafWeightG) * params.filterClothCost,
      water: params.waterCostPerL * 6 * scaleFactor,
      lemon: params.lemonCost * scaleFactor,
      vinegar: params.vinegarCost * scaleFactor,
      electricity: params.electricityCost * scaleFactor,
      gas: params.gasCost * scaleFactor
    };

    const totalProductionCost = totalRawMaterialCost + Object.values(processingCosts).reduce((a, b) => a + b, 0);
    
    const costPerGram = totalProductionCost / totalProteinProduced;
    const costPer100g = costPerGram * 100;
    const costPerKg = costPerGram * 1000;
    
    const profitMargin = sellingPrice > 0 ? ((sellingPrice - costPerKg) / sellingPrice) * 100 : 0;
    const savingsVsWhey = ((params.wheyPrice - costPer100g) / params.wheyPrice) * 100;

    // Safety Constraints
    const isIllogical = costPer100g <= 0 || costPer100g < (totalRawMaterialCost / totalProteinProduced * 100 * 0.9);

    return {
      leafProteinYield,
      complementProteinNeeded,
      totalProteinProduced,
      complementRatio,
      isComplete,
      limitingAA,
      totalProductionCost,
      totalRawMaterialCost,
      costPerGram,
      costPer100g,
      costPerKg,
      profitMargin,
      savingsVsWhey,
      isIllogical,
      debug: {
        leafCost,
        complementCost,
        rawLeafWeight,
        rawComplementWeight,
        totalProteinProduced,
        formula: `((${rawLeafWeight.toFixed(0)}g * ${params.leafPricePerKg}) + (${rawComplementWeight.toFixed(0)}g * ${complementPrice})) / ${totalProteinProduced.toFixed(1)}g * 100`
      },
      breakdown: {
        leafCost,
        complementCost,
        ...processingCosts
      }
    };
  }, [leafId, leafQuantity, complementId, params, sellingPrice, selectedLeaf, selectedComplement, complementRatio]);

  return (
    <div className="space-y-16 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest text-emerald-700">
            {t.economic?.sectionLabel || "Economic Analysis"}
          </div>
          <h2 className="text-4xl font-display font-bold text-stone-900 tracking-tight leading-tight">
            {t.economic?.title}
          </h2>
          <p className="text-stone-500 max-w-2xl text-sm font-medium leading-relaxed">
            {t.economic?.subtitle}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select 
              value={customCurrency}
              onChange={(e) => setCustomCurrency(e.target.value)}
              className="bg-white text-stone-700 border border-stone-200 hover:border-stone-300 rounded-2xl px-5 py-3 pr-10 text-[10px] font-bold uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md focus:ring-2 focus:ring-emerald-500/15"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code} className="text-stone-950 font-bold">
                  {curr.code} ({curr.symbol}) — {curr.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <DollarSign size={14} className="text-emerald-500" />
            </div>
          </div>

          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-[10px] uppercase tracking-widest",
              isAdmin 
                ? "bg-stone-900 text-white shadow-xl shadow-stone-900/20" 
                : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 shadow-sm"
            )}
          >
            <Settings2 size={16} />
            {isAdmin ? t.common.exitAdmin : t.common.adminSettings}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-4 space-y-10">
          <div className="glass-card p-8 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                <Zap size={18} />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900 tracking-tight">{t.economic.inputs}</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Leaf size={14} />
                    {t.economic.leafType}
                  </label>
                  <select 
                    value={leafId}
                    onChange={(e) => setLeafId(e.target.value)}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {LEAF_TYPES.map(leaf => (
                      <option key={leaf.id} value={leaf.id}>
                        {getTranslatedName(leaf, language as Language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Scale size={14} />
                    {t.economic.leafQty}
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={leafQuantity}
                      onChange={(e) => setLeafQuantity(parseFloat(e.target.value) || 0)}
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-stone-400">{t.common.grams}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Sprout size={14} />
                    {t.economic.complement}
                  </label>
                  <select 
                    value={complementId}
                    onChange={(e) => setComplementId(e.target.value)}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {COMPLEMENTARY_SOURCES.map(comp => (
                      <option key={comp.id} value={comp.id}>
                        {getTranslatedName(comp, language as Language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={14} />
                    {t.economic.sellingPrice}
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={sellingPrice === 0 ? "" : parseFloat((sellingPrice * rate).toFixed(4))}
                      onChange={(e) => setSellingPrice((parseFloat(e.target.value) || 0) / rate)}
                      placeholder={t.lab.enterSellingPrice}
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-stone-400">{currencyInfo.symbol}/KG</div>
                  </div>
                </div>

                <div className="pt-8 border-t border-stone-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.economic.blendRatio}</label>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-600">
                      <span>{getTranslatedName(selectedLeaf, language as Language)}</span>
                      <span>{getTranslatedName(selectedComplement, language as Language)}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={complementRatio}
                      onChange={(e) => setComplementRatio(parseFloat(e.target.value))}
                      className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-stone-400 tracking-widest">
                      <span>{((1 - complementRatio) * 100).toFixed(0)}%</span>
                      <span>{(complementRatio * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-8 border-t border-stone-100 space-y-4"
                >
                  <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{t.economic.adminCostDefaults}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <AdminInput label={`${t.leaves?.sycamore || 'Sycamore'} (${currencyInfo.symbol}/kg)`} value={params.leafPricePerKg * rate} onChange={(v) => setParams(p => ({...p, leafPricePerKg: v / rate}))} />
                    <AdminInput label={`${t.sources?.lentil || 'Lentil'} (${currencyInfo.symbol}/kg)`} value={params.lentilPricePerKg * rate} onChange={(v) => setParams(p => ({...p, lentilPricePerKg: v / rate}))} />
                    <AdminInput label={`${t.sources?.chickpea || 'Chickpea'} (${currencyInfo.symbol}/kg)`} value={params.chickpeaPricePerKg * rate} onChange={(v) => setParams(p => ({...p, chickpeaPricePerKg: v / rate}))} />
                    <AdminInput label={`${t.sources?.lupin || 'Lupin'} (${currencyInfo.symbol}/kg)`} value={params.lupinPricePerKg * rate} onChange={(v) => setParams(p => ({...p, lupinPricePerKg: v / rate}))} />
                    <AdminInput label={`${t.sources?.soy || 'Soy'} (${currencyInfo.symbol}/kg)`} value={params.soyPricePerKg * rate} onChange={(v) => setParams(p => ({...p, soyPricePerKg: v / rate}))} />
                    <AdminInput label={`${t.sources?.fava || 'Fava'} (${currencyInfo.symbol}/kg)`} value={params.favaPricePerKg * rate} onChange={(v) => setParams(p => ({...p, favaPricePerKg: v / rate}))} />
                    <AdminInput label={`${t.economic.filterCloth} (${currencyInfo.symbol})`} value={params.filterClothCost * rate} onChange={(v) => setParams(p => ({...p, filterClothCost: v / rate}))} />
                    <AdminInput label={`${t.economic.lemon} (${currencyInfo.symbol})`} value={params.lemonCost * rate} onChange={(v) => setParams(p => ({...p, lemonCost: v / rate}))} />
                    <AdminInput label={`${t.economic.vinegar} (${currencyInfo.symbol})`} value={params.vinegarCost * rate} onChange={(v) => setParams(p => ({...p, vinegarCost: v / rate}))} />
                    <AdminInput label={`${t.economic.electricity} (${currencyInfo.symbol})`} value={params.electricityCost * rate} onChange={(v) => setParams(p => ({...p, electricityCost: v / rate}))} />
                    <AdminInput label={`${t.economic.gas} (${currencyInfo.symbol})`} value={params.gasCost * rate} onChange={(v) => setParams(p => ({...p, gasCost: v / rate}))} />
                    <AdminInput label={`${t.economic.whey100g} (${currencyInfo.symbol}/100g)`} value={params.wheyPrice * rate} onChange={(v) => setParams(p => ({...p, wheyPrice: v / rate}))} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-8 border-l-4 border-l-blue-500"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  <DollarSign size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{t.economic.results.batchCost}</span>
              </div>
              <div className="text-4xl font-display font-bold text-stone-900 tracking-tight">
                {formatCurrency(results.totalProductionCost, language, true, customCurrency)}
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-4">{t.common.perBatch}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className={cn(
                "glass-card p-8 border-l-4 border-l-amber-500 transition-all duration-300",
                results.isIllogical ? "ring-2 ring-rose-500/50 shadow-rose-500/10" : ""
              )}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
                  <TrendingUp size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{t.economic.results.cost100g}</span>
              </div>
              <div className="text-4xl font-display font-bold text-stone-900 tracking-tight">
                {formatCurrency(results.costPer100g, language, true, customCurrency)}
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-4">{t.economic.results.fao}</p>
            </motion.div>
          </div>

          {results.isIllogical && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-200 p-6 rounded-3xl flex items-center gap-4 text-rose-700 text-sm shadow-sm"
            >
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <p className="font-medium leading-relaxed">
                <strong className="block text-rose-900 mb-1 tracking-tight">{t.economic.recalculationAlert || "Recalculation Alert"}</strong>
                {t.economic.recalculationDesc || "The calculated cost deviates from realistic raw material floors. Please check input parameters."}
              </p>
            </motion.div>
          )}

          {isAdmin && (
            <div className="bg-stone-900 text-emerald-400 p-8 rounded-[2.5rem] font-mono text-[10px] space-y-4 border border-emerald-500/20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-grain" />
              <div className="flex items-center gap-3 mb-4 text-white border-b border-white/10 pb-4 relative z-10">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <FlaskConical size={16} className="text-emerald-400" />
                </div>
                <span className="uppercase font-bold tracking-[0.2em]">{t.economic.debugMode || "Debug Transparency Mode"}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 relative z-10">
                <div className="flex justify-between border-b border-white/5 pb-1"><span>{t.economic.results.leafCost}:</span> <span className="text-white font-bold">{formatCurrency(results.debug.leafCost, language, true, customCurrency)}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-1"><span>{t.economic.results.complementCost}:</span> <span className="text-white font-bold">{formatCurrency(results.debug.complementCost, language, true, customCurrency)}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-1"><span>{t.economic.results.rawLeaf}:</span> <span className="text-white font-bold">{formatNumber(results.debug.rawLeafWeight, language, 0)}{t.common.grams.toLowerCase()}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-1"><span>{t.economic.results.rawComplement}:</span> <span className="text-white font-bold">{formatNumber(results.debug.rawComplementWeight, language, 0)}{t.common.grams.toLowerCase()}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-1"><span>{t.common.netProtein}:</span> <span className="text-white font-bold">{formatNumber(results.debug.totalProteinProduced, language, 1)}{t.common.grams.toLowerCase()}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-1"><span>{t.economic.results.totalRM}:</span> <span className="text-white font-bold">{formatCurrency(results.totalRawMaterialCost, language, true, customCurrency)}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-stone-500 italic relative z-10 text-[9px] tracking-wider">
                {t.economic.formulaTransparency}: {results.debug.formula}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.economic.results.marketComp}</h3>
                <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {formatNumber(results.savingsVsWhey, language, 0)}% {t.economic.results.cheaper}
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: t.common.appTitle, value: results.costPer100g * rate, color: '#059669' },
                    { name: t.economic.results.chicken, value: 120 * rate, color: '#f59e0b' },
                    { name: t.economic.results.meat, value: 250 * rate, color: '#ef4444' },
                    { name: t.economic.results.whey, value: params.wheyPrice * rate, color: '#94a3b8' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                      tickFormatter={(value) => formatCurrency(value, language, false, customCurrency)}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }} 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      formatter={(value: number) => [formatCurrency(value, language, false, customCurrency), t.common.costPer100g]}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                      { [
                        { name: t.common.appTitle, value: results.costPer100g * rate, color: '#059669' },
                        { name: t.economic.results.chicken, value: 120 * rate, color: '#f59e0b' },
                        { name: t.economic.results.meat, value: 250 * rate, color: '#ef4444' },
                        { name: t.economic.results.whey, value: params.wheyPrice * rate, color: '#94a3b8' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-10 text-[11px] text-stone-400 leading-relaxed text-center italic font-medium">
                "{t.economic.results.quote}"
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-stone-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-stone-900/20">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.economic.optimizationStatus}</h3>
                  {results.isComplete ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 size={14} /> {t.economic.faoCompliant}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                      <AlertCircle size={14} /> {t.economic.incomplete}
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-stone-400">{t.economic.digestibleYield}</span>
                      <span className="font-bold">{results.totalProteinProduced.toFixed(1)}g</span>
                    </div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="bg-emerald-500 h-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-stone-400 uppercase font-bold mb-2">{t.economic.limitingAA}</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {results.isComplete ? t.economic.noneFullProfile : results.limitingAA || t.economic.analyzing}
                    </p>
                  </div>
                </div>
              </div>

              {sellingPrice > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm">
                  <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-6">{t.economic.profitabilityAnalysis}</h3>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-stone-400 text-xs mb-1">{t.economic.profitMargin}</p>
                      <p className={`text-3xl font-display font-bold ${results.profitMargin > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {results.profitMargin.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-400 text-xs mb-1">{t.economic.netPerKg}</p>
                      <p className="text-xl font-bold text-stone-900">
                        {formatCurrency(sellingPrice - results.costPerKg, language, true, customCurrency)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 mb-8 flex items-center gap-2">
              <Calculator size={18} className="text-emerald-600" />
              {t.economic.breakdown.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">{t.economic.breakdown.raw}</h4>
                <div className="space-y-3">
                  <CostRow label={getTranslatedName(selectedLeaf, language as Language)} value={results.breakdown.leafCost} language={language} customCurrency={customCurrency} />
                  <CostRow label={getTranslatedName(selectedComplement, language as Language)} value={results.breakdown.complementCost} language={language} customCurrency={customCurrency} />
                  <CostRow label={t.economic.breakdown.water} value={results.breakdown.water} language={language} customCurrency={customCurrency} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">{t.economic.breakdown.processing}</h4>
                <div className="space-y-3">
                  <CostRow label={t.economic.breakdown.filter} value={results.breakdown.filterCloth} language={language} customCurrency={customCurrency} />
                  <CostRow label={t.economic.breakdown.lemon} value={results.breakdown.lemon} language={language} customCurrency={customCurrency} />
                  <CostRow label={t.economic.breakdown.vinegar} value={results.breakdown.vinegar} language={language} customCurrency={customCurrency} />
                  <CostRow label={t.economic.breakdown.electricity} value={results.breakdown.electricity} language={language} customCurrency={customCurrency} />
                  <CostRow label={t.economic.breakdown.gas} value={results.breakdown.gas} language={language} customCurrency={customCurrency} />
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm font-bold text-stone-900 uppercase">{t.economic.breakdown.total}</p>
                <p className="text-2xl font-display font-bold text-emerald-600">{formatCurrency(results.totalProductionCost, language, true, customCurrency)}</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  const tFunc = (key: string) => {
                    const parts = key.split('.');
                    let currentVal: any = t;
                    for (const part of parts) {
                      currentVal = currentVal?.[part];
                    }
                    return typeof currentVal === 'string' ? currentVal : key;
                  };
                  await generatePDFReport('economic', {
                    leafQty: `${results.debug.rawLeafWeight.toFixed(0)}`,
                    leafName: getTranslatedName(selectedLeaf, language as Language),
                    complementQty: results.debug.rawComplementWeight,
                    complementName: getTranslatedName(selectedComplement, language as Language),
                    totalOutput: results.debug.totalProteinProduced,
                    totalCost: formatCurrency(results.totalProductionCost, language, true, customCurrency),
                    costPer100g: formatCurrency(results.costPer100g, language, true, customCurrency),
                    revenue: formatCurrency((results.debug.totalProteinProduced / 1000) * sellingPrice, language, true, customCurrency),
                    netProfit: formatCurrency((results.debug.totalProteinProduced / 1000) * (sellingPrice - results.costPerKg), language, true, customCurrency),
                    profitMargin: results.profitMargin,
                    savingsVsWhey: results.savingsVsWhey,
                    rawCostPer100g: results.costPer100g,
                    wheyPriceCost: 80,
                    currencySymbol: customCurrency || 'USD',
                    breakdown: {
                      leafCost: formatCurrency(results.breakdown.leafCost, language, true, customCurrency),
                      leafLabel: getTranslatedName(selectedLeaf, language as Language),
                      complementCost: formatCurrency(results.breakdown.complementCost, language, true, customCurrency),
                      complementLabel: getTranslatedName(selectedComplement, language as Language),
                      water: formatCurrency(results.breakdown.water, language, true, customCurrency),
                      waterLabel: tFunc('economic.breakdown.water') || 'Water',
                      filterCloth: formatCurrency(results.breakdown.filterCloth, language, true, customCurrency),
                      filterClothLabel: tFunc('economic.breakdown.filter') || 'Filter cloth',
                      lemon: formatCurrency(results.breakdown.lemon, language, true, customCurrency),
                      lemonLabel: tFunc('economic.breakdown.lemon') || 'Lemon',
                      vinegar: formatCurrency(results.breakdown.vinegar, language, true, customCurrency),
                      vinegarLabel: tFunc('economic.breakdown.vinegar') || 'Vinegar',
                      electricity: formatCurrency(results.breakdown.electricity, language, true, customCurrency),
                      electricityLabel: tFunc('economic.breakdown.electricity') || 'Electricity',
                      gas: formatCurrency(results.breakdown.gas, language, true, customCurrency),
                      gasLabel: tFunc('economic.breakdown.gas') || 'Gas'
                    }
                  }, language as Language, tFunc);
                }}
                className="py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase rounded-full tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <Download size={14} />
                {language === 'ar' ? 'تحميل التقرير المالي الكامل' : 'Download Full Report (PDF)'}
              </motion.button>
            </div>
          </div>

          <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200/60">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">{t.economic.formulaTransparency}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-stone-600 leading-relaxed">
              <div className="space-y-3">
                <p className="font-bold text-stone-900 flex items-center gap-2"><ArrowRight size={12} /> {t.lab.formulaMaterials}</p>
                <p>{t.lab.formulaMaterials} = {formatCurrency(results.totalProductionCost, language, true, customCurrency)}</p>
                <p className="font-bold text-stone-900 flex items-center gap-2"><ArrowRight size={12} /> {t.lab.formulaYield}</p>
                <p>{t.lab.formulaYield}</p>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-stone-900 flex items-center gap-2"><ArrowRight size={12} /> {t.lab.formulaOptimization}</p>
                <p>{t.lab.formulaOptimization}</p>
                <p className="font-bold text-stone-900 flex items-center gap-2"><ArrowRight size={12} /> {t.lab.formulaMarketIndex}</p>
                <p>{t.lab.formulaMarketIndex}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function AdminInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-bold text-stone-500 uppercase">{label}</label>
      <input 
        type="number"
        value={value === 0 ? "" : parseFloat(value.toFixed(4))}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}

function CostRow({ label, value, language, customCurrency }: { label: string, value: number, language: string, customCurrency?: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-stone-500">{label}</span>
      <span className="font-bold text-stone-900">{formatCurrency(value, language, true, customCurrency)}</span>
    </div>
  );
}

function ResultCard({ label, value, sub, icon, className }: { label: string, value: string, sub: string, icon: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl shadow-stone-200/5 relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">{label}</p>
      <p className="text-3xl font-display font-bold text-stone-900 mb-1">{value}</p>
      <p className="text-xs text-stone-500 font-medium">{sub}</p>
    </div>
  );
}
