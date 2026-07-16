/** @file Wizard stop name and note localization maps. */

import type { EntityLocalizations } from "../domain/entities/localization";
import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";

// Stop Localizations
// =============================================================================

export const cafeStopLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Midtown Roastery", description: "Small-batch espresso with window seating" },
    {
      ar: {
        name: "Midtown Roastery",
        description: "قهوة إسبرسو محمصة بكميات صغيرة مع مقاعد نافذة",
      },
      cy: {
        name: "Midtown Roastery",
        description: "Espresso swp bychan gyda seddi wrth y ffenestr",
      },
      da: {
        name: "Midtown Roastery",
        description: "Espresso i små partier med pladser ved vinduet",
      },
      de: {
        name: "Midtown Roastery",
        description: "Espresso in Kleinchargen mit Sitzplätzen am Fenster",
      },
      el: {
        name: "Midtown Roastery",
        description: "Εσπρέσο μικρής παρτίδας με καθίσματα στο παράθυρο",
      },
      es: {
        name: "Midtown Roastery",
        description: "Espresso de pequeños lotes con asientos junto a la ventana",
      },
      fi: { name: "Midtown Roastery", description: "Pienen erän espressoa ikkunapaikoilla" },
      fr: {
        name: "Midtown Roastery",
        description: "Espresso en petite torréfaction avec places en vitrine",
      },
      gd: {
        name: "Midtown Roastery",
        description: "Espresso baidse-beag le suidheachain ri uinneag",
      },
      he: { name: "Midtown Roastery", description: "אספרסו בבאצ'ים קטנים עם מושבים בחלון" },
      hi: { name: "Midtown Roastery", description: "खिड़की के पास बैठने वाले छोटे बैच का एस्प्रेसो" },
      it: {
        name: "Midtown Roastery",
        description: "Espresso a piccoli lotti con posti alla finestra",
      },
      ja: { name: "Midtown Roastery", description: "窓際席で味わう少量焙煎のエスプレッソ" },
      ko: { name: "Midtown Roastery", description: "창가 좌석이 있는 소량 배치 에스프레소" },
      nb: { name: "Midtown Roastery", description: "Espresso i små batcher med vindusplasser" },
      nl: {
        name: "Midtown Roastery",
        description: "Kleinbatch-espresso met zitplaatsen aan het raam",
      },
      pl: {
        name: "Midtown Roastery",
        description: "Espresso z małych partii z miejscami przy oknie",
      },
      pt: {
        name: "Midtown Roastery",
        description: "Espresso em pequenos lotes com lugares à janela",
      },
      ru: { name: "Midtown Roastery", description: "Эспрессо малыми партиями с местами у окна" },
      sv: {
        name: "Midtown Roastery",
        description: "Espresso i små satser med platser vid fönstret",
      },
      ta: { name: "மிட்டௌன் ரோஸ்டரி", description: "சிறிய தொகுதி எஸ்ப்ரெஸ்ஸோ, ஜன்னல் இருக்கைகளுடன்" },
      th: { name: "Midtown Roastery", description: "เอสเปรสโซคั่วจำนวนน้อยพร้อมที่นั่งริมหน้าต่าง" },
      tr: {
        name: "Midtown Roastery",
        description: "Pencere kenarlı oturma alanlı küçük parti espresso",
      },
      vi: {
        name: "Midtown Roastery",
        description: "Espresso rang mẻ nhỏ với chỗ ngồi cạnh cửa sổ",
      },
      "zh-CN": { name: "Midtown Roastery", description: "小批次手冲浓缩咖啡，配备窗边座位" },
      "zh-TW": { name: "Midtown Roastery", description: "小批次濃縮咖啡，提供窗邊座位" },
    },
  ),
  "en-GB",
  "stop: café",
);

