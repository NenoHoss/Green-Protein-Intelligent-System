export interface AminoAcids {
  histidine: number;
  isoleucine: number;
  leucine: number;
  lysine: number;
  saa: number; // Sulfur Amino Acids (Methionine + Cysteine)
  aaa: number; // Aromatic Amino Acids (Phenylalanine + Tyrosine)
  threonine: number;
  tryptophan: number;
  valine: number;
}

export const FAO_2013_ADULT_STANDARD: AminoAcids = {
  histidine: 15,
  isoleucine: 30,
  leucine: 59,
  lysine: 45,
  saa: 22,
  aaa: 38,
  threonine: 23,
  tryptophan: 6,
  valine: 39
};

export interface ProteinSource {
  id: string;
  nameEn: string;
  nameAr?: string;
  nameFr?: string;
  nameIt?: string;
  nameDe?: string;
  nameZh?: string;
  nameRu?: string;
  namePt?: string;
  nameEs?: string;
  nameHi?: string;
  aminoAcids: AminoAcids;
  costPer100g: number; // Legacy, keep for compatibility if needed
  pricePerKg: number;
}

export const LEAF_SOURCES: ProteinSource[] = [
  {
    id: "sycamore",
    nameEn: "Sycamore Fig",
    nameAr: "جميز",
    nameFr: "Figuier Sycomore",
    nameIt: "Fico Sicomoro",
    nameDe: "Sykomore-Feige",
    nameZh: "埃及糖槭",
    nameRu: "Сикомор",
    namePt: "Figueira-Sicomoro",
    nameEs: "Sicómoro",
    nameHi: "सिक्मोर अंजीर",
    costPer100g: 0,
    pricePerKg: 0,
    aminoAcids: {
      histidine: 18.2, 
      isoleucine: 43.5, 
      leucine: 76.3, 
      lysine: 127.5,
      saa: 20.3, 
      aaa: 107.2, 
      threonine: 38.7, 
      tryptophan: 10.0, 
      valine: 54.0
    }
  },
  {
    id: "fig",
    nameEn: "Fig Leaves",
    nameAr: "تين",
    nameFr: "Feuilles de Figuier",
    nameIt: "Foglie di Fico",
    nameDe: "Feigenblätter",
    nameZh: "五花果叶",
    nameRu: "Листья инжира",
    namePt: "Folhas de Figueira",
    nameEs: "Hojas de Higuera",
    nameHi: "अंजीर के पत्ते",
    costPer100g: 0,
    pricePerKg: 0,
    aminoAcids: {
      histidine: 16.5, isoleucine: 30.2, leucine: 58.4, lysine: 35.2,
      saa: 12.8, aaa: 39.5, threonine: 26.2, tryptophan: 7.5, valine: 38.4
    }
  },
  {
    id: "mulberry",
    nameEn: "Mulberry Leaves",
    nameAr: "توت",
    nameFr: "Feuilles de Mûrier",
    nameIt: "Foglie di Gelso",
    nameDe: "Maulbeerblätter",
    nameZh: "桑叶",
    nameRu: "Листья шелковицы",
    namePt: "Folhas de Amoreira",
    nameEs: "Hojas de Morera",
    nameHi: "शहतूत के पत्ते",
    costPer100g: 0,
    pricePerKg: 0,
    aminoAcids: {
      histidine: 19.4, isoleucine: 34.2, leucine: 65.2, lysine: 42.1,
      saa: 16.2, aaa: 45.4, threonine: 30.1, tryptophan: 9.1, valine: 44.5
    }
  },
  {
    id: "peach",
    nameEn: "Peach Leaves",
    nameAr: "ورق الخوخ",
    nameFr: "Feuilles de Pêcher",
    nameIt: "Foglie di Pesco",
    nameDe: "Pfirsichblätter",
    nameZh: "桃叶",
    nameRu: "Листья персика",
    namePt: "Folhas de Pessegueiro",
    nameEs: "Hojas de Durazno",
    nameHi: "आड़ू के पत्ते",
    costPer100g: 0,
    pricePerKg: 0,
    aminoAcids: {
      histidine: 19.1, isoleucine: 33.8, leucine: 64.5, lysine: 41.5,
      saa: 15.8, aaa: 44.8, threonine: 29.5, tryptophan: 8.8, valine: 43.8
    }
  },
  {
    id: "apricot",
    nameEn: "Apricot Leaves",
    nameAr: "ورق المشمش",
    nameFr: "Feuilles d'Abricotier",
    nameIt: "Foglie di Albicocco",
    nameDe: "Aprikosenblätter",
    nameZh: "杏叶",
    nameRu: "Листья абрикоса",
    namePt: "Folhas de Damasqueiro",
    nameEs: "Hojas de Albaricoque",
    nameHi: "खुबानी के पत्ते",
    costPer100g: 0,
    pricePerKg: 0,
    aminoAcids: {
      histidine: 19.5, isoleucine: 34.5, leucine: 65.8, lysine: 42.5,
      saa: 16.4, aaa: 46.0, threonine: 30.5, tryptophan: 9.3, valine: 45.2
    }
  }
];

