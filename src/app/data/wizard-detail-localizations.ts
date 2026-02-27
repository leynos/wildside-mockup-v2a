/** @file Wizard route detail row localisation maps. */

import type { EntityLocalizations } from "../domain/entities/localization";
import { localisation } from "./fixture-localization";

// Detail Row Localizations
// =============================================================================

export const terrainDetailLocalizations: EntityLocalizations = localisation(
  { name: "Terrain", description: "Paved paths" },
  {
    ar: { name: "التضاريس", description: "ممرات معبدة" },
    cy: { name: "Tirwedd", description: "Llwybrau palmant" },
    da: { name: "Terræn", description: "Asfalterede stier" },
    de: { name: "Gelände", description: "Befestigte Wege" },
    el: { name: "Έδαφος", description: "Στρωμένα μονοπάτια" },
    es: { name: "Terreno", description: "Caminos pavimentados" },
    fi: { name: "Maasto", description: "Päällystetyt polut" },
    fr: { name: "Terrain", description: "Chemins pavés" },
    gd: { name: "Cruth-tìre", description: "Casan pàighte" },
    he: { name: "שטח", description: "שבילים סלולים" },
    hi: { name: "भूभाग", description: "पक्के रास्ते" },
    it: { name: "Terreno", description: "Sentieri pavimentati" },
    ja: { name: "地形", description: "舗装路" },
    ko: { name: "지형", description: "포장 도로" },
    nb: { name: "Terreng", description: "Asfalterte stier" },
    nl: { name: "Terrein", description: "Verharde paden" },
    pl: { name: "Teren", description: "Utwardzone ścieżki" },
    pt: { name: "Terreno", description: "Caminhos pavimentados" },
    ru: { name: "Рельеф", description: "Мощёные дорожки" },
    sv: { name: "Terräng", description: "Asfalterade stigar" },
    ta: { name: "நிலப்பரப்பு", description: "நடைபாதைகள்" },
    th: { name: "ภูมิประเทศ", description: "ทางเดินลาดยาง" },
    tr: { name: "Arazi", description: "Döşenmiş yollar" },
    vi: { name: "Địa hình", description: "Đường lát" },
    "zh-CN": { name: "地形", description: "铺装路径" },
    "zh-TW": { name: "地形", description: "鋪裝路徑" },
  },
  "detail: terrain",
);

export const routeTypeDetailLocalizations: EntityLocalizations = localisation(
  { name: "Route type", description: "Loop" },
  {
    ar: { name: "نوع المسار", description: "دائري" },
    cy: { name: "Math o lwybr", description: "Cylch" },
    da: { name: "Rutetype", description: "Sløjfe" },
    de: { name: "Routentyp", description: "Rundweg" },
    el: { name: "Τύπος διαδρομής", description: "Κύκλος" },
    es: { name: "Tipo de ruta", description: "Circuito" },
    fi: { name: "Reittityyppi", description: "Kierros" },
    fr: { name: "Type de parcours", description: "Boucle" },
    gd: { name: "Seòrsa slighe", description: "Cuairt" },
    he: { name: "סוג מסלול", description: "לולאה" },
    hi: { name: "मार्ग प्रकार", description: "लूप" },
    it: { name: "Tipo di percorso", description: "Circuito" },
    ja: { name: "ルートタイプ", description: "周回" },
    ko: { name: "경로 유형", description: "순환" },
    nb: { name: "Rutetype", description: "Sløyfe" },
    nl: { name: "Routetype", description: "Rondwandeling" },
    pl: { name: "Typ trasy", description: "Pętla" },
    pt: { name: "Tipo de rota", description: "Circuito" },
    ru: { name: "Тип маршрута", description: "Кольцевой" },
    sv: { name: "Ruttyp", description: "Slinga" },
    ta: { name: "பாதை வகை", description: "வளையம்" },
    th: { name: "ประเภทเส้นทาง", description: "วนรอบ" },
    tr: { name: "Rota türü", description: "Döngü" },
    vi: { name: "Loại tuyến", description: "Vòng lặp" },
    "zh-CN": { name: "路线类型", description: "环线" },
    "zh-TW": { name: "路線類型", description: "環線" },
  },
  "detail: route type",
);

export const surfacesDetailLocalizations: EntityLocalizations = localisation(
  { name: "Surfaces", description: "Concrete, grass" },
  {
    ar: { name: "الأسطح", description: "خرسانة، عشب" },
    cy: { name: "Arwynebau", description: "Concrit, glaswellt" },
    da: { name: "Overflader", description: "Beton, græs" },
    de: { name: "Oberflächen", description: "Beton, Rasen" },
    el: { name: "Επιφάνειες", description: "Σκυρόδεμα, γρασίδι" },
    es: { name: "Superficies", description: "Hormigón, césped" },
    fi: { name: "Pinnat", description: "Betoni, nurmi" },
    fr: { name: "Surfaces", description: "Béton, herbe" },
    gd: { name: "Uachdarain", description: "Cruadhtan, feur" },
    he: { name: "משטחים", description: "בטון, דשא" },
    hi: { name: "सतहें", description: "कंक्रीट, घास" },
    it: { name: "Superfici", description: "Cemento, erba" },
    ja: { name: "路面", description: "コンクリート、芝生" },
    ko: { name: "노면", description: "콘크리트, 잔디" },
    nb: { name: "Overflater", description: "Betong, gress" },
    nl: { name: "Ondergrond", description: "Beton, gras" },
    pl: { name: "Nawierzchnie", description: "Beton, trawa" },
    pt: { name: "Superfícies", description: "Betão, relva" },
    ru: { name: "Покрытие", description: "Бетон, трава" },
    sv: { name: "Underlag", description: "Betong, gräs" },
    ta: { name: "பரப்புகள்", description: "கான்கிரீட், புல்" },
    th: { name: "พื้นผิว", description: "คอนกรีต, หญ้า" },
    tr: { name: "Yüzeyler", description: "Beton, çim" },
    vi: { name: "Bề mặt", description: "Bê tông, cỏ" },
    "zh-CN": { name: "路面", description: "混凝土、草地" },
    "zh-TW": { name: "路面", description: "混凝土、草地" },
  },
  "detail: surfaces",
);

// =============================================================================