export const cafeStopNoteLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Friendly baristas, ideal for takeaway" },
    {
      ar: { name: "باريستا ودودون، مثالي للطلبات السريعة" },
      cy: { name: "Baristiaid cyfeillgar, delfrydol i fynd â fo" },
      da: { name: "Venlige baristaer, perfekt til takeaway" },
      de: { name: "Freundliche Baristas, ideal zum Mitnehmen" },
      el: { name: "Φιλικοί barista, ιδανικό για takeaway" },
      es: { name: "Baristas amables, ideal para llevar" },
      fi: { name: "Ystävälliset baristat, täydellinen mukaan otettavaksi" },
      fr: { name: "Baristas chaleureux, idéal à emporter" },
      gd: { name: "Barista càirdeil, air leth math ri thoirt leat" },
      he: { name: "בריסטות ידידותיים, מושלם לטייק־אוויי" },
      hi: { name: "दोस्ताना बरिस्ता, लेकर जाने के लिए बेहतरीन" },
      it: { name: "Baristi cordiali, perfetto da asporto" },
      ja: { name: "フレンドリーなバリスタ、テイクアウトにも最適" },
      ko: { name: "친절한 바리스타, 테이크아웃에 제격" },
      nb: { name: "Hyggelige baristaer, perfekt for take-away" },
      nl: { name: "Vriendelijke barista's, ideaal om mee te nemen" },
      pl: { name: "Przyjaźni bariści, idealne na wynos" },
      pt: { name: "Baristas simpáticos, ideal para levar" },
      ru: { name: "Дружелюбные бариста, идеально на вынос" },
      sv: { name: "Trevliga baristor, perfekt för take-away" },
      ta: { name: "அன்பான பாறிஸ்தாக்கள், எடுத்துச் செல்ல ஏற்றது" },
      th: { name: "บาริสตาเป็นกันเอง เหมาะสำหรับซื้อกลับ" },
      tr: { name: "Güler yüzlü baristalar, paket almak için ideal" },
      vi: { name: "Barista thân thiện, rất tiện mua mang đi" },
      "zh-CN": { name: "咖啡师亲切友好，适合外带" },
      "zh-TW": { name: "咖啡師親切，外帶最方便" },
    },
  ),
  "en-GB",
  "stop-note: café",
);

export const artStopLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Graffiti Passage", description: "Open-air gallery of rotating murals" },
    {
      ar: { name: "Graffiti Passage", description: "معرض مفتوح يضم جداريات متجددة" },
      cy: { name: "Graffiti Passage", description: "Oriel awyr agored o furluniau cylchdroi" },
      da: { name: "Graffiti Passage", description: "Friluftsgalleri med roterende vægmalerier" },
      de: {
        name: "Graffiti Passage",
        description: "Open-Air-Galerie mit wechselnden Wandgemälden",
      },
      el: {
        name: "Graffiti Passage",
        description: "Υπαίθρια γκαλερί με εναλλασσόμενες τοιχογραφίες",
      },
      es: {
        name: "Graffiti Passage",
        description: "Galería al aire libre con murales en rotación",
      },
      fi: { name: "Graffiti Passage", description: "Ulkoilmagalleria vaihtuvilla muraaleilla" },
      fr: { name: "Graffiti Passage", description: "Galerie en plein air aux fresques tournantes" },
      gd: {
        name: "Graffiti Passage",
        description: "Gailearaidh a-muigh le dealbhan-balla a tha ag atharrachadh",
      },
      he: { name: "Graffiti Passage", description: "גלריית חוץ עם ציורי קיר מתחלפים" },
      hi: { name: "Graffiti Passage", description: "खुला गैलरी जिसमें बदलते भित्ति-चित्र हैं" },
      it: { name: "Graffiti Passage", description: "Galleria all'aperto con murales a rotazione" },
      ja: { name: "Graffiti Passage", description: "さまざまな壁画が入れ替わる屋外ギャラリー" },
      ko: { name: "Graffiti Passage", description: "교대로 바뀌는 벽화를 전시하는 야외 갤러리" },
      nb: { name: "Graffiti Passage", description: "Friluftsgalleri med roterende veggmalerier" },
      nl: {
        name: "Graffiti Passage",
        description: "Openluchtgalerie met wisselende muurschilderingen",
      },
      pl: { name: "Graffiti Passage", description: "Plenerowa galeria z rotującymi muralami" },
      pt: { name: "Graffiti Passage", description: "Galeria ao ar livre com murais rotativos" },
      ru: {
        name: "Graffiti Passage",
        description: "Галерея под открытым небом с меняющимися фресками",
      },
      sv: { name: "Graffiti Passage", description: "Utomhusgalleri med roterande muraler" },
      ta: {
        name: "கிராஃபிட்டி பாஸேஜ்",
        description: "மாறிக் கொண்டிருக்கும் மதில்சித்திரங்களுடன் வெளிப்புற காட்சியகம்",
      },
      th: { name: "Graffiti Passage", description: "แกลเลอรีกลางแจ้งกับจิตรกรรมฝาผนังหมุนเวียน" },
      tr: {
        name: "Graffiti Passage",
        description: "Dönüşümlü duvar resimleriyle açık hava galerisi",
      },
      vi: {
        name: "Graffiti Passage",
        description: "Phòng trưng bày ngoài trời với các bích họa thay phiên",
      },
      "zh-CN": { name: "Graffiti Passage", description: "露天画廊轮换展出多彩壁画" },
      "zh-TW": { name: "Graffiti Passage", description: "露天藝廊，輪播多彩壁畫" },
    },
  ),
  "en-GB",
  "stop: art",
);

