import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  FileText, 
  Download, 
  ArrowRight,
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Beaker,
  Bot,
  Table as TableIcon,
  LayoutDashboard,
  Search,
  Leaf,
  Zap,
  TrendingUp,
  Droplets,
  Sprout,
  DollarSign,
  Calculator,
  BarChart3,
  Recycle,
  Globe,
  Scale,
  User,
  X,
  Layers,
  ArrowDownToLine,
  ChevronRight as ChevronRightIcon,
  RotateCw,
  Compass,
  Award,
  Sparkles,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  LEAF_SOURCES, 
  COMPLEMENTARY_SOURCES, 
  BlendAnalysis,
  ProteinSource,
  LEAF_TYPES,
  CalculationResult,
  FAO_2013_ADULT_STANDARD,
  LeafType
} from './types';
import { calculateBlendAnalysis, calculateProduction, cn, formatNumber, formatCurrency, generateMixesForLeaf, getTranslatedName } from './utils';
import { generatePDFReport } from './utils/pdfGenerator';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { BiomassHeroCanvas } from './components/BiomassHeroCanvas';
import { Methodology } from './components/Methodology';
import { EconomicAnalysis } from './components/EconomicAnalysis';
import { ChatAssistant } from './components/ChatAssistant';
import { AminoAcidComparison } from './components/AminoAcidComparison';
import { PersonalNutritionMode } from './components/PersonalNutritionMode';
import { translations, Language } from './translations';
import { LanguageSelector } from './components/LanguageSelector';
import { ProteinLabSimulator } from './components/ProteinLabSimulator';
import { GreenProteinVisionScanner } from './components/GreenProteinVisionScanner';

const playSynthBeep = (freq: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration = 0.15) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Fail silently when audio holds browser blocks
  }
};

const PRECISION_NUTRITION_CALCULATOR_TITLES: Record<string, string> = {
  en: "Precision Nutrition Calculator",
  ar: "حساب حصتك الغذائية التشارمية الدقيقة",
  de: "Präzisions-Ernährungsrechner",
  fr: "Calculateur de Nutrition de Précision",
  it: "Calcolatore di Nutrizione di Precisione",
  zh: "精准营养计算器",
  ru: "Точный калькулятор питания",
  pt: "Calculadora de Nutrição de Precisão",
  es: "Calculadora de Nutrición de Precisión",
  hi: "सटीक पोषण कैलकुलेटर"
};

const PRECISION_NUTRITION_CALCULATOR_DESCS: Record<string, string> = {
  en: "Calculate your precise foliage-based protein requirements and essential dietary amino acid balances based on your biological criteria.",
  ar: "احسب احتياجاتك البروتينية والأحماض الأمينية الدقيقة بناءً على ميزاتك الحيوية ومستخلصات أوراق الجميز والتين والتوت للتكامل الغذائي المستدام.",
  de: "Berechnen Sie Ihren präzisen Proteinbedarf auf Laubbasis und die Bilanzen essenzieller Aminosäuren auf der Grundlage Ihrer biologischen Kriterien.",
  fr: "Calculez vos besoins précis en protéines foliaires et vos équilibres d'acides aminés essentiels d'après vos critères biologiques.",
  it: "Calcola i tuoi fabbisogni proteici precisi da fogliame ed equilibri amminoacidici essenziali in base ai tuoi criteri biologici.",
  zh: "根据您的生物学标准计算精准的叶基蛋白需求及必需膳食氨基酸平衡。",
  ru: "Рассчитайте свои точные потребности в растительном белке и баланс незаменимых аминокислот на основе ваших биологических критериев.",
  pt: "Calcule seus requisitos exatos de proteína foliar e balanços de aminoácidos essenciais com base em seus critérios biológicos.",
  es: "Calcule sus requisitos precisos de proteína a partir de follaje y balances de aminoácidos esenciales según sus criterios biológicos.",
  hi: "अपने जैविक मानदंडों के आधार पर सटीक पत्तियों पर आधारित प्रोटीन आवश्यकताओं और आवश्यक अमीनो एसिड संतुलन की गणना करें।"
};

const BIOTECH_ENTERPRISE_COMMAND_TITLES: Record<string, string> = {
  en: "Biotech Enterprise Command Interface",
  ar: "مركز التحليل والإنتاج الصناعي",
  de: "Biotech-Enterprise-Befehlsschnittstelle",
  fr: "Interface de Commande de Biotech d'Entreprise",
  it: "Interfaccia di Comando Biotech Enterprise",
  zh: "生物科技企业级控制中心",
  ru: "Командный интерфейс биотехнологического предприятия",
  pt: "Interface de Comando de Biotecnologia Corporativa",
  es: "Interfaz de Comando de Biotecnología Empresarial",
  hi: "बायोटेक एंटरप्राइज कमांड इंटरफ़ेस"
};

const SYNERGETIC_BIO_GRID_SUBTITLES: Record<string, string> = {
  en: "SYNERGETIC BIO-GRID REACTOR V.2",
  ar: "مفاعل الشبكة البيولوجية المتآزرة V.2",
  de: "SYNERGETISCHER BIO-GRID-REAKTOR V.2",
  fr: "RÉACTEUR BIO-GRID SYNERGIQUE V.2",
  it: "REATTORE BIO-GRID SINERGICO V.2",
  zh: "协同生物网格反应器 V.2",
  ru: "СИНЕРГЕТИЧЕСКИЙ БИО-ГРИД РЕАКТОР V.2",
  pt: "REATOR BIO-GRID SINÉRGICO V.2",
  es: "REACTOR BIO-GRID SINÉRGICO V.2",
  hi: "सिनर्जेटिक बायो-ग्रिड रिएक्टर V.2"
};

