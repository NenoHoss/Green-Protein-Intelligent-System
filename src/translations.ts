import { de } from './i18n/de';
import { en } from './i18n/en';
import { ar } from './i18n/ar';
import { fr } from './i18n/fr';
import { it } from './i18n/it';
import { zh } from './i18n/zh';
import { ru } from './i18n/ru';
import { pt } from './i18n/pt';
import { es } from './i18n/es';
import { hi } from './i18n/hi';

export type Language = 'en' | 'ar' | 'fr' | 'it' | 'de' | 'zh' | 'ru' | 'pt' | 'es' | 'hi';

const extension: Record<Language, { nav: Record<string, string>; home: Record<string, string> }> = {
  en: {
    nav: {
      personalMode: "Personal Mode",
      industryMode: "Industry Mode",
      simulationMode: "Simulation Mode",
      aiVisionScanner: "AI Vision Scanner",
      chatAssistant: "Chat Assistant",
      precisionBiotech: "PRECISION BIOTECH",
      launchLab: "Launch Lab",
    },
    home: {
      refiningLoop: "Foliage Refining Loop Online",
      heroTitlePart1: "Plant Protein",
      heroTitlePart2: "Extraction Platform",
      heroDesc: "Interactive Biotechnology Experience optimizing local biomass into pure, complete Rubisco extracts tailored against international FAO/WHO nutritional indexes.",
      ecosystemOverview: "Ecosystem Overview",
      exploreModules: "Explore Operational Modules",
      personalMode: "Personal Mode",
      personalDesc: "Calculate your precise foliage-based protein requirements and essential dietary amino acid balances with zero formulas needed.",
      personalBadge: "Precision Calculator",
      industryMode: "Industry Mode",
      industryDesc: "Enterprise-grade suite offering amino-acid radar profiles, agricultural soil re-amendment parameters, and economic cost models.",
      industryBadge: "System Integration Log",
      simulationMode: "Simulation Mode",
      simulationDesc: "Interact with our physics-based filtration, maceration and warm clotting rigs using full-fluid procedural animations.",
      simulationBadge: "Fluid Physics Active",
      chatAssistant: "Chat Assistant",
      chatDesc: "Ask our specialized biotechnology model anything about local plant proteins, circular agricultural science, and extraction mechanics.",
      chatBadge: "Gemini 1.5 Pro Secure",
    }
  },
  ar: {
    nav: {
      personalMode: "الوضع الشخصي",
      industryMode: "الوضع الصناعي",
      simulationMode: "المركب الافتراضي",
      aiVisionScanner: "ماسح الذكاء الاصطناعي",
      chatAssistant: "المساعد الذكي",
      precisionBiotech: "تقنية حيوية دقيقة",
      launchLab: "تشغيل المختبر",
    },
    home: {
      refiningLoop: "مستقبل البروتين الذكي",
      heroTitlePart1: "مستودع استخلاص",
      heroTitlePart2: "بروتين النبات",
      heroDesc: "جسر تكنولوجي رائد يربط الكتلة الحيوية النباتية بالاحتياجات الغذائية الدقيقة لمنظمة الصحة العالمية، لإنتاج بروتينات بديلة خالية من الهدر.",
      ecosystemOverview: "نظرة عامة على النظام البيئي",
      exploreModules: "استكشف بوابات النظام البيئي",
      personalMode: "الوضع الشخصي",
      personalDesc: "احسب حصتك الغذائية التشارمية واحتياجاتك البروتينية والأحماض الأمينية الدقيقة بكل سهولة.",
      personalBadge: "حساب الحصة الغذائية",
      industryMode: "الوضع الصناعي",
      industryDesc: "لوحة التحكم للمؤسسات لتحليل الأحماض الأمينية، معايير كفاءة المغذيات، الجداول الاقتصادية، والخصوبة الدوارة.",
      industryBadge: "سجل تكامل النظام",
      simulationMode: "المركب الافتراضي",
      simulationDesc: "تصفح ومارس محاكاة عملية الترشيح والمراحل الخمس لاستخلاص بروتين الورق والحصول على شهادة المركب.",
      simulationBadge: "فيزياء السوائل نشطة",
      chatAssistant: "المساعد الذكي",
      chatDesc: "استشر المساعد الذكي حول أوراق الشجر والمحاكاة وطرح الأسئلة الكيميائية المتعلقة بالـ Rubisco.",
      chatBadge: "جيمني 1.5 برو آمن",
    }
  },
  fr: {
    nav: {
      personalMode: "Mode Personnel",
      industryMode: "Mode Industriel",
      simulationMode: "Mode Simulation",
      aiVisionScanner: "Scanner de Vision IA",
      chatAssistant: "Assistant IA",
      precisionBiotech: "BIOTECH DE PRÉCISION",
      launchLab: "Lancer le Labo",
    },
    home: {
      refiningLoop: "Boucle de raffinage du feuillage en ligne",
      heroTitlePart1: "Protéines Végétales",
      heroTitlePart2: "Plateforme d'extraction",
      heroDesc: "Une expérience biotechnologique interactive optimisant la biomasse locale en extraits de Rubisco purs et complets, alignés sur les indices nutritionnels de la FAO/OMS.",
      ecosystemOverview: "Vue d'ensemble de l'écosystème",
      exploreModules: "Explorer les modules opérationnels",
      personalMode: "Mode Personnel",
      personalDesc: "Calculez vos besoins précis en protéines foliaires et vos équilibres d'acides aminés essentiels sans aucune formule.",
      personalBadge: "Calculateur de Précision",
      industryMode: "Mode Industriel",
      industryDesc: "Suite d'entreprise offrant des analyses d'acides aminés, des paramètres d'amendement des sols et des modèles économiques.",
      industryBadge: "Journal d'intégration",
      simulationMode: "Mode Simulation",
      simulationDesc: "Interagissez avec nos installations de filtration physique, de macération et de coagulation à l'aide d'animations de fluides.",
      simulationBadge: "Physique des fluides active",
      chatAssistant: "Assistant IA",
      chatDesc: "Posez vos questions à notre modèle spécialisé sur les protéines végétales, l'économie circulaire et les méthodes d'extraction.",
      chatBadge: "Gemini 1.5 Pro Sécurisé",
    }
  },
  it: {
    nav: {
      personalMode: "Modalità Personale",
      industryMode: "Modalità Industriale",
      simulationMode: "Modalità Simulazione",
      aiVisionScanner: "Scanner Visivo IA",
      chatAssistant: "Assistente Chat",
      precisionBiotech: "BIOTECH DI PRECISIONE",
      launchLab: "Avvia il laboratorio",
    },
    home: {
      refiningLoop: "Circuito di raffinazione del fogliame attivo",
      heroTitlePart1: "Proteine Vegetali",
      heroTitlePart2: "Piattaforma di estrazione",
      heroDesc: "Esperienza biotecnologica interattiva per l'ottimizzazione della biomassa locale in estratti di Rubisco puri e completi secondo i parametri FAO/OMS.",
      ecosystemOverview: "Panoramica dell'ecosistema",
      exploreModules: "Esplora i moduli operativi",
      personalMode: "Modalità Personale",
      personalDesc: "Calcola i tuoi precisi fabbisogni proteici da fogliame ed equilibri amminoacidici essenziali senza bisogno di formule.",
      personalBadge: "Calcolatore di Precisione",
      industryMode: "Modalità Industriale",
      industryDesc: "Suite aziendale con profili radar degli amminoacidi, parametri di ammendamento del suolo e modelli di costo.",
      industryBadge: "Registro di integrazione",
      simulationMode: "Modalità Simulazione",
      simulationDesc: "Interagisci con i nostri sistemi di filtrazione fisica, macerazione e coagulazione tramite animazioni fluide.",
      simulationBadge: "Fisica dei fluidi attiva",
      chatAssistant: "Assistente Chat",
      chatDesc: "Chiedi al nostro modello specializzato in biotecnologie su proteine vegetali, scienza agraria circolare ed estrazione.",
      chatBadge: "Gemini 1.5 Pro Protetto",
    }
  },
  es: {
    nav: {
      personalMode: "Modo Personal",
      industryMode: "Modo Industrial",
      simulationMode: "Modo Simulación",
      aiVisionScanner: "Escáner de Visión IA",
      chatAssistant: "Asistente de Chat",
      precisionBiotech: "BIOTECNOLOGÍA DE PRECISIÓN",
      launchLab: "Iniciar laboratorio",
    },
    home: {
      refiningLoop: "Bucle de refinamiento de follaje en línea",
      heroTitlePart1: "Proteínas Vegetales",
      heroTitlePart2: "Plataforma de extracción",
      heroDesc: "Experiencia biotecnológica interactiva que optimiza la biomasa local en extractos puros y completos de Rubisco según los índices de la FAO/OMS.",
      ecosystemOverview: "Descripción general del ecosistema",
      exploreModules: "Explorar módulos operativos",
      personalMode: "Modo Personal",
      personalDesc: "Calcule sus requisitos precisos de proteínas a partir de follaje y balances de aminoácidos esenciales sin fórmulas complejas.",
      personalBadge: "Calculadora de Precisión",
      industryMode: "Modo Industrial",
      industryDesc: "Suite empresarial que ofrece perfiles de aminoácidos, parámetros de restauración de suelos agrícolas y modelos de costos.",
      industryBadge: "Registro de integración",
      simulationMode: "Modo Simulación",
      simulationDesc: "Interactúe con nuestros sistemas físicos de filtración, maceración y coagulación mediante animaciones fluidas.",
      simulationBadge: "Física de fluidos activa",
      chatAssistant: "Asistente de Chat",
      chatDesc: "Consulte a nuestro modelo biotecnológico especializado sobre proteínas vegetales locales, agricultura circular y extracción.",
      chatBadge: "Gemini 1.5 Pro Seguro",
    }
  },
  de: {
    nav: {
      personalMode: "Persönlicher Modus",
      industryMode: "Industrieller Modus",
      simulationMode: "Simulationsmodus",
      aiVisionScanner: "KI-Visions-Scanner",
      chatAssistant: "KI-Assistent",
      precisionBiotech: "PRÄZISIONS-BIOTECH",
      launchLab: "Labor starten",
    },
    home: {
      refiningLoop: "Laub-Raffinationskreislauf Online",
      heroTitlePart1: "Pflanzenprotein",
      heroTitlePart2: "Extraktionsplattform",
      heroDesc: "Interaktives Biotechnologie-Erlebnis zur Optimierung lokaler Biomasse in reine, vollständige Rubisco-Extrakte gemäss FAO/WHO-Standards.",
      ecosystemOverview: "Ökosystem-Übersicht",
      exploreModules: "Betriebsmodule erkunden",
      personalMode: "Persönlicher Modus",
      personalDesc: "Berechnen Sie Ihren präzisen Proteinbedarf auf Laubbasis und essenzielle Aminosäure-Bilanzen ganz ohne Formeln.",
      personalBadge: "Präzisionsrechner",
      industryMode: "Industrieller Modus",
      industryDesc: "Professionelle Suite mit Aminosäuren-Profilen, Parametern für Bodenverbesserung und wirtschaftlichen Kostenmodellen.",
      industryBadge: "Systemintegrations-Log",
      simulationMode: "Simulationsmodus",
      simulationDesc: "Interagieren Sie mit unseren physikalischen Filtrations-, Mazerations- und Gerinnungsmodulen durch Flüssigkeitsanimationen.",
      simulationBadge: "Strömungsphysik Aktiv",
      chatAssistant: "KI-Assistent",
      chatDesc: "Fragen Sie unser spezialisiertes Biotech-Modell zu Pflanzenproteinen, zirkulärer Agrarwissenschaft und Extraktionstechniken.",
      chatBadge: "Gemini 1.5 Pro Gesichert",
    }
  },
  ru: {
    nav: {
      personalMode: "Личный режим",
      industryMode: "Промышленный режим",
      simulationMode: "Режим симуляции",
      aiVisionScanner: "ИИ-сканер зрения",
      chatAssistant: "ИИ-ассистент",
      precisionBiotech: "ТОЧНЫЕ БИОТЕХНОЛОГИИ",
      launchLab: "Запустить лабораторию",
    },
    home: {
      refiningLoop: "Цикл рафинирования листвы активен",
      heroTitlePart1: "Растительный белок",
      heroTitlePart2: "Платформа экстракции",
      heroDesc: "Интерактивная биотехнологическая платформа для оптимизации локальной биомассы в чистые, полноценные экстракты Рубиско по стандартам ФАО/ВОЗ.",
      ecosystemOverview: "Обзор экосистемы",
      exploreModules: "Исследовать рабочие модули",
      personalMode: "Личный режим",
      personalDesc: "Рассчитайте свои точные показатели потребности в растительном белке и баланс незаменимых аминокислот без формул.",
      personalBadge: "Точный калькулятор",
      industryMode: "Промышленный режим",
      industryDesc: "Инструмент корпоративного класса для анализа аминокислотных профилей, рекультивации почв и расчета стоимости производства.",
      industryBadge: "Журнал интеграции системы",
      simulationMode: "Режим симуляции",
      simulationDesc: "Управляйте физическими процессами фильтрации, мацерации и термической коагуляции с реалистичной физикой жидкостей.",
      simulationBadge: "Физика жидкостей активна",
      chatAssistant: "ИИ-ассистент",
      chatDesc: "Задавайте вопросы нашей специализированной модели о растительных белках, замкнутом цикле земледелия и методах экстракции.",
      chatBadge: "Безопасный Gemini 1.5 Pro",
    }
  },
  hi: {
    nav: {
      personalMode: "व्यक्तिगत मोड",
      industryMode: "औद्योगिक मोड",
      simulationMode: "सिमुलेशन मोड",
      aiVisionScanner: "एआई विजन स्कैनर",
      chatAssistant: "चैट सहायक",
      precisionBiotech: "सटीक जैव प्रौद्योगिकी",
      launchLab: "प्रयोगशाला शुरू करें",
    },
    home: {
      refiningLoop: "पत्ती रिफाइनिंग लूप सक्रिय है",
      heroTitlePart1: "संयंत्र प्रोटीन",
      heroTitlePart2: "निष्कर्षण मंच",
      heroDesc: "अंतर्राष्ट्रीय एफएओ/डब्ल्यूएचओ पोषण मानकों के अनुरूप स्थानीय बायोमास को शुद्ध, पूर्ण रूबिस्को अर्क में बदलने का इंटरैक्टिव बायोटेक अनुभव।",
      ecosystemOverview: "पारिस्थितिकी तंत्र अवलोकन",
      exploreModules: "परिचालन मॉड्यूल का अन्वेषण करें",
      personalMode: "व्यक्तिगत मोड",
      personalDesc: "पत्तियों पर आधारित अपनी सटीक प्रोटीन आवश्यकताओं और आवश्यक अमीनो एसिड संतुलन की गणना करें, बिना किसी जटिल सूत्र के।",
      personalBadge: "सटीक कैलकुलेटर",
      industryMode: "औद्योगिक मोड",
      industryDesc: "एंटरप्राइज-ग्रेड सूट जो अमीनो-एसिड रडार प्रोफाइल, कृषि मिट्टी बहाली मापदंड और आर्थिक लागत मॉडल प्रदान करता है।",
      industryBadge: "सिस्टम एकीकरण लॉग",
      simulationMode: "सिमुलेशन मोड",
      simulationDesc: "तरल भौतिकी सिमुलेशन के साथ हमारे भौतिक निस्पंदन, मैकरेशन और थक्के बनाने के उपकरणों के साथ बातचीत करें।",
      simulationBadge: "तरल भौतिकी सक्रिय",
      chatAssistant: "चैट सहायक",
      chatDesc: "हमारे जैव प्रौद्योगिकी मॉडल से स्थानीय संयंत्र प्रोटीन, चक्रीय कृषि विज्ञान और निष्कर्षण यांत्रिकी के बारे में कुछ भी पूछें।",
      chatBadge: "जेमिनी 1.5 प्रो सुरक्षित",
    }
  },
  zh: {
    nav: {
      personalMode: "个人模式",
      industryMode: "工业模式",
      simulationMode: "模拟器模式",
      aiVisionScanner: "AI 视觉扫描仪",
      chatAssistant: "智能研发助手",
      precisionBiotech: "精准生物科技",
      launchLab: "启动实验室",
    },
    home: {
      refiningLoop: "叶绿精炼系统在线",
      heroTitlePart1: "植物蛋白",
      heroTitlePart2: "提取技术平台",
      heroDesc: "互动式生物技术实践，将本地生物质优化为符合FAO/WHO国际营养标准的纯天然、完整Rubisco叶蛋白提取物。",
      ecosystemOverview: "生态系统概览",
      exploreModules: "探索业务功能板块",
      personalMode: "个人模式",
      personalDesc: "无需复杂公式，一键计算精准的叶蛋白摄入需求以及必需氨基酸平衡指导。",
      personalBadge: "精准计量助手",
      industryMode: "工业模式",
      industryDesc: "企业级套件，提供必需氨基酸雷达图谱、退化土壤改良有机质参数及全流程经济成本模型。",
      industryBadge: "系统级集成日志",
      simulationMode: "模拟器模式",
      simulationDesc: "基于流体动力学交互，逼真再现多级过滤、细胞破碎和定温热凝结等实验室提取环节。",
      simulationBadge: "流体物理特效在线",
      chatAssistant: "智能研发助手",
      chatDesc: "向垂直领域大模型咨询任何关于 Rubisco 植物蛋白提取、双轨工艺及微循环生态学的问题。",
      chatBadge: "Gemini 1.5 Pro 安全级",
    }
  },
  pt: {
    nav: {
      personalMode: "Modo Pessoal",
      industryMode: "Modo Industrial",
      simulationMode: "Modo Simulação",
      aiVisionScanner: "Scanner de Visão IA",
      chatAssistant: "Assistente Científico",
      precisionBiotech: "BIOTECNOLOGIA DE PRECISÃO",
      launchLab: "Iniciar Laboratório",
    },
    home: {
      refiningLoop: "Circuito de Refino de Folhagem Ativo",
      heroTitlePart1: "Proteína Vegetal",
      heroTitlePart2: "Plataforma de Extração",
      heroDesc: "Experiência biotecnológica interativa que otimiza biomassa local em extratos de Rubisco puros e completos conforme os índices da FAO/OMS.",
      ecosystemOverview: "Visão Geral do Ecossistema",
      exploreModules: "Explorar Módulos Operacionais",
      personalMode: "Modo Pessoal",
      personalDesc: "Calcule seus requisitos exatos de proteína foliar e balanços de aminoácidos essenciais sem fórmulas complexas.",
      personalBadge: "Calculadora de Precisão",
      industryMode: "Modo Industrial",
      industryDesc: "Conjunto corporativo com perfis de aminoácidos estruturados, parâmetros de amenda de solo agrícola e modelos custos.",
      industryBadge: "Log de Integração do Sistema",
      simulationMode: "Modo Simulação",
      simulationDesc: "Interaja com os nossos sistemas físicos de filtração, maceração e coagulação através de animações de fluidos de simulação.",
      simulationBadge: "Física de Fluidos Ativa",
      chatAssistant: "Assistente Científico",
      chatDesc: "Consulte o nosso modelo especializado em biotecnologia sobre proteínas vegetais, agricultura circular e extração.",
      chatBadge: "Gemini 1.5 Pro Seguro",
    }
  }
};

const baseTranslations: Record<Language, any> = {
  en,
  ar,
  de,
  fr,
  it,
  zh,
  ru,
  pt,
  es,
  hi
};

// Pure deep merge or extension function to combine dictionary files cleanly
export const translations = Object.keys(baseTranslations).reduce((acc, l) => {
  const lang = l as Language;
  const base = baseTranslations[lang];
  const ext = extension[lang] || { nav: {}, home: {} };
  
  acc[lang] = {
    ...base,
    nav: {
      ...base.nav,
      ...ext.nav
    },
    home: {
      ...base.home,
      ...ext.home
    }
  };
  return acc;
}, {} as Record<Language, any>);
