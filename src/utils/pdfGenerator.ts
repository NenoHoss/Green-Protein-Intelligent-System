import jsPDF from 'jspdf';
import { Language } from '../translations';

// High-fidelity scientific translation database for the PDF reports
const pdfTranslations: Record<Language, Record<string, string>> = {
  en: {
    title: "GREEN PROTEIN BIOTECH REPORT",
    subtitle: "CLINICAL & INDUSTRIAL VALIDATION RECORD",
    refCode: "SPECIMEN CODE",
    date: "TIMESTAMP",
    operator: "OPERATOR EMAIL",
    systemStatus: "LICENSED METRICS SOURCE",
    certBody: "GREEN PROTEIN CROP ALLIANCE",
    diseaseLabel: "PATHOLOGICAL DIAGNOSIS",
    confidenceLabel: "SCANNER CONFIDENCE SCORE",
    suitabilityLabel: "RUBISCO SUITABILITY",
    healthLabel: "BIOMASS HEALTH ANALYSIS",
    pathwayLabel: "EXTRACTION PATHWAY SELECTED",
    processMetrics: "PROCESS PRODUCTION METRICS",
    compostLabel: "SOIL COMPOSTING SUBPRODUCT",
    energyScore: "NUTRITIONAL POTENTIAL INDEX",
    faoInd: "FAO ADULT COMPLIANCE STATUS",
    costsTable: "DETAILED COST STRUCTURE & ANALYSIS",
    breakdownLabel: "PRODUCTION RECOVERY METRICS",
    breakdownItem: "SOURCE FEEDSTOCK WEIGHT",
    isolatedLabel: "ISOLATED DRY AMINO CAKE",
    pureProteinLabel: "PURE FUNCTIONAL DIGESTIBLE AMINOS",
    starchLabel: "RECLAIMED STARCH BY-PRODUCT",
    costPer100: "COST PER 100G PURE AMINO CAKE",
    savingVsWhey: "SAVINGS VS COMMERCIAL WHEY CONCENTRATE",
    profitLabel: "ECONOMIC SAVINGS & EBIT MARGIN",
    personMetrics: "INDIVIDUAL PHYSIOLOGY CRITERIA",
    individualDose: "DAILY RECOMMENDED DOSES & RECIPE",
    recipeLeaf: "REQUIRED SYCAMORE/MULBERRY WET LEAVES",
    recipeLentil: "REQUIRED COMPLEMENT LEGUME SEED RAW",
    totalDailyProtein: "OPTIMIZED DAILY DRIED BIO-PROTEIN",
    limitingAA: "LIMITING ESSENTIAL AMINO ACID",
    aminogram: "OPTICAL AMINOGRAM ANALYSIS % OF FAO INDEX",
    faoCompliant: "FAO 2013 REGISTER: FULL PROTOCOL COMPLIANT",
    faoIncompliant: "FAO REGISTER: DEFICIENT (SEPARATE SEEDING ADVISE)",
    scannedImage: "SPECIMEN CAPTURE RECORD",
    healthy: "PRISTINE (HIGH EXTRACTION SUITABILITY)",
    infected: "INFECTED (REJECTED FOR RAW PROCESSING)",
    damaged: "MECHANICAL DAMAGE (RESTRICTED USE)",
    activePathway: "THERMODYNAMIC PRE-PRECIPITATION / ACID FLUID",
    totalProductionCost: "TOTAL PRODUCTION COST (BATCH)",
    netProfit: "NET OPERATING SAVING (MARGIN)",
    revenueEstimate: "ESTIMATED RETRIEVED PRODUCT SALE",
    notes: "SCIENTIFIC MEMORANDUM & LAB WORKFLOW:",
    certifiedTrue: "APPROVED & CERTIFIED BY DEEP RESEARCH ACADEMY",
    compostSec: "By-product organic fibers redirected to local agricultural cooperative representing zero-waste operations.",
    notesSec: "This molecular report represents experimental calculations simulated from local foliage samples. Rubisco isolate properties computed dynamically with standard WHO/FAO adult amino acid models.",
    none: "None"
  },
  ar: {
    title: "تقرير وبحوث البروتين الأخضر",
    subtitle: "سجل التحقق المختبري والصناعي الدقيق",
    refCode: "رمز العينة الموحد",
    date: "تاريخ إصدار التقرير",
    operator: "اسم المشغّل",
    systemStatus: "مصدر المقاييس الإحصائية المعتمدة",
    certBody: "تحالف أوراق الشجر والبروتين المستدام",
    diseaseLabel: "التشخيص للأمراض والآفات",
    confidenceLabel: "مؤشر دقة التحليل كهروبصرياً",
    suitabilityLabel: "ملاءمة استخلاص الـ Rubisco",
    healthLabel: "حالة جودة وسلامة الأنسجة",
    pathwayLabel: "مسار الاستخلاص الكيميائي الحيوي",
    processMetrics: "مقاييس كفاءة وعوائد الإنتاج المعملي",
    compostLabel: "مخلفات عضوية مستصلحة للتربة",
    energyScore: "مؤشر الكفاءة الغذائية الحيوية",
    faoInd: "التوافق مع لوائح منظمة الصحة العالمية",
    costsTable: "تفصيل وتحليل هيكلية التكاليف والإنتاج",
    breakdownLabel: "مؤشرات كتلة المواد المستردة",
    breakdownItem: "وزن المادة الخام المغذية",
    isolatedLabel: "كتلة كعكة الأمينو الجافة المستخرجة",
    pureProteinLabel: "البروتينات الصافية القابلة للهضم",
    starchLabel: "النشا المستصلح كمنتج ثنائي",
    costPer100: "تكلفة كل 100 جرام بروتين صافي",
    savingVsWhey: "معدل التوفير مقابل مصل اللبن التجاري",
    profitLabel: "جدوى التشغيل الصافي وهامش الكفاءة",
    personMetrics: "البيانات الفسيولوجية والحيوية للمستخدم",
    individualDose: "الوصفة الموصى بها والجرعة اليومية",
    recipeLeaf: "الوزن المطلوب من أوراق الشجر الطازجة",
    recipeLentil: "الوزن المطلوب من الحبوب البقولية المكملة",
    totalDailyProtein: "إجمالي حصة البروتين الجاف المحسوبة يومياً",
    limitingAA: "الحمض الأميني المحدد للبروتين",
    aminogram: "مخطط نسب الأحماض الأمينية مقارنة بالمعيار العالمي",
    faoCompliant: "معيار منظمة الأغذية والزراعة 2013: متوافر بالكامل",
    faoIncompliant: "المعيار العالمي: غير مكتمل (تنبيه توازن الأمينو)",
    scannedImage: "صورة عينة الورق التي تم مسحها",
    healthy: "سليمة (ملاءمة استخلاص معملي عالية)",
    infected: "مصابة بآفة (مرفوضة من المعالجة الخام)",
    damaged: "تلف ميكانيكي (محدونة الاستخدام والفاعلية)",
    activePathway: "الترسيب الحراري الديناميكي والمحلول الحمضي المبرد",
    totalProductionCost: "إجمالي تكاليف الإنتاج والتشغيل",
    netProfit: "صافي التوفير والربح التشغيلي",
    revenueEstimate: "العائد المالي المقدر للمنتج المستصلح",
    notes: "مذكرة البحث العلمي وآلية المعمل المتبعة:",
    certifiedTrue: "مرخص ومعتمد من أكاديمية البحوث العميقة للأغذية",
    compostSec: "الألياف العضوية الناتجة يعاد توجيهها للجمعية الزراعية المحلية لتحقيق مبدأ صفر عوادم ومكافحة الانبعاثات الكربونية.",
    notesSec: "تم حساب خصائص عزل روبيسكو بشكل حيوي ومعالجته بناءً على النماذج القياسية للأحماض الأمينية لمنظمة الصحة العالمية والفاو.",
    none: "لا يوجد"
  },
  fr: {
    title: "RAPPORT BIOTECH DE PROTÉINE VERTE",
    subtitle: "DOSSIER DE VALIDATION CLINIQUE & INDUSTRIELLE",
    refCode: "CODE DE L'ÉCHANTILLON",
    date: "HORODATAGE",
    operator: "EMAIL DE L'OPÉRATEUR",
    systemStatus: "RELEVÉ DES MÉTRIQUES SYSTÈME",
    certBody: "ALLIANCE AGRO-ALIMENTAIRE PROTÉINE VERTE",
    diseaseLabel: "DIAGNOSTIC PATHOLOGIQUE",
    confidenceLabel: "INDICE DE CONFIANCE DU SCANNER",
    suitabilityLabel: "APTITUDE POUR LE RUBISCO",
    healthLabel: "ANALYSE SANITAIRE DE LA BIOMASSE",
    pathwayLabel: "PROCÉDÉ D'EXTRACTION SÉLECTIONNÉ",
    processMetrics: "RENDEMENT DE PRODUCTION DU PROCÉDÉ",
    compostLabel: "SOUS-PRODUIT DE COMPOSTAGE AGRICOLE",
    energyScore: "INDICE DE POTENTIEL NUTRITIONNEL",
    faoInd: "CONFORMITÉ NUTRITIONNELLE FAO ADULTE",
    costsTable: "ANALYSE DE LA STRUCTURE DÉTAILLÉE DES COÛTS",
    breakdownLabel: "RENDEMENTS DE SYSTÈME DE RÉCUPÉRATION",
    breakdownItem: "POIDS DE LA MATIÈRE PREMIÈRE",
    isolatedLabel: "GÂTEAU D'ACIDES AMINÉS ISOLÉS SEC",
    pureProteinLabel: "PROTÉINES PURES FONCTIONNELLES DIGESTES",
    starchLabel: "AMIDON RECYCLÉ CO-PRODUIT",
    costPer100: "COÛT POUR 100G DE PROTÉINE PURE",
    savingVsWhey: "ÉCONOMIE PAR RAPPORT AU LACTOSÉRUM WHEY",
    profitLabel: "ÉCONOMIE NETTE ET MARGE EBIT",
    personMetrics: "CRITÈRES PHYSIOLOGIQUES INDIVIDUELS",
    individualDose: "RECETTE ET DOSES JOURNALIÈRES RECOMMANDÉES",
    recipeLeaf: "FEUILLES FRAÎCHES REQUISES (WET BIOMASS)",
    recipeLentil: "GRAINES DE LÉGUMINEUSES REQUISES (COMPLÉMENT)",
    totalDailyProtein: "PROTÉINE SÈCHE RECOMMANDÉE PAR JOUR",
    limitingAA: "ACIDE AMINÉ LIMITANT ESSENTIEL",
    aminogram: "PROFIL OPTIQUE DE L'AMINOGRAMME (% DE L'INDEX FAO)",
    faoCompliant: "REGISTRE FAO 2013: BIEN CONFORME AUX PROTOCOLES",
    faoIncompliant: "REGISTRE FAO: VALEUR INSUFFISANTE (SÉPARER L'APPORT)",
    scannedImage: "CAPTURE DE L'ÉCHANTILLON CAPTURÉ",
    healthy: "EXCELLENT ÉTAT (HAUT RENDEMENT D'EXTRACTION)",
    infected: "INFECTÉ (REJETÉ POUR L'EXTRACT ALIMENTAIRE)",
    damaged: "DOMMAGE MÉCANIQUE (PROCESSUS RESTREINT)",
    activePathway: "PRÉ-PRECIPITATION THERMIQUE ET PROCÉDÉ ACIDE COLD",
    totalProductionCost: "COÛT TOTAL DE PRODUCTION (BATCH)",
    netProfit: "ÉCONOMIE NETTE DE FONCTIONNEMENT (MARGE)",
    revenueEstimate: "ESTIMATION DE VENTE CO-PRODUIT",
    notes: "MÉMORANDUM SCIENTIFIQUE ET FLUX DE TRAVAIL:",
    certifiedTrue: "APPROUVÉ & CERTIFIÉ PAR DEEP RESEARCH ACADEMY",
    compostSec: "Fibres organiques dirigées vers la coopérative agricole locale représentant des opérations zéro déchet.",
    notesSec: "Ce rapport moléculaire représente des calculs simulés à partir d'échantillons de biomasse verte. Propriétés de Rubisco calculées selon les normes de la FAO/OMS.",
    none: "Aucun"
  },
  it: {
    title: "RAPPORTO BIOTECH PROTEINA VERDE",
    subtitle: "REGISTRO VALIDAZIONE CLINICA E INDUSTRIALE",
    refCode: "CODICE SPECIMEN",
    date: "TIMESTAMP D'ANALYSI",
    operator: "EMAIL DELL'OPERATORE",
    systemStatus: "SORGENTE METRICHE LICENZIATE",
    certBody: "ALLEANZA COLTURE PROTEINA VERDE",
    diseaseLabel: "DIAGNOSI PATOLOGICA",
    confidenceLabel: "SCORE DI CONFIDENZA SCANSIONE",
    suitabilityLabel: "IDONEITÀ ESTREMA RUBISCO",
    healthLabel: "VALUTAZIONE SANITARIA BIOMASSA",
    pathwayLabel: "PROCESSO DI ESTRAZIONE SELEZIONATO",
    processMetrics: "METRICHE PREVISTE DI PRODUZIONE",
    compostLabel: "SOTTOPRODOTTO DI COMPOSTAGGIO TERRENO",
    energyScore: "INDICE DI POTENZIALITÀ NUTRIZIONALE",
    faoInd: "STATO DI REQUISITI ADULTI FAO",
    costsTable: "STRUTTURA DETTAGLIATA COSTI E MARGINI",
    breakdownLabel: "PARAMETRI RECUPERATI DAL PROCESSO",
    breakdownItem: "PESO DELLAMATERIA PRIMA",
    isolatedLabel: "TORTA SECCA AMMINOACIDI ISOLATI",
    pureProteinLabel: "PROTEINE PURE UTILI E DIGERIBILI",
    starchLabel: "AMIDO RECUPERATO SOTTOPRODOTTO",
    costPer100: "COSTO PER 100G DI PROTEINA PURA",
    savingVsWhey: "SCONTO PERCENTUALE VS WHEY COMMERCIALE",
    profitLabel: "MIGLIORAMENTO ECONOMICO E MARGINE OPERATIVO",
    personMetrics: "CRITERI FISIOLOGICI INDIVIDUALI",
    individualDose: "DOSAGGIO GIORNALIERO E RICETTA",
    recipeLeaf: "FOGLIE FRESCHE RICHIESTE (WET LEAF)",
    recipeLentil: "LEGUMI BIO COMPLEMENTARI RICHIESTI",
    totalDailyProtein: "PROTEINA SECCA CONSIGLIATA AL GIORNO",
    limitingAA: "AMMINOACIDO LIMITANTE ESSENZIALE",
    aminogram: "ANALISI OTTICA AMINOGRAMMA (% INDICE FAO)",
    faoCompliant: "REGISTRO FAO 2013: COMPLETAMENTE CONFORME",
    faoIncompliant: "REGISTRO FAO: CARENTE (INTEGRAZIONE NECESSARIA)",
    scannedImage: "ACQUISIZIONE DIGITALE SPECIMEN",
    healthy: "ECCELLENTE SANITÀ (IDONEO AD ALTA RESA)",
    infected: "INFETTO (SCARTATO DAL PROCESSO ALIMENTARE)",
    damaged: "DANNO MECCANICO (LIMITATA CAPACITÀ ESTRATTIVA)",
    activePathway: "TERMO-PRECIPITAZIONE GRADUALE E FLUIDO ACIDO",
    totalProductionCost: "COSTO DI PRODUZIONE TOTALE (BATCH)",
    netProfit: "RISPARMIO NETTO CONSEGUITO (MARGINE)",
    revenueEstimate: "RICAVO STIMATO DA PRODOTTI AGGIUNTIVI",
    notes: "MEMORANDUM TECNICO SCIENTIFICO DI LAB:",
    certifiedTrue: "APPROVATO & CERTIFIÉ PAR DEEP RESEARCH ACADEMY",
    compostSec: "Fibre organiche inviate alla cooperativa agricola locale per promuovere un'economia a zero rifiuti.",
    notesSec: "Simulazioni di idoneità del Rubisco e profilo amminoacidico calcolate conformemente ai protocolli FAO/OMS per adulti.",
    none: "Nessuno"
  },
  es: {
    title: "REPORTE BIOTECNOLÓGICO DE PROTEÍNA VERDE",
    subtitle: "REGISTRO DE VALIDACIÓN CLÍNICA E INDUSTRIAL",
    refCode: "CÓDIGO DE ESPÉCIMEN",
    date: "HORA DEL REPORTE",
    operator: "CORREO DEL OPERADOR",
    systemStatus: "ORIGEN DE METRICAS CERTIFICADO",
    certBody: "ALIANZA AGRÍCOLA SUSTENTABLE DE RUBISCO",
    diseaseLabel: "DIAGNÓSTICO PATOLÓGICO",
    confidenceLabel: "CONFIABILIDAD DE ANÁLISIS ÓPTICO",
    suitabilityLabel: "APTITUD DE EXTRACCIÓN RUBISCO",
    healthLabel: "ANÁLISIS SANITARIO DE BIOMASA",
    pathwayLabel: "VÍA DE EXTRACCIÓN SELECCIONADA",
    processMetrics: "RENDIMIENTOS Y MÉTRICAS DE OPERACIÓN",
    compostLabel: "SUBPRODUCTO RECONSTITUYENTE DE SUELOS",
    energyScore: "INDICE DE RENDIMIENTO NUTRICIONAL",
    faoInd: "COMPATIBILIDAD CON STANDARD FAO",
    costsTable: "ANÁLISIS DETALLADO DE COSTOS Y EBIT",
    breakdownLabel: "FRACCIONES DE COMPONENTES DE SALIDA",
    breakdownItem: "PESO DE LA MATERIA PRIMA INICIAL",
    isolatedLabel: "TARTA SECA AMINOÁCIDOS AISLADOS",
    pureProteinLabel: "PROTEÍNAS PURE DE FÁCIL DIGESTIÓN",
    starchLabel: "ALMIDÓN RECUPERADO DE ALTA PUREZA",
    costPer100: "COSTO POR CADA 100G PROTEÍNA PURA",
    savingVsWhey: "AHORRO VS SUERO LÁCTEO (WHEY)",
    profitLabel: "OPTIMIZACIÓN DE MARGEN OPERATIVO (EBIT)",
    personMetrics: "CRITERIOS FISIOLÓGICOS INDIVIDUALES",
    individualDose: "RECETA Y DOSIFICACIÓN DIARIA SUGERIDA",
    recipeLeaf: "FEUILLES FRAÎCHES RECONSTITUYENTES",
    recipeLentil: "PROTEÍNA COMPLEMENTARIA (SEMILLA)",
    totalDailyProtein: "DOSIS DIARIA RECOMENDADA DE PROTEÍNA",
    limitingAA: "AMINOÁCIDO LIMITANTE DIARIO",
    aminogram: "PERFIL VECTORIAL DE AMINOÁCIDOS (FAO IND)",
    faoCompliant: "COCONFORME CON LA NORMA FAO 2013",
    faoIncompliant: "DEFICIENTE CON LA NORMA FAO (AÑADIR SEMILLA)",
    scannedImage: "CAPTURA DE IMAGEN DIGITALIZADA",
    healthy: "PERFECTO ESTADO (ALTO RENDIMIENTO EN EXTR.)",
    infected: "INFECTADO (RECHAZADO PARA SUPLEMENTACIÓN)",
    damaged: "DAÑO MECÁNICO EN FOLIO (USO CONDICIONAL)",
    activePathway: "TERMODEPOSITACIÓN Y PRECIPITACIÓN EN PH FRÍO",
    totalProductionCost: "COSTO TOTAL DE EXPEDICIÓN (LOTE)",
    netProfit: "AHORRO NETO CONSEGUIDO (EFICIENCIA)",
    revenueEstimate: "VENTA EXCEDENTE ESTIMADA SUBPRODUCTO",
    notes: "NOTAS DE CONTROL DE CALIDAD Y BIORREFINO:",
    certifiedTrue: "APROBADO & CERTIFICADO POR LA ACADEMIA CIENTÍFICA",
    compostSec: "Fibras de bagazo residual redirigidas a la cooperativa agrícola local para fomento de economía circular.",
    notesSec: "Simulación de Rubisco computada dinámicamente según valores estándar definidos por OMS/FAO para adultos.",
    none: "Ninguno"
  },
  de: {
    title: "GRÜNES PROTEIN BIOTECH-BERICHT",
    subtitle: "KLINISCHES & INDUSTRIELLES QUALITÄTSPROTOKOLL",
    refCode: "PROBEN-REGISTRIERUNGSNUMMER",
    date: "ZEITSTEMPEL",
    operator: "OPERATOR-E-MAIL-ADRESSE",
    systemStatus: "LIZENZIERTE MESSWERTSYSTEME",
    certBody: "GRÜNE PROTEIN LANDWIRTSCHAFTSALLIANZ",
    diseaseLabel: "PATHOLOGISCHE DIAGNOSE",
    confidenceLabel: "ELEKTRO-OPTISCHE SCANNER-GENAUIGKEIT",
    suitabilityLabel: "RUBISCO EXTRAKTIONS-EIGNUNG",
    healthLabel: "BIOMASSE HEALTH-ZUSTANDSANALYSE",
    pathwayLabel: "GEWÄHLTER BIORAFFINATIONSPFAD",
    processMetrics: "SYSTEM-PRODUKTIONSMETRIKEN BATCH",
    compostLabel: "NEBENPRODUKT ÖKO-BODENDÜNGER",
    energyScore: "NÄHRWERT-POTENZIAL-INDEX",
    faoInd: "FAO ADULT COMPLIANCE STATUS",
    costsTable: "DETAILLIERTE KOSTENSTRUKTUR-ANALYSE",
    breakdownLabel: "ABTRENNUNGS-EFFEKTIVITÄT EXTRAKTION",
    breakdownItem: "ROH-BIOMASSE-GEWICHT INPUT",
    isolatedLabel: "ISOLIERTER TROCKENER AMINOSÄURENKUCHEN",
    pureProteinLabel: "REINE LEICHT VERDAULICHE EINWEIßSTOFFE",
    starchLabel: "ZURÜCKGEWONNENE STÄRKE-KOPRODUKT",
    costPer100: "KOSTEN PRO 100G REINES EIWEIßISOLAT",
    savingVsWhey: "PREISVORTEIL GEGENÜBER WHEY-CONCENTRATE",
    profitLabel: "BETRIEBS-RENDITE & EBIT-PROGNOSE",
    personMetrics: "INDIVIDUELLE PHYSIOLOGISCHE DATEN",
    individualDose: "TÄGLICHE DOSIEREMPFEHLUNG & REZEPT",
    recipeLeaf: "ERFORDERLICHE GRÜNE FRISCHBLÄTTER",
    recipeLentil: "KOMPLEMENTÄRE HÜLSENFRUCHTSAMEN",
    totalDailyProtein: "OPTIMIERTER TÄGLICHER PROTEINBEDARF",
    limitingAA: "LIMITIERENDE ESSENTIELLE AMINOSÄURE",
    aminogram: "AMINOGRAMM IM SPEKTRAL-VERGLEICH ZUM FAO-INDEX",
    faoCompliant: "FAO-KODEX 2013-AKT_ REGISTRIERT VOLL KONFORM",
    faoIncompliant: "FAO-KODEX: UNZUREICHEND (ERGÄNZUNG EMPFOHLEN)",
    scannedImage: "DIGITALE SPEKTRALBILD-DOKUMENTATION",
    healthy: "MAKRELOSE BLATTMATERIAL-GESUNDHEIT",
    infected: "KRANKHEITSBEFALL (NUR FÜR BIOGAS EIGNUNG)",
    damaged: "STRUKTURSCHÄDEN (EINGESCHRÄNKTER ERTRAG)",
    activePathway: "THERMISCHE KOAGULATION PLUS PH-FÄLLUNGSTROM",
    totalProductionCost: "GESAMTKOSTEN DER CHARGENVERARBEITUNG",
    netProfit: "NETTOEINSPARUNG IM ENERGIEMODE (MARGIN)",
    revenueEstimate: "ERWARTETE NEBENVERKÄUFE STÄRKE/FIBRE",
    notes: "WISSENSCHAFTLICHES LABOR-MEMORANDUM:",
    certifiedTrue: "GEPRÜFT & FREIGEGEBEN DURCH DEEP RESEARCH ACADEMY",
    compostSec: "Pflanzliche Restfasern werden ohne Müllentstehung an lokale Gartenkooperativen als Humusdünger abgegeben.",
    notesSec: "Sämtliche Rubisco-Isolatsverteilungen wurden über numerische biophysikalische Modelle bezogen auf FAO/WHO-Parameter validiert.",
    none: "Keine"
  },
  ru: {
    title: "ОТЧЕТ О БИОЛОГИЧЕСКОМ ЗЕЛЕНОМ БЕЛКЕ",
    subtitle: "СЕРТИФИКАТ КЛИНИЧЕСКИХ И СИСТЕМНЫХ ИСПЫТАНИЙ",
    refCode: "ИДЕНТИФИКАТОР ОБРАЗЦА",
    date: "ВРЕМЯ РЕГИСТРАЦИИ",
    operator: "ИСПОЛНИТЕЛЬНЫЙ АНАЛИТИК",
    systemStatus: "ИСТОЧНИК ПОДТВЕРЖДЕННЫХ ДАННЫХ",
    certBody: "СЕЛЬСКОХОЗЯЙСТВЕННЫЙ АЛЬЯНС ЗЕЛЕНОГО БЕЛКА",
    diseaseLabel: "ФИТОПАТОЛОГИЧЕСКИЙ ДИАГНОЗ",
    confidenceLabel: "ТОЧНОСТЬ ОПТИЧЕСКОГО СКАНИРОВАНИЯ",
    suitabilityLabel: "СОВМЕСТИМОСТЬ ЭКСТРАКЦИИ РУБИСКО",
    healthLabel: "АНАЛИЗ ЗДОРОВЬЯ ФИТОМАССЫ",
    pathwayLabel: "РЕГЛАМЕНТ РАФИНИРОВАНИЯ БЕЛКА",
    processMetrics: "ВЫХОД БЕЛКОВЫХ ЗАГОТОВОК",
    compostLabel: "СПЕЦИАЛЬНЫЙ СЕЛЬСКОХОЗЯЙСТВЕННЫЙ УДОБРИТЕЛЬ",
    energyScore: "ПИТАТЕЛЬНЫЙ ПОТЕНЦИАЛ БЕЗОПАСНОСТИ",
    faoInd: "АНАЛИЗ СООТВЕТСТВИЯ СТАНДАРТУ ФАО",
    costsTable: "ФИНАНСОВЫЕ ЗАТРАТЫ И EBIT ТЕХПРОЦЕССА",
    breakdownLabel: "РЕЗУЛЬТАТ ВЫДЕЛЕНИЯ ВЕЩЕСТВ",
    breakdownItem: "ВЕС РАСТИТЕЛЬНОГО СУБСТРАТА",
    isolatedLabel: "ИНТЕГРИРОВАННЫЙ АМИНОКИСЛОТНЫЙ КЕК",
    pureProteinLabel: "ЧИСТЫЙ ФУНКЦИОНАЛЬНЫЙ БЕЛОК",
    starchLabel: "ВЫСВОБОЖДЕННЫЙ КРАХМАЛИСТЫЙ КОМПОНЕНТ",
    costPer100: "СЕБЕСТОИМОСТЬ 100 СУХОГО БЕЛКА",
    savingVsWhey: "РЫНОЧНАЯ ЭКОНОМИЯ ОТНОСИТЕЛЬНО СЫВОРОТКИ",
    profitLabel: "ОПЕРАЦИОННАЯ ЭКОНОМИЯ И МАРЖИНАЛЬНОСТЬ",
    personMetrics: "ИНДИВИДУАЛЬНЫЙ ФИЗИОЛОГИЧЕСКИЙ ПРОФИЛЬ",
    individualDose: "СУТОЧНАЯ НОРМА И ИНСТРУКЦИЯ СМЕШИВАНИЯ",
    recipeLeaf: "ТРЕБУЕМЫЙ ВЕС СВЕЖИХ ЛИСТЬЕВ",
    recipeLentil: "НЕОБХОДИМЫЙ ВЕС КОМПЛЕМЕНТНЫХ СЕМЯН",
    totalDailyProtein: "РАССЧИТАННОЕ СУТОЧНОЕ СУХОЕ ПИТАНИЕ",
    limitingAA: "ЛИМИТИРУЮЩАЯ НЕЗАМЕНИМАЯ КИСЛОТА",
    aminogram: "ФОТОМЕТРИЧЕСКАЯ АМИНОГРАММА ОТ СТАНДАРТА ФАО",
    faoCompliant: "ИНДЕКС ФАО 2013: ПОЛНОСТЬЮ СБАЛАНСИРОВАН",
    faoIncompliant: "ИНДЕКС ФАО: ДЕФИЦИТ АК (РЕКОМЕНДОВАНЫ БОБОВЫЕ)",
    scannedImage: "ФОТОСНИМОК СКАНИРУЕМОГО МАТЕРИАЛА",
    healthy: "ОТЛИЧНОЕ ЗДОРОВЬЕ ЛИСТЬЕВ (ВЫСОКИЙ ВЫХОД)",
    infected: "ЗАРАЖЕНО ПАТОГЕНОМ (ЗАПРЕЩЕНО НА СУХОЙ КОНЦ.)",
    damaged: "МЕХАНИЧЕСКИЕ ДЕФЕКТЫ (ПОНИЖЕННАЯ СКОРОСТЬ)",
    activePathway: "ТЕРМИЧЕСКАЯ КОАГУЛЯЦИЯ БЕЛКОВ + КИСЛЫЙ РАСТВОР",
    totalProductionCost: "ПОЛНЫЕ ЗАТРАТЫ НА ВЫДЕЛЕНИЕ (ПАРТИЯ)",
    netProfit: "ПОЛУЧЕННАЯ ОПЕРАЦИОННАЯ ЭКОНОМИЯ (МАРЖА)",
    revenueEstimate: "ОЦЕНОЧНЫЙ ОБЪЕМ ПРОДАЖ ПОБОЧНОГО КРАХМАЛА",
    notes: "ЛАБОРАТОРНЫЕ ЗАМЕТКИ СИСТЕМЫ УПРАВЛЕНИЯ:",
    certifiedTrue: "УТВЕРЖДЕНО И СЕРТИФИЦИРОВАНО DEEP RESEARCH",
    compostSec: "Нерастворимый жом листьев возвращается фермерским предприятиям как ценное удобрение с нулевым следом углерода.",
    notesSec: "Результаты основаны на алгоритмической симуляции поведения белков Рубиско в соответствии с профилями аминокислот ФАО/ВОЗ.",
    none: "Нет"
  },
  hi: {
    title: "ग्रीन प्रोटीन जैव प्रौद्योगिकी रिपोर्ट",
    subtitle: "प्रयोगशाला एवं औद्योगिक सत्यापन रिकॉर्ड",
    refCode: "नमूना संदर्भ कोड",
    date: "प्रसंस्करण समय",
    operator: "प्रचालक विश्लेषक",
    systemStatus: "सत्यापित डेटा विश्लेषण निकाय",
    certBody: "सस्टेनेबल लीफ क्रॉप एलायंस",
    diseaseLabel: "प्लांट पैथोलॉजी डायग्नोसिस",
    confidenceLabel: "स्कैनर शुद्धता सूचकांक",
    suitabilityLabel: "रुबिस्को निष्कर्षण उपयुक्तता",
    healthLabel: "बायोमास ऊतक स्वास्थ्य विश्लेषण",
    pathwayLabel: "सुझाई गई निष्कर्षण जैव प्रक्रिया",
    processMetrics: "प्रयोगशाला बैच उत्पादन आँकड़े",
    compostLabel: "जैविक मृदा सुधारक उप-उत्पाद",
    energyScore: "पोषण क्षमता सूचकांक",
    faoInd: "एफएओ व्यस्क पोषण अनुपालन स्थिति",
    costsTable: "विस्तृत लागत और परिचालन लाभप्रदता विश्लेषण",
    breakdownLabel: "पुनर्प्राप्त घटक भार विवरण",
    breakdownItem: "कच्चे फीडस्टॉक का भार",
    isolatedLabel: "पृथक सूखा अमीनो केक",
    pureProteinLabel: "शुद्ध पचाने योग्य कार्यात्मक प्रोटीन",
    starchLabel: "पुनर्प्राप्त स्टार्च उप-उत्पाद",
    costPer100: "प्रति 100 ग्राम प्रोटीन केक की लागत",
    savingVsWhey: "व्यावसायिक व्हे प्रोटीन की तुलना में बचत",
    profitLabel: "शुद्ध वित्तीय बचत एवं मार्जिन दर",
    personMetrics: "व्यक्तिगत शारीरिक आवश्यकताएँ",
    individualDose: "दैनिक अनुशंसित खुराक और नुस्खा संरचना",
    recipeLeaf: "आवश्यक हरी ताजी पत्तियाँ (गीली मात्रा)",
    recipeLentil: "पूरक दलहन बीज की आवश्यक मात्रा",
    totalDailyProtein: "इष्टतम दैनिक सूखा बायो-प्रोटीन लक्ष्य",
    limitingAA: "सीमित आवश्यक अमीनो एसिड",
    aminogram: "ऑप्टिकल अमीनो एसिड प्रोफाइल (% एफएओ मानक)",
    faoCompliant: "एफएओ 2013 मानक: पूर्ण प्रोटीन अनुकूलित",
    faoIncompliant: "एफएओ मानक: असंतुलित (पूरक बीज सेवन आवश्यक है)",
    scannedImage: "स्कैन की गई डिजिटल फोटो",
    healthy: "उत्कृष्ट स्वास्थ्य (उच्च निष्कर्षण क्षमता)",
    infected: "संक्रमित पत्तियां (खाद्य उपभोग के लिए वर्जित)",
    damaged: "यांत्रिक क्षति (सीमित निष्कर्षण दक्षता)",
    activePathway: "क्रमबद्ध थर्मल जमाव एवं पीएच रासायनिक पृथक्करण",
    totalProductionCost: "कुल बैच प्रसंस्करण लागत (ओपेक्स)",
    netProfit: "शुद्ध संचित लाभप्रदता (ऑपरेटिंग मार्जिन)",
    revenueEstimate: "स्टार्च और जैविक खाद की अनुमानित बिक्री",
    notes: "वैज्ञानिक प्रयोगशाला नियंत्रण समीक्षा:",
    certifiedTrue: "डीप रिसर्च एकेडमी द्वारा स्वीकृत एवं प्रमाणित",
    compostSec: "शेष पत्तियों के फाइबर जैव-विघटन चक्र को पूरा करने के लिए स्थानीय सहकारी समिति को खाद बनाने के लिए भेजे जाते हैं।",
    notesSec: "पॉलीयुरेथेन और रुबिस्को निष्कर्षण मूल्यों की गणना संयुक्त रूप से डब्ल्यूएचओ/एफएओ अमीनो एसिड दिशानिर्देशों के तहत की जाती है।",
    none: "कोई नहीं"
  },
  zh: {
    title: "绿叶蛋白生物合成技术鉴定证书",
    subtitle: "临床制备及全产业链工业化验证技术规范",
    refCode: "生化样本唯一识别码",
    date: "报告签发时间",
    operator: "主检工程师/分析员",
    systemStatus: "检测分析仪器数据来源及授权",
    certBody: "循环农业与植物绿色蛋白质同盟 (Rubisco Alliance)",
    diseaseLabel: "叶片病原体检测及病理学诊断",
    confidenceLabel: "光谱数字成像检测置信度",
    suitabilityLabel: "叶片Rubisco蛋白提取适宜度",
    healthLabel: "生物质原材料细胞活性筛查",
    pathwayLabel: "选用的生物化学提取精炼工艺路径",
    processMetrics: "实验室单批次提取产率指标",
    compostLabel: "生态重置绿色底泥有机酸肥",
    energyScore: "高纯度氨基酸营养价值指数",
    faoInd: "联合国粮农组织(FAO)人体氨基酸核定",
    costsTable: "精细生产成本构成与商业化损益分析",
    breakdownLabel: "各组份生物质组份回收回收率参数",
    breakdownItem: "叶绿素植物原材料输入重量",
    isolatedLabel: "提取所得干燥氨基酸浓缩粉饼",
    pureProteinLabel: "高纯度可吸收生物活性蛋白总量",
    starchLabel: "分离所得副产品植物高纯度淀粉",
    costPer100: "每百克纯蛋白浓缩粉饼工业成本",
    savingVsWhey: "对比进口分离乳清蛋白(Whey)的价格优势比",
    profitLabel: "项目经营期纯节省额及经营毛利率",
    personMetrics: "用户个性化生理指标核定",
    individualDose: "日推荐蛋白质摄入剂量及混比配方",
    recipeLeaf: "指定叶片新鲜生物原料日需重量",
    recipeLentil: "最佳搭配豆科谷物干豆日需重量",
    totalDailyProtein: "核定日均需补充干重生物蛋白质总量",
    limitingAA: "该配方中的短板/首位限制氨基酸",
    aminogram: "光学膳食氨基酸谱分析 (对比FAO基准百分比)",
    faoCompliant: "联合国粮农组织2013标准: 氨基酸结构百分百完整",
    faoIncompliant: "标准评定: 必需氨基酸不足 (需引入谷物进行联合种植)",
    scannedImage: "高倍数数字相差光谱显微扫描图像",
    healthy: "细胞壁完好纯净 (极佳生化提取适配度)",
    infected: "植株发生霜霉或褐斑病害 (拒绝用于口服制备级提取)",
    damaged: "机械磨损或运输断裂损伤 (提取效率部分降低)",
    activePathway: "多级酸碱协同沉淀、低温等电点澄清与快速热凝固",
    totalProductionCost: "本批次原料综合生产消耗成本 (OPEX)",
    netProfit: "工艺路线节约或纯综合运营结余",
    revenueEstimate: "淀粉与副产渣土肥料可产生销售额估算",
    notes: "植物生化科学实验室指导性备忘录:",
    certifiedTrue: "前沿精密农业生命科学鉴定委员会临床验证认可",
    compostSec: "纯植物榨取剩余惰性微晶纤维废料已全量配送给本土循环农业社用于堆肥发酵，贯彻碳中和绿环宗旨。",
    notesSec: "本项绿叶蛋白/Rubisco物理大分子模拟提纯特征数据由系统按照FAO/WHO国际青年及成人标准营养指标准则模拟计算。",
    none: "无"
  },
  pt: {
    title: "RELATÓRIO BIOTECNOLÓGICO DE PROTEÍNA VERDE",
    subtitle: "REGISTRO DE VALIDAÇÃO CLÍNICA E INDUSTRIAL",
    refCode: "CÓDIGO DA AMOSTRA",
    date: "HORA DA EMISSÃO",
    operator: "E-MAIL DO OPERADOR",
    systemStatus: "SURGIMENTO DE MÉTRICAS LICENCIADAS",
    certBody: "ALIANÇA AGRÍCOLA SUSTENTÁVEL DE BIOMASSA",
    diseaseLabel: "DIAGNÓSTICO FITOPATOLÓGICO",
    confidenceLabel: "ÍNDICE DE CONFIANÇA DO ESCÂNER",
    suitabilityLabel: "PROPRIEDADE DE EXTRAÇÃO RUBISCO",
    healthLabel: "ANÁLISE SANITÁRIA DE BIOMASSA",
    pathwayLabel: "CAMINHO DE EXTRAÇÃO SELECIONADO",
    processMetrics: "RENDIMENTOS E MÉTRICAS DE PRODUÇÃO",
    compostLabel: "SUBPRODUTO RECONSTITUINTE DO SOLO",
    energyScore: "ÍNDICE DE POTENCIAL NUTRICIONAL",
    faoInd: "COMPATIBILIDADE COM A PROTOCOLO FAO",
    costsTable: "ANÁLISE DETALHADA DA ESTRUTURA DE CUSTOS",
    breakdownLabel: "RENDIMENTOS DE RECUPERAÇÃO DO PROCESSO",
    breakdownItem: "PESO DA MATÉRIA-PRIMA INICIAL",
    isolatedLabel: "BOLO SECO DE AMINOÁCIDOS ISOLADOS",
    pureProteinLabel: "PROTEÍNAS PURAS FUNCIONAIS DIGESTĪVEIS",
    starchLabel: "AMIDO RECUPERADO DE ALTA PUREZA",
    costPer100: "CUSTO POR 100G DE PROTEÍNA PURA",
    savingVsWhey: "AHORRO VS SORO DE LEITE (WHEY CONCENTRATE)",
    profitLabel: "PRODUÇÃO LÍQUIDA E MARGEM DE EBIT",
    personMetrics: "CRITÉRIOS FISIOLÓGICOS INDIVIDUAIS",
    individualDose: "RECEITA E DOSAGEM SUGERIDA DIARIAMENTE",
    recipeLeaf: "FEUILLES FRAÎCHES EXIGIDAS DE FOLIAGE",
    recipeLentil: "PROTEÍNA COMPLEMENTAR REQUERIDA (SEMENTE)",
    totalDailyProtein: "DOSE DIÁRIA RECOMENDADA DE PROTEÍNA",
    limitingAA: "AMINOÁCIDO LIMITANTE ESSENCIAL",
    aminogram: "PERFIL VECTORIAL DE AMINOÁCIDOS (FAO IND)",
    faoCompliant: "PADRÃO FAO 2013: 100% REGISTRADO COMPATÍVEL",
    faoIncompliant: "PADRÃO FAO: INTEGRALMENTE DEFICIENTE (ADICIONAR SEMENTE)",
    scannedImage: "CAPTURAS DE HISTÓRIA DO ESCÂNER",
    healthy: "PERFEITO SEM LESÕES (MALA EXTRAÇÃO MÁXIMA EXTR)",
    infected: "REJEITADO - INFECTADO (USO NÃO ALIMENTAR)",
    damaged: "LESIONADO DE FORMA MECÂNICA (PROCESSO LIMITADO)",
    activePathway: "PRECIPITAÇÃO EM CADEIA TÉRMICA E CONTROLE ISOLAD PH",
    totalProductionCost: "CUSTO FINAL DO LOTE DE PROCESSAMENTO (OPEX)",
    netProfit: "PRESERVAÇÃO ECONÔMICA NET CONSEGUIDO (MARGEM)",
    revenueEstimate: "VALOR DO SOLUTO DESTILADO EM COMERCIALIZAÇÃO",
    notes: "MEMORANDO TÉCNICO DE EXTRAÇÃO & ANÁLISE:",
    certifiedTrue: "CERTIFICADO EMITIDO PELA DEEP BIOPHYSICS RESEARCH ACADEMY",
    compostSec: "Fibras de refugo são completamente convertidas em insumos ecológicos para cultivo local promovendo sustentabilidade circular.",
    notesSec: "Relatório com formulação científica computado via simulação física de folhagem e ligantes vegetais. Nutrição parametrizada aos padrões FAO.",
    none: "Nenhum"
  }
};

