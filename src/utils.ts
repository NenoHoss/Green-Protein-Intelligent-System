import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  AminoAcids, 
  FAO_2013_ADULT_STANDARD, 
  ProteinSource, 
  BlendAnalysis,
  LeafType,
  ProteinMix,
  CalculationResult,
  COMPLEMENTARY_SOURCES,
  LEAF_SOURCES
} from './types';
import { Language, translations } from './translations';

export function getTranslatedName(obj: any, lang: Language): string {
  const t = translations[lang] as any;
  
  // Try to find in centralized translations first
  if (obj.id) {
    if (t.leaves && t.leaves[obj.id]) return t.leaves[obj.id];
    if (t.sources && t.sources[obj.id]) return t.sources[obj.id];
  }

  const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  const key = `name${capitalizedLang}`;
  return obj[key] || obj.nameEn;
}

export function calculateProduction(
  leaf: LeafType, 
  quantityGrams: number, 
  mix: ProteinMix,
  lang: Language = 'en'
): CalculationResult {
  const scaleFactor = quantityGrams / leaf.leafWeightG;
  
  // Ratios are defined in the mix
  const leafRatio = mix.leafRatioPercent / 100;
  const sourceRatio = mix.sourceRatioPercent / 100;

  // Calculate pure proteins based on the target ratio
  // Total Pure Protein = Leaf Pure Protein / Leaf Ratio
  const leafProteinTotal = leaf.leafPureProteinG * scaleFactor;
  const totalPureProtein = leafProteinTotal / leafRatio;
  const sourcePureProteinG = totalPureProtein - leafProteinTotal;
  
  // Find the complementary source for biological info and prices
  const complement = COMPLEMENTARY_SOURCES.find(s => s.id === mix.sourceId) || COMPLEMENTARY_SOURCES[0];

  const leafSource = LEAF_SOURCES.find(s => s.id === leaf.id) || LEAF_SOURCES[0];

  // Derive weights from pure proteins using efficiencies from the mix definition
  // We use the mix's defined sourceProteinPercent and a derived yield factor
  const legumeProteinEfficiency = mix.sourcePureProteinG / (mix.sourceProteinConcentrateG || 1);
  const legumeYieldEfficiency = mix.sourceProteinConcentrateG / (mix.sourceWeightG || 1);

  const sourceConcentrateG = sourcePureProteinG / (mix.sourceProteinPercent / 100 || legumeProteinEfficiency || 0.6);
  const sourceWeightG = sourceConcentrateG / (legumeYieldEfficiency || 0.28);
  
  const finalPureProteinG = leafProteinTotal + sourcePureProteinG;
  const leafConcentrateG = leaf.leafProteinConcentrateG * scaleFactor;
  const finalProteinConcentrateG = leafConcentrateG + sourceConcentrateG;
  const finalProteinPercent = (finalPureProteinG / finalProteinConcentrateG) * 100;

  // Costs
  const leafCost = (quantityGrams / 1000) * leafSource.pricePerKg;
  const legumeCost = (sourceWeightG / 1000) * complement.pricePerKg;
  const totalRawMaterialCost = leafCost + legumeCost;

  const costPer100g = finalPureProteinG > 0 
    ? (totalRawMaterialCost / finalPureProteinG) * 100 
    : 0;

  const wasteReductionKg = (leaf.wasteG * scaleFactor) / 1000;
  const soilEnhancerKg = wasteReductionKg;
  const sustainabilityImpact = Math.floor(leafSource.id === 'sycamore' ? 145 : 120);

  // Calculate blend analysis
  const blendAnalysis = calculateBlendAnalysis(leafSource, complement, leafRatio, lang);

  // Map blend analysis back to AminoAcids interface
  const optimizedAminoAcids: AminoAcids = {
    histidine: blendAnalysis.aminoAcids.find(aa => aa.key === 'histidine')?.blend || 0,
    isoleucine: blendAnalysis.aminoAcids.find(aa => aa.key === 'isoleucine')?.blend || 0,
    leucine: blendAnalysis.aminoAcids.find(aa => aa.key === 'leucine')?.blend || 0,
    lysine: blendAnalysis.aminoAcids.find(aa => aa.key === 'lysine')?.blend || 0,
    saa: blendAnalysis.aminoAcids.find(aa => aa.key === 'saa')?.blend || 0,
    aaa: blendAnalysis.aminoAcids.find(aa => aa.key === 'aaa')?.blend || 0,
    threonine: blendAnalysis.aminoAcids.find(aa => aa.key === 'threonine')?.blend || 0,
    tryptophan: blendAnalysis.aminoAcids.find(aa => aa.key === 'tryptophan')?.blend || 0,
    valine: blendAnalysis.aminoAcids.find(aa => aa.key === 'valine')?.blend || 0,
  };

  return {
    leafName: getTranslatedName(leaf, lang),
    sourceId: mix.sourceId,
    leafProteinGrams: leafProteinTotal,
    extractedProteinGrams: leafProteinTotal,
    leafPureProteinG: leafProteinTotal,
    sourcePureProteinG: sourcePureProteinG,
    supplementProteinGrams: sourcePureProteinG,
    totalProteinGrams: finalPureProteinG,
    netYield: finalProteinPercent,
    originalAminoAcids: leaf.aminoAcids,
    optimizedAminoAcids,
    totalCost: totalRawMaterialCost,
    costPer100gNetProtein: costPer100g,
    wasteReductionKg,
    soilEnhancerKg,
    sustainabilityImpact,
    dailyIntakeGrams: mix.maxDailyProteinG,
    prepNotes: leaf.prepNotes,
    soilBenefits: leaf.soilBenefits,
    soilMethod: leaf.soilEnhancerMethod,
    soilSteps: leaf.soilEnhancerSteps,
    finalConcentrateG: finalProteinConcentrateG,
    leafConcentrateG: leafConcentrateG,
    sourceConcentrateG: sourceConcentrateG,
    finalProteinPercent: finalProteinPercent,
    maxDailyConcentrateG: mix.maxDailyConcentrateG,
    blendAnalysis,
    debug: {
      leafCost,
      legumeCost,
      totalRawMaterialCost,
      netPureProteinOutput: finalPureProteinG,
      formula: `(${quantityGrams}g * ${leafSource.pricePerKg} EGP) + (${sourceWeightG.toFixed(1)}g * ${complement.pricePerKg} EGP) = ${totalRawMaterialCost.toFixed(2)} EGP`
    }
  };
}

