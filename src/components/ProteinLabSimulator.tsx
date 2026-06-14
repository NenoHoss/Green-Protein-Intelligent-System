import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  FlaskConical, 
  Sparkles, 
  Flame,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
  RotateCw,
  ArrowRight,
  Droplets,
  Scale,
  Database,
  Download,
  ArrowDownToLine,
  ChevronRight,
  Sprout,
  Leaf,
  Thermometer
} from 'lucide-react';
import { LeafType } from '../types';
import { generateMixesForLeaf } from '../utils';
import { labTranslations } from './LabTranslations';
import { generatePDFReport } from '../utils/pdfGenerator';

const selectorTranslations: Record<string, Record<string, string>> = {
  en: {
    automated_molecular_workspace: "AUTOMATED MOLECULAR WORKSPACE",
    simulation_selector_title: "BIOTECHNOLOGY SECTOR SELECT",
    simulation_selector_subtitle: "Choose target molecular stream to configure laboratory automation channels.",
    botanical_badge: "Botanical",
    seed_grain_badge: "Seed / Grain",
    leaf_protein_extraction_title: "🌿 Leaf Protein Extraction",
    leaf_protein_extraction_desc: "Isolate highly digestible Rubisco protein complexes and lipid-rich leaf concentrates (LPC) from raw foliage samples.",
    legume_protein_extraction_title: "🌱 Legume Protein Extraction",
    legume_protein_extraction_desc: "Extract high-density globulins (vicilin, legumin) from protein-rich seeds using controlled pH starch isolation.",
    typical_yield_label: "TYPICAL YIELD",
    thermal_coag_label: "THERMAL COAG",
    iso_ph_value_label: "ISO PH VALUE",
    initialize_simulation_matrix_btn: "INITIALIZE SIMULATION MATRIX ↩"
  },
  ar: {
    automated_molecular_workspace: "مكان العمل الآلي للجزيئات",
    simulation_selector_title: "تحديد قطاع التكنولوجيا الحيوية",
    simulation_selector_subtitle: "اختر خط التدفق الجزيئي المستهدف لتهيئة قنوات المحاكاة المختبرية الآلية.",
    botanical_badge: "أخضر ورقي",
    seed_grain_badge: "حبوب جافة",
    leaf_protein_extraction_title: "🌿 استخلاص بروتين الأوراق",
    leaf_protein_extraction_desc: "استخلاص عزلات بروتين (الروبيسكو) الغني بالأحماض الأمينية الأساسية والمركبات النشطة من النسيج الورقي الأخضر.",
    legume_protein_extraction_title: "🌱 استخلاص بروتين البقوليات",
    legume_protein_extraction_desc: "عزل الغلوبيولينات (الفيسيلين، الليغومين) وعزل النشا كمادة ثانوية مجهرياً من البذور البقولية العالية برياستها.",
    typical_yield_label: "الإنتاجية النموذجية",
    thermal_coag_label: "درجة التخثر بالتسخين",
    iso_ph_value_label: "نقطة التعادل الكهربائي",
    initialize_simulation_matrix_btn: "تفعيل المحاكاة الآلية ↩"
  },
  fr: {
    automated_molecular_workspace: "ESPACE MOLÉCULAIRE AUTOMATISÉ",
    simulation_selector_title: "SÉLECTION DU SECTEUR BIOTECHNOLOGIQUE",
    simulation_selector_subtitle: "Choisissez le flux moléculaire cible pour configurer les canaux d'automatisation de laboratoire.",
    botanical_badge: "Botanique",
    seed_grain_badge: "Graine / Grain",
    leaf_protein_extraction_title: "🌿 Extraction de Protéines de Feuilles",
    leaf_protein_extraction_desc: "Isolez les complexes protéiques de Rubisco hautement digestibles et les concentrés de feuilles riches en lipides (LPC) à partir d'échantillons de feuillage brut.",
    legume_protein_extraction_title: "🌱 Extraction de Protéines de Légumineuses",
    legume_protein_extraction_desc: "Extrayez les globulines à haute densité (viciline, légumine) de graines riches en protéines par isolation d'amidon à pH contrôlé.",
    typical_yield_label: "RENDEMENT TYPIQUE",
    thermal_coag_label: "COAGULATION THERMIQUE",
    iso_ph_value_label: "VALEUR DE PH ISO",
    initialize_simulation_matrix_btn: "INITIALISER LA MATRICE DE SIMULATION ↩"
  },
  de: {
    automated_molecular_workspace: "AUTOMATISIERTER MOLEKULARER ARBEITSBEREICH",
    simulation_selector_title: "AUSWAHL DES BIOTECHNOLOGIE-SEKTORS",
    simulation_selector_subtitle: "Wählen Sie den Ziel-Molekularstrom aus, um die Laborautomatisierungskanäle zu konfigurieren.",
    botanical_badge: "Botanisch",
    seed_grain_badge: "Saatgut / Korn",
    leaf_protein_extraction_title: "🌿 Blattprotein-Extraktion",
    leaf_protein_extraction_desc: "Isolieren Sie hochverdauliche Rubisco-Proteinkomplexe und lipidreiche Blattkonzentrate (LPC) aus rohen Laubproben.",
    legume_protein_extraction_title: "🌱 Hülsenfruchtprotein-Extraktion",
    legume_protein_extraction_desc: "Extrahieren Sie hochdichte Globuline (Vicilin, Legumin) aus proteinreichen Samen mithilfe einer pH-kontrollierten Stärkeisolierung.",
    typical_yield_label: "TYPISCHE AUSBEUTE",
    thermal_coag_label: "THERMISCHE KOAGULATION",
    iso_ph_value_label: "ISO-PH-WERT",
    initialize_simulation_matrix_btn: "SIMULATIONSMATRIX INITIALISIEREN ↩"
  },
  it: {
    automated_molecular_workspace: "SPAZIO DI LABORA MOLECOLARE AUTOMATIZZATO",
    simulation_selector_title: "SELEZIONE DEL SETTORE BIOTECNOLOGICO",
    simulation_selector_subtitle: "Scegli il flusso molecolare target per configurare i canali di automazione del laboratorio.",
    botanical_badge: "Botanico",
    seed_grain_badge: "Seme / Grano",
    leaf_protein_extraction_title: "🌿 Estrazione di Proteine Fogliari",
    leaf_protein_extraction_desc: "Isola complessi proteici Rubisco altamente digeribili e concentrati fogliari ricchi di lipidi (LPC) da campioni di fogliame fresco.",
    legume_protein_extraction_title: "🌱 Estrazione di Proteine di Legumi",
    legume_protein_extraction_desc: "Estrai globuline ad alta densità (vicilina, legumina) da semi ricchi di proteine utilizzando l'isolamento dell'amido a pH controllato.",
    typical_yield_label: "RESA TIPICA",
    thermal_coag_label: "COAGULAZIONE TERMICA",
    iso_ph_value_label: "VALORE DI PH ISO",
    initialize_simulation_matrix_btn: "INIZIALIZZA MATRICE DI SIMULATIONE ↩"
  },
  es: {
    automated_molecular_workspace: "ESPACIO DE TRABAJO MOLECULAR AUTOMATIZADO",
    simulation_selector_title: "SELECCIÓN DEL SECTOR BIOTECNOLÓGICO",
    simulation_selector_subtitle: "Elija el flujo molecular objetivo para configurar los canales de automatización del laboratorio.",
    botanical_badge: "Botánico",
    seed_grain_badge: "Semilla / Grano",
    leaf_protein_extraction_title: "🌿 Extracción de Proteínas de Hojas",
    leaf_protein_extraction_desc: "Aísle complejos de proteínas Rubisco altamente digeribles y concentrados de hojas ricos en lípidos (LPC) a partir de muestras de follaje crudo.",
    legume_protein_extraction_title: "🌱 Extracción de Proteínas de Legumbres",
    legume_protein_extraction_desc: "Extraiga globulinas de alta densidad (vicilina, legumina) de semillas ricas en proteínas mediante aislamiento de almidón con pH controlado.",
    typical_yield_label: "RENDIMIENTO TÍPICO",
    thermal_coag_label: "COAGULATION TÉRMICA",
    iso_ph_value_label: "VALOR DE PH ISO",
    initialize_simulation_matrix_btn: "INICIALIZAR MATRIZ DE SIMULACIÓN ↩"
  },
  pt: {
    automated_molecular_workspace: "ESPAÇO DE TRABALHO MOLECULAR AUTOMATIZADO",
    simulation_selector_title: "SELEÇÃO DO SETOR DE BIOTECNOLOGIA",
    simulation_selector_subtitle: "Escolha o fluxo molecular alvo para configurar os canais de automação do laboratório.",
    botanical_badge: "Botânico",
    seed_grain_badge: "Semente / Grão",
    leaf_protein_extraction_title: "🌿 Extração de Proteína Foliar",
    leaf_protein_extraction_desc: "Isole complexos proteicos Rubisco altamente digeríveis e concentrados de folhas ricos em lipídios (LPC) a partir de amostras de folhagem crua.",
    legume_protein_extraction_title: "🌱 Extração de Proteína de Leguminosas",
    legume_protein_extraction_desc: "Extraia globulinas de alta densidade (vicilina, legumina) de sementes ricas em proteínas usando isolamento de amido com pH controlado.",
    typical_yield_label: "RENDIMENTO TÍPICO",
    thermal_coag_label: "COAGULAÇÃO TÉRMICA",
    iso_ph_value_label: "VALOR DE PH ISO",
    initialize_simulation_matrix_btn: "INICIALIZAR MATRIZ DE SIMULAÇÃO ↩"
  },
  zh: {
    automated_molecular_workspace: "自动化分子工作区",
    simulation_selector_title: "生物技术行业选择",
    simulation_selector_subtitle: "选择目标分子流以配置实验室自动化通道。",
    botanical_badge: "植物资源",
    seed_grain_badge: "种子/谷物",
    leaf_protein_extraction_title: "🌿 叶绿体蛋白质提取",
    leaf_protein_extraction_desc: "从原始叶片样品中分离高消化性的鲁比斯科（Rubisco）蛋白质复合物和富含脂质的叶浓缩物（LPC）。",
    legume_protein_extraction_title: "🌱 豆类蛋白质提取",
    legume_protein_extraction_desc: "使用受控 pH 的淀粉分离技术，从富含蛋白质的种子中提取高密度球蛋白（蚕豆球蛋白、豌豆球蛋白）。",
    typical_yield_label: "典型得率",
    thermal_coag_label: "热凝固温度",
    iso_ph_value_label: "等电点 PH 值",
    initialize_simulation_matrix_btn: "初始化模拟矩阵 ↩"
  },
  ru: {
    automated_molecular_workspace: "АВТОМАТИЗИРОВАННОЕ МОЛЕКУЛЯРНОЕ РАБОЧЕЕ ПРОСТРАНСТВО",
    simulation_selector_title: "ВЫБОР КАТЕГОРИИ БИОТЕХНОЛОГИЙ",
    simulation_selector_subtitle: "Выберите целевой молекулярный поток для настройки автоматизированных каналов лаборатории.",
    botanical_badge: "Ботанический",
    seed_grain_badge: "Семена / Зерно",
    leaf_protein_extraction_title: "🌿 Экстракция Листового Белка",
    leaf_protein_extraction_desc: "Выделение легкоусвояемых белковых комплексов Рубиско и богатых липидами концентратов листьев (LPC) из неочищенных образцов листвы.",
    legume_protein_extraction_title: "🌱 Экстракция Белка Бобовых",
    legume_protein_extraction_desc: "Экстракция высокоплотных глобулинов (вицилин, легумин) из богатых белком семян с использованием контролируемого по pH выделения крахмала.",
    typical_yield_label: "ТИПИЧНЫЙ ВЫХОД",
    thermal_coag_label: "ТЕРМИЧЕСКАЯ КОАГУЛЯЦИЯ",
    iso_ph_value_label: "ЗНАЧЕНИЕ ISO PH",
    initialize_simulation_matrix_btn: "ЗАПУСТИТЬ МАТРИЦУ СИМУЛЯЦИИ ↩"
  },
  hi: {
    automated_molecular_workspace: "स्वचालित आणविक कार्यक्षेत्र",
    simulation_selector_title: "जैव प्रौद्योगिकी क्षेत्र चयन",
    simulation_selector_subtitle: "प्रयोगशाला स्वचालन चैनलों को कॉन्फ़िगर करने के लिए लक्ष्य आणविक प्रवाह चुनें।",
    botanical_badge: "वानस्पतिक",
    seed_grain_badge: "बीज / अनाज",
    leaf_protein_extraction_title: "🌿 पत्ती प्रोटीन निष्कर्षण",
    leaf_protein_extraction_desc: "कच्चे पत्ते के नमूनों से अत्यधिक सुपाच्य रुबिस्को प्रोटीन परिसरों और लिपिड-समृद्ध पत्ती सांद्रता को अलग करें।",
    legume_protein_extraction_title: "🌱 फलियों का प्रोटीन निष्कर्षण",
    legume_protein_extraction_desc: "नियंत्रित पीएच स्टार्च अलगाव का उपयोग करके प्रोटीन-समृद्ध बीजों से उच्च घनत्व वाले ग्लोब्युलिन को निकालें।",
    typical_yield_label: "विशिष्ट उपज",
    thermal_coag_label: "थर्मल जमाव",
    iso_ph_value_label: "आईएसओ पीएच मान",
    initialize_simulation_matrix_btn: "सिमुलेशन मैट्रिक्स प्रारंभ करें ↩"
  }
};

type StepType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ProteinLabSimulatorProps {
  allLeafTypes: LeafType[];
  onAddCustomLeaf: (newLeaf: LeafType) => void;
  language: 'ar' | 'en' | string;
}

// Sound synthesizer using Web Audio API for rewarding interaction pops
const playSynthBeep = (freq: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration = 0.15) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // browser audio policies fallback
  }
};

interface LeafGeometry {
  outerPath: string;
  veins: Array<{ d: string; strokeWidth?: number }>;
  defaultFill: string;
}

const getLeafGeometry = (speciesId: string): LeafGeometry => {
  const sId = speciesId.toLowerCase();
  
  if (sId.includes('fig') && !sId.includes('sycamore')) {
    // Fig (Ficus carica) - 5 Deep rounded lobed shape
    return {
      outerPath: "M50 85 C42 81 31 77 26 80 C18 84 14 74 19 64 C23 57 32 54 22 49 C10 44 10 35 20 33 C30 31 33 43 41 35 C44 31 44 18 50 12 C56 18 56 31 59 35 C67 43 70 31 80 33 C90 35 90 44 78 49 C68 54 77 57 81 64 C86 74 82 84 74 80 C69 77 58 81 50 85 Z",
      veins: [
        { d: "M50 85 L50 14" },
        { d: "M50 72 C36 67 28 65 20 64" },
        { d: "M50 72 C64 67 72 65 80 64" },
        { d: "M50 56 C34 49 26 42 19 36" },
        { d: "M50 56 C66 49 74 42 81 36" },
        { d: "M50 38 C38 31 34 24 30 18" },
        { d: "M50 38 C62 31 66 24 70 18" }
      ],
      defaultFill: "#065f46"
    };
  } else if (sId.includes('mulberry')) {
    // Mulberry (Morus) - Fine serrated cordate/heart shaped leaf
    return {
      outerPath: "M50 85 L46 83 L47 79 L41 77 L43 72 L36 69 L38 64 L31 60 L34 54 L28 49 L32 43 L27 37 L32 31 L29 25 L36 21 L35 15 L50 11 L65 15 L64 21 L71 25 L68 31 L73 37 L68 43 L72 49 L66 54 L69 60 L62 64 L64 69 L57 72 L59 77 L53 79 L54 83 Z",
      veins: [
        { d: "M50 85 L50 13" },
        { d: "M50 74 Q34 67 29 57" },
        { d: "M50 74 Q66 67 71 57" },
        { d: "M50 56 Q35 48 29 36" },
        { d: "M50 56 Q65 48 71 36" },
        { d: "M50 38 Q36 29 30 20" },
        { d: "M50 38 Q64 29 70 20" }
      ],
      defaultFill: "#0f766e"
    };
  } else if (sId.includes('sycamore')) {
    // Sycamore fig (Platanus / Ficus sycomorus) - Large palmate maple-like
    return {
      outerPath: "M50 85 C46 80 34 76 28 72 C22 68 15 58 15 48 C15 42 22 40 32 44 C38 46 41 48 43 42 C45 35 46 22 50 10 C54 22 55 35 57 42 C59 48 62 46 68 44 C78 40 85 42 85 48 C85 58 78 68 72 72 C66 76 54 80 50 85 Z",
      veins: [
        { d: "M50 85 L50 12" },
        { d: "M50 64 Q32 54 20 48" },
        { d: "M50 64 Q68 54 80 48" },
        { d: "M50 48 Q35 38 28 32" },
        { d: "M50 48 Q65 38 72 32" },
        { d: "M50 32 Q40 22 36 15" },
        { d: "M50 32 Q60 22 64 15" }
      ],
      defaultFill: "#115e59"
    };
  } else if (sId.includes('apricot')) {
    // Apricot - Heart-shaped/broad ovate
    return {
      outerPath: "M50 88 C20 85 10 50 25 32 C33 22 42 16 50 10 C58 16 67 22 75 32 C90 50 80 85 50 88 Z",
      veins: [
        { d: "M50 88 L50 12" },
        { d: "M50 72 C35 67 28 55 22 45" },
        { d: "M50 72 C65 67 72 55 78 45" },
        { d: "M50 52 Q34 44 26 31" },
        { d: "M50 52 Q66 44 74 31" },
        { d: "M50 32 Q38 24 32 15" },
        { d: "M50 32 Q62 24 68 15" }
      ],
      defaultFill: "#15803d"
    };
  } else if (sId.includes('peach')) {
    // Peach - Slender long lanceolate
    return {
      outerPath: "M50 90 C34 74 34 40 50 8 C66 40 66 74 50 90 Z",
      veins: [
        { d: "M50 90 L50 9" },
        { d: "M50 75 Q42 66 38 56" },
        { d: "M50 75 Q58 66 62 56" },
        { d: "M50 55 Q43 45 40 34" },
        { d: "M50 55 Q57 45 60 34" },
        { d: "M50 35 Q44 26 42 18" },
        { d: "M50 35 Q56 26 58 18" }
      ],
      defaultFill: "#047857"
    };
  } else {
    // Fallback default simple leaf
    return {
      outerPath: "M50 85 C30 55 35 28 50 10 C65 28 70 55 50 85 Z",
      veins: [
        { d: "M50 85 Q50 48 50 10" },
        { d: "M50 68 Q40 60 36 50" },
        { d: "M50 68 Q60 60 64 50" },
        { d: "M50 48 Q38 38 34 28" },
        { d: "M50 48 Q62 38 66 28" }
      ],
      defaultFill: "#0284c7"
    };
  }
};

let globalUniqueIdCounter = 0;
const getUniqueIdNum = (): number => {
  globalUniqueIdCounter += 1;
  return Date.now() + Math.random() + globalUniqueIdCounter;
};

export function ProteinLabSimulator({
  allLeafTypes,
  onAddCustomLeaf,
  language
}: ProteinLabSimulatorProps) {
  const isRtl = language === 'ar';

  // High fidelity localization fetcher with strict console reporting and non-English fallback
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const lang = ['ar', 'en', 'fr', 'it', 'de', 'zh', 'ru', 'pt', 'es', 'hi'].includes(language) ? language : 'en';
    
    // Check if translation is structurally present in current language pack
    let text = selectorTranslations[lang]?.[key] || labTranslations[lang]?.[key];
    
    if (text === undefined || text === null) {
      // Missing translation! Report to the console only.
      console.warn(`[i18n] Missing translation key: "${key}" for language: "${lang}"`);
      
      // Never show translation keys or "Translation Missing" brackets to the user.
      // Fallback to a cleanly formatted human-readable word, or fall back to English if available.
      const englishFallback = selectorTranslations['en']?.[key] || labTranslations['en']?.[key];
      text = englishFallback || key.replace(/_/g, ' ');
    }

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  // Helper for dynamic leaf mapping
  const getLeafName = (leaf: LeafType) => {
    if (!leaf) return '';
    const langKey = 'name' + language.charAt(0).toUpperCase() + language.slice(1);
    const val = (leaf as any)[langKey];
    if (val) return val;
    if (language === 'ar' && leaf.nameAr) return leaf.nameAr;
    return leaf.nameEn || leaf.nameAr || '';
  };

  const getLegumeName = (leg: any) => {
    if (!leg) return '';
    const nameKey = `${leg.id}_name`;
    const val = t(nameKey);
    if (val) return val;
    return isRtl ? leg.nameAr : leg.nameEn;
  };

  const getStepLabel = (stepNum: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (language === 'en') {
      const dict = labTranslations.en;
      return dict[`step${stepNum}_label_en`] || '';
    }
    const lang = ['ar', 'en', 'fr', 'it', 'de', 'zh', 'ru', 'pt', 'es', 'hi'].includes(language) ? language : 'en';
    const dict = labTranslations[lang] || labTranslations.en;
    return dict[`step${stepNum}_label_ar`] || dict[`step${stepNum}_label_en`] || '';
  };

  const getLegumeStepLabel = (stepNum: number) => {
    const dicts = {
      en: [
        'Weigh Prep',
        'US Wash',
        'Vortex Mill',
        'Iso Squeeze',
        'Starch Sift',
        'Thermal Coag',
        'Plunge Press'
      ],
      ar: [
        'تحضير الميزان',
        'الغسيل بالهز',
        'الطاحونة الدوارة',
        'معادلة القلوية',
        'تصفية النشا',
        'التخثير الحراري',
        'كبس العزل'
      ],
      fr: [
        'Pesée Échantillon',
        'Lavage Ultra',
        'Broyeur Vortex',
        'Pressage Iso',
        'Tamis Amidon',
        'Coag Thermique',
        'Presse Égouttage'
      ],
      de: [
        'Einwiegen',
        'US-Waschen',
        'Vortex-Mühle',
        'Iso-Auspressung',
        'Stärke-Sieb',
        'Thermische Koag',
        'Stempelpresse'
      ],
      it: [
        'Pesatura',
        'Lavaggio US',
        'Vortice Mulino',
        'Spolpatura Iso',
        'Tamis Amido',
        'Coag Termica',
        'Idropressa'
      ],
      es: [
        'Pesaje Muestra',
        'Lavado Ultrasonido',
        'Molino Vórtice',
        'Prensado Iso',
        'Tamiz Almidón',
        'Coag Térmica',
        'Prensa Émbolo'
      ],
      pt: [
        'Pesagem',
        'Lavagem Ultrassom',
        'Moinho Vortex',
        'Prensagem Iso',
        'Peneira Amido',
        'Coag Térmica',
        'Prensa Plunger'
      ],
      ru: [
        'Взвешивание',
        'УЗ-Лизинг',
        'Вихревая Мельница',
        'Изо-Сжатие',
        'Просев Крахмала',
        'Термокоагуляция',
        'Плунжерный Пресс'
      ],
      zh: [
        '称量准备',
        '超声波洗涤',
        '涡流研磨',
        '等电点压榨',
        '淀粉筛分',
        '热诱导凝结',
        '柱塞压滤'
      ],
      hi: [
        'वजन तैयारी',
        'अल्ट्रासोनिक वॉश',
        'भंवर मिल',
        'आइसो निचोड़',
        'स्टार्च छलनी',
        'थर्मल स्कंदन',
        'प्लंजर प्रेस'
      ]
    };
    const lang = ['ar', 'en', 'fr', 'it', 'de', 'zh', 'ru', 'pt', 'es', 'hi'].includes(language) ? language : 'en';
    return (dicts as any)[lang]?.[stepNum - 1] || (dicts as any)['en']?.[stepNum - 1] || `Step ${stepNum}`;
  };
  
  // UI States
  const [activeWorkflow, setActiveWorkflow] = useState<'leaf' | 'legume' | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1);
  const [selectedLeafId, setSelectedLeafId] = useState<string>(allLeafTypes[0]?.id || 'sycamore_fig');
  const [leafWeight, setLeafWeight] = useState<number>(1000);
  const [showCustomLeafModal, setShowCustomLeafModal] = useState(false);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  // Legume specimens definition and calculations
  const legumesList = useMemo(() => [
    {
      id: 'lentil',
      nameAr: 'العدس البري المعاير 🫘',
      nameEn: 'Calibrated Wild Lentil 🫘',
      season: isRtl ? 'الربيع' : 'Spring',
      weightG: 300,
      cakeG: 75,
      proteinG: 45,
      starchG: 90,
      isoelectricPh: 4.6,
    },
    {
      id: 'fava',
      nameAr: 'الفول البلدي المعاير 🫘',
      nameEn: 'Calibrated Fava Bean 🫘',
      season: isRtl ? 'الشتاء' : 'Winter',
      weightG: 300,
      cakeG: 70,
      proteinG: 35,
      starchG: 93,
      isoelectricPh: 4.5,
    },
    {
      id: 'chickpea',
      nameAr: 'الحمص الذهبي المعاير 🫘',
      nameEn: 'Golden Chickpea 🫘',
      season: isRtl ? 'الصيف' : 'Summer',
      weightG: 300,
      cakeG: 60,
      proteinG: 25,
      starchG: 93,
      isoelectricPh: 4.4,
    },
    {
      id: 'soy',
      nameAr: 'فول الصويا العضوي 🫘',
      nameEn: 'Organic Soybean 🫘',
      season: isRtl ? 'الخريف' : 'Autumn',
      weightG: 250,
      cakeG: 75,
      proteinG: 52.5,
      starchG: 85,
      isoelectricPh: 4.5,
    },
    {
      id: 'lupin',
      nameAr: 'الترمس المر المعالج 🫘',
      nameEn: 'Processed Bitter Lupin 🫘',
      season: isRtl ? 'الشتاء' : 'Winter',
      weightG: 200,
      cakeG: 50,
      proteinG: 25,
      starchG: 60,
      isoelectricPh: 4.5,
    }
  ], [isRtl]);

  const [selectedLegumeId, setSelectedLegumeId] = useState<string>('lentil');
  const [legumeWeight, setLegumeWeight] = useState<number>(300);

  const activeLegume = useMemo(() => {
    return legumesList.find(l => l.id === selectedLegumeId) || legumesList[0];
  }, [legumesList, selectedLegumeId]);

  const legumeRatio = legumeWeight / activeLegume.weightG;
  const expectedLegumeLpiYieldG = legumeRatio * activeLegume.cakeG;
  const expectedLegumePureProteinG = legumeRatio * activeLegume.proteinG;
  const expectedLegumeStarchG = legumeRatio * activeLegume.starchG;

  // Legume State variables
  const [isLegumeWeighed, setIsLegumeWeighed] = useState(false);
  const [isLegumeWashed, setIsLegumeWashed] = useState(false);
  const [legumeWashWaterLevel, setLegumeWashWaterLevel] = useState(0);
  const [isLegumeWashAgitating, setIsLegumeWashAgitating] = useState(false);
  const [legumeWashProgress, setLegumeWashProgress] = useState(0);
  const [isLegumeWashDone, setIsLegumeWashDone] = useState(false);
  const [legumeFaucetFlow, setLegumeFaucetFlow] = useState(0);
  const [legumeBowlParticles, setLegumeBowlParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    type: 'dirt' | 'bubble' | 'splash';
  }>>([]);
  const [legumeBowlShaking, setLegumeBowlShaking] = useState(false);

  // Legume seeds state in washing bowl
  const [washGrains, setWashGrains] = useState<Array<{
    id: string;
    origX: number;
    origY: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    cleanliness: number;
    isSubmerged: boolean;
    dirtLevel: number;
  }>>([
    { id: 'grain_1', origX: -140, origY: 20, x: -140, y: 20, rotation: 5, scale: 0.95, cleanliness: 10, isSubmerged: false, dirtLevel: 90 },
    { id: 'grain_2', origX: -110, origY: 40, x: -110, y: 40, rotation: 45, scale: 0.85, cleanliness: 15, isSubmerged: false, dirtLevel: 85 },
    { id: 'grain_3', origX: -80, origY: 10, x: -80, y: 10, rotation: -20, scale: 1.05, cleanliness: 25, isSubmerged: false, dirtLevel: 75 },
    { id: 'grain_4', origX: -50, origY: 30, x: -50, y: 30, rotation: 80, scale: 0.9, cleanliness: 20, isSubmerged: false, dirtLevel: 80 },
    { id: 'grain_5', origX: -160, origY: 45, x: -160, y: 45, rotation: -60, scale: 1.0, cleanliness: 5, isSubmerged: false, dirtLevel: 95 },
    { id: 'grain_6', origX: -130, origY: 55, x: -130, y: 55, rotation: 15, scale: 0.8, cleanliness: 30, isSubmerged: false, dirtLevel: 70 },
    { id: 'grain_7', origX: -100, origY: 60, x: -100, y: 60, rotation: -10, scale: 0.9, cleanliness: 40, isSubmerged: false, dirtLevel: 60 },
    { id: 'grain_8', origX: -70, origY: 50, x: -70, y: 50, rotation: 35, scale: 1.1, cleanliness: 12, isSubmerged: false, dirtLevel: 88 },
  ]);

  // Step 3 (Legume Milling)
  const [isBeanInMilling, setIsBeanInMilling] = useState(false);
  const [isWaterInMilling, setIsWaterInMilling] = useState(false);
  const [isMilling, setIsMilling] = useState(false);
  const [millingProgress, setMillingProgress] = useState(0);
  const [isMillingDone, setIsMillingDone] = useState(false);

  // Step 4 (pH Isoelectric point)
  const [isLemonSqueezed, setIsLemonSqueezed] = useState(false);
  const [lemonSqueezeProgress, setLemonSqueezeProgress] = useState(0);
  const [slurryPh, setSlurryPh] = useState(6.8);
  const [isPhSeparated, setIsPhSeparated] = useState(false);
  const [isSqueezing, setIsSqueezing] = useState(false);

  // Step 5 (Sift starch separation)
  const [isDecanted, setIsDecanted] = useState(false);
  const [isDecanting, setIsDecanting] = useState(false);
  const [decantingProgress, setDecantingProgress] = useState(0);
  const [isDecantDone, setIsDecantDone] = useState(false);

  // Step 6 (Thermal Coagulation)
  const [isLegumeJuiceInHeater, setIsLegumeJuiceInHeater] = useState(false);
  const [isLegumePouring, setIsLegumePouring] = useState(false);
  const [legumePourProgress, setLegumePourProgress] = useState(0);
  const [legumeTemp, setLegumeTemp] = useState(24);
  const [isLegumeHeating, setIsLegumeHeating] = useState(false);
  const [isLegumeCoagulated, setIsLegumeCoagulated] = useState(false);

  // Step 7 (Hydraulic Press Isolate)
  const [isLegumeCurdInPress, setIsLegumeCurdInPress] = useState(false);
  const [isLegumePressing, setIsLegumePressing] = useState(false);
  const [legumePressProgress, setLegumePressProgress] = useState(0);
  const [isLegumePressDone, setIsLegumePressDone] = useState(false);

  // Custom leaf inputs
  const [newLeafNameAr, setNewLeafNameAr] = useState('');
  const [newLeafNameEn, setNewLeafNameEn] = useState('');
  const [newLeafWeightG, setNewLeafWeightG] = useState(1000);
  const [newLeafProteinG, setNewLeafProteinG] = useState(25);
  const [newLeafConcentrateG, setNewLeafConcentrateG] = useState(115);
  const [newLeafWasteG, setNewLeafWasteG] = useState(190);

  // INTERACTIVE WORKSPACE STATE VARIABLES
  // Step 1: Weigh leaf state
  const [isLeafWeighed, setIsLeafWeighed] = useState(false);
  const [weighTriggerCount, setWeighTriggerCount] = useState(0);

  // Step 2: Wash cycle states
  const [isLeafInWash, setIsLeafInWash] = useState(false);
  const [washWaterLevel, setWashWaterLevel] = useState(0); // 0 to 100
  const [isWashAgitating, setIsWashAgitating] = useState(false);
  const [washProgress, setWashProgress] = useState(0);
  const [isWashDone, setIsWashDone] = useState(false);

  // Cinematic interactive wash states
  const [washLeaves, setWashLeaves] = useState<Array<{
    id: string;
    origX: number;
    origY: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    cleanliness: number;
    isSubmerged: boolean;
    isFresh: boolean;
    dirtLevel: number;
    type: 'round' | 'pointed' | 'textured';
  }>>([
    { id: 'leaf_alpha', origX: -130, origY: 10, x: -130, y: 10, rotation: 12, scale: 1.0, cleanliness: 15, isSubmerged: false, isFresh: true, dirtLevel: 85, type: 'pointed' },
    { id: 'leaf_beta', origX: -60, origY: 30, x: -60, y: 30, rotation: -35, scale: 0.9, cleanliness: 30, isSubmerged: false, isFresh: true, dirtLevel: 70, type: 'round' },
    { id: 'leaf_gamma', origX: -200, origY: 25, x: -200, y: 25, rotation: 18, scale: 1.1, cleanliness: 5, isSubmerged: false, isFresh: true, dirtLevel: 95, type: 'textured' },
  ]);

  const [faucetFlow, setFaucetFlow] = useState(0); // 0 to 100
  const [faucetActivating, setFaucetActivating] = useState(false);
  const [bowlParticles, setBowlParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    type: 'dirt' | 'bubble' | 'splash';
  }>>([]);
  const [bowlShaking, setBowlShaking] = useState(false);
  const [cinematicZoom, setCinematicZoom] = useState(false);

  // Step 3: Blender grinding states
  const [isLeafInBlender, setIsLeafInBlender] = useState(false);
  const [isWaterInBlender, setIsWaterInBlender] = useState(false);
  const [isBlending, setIsBlending] = useState(false);
  const [blendProgress, setBlendProgress] = useState(0);
  const [isBlendDone, setIsBlendDone] = useState(false);

  // Advanced interactive blender simulation states
  const [blenderLeaves, setBlenderLeaves] = useState<Array<{
    id: number;
    x: number;
    y: number;
    rotate: number;
    scale: number;
    baseScale?: number;
    speedY: number;
    speedX: number;
    rotateSpeed: number;
    targetY: number;
    bounceCount: number;
  }>>([]);
  const [blenderGrains, setBlenderGrains] = useState<Array<{
    id: number;
    x: number;
    y: number;
    rotate: number;
    scale: number;
    baseScale: number;
    speedY: number;
    speedX: number;
    targetY: number;
    bounceCount: number;
  }>>([]);
  const [isWaterPouringLeaf, setIsWaterPouringLeaf] = useState(false);
  const [waterVolumeLeaf, setWaterVolumeLeaf] = useState(0);
  const [isWaterPouringLegume, setIsWaterPouringLegume] = useState(false);
  const [waterVolumeLegume, setWaterVolumeLegume] = useState(0);
  const [leafBlenderError, setLeafBlenderError] = useState("");
  const [legumeBlenderError, setLegumeBlenderError] = useState("");

  // Step 4: Sieve filtration states
  const [isSlurryPoured, setIsSlurryPoured] = useState(false);
  const [isFiltering1, setIsFiltering1] = useState(false);
  const [filterProgress, setFilterProgress] = useState(0);
  const [isFilter1Done, setIsFilter1Done] = useState(false);

  // Step 5: Thermal separation states
  const [isJuiceInHeater, setIsJuiceInHeater] = useState(false);
  const [isLeafPouring, setIsLeafPouring] = useState(false);
  const [leafPourProgress, setLeafPourProgress] = useState(0);
  const [temperature, setTemperature] = useState(24);
  const [isHeating, setIsHeating] = useState(false);
  const [isCoagulated, setIsCoagulated] = useState(false);

  // Step 6: Moisture press & dry LPC states
  const [isCurdInPress, setIsCurdInPress] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [isPressDone, setIsPressDone] = useState(false);

  // Drag bounding box references for framer motion interaction
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Extract selected leaf metrics
  const activeLeaf = useMemo(() => {
    return allLeafTypes.find(l => l.id === selectedLeafId) || allLeafTypes[0];
  }, [allLeafTypes, selectedLeafId]);

  const baseScaleWeightG = activeLeaf?.leafWeightG || 1000;
  const ratio = leafWeight / baseScaleWeightG;
  const expectedLpcYieldG = ratio * (activeLeaf?.leafProteinConcentrateG || 110);
  const expectedPureProteinG = ratio * (activeLeaf?.leafPureProteinG || 25);
  const expectedFiberWasteG = ratio * (activeLeaf?.wasteG || 180);

  // Auto skip all stages immediately
  const handleSkipAll = () => {
    if (activeWorkflow === 'leaf') {
      playSynthBeep(880, 'sine', 0.25);
      setIsLeafWeighed(true);
      setIsLeafInWash(true);
      setWashWaterLevel(100);
      setIsWashDone(true);
      setWashLeaves([
        { id: 'leaf_alpha', origX: -130, origY: 10, x: 10, y: 110, rotation: 12, scale: 1.0, cleanliness: 100, isSubmerged: true, isFresh: true, dirtLevel: 0, type: 'pointed' },
        { id: 'leaf_beta', origX: -60, origY: 30, x: -10, y: 120, rotation: -35, scale: 0.9, cleanliness: 100, isSubmerged: true, isFresh: true, dirtLevel: 0, type: 'round' },
        { id: 'leaf_gamma', origX: -200, origY: 25, x: 20, y: 130, rotation: 18, scale: 1.1, cleanliness: 100, isSubmerged: true, isFresh: true, dirtLevel: 0, type: 'textured' },
      ]);
      setFaucetFlow(0);
      setBowlParticles([]);
      setIsLeafInBlender(true);
      setIsWaterInBlender(true);
      setIsBlendDone(true);
      setIsSlurryPoured(true);
      setIsFilter1Done(true);
      setIsJuiceInHeater(true);
      setTemperature(76);
      setIsCoagulated(true);
      setIsCurdInPress(true);
      setIsPressDone(true);
      setMaxUnlockedStep(6);
      setActiveStep(6);
    } else if (activeWorkflow === 'legume') {
      playSynthBeep(880, 'sine', 0.25);
      setIsLegumeWeighed(true);
      setIsLegumeWashed(true);
      setLegumeWashWaterLevel(100);
      setIsLegumeWashDone(true);
      setWashGrains((prev) => prev.map(g => ({ ...g, cleanliness: 100, dirtLevel: 0, isSubmerged: true })));
      setIsBeanInMilling(true);
      setIsWaterInMilling(true);
      setIsMillingDone(true);
      setMillingProgress(100);
      setIsLemonSqueezed(true);
      setLemonSqueezeProgress(100);
      setSlurryPh(activeLegume.isoelectricPh);
      setIsPhSeparated(true);
      setIsDecanted(true);
      setIsDecantDone(true);
      setDecantingProgress(100);
      setIsLegumeJuiceInHeater(true);
      setLegumeTemp(80);
      setIsLegumeCoagulated(true);
      setIsLegumeCurdInPress(true);
      setIsLegumePressDone(true);
      setLegumePressProgress(100);
      setMaxUnlockedStep(7);
      setActiveStep(7);
    }
  };

  // Reset entire simulator
  const handleReset = () => {
    playSynthBeep(330, 'triangle', 0.3);
    
    // Leaf states reset
    setIsLeafWeighed(false);
    setIsLeafInWash(false);
    setWashWaterLevel(0);
    setIsWashAgitating(false);
    setWashProgress(0);
    setIsWashDone(false);
    setWashLeaves([
      { id: 'leaf_alpha', origX: -130, origY: 10, x: -130, y: 10, rotation: 12, scale: 1.0, cleanliness: 15, isSubmerged: false, isFresh: true, dirtLevel: 85, type: 'pointed' },
      { id: 'leaf_beta', origX: -60, origY: 30, x: -60, y: 30, rotation: -35, scale: 0.9, cleanliness: 30, isSubmerged: false, isFresh: true, dirtLevel: 70, type: 'round' },
      { id: 'leaf_gamma', origX: -200, origY: 25, x: -200, y: 25, rotation: 18, scale: 1.1, cleanliness: 5, isSubmerged: false, isFresh: true, dirtLevel: 95, type: 'textured' },
    ]);
    setFaucetFlow(0);
    setBowlParticles([]);
    setBowlShaking(false);
    setCinematicZoom(false);
    setIsLeafInBlender(false);
    setIsWaterInBlender(false);
    setIsBlending(false);
    setBlendProgress(0);
    setIsBlendDone(false);
    setBlenderLeaves([]);
    setIsWaterPouringLeaf(false);
    setWaterVolumeLeaf(0);
    setLeafBlenderError("");
    setIsSlurryPoured(false);
    setIsFiltering1(false);
    setFilterProgress(0);
    setIsFilter1Done(false);
    setIsJuiceInHeater(false);
    setIsLeafPouring(false);
    setLeafPourProgress(0);
    setTemperature(24);
    setIsHeating(false);
    setIsCoagulated(false);
    setIsCurdInPress(false);
    setIsPressing(false);
    setPressProgress(0);
    setIsPressDone(false);

    // Legume states reset
    setIsLegumeWeighed(false);
    setIsLegumeWashed(false);
    setLegumeWashWaterLevel(0);
    setIsLegumeWashAgitating(false);
    setLegumeWashProgress(0);
    setIsLegumeWashDone(false);
    setLegumeFaucetFlow(0);
    setLegumeBowlParticles([]);
    setLegumeBowlShaking(false);
    setWashGrains([
      { id: 'grain_1', origX: -140, origY: 20, x: -140, y: 20, rotation: 5, scale: 0.95, cleanliness: 10, isSubmerged: false, dirtLevel: 90 },
      { id: 'grain_2', origX: -110, origY: 40, x: -110, y: 40, rotation: 45, scale: 0.85, cleanliness: 15, isSubmerged: false, dirtLevel: 85 },
      { id: 'grain_3', origX: -80, origY: 10, x: -80, y: 10, rotation: -20, scale: 1.05, cleanliness: 25, isSubmerged: false, dirtLevel: 75 },
      { id: 'grain_4', origX: -50, origY: 30, x: -50, y: 30, rotation: 80, scale: 0.9, cleanliness: 20, isSubmerged: false, dirtLevel: 80 },
      { id: 'grain_5', origX: -160, origY: 45, x: -160, y: 45, rotation: -60, scale: 1.0, cleanliness: 5, isSubmerged: false, dirtLevel: 95 },
      { id: 'grain_6', origX: -130, origY: 55, x: -130, y: 55, rotation: 15, scale: 0.8, cleanliness: 30, isSubmerged: false, dirtLevel: 70 },
      { id: 'grain_7', origX: -100, origY: 60, x: -100, y: 60, rotation: -10, scale: 0.9, cleanliness: 40, isSubmerged: false, dirtLevel: 60 },
      { id: 'grain_8', origX: -70, origY: 50, x: -70, y: 50, rotation: 35, scale: 1.1, cleanliness: 12, isSubmerged: false, dirtLevel: 88 },
    ]);
    setIsBeanInMilling(false);
    setIsWaterInMilling(false);
    setIsMilling(false);
    setMillingProgress(0);
    setIsMillingDone(false);
    setBlenderGrains([]);
    setIsWaterPouringLegume(false);
    setWaterVolumeLegume(0);
    setLegumeBlenderError("");
    setIsLemonSqueezed(false);
    setLemonSqueezeProgress(0);
    setSlurryPh(6.8);
    setIsPhSeparated(false);
    setIsSqueezing(false);
    setIsDecanted(false);
    setIsDecanting(false);
    setDecantingProgress(0);
    setIsDecantDone(false);
    setIsLegumeJuiceInHeater(false);
    setIsLegumePouring(false);
    setLegumePourProgress(0);
    setLegumeTemp(24);
    setIsLegumeHeating(false);
    setIsLegumeCoagulated(false);
    setIsLegumeCurdInPress(false);
    setIsLegumePressing(false);
    setLegumePressProgress(0);
    setIsLegumePressDone(false);

    setActiveStep(1);
    setMaxUnlockedStep(1);
  };

  // Add customized plant to botanical list
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeafNameAr || !newLeafNameEn) return;
    const uid = 'cust_leaf_' + Date.now();
    const leafItem: LeafType = {
      id: uid,
      nameAr: newLeafNameAr,
      nameEn: newLeafNameEn,
      nameFr: newLeafNameEn,
      nameIt: newLeafNameEn,
      nameDe: newLeafNameEn,
      nameZh: newLeafNameEn,
      nameRu: newLeafNameEn,
      namePt: newLeafNameEn,
      nameEs: newLeafNameEn,
      nameHi: newLeafNameEn,
      edible: true,
      leafSeason: 'All Year / طوال العام',
      leafWeightG: newLeafWeightG,
      leafProteinPercent: Number(((newLeafProteinG / newLeafConcentrateG) * 100).toFixed(1)),
      leafProteinConcentrateG: newLeafConcentrateG,
      leafPureProteinG: newLeafProteinG,
      prepNotes: 'Organic customized test sample.',
      wasteG: newLeafWasteG,
      soilEnhancerMethod: 'Standard Mulch',
      soilEnhancerSteps: [],
      soilBenefits: [],
      mixes: generateMixesForLeaf(uid, newLeafProteinG, newLeafConcentrateG),
      aminoAcids: {
        histidine: 2.3,
        isoleucine: 4.8,
        leucine: 8.4,
        lysine: 6.1,
        saa: 3.1,
        aaa: 8.2,
        threonine: 4.6,
        tryptophan: 1.4,
        valine: 5.5
      }
    };
    onAddCustomLeaf(leafItem);
    setSelectedLeafId(uid);
    setLeafWeight(newLeafWeightG);
    setShowCustomLeafModal(false);
    playSynthBeep(650, 'sine', 0.2);
  };

  // Step 2 Action: Agitate Washer
  const runWashAgitation = () => {
    if (isWashAgitating || isWashDone) return;
    setIsWashAgitating(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setWashProgress(p);
      if (p % 16 === 0) playSynthBeep(250 + p * 2, 'triangle', 0.08);
      if (p >= 100) {
        clearInterval(interval);
        setIsWashAgitating(false);
        setIsWashDone(true);
        if (maxUnlockedStep < 3) setMaxUnlockedStep(3);
        playSynthBeep(523.25, 'sine', 0.22); // C5
        setTimeout(() => {
          setActiveStep(3);
          playSynthBeep(440, 'sine', 0.15);
        }, 1800);
      }
    }, 80);
  };

  const toggleFaucet = () => {
    if (faucetActivating) return;
    setFaucetActivating(true);
    const target = faucetFlow > 0 ? 0 : 100;
    playSynthBeep(target > 0 ? 440 : 220, 'sine', 0.25);
    
    let current = faucetFlow;
    const interval = setInterval(() => {
      if (target > 0) {
        current = Math.min(target, current + 10);
      } else {
        current = Math.max(target, current - 15);
      }
      setFaucetFlow(current);
      if (current === target) {
        clearInterval(interval);
        setFaucetActivating(false);
      }
    }, 45);
  };

  const submergeLeaf = (id: string) => {
    // Shake the bowl dynamically on drop impact
    setBowlShaking(true);
    setTimeout(() => setBowlShaking(false), 300);

    setWashLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          playSynthBeep(180, 'triangle', 0.2);
          playSynthBeep(320, 'sine', 0.12);
          return {
            ...l,
            isSubmerged: true,
            x: (Math.random() * 60 - 30), // Random offset in center basin
            y: 110 + (Math.random() * 20),
            rotation: Math.random() * 60 - 30,
          };
        }
        return l;
      })
    );
  };

  const [legumeFaucetActivating, setLegumeFaucetActivating] = useState(false);

  const runLegumeWashAgitation = () => {
    if (isLegumeWashAgitating || isLegumeWashDone) return;
    setIsLegumeWashAgitating(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setLegumeWashProgress(p);
      if (p % 15 === 0) playSynthBeep(220 + p * 2.5, 'triangle', 0.08);
      if (p >= 100) {
        clearInterval(interval);
        setIsLegumeWashAgitating(false);
        setIsLegumeWashDone(true);
        if (maxUnlockedStep < 3) setMaxUnlockedStep(3);
        playSynthBeep(523.25, 'sine', 0.22);
        setTimeout(() => {
          setActiveStep(3);
          playSynthBeep(440, 'sine', 0.15);
        }, 1800);
      }
    }, 70);
  };

  const toggleLegumeFaucet = () => {
    if (legumeFaucetActivating) return;
    setLegumeFaucetActivating(true);
    const target = legumeFaucetFlow > 0 ? 0 : 100;
    playSynthBeep(target > 0 ? 440 : 220, 'sine', 0.25);
    
    let current = legumeFaucetFlow;
    const interval = setInterval(() => {
      if (target > 0) {
        current = Math.min(target, current + 10);
      } else {
        current = Math.max(target, current - 15);
      }
      setLegumeFaucetFlow(current);
      if (current === target) {
        clearInterval(interval);
        setLegumeFaucetActivating(false);
      }
    }, 45);
  };

  const submergeGrain = (id: string) => {
    setLegumeBowlShaking(true);
    setTimeout(() => setLegumeBowlShaking(false), 250);

    setWashGrains((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          playSynthBeep(180, 'triangle', 0.15);
          playSynthBeep(340, 'sine', 0.1);
          return {
            ...g,
            isSubmerged: true,
            x: (Math.random() * 80 - 40),
            y: 110 + (Math.random() * 18),
            rotation: Math.random() * 180,
          };
        }
        return g;
      })
    );
  };

  const runLegumeMilling = () => {
    if (isMilling || isMillingDone) return;
    setIsMilling(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setMillingProgress(p);
      if (p % 16 === 0) playSynthBeep(180 + p * 2.5, 'square', 0.07);
      if (p >= 100) {
        clearInterval(interval);
        setIsMilling(false);
        setIsMillingDone(true);
        if (maxUnlockedStep < 4) setMaxUnlockedStep(4);
        playSynthBeep(659.25, 'sine', 0.25);
        setTimeout(() => {
          setActiveStep(4);
          playSynthBeep(440, 'sine', 0.15);
        }, 1800);
      }
    }, 80);
  };

  const squeezeLemonDrop = () => {
    if (isPhSeparated || isSqueezing) return;
    setIsSqueezing(true);
    playSynthBeep(450, 'triangle', 0.12);
    
    setSlurryPh((prev) => {
      const target = activeLegume.isoelectricPh;
      const next = Math.max(target, Number((prev - 0.48).toFixed(2)));
      if (next <= target) {
        setIsLemonSqueezed(true);
        setIsPhSeparated(true);
        if (maxUnlockedStep < 5) setMaxUnlockedStep(5);
        playSynthBeep(880, 'sine', 0.3);
        setTimeout(() => {
          setActiveStep(5);
          playSynthBeep(440, 'sine', 0.15);
        }, 3200);
      }
      return next;
    });

    setTimeout(() => {
      setIsSqueezing(false);
    }, 300);
  };

  const runLegumeDecanting = () => {
    if (isDecanting || isDecantDone) return;
    setIsDecanting(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setDecantingProgress(p);
      if (p % 15 === 0) playSynthBeep(280 + p * 2, 'sine', 0.08);
      if (p >= 100) {
        clearInterval(interval);
        setIsDecanting(false);
        setIsDecantDone(true);
        if (maxUnlockedStep < 6) setMaxUnlockedStep(6);
        playSynthBeep(523.25, 'sine', 0.2);
        setTimeout(() => {
          setActiveStep(6);
          playSynthBeep(440, 'sine', 0.15);
        }, 1800);
      }
    }, 80);
  };

  const startLegumePouring = () => {
    if (isLegumePouring || isLegumeJuiceInHeater) return;
    setIsLegumePouring(true);
    setLegumePourProgress(0);
    playSynthBeep(220, 'triangle', 0.2);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setLegumePourProgress(currentProgress);
      if (currentProgress % 15 === 0) {
        playSynthBeep(300 + currentProgress * 2, 'sine', 0.04);
      }
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLegumePouring(false);
        setIsLegumeJuiceInHeater(true);
        playSynthBeep(523.25, 'sine', 0.2);
      }
    }, 70);
  };

  const runLegumeHeating = () => {
    if (isLegumeHeating || isLegumeCoagulated) return;
    setIsLegumeHeating(true);
    let tVal = 24.0;
    const interval = setInterval(() => {
      tVal = Math.min(80, tVal + 0.8);
      setLegumeTemp(Number(tVal.toFixed(1)));
      if (Math.floor(tVal) % 8 === 0 && tVal - Math.floor(tVal) < 0.8) {
        playSynthBeep(220 + tVal * 3.5, 'sine', 0.05);
      }
      if (tVal >= 80) {
        clearInterval(interval);
        setIsLegumeHeating(false);
        setIsLegumeCoagulated(true);
        if (maxUnlockedStep < 7) setMaxUnlockedStep(7);
        playSynthBeep(784, 'sine', 0.25);
        setTimeout(() => {
          setActiveStep(7);
          playSynthBeep(440, 'sine', 0.15);
        }, 1800);
      }
    }, 60);
  };

  const runLegumePress = () => {
    if (isLegumePressing || isLegumePressDone) return;
    setIsLegumePressing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setLegumePressProgress(p);
      if (p % 15 === 0) playSynthBeep(110 + p * 2.2, 'triangle', 0.1);
      if (p >= 100) {
        clearInterval(interval);
        setIsLegumePressing(false);
        setIsLegumePressDone(true);
        playSynthBeep(987.77, 'sine', 0.3);
      }
    }, 80);
  };

  // Dynamics & Animation Loop for Ultrasonic Wash Basin
  React.useEffect(() => {
    if (activeStep !== 2) return;

    const interval = setInterval(() => {
      if (activeWorkflow === 'legume') {
        // 1. Legume Water filling logic
        if (legumeFaucetFlow > 0) {
          setLegumeWashWaterLevel((prev) => {
            const next = Math.min(100, prev + (legumeFaucetFlow / 100) * 1.5);
            // Auto flag grain in wash when water meets seeds
            if (next >= 40 && !isLegumeWashed && washGrains.some(g => g.isSubmerged)) {
              setIsLegumeWashed(true);
            }
            return next;
          });
        }

        // 2. Legume seeds agitation progress & physical drift
        if (isLegumeWashAgitating) {
          setWashGrains((prev) =>
            prev.map((grain) => {
              if (!grain.isSubmerged) return grain;
              const time = Date.now() / 150;
              const orbitRadius = 30;
              const phase = grain.id.charCodeAt(grain.id.length - 1) * 0.8;
              
              const driftX = Math.cos(time + phase) * orbitRadius;
              const driftY = 95 + Math.sin(time + phase * 1.5) * 8;
              const randomRotation = grain.rotation + (Math.random() * 5 - 2.5);
              
              return {
                ...grain,
                x: driftX,
                y: driftY,
                rotation: randomRotation % 360,
                cleanliness: Math.min(100, grain.cleanliness + 0.6),
                dirtLevel: Math.max(0, grain.dirtLevel - 0.6)
              };
            })
          );
        }

        // 3. Legume Faucet stream and bubble particle generators
        setLegumeBowlParticles((prevParticles) => {
          let updated = prevParticles.map((p) => {
            let ny = p.y + p.vy;
            let nx = p.x + p.vx;
            let nalpha = p.alpha;

            const waterLevelY = 175 - (legumeWashWaterLevel / 100) * 115;

            if (p.type === 'splash') {
              if (ny >= waterLevelY) {
                nalpha = 0; // Destroy at water level
              }
            } else if (p.type === 'bubble') {
              if (ny <= waterLevelY) {
                nalpha = 0; // Destroy pop
              }
            } else if (p.type === 'dirt') {
              nalpha -= 0.018; // Slow dissolve
            }

            return { ...p, x: nx, y: ny, alpha: nalpha };
          }).filter(p => p.alpha > 0.05 && p.y >= 0 && p.y <= 240);

          // Spawn stream droplets iff faucet is flowing
          if (legumeFaucetFlow > 5) {
            const spawnCount = Math.ceil(legumeFaucetFlow / 25);
            for (let i = 0; i < spawnCount; i++) {
              updated.push({
                id: getUniqueIdNum(),
                x: 140 + (Math.random() * 10 - 5), // Center spout position alignment
                y: 20 + Math.random() * 10,
                vx: (Math.random() * 0.6 - 0.3),
                vy: 8 + Math.random() * 3,
                size: 2.2 + Math.random() * 3,
                alpha: 0.9,
                color: 'rgba(186, 230, 253, 0.75)',
                type: 'splash'
              });
            }
          }

          // Spawn bubbles if ultrasonic is agitating
          if (isLegumeWashAgitating && Math.random() < 0.45) {
            updated.push({
              id: getUniqueIdNum(),
              x: 50 + Math.random() * 180,
              y: 165 + Math.random() * 20,
              vx: (Math.random() * 1.4 - 0.7),
              vy: -1.4 - Math.random() * 1.5,
              size: 2 + Math.random() * 3,
              alpha: 0.85,
              color: 'rgba(255, 255, 255, 0.7)',
              type: 'bubble'
            });
          }

          // Spawn detaching dirt during active washing
          if (isLegumeWashAgitating && Math.random() < 0.32) {
            const submergedDirtyGrains = washGrains.filter(g => g.isSubmerged && g.dirtLevel > 1);
            if (submergedDirtyGrains.length > 0) {
              const randomGrain = submergedDirtyGrains[Math.floor(Math.random() * submergedDirtyGrains.length)];
              updated.push({
                id: getUniqueIdNum(),
                x: randomGrain.x + 140 + (Math.random() * 20 - 10),
                y: randomGrain.y + (Math.random() * 10 - 5),
                vx: (Math.random() * 2.0 - 1.0),
                vy: -0.4 - Math.random() * 0.4,
                size: 1.3 + Math.random() * 1.8,
                alpha: 0.95,
                color: 'rgba(120, 95, 65, 0.85)',
                type: 'dirt'
              });
            }
          }

          return updated.slice(0, 90);
        });
      } else {
        // ORIGINAL LEAF PHYSICS
        // 1. Water filling logic
        if (faucetFlow > 0) {
          setWashWaterLevel((prev) => {
            const next = Math.min(100, prev + (faucetFlow / 100) * 1.5);
            // Auto flag leaf in wash when water meets leaves
            if (next >= 40 && !isLeafInWash && washLeaves.some(l => l.isSubmerged)) {
              setIsLeafInWash(true);
            }
            return next;
          });
        }

        // 2. Ultrasonic washing cleanliness progress & physical drift
        if (isWashAgitating) {
          setWashLeaves((prev) =>
            prev.map((leaf) => {
              if (!leaf.isSubmerged) return leaf;
              const time = Date.now() / 150;
              const orbitRadius = 25;
              const phase = leaf.id === 'leaf_alpha' ? 0 : leaf.id === 'leaf_beta' ? 2 : 4;
              
              const driftX = Math.cos(time + phase) * orbitRadius;
              const driftY = 95 + Math.sin(time + phase * 1.5) * 10;
              const randomRotation = leaf.rotation + (Math.random() * 3 - 1.5) + 1.2;
              
              return {
                ...leaf,
                x: driftX,
                y: driftY,
                rotation: randomRotation % 360,
                cleanliness: Math.min(100, leaf.cleanliness + 0.5),
                dirtLevel: Math.max(0, leaf.dirtLevel - 0.5)
              };
            })
          );
        }

        // 3. Faucet stream and bubble particle generators
        setBowlParticles((prevParticles) => {
          let updated = prevParticles.map((p) => {
            let ny = p.y + p.vy;
            let nx = p.x + p.vx;
            let nalpha = p.alpha;

            const waterLevelY = 175 - (washWaterLevel / 100) * 115;

            if (p.type === 'splash') {
              if (ny >= waterLevelY) {
                nalpha = 0; // Destroy at water level
              }
            } else if (p.type === 'bubble') {
              if (ny <= waterLevelY) {
                nalpha = 0; // Destroy pop
              }
            } else if (p.type === 'dirt') {
              nalpha -= 0.015; // Slow dissolve
            }

            return { ...p, x: nx, y: ny, alpha: nalpha };
          }).filter(p => p.alpha > 0.05 && p.y >= 0 && p.y <= 240);

          // Spawn stream droplets iff faucet is flowing
          if (faucetFlow > 5) {
            const spawnCount = Math.ceil(faucetFlow / 25);
            for (let i = 0; i < spawnCount; i++) {
              updated.push({
                id: getUniqueIdNum(),
                x: 140 + (Math.random() * 10 - 5), // Center spout position alignment
                y: 20 + Math.random() * 10,
                vx: (Math.random() * 0.6 - 0.3),
                vy: 8 + Math.random() * 3,
                size: 2.2 + Math.random() * 3,
                alpha: 0.9,
                color: 'rgba(186, 230, 253, 0.75)',
                type: 'splash'
              });
            }
          }

          // Spawn bubbles if ultrasonic is agitating
          if (isWashAgitating && Math.random() < 0.4) {
            updated.push({
              id: getUniqueIdNum(),
              x: 50 + Math.random() * 180,
              y: 165 + Math.random() * 20,
              vx: (Math.random() * 1.4 - 0.7),
              vy: -1.4 - Math.random() * 1.5,
              size: 2 + Math.random() * 3,
              alpha: 0.85,
              color: 'rgba(255, 255, 255, 0.7)',
              type: 'bubble'
            });
          }

          // Spawn detaching dirt during active washing
          if (isWashAgitating && Math.random() < 0.28) {
            const submergedDirtyLeaves = washLeaves.filter(l => l.isSubmerged && l.dirtLevel > 1);
            if (submergedDirtyLeaves.length > 0) {
              const randomLeaf = submergedDirtyLeaves[Math.floor(Math.random() * submergedDirtyLeaves.length)];
              updated.push({
                id: getUniqueIdNum(),
                x: randomLeaf.x + 140 + (Math.random() * 30 - 15),
                y: randomLeaf.y + (Math.random() * 20 - 10),
                vx: (Math.random() * 2.2 - 1.1),
                vy: -0.5 - Math.random() * 0.5,
                size: 1.5 + Math.random() * 2,
                alpha: 0.95,
                color: 'rgba(110, 85, 55, 0.8)',
                type: 'dirt'
              });
            }
          }

          return updated.slice(0, 90);
        });
      }
    }, 30);

    return () => clearInterval(interval);
  }, [activeStep, activeWorkflow, faucetFlow, legumeFaucetFlow, washWaterLevel, legumeWashWaterLevel, isWashAgitating, isLegumeWashAgitating, washLeaves, washGrains]);

  const renderSingleSeedContent = (
    legumeId: string,
    cleanFactor: number,
    dLevel: number,
    baseId: string,
    scaleVal: number
  ) => {
    let baseColor = '#ca8a04';
    let sheenColor = '#bef264';
    let darkColor = '#7c2d12';
    let dirtColor = '#78350f';

    if (legumeId === 'lentil') {
      baseColor = '#f59e0b';
      sheenColor = '#fbbf24';
      darkColor = '#b45309';
      dirtColor = '#4a0404';
    } else if (legumeId === 'fava') {
      baseColor = '#a77242'; // Rich traditional warm Egyptian fava bean brown
      sheenColor = '#dfbca0'; // Warm cream highlight
      darkColor = '#52341a'; // Deep grounding bean silhouette shadings
      dirtColor = '#1e1104';
    } else if (legumeId === 'lupin') {
      baseColor = '#eab308'; // True bright yellow lupin base color
      sheenColor = '#fef08a'; // Lighter yellow transition
      darkColor = '#a16207'; // Deep yellow shadow
      dirtColor = '#3f2b05';
    } else if (legumeId === 'chickpea') {
      baseColor = '#e7dbcb';
      sheenColor = '#fcf8f2';
      darkColor = '#9a8870';
      dirtColor = '#3f3526';
    } else if (legumeId === 'soy') {
      baseColor = '#f59e0b';
      sheenColor = '#fef08a';
      darkColor = '#a16207';
      dirtColor = '#450a0a';
    }

    return (
      <g>
        <defs>
          <radialGradient id={`seed-grad-${baseId}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={sheenColor} />
            <stop offset="65%" stopColor={baseColor} />
            <stop offset="100%" stopColor={dLevel > 0.1 ? dirtColor : darkColor} />
          </radialGradient>
          <radialGradient id={`seed-dust-${baseId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={dirtColor} stopOpacity={0.8 * dLevel} />
            <stop offset="100%" stopColor="#450a0a" stopOpacity={0.15 * dLevel} />
          </radialGradient>
        </defs>

        <g transform={`translate(50, 50) scale(${scaleVal}) translate(-50, -50)`}>
          {legumeId === 'lentil' && (
            <>
              {/* Flattened smooth lentil split disc/dome */}
              <ellipse cx="50" cy="50" rx="36" ry="30" fill={`url(#seed-grad-${baseId})`} />
              {/* Thin crescent-like rim shadow to show 3D flat thickness */}
              <path d="M 14 50 A 36 30 0 0 0 86 50 A 36 33 0 0 1 14 50" fill="rgba(0,0,0,0.15)" />
              {/* Split lentil flat inner face definition */}
              <ellipse cx="50" cy="50" rx="31" ry="25" fill={`url(#seed-grad-${baseId})`} opacity="0.95" />
              {/* Split lentil center highlight */}
              <ellipse cx="50" cy="50" rx="22" ry="17" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
              <circle cx="40" cy="40" r="5" fill="#ffffff" opacity="0.45" />
            </>
          )}

          {legumeId === 'fava' && (
            <>
              {/* Regular, symmetric, and highly realistic Egyptian fava kidney shape with a rounded, swollen body */}
              <path d="M 28 50 C 28 28, 44 22, 68 22 C 86 22, 92 34, 92 50 C 92 66, 86 78, 68 78 C 44 78, 28 72, 28 50 Z" fill={`url(#seed-grad-${baseId})`} />
              {/* Volume shading around the edge */}
              <path d="M 28 50 C 28 28, 44 22, 68 22 C 86 22, 92 34, 92 50" fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="3.5" />
              {/* swollen contour glowing accents to highlight 3D thick roundness */}
              <ellipse cx="60" cy="50" rx="18" ry="16" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="2.5" />
              {/* White specular shine for wet/clean appearance */}
              <ellipse cx="58" cy="38" rx="14" ry="6" transform="rotate(-10, 58, 38)" fill="#ffffff" opacity="0.25" filter="blur(0.5px)" />
              <circle cx="48" cy="34" r="5" fill="#ffffff" opacity="0.22" />
              {/* Distinct black/dark eye hilum line typical of Egyptian fava beans, placed symmetrically on the side edge */}
              <path d="M 28 40 C 29 46, 29 54, 28 60" stroke="#1c0f05" strokeWidth="6.5" strokeLinecap="round" fill="none" opacity={0.98 * cleanFactor} />
              {/* Bright seam accent bordering the hilum to make it pop and look ultra-realistic */}
              <path d="M 26 38 C 27 46, 27 54, 26 62" stroke="#fcf6f0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.88 * cleanFactor} />
              {/* Realistic surface crease suggesting swollen lobes */}
              <path d="M 40 52 Q 60 58 80 50" stroke="rgba(0,0,0,0.12)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </>
          )}

          {legumeId === 'lupin' && (
            <>
              {/* Authentic flat-round Lupin seed with a distinctive indentation notch on the side */}
              <path d="M 50 28 C 44 24, 24 22, 20 42 C 16 60, 32 80, 50 80 C 68 80, 84 60, 80 42 C 76 22, 56 24, 50 28 Z" fill={`url(#seed-grad-${baseId})`} />
              {/* Flat cushion concentric border line which visually emphasizes the flattened profile */}
              <path d="M 50 33 C 45 30, 29 28, 26 44 C 23 57, 36 72, 50 72 C 64 72, 77 57, 74 44 C 71 28, 55 30, 50 33 Z" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.45" />
              {/* Smooth bright yellow highlight to emphasize flat side surface */}
              <ellipse cx="50" cy="52" rx="20" ry="18" fill="rgba(255,255,255,0.1)" />
              {/* Crisp white gloss/highlight reflections for lupin seeds */}
              <ellipse cx="40" cy="42" rx="15" ry="10" transform="rotate(-15, 40, 42)" fill="#ffffff" opacity="0.32" />
              <circle cx="34" cy="35" r="4.5" fill="#ffffff" opacity="0.4" />
              {/* Small characteristic seed scar tucked beautifully within the side indentation notch */}
              <ellipse cx="50" cy="29" rx="3.5" ry="2" fill="#fffbeb" stroke={darkColor} strokeWidth="1" opacity={0.9 * cleanFactor} />
              <circle cx="50" cy="29" r="1.2" fill={darkColor} opacity={0.8} />
            </>
          )}

          {legumeId === 'chickpea' && (
            <>
              {/* Pointy beak bumpy chickpea */}
              <path d="M 50 15 C 57 15, 54 26, 62 28 C 76 34, 83 48, 80 65 C 77 82, 55 85, 41 81 C 24 76, 17 56, 25 41 C 32 30, 43 25, 45 15 Z" fill={`url(#seed-grad-${baseId})`} />
              {/* Characteristic longitudinal grooves / deep wrinkles of chickpea */}
              <path d="M 48 16 Q 41 38 41 62" stroke="rgba(113, 63, 18, 0.28)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 52 16 Q 59 38 60 56" stroke="rgba(113, 63, 18, 0.2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 32 44 Q 45 52 56 46" stroke="rgba(113, 63, 18, 0.18)" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Beak highlight */}
              <path d="M 47 16 C 49 20, 52 20, 55 17" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity={cleanFactor * 0.9} />
              {/* Textured shading points */}
              <circle cx="36" cy="62" r="1.5" fill="rgba(0,0,0,0.12)" />
              <circle cx="68" cy="68" r="1.2" fill="rgba(0,0,0,0.12)" />
              <circle cx="58" cy="38" r="1.5" fill="rgba(0,0,0,0.12)" />
            </>
          )}

          {legumeId === 'soy' && (
            <>
              {/* Spherical glossy soybean */}
              <circle cx="50" cy="50" r="34" fill={`url(#seed-grad-${baseId})`} />
              {/* Gloss highlight */}
              <ellipse cx="40" cy="36" rx="14" ry="10" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2.5" transform="rotate(-20, 40, 36)" opacity={cleanFactor} />
              <circle cx="36" cy="34" r="6" fill="#ffffff" opacity="0.3" filter="blur(1px)" />
              {/* High-fidelity hilum/eye line on the side/center */}
              <g transform="rotate(30, 50, 50)" opacity={0.9 * cleanFactor}>
                {/* Dark brown area */}
                <rect x="47.5" y="44" width="5" height="12" rx="2.5" fill="#451a03" />
                {/* Thin white border/halo of hilum */}
                <rect x="46.5" y="43" width="7" height="14" rx="3.5" fill="none" stroke="#fafaf9" strokeWidth="1" />
              </g>
            </>
          )}

          {/* Dirt film overlay */}
          {legumeId === 'lentil' && <ellipse cx="50" cy="50" rx="36" ry="30" fill={`url(#seed-dust-${baseId})`} />}
          {legumeId === 'fava' && <path d="M 28 45 C 24 30, 38 14, 62 16 C 80 18, 88 34, 85 55 C 82 76, 68 85, 48 85 C 32 85, 22 75, 24 62 C 26 50, 32 50, 28 45 Z" fill={`url(#seed-dust-${baseId})`} />}
          {legumeId === 'lupin' && <path d="M 25 24 C 40 18, 60 18, 75 24 C 86 35, 86 65, 75 76 C 60 82, 40 82, 25 76 C 14 65, 14 35, 25 24 Z" fill={`url(#seed-dust-${baseId})`} />}
          {legumeId === 'chickpea' && <path d="M 50 15 C 57 15, 54 26, 62 28 C 76 34, 83 48, 80 65 C 77 82, 55 85, 41 81 C 24 76, 17 56, 25 41 C 32 30, 43 25, 45 15 Z" fill={`url(#seed-dust-${baseId})`} />}
          {legumeId === 'soy' && <circle cx="50" cy="50" r="34" fill={`url(#seed-dust-${baseId})`} />}

          {/* Individual dirt specks */}
          {dLevel > 0.04 && (
            <g fill={dirtColor} opacity={dLevel * 0.95}>
              <circle cx="36" cy="48" r="2.2" />
              <circle cx="64" cy="56" r="1.6" />
              <circle cx="56" cy="38" r="1.9" />
            </g>
          )}
        </g>
      </g>
    );
  };

  const renderRealisticGrain = (grain: typeof washGrains[0]) => {
    let scaleVal = 1.0;
    if (selectedLegumeId === 'lentil') scaleVal = 0.55;
    else if (selectedLegumeId === 'fava') scaleVal = 1.65;
    else if (selectedLegumeId === 'lupin') scaleVal = 1.25;
    else if (selectedLegumeId === 'chickpea') scaleVal = 1.05;
    else if (selectedLegumeId === 'soy') scaleVal = 0.85;

    const dLevel = grain.dirtLevel / 100;
    const cleanFactor = grain.cleanliness / 100;

    return (
      <svg className="w-full h-full select-none" viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}>
        {renderSingleSeedContent(selectedLegumeId, cleanFactor, dLevel, grain.id, scaleVal)}
      </svg>
    );
  };

  const renderLegumeCluster = (legumeId: string, baseWidth: string = "w-16 h-16") => {
    let scaleVal = 0.7; // slightly smaller since we stack 5 of them inside the 100x100 box
    if (legumeId === 'lentil') scaleVal *= 0.55;
    else if (legumeId === 'fava') scaleVal *= 1.65;
    else if (legumeId === 'lupin') scaleVal *= 1.25;
    else if (legumeId === 'chickpea') scaleVal *= 1.05;
    else if (legumeId === 'soy') scaleVal *= 0.85;

    return (
      <svg className={`${baseWidth} filter drop-shadow-md overflow-visible`} viewBox="0 0 100 100" fill="none">
        {/* Seed 1 - bottom left */}
        <g transform="translate(15, 30) scale(0.6)">
          {renderSingleSeedContent(legumeId, 0.95, 0.0, `${legumeId}-c1`, scaleVal)}
        </g>
        {/* Seed 2 - bottom right */}
        <g transform="translate(45, 30) scale(0.65) rotate(35, 50, 50)">
          {renderSingleSeedContent(legumeId, 0.95, 0.0, `${legumeId}-c2`, scaleVal)}
        </g>
        {/* Seed 3 - middle */}
        <g transform="translate(30, 15) scale(0.7) rotate(-15, 50, 50)">
          {renderSingleSeedContent(legumeId, 0.95, 0.0, `${legumeId}-c3`, scaleVal)}
        </g>
        {/* Seed 4 - top left */}
        <g transform="translate(20, 2) scale(0.6) rotate(70, 50, 50)">
          {renderSingleSeedContent(legumeId, 0.95, 0.0, `${legumeId}-c4`, scaleVal)}
        </g>
        {/* Seed 5 - top right */}
        <g transform="translate(42, 2) scale(0.62) rotate(-45, 50, 50)">
          {renderSingleSeedContent(legumeId, 0.95, 0.0, `${legumeId}-c5`, scaleVal)}
        </g>
      </svg>
    );
  };

  const renderLegumeSelectorScreen = () => {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10 px-4 sm:px-8 relative z-10 max-w-5xl">
        
        {/* Ambient subtle light glows in corner */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-12 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 bg-stone-900 border border-stone-800 rounded-full text-[9px] font-mono tracking-widest text-zinc-400 uppercase mb-4"
          >
            <Sparkles size={10} className="text-amber-400 animate-spin" />
            {t('automated_molecular_workspace')}
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white uppercase drop-shadow">
            {t('simulation_selector_title')}
          </h1>
          <p className="text-xs text-stone-400 mt-2 max-w-xl font-sans leading-relaxed">
            {t('simulation_selector_subtitle')}
          </p>
        </div>

        {/* Multi-Simulator Selection Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-20">
          
          {/* CARD 1: LEAF EXTRACTION */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            onClick={() => {
              playSynthBeep(440, 'sine', 0.15);
              setActiveWorkflow('leaf');
              setActiveStep(1);
              setMaxUnlockedStep(1);
            }}
            className="cursor-pointer group relative bg-neutral-950/70 border border-emerald-500/20 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:border-emerald-500/60 hover:shadow-[0_0_50px_rgba(16,185,129,0.12)]"
          >
            {/* Visual background details */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
              <Leaf size={140} className="text-emerald-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <Leaf size={24} />
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                  {t('botanical_badge')}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                  {t('leaf_protein_extraction_title')}
                </h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed font-sans">
                  {t('leaf_protein_extraction_desc')}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[9px] text-stone-500">
                <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-850">
                  <span className="block text-stone-400 uppercase tracking-wider mb-0.5">{t('typical_yield_label')}</span>
                  <span className="font-extrabold text-emerald-400 text-xs">11.0% - 15.0%</span>
                </div>
                <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-850">
                  <span className="block text-stone-400 uppercase tracking-wider mb-0.5">{t('thermal_coag_label')}</span>
                  <span className="font-extrabold text-emerald-400 text-xs">75°C - 80°C</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-bold pt-6 border-t border-stone-900 mt-4 group-hover:translate-x-1 transition-transform">
              <span>{t('initialize_simulation_matrix_btn')}</span>
            </div>
          </motion.div>

          {/* CARD 2: LEGUME EXTRACTION */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            onClick={() => {
              playSynthBeep(520, 'sine', 0.15);
              setActiveWorkflow('legume');
              setActiveStep(1);
              setMaxUnlockedStep(1);
            }}
            className="cursor-pointer group relative bg-neutral-950/70 border border-amber-500/20 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:border-amber-500/60 hover:shadow-[0_0_50px_rgba(245,158,11,0.12)]"
          >
            {/* Visual background details */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
              <Sprout size={140} className="text-amber-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-300">
                  <Sprout size={24} />
                </div>
                <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
                  {t('seed_grain_badge')}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                  {t('legume_protein_extraction_title')}
                </h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed font-sans">
                  {t('legume_protein_extraction_desc')}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[9px] text-stone-500">
                <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-850">
                  <span className="block text-stone-400 uppercase tracking-wider mb-0.5">{t('typical_yield_label')}</span>
                  <span className="font-extrabold text-amber-400 text-xs">21.0% - 28.0%</span>
                </div>
                <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-850">
                  <span className="block text-stone-400 uppercase tracking-wider mb-0.5">{t('iso_ph_value_label')}</span>
                  <span className="font-extrabold text-amber-400 text-xs">pH 4.4 - 4.6</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-amber-400 font-mono font-bold pt-6 border-t border-stone-900 mt-4 group-hover:translate-x-1 transition-transform">
              <span>{t('initialize_simulation_matrix_btn')}</span>
            </div>
          </motion.div>

        </div>
      </div>
    );
  };

  const renderLegumeStep1 = () => {
    return (
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl animate-fade-in">
        
        {/* Grain spec selection panel */}
        <div className="flex flex-col bg-stone-900/50 p-5 rounded-2xl border border-stone-850 w-full max-w-sm">
          <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-3 border-b border-stone-800 pb-2">
            {isRtl ? 'عينات البقول المعايرة' : 'LEGUME SPECIMEN SELECTION'}
          </div>
          <div className="space-y-2.5">
            {legumesList.map((leg) => {
              const isActive = selectedLegumeId === leg.id;
              return (
                <button
                  key={leg.id}
                  onClick={() => {
                    setSelectedLegumeId(leg.id);
                    setLegumeWeight(leg.weightG);
                    playSynthBeep(330, 'sine', 0.1);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isActive 
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                      : 'bg-stone-950/40 border-stone-850 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs">{getLegumeName(leg)}</span>
                    <span className="text-[9px] font-mono text-stone-500 mt-0.5">{t('season').toUpperCase()}: {t(leg.season.toLowerCase()) || leg.season}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? 'text-amber-400' : 'text-stone-600'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Grab and scale panel */}
        <div className="flex flex-col items-center">
          {!isLegumeWeighed ? (
            <div className="text-center space-y-3 relative z-25">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                {isRtl ? 'البذور المعايرة (اضغط أو اسحب)' : 'GRAINS SPECIMEN (DRAG OR CLICK)'}
              </div>
              
              <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.4}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                onDragStart={() => {
                  setDraggingItem('grains');
                  playSynthBeep(260, 'sine', 0.1);
                }}
                onDragEnd={(e, info) => {
                  setDraggingItem(null);
                  if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                    setIsLegumeWeighed(true);
                    setMaxUnlockedStep(2);
                    playSynthBeep(520, 'sine', 0.15);
                    setTimeout(() => {
                      setActiveStep(2);
                      playSynthBeep(350, 'sine', 0.12);
                    }, 1800);
                  }
                }}
                onClick={() => {
                  setIsLegumeWeighed(true);
                  setMaxUnlockedStep(2);
                  playSynthBeep(520, 'sine', 0.15);
                  setTimeout(() => {
                    setActiveStep(2);
                    playSynthBeep(350, 'sine', 0.12);
                  }, 1800);
                }}
                whileHover={{ scale: 1.12, translateY: -5 }}
                whileDrag={{ scale: 1.25, rotate: 10 }}
                className="w-28 h-28 cursor-grab active:cursor-grabbing bg-stone-900 border-2 border-dashed border-amber-500 p-3 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center relative group touch-none select-none transition-shadow"
              >
                {/* SVG representing grains selection */}
                {renderLegumeCluster(selectedLegumeId, "w-16 h-16")}
                <span className="text-[8px] font-mono text-amber-400 font-extrabold uppercase mt-1">
                  {t('grab_me')}
                </span>
              </motion.div>
            </div>
          ) : (
            <div className="w-28 h-28 bg-stone-950/40 border border-stone-850 rounded-2xl flex items-center justify-center opacity-30">
              <span className="text-[10px] font-mono text-zinc-650 uppercase">{t('placed')}</span>
            </div>
          )}
        </div>

        {/* Glowing Arrow Indicator */}
        {!isLegumeWeighed && (
          <div className="hidden md:flex flex-col items-center text-amber-500 animate-pulse">
            <ArrowRight size={24} />
            <span className="text-[8px] font-mono mt-1 uppercase tracking-widest">{t('to_scale')}</span>
          </div>
        )}

        {/* Real Weight Digital Bench Scale */}
        <div className="flex flex-col items-center relative z-10 w-80">
          <div className="w-64 h-12 bg-gradient-to-r from-stone-500 via-stone-300 to-stone-600 rounded-xl border-b-8 border-stone-700 shadow-2xl flex items-center justify-center relative">
            {isLegumeWeighed ? (
              <motion.div
                initial={{ y: -80, scale: 0.1, opacity: 0 }}
                animate={{ y: -24, scale: 1.25, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="absolute z-20"
              >
                {renderLegumeCluster(selectedLegumeId, "w-24 h-24")}
              </motion.div>
            ) : (
              <div className={`absolute -top-16 w-52 h-16 border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 ${
                draggingItem === 'grains'
                  ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-[0_0_20px_rgba(245,158,11,0.45)]'
                  : 'border-amber-500/50 bg-amber-500/5 animate-pulse'
              }`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                  draggingItem === 'grains' ? 'text-amber-300' : 'text-amber-500'
                }`}>
                  🎯 {t('drop_target_scale')}
                </span>
              </div>
            )}
          </div>

          <div className="w-72 bg-gradient-to-b from-stone-900 to-stone-950 border-x-2 border-b-2 border-stone-800 p-5 rounded-b-3xl shadow-2xl flex flex-col items-center gap-3 mt-0.5">
            <div className="w-full bg-black border border-stone-850 px-4 py-3 rounded-xl flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">{t('measured_weight')}</span>
              <span className={`font-mono text-2xl font-black tracking-widest ${isLegumeWeighed ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-stone-800'}`}>
                {isLegumeWeighed ? `${legumeWeight} g` : '0.00 g'}
              </span>
            </div>
            {isLegumeWeighed && (
              <span className="text-[9px] font-mono text-amber-400 uppercase font-black tracking-widest animate-pulse flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                {t('calibration_success')}
              </span>
            )}
          </div>
        </div>

      </div>
    );
  };

  const renderLegumeStep2 = () => {
    return (
      <div 
        className={`w-full flex flex-col md:flex-row items-center justify-center gap-10 max-w-3xl transition-all duration-700 ${
          isLegumeWashAgitating ? 'scale-[1.03] rotate-[0.1deg]' : ''
        }`}
      >
        {/* LEFT COLUMN: Grains Specimen Preparation Tray */}
        <div className="flex flex-col items-center bg-stone-900/60 p-6 rounded-3xl border border-stone-800/80 shadow-2xl backdrop-blur-md w-full max-w-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-blue-500/30 to-amber-500/20" />
          
          <div className="w-full justify-between flex items-center mb-4 pb-2 border-b border-stone-800">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-wider">
                {isRtl ? 'صينية عينات البقوليات' : 'GRAINS PREP TRAY'}
              </span>
              <span className="text-[8px] font-sans text-stone-500">
                {isRtl ? 'اسحب البذور وعقمها في الحوض' : 'Drag grains or click to submerge'}
              </span>
            </div>
            <span className="text-[7.5px] font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
              {washGrains.filter(g => g.isSubmerged).length} / 8 {isRtl ? 'مغمور' : 'SUBMERGED'}
            </span>
          </div>

          {/* Seeds grid deck */}
          <div className="grid grid-cols-4 gap-2 py-4 w-full relative min-h-[140px]">
            {washGrains.map((grain) => {
              if (grain.isSubmerged) {
                return (
                  <div 
                    key={grain.id}
                    className="w-16 h-16 bg-stone-950/20 border border-stone-850 rounded-xl flex items-center justify-center opacity-25 select-none"
                  >
                    <CheckCircle2 size={14} className="text-amber-500/45" />
                  </div>
                );
              }
              return (
                <motion.div
                  key={grain.id}
                  drag
                  dragConstraints={constraintsRef}
                  dragElastic={0.35}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                  onDragStart={() => setDraggingItem('wash_grains')}
                  onDragEnd={(e, info) => {
                    setDraggingItem(null);
                    if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                      submergeGrain(grain.id);
                    }
                  }}
                  onClick={() => {
                    submergeGrain(grain.id);
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    boxShadow: '0 8px 16px rgba(245,158,11,0.2)'
                  }}
                  whileDrag={{ scale: 1.25, zIndex: 50 }}
                  className="w-16 h-16 cursor-grab active:cursor-grabbing bg-stone-950 border border-stone-800 rounded-2xl flex flex-col items-center justify-center relative shadow-md group touch-none select-none"
                >
                  <div className="w-12 h-12 p-0.5">
                    {renderRealisticGrain(grain)}
                  </div>
                  
                  <div className="absolute top-1 left-1 right-1 h-0.5 bg-stone-850 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600" style={{ width: `${grain.dirtLevel}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-2 text-center text-[8.5px] text-stone-500 font-sans leading-relaxed">
            {isRtl 
              ? '* تدعم الحبوب الهز الصوتي للتخلص التام من الأتربة الخارجية.' 
              : '* Grains support ultrasonic shaking for complete external decontamination.'}
          </div>
        </div>

        {/* CENTER COLUMN: Faucet and beautiful rounded submersion wash bowl */}
        <div className="flex flex-col items-center relative w-full max-w-[340px]">
          
          {/* Chrome faucet */}
          <div className="w-full flex justify-center h-16 relative">
            <div className="absolute top-2 w-14 h-6 border-t-[8px] border-r-[8px] border-stone-400 rounded-tr-lg right-[42%] z-0" />
            <div className="absolute top-8 w-4 h-3 bg-gradient-to-r from-stone-500 to-stone-300 rounded-b left-[44%] z-10 border-b border-stone-600 shadow-md">
              <div className="absolute bottom-0 inset-x-0.5 h-0.5 bg-stone-900" />
            </div>

            {/* Tap valve knob handle */}
            <div className="absolute top-1 right-[36%] z-20 flex flex-col items-center">
              <motion.div
                animate={{ rotate: (legumeFaucetFlow / 100) * 180 }}
                onClick={toggleLegumeFaucet}
                className="w-6 h-6 rounded-full bg-gradient-to-r from-stone-300 via-stone-400 to-stone-500 border border-stone-600 cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
              >
                <div className="w-1 h-3 bg-stone-700 rounded" />
              </motion.div>
              <span className="text-[6.5px] font-mono font-black mt-1 text-stone-500 tracking-wider">
                {legumeFaucetFlow > 0 ? 'FLOW ON' : 'TURN TAP'}
              </span>
            </div>
          </div>

          {/* Submersion Bowl Liquid Tank */}
          <motion.div 
            animate={legumeBowlShaking ? {
              x: [0, -6, 6, -4, 4, 0],
              y: [0, 2, -2, 1, -1, 0]
            } : {}}
            transition={{ duration: 0.3 }}
            className={`w-80 h-52 border-4 rounded-b-[44px] relative overflow-hidden flex flex-col justify-end items-center pb-6 shadow-2xl animate-none transition-all duration-300 ${
              draggingItem === 'wash_grains'
                ? 'border-amber-400 bg-stone-900/60 scale-102 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                : 'border-stone-700/90 bg-stone-950/80'
            }`}
            style={{
              borderRadius: '8px 8px 44px 44px',
              borderColor: draggingItem === 'wash_grains' ? '#f59e0b' : '#2e2e2c',
              boxShadow: 'inset 0 0 25px rgba(0,0,0,0.9), 0 25px 50px -12px rgba(0,0,0,0.8)'
            }}
          >
            {!washGrains.some(g => g.isSubmerged) && (
              <div className={`absolute inset-x-6 inset-t-10 inset-b-6 border border-dashed rounded-b-[30px] flex flex-col items-center justify-center z-10 pointer-events-none transition-all duration-300 ${
                draggingItem === 'wash_grains'
                  ? 'border-amber-400/60 bg-amber-500/10 scale-102 animate-pulse'
                  : 'border-blue-500/20 bg-blue-500/0 animate-pulse'
              }`}>
                <Droplets size={24} className={`mb-2 transition-colors ${draggingItem === 'wash_grains' ? 'text-amber-400' : 'text-blue-500/30'}`} />
                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest text-center px-4 transition-colors ${draggingItem === 'wash_grains' ? 'text-amber-300' : 'text-blue-400/80'}`}>
                  {t('drop_zone_sonic')}
                </span>
              </div>
            )}

            {/* Falling tap water stream */}
            {legumeFaucetFlow > 5 && (
              <svg className="absolute top-0 w-8 h-full left-[43.5%] pointer-events-none z-10" viewBox="0 0 30 200">
                <defs>
                  <linearGradient id="streamGradLegume" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(186, 230, 253, 0.5)" />
                    <stop offset="35%" stopColor="rgba(255, 255, 255, 0.95)" />
                    <stop offset="70%" stopColor="rgba(147, 197, 253, 0.6)" />
                    <stop offset="100%" stopColor="rgba(56, 189, 248, 0.4)" />
                  </linearGradient>
                </defs>
                <motion.path
                  animate={{ d: [
                    "M 10 0 Q 8 50 12 100 T 10 200 L 20 200 Q 18 100 22 50 T 20 0 Z",
                    "M 12 0 Q 14 50 10 100 T 12 200 L 18 200 Q 16 100 20 50 T 18 0 Z",
                    "M 10 0 Q 8 50 12 100 T 10 200 L 20 200 Q 18 100 22 50 T 20 0 Z"
                  ]}}
                  transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                  fill="url(#streamGradLegume)"
                />
              </svg>
            )}

            {/* Water levels representation */}
            {legumeWashWaterLevel > 0 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${legumeWashWaterLevel * 0.9}%` }}
                className="absolute inset-x-0 bottom-0 bg-blue-500/15 border-t-2 border-blue-400/50 z-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(to top, rgba(14,165,233,0.2) 0%, rgba(56,189,248,0.12) 75%, rgba(186,230,253,0.35) 100%)'
                }}
              >
                {isLegumeWashAgitating && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.15),transparent)] animate-pulse" />
                )}

                <svg className="absolute top-0 inset-x-0 h-4 w-full" viewBox="0 0 300 16" preserveAspectRatio="none">
                  <motion.path
                    animate={{ d: [
                      "M 0 8 Q 75 12 150 8 T 300 8 L 300 16 L 0 16 Z",
                      "M 0 8 Q 75 4 150 8 T 300 8 L 300 16 L 0 16 Z",
                      "M 0 8 Q 75 12 150 8 T 300 8 L 300 16 L 0 16 Z"
                    ]}}
                    transition={{ repeat: Infinity, duration: isLegumeWashAgitating ? 0.35 : 1.2, ease: "easeInOut" }}
                    fill="rgba(147, 197, 253, 0.4)"
                  />
                </svg>
              </motion.div>
            )}

            {/* Particles rendering */}
            {legumeBowlParticles.map((ptcl) => (
              <div
                key={ptcl.id}
                className="absolute rounded-full pointer-events-none z-10"
                style={{
                  left: `${ptcl.x}px`,
                  top: `${ptcl.y}px`,
                  width: `${ptcl.size}px`,
                  height: `${ptcl.size}px`,
                  background: ptcl.color,
                  opacity: ptcl.alpha,
                  boxShadow: ptcl.type === 'bubble' ? '0 0 4px rgba(255,255,255,0.4)' : 'none',
                }}
              />
            ))}

            {/* Submerged active grains inside basin */}
            <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
              {washGrains.map((g) => {
                if (!g.isSubmerged) return null;
                return (
                  <motion.div
                    key={g.id}
                    animate={isLegumeWashAgitating ? {
                      x: g.x,
                      y: g.y,
                      rotate: g.rotation,
                      scale: 1.15
                    } : {
                      x: g.x,
                      y: g.y,
                      rotate: g.rotation,
                      scale: 1.0
                    }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="absolute w-12 h-12"
                    style={{
                      left: '42%',
                      top: '25%',
                      transformOrigin: 'center center'
                    }}
                  >
                    {renderRealisticGrain(g)}
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none z-20" />
          </motion.div>

          {/* Action trigger button */}
          <div className="w-80 mt-4 text-center">
            {washGrains.some(g => g.isSubmerged) && !isLegumeWashDone ? (
              <div className="space-y-3">
                {legumeWashWaterLevel < 40 ? (
                  <div className="bg-blue-950/40 p-2.5 rounded-xl border border-blue-500/25 text-[9px] font-mono text-blue-300 animate-pulse">
                    {t('turn_faucet_ultrasonic')}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={runLegumeWashAgitation}
                    disabled={isLegumeWashAgitating}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs uppercase rounded-xl tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 border-b-2 border-amber-700 active:scale-98"
                  >
                    {isLegumeWashAgitating ? (
                      <>
                        <RotateCw size={14} className="animate-spin text-black" />
                        <span>{t('sonic_decontaminating', { progress: legumeWashProgress })}</span>
                      </>
                    ) : (
                      <span>{t('start_ultrasonic_wash')}</span>
                    )}
                  </button>
                )}
              </div>
            ) : isLegumeWashDone ? (
              <div className="bg-amber-950/50 p-3 rounded-xl border border-amber-500/20 text-center text-xs font-mono text-amber-500 flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 size={15} />
                <span>{t('cells_sterilized')}</span>
              </div>
            ) : (
              <div className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mt-2">
                {t('awaiting_specimen_loading')}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  };

  const renderLegumeStep3 = () => {
    // Dynamic color calculations for realistic clean water to orange legume slurry transition
    const pBlend = isMillingDone ? 1 : (isMilling ? millingProgress / 100 : 0);
    
    // Bottom color: interpolate from deep translucent sky-blue to semi-opaque rich orange
    const rBottom = Math.floor(14 * (1 - pBlend) + 224 * pBlend);
    const gBottom = Math.floor(165 * (1 - pBlend) + 100 * pBlend);
    const bBottom = Math.floor(233 * (1 - pBlend) + 8 * pBlend);
    const aBottom = 0.35 * (1 - pBlend) + 0.95 * pBlend;

    // Top color: interpolate from light transparent sky-blue to warm bright orange
    const rTop = Math.floor(56 * (1 - pBlend) + 249 * pBlend);
    const gTop = Math.floor(189 * (1 - pBlend) + 150 * pBlend);
    const bTop = Math.floor(248 * (1 - pBlend) + 24 * pBlend);
    const aTop = 0.12 * (1 - pBlend) + 0.85 * pBlend;

    const liquidBackground = `linear-gradient(to top, rgba(${rBottom}, ${gBottom}, ${bBottom}, ${aBottom}) 0%, rgba(${rTop}, ${gTop}, ${bTop}, ${aTop}) 100%)`;
    const waveFillColor = `rgba(${rTop}, ${gTop}, ${bTop}, ${aTop * 0.75})`;

    return (
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl">
        
        {/* Interaction items shelf on left - Draggables List (Amber/Blue Styled) */}
        <div className="flex md:flex-col gap-4 relative z-20">
          
          {/* Grains Specimen Card */}
          {!isBeanInMilling ? (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.4}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
              onDragStart={() => setDraggingItem('blend_grains')}
              onDragEnd={(e, info) => {
                setDraggingItem(null);
                if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                  setIsBeanInMilling(true);
                  playSynthBeep(330, 'triangle', 0.15);
                }
              }}
              onClick={() => {
                setIsBeanInMilling(true);
                playSynthBeep(330, 'triangle', 0.15);
              }}
              whileHover={{ scale: 1.08, translateY: -2 }}
              className="cursor-grab active:cursor-grabbing bg-stone-900 border border-amber-500/40 rounded-xl p-3 flex flex-col items-center justify-center w-28 h-28 shadow-xl text-center group transition-all hover:bg-stone-850 touch-none select-none"
            >
              <div className="relative p-2 bg-amber-950/40 rounded-lg mb-1 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🫘</span>
              </div>
              <span className="text-[9px] font-mono text-amber-500 font-extrabold tracking-wider">{t('clean_grains')}</span>
              <span className="text-[7px] text-stone-500 font-sans mt-0.5">{t('drag_or_tap')}</span>
            </motion.div>
          ) : (
            <div className="w-28 h-28 bg-stone-950/20 border border-stone-900 rounded-xl flex flex-col items-center justify-center opacity-40 text-center select-none">
              <CheckCircle2 size={18} className="text-amber-500 mb-1" />
              <span className="text-[8px] font-mono text-zinc-550 uppercase font-bold">{t('loaded')}</span>
            </div>
          )}

          {/* Pure H2O Solvent Card */}
          {!isWaterInMilling && !isWaterPouringLegume ? (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.4}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
              onDragStart={() => setDraggingItem('blend_grains_solv')}
              onDragEnd={(e, info) => {
                setDraggingItem(null);
                if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                  triggerWaterPourLegume();
                }
              }}
              onClick={() => {
                triggerWaterPourLegume();
              }}
              whileHover={{ scale: 1.08, translateY: -2 }}
              className="cursor-grab active:cursor-grabbing bg-stone-900 border border-sky-400/40 rounded-xl p-3 flex flex-col items-center justify-center w-28 h-28 shadow-xl text-center group transition-all hover:bg-stone-850 touch-none select-none"
            >
              <div className="relative p-2 bg-sky-950/30 rounded-lg mb-1 group-hover:scale-110 transition-transform">
                <Droplets size={24} className="text-sky-400 animate-pulse" />
              </div>
              <span className="text-[9px] font-mono text-sky-400 font-extrabold tracking-wider">{t('pure_h2o')}</span>
              <span className="text-[7px] text-stone-500 font-sans mt-0.5">{t('drag_or_tap')}</span>
            </motion.div>
          ) : (
            <div className="w-28 h-28 bg-stone-950/20 border border-stone-900 rounded-xl flex flex-col items-center justify-center opacity-40 text-center select-none">
              <CheckCircle2 size={18} className="text-sky-400 mb-1" />
              <span className="text-[8px] font-mono text-zinc-550 uppercase font-bold">
                {isWaterPouringLegume ? t('pouring') : t('h2o_poured')}
              </span>
            </div>
          )}

        </div>

        {/* Realistic High-Speed Laboratory Blender Assembly */}
        <div className="flex flex-col items-center relative z-10">
          
          <div className="relative flex flex-col items-center select-none">
            
            {/* Glass Jar Pitcher */}
            <div className={`w-48 h-56 bg-gradient-to-b from-sky-400/10 via-sky-500/5 to-amber-500/10 border-2 rounded-b-xl rounded-t-[20px] relative overflow-hidden flex flex-col justify-end items-center pb-8 shadow-[inset_0_0_30px_rgba(245,158,11,0.1),0_15px_30px_rgba(0,0,0,0.5)] z-10 transition-all duration-300 ${
              draggingItem === 'blend_grains' || draggingItem === 'blend_grains_solv'
                ? 'border-amber-400 bg-amber-950/20 scale-102 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                : 'border-stone-400/60'
            }`}>
              
              {/* Measurement graduation markings */}
              <div className="absolute left-3.5 top-8 flex flex-col gap-4 font-mono text-[7px] text-sky-400/60 font-semibold select-none">
                <span>— 600m L</span>
                <span>— 400m L</span>
                <span>— 200m L</span>
              </div>

              {/* Molded Glass Pitcher side-handle */}
              <div className="absolute right-0 top-12 w-5 h-28 border-4 border-l-0 border-stone-400/50 rounded-r-2xl bg-stone-900/40 -mr-[4px] shadow-sm flex items-center justify-center" />

              {/* Active Drag-and-drop targets / empty indicator */}
              {(!isBeanInMilling || !isWaterInMilling) && !isWaterPouringLegume && (
                <div className={`absolute inset-4 m-1.5 border-2 border-dashed rounded-b-lg rounded-t-xl flex flex-col items-center justify-center z-20 text-center px-4 transition-all duration-300 ${
                  draggingItem === 'blend_grains' || draggingItem === 'blend_grains_solv'
                    ? 'border-amber-400 bg-amber-950/25 scale-101 shadow-[0_0_15px_rgba(245,158,11,0.45)] animate-pulse'
                    : 'border-amber-500/30 bg-amber-950/5 animate-pulse'
                }`}>
                  <span className="text-[10px] font-mono text-amber-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <RotateCw size={11} className="animate-spin text-amber-400" />
                    {t('chamber_standby')}
                  </span>
                  <div className="text-[7.5px] font-mono text-stone-450 mt-2 flex flex-col gap-0.5">
                    <span>[{isBeanInMilling ? '🫘 OK' : t('grains_missing')}]</span>
                    <span>[{isWaterInMilling ? '💧 OK' : t('water_missing')}]</span>
                  </div>
                </div>
              )}

              {/* Dynamic Water Pouring Stream (Legume Blender) */}
              {isWaterPouringLegume && (
                <div className="absolute inset-0 z-30 pointer-events-none select-none overflow-hidden">
                  {/* Dense linear fluid column */}
                  <motion.div
                    initial={{ y: -100, height: 0 }}
                    animate={{ y: 0, height: '100%' }}
                    transition={{ duration: 0.4, ease: 'easeIn' }}
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-2.5 bg-gradient-to-r from-sky-400/80 via-blue-200/90 to-sky-500/80 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                  />
                  {/* Vapor spray mist particles */}
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.3, 1.2, 0.3],
                        x: [0, (Math.random() - 0.5) * 30],
                        y: [160, 160 + (Math.random() - 0.5) * 20]
                      }}
                      transition={{ repeat: Infinity, duration: 0.25, delay: i * 0.04 }}
                      className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-200"
                    />
                  ))}
                </div>
              )}

              {/* Individual Legume Grains Spawning Layer */}
              {blenderGrains.length > 0 && (
                <div className="absolute inset-x-0 bottom-4 h-48 z-15 pointer-events-none">
                  {blenderGrains.map(grain => (
                    <div
                      key={grain.id}
                      style={{
                        left: `${grain.x}px`,
                        top: `${grain.y}px`,
                        transform: `rotate(${grain.rotate}deg) scale(${grain.scale})`,
                        opacity: isMillingDone ? 0 : Math.max(0, 1 - (isMilling ? millingProgress / 100 : 0)),
                        position: 'absolute',
                        transformOrigin: '50% 50%',
                        transition: 'opacity 0.15s ease',
                        width: selectedLegumeId === 'fava' ? '25px' : (selectedLegumeId === 'lupin' ? '18px' : (selectedLegumeId === 'lentil' ? '7.5px' : (selectedLegumeId === 'chickpea' ? '14px' : '11px'))),
                        height: selectedLegumeId === 'fava' ? '19px' : (selectedLegumeId === 'lupin' ? '15px' : (selectedLegumeId === 'lentil' ? '6.2px' : (selectedLegumeId === 'chickpea' ? '12px' : '11px'))),
                      }}
                    >
                      <svg className="w-full h-full select-none overflow-visible" viewBox="0 0 100 100" fill="none">
                        {renderSingleSeedContent(selectedLegumeId, 1.0, 0.0, `blend-grain-${grain.id}`, 1.0)}
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* Submerged Grains / Fluid simulation layers */}
              {waterVolumeLegume > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${waterVolumeLegume}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="absolute inset-x-0 bottom-0 z-10 overflow-hidden flex items-center justify-center border-t"
                  style={{
                    background: liquidBackground,
                    opacity: 0.92,
                    borderTopColor: `rgba(${rTop}, ${gTop}, ${bTop}, 0.35)`,
                  }}
                >
                  {isMilling ? (
                    /* High-rpm swirling vortex fluid effect */
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      
                      {/* Swirling Vortex Curves */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: Math.max(0.08, 0.4 - (millingProgress * 0.0035)), ease: 'linear' }}
                        className="absolute inset-[4px] border-4 border-dashed border-amber-100/40 rounded-full opacity-60 filter blur-[0.5px]"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: Math.max(0.12, 0.6 - (millingProgress * 0.0045)), ease: 'linear' }}
                        className="absolute inset-[24px] border-2 border-double border-amber-300/36 rounded-full opacity-70"
                      />

                      {/* Rupturing seed dry cell microparticles */}
                      <div className="absolute inset-0 flex flex-wrap gap-2 items-center justify-around p-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((it) => (
                          <motion.div
                            key={it}
                            animate={{ 
                              y: [160, -20],
                              x: [Math.random() * 50 - 25, Math.random() * 50 - 25],
                              scale: [0.3, 1.6, 0.34],
                              opacity: [0, 1 * (1 - (millingProgress / 110)), 0]
                            }}
                            transition={{ repeat: Infinity, duration: 0.2 + it * 0.04 }}
                            className="w-2.5 h-2.5 rounded-full bg-amber-100/60 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                          />
                        ))}
                      </div>

                      <div className="z-20 bg-black/85 px-2.5 py-1 rounded-md border border-amber-500/30 text-center select-none">
                        <span className="text-[7.5px] font-mono font-black tracking-widest text-[#FF3D00] uppercase block animate-pulse">
                          {t('rupturing_coat_cells')}
                        </span>
                        <span className="text-[6.5px] font-mono text-zinc-400 font-bold">12,500 RPM</span>
                      </div>
                    </div>
                  ) : (
                    /* Static waves & ripples surface movement */
                    <div className="absolute inset-[2px] flex flex-col justify-end p-2 md:p-3 overflow-hidden">
                      <svg className="w-full h-4 absolute top-0 inset-x-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <motion.path
                          style={{ fill: waveFillColor }}
                          animate={{ d: [
                            'M0 10 Q25 5, 50 10 T100 10 L100 20 L0 20 Z',
                            'M0 10 Q25 15, 50 10 T100 10 L100 20 L0 20 Z',
                            'M0 10 Q25 5, 50 10 T100 10 L100 20 L0 20 Z'
                          ]}}
                          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Heavy Steel Rotor & Spline shaft Assembly */}
              <motion.div
                animate={isMilling ? { rotate: 1440 } : {}}
                transition={{ repeat: Infinity, duration: 0.08, ease: 'linear' }}
                className="absolute bottom-3 w-28 h-4 flex items-center justify-center z-20"
              >
                {/* Left sharp blade lobe */}
                <div className="w-12 h-1.5 bg-gradient-to-r from-stone-400 to-stone-200 rounded-l skew-y-3 shadow-md" />
                {/* Core spindle nut */}
                <div className="w-4 h-4 bg-stone-700 rounded-full border border-stone-500 shadow-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-stone-350 rounded-full" />
                </div>
                {/* Right sharp blade lobe */}
                <div className="w-12 h-1.5 bg-gradient-to-r from-stone-200 to-stone-400 rounded-r -skew-y-3 shadow-md" />
              </motion.div>

              {/* Rubber sealing jar connector base coupling */}
              <div className="absolute bottom-0 inset-x-0 h-4 bg-stone-800 border-t border-stone-750" />
            </div>

            {/* Rubber pitcher lid with translucent plug cap */}
            <div className="absolute top-0 transform -translate-y-[15px] z-20 flex flex-col items-center select-none">
              <div className="w-14 h-4 bg-stone-700/90 rounded-t-md border-t border-stone-500 shadow-inner flex items-center justify-center" />
              <div className="w-44 h-4 bg-gradient-to-r from-stone-850 to-stone-900 rounded-md border-b-2 border-stone-950 shadow-md" />
            </div>

            {/* Heavy Stainless Steel Motor Pedestal base */}
            <div className="w-56 h-28 bg-gradient-to-b from-stone-400 via-stone-300 to-stone-500 rounded-t-lg rounded-b-2xl border-x-4 border-b-4 border-stone-500 shadow-2xl relative p-3 flex flex-col justify-between z-0">
              
              {/* Air vent grill slits */}
              <div className="flex gap-1.5 justify-center py-0.5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-1 h-3 bg-stone-800 rounded-sm" />
                ))}
              </div>

              {/* Integrated Control Panel Dashboard */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-inner">
                
                {/* Retro LED Status Screen */}
                <div className="bg-black/90 p-1.5 rounded border border-amber-500/20 font-mono text-[7px] text-amber-500 flex-1 flex flex-col gap-0.5 min-w-[76px] h-10 justify-center">
                  {legumeBlenderError ? (
                    <div className="text-red-500 font-extrabold text-[8px] animate-pulse">
                      {legumeBlenderError}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-stone-500 font-bold">
                        <span>VORTEX v1.2</span>
                        <span className={isMilling ? 'text-amber-500 animate-pulse' : 'text-amber-500'}>●</span>
                      </div>
                      <div className="text-[8.5px] font-black tracking-widest text-[#FFB300] overflow-hidden">
                        {isMilling ? `RPM: 12.5K [${millingProgress}%]` : isMillingDone ? t('ready').toUpperCase() : t('standby').toUpperCase()}
                      </div>
                    </>
                  )}
                </div>

                {/* Tactile Heavy-Duty Red POWER Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={runLegumeMillingPower}
                    disabled={isMilling || isMillingDone}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-stone-800 flex-shrink-0 transition-all ${
                      isMilling
                        ? 'bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse cursor-not-allowed border-red-400'
                        : isMillingDone
                        ? 'bg-red-900 border-red-950 opacity-50 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 shadow-md active:bg-red-700 cursor-pointer border-red-500'
                    }`}
                    style={{
                      boxShadow: isMilling ? '0 0 15px rgba(239, 68, 68, 0.7)' : 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 6px rgba(0,0,0,0.4)',
                    }}
                  >
                    <span className="text-[8px] font-black tracking-tighter text-white uppercase select-none">PWR</span>
                  </button>
                </div>

                {/* Tactile Rotary Jog Speed Knob */}
                <div className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={isMilling ? { rotate: [0, 90, 180, 270, 360] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="w-8 h-8 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 border border-stone-600 rounded-full flex items-center justify-center shadow-md relative"
                  >
                    {/* Dial notch */}
                    <div className="w-1 h-2.5 bg-[#FFB300] rounded-full absolute top-[2px]" />
                  </motion.div>
                </div>
              </div>

              {/* Base heavy-duty rubber feet */}
              <div className="absolute inset-x-8 -bottom-[10px] h-2.5 flex justify-between z-0 pointer-events-none select-none">
                <div className="w-5 h-2.5 bg-stone-900 rounded-b" />
                <div className="w-5 h-2.5 bg-stone-900 rounded-b" />
              </div>
            </div>
          </div>

          {/* Simulation trigger controls */}
          <div className="w-72 mt-5">
            {isMilling ? (
              <div className="bg-stone-950/80 p-3 rounded-xl border border-amber-500/30 text-center text-xs font-mono text-zinc-300 flex flex-col gap-2 shadow-md">
                <div className="flex justify-between items-center text-[10px] text-amber-500 font-extrabold uppercase tracking-widest">
                  <span>{t('milling_status', { progress: millingProgress })}</span>
                  <RotateCw size={12} className="animate-spin" />
                </div>
                <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-1.5 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${millingProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            ) : isMillingDone ? (
              <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 text-center text-xs font-mono text-amber-500 flex items-center justify-center gap-2 animate-bounce shadow-md">
                <CheckCircle2 size={15} />
                <span>{t('legume_globulins_liberated')}</span>
              </div>
            ) : (
              <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80 text-center text-[10px] font-mono text-stone-400 flex flex-col gap-1 items-center justify-center shadow-md">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-amber-500 mb-1">
                  <span>● STATUS: STANDBY</span>
                </div>
                <span>{t('legume_load_instruction')}</span>
                <span>{t('pwr_button_start')}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    );
  };

  const renderLegumeStep4 = () => {
    const isIsoTarget = slurryPh <= activeLegume.isoelectricPh;
    const reactionProgress = Math.max(0, Math.min(1, (6.8 - slurryPh) / (6.8 - activeLegume.isoelectricPh)));
    
    // Stable particle coordinates to avoid re-render flicker
    const particles4 = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: 42 + (i * 53 % 116), // scattered X safely inside flask belly
      y: 110 + (i * 31 % 80),  // scattered Y
      size: 1.5 + (i % 3) * 0.75,
      speed: 0.8 + (i % 3) * 0.3,
      delay: i * 0.05
    }));

    return (
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl animate-fade-in py-4">
        
        {/* LEFT COLUMN: Premium Squeezable Lemon Dock */}
        <div className="flex flex-col bg-stone-900/60 p-6 rounded-3xl border border-stone-800 shadow-xl w-full max-w-xs items-center gap-5 justify-between min-h-[300px] relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500/20 via-amber-500/80 to-amber-500/20" />
          
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest border-b border-stone-800 pb-2 w-full text-left font-black flex items-center justify-between">
              <span>{t('isoelectric_acid_reagent')}</span>
              <span className="text-[8px] bg-amber-950/60 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-sans tracking-normal">
                {isRtl ? 'حمض طبيعي' : 'NATURAL ACID'}
              </span>
            </span>
            <span className="text-[8.5px] font-sans text-stone-500 leading-normal mt-1 block">
              {isRtl 
                ? 'الحموضة تخفض درجة الـ pH إلى نقطة التعادل الكهربائي لترسيب البروتين والنشا.' 
                : 'Acidity lowers slurry pH to the isoelectric point, initiating structural precipitation.'}
            </span>
          </div>

          {/* Interactive Drag & Squeeze Docking Area */}
          <div className="relative w-36 h-36 border border-stone-800 bg-stone-950/40 rounded-full flex items-center justify-center shadow-inner group">
            
            {/* Pulsing Target Halo */}
            {!isIsoTarget && (
              <div className="absolute inset-2 border-2 border-dashed border-amber-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
            )}
            
            {/* Dock Empty Hologram */}
            {draggingItem === 'lemon' && (
              <div className="absolute flex flex-col items-center gap-1 opacity-50">
                <span className="w-12 h-12 rounded-full border border-dashed border-amber-500/40 bg-amber-500/5 animate-pulse" />
                <span className="text-[7.5px] text-amber-500/60 font-mono tracking-widest text-center uppercase">
                  {isRtl ? 'موقع العصر' : 'DOCK AREA'}
                </span>
              </div>
            )}

            {/* Draggable & squeezable Lemon */}
            <motion.div
              drag={!isIsoTarget && !isSqueezing}
              dragConstraints={constraintsRef}
              dragElastic={0.45}
              onDragStart={() => setDraggingItem('lemon')}
              onDragEnd={(e, info) => {
                setDraggingItem(null);
                // Trigger squeeze if dragged far enough or dropped over right side
                if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                  squeezeLemonDrop();
                }
              }}
              onClick={squeezeLemonDrop}
              whileHover={{ scale: isIsoTarget ? 1 : 1.15, rotate: -8 }}
              whileDrag={{ scale: 1.22, rotate: 15 }}
              animate={{ 
                scaleX: isSqueezing ? 1.3 : 1, 
                scaleY: isSqueezing ? 0.7 : 1,
                y: isSqueezing ? 10 : 0
              }}
              className={`w-24 h-24 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center z-30 transition-shadow select-none relative touch-none ${
                isIsoTarget ? 'opacity-25 cursor-not-allowed filter grayscale' : 'hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.45)]'
              }`}
            >
              {/* High precision vector lemon */}
              <svg className="w-full h-full select-none filters-layer" viewBox="0 0 100 100" fill="none">
                <defs>
                  <radialGradient id="lemonPeel" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="70%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#eab308" />
                  </radialGradient>
                </defs>
                {/* Lemon Leaf */}
                <path d="M50 15 C45 2 28 8 28 8 C28 8 32 20 50 15 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
                <path d="M50 15 C55 2 72 8 72 8 C72 8 68 20 50 15 Z" fill="#166534" stroke="#14532d" strokeWidth="1" />
                <line x1="50" y1="15" x2="50" y2="5" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Outer Peel */}
                <ellipse cx="50" cy="55" rx="42" ry="32" fill="url(#lemonPeel)" stroke="#d97706" strokeWidth="2" />
                {/* Inner segments background */}
                <ellipse cx="50" cy="55" rx="36" ry="26" fill="#fef08a" />
                {/* Segments Divider Lines */}
                <path d="M50 29 L50 81 M14 55 L86 55 M24 37 Q50 55 76 73 M24 73 Q50 55 76 37" stroke="#fbbf24" strokeWidth="1.5" />
                {/* Central Core pulp cover */}
                <circle cx="50" cy="55" r="5" fill="#fef08a" />
                <circle cx="50" cy="55" r="2.5" fill="white" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <span className="font-mono text-[7px] text-zinc-950 font-black bg-amber-400 px-1.5 py-0.5 rounded shadow">
                  {t('squeeze_action')}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <button
              onClick={squeezeLemonDrop}
              disabled={isIsoTarget || isSqueezing}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-[10px] uppercase rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Droplets size={13} className="animate-bounce" />
              {t('squeeze_lemon')}
            </button>
            <div className="w-full bg-stone-950 rounded-lg p-1.5 border border-stone-850 flex items-center justify-between text-[8px] font-mono">
              <span className="text-stone-500">{isRtl ? 'المعدل المستهدف:' : 'TARGET POINT:'}</span>
              <span className="text-amber-500 font-bold">pH {activeLegume.isoelectricPh}</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Ultra Premium Laboratory Borosilicate Glass Flask */}
        <div className="flex flex-col items-center relative">
          
          {/* Flask Drag Hover Bounding box */}
          <div className={`absolute -inset-6 border-2 border-dashed rounded-[32px] transition-all duration-300 pointer-events-none z-0 ${
            draggingItem === 'lemon' && !isIsoTarget
              ? 'border-amber-400/80 bg-amber-500/[0.04] scale-105 shadow-[0_0_40px_rgba(245,158,11,0.15)]'
              : 'border-transparent'
          }`} />

          {/* Holographic Squeeze Marker */}
          {draggingItem === 'lemon' && !isIsoTarget && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[8px] font-black font-mono tracking-widest px-3 py-1 rounded-full shadow-lg border border-amber-400 uppercase z-40 flex items-center gap-1 leading-none whitespace-nowrap"
            >
              <Sparkles size={10} className="animate-spin" />
              {isRtl ? 'أفلت الليمون هنا للعصر والترسيب' : 'DROP HERE TO RELEASE ACCIDENTS'}
            </motion.div>
          )}

          {/* High Fidelity 3D glass SVG block */}
          <div className="w-68 h-80 relative flex flex-col justify-end items-center z-10">
            <svg 
              className="w-full h-full select-none overflow-visible absolute inset-0 z-20 pointer-events-none" 
              viewBox="0 0 200 250" 
              fill="none"
            >
              <defs>
                {/* Clip path matching custom flask contours */}
                <clipPath id="flaskClip4">
                  <path d="M 82 35 L 118 35 L 118 75 L 172 206 C 175 212 165 215 150 215 L 50 215 C 35 215 25 212 28 206 L 82 75 Z" />
                </clipPath>
                
                {/* Liquid gradients */}
                <linearGradient id="liquidSlurryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                
                <linearGradient id="liquidSupernatantGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251, 191, 36, 0.4)" />
                  <stop offset="100%" stopColor="rgba(217, 119, 6, 0.2)" />
                </linearGradient>

                <linearGradient id="glassReflectGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                  <stop offset="15%" stopColor="white" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="white" stopOpacity="0" />
                  <stop offset="85%" stopColor="white" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* 1. CLIPPED LIQUID LAYERS (Swirling inside flask) */}
              <g clipPath="url(#flaskClip4)">
                {/* Background base liquid structure (Changes state as separation occurs) */}
                <rect x="10" y="20" width="180" height="210" fill="#292524" /> {/* Empty dark backdrop inside glass */}

                {/* Base Slurry (decreases in opacity & volume as separation proceeds) */}
                <motion.rect 
                  x="10" 
                  y="100" 
                  width="180" 
                  height="120" 
                  fill="url(#liquidSlurryGrad)" 
                  style={{ opacity: 1 - reactionProgress * 0.72 }}
                  className="transition-all duration-700" 
                />

                {/* Clear supernatant whey layer (increases from nothing to clear golden fluid) */}
                {reactionProgress > 0.05 && (
                  <motion.rect 
                    x="10" 
                    y="100" 
                    width="180" 
                    height="120" 
                    fill="url(#liquidSupernatantGrad)" 
                    style={{ opacity: reactionProgress * 0.9 }}
                    className="transition-all duration-700" 
                  />
                )}

                {/* 2. GRADUAL SEDIMENT FORMATION (Starch / protein curd sliding to bottom) */}
                {reactionProgress > 0.1 && (
                  <motion.path
                    d={`M 25 215 C 35 215 165 215 175 215 L 175 215 C 145 215 55 215 25 215 Z`}
                    fill="#f4f4f5"
                    stroke="#e4e4e7"
                    strokeWidth={0.5}
                    animate={{ 
                      d: `M 25 215 C 35 215 165 215 175 215 L ${175 - reactionProgress * 4} ${215 - reactionProgress * 23} C 140 ${211 - reactionProgress * 23} 60 ${211 - reactionProgress * 23} ${25 + reactionProgress * 4} ${215 - reactionProgress * 23} Z` 
                    }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    className="shadow-md"
                  />
                )}

                {/* 3. SETTLING PARTICLES ANIMATION */}
                {reactionProgress > 0.1 && particles4.map((p) => {
                  // Sinking animation: particles sink towards bottom coordinate based on progress
                  const startY = p.y;
                  const finalY = 212 - (reactionProgress * 18);
                  const deltaY = finalY - startY;
                  const curY = startY + (deltaY * reactionProgress);

                  return (
                    <motion.circle
                      key={p.id}
                      cx={p.x}
                      cy={curY}
                      r={p.size}
                      fill="#fafafa"
                      opacity={reactionProgress * 0.85 * (1 - reactionProgress * 0.7)}
                      animate={{ 
                        x: [p.x, p.x + Math.sin(p.id) * 3, p.x],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: p.speed * 2, 
                        delay: p.delay 
                      }}
                    />
                  );
                })}

                {/* Liquid surface wave meniscus */}
                <ellipse cx="100" cy="105" rx="34" ry="4" stroke="#fbbf24" strokeWidth="1" fill="#f59e0b" fillOpacity={((1 - reactionProgress * 0.6) * 0.5)} />
              </g>

              {/* 2. CHROME LAB GRADUATIONS (Volumetric marking on outside glass) */}
              <g stroke="white" strokeOpacity="0.25" strokeWidth="1">
                <line x1="126" y1="120" x2="134" y2="120" />
                <line x1="130" y1="135" x2="134" y2="135" />
                <line x1="126" y1="150" x2="134" y2="150" />
                <line x1="130" y1="165" x2="134" y2="165" />
                <line x1="126" y1="180" x2="134" y2="180" />
                <line x1="130" y1="195" x2="134" y2="195" />
              </g>
              <g fill="white" fillOpacity="0.32" className="font-mono text-[6.5px]">
                <text x="138" y="122">300 ml</text>
                <text x="138" y="152">200 ml</text>
                <text x="138" y="182">100 ml</text>
              </g>

              {/* 3. GLASS OUTLINE, LIP & REFLECTIVE SHINE */}
              {/* Outer thick glass wall */}
              <path 
                d="M 82 35 L 118 35 L 118 75 L 172 206 C 176 213 165 216 150 216 L 50 216 C 35 216 24 213 28 206 L 82 75 Z" 
                stroke="#faf9f6" 
                strokeWidth="3.5" 
                strokeOpacity="0.22" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Inside reflection gradient */}
              <path 
                d="M 82 35 L 118 35 L 118 75 L 172 206 C 176 213 165 216 150 216 L 50 216 C 35 216 24 213 28 206 L 82 75 Z" 
                fill="url(#glassReflectGrad)" 
                pointerEvents="none"
              />

              {/* High intensity vertical shine left */}
              <path 
                d="M 85 45 Q 85 75 42 185" 
                stroke="white" 
                strokeWidth="2" 
                strokeOpacity="0.25" 
                strokeLinecap="round"
              />
              {/* High intensity shine right */}
              <path 
                d="M 115 45 Q 115 75 158 185" 
                stroke="white" 
                strokeWidth="1" 
                strokeOpacity="0.1" 
                strokeLinecap="round"
              />

              {/* Flask Top Lip Oval */}
              <ellipse cx="100" cy="35" rx="18" ry="3.5" stroke="white" strokeWidth="2" strokeOpacity="0.35" />

              {/* 4. IMMERSED pH ELECTRODE PROBE */}
              <line x1="100" y1="12" x2="100" y2="128" stroke="#1c1917" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="100" y1="12" x2="100" y2="128" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
              {/* Glowing glass bulb at end of probe */}
              <circle cx="100" cy="130" r="4.5" fill="#38bdf8" fillOpacity="0.8" stroke="#e0f2fe" strokeWidth="1" className="animate-pulse" />
              {/* Wire hook at top */}
              <path d="M 100 12 Q 100 0 115 -5" stroke="#292524" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Simulated interactive fluid drops Falling down when squeezed */}
            {isSqueezing && (
              <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden rounded-b-3xl">
                {[
                  { id: 1, left: '50%', delay: 0 },
                  { id: 2, left: '49%', delay: 0.12 },
                  { id: 3, left: '51%', delay: 0.25 }
                ].map((drop) => (
                  <motion.div
                    key={drop.id}
                    initial={{ y: 35, opacity: 1, scale: 1 }}
                    animate={{ y: 110, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.4, delay: drop.delay, ease: 'easeIn' }}
                    style={{ left: drop.left }}
                    className="absolute -translate-x-1/2 w-3 h-5 text-yellow-300 fill-current flex items-center justify-center pointer-events-none"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400 fill-current">
                      <path d="M50 0 C50 0 15 55 15 78 A 35 35 0 0 0 85 78 C 85 55 50 0 50 0 Z" />
                    </svg>
                  </motion.div>
                ))}
                
                {/* Surface Splash ripple where droplet hits Y=105 */}
                <motion.div
                  initial={{ scale: 0.1, opacity: 1 }}
                  animate={{ scale: [0.1, 2.2], opacity: [0.9, 0] }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="absolute top-[103px] left-1/2 -translate-x-1/2 w-14 h-3 rounded-full border-2 border-yellow-300/80 bg-yellow-400/20 pointer-events-none"
                />
              </div>
            )}
            
            {/* Laboratory Stand platform beneath flask */}
            <div className="w-48 h-3.5 bg-gradient-to-r from-stone-800 to-stone-900 border-x border-t border-stone-700/60 rounded-t-lg shadow" />
          </div>

          {/* LCD pH Meter Panel mounted physically on stand */}
          <div className="absolute right-[-10px] top-12 w-16 h-36 bg-stone-900 border-2 border-stone-850 rounded-2xl shadow-2xl p-2 flex flex-col justify-between items-center z-30">
            <span className="text-[6px] font-mono text-stone-500 tracking-wider font-extrabold uppercase line-clamp-1">{isRtl ? 'حساس الـ pH' : 'ELE-METER'}</span>
            <div className="w-full bg-stone-950 border border-stone-800 py-1.5 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#00E676]/[0.02] filter blur animate-pulse" />
              <span className="font-mono text-[11px] font-black text-[#00E676] tracking-widest animate-pulse z-10">
                {slurryPh.toFixed(2)}
              </span>
            </div>
            <div className="w-full space-y-1.5">
              <div className="h-1 w-full bg-stone-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(slurryPh / 14) * 100}%` }} />
              </div>
              <span className="text-[5.5px] font-mono text-stone-400 block text-center">
                {isIsoTarget ? (isRtl ? 'تعادل مكتمل!' : 'ISO đạt!') : (isRtl ? 'حموضة غير متعادلة' : 'PRECIPITATING')}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Separation Analysis & Success badge */}
        <div className="flex flex-col bg-stone-905 p-5 rounded-3xl border border-stone-800/80 shadow-2xl backdrop-blur-md w-full max-w-xs relative items-center justify-center text-center gap-4">
          <span className="text-[9px] text-stone-400 uppercase font-bold tracking-widest block border-b border-stone-800/80 pb-2 mb-1 w-full text-left font-sans flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            {isRtl ? 'المجهر الرقمي للتحليل التلقائي' : 'REAL-TIME ANALYZER'}
          </span>

          <div className="w-full space-y-3.5 text-xs font-mono text-stone-300">
            {/* Acidity progress indicator */}
            <div className="flex flex-col gap-1 text-[9.5px] bg-stone-950 p-3 rounded-xl border border-stone-850 text-left">
              <span className="text-stone-500 uppercase text-[8px] block tracking-wide">
                {isRtl ? 'درجة تماسك كتلة الترسب:' : 'COAGULATED PHASE MASS:'}
              </span>
              <div className="flex justify-between font-bold mt-0.5">
                <span className="text-stone-300">{isRtl ? 'معدل التبلور السطحي' : 'Precipitation Ratio'}</span>
                <span className="text-amber-400 font-extrabold font-black">{(reactionProgress * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${reactionProgress * 100}%` }} />
              </div>
            </div>

            {/* Description card change dynamically */}
            <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-850/60 text-left text-[9px] leading-relaxed text-stone-400 space-y-1.5">
              <div className="font-bold text-stone-300 uppercase flex items-center gap-1 text-[9.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                {isRtl ? 'تحليل المجهر الحالي:' : 'MICROSCOPY SPEC SHEET:'}
              </div>
              <p>
                {reactionProgress === 0 && (isRtl ? 'سائل حليبي متجانس. لم تبدأ عملية عزل النشا بعد، درجة حموضة مستقرة.' : 'Slurry is fully emulsified and milky. No precipitation has initiated yet.')}
                {reactionProgress > 0 && reactionProgress < 1 && (isRtl ? 'بدء تفكك المستحلب وجزيئات النشا تبدأ بالثقل والرسوب تدريجياً.' : 'Acidity is destabilizing starch globulin links. Clumping of macro-particles has begun.')}
                {reactionProgress === 1 && (isRtl ? 'تماسك كامل! انفصل سائل مصل اللبن الصافي في الأعلى وترسب النشا الثقيل في الأسفل.' : 'Success! Clear liquid whey cleanly separated from the dense starch sediment cushion.')}
              </p>
            </div>
            
            {/* Dynamic Success trigger */}
            {isIsoTarget ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-1 bg-emerald-950/80 p-3 border border-emerald-500/30 rounded-xl"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                  <CheckCircle2 size={13} strokeWidth={3} className="animate-bounce" />
                  <span>{t('separation_success')}</span>
                </div>
                <span className="text-[8px] text-emerald-500 leading-normal font-sans">
                  {isRtl ? 'سيتم الانتقال تلقائياً لمرحلة الترشيح والفصل...' : 'Preparing vacuum filtration module...'}
                </span>
              </motion.div>
            ) : (
              <div className="text-[8px] font-sans text-stone-500 leading-relaxed italic bg-amber-950/10 p-2.5 rounded-lg border border-amber-500/5">
                {isRtl ? '* فك السطح الخارجي للجزيئات بموجات الحامض يسهل تبلور وعزل النشا اللزج.' : '* Acidification compromises starch surface interfaces, causing rapid gravity isolation.'}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  };

  const renderLegumeStep5 = () => {
    return (
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl animate-fade-in py-4">
        
        {/* LEFT COLUMN: Dual-Phase Decanting Beaker (Draggable/Clickable) */}
        <div className="flex flex-col items-center gap-4">
          {!isDecantDone ? (
            <div className="text-center space-y-3 relative z-25">
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                {t('iso_beaker')}
              </div>
              
              <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.4}
                onDragStart={() => setDraggingItem('pour_iso')}
                onDragEnd={(e, info) => {
                  setDraggingItem(null);
                  if (Math.abs(info.offset.x) > 30 || Math.abs(info.offset.y) > 30) {
                    runLegumeDecanting();
                  }
                }}
                onClick={runLegumeDecanting}
                whileHover={{ scale: 1.1, translateY: -4 }}
                animate={{
                  rotate: isDecanting ? 54 : 0,
                  x: isDecanting ? 135 : 0,
                  y: isDecanting ? -98 : 0,
                  scale: isDecanting ? 0.95 : 1,
                }}
                transition={{ duration: isDecanting ? 1.6 : 0.35, ease: 'easeInOut' }}
                className="w-28 h-32 cursor-grab active:cursor-grabbing bg-stone-900/80 p-3.5 border-2 border-stone-800 rounded-3xl shadow-2xl flex flex-col items-center justify-between touch-none select-none relative group overflow-hidden"
              >
                {/* Visual fluid inside pouring beaker (Dual Phase sediment visible!) */}
                <div className="w-full h-16 flex flex-col justify-end bg-stone-950/90 rounded-b-xl border border-stone-850 relative overflow-hidden">
                  
                  {/* Supernatant Amber Liquid */}
                  <div className="absolute inset-x-0 bottom-4 top-0 bg-amber-500/30 border-b border-amber-500/20" />
                  
                  {/* Heavy white sediment at bottom of beaker */}
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-zinc-100 border-t border-zinc-300" />
                  
                  {/* Dynamic Clump Sparkles */}
                  <div className="absolute inset-x-1 bottom-4 h-3 flex justify-around opacity-75">
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 w-full">
                  <span className="text-[7px] font-mono text-amber-400 font-extrabold uppercase leading-tight text-center bg-amber-950/60 border border-amber-500/20 px-2 py-0.5 rounded">
                    {t('drag_to_pour')}
                  </span>
                </div>
              </motion.div>
              <div className="text-[8px] font-sans text-stone-500 leading-normal max-w-[140px]">
                {isRtl ? 'اسحب الكأس الزجاجي إلى القمع لتصفية النشا.' : 'Drag simulated beaker into the filter funnel to begin decanting.'}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0.3, scale: 0.95 }}
              animate={{ opacity: 0.45, scale: 0.95 }}
              className="w-28 h-32 bg-stone-950/40 border border-stone-850 rounded-3xl flex flex-col items-center justify-center opacity-30 select-none text-center p-3 gap-2"
            >
              <svg className="w-10 h-10 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-[8.5px] font-mono text-stone-500 uppercase tracking-widest">{t('decanted')}</span>
            </motion.div>
          )}
        </div>

        {/* CENTER COLUMN: Interactive Vacuum Filter Rig & Suction Erlenmeyer Flask */}
        <div className="flex flex-col items-center relative">
          
          {/* Snap Indicator Area for Funnel */}
          <div className={`absolute top-0 w-44 h-24 border-2 border-dashed rounded-3xl transition-all duration-300 pointer-events-none z-0 ${
            draggingItem === 'pour_iso'
              ? 'border-amber-400 bg-amber-500/[0.04] scale-102 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
              : 'border-transparent'
          }`} />

          {/* Holographic alignment guide */}
          {draggingItem === 'pour_iso' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[7.5px] font-black font-mono tracking-widest px-3 py-1 rounded-full shadow-md border border-amber-400 uppercase z-30"
            >
              {isRtl ? 'أفلت الكأس هنا للتصفية' : 'DROP TO decant'}
            </motion.div>
          )}

          {/* Complete 3D Vacuum Filtration Rig SVG */}
          <div className="w-68 h-88 relative flex flex-col justify-end items-center z-10 select-none">
            
            {/* Vector glass layout */}
            <svg 
              className="w-full h-full select-none overflow-visible absolute inset-0 z-20 pointer-events-none" 
              viewBox="0 0 200 250" 
              fill="none"
            >
              <defs>
                {/* Receiver flask clip path */}
                <clipPath id="flaskClip5">
                  <path d="M 85 85 L 115 85 L 115 120 L 164 212 C 168 218 160 220 145 220 L 55 220 C 40 220 32 218 36 212 L 85 120 Z" />
                </clipPath>

                {/* Golden pure whey filtrate gradient */}
                <linearGradient id="wheyFiltrateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0.45)" />
                  <stop offset="100%" stopColor="rgba(180, 83, 9, 0.65)" />
                </linearGradient>
              </defs>

              {/* 1. LIQUID FLOW INCOMING STREAM FROM POURING BEAKER */}
              {isDecanting && (
                <path 
                  d="M 10 10 Q 55 12 100 38" 
                  stroke="rgba(245, 158, 11, 0.85)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none" 
                  className="animate-pulse"
                />
              )}

              {/* 2. RECEIVER FLASK CLIPPED FILLING LIQUID */}
              {(isDecanting || isDecantDone) && (
                <g clipPath="url(#flaskClip5)">
                  {/* Back liquid fill */}
                  {(() => {
                    const fillHeight = 70 * (decantingProgress / 100);
                    const liquidY = 220 - fillHeight;
                    const widthReduce = (decantingProgress / 100) * 16;
                    return (
                      <g>
                        {/* Golden filtrate body */}
                        <path
                          d={`M 35 220 L 165 220 L ${165 - widthReduce} ${liquidY} C ${100 + 40 - widthReduce} ${liquidY - 3} ${100 - 40 + widthReduce} ${liquidY - 3} ${35 + widthReduce} ${liquidY} Z`}
                          fill="url(#wheyFiltrateGrad)"
                        />
                        {/* Meniscus Ripple Ellipse */}
                        <ellipse 
                          cx="100" 
                          cy={liquidY} 
                          rx={65 - widthReduce} 
                          ry="2.5" 
                          stroke="#f59e0b" 
                          strokeWidth="1" 
                          fill="#fbbf24" 
                          fillOpacity="0.45" 
                          className="animate-pulse" 
                        />
                      </g>
                    );
                  })()}
                </g>
              )}

              {/* 3. CO-PRODUCT CAKE ACCUMULATION ON BUCHNER FILTER Platform */}
              {/* Buchner funnel hollow cup profile */}
              <path d="M 64 35 L 136 35 L 136 70 L 108 85 L 108 115 L 92 115 L 92 85 L 64 70 Z" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="2.5" strokeLinejoin="round" />
              
              {/* Funnel inside glazed hollow reflection */}
              <path d="M 66 37 L 134 37 L 134 68 L 66 68 Z" fill="#f5f5f4" fillOpacity="0.8" />

              {/* Dynamic dirty liquid level in upper filter cup */}
              {isDecanting && (
                <path 
                  d={`M 66 68 L 134 68 L 134 ${68 - Math.max(0, 24 * (1 - decantingProgress / 100))} L 66 ${68 - Math.max(0, 24 * (1 - decantingProgress / 100))} Z`} 
                  fill="#f59e0b" 
                  fillOpacity="0.5" 
                  stroke="#fbbf24" 
                  strokeWidth="0.5"
                />
              )}

              {/* WHITE PORCELAIN HOLED MEMBRANE & FILTER PAPER */}
              <line x1="68" y1="68" x2="132" y2="68" stroke="#1c1917" strokeWidth="2" />
              <line x1="70" y1="67" x2="130" y2="67" stroke="#fafaf9" strokeWidth="1.5" strokeLinecap="round" />

              {/* Solid White Starch Cake buildup in filter! (rises from 0 to 12px) */}
              {(isDecanting || isDecantDone) && (
                <motion.rect
                  x="72"
                  y={67}
                  width="56"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: 12 * (decantingProgress / 100),
                    y: 67 - 12 * (decantingProgress / 100) 
                  }}
                  transition={{ type: "tween" }}
                  fill="#f4f4f5"
                  stroke="#fafafa"
                  strokeWidth="0.5"
                  className="shadow-inner"
                />
              )}

              {/* 4. DRIPPING RIPPLE PHYSICS (Filtrate dripping down into lower receiver) */}
              {isDecanting && (
                <g>
                  {/* Stem central water flow line */}
                  <line x1="100" y1="110" x2="100" y2="128" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6" />
                  
                  {/* Cascading falling droplets */}
                  {[
                    { id: 1, cY: [115, 185], delay: 0 },
                    { id: 2, cY: [115, 175], delay: 0.18 },
                    { id: 3, cY: [115, 195], delay: 0.35 }
                  ].map((dr) => (
                    <motion.circle
                      key={dr.id}
                      cx="100"
                      cy={dr.cY[0]}
                      r="2"
                      fill="#fbbf24"
                      animate={{ cy: dr.cY, opacity: [1, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: dr.delay, ease: 'easeIn' }}
                    />
                  ))}
                </g>
              )}

              {/* 5. GLASS OUTLINE OF RECEIVING Erlenmeyer FLASK */}
              <path 
                d="M 85 85 L 115 85 L 115 120 L 164 212 C 168 219 160 221 145 221 L 55 221 C 40 221 32 219 36 212 L 85 120 Z" 
                stroke="#d6d3d1" 
                strokeWidth="3.5" 
                strokeOpacity="0.32" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              
              {/* Highlight shine Left glass */}
              <path d="M 88 100 Q 88 120 45 200" stroke="white" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" />
              {/* Highlight shine right glass */}
              <path d="M 112 100 Q 112 120 155 200" stroke="white" strokeWidth="1" strokeOpacity="0.08" strokeLinecap="round" />

              {/* Side nozzle clip for vacuum connecting tube */}
              <path d="M 114 110 L 132 110 M 132 106 L 132 114" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" />
              {/* Vacuum rubber pipe */}
              <path d="M 132 110 Q 155 120 178 100" stroke="#78716c" strokeWidth="3" strokeOpacity="0.4" fill="none" />
            </svg>

            {/* Simulated interactive ripple wave on suction flask filtrate */}
            {isDecanting && (
              <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden rounded-b-3xl">
                {/* Surface Ripple expands at Y position */}
                <motion.div
                  initial={{ scale: 0.1, opacity: 1 }}
                  animate={{ scale: [0.1, 2.5], opacity: [0.85, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-14 h-4 rounded-full border border-amber-300/60 bg-amber-400/5"
                />
              </div>
            )}

            {/* Bench table stand base */}
            <div className="w-52 h-4 bg-stone-900 border-x border-t border-stone-800 rounded-t-xl" />
          </div>

          {/* Engaged Sieve Vacuum Control Console base dashboard */}
          <div className="w-56 bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-stone-800 p-4 rounded-3xl shadow-2xl flex flex-col items-center mt-3 relative">
            <div className="absolute top-0 inset-x-4 h-[1px] bg-sky-500/30" />
            <button
              onClick={runLegumeDecanting}
              disabled={isDecanting || isDecantDone}
              className={`w-full py-2.5 px-3 rounded-xl text-[10px] uppercase font-black text-center tracking-widest transition-all relative overflow-hidden flex items-center justify-center gap-1.5 ${
                isDecantDone
                  ? 'bg-amber-950/20 text-amber-500 border border-amber-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border border-amber-400 hover:scale-[1.02] shadow-lg shadow-amber-500/10 active:scale-[0.98]'
              }`}
            >
              {isDecanting ? (
                <>
                  <div className="w-2.5 h-2.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>{t('vacuum_draping', { progress: decantingProgress })}</span>
                </>
              ) : isDecantDone ? (
                <>
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  <span>{t('sift_completed')}</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="animate-pulse" />
                  <span>{t('engage_vacuum_sift')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Separation Yield statistics & Reports */}
        <div className="flex flex-col gap-4 font-mono w-full max-w-xs justify-center">
          
          {/* Main starch cake separated co-product stats */}
          {(isDecantDone || isDecanting) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col bg-stone-900/50 p-5 rounded-3xl border border-stone-850 text-[9.5px] text-stone-300 leading-relaxed gap-3 shadow-xl backdrop-blur-md"
            >
              <div className="text-amber-400 flex items-center gap-2 border-b border-stone-800 pb-2 uppercase font-black text-[10px]">
                <CheckCircle2 size={13} className="animate-bounce" />
                <span>{t('starch_byproduct')}</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 flex items-center justify-between">
                <div>
                  <span className="block text-[8px] text-stone-500 uppercase tracking-widest leading-none mb-1">{t('starch_fraction_coproduct')}</span>
                  <span className="text-stone-300 font-extrabold">{isRtl ? 'راسب نشاء ثقيل' : 'Isolated Co-product'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[7.5px] text-stone-500 block leading-none mb-1">{isRtl ? 'الوزن الجاف:' : 'DRY WEIGHT:'}</span>
                  <motion.span 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }}
                    className="text-amber-400 font-black text-[14px] leading-tight block font-mono"
                  >
                    {((decantingProgress / 100) * expectedLegumeStarchG).toFixed(1)} g
                  </motion.span>
                </div>
              </div>

              <div className="space-y-1.5 text-stone-400 font-sans text-[8.5px]">
                <p>
                  {isRtl 
                    ? '✓ تم حجز كتلة النشا الصلبة الكثيفة جافة بنسبة 100% على شبكة ورق الترشيح.' 
                    : '✓ Heavy white starch granules have been successfully retained at filter level.'}
                </p>
                <p className="text-stone-500 italic">
                  {isRtl 
                    ? '* يمر مصل اللبن البروتيني الصافي عبر الفراغ دون أي شوائب نشوية سكرية.' 
                    : '* Starch-free supernatant contains premium pure protein, drained to receiver below.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Static science description when standby */}
          {!isDecantDone && !isDecanting && (
            <div className="flex flex-col bg-stone-900/30 p-5 rounded-3xl border border-stone-800/60 text-[9px] text-stone-400 leading-relaxed gap-2 shadow opacity-85">
              <span className="text-stone-300 font-black tracking-widest text-[10px] uppercase border-b border-stone-850 pb-2 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                {isRtl ? 'تقنيات التصفية بخنر' : 'BUCHNER SPECIFICATION'}
              </span>
              <p className="font-sans">
                {isRtl 
                  ? 'ترشيح فراغي آمن يسمح بسحب جزيئات مصل حمض التعادل عبر ضغط سالب سريع، محتجزًا النشا عالي الكثافة كعجينة ترسيب نقية.' 
                  : 'Suction-filtration utilizes differential atmospheric pressure to pull aqueous whey filtrate, separating starch cake particles instantly.'}
              </p>
            </div>
          )}
        </div>

      </div>
    );
  };

  const renderLegumeStep6 = () => {
    // Percentage temperature completion (24 C to 80 C)
    const p = Math.max(0, Math.min(1, (legumeTemp - 24) / (80 - 24)));
    
    // Dynamic background liquid color interpolation
    // starts: deep warm pumpkin orange rgba(245, 158, 11, 0.8)
    // ends: clear transparent sky/light blue rgba(186, 230, 253, 0.45)
    // transition happens dynamically
    const rL = Math.round(245 - p * (245 - 186));
    const gL = Math.round(158 + p * (230 - 158));
    const bL = Math.round(11 + p * (253 - 11));
    const alphaLiquid = 0.8 - p * 0.35;
    const dynamicLiquidColor = `rgba(${rL}, ${gL}, ${bL}, ${alphaLiquid})`;

    // Dynamic flame scale factor based on temperature
    const flameScale = isLegumeHeating ? 0.6 + p * 0.6 : 0;

    return (
      <div className="w-full flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto">
        <div className="relative w-full max-w-[620px] h-[330px] shrink-0 scale-90 sm:scale-100 origin-center">
        {/* DRAGGABLE BEAKER (Left Side) - Absolutely Positioned */}
        <div className="absolute left-[6px] bottom-0 w-44 h-80 flex flex-col items-center justify-end">
          <AnimatePresence>
            {!isLegumeJuiceInHeater && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-3 relative z-20"
              >
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black text-center">
                  {t('filtrate_extract')}
                </div>

                {/* Draggable & Tappable Beaker */}
                <motion.div
                  drag={!isLegumePouring}
                  dragConstraints={constraintsRef}
                  dragElastic={0.4}
                  onDragStart={() => setDraggingItem('legume_beaker')}
                  onDragEnd={(e, info) => {
                    setDraggingItem(null);
                    if (Math.abs(info.offset.x) > 50 || Math.abs(info.offset.y) > 50) {
                      startLegumePouring();
                    }
                  }}
                  onClick={startLegumePouring}
                  whileHover={{ scale: isLegumePouring ? 1 : 1.05 }}
                  whileDrag={{ scale: 1.12, rotate: 15 }}
                  animate={
                    isLegumePouring
                      ? {
                          x: 124,
                          y: -145,
                          rotate: 60,
                          scale: 1,
                          transition: { duration: 0.8, ease: 'easeOut' },
                        }
                      : { x: 0, y: 0, rotate: 0 }
                  }
                  className={`w-32 h-40 bg-zinc-900/95 border border-amber-500/30 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-end relative overflow-hidden group select-none ${
                    isLegumePouring ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                  }`}
                >
                  {/* Beaker measurement ticks */}
                  <div className="absolute left-3 top-6 flex flex-col gap-3 opacity-30 select-none">
                    <div className="w-4 h-[1.5px] bg-white"></div>
                    <div className="w-2 h-[1px] bg-white"></div>
                    <div className="w-4 h-[1.5px] bg-white"></div>
                    <div className="w-2 h-[1px] bg-white"></div>
                    <div className="w-4 h-[1.5px] bg-white"></div>
                  </div>

                  {/* Shimmery Liquid filled in Beaker */}
                  <motion.div
                    animate={isLegumePouring ? { height: '10%' } : { height: '70%' }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orange-600 via-amber-500 to-amber-400 z-0 flex items-center justify-center border-t border-amber-300/40"
                  >
                    <div className="absolute -top-1 inset-x-0 h-2 bg-amber-300/60 rounded-full filter blur-[1px] opacity-80" />
                  </motion.div>

                  {/* Inner glass reflection sheen */}
                  <div className="absolute inset-y-0 right-4 w-1 bg-white/10 rounded-full" />
                  
                  {/* Front Text Overlay */}
                  <div className="absolute top-4 inset-x-0 text-center flex flex-col items-center pointer-events-none z-10 p-1">
                    <span className="text-[9px] font-mono font-bold text-white tracking-widest">{t('raw_cellular').substring(0,18)}</span>
                    <span className="text-[7.5px] text-amber-300 font-bold mt-1 uppercase">{t('orange_filtrate')}</span>
                    <span className="text-[6.5px] text-zinc-500 mt-1">{t('drag_or_tap')}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pouring stream liquid animation - Absolutely Positioned relative to parent workbench */}
        {isLegumePouring && (
          <div className="absolute z-30 pointer-events-none" style={{ left: 'calc(50% - 7px)', top: '120px' }}>
            <svg className="w-16 h-28 overflow-visible" viewBox="0 0 64 112">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d="M 8,0 L 8,90"
                fill="none"
                stroke="url(#gradientPourOrange)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              
              <motion.circle
                animate={{ cy: [10, 85] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                cx="8"
                r="3.5"
                fill="#fef08a"
              />
              <motion.circle
                animate={{ cy: [25, 75] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
                cx="12"
                r="2.5"
                fill="#ffffff"
              />

              <defs>
                <linearGradient id="gradientPourOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* ERLENMEYER GLASS FLASK STATION (Center) - Absolutely Positioned */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-64 h-80 flex flex-col items-center justify-end">
          {/* Perfect glowing background to establish central focus on the heating pot */}
          <div className="absolute inset-y-4 inset-x-8 pointer-events-none -z-10 bg-gradient-to-t from-amber-500/10 via-amber-550/[0.02] to-transparent rounded-full filter blur-2xl opacity-90 transition-all duration-500" />
          
          {isLegumeHeating && (
            <div className="absolute inset-y-4 inset-x-8 pointer-events-none -z-10 bg-amber-400/10 rounded-full filter blur-3xl animate-pulse" />
          )}

          <div className="relative flex flex-col items-center select-none">
            
            <div className="w-14 h-12 border-x-4 border-stone-100/60 bg-zinc-950/20 z-10 relative flex items-center justify-center">
              <div className="absolute top-0 w-16 h-2 bg-stone-300 rounded-t-sm border-b border-stone-500 shadow-sm" />
              
              {/* Rising steam vapor clouds proportional to temp */}
              {isLegumeJuiceInHeater && (
                <div className="absolute -top-16 left-3.5 flex flex-col gap-1 items-center z-20 pointer-events-none">
                  {[1, 2, 3, 4, 5].map((steam, i) => {
                    const baseDelay = i * 0.35;
                    const baseDuration = 1.4 + (i % 2) * 0.4;
                    const xOffset = -12 + i * 5;
                    const pOpacity = isLegumeHeating ? 0.15 + (legumeTemp - 24) / 56 * 0.75 : 0.05;
                    return (
                      <motion.div
                        key={steam}
                        animate={{
                          y: [0, -50],
                          x: [xOffset, xOffset + Math.sin(i) * 12],
                          scale: [0.6, 2.2],
                          opacity: [0, pOpacity, 0]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: baseDuration,
                          delay: baseDelay,
                          ease: "easeOut"
                        }}
                        className="w-3.5 h-3.5 bg-white/20 rounded-full absolute filter blur-[2.5px]"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="w-48 h-40 border-b-4 border-x-4 border-stone-100/60 bg-white/5 rounded-b-[48px] relative overflow-hidden flex flex-col justify-end items-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] pb-1.5 z-10 border-t border-t-white/10">
              
              {/* Glass shine reflections & transparency enhancements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-10" />
              <div className="absolute top-2 right-6 w-3 h-28 bg-gradient-to-l from-white/10 to-transparent rounded-full filter blur-[1px] pointer-events-none z-20" />
              <div className="absolute top-2 left-6 w-1 h-28 bg-gradient-to-r from-white/10 to-transparent rounded-full filter blur-[0.5px] pointer-events-none z-20" />
              
              <div className="absolute left-3 top-8 flex flex-col gap-2 font-mono text-[6px] text-zinc-400 font-bold select-none opacity-40 z-25 pointer-events-none">
                <span>— 300 ml</span>
                <span>— 200 ml</span>
                <span>— 100 ml</span>
              </div>

              {isLegumeJuiceInHeater && (
                <div className="absolute top-0 bottom-4 w-1 bg-gradient-to-b from-stone-400 to-stone-200 shadow-md left-1/2 z-20 pointer-events-none">
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute bottom-0 -left-[2px] shadow-lg animate-pulse" />
                </div>
              )}

              {!isLegumeJuiceInHeater && !isLegumePouring && (
                <div className={`absolute inset-4 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center px-4 transition-all duration-300 ${
                  draggingItem === 'legume_beaker'
                    ? 'border-amber-400 bg-amber-500/10 scale-102 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse'
                    : 'border-amber-500/30 bg-amber-500/5 animate-pulse'
                }`}>
                  <span className={`text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 ${
                    draggingItem === 'legume_beaker' ? 'text-amber-300' : 'text-amber-500'
                  }`}>
                    <Droplets size={12} className="text-amber-500 animate-bounce" />
                    {t('fill_flask_vessel')}
                  </span>
                  <div className="text-[7px] font-sans text-stone-400 mt-2">
                    {t('drag_or_tap')} {t('pour_orange_extract_hint')}
                  </div>
                </div>
              )}

              {isLegumePouring && (
                <div
                  style={{
                    height: `${legumePourProgress}%`,
                    backgroundColor: 'rgba(245, 158, 11, 0.85)',
                    transition: 'height 0.08s linear',
                  }}
                  className="absolute inset-x-0 bottom-0 z-0 flex items-center justify-center overflow-hidden border-t-2 border-amber-300/40"
                >
                  <div className="absolute -top-1.5 inset-x-0 h-3 bg-amber-300/50 rounded-full animate-pulse filter blur-[1px]" />
                  
                  <div className="absolute top-0 left-12 right-12 bottom-0 flex flex-wrap gap-1 items-center justify-center">
                    {[1, 2, 3, 4, 5].map((bub) => (
                      <motion.div
                        key={bub}
                        animate={{ y: [20, -20], x: [0, Math.sin(bub) * 8], scale: [0.5, 1, 0.4], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.4, delay: bub * 0.1 }}
                        className="w-2 h-2 rounded-full bg-yellow-200/50 absolute"
                      />
                    ))}
                  </div>
                </div>
              )}

              {isLegumeJuiceInHeater && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '80%' }}
                  transition={{ duration: 0.5 }}
                  style={{ backgroundColor: dynamicLiquidColor }}
                  className="absolute inset-x-0 bottom-0 z-0 flex items-center justify-center overflow-hidden border-t-2 border-white/25"
                >
                  <motion.div
                    animate={
                      isLegumeHeating 
                        ? { y: [-1, 2, -1], rotate: [-0.5, 0.5, -0.5] } 
                        : { y: [-0.4, 0.4, -0.4], rotate: [-0.1, 0.1, -0.1] }
                    }
                    transition={{ repeat: Infinity, duration: isLegumeHeating ? 0.35 : 1.8 }}
                    className="absolute top-[-4px] inset-x-0 h-3 bg-white/10 rounded-full filter blur-[1px]"
                  />

                  {isLegumeHeating && (
                    <div className="absolute inset-x-0 bottom-0 top-3 pointer-events-none overflow-hidden">
                      {Array.from({ length: 10 }).map((_, bubIndex) => {
                        const randomDelay = bubIndex * 0.25;
                        const randomDuration = 0.5 + (bubIndex % 3) * 0.2;
                        const xOffsetPercent = 10 + bubIndex * 8.5;
                        const bubbleMaxOpacity = p >= 0.4 ? Math.min(1, (legumeTemp - 35) / 45) : 0;
                        return (
                          <motion.div
                            key={bubIndex}
                            animate={{
                              y: [120, -10],
                              x: [xOffsetPercent, xOffsetPercent + Math.sin(bubIndex) * 8],
                              opacity: [0, bubbleMaxOpacity, 0],
                              scale: [0.5, 1.25, 0.6]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: randomDuration,
                              delay: randomDelay,
                              ease: "easeIn"
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-inner absolute"
                            style={{ left: `${xOffsetPercent}%` }}
                          />
                        );
                      })}
                    </div>
                  )}

                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {Array.from({ length: 12 }).map((_, pIdx) => {
                      const direction = pIdx % 2 === 0 ? 1 : -1;
                      const radX = 35 + (pIdx % 4) * 8;
                      const radY = 22 + (pIdx % 3) * 6;
                      const loopDuration = 3.2 + (pIdx % 3) * 0.6;
                      const startDelay = pIdx * 0.3;

                      let particleOpacity = 0;
                      let particleScale = 0.4;
                      let particleBg = 'rgba(255, 255, 255, 0)';
                      let particleBorder = 'none';
                      let textTag = false;

                      if (legumeTemp >= 40) {
                        particleOpacity = Math.min(1, (legumeTemp - 40) / 40);
                        if (legumeTemp < 58) {
                          particleScale = 0.5 + (pIdx % 3) * 0.1;
                          particleBg = 'rgba(254, 243, 199, 0.45)';
                          particleBorder = '1px solid rgba(254, 243, 199, 0.15)';
                        } else if (legumeTemp < 73) {
                          particleScale = 0.9 + (pIdx % 3) * 0.25;
                          particleBg = 'rgba(254, 254, 254, 0.82)';
                          particleBorder = '1px solid rgba(245, 158, 11, 0.3)';
                        } else {
                          particleScale = 1.35 + (pIdx % 3) * 0.4;
                          particleBg = '#ffffff';
                          particleBorder = '1.5px solid rgba(251, 191, 36, 0.65)';
                          textTag = pIdx % 4 === 0 && legumeTemp >= 76;
                        }
                      }

                      return (
                        <motion.div
                          key={pIdx}
                          animate={{
                            x: [0, radX * direction, 0, -radX * direction, 0],
                            y: [-radY, 0, radY, 0, -radY],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: loopDuration,
                            delay: startDelay,
                            ease: "linear"
                          }}
                          style={{
                            opacity: particleOpacity,
                            scale: particleScale,
                            backgroundColor: particleBg,
                            border: particleBorder,
                            boxShadow: legumeTemp >= 73 ? '0 4px 8px rgba(0,0,0,0.25)' : 'none',
                            transition: 'background-color 0.4s ease, border 0.4s ease, transform 0.4s ease',
                          }}
                          className="w-4 h-4 rounded-xl absolute z-15 flex items-center justify-center"
                        >
                          {textTag && (
                            <span className="text-[3.5px] text-amber-950 font-black tracking-widest uppercase select-none scale-90">
                              {t('curd_coag_label')}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {isLegumeHeating && (
                    <motion.div
                      animate={{
                        opacity: [0, 0.12, 0],
                        skewX: [-4, 4, -4],
                        scaleY: [1, 1.05, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="absolute inset-0 bg-gradient-to-t from-red-500/10 via-transparent to-white/5 pointer-events-none filter blur-[4px]"
                    />
                  )}

                  <div className="absolute bottom-2.5 right-2.5 bg-zinc-950/90 border border-amber-500/40 rounded-xl px-2.5 py-1.5 flex flex-col items-center shadow-lg backdrop-blur-sm">
                    <span className="text-[5.5px] font-mono text-zinc-400 font-black pb-0.5 tracking-wider leading-none uppercase">{t('thermo_probe')}</span>
                    <div className="flex items-center gap-1">
                      <Thermometer size={9} className={legumeTemp >= 70 ? 'text-red-500 animate-pulse' : 'text-amber-500'} />
                      <span className={`text-[10.5px] font-mono font-black tracking-widest ${legumeTemp >= 73 ? 'text-red-500 animate-pulse' : 'text-[#f59e0b]'}`}>
                        {legumeTemp.toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="w-56 h-12 bg-gradient-to-b from-stone-850 to-stone-900 border border-stone-950 px-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-0 border-t-4 border-t-orange-600/40 relative flex items-center justify-between">
              
              <div className="w-6 h-6 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-lg border border-yellow-700 shadow-inner -mt-1 flex items-center justify-center">
                <div className="w-2 h-3.5 bg-stone-950 rounded-sm" />
              </div>

              {isLegumeHeating && (
                <div className="absolute -top-7.5 left-[42%] flex gap-1 relative z-10 select-none pointer-events-none">
                  <motion.div 
                    animate={{ scaleY: [1, 2.7 * flameScale, 1], scaleX: [1, 1.4 * flameScale, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.12 }} 
                    className="w-3.5 h-5 bg-cyan-400 rounded-t-full origin-bottom opacity-90 filter blur-[0.5px]" 
                  />
                  <motion.div 
                    animate={{ scaleY: [1, 3.4 * flameScale, 1], scaleX: [1, 1.2 * flameScale, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.14, delay: 0.05 }} 
                    className="w-4.5 h-6.5 bg-amber-500 rounded-t-full origin-bottom mix-blend-screen opacity-90 shadow-lg" 
                  />
                  <motion.div 
                    animate={{ scaleY: [1, 2.2 * flameScale, 1], scaleX: [1, 1.5 * flameScale, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.18 }} 
                    className="w-3.5 h-5 bg-orange-600 rounded-t-full origin-bottom opacity-80" 
                  />
                </div>
              )}

              <span className="text-[7.5px] text-zinc-400 font-mono tracking-widest font-extrabold text-center flex-1">{t('bunsen_burner_system')}</span>

              {isLegumeJuiceInHeater && !isLegumeCoagulated && (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={runLegumeHeating}
                  disabled={isLegumeHeating}
                  className={`w-6 h-6 rounded-full border shadow-lg flex items-center justify-center cursor-pointer relative z-30 transition-all ${
                    isLegumeHeating 
                      ? 'bg-red-500 border-red-400 font-bold shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse' 
                      : 'bg-zinc-800 hover:bg-zinc-700 border-stone-750 shadow-inner'
                  }`}
                  title="Press to Ignite Heating System"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isLegumeHeating ? 'bg-white' : 'bg-red-500/80 animate-ping'}`} />
                </motion.button>
              )}

              {(!isLegumeJuiceInHeater || isLegumeCoagulated) && (
                <div className="w-6 h-6 bg-stone-950 rounded-full border border-stone-850 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                </div>
              )}
            </div>
          </div>

          <div className="w-72 mt-5 text-center">
            {isLegumeJuiceInHeater && !isLegumeCoagulated ? (
              <button
                type="button"
                onClick={runLegumeHeating}
                disabled={isLegumeHeating}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-[#ca8a04] hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs uppercase rounded-xl tracking-widest shadow-[0_4px_15px_rgba(245,158,11,0.25)] transition-transform duration-100 hover:scale-[1.01]"
              >
                {isLegumeHeating ? (
                  <span className="flex items-center justify-center gap-2">
                    <RotateCw size={14} className="animate-spin text-black" />
                    <span>{t('thermophilic_coagulation', { temp: legumeTemp.toFixed(1) })}</span>
                  </span>
                ) : (
                  <span>{t('boil_proteins')}</span>
                )}
              </button>
            ) : isLegumeCoagulated ? (
              <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-500/35 text-center text-xs font-mono text-[#fbbf24] flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 size={16} />
                <span>{t('globulin_coagulated')}</span>
              </div>
            ) : null}
          </div>
        </div>

        </div>

        {/* THERMO-COAGULATION STATE MONITOR (Right Side) - Clean and Located beautifully on the side */}
        <div className="w-full max-w-[620px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isLegumeJuiceInHeater ? (
              <motion.div
                key="active-state-legume"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col bg-stone-900/40 p-5 rounded-2xl border border-stone-800 shadow-xl font-mono text-[10px] text-zinc-400 leading-relaxed gap-3 w-full animate-none"
              >
                <div className="text-amber-400 flex items-center gap-1.5 border-b border-stone-800/80 pb-2 uppercase font-black tracking-wider text-[10.5px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  {t('thermo_coagulation_state')}
                </div>
                <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-850">
                  <span className="block font-bold text-zinc-500 uppercase text-[8px] tracking-wide mb-1">
                    {t('specimen_extract_type')}
                  </span>
                  <span className="text-amber-500 font-extrabold text-[11.5px] uppercase tracking-wider">
                    {t('legume_globulin_solute')}
                  </span>
                </div>
                
                <div className="bg-stone-950/40 p-3 rounded-xl border border-stone-850/80 font-sans text-stone-300 leading-relaxed text-[11px]">
                  {legumeTemp < 40 
                    ? t('legume_coag_desc_low')
                    : legumeTemp < 60 
                      ? t('legume_coag_desc_mid')
                      : legumeTemp < 73
                        ? t('legume_coag_desc_high')
                        : t('legume_coag_desc_done')
                  }
                </div>

                {/* Clean state visualization metric */}
                <div className="mt-1 border-t border-stone-850/80 pt-3 flex flex-col gap-1.5">
                  <div className="flex justify-between text-[8px] text-zinc-500 uppercase font-black tracking-widest">
                    <span>{isRtl ? 'اكتمال عملية نزع المسخ' : 'DENATURATION PROGRESS'}</span>
                    <span>{Math.min(100, Math.floor(((legumeTemp - 24) / (78 - 24)) * 105))}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${legumeTemp >= 73 ? 'bg-amber-500' : 'bg-red-500/80'}`} style={{ width: `${Math.max(0, Math.min(100, ((legumeTemp - 24) / (78 - 24)) * 105))}%` }} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col bg-stone-900/10 p-6 rounded-2xl border border-stone-800/40 justify-center items-center text-center font-mono text-[9px] text-stone-500 w-full min-h-[220px] border-dashed select-none">
                <TrendingUp size={24} className="text-amber-500/30 mb-2.5 animate-pulse" />
                <span className="uppercase text-[9px] tracking-widest font-black text-stone-500">
                  {t('thermo_coagulation_state')}
                </span>
                <p className="font-sans text-[8px] text-zinc-500 mt-1 leading-normal max-w-[200px]">
                  {isRtl ? 'بانتظار سكب العصارة في الدورق لبدء القياس.' : 'Awaiting extract pour into the flask vessel before thermal monitoring.'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderLegumeStep7 = () => {
    return (
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 max-w-5xl select-none">
        
        {/* Hot Coagulated Beaker (Left) */}
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full lg:w-1/4">
          <AnimatePresence mode="wait">
            {!isLegumeCurdInPress ? (
              <motion.div
                key="unpoured-curd"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-3 relative z-25 flex flex-col items-center"
              >
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-relaxed font-black">
                  {t('hot_globulin_coagulum')}
                </div>
                
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragElastic={0.4}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                  onDragStart={() => setDraggingItem('legume_curd')}
                  onDragEnd={(e, info) => {
                    setDraggingItem(null);
                    if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                      setIsLegumeCurdInPress(true);
                      playSynthBeep(360);
                    }
                  }}
                  onClick={() => {
                    setIsLegumeCurdInPress(true);
                    playSynthBeep(360);
                  }}
                  whileHover={{ scale: 1.08, translateY: -3 }}
                  whileDrag={{ scale: 1.15 }}
                  className="w-32 h-32 cursor-grab active:cursor-grabbing bg-stone-900/90 border border-amber-500/30 rounded-2xl shadow-xl flex flex-col items-center justify-center relative p-3 transition-all hover:bg-stone-850 hover:border-amber-500/50 touch-none select-none"
                >
                  {/* Detailed Hot Coagulated Beaker */}
                  <div className="w-16 h-18 bg-gradient-to-b from-sky-500/5 via-sky-500/10 to-amber-500/15 border-2 border-stone-400/70 rounded-b-xl rounded-tr-xl flex flex-col justify-end items-center pb-2.5 px-3 relative shadow-inner">
                    {/* Steam Vapor when unpoured */}
                    <div className="absolute top-1.5 inset-x-3 flex justify-around opacity-60">
                      <motion.span animate={{ y: [-3, -12], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-3 bg-white/20 rounded-full filter blur-[0.5px]" />
                      <motion.span animate={{ y: [-4, -15], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} className="w-1 h-2 bg-white/30 rounded-full filter blur-[0.5px]" />
                    </div>
                    {/* Graduations */}
                    <div className="absolute left-1.5 top-2 flex flex-col gap-1.5 font-mono text-[5px] text-zinc-500">
                      <span>300ml</span>
                      <span>200ml</span>
                      <span>100ml</span>
                    </div>
                    {/* Coagulated Hot Liquid inside the pouring vessel */}
                    <div className="w-full h-11 bg-gradient-to-t from-amber-950/80 via-[#d97706] to-[#fbbf24]/40 rounded-b-lg border-t border-[#fbbf24]/50 opacity-95 relative overflow-hidden flex items-center justify-center">
                      {/* Inner protein curd aggregates floating */}
                      <div className="flex gap-1 opacity-80">
                        <motion.div animate={{ scale: [0.9, 1.2, 0.9] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2.5 h-2.5 bg-[#fbbf24] rounded-full filter drop-shadow-[0_0_2px_#fbbf24]" />
                        <motion.div animate={{ scale: [1.1, 0.8, 1.1] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-amber-400 font-extrabold mt-2 uppercase text-center leading-none tracking-widest">{t('pour_to_filter')}</span>
                  <span className="text-[6px] text-stone-550 font-sans mt-0.5">{t('drag_or_tap')}</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="poured-curd"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.45, scale: 0.95 }}
                className="w-32 h-32 bg-stone-950/20 border border-stone-900 rounded-2xl flex flex-col items-center justify-center text-center p-3 select-none"
              >
                <CheckCircle2 size={18} className="text-[#fbbf24] mb-1 animate-pulse" />
                <span className="text-[9px] font-mono text-amber-400 uppercase font-black tracking-wider leading-none">{t('curd_depoted')}</span>
                <span className="text-[6.5px] text-stone-550 mt-1 leading-normal">{t('slurry_transferred')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lab Filtration and Compression Apparatus (Center) */}
        <div className="flex flex-col items-center w-full lg:w-1/2 overflow-visible">
          <div className={`relative p-6 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col items-center w-full max-w-sm transition-all duration-300 ${
            draggingItem === 'legume_curd'
              ? 'border-amber-400 bg-amber-950/10 scale-102 shadow-[0_0_25px_rgba(245,158,11,0.25)] animate-pulse'
              : 'border-stone-850 bg-stone-950/40'
          } border`}>
            
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full filter blur-[40px] pointer-events-none" />

            {/* Laboratory Simulation Canvas */}
            <svg viewBox="0 0 200 290" className="w-56 h-80 drop-shadow-2xl overflow-visible">
              <defs>
                <linearGradient id="harvestPaperAbsorbLegume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#451a03" stopOpacity="0.1" />
                  <stop offset="60%" stopColor="#fef3c7" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>

                <radialGradient id="glowingProteinLegume" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="65%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>

                <linearGradient id="clearWaterGradLegume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="10%" stopColor="#0284c7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#075985" stopOpacity="0.7" />
                </linearGradient>

                <linearGradient id="heavyMetalGradLegume" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* TILTING POURING STREAM ANIMATION */}
              {isLegumeCurdInPress && !isLegumePressing && !isLegumePressDone && (
                <g>
                  <motion.path 
                    d="M 20 20 Q 55 45, 100 65"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity={0.8}
                    animate={{ strokeDashoffset: [0, -20], strokeWidth: [3, 4, 3] }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    style={{ strokeDasharray: "10, 5" }}
                  />
                  <g transform="translate(-15, -15) rotate(-55, 30, 35)" className="opacity-90">
                    <rect x="15" y="20" width="30" height="40" rx="4" fill="rgba(80,80,80,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <rect x="17" y="32" width="26" height="26" fill="url(#glowingProteinLegume)" opacity="0.8" rx="2" />
                    <line x1="15" y1="20" x2="20" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                  </g>
                </g>
              )}

              {/* PLUNGER piston descends based on progress */}
              <g transform={`translate(0, ${isLegumePressDone ? 38 : isLegumePressing ? (legumePressProgress * 0.38) : 0})`} className="transition-transform duration-300 ease-out z-15">
                <path d="M 85 -20 L 115 -20 L 115 42 L 140 42 L 140 47 L 60 47 L 60 42 L 85 42 Z" fill="url(#heavyMetalGradLegume)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                <rect x="62" y="44" width="76" height="2" fill="#ef4444" opacity="0.8" />
                <circle cx="100" cy="15" r="4" fill={isLegumePressing ? "#f59e0b" : "#4b5563"} className={isLegumePressing ? "animate-pulse" : ""} />
              </g>

              {/* UPPER FUNNEL GLASS */}
              <path d="M 50 45 L 150 45 L 115 110 L 115 150 L 85 150 L 85 110 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
              <path d="M 52 46 L 85 110" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />

              {/* FOLDED FILTER PAPER CONE inside funnel */}
              {isLegumeCurdInPress && (
                <g>
                  <path d="M 55 48 L 100 106 L 145 48 Z" fill="url(#harvestPaperAbsorbLegume)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                  
                  {/* Fold/Pleats */}
                  <line x1="66" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                  <line x1="78" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
                  <line x1="89" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                  <line x1="100" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
                  <line x1="111" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                  <line x1="122" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                  <line x1="133" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />

                  {/* COAGULATED PROTEIN CLUSTERS - Spongy aggregates that merge into tightly pressed cake */}
                  {!isLegumePressDone ? (
                    <g>
                      <motion.g 
                        animate={isLegumePressing ? { 
                          scaleY: 1 - (legumePressProgress * 0.007),
                          translateY: legumePressProgress * 0.28
                        } : { y: [0, -1, 0] }}
                        transition={{ repeat: isLegumePressing ? 0 : Infinity, duration: 2.2, ease: "easeInOut" }}
                        style={{ transformOrigin: "100px 106px" }}
                      >
                        <motion.circle 
                          cx="90" cy="74" r="8" 
                          fill="url(#glowingProteinLegume)" 
                          filter="drop-shadow(0 0 5px rgba(245,158,11,0.7))"
                          animate={{ scale: [1, 1.08, 1], x: [0, 1.5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.8 }}
                        />
                        <motion.circle 
                          cx="108" cy="76" r="9" 
                          fill="url(#glowingProteinLegume)" 
                          filter="drop-shadow(0 0 5px rgba(245,158,11,0.7))"
                          animate={{ scale: [1, 1.12, 1], x: [0, -2, 0] }}
                          transition={{ repeat: Infinity, duration: 2.1, delay: 0.3 }}
                        />
                        <motion.circle 
                          cx="100" cy="85" r="10" 
                          fill="url(#glowingProteinLegume)" 
                          filter="drop-shadow(0 0 6px rgba(245,158,11,0.8))"
                          animate={{ scale: [1, 1.05, 1], y: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
                        />
                        <motion.circle 
                          cx="81" cy="80" r="6" 
                          fill="url(#glowingProteinLegume)" 
                          filter="drop-shadow(0 0 4px rgba(245,158,11,0.5))"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                        />
                        <path d="M 83 78 Q 100 80, 115 76" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="2.5" />
                        <path d="M 94 72 Q 100 88, 102 89" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="3" />
                      </motion.g>
                    </g>
                  ) : (
                    /* COMPLETED COMPRESSED LPI protein cake */
                    <g>
                      <motion.path 
                        initial={{ opacity: 0, scaleY: 0.2 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.5 }}
                        d="M 68 83 C 68 83, 100 95, 132 83 Q 120 106, 100 106 Q 80 106, 68 83 Z"
                        fill="url(#glowingProteinLegume)"
                        stroke="rgba(255,255,255,0.65)"
                        strokeWidth="1.2"
                        filter="drop-shadow(0 0 10px rgba(245,158,11,0.85))"
                      />
                      <ellipse cx="100" cy="86" rx="23.5" ry="3.5" fill="#fbbf24" opacity="0.6" />
                      <text x="100" y="94" textAnchor="middle" fill="#451a03" fontStyle="normal" style={{ fontSize: "5.5px", fontFamily: "JetBrains Mono, monospace", fontWeight: "900", letterSpacing: "1px" }}>{t('lpi_cake')}</text>
                      
                      <g>
                        <circle cx="85" cy="74" r="0.8" fill="#fff" className="animate-ping" />
                        <circle cx="112" cy="78" r="0.8" fill="#fff" className="animate-ping" style={{ animationDelay: "0.2s" }} />
                      </g>
                    </g>
                  )}
                </g>
              )}

              {/* FUNNEL SPOUT STEM OUTFLOW */}
              <g transform="translate(0, 6)">
                <path d="M 94 144 L 94 165 L 106 160 L 106 144 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
                
                {/* Falling clear whey/solvent droplets */}
                {isLegumeCurdInPress && (isLegumePressing || !isLegumePressDone) && (
                  <g>
                    <motion.ellipse 
                      cx="100" cy="160" rx="2.2" ry="2.8" 
                      fill="url(#clearWaterGradLegume)" 
                      animate={{ y: [0, 56], scale: [1, 0.3], opacity: [0.95, 0] }}
                      transition={{ repeat: Infinity, duration: 0.42, ease: "easeIn" }}
                    />
                    <motion.ellipse 
                      cx="100" cy="160" rx="1.6" ry="2.2" 
                      fill="url(#clearWaterGradLegume)" 
                      animate={{ y: [0, 56], scale: [1, 0.4], opacity: [0.85, 0] }}
                      transition={{ repeat: Infinity, duration: 0.58, delay: 0.15, ease: "easeIn" }}
                    />
                    <motion.ellipse 
                      cx="100" cy="160" rx="1.2" ry="1.8" 
                      fill="url(#clearWaterGradLegume)" 
                      animate={{ y: [0, 56], scale: [1, 0.5], opacity: [0.75, 0] }}
                      transition={{ repeat: Infinity, duration: 0.75, delay: 0.3, ease: "easeIn" }}
                    />
                    
                    {/* Splash particles at the bottom of tube */}
                    <motion.circle
                      cx="100" cy="216" r="1.5"
                      fill="#e0f2fe"
                      animate={{ y: [0, -6], x: [0, -4], opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.3, delay: 0.42 }}
                    />
                    <motion.circle
                      cx="100" cy="216" r="1.2"
                      fill="#e0f2fe"
                      animate={{ y: [0, -5], x: [0, 4], opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.3, delay: 0.42 }}
                    />
                  </g>
                )}
              </g>

              {/* LOWER FLASK CONTAINER RECEIVER */}
              <g transform="translate(0, 15)">
                <path d="M 80 185 L 120 185 L 120 200 L 80 200 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <path d="M 72 200 L 128 200 L 140 250 L 60 250 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                <path d="M 74 202 L 100 250" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                
                {/* Concentric ripples at fluid entry point */}
                {isLegumeCurdInPress && isLegumePressing && (
                  <g>
                    <motion.circle
                      cx="100"
                      cy="235"
                      r="2"
                      fill="none"
                      stroke="rgba(56,189,248,0.7)"
                      strokeWidth="0.5"
                      animate={{ scale: [1, 7], opacity: [0.82, 0] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="100"
                      cy="235"
                      r="2"
                      fill="none"
                      stroke="rgba(56,189,248,0.4)"
                      strokeWidth="0.5"
                      animate={{ scale: [1, 5], opacity: [0.55, 0] }}
                      transition={{ repeat: Infinity, duration: 1.1, delay: 0.35, ease: 'easeOut' }}
                    />
                  </g>
                )}

                {/* Filtered whey accumulation at bottom */}
                {isLegumeCurdInPress && (
                  <motion.path 
                    initial={{ d: "M 62 248 L 138 248 L 138 248 L 62 248 Z" }}
                    animate={{ d: isLegumePressDone 
                      ? "M 62 248 L 138 248 L 134 225 Q 100 228, 66 225 Z" 
                      : (isLegumePressing ? "M 62 248 L 138 248 L 136 235 Q 100 238, 64 235 Z" : "M 62 248 L 138 248 L 137 242 Q 100 244, 63 242 Z") 
                    }}
                    transition={{ duration: 1.5 }}
                    fill="url(#clearWaterGradLegume)"
                    stroke="rgba(56,189,248,0.25)"
                    strokeWidth="1"
                  />
                )}
              </g>
            </svg>
          </div>

          {/* Simulation button controls */}
          <div className="w-72 mt-5">
            {isLegumeCurdInPress && !isLegumePressDone ? (
              <button
                type="button"
                onClick={runLegumePress}
                disabled={isLegumePressing}
                className="w-full py-3.5 bg-gradient-to-r from-[#fbbf24] to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs uppercase rounded-xl tracking-widest shadow-[0_4px_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 transition-transform duration-100 hover:scale-[1.01]"
              >
                {isLegumePressing ? (
                  <>
                    <RotateCw size={14} className="animate-spin text-black" />
                    <span>{t('pressing_cake', { progress: legumePressProgress })}</span>
                  </>
                ) : (
                  <span>{t('apply_pressure')}</span>
                )}
              </button>
            ) : isLegumePressDone ? (
              <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 text-center text-xs font-mono text-[#fbbf24] flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 size={15} />
                <span>{t('isolate_cake_dehydrated')}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Total molecular yield statements */}
        <div className="flex flex-col w-full lg:w-1/4">
          {isLegumePressDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col bg-stone-900/90 border border-amber-500/30 p-5 rounded-2xl font-mono text-[9px] text-zinc-400 leading-normal gap-2.5 shadow-2xl w-full"
            >
              <div className="text-amber-400 border-b border-stone-850 pb-2 uppercase font-black tracking-widest flex items-center gap-1 text-[10px]">
                <CheckCircle2 size={13} className="text-[#fbbf24] animate-pulse" />
                {t('final_harvest_report')}
              </div>
              
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between border-b border-stone-850/50 pb-1">
                  <span>{t('initial_legume_stock')}</span>
                  <span className="text-white font-extrabold">{legumeWeight} G</span>
                </div>
                <div className="flex justify-between border-b border-stone-850/50 pb-1">
                  <span>{t('lpi_isolation_harvest')}</span>
                  <span className="text-amber-400 font-extrabold">{expectedLegumeLpiYieldG.toFixed(1)} G</span>
                </div>
                <div className="flex justify-between border-b border-stone-850/50 pb-1">
                  <span>{t('net_pure_globulins')}</span>
                  <span className="text-amber-400 font-extrabold">{expectedLegumePureProteinG.toFixed(1)} G</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>{t('reclaimed_starch_fraction')}</span>
                  <span className="text-[#00E676] font-extrabold">{expectedLegumeStarchG.toFixed(1)} G</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await generatePDFReport('lab', {
                    isLegume: true,
                    workflowName: language === 'ar' ? 'مسار استخلاص البروتين البقولي المكمل' : 'Leguminous Protein Extraction Pathway',
                    rawWeight: legumeWeight,
                    lpcYield: expectedLegumeLpiYieldG,
                    pureProtein: expectedLegumePureProteinG,
                    coProducts: expectedLegumeStarchG,
                    compost: legumeWeight * 0.15
                  }, language as any, t);
                }}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-[9px] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Download size={10} />
                {language === 'ar' ? 'تحميل التقرير المختبري الكامل' : 'Download Full Report (PDF)'}
              </button>

              <p className="font-sans text-[8px] text-stone-500 leading-relaxed pt-2 border-t border-stone-850/50">
                {t('legume_molecular_summary')}
              </p>
            </motion.div>
          )}
        </div>

      </div>
    );
  };

  const renderRealisticLeaf = (leaf: typeof washLeaves[0]) => {
    const dirtSpots = [
      { cx: 35, cy: 45, r: 2.6 },
      { cx: 55, cy: 35, r: 1.9 },
      { cx: 48, cy: 62, r: 3.3 },
      { cx: 28, cy: 28, r: 2.2 },
      { cx: 64, cy: 56, r: 1.6 },
    ];

    const droplets = [
      { cx: 42, cy: 52, r: 2.3 },
      { cx: 58, cy: 44, r: 1.7 },
      { cx: 32, cy: 38, r: 2.9 },
    ];

    const dLevel = leaf.dirtLevel / 100;
    const cleanFactor = leaf.cleanliness / 100;

    const geom = getLeafGeometry(selectedLeafId);

    // Dynamically choose theme colors for selected leaf species
    let baseColor = "#10b981";
    let lightColor = "#34d399";
    let darkColor = "#047857";

    const sId = selectedLeafId.toLowerCase();
    if (sId.includes('fig') && !sId.includes('sycamore')) {
      baseColor = "#059669";
      lightColor = "#34d399";
      darkColor = "#064e3b";
    } else if (sId.includes('mulberry')) {
      baseColor = "#0d9488";
      lightColor = "#2dd4bf";
      darkColor = "#115e59";
    } else if (sId.includes('sycamore')) {
      baseColor = "#047857";
      lightColor = "#10b981";
      darkColor = "#022c22";
    } else if (sId.includes('apricot')) {
      baseColor = "#15803d";
      lightColor = "#4ade80";
      darkColor = "#14532d";
    } else if (sId.includes('peach')) {
      baseColor = "#0891b2";
      lightColor = "#22d3ee";
      darkColor = "#164e63";
    }

    return (
      <svg className="w-full h-full select-none" viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.5))' }}>
        <defs>
          <linearGradient id={`leaf-grad-${leaf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cleanFactor > 0.55 ? baseColor : "#1a382c"} />
            <stop offset="50%" stopColor={cleanFactor > 0.55 ? lightColor : "#28523c"} />
            <stop offset="100%" stopColor={cleanFactor > 0.55 ? darkColor : "#152e22"} />
          </linearGradient>

          <radialGradient id={`dust-grad-${leaf.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#78350f" stopOpacity={0.65 * dLevel} />
            <stop offset="100%" stopColor="#5c4d3c" stopOpacity={0.15 * dLevel} />
          </radialGradient>

          <radialGradient id="drop-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="40%" stopColor="rgba(147,197,253,0.45)" />
            <stop offset="100%" stopColor="rgba(30,58,138,0.75)" />
          </radialGradient>
        </defs>

        {cleanFactor > 0.4 && (
          <path
            d={geom.outerPath}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.3"
            fill="none"
          />
        )}

        {/* Outer leaf base */}
        <path
          d={geom.outerPath}
          fill={`url(#leaf-grad-${leaf.id})`}
          className="transition-all duration-300"
        />

        {/* Dust outline */}
        <path
          d={geom.outerPath}
          fill={`url(#dust-grad-${leaf.id})`}
        />

        {/* Veins structure matching species */}
        <g stroke={cleanFactor > 0.5 ? "#a7f3d0" : "#456a50"} strokeWidth="1.7" strokeLinecap="round" opacity="0.85">
          {geom.veins.map((v, i) => (
            <path key={i} d={v.d} strokeWidth={v.strokeWidth || 1.4} />
          ))}
        </g>

        {dLevel > 0.04 && (
          <g fill="#4a3b22" opacity={dLevel}>
            {dirtSpots.map((spot, i) => (
              <circle key={i} cx={spot.cx} cy={spot.cy} r={spot.r} />
            ))}
          </g>
        )}

        {/* Dynamic glossy sheen overlay */}
        <path
          d={geom.outerPath}
          fill="rgba(255, 255, 255, 0.08)"
          opacity={cleanFactor > 0.35 ? 1 : 0.3}
          style={{ mixBlendMode: 'overlay' }}
        />

        {cleanFactor > 0.45 && (
          <g>
            {droplets.map((drop, i) => (
              <g key={i} style={{ filter: 'drop-shadow(0 1.5px 2px rgba(0,0,0,0.35))' }}>
                <circle cx={drop.cx} cy={drop.cy} r={drop.r} fill="url(#drop-grad)" />
                <circle cx={drop.cx - drop.r * 0.3} cy={drop.cy - drop.r * 0.3} r={drop.r * 0.25} fill="white" opacity="0.95" />
              </g>
            ))}
          </g>
        )}
      </svg>
    );
  };

  // --- INGREDIENTS CASCADE, SETTLING, AND SWIRLING ENGINE ---

  // 1. Water Pouring Action for Leaf Blender
  const triggerWaterPourLeaf = () => {
    if (isWaterPouringLeaf || isWaterInBlender) return;
    setIsWaterPouringLeaf(true);
    playSynthBeep(220, 'sine', 0.1);
    
    let currentVol = 0;
    const interval = setInterval(() => {
      currentVol += 4;
      setWaterVolumeLeaf(Math.min(100, currentVol));
      if (currentVol % 12 === 0) {
        playSynthBeep(250 + currentVol * 1.5, 'sine', 0.08);
      }
      if (currentVol >= 100) {
        clearInterval(interval);
        setIsWaterPouringLeaf(false);
        setIsWaterInBlender(true);
        playSynthBeep(523.25, 'sine', 0.18); // C5
      }
    }, 60);
  };

  // 2. Water Pouring Action for Legume Milling
  const triggerWaterPourLegume = () => {
    if (isWaterPouringLegume || isWaterInMilling) return;
    setIsWaterPouringLegume(true);
    playSynthBeep(200, 'triangle', 0.1);
    
    let currentVol = 0;
    const interval = setInterval(() => {
      currentVol += 4;
      setWaterVolumeLegume(Math.min(100, currentVol));
      if (currentVol % 12 === 0) {
        playSynthBeep(220 + currentVol * 1.8, 'triangle', 0.06);
      }
      if (currentVol >= 100) {
        clearInterval(interval);
        setIsWaterPouringLegume(false);
        setIsWaterInMilling(true);
        playSynthBeep(493.88, 'triangle', 0.18); // B4
      }
    }, 60);
  };

  // 3. Spawning leaf particles once loaded
  useEffect(() => {
    if (isLeafInBlender && blenderLeaves.length === 0) {
      const leafSpecs = [
        { id: 1, x: 45, y: -40, rotate: -45, scale: 0.9, baseScale: 0.9, speedY: 3, speedX: -0.8, rotateSpeed: -3, targetY: 145, bounceCount: 0 },
        { id: 2, x: 80, y: -75, rotate: 30, scale: 0.8, baseScale: 0.8, speedY: 3.5, speedX: 0.6, rotateSpeed: 4, targetY: 155, bounceCount: 0 },
        { id: 3, x: 110, y: -50, rotate: -15, scale: 0.95, baseScale: 0.95, speedY: 2.8, speedX: -0.3, rotateSpeed: -1.5, targetY: 150, bounceCount: 0 },
        { id: 4, x: 60, y: -105, rotate: 60, scale: 0.85, baseScale: 0.85, speedY: 3.2, speedX: 0.9, rotateSpeed: 5, targetY: 135, bounceCount: 0 },
        { id: 5, x: 95, y: -125, rotate: -60, scale: 0.75, baseScale: 0.75, speedY: 4, speedX: -0.6, rotateSpeed: -5, targetY: 140, bounceCount: 0 },
      ];
      setBlenderLeaves(leafSpecs);
    } else if (!isLeafInBlender) {
      setBlenderLeaves([]);
    }
  }, [isLeafInBlender]);

  // 4. Spawning Lego Grains once loaded
  useEffect(() => {
    if (isBeanInMilling && blenderGrains.length === 0) {
      const grainSpecs = Array.from({ length: 45 }).map((_, i) => {
        // Drop naturally from the top of the container (gravity-based motion)
        // Grains fall from a single point at container top center (96px)
        const initialX = 96 + (Math.random() - 0.5) * 12;
        
        // Stagger initial Y heights to form a cascading waterfall effect
        const initialY = -15 - (i * 10);
        
        const randomScale = 0.75 + Math.random() * 0.4;
        return {
          id: i,
          x: initialX,
          y: initialY,
          rotate: Math.random() * 360,
          scale: randomScale,
          baseScale: randomScale,
          speedY: 1.2 + Math.random() * 1.8,
          // Natural spread and slight randomness in trajectories, separating mid-air
          speedX: (Math.random() - 0.5) * 2.8, 
          targetY: 165,
          bounceCount: 0,
        };
      });
      setBlenderGrains(grainSpecs);
    } else if (!isBeanInMilling) {
      setBlenderGrains([]);
    }
  }, [isBeanInMilling]);

  // 5. Physics update loop for leaves & grains
  useEffect(() => {
    let animId: number;
    const tick = () => {
      // Leaf Update
      setBlenderLeaves((prev) => {
        if (prev.length === 0) return prev;
        
        // If blending is active, calculate swirling high-speed vortex trajectory
        if (isBlending) {
          return prev.map((leaf) => {
            const currentAngle = (leaf.id * 1.6) + (Date.now() * 0.024);
            // Spiral inwards
            const swirlingRadius = Math.max(12, 60 - (blendProgress * 0.45));
            const targetX = 96 + Math.cos(currentAngle) * swirlingRadius;
            const targetY = 145 - (Math.sin(currentAngle) * 45 * (blendProgress / 100)) - (blendProgress * 0.4);
            const targetScale = (leaf.baseScale || leaf.scale) * Math.max(0, 1 - (blendProgress / 100));
            return {
              ...leaf,
              x: targetX,
              y: targetY,
              rotate: leaf.rotate + 18,
              scale: targetScale,
            };
          });
        }

        // Standard gravity drop physics
        let moved = false;
        const nextLeaves = prev.map((leaf) => {
          if (leaf.y < leaf.targetY) {
            moved = true;
            // Gravity physics
            const g = 0.18;
            const nextSpeedY = leaf.speedY + g;
            const nextY = Math.min(leaf.targetY, leaf.y + nextSpeedY);
            const nextX = leaf.x + leaf.speedX;
            const nextRotate = leaf.rotate + leaf.rotateSpeed;

            if (nextY >= leaf.targetY && leaf.bounceCount < 2) {
              return {
                ...leaf,
                y: leaf.targetY,
                speedY: -leaf.speedY * 0.38, // rebound damper
                speedX: leaf.speedX * 0.5,
                rotateSpeed: -leaf.rotateSpeed * 0.5,
                bounceCount: leaf.bounceCount + 1
              };
            }
            return {
              ...leaf,
              y: nextY,
              x: nextX,
              rotate: nextRotate,
              speedY: nextSpeedY
            };
          }
          return leaf;
        });

        return moved ? nextLeaves : prev;
      });

      // Legume Grain Update
      setBlenderGrains((prev) => {
        if (prev.length === 0) return prev;

        if (isMilling) {
          return prev.map((grain) => {
            const currentAngle = (grain.id * 0.9) + (Date.now() * 0.028);
            const swirlingRadius = Math.max(8, 55 - (millingProgress * 0.4));
            const targetX = 96 + Math.cos(currentAngle) * swirlingRadius;
            const targetY = 145 - (Math.sin(currentAngle) * 35 * (millingProgress / 100)) - (millingProgress * 0.45);
            const targetScale = grain.baseScale * Math.max(0, 1 - (millingProgress / 100));
            return {
              ...grain,
              x: targetX,
              y: targetY,
              rotate: grain.rotate + 22,
              scale: targetScale
            };
          });
        }

        let moved = false;
        const nextGrains = prev.map((grain) => {
          // Dynamic settling height based on actual landing X to construct a gorgeous heap in the center
          const distanceFromCenter = Math.abs(grain.x - 96);
          const stackHeight = 14 + (grain.id % 8) * 1.8 - (distanceFromCenter * 0.16);
          const currentTargetY = Math.max(130, 172 - Math.max(2, stackHeight));

          // Retain motion if we haven't settled yet
          if (grain.y < currentTargetY || Math.abs(grain.speedY) > 0.08) {
            moved = true;

            // Gravity-based falling motion
            const g = 0.25;
            const nextSpeedY = grain.speedY + g;
            let nextY = grain.y + nextSpeedY;

            // Natural spread with slight horizontal deceleration
            let nextSpeedX = grain.speedX * 0.985;
            let nextX = grain.x + nextSpeedX;

            // Smooth container boundaries collision (bounce off glass walls)
            if (nextX < 34) {
              nextX = 34;
              nextSpeedX = -nextSpeedX * 0.4;
            } else if (nextX > 158) {
              nextX = 158;
              nextSpeedX = -nextSpeedX * 0.4;
            }

            let nextBounceCount = grain.bounceCount;
            let finalSpeedY = nextSpeedY;

            // Bottom landing collision with realistic bounce & damping
            if (nextY >= currentTargetY) {
              nextY = currentTargetY;
              if (grain.bounceCount < 4) {
                // Bounce back elegantly
                finalSpeedY = -nextSpeedY * 0.35;
                nextSpeedX = nextSpeedX * 0.55; // damp slide speed on floor
                nextBounceCount = grain.bounceCount + 1;
              } else {
                finalSpeedY = 0;
                nextSpeedX = 0;
              }
            }

            const nextRotate = grain.rotate + (nextSpeedX * 4.5) + (finalSpeedY * 0.6);

            return {
              ...grain,
              x: nextX,
              y: nextY,
              rotate: nextRotate,
              speedY: finalSpeedY,
              speedX: nextSpeedX,
              targetY: currentTargetY,
              bounceCount: nextBounceCount
            };
          }
          return grain;
        });

        return moved ? nextGrains : prev;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isBlending, isMilling, blendProgress, millingProgress]);

  // 6. Action: Tactile Power handler for Leaf Blender
  const runLeafBlendingPower = () => {
    if (isBlending || isBlendDone) return;
    if (!isLeafInBlender || !isWaterInBlender) {
      setLeafBlenderError("ERR: REQS MISSING");
      playSynthBeep(120, 'triangle', 0.24);
      setTimeout(() => setLeafBlenderError(""), 1600);
      return;
    }
    setBlendProgress(0);
    runBlenderGrinding();
  };

  // 7. Action: Tactile Power handler for Legume Milling
  const runLegumeMillingPower = () => {
    if (isMilling || isMillingDone) return;
    if (!isBeanInMilling || !isWaterInMilling) {
      setLegumeBlenderError("ERR: REQS MISSING");
      playSynthBeep(120, 'triangle', 0.24);
      setTimeout(() => setLegumeBlenderError(""), 1600);
      return;
    }
    setMillingProgress(0);
    runLegumeMilling();
  };

  // Step 3 Action: Grinding mills
  const runBlenderGrinding = () => {
    if (isBlending || isBlendDone) return;
    setIsBlending(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setBlendProgress(p);
      if (p % 15 === 0) playSynthBeep(120 + p * 1.5, 'square', 0.05);
      if (p >= 100) {
        clearInterval(interval);
        setIsBlending(false);
        setIsBlendDone(true);
        if (maxUnlockedStep < 4) setMaxUnlockedStep(4);
        playSynthBeep(587.33, 'sine', 0.22); // D5
        setTimeout(() => {
          setActiveStep(4);
          playSynthBeep(480, 'sine', 0.15);
        }, 1800);
      }
    }, 70);
  };

  // Step 4 Action: Filter juice
  const runSieveFiltration = () => {
    if (isFiltering1 || isFilter1Done) return;
    setIsFiltering1(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setFilterProgress(p);
      if (p % 10 === 0) playSynthBeep(440 - p * 1.2, 'sine', 0.06);
      if (p >= 100) {
        clearInterval(interval);
        setIsFiltering1(false);
        setIsFilter1Done(true);
        if (maxUnlockedStep < 5) setMaxUnlockedStep(5);
        playSynthBeep(659.25, 'sine', 0.22); // E5
        setTimeout(() => {
          setActiveStep(5);
          playSynthBeep(520, 'sine', 0.15);
        }, 1800);
      }
    }, 80);
  };

  const startLeafPouring = () => {
    if (isLeafPouring || isJuiceInHeater) return;
    setIsLeafPouring(true);
    setLeafPourProgress(0);
    playSynthBeep(220, 'triangle', 0.2);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setLeafPourProgress(currentProgress);
      if (currentProgress % 15 === 0) {
        playSynthBeep(300 + currentProgress * 2, 'sine', 0.04);
      }
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLeafPouring(false);
        setIsJuiceInHeater(true);
        playSynthBeep(523.25, 'sine', 0.2);
      }
    }, 70);
  };

  // Step 5 Action: Heat to Coagulate
  const runStoveHeating = () => {
    if (isHeating || isCoagulated) return;
    setIsHeating(true);
    let t = 24.0;
    const interval = setInterval(() => {
      t = Math.min(75, t + 0.7);
      setTemperature(Number(t.toFixed(1)));
      if (Math.floor(t) % 8 === 0 && t - Math.floor(t) < 0.7) {
        playSynthBeep(300 + t * 3, 'sine', 0.05);
      }
      if (t >= 75) {
        clearInterval(interval);
        setIsHeating(false);
        setIsCoagulated(true);
        if (maxUnlockedStep < 6) setMaxUnlockedStep(6);
        playSynthBeep(698.46, 'sine', 0.3); // F5
        setTimeout(() => {
          setActiveStep(6);
          playSynthBeep(560, 'sine', 0.15);
        }, 1800);
      }
    }, 60);
  };

  // Step 6 Action: Hydraulic press cake
  const runHydraulicPress = () => {
    if (isPressing || isPressDone) return;
    setIsPressing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setPressProgress(p);
      if (p % 10 === 0) playSynthBeep(80 + p * 4, 'triangle', 0.08);
      if (p >= 100) {
        clearInterval(interval);
        setIsPressing(false);
        setIsPressDone(true);
        if (maxUnlockedStep < 6) setMaxUnlockedStep(6);
        playSynthBeep(880, 'sine', 0.4); // A5
      }
    }, 80);
  };

  if (activeWorkflow === null) {
    return (
      <div id="interactive-lab-workspace" className="p-1 sm:p-2 bg-stone-900 border border-emerald-500/10 rounded-3xl relative overflow-hidden min-h-[500px] flex items-center justify-center">
        {renderLegumeSelectorScreen()}
      </div>
    );
  }

  return (
    <div id="interactive-lab-workspace" className="p-1 sm:p-2 bg-stone-900 border border-emerald-500/10 rounded-3xl relative overflow-hidden">
      
      {/* Immersive top strip with extremely minimal controls and big actions */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-stone-950/80 rounded-2xl border border-stone-800 gap-4 mb-4">
        
        {/* Minimal info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-450 animate-pulse">
            <FlaskConical size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {activeWorkflow === 'leaf' ? t('extractedStation') : t('legume_console_title')}
            </h3>
            <p className="text-[10px] text-zinc-500 font-sans font-medium">
              {activeWorkflow === 'leaf' ? t('dragInstructions') : t('legume_console_subtitle')}
            </p>
          </div>
        </div>

        {/* Quick Botanical Selector & Weights */}
        <div className="flex flex-wrap items-center gap-2">
          
          {activeWorkflow === 'leaf' ? (
            <>
              <select
                value={selectedLeafId}
                onChange={(e) => {
                  setSelectedLeafId(e.target.value);
                  const targetLeaf = allLeafTypes.find(l => l.id === e.target.value);
                  if (targetLeaf) setLeafWeight(targetLeaf.leafWeightG);
                  playSynthBeep(320);
                }}
                className="bg-stone-905 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-250 font-bold focus:outline-none focus:border-emerald-500/50"
              >
                {allLeafTypes.map((leaf) => (
                  <option key={leaf.id} value={leaf.id}>
                    {getLeafName(leaf)}
                  </option>
                ))}
              </select>

              {/* Slider for weight weight setting */}
              <div className="flex items-center gap-2 bg-stone-900 border border-stone-840 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] text-zinc-400 font-mono font-bold">{leafWeight}g</span>
                <input 
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={leafWeight}
                  onChange={(e) => {
                    setLeafWeight(Number(e.target.value));
                    playSynthBeep(200 + Number(e.target.value) * 0.1, 'sine', 0.05);
                  }}
                  className="w-16 sm:w-24 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <button
                onClick={() => setShowCustomLeafModal(true)}
                className="p-1.5 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all text-xs flex items-center gap-1.5"
                title={t('custom')}
              >
                <PlusCircle size={14} />
                <span className="hidden sm:inline text-[10px]">{t('custom')}</span>
              </button>

              <button
                onClick={() => {
                  playSynthBeep(300, 'sine', 0.15);
                  setActiveWorkflow(null);
                }}
                className="p-1.5 bg-stone-950 text-stone-400 border border-stone-800 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                title={t('change_sector')}
              >
                {t('change_sector')}
              </button>
            </>
          ) : (
            <>
              <select
                value={selectedLegumeId}
                onChange={(e) => {
                  setSelectedLegumeId(e.target.value);
                  const targetLegume = legumesList.find(l => l.id === e.target.value);
                  if (targetLegume) setLegumeWeight(targetLegume.weightG);
                  playSynthBeep(320);
                }}
                className="bg-stone-905 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-250 font-bold focus:outline-none focus:border-amber-500/50"
              >
                {legumesList.map((leg) => (
                  <option key={leg.id} value={leg.id}>
                    {getLegumeName(leg)}
                  </option>
                ))}
              </select>

              {/* Slider for grain weight setting */}
              <div className="flex items-center gap-2 bg-stone-900 border border-stone-840 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] text-zinc-400 font-mono font-bold">{legumeWeight}g</span>
                <input 
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={legumeWeight}
                  onChange={(e) => {
                    setLegumeWeight(Number(e.target.value));
                    playSynthBeep(200 + Number(e.target.value) * 0.1, 'sine', 0.05);
                  }}
                  className="w-16 sm:w-24 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <button
                onClick={() => {
                  playSynthBeep(300, 'sine', 0.15);
                  setActiveWorkflow(null);
                }}
                className="p-1.5 bg-stone-950 text-stone-400 border border-stone-800 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                title={t('change_sector')}
              >
                {t('change_sector')}
              </button>
            </>
          )}

          <button
            onClick={handleSkipAll}
            className={`p-1.5 px-2.5 bg-gradient-to-r ${
              activeWorkflow === 'leaf' 
                ? 'from-emerald-600/20 to-teal-600/20 text-emerald-400 border-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 hover:text-black' 
                : 'from-amber-600/20 to-yellow-600/20 text-amber-400 border-amber-500/20 hover:from-amber-500 hover:to-yellow-500 hover:text-black'
            } rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1`}
          >
            <Sparkles size={11} />
            {t('skip')}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 bg-stone-900 text-stone-400 border border-stone-800 hover:text-white rounded-lg text-[10px]"
          >
            {t('reset')}
          </button>
        </div>
      </div>
        {/* STICKY LINEAR MAP OF STAGES (Extremely clean, modern dots) */}
      <div className={`grid ${activeWorkflow === 'leaf' ? 'grid-cols-6' : 'grid-cols-7'} gap-2 bg-gradient-to-b from-stone-950 to-stone-900 border border-stone-850/60 p-2 sm:p-3 rounded-2xl mb-4`}>
        {(activeWorkflow === 'leaf' ? [
          { stepNum: 1, completed: isLeafWeighed, label: getStepLabel(1) },
          { stepNum: 2, completed: isWashDone, label: getStepLabel(2) },
          { stepNum: 3, completed: isBlendDone, label: getStepLabel(3) },
          { stepNum: 4, completed: isFilter1Done, label: getStepLabel(4) },
          { stepNum: 5, completed: isCoagulated, label: getStepLabel(5) },
          { stepNum: 6, completed: isPressDone, label: getStepLabel(6) }
        ] : [
          { stepNum: 1, completed: isLegumeWeighed, label: getLegumeStepLabel(1) },
          { stepNum: 2, completed: isLegumeWashDone, label: getLegumeStepLabel(2) },
          { stepNum: 3, completed: isMillingDone, label: getLegumeStepLabel(3) },
          { stepNum: 4, completed: isPhSeparated, label: getLegumeStepLabel(4) },
          { stepNum: 5, completed: isDecantDone, label: getLegumeStepLabel(5) },
          { stepNum: 6, completed: isLegumeCoagulated, label: getLegumeStepLabel(6) },
          { stepNum: 7, completed: isLegumePressDone, label: getLegumeStepLabel(7) }
        ]).map(({ stepNum, completed, label }) => {
          const isCurrent = activeStep === stepNum;

          return (
            <button
              key={stepNum}
              type="button"
              onClick={() => {
                setActiveStep(stepNum);
                playSynthBeep(250 + stepNum * 50);
              }}
              className={`py-2 sm:py-3 px-1 rounded-xl text-center border transition-all duration-300 relative ${
                isCurrent
                  ? activeWorkflow === 'leaf'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black border-emerald-400 shadow-lg shadow-emerald-500/25 scale-[1.04]'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black border-amber-400 shadow-lg shadow-amber-500/25 scale-[1.04]'
                  : completed
                    ? activeWorkflow === 'leaf'
                      ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/60 hover:text-emerald-300'
                      : 'bg-amber-950/30 text-amber-400 border-amber-500/40 hover:bg-amber-950/60 hover:text-amber-300'
                    : 'bg-stone-950/60 text-stone-400 border-stone-850 hover:border-stone-700 hover:bg-stone-900/60'
              }`}
            >
              <div className="text-[10px] sm:text-xs font-mono font-black leading-none flex items-center justify-center gap-1.5">
                {completed && <span className={activeWorkflow === 'leaf' ? 'text-emerald-400' : 'text-amber-400'}>✔</span>}
                <span className="truncate max-w-full">{label}</span>
              </div>
              {isCurrent && (
                <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b ${
                  activeWorkflow === 'leaf' ? 'bg-emerald-400 border-emerald-400/40' : 'bg-amber-400 border-amber-400/40'
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* LARGE GRAPHICAL CANVAS & DETAILED SIMULATED ENVIRONMENT */}
      <div 
        ref={constraintsRef} 
        className="w-full bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900 rounded-3xl border border-stone-800 p-4 sm:p-8 min-h-[500px] flex flex-col justify-between items-center relative overflow-hidden"
      >
        {/* Ambient watermark detailing active parameters */}
        {activeWorkflow === 'leaf' ? (
          <div className="absolute top-4 left-4 flex flex-col font-mono text-[8px] text-stone-605 space-y-0.5 tracking-wider pointer-events-none opacity-60">
            <span>{t('specimen')}: {getLeafName(activeLeaf).toUpperCase()}</span>
            <span>{t('reference_chassis')}: {leafWeight}G</span>
            <span>{t('estimated_concentrate_pyl')}: {expectedLpcYieldG.toFixed(1)}G</span>
            <span>{t('cellular_fluid_volume')}: {(leafWeight * 0.82).toFixed(0)}ML</span>
          </div>
        ) : (
          <div className="absolute top-4 left-4 flex flex-col font-mono text-[8px] text-stone-605 space-y-0.5 tracking-wider pointer-events-none opacity-60">
            <span>{t('legume_strain')}: {getLegumeName(activeLegume).toUpperCase()}</span>
            <span>{t('batch_stick_weight')}: {legumeWeight}G</span>
            <span>{t('est_globulin_purity')}: {((activeLegume.proteinG / activeLegume.cakeG) * 100).toFixed(1)}%</span>
            <span>{t('target_isoelectric_ph')}: {activeLegume.isoelectricPh}</span>
          </div>
        )}

        {/* Minimal localized instruction label of what to drag */}
        <div className="text-center max-w-lg mb-6 pointer-events-none">
          <span className={`text-[9px] font-mono uppercase ${
            activeWorkflow === 'leaf' 
              ? 'bg-emerald-950/80 text-[#00E676] border-emerald-500/40' 
              : 'bg-amber-950/80 text-amber-500 border-amber-500/40'
          } px-2.5 py-1.5 rounded-full border font-bold tracking-widest inline-block animate-pulse`}>
            {activeWorkflow === 'leaf' 
              ? t('step_title', { step: activeStep }) 
              : t('step_title', { step: activeStep, total: 7 })
            }
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white mt-2 drop-shadow-md">
            {activeWorkflow === 'leaf' 
              ? t(`instructions_${activeStep}`) 
              : t(`legume_instructions_${activeStep}`)
            }
          </h2>
        </div>

        {/* ==========================================
            BIG RENDERING DISPLAY - MAIN WORKSPACE
            ========================================== */}
        <div className="w-full flex-1 flex flex-col items-center justify-center my-4 relative min-h-[300px]">
          
          {activeWorkflow === 'leaf' && (
            <>
              {/* 1. WEIGHING STAGE */}
              {activeStep === 1 && (
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl animate-fade-in">
              
              {/* Leaf spec selection panel */}
              <div className="flex flex-col bg-stone-900/50 p-5 rounded-2xl border border-stone-850 w-full max-w-sm">
                <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-3 border-b border-stone-800 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  {t('leaf_specimen_selection')}
                </div>
                <div className="space-y-2.5">
                  {allLeafTypes.map((leaf) => {
                    const isActive = selectedLeafId === leaf.id;
                    return (
                      <button
                        key={leaf.id}
                        onClick={() => {
                          setSelectedLeafId(leaf.id);
                          setLeafWeight(leaf.leafWeightG);
                          playSynthBeep(330, 'sine', 0.1);
                        }}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isActive 
                            ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                            : 'bg-stone-950/40 border-stone-850 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-xs">{getLeafName(leaf)}</span>
                          <span className="text-[9px] font-mono text-stone-500 mt-0.5 animate-pulse">
                            {t('season')}: {
                              leaf.leafSeason === 'Autumn' ? t('autumn') :
                              leaf.leafSeason === 'Summer' ? t('summer') :
                              leaf.leafSeason === 'Spring' ? t('spring') :
                              leaf.leafSeason === 'Winter' ? t('winter') :
                              t('all_year')
                            }
                          </span>
                        </div>
                        <ChevronRight size={14} className={isActive ? 'text-emerald-400' : 'text-stone-600'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Draggable Specimen Shelf / Card */}
              <div className="flex flex-col items-center">
                {!isLeafWeighed ? (
                  <div className="text-center space-y-3 relative z-25">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{t('specimen_title_drag')}</div>
                    
                    <motion.div
                      drag
                      dragConstraints={constraintsRef}
                      dragElastic={0.4}
                      dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                      onDragStart={() => {
                        setDraggingItem('leaf');
                        playSynthBeep(260, 'sine', 0.1);
                      }}
                      onDragEnd={(e, info) => {
                        setDraggingItem(null);
                        if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                          setIsLeafWeighed(true);
                          setMaxUnlockedStep(2);
                          playSynthBeep(520, 'sine', 0.15);
                          setTimeout(() => {
                            setActiveStep(2);
                            playSynthBeep(350, 'sine', 0.12);
                          }, 1800);
                        }
                      }}
                      onClick={() => {
                        setIsLeafWeighed(true);
                        setMaxUnlockedStep(2);
                        playSynthBeep(520, 'sine', 0.15);
                        setTimeout(() => {
                          setActiveStep(2);
                          playSynthBeep(350, 'sine', 0.12);
                        }, 1800);
                      }}
                      whileHover={{ scale: 1.12, translateY: -5 }}
                      whileDrag={{ scale: 1.25, rotate: 10 }}
                      className="w-28 h-28 cursor-grab active:cursor-grabbing bg-stone-900 border-2 border-dashed border-emerald-400 p-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center relative group touch-none select-none transition-shadow"
                    >
                      {(() => {
                        const geom = getLeafGeometry(selectedLeafId);
                        return (
                          <svg className="w-16 h-16 filter drop-shadow-md" viewBox="0 0 100 100" fill="none">
                            <path d={geom.outerPath} fill="#10b981" />
                            {geom.veins.map((v, i) => (
                              <path key={i} d={v.d} stroke="#d1fae5" strokeWidth={v.strokeWidth || 2.5} strokeLinecap="round" />
                            ))}
                          </svg>
                        );
                      })()}
                      <span className="text-[8px] font-mono text-emerald-400 font-extrabold uppercase mt-1">
                        {t('grab_me')}
                      </span>
                    </motion.div>
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-stone-950/40 border border-stone-850 rounded-2xl flex items-center justify-center opacity-30">
                    <span className="text-[10px] font-mono text-zinc-650 uppercase">{t('placed')}</span>
                  </div>
                )}
              </div>

              {/* Glowing Arrow Indicator */}
              {!isLeafWeighed && (
                <div className="hidden md:flex flex-col items-center text-emerald-500 animate-pulse">
                  <ArrowRight size={24} />
                  <span className="text-[8px] font-mono mt-1 uppercase tracking-widest">{t('to_scale')}</span>
                </div>
              )}

              {/* Real Weight Digital Bench Scale */}
              <div className="flex flex-col items-center relative z-10 w-80">
                
                {/* Scale Plate & Drop Target */}
                <div className="w-64 h-12 bg-gradient-to-r from-stone-500 via-stone-300 to-stone-600 rounded-xl border-b-8 border-stone-700 shadow-2xl flex items-center justify-center relative">
                  
                  {isLeafWeighed ? (
                    <motion.div
                      initial={{ y: -80, scale: 0.1, opacity: 0 }}
                      animate={{ y: -24, scale: 1.25, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className="absolute z-20"
                    >
                      {(() => {
                        const geom = getLeafGeometry(selectedLeafId);
                        return (
                          <svg className="w-24 h-24 filter drop-shadow-[0_8px_16px_rgba(16,185,129,0.45)]" viewBox="0 0 100 100" fill="none">
                            <path d={geom.outerPath} fill="#047857" stroke="#34d399" strokeWidth="2" />
                            {geom.veins.map((v, i) => (
                              <path key={i} d={v.d} stroke="#a7f3d0" strokeWidth={v.strokeWidth || 2} strokeLinecap="round" />
                            ))}
                          </svg>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <div className={`absolute -top-16 w-52 h-16 border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 ${
                      draggingItem === 'leaf'
                        ? 'border-emerald-400 bg-emerald-500/20 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                        : 'border-emerald-500/50 bg-emerald-500/5 animate-pulse'
                    }`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                        draggingItem === 'leaf' ? 'text-emerald-300' : 'text-[#00E676]'
                      }`}>
                        🎯 {t('drop_target_scale')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Console base with display screen */}
                <div className="w-72 bg-gradient-to-b from-stone-900 to-stone-950 border-x-2 border-b-2 border-stone-800 p-5 rounded-b-3xl shadow-2xl flex flex-col items-center gap-3 mt-0.5">
                  <div className="w-full bg-black border border-stone-850 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">{t('measured_weight')}</span>
                    <span className={`font-mono text-2xl font-black tracking-widest ${isLeafWeighed ? 'text-[#00E676] drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'text-stone-800'}`}>
                      {isLeafWeighed ? `${leafWeight} g` : '0.00 g'}
                    </span>
                  </div>
                  {isLeafWeighed && (
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-black tracking-widest animate-pulse flex items-center gap-1.5">
                      <CheckCircle2 size={12} />
                      {t('calibration_success')}
                    </span>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* 2. ULTRASONIC AGITATION WASH STAGE */}
          {activeStep === 2 && (
            <div 
              className={`w-full flex flex-col md:flex-row items-center justify-center gap-10 max-w-3xl transition-all duration-700 ${
                isWashAgitating ? 'scale-[1.03] rotate-[0.1deg]' : ''
              }`}
            >
              {/* LEFT COLUMN: Organic Leaf Preparation Tray (The Bench) */}
              <div className="flex flex-col items-center bg-stone-900/60 p-6 rounded-3xl border border-stone-800/80 shadow-2xl backdrop-blur-md w-full max-w-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/30 to-emerald-500/20" />
                
                {/* Visual Label */}
                <div className="w-full justify-between flex items-center mb-4 pb-2 border-b border-stone-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-wider">
                      {t('specimen_prep_tray')}
                    </span>
                    <span className="text-[8px] font-sans text-stone-500">
                      {t('drag_leaves_click_submerge')}
                    </span>
                  </div>
                  <span className="text-[7.5px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {washLeaves.filter(l => l.isSubmerged).length} / 3 {t('submerged')}
                  </span>
                </div>

                {/* Leaves selection deck container */}
                <div className="flex justify-center gap-4 py-4 w-full relative min-h-[140px]">
                  {washLeaves.map((leaf) => {
                    if (leaf.isSubmerged) {
                      return (
                        <div 
                          key={leaf.id}
                          className="w-20 h-20 bg-stone-950/20 border border-stone-850 rounded-xl flex items-center justify-center opacity-25 select-none"
                        >
                          <CheckCircle2 size={16} className="text-emerald-500/40" />
                        </div>
                      );
                    }
                    return (
                      <motion.div
                        key={leaf.id}
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.35}
                        dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                        onDragStart={() => setDraggingItem('wash_leaves')}
                        onDragEnd={(e, info) => {
                          setDraggingItem(null);
                          if (Math.abs(info.offset.x) > 55 || Math.abs(info.offset.y) > 55) {
                            submergeLeaf(leaf.id);
                          }
                        }}
                        onClick={() => {
                          submergeLeaf(leaf.id);
                        }}
                        whileHover={{ 
                          scale: 1.15, 
                          translateY: -6, 
                          rotate: leaf.rotation + 5,
                          boxShadow: '0 12px 24px rgba(16,185,129,0.2)'
                        }}
                        whileDrag={{ 
                          scale: 1.25, 
                          rotate: -15, 
                          zIndex: 50,
                          cursor: 'grabbing' 
                        }}
                        className="w-20 h-20 cursor-grab active:cursor-grabbing bg-stone-950 border border-stone-800 rounded-2xl flex flex-col items-center justify-center relative shadow-lg group touch-none select-none"
                      >
                        <div className="absolute inset-0 rounded-2xl border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors" />
                        
                        <div className="w-16 h-16 p-1">
                          {renderRealisticLeaf(leaf)}
                        </div>

                        <span className="absolute bottom-1 text-[7px] font-mono uppercase tracking-widest text-stone-500 opacity-80 group-hover:text-emerald-400 font-bold transition-colors">
                          {leaf.type === 'pointed' && t('pointed')}
                          {leaf.type === 'round' && t('round')}
                          {leaf.type === 'textured' && t('textured')}
                        </span>
                        
                        <div className="absolute top-1 left-1.5 right-1.5 h-0.5 bg-stone-850 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600/80" style={{ width: `${leaf.dirtLevel}%` }} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Helpful prompt */}
                <div className="mt-2 text-center text-[8.5px] text-stone-400 font-sans leading-relaxed">
                  {t('leaf_detailing_hint')}
                </div>
              </div>

              {/* CENTER COLUMN: Interactive Wash Basin & Faucet System */}
              <div className="flex flex-col items-center relative w-full max-w-[340px]">
                
                {/* Physical Chrome Water Faucet */}
                <div className="w-full flex justify-center h-16 relative">
                  <div className="absolute top-2 w-14 h-6 border-t-[8px] border-r-[8px] border-stone-400 rounded-tr-lg right-[42%] z-0" />
                  <div className="absolute top-8 w-4 h-3 bg-gradient-to-r from-stone-500 to-stone-300 rounded-b left-[44%] z-10 border-b border-stone-600 shadow-md">
                    <div className="absolute bottom-0 inset-x-0.5 h-0.5 bg-stone-900" />
                  </div>

                  {/* Rotary Handle Valve Knob */}
                  <div className="absolute top-1 right-[36%] z-20 flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: (faucetFlow / 100) * 180 }}
                      onClick={toggleFaucet}
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-stone-300 via-stone-400 to-stone-500 border border-stone-600 cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                    >
                      <div className="w-1 h-3 bg-stone-700 rounded" />
                    </motion.div>
                    <span className="text-[6.5px] font-mono font-black mt-1 text-stone-500 tracking-wider">
                      {faucetFlow > 0 ? 'FLOW ON' : 'TURN TAP'}
                    </span>
                  </div>
                </div>

                {/* Submersion Bowl Liquid Tank */}
                <motion.div 
                  animate={bowlShaking ? {
                    x: [0, -6, 6, -4, 4, 0],
                    y: [0, 2, -2, 1, -1, 0]
                  } : {}}
                  transition={{ duration: 0.3 }}
                  className={`w-80 h-52 border-4 rounded-b-[44px] relative overflow-hidden flex flex-col justify-end items-center pb-6 shadow-2xl animate-none transition-all duration-300 ${
                    draggingItem === 'wash_leaves'
                      ? 'border-emerald-400 bg-stone-900/60 scale-102 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                      : 'border-stone-700/90 bg-stone-950/80'
                  }`}
                  style={{
                    borderRadius: '8px 8px 44px 44px',
                    borderColor: draggingItem === 'wash_leaves' ? '#10b981' : '#2e2e2c',
                    boxShadow: 'inset 0 0 25px rgba(0,0,0,0.9), 0 25px 50px -12px rgba(0,0,0,0.8)'
                  }}
                >
                  {!washLeaves.some(l => l.isSubmerged) && (
                    <div className={`absolute inset-x-6 inset-t-10 inset-b-6 border border-dashed rounded-b-[30px] flex flex-col items-center justify-center z-10 pointer-events-none transition-all duration-300 ${
                      draggingItem === 'wash_leaves'
                        ? 'border-emerald-400/60 bg-emerald-500/10 scale-102 animate-pulse'
                        : 'border-blue-500/20 bg-blue-500/0 animate-pulse'
                    }`}>
                      <Droplets size={24} className={`mb-2 transition-colors ${draggingItem === 'wash_leaves' ? 'text-emerald-400' : 'text-blue-500/30'}`} />
                      <span className={`text-[8px] font-mono font-bold uppercase tracking-widest text-center px-4 transition-colors ${draggingItem === 'wash_leaves' ? 'text-emerald-300' : 'text-blue-400/80'}`}>
                        {t('drop_zone_sonic')}
                      </span>
                    </div>
                  )}

                  {/* Faucet Stream */}
                  {faucetFlow > 5 && (
                    <svg className="absolute top-0 w-8 h-full left-[43.5%] pointer-events-none z-10" viewBox="0 0 30 200">
                      <defs>
                        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(186, 230, 253, 0.5)" />
                          <stop offset="35%" stopColor="rgba(255, 255, 255, 0.95)" />
                          <stop offset="70%" stopColor="rgba(147, 197, 253, 0.6)" />
                          <stop offset="100%" stopColor="rgba(56, 189, 248, 0.4)" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        animate={{ d: [
                          "M 10 0 Q 8 50 12 100 T 10 200 L 20 200 Q 18 100 22 50 T 20 0 Z",
                          "M 12 0 Q 14 50 10 100 T 12 200 L 18 200 Q 16 100 20 50 T 18 0 Z",
                          "M 10 0 Q 8 50 12 100 T 10 200 L 20 200 Q 18 100 22 50 T 20 0 Z"
                        ]}}
                        transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                        fill="url(#streamGrad)"
                      />
                    </svg>
                  )}

                  {/* Water level layout */}
                  {washWaterLevel > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${washWaterLevel * 0.9}%` }}
                      className="absolute inset-x-0 bottom-0 bg-blue-500/15 border-t-2 border-blue-400/50 z-0 overflow-hidden"
                      style={{
                        background: 'linear-gradient(to top, rgba(14,165,233,0.2) 0%, rgba(56,189,248,0.12) 75%, rgba(186,230,253,0.35) 100%)'
                      }}
                    >
                      {isWashAgitating && (
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.15),transparent)] animate-pulse" />
                      )}

                      <svg className="absolute top-0 inset-x-0 h-4 w-full" viewBox="0 0 300 16" preserveAspectRatio="none">
                        <motion.path
                          animate={{ d: [
                            "M 0 8 Q 75 12 150 8 T 300 8 L 300 16 L 0 16 Z",
                            "M 0 8 Q 75 4 150 8 T 300 8 L 300 16 L 0 16 Z",
                            "M 0 8 Q 75 12 150 8 T 300 8 L 300 16 L 0 16 Z"
                          ]}}
                          transition={{ repeat: Infinity, duration: isWashAgitating ? 0.35 : 1.2, ease: "easeInOut" }}
                          fill="rgba(147, 197, 253, 0.4)"
                        />
                      </svg>
                    </motion.div>
                  )}

                  {/* Spawning particles */}
                  {bowlParticles.map((pt) => (
                    <div
                      key={pt.id}
                      className="absolute rounded-full pointer-events-none z-10"
                      style={{
                        left: `${pt.x}px`,
                        top: `${pt.y}px`,
                        width: `${pt.size}px`,
                        height: `${pt.size}px`,
                        background: pt.color,
                        opacity: pt.alpha,
                        boxShadow: pt.type === 'bubble' ? '0 0 4px rgba(255,255,255,0.4)' : 'none'
                      }}
                    />
                  ))}

                  {/* Submerged active leaves */}
                  <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
                    {washLeaves.map((leaf) => {
                      if (!leaf.isSubmerged) return null;
                      return (
                        <motion.div
                          key={leaf.id}
                          animate={isWashAgitating ? {
                            x: leaf.x,
                            y: leaf.y,
                            rotate: leaf.rotation,
                            scale: leaf.scale * 1.05
                          } : {
                            x: leaf.x,
                            y: leaf.y,
                            rotate: leaf.rotation,
                            scale: leaf.scale
                          }}
                          transition={{ type: 'spring', damping: 15 }}
                          className="absolute w-24 h-24"
                          style={{
                            left: '32%',
                            top: '15%',
                            transformOrigin: 'center center'
                          }}
                        >
                          {renderRealisticLeaf(leaf)}
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none z-20" />
                </motion.div>

                {/* Direct Ultrasonic control interface */}
                <div className="w-80 mt-4 text-center">
                  {washLeaves.some(l => l.isSubmerged) && !isWashDone ? (
                    <div className="space-y-3">
                      {washWaterLevel < 40 ? (
                        <div className="bg-blue-950/40 p-2.5 rounded-xl border border-blue-500/25 text-[9px] font-mono text-blue-300 animate-pulse">
                          {t('turn_faucet_ultrasonic')}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={runWashAgitation}
                          disabled={isWashAgitating}
                          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-[#00E676] hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-xs uppercase rounded-xl tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 border-b-2 border-emerald-700 active:scale-98"
                        >
                          {isWashAgitating ? (
                            <>
                              <RotateCw size={14} className="animate-spin text-black" />
                              <span>{t('sonic_decontaminating', { progress: washProgress })}</span>
                            </>
                          ) : (
                            <span>{t('start_ultrasonic_wash')}</span>
                          )}
                        </button>
                      )}
                    </div>
                  ) : isWashDone ? (
                    <div className="bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/20 text-center text-xs font-mono text-[#00E676] flex items-center justify-center gap-2 animate-bounce">
                      <CheckCircle2 size={15} />
                      <span>{t('cells_sterilized')}</span>
                    </div>
                  ) : (
                    <div className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mt-2">
                      {t('awaiting_specimen_loading')}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* 3. CELL RUPTURE & MILLING STAGE */}
          {activeStep === 3 && (
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl">
              
              {/* Draggables list (Left panel) */}
              <div className="flex md:flex-col gap-4 relative z-20">
                
                {/* 1. Leaf Specimen Card */}
                {!isLeafInBlender ? (
                  <motion.div
                    drag
                    dragConstraints={constraintsRef}
                    dragElastic={0.4}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                    onDragStart={() => setDraggingItem('blend_leaf')}
                    onDragEnd={(e, info) => {
                      setDraggingItem(null);
                      if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                        setIsLeafInBlender(true);
                        playSynthBeep(300);
                      }
                    }}
                    onClick={() => {
                      setIsLeafInBlender(true);
                      playSynthBeep(300);
                    }}
                    whileHover={{ scale: 1.08, translateY: -2 }}
                    className="cursor-grab active:cursor-grabbing bg-stone-900 border border-emerald-500/40 rounded-xl p-3 flex flex-col items-center justify-center w-28 h-28 shadow-xl text-center group transition-all hover:bg-stone-850 touch-none select-none"
                  >
                    <div className="relative p-2 bg-emerald-950/40 rounded-lg mb-1 group-hover:scale-110 transition-transform">
                      {(() => {
                        const geom = getLeafGeometry(selectedLeafId);
                        return (
                          <svg className="w-10 h-10 filter drop-shadow-[0_4px_6px_rgba(16,185,129,0.3)]" viewBox="0 0 100 100" fill="none">
                            <path d={geom.outerPath} fill="#10b981" />
                            {geom.veins.map((v, i) => (
                              <path key={i} d={v.d} stroke="#a7f3d0" strokeWidth={v.strokeWidth || 2.5} strokeLinecap="round" />
                            ))}
                          </svg>
                        );
                      })()}
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 font-extrabold tracking-wider">{t('fresh_leaf')}</span>
                    <span className="text-[7px] text-stone-500 font-sans mt-0.5">{t('drag_or_tap')}</span>
                  </motion.div>
                ) : (
                  <div className="w-28 h-28 bg-stone-950/20 border border-stone-900 rounded-xl flex flex-col items-center justify-center opacity-40 text-center select-none">
                    <CheckCircle2 size={18} className="text-emerald-500 mb-1" />
                    <span className="text-[8px] font-mono text-zinc-550 uppercase font-bold">{t('leaf_loaded')}</span>
                  </div>
                )}

                {/* 2. Water Beaker Draggable */}
                {!isWaterInBlender && !isWaterPouringLeaf ? (
                  <motion.div
                    drag
                    dragConstraints={constraintsRef}
                    dragElastic={0.4}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                    onDragStart={() => setDraggingItem('blend_water')}
                    onDragEnd={(e, info) => {
                      setDraggingItem(null);
                      if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                        triggerWaterPourLeaf();
                      }
                    }}
                    onClick={() => {
                      triggerWaterPourLeaf();
                    }}
                    whileHover={{ scale: 1.08, translateY: -2 }}
                    className="cursor-grab active:cursor-grabbing bg-stone-900 border border-sky-400/40 rounded-xl p-3 flex flex-col items-center justify-center w-28 h-28 shadow-xl text-center group transition-all hover:bg-stone-850 touch-none select-none"
                  >
                    <div className="relative p-2 bg-sky-950/30 rounded-lg mb-1 group-hover:scale-110 transition-transform">
                      <Droplets size={24} className="text-sky-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] font-mono text-sky-400 font-extrabold tracking-wider">{t('solvent_h2o')}</span>
                    <span className="text-[7px] text-stone-500 font-sans mt-0.5">{t('drag_or_tap')}</span>
                  </motion.div>
                ) : (
                  <div className="w-28 h-28 bg-stone-950/20 border border-stone-900 rounded-xl flex flex-col items-center justify-center opacity-40 text-center select-none">
                    <CheckCircle2 size={18} className="text-sky-400 mb-1" />
                    <span className="text-[8px] font-mono text-zinc-550 uppercase font-bold">
                      {isWaterPouringLeaf ? t('pouring') : t('h2o_poured')}
                    </span>
                  </div>
                )}
              </div>

              {/* Realistic High-Speed Laboratory Blender Assembly */}
              <div className="flex flex-col items-center relative z-10">
                
                {/* Blender Assembly Stand */}
                <div className="relative flex flex-col items-center select-none">
                  
                  {/* Glass Jar Pitcher */}
                  <div className={`w-48 h-56 bg-gradient-to-b from-sky-400/10 via-sky-500/5 to-emerald-500/10 border-2 rounded-b-xl rounded-t-[20px] relative overflow-hidden flex flex-col justify-end items-center pb-8 shadow-[inset_0_0_30px_rgba(14,165,233,0.1),0_15px_30px_rgba(0,0,0,0.5)] z-10 transition-all duration-300 ${
                    draggingItem === 'blend_leaf' || draggingItem === 'blend_water'
                      ? 'border-emerald-400 bg-emerald-950/20 scale-102 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                      : 'border-stone-400/60'
                  }`}>
                    
                    {/* Measurement graduation markings */}
                    <div className="absolute left-3.5 top-8 flex flex-col gap-4 font-mono text-[7px] text-sky-400/60 font-semibold select-none">
                      <span>— 600m L</span>
                      <span>— 400m L</span>
                      <span>— 200m L</span>
                    </div>

                    {/* Molded Glass Pitcher side-handle */}
                    <div className="absolute right-0 top-12 w-5 h-28 border-4 border-l-0 border-stone-400/50 rounded-r-2xl bg-stone-900/40 -mr-[4px] shadow-sm flex items-center justify-center" />

                    {/* Active Drag-and-drop targets / empty indicator */}
                    {(!isLeafInBlender || (!isWaterInBlender && !isWaterPouringLeaf)) && (
                      <div className={`absolute inset-4 m-1.5 border-2 border-dashed rounded-b-lg rounded-t-xl flex flex-col items-center justify-center z-25 text-center px-4 transition-all duration-300 ${
                        draggingItem === 'blend_leaf' || draggingItem === 'blend_water'
                          ? 'border-emerald-400 bg-emerald-950/25 scale-101 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse'
                          : 'border-emerald-500/30 bg-emerald-950/5 animate-pulse'
                      }`}>
                        <span className="text-[10px] font-mono text-[#00E676] font-extrabold uppercase tracking-widest flex items-center gap-1">
                          <RotateCw size={11} className="animate-spin text-emerald-400" />
                          {t('glass_chamber')}
                        </span>
                        <div className="text-[7.5px] font-mono text-stone-400 mt-2 flex flex-col gap-0.5">
                          <span>[{isLeafInBlender ? '🌿 OK' : t('leaf_missing')}]</span>
                          <span>[{isWaterInBlender ? '💧 OK' : t('water_missing')}]</span>
                        </div>
                      </div>
                    )}

                    {/* Water pouring stream from the top */}
                    {isWaterPouringLeaf && (
                      <div className="absolute inset-x-0 top-0 h-full pointer-events-none z-20 flex justify-center">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: '100%', opacity: [0.8, 1, 0.9] }}
                          transition={{ duration: 0.2 }}
                          className="w-4 bg-gradient-to-r from-sky-300/40 via-white/80 to-sky-450/50 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                          style={{
                            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                          }}
                        />
                        {/* Ripple splatters splash at bottom landing */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                y: [-4, Math.random() * -30 - 15],
                                x: [0, (Math.random() - 0.5) * 45],
                                scale: [0.5, 1.3, 0.2],
                                opacity: [1, 0.8, 0]
                              }}
                              transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.05 }}
                              className="absolute w-2.5 h-2.5 rounded-full bg-sky-200/90"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submerged / Floating foliage with real-time grav-drop physics coordinates */}
                    {blenderLeaves.map((leaf) => (
                      <motion.div
                        key={leaf.id}
                        style={{
                          left: `${leaf.x}px`,
                          top: `${leaf.y}px`,
                          rotate: `${leaf.rotate}deg`,
                          scale: leaf.scale,
                          opacity: Math.max(0, 1 - (blendProgress / 100)),
                          position: 'absolute',
                        }}
                        className="w-11 h-11 z-15 pointer-events-none filter drop-shadow-[0_4px_7px_rgba(0,0,0,0.65)]"
                      >
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                          {(() => {
                            const geom = getLeafGeometry(selectedLeafId);
                            return (
                              <>
                                <path d={geom.outerPath} fill="#047857" />
                                {geom.veins.map((v, i) => (
                                  <path key={i} d={v.d} stroke="#a7f3d0" strokeWidth={v.strokeWidth || 3} strokeLinecap="round" />
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </motion.div>
                    ))}

                    {/* Submerged Foliage / Fluid simulation layers */}
                    {(isWaterInBlender || isWaterPouringLeaf) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ 
                          height: isBlending ? '84%' : `${waterVolumeLeaf * 0.48}%`,
                        }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className="absolute inset-x-0 bottom-0 z-10 overflow-hidden flex items-center justify-center border-t border-sky-450/30"
                        style={{
                          background: (() => {
                            const p = blendProgress / 100; // 0 to 1
                            let rBottom = 14, gBottom = 165, bBottom = 233, aBottom = 0.35;
                            let rTop = 56, gTop = 189, bTop = 248, aTop = 0.12;
                            if (isBlending || isBlendDone) {
                              if (p < 0.3) {
                                const localP = p / 0.3;
                                rBottom = Math.round(14 + (56 - 14) * localP);
                                gBottom = Math.round(165 + (185 - 165) * localP);
                                bBottom = Math.round(233 + (129 - 233) * localP);
                                aBottom = 0.35 + (0.55 - 0.35) * localP;

                                rTop = Math.round(56 + (110 - 56) * localP);
                                gTop = Math.round(189 + (210 - 189) * localP);
                                bTop = Math.round(248 + (160 - 248) * localP);
                                aTop = 0.12 + (0.35 - 0.12) * localP;
                              } else if (p < 0.7) {
                                const localP = (p - 0.3) / 0.4;
                                rBottom = Math.round(56 + (5 - 56) * localP);
                                gBottom = Math.round(185 + (150 - 185) * localP);
                                bBottom = Math.round(129 + (105 - 129) * localP);
                                aBottom = 0.55 + (0.8 - 0.55) * localP;

                                rTop = Math.round(110 + (25 - 110) * localP);
                                gTop = Math.round(210 + (170 - 210) * localP);
                                bTop = Math.round(160 + (115 - 160) * localP);
                                aTop = 0.35 + (0.65 - 0.35) * localP;
                              } else {
                                const localP = (p - 0.7) / 0.3;
                                rBottom = Math.round(5 + (4 - 5) * localP);
                                gBottom = Math.round(150 + (120 - 150) * localP);
                                bBottom = Math.round(105 + (87 - 105) * localP);
                                aBottom = 0.8 + (0.95 - 0.8) * localP;

                                rTop = Math.round(25 + (16 - 25) * localP);
                                gTop = Math.round(170 + (185 - 170) * localP);
                                bTop = Math.round(115 + (129 - 115) * localP);
                                aTop = 0.65 + (0.82 - 0.65) * localP;
                              }
                            }
                            return `linear-gradient(to top, rgba(${rBottom}, ${gBottom}, ${bBottom}, ${aBottom}) 0%, rgba(${rTop}, ${gTop}, ${bTop}, ${aTop}) 100%)`;
                          })()
                        }}
                      >
                        {isBlending ? (
                          /* High-rpm swirling vortex fluid effect */
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            
                            {/* Realistic physical dipping vortex shape as fluid surface */}
                            <svg className="absolute top-0 inset-x-0 h-8 w-full text-transparent overflow-visible pointer-events-none" viewBox="0 0 200 40" preserveAspectRatio="none">
                              <path 
                                d="M0,0 Q100,28 200,0 L200,40 L0,40 Z" 
                                fill={`rgb(${Math.max(4, Math.round(14 - (blendProgress / 100) * 10))}, ${Math.round(165 + (blendProgress / 100) * (120 - 165))}, ${Math.round(233 + (blendProgress / 100) * (87 - 233))})`} 
                                className="opacity-40"
                              />
                            </svg>

                            {/* Outer Swirling Vortex curves */}
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: Math.max(0.06, 0.45 - (blendProgress * 0.004)), ease: 'linear' }}
                              className="absolute inset-[4px] border-4 border-dashed border-emerald-150/45 rounded-full opacity-60 filter blur-[0.5px]"
                            />
                            <motion.div 
                              animate={{ rotate: -360 }}
                              transition={{ repeat: Infinity, duration: Math.max(0.09, 0.65 - (blendProgress * 0.005)), ease: 'linear' }}
                              className="absolute inset-[20px] border-2 border-double border-emerald-300/40 rounded-full opacity-75"
                            />

                            {/* Swirling orbiting satellite cell particles */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: Math.max(0.12, 0.8 - (blendProgress * 0.0065)), ease: 'linear' }}
                                className="w-48 h-48 rounded-full flex items-center justify-center relative scale-110"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
                                  const radius = 18 + i * 2.5; // varied orbit radii
                                  const angle = i * (Math.PI / 6); // distributed angles
                                  const x = Math.cos(angle) * radius;
                                  const y = Math.sin(angle) * radius;
                                  const particleSize = 1.5 + (i % 3) * 1.5;
                                  
                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        left: `calc(50% + ${x}px - ${particleSize/2}px)`,
                                        top: `calc(50% + ${y}px - ${particleSize/2}px)`,
                                        width: `${particleSize}px`,
                                        height: `${particleSize}px`,
                                        backgroundColor: i % 2 === 0 ? '#a7f3d0' : '#34d399',
                                      }}
                                      className="rounded-full absolute shadow-inner opacity-75 filter blur-[0.3px]"
                                    />
                                  );
                                })}
                              </motion.div>
                            </div>

                            {/* Central vertical spiraling tornado funnel line */}
                            <div className="absolute w-5 h-full bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent flex flex-col justify-around items-center py-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/45 opacity-60 animate-ping" />
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 opacity-50 animate-ping delay-75" />
                              <div className="w-1.5 h-1.5 rounded-full bg-white/45 opacity-60 animate-ping delay-150" />
                            </div>

                            <div className="z-20 bg-stone-950/90 px-2.5 py-1 rounded-md border border-[#00E676]/30 text-center shadow-lg">
                              <span className="text-[7.5px] font-mono font-black tracking-widest text-[#00E676] uppercase block animate-pulse">
                                {t('rupturing_walls')}
                              </span>
                              <span className="text-[6.5px] font-mono text-zinc-400 font-bold">12,500 RPM</span>
                            </div>
                          </div>
                        ) : (
                          /* Static waves & ripples surface movement */
                          <div className="absolute inset-[2px] flex flex-col justify-end p-2 md:p-3 overflow-hidden">
                            <svg className="w-full h-4 fill-sky-300/25 absolute top-0 inset-x-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                              <motion.path
                                animate={{ d: [
                                  'M0 10 Q25 5, 50 10 T100 10 L100 20 L0 20 Z',
                                  'M0 10 Q25 15, 50 10 T100 10 L100 20 L0 20 Z',
                                  'M0 10 Q25 5, 50 10 T100 10 L100 20 L0 20 Z'
                                ]}}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                              />
                            </svg>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Heavy Steel Rotor & Spline shaft Assembly */}
                    <motion.div
                      animate={isBlending ? { rotate: 1440 } : {}}
                      transition={{ repeat: Infinity, duration: 0.08, ease: 'linear' }}
                      className="absolute bottom-3 w-28 h-4 flex items-center justify-center z-20"
                    >
                      {/* Left sharp blade lobe */}
                      <div className="w-12 h-1.5 bg-gradient-to-r from-stone-400 to-stone-200 rounded-l skew-y-3 shadow-md" />
                      {/* Core spindle nut */}
                      <div className="w-4 h-4 bg-stone-700 rounded-full border border-stone-500 shadow-lg flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-stone-350 rounded-full" />
                      </div>
                      {/* Right sharp blade lobe */}
                      <div className="w-12 h-1.5 bg-gradient-to-r from-stone-200 to-stone-400 rounded-r -skew-y-3 shadow-md" />
                    </motion.div>

                    {/* Rubber sealing jar connector base coupling */}
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-stone-800 border-t border-stone-750" />
                  </div>

                  {/* Rubber pitcher lid with translucent plug cap */}
                  <div className="absolute top-0 transform -translate-y-[15px] z-20 flex flex-col items-center select-none">
                    <div className="w-14 h-4 bg-stone-700/90 rounded-t-md border-t border-stone-500 shadow-inner flex items-center justify-center" />
                    <div className="w-44 h-4 bg-gradient-to-r from-stone-850 to-stone-900 rounded-md border-b-2 border-stone-950 shadow-md" />
                  </div>

                  {/* Heavy Stainless Steel Motor Pedestal base */}
                  <div className="w-56 h-28 bg-gradient-to-b from-stone-400 via-stone-300 to-stone-500 rounded-t-lg rounded-b-2xl border-x-4 border-b-4 border-stone-500 shadow-2xl relative p-3 flex flex-col justify-between z-0">
                    
                    {/* Air vent grill slits */}
                    <div className="flex gap-1.5 justify-center py-0.5">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="w-1 h-3 bg-stone-800 rounded-sm" />
                      ))}
                    </div>
                       {/* Integrated Control Panel Dashboard */}
                    <div className="bg-stone-950 border border-stone-800 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-inner">
                      
                      {/* Retro LED Status Screen */}
                      <div className="bg-black/90 p-1.5 rounded border border-emerald-500/20 font-mono text-[7px] text-emerald-400 flex-1 flex flex-col gap-0.5 min-w-[76px] h-10 justify-center">
                        {leafBlenderError ? (
                          <div className="text-red-500 font-extrabold text-[8px] animate-pulse">
                            {leafBlenderError}
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-stone-500 font-bold">
                              <span>SYSTEM v2.5</span>
                              <span className={isBlending ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}>●</span>
                            </div>
                            <div className="text-[8.5px] font-black tracking-widest text-[#00E676] overflow-hidden">
                              {isBlending ? `RPM: 12.5K [${blendProgress}%]` : isBlendDone ? (language === 'ar' ? 'جاهز' : 'READY') : 'STANDBY'}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Tactile Heavy-Duty Red POWER Button */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={runLeafBlendingPower}
                          disabled={isBlending || isBlendDone}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-stone-800 flex-shrink-0 transition-all ${
                            isBlending
                              ? 'bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse cursor-not-allowed border-red-400'
                              : isBlendDone
                              ? 'bg-red-900 border-red-950 opacity-50 cursor-not-allowed'
                              : 'bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 shadow-md active:bg-red-700 cursor-pointer border-red-500'
                          }`}
                          style={{
                            boxShadow: isBlending ? '0 0 15px rgba(239, 68, 68, 0.7)' : 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 6px rgba(0,0,0,0.4)',
                          }}
                        >
                          <span className="text-[8px] font-black tracking-tighter text-white uppercase select-none">PWR</span>
                        </button>
                      </div>

                      {/* Tactile Rotary Jog Speed Knob */}
                      <div className="flex flex-col items-center gap-1">
                        <motion.div
                          animate={isBlending ? { rotate: [0, 90, 180, 270, 360] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="w-8 h-8 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-950 border border-stone-600 rounded-full flex items-center justify-center shadow-md relative"
                        >
                          {/* Dial notch */}
                          <div className="w-1 h-2.5 bg-[#00E676] rounded-full absolute top-[2px]" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Base heavy-duty rubber feet */}
                    <div className="absolute inset-x-8 -bottom-[10px] h-2.5 flex justify-between z-0 pointer-events-none select-none">
                      <div className="w-5 h-2.5 bg-stone-900 rounded-b" />
                      <div className="w-5 h-2.5 bg-stone-900 rounded-b" />
                    </div>
                  </div>
                </div>

                {/* Simulation trigger controls */}
                <div className="w-72 mt-5">
                  {isBlending ? (
                    <div className="bg-stone-950/80 p-3 rounded-xl border border-teal-500/30 text-center text-xs font-mono text-zinc-300 flex flex-col gap-2 shadow-md">
                      <div className="flex justify-between items-center text-[10px] text-teal-400 font-extrabold uppercase tracking-widest">
                        <span>{t('tearing_cells', { progress: blendProgress })}</span>
                        <RotateCw size={12} className="animate-spin" />
                      </div>
                      <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-[#00E676] to-teal-400 h-1.5 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${blendProgress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  ) : isBlendDone ? (
                    <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 text-center text-xs font-mono text-[#00E676] flex items-center justify-center gap-2 animate-bounce shadow-md">
                      <CheckCircle2 size={15} />
                      <span>{t('cells_liberated')}</span>
                    </div>
                  ) : (
                    <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80 text-center text-[10px] font-mono text-stone-400 flex flex-col gap-1 items-center justify-center shadow-md">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[#00E676] mb-1">
                        <span>● STATUS: STANDBY</span>
                      </div>
                      <span>{language === 'ar' ? 'أدخل أوراق الشجر والماء أولاً.' : 'Load botanical leaves and solvent water.'}</span>
                      <span>{language === 'ar' ? 'اضغط على زر التشغيل (PWR) لبدء المعالجة.' : 'Press RED power button (PWR) to start.'}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* 4. SIEVE CLARIFICATION STAGE */}
          {activeStep === 4 && (
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 max-w-5xl select-none">
              
              {/* Draggable Shaken Slurry Jar (Left) or Pouring Stream */}
              <div className="flex flex-col items-center justify-center min-h-[200px] w-full lg:w-1/4">
                <AnimatePresence mode="wait">
                  {!isSlurryPoured ? (
                    <motion.div
                      key="unpoured-slurry"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center space-y-3 relative z-25 flex flex-col items-center"
                    >
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-relaxed font-black">
                        {t('raw_homogenate')}
                      </div>
                      
                      <motion.div
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.4}
                        dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                        onDragStart={() => setDraggingItem('slurry_filter')}
                        onDragEnd={(e, info) => {
                          setDraggingItem(null);
                          if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                            setIsSlurryPoured(true);
                            playSynthBeep(320);
                          }
                        }}
                        onClick={() => {
                          setIsSlurryPoured(true);
                          playSynthBeep(320);
                        }}
                        whileHover={{ scale: 1.08, translateY: -3 }}
                        whileDrag={{ scale: 1.15 }}
                        className="w-32 h-32 cursor-grab active:cursor-grabbing bg-stone-900/90 border border-emerald-500/30 rounded-2xl shadow-xl flex flex-col items-center justify-center relative p-3 transition-all hover:bg-stone-850 hover:border-emerald-500/50 touch-none select-none"
                      >
                        {/* Detailed Homogenate Beaker */}
                        <div className="w-16 h-18 bg-gradient-to-b from-sky-400/5 via-sky-500/10 to-emerald-500/15 border-2 border-stone-400/70 rounded-b-xl rounded-tr-xl flex flex-col justify-end items-center pb-2.5 px-3 relative shadow-inner">
                          {/* Graduations */}
                          <div className="absolute left-1.5 top-2 flex flex-col gap-1.5 font-mono text-[5px] text-zinc-500">
                            <span>300ml</span>
                            <span>200ml</span>
                            <span>100ml</span>
                          </div>
                          {/* Slurry Content */}
                          <div className="w-full h-10 bg-gradient-to-t from-emerald-950 to-emerald-800 rounded-b-lg border-t border-emerald-500/50 opacity-90 relative overflow-hidden flex items-center justify-center">
                            {/* Inner leaf particles */}
                            <div className="space-x-1 flex opacity-60">
                              <motion.div animate={{ rotate: [30, 45, 30] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                              <div className="w-1.5 h-1.5 bg-emerald-250 rounded-full animate-ping" />
                              <motion.div animate={{ rotate: [-20, -10, -20] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-1 h-2.5 bg-emerald-300 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-emerald-400 font-extrabold mt-2 uppercase text-center leading-none tracking-widest">{t('pour_slurry')}</span>
                        <span className="text-[6px] text-stone-500 font-sans mt-0.5">{t('drag_or_tap')}</span>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="poured-slurry"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-32 h-32 bg-stone-950/20 border border-stone-900 rounded-2xl flex flex-col items-center justify-center opacity-45 select-none text-center"
                    >
                      <CheckCircle2 size={22} className="text-emerald-500 mb-1 animate-bounce" />
                      <span className="text-[9px] font-mono text-zinc-550 uppercase font-black tracking-widest">{t('slurry_introduced')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Advanced Laboratory Apparatus with Glass Reflections & Wet Filter paper / Spout */}
              <div className="flex flex-col items-center w-full lg:w-2/5 px-2 relative">
                
                {/* Apparatus Frame Grid */}
                <div className={`relative py-6 bg-gradient-to-b from-stone-950/80 to-stone-900/60 border rounded-3xl p-6 shadow-2xl flex flex-col items-center w-full max-w-xs overflow-visible transition-all duration-300 ${
                  draggingItem === 'slurry_filter'
                    ? 'border-emerald-400 bg-emerald-950/10 shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-102 animate-pulse'
                    : 'border-stone-850/60'
                }`}>
                  
                  {/* RETORT STAND SUPPORT IN BACK (Depth of field blur) */}
                  <div className="absolute left-6 top-0 bottom-4 w-1.5 bg-gradient-to-b from-stone-750 to-stone-600 rounded-full flex flex-col justify-between items-center py-8 opacity-45 pointer-events-none filter blur-[0.5px]">
                    <div className="w-6 h-2 bg-yellow-700/60 border border-stone-800 rounded-sm -ml-4" />
                    <div className="w-6 h-2 bg-stone-700 border border-stone-800 rounded-sm -ml-4" />
                  </div>

                  {/* Flow gauge */}
                  {isFiltering1 && (
                    <motion.div 
                      animate={{ x: [-0.5, 0.5, -0.5], y: [-0.3, 0.3, -0.3] }}
                      transition={{ repeat: Infinity, duration: 0.15 }}
                      className="absolute right-4 top-1/3 w-14 h-2 bg-stone-800 rounded-full shadow-md z-0 flex items-center pointer-events-none"
                    >
                      <div className="w-6 h-6 bg-stone-900 rounded-full border border-stone-700 flex flex-col items-center justify-center -mt-2 -ml-2 shadow-lg scale-90">
                        <span className="text-[4px] font-mono text-zinc-500 leading-none">VACUUM</span>
                        <span className="text-[6px] font-mono text-red-500 font-extrabold leading-none">-0.45</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Unified Interactive Lab SVG */}
                  <svg id="filtration-apparatus" viewBox="0 0 200 280" className="w-48 h-72 select-none overflow-visible">
                    <defs>
                      {/* Glass specular gradient */}
                      <linearGradient id="glassGlare" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="30%" stopColor="rgba(255,255,255,0.02)" />
                        <stop offset="70%" stopColor="rgba(255,255,255,0.0)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                      </linearGradient>

                      {/* Filter Paper Absorption Gradient */}
                      <linearGradient id="paperAbsorb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={`${Math.max(0, filterProgress - 25)}%`} stopColor="#224229" />
                        <stop offset={`${filterProgress}%`} stopColor="#2E6F40" />
                        <stop offset={`${Math.min(100, filterProgress + 15)}%`} stopColor="#FAFAFA" />
                      </linearGradient>

                      {/* Green Juice Fill Gradient */}
                      <linearGradient id="greenJuiceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                        <stop offset="15%" stopColor="#059669" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#064e40" stopOpacity="0.95" />
                      </linearGradient>

                      {/* Plant waste slurry gradient */}
                      <linearGradient id="residueGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1B3F21" />
                        <stop offset="50%" stopColor="#112A15" />
                        <stop offset="100%" stopColor="#0B1C0E" />
                      </linearGradient>
                    </defs>

                    {/* TILTING POURING STREAM ANIMATION */}
                    {isSlurryPoured && !isFilter1Done && (
                      <g>
                        {/* Stream path pouring from left off-canvas lip down to filter cone apex */}
                        <motion.path 
                          d="M 20 20 Q 55 45, 100 65"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          opacity={0.8}
                          animate={{ strokeDashoffset: [0, -20], strokeWidth: [3, 4, 3] }}
                          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                          style={{ strokeDasharray: "10, 5" }}
                        />
                        {/* Tilting Beaker Ghost shadow */}
                        <g transform="translate(-15, -15) rotate(-55, 30, 35)" className="opacity-90">
                          <rect x="15" y="20" width="30" height="40" rx="4" fill="rgba(80,80,80,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                          <rect x="17" y="35" width="26" height="23" fill="#047857" opacity="0.8" rx="2" />
                          <line x1="15" y1="20" x2="20" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                        </g>
                      </g>
                    )}

                    {/* UPPER FUNNEL GLASS (Porcelain/Glass outer envelope) */}
                    <path d="M 50 45 L 150 45 L 115 110 L 115 150 L 85 150 L 85 110 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                    {/* Glass glare highlight in funnel */}
                    <path d="M 52 46 L 85 110" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />

                    {/* REALISTIC PLEATED FILTER PAPER cone nested inside funnel */}
                    {isSlurryPoured && (
                      <g>
                        {/* The Cone itself, colored by absorption gradient */}
                        <path d="M 55 48 L 100 106 L 145 48 Z" fill="url(#paperAbsorb)" stroke="rgba(0,0,0,0.12)" strokeWidth="1" className="transition-all duration-[800ms]" />
                        
                        {/* Individual crease line paths representing fold pleats */}
                        <line x1="66" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                        <line x1="78" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                        <line x1="89" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                        <line x1="100" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                        <line x1="111" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                        <line x1="122" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                        <line x1="133" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

                        {/* ORGANIC BULKY BIOMASS / CELLULOSE RESIDUE LAYER BUILDING UP ON TOP */}
                        <motion.path 
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ 
                            scaleY: isFilter1Done ? 1 : (isFiltering1 ? 0.75 : 0.25),
                            opacity: 1
                          }}
                          transform="translate(0, 106) scale(1) translate(0, -106)"
                          transition={{ duration: 1 }}
                          d="M 64 64 Q 100 86, 136 64 C 120 102, 80 102, 64 64 Z"
                          fill="url(#residueGrad)"
                          stroke="rgba(16,185,129,0.25)"
                          strokeWidth="1"
                        />

                        {/* Rich plant texture flecks inside residue */}
                        {isSlurryPoured && (
                          <g opacity={isFiltering1 ? 0.6 : 0.4} className="pointer-events-none">
                            <circle cx="92" cy="85" r="1.5" fill="#4ade80" />
                            <circle cx="104" cy="92" r="1" fill="#86efac" />
                            <circle cx="112" cy="88" r="1.8" fill="#15803d" />
                            <circle cx="85" cy="82" r="1.2" fill="#22c55e" />
                            <circle cx="118" cy="80" r="1" fill="#4ade80" />
                          </g>
                        )}
                      </g>
                    )}

                    {/* FUNNEL SPOUT STEM OUTFLOW DRIPS */}
                    <g transform="translate(0, 6)">
                      {/* Spout glass extension */}
                      <path d="M 94 144 L 94 165 L 106 160 L 106 144 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
                      
                      {/* Falling droplets animation */}
                      {isFiltering1 && (
                        <g>
                          {/* Continuous stream line */}
                          <line x1="100" y1="165" x2="100" y2="185" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />
                          {/* Drip 1 */}
                          <motion.circle 
                            animate={{ cy: [168, 222], opacity: [1, 0.7, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5, ease: "easeIn" }}
                            cx="100" 
                            cy="168" 
                            r="2" 
                            fill="#34d399" 
                          />
                          {/* Drip 2 */}
                          <motion.circle 
                            animate={{ cy: [168, 222], opacity: [1, 0.7, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.25, ease: "easeIn" }}
                            cx="100" 
                            cy="168" 
                            r="1.5" 
                            fill="#6ee7b7" 
                          />
                        </g>
                      )}
                    </g>

                    {/* RECEIVER FLASK (Transparent laboratory volumetric borosilicate glass flask) */}
                    <g transform="translate(0, -6)">
                      {/* Fluid body inside flask */}
                      {isSlurryPoured && (
                        <g>
                          {/* Convex fill path matching base of Erlenmeyer flask */}
                          <motion.path 
                            initial={{ d: "M 88 230 L 112 230 L 112 260 L 88 260 Z" }}
                            animate={{ 
                              d: isFilter1Done 
                                ? "M 75 204 L 125 204 L 157 262 A 6 6 0 0 1 151 268 L 49 268 A 6 6 0 0 1 43 262 Z" 
                                : isFiltering1 
                                  ? "M 80 220 L 120 220 L 156 262 A 6 6 0 0 1 150 268 L 50 268 A 6 6 0 0 1 44 262 Z" 
                                  : "M 88 238 L 112 238 L 153 262 A 6 6 0 0 1 147 268 L 53 268 A 6 6 0 0 1 47 262 Z"
                            }}
                            transition={{ duration: 0.8 }}
                            fill="url(#greenJuiceGrad)" 
                          />

                          {/* Ripples on surface during active filtration */}
                          {isFiltering1 && (
                            <motion.ellipse 
                              animate={{ 
                                rx: [16, 22, 16], 
                                ry: [1.5, 3, 1.5],
                                opacity: [0.7, 0.2, 0.7]
                              }}
                              transition={{ repeat: Infinity, duration: 0.5 }}
                              cx="100" 
                              cy={isFilter1Done ? 204 : isFiltering1 ? 220 : 238} 
                              r="15" 
                              fill="#6ee7b7" 
                              opacity="0.4"
                            />
                          )}
                        </g>
                      )}

                      {/* Flask outer glass body */}
                      <path 
                        d="M 88 175 L 112 175 L 112 195 L 158 261 A 8 8 0 0 1 151 270 L 49 270 A 8 8 0 0 1 42 261 L 88 195 Z" 
                        fill="url(#glassGlare)" 
                        stroke="rgba(255,255,255,0.32)" 
                        strokeWidth="2.5" 
                        strokeLinejoin="bevel"
                      />

                      {/* Glass highlight glare stripes */}
                      <path d="M 148 259 L 109 203" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M 52 259 L 85 212" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />

                      {/* Flask Rim Collar */}
                      <ellipse cx="100" cy="175" rx="13" ry="3.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

                      {/* Volumetric printed scale marks */}
                      <g fill="rgba(255,255,255,0.3)" fontStyle="normal" style={{ fontSize: "5.5px", fontFamily: "JetBrains Mono, monospace", fontWeight: "bold" }}>
                        <text x="110" y="222">250ml</text>
                        <line x1="102" y1="220" x2="107" y2="220" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                        <text x="115" y="242">150ml</text>
                        <line x1="106" y1="240" x2="111" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                        <text x="120" y="258">50ml</text>
                        <line x1="110" y1="256" x2="115" y2="256" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                      </g>
                    </g>
                  </svg>

                  {/* Operational Apparatus Status Ribbon */}
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-mono font-black tracking-wider bg-black/70 px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-[#00E676] shadow-md">
                    {isFilter1Done ? t('clarifiedJuiceSecured') : isFiltering1 ? t('clarifyingSolubles') : t('apparatusPristine')}
                  </span>
                </div>
              </div>

              {/* FLOATING MASS COUNT & COMPRESSED SOIL ENHANCER REPORT */}
              <div className="flex flex-col items-center justify-center gap-4 w-full lg:w-1/3">
                
                {/* ♻️ SOIL ENHANCER VALUE ADVANCEMENT CARD */}
                <AnimatePresence>
                  {(isFiltering1 || isFilter1Done) && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-stone-900 border border-emerald-500/20 p-4 rounded-2xl w-full text-xs shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-15">
                        <Sprout size={48} className="text-emerald-500" />
                      </div>

                      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 mb-2">
                        <div className="p-1.5 bg-emerald-950/50 rounded-lg border border-emerald-500/30">
                          <Sprout size={16} className="text-emerald-400 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-[9.5px] font-mono text-[#00E676] font-black uppercase tracking-wider block leading-none">
                            {t('organic_recycle_recycle_reclamation')}
                          </span>
                          <span className="text-[7.5px] text-zinc-500 font-sans block mt-0.5">
                            {t('organic_recycle_compost_mulch')}
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans mt-1">
                        {t('organic_recycle_desc')}
                      </p>
                      
                      <div className="mt-2.5 flex items-center justify-between bg-stone-950/60 p-2 rounded-lg border border-stone-850">
                        <span className="text-[8px] font-mono text-stone-500 uppercase">{t('status_eco')}</span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-950/20 border border-emerald-500/20 rounded">
                          {t('compost_valuable')}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 📊 Scientific Yield Infographics with Counters */}
                <div className="bg-stone-900/90 border border-stone-800 p-4.5 rounded-2xl space-y-3 w-full shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-2 text-stone-800 font-mono text-[7px] pointer-events-none">CODE: L-340</div>
                  <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest block border-b border-stone-800/80 pb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {t('yield_mass_overlay')}
                  </span>

                  <div className="space-y-2 font-mono">
                    {/* Input Counter */}
                    <div className="bg-stone-950 p-2 rounded-xl border border-stone-850 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[7px] text-stone-500 uppercase">{t('raw_calibrated_input')}</span>
                        <span className="text-[10px] font-bold text-zinc-300">
                          {getLeafName(activeLeaf)}
                        </span>
                      </div>
                      <div className="text-right">
                        <motion.span 
                          animate={{ opacity: isSlurryPoured ? [0.6, 1] : 1 }}
                          className="text-sm font-black text-white"
                        >
                          {leafWeight} g
                        </motion.span>
                      </div>
                    </div>

                    {/* Output Biomass Counter */}
                    <div className="bg-stone-950 p-2 rounded-xl border border-stone-850 flex items-center justify-between relative overflow-hidden">
                      <div className="flex flex-col">
                        <span className="text-[7px] text-[#00E676] uppercase tracking-wider font-extrabold">{t('reclaimed_biomass_output')}</span>
                        <span className="text-[10px] font-bold text-zinc-400">{t('organic_soil_compost')}</span>
                      </div>
                      <div className="text-right flex flex-col justify-end items-end">
                        {/* Animate counter from 0 to expected waste weight */}
                        <span className="text-sm font-black text-emerald-400">
                          {isSlurryPoured 
                            ? Math.round((filterProgress / 100) * expectedFiberWasteG) 
                            : 0} g
                        </span>
                        {isFiltering1 && (
                          <span className="text-[5px] font-sans text-stone-500 animate-pulse">ACCUMULATING...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scientific disclaimer */}
                  <div className="text-[8px] font-sans text-stone-500 text-center pt-1 italic">
                    {t('closing_note')}
                  </div>
                </div>

                {/* Micro-particle floating numbers when active */}
                {isFiltering1 && (
                  <div className="absolute pointer-events-none text-xs font-mono font-black text-emerald-400 drop-shadow flex flex-col gap-1 items-center z-30">
                    <motion.div animate={{ y: [-50, -110], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.9] }} transition={{ repeat: Infinity, duration: 1.1 }} className="absolute -top-12">-5.2g liquid</motion.div>
                    <motion.div animate={{ y: [-40, -130], opacity: [0, 1, 0], scale: [0.9, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="absolute -top-14">+1.2g compost</motion.div>
                  </div>
                )}

                {/* Action button */}
                <div className="w-full text-center mt-2">
                  {isSlurryPoured && !isFilter1Done ? (
                    <button
                      type="button"
                      onClick={runSieveFiltration}
                      disabled={isFiltering1}
                      className="w-full py-3.5 bg-gradient-to-r from-[#00E676] to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase rounded-xl tracking-widest shadow-[0_4px_15px_rgba(0,230,118,0.25)] transition-transform duration-100 hover:scale-[1.01]"
                    >
                      {isFiltering1 ? (
                        <span className="flex items-center justify-center gap-2">
                          <RotateCw size={14} className="animate-spin text-black" />
                          <span>{t('vacuum_filtering', { progress: filterProgress })}</span>
                        </span>
                      ) : (
                        <span>{t('engage_vacuum')}</span>
                      )}
                    </button>
                  ) : isFilter1Done ? (
                    <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/35 text-center text-xs font-mono text-[#00E676] flex items-center justify-center gap-2 animate-bounce">
                      <CheckCircle2 size={16} />
                      <span>{t('clarified_success')}</span>
                    </div>
                  ) : null}
                </div>
              </div>

            </div>
          )}

          {/* 5. THERMAL SEPARATION / COAGULATION STAGE */}
          {activeStep === 5 && (() => {
            const p = Math.max(0, Math.min(1, (temperature - 24) / (75 - 24)));
            
            // Dynamic color transition of fluid:
            // emerald green (16, 185, 129, 0.8) -> sky/light blue (186, 230, 253, 0.45)
            const rLeaf = Math.round(16 + p * (186 - 16));
            const gLeaf = Math.round(185 + p * (230 - 185));
            const bLeaf = Math.round(129 + p * (255 - 129));
            const alphaLeaf = 0.82 - p * 0.38;
            const dynamicLeafColor = `rgba(${rLeaf}, ${gLeaf}, ${bLeaf}, ${alphaLeaf})`;

            // Dynamic flame scale factor based on temperature
            const flameScale = isHeating ? 0.6 + p * 0.6 : 0;

            return (
              <div className="w-full flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto">
                <div className="relative w-full max-w-[620px] h-[330px] shrink-0 scale-90 sm:scale-100 origin-center">
                {/* DRAGGABLE BEAKER (Left Side) - Absolutely Positioned */}
                <div className="absolute left-[6px] bottom-0 w-44 h-80 flex flex-col items-center justify-end">
                  <AnimatePresence>
                    {!isJuiceInHeater && (
                      <motion.div
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-3 relative z-20"
                      >
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black text-center">
                          {t('filtrate_extract')}
                        </div>

                        {/* Draggable & Tappable Beaker */}
                        <motion.div
                          drag={!isLeafPouring}
                          dragConstraints={constraintsRef}
                          dragElastic={0.4}
                          onDragStart={() => setDraggingItem('leaf_beaker')}
                          onDragEnd={(e, info) => {
                            setDraggingItem(null);
                            if (Math.abs(info.offset.x) > 50 || Math.abs(info.offset.y) > 50) {
                              startLeafPouring();
                            }
                          }}
                          onClick={startLeafPouring}
                          whileHover={{ scale: isLeafPouring ? 1 : 1.05 }}
                          whileDrag={{ scale: 1.12, rotate: 15 }}
                          animate={
                            isLeafPouring
                              ? {
                                  x: 124,
                                  y: -145,
                                  rotate: 60,
                                  scale: 1,
                                  transition: { duration: 0.8, ease: 'easeOut' },
                                }
                              : { x: 0, y: 0, rotate: 0 }
                          }
                          className={`w-32 h-40 bg-zinc-900/95 border border-emerald-500/30 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-end relative overflow-hidden group select-none ${
                            isLeafPouring ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                          }`}
                        >
                          {/* Beaker measurement ticks */}
                          <div className="absolute left-3 top-6 flex flex-col gap-3 opacity-30 select-none">
                            <div className="w-4 h-[1.5px] bg-white"></div>
                            <div className="w-2 h-[1px] bg-white"></div>
                            <div className="w-4 h-[1.5px] bg-white"></div>
                            <div className="w-2 h-[1px] bg-white"></div>
                            <div className="w-4 h-[1.5px] bg-white"></div>
                          </div>

                          {/* Shimmery Liquid filled in Beaker */}
                          <motion.div
                            animate={isLeafPouring ? { height: '10%' } : { height: '70%' }}
                            transition={{ duration: 1.4, ease: 'easeInOut' }}
                            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-800 via-emerald-600 to-emerald-400 z-0 flex items-center justify-center border-t border-emerald-300/40"
                          >
                            <div className="absolute -top-1 inset-x-0 h-2 bg-emerald-300/60 rounded-full filter blur-[1px] opacity-80" />
                          </motion.div>

                          {/* Inner glass reflection sheen */}
                          <div className="absolute inset-y-0 right-4 w-1 bg-white/10 rounded-full" />
                          
                          {/* Front Text Overlay */}
                          <div className="absolute top-4 inset-x-0 text-center flex flex-col items-center pointer-events-none z-10 p-1">
                            <span className="text-[9px] font-mono font-bold text-white tracking-widest">{t('raw_cellular').substring(0,18)}</span>
                            <span className="text-[7.5px] text-emerald-300 font-bold mt-1 uppercase">GREEN FILTRATE</span>
                            <span className="text-[6.5px] text-zinc-500 mt-1">{t('drag_or_tap')}</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Pouring stream liquid animation - Absolutely Positioned relative to parent workbench */}
                {isLeafPouring && (
                  <div className="absolute z-33 pointer-events-none" style={{ left: 'calc(50% - 7px)', top: '120px' }}>
                    <svg className="w-16 h-28 overflow-visible" viewBox="0 0 64 112">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        d="M 8,0 L 8,90"
                        fill="none"
                        stroke="url(#gradientPourGreen)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      
                      <motion.circle
                        animate={{ cy: [10, 85] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        cx="8"
                        r="3.5"
                        fill="#a7f3d0"
                      />
                      <motion.circle
                        animate={{ cy: [25, 75] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
                        cx="12"
                        r="2.5"
                        fill="#ffffff"
                      />

                      <defs>
                        <linearGradient id="gradientPourGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="60%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* ERLENMEYER GLASS FLASK STATION (Center) - Absolutely Positioned */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-64 h-80 flex flex-col items-center justify-end">
                  {/* Perfect glowing background to establish central focus on the heating pot */}
                  <div className="absolute inset-y-4 inset-x-8 pointer-events-none -z-10 bg-gradient-to-t from-emerald-500/10 via-emerald-500/[0.02] to-transparent rounded-full filter blur-2xl opacity-90 transition-all duration-500" />
                  
                  {isHeating && (
                    <div className="absolute inset-y-4 inset-x-8 pointer-events-none -z-10 bg-emerald-400/10 rounded-full filter blur-3xl animate-pulse" />
                  )}

                  <div className="relative flex flex-col items-center select-none">
                    
                    <div className="w-14 h-12 border-x-4 border-stone-100/60 bg-zinc-950/20 z-10 relative flex items-center justify-center">
                      <div className="absolute top-0 w-16 h-2 bg-stone-300 rounded-t-sm border-b border-stone-500 shadow-sm" />
                      
                      {/* Rising steam vapor clouds proportional to temp */}
                      {isJuiceInHeater && (
                        <div className="absolute -top-16 left-3.5 flex flex-col gap-1 items-center z-20 pointer-events-none">
                          {[1, 2, 3, 4, 5].map((steam, i) => {
                            const baseDelay = i * 0.35;
                            const baseDuration = 1.4 + (i % 2) * 0.4;
                            const xOffset = -12 + i * 5;
                            const pOpacity = isHeating ? 0.15 + (temperature - 24) / 51 * 0.75 : 0.05;
                            return (
                              <motion.div
                                key={steam}
                                animate={{
                                  y: [0, -50],
                                  x: [xOffset, xOffset + Math.sin(i) * 12],
                                  scale: [0.6, 2.2],
                                  opacity: [0, pOpacity, 0]
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: baseDuration,
                                  delay: baseDelay,
                                  ease: "easeOut"
                                }}
                                className="w-3.5 h-3.5 bg-white/20 rounded-full absolute filter blur-[2.5px]"
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="w-48 h-40 border-b-4 border-x-4 border-stone-100/60 bg-white/5 rounded-b-[48px] relative overflow-hidden flex flex-col justify-end items-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] pb-1.5 z-10 border-t border-t-white/10">
                      
                      {/* Glass shine reflections & transparency enhancements */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-10" />
                      <div className="absolute top-2 right-6 w-3 h-28 bg-gradient-to-l from-white/10 to-transparent rounded-full filter blur-[1px] pointer-events-none z-20" />
                      <div className="absolute top-2 left-6 w-1 h-28 bg-gradient-to-r from-white/10 to-transparent rounded-full filter blur-[0.5px] pointer-events-none z-20" />
                      
                      <div className="absolute left-3 top-8 flex flex-col gap-2 font-mono text-[6px] text-zinc-400 font-bold select-none opacity-40 z-25 pointer-events-none">
                        <span>— 300 ml</span>
                        <span>— 200 ml</span>
                        <span>— 100 ml</span>
                      </div>

                      {isJuiceInHeater && (
                        <div className="absolute top-0 bottom-4 w-1 bg-gradient-to-b from-stone-400 to-stone-200 shadow-md left-1/2 z-20 pointer-events-none">
                          <div className="w-2 h-2 bg-red-500 rounded-full absolute bottom-0 -left-[2px] shadow-lg animate-pulse" />
                        </div>
                      )}

                      {!isJuiceInHeater && !isLeafPouring && (
                        <div className={`absolute inset-4 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center px-4 transition-all duration-300 ${
                          draggingItem === 'leaf_beaker'
                            ? 'border-emerald-400 bg-emerald-500/10 scale-102 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-pulse'
                            : 'border-emerald-500/30 bg-emerald-500/5 animate-pulse'
                        }`}>
                          <span className={`text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 ${
                            draggingItem === 'leaf_beaker' ? 'text-emerald-300' : 'text-emerald-500'
                          }`}>
                            <Droplets size={12} className="text-emerald-500 animate-bounce" />
                            FILL FLASK VESSEL
                          </span>
                          <div className="text-[7px] font-sans text-stone-400 mt-2">
                            {t('drag_or_tap')} to pour the green extract
                          </div>
                        </div>
                      )}

                      {isLeafPouring && (
                        <div
                          style={{
                            height: `${leafPourProgress}%`,
                            backgroundColor: 'rgba(16, 185, 129, 0.85)',
                            transition: 'height 0.08s linear',
                          }}
                          className="absolute inset-x-0 bottom-0 z-0 flex items-center justify-center overflow-hidden border-t-2 border-emerald-300/40"
                        >
                          <div className="absolute -top-1.5 inset-x-0 h-3 bg-emerald-300/50 rounded-full animate-pulse filter blur-[1px]" />
                          
                          <div className="absolute top-0 left-12 right-12 bottom-0 flex flex-wrap gap-1 items-center justify-center">
                            {[1, 2, 3, 4, 5].map((bub) => (
                              <motion.div
                                key={bub}
                                animate={{ y: [20, -20], x: [0, Math.sin(bub) * 8], scale: [0.5, 1, 0.4], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.4, delay: bub * 0.1 }}
                                className="w-2 h-2 rounded-full bg-[#00E676]/50 absolute"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {isJuiceInHeater && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: '80%' }}
                          transition={{ duration: 0.5 }}
                          style={{ backgroundColor: dynamicLeafColor }}
                          className="absolute inset-x-0 bottom-0 z-0 flex items-center justify-center overflow-hidden border-t-2 border-white/25"
                        >
                          <motion.div
                            animate={
                              isHeating 
                                ? { y: [-1, 2, -1], rotate: [-0.5, 0.5, -0.5] } 
                                : { y: [-0.4, 0.4, -0.4], rotate: [-0.1, 0.1, -0.1] }
                            }
                            transition={{ repeat: Infinity, duration: isHeating ? 0.35 : 1.8 }}
                            className="absolute top-[-4px] inset-x-0 h-3 bg-white/10 rounded-full filter blur-[1px]"
                          />

                          {isHeating && (
                            <div className="absolute inset-x-0 bottom-0 top-3 pointer-events-none overflow-hidden">
                              {Array.from({ length: 10 }).map((_, bubIndex) => {
                                const randomDelay = bubIndex * 0.25;
                                const randomDuration = 0.5 + (bubIndex % 3) * 0.2;
                                const xOffsetPercent = 10 + bubIndex * 8.5;
                                const bubbleMaxOpacity = p >= 0.4 ? Math.min(1, (temperature - 35) / 40) : 0;
                                return (
                                  <motion.div
                                    key={bubIndex}
                                    animate={{
                                      y: [120, -10],
                                      x: [xOffsetPercent, xOffsetPercent + Math.sin(bubIndex) * 8],
                                      opacity: [0, bubbleMaxOpacity, 0],
                                      scale: [0.5, 1.25, 0.6]
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: randomDuration,
                                      delay: randomDelay,
                                      ease: "easeIn"
                                    }}
                                    className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-inner absolute"
                                    style={{ left: `${xOffsetPercent}%` }}
                                  />
                                );
                              })}
                            </div>
                          )}

                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            {Array.from({ length: 12 }).map((_, pIdx) => {
                              const direction = pIdx % 2 === 0 ? 1 : -1;
                              const radX = 35 + (pIdx % 4) * 8;
                              const radY = 22 + (pIdx % 3) * 6;
                              const loopDuration = 3.2 + (pIdx % 3) * 0.6;
                              const startDelay = pIdx * 0.3;

                              let particleOpacity = 0;
                              let particleScale = 0.4;
                              let particleBg = 'rgba(16, 185, 129, 0)';
                              let particleBorder = 'none';
                              let textTag = false;

                              if (temperature >= 40) {
                                particleOpacity = Math.min(1, (temperature - 40) / 35);
                                if (temperature < 56) {
                                  particleScale = 0.5 + (pIdx % 3) * 0.1;
                                  particleBg = 'rgba(16, 185, 129, 0.45)';
                                  particleBorder = '1px solid rgba(16, 185, 129, 0.15)';
                                } else if (temperature < 70) {
                                  particleScale = 0.9 + (pIdx % 3) * 0.25;
                                  particleBg = 'rgba(5, 150, 105, 0.82)';
                                  particleBorder = '1px solid rgba(16, 185, 129, 0.3)';
                                } else {
                                  particleScale = 1.35 + (pIdx % 3) * 0.4;
                                  particleBg = '#059669';
                                  particleBorder = '1.5px solid rgba(16, 185, 129, 0.65)';
                                  textTag = pIdx % 4 === 0 && temperature >= 70;
                                }
                              }

                              return (
                                <motion.div
                                  key={pIdx}
                                  animate={{
                                    x: [0, radX * direction, 0, -radX * direction, 0],
                                    y: [-radY, 0, radY, 0, -radY],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: loopDuration,
                                    delay: startDelay,
                                    ease: "linear"
                                  }}
                                  style={{
                                    opacity: particleOpacity,
                                    scale: particleScale,
                                    backgroundColor: particleBg,
                                    border: particleBorder,
                                    boxShadow: temperature >= 70 ? '0 4px 8px rgba(0,0,0,0.25)' : 'none',
                                    transition: 'background-color 0.4s ease, border 0.4s ease, transform 0.4s ease',
                                  }}
                                  className="w-4 h-4 rounded-xl absolute z-15 flex items-center justify-center animate-pulse"
                                >
                                  {textTag && (
                                    <span className="text-[3.5px] text-white font-black tracking-widest uppercase select-none scale-90">
                                      CURD
                                    </span>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>

                          {isHeating && (
                            <motion.div
                              animate={{
                                opacity: [0, 0.12, 0],
                                skewX: [-4, 4, -4],
                                scaleY: [1, 1.05, 1]
                              }}
                              transition={{ repeat: Infinity, duration: 1.2 }}
                              className="absolute inset-0 bg-gradient-to-t from-red-500/10 via-transparent to-white/5 pointer-events-none filter blur-[4px]"
                            />
                          )}

                          <div className="absolute bottom-2.5 right-2.5 bg-zinc-950/90 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 flex flex-col items-center shadow-lg backdrop-blur-sm">
                            <span className="text-[5.5px] font-mono text-zinc-400 font-black pb-0.5 tracking-wider leading-none uppercase">THERMO_PROBE</span>
                            <div className="flex items-center gap-1">
                              <Thermometer size={9} className={temperature >= 68 ? 'text-red-500 animate-pulse' : 'text-emerald-500'} />
                              <span className={`text-[10.5px] font-mono font-black tracking-widest ${temperature >= 68 ? 'text-red-500 animate-pulse' : 'text-[#00E676]'}`}>
                                {temperature.toFixed(1)}°C
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="w-56 h-12 bg-gradient-to-b from-stone-850 to-stone-900 border border-stone-950 px-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-0 border-t-4 border-t-emerald-600/40 relative flex items-center justify-between">
                      
                      <div className="w-6 h-6 bg-gradient-to-b from-[#059669] to-[#047857] rounded-lg border border-emerald-700 shadow-inner -mt-1 flex items-center justify-center">
                        <div className="w-2 h-3.5 bg-stone-950 rounded-sm" />
                      </div>

                      {isHeating && (
                        <div className="absolute -top-7.5 left-[42%] flex gap-1 relative z-10 select-none pointer-events-none">
                          <motion.div 
                            animate={{ scaleY: [1, 2.7 * flameScale, 1], scaleX: [1, 1.4 * flameScale, 1] }} 
                            transition={{ repeat: Infinity, duration: 0.12 }} 
                            className="w-3.5 h-5 bg-cyan-400 rounded-t-full origin-bottom opacity-90 filter blur-[0.5px]" 
                          />
                          <motion.div 
                            animate={{ scaleY: [1, 3.4 * flameScale, 1], scaleX: [1, 1.2 * flameScale, 1] }} 
                            transition={{ repeat: Infinity, duration: 0.14, delay: 0.05 }} 
                            className="w-4.5 h-6.5 bg-emerald-500 rounded-t-full origin-bottom mix-blend-screen opacity-90 shadow-lg" 
                          />
                          <motion.div 
                            animate={{ scaleY: [1, 2.2 * flameScale, 1], scaleX: [1, 1.5 * flameScale, 1] }} 
                            transition={{ repeat: Infinity, duration: 0.18 }} 
                            className="w-3.5 h-5 bg-[#059669] rounded-t-full origin-bottom opacity-80" 
                          />
                        </div>
                      )}

                      <span className="text-[7.5px] text-zinc-400 font-mono tracking-widest font-extrabold text-center flex-1">{t('bunsen_burner_system')}</span>

                      {isJuiceInHeater && !isCoagulated && (
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={runStoveHeating}
                          disabled={isHeating}
                          className={`w-6 h-6 rounded-full border shadow-lg flex items-center justify-center cursor-pointer relative z-30 transition-all ${
                            isHeating 
                              ? 'bg-red-500 border-red-400 font-bold shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse' 
                              : 'bg-zinc-800 hover:bg-zinc-700 border-stone-750 shadow-inner'
                          }`}
                          title="Press to Ignite Heating System"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isHeating ? 'bg-white' : 'bg-red-500/80 animate-ping'}`} />
                        </motion.button>
                      )}

                      {(!isJuiceInHeater || isCoagulated) && (
                        <div className="w-6 h-6 bg-stone-950 rounded-full border border-stone-850 shadow-inner flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-72 mt-5 text-center">
                    {isJuiceInHeater && !isCoagulated ? (
                      <button
                        type="button"
                        onClick={runStoveHeating}
                        disabled={isHeating}
                        className="w-full py-3.5 bg-gradient-to-r from-[#00E676] to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase rounded-xl tracking-widest shadow-[0_4px_15px_rgba(0,230,118,0.25)] transition-transform duration-100 hover:scale-[1.01]"
                      >
                        {isHeating ? (
                          <span className="flex items-center justify-center gap-2">
                            <RotateCw size={14} className="animate-spin text-black" />
                            <span>{t('thermophilic_coagulation', { temp: temperature.toFixed(1) })}</span>
                          </span>
                        ) : (
                          <span>{t('boil_proteins')}</span>
                        )}
                      </button>
                    ) : isCoagulated ? (
                      <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/35 text-center text-xs font-mono text-[#00E676] flex items-center justify-center gap-2 animate-bounce">
                        <CheckCircle2 size={16} />
                        <span>{t('rubisco_coagulated')}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                </div>

                {/* THERMO-COAGULATION STATE MONITOR (Right Side) - Clean and Located beautiful on the side */}
                <div className="w-full max-w-[620px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {isJuiceInHeater ? (
                      <motion.div
                        key="active-state-leaf"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col bg-stone-900/40 p-5 rounded-2xl border border-stone-800 shadow-xl font-mono text-[10px] text-zinc-400 leading-relaxed gap-3 w-full"
                      >
                        <div className="text-[#00E676] flex items-center gap-1.5 border-b border-stone-800/80 pb-2 uppercase font-black tracking-wider text-[10.5px]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
                          {isRtl ? 'حالة التخثر الحراري' : 'THERMO-COAGULATION STATE'}
                        </div>
                        <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-850">
                          <span className="block font-bold text-zinc-500 uppercase text-[8px] tracking-wide mb-1">
                            {isRtl ? 'نوع عينة المستخلص' : 'SPECIMEN EXTRACT TYPE'}
                          </span>
                          <span className="text-emerald-400 font-extrabold text-[11.5px] uppercase tracking-wider">
                            {isRtl ? 'مستخلص أوراق الشجر القلوي' : 'LEAF ALKALI SOLUTE'}
                          </span>
                        </div>
                        
                        <div className="bg-stone-950/40 p-3 rounded-xl border border-stone-850/80 font-sans text-stone-300 leading-relaxed text-[11px]">
                          {temperature < 40 
                            ? (isRtl ? "البروتينات القابلة للذوبان مستقرة في المحلول. الحرارة مطلوبة لتفكيك الروابط الداخلية لبدء التمسخ." : "Soluble Rubisco & secondary proteins are stable in solution. Heat is required to break intramolecular bonds and trigger denaturation.")
                            : temperature < 55 
                              ? (isRtl ? "درجة الحرارة تفوق 40 مئوية، وتبدأ طيات بروتين الأوراق بالانفتاح وكشف المواقع الكارهة للماء." : "At above 40°C, leaf storage protein domains (Rubisco large & small subunits) begin unfolding, exposing crucial hydrophobic sites.")
                              : temperature < 68
                                ? (isRtl ? "بين 55 و 67 مئوية، تتماسك الأجزاء النشطة الكارهة للماء تدريجياً لتشكيل ألياف بروتينية خضراء دقيقة." : "Between 55°C and 67°C, hydrophobic regions actively seek associations, clumping in convective flow to form green micro-fibrils.")
                                : (isRtl ? "فوق 70 درجة مئوية، يتم بلوغ حالة التخثر الحراري التام وغير العكسي، مما يشكل خثارة خضراء مميزة مع تصفية السائل." : "At above 70°C, extreme heat-induced irreversible coagulation is reached, forming structured green curds. Surrounding liquid is clarified.")
                          }
                        </div>

                        {/* Clean state visualization metric */}
                        <div className="mt-1 border-t border-stone-850/80 pt-3 flex flex-col gap-1.5">
                          <div className="flex justify-between text-[8px] text-zinc-500 uppercase font-black tracking-widest">
                            <span>{isRtl ? 'اكتمال عملية نزع المسخ' : 'DENATURATION PROGRESS'}</span>
                            <span>{Math.min(100, Math.floor(((temperature - 24) / (72 - 24)) * 100))}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${temperature >= 68 ? 'bg-[#00E676]' : 'bg-red-500/80'}`} style={{ width: `${Math.max(0, Math.min(100, ((temperature - 24) / (72 - 24)) * 100))}%` }} />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col bg-stone-900/10 p-6 rounded-2xl border border-stone-800/40 justify-center items-center text-center font-mono text-[9px] text-stone-500 w-full min-h-[220px] border-dashed select-none">
                        <TrendingUp size={24} className="text-zinc-600/30 mb-2.5 animate-pulse" />
                        <span className="uppercase text-[9px] tracking-widest font-black text-stone-500">
                          {isRtl ? 'مستشعر التخثر الحراري' : 'THERMO-COAGULATOR STATE'}
                        </span>
                        <p className="font-sans text-[8px] text-stone-605 mt-1 leading-normal max-w-[200px]">
                          {isRtl ? 'بانتظار سكب العصارة الخضراء في الدورق لبدء القياس.' : 'Awaiting green extract pour into the flask vessel before thermal monitoring.'}
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })()}

          {/* 6. PROTEIN CAKE PRESS & HARVEST STAGE */}
          {activeStep === 6 && (
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 max-w-5xl select-none">
              
              {/* Hot Coagulated Beaker (Left) */}
              <div className="flex flex-col items-center justify-center min-h-[200px] w-full lg:w-1/4">
                <AnimatePresence mode="wait">
                  {!isCurdInPress ? (
                    <motion.div
                      key="unpoured-curd"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center space-y-3 relative z-25 flex flex-col items-center"
                    >
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-relaxed font-black">
                        {t('hot_coagulum')}
                      </div>
                      
                      <motion.div
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.4}
                        dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                        onDragStart={() => setDraggingItem('leaf_curd_beaker')}
                        onDragEnd={(e, info) => {
                          setDraggingItem(null);
                          if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
                            setIsCurdInPress(true);
                            playSynthBeep(360);
                          }
                        }}
                        onClick={() => {
                          setIsCurdInPress(true);
                          playSynthBeep(360);
                        }}
                        whileHover={{ scale: 1.08, translateY: -3 }}
                        whileDrag={{ scale: 1.15 }}
                        className="w-32 h-32 cursor-grab active:cursor-grabbing bg-stone-900/90 border border-emerald-500/30 rounded-2xl shadow-xl flex flex-col items-center justify-center relative p-3 transition-all hover:bg-stone-850 hover:border-emerald-500/50 touch-none select-none"
                      >
                        {/* Detailed Hot Coagulated Beaker */}
                        <div className="w-16 h-18 bg-gradient-to-b from-sky-500/5 via-sky-500/10 to-emerald-500/15 border-2 border-stone-400/70 rounded-b-xl rounded-tr-xl flex flex-col justify-end items-center pb-2.5 px-3 relative shadow-inner">
                          {/* Steam Vapor when unpoured */}
                          <div className="absolute top-1.5 inset-x-3 flex justify-around opacity-60">
                            <motion.span animate={{ y: [-3, -12], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-3 bg-white/20 rounded-full filter blur-[0.5px]" />
                            <motion.span animate={{ y: [-4, -15], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} className="w-1 h-2 bg-white/30 rounded-full filter blur-[0.5px]" />
                          </div>
                          {/* Graduations */}
                          <div className="absolute left-1.5 top-2 flex flex-col gap-1.5 font-mono text-[5px] text-zinc-500">
                            <span>300ml</span>
                            <span>200ml</span>
                            <span>100ml</span>
                          </div>
                          {/* Coagulated Hot Liquid inside the pouring vessel */}
                          <div className="w-full h-11 bg-gradient-to-t from-emerald-900/80 via-[#059669] to-[#00E676]/40 rounded-b-lg border-t border-[#00E676]/50 opacity-95 relative overflow-hidden flex items-center justify-center">
                            {/* Inner protein curd aggregates floating */}
                            <div className="flex gap-1 opacity-80">
                              <motion.div animate={{ scale: [0.9, 1.2, 0.9] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2.5 h-2.5 bg-[#00E676] rounded-full filter drop-shadow-[0_0_2px_#00E676]" />
                              <motion.div animate={{ scale: [1.1, 0.8, 1.1] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-emerald-400 font-extrabold mt-2 uppercase text-center leading-none tracking-widest">{t('pour_to_filter')}</span>
                        <span className="text-[6px] text-stone-550 font-sans mt-0.5">{t('drag_or_tap')}</span>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="poured-curd"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 0.45, scale: 0.95 }}
                      className="w-32 h-32 bg-stone-950/20 border border-stone-900 rounded-2xl flex flex-col items-center justify-center text-center p-3 select-none"
                    >
                      <CheckCircle2 size={18} className="text-[#00E676] mb-1 animate-pulse" />
                      <span className="text-[9px] font-mono text-emerald-400 uppercase font-black tracking-wider leading-none">{t('curd_depoted')}</span>
                      <span className="text-[6.5px] text-stone-550 mt-1 leading-normal">{t('slurry_transferred')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Lab Filtration and Compression Apparatus (Center) */}
              <div className="flex flex-col items-center w-full lg:w-1/2 overflow-visible">
                <div className={`relative p-6 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col items-center w-full max-w-sm transition-all duration-300 ${
                  draggingItem === 'leaf_curd_beaker'
                    ? 'border-emerald-400 bg-emerald-950/10 scale-102 shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-pulse'
                    : 'border-stone-850 bg-stone-950/40'
                } border`}>
                  
                  {/* Glass reflections & metallic framing overlay */}
                  <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
                  
                  {/* Ambient apparatus light glow */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full filter blur-[40px] pointer-events-none" />

                  {/* Laboratory Simulation Canvas */}
                  <svg viewBox="0 0 200 290" className="w-56 h-80 drop-shadow-2xl overflow-visible">
                    <defs>
                      {/* Filter Paper Absorption Gradient */}
                      <linearGradient id="harvestPaperAbsorb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#224229" stopOpacity="0.1" />
                        <stop offset="60%" stopColor="#e2faf2" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>

                      {/* Glowing protein cake gradient */}
                      <radialGradient id="glowingProtein" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00E676" />
                        <stop offset="65%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#064E3B" />
                      </radialGradient>

                      {/* Clear filtered water reservoir gradient */}
                      <linearGradient id="clearWaterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                        <stop offset="10%" stopColor="#0284c7" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#075985" stopOpacity="0.8" />
                      </linearGradient>

                      {/* Heavy Piston Metal body gradient */}
                      <linearGradient id="heavyMetalGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>

                      {/* Glass reflections */}
                      <linearGradient id="glassGlareHarvest" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.01)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
                      </linearGradient>
                    </defs>

                    {/* TILTING POURING STREAM ANIMATION */}
                    {isCurdInPress && !isPressing && !isPressDone && (
                      <g>
                        {/* Pouring line down to filter cup */}
                        <motion.path 
                          d="M 20 20 Q 55 45, 100 65"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          opacity={0.8}
                          animate={{ strokeDashoffset: [0, -20], strokeWidth: [3, 4, 3] }}
                          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                          style={{ strokeDasharray: "10, 5" }}
                        />
                        {/* Tilting Beaker Ghost shadow */}
                        <g transform="translate(-15, -15) rotate(-55, 30, 35)" className="opacity-90">
                          <rect x="15" y="20" width="30" height="40" rx="4" fill="rgba(80,80,80,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                          <rect x="17" y="32" width="26" height="26" fill="url(#glowingProtein)" opacity="0.8" rx="2" />
                          <line x1="15" y1="20" x2="20" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                        </g>
                      </g>
                    )}

                    {/* 12-TON HYDRAULIC PRESSURE PLUNGER SHAFT */}
                    {/* Position descends smoothly based on progress */}
                    <g transform={`translate(0, ${isPressDone ? 38 : isPressing ? (pressProgress * 0.38) : 0})`} className="transition-transform duration-300 ease-out z-15">
                      {/* Metal Piston Body */}
                      <path d="M 85 -20 L 115 -20 L 115 42 L 140 42 L 140 47 L 60 47 L 60 42 L 85 42 Z" fill="url(#heavyMetalGrad)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                      {/* Piston sealing rubber ring */}
                      <rect x="62" y="44" width="76" height="2" fill="#ef4444" opacity="0.8" />
                      {/* Pressure status ring highlight */}
                      <circle cx="100" cy="15" r="4" fill={isPressing ? "#00E676" : "#4b5563"} className={isPressing ? "animate-pulse" : ""} />
                    </g>

                    {/* UPPER FUNNEL GLASS (Matches Step 4 laboratory funnel silhouette) */}
                    <path d="M 50 45 L 150 45 L 115 110 L 115 150 L 85 150 L 85 110 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                    {/* Glass glare highlight in funnel */}
                    <path d="M 52 46 L 85 110" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />

                    {/* FOLDED FILTER PAPER CONE inside funnel */}
                    {isCurdInPress && (
                      <g>
                        {/* Filter paper body */}
                        <path d="M 55 48 L 100 106 L 145 48 Z" fill="url(#harvestPaperAbsorb)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        
                        {/* Fold/Pleats */}
                        <line x1="66" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                        <line x1="78" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
                        <line x1="89" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                        <line x1="100" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
                        <line x1="111" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                        <line x1="122" y1="48" x2="100" y2="106" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                        <line x1="133" y1="48" x2="100" y2="106" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />

                        {/* COAGULATED PROTEIN CLUSTERS - Spongy aggregates that merge into tightly pressed cake */}
                        {!isPressDone ? (
                          <g>
                            {/* Fluffy clusters floating above filter paper apex before being pressed */}
                            <motion.g 
                              animate={isPressing ? { 
                                scaleY: 1 - (pressProgress * 0.007),
                                translateY: pressProgress * 0.28
                              } : { y: [0, -1, 0] }}
                              transition={{ repeat: isPressing ? 0 : Infinity, duration: 2.2, ease: "easeInOut" }}
                              style={{ transformOrigin: "100px 106px" }}
                            >
                              {/* Cluster 1: Soft organic shapes */}
                              <motion.circle 
                                cx="90" cy="74" r="8" 
                                fill="url(#glowingProtein)" 
                                filter="drop-shadow(0 0 5px rgba(0,230,118,0.7))"
                                animate={{ scale: [1, 1.08, 1], x: [0, 1.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.8 }}
                              />
                              {/* Cluster 2 */}
                              <motion.circle 
                                cx="108" cy="76" r="9" 
                                fill="url(#glowingProtein)" 
                                filter="drop-shadow(0 0 5px rgba(0,230,118,0.7))"
                                animate={{ scale: [1, 1.12, 1], x: [0, -2, 0] }}
                                transition={{ repeat: Infinity, duration: 2.1, delay: 0.3 }}
                              />
                              {/* Cluster 3 */}
                              <motion.circle 
                                cx="100" cy="85" r="10" 
                                fill="url(#glowingProtein)" 
                                filter="drop-shadow(0 0 6px rgba(0,230,118,0.8))"
                                animate={{ scale: [1, 1.05, 1], y: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
                              />
                              {/* Cluster 4 */}
                              <motion.circle 
                                cx="81" cy="80" r="6" 
                                fill="url(#glowingProtein)" 
                                filter="drop-shadow(0 0 4px rgba(0,230,118,0.5))"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                              />
                              {/* Slurry blending lines linking them slightly to seem coalesced */}
                              <path d="M 83 78 Q 100 80, 115 76" fill="none" stroke="rgba(0,230,118,0.4)" strokeWidth="2.5" />
                              <path d="M 94 72 Q 100 88, 102 89" fill="none" stroke="rgba(0,230,118,0.4)" strokeWidth="3" />
                            </motion.g>
                          </g>
                        ) : (
                          /* COMPLETED, HIGHLY SATISFYING, COMPRESSED GLOWING PROTEIN CAKE (LPC CAKE) */
                          <g>
                            {/* Cylindrical compressed slab at apex */}
                            <motion.path 
                              initial={{ opacity: 0, scaleY: 0.2 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              transition={{ duration: 0.5 }}
                              d="M 68 83 C 68 83, 100 95, 132 83 Q 120 106, 100 106 Q 80 106, 68 83 Z"
                              fill="url(#glowingProtein)"
                              stroke="rgba(255,255,255,0.65)"
                              strokeWidth="1.2"
                              filter="drop-shadow(0 0 10px rgba(0,230,118,0.85))"
                            />
                            {/* Inner cake glowing details */}
                            <ellipse cx="100" cy="86" rx="23.5" ry="3.5" fill="#34d399" opacity="0.6" />
                            <text x="100" y="94" textAnchor="middle" fill="#022c16" fontStyle="normal" style={{ fontSize: "5.5px", fontFamily: "JetBrains Mono, monospace", fontWeight: "900", letterSpacing: "1px" }}>LPC CAKE</text>
                            
                            {/* Stars particles indicating successful harvesting */}
                            <g>
                              <circle cx="85" cy="74" r="0.8" fill="#fff" className="animate-ping" />
                              <circle cx="112" cy="78" r="0.8" fill="#fff" className="animate-ping" style={{ animationDelay: "0.2s" }} />
                            </g>
                          </g>
                        )}
                      </g>
                    )}

                    {/* FUNNEL SPOUT STEM OUTFLOW */}
                    <g transform="translate(0, 6)">
                      {/* Spout glass extension */}
                      <path d="M 94 144 L 94 165 L 106 160 L 106 144 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
                      
                      {/* Falling clean clear water/whey droplets */}
                      {isCurdInPress && (isPressing || !isPressDone) && (
                        <g>
                          {/* Continuous running string of liquid */}
                          <line x1="100" y1="165" x2="100" y2="185" stroke="#38bdf8" strokeWidth="1.5" opacity={isPressing ? "0.6" : "0.2"} />
                          {/* Fast Drips under pressure */}
                          <motion.circle 
                            animate={{ cy: [168, 222], opacity: [1, 0.7, 0] }}
                            transition={{ repeat: Infinity, duration: isPressing ? 0.3 : 0.65, ease: "easeIn" }}
                            cx="100" 
                            cy="168" 
                            r="1.8" 
                            fill="#38bdf8" 
                          />
                          <motion.circle 
                            animate={{ cy: [168, 222], opacity: [1, 0.7, 0] }}
                            transition={{ repeat: Infinity, duration: isPressing ? 0.3 : 0.65, delay: isPressing ? 0.15 : 0.32, ease: "easeIn" }}
                            cx="100" 
                            cy="168" 
                            r="1.2" 
                            fill="#bae6fd" 
                          />
                        </g>
                      )}
                    </g>

                    {/* RECEIVER FLASK (Collector of Separated Clear Whey Moisture) */}
                    <g transform="translate(0, -6)">
                      {/* Clear fluid filling inside erlenmeyer based on press stage */}
                      {isCurdInPress && (
                        <g>
                          <motion.path 
                            initial={{ d: "M 88 238 L 112 238 L 153 262 A 6 6 0 0 1 147 268 L 53 268 A 6 6 0 0 1 47 262 Z" }}
                            animate={{ 
                              d: isPressDone 
                                ? "M 75 204 L 125 204 L 157 262 A 6 6 0 0 1 151 268 L 49 268 A 6 6 0 0 1 47 262 Z" // high clear water
                                : isPressing 
                                  ? "M 80 220 L 120 220 L 156 262 A 6 6 0 0 1 150 268 L 50 268 A 6 6 0 0 1 44 262 Z" // mid clear water
                                  : "M 88 238 L 112 238 L 153 262 A 6 6 0 0 1 147 268 L 53 268 A 6 6 0 0 1 47 262 Z" // low clear water
                            }}
                            transition={{ duration: 0.5 }}
                            fill="url(#clearWaterGrad)" 
                          />

                          {/* Ripples on water surface inside receiver flask */}
                          {isPressing && (
                            <motion.ellipse 
                              animate={{ 
                                rx: [15, 23, 15], 
                                ry: [1, 2.5, 1],
                                opacity: [0.8, 0.2, 0.8]
                              }}
                              transition={{ repeat: Infinity, duration: 0.4 }}
                              cx="100" 
                              cy={isPressDone ? 204 : isPressing ? 220 : 238} 
                              r="15" 
                              fill="#7dd3fc" 
                              opacity="0.5"
                            />
                          )}
                        </g>
                      )}

                      {/* Flask outer glass body */}
                      <path 
                        d="M 88 175 L 112 175 L 112 195 L 158 261 A 8 8 0 0 1 151 270 L 49 270 A 8 8 0 0 1 42 261 L 88 195 Z" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.32)" 
                        strokeWidth="2.5" 
                        strokeLinejoin="bevel"
                      />

                      {/* Volumetric printed scale marks */}
                      <g fill="rgba(255,255,255,0.3)" fontStyle="normal" style={{ fontSize: "5.5px", fontFamily: "JetBrains Mono, monospace", fontWeight: "bold" }}>
                        <text x="110" y="222">150ml</text>
                        <line x1="102" y1="220" x2="107" y2="220" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                        <text x="115" y="242">100ml</text>
                        <line x1="106" y1="240" x2="111" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                        <text x="120" y="258">50ml</text>
                        <line x1="110" y1="256" x2="115" y2="256" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                      </g>

                      {/* Glass highlight glare stripes */}
                      <path d="M 148 259 L 109 203" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M 52 259 L 85 212" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />

                      {/* Flask Rim Collar */}
                      <ellipse cx="100" cy="175" rx="13" ry="3.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                    </g>
                  </svg>

                  {/* Operational Apparatus Status Ribbon */}
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-mono font-black tracking-wider bg-black/70 px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-[#00E676] shadow-md whitespace-nowrap">
                    {isPressDone 
                      ? t('dryCakeHarvested') 
                      : isPressing 
                        ? t('compressingDemoist') 
                        : (isCurdInPress ? t('coagulumDepot') : t('apparatusPristine'))
                    }
                  </span>
                </div>

                {/* Squeeze trigger controls */}
                <div className="w-72 mt-5 text-center">
                  {isCurdInPress && !isPressDone ? (
                    <button
                      type="button"
                      onClick={runHydraulicPress}
                      disabled={isPressing}
                      className="w-full py-3.5 bg-gradient-to-r from-[#00E676] to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase rounded-xl tracking-widest shadow-[0_4px_15px_rgba(0,230,118,0.25)] transition-transform duration-100 hover:scale-[1.01]"
                    >
                      {isPressing ? (
                        <span className="flex items-center justify-center gap-2">
                          <RotateCw size={14} className="animate-spin text-black" />
                          <span>{t('expressing_water', { progress: pressProgress })}</span>
                        </span>
                      ) : (
                        <span>{t('run_press')}</span>
                      )}
                    </button>
                  ) : isPressDone ? (
                    <div className="space-y-3">
                      <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/35 text-center text-xs font-mono text-[#00E676] flex items-center justify-center gap-2 animate-bounce">
                        <CheckCircle2 size={16} />
                        <span>{t('cake_secured')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await generatePDFReport('lab', {
                            isLegume: false,
                            workflowName: language === 'ar' ? 'مسار استخلاص البروتين الورقي' : 'Leaf Protein Extraction Pathway',
                            rawWeight: leafWeight,
                            lpcYield: expectedLpcYieldG,
                            pureProtein: expectedPureProteinG,
                            coProducts: expectedLpcYieldG * 0.45,
                            compost: expectedFiberWasteG
                          }, language as any, t);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-[10px] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download size={11} />
                        {language === 'ar' ? 'تحميل التقرير الكامل' : 'Download Full Report (PDF)'}
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full py-2.5 bg-stone-900 border border-stone-850 hover:bg-stone-800 text-[10px] uppercase text-zinc-300 rounded-lg transition-all flex items-center justify-center gap-1 font-bold tracking-wider"
                      >
                        {t('rerun_cycle')}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Yield Statistics Display Card */}
              <div className="flex flex-col items-center justify-center w-full lg:w-1/4 animate-fade-in">
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-2.5 text-xs font-mono w-48 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/5 rounded-full" />
                  
                  <span className="text-[8px] text-[#00E676] uppercase font-black tracking-widest block border-b border-stone-850 pb-1.5 flex items-center gap-1">
                    <span>■</span> {t('netMassBalanced')}
                  </span>
                  
                  <div className="space-y-1 text-[10.5px]">
                    <div className="flex justify-between text-zinc-400">
                      <span>{language === 'ar' ? 'الوزن الطازج للأوراق:' : t('freshLeaves') || 'Fresh Leaves:'}</span>
                      <span className="text-zinc-200 font-bold">{leafWeight}g</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 border-t border-stone-850/40 pt-1">
                      <span>{t('proteinConcentrate') || 'Melted LPC:'}</span>
                      <span className="text-[#00E676] font-black text-xs">~{expectedLpcYieldG.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 border-t border-stone-850/40 pt-1">
                      <span>{t('pureAminos') || 'Pure Aminos:'}</span>
                      <span className="text-indigo-400 font-black">~{expectedPureProteinG.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 border-t border-stone-850/40 pt-1 text-emerald-400">
                      <span>{language === 'ar' ? 'مخلفات عضوية للتربة:' : 'Soil Compost Residue:'}</span>
                      <span className="font-extrabold">~{expectedFiberWasteG.toFixed(1)}g</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
          </>
        )}

        {/* LEGUME WORKFLOW STEPS */}
        {activeWorkflow === 'legume' && (
          <>
            {activeStep === 1 && renderLegumeStep1()}
            {activeStep === 2 && renderLegumeStep2()}
            {activeStep === 3 && renderLegumeStep3()}
            {activeStep === 4 && renderLegumeStep4()}
            {activeStep === 5 && renderLegumeStep5()}
            {activeStep === 6 && renderLegumeStep6()}
            {activeStep === 7 && renderLegumeStep7()}
          </>
        )}

      </div>

        {/* BOTTOM STEP CONTROLS (Elegant "Next" arrow with smart status lock) */}
        <div className="w-full flex items-center justify-between border-t border-stone-850/60 pt-4 mt-2">
          
          <motion.button
            type="button"
            disabled={activeStep === 1}
            onClick={() => {
              setActiveStep((prev) => (prev - 1) as StepType);
              playSynthBeep(330);
            }}
            whileHover={activeStep !== 1 ? { scale: 1.05 } : {}}
            whileTap={activeStep !== 1 ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="p-2 sm:px-4 bg-stone-900 text-stone-300 border border-stone-800 rounded-lg hover:text-white hover:border-stone-700 transition-colors text-sm disabled:opacity-20 disabled:cursor-not-allowed uppercase font-bold cursor-pointer"
          >
            {t('prev')}
          </motion.button>

          <div className="text-center">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
              {activeWorkflow === 'leaf' ? activeLeaf?.leafSeason : activeLegume?.season}
            </span>
          </div>

          <motion.button
            type="button"
            disabled={activeStep === (activeWorkflow === 'leaf' ? 6 : 7)}
            onClick={() => {
              setActiveStep((prev) => (prev + 1) as StepType);
              playSynthBeep(380);
            }}
            whileHover={activeStep !== (activeWorkflow === 'leaf' ? 6 : 7) ? { scale: 1.05 } : {}}
            whileTap={activeStep !== (activeWorkflow === 'leaf' ? 6 : 7) ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`p-2 sm:px-4 bg-gradient-to-r ${
              activeWorkflow === 'leaf' 
                ? 'from-[#00E676] to-teal-400 hover:from-emerald-450 hover:to-teal-350 shadow-[0_0_15px_rgba(0,230,118,0.2)]' 
                : 'from-amber-400 to-yellow-500 hover:from-amber-450 hover:to-yellow-405 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            } text-black font-extrabold rounded-lg text-sm disabled:opacity-20 disabled:cursor-not-allowed uppercase flex items-center gap-1.5 cursor-pointer`}
          >
            <span>{t('next')}</span>
            <ChevronRight size={14} />
          </motion.button>
        </div>

      </div>

      {/* RENDER MODAL FOR SYNTHESIZING CUSTOM FOLIAGES */}
      <AnimatePresence>
        {showCustomLeafModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 p-6 rounded-2xl w-full max-w-md relative"
            >
              <h3 className="text-base font-black text-white mb-2">{isRtl ? 'صمم مواصفات فصيلتك العضوية' : 'Synthesize Leaf Parameter Specimen'}</h3>
              <p className="text-xs text-stone-400 mb-4 font-sans leading-relaxed">
                {isRtl ? 'أدخل البيانات المرجعية لعينتك العضوية لتستشرف المحاكاة نسب الاستقصاء الحيوية.' : 'Provide basic calibration specs for your newly cultivated foliage. The lab simulation will adapt its outputs instantly.'}
              </p>

              <form onSubmit={handleAddCustom} className="space-y-3.5 text-xs font-mono">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-zinc-400 block mb-1">الاسم بالعربية:</span>
                    <input required placeholder="مثال: ورقة توت" className="w-full bg-stone-950 border border-stone-800 p-2 rounded text-xs text-white" value={newLeafNameAr} onChange={e=>setNewLeafNameAr(e.target.value)} />
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">English Name:</span>
                    <input required placeholder="e.g. Mulberry Leaf" className="w-full bg-stone-950 border border-stone-800 p-2 rounded text-xs text-white" value={newLeafNameEn} onChange={e=>setNewLeafNameEn(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-zinc-400 block mb-1">Base Sample Weight (g):</span>
                    <input type="number" min="100" max="5000" className="w-full bg-stone-950 border border-stone-800 p-2 rounded text-xs text-white" value={newLeafWeightG} onChange={e=>setNewLeafWeightG(Number(e.target.value))} />
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">Expected Protein Cake (g):</span>
                    <input type="number" min="10" max="1000" className="w-full bg-stone-950 border border-stone-800 p-2 rounded text-xs text-white" value={newLeafConcentrateG} onChange={e=>setNewLeafConcentrateG(Number(e.target.value))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-zinc-400 block mb-1">Pure Amino Active (g):</span>
                    <input type="number" min="1" max="500" className="w-full bg-stone-950 border border-stone-800 p-2 rounded text-xs text-white" value={newLeafProteinG} onChange={e=>setNewLeafProteinG(Number(e.target.value))} />
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">Compost Slag Fibers (g):</span>
                    <input type="number" min="10" max="2000" className="w-full bg-stone-950 border border-stone-800 p-2 rounded text-xs text-white" value={newLeafWasteG} onChange={e=>setNewLeafWasteG(Number(e.target.value))} />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button type="button" onClick={()=>setShowCustomLeafModal(false)} className="px-3.5 py-1.5 bg-stone-850 rounded text-[11px] font-bold text-stone-400">Cancel</button>
                  <button type="submit" className="px-3.5 py-1.5 bg-emerald-500 text-black font-extrabold rounded text-[11px]">Save & Calibrate</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
