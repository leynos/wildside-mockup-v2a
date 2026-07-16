/**
 * @file Safety domain fixtures: toggle entities, accordion sections, and presets.
 */

import type { EntityLocalizations } from "../domain/entities/localization";
import { localisation } from "./fixture-localization";

export type SafetyToggleId = string & { readonly __brand: "SafetyToggleId" };

export const safetyToggleId = (value: string): SafetyToggleId => value as SafetyToggleId;

export interface SafetyToggle {
  readonly id: SafetyToggleId;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly defaultChecked: boolean;
}

export interface SafetyAccordionSection {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly toggleIds: readonly SafetyToggleId[];
}

export interface SafetyPreset {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly appliedToggleIds: readonly SafetyToggleId[];
}

export const safetyToggles: SafetyToggle[] = [
  {
    id: safetyToggleId("step-free"),
    localizations: localisation(
      { name: "Step-free routes", description: "Avoid stairs and steps" },
      {
        fr: { name: "Parcours sans marche", description: "Évitez les escaliers" },
        vi: { name: "Lộ trình không bậc", description: "Tránh cầu thang và bậc cao" },
        "zh-TW": { name: "無階梯路線", description: "避免樓梯與臺階" },
      },
      "safety-toggle:step-free",
    ),
    iconToken: "{icon.accessibility.stepFree}",
    accentClass: "bg-green-500/20 text-green-400",
    defaultChecked: true,
  },
  {
    id: safetyToggleId("avoid-hills"),
    localizations: localisation(
      { name: "Avoid steep hills", description: "Limit inclines above 5%" },
      {
        fr: {
          name: "Éviter les fortes côtes",
          description: "Limitez les pentes au‑delà de 5 %",
        },
        vi: {
          name: "Tránh dốc đứng",
          description: "Giới hạn độ dốc trên 5%",
        },
        "zh-TW": {
          name: "避免陡坡",
          description: "限制超過 5% 的坡度",
        },
      },
      "safety-toggle:avoid-hills",
    ),
    iconToken: "{icon.accessibility.elevation}",
    accentClass: "bg-orange-500/20 text-orange-400",
    defaultChecked: false,
  },
  {
    id: safetyToggleId("wider-paths"),
    localizations: localisation(
      {
        name: "Prefer wider paths",
        description: "Optimized for chairs, buggies, or group walking",
      },
      {
        fr: {
          name: "Préférer des chemins larges",
          description: "Optimisés pour fauteuils, poussettes ou groupes",
        },
        vi: {
          name: "Ưu tiên lối đi rộng",
          description: "Tối ưu cho xe lăn, xe đẩy hoặc nhóm đông",
        },
        "zh-TW": {
          name: "優先寬闊路徑",
          description: "適合輪椅、手推車或團體同行",
        },
      },
      "safety-toggle:wider-paths",
    ),
    iconToken: "{icon.category.paved}",
    accentClass: "bg-purple-500/20 text-purple-400",
    defaultChecked: true,
  },
  {
    id: safetyToggleId("well-lit"),
    localizations: localisation(
      { name: "Well-lit paths", description: "Prioritize brightly lit evening routes" },
      {
        fr: {
          name: "Itinéraires bien éclairés",
          description: "Prioriser les trajets du soir bien éclairés",
        },
        vi: {
          name: "Lối đi đủ ánh sáng",
          description: "Ưu tiên các tuyến buổi tối được chiếu sáng tốt",
        },
        "zh-TW": {
          name: "光線充足的路徑",
          description: "優先選擇夜間光線充足的路線",
        },
      },
      "safety-toggle:well-lit",
    ),
    iconToken: "{icon.object.guidance}",
    accentClass: "bg-amber-500/20 text-amber-400",
    defaultChecked: true,
  },
  {
    id: safetyToggleId("busy-areas"),
    localizations: localisation(
      { name: "Prefer busy areas", description: "Stay in populated zones" },
      {
        fr: {
          name: "Privilégier les zones animées",
          description: "Restez dans les secteurs fréquentés",
        },
        vi: {
          name: "Ưu tiên khu vực đông người",
          description: "Ở trong khu vực có người qua lại",
        },
        "zh-TW": {
          name: "偏好熱鬧區域",
          description: "待在有人潮的區域",
        },
      },
      "safety-toggle:busy-areas",
    ),
    iconToken: "{icon.safety.group}",
    accentClass: "bg-pink-500/20 text-pink-400",
    defaultChecked: false,
  },
  {
    id: safetyToggleId("emergency-sharing"),
    localizations: localisation(
      { name: "Emergency sharing", description: "Share location with contacts" },
      {
        fr: {
          name: "Partage d’urgence",
          description: "Partagez votre position avec vos contacts",
        },
        vi: {
          name: "Chia sẻ khẩn cấp",
          description: "Chia sẻ vị trí với liên hệ tin cậy",
        },
        "zh-TW": {
          name: "緊急分享",
          description: "與聯絡人分享你的定位",
        },
      },
      "safety-toggle:emergency-sharing",
    ),
    iconToken: "{icon.safety.emergencyPhone}",
    accentClass: "bg-red-500/20 text-red-400",
    defaultChecked: false,
  },
  {
    id: safetyToggleId("avoid-isolated"),
    localizations: localisation(
      { name: "Avoid isolated areas", description: "Skip secluded locations" },
      {
        fr: {
          name: "Éviter les zones isolées",
          description: "Écartez les lieux trop reculés",
        },
        vi: {
          name: "Tránh khu vắng vẻ",
          description: "Bỏ qua các điểm hẻo lánh",
        },
        "zh-TW": {
          name: "避免偏僻地點",
          description: "略過人跡罕至的區域",
        },
      },
      "safety-toggle:avoid-isolated",
    ),
    iconToken: "{icon.safety.hide}",
    accentClass: "bg-slate-500/20 text-slate-300",
    defaultChecked: true,
  },
  {
    id: safetyToggleId("shade"),
    localizations: localisation(
      { name: "Prioritize shade", description: "Choose tree-lined paths" },
      {
        fr: {
          name: "Priorité à l’ombre",
          description: "Choisissez des sentiers bordés d’arbres",
        },
        vi: {
          name: "Ưu tiên bóng mát",
          description: "Chọn các cung đường nhiều cây",
        },
        "zh-TW": {
          name: "優先陰涼",
          description: "選擇林蔭大道",
        },
      },
      "safety-toggle:shade",
    ),
    iconToken: "{icon.category.trails}",
    accentClass: "bg-emerald-500/20 text-emerald-400",
    defaultChecked: false,
  },
  {
    id: safetyToggleId("weather-adaptive"),
    localizations: localisation(
      { name: "Weather-adaptive", description: "Adjust routes for weather" },
      {
        fr: {
          name: "Adapté à la météo",
          description: "Ajustez vos parcours selon les conditions",
        },
        vi: {
          name: "Thích ứng thời tiết",
          description: "Điều chỉnh lộ trình theo điều kiện trời",
        },
        "zh-TW": {
          name: "天氣自適應",
          description: "依天氣調整路線",
        },
      },
      "safety-toggle:weather-adaptive",
    ),
    iconToken: "{icon.object.weatherSunny}",
    accentClass: "bg-blue-500/20 text-blue-400",
    defaultChecked: true,
  },
  {
    id: safetyToggleId("quiet-routes"),
    localizations: localisation(
      { name: "Prefer quiet routes", description: "Minimize traffic noise" },
      {
        fr: {
          name: "Préférer les zones calmes",
          description: "Réduisez le bruit de la circulation",
        },
        vi: {
          name: "Ưu tiên tuyến yên tĩnh",
          description: "Giảm tiếng ồn giao thông",
        },
        "zh-TW": {
          name: "偏好安靜路線",
          description: "降低交通噪音",
        },
      },
      "safety-toggle:quiet-routes",
    ),
    iconToken: "{icon.object.audio}",
    accentClass: "bg-teal-500/20 text-teal-400",
    defaultChecked: false,
  },
];