// Simple clean logo helper to embed brand emblem in the PDF canvas drawing
const drawLeafLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.save();
  ctx.fillStyle = '#059669'; // Emerald-600
  ctx.beginPath();
  ctx.moveTo(x, y + size / 2);
  ctx.quadraticCurveTo(x + size / 2, y, x + size, y + size / 2);
  ctx.quadraticCurveTo(x + size / 2, y + size, x, y + size / 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.moveTo(x, y + size / 2);
  ctx.lineTo(x + size, y + size / 2);
  ctx.stroke();
  
  ctx.strokeStyle = 'rgba(5, 150, 105, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size * 0.75, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();
};

const recommendationTranslations: Record<string, Record<string, any>> = {
  en: {
    recTitle: "GREEN PROTEIN PRODUCTION RECOMMENDATION",
    leafType: "Recommended Leaf Type",
    leafQty: "Estimated Leaf Quantity Required",
    legumeType: "Recommended Complementary Legume",
    legumeQty: "Recommended Legume Quantity",
    mixingRatio: "Leaf-to-Legume Mixing Ratio",
    extractionPathway: "Suggested Extraction Pathway",
    estYield: "Estimated Pure Protein Yield",
    pathwayName: "Standard Green Protein Biorefining",
    legumes: {
      lentil: "Lentils",
      chickpea: "Chickpeas"
    }
  },
  ar: {
    recTitle: "توصية إنتاج البروتين الأخضر المعتمدة",
    leafType: "نوع أوراق الشجر الموصى بها",
    leafQty: "كمية أوراق الشجر المطلوبة (تقديرياً)",
    legumeType: "البقوليات المكملة الموصى بها",
    legumeQty: "كمية البقوليات المطلوبة",
    mixingRatio: "نسبة خلط الورق إلى البقوليات",
    extractionPathway: "مسار الاستخلاص المقترح",
    estYield: "عائد البروتين الصافي المتوقع",
    pathwayName: "مسار استخلاص البروتين الأخضر القياسي",
    legumes: {
      lentil: "عدس",
      chickpea: "حمص"
    }
  },
  fr: {
    recTitle: "RECOMMANDATION DE PRODUCTION DE PROTÉINE VERTE",
    leafType: "Type de feuille recommandé",
    leafQty: "Quantité de feuilles estimée requise",
    legumeType: "Légumineuse complémentaire recommandée",
    legumeQty: "Quantité de légumineuses recommandée",
    mixingRatio: "Ratio de mélange feuilles/légumineuses",
    extractionPathway: "Procédé d'extraction suggéré",
    estYield: "Rendement estimé en protéine pure",
    pathwayName: "Raffinement standard de protéine verte",
    legumes: {
      lentil: "Lentilles",
      chickpea: "Pois chiches"
    }
  },
  it: {
    recTitle: "RACCOMANDAZIONE DI PRODUZIONE PROTEINA VERDE",
    leafType: "Tipo di foglia raccomandato",
    leafQty: "Quantità stimata di foglie richiesta",
    legumeType: "Legume complementare raccomandato",
    legumeQty: "Quantità di legumi raccomanda",
    mixingRatio: "Rapporto di miscelazione foglie/legumi",
    extractionPathway: "Percorso di estrazione suggerito",
    estYield: "Resa stimata in proteine pure",
    pathwayName: "Raffinazione standard della proteina verde",
    legumes: {
      lentil: "Lenticchie",
      chickpea: "Ceci"
    }
  },
  es: {
    recTitle: "RECOMENDACIÓN DE PRODUCCIÓN DE PROTEÍNA VERDE",
    leafType: "Tipo de hoja recomendada",
    leafQty: "Cantidad estimada de hojas requerida",
    legumeType: "Legumbre complementaria recomendada",
    legumeQty: "Cantidad de legumbres recomendada",
    mixingRatio: "Relación de mezcla hojas/legumbres",
    extractionPathway: "Vía de extracción sugerida",
    estYield: "Rendimiento estimado de proteína pura",
    pathwayName: "Refinamiento estándar de proteína verde",
    legumes: {
      lentil: "Lentejas",
      chickpea: "Garbanzos"
    }
  },
  de: {
    recTitle: "EMPFEHLUNG FÜR DIE GRÜNE PROTEINPRODUKTION",
    leafType: "Empfohlener Blatttyp",
    leafQty: "Geschätzte Erforderliche Blattmenge",
    legumeType: "Empfohlene Komplementäre Hülsenfrucht",
    legumeQty: "Empfohlene Hülsenfruchtmenge",
    mixingRatio: "Blatt-zu-Hülsenfrucht-Mischungsverhältnis",
    extractionPathway: "Empfohlener Extraktionsweg",
    estYield: "Geschätzte Reine Proteinausbeute",
    pathwayName: "Standard Grüne Protein-Bioraffination",
    legumes: {
      lentil: "Linsen",
      chickpea: "Kichererbsen"
    }
  },
  ru: {
    recTitle: "РЕКОМЕНДАЦИЯ ПО ЗЕЛЕНОМУ БЕЛКУ",
    leafType: "Рекомендуемый тип листьев",
    leafQty: "Оценочное требуемое количество листьев",
    legumeType: "Рекомендуемые дополнительные бобовые",
    legumeQty: "Рекомендуемое количество бобовых",
    mixingRatio: "Соотношение смешивания листьев и бобовых",
    extractionPathway: "Предлагаемый метод экстракции",
    estYield: "Оценочный выход чистого белка",
    pathwayName: "Стандартное биорафинирование зеленого белка",
    legumes: {
      lentil: "Чечевица",
      chickpea: "Нут"
    }
  },
  hi: {
    recTitle: "हरित प्रोटीन उत्पादन सिफारिश",
    leafType: "अनुशंसित पत्ती का प्रकार",
    leafQty: "आवश्यक पत्तियों की अनुमानित मात्रा",
    legumeType: "अनुशंसित पूरक दलहन",
    legumeQty: "दलहन की अनुशंसित मात्रा",
    mixingRatio: "पत्ती और दलहन का मिश्रण अनुपात",
    extractionPathway: "सुझाया गया निष्कर्षण मार्ग",
    estYield: "अनुमानित शुद्ध प्रोटीन उपज",
    pathwayName: "मानक हरित प्रोटीन जैव-परिशोधन",
    legumes: {
      lentil: "मसूर की दाल",
      chickpea: "चना"
    }
  },
  zh: {
    recTitle: "绿叶蛋白生产推荐方案",
    leafType: "推荐叶片品类",
    leafQty: "预估所需叶片原料重量",
    legumeType: "推荐搭配豆科作物",
    legumeQty: "推荐豆科原料重量",
    mixingRatio: "叶片与豆科原料混相比例",
    extractionPathway: "建议生化提取工艺路径",
    estYield: "预估所得高纯蛋白质产量",
    pathwayName: "标准绿叶蛋白质生物精炼流程",
    legumes: {
      lentil: "小扁豆 (Lentils)",
      chickpea: "鹰嘴豆 (Chickpeas)"
    }
  },
  pt: {
    recTitle: "RECOMENDAÇÃO DE PRODUÇÃO DE PROTEÍNA VERDE",
    leafType: "Tipo de folha recomendado",
    leafQty: "Quantidade estimada de folhas necessária",
    legumeType: "Leguminosa complementar recomendada",
    legumeQty: "Quantidade recomendada de leguminosa",
    mixingRatio: "Proporção de mistura folhas para leguminosa",
    extractionPathway: "Caminho de extração sugerido",
    estYield: "Rendimento estimado de proteína pura",
    pathwayName: "Biorrefino padrão de proteína verde",
    legumes: {
      lentil: "Lentilhas",
      chickpea: "Grão-de-bico"
    }
  }
};