export const COMPLEMENTARY_SOURCES: ProteinSource[] = [
  {
    id: "chickpea",
    nameEn: "Chickpea",
    nameAr: "حمص",
    nameFr: "Pois chiche",
    nameIt: "Ceci",
    nameDe: "Kichererbse",
    nameZh: "鹰嘴豆",
    nameRu: "Нут",
    namePt: "Grão-de-Bico",
    nameEs: "Garbanzo",
    nameHi: "चना",
    costPer100g: 4.5,
    pricePerKg: 55,
    aminoAcids: {
      histidine: 26.5, isoleucine: 41.2, leucine: 71.4, lysine: 65.2,
      saa: 24.5, aaa: 78.2, threonine: 35.4, tryptophan: 8.5, valine: 42.1
    }
  },
  {
    id: "lentil",
    nameEn: "Lentil",
    nameAr: "عدس",
    nameFr: "Lentille",
    nameIt: "Lenticchia",
    nameDe: "Linse",
    nameZh: "小扁豆",
    nameRu: "Чечевица",
    namePt: "Lentilha",
    nameEs: "Lenteja",
    nameHi: "मसूर",
    costPer100g: 4.5, // 13.5 / 3
    pricePerKg: 45,
    aminoAcids: {
      histidine: 28.4, 
      isoleucine: 54.0, 
      leucine: 86.2, 
      lysine: 96.0,
      saa: 31.5, 
      aaa: 115.3, 
      threonine: 46.0, 
      tryptophan: 10.0, 
      valine: 59.0
    }
  },
  {
    id: "soy",
    nameEn: "Soy",
    nameAr: "صويا",
    nameFr: "Soja",
    nameIt: "Soia",
    nameDe: "Soja",
    nameZh: "大豆",
    nameRu: "Соя",
    namePt: "Soja",
    nameEs: "Soja",
    nameHi: "सोया",
    costPer100g: 5.5,
    pricePerKg: 70,
    aminoAcids: {
      histidine: 25.8, isoleucine: 48.2, leucine: 82.1, lysine: 63.4,
      saa: 26.2, aaa: 80.4, threonine: 38.5, tryptophan: 12.4, valine: 48.2
    }
  },
  {
    id: "fava",
    nameEn: "Fava Bean",
    nameAr: "فول",
    nameFr: "Fève",
    nameIt: "Fava",
    nameDe: "Ackerbohne",
    nameZh: "蚕豆",
    nameRu: "Бобы",
    namePt: "Fava",
    nameEs: "Haba",
    nameHi: "बड़ा सेम",
    costPer100g: 4.0,
    pricePerKg: 60,
    aminoAcids: {
      histidine: 24.2, isoleucine: 38.5, leucine: 70.2, lysine: 62.1,
      saa: 15.4, aaa: 75.2, threonine: 32.1, tryptophan: 7.8, valine: 40.2
    }
  },
  {
    id: "lupin",
    nameEn: "Lupin",
    nameAr: "ترمس",
    nameFr: "Lupin",
    nameIt: "Lupino",
    nameDe: "Lupine",
    nameZh: "羽扇豆",
    nameRu: "Люпин",
    namePt: "Tremoço",
    nameEs: "Altramuz",
    nameHi: "लुपिन",
    costPer100g: 4.2,
    pricePerKg: 55,
    aminoAcids: {
      histidine: 26.1, isoleucine: 40.2, leucine: 72.5, lysine: 58.4,
      saa: 28.4, aaa: 79.1, threonine: 34.2, tryptophan: 10.2, valine: 41.5
    }
  }
];

