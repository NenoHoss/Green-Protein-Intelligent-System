import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Microscope, 
  BookOpen, 
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Language } from '../translations';
import { cn } from '../utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatAssistantProps {
  language: Language;
  t: any;
  contextData?: any; // Current blend results, costs, etc.
}

type ChatMode = 'scientific' | 'simplified' | 'economic';

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ language, t, contextData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('scientific');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  const [fallbackActive, setFallbackActive] = useState<boolean>(false);

  // Poll API availability to support API Key refreshes without a page reload
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/chat-status");
        if (res.ok) {
          const data = await res.json();
          setIsApiAvailable(data.hasKey);
          if (data.hasKey) {
            setFallbackActive(false);
          }
        } else {
          setIsApiAvailable(false);
        }
      } catch (err) {
        setIsApiAvailable(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLocalResponse = (message: string, lang: string, chatModeId: ChatMode): string => {
    const query = message.toLowerCase().trim();
    const isArabic = lang === 'ar';
    
    const isQ1 = 
      query.includes("methionine") || 
      query.includes("metionina") || 
      query.includes("méthionine") || 
      query.includes("methionin") || 
      query.includes("ميثيونين") || 
      query.includes("ميتيونين") || 
      query.includes("蛋氨酸") ||
      query === t.aiAssistant?.suggest1?.toLowerCase().trim();
      
    const isQ2 = 
      query.includes("pdcaas") || 
      query.includes("digestibility") || 
      query.includes("درجة الحمض الأميني") || 
      query.includes("الهضم") ||
      query === t.aiAssistant?.suggest2?.toLowerCase().trim();
      
    const isQ3 = 
      query.includes("optimization") || 
      query.includes("algorithm") || 
      query.includes("reduce cost") || 
      query.includes("الخوارزمية") ||
      query.includes("خوارزمية") ||
      query.includes("تقليل") || 
      query.includes("تكل") || 
      query.includes("تحسين") || 
      query.includes("降低成本") || 
      query.includes("优化") ||
      query === t.aiAssistant?.suggest3?.toLowerCase().trim();

    if (isQ1) {
      switch (lang) {
        case 'ar':
          return `الميثيونين هو غالباً الحمض الأميني المحدد في بروتين الأوراق لأن الكتلة الحيوية الورقية تحتوي عموماً على تركيزات أقل من الأحماض الأمينية المحتوية على الكبريت مقارنة بالبروتينات الحيوانية. لهذا السبب، غالباً ما يتم خلط مصادر البروتين التكميلية مثل البقوليات مع بروتين الأوراق لتحسين توازن الأحماض الأمينية والجودة الغذائية العامة.`;
        case 'es':
          return `La metionina suele ser el aminoácido limitante en la proteína de hoja porque la biomasa foliar generalmente contiene concentraciones más bajas de aminoácidos azufrados en comparación con las proteínas animales. Por esta razón, las fuentes de proteínas complementarias, como las legumbres, a menudo se mezclan con la proteína de hoja para mejorar el equilibrio de aminoácidos y la calidad nutricional general.`;
        case 'fr':
          return `La méthionine est souvent l'acide aminé limitant dans la protéine de feuille car la biomasse foliaire contient généralement des concentrations plus faibles d'acides aminés soufrés par rapport aux protéines animales. Pour cette raison, des sources de protéines complémentaires telles que les légumineuses sont souvent mélangées à la protéine de feuille pour améliorer l'équilibre des acides aminés et la qualité nutritionnelle globale.`;
        case 'de':
          return `Methionin ist in Blattproteinen oft die limitierende Aminosäure, da blattreiche Biomasse im Vergleich zu tierischen Proteinen im Allgemeinen geringere Konzentrationen an schwefelhaltigen Aminosäuren enthält. Aus diesem Grund werden häufig komplementäre Proteinquellen wie Hülsenfrüchte mit Blattprotein gemischt, um das Aminosäuregleichgewicht und die Gesamternährungsqualität zu verbessern.`;
        case 'ru':
          return `Метионин часто является лимитирующей аминокислотой в белке листьев, поскольку лиственная биомасса обычно содержит более низкие концентрации серосодержащих аминокислот по сравнению с животными белками. По этой причине дополнительные источники белка, такие как бобовые, часто смешивают с лиственным белком для улучшения баланса аминокислот и общего питательного качества.`;
        case 'pt':
          return `A metionina é frequentemente o aminoácido limitante na proteína foliar porque a biomassa das folhas geralmente contém concentrações mais baixas de aminoácidos contendo enxofre em comparação com as proteínas animais. Por este motivo, fontes de proteína complementares, como as leguminosas, são frequentemente misturadas com a proteína foliar para melhorar o equilíbrio de aminoácidos e a qualidade nutricional geral.`;
        case 'zh':
          return `蛋氨酸通常是叶蛋白中的限制性氨基酸，因为与动物蛋白相比，叶片生物质中含硫氨基酸 of 浓度通常较低。为此，通常将豆类等互补蛋白质源与叶蛋白混合，以改善氨基酸平衡和整体营养质量。`;
        case 'it':
          return `La metionina è spesso l'amminoacido limitante nelle proteine delle foglie perché la biomassa fogliare contiene generalmente concentrazioni inferiori di amminoacidi solforati rispetto alle proteine animali. Per questo motivo, fonti proteiche complementari come i legumi vengono spesso miscelate con le proteine delle foglie per migliorare il bilancio amminoacidico e la qualità nutrizionale complessiva.`;
        case 'hi':
          return `मेथियोनीन अक्सर पत्ती प्रोटीन में सीमित करने वाला अमीनो एसिड होता है क्योंकि पशु प्रोटीन की तुलना में पत्ती बायोमास में आमतौर पर सल्فر युक्त अमीनो एसिड की सांद्रता कम होती है। इस कारण से, अमीनो एसिड संतुलन और समग्र पोषण गुणवत्ता में सुधार के लिए पत्ती प्रोटीन के साथ फलियों जैसे पूरक प्रोटीन स्रोतों को अक्सर मिलाया जाता है।`;
        default:
          return `Methionine is often the limiting amino acid in leaf protein because leafy biomass generally contains lower concentrations of sulfur-containing amino acids compared to animal proteins. For this reason, complementary protein sources such as legumes are often blended with leaf protein to improve amino acid balance and overall nutritional quality.`;
      }
    }

    if (isQ2) {
      switch (lang) {
        case 'ar':
          return `مفهوم PDCAAS (درجة الحمض الأميني المصححة لهضم البروتين) هو مقياس لجودة البروتين يأخذ في الاعتبار كلاً من تركيبة الأحماض الأمينية وقابليتها للهضم. يمكن لخلطات البروتين النباتي تحقيق قيم PDCAAS أعلى من خلال الجمع بين أنماط الأحماض الأمينية التكميلية، مما يساعد على تعويض الأحماض الأمينية المحددة في مصادر البروتين الفردية.`;
        case 'es':
          return `El PDCAAS (Puntuación de Aminoácidos Corregida por la Digestibilidad de las Proteínas) es una medida de la calidad de la proteína que considera tanto la composición de aminoácidos como la digestibilidad. Las mezclas de proteínas vegetales pueden lograr valores de PDCAAS más altos al combinar perfiles de aminoácidos complementarios, lo que ayuda a compensar los aminoácidos limitantes en las fuentes de proteínas individuales.`;
        case 'fr':
          return `Le PDCAAS (Score d'acides aminés corrigé de la digestibilité des protéines)` + ` est une mesure de la qualité des protéines qui prend en compte à la fois la composition en acides aminés et la digestibilité. Les mélanges de protéines végétales peuvent atteindre des valeurs de PDCAAS plus élevées en combinant des profils d'acides aminés complémentaires, contribuant ainsi à compenser les acides aminés limitants dans les sources de protéines individuelles.`;
        case 'de':
          return `Der PDCAAS (Protein Digestibility Corrected Amino Acid Score) ist ein Maß für die Proteinqualität, das sowohl die Aminosäurezusammensetzung als auch die Verdaulichkeit berücksichtigt. Pflanzliche Proteinmischungen können höhere PDCAAS-Werte erreichen, indem sie komplementäre Aminosäureprofile kombinieren, was dazu beiträgt, limitierende Aminosäuren in einzelnen Proteinquellen auszugleichen.`;
        case 'ru':
          return `PDCAAS (скорректированная по усвояемости аминокислотная шкала) — это показатель качества белка, учитывающий как состав аминокислот, так и их усвояемость. Смеси растительных белков могут достигать более высоких значений PDCAAS путем сочетания взаимодополняющих аминокислотных профилей, помогая компенсировать лимитирующие аминокислоты в отдельных источниках белка.`;
        case 'pt':
          return `O PDCAAS (Escore de Aminoácidos Corrigido pela Digestibilidade da Proteína) é uma medida da qualidade da proteína que considera tanto a composição de aminoácidos quanto a digestibilidade. As misturas de proteínas vegetais podem atingir valores de PDCAAS mais elevados combinando perfis de aminoácidos complementares, ajudando a compensar os aminoácidos limitantes em fontes de proteína individuais.`;
        case 'zh':
          return `PDCAAS（蛋白质消化率校正氨基酸评分）是衡量蛋白质质量的一种指标，兼顾了氨基酸组成和消化率。植物蛋白混合物可以通过结合互补的氨基酸谱来实现更高的 PDCAAS 值，从而有助于弥补单一蛋白质源中限制性氨基酸的不足。`;
        case 'it':
          return `Il PDCAAS (Protein Digestibility Corrected Amino Acid Score) è una misura della qualità proteica che considera sia la composizione amminoacidica sia la digeribilità. Le miscele di proteine vegetali possono ottenere valori di PDCAAS più elevati combinando profili amminoacidici complementari, aiutando a compensato gli amminoacidi limitanti nelle singole fonti proteiche.`;
        case 'hi':
          return `PDCAAS (प्रोटीन पाचनशक्ति सही अमीनो एसिड स्कोर) प्रोटीन की गुणवत्ता का एक उपाय है जो अमीनो एसिड संरचना और पाचनशक्ति दोनों पर विचार करता है। पूरक अमीनो एसिड प्रोफाइल को मिलाकर संयंत्र प्रोटीन मिश्रण उच्च PDCAAS मान प्राप्त कर सकते हैं, जिससे व्यक्तिगत प्रोटीन स्रोतों में अमीनो एसिड को सीमित करने में मदद मिलती है।`;
        default:
          return `PDCAAS (Protein Digestibility Corrected Amino Acid Score) is a measure of protein quality that considers both amino acid composition and digestibility. Plant protein blends can achieve higher PDCAAS values by combining complementary amino acid profiles, helping compensate for limiting amino acids in individual protein sources.`;
      }
    }

    if (isQ3) {
      switch (lang) {
        case 'ar':
          return `تقوم خوارزمية التحسين بتقييم تركيبات الأوراق والبقوليات المتاحة، وإنتاجية البروتين، وتكاليف المكونات، والأهداف الغذائية. وتحدد بعد ذلك الصياغات التي تحقق الجودة الغذائية المطلوبة مع تقليل تكلفة الإنتاج الإجمالية واستهلاك الموارد.`;
        case 'es':
          return `El algoritmo de optimización evalúa las combinaciones de hojas y legumbres disponibles, el rendimiento en proteínas, los costos de los ingredientes y los objetivos nutricionales. Luego identifica las formulaciones que logran la calidad nutricional deseada al tiempo que minimizan el costo total de producción y el consumo de recursos.`;
        case 'fr':
          return `L'algorithme d'optimisation évalue les combinaisons de feuilles et de légumineuses disponibles, le rendement en protéines, les coûts des ingrédients et les objectifs nutritionnels. Il identifie ensuite les formulations qui atteignent la qualité nutritionnelle souhaitée tout en minimisant le coût global de production et la consommation de ressources.`;
        case 'de':
          return `Der Optimierungsalgorithmus bewertet verfügbare Blatt- und Hülsenfrüchtekombinationen, Proteinausbeute, Zutatenkosten und Ernährungsziele. Anschließend identifiziert er Formulierungen, die die gewünschte Ernährungsqualität erreichen und gleichzeitig die Gesamtproduktionskosten und den Ressourcenverbrauch minimieren.`;
        case 'ru':
          return `Алгоритм оптимизации оценивает доступные комбинации листьев и бобовых, выход белка, стоимость ингредиентов и питательные цели. Затем он определяет рецептуры, которые обеспечивают желаемое качество питательных веществ при минимизации общих производственных затрат и потребления ресурсов.`;
        case 'pt':
          return `O algoritmo de otimização avalia as combinações de folhas e leguminosas disponíveis, o rendimento de proteína, o custo dos ingredientes e as metas nutricionais. Em seguida, identifica formulações que alcançam a qualidade nutricional desejada, minimizando o custo total de produção e o consumo de recursos.`;
        case 'zh':
          return `该优化算法评估了可用的叶片和豆类组合、蛋白质产量、成分成本以及营养目标。然后，它确定了既能达到所需营养质量，又能最大限度地降低总体生产成本和资源消耗的最佳配方。`;
        case 'it':
          return `L'algoritmo di ottimizzazione valuta le combinazioni di foglie e legumi disponibili, la resa proteica, i costi degli ingredienti e gli obiettivi nutrizionali. Identifica quindi le formulazioni che raggiungono la qualità nutrizionale desiderata riducendo al minimo i costi complessivi di produzione e il consumo di risorse.`;
        case 'hi':
          return `अनुकूलन एल्गोरिथ्म उपलब्ध पत्ती और फलियों के संयोजन, प्रोटीन उपज, संघटक लागत और पोषण संबंधी लक्ष्यों का मूल्यांकन करता है। इसके बाद यह उन फॉर्मूलेशन की पहचान करता है जो समग्र उत्पादन लागत और संसाधन खपत को कम करते हुए वांछित पोषण गुणवत्ता प्राप्त करते हैं।`;
        default:
          return `The optimization algorithm evaluates available leaf and legume combinations, protein yield, ingredient costs, and nutritional targets. It then identifies formulations that achieve the desired nutritional quality while minimizing overall production cost and resource consumption.`;
      }
    }

    // Smart dynamic offline patterns
    const hasExtract = query.includes("extract") || query.includes("coagulat") || query.includes("stretching") || query.includes("استخلاص") || query.includes("فصل");
    const hasBlend = query.includes("blend") || query.includes("ratio") || query.includes("مزيج") || query.includes("نسبة") || query.includes("بقول");
    const hasEco = query.includes("cost") || query.includes("price") || query.includes("econom") || query.includes("تكلفة") || query.includes("سعر") || query.includes("اقتصاد");
    const hasSustainability = query.includes("sustain") || query.includes("carbon") || query.includes("footprint") || query.includes("كربون") || query.includes("بيئة") || query.includes("استدامة");

    if (hasExtract) {
      if (isArabic) {
        return `### طريقة استخلاص بروتين الأوراق (الوضع المحلي):

عملية الاستخلاص لدينا تعتمد على التخثر الحراري والميكانيكي:
1. **الفرم والعصر الميكانيكي**: طحن الأوراق الخضراء للحصول على عصير غني بالنيتروجين الذائب.
2. **التخثر الحراري الأولي**: تسخين العصير إلى 55 درجة مئوية لفصل الكلوروفيل غير المرغوب فيه (البروتين الأخضر).
3. **التأكيد**: رفع درجة الحرارة لـ 80 درجة مئوية لترسيب البروتينات الغذائية النقية.
4. **التجفيف**: الطرد المركزي يليه التجفيف اللطيف لإنتاج مسحوق المركز البروتيني النظيف.`;
      } else {
        return `### Leaf Protein Extraction Methodology (Offline Guide):

Our extraction protocol operates through structural separation stages:
1. **Mechanical Pulping**: Crushing leaves to break down cellulose walls and release soluble nitrogenous sap.
2. **First Coagulation (55°C)**: Separates green chloroplastic proteins and pigments from the liquid serum.
3. **Secondary Coagulation (80°C)**: Precipitates highly digestible white cytoplasmic protein fraction.
4. **Decanting & Drying**: Centrifugation followed by low-temperature air-drying to yield highly concentrated, bioactive protein isolate.`;
      }
    }

    if (hasBlend) {
      if (isArabic) {
        return `### صياغة الخلطات والنسب المثلى (الوضع المحلي):

نظراً لأن بروتين الأوراق يحتوي على كميات محدودة من الميثيونين، فإن الخوارزمية تنصح بخلطه مع البقوليات (مثل العدس والحمص):
* **النسبة الذهبية**: 65% بروتين أوراق + 35% بروتين بقوليات.
* **النتيجة**: تتدفق الأحماض الأمينية التكميلية لتعوض النقص المتبادل، مما يرفع مؤشر جودة وهضم البروتين (PDCAAS) لمستويات فائقة تماثل مصادر البروتين الحيواني.`;
      } else {
        return `### Optimal Blending Ratios (Offline Guide):

Because leaf proteins are generally limited by Methionine, while legumes (lentils, chickpeas, lupins) are limited by Lysine, mixing them unlocks incredible synergies:
* **Recommended Ratio**: 65% leaf extract paired with 35% legume isolate is the typical optimization zone.
* **Nutritional Benefit**: Generates complete chemical scores matching standard daily reference patterns set by the FAO/WHO, and elevates plant digestion metrics beautifully.`;
      }
    }

    if (hasEco) {
      if (isArabic) {
        return `### دراسات الجدوى الاقتصادية (الوضع المحلي):

الجانب التجاري لاستخلاص البروتين من أوراق الأشجار يتأثر بـ:
1. **تكاليف مدخلات الطاقة**: الطاقة المستخدمة في التجفيف والتخثير الحراري.
2. **الإنتاجية السنوية للكتلة الحيوية**: الاعتماد على أشجار محلية وفيرة ومستدامة (مثل أشجار الجميز والتين والزيتون والمشمش).
3. **القيمة التجارية المضافة**: بيع المركزات للأغذية البشرية في الأسواق ذات الطلب العالي.`;
      } else {
        return `### Economic Feasibility Model (Offline Guide):

Commercializing leaf protein concentrate depends on three microeconomic factors:
1. **Energy Footprint**: Processing expenses, particularly centrifugal drying and multi-stage thermal heating.
2. **Logistics Feedstock**: Utilizing regional agricultural side-stream resources (such as fig, olive, and mulberry pruning discard) to eliminate procurement feedstock pricing.
3. **Margin Optimization**: Positioning white cytoplasmic protein as premium food-grade nutrition to maximize return on assets.`;
      }
    }

    if (hasSustainability) {
      if (isArabic) {
        return `### مؤشرات الاستدامة والأثر الكربوني (الوضع المحلي):

توفير البروتين الأخضر يقدم مزايا بيئية هائلة مقارنة بالثروة الحيوانية:
* **البصمة المائية**: تقليل استهلاك المياه بنسبة تصل إلى 92%.
* **انبعاثات الغازات**: تقليل انبعاثات ثاني أكسيد الكربون بنسبة 88%.
* **مبدأ الاقتصاد الدائري**: إعادة تدوير المخلفات السائلة والمضغوطة كأعلاف وأسمدة حيوية غنية بالمعادن.`;
      } else {
        return `### Sustainability Metrics & Environmental Footprint (Offline Guide):

Transitioning to leaf-sourced green protein isolates delivers heavy ecological improvements compared to conventional livestock:
* **Water Intensity**: Lowers manufacturing fresh-water extraction footprint by up to 92%.
* **Emissions Profile**: Reduces equivalent greenhouse carbon dioxide outputs by around 88%.
* **Zero Waste Synergy**: Utilizing leaf cake prunings as organic agricultural fertilizers or rich livestock forage inputs.`;
      }
    }

    if (isArabic) {
      return `مرحباً بك! أنا مساعد الأبحاث الذكي للبروتين الأخضر في **الوضع المحلي المعرفي**. 

نظيراً لكون إعدادات الاتصال السحابي تجري صيانتها الآن أو لعدم توفر مفتاح التشغيل السحابي، تتوفر لدي قاعدة المعارف المتكاملة محلياً دون اتصال بالإنترنت لمساعدتك على الفور.

يمكنك اختياري لمناقشة مجموعة من المواضيع الهامة:
* **لماذا غالباً ما يكون الميثيونين محدوداً في بروتين الأوراق؟**
* **اشرح مفهوم PDCAAS للخلطات النباتية.**
* **كيف تقلل خوارزمية التحسين التكاليف؟**
* تفاصيل **طريقة استخلاص البروتين** أو **صياغة خلطات النباتية** والأثر البيئي.

ما هو موضوع البحث الذي ترغب في استكشافه الآن؟`;
    } else {
      return `Welcome! I am your Advanced Protein Research Assistant running in **Local Knowledge Mode**.

Because the cloud API is either currently unavailable, rate-limited, or undergoing configuration updates, I have automatically switched to local processing to guarantee uninterrupted support.

I am fully prepared to share offline insights on these research topics:
* **Why is Methionine often limiting in leaf protein?**
* **Explain the PDCAAS concept for plant blends.**
* **How does the optimization algorithm reduce costs?**
* Technical issues with **leaf protein extraction**, **blending optimization ratios**, or **sustainability footprints**.

How can I assist your green research operations today?`;
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const normalized = userMessage.toLowerCase().trim();
    const isQ1 = normalized.includes("methionine") || normalized.includes("metionina") || normalized.includes("méthionine") || normalized.includes("methionin") || normalized.includes("ميثيونين") || normalized.includes("ميتيونين") || normalized.includes("蛋氨酸") || normalized === t.aiAssistant?.suggest1?.toLowerCase().trim();
    const isQ2 = normalized.includes("pdcaas") || normalized.includes("digestibility") || normalized.includes("درجة الحمض الأميني") || normalized.includes("الهضم") || normalized === t.aiAssistant?.suggest2?.toLowerCase().trim();
    const isQ3 = normalized.includes("optimization") || normalized.includes("algorithm") || normalized.includes("reduce cost") || normalized.includes("الخوارزمية") || normalized.includes("خوارزمية") || normalized.includes("تقليل") || normalized.includes("تكل") || normalized.includes("تحسين") || normalized.includes("降低成本") || normalized.includes("优化") || normalized === t.aiAssistant?.suggest3?.toLowerCase().trim();

    const isPredefined = isQ1 || isQ2 || isQ3;

    // Check availability states - If API is unavailable, instantly return the local answer
    if (isApiAvailable === false || fallbackActive || isPredefined) {
      setTimeout(() => {
        const localReply = getLocalResponse(userMessage, language, mode);
        setMessages(prev => [...prev, { role: 'model', content: localReply }]);
        setIsLoading(false);
      }, 350);
      return;
    }

    try {
      const systemInstruction = `
        Develop a highly intelligent, domain-specific AI chatbot integrated into a Sustainable Plant Protein Optimization Platform.
        The chatbot must function as a scientific, economic, and technical assistant specialized in:
        * Leaf protein extraction
        * Plant amino acid analysis
        * Protein blending optimization
        * Economic feasibility modeling
        * Sustainability analytics
        * Agricultural plant biology
        The system must align amino acid calculations with the 2013 adult reference pattern established by:
        Food and Agriculture Organization (FAO)
        World Health Organization (WHO)

        🎯 Core Objectives:
        1. Answer scientific questions about: Essential amino acids, Limiting amino acids, Protein digestibility (PDCAAS concept), Leaf protein concentrate extraction methods, Nutritional balancing.
        2. Explain optimization results generated by the platform: Why a specific blend ratio was chosen, Which amino acid was limiting, How cost was minimized, Trade-offs between quality and price.
        3. Provide economic explanations: Cost per kg protein, Break-even logic, Sensitivity analysis interpretation.
        4. Provide sustainability explanations: Carbon footprint comparison, Circular economy logic, Environmental impact assumptions.

        🌍 MANDATORY LANGUAGE REQUIREMENT:
        You MUST respond in the following language: ${language}.
        If the language code is 'ar', respond in Arabic.
        If 'fr', respond in French.
        If 'de', respond in German.
        If 'es', respond in Spanish.
        If 'ru', respond in Russian.
        If 'pt', respond in Portuguese.
        If 'zh', respond in Chinese.
        If 'it', respond in Italian.
        If 'hi', respond in Hindi.
        Otherwise, default to English ('en').

        🧠 Intelligence Requirements:
        Operate in 3 modes based on current selection:
        - Scientific Mode: Technical, research-level explanations with formulas.
        - Simplified Mode: Beginner-friendly language.
        - Economic Mode: Focus on cost, optimization, and profitability.
        Current Mode: ${mode}

        🔎 Context Awareness:
        Access current blend results from the system: ${JSON.stringify(contextData || {})}
        Reference these results when answering. If a user asks about their results, use this data.

        🧮 Reasoning Requirements:
        - Show step-by-step logic when requested.
        - Reference constraints in optimization.
        - Identify limiting amino acids before and after blending.
        - Explain how multi-objective optimization works.

        🛑 Safety & Boundaries:
        - Avoid giving medical treatment advice.
        - Avoid personalized dietary prescriptions.
        - Provide educational explanations only.
        - State that outputs are research simulations.

        🎨 Personality & Tone:
        Professional, Scientific, Clear, Data-driven, Neutral. Not casual. No emojis. No unnecessary simplification unless requested.
        Language: Respond in ${language === 'ar' ? 'Arabic' : language === 'it' ? 'Italian' : language === 'fr' ? 'French' : 'English'}.
      `;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction,
          messages: [
            ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
            { role: 'user', parts: [{ text: userMessage }] }
          ],
          model: "gemini-3.1-pro-preview",
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive response from backend chat API");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiText = data.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', content: aiText }]);
    } catch (error: any) {
      console.warn("[ChatAssistant] Cloud API failed, switching to Local Knowledge base:", error);
      setFallbackActive(true);
      setIsApiAvailable(false);
      
      // Fallback response generated instantly
      setTimeout(() => {
        const localReply = getLocalResponse(userMessage, language, mode);
        setMessages(prev => [...prev, { role: 'model', content: localReply }]);
        setIsLoading(false);
      }, 350);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[750px] glass-card overflow-hidden group relative">
      <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Header */}
      <div className="p-8 bg-stone-900 text-white flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
            <Bot size={24} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold tracking-tight">{t.aiAssistant.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", (isApiAvailable === false || fallbackActive) ? "bg-amber-400" : "bg-emerald-500")} />
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                {isApiAvailable === false || fallbackActive
                  ? (language === 'ar' ? "الوضع المعرفي المحلي نشط" : "Local Knowledge Active")
                  : t.aiAssistant.status}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setMode('scientific')}
            className={cn(
              "p-3 rounded-xl transition-all duration-300",
              mode === 'scientific' ? "bg-white text-stone-900 shadow-lg scale-105" : "text-stone-400 hover:text-white hover:bg-white/5"
            )}
            title={t.aiAssistant.scientificMode}
          >
            <Microscope size={18} />
          </button>
          <button 
            onClick={() => setMode('simplified')}
            className={cn(
              "p-3 rounded-xl transition-all duration-300 mx-1",
              mode === 'simplified' ? "bg-white text-stone-900 shadow-lg scale-105" : "text-stone-400 hover:text-white hover:bg-white/5"
            )}
            title={t.aiAssistant.simplifiedMode}
          >
            <BookOpen size={18} />
          </button>
          <button 
            onClick={() => setMode('economic')}
            className={cn(
              "p-3 rounded-xl transition-all duration-300",
              mode === 'economic' ? "bg-white text-stone-900 shadow-lg scale-105" : "text-stone-400 hover:text-white hover:bg-white/5"
            )}
            title={t.aiAssistant.economicMode}
          >
            <TrendingUp size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-10 bg-stone-50/30 relative z-10"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10 max-w-md mx-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-xl border border-stone-100"
            >
              <Sparkles size={40} />
            </motion.div>
            <div className="space-y-4">
              <h4 className="text-2xl font-display font-bold text-stone-900 tracking-tight">{t.aiAssistant.welcome}</h4>
              <p className="text-sm text-stone-500 leading-relaxed font-medium">
                {t.aiAssistant.welcomeDesc}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full">
              {[
                t.aiAssistant.suggest1,
                t.aiAssistant.suggest2,
                t.aiAssistant.suggest3
              ].map((s, i) => (
                <motion.button 
                  key={i}
                  whileHover={{ x: 5 }}
                  onClick={() => setInput(s)}
                  className="text-left p-5 bg-white border border-stone-200 rounded-2xl text-xs text-stone-600 hover:border-stone-900 hover:bg-stone-50 transition-all shadow-sm font-medium"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-5 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border",
              m.role === 'user' ? "bg-stone-900 text-white border-stone-800" : "bg-white border-stone-200 text-stone-900"
            )}>
              {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={cn(
              "p-6 rounded-[2rem] text-sm leading-relaxed font-medium shadow-sm",
              m.role === 'user' 
                ? "bg-stone-900 text-white rounded-tr-none" 
                : "bg-white border border-stone-100 text-stone-800 rounded-tl-none"
            )}>
              <div className="markdown-body">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex gap-5 mr-auto">
            <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 text-stone-900 flex items-center justify-center shrink-0 animate-pulse shadow-sm">
              <Bot size={18} />
            </div>
            <div className="p-6 bg-white border border-stone-100 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-4">
              <Loader2 size={18} className="animate-spin text-emerald-500" />
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">{t.aiAssistant.thinking}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-stone-100 relative z-10">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.aiAssistant.placeholder}
              className="w-full pl-8 pr-16 py-5 bg-stone-50 border border-stone-200 rounded-2xl text-sm outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-900/5 transition-all font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300">
              <Sparkles size={18} />
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-stone-900/20"
          >
            <Send size={22} />
          </motion.button>
        </div>
        <div className="mt-6 flex items-center gap-3 text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] justify-center">
          <AlertCircle size={12} className="text-stone-300" />
          {t.aiAssistant.disclaimer}
        </div>
      </div>
    </div>
  );
};