export const safetyAccordionSections: SafetyAccordionSection[] = [
  {
    id: "mobility",
    localizations: localisation(
      { name: "Mobility Support", description: "Route adjustments for easier navigation" },
      {
        fr: {
          name: "Aide à la mobilité",
          description: "Ajustements de parcours pour faciliter la navigation",
        },
        vi: {
          name: "Hỗ trợ di chuyển",
          description: "Điều chỉnh tuyến để di chuyển dễ dàng hơn",
        },
        "zh-TW": {
          name: "行動支援",
          description: "微調路線以利更好導航",
        },
      },
      "safety-section:mobility",
    ),
    iconToken: "{icon.accessibility.stepFree}",
    accentClass: "bg-sky-500/20 text-sky-400",
    toggleIds: [
      safetyToggleId("step-free"),
      safetyToggleId("avoid-hills"),
      safetyToggleId("wider-paths"),
    ],
  },
  {
    id: "safety",
    localizations: localisation(
      { name: "Safety Features", description: "Enhanced security for your walks" },
      {
        fr: {
          name: "Fonctionnalités de sécurité",
          description: "Sécurité renforcée pendant vos balades",
        },
        vi: {
          name: "Tính năng an toàn",
          description: "Thêm yên tâm cho mỗi chuyến đi bộ",
        },
        "zh-TW": {
          name: "安全功能",
          description: "讓每次步行更安心",
        },
      },
      "safety-section:safety",
    ),
    iconToken: "{icon.safety.priority}",
    accentClass: "bg-yellow-500/20 text-yellow-400",
    toggleIds: [
      safetyToggleId("well-lit"),
      safetyToggleId("busy-areas"),
      safetyToggleId("emergency-sharing"),
      safetyToggleId("avoid-isolated"),
    ],
  },
  {
    id: "comfort",
    localizations: localisation(
      { name: "Comfort Settings", description: "Personalize your walking experience" },
      {
        fr: {
          name: "Paramètres de confort",
          description: "Personnalisez votre expérience de marche",
        },
        vi: {
          name: "Cài đặt thoải mái",
          description: "Cá nhân hóa trải nghiệm đi bộ",
        },
        "zh-TW": {
          name: "舒適設定",
          description: "客製你的步行體驗",
        },
      },
      "safety-section:comfort",
    ),
    iconToken: "{icon.environment.toggle}",
    accentClass: "bg-emerald-500/20 text-emerald-400",
    toggleIds: [
      safetyToggleId("shade"),
      safetyToggleId("weather-adaptive"),
      safetyToggleId("quiet-routes"),
    ],
  },
];