export interface ProteinMix {
  sourceId: string;
  leafRatioPercent: number;
  sourceRatioPercent: number;
  sourceWeightG: number;
  sourceProteinPercent: number;
  sourceProteinConcentrateG: number;
  sourcePureProteinG: number;
  finalPureProteinG: number;
  finalProteinConcentrateG: number;
  finalProteinPercent: number;
  estimatedCostEgp: number;
  maxDailyProteinG: number;
  maxDailyConcentrateG: number;
}

export interface LeafType {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  nameIt: string;
  nameDe: string;
  nameZh: string;
  nameRu: string;
  namePt: string;
  nameEs: string;
  nameHi: string;
  edible: boolean;
  leafSeason: string;
  leafSeasonDe?: string;
  leafWeightG: number;
  leafProteinPercent: number;
  leafProteinConcentrateG: number;
  leafPureProteinG: number;
  prepNotes: string;
  prepNotesDe?: string;
  wasteG: number;
  soilEnhancerMethod: string;
  soilEnhancerMethodDe?: string;
  soilEnhancerSteps: string[];
  soilEnhancerStepsDe?: string[];
  soilBenefits: string[];
  soilBenefitsDe?: string[];
  mixes: ProteinMix[];
  aminoAcids: AminoAcids;
}

export interface CalculationResult {
  leafName: string;
  sourceId: string;
  leafProteinGrams: number;
  extractedProteinGrams: number;
  leafPureProteinG: number;
  sourcePureProteinG: number;
  supplementProteinGrams: number;
  totalProteinGrams: number;
  netYield: number;
  originalAminoAcids: AminoAcids;
  optimizedAminoAcids: AminoAcids;
  totalCost: number;
  costPer100gNetProtein: number;
  wasteReductionKg: number;
  soilEnhancerKg: number;
  sustainabilityImpact: number;
  dailyIntakeGrams: number;
  prepNotes: string;
  soilBenefits: string[];
  soilMethod: string;
  soilSteps: string[];
  finalConcentrateG: number;
  leafConcentrateG: number;
  sourceConcentrateG: number;
  finalProteinPercent: number;
  maxDailyConcentrateG: number;
  blendAnalysis: BlendAnalysis;
  debug?: {
    leafCost: number;
    legumeCost: number;
    totalRawMaterialCost: number;
    netPureProteinOutput: number;
    formula: string;
  };
}