const translatePrepStep = (step: string, lang: string): string => {
  const normalizedStep = step.trim().toLowerCase();

  // Wash leaves
  if (normalizedStep.includes("wash leaves")) {
    const washMap: Record<string, string> = {
      en: "Wash leaves 🌊",
      ar: "غسل الأوراق 🌊",
      de: "Blätter waschen 🌊",
      fr: "Laver les feuilles 🌊",
      it: "Lavare le foglie 🌊",
      es: "Lavar las hojas 🌊",
      pt: "Lavar as folhas 🌊",
      ru: "Мытье листьев 🌊",
      zh: "清洗叶片 🌊",
      hi: "पत्तियां धोएं 🌊"
    };
    return washMap[lang] || washMap.en;
  }

  // Grind / Grinding
  if (normalizedStep.includes("grind")) {
    const grindMap: Record<string, string> = {
      en: "Grind and crush ⚙️",
      ar: "طحن وتكسير الخلايا ⚙️",
      de: "Mahlen und Zerkleinern ⚙️",
      fr: "Broyer et écraser ⚙️",
      it: "Macinare e frantumare ⚙️",
      es: "Moler y triturar ⚙️",
      pt: "Moer e triturar ⚙️",
      ru: "Измельчение и помол ⚙️",
      zh: "研磨细胞 ⚙️",
      hi: "पीसना और कुचलنا ⚙️"
    };
    return grindMap[lang] || grindMap.en;
  }

  // Extract with water / Water extraction
  if (normalizedStep.includes("extract with water") || normalizedStep.includes("water extraction")) {
    const extractMap: Record<string, string> = {
      en: "Extract with water 💧",
      ar: "استخلاص مائي للبروتين 💧",
      de: "Extraktion mit Wasser 💧",
      fr: "Extraction par l'eau 💧",
      it: "Estrazione con acqua 💧",
      es: "Extracción con agua 💧",
      pt: "Extração com água 💧",
      ru: "Экстракция водой 💧",
      zh: "加水高效提取 💧",
      hi: "पानी से निकालना 💧"
    };
    return extractMap[lang] || extractMap.en;
  }

  // Filter / Filtration
  if (normalizedStep.includes("filter") || normalizedStep.includes("filtration")) {
    const filterMap: Record<string, string> = {
      en: "Double filtration 🧉",
      ar: "ترشيح وتصفية السوائل 🧉",
      de: "Doppelte Filtration 🧉",
      fr: "Filtrage et clarification 🧉",
      it: "Filtrazione e chiarificazione 🧉",
      es: "Filtración doble 🧉",
      pt: "Dupla filtração 🧉",
      ru: "Двойная фильтрация 🧉",
      zh: "双重过滤澄清 🧉",
      hi: "दोहरा निस्पंदन 🧉"
    };
    return filterMap[lang] || filterMap.en;
  }

  // Heat coagulation
  if (normalizedStep.includes("heat coagulation")) {
    const matchTemp = normalizedStep.match(/(\d+)\s*°\s*c/);
    const tempStr = matchTemp ? `${matchTemp[1]}°C` : "70°C";

    const coagMap: Record<string, string> = {
      en: `Heat coagulation at ${tempStr} 🔥`,
      ar: `التخثر الحراري عند ${tempStr} 🔥`,
      de: `Hitzekoagulation bei ${tempStr} 🔥`,
      fr: `Coagulation thermique à ${tempStr} 🔥`,
      it: `Coagulation termica a ${tempStr} 🔥`,
      es: `Coagulación térmica a ${tempStr} 🔥`,
      pt: `Coagulação térmica a ${tempStr} 🔥`,
      ru: `Тепловая коагуляция при ${tempStr} 🔥`,
      zh: `定温 ${tempStr} 热凝结 🔥`,
      hi: `${tempStr} पर ताप स्कंदन 🔥`
    };
    return coagMap[lang] || coagMap.en;
  }

  // Wash and dry / Drying
  if (normalizedStep.includes("wash and dry") || normalizedStep.includes("drying")) {
    const dryMap: Record<string, string> = {
      en: "Wash and dry protein concentrate 📦",
      ar: "غسيل وتجفيف بروتين مجمع 📦",
      de: "Proteinkonzentrat waschen und trocknen 📦",
      fr: "Laver et sécher le concentré de protéine 📦",
      it: "Lavare e asciugare il concentrato proteico 📦",
      es: "Lavar y secar el concentrado de proteína 📦",
      pt: "Lavar e secar o concentrado de proteína 📦",
      ru: "Промывка и сушка белкового концентрата 📦",
      zh: "洗涤并干燥浓缩蛋白 📦",
      hi: "प्रोटीन ध्यान धोएं और सुखाएं 📦"
    };
    return dryMap[lang] || dryMap.en;
  }

  // Triple washing to reduce bitterness
  if (normalizedStep.includes("triple washing") || normalizedStep.includes("reduce bitterness")) {
    const tripleMap: Record<string, string> = {
      en: "Triple washing to reduce bitterness 🌊",
      ar: "غسيل ثلاثي للحد من المرارة 🌊",
      de: "Dreifaches Waschen zur Reduzierung der Bitterkeit 🌊",
      fr: "Triple lavage pour réduire l'amertume 🌊",
      it: "Triplo lavaggio per ridurre l'amarezza 🌊",
      es: "Triple lavado para reducir el amargor 🌊",
      pt: "Lavagem tripla para reduzir o amargor 🌊",
      ru: "Тройная промывка для удаления горечи 🌊",
      zh: "三次清洗以降低苦味 🌊",
      hi: "कड़वाहट कम करने के लिए तीन बार धोना 🌊"
    };
    return tripleMap[lang] || tripleMap.en;
  }

  // Blanching treatment
  if (normalizedStep.includes("blanching")) {
    const blanchMap: Record<string, string> = {
      en: "Blanching treatment 🌡️",
      ar: "معاملة سلق حراري 🌡️",
      de: "Blanchieren 🌡️",
      fr: "Blanchiment thermique 🌡️",
      it: "Trattamento di scottatura 🌡️",
      es: "Tratamiento de escaldado 🌡️",
      pt: "Branqueamento térmico 🌡️",
      ru: "Бланширование 🌡️",
      zh: "热烫预处理 🌡️",
      hi: "ब्लांचिंग प्रक्रिया 🌡️"
    };
    return blanchMap[lang] || blanchMap.en;
  }

  return step;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'production' | 'research' | 'methodology' | 'economic' | 'ai-assistant' | 'nutrition' | 'simulator' | 'personal' | 'industry' | 'scanner'>('home');
  const [experienceMode, setExperienceMode] = useState<'industry' | 'personal' | null>(null);
  
  // High-Tech Industrial section state
  const [industrySection, setIndustrySection] = useState<'production' | 'research' | 'methodology' | 'economic'>('production');

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language') as Language;
    if (saved && Object.keys(translations).includes(saved)) return saved;
    const browserLang = navigator.language.split('-')[0] as Language;
    if (Object.keys(translations).includes(browserLang)) return browserLang;
    return 'en';
  });

  const [showDisclaimers, setShowDisclaimers] = useState(false);
  const t = translations[language];
  
  React.useEffect(() => {
    localStorage.setItem('app-language', language);
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // SEO: Update page title and meta description
    const titles: Record<typeof activeTab, string> = {
      home: t.common.appTitle,
      personal: `Personal Mode | ${t.common.appTitle}`,
      industry: `Industry Mode | ${t.common.appTitle}`,
      production: `${t.nav.production} | ${t.common.appTitle}`,
      research: `${t.nav.research} | ${t.common.appTitle}`,
      methodology: `${t.nav.methodology} | ${t.common.appTitle}`,
      economic: `${t.nav.economic} | ${t.common.appTitle}`,
      'ai-assistant': `${t.nav.aiAssistant} | ${t.common.appTitle}`,
      nutrition: `${t.nutrition.title} | ${t.common.appTitle}`,
      simulator: `Protein Lab Simulator | ${t.common.appTitle}`,
      scanner: `Green Protein Vision Scanner | ${t.common.appTitle}`
    };
    document.title = titles[activeTab] || t.common.appTitle;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t.home.heroDesc);
    }
  }, [language, activeTab, t]);

  // Dynamic leaf species list
  const [customLeaves, setCustomLeaves] = useState<LeafType[]>(() => {
    try {
      const saved = localStorage.getItem('custom-leaf-types');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allLeafTypes = useMemo(() => {
    return [...LEAF_TYPES, ...customLeaves];
  }, [customLeaves]);

  const handleAddCustomLeaf = (newLeaf: LeafType) => {
    const updated = [...customLeaves, newLeaf];
    setCustomLeaves(updated);
    localStorage.setItem('custom-leaf-types', JSON.stringify(updated));
  };

  // Production State
  const [leafId, setLeafId] = useState(LEAF_TYPES[0].id);
  const [quantity, setQuantity] = useState<number>(LEAF_TYPES[0].leafWeightG);
  const [mixIndex, setMixIndex] = useState<number>(0);
  const [prodResult, setProdResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [prodViewMode, setProdViewMode] = useState<'chart' | 'table'>('chart');
  const [showMethods, setShowMethods] = useState(false);

  // Research State
  const [selectedLeafId, setSelectedLeafId] = useState<string>(LEAF_SOURCES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [researchViewMode, setResearchViewMode] = useState<'standard' | 'comparison'>('standard');

  const FIXED_RESEARCH_RATIO = 0.55;
  
  const selectedLeaf = useMemo(() => allLeafTypes.find(l => l.id === leafId) || allLeafTypes[0], [allLeafTypes, leafId]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const activeMixes = selectedLeaf.mixes && selectedLeaf.mixes.length > 0 
        ? selectedLeaf.mixes 
        : generateMixesForLeaf(selectedLeaf.id, selectedLeaf.leafPureProteinG, selectedLeaf.leafProteinConcentrateG);
      const mix = activeMixes[mixIndex] || activeMixes[0];
      const res = calculateProduction(selectedLeaf, quantity, mix, language);
      setProdResult(res);
      setIsCalculating(false);
    }, 800);
  };

  const aaData = useMemo(() => {
    if (!prodResult) return [];
    return prodResult.blendAnalysis.aminoAcids.map(aa => ({
      name: (t.aminoAcids as any)[aa.key] || aa.name,
      optimized: aa.blend,
      fao: aa.fao,
      fullMark: 10
    }));
  }, [prodResult, t]);

  const allBlends = useMemo(() => {
    const blends: BlendAnalysis[] = [];
    LEAF_SOURCES.forEach(leaf => {
      COMPLEMENTARY_SOURCES.forEach(comp => {
        blends.push(calculateBlendAnalysis(leaf, comp, FIXED_RESEARCH_RATIO, language));
      });
    });
    return blends;
  }, []);

  const filteredBlends = useMemo(() => {
    return allBlends.filter(blend => {
      const matchLeaf = blend.leaf.id === selectedLeafId;
      const translatedName = getTranslatedName(blend.complement, language).toLowerCase();
      const matchSearch = translatedName.includes(searchQuery.toLowerCase());
      return matchLeaf && matchSearch;
    });
  }, [allBlends, selectedLeafId, searchQuery, language]);

  const exportToPDF = (blend: BlendAnalysis) => {
    const doc = new jsPDF();
    const leafName = getTranslatedName(blend.leaf, language);
    const compName = getTranslatedName(blend.complement, language);

    const title = `${t.pdf.title}: ${leafName} + ${compName}`;
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${t.pdf.generatedOn}: ${new Intl.DateTimeFormat(language).format(new Date())}`, 14, 30);
    doc.text(`${t.pdf.standard}`, 14, 35);
    autoTable(doc, {
      startY: 45,
      head: [[t.pdf.aminoAcid, t.pdf.faoStd, t.pdf.blendVal, t.pdf.chemicalScore, t.pdf.limitingAA]],
      body: blend.aminoAcids.map(aa => [
        (t.aminoAcids as any)[aa.key] || aa.name,
        aa.fao.toFixed(2),
        aa.blend.toFixed(2),
        aa.score.toFixed(2) + '%',
        aa.isLimiting ? t.pdf.yes : t.pdf.no
      ]),
      headStyles: { fillColor: [5, 150, 105] },
      columnStyles: { 3: { fontStyle: 'bold' } }
    });
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(t.pdf.scientificSummary, 14, finalY);
    doc.setFontSize(10);
    doc.text(`${t.pdf.limitingAminoAcid}: ${(t.aminoAcids as any)[blend.limitingAA.toLowerCase()] || blend.limitingAA}`, 14, finalY + 10);
    doc.text(`${t.pdf.overallScore}: ${blend.chemicalScore.toFixed(2)}%`, 14, finalY + 17);
    doc.text(`${t.pdf.completenessLevel}: ${blend.completeness}`, 14, finalY + 24);
    const interpretationText = `${t.pdf.interpretation}: ${blend.interpretation}`;
    const splitText = doc.splitTextToSize(interpretationText, 180);
    doc.text(splitText, 14, finalY + 34);
    
    let fileName = t.common.analysisPdfFileName || "Analysis_{leaf}_{complement}";
    fileName = fileName.replace("{leaf}", leafName).replace("{complement}", compName) + ".pdf";
    doc.save(fileName);
  };

  // Modern navigation sectors list - 5 SECTIONS
  const mainTabs = [
    { id: 'personal', label: t.nav.personalMode, icon: <User size={15} /> },
    { id: 'industry', label: t.nav.industryMode, icon: <FlaskConical size={15} /> },
    { id: 'simulation', label: t.nav.simulationMode, icon: <Layers size={15} /> },
    { id: 'scanner', label: t.nav.aiVisionScanner, icon: <Camera size={15} /> },
    { id: 'chat_assistant', label: t.nav.chatAssistant, icon: <Bot size={15} /> }
  ];

  const handleTabSelection = (tabStyleId: string) => {
    playSynthBeep(580, 'sine', 0.08);
    if (tabStyleId === 'personal') {
      setActiveTab('personal');
    } else if (tabStyleId === 'industry') {
      setActiveTab(industrySection);
    } else if (tabStyleId === 'simulation') {
      setActiveTab('simulator');
    } else if (tabStyleId === 'chat_assistant') {
      setActiveTab('ai-assistant');
    } else if (tabStyleId === 'scanner') {
      setActiveTab('scanner');
    }
  };

  const isTabActive = (tabStyleId: string) => {
    if (tabStyleId === 'personal') return activeTab === 'personal' || activeTab === 'nutrition';
    if (tabStyleId === 'industry') return activeTab === 'production' || activeTab === 'research' || activeTab === 'methodology' || activeTab === 'economic';
    if (tabStyleId === 'simulation') return activeTab === 'simulator';
    if (tabStyleId === 'chat_assistant') return activeTab === 'ai-assistant';
    if (tabStyleId === 'scanner') return activeTab === 'scanner';
    return false;
  };

  return (
    <div className="min-h-screen text-stone-800 font-sans selection:bg-emerald-100 relative overflow-x-hidden bg-[#FAF9F5]">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-grain z-50 opacity-[0.25]" />
      
      {/* Header */}
      <header className="border-b border-stone-200/40 bg-[#FAF9F5]/70 backdrop-blur-3xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex-1 flex justify-start">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('home')}>
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/15 transition-all duration-500"
              >
                <Sprout size={20} />
              </motion.div>
              <div>
                <h1 className={cn(
                  "font-display font-black tracking-tight text-stone-900 group-hover:text-emerald-900 transition-colors uppercase text-sm"
                )}>
                  {t.common.appTitle}
                </h1>
                <span className="text-[8px] font-mono tracking-widest text-[#10B981] font-bold block -mt-1">{t.nav.precisionBiotech}</span>
              </div>
            </div>
          </div>

          {/* Navigation Section (Center 4 main tabs) */}
          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <div className="bg-stone-200/50 p-1 rounded-2xl flex items-center gap-1 border border-stone-300/30">
              {mainTabs.map((tab) => {
                const active = isTabActive(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelection(tab.id)}
                    className={cn(
                      "px-5 py-2 rounded-xl transition-all duration-300 whitespace-nowrap font-bold uppercase tracking-wider relative flex items-center gap-2",
                      language === 'ar' ? "text-xs" : "text-[9px]",
                      active 
                        ? "text-emerald-950 font-black" 
                        : "text-stone-500 hover:text-stone-800 hover:bg-stone-300/40"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="navTabIndicator"
                        className="absolute inset-0 bg-white shadow-sm border border-stone-300/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {tab.icon}
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Language Selector & CTA (Right) */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
            <button 
              onClick={() => handleTabSelection('simulation')}
              className={cn(
                "px-5 py-2.5 bg-emerald-900 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/10 hover:bg-emerald-950 transition-all duration-300 active:scale-95 uppercase tracking-widest hidden sm:block",
                language === 'ar' ? "text-xs" : "text-[9px]"
              )}
            >
              {t.nav.launchLab}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className={cn(activeTab === 'home' ? "relative" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12")}>
        <AnimatePresence mode="wait">
          
          {/* REDESIGNED HOMEPAGE */}
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col relative"
            >
              {/* Biomass Interactive background canvas */}
              <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16">
                <BiomassHeroCanvas />

                <div className="relative z-10 text-center max-w-5xl px-6 space-y-8">
                  {/* Glowing Pulse Badge */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-mono tracking-widest text-emerald-800 font-bold uppercase mb-4"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {t.home.refiningLoop}
                  </motion.div>
                  
                  {/* Title & Headline */}
                  <motion.h2 
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-display font-black text-stone-900 leading-[1.08] tracking-tight text-5xl md:text-8xl"
                  >
                    {t.home.heroTitlePart1} <br />
                    <span className="bg-gradient-to-r from-emerald-800 to-green-600 bg-clip-text text-transparent">{t.home.heroTitlePart2}</span>
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg"
                  >
                    {t.home.heroDesc}
                  </motion.p>
                  
                  {/* Quick Launch Button */}
                  <motion.div
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4"
                  >
                    <button 
                      onClick={() => handleTabSelection('simulation')}
                      className="px-10 py-4.5 bg-stone-950 hover:bg-black text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-widest flex items-center gap-4 mx-auto shadow-2xl shadow-stone-950/20 group hover:scale-105 active:scale-[0.98]"
                    >
                      {translations[language].nav.getStarted}
                      <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* BENTO QUICK ACCESS SECTORS (4 Cards) */}
              <section className="max-w-7xl mx-auto px-6 py-24 w-full relative z-10">
                <div className="text-center mb-16 space-y-2">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest font-mono">{t.home.ecosystemOverview}</span>
                  <h3 className="text-3xl font-display font-medium text-stone-900 tracking-tight">
                    {t.home.exploreModules}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1: Personal Mode */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.01 }}
                    onClick={() => handleTabSelection('personal')}
                    className="bg-white rounded-[2.5rem] border border-stone-200/60 p-8 sm:p-10 cursor-pointer flex flex-col justify-between group shadow-sm transition-all relative overflow-hidden active:scale-95 text-stone-800"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 opacity-40" />
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800 shadow-inner">
                          <User size={24} />
                        </div>
                        <h4 className="text-2xl font-display font-bold text-stone-900">{t.home.personalMode}</h4>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed mb-10 font-medium">
                        {t.home.personalDesc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center bg-stone-50/50 p-4 -mx-4 -mb-4 rounded-b-[2.5rem] border-t border-stone-100">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800">{t.home.personalBadge}</span>
                      <ChevronRight size={14} className={cn("text-stone-400 group-hover:translate-x-1.5 transition-transform", language === 'ar' && "rotate-180 group-hover:-translate-x-1.5")} />
                    </div>
                  </motion.div>

                  {/* Card 2: Industry Mode */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.01 }}
                    onClick={() => handleTabSelection('industry')}
                    className="bg-[#111827] text-white rounded-[2.5rem] p-8 sm:p-10 cursor-pointer flex flex-col justify-between group shadow-xl transition-all relative overflow-hidden active:scale-95"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 opacity-20" />
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                          <FlaskConical size={24} />
                        </div>
                        <h4 className="text-2xl font-display font-bold">{t.home.industryMode}</h4>
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed mb-10">
                        {t.home.industryDesc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-4 -mx-4 -mb-4 rounded-b-[2.5rem] border-t border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 font-mono">{t.home.industryBadge}</span>
                      <ChevronRight size={14} className={cn("text-stone-400 group-hover:translate-x-1.5 transition-transform", language === 'ar' && "rotate-180 group-hover:-translate-x-1.5")} />
                    </div>
                  </motion.div>

                  {/* Card 3: Simulation Mode */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.01 }}
                    onClick={() => handleTabSelection('simulation')}
                    className="bg-white rounded-[2.5rem] border border-stone-200/60 p-8 sm:p-10 cursor-pointer flex flex-col justify-between group shadow-sm transition-all relative overflow-hidden active:scale-95 text-stone-800"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 opacity-40" />
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 shadow-inner">
                          <Layers size={24} />
                        </div>
                        <h4 className="text-2xl font-display font-bold text-stone-900">{t.home.simulationMode}</h4>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed mb-10 font-medium">
                        {t.home.simulationDesc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center bg-stone-50/50 p-4 -mx-4 -mb-4 rounded-b-[2.5rem] border-t border-stone-100">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#00E676] font-mono">{t.home.simulationBadge}</span>
                      <ChevronRight size={14} className={cn("text-stone-400 group-hover:translate-x-1.5 transition-transform", language === 'ar' && "rotate-180 group-hover:-translate-x-1.5")} />
                    </div>
                  </motion.div>

                  {/* Card 4: Chat Assistant */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.01 }}
                    onClick={() => handleTabSelection('chat_assistant')}
                    className="bg-[#0b1329] text-white rounded-[2.5rem] p-8 sm:p-10 cursor-pointer flex flex-col justify-between group shadow-xl transition-all relative overflow-hidden active:scale-95"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 opacity-20" />
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                          <Bot size={24} />
                        </div>
                        <h4 className="text-2xl font-display font-bold">{t.home.chatAssistant}</h4>
                      </div>
                      <p className="text-[#94A3B8] text-sm leading-relaxed mb-10">
                        {t.home.chatDesc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-4 -mx-4 -mb-4 rounded-b-[2.5rem] border-t border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 font-mono">{t.home.chatBadge}</span>
                      <ChevronRight size={14} className={cn("text-stone-400 group-hover:translate-x-1.5 transition-transform", language === 'ar' && "rotate-180 group-hover:-translate-x-1.5")} />
                    </div>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          ) : activeTab === 'personal' || activeTab === 'nutrition' ? (
            
            /* UNIFIED PERSONAL MODE */
            <motion.div
              key="personal-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/50 pb-8">
                <div>
                  <h2 className="text-4xl font-display font-bold tracking-tight text-stone-900 mb-2">
                    {PRECISION_NUTRITION_CALCULATOR_TITLES[language] || PRECISION_NUTRITION_CALCULATOR_TITLES.en}
                  </h2>
                  <p className="text-stone-500 text-sm max-w-2xl font-medium">
                    {PRECISION_NUTRITION_CALCULATOR_DESCS[language] || PRECISION_NUTRITION_CALCULATOR_DESCS.en}
                  </p>
                </div>
              </div>

              <div>
                <PersonalNutritionMode language={language} t={t} />
              </div>
            </motion.div>
          ) : activeTab === 'simulator' ? (
            
            /* SIMULATION MODE (Protein lab simulator) */
            <motion.div
              key="simulator"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <ProteinLabSimulator 
                allLeafTypes={allLeafTypes} 
                onAddCustomLeaf={handleAddCustomLeaf} 
                language={language} 
              />
            </motion.div>
          ) : activeTab === 'scanner' ? (
            
            /* BRAND NEW VISUAL AI VISION SCANNING DECK */
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <GreenProteinVisionScanner language={language} />
            </motion.div>
          ) : activeTab === 'ai-assistant' ? (
            
            /* CHAT ASSISTANT MODE */
            <motion.div 
              key="ai-assistant"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ChatAssistant 
                language={language} 
                t={t} 
                contextData={{
                  leafType: allLeafTypes.find(l => l.id === leafId),
                  quantity,
                  productionResults: prodResult,
                  availableBlends: allBlends,
                  customRatio: FIXED_RESEARCH_RATIO
                }} 
              />
            </motion.div>
          ) : (
            
            /* UNIFIED INDUSTRY MODE (Production, comparison, methodology, economic models) */
            <motion.div
              key="industry"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {/* INDUSTRIAL GALAXY HUD SELECTOR */}
              <div className="bg-[#111827] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden shadow-2xl">
                {/* Micro laser line scan */}
                <div className="absolute inset-x-0 w-full h-[1px] bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-scan pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-[8px] text-emerald-400 font-bold uppercase tracking-[0.25em]">
                        {SYNERGETIC_BIO_GRID_SUBTITLES[language] || SYNERGETIC_BIO_GRID_SUBTITLES.en}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight mt-1">
                      {BIOTECH_ENTERPRISE_COMMAND_TITLES[language] || BIOTECH_ENTERPRISE_COMMAND_TITLES.en}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:flex gap-1.5 w-full xl:w-auto">
                    {[
                      { id: 'production', label: t.nav.production, icon: <Calculator size={13} /> },
                      { id: 'research', label: t.nav.research, icon: <BarChart3 size={13} /> },
                      { id: 'methodology', label: t.nav.methodology, icon: <Sprout size={13} /> },
                      { id: 'economic', label: t.nav.economic, icon: <DollarSign size={13} /> }
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setIndustrySection(sub.id as any);
                          setActiveTab(sub.id as any);
                          playSynthBeep(450, 'sine', 0.1);
                        }}
                        className={cn(
                          "px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 transition-all relative",
                          activeTab === sub.id || (activeTab === 'industry' && industrySection === sub.id)
                            ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)] border border-emerald-500"
                            : "bg-white/5 text-stone-300 hover:text-white hover:bg-white/10 border border-white/5"
                        )}
                      >
                        {sub.icon}
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RENDER CURRENT ACTIVE INDUSTRY PANEL */}
              <div>
                {/* 1. Production Lab Screen */}
                {(activeTab === 'production' || (activeTab === 'industry' && industrySection === 'production')) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                  >
                    {/* Input Side-panel */}
                    <div className="lg:col-span-4 space-y-8">
                      <section className="bg-white rounded-[2.5rem] border border-stone-200/60 p-8 shadow-xl shadow-stone-200/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-60" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
                              <FlaskConical size={18} />
                            </div>
                            <h2 className="text-lg font-display font-bold text-stone-900">{t.common.parameters}</h2>
                          </div>

                          <div className="space-y-8">
                            <div className="space-y-3">
                              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.15em]">{t.common.treeLeafType}</label>
                              <select 
                                value={leafId}
                                onChange={(e) => {
                                  setLeafId(e.target.value);
                                  setMixIndex(0);
                                }}
                                className="w-full bg-stone-50/50 border border-stone-200/60 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                              >
                                {allLeafTypes.map(leaf => (
                                  <option key={leaf.id} value={leaf.id}>
                                    {getTranslatedName(leaf, language)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.15em]">{t.common.leafQuantityGrams}</label>
                              <div className="relative">
                                <input 
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => setQuantity(Number(e.target.value))}
                                  className="w-full bg-stone-50/50 border border-stone-200/60 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-stone-400 uppercase">g</span>
                              </div>
                            </div>

                            <div className="pt-6 border-t border-stone-100">
                              <div className="space-y-6">
                                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.15em]">{t.common.complementaryMix}</label>
                                <select 
                                  value={mixIndex}
                                  onChange={(e) => setMixIndex(Number(e.target.value))}
                                  className="w-full bg-stone-50/50 border border-stone-200/60 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                                >
                                  {selectedLeaf.mixes.map((mix, index) => (
                                    <option key={index} value={index}>{(t.sources as any)[mix.sourceId] || mix.sourceId}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <button 
                                onClick={handleCalculate}
                                disabled={isCalculating}
                                className="w-full bg-emerald-900 hover:bg-emerald-950 disabled:bg-stone-200 text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-emerald-900/10 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] text-xs uppercase tracking-widest"
                              >
                                {isCalculating ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <FlaskConical size={18} />
                                  </motion.div>
                                ) : (
                                  <>
                                    <Zap size={16} className="text-emerald-400" />
                                    <span>{t.common.optimizeProduction}</span>
                                    <ChevronRight size={14} className="opacity-50" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Results panel */}
                    <div className="lg:col-span-8">
                      <AnimatePresence mode="wait">
                        {prodResult ? (
                          <motion.div 
                            key="prod-results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white p-8 rounded-3xl border border-stone-200/60 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <Leaf size={60} />
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-8 h-8 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center">
                                    <Leaf size={16} />
                                  </div>
                                  <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider">{t.common.leafProteinAnalysis}</h3>
                                </div>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-end">
                                    <span className="text-xs text-stone-500 font-semibold">{t.common.pureProtein}</span>
                                    <span className="text-xl font-bold text-stone-900">{formatNumber(prodResult.leafPureProteinG, language)}g</span>
                                  </div>
                                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(prodResult.leafPureProteinG / prodResult.totalProteinGrams) * 100}%` }}
                                      className="bg-emerald-500 h-full"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-8 rounded-3xl border border-stone-200/60 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <Zap size={60} />
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-8 h-8 bg-amber-50 text-amber-800 rounded-lg flex items-center justify-center">
                                    <Zap size={16} />
                                  </div>
                                  <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider">{t.common.sourceProteinAnalysis}</h3>
                                </div>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-end">
                                    <span className="text-xs text-stone-500 font-semibold">{t.common.pureProtein}</span>
                                    <span className="text-xl font-bold text-stone-900">{formatNumber(prodResult.sourcePureProteinG, language)}g</span>
                                  </div>
                                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(prodResult.sourcePureProteinG / prodResult.totalProteinGrams) * 100}%` }}
                                      className="bg-amber-500 h-full"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                              <div className="bg-emerald-900 text-white p-6 rounded-[2rem] relative overflow-hidden shadow-xl">
                                <p className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest mb-1">{t.common.totalPureProtein}</p>
                                <h3 className="text-2xl font-display font-bold">{formatNumber(prodResult.totalProteinGrams, language)}g</h3>
                              </div>
                              <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm">
                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t.lab.leafConcentrate}</p>
                                <h3 className="text-2xl font-display font-bold text-stone-900">{formatNumber(prodResult.leafConcentrateG, language)}g</h3>
                              </div>
                              <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm">
                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t.lab.legumeConcentrate}</p>
                                <h3 className="text-2xl font-display font-bold text-stone-900">{formatNumber(prodResult.sourceConcentrateG, language)}g</h3>
                              </div>
                              <div className="bg-white p-6 rounded-[2rem] border border-emerald-500/10 shadow-sm">
                                <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest mb-1">{t.lab.blendRatio}</p>
                                <h3 className="text-xl font-display font-bold text-emerald-700">{selectedLeaf.mixes[mixIndex].leafRatioPercent}:{selectedLeaf.mixes[mixIndex].sourceRatioPercent}</h3>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={async () => {
                                  await generatePDFReport('lab', {
                                    isLegume: true,
                                    workflowName: language === 'ar' ? 'مسار الإنتاج الصناعي للبروتين الورقي والبروتين البقولي المكمل' : 'Optimized Industrial Green Protein Production',
                                    rawWeight: quantity,
                                    lpcYield: prodResult.leafConcentrateG + prodResult.sourceConcentrateG,
                                    pureProtein: prodResult.totalProteinGrams,
                                    coProducts: prodResult.sourceConcentrateG * 0.4,
                                    compost: quantity * 0.15,
                                    coagulationTemp: 75,
                                    isoelectricPh: 4.8
                                  }, language as any, t);
                                }}
                                className="w-full md:w-auto bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider text-xs border border-emerald-900/60"
                              >
                                <Download size={15} />
                                <span>{language === 'ar' ? 'تحميل تقرير المختبر الصناعي الكامل (PDF)' : 'Download Full Industry Lab Report (PDF)'}</span>
                              </button>
                            </div>

                            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/60 flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                                  <Scale size={18} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">{t.lab.legumeRequirement}</h4>
                                  <p className="text-xs text-amber-700">
                                    {t.lab.needText
                                      .replace('{amount}', formatNumber(selectedLeaf.mixes[mixIndex].sourceWeightG * (quantity / selectedLeaf.leafWeightG), language, 0))
                                      .replace('{source}', (t.sources as any)[prodResult.sourceId] || prodResult.sourceId)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                  <TrendingUp size={18} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">{t.lab.maxDailyIntake}</h4>
                                  <p className="text-xs text-emerald-700">
                                    {t.lab.recommendedLimit.replace('{amount}', formatNumber(prodResult.maxDailyConcentrateG, language))}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Amino acid evaluation */}
                            <div className="bg-white p-8 rounded-3xl border border-stone-200/60 shadow-sm">
                              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                  <Droplets className="text-emerald-800" size={18} />
                                  <h2 className="text-sm font-black uppercase text-stone-900 tracking-wider">{t.lab.aminoAcidOptimization}</h2>
                                </div>
                                <div className="flex bg-stone-100 p-1.5 rounded-xl">
                                  <button onClick={() => setProdViewMode('chart')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", prodViewMode === 'chart' ? "bg-white text-emerald-950 shadow-sm" : "text-stone-400")}>{t.lab.chart}</button>
                                  <button onClick={() => setProdViewMode('table')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", prodViewMode === 'table' ? "bg-white text-emerald-950 shadow-sm" : "text-stone-400")}>{t.lab.table}</button>
                                </div>
                              </div>
                              
                              <AnimatePresence mode="wait">
                                {prodViewMode === 'chart' ? (
                                  <motion.div key="chart" className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={aaData}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#6b7280' }} />
                                        <Radar name={t.lab.optimizedMix} dataKey="optimized" stroke="#047857" fill="#059669" fillOpacity={0.2} />
                                        <Radar name={t.lab.faoStandard} dataKey="fao" stroke="#2563eb" fill="none" strokeDasharray="3 3" />
                                        <Tooltip />
                                      </RadarChart>
                                    </ResponsiveContainer>
                                  </motion.div>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                      <thead>
                                        <tr className="border-b border-stone-100">
                                          <th className="py-3 font-black text-stone-400 uppercase tracking-widest text-[9px]">{t.lab.aminoAcid}</th>
                                          <th className="py-3 font-black text-stone-400 uppercase tracking-widest text-[9px]">{t.lab.faoStd}</th>
                                          <th className="py-3 font-black text-stone-400 uppercase tracking-widest text-[9px]">{t.lab.blendVal}</th>
                                          <th className="py-3 font-black text-stone-400 uppercase tracking-widest text-[9px]">{t.lab.score}</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-stone-50 font-medium">
                                        {prodResult.blendAnalysis.aminoAcids.map((aa, i) => (
                                          <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                                            <td className="py-3 text-stone-900">{(t.aminoAcids as any)[aa.key] || aa.name}</td>
                                            <td className="py-3 text-stone-400 font-mono">{aa.fao.toFixed(2)}</td>
                                            <td className="py-3 font-bold text-emerald-800 font-mono">{aa.blend.toFixed(2)}</td>
                                            <td className="py-3 font-bold">
                                              <span className={cn(
                                                aa.score >= 100 ? "text-emerald-600" : aa.isLimiting ? "text-rose-600" : "text-amber-500"
                                              )}>
                                                {aa.score.toFixed(1)}%
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Preparation notes */}
                            <div className="bg-white p-8 rounded-3xl border border-stone-200">
                              <div className="flex items-center gap-2 mb-6 text-stone-800 font-semibold text-sm uppercase tracking-wide">
                                <AlertCircle className="text-emerald-800" size={18} />
                                <h2>{t.lab.prepProtocol}</h2>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2.5">
                                  {prodResult.prepNotes.split(',').map((step, i) => {
                                    return (
                                      <div key={i} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                                        <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[9px] font-bold shrink-0">{i+1}</span>
                                        <span className="text-xs text-stone-600 leading-relaxed font-medium">
                                          {translatePrepStep(step, language)}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/60">
                                  <h4 className="text-xs font-black text-emerald-900 mb-4 uppercase tracking-wider">{t.lab.labStandards}</h4>
                                  <ul className="space-y-3.5 text-xs text-emerald-800 font-semibold">
                                    <li className="flex items-center gap-2"><CheckCircle2 size={13} /> {t.lab.heatCoagulation}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={13} /> {t.lab.doubleFiltration}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={13} /> {t.lab.controlledDrying}</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-stone-200 border-dashed">
                            <FlaskConical size={32} className="text-stone-300 mb-4" />
                            <h2 className="text-lg font-bold text-stone-900 mb-2">{t.common.productionLabReady}</h2>
                            <p className="text-xs text-stone-500 max-w-sm mx-auto">{t.common.selectParams}</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* 2. Amino Acid Comparison Screen */}
                {(activeTab === 'research' || (activeTab === 'industry' && industrySection === 'research')) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-10"
                  >
                    <div className="flex justify-center mb-8">
                      <div className="bg-stone-200/50 p-1 rounded-xl border border-stone-200 flex gap-1">
                        <button 
                          onClick={() => setResearchViewMode('standard')}
                          className={cn(
                            "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                            researchViewMode === 'standard' ? "bg-white text-emerald-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                          )}
                        >
                          <TableIcon size={12} />
                          {t.lab.table}
                        </button>
                        <button 
                          onClick={() => setResearchViewMode('comparison')}
                          className={cn(
                            "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                            researchViewMode === 'comparison' ? "bg-white text-emerald-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                          )}
                        >
                          <Scale size={12} />
                          {t.comparison.title}
                        </button>
                      </div>
                    </div>

                    {researchViewMode === 'standard' ? (
                      <>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <div>
                            <h2 className="text-2xl font-display font-black text-[#111827] mb-2">{t.common.aminoAcidsAnalysis}</h2>
                            <p className="text-stone-500 text-xs">
                              {t.common.analyzingBlend} <span className="font-bold underline decoration-emerald-200">{t.common.faoWhoStandards}</span>.
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                              <input 
                                type="text"
                                placeholder={t.lab.filterComplements}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-white border border-stone-200 text-xs rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none w-full sm:w-52 font-semibold"
                              />
                            </div>
                            <div className="bg-stone-200/50 p-1 rounded-xl border border-stone-300/20 flex gap-1 items-center">
                              {LEAF_SOURCES.map(leaf => (
                                <button
                                  key={leaf.id}
                                  onClick={() => setSelectedLeafId(leaf.id)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg text-[10px] font-bold transition-all",
                                    selectedLeafId === leaf.id 
                                      ? "bg-white text-emerald-950 shadow-sm" 
                                      : "text-stone-500 hover:text-stone-800"
                                  )}
                                >
                                  {getTranslatedName(leaf, language)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12 pt-4">
                          {filteredBlends.map((blend, idx) => (
                            <div 
                              key={`${blend.leaf.id}-${blend.complement.id}`}
                              className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
                            >
                              <div className="px-8 py-5 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-bold text-stone-900 leading-tight">
                                    {getTranslatedName(blend.leaf, language)} + {getTranslatedName(blend.complement, language)}
                                  </h3>
                                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t.comparison.scientificBlendAnalysis}</span>
                                </div>
                                <button 
                                  onClick={() => exportToPDF(blend)}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-900 text-white text-[10px] font-bold rounded-lg transition-all hover:bg-emerald-950 self-start"
                                >
                                  <Download size={12} />
                                  {t.lab.exportPdf}
                                </button>
                              </div>

                              <div className="p-8">
                                <div className="overflow-x-auto mb-6">
                                  <table className="w-full text-left text-xs">
                                    <thead>
                                      <tr className="border-b border-stone-100">
                                        <th className="py-3 px-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold">{t.lab.aminoAcid}</th>
                                        <th className="py-3 px-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold">{t.lab.faoStd}</th>
                                        <th className="py-3 px-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold">{t.lab.blendVal}</th>
                                        <th className="py-3 px-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold">{t.lab.chemicalScore}</th>
                                        <th className="py-3 px-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold">{t.economic.limitingAA}</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50 font-medium">
                                      {blend.aminoAcids.map((aa, i) => (
                                        <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                                          <td className="py-3 px-3 text-stone-900">{(t.aminoAcids as any)[aa.key] || aa.name}</td>
                                          <td className="py-3 px-3 text-stone-400 font-mono">{aa.fao.toFixed(2)}</td>
                                          <td className="py-3 px-3 text-stone-700 font-mono font-bold">{aa.blend.toFixed(2)}</td>
                                          <td className="py-3 px-3">
                                            <span className={cn("font-bold font-mono", aa.score >= 100 ? "text-emerald-600" : aa.isLimiting ? "text-rose-600" : "text-amber-500")}>
                                              {aa.score.toFixed(1)}%
                                            </span>
                                          </td>
                                          <td className="py-3 px-3">
                                            {aa.isLimiting ? (
                                              <span className="px-2.5 py-1 bg-rose-50 border border-rose-100 rounded-full text-[9px] font-semibold text-rose-600 uppercase">{t.common.limiting}</span>
                                            ) : (
                                              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-semibold text-emerald-600 uppercase">{t.common.optimal}</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="md:col-span-2 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                                    <h5 className="text-xs font-bold text-stone-450 uppercase mb-3 flex items-center gap-1.5"><FileText size={14} className="text-emerald-700" /> {t.lab.scientificInterpretation}</h5>
                                    <p className="text-xs text-stone-600 italic leading-relaxed">
                                      {blend.chemicalScore >= 100 
                                        ? t.lab.completeProfile 
                                        : t.lab.limitedBy.replace('{aa}', (t.aminoAcids as any)[blend.limitingAA.toLowerCase()] || blend.limitingAA)}
                                    </p>
                                  </div>
                                  <div className="flex gap-4 flex-col">
                                    <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-100 flex justify-between items-center">
                                      <span className="text-[9px] font-black uppercase text-[#94A3B8]">{t.lab.chemicalScore}</span>
                                      <span className="text-base font-bold text-emerald-700">{blend.chemicalScore.toFixed(1)}%</span>
                                    </div>
                                    <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-100 flex justify-between items-center">
                                      <span className="text-[9px] font-black uppercase text-[#94A3B8]">{t.common.estPdcaas}</span>
                                      <span className="text-base font-bold text-blue-700">{blend.pdcaas.toFixed(1)}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <AminoAcidComparison language={language} translations={t} />
                    )}
                  </motion.div>
                )}

                {/* 3. Scientific Methodology Screen */}
                {(activeTab === 'methodology' || (activeTab === 'industry' && industrySection === 'methodology')) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-3xl p-8 border border-stone-200"
                  >
                    <Methodology language={language} t={t} />
                  </motion.div>
                )}

                {/* 4. Economic Feasibility Screen */}
                {(activeTab === 'economic' || (activeTab === 'industry' && industrySection === 'economic')) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <EconomicAnalysis language={language} t={t} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Structured Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 mt-20 relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t.common.appTitle} {t.common.version}</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-xs text-stone-500 font-semibold">
            <button 
              onClick={() => {
                setShowDisclaimers(true);
                playSynthBeep(450, 'sine', 0.1);
              }}
              className="text-stone-400 hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center gap-1.5 font-bold"
            >
              <Scale size={13} />
              {t.footer.disclaimers}
            </button>
            <div className="flex gap-8 text-[10px] text-stone-450 uppercase tracking-widest">
              <span>{t.footer.institute}</span>
              <span>{t.footer.initiative}</span>
              <span>{t.footer.standards}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Disclaimers Modal */}
      <AnimatePresence>
        {showDisclaimers && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md"
            onClick={() => setShowDisclaimers(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-stone-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white shadow-xl">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-medium text-stone-900 leading-tight">{t.footer.disclaimers}</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDisclaimers(false)}
                  className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center transition-all"
                >
                  <X size={16} className="text-stone-400" />
                </button>
              </div>
              
              <div className="p-8 space-y-6 text-xs text-stone-600 leading-relaxed font-semibold">
                <div className="p-4.5 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
                  <p className="font-bold text-emerald-950 mb-1.5">{t.common.projectIntegrity}</p>
                  <p className="text-emerald-800 leading-relaxed">{t.home.disclaimers.projectIntegrity}</p>
                </div>

                <div className="space-y-4">
                  <p><strong>1. {t.common.nutritionalAccuracy}:</strong> {t.home.disclaimers.nutritionalAccuracy}</p>
                  <p><strong>2. {t.common.safetyProtocols}:</strong> {t.home.disclaimers.safetyProtocols}</p>
                  <p><strong>3. {t.common.liability}:</strong> {t.home.disclaimers.liability}</p>
                  <p><strong>4. {t.common.environmentalImpact}:</strong> {t.home.disclaimers.environmentalImpact}</p>
                </div>

                <div className="pt-6 border-t border-stone-100 flex justify-end">
                  <button 
                    onClick={() => setShowDisclaimers(false)}
                    className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-850 transition-colors uppercase tracking-wider"
                  >
                    {t.common.understood}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