export const artStopNoteLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Photo spot" },
    {
      ar: { name: "نقطة تصوير" },
      cy: { name: "Man tynnu lluniau" },
      da: { name: "Fotosted" },
      de: { name: "Fotospot" },
      el: { name: "Σημείο για φωτογραφίες" },
      es: { name: "Punto fotográfico" },
      fi: { name: "Kuvauspaikka" },
      fr: { name: "Spot photo" },
      gd: { name: "Àite dhealbhan" },
      he: { name: "נקודת צילום" },
      hi: { name: "फोटो स्थान" },
      it: { name: "Punto foto" },
      ja: { name: "撮影スポット" },
      ko: { name: "포토 명소" },
      nb: { name: "Fotosted" },
      nl: { name: "Fotospot" },
      pl: { name: "Punkt foto" },
      pt: { name: "Ponto para fotos" },
      ru: { name: "Точка для фото" },
      sv: { name: "Fotopunkt" },
      ta: { name: "புகைப்பட இடம்" },
      th: { name: "จุดถ่ายรูป" },
      tr: { name: "Fotoğraf noktası" },
      vi: { name: "Điểm chụp ảnh" },
      "zh-CN": { name: "拍照打卡点" },
      "zh-TW": { name: "拍照熱點" },
    },
  ),
  "en-GB",
  "stop-note: art",
);