export const LEAF_TYPES: LeafType[] = [
  {
    id: "sycamore",
    nameAr: "ورق الجميز",
    nameEn: "Sycamore fig",
    nameFr: "Figuier sycomore",
    nameIt: "Fico sicomoro",
    nameDe: "Sykomore-Feige",
    nameZh: "埃及糖槭",
    nameRu: "Сикомор",
    namePt: "Figueira-Sicomoro",
    nameEs: "Sicómoro",
    nameHi: "सिक्मोर अंजीर",
    edible: true,
    leafSeason: "Autumn",
    leafSeasonDe: "Herbst",
    leafWeightG: 1750,
    leafProteinPercent: 25,
    leafProteinConcentrateG: 220,
    leafPureProteinG: 55,
    prepNotes: "Wash leaves, grind, extract with water, filter, heat coagulation at 70°C, wash and dry protein concentrate",
    prepNotesDe: "Blätter waschen, mahlen, mit Wasser extrahieren, filtern, Hitzekoagulation bei 70°C, Proteinkonzentrat waschen und trocknen",
    wasteG: 305,
    soilEnhancerMethod: "Anaerobic Decomposition",
    soilEnhancerMethodDe: "Anaerobe Zersetzung",
    soilEnhancerSteps: ["Dry residual leaves", "Grind lightly", "Anaerobic decomposition 30-45 days"],
    soilEnhancerStepsDe: ["Rückstandsblätter trocknen", "Leicht mahlen", "Anaerobe Zersetzung 30-45 Tage"],
    soilBenefits: ["Improves water retention", "Enhances microbial activity", "Adds organic matter", "Reduces chemical fertilizer dependency"],
    soilBenefitsDe: ["Verbessert die Wasserretention", "Fördert die mikrobielle Aktivität", "Fügt organische Substanz hinzu", "Reduziert die Abhängigkeit von chemischen Düngemitteln"],
    aminoAcids: LEAF_SOURCES[0].aminoAcids,
    mixes: [
      {
        sourceId: "lentil",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 300,
        sourceProteinPercent: 60,
        sourceProteinConcentrateG: 75,
        sourcePureProteinG: 45,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 295,
        finalProteinPercent: 33.9,
        estimatedCostEgp: 19.35,
        maxDailyProteinG: 225,
        maxDailyConcentrateG: 618.75
      },
      {
        sourceId: "fava",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 300,
        sourceProteinPercent: 55,
        sourceProteinConcentrateG: 70,
        sourcePureProteinG: 35,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 300,
        finalProteinPercent: 33.33,
        estimatedCostEgp: 21.50,
        maxDailyProteinG: 247.5,
        maxDailyConcentrateG: 742.5
      },
      {
        sourceId: "chickpea",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 300,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 60,
        sourcePureProteinG: 25,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 244.38,
        finalProteinPercent: 33.33,
        estimatedCostEgp: 20.00,
        maxDailyProteinG: 247.5,
        maxDailyConcentrateG: 742.5
      },
      {
        sourceId: "soy",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 250,
        sourceProteinPercent: 70,
        sourceProteinConcentrateG: 75,
        sourcePureProteinG: 52.5,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 295,
        finalProteinPercent: 34,
        estimatedCostEgp: 22.50,
        maxDailyProteinG: 225,
        maxDailyConcentrateG: 610
      },
      {
        sourceId: "lupin",
        leafRatioPercent: 60,
        sourceRatioPercent: 40,
        sourceWeightG: 200,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 50,
        sourcePureProteinG: 25,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 297.25,
        finalProteinPercent: 33.56,
        estimatedCostEgp: 21.00,
        maxDailyProteinG: 206.25,
        maxDailyConcentrateG: 614.25
      }
    ]
  },
  {
    id: "fig",
    nameAr: "ورق التين",
    nameEn: "Fig leaves",
    nameFr: "Feuilles de figuier",
    nameIt: "Foglie di fico",
    nameDe: "Feigenblätter",
    nameZh: "五花果叶",
    nameRu: "Листья инжира",
    namePt: "Folhas de Figueira",
    nameEs: "Hojas de Higuera",
    nameHi: "अंजीर के पत्ते",
    edible: true,
    leafSeason: "Autumn",
    leafSeasonDe: "Herbst",
    leafWeightG: 1500,
    leafProteinPercent: 22,
    leafProteinConcentrateG: 200,
    leafPureProteinG: 50,
    prepNotes: "Wash leaves, grind, extract with water, filter, heat coagulation at 70°C, wash and dry protein concentrate",
    prepNotesDe: "Blätter waschen, mahlen, mit Wasser extrahieren, filtern, Hitzekoagulation bei 70°C, Proteinkonzentrat waschen und trocknen",
    wasteG: 280,
    soilEnhancerMethod: "Anaerobic Decomposition",
    soilEnhancerMethodDe: "Anaerobe Zersetzung",
    soilEnhancerSteps: ["Dry residual leaves", "Grind lightly", "Anaerobic decomposition 30-45 days"],
    soilEnhancerStepsDe: ["Rückstandsblätter trocknen", "Leicht mahlen", "Anaerobe Zersetzung 30-45 Tage"],
    soilBenefits: ["Improves water retention", "Enhances microbial activity", "Adds organic matter", "Reduces chemical fertilizer dependency"],
    soilBenefitsDe: ["Verbessert die Wasserretention", "Fördert die mikrobielle Aktivität", "Fügt organische Substanz hinzu", "Reduziert die Abhängigkeit von chemischen Düngemitteln"],
    aminoAcids: LEAF_SOURCES[1].aminoAcids,
    mixes: [
      {
        sourceId: "lentil",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 300,
        sourceProteinPercent: 60,
        sourceProteinConcentrateG: 75,
        sourcePureProteinG: 45,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 295,
        finalProteinPercent: 34,
        estimatedCostEgp: 18.50,
        maxDailyProteinG: 225,
        maxDailyConcentrateG: 618.75
      },
      {
        sourceId: "fava",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 300,
        sourceProteinPercent: 55,
        sourceProteinConcentrateG: 70,
        sourcePureProteinG: 35,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 300,
        finalProteinPercent: 33.33,
        estimatedCostEgp: 21.00,
        maxDailyProteinG: 247.5,
        maxDailyConcentrateG: 742.5
      },
      {
        sourceId: "chickpea",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 300,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 60,
        sourcePureProteinG: 25,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 244.38,
        finalProteinPercent: 33.33,
        estimatedCostEgp: 20.00,
        maxDailyProteinG: 247.5,
        maxDailyConcentrateG: 742.5
      },
      {
        sourceId: "soy",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 250,
        sourceProteinPercent: 70,
        sourceProteinConcentrateG: 75,
        sourcePureProteinG: 52.5,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 295,
        finalProteinPercent: 34,
        estimatedCostEgp: 22.50,
        maxDailyProteinG: 225,
        maxDailyConcentrateG: 610
      },
      {
        sourceId: "lupin",
        leafRatioPercent: 60,
        sourceRatioPercent: 40,
        sourceWeightG: 200,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 50,
        sourcePureProteinG: 25,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 297.25,
        finalProteinPercent: 33.56,
        estimatedCostEgp: 21.00,
        maxDailyProteinG: 206.25,
        maxDailyConcentrateG: 614.25
      }
    ]
  },
  {
    id: "mulberry",
    nameAr: "ورق التوت",
    nameEn: "Mulberry leaves",
    nameFr: "Feuilles de mûrier",
    nameIt: "Foglie di gelso",
    nameDe: "Maulbeerblätter",
    nameZh: "桑叶",
    nameRu: "Листья шелковицы",
    namePt: "Folhas de Amoreira",
    nameEs: "Hojas de Morera",
    nameHi: "शहतूत के पत्ते",
    edible: true,
    leafSeason: "Autumn",
    leafSeasonDe: "Herbst",
    leafWeightG: 1600,
    leafProteinPercent: 23,
    leafProteinConcentrateG: 210,
    leafPureProteinG: 52,
    prepNotes: "Wash leaves, grind, extract with water, filter, heat coagulation at 70°C, wash and dry protein concentrate",
    prepNotesDe: "Blätter waschen, mahlen, mit Wasser extrahieren, filtern, Hitzekoagulation bei 70°C, Proteinkonzentrat waschen und trocknen",
    wasteG: 290,
    soilEnhancerMethod: "Anaerobic Decomposition",
    soilEnhancerMethodDe: "Anaerobe Zersetzung",
    soilEnhancerSteps: ["Dry residual leaves", "Grind lightly", "Anaerobic decomposition 30-45 days"],
    soilEnhancerStepsDe: ["Rückstandsblätter trocknen", "Leicht mahlen", "Anaerobe Zersetzung 30-45 Tage"],
    soilBenefits: ["Improves water retention", "Enhances microbial activity", "Adds organic matter", "Reduces chemical fertilizer dependency"],
    soilBenefitsDe: ["Verbessert die Wasserretention", "Fördert die mikrobielle Aktivität", "Fügt organische Substanz hinzu", "Reduziert die Abhängigkeit von chemischen Düngemitteln"],
    aminoAcids: LEAF_SOURCES[2].aminoAcids,
    mixes: [
      {
        sourceId: "lentil",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 300,
        sourceProteinPercent: 60,
        sourceProteinConcentrateG: 75,
        sourcePureProteinG: 45,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 295,
        finalProteinPercent: 34,
        estimatedCostEgp: 18.75,
        maxDailyProteinG: 225,
        maxDailyConcentrateG: 618.75
      },
      {
        sourceId: "fava",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 300,
        sourceProteinPercent: 55,
        sourceProteinConcentrateG: 70,
        sourcePureProteinG: 35,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 300,
        finalProteinPercent: 33.33,
        estimatedCostEgp: 21.50,
        maxDailyProteinG: 247.5,
        maxDailyConcentrateG: 742.5
      },
      {
        sourceId: "chickpea",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 300,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 60,
        sourcePureProteinG: 25,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 244.38,
        finalProteinPercent: 33.33,
        estimatedCostEgp: 20.00,
        maxDailyProteinG: 247.5,
        maxDailyConcentrateG: 742.5
      },
      {
        sourceId: "soy",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 250,
        sourceProteinPercent: 70,
        sourceProteinConcentrateG: 75,
        sourcePureProteinG: 52.5,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 295,
        finalProteinPercent: 34,
        estimatedCostEgp: 22.50,
        maxDailyProteinG: 225,
        maxDailyConcentrateG: 610
      },
      {
        sourceId: "lupin",
        leafRatioPercent: 60,
        sourceRatioPercent: 40,
        sourceWeightG: 200,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 50,
        sourcePureProteinG: 25,
        finalPureProteinG: 100,
        finalProteinConcentrateG: 297.25,
        finalProteinPercent: 33.56,
        estimatedCostEgp: 21.00,
        maxDailyProteinG: 206.25,
        maxDailyConcentrateG: 614.25
      }
    ]
  },
  {
    id: "peach",
    nameAr: "ورق الخوخ",
    nameEn: "Peach Leaves",
    nameFr: "Feuilles de pêcher",
    nameIt: "Foglie di pesco",
    nameDe: "Pfirsichblätter",
    nameZh: "桃叶",
    nameRu: "Листья персика",
    namePt: "Folhas de Pessegueiro",
    nameEs: "Hojas de Durazno",
    nameHi: "आड़ू के पत्ते",
    edible: true,
    leafSeason: "Summer",
    leafSeasonDe: "Sommer",
    leafWeightG: 1000,
    leafProteinPercent: 17.0,
    leafProteinConcentrateG: 135,
    leafPureProteinG: 28,
    prepNotes: "Wash leaves, Grinding, Water extraction, Filtration, Heat coagulation at 70°C, Triple washing to reduce bitterness, Drying protein concentrate",
    prepNotesDe: "Blätter waschen, Mahlen, Wasserextraktion, Filtration, Hitzekoagulation bei 70°C, Dreifaches Waschen zur Reduzierung der Bitterkeit, Trocknen des Proteinkonzentrats",
    wasteG: 298,
    soilEnhancerMethod: "Anaerobic Decomposition",
    soilEnhancerMethodDe: "Anaerobe Zersetzung",
    soilEnhancerSteps: ["Dry residual leaves", "Grind lightly", "Anaerobic decomposition 30-45 days"],
    soilEnhancerStepsDe: ["Rückstandsblätter trocknen", "Leicht mahlen", "Anaerobe Zersetzung 30-45 Tage"],
    soilBenefits: ["Produces organic soil enhancer", "Improves soil fertility", "Supports sustainable agriculture"],
    soilBenefitsDe: ["Erzeugt organischen Bodenverbesserer", "Verbessert die Bodenfruchtbarkeit", "Unterstützt nachhaltige Landwirtschaft"],
    aminoAcids: LEAF_SOURCES.find(l => l.id === "peach")!.aminoAcids,
    mixes: [
      {
        sourceId: "lentil",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 136.4,
        sourceProteinPercent: 60,
        sourceProteinConcentrateG: 38.2,
        sourcePureProteinG: 22.9,
        finalPureProteinG: 50.9,
        finalProteinConcentrateG: 173.2,
        finalProteinPercent: 29.4,
        estimatedCostEgp: 17.50,
        maxDailyProteinG: 210,
        maxDailyConcentrateG: 602
      },
      {
        sourceId: "fava",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 202.8,
        sourceProteinPercent: 55,
        sourceProteinConcentrateG: 52.9,
        sourcePureProteinG: 28.0,
        finalPureProteinG: 56.0,
        finalProteinConcentrateG: 187.9,
        finalProteinPercent: 29.8,
        estimatedCostEgp: 18.25,
        maxDailyProteinG: 220,
        maxDailyConcentrateG: 640
      },
      {
        sourceId: "chickpea",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 279.8,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 67.2,
        sourcePureProteinG: 28.0,
        finalPureProteinG: 56.0,
        finalProteinConcentrateG: 202.2,
        finalProteinPercent: 27.7,
        estimatedCostEgp: 17.00,
        maxDailyProteinG: 215,
        maxDailyConcentrateG: 620
      },
      {
        sourceId: "soy",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 93.3,
        sourceProteinPercent: 70,
        sourceProteinConcentrateG: 33.1,
        sourcePureProteinG: 22.9,
        finalPureProteinG: 50.9,
        finalProteinConcentrateG: 168.1,
        finalProteinPercent: 30.3,
        estimatedCostEgp: 20.50,
        maxDailyProteinG: 205,
        maxDailyConcentrateG: 590
      },
      {
        sourceId: "lupin",
        leafRatioPercent: 60,
        sourceRatioPercent: 40,
        sourceWeightG: 124.5,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 36.0,
        sourcePureProteinG: 18.7,
        finalPureProteinG: 46.7,
        finalProteinConcentrateG: 171.0,
        finalProteinPercent: 27.3,
        estimatedCostEgp: 18.00,
        maxDailyProteinG: 200,
        maxDailyConcentrateG: 580
      }
    ]
  },
  {
    id: "apricot",
    nameAr: "ورق المشمش",
    nameEn: "Apricot Leaves",
    nameFr: "Feuilles d'abricotier",
    nameIt: "Foglie di albicocco",
    nameDe: "Aprikosenblätter",
    nameZh: "杏叶",
    nameRu: "Листья杏子",
    namePt: "Folhas de Damasqueiro",
    nameEs: "Hojas de Albaricoque",
    nameHi: "खुबानी के पत्ते",
    edible: true,
    leafSeason: "Summer",
    leafSeasonDe: "Sommer",
    leafWeightG: 1000,
    leafProteinPercent: 18.0,
    leafProteinConcentrateG: 150,
    leafPureProteinG: 32,
    prepNotes: "Wash leaves, Grinding, Water extraction, Blanching treatment, Filtration, Heat coagulation at 72°C, Drying protein concentrate",
    prepNotesDe: "Blätter waschen, Mahlen, Wasserextraktion, Blanchieren, Filtration, Hitzekoagulation bei 72°C, Trocknen des Proteinkonzentrats",
    wasteG: 305,
    soilEnhancerMethod: "Anaerobic Decomposition",
    soilEnhancerMethodDe: "Anaerobe Zersetzung",
    soilEnhancerSteps: ["Dry residual leaves", "Grind lightly", "Anaerobic decomposition 30-45 days"],
    soilEnhancerStepsDe: ["Rückstandsblätter trocknen", "Leicht mahlen", "Anaerobe Zersetzung 30-45 Tage"],
    soilBenefits: ["Produces nutrient-rich soil enhancer", "Improves soil structure", "Supports sustainable farming"],
    soilBenefitsDe: ["Erzeugt nährstoffreichen Bodenverbesserer", "Verbessert die Bodenstruktur", "Unterstützt nachhaltige Landwirtschaft"],
    aminoAcids: LEAF_SOURCES.find(l => l.id === "apricot")!.aminoAcids,
    mixes: [
      {
        sourceId: "lentil",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 148.8,
        sourceProteinPercent: 60,
        sourceProteinConcentrateG: 42.9,
        sourcePureProteinG: 26.2,
        finalPureProteinG: 58.2,
        finalProteinConcentrateG: 192.9,
        finalProteinPercent: 30.2,
        estimatedCostEgp: 18.00,
        maxDailyProteinG: 220,
        maxDailyConcentrateG: 625
      },
      {
        sourceId: "fava",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 231.4,
        sourceProteinPercent: 55,
        sourceProteinConcentrateG: 62.3,
        sourcePureProteinG: 32.0,
        finalPureProteinG: 64.0,
        finalProteinConcentrateG: 212.3,
        finalProteinPercent: 30.2,
        estimatedCostEgp: 18.75,
        maxDailyProteinG: 225,
        maxDailyConcentrateG: 650
      },
      {
        sourceId: "chickpea",
        leafRatioPercent: 50,
        sourceRatioPercent: 50,
        sourceWeightG: 319.8,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 76.7,
        sourcePureProteinG: 32.0,
        finalPureProteinG: 64.0,
        finalProteinConcentrateG: 226.7,
        finalProteinPercent: 28.2,
        estimatedCostEgp: 17.50,
        maxDailyProteinG: 220,
        maxDailyConcentrateG: 635
      },
      {
        sourceId: "soy",
        leafRatioPercent: 55,
        sourceRatioPercent: 45,
        sourceWeightG: 102.7,
        sourceProteinPercent: 70,
        sourceProteinConcentrateG: 37.4,
        sourcePureProteinG: 26.2,
        finalPureProteinG: 58.2,
        finalProteinConcentrateG: 187.4,
        finalProteinPercent: 31.0,
        estimatedCostEgp: 21.00,
        maxDailyProteinG: 210,
        maxDailyConcentrateG: 600
      },
      {
        sourceId: "lupin",
        leafRatioPercent: 60,
        sourceRatioPercent: 40,
        sourceWeightG: 137.3,
        sourceProteinPercent: 50,
        sourceProteinConcentrateG: 41.2,
        sourcePureProteinG: 21.3,
        finalPureProteinG: 53.3,
        finalProteinConcentrateG: 191.2,
        finalProteinPercent: 27.9,
        estimatedCostEgp: 18.25,
        maxDailyProteinG: 205,
        maxDailyConcentrateG: 590
      }
    ]
  }
];