export function calculateCostPer100g(
  leaf: ProteinSource,
  complement: ProteinSource,
  leafRatio: number
): number {
  // Yield factors (grams of raw material per gram of pure protein)
  // Based on experimental benchmarks:
  // Sycamore: 1750g leaves -> 55g pure protein (Factor: 31.818181818181817)
  // Lentils: 300g raw -> 45g pure protein (Factor: 6.666666666666667)
  
  const leafYieldFactor = 31.818181818181817; 
  const legumeYieldFactor = 6.666666666666667; 

  const leafProteinG = 100 * leafRatio;
  const legumeProteinG = 100 * (1 - leafRatio);

  const rawLeafKg = (leafProteinG * leafYieldFactor) / 1000;
  const rawLegumeKg = (legumeProteinG * legumeYieldFactor) / 1000;

  const cost = (rawLeafKg * leaf.pricePerKg) + (rawLegumeKg * complement.pricePerKg);
  
  // Fixed processing overhead per 100g protein batch (Filter cloth, water, lemon, vinegar, electricity, gas)
  const processingOverhead = 5.85; 
  
  return cost + processingOverhead;
}

export function formatNumber(num: number, lang: string, precision: number = 1): string {
  return new Intl.NumberFormat(lang, { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: precision 
  }).format(num);
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.36 / 19.35 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: (0.36 / 19.35) * 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: (0.36 / 19.35) * 0.79 },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 1.0 },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', rate: (0.36 / 19.35) * 3.75 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: (0.36 / 19.35) * 3.67 },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', rate: (0.36 / 19.35) * 0.307 },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', rate: (0.36 / 19.35) * 3.64 },
  { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar', rate: (0.36 / 19.35) * 0.376 },
  { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', rate: (0.36 / 19.35) * 0.385 },
  { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', rate: (0.36 / 19.35) * 0.709 },
  { code: 'IQD', symbol: 'د.ع', name: 'Iraqi Dinar', rate: (0.36 / 19.35) * 1310.0 },
  { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar', rate: (0.36 / 19.35) * 134.5 },
  { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham', rate: (0.36 / 19.35) * 10.05 },
  { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', rate: (0.36 / 19.35) * 3.12 },
  { code: 'LYD', symbol: 'ل.د', name: 'Libyan Dinar', rate: (0.36 / 19.35) * 4.83 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: (0.36 / 19.35) * 7.25 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: (0.36 / 19.35) * 83.33 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', rate: (0.36 / 19.35) * 90.0 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: (0.36 / 19.35) * 5.25 }
];

export function getDefaultCurrencyForLang(lang: string): string {
  switch (lang) {
    case 'en':
      return 'USD';
    case 'fr':
    case 'de':
    case 'it':
    case 'es':
      return 'EUR';
    case 'pt':
      return 'BRL';
    case 'ru':
      return 'RUB';
    case 'zh':
      return 'CNY';
    case 'hi':
      return 'INR';
    case 'ar':
    default:
      return 'EGP';
  }
}

export function getCurrencyInfoByCode(code: string): CurrencyInfo {
  const found = CURRENCIES.find(c => c.code === code);
  return found || { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 1.0 };
}

export function getCurrencyInfo(lang: string): { code: string; symbol: string; rate: number } {
  const code = getDefaultCurrencyForLang(lang);
  return getCurrencyInfoByCode(code);
}

export function formatCurrency(num: number, lang: string, fromBaseEgp: boolean = true, customCurrencyCode?: string): string {
  const code = customCurrencyCode || getDefaultCurrencyForLang(lang);
  const currencyInfo = getCurrencyInfoByCode(code);
  const converted = fromBaseEgp ? num * currencyInfo.rate : num;
  return new Intl.NumberFormat(lang, { 
    style: 'currency', 
    currency: currencyInfo.code,
    currencyDisplay: 'narrowSymbol'
  }).format(converted);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateBlendAnalysis(
  leaf: ProteinSource, 
  complement: ProteinSource,
  leafRatio: number = 0.5, // Default 50/50 blend
  lang: Language = 'en'
): BlendAnalysis {
  const complementRatio = 1 - leafRatio;
  const t = translations[lang];
  
  const aaKeys: (keyof AminoAcids)[] = [
    'histidine', 'isoleucine', 'leucine', 'lysine', 
    'saa', 'aaa', 'threonine', 'tryptophan', 'valine'
  ];

  const aaDisplayNames: Record<keyof AminoAcids, string> = {
    histidine: t.aminoAcids.histidine,
    isoleucine: t.aminoAcids.isoleucine,
    leucine: t.aminoAcids.leucine,
    lysine: t.aminoAcids.lysine,
    saa: t.aminoAcids.saa,
    aaa: t.aminoAcids.aaa,
    threonine: t.aminoAcids.threonine,
    tryptophan: t.aminoAcids.tryptophan,
    valine: t.aminoAcids.valine
  };

  const blendAAs = aaKeys.map(key => {
    const leafVal = leaf.aminoAcids[key];
    const compVal = complement.aminoAcids[key];
    const blendVal = (leafVal * leafRatio) + (compVal * complementRatio);
    const faoVal = FAO_2013_ADULT_STANDARD[key];
    const score = (blendVal / faoVal) * 100;
    
    return {
      name: aaDisplayNames[key],
      key,
      fao: faoVal,
      blend: blendVal,
      score: score,
      isLimiting: false
    };
  });

  // Find limiting amino acid (lowest score)
  let limitingIndex = 0;
  let minScore = blendAAs[0].score;
  
  blendAAs.forEach((aa, index) => {
    if (aa.score < minScore) {
      minScore = aa.score;
      limitingIndex = index;
    }
  });

  // Mark limiting AA if score < 100
  if (minScore < 100) {
    blendAAs[limitingIndex].isLimiting = true;
  }

  const chemicalScore = minScore;
  
  // Refined Digestibility Estimation (WHO/FAO standard ranges)
  // Leaf Protein Concentrate (LPC): ~0.88
  // Legumes (processed): ~0.86
  const weightedDigestibility = (0.88 * leafRatio) + (0.86 * complementRatio);
  
  // PDCAAS = AAS (chemicalScore/100) * Digestibility
  // AAS is capped at 1.0 for PDCAAS if it exceeds 100%
  const aas = Math.min(1.0, chemicalScore / 100);
  const pdcaas = (aas * weightedDigestibility) * 100;

  let completenessKey: "low" | "moderate" | "high" = "low";
  if (chemicalScore >= 90) completenessKey = "high";
  else if (chemicalScore >= 70) completenessKey = "moderate";

  const interpretation = minScore >= 100 
    ? t.lab.completeProfile
    : t.lab.limitedBy.replace('{aa}', blendAAs[limitingIndex].name);

  return {
    leaf,
    complement,
    aminoAcids: blendAAs,
    limitingAA: minScore < 100 ? blendAAs[limitingIndex].name : (t.common.none || "None"),
    chemicalScore: minScore,
    pdcaas,
    completeness: t.common[completenessKey] || completenessKey.charAt(0).toUpperCase() + completenessKey.slice(1),
    interpretation,
    interpretationKey: minScore >= 100 ? 'completeProfile' : 'limitedBy'
  };
}

export function generateMixesForLeaf(
  leafId: string,
  leafPureProteinG: number,
  leafProteinConcentrateG: number
): ProteinMix[] {
  const leguminousOptions = [
    { id: 'lentil', ratioLeaf: 55, ratioSource: 45, weight: 300, proteinPercent: 60, concentrateG: 75, pureProteinG: 45, cost: 19.35 },
    { id: 'fava', ratioLeaf: 50, ratioSource: 50, weight: 300, proteinPercent: 55, concentrateG: 70, pureProteinG: 35, cost: 21.50 },
    { id: 'chickpea', ratioLeaf: 50, ratioSource: 50, weight: 300, proteinPercent: 50, concentrateG: 60, pureProteinG: 25, cost: 20.00 },
    { id: 'soy', ratioLeaf: 55, ratioSource: 45, weight: 250, proteinPercent: 70, concentrateG: 75, pureProteinG: 52.5, cost: 22.50 },
    { id: 'lupin', ratioLeaf: 60, ratioSource: 40, weight: 200, proteinPercent: 50, concentrateG: 50, pureProteinG: 25, cost: 21.00 }
  ];

  return leguminousOptions.map(opt => {
    return {
      sourceId: opt.id,
      leafRatioPercent: opt.ratioLeaf,
      sourceRatioPercent: opt.ratioSource,
      sourceWeightG: opt.weight,
      sourceProteinPercent: opt.proteinPercent,
      sourceProteinConcentrateG: opt.concentrateG,
      sourcePureProteinG: opt.pureProteinG,
      finalPureProteinG: Number((leafPureProteinG + opt.pureProteinG).toFixed(2)),
      finalProteinConcentrateG: Number((leafProteinConcentrateG + opt.concentrateG).toFixed(2)),
      finalProteinPercent: Number(((leafPureProteinG + opt.pureProteinG) / (leafProteinConcentrateG + opt.concentrateG) * 100).toFixed(2)),
      estimatedCostEgp: opt.cost,
      maxDailyProteinG: opt.ratioLeaf * 4.5,
      maxDailyConcentrateG: opt.ratioLeaf * 12.5
    };
  });
}