export const safetyPresets: SafetyPreset[] = [
  {
    id: "family",
    localizations: localisation(
      { name: "Family Friendly", description: "Gentle pace, playground stops, shade" },
      {
        fr: {
          name: "Adapté aux familles",
          description: "Rythme doux, arrêts aires de jeux, ombre",
        },
        vi: {
          name: "Thân thiện gia đình",
          description: "Nhịp độ nhẹ nhàng, dừng ở sân chơi, nhiều bóng râm",
        },
        "zh-TW": {
          name: "家庭友善",
          description: "步調溫和、遊戲場停留、遮蔭充足",
        },
      },
      "safety-preset:family",
    ),
    iconToken: "{icon.object.family}",
    accentClass: "bg-amber-500/20 text-amber-400",
    appliedToggleIds: [
      safetyToggleId("wider-paths"),
      safetyToggleId("shade"),
      safetyToggleId("avoid-hills"),
      safetyToggleId("weather-adaptive"),
    ],
  },
  {
    id: "senior",
    localizations: localisation(
      { name: "Senior Friendly", description: "Gentle slopes, resting points, well-lit" },
      {
        fr: {
          name: "Adapté aux seniors",
          description: "Pentes légères, points de repos, bonne luminosité",
        },
        vi: {
          name: "Thân thiện người lớn tuổi",
          description: "Dốc thoải, điểm nghỉ và ánh sáng tốt",
        },
        "zh-TW": {
          name: "長者友善",
          description: "緩坡、休息點與良好照明",
        },
      },
      "safety-preset:senior",
    ),
    iconToken: "{icon.accessibility.mobilityAid}",
    accentClass: "bg-green-500/20 text-green-400",
    appliedToggleIds: [
      safetyToggleId("step-free"),
      safetyToggleId("avoid-hills"),
      safetyToggleId("wider-paths"),
      safetyToggleId("well-lit"),
    ],
  },
  {
    id: "night",
    localizations: localisation(
      { name: "Night Walker", description: "Well-lit, busy areas, emergency sharing" },
      {
        fr: {
          name: "Baladeur nocturne",
          description: "Zones bien éclairées et animées avec partage d’urgence",
        },
        vi: {
          name: "Người đi đêm",
          description: "Khu vực sáng sủa, đông người kèm chia sẻ khẩn cấp",
        },
        "zh-TW": {
          name: "夜間漫步",
          description: "明亮、熱鬧並支援緊急分享",
        },
      },
      "safety-preset:night",
    ),
    iconToken: "{icon.object.weatherNight}",
    accentClass: "bg-indigo-500/20 text-indigo-300",
    appliedToggleIds: [
      safetyToggleId("well-lit"),
      safetyToggleId("busy-areas"),
      safetyToggleId("emergency-sharing"),
      safetyToggleId("avoid-isolated"),
    ],
  },
];