export interface BlendAnalysis {
  leaf: ProteinSource;
  complement: ProteinSource;
  aminoAcids: {
    name: string;
    key: keyof AminoAcids;
    fao: number;
    blend: number;
    score: number;
    isLimiting: boolean;
  }[];
  limitingAA: string;
  chemicalScore: number;
  pdcaas: number;
  completeness: string;
  interpretation: string;
  interpretationKey: 'completeProfile' | 'limitedBy';
}

export type ActivityLevel = 'sedentary' | 'lightly' | 'moderate' | 'very' | 'athlete';
export type NutritionGoal = 'general' | 'muscle' | 'weight' | 'economic' | 'digestibility';
export type HealthStatus = 'none' | 'pregnant_t1' | 'pregnant_t2' | 'pregnant_t3' | 'lactating' | 'recovery' | 'elderly';

export interface UserPersonalData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  healthStatus: HealthStatus;
}

export interface PersonalizedRecommendation {
  dailyProteinNeedMin: number;
  dailyProteinNeedMax: number;
  recommendedLeaf: ProteinSource;
  recommendedComplement: ProteinSource;
  recommendedRatio: number; // leaf ratio [0-1]
  dailyConcentrateAmount: number;
  leafWeightNeeded: number;
  compWeightNeeded: number;
  safeDailyIntake: number;
  isSafe: boolean;
  chemicalScore: number;
  pdcaas: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  sustainabilityImpact: number; // kg CO2 saved
  analysis?: BlendAnalysis;
}