export const gardenStopLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Whispering Oak Garden", description: "Peaceful pocket park with shaded benches" },
    {
      ar: { name: "Whispering Oak Garden", description: "حديقة جيب هادئة بمقاعد مظللة" },
      cy: { name: "Whispering Oak Garden", description: "Parc poced tawel gyda meinciau cysgodol" },
      da: {
        name: "Whispering Oak Garden",
        description: "Fredelig lommepark med skyggefulde bænke",
      },
      de: {
        name: "Whispering Oak Garden",
        description: "Ruhiger Taschenpark mit schattigen Bänken",
      },
      el: { name: "Whispering Oak Garden", description: "Ήσυχο πάρκο τσέπης με σκιερές θέσεις" },
      es: {
        name: "Whispering Oak Garden",
        description: "Parque íntimo y tranquilo con bancos a la sombra",
      },
      fi: {
        name: "Whispering Oak Garden",
        description: "Rauhallinen taskupuisto varjoisilla penkeillä",
      },
      fr: { name: "Whispering Oak Garden", description: "Mini parc paisible avec bancs ombragés" },
      gd: {
        name: "Gàrradh Whispering Oak",
        description: "Pàirc bheag shàmhach le beingean fo sgàil",
      },
      he: { name: "Whispering Oak Garden", description: "פארק כיס שקט עם ספסלים מוצלים" },
      hi: { name: "Whispering Oak Garden", description: "शांत पॉकेट पार्क जिसमें छायादार बेंच हैं" },
      it: {
        name: "Whispering Oak Garden",
        description: "Pocket park tranquillo con panchine ombreggiate",
      },
      ja: { name: "Whispering Oak Garden", description: "日陰のベンチがある静かなポケットパーク" },
      ko: { name: "Whispering Oak Garden", description: "그늘진 벤치가 있는 아늑한 포켓 공원" },
      nb: { name: "Whispering Oak Garden", description: "Stille lommepark med skyggefulle benker" },
      nl: {
        name: "Whispering Oak Garden",
        description: "Rustig pocketpark met schaduwrijke bankjes",
      },
      pl: {
        name: "Whispering Oak Garden",
        description: "Kameralny park kieszonkowy z zacienionymi ławkami",
      },
      pt: {
        name: "Whispering Oak Garden",
        description: "Parque de bolso tranquilo com bancos à sombra",
      },
      ru: {
        name: "Whispering Oak Garden",
        description: "Тихий парковый карман с тенистыми скамейками",
      },
      sv: { name: "Whispering Oak Garden", description: "Lugnt pocketpark med skuggiga bänkar" },
      ta: { name: "விச்பரிங் ஓக் கார்டன்", description: "நிழல் இருக்கைகளுடன் அமைதியான சிறிய பூங்கா" },
      th: { name: "Whispering Oak Garden", description: "สวนเล็กเงียบสงบพร้อมม้านั่งร่มรื่น" },
      tr: { name: "Whispering Oak Garden", description: "Gölgeli bankları olan huzurlu cep parkı" },
      vi: {
        name: "Whispering Oak Garden",
        description: "Công viên nhỏ yên tĩnh với ghế ngồi rợp bóng",
      },
      "zh-CN": { name: "Whispering Oak Garden", description: "静谧口袋公园，设有树荫长椅" },
      "zh-TW": { name: "Whispering Oak Garden", description: "寧靜的小型公園，設有遮蔭座位" },
    },
  ),
  "en-GB",
  "stop: garden",
);

export const gardenStopNoteLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Rest area" },
    {
      ar: { name: "منطقة استراحة" },
      cy: { name: "Ardal orffwys" },
      da: { name: "Hvileområde" },
      de: { name: "Ruhebereich" },
      el: { name: "Χώρος ανάπαυσης" },
      es: { name: "Zona de descanso" },
      fi: { name: "Lepoalue" },
      fr: { name: "Zone de repos" },
      gd: { name: "Raon fois" },
      he: { name: "אזור מנוחה" },
      hi: { name: "विश्राम क्षेत्र" },
      it: { name: "Area di sosta" },
      ja: { name: "休憩エリア" },
      ko: { name: "휴식 구역" },
      nb: { name: "Hvileområde" },
      nl: { name: "Rustzone" },
      pl: { name: "Strefa odpoczynku" },
      pt: { name: "Zona de descanso" },
      ru: { name: "Зона отдыха" },
      sv: { name: "Vilozon" },
      ta: { name: "ஓய்வு பகுதி" },
      th: { name: "พื้นที่พัก" },
      tr: { name: "Dinlenme alanı" },
      vi: { name: "Khu nghỉ chân" },
      "zh-CN": { name: "休憩区" },
      "zh-TW": { name: "休息區" },
    },
  ),
  "en-GB",
  "stop-note: garden",
);
