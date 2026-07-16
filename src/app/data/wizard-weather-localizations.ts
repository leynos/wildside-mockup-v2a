/** @file Wizard step-three weather localization maps. */

import type { EntityLocalizations } from "../domain/entities/localization";
import { localisation } from "./fixture-localization";

// Weather Localizations
// =============================================================================

export const weatherTitleLocalizations: EntityLocalizations = localisation(
  { name: "Perfect walking weather", description: "Pack light layers just in case." },
  {
    ar: { name: "طقس مثالي للمشي", description: "احمل طبقات خفيفة تحسبًا للتقلبات." },
    cy: {
      name: "Tywydd perffaith ar gyfer cerdded",
      description: "Paciwch haenau ysgafn rhag ofn.",
    },
    da: { name: "Perfekt gåvejr", description: "Pak lette lag for en sikkerheds skyld." },
    de: {
      name: "Perfektes Spazierwetter",
      description: "Nimm zur Sicherheit leichte Schichten mit.",
    },
    el: {
      name: "Ιδανικός καιρός για περπάτημα",
      description: "Πάρε μαζί σου ελαφριές στρώσεις για σιγουριά.",
    },
    es: { name: "Clima perfecto para caminar", description: "Lleva capas ligeras por si acaso." },
    fi: {
      name: "Täydellinen kävelysää",
      description: "Ota varmuuden vuoksi kevyitä kerroksia mukaan.",
    },
    fr: {
      name: "Temps idéal pour marcher",
      description: "Prévoyez des couches légères par précaution.",
    },
    gd: {
      name: "Sìde foirfe airson coiseachd",
      description: "Thoir leat sreathan aotrom airson gach suidheachadh.",
    },
    he: { name: "מזג אוויר מושלם להליכה", description: "ארזו שכבות קלות למקרה הצורך." },
    hi: { name: "चलने के लिए आदर्श मौसम", description: "एहतियात के तौर पर हल्की परतें रखें।" },
    it: {
      name: "Meteo perfetto per camminare",
      description: "Porta con te qualche strato leggero per sicurezza.",
    },
    ja: { name: "ウォーキング日和", description: "念のため軽めの上着を持っていきましょう。" },
    ko: { name: "걷기 좋은 날씨", description: "만일을 대비해 가벼운 겉옷을 챙겨두세요." },
    nb: { name: "Perfekt turvær", description: "Ta med lette lag for sikkerhets skyld." },
    nl: { name: "Perfect wandelweer", description: "Neem voor de zekerheid een licht laagje mee." },
    pl: {
      name: "Idealna pogoda na spacer",
      description: "Na wszelki wypadek zabierz lekkie warstwy.",
    },
    pt: { name: "Clima perfeito para caminhar", description: "Leve camadas leves por precaução." },
    ru: {
      name: "Идеальная погода для прогулки",
      description: "Возьмите лёгкую накидку на всякий случай.",
    },
    sv: {
      name: "Perfekt promenadväder",
      description: "Ta med en lätt extra tröja för säkerhets skull.",
    },
    ta: {
      name: "சிறந்த நடைபயண வானிலை",
      description: "ஏதாவது தேவைப்பட்டால் இலகு படுகைகளை எடுத்துச் செல்லுங்கள்.",
    },
    th: { name: "อากาศเหมาะกับการเดิน", description: "พกเสื้อผ้าบาง ๆ เผื่อไว้" },
    tr: { name: "Yürüyüş için mükemmel hava", description: "Her ihtimale karşı hafif katlar al." },
    vi: {
      name: "Thời tiết lý tưởng để dạo bộ",
      description: "Mang theo vài lớp áo mỏng phòng khi cần.",
    },
    "zh-CN": { name: "适合漫步的天气", description: "以防万一，带上轻薄外套。" },
    "zh-TW": { name: "適合步行的天氣", description: "以備不時之需，帶上輕薄外層。" },
  },
  "weather: title",
);

export const weatherWindLocalizations: EntityLocalizations = localisation(
  { name: "light breeze" },
  {
    ar: { name: "نسيم خفيف" },
    cy: { name: "awel ysgafn" },
    da: { name: "let brise" },
    de: { name: "leichte Brise" },
    el: { name: "ελαφρύ αεράκι" },
    es: { name: "brisa ligera" },
    fi: { name: "kevyt tuulenvire" },
    fr: { name: "légère brise" },
    gd: { name: "gaoth bheag" },
    he: { name: "בריזה קלה" },
    hi: { name: "हल्की हवा" },
    it: { name: "brezza leggera" },
    ja: { name: "そよ風" },
    ko: { name: "산들바람" },
    nb: { name: "lett bris" },
    nl: { name: "lichte bries" },
    pl: { name: "lekka bryza" },
    pt: { name: "brisa leve" },
    ru: { name: "лёгкий бриз" },
    sv: { name: "lätt bris" },
    ta: { name: "மெது தென்றல்" },
    th: { name: "ลมอ่อน" },
    tr: { name: "hafif esinti" },
    vi: { name: "gió nhẹ" },
    "zh-CN": { name: "微风拂面" },
    "zh-TW": { name: "微風" },
  },
  "weather: wind",
);

export const weatherSkyLocalizations: EntityLocalizations = localisation(
  { name: "clear skies" },
  {
    ar: { name: "سماء صافية" },
    cy: { name: "awyr glir" },
    da: { name: "skyfri himmel" },
    de: { name: "klarer Himmel" },
    el: { name: "καθαρός ουρανός" },
    es: { name: "cielo despejado" },
    fi: { name: "kirkas taivas" },
    fr: { name: "ciel dégagé" },
    gd: { name: "speuran soilleir" },
    he: { name: "שמיים בהירים" },
    hi: { name: "साफ आसमान" },
    it: { name: "cielo sereno" },
    ja: { name: "快晴" },
    ko: { name: "맑은 하늘" },
    nb: { name: "klar himmel" },
    nl: { name: "heldere lucht" },
    pl: { name: "bezchmurne niebo" },
    pt: { name: "céu limpo" },
    ru: { name: "ясное небо" },
    sv: { name: "klar himmel" },
    ta: { name: "தெளிந்த வானம்" },
    th: { name: "ท้องฟ้าโปร่ง" },
    tr: { name: "açık gökyüzü" },
    vi: { name: "trời trong" },
    "zh-CN": { name: "晴空万里" },
    "zh-TW": { name: "晴朗天空" },
  },
  "weather: sky",
);

export const weatherSentimentLocalizations: EntityLocalizations = localisation(
  { name: "Ideal" },
  {
    ar: { name: "مثالي" },
    cy: { name: "Delfrydol" },
    da: { name: "Ideelt" },
    de: { name: "Ideal" },
    el: { name: "Ιδανικό" },
    es: { name: "Ideal" },
    fi: { name: "Ihanteellinen" },
    fr: { name: "Idéal" },
    gd: { name: "Fìor mhath" },
    he: { name: "אידאלי" },
    hi: { name: "आदर्श" },
    it: { name: "Ideale" },
    ja: { name: "理想的" },
    ko: { name: "이상적" },
    nb: { name: "Ideelt" },
    nl: { name: "Ideaal" },
    pl: { name: "Idealnie" },
    pt: { name: "Ideal" },
    ru: { name: "Идеально" },
    sv: { name: "Idealiskt" },
    ta: { name: "சிறந்தது" },
    th: { name: "ยอดเยี่ยม" },
    tr: { name: "İdeal" },
    vi: { name: "Tuyệt vời" },
    "zh-CN": { name: "理想" },
    "zh-TW": { name: "理想" },
  },
  "weather: sentiment",
);

// =============================================================================