const abstractMap: Record<Language, string> = {
  en: "ABSTRACT: This technical certification document presents precise analytical measurements and extraction performance simulated from foliage biomass samples. It is compiled dynamically for agricultural cooperatives and eco-protein processing stakeholders, evaluating Rubisco suitability, chemical pathways, and amino-acid scores aligned with international WHO/FAO nutritional compliance protocols.",
  ar: "المستخلص: يقدم هذا المستند قياسات معملية دقيقة وتوقعات للأداء لعمليات استخلاص البروتين من عينات الأوراق الخضراء. تحلل هذه النسخة كفاءة الـ Rubisco والمسارات الكيميائية ومطابقة الأحماض الأمينية بالمقارنة مع معايير منظمة الأغذية والزراعة للأمم المتحدة (FAO) لضمان تحقيق كفاءة تشغيل دائرية كاملة.",
  fr: "RÉSUMÉ: Ce document de certification technique présente des mesures analytiques précises et les performances d'extraction simulées à partir de la biomasse foliaire. Compilé pour les coopératives agricoles et les acteurs agro-alimentaires, il évalue la pertinence du Rubisco, les voies chimiques et les aminogrammes certifiés selon les protocoles de la FAO/OMS.",
  it: "SOMMARIO: Questo documento di certificazione tecnica presenta misurazioni analitiche dettagliate e simulazioni delle prestazioni di estrazione delle proteine da biomassa fogliare. Compilato per cooperative agricole e raffinatori ecologici, valuta l'idoneità del Rubisco e dei profili amminoacidici secondo i severi protocolli FAO/OMS.",
  es: "RESUMEN: Este documento de certificación técnica presenta mediciones analíticas precisas y simulaciones del rendimiento de extracción de las proteínas del follaje. Ha sido compilado para las cooperativas agrícolas y procesadores ecológicos, evaluando la idoneidad de Rubisco y perfiles de aminoácidos conforme las pautas de la FAO/OMS.",
  de: "KURZFASSUNG: Dieses technische Zertifizierungsdokument liefert präzise analytische Messungen und Extraktionssimulationen aus Laub-Biomasseproben. Es analysiert Rubisco-Eignung, chemische Wege und Aminosäurewerte im Einklang mit den internationalen FAO/WHO-Ernährungsprotokollen für landwirtschaftliche Genossenschaften.",
  ru: "АННОТАЦИЯ: Настоящий технический сертификат содержит подробные аналитические измерения и результаты экстракции белка из листьев растений. Он создан для сельскохозяйственных кооперативов, оценивая пригодность Рубиско, биохимические пути очистки и баланс аминокислот согласно мировым рекомендациям ФАО/ВОЗ.",
  hi: "संक्षिप्त विवरण: यह तकनीकी दस्तावेज़ हरी पत्तियों के बायोमास नमूनों से प्राप्त सटीक विश्लेषणात्मक माप और निष्कर्षण प्रदर्शन प्रस्तुत करता है। यह रिपोर्ट रुबिस्को उपयुक्तता, रासायनिक प्रक्रियाओं और अमीनो-एसिड प्रोफाइल का विश्लेषण करती है, जो अंतरराष्ट्रीय एफएओ/डब्ल्यूएचओ पोषण मानकों के अनुकूल है।",
  zh: "摘要：本技术报告提供了基于绿叶生物质原料的精密光谱检测分析与蛋白质生化提取产率预测。报告对叶片Rubisco提取活性、最佳酸碱絮凝沉淀路径以及对比联合国粮农组织（FAO）与世界卫生组织（WHO）标准的氨基酸完整度得分进行系统性评估，用以指导绿色循环农业生产。",
  pt: "RESUMO: Este documento de certificação técnica apresenta medições analíticas precisas e simulações do desempenho de extração de biomassa foliar. Elaborado para cooperativas agrícolas e refinadores ecológicos, avalia a adequação da Rubisco, bio-rotas químicas e escores de aminoácidos de acordo com os protocolos FAO/OMS."
};

const typeTitleMap: Record<string, Record<Language, string>> = {
  scanner: {
    en: "GREEN PROTEIN AI SCANNER ANALYSIS REPORT",
    ar: "سجل الفحص الذكي للبروتين الأخضر",
    fr: "RAPPORT D'ANALYSE PAR SCANNER IA",
    it: "RAPPORTO SCANSIONE IA CARATTERIZZAZIONE FOGLIA",
    es: "REPORTE DE ANÁLISIS DE ESCÁNER IA",
    de: "KI-SCANNERELEKTRO-OPTISCHE ANALYSE",
    ru: "ОТЧЕТ КОМПЬЮТЕРНОГО СКАНИРОВАНИЯ БИОМАССЫ",
    hi: "कृत्रिम बुद्धिमत्ता स्कैनर स्पेक्ट्रम विश्लेषण रिपोर्ट",
    zh: "AI智能光谱成像与叶绿细胞组织学筛查报告",
    pt: "RELATÓRIO DE ANÁLISE DE ESCANEAMENTO IA"
  },
  lab: {
    en: "CLINICAL BIOREFINING WORKFLOW CERTIFICATION",
    ar: "سجل التحقق والإنتاج المعملي الدقيق",
    fr: "CERTIFICATION DU PROTOCOLE DE LABORATOIRE",
    it: "CERTIFICAZIONE PROCESSO DI RAFFINAZIONE LAB",
    es: "CERTIFICADO DE TRATAMIENTO QUÍMICO EN LABORATORIO",
    de: "INDUSTRIEBEREICH LABORMETHODIK-VALIDIERUNG",
    ru: "СЕРТИФИКАТ ЛАБОРАТОРНОГО ФРАКЦИОНИРОВАНИЯ",
    hi: "جैव रासायनिक प्रयोगशाला सिमुलेशन प्रक्रिया रिकॉर्ड",
    zh: "精密蛋白质实验室制备、过滤与凝固流程验证证书",
    pt: "CERTIFICAÇÃO DO PERCURSO LAB DE BIORREFINO"
  },
  economic: {
    en: "FEASIBILITY, PRODUCTION COST & EBIT STUDY",
    ar: "دراسة الجدوى المالي والأثر الاقتصادي للمحصول",
    fr: "ANALYSE DE RENTABILITÉ ET REVENU DE COPRODUITS",
    it: "BUSINESS-CASE E ANALISI STRUTTURA COSTI",
    es: "ESTUDIO DE VIABILIDAD ECONÓMICA Y RETORNO MARGINAL",
    de: "WIRTSCHAFTSLICHKEITSPROGNOSE UND PREISVORTEIL BATCH",
    ru: "ФИНАНСОВЫЙ АНАЛИЗ И СЕБЕСТОИМОСТЬ СУБСТРАТОВ",
    hi: "आर्थिक व्यवहार्यता, प्रसंस्करण लागत और लाभप्रदता विश्लेषण",
    zh: "绿叶蛋白商业化可行性、精练生产成本与财务损益分析",
    pt: "ESTUDO DE VIABILIDADE FINANCEIRA E ESTRUTURA DE CUSTOS"
  },
  personal: {
    en: "INDIVIDUAL PHYSIOLOGICAL NUTRITION PROFILE",
    ar: "سجل التقييم الغذائي المخصص والأحماض الأمينية",
    fr: "BILAN PHYSIOLOGIQUE INDIVIDUEL ET AMINOGRAMME",
    it: "PROFILO FISIOLOGICO PERSONALIZZATO SULL'AMINOGRAMMA",
    es: "PERFIL NUTRICIONAL INDIVIDUALIZADO DE AMINOÁCIDOS",
    de: "INDIVIDUELLES ERNÄHRUNGSPROFIL UND AMINOGRAMM",
    ru: "АНАЛИЗ ПЕРСОНАЛЬНОГО МЕТАБОЛИЗМА И БАЛАНСА АМИНОКИСЛОТ",
    hi: "व्यक्तिगत शारीरिक पोषण आवश्यकताएं और नुस्खा संरचना",
    zh: "个性化膳食氨基酸完整度比值与绿叶蛋白日需摄入量核定",
    pt: "PERFIL FISIOLÓGICO NUTRICIONAL E PLANO DIÁRIO PERSONALIZADO"
  }
};

// Word wrapping helper for paragraphs on Canvas2D with RTL compatibility
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  startX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  isRtl: boolean
) => {
  const words = text.split(' ');
  let line = '';
  let currentY = startY;
  
  if (isRtl) {
    ctx.textAlign = 'right';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), startX + maxWidth, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), startX + maxWidth, currentY);
  } else {
    ctx.textAlign = 'left';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), startX, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), startX, currentY);
  }
  return currentY + lineHeight;
};

export const generatePDFReport = async (
  type: 'scanner' | 'lab' | 'economic' | 'personal',
  data: any,
  lang: Language,
  translator: any
) => {
  const currentTranslations = pdfTranslations[lang] || pdfTranslations.en;

  const t = (key: string): string => {
    if (typeof translator === 'function') {
      try {
        return translator(key);
      } catch (e) {
        // Fallback
      }
    }
    if (translator && typeof translator === 'object') {
      const parts = key.split('.');
      let currentVal: any = translator;
      for (const part of parts) {
        currentVal = currentVal?.[part];
      }
      if (typeof currentVal === 'string') {
        return currentVal;
      }
      if (typeof translator[key] === 'string') {
        return translator[key];
      }
    }
    return pdfTranslations[lang]?.[key] || pdfTranslations.en[key] || key;
  };

  const isRtl = lang === 'ar';
  const coverTitle = typeTitleMap[type][lang] || typeTitleMap[type].en;
  const currentAbstract = abstractMap[lang] || abstractMap.en;

  // -------------------------------------------------------------
  // --- SINGLE PREMIUM COMPETITION PART MASTER CANVAS ---
  // -------------------------------------------------------------
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1680;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.direction = isRtl ? 'rtl' : 'ltr';

  // 1. FILL BACKGROUND (Washed modern scientific paper tone)
  ctx.fillStyle = '#FCFCFA'; 
  ctx.fillRect(0, 0, 1200, 1680);

  // 2. DRAW LAB BLUEPRINT GRIDS (Delicate details to show extreme craftsmanship)
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 40; i < 1180; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1680);
    ctx.stroke();
  }
  for (let j = 40; j < 1660; j += 40) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(1200, j);
    ctx.stroke();
  }

  // 3. SECURE SHARP CLINICAL FRAMES
  ctx.strokeStyle = '#1C1917'; // Deep charcoal slate
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 1140, 1620);
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = 'rgba(5, 150, 105, 0.5)'; // elegant emerald accent
  ctx.strokeRect(38, 38, 1124, 1604);

  // 4. HEADER SECTION (y = 52 to 215)
  // Branding Leaf Logo
  drawLeafLogo(ctx, isRtl ? 1070 : 60, 52, 45);

  // Branding Text
  ctx.fillStyle = '#1C1917';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.font = 'bold 24px "Inter", "Helvetica", Arial, sans-serif';
  ctx.fillText("GREEN PROTEIN", isRtl ? 1010 : 120, 72);

  ctx.fillStyle = '#059669'; // Emerald
  ctx.font = 'bold 10px "JetBrains Mono", monospace';
  ctx.fillText("INTELLIGENT FOLIAGE BIOREFINERY FRAMEWORK", isRtl ? 1010 : 120, 92);

  const formatSysDate = new Date().toLocaleString(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Top right system code label
  ctx.fillStyle = '#666';
  ctx.textAlign = isRtl ? 'left' : 'right';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.fillText(`SYSTEM RUNTIME ACCREDITED • ${formatSysDate.toUpperCase()}`, isRtl ? 60 : 1140, 71);
  ctx.fillText(`VERSION CONTROL: GP-PREMIUM-ONEPAGE_S3`, isRtl ? 60 : 1140, 89);

  // Horizontal primary bar
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(38, 115);
  ctx.lineTo(1162, 115);
  ctx.stroke();

  // Document Title
  ctx.fillStyle = '#1C1917';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.font = 'bold 20px "Inter", "Helvetica", Arial, sans-serif';
  ctx.fillText(coverTitle.toUpperCase(), isRtl ? 1140 : 60, 155);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.fillText(`VALIDATION REGISTERED TO: ${currentTranslations.certBody.toUpperCase()}`, isRtl ? 1140 : 60, 178);

  // Mini decorative title underline block
  ctx.fillStyle = '#1C1917';
  ctx.fillRect(isRtl ? 1140 - 80 : 60, 192, 80, 5);

  // 5. METADATA COMPACT GRID PANEL (y = 215 to 295)
  ctx.fillStyle = '#F5F5F0';
  ctx.fillRect(60, 215, 1080, 75);
  ctx.strokeStyle = 'rgba(28, 25, 23, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 215, 1080, 75);

  ctx.fillStyle = '#444';
  ctx.font = 'bold 10px "JetBrains Mono", monospace';
  
  const colW = 1080 / 3;
  const colY = 245;
  const colY2 = 270;

  // Let's draw metadata cells
  if (isRtl) {
    // Column 1 (Rightmost)
    ctx.textAlign = 'right';
    ctx.fillText(`${currentTranslations.refCode}: GP-SPEC-${Math.floor(10000 + Math.random() * 90000)}`, 1110, colY);
    ctx.fillText(`${currentTranslations.date}: ${formatSysDate}`, 1110, colY2);
    
    // Column 2 (Center)
    ctx.fillText(`${currentTranslations.operator}: moazsalama60@gmail.com`, 1110 - colW, colY);
    ctx.fillText(`${currentTranslations.systemStatus}: ONLINE SECURE`, 1110 - colW, colY2);

    // Column 3 (Leftmost)
    ctx.fillText(`SECURITY KEY: GP-SHA-256`, 1110 - colW * 2, colY);
    ctx.fillText(`ACCREDITATION: HIGHLY COMPLIANT`, 1110 - colW * 2, colY2);
  } else {
    // Column 1 (Leftmost)
    ctx.textAlign = 'left';
    ctx.fillText(`${currentTranslations.refCode}: GP-SPEC-${Math.floor(10000 + Math.random() * 90000)}`, 90, colY);
    ctx.fillText(`${currentTranslations.date}: ${formatSysDate}`, 90, colY2);
    
    // Column 2 (Center)
    ctx.fillText(`${currentTranslations.operator}: moazsalama60@gmail.com`, 90 + colW, colY);
    ctx.fillText(`${currentTranslations.systemStatus}: ONLINE SECURE`, 90 + colW, colY2);

    // Column 3 (Rightmost)
    ctx.fillText(`SECURITY KEY: GP-SHA-256`, 90 + colW * 2, colY);
    ctx.fillText(`ACCREDITATION: HIGHLY COMPLIANT`, 90 + colW * 2, colY2);
  }

  // 6. EXECUTIVE SUMMARY BOX (y = 308 to 398, Height = 90)
  ctx.fillStyle = '#E6F4EA'; // 10% emerald tint
  ctx.fillRect(60, 310, 1080, 90);
  ctx.strokeStyle = 'rgba(5, 150, 105, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 310, 1080, 90);

  // Left solid emerald indicator
  ctx.fillStyle = '#059669';
  ctx.fillRect(60, 310, 6, 90);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillText("EXECUTIVE SUMMARY / ABSTRACT", isRtl ? 1120 : 80, 332);

  ctx.fillStyle = '#1C1917';
  ctx.font = '11px "Inter", "Helvetica", Arial, sans-serif';
  wrapText(ctx, currentAbstract, isRtl ? 70 : 80, 355, 1040, 18, isRtl);

  // 7. CORE RESULTS SECTION (y = 415 to 1115, Height = 700)
  // Divider title for results
  ctx.strokeStyle = 'rgba(28, 25, 23, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 425);
  ctx.lineTo(1140, 425);
  ctx.stroke();

  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillText("SECTION 1.0: DIAGNOSTIC CELL ANALYSIS & STRUCTURAL METRICS", isRtl ? 1140 : 60, 442);

  // Two columns container boundaries
  const colLeftX = isRtl ? 624 : 60;
  const colRightX = isRtl ? 60 : 624;
  const colYStart = 470;
  const colWidthVal = 516;

  if (type === 'scanner') {
    // ---- TYPE: SCANNER ----
    // LEFT COLUMN: Readings
    const healthStatus = data.healthStatus || 'healthy';
    let statusText = currentTranslations.healthy;
    let statusColor = '#059669'; 

    if (healthStatus === 'infected') {
      statusText = currentTranslations.infected;
      statusColor = '#DC2626';
    } else if (healthStatus === 'damaged') {
      statusText = currentTranslations.damaged;
      statusColor = '#D97706';
    }

    // Health Status Bar
    ctx.fillStyle = statusColor + '12';
    ctx.fillRect(colLeftX, colYStart, colWidthVal, 60);
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(colLeftX, colYStart, colWidthVal, 60);

    ctx.fillStyle = statusColor;
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(
      `${currentTranslations.healthLabel}: ${statusText.toUpperCase()}`, 
      isRtl ? colLeftX + colWidthVal - 20 : colLeftX + 20, 
      colYStart + 35
    );

    // Grid rows inside left column
    const drawRowCell = (label: string, value: string, textY: number) => {
      ctx.fillStyle = '#555';
      ctx.font = '11.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(label, isRtl ? colLeftX + colWidthVal - 10 : colLeftX + 10, textY);
      
      ctx.font = 'bold 11.5px "Inter", sans-serif';
      ctx.fillStyle = '#1C1917';
      ctx.textAlign = isRtl ? 'left' : 'right';
      ctx.fillText(value, isRtl ? colLeftX + 10 : colLeftX + colWidthVal - 10, textY);

      ctx.strokeStyle = 'rgba(212, 212, 208, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(colLeftX, textY + 12);
      ctx.lineTo(colLeftX + colWidthVal, textY + 12);
      ctx.stroke();
    };

    drawRowCell(currentTranslations.detectedSpecies, String(data.name || 'Sycamore Fig Foliage').toUpperCase(), colYStart + 100);
    drawRowCell(currentTranslations.confidenceLabel, `${data.confidence || 94}%`, colYStart + 145);
    drawRowCell(currentTranslations.diseaseLabel, data.diseaseStatus || t('none') || 'No pathology detected.', colYStart + 190);
    drawRowCell(currentTranslations.suitabilityLabel, String(data.suitabilityEn || 'HIGH INTEGRAL EXTRACTION SUITABILITY').toUpperCase(), colYStart + 235);
    drawRowCell(currentTranslations.pathwayLabel, currentTranslations.activePathway, colYStart + 280);

    // RIGHT COLUMN: Image scanner visualizer viewport
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(currentTranslations.scannedImage, isRtl ? colRightX + colWidthVal : colRightX, colYStart + 15);

    const imageY = colYStart + 30;
    const imgHeight = 280;

    if (data.image) {
      try {
        const img = new Image();
        img.src = data.image;
        ctx.fillStyle = '#0d0d0c';
        ctx.fillRect(colRightX, imageY, colWidthVal, imgHeight);
        ctx.drawImage(img, colRightX, imageY, colWidthVal, imgHeight);
        
        ctx.strokeStyle = '#1C1917';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(colRightX, imageY, colWidthVal, imgHeight);
      } catch (err) {
        ctx.fillStyle = '#E5E5E0';
        ctx.fillRect(colRightX, imageY, colWidthVal, imgHeight);
        ctx.fillStyle = '#555';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText("🌿 [FOLIAGE DIGITAL CELL MATRIX CAPTURED]", colRightX + 40, imageY + 140);
      }
    } else {
      // Draw high-tech canvas vector styling as placeholder
      ctx.fillStyle = '#141412';
      ctx.fillRect(colRightX, imageY, colWidthVal, imgHeight);
      ctx.strokeStyle = 'rgba(5, 150, 105, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(colRightX, imageY, colWidthVal, imgHeight);

      // Scanning radar crosslines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(colRightX, imageY + imgHeight / 2);
      ctx.lineTo(colRightX + colWidthVal, imageY + imgHeight / 2);
      ctx.moveTo(colRightX + colWidthVal / 2, imageY);
      ctx.lineTo(colRightX + colWidthVal / 2, imageY + imgHeight);
      ctx.stroke();

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 50px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.imgPlaceholder || "🍃", colRightX + colWidthVal / 2, imageY + imgHeight / 2 + 15);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText("ECO-MATRICE CALIBRATED RADAR SCAN ACTIVE", colRightX + colWidthVal / 2, imageY + imgHeight - 20);
    }

    // --- NEW TARGET FOLIAGE BIO-POTENTIAL SUBSECTION ---
    const bioPotentialY = 800;
    // 1. Divider/Header
    ctx.strokeStyle = 'rgba(28, 25, 23, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, bioPotentialY);
    ctx.lineTo(1140, bioPotentialY);
    ctx.stroke();

    // Title and "LOCKED DATABASE CONSTANTS"
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'right' : 'left';
    const titleText = t('targetFoliageBiopotential') || "TARGET FOLIAGE BIO-POTENTIAL";
    ctx.fillText(titleText.toUpperCase(), isRtl ? 1140 : 60, bioPotentialY + 22);

    ctx.fillStyle = '#78716C'; // stone-500
    ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'left' : 'right';
    const lockedText = isRtl ? "ثوابت المقاييس المعملية المغلقة" : "LOCKED DATABASE CONSTANTS";
    ctx.fillText(lockedText, isRtl ? 60 : 1140, bioPotentialY + 22);

    // 2. Dry weight Raw Protein Density bar
    const barY = bioPotentialY + 38;
    ctx.fillStyle = '#555';
    ctx.font = 'bold 10px "Inter", sans-serif';
    ctx.textAlign = isRtl ? 'right' : 'left';
    const dwrpText = t('dryWeightRawProtein') || "DRY WEIGHT RAW PROTEIN PERCENTAGE:";
    ctx.fillText(dwrpText, isRtl ? 1140 : 60, barY + 12);

    const proteinPercent = data.leafProteinPercent || 22;
    ctx.fillStyle = '#059669'; // Emerald
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'left' : 'right';
    ctx.fillText(`${proteinPercent}%`, isRtl ? 60 : 1140, barY + 12);

    // Progress bar track
    const pBarX = 60;
    const pBarW = 1080;
    ctx.fillStyle = '#E5E5E0';
    ctx.fillRect(pBarX, barY + 20, pBarW, 8);

    // Progress bar fill
    ctx.fillStyle = '#059669';
    ctx.fillRect(pBarX, barY + 20, (proteinPercent / 100) * pBarW, 8);

    // 3. Four responsive metric cards side by side
    const cardsY = barY + 38;
    const cardW = 255;
    const cardH = 65;
    const gap = 20;

    const metricsList = [
      { label: t('spectrumRef') || "SPECTRUM REF", val: `${data.leafWeightG || 1500} g`, color: '#1C1917' },
      { label: t('expectedConcentrate') || "EXPECTED CONCENTRATE", val: `${data.leafProteinConcentrateG || 200} g`, color: '#059669' },
      { label: t('netDigestiblePure') || "NET DIGESTIBLE PURE", val: `${data.leafPureProteinG || 50} g`, color: '#0D9488' },
      { label: t('extractionEfficiency') || "EXTRACTION EFFICIENCY", val: `${data.efficiency || '66.7%'}`, color: '#4F46E5' }
    ];

    metricsList.forEach((metric, idx) => {
      const i = isRtl ? (3 - idx) : idx; // proper grid flow for RTL
      const cardX = 60 + i * (cardW + gap);

      // Card background
      ctx.fillStyle = '#F5F5F0';
      ctx.fillRect(cardX, cardsY, cardW, cardH);
      ctx.strokeStyle = 'rgba(28, 25, 23, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cardX, cardsY, cardW, cardH);

      // Label
      ctx.fillStyle = '#78716C'; // stone-500
      ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(metric.label.toUpperCase(), isRtl ? cardX + cardW - 12 : cardX + 12, cardsY + 22);

      // Value
      ctx.fillStyle = metric.color;
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.fillText(metric.val, isRtl ? cardX + cardW - 12 : cardX + 12, cardsY + 48);
    });

  } else if (type === 'lab') {
    // ---- TYPE: LAB PROCESS ----
    // LEFT COLUMN: Process Details & Yield Table
    ctx.fillStyle = 'rgba(5, 150, 105, 0.05)';
    ctx.fillRect(colLeftX, colYStart, colWidthVal, 70);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(colLeftX, colYStart, colWidthVal, 70);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(
      `${currentTranslations.pathwayLabel}:`, 
      isRtl ? colLeftX + colWidthVal - 15 : colLeftX + 15, 
      colYStart + 25
    );

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(
      String(data.workflowName || 'FOLIAGE BIOREFINING CHAIN').toUpperCase(), 
      isRtl ? colLeftX + colWidthVal - 15 : colLeftX + 15, 
      colYStart + 48
    );

    // Yield Rows
    const drawRowLab = (label: string, value: string, textY: number, colorVal = '#1C1917', fraction = 0) => {
      ctx.fillStyle = '#555';
      ctx.font = '11.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(label, isRtl ? colLeftX + colWidthVal - 10 : colLeftX + 10, textY);
      
      ctx.font = 'bold 11.5px "JetBrains Mono", monospace';
      ctx.fillStyle = colorVal;
      ctx.textAlign = isRtl ? 'left' : 'right';
      ctx.fillText(value, isRtl ? colLeftX + 10 : colLeftX + colWidthVal - 10, textY);

      // Simple premium visual bar meter underneath
      if (fraction > 0) {
        ctx.fillStyle = '#E4E4E0';
        ctx.fillRect(colLeftX + 10, textY + 12, colWidthVal - 20, 4);
        ctx.fillStyle = colorVal;
        ctx.fillRect(colLeftX + 10, textY + 12, (colWidthVal - 20) * fraction, 4);
      } else {
        ctx.strokeStyle = 'rgba(212, 212, 208, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(colLeftX, textY + 12);
        ctx.lineTo(colLeftX + colWidthVal, textY + 12);
        ctx.stroke();
      }
    };

    const maxWeightRef = data.rawWeight || 1000;
    drawRowLab(currentTranslations.breakdownItem, `${data.rawWeight} G`, colYStart + 110, '#1C1917', 0);
    drawRowLab(currentTranslations.isolatedLabel, `${data.lpcYield.toFixed(1)} G`, colYStart + 155, '#D97706', data.lpcYield / maxWeightRef);
    drawRowLab(currentTranslations.pureProteinLabel, `${data.pureProtein.toFixed(1)} G`, colYStart + 210, '#059669', data.pureProtein / maxWeightRef);
    drawRowLab(currentTranslations.starchLabel, `${data.coProducts.toFixed(1)} G`, colYStart + 265, '#3B82F6', data.coProducts / maxWeightRef);
    drawRowLab(currentTranslations.compostLabel, `${data.compost.toFixed(1)} G`, colYStart + 320, '#555', 0);

    // RIGHT COLUMN: 6 Preparation steps timeline
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 11.5px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(
      isRtl ? "خطوات مراقبة الجودة والتشغيل المعملي السليمة:" : "SECURED LABORATORY PREPARATION PROCEDURAL STEPS:", 
      isRtl ? colRightX + colWidthVal : colRightX, 
      colYStart + 15
    );

    const steps = data.isLegume 
      ? [
          { name: t('step1_label_legume') || "Raw Stock Calibration", desc: "Milliweights verified on precision balances." },
          { name: t('step2_label_legume') || "Water Maceration", desc: "Soaking grain inside pure H2O solvent at optimal duration." },
          { name: t('step3_label_legume') || "Milling & Slurry", desc: "Mechanical milling tearing cells with high frequency blade." },
          { name: t('step4_label_legume') || "Acid pH Sifting", desc: "Sifting fibers and separating starch with filtration." },
          { name: t('step5_label_legume') || "Thermal Clotting", desc: "Cooking supernatant to aggregate functional globulins." },
          { name: t('step6_label_legume') || "Isoelectric Pressing", desc: "Cake hydrated pressed inside hydraulic compression press." }
        ]
      : [
          { name: t('step1_label') || "Gravimetric Intake", desc: "Fresh wet foliage recorded on atomic weights scale." },
          { name: t('step2_label') || "Sonic Decontamination", desc: "Flushing outer dirt particles with micro ultrasonic wave." },
          { name: t('step3_label') || "Cell Wall Rupture", desc: "Shearing mechanical blades fracturing rigid cellulose tissue." },
          { name: t('step4_label') || "Sieve Clarification", desc: "Fiber compost residues filtered, green liquid isolated." },
          { name: t('step5_label') || "Steam Coagulation", desc: "Bunsen heating liquid to 75C triggering Rubisco coagulation." },
          { name: t('step6_label') || "Hydraulic Cake secure", desc: "Moisture purged under hydraulic plunger, secure pure cake." }
        ];

    steps.forEach((step, idx) => {
      const stepY = colYStart + 35 + idx * 56;
      
      // Step box container
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(colRightX, stepY, colWidthVal, 48);
      ctx.strokeStyle = '#E4E4E0';
      ctx.lineWidth = 1;
      ctx.strokeRect(colRightX, stepY, colWidthVal, 48);

      // Accent color line
      ctx.fillStyle = data.isLegume ? '#F59E0B' : '#10B981';
      ctx.fillRect(isRtl ? colRightX + colWidthVal - 6 : colRightX, stepY, 6, 48);

      // Mini circle indicator
      ctx.fillStyle = data.isLegume ? '#F59E0B' : '#10B981';
      ctx.beginPath();
      ctx.arc(isRtl ? colRightX + colWidthVal - 26 : colRightX + 26, stepY + 24, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(idx + 1), isRtl ? colRightX + colWidthVal - 26 : colRightX + 26, stepY + 27);

      // Step text
      ctx.fillStyle = '#1C1917';
      ctx.font = 'bold 9.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(step.name, isRtl ? colRightX + colWidthVal - 45 : colRightX + 45, stepY + 20);

      ctx.fillStyle = '#666';
      ctx.font = '8px "Inter", sans-serif';
      ctx.fillText(step.desc, isRtl ? colRightX + colWidthVal - 45 : colRightX + 45, stepY + 36);
    });

  } else if (type === 'economic') {
    // ---- TYPE: ECONOMIC ----
    // LEFT COLUMN: Cost breakdown rows
    ctx.fillStyle = 'rgba(5, 150, 105, 0.05)';
    ctx.fillRect(colLeftX, colYStart, colWidthVal, 75);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(colLeftX, colYStart, colWidthVal, 75);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(`${currentTranslations.profitLabel}:`, isRtl ? colLeftX + colWidthVal - 15 : colLeftX + 15, colYStart + 25);
    
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText(
      `${data.profitMargin.toFixed(1)}% EBIT ${t('economic.results.margin') || 'MARG'}`, 
      isRtl ? colLeftX + colWidthVal - 15 : colLeftX + 15, 
      colYStart + 52
    );

    const drawRowFin = (label: string, value: string, textY: number, valueColor = '#1C1917') => {
      ctx.fillStyle = '#555';
      ctx.font = '11.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(label, isRtl ? colLeftX + colWidthVal - 10 : colLeftX + 10, textY);
      
      ctx.fillStyle = valueColor;
      ctx.font = 'bold 11.5px "JetBrains Mono", monospace';
      ctx.textAlign = isRtl ? 'left' : 'right';
      ctx.fillText(value, isRtl ? colLeftX + 10 : colLeftX + colWidthVal - 10, textY);

      ctx.strokeStyle = 'rgba(212, 212, 208, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(colLeftX, textY + 12);
      ctx.lineTo(colLeftX + colWidthVal, textY + 12);
      ctx.stroke();
    };

    drawRowFin(currentTranslations.breakdownItem, `${data.leafQty} G / ${data.leafName}`, colYStart + 115);
    drawRowFin(t('economic.results.complementProduct') || "Complement leguminous input", `${data.complementQty.toFixed(0)} G / ${data.complementName}`, colYStart + 160);
    drawRowFin(t('economic.breakdown.total') || "Total dynamic product output", `${data.totalOutput.toFixed(1)} G`, colYStart + 205, '#059669');
    drawRowFin(currentTranslations.totalProductionCost, data.totalCost, colYStart + 250, '#DC2626');
    drawRowFin(currentTranslations.costPer100, data.costPer100g, colYStart + 295);
    drawRowFin(currentTranslations.revenueEstimate, data.revenue, colYStart + 340, '#059669');

    // RIGHT COLUMN: Bar chart comparison
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 11.5px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText("ECO PROTEIN MARKET PRICE COMPETITIVENESS GAP:", isRtl ? colRightX + colWidthVal : colRightX, colYStart + 15);

    const chartItems = [
      { name: currentTranslations.certBody, cost: data.rawCostPer100g, color: '#059669' },
      { name: t('economic.results.chicken') || "Chicken breast standard", cost: 120, color: '#F59E0B' },
      { name: t('economic.results.meat') || "Raw Beef isolate equivalent", cost: 250, color: '#EF4444' },
      { name: t('economic.results.whey') || "Isolated standard whey", cost: data.wheyPriceCost || 80, color: '#94A3B8' }
    ];

    chartItems.forEach((item, idx) => {
      const chartY = colYStart + 45 + idx * 75;
      
      ctx.fillStyle = '#555';
      ctx.font = '9.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(item.name, isRtl ? colRightX + colWidthVal - 10 : colRightX + 10, chartY + 12);

      const maxBarW = colWidthVal - 180;
      const barW = Math.max(15, Math.min(maxBarW, (item.cost / 300) * maxBarW));

      // Draw background bar
      ctx.fillStyle = '#E5E5E0';
      ctx.fillRect(colRightX + 10, chartY + 22, maxBarW, 14);
      
      // Draw colored bar representing cost
      ctx.fillStyle = item.color;
      ctx.fillRect(colRightX + 10, chartY + 22, barW, 14);

      // Float value
      ctx.fillStyle = '#1C1917';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = isRtl ? 'left' : 'right';
      ctx.fillText(`${item.cost.toFixed(1)} ${data.currencySymbol || 'USD'} / 100g`, isRtl ? colRightX + 10 : colRightX + colWidthVal - 10, chartY + 12);
    });

    // --- DETAILED UNIT-PRODUCTION COSTS BREAKDOWN ---
    const breakdownY = 820;

    // Drawn box divider
    ctx.strokeStyle = 'rgba(28, 25, 23, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, breakdownY);
    ctx.lineTo(1140, breakdownY);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'right' : 'left';
    const breakdownTitle = isRtl ? "تفاصيل تكاليف الإنتاج والتشغيل لتقرير الجدوى" : "SECTION 1.1: DETAILED UNIT-PRODUCTION COSTS REVENUE ANALYSIS";
    ctx.fillText(breakdownTitle.toUpperCase(), isRtl ? 1140 : 60, breakdownY + 22);

    // Two sub-columns: Raw Materials and Processing
    const subColLY = isRtl ? 624 : 60;
    const subColRY = isRtl ? 60 : 624;
    const subColW = 516;
    const textStartY = breakdownY + 45;

    // Let's get breakdown data or fallbacks
    const bd = data.breakdown || {
      leafCost: isRtl ? "ج.م 0.00" : "E£0.00",
      leafLabel: data.leafName || "Sycamore Fig",
      complementCost: isRtl ? "ج.م 13.50" : "E£13.50",
      complementLabel: data.complementName || "Lentils",
      water: isRtl ? "ج.م 0.00" : "E£0.00",
      waterLabel: isRtl ? "المياه" : "Water",
      filterCloth: isRtl ? "ج.م 4.00" : "E£4.00",
      filterClothLabel: isRtl ? "قماش الترشيح" : "Filter cloth",
      lemon: isRtl ? "ج.م 0.75" : "E£0.75",
      lemonLabel: isRtl ? "الليمون" : "Lemon",
      vinegar: isRtl ? "ج.م 0.60" : "E£0.60",
      vinegarLabel: isRtl ? "الخل" : "Vinegar",
      electricity: isRtl ? "ج.م 0.30" : "E£0.30",
      electricityLabel: isRtl ? "الكهرباء" : "Electricity",
      gas: isRtl ? "ج.م 0.20" : "E£0.20",
      gasLabel: isRtl ? "الغاز" : "Gas"
    };

    // Sub-headers
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(isRtl ? "المواد الخام والمدخلات الأساسية" : "RAW MATERIALS INPUT COSTS:", isRtl ? subColLY + subColW : subColLY, textStartY);
    ctx.fillText(isRtl ? "تكاليف التشغيل والمرافق والوسائط" : "PROCESSING & UTILITIES COMPONENT COSTS:", isRtl ? subColRY + subColW : subColRY, textStartY);

    const drawSubRow = (colX: number, label: string, value: string, rowY: number) => {
      ctx.fillStyle = '#555';
      ctx.font = '10.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(label, isRtl ? colX + subColW - 10 : colX + 10, rowY);

      ctx.fillStyle = '#1C1917';
      ctx.font = 'bold 10.5px "JetBrains Mono", monospace';
      ctx.textAlign = isRtl ? 'left' : 'right';
      ctx.fillText(value, isRtl ? colX + 10 : colX + subColW - 10, rowY);

      ctx.strokeStyle = 'rgba(212, 212, 208, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(colX, rowY + 10);
      ctx.lineTo(colX + subColW, rowY + 10);
      ctx.stroke();
    };

    // Draw raw materials column rows
    drawSubRow(subColLY, bd.leafLabel, bd.leafCost, textStartY + 30);
    drawSubRow(subColLY, bd.complementLabel, bd.complementCost, textStartY + 65);
    drawSubRow(subColLY, bd.waterLabel, bd.water, textStartY + 100);

    // Draw processing utilities column rows
    drawSubRow(subColRY, `${bd.filterClothLabel} (${isRtl ? "مستهلك" : "Disposable"})`, bd.filterCloth, textStartY + 30);
    drawSubRow(subColRY, bd.lemonLabel, bd.lemon, textStartY + 60);
    drawSubRow(subColRY, bd.vinegarLabel, bd.vinegar, textStartY + 90);
    drawSubRow(subColRY, `${bd.electricityLabel} + ${bd.gasLabel}`, `${bd.electricity} / ${bd.gas}`, textStartY + 120);

  } else if (type === 'personal') {
    // ---- TYPE: PERSONAL ----
    // LEFT COLUMN: Individual Metrics & Recipe Table
    ctx.fillStyle = 'rgba(5, 150, 105, 0.05)';
    ctx.fillRect(colLeftX, colYStart, colWidthVal, 60);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(colLeftX, colYStart, colWidthVal, 60);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(`${currentTranslations.totalDailyProtein}:`, isRtl ? colLeftX + colWidthVal - 15 : colLeftX + 15, colYStart + 22);

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(`${data.dailyNeedMin} - ${data.dailyNeedMax} G / DAY`, isRtl ? colLeftX + colWidthVal - 15 : colLeftX + 15, colYStart + 43);

    const drawRowPers = (label: string, value: string, textY: number) => {
      ctx.fillStyle = '#555';
      ctx.font = '11.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(label, isRtl ? colLeftX + colWidthVal - 10 : colLeftX + 10, textY);
      
      ctx.font = 'bold 11.5px "Inter", sans-serif';
      ctx.fillStyle = '#1C1917';
      ctx.textAlign = isRtl ? 'left' : 'right';
      ctx.fillText(value, isRtl ? colLeftX + 10 : colLeftX + colWidthVal - 10, textY);

      ctx.strokeStyle = 'rgba(212, 212, 208, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(colLeftX, textY + 12);
      ctx.lineTo(colLeftX + colWidthVal, textY + 12);
      ctx.stroke();
    };

    drawRowPers(t('personal.weight') || "Weight Category", `${data.weight} KG`, colYStart + 90);
    drawRowPers(t('personal.height') || "Biological stature", `${data.height} CM`, colYStart + 130);
    drawRowPers(t('personal.gender') || "Biological Gender", String(data.gender).toUpperCase(), colYStart + 170);
    drawRowPers(t('personal.goal') || "Physical objective target", String(data.goal).toUpperCase(), colYStart + 210);
    drawRowPers(t('personal.activity') || "Metabolic activity index", String(data.activity).toUpperCase(), colYStart + 250);
    drawRowPers(t('personal.health') || "Specific immune status", String(data.healthStatus).toUpperCase(), colYStart + 290);
    
    // Add required ingredients to the table directly
    drawRowPers(`${currentTranslations.recipeLeaf}`, `${data.leafWeight.toFixed(0)} G (${data.leafName})`, colYStart + 330);
    drawRowPers(`${currentTranslations.recipeLentil}`, `${data.compWeight.toFixed(0)} G (${data.compName})`, colYStart + 370);

    // RIGHT COLUMN: 9 Essential Aminogram Chart
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 11.5px "JetBrains Mono", monospace';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(currentTranslations.aminogram, isRtl ? colRightX + colWidthVal : colRightX, colYStart + 15);

    const animoData = data.aminoAcids || [];
    animoData.forEach((aa: any, idx: number) => {
      const aaY = colYStart + 36 + idx * 38;
      
      ctx.fillStyle = '#1C1917';
      ctx.font = 'bold 9.5px "Inter", sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(aa.name, isRtl ? colRightX + colWidthVal - 10 : colRightX + 10, aaY + 12);

      const maxProgressWidth = colWidthVal - 180;
      const progressW = Math.min(maxProgressWidth, (aa.score / 150) * maxProgressWidth);

      // Background Progress Bar
      ctx.fillStyle = '#E5E5E0';
      ctx.fillRect(colRightX + 10, aaY + 20, maxProgressWidth, 8);

      // Filled progress
      ctx.fillStyle = aa.score >= 100 ? '#059669' : '#EF4444'; 
      ctx.fillRect(colRightX + 10, aaY + 20, progressW, 8);

      // FAO threshold line at 100%
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.setLineDash([1.5, 1.5]);
      ctx.beginPath();
      ctx.moveTo(colRightX + 10 + (100 / 150) * maxProgressWidth, aaY + 14);
      ctx.lineTo(colRightX + 10 + (100 / 150) * maxProgressWidth, aaY + 32);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#1C1917';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = isRtl ? 'left' : 'right';
      ctx.fillText(`${aa.score.toFixed(0)}%`, isRtl ? colRightX + 10 : colRightX + colWidthVal - 10, aaY + 12);
    });

    // Compliancy Statement
    const isFaoCompliant = animoData.every((aa: any) => aa.score >= 100);
    ctx.fillStyle = isFaoCompliant ? '#059669' : '#D97706';
    ctx.font = 'bold 10px "Inter", Arial, sans-serif';
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(
      isFaoCompliant ? currentTranslations.faoCompliant : currentTranslations.faoIncompliant, 
      isRtl ? colRightX + colWidthVal : colRightX, 
      colYStart + 392
    );
  }

  // 8. ADVISORY AND CLINICAL RECOMMENDATION CARD (y = 1040 to 1230, Height = 190)
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(60, 1045, 1080, 185);
  
  ctx.fillStyle = '#F4FAF8';
  ctx.fillRect(60, 1045, 1080, 185);

  // Top emerald thick board
  ctx.fillStyle = '#059669';
  ctx.fillRect(60, 1045, 1080, 5);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillText("SECTION 2.0: CLINICAL ADVISORY & REFINING STANDARD DIRECTIVE", isRtl ? 1115 : 80, 1075);

  ctx.fillStyle = '#1C1917';
  ctx.font = '11px "Inter", "Helvetica", Arial, sans-serif';

  let customAdvice = "";
  if (type === 'personal') {
    const animoData = data.aminoAcids || [];
    const isFaoCompliant = animoData.every((aa: any) => aa.score >= 100);
    customAdvice = isFaoCompliant
      ? (isRtl 
         ? `التوصية: تم تأكيد تطابق المخطط للأحماض الأمينية بالكامل مع معيار الصحة العالمية للفاو للأفراد البالغين. يوصى بمداومة الجرعة اليومية المقدرة بـ ${data.dailyNeedMin} - ${data.dailyNeedMax} جرام من كعكة الأمينو مدمجة بوجبة فطور أو غداء لتعزيز الكفاءة العضلية والنشاط.` 
         : `ADVISORY: Dynamic aminogram compliance certified at 100% WHO/FAO standard limits for adult nutrition. Continue the prescribed daily dose of ${data.dailyNeedMin} - ${data.dailyNeedMax} grams dry amino cake, pre-diluted inside breakfast shakes or liquid supplements to support positive metabolic balances.`)
      : (isRtl 
         ? `تنبيه: تم رصد عجز نسبي في بعض الحموض الأمينية المحددة. ننصح بدمج ${data.compWeight.toFixed(0)} جرام من الحبوب البقولية المتنوعة مع مسحوق الأوراق لرفع معامل البروتين النقي الإجمالي وسد فجوة الحموض المحدِّدة.` 
         : `ADVISORY: Critical minor essential amino acid deficiency detected under baseline standard parameters. To reach full WHO/FAO compliance, strictly combine exactly ${data.compWeight.toFixed(0)}g of dry supplemental legumes to enhance the biological chemical score and secure an exhaustive nutrient profile.`);
  } else if (type === 'scanner') {
    const healthStatus = data.healthStatus || 'healthy';
    if (healthStatus === 'healthy') {
      customAdvice = isRtl
        ? "التوصية: نسيج الورق سليم تماماً ويحمل مستويات كلوروفيل مثالية. نوصي بالبدء الفوري بمسار الترسيب الحراري المتتالي عند 75 درجة مئوية مع الحفاظ على درجة حموضة معملية تبلغ 4.8 لاسترداد النسبة الخضراء الفائقة برياح دائرية متكاملة."
        : "ADVISORY: Pristine healthy biomass specimens are certified with optimum chlorophyll structures and cells. Process with standard thermal coagulation pathways at 75°C combined with mild centrifugation under isoelectric pH 4.8 controls to obtain supreme functional yield.";
    } else if (healthStatus === 'infected') {
      customAdvice = isRtl
        ? "تحذير: تم الكشف عن إصابة بآفة أو فطر في نسيج الخلايا. يُحظر تماماً استخدام هذه الدفعة للإنتاج الغذائي البشري المباشر. يُنصح بتحويلها بالكامل لخط التهجين لإنتاج الأسمدة الحيوية للأراضي الزراعية وتفادي انتشار التلوث."
        : "ADVISORY: Pathology scan detects active fungal or bacterial spots. DO NOT deploy this foliage feedstock batch for direct human dietary extraction. Immediately quarantine the crop block and divert current residues to closed soil-restructuring bio-fertilizers.";
    } else {
      customAdvice = isRtl
        ? "تنبيه: تم رصد ضرر ميكانيكي موضعي بالأوراق. يُسمح باستخدام الدفعة ولكن مع توقع كفاءة استخلاص منخفضة بمعدل 15%. يُنصح بفرز الأجزاء الممزقة وتعديل الضغط بالكبس الهيدروليكي لتعويض النقص الحركي."
        : "ADVISORY: Mechanical visual leaf fracture detected on outer tissue. Extraction pathway remains viable, but anticipate a 15% decrease in overall operational Rubisco yield. Increase hydraulic plunger duration slightly to offset cell compression deficits.";
    }
  } else if (type === 'lab') {
    customAdvice = isRtl
      ? `تحليل معملي: يوصى بضبط سرعة الدوران المركزي عند 4000 دورة بالدقيقة مع إعداد رقم هيدروجيني ثابت للترسيب عند 4.8. المادة الخام البالغة ${data.rawWeight} جم تعكس استقرارًا في تماسك معلق الجلوبيولين والروبيسكو في المذيب المائي المحسّن.`
      : `ADVISORY: Adjust rotational centrifugation speed to 4000 RPM while maintaining precise pH equilibrium of 4.8. Raw feedback inputs calibrated at ${data.rawWeight}G display optimal colloidal stability, suggesting steady amino coagulation within buffered thermal siphons.`;
  } else if (type === 'economic') {
    customAdvice = isRtl
      ? `دراسة الجدوى: هامش تشغيل متميز يبلغ ${data.profitMargin.toFixed(1)}%. لرفع هذا الهامش بنسبة 5% إضافية، يوصى بتركيز استخلاص النشا كمنتج ثانوي عالي النقاء وبيعه محلياً مع الاستفادة من عقود شراء الأسمدة المستصلحة لتقليص نفقات النقل.`
      : `BUSINESS ADVISORY: Tremendous EBIT margins recorded at ${data.profitMargin.toFixed(1)}%. To improve overall yield return by an additional 5%, monetize co-product starch starches on national consumer markets while leveraging local zero-waste composting off-taker contracts to offset logistic expenditures.`;
  }

  wrapText(ctx, customAdvice, isRtl ? 75 : 80, 1110, 1040, 18, isRtl);

  // 9. CERTIFICATION ROSSETTE & SIGNATURE FOOTER (y = 1250 to 1575)
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(38, 1250);
  ctx.lineTo(1162, 1250);
  ctx.stroke();

  // LEFT COLUMN: Detailed Legal & Environmental Clauses
  const footerColLX = isRtl ? 620 : 60;
  const footerColRX = isRtl ? 60 : 620;

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillText("■ ECO-CIRCULARITY PROTOCOL (ZERO-WASTE)", isRtl ? footerColLX + 500 : footerColLX, 1285);
  
  ctx.fillStyle = '#555';
  ctx.font = '9.5px "Inter", "Helvetica", Arial, sans-serif';
  wrapText(ctx, currentTranslations.compostSec, isRtl ? footerColLX : footerColLX, 1308, 500, 15, isRtl);

  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.fillText("■ SCIENTIFIC BIO-GRID STANDARDIZATION & SIMULATION DISCLAIMER", isRtl ? footerColLX + 500 : footerColLX, 1370);
  
  ctx.fillStyle = '#555';
  ctx.font = '9.5px "Inter", "Helvetica", Arial, sans-serif';
  wrapText(ctx, currentTranslations.notesSec, isRtl ? footerColLX : footerColLX, 1393, 500, 15, isRtl);

  // RIGHT COLUMN: Sealing Rosette & Authorized Signature Stamp
  const rosetteX = isRtl ? footerColRX + 100 : footerColRX + 380;
  const rosetteY = 1380;

  // Drawn accreditation rosette arcs
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(rosetteX, rosetteY, 60, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(rosetteX, rosetteY, 54, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#059669';
  ctx.textAlign = 'center';
  if (isRtl) {
    ctx.font = 'bold 8.5px "Inter", sans-serif';
    ctx.fillText("معتمد من", rosetteX, rosetteY - 14);
    ctx.font = 'bold 8.5px "Inter", sans-serif';
    ctx.fillText("مركز", rosetteX, rosetteY - 1);
    ctx.fillText("جرين بروتين", rosetteX, rosetteY + 12);
  } else {
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    ctx.fillText("APPROVED BY", rosetteX, rosetteY - 14);
    ctx.fillText("GREEN PROTEIN", rosetteX, rosetteY - 1);
    ctx.fillText("CENTRE", rosetteX, rosetteY + 12);
  }

  // Handwritten authorized signature representation
  ctx.fillStyle = 'rgba(5, 150, 105, 0.05)';
  ctx.fillRect(isRtl ? footerColRX + 170 : footerColRX + 30, 1285, 200, 130);
  ctx.strokeStyle = 'rgba(5, 150, 105, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(isRtl ? footerColRX + 170 : footerColRX + 30, 1285, 200, 130);

  ctx.fillStyle = 'rgba(5, 150, 105, 0.4)';
  ctx.font = 'bold 7px "JetBrains Mono", monospace';
  ctx.fillText("OFFICIAL SECURITY VALUE STAMP", isRtl ? footerColRX + 270 : footerColRX + 130, 1300);

  // Elegant cursive handwriting for Moaz Salama
  ctx.fillStyle = '#065F46'; // dark teal
  ctx.font = 'italic bold 17px "Georgia", serif';
  ctx.fillText("Moaz Salama", isRtl ? footerColRX + 270 : footerColRX + 130, 1345);

  ctx.fillStyle = '#444';
  if (isRtl) {
    ctx.font = 'bold 9.5px "Inter", sans-serif';
    ctx.fillText("إمضاء تفويض: معاذ سلامة", isRtl ? footerColRX + 270 : footerColRX + 130, 1378);
    ctx.font = 'bold 9px "Inter", sans-serif';
    ctx.fillText("مدير مركز جرين بروتين المعتمد", isRtl ? footerColRX + 270 : footerColRX + 130, 1395);
  } else {
    ctx.font = 'bold 8.5px "Inter", sans-serif';
    ctx.fillText("AUTHORIZED SIGNATURE: MOAZ SALAMA", isRtl ? footerColRX + 270 : footerColRX + 130, 1378);
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText("DIRECTOR OF GREEN PROTEIN CENTRE", isRtl ? footerColRX + 270 : footerColRX + 130, 1395);
  }

  // BOTTOM OF PAGE FOOTER LINE
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 1585);
  ctx.lineTo(1120, 1585);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#888';
  ctx.font = '8.5px "JetBrains Mono", monospace';
  ctx.fillText(`ISSUED BY THE INSTITUTIONAL GREEN PROTEIN GROUP GROUPWAY • LICENSED RESEARCH PREVIEW STAGE CONFORMITY SECURED`, 600, 1618);

  const pageImgData = canvas.toDataURL('image/png', 1.0);

  // Construct standard PDF with precise single A4 page
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  pdf.addImage(pageImgData, 'PNG', 0, 0, 210, 297);

  // Save the gorgeous PDF
  pdf.save(`green-protein-${type}-report-${lang}.pdf`);
};
