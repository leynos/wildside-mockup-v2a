/** @file Configurable values powering the route customizer screen. */

import type { TFunction } from "i18next";

import type { EntityLocalizations } from "../domain/entities/localization";
import {
  formatDistance,
  formatDuration,
  metresFromKilometres,
  secondsFromMinutes,
} from "../units/unit-format";
import type { UnitSystem } from "../units/unit-system";
import type { Route, RouteId } from "./explore.models";
import { exploreRoutes } from "./explore.routes";
import { unsafeRouteId } from "./explore-fixture-helpers";
import { localisation } from "./fixture-localization";

type SliderQuantity = "distance" | "duration";

export interface SliderConfig {
  id: string;
  localizations: EntityLocalizations;
  iconToken: string;
  iconColorClass: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  quantity: SliderQuantity;
  markers: number[];
}

export interface SegmentOption {
  id: string;
  localizations: EntityLocalizations;
}

export interface SurfaceOption {
  id: string;
  localizations: EntityLocalizations;
  iconToken: string;
  emphasis?: boolean;
}

export interface InterestMixSlice {
  id: string;
  localizations: EntityLocalizations;
  iconToken: string;
  iconColorClass: string;
  allocation: number;
}

export interface RoutePreviewOption {
  id: string;
  routeId: RouteId;
  iconColorClass: string;
  gradientClass: string;
  featured?: boolean;
}

export interface ResolvedRoutePreviewOption extends RoutePreviewOption {
  route: Route;
}

export interface AdvancedToggleOption {
  id: string;
  localizations: EntityLocalizations;
  iconToken: string;
  defaultEnabled: boolean;
}

export interface BottomNavigationItem {
  id: string;
  label: string;
  iconToken: string;
  href?: string;
  active?: boolean;
}

const routeLookup = new Map<RouteId, Route>(exploreRoutes.map((route) => [route.id, route]));

const requireRoute = (routeId: RouteId): Route => {
  const route = routeLookup.get(routeId);
  if (!route) {
    throw new Error(`Missing route for preview option '${routeId}'.`);
  }
  return route;
};

export const sliders: SliderConfig[] = [
  {
    id: "distance",
    localizations: localisation(
      { name: "Distance", description: "Target walk length" },
      {},
      "slider:distance",
    ),
    iconToken: "{icon.object.distance}",
    iconColorClass: "text-accent",
    min: metresFromKilometres(1),
    max: metresFromKilometres(10),
    step: metresFromKilometres(0.1),
    initialValue: metresFromKilometres(3.2),
    quantity: "distance",
    markers: [metresFromKilometres(1), metresFromKilometres(5), metresFromKilometres(10)],
  },
  {
    id: "duration",
    localizations: localisation(
      { name: "Duration", description: "Time on foot" },
      {},
      "slider:duration",
    ),
    iconToken: "{icon.object.duration}",
    iconColorClass: "text-accent",
    min: secondsFromMinutes(15),
    max: secondsFromMinutes(180),
    step: secondsFromMinutes(5),
    initialValue: secondsFromMinutes(75),
    quantity: "duration",
    markers: [secondsFromMinutes(15), secondsFromMinutes(90), secondsFromMinutes(180)],
  },
];

export const crowdLevelOptions: SegmentOption[] = [
  {
    id: "quiet",
    localizations: localisation(
      { name: "Quiet", description: "Tranquil streets" },
      {},
      "segment:crowd:quiet",
    ),
  },
  {
    id: "balanced",
    localizations: localisation(
      { name: "Balanced", description: "Local buzz" },
      {},
      "segment:crowd:balanced",
    ),
  },
  {
    id: "lively",
    localizations: localisation(
      { name: "Lively", description: "Popular spots" },
      {},
      "segment:crowd:lively",
    ),
  },
];

export const elevationOptions: SegmentOption[] = [
  {
    id: "flat",
    localizations: localisation(
      { name: "Flat", description: "Minimal climbs" },
      {},
      "segment:elevation:flat",
    ),
  },
  {
    id: "rolling",
    localizations: localisation(
      { name: "Rolling", description: "Gentle hills" },
      {},
      "segment:elevation:rolling",
    ),
  },
  {
    id: "steep",
    localizations: localisation(
      { name: "Steep", description: "Challenge me" },
      {},
      "segment:elevation:steep",
    ),
  },
];

export const surfaceOptions: SurfaceOption[] = [
  {
    id: "paved",
    localizations: localisation({ name: "Paved" }, {}, "surface:paved"),
    iconToken: "{icon.category.paved}",
    emphasis: true,
  },
  {
    id: "trail",
    localizations: localisation({ name: "Trail" }, {}, "surface:trail"),
    iconToken: "{icon.category.trails}",
  },
  {
    id: "boardwalk",
    localizations: localisation({ name: "Boardwalk" }, {}, "surface:boardwalk"),
    iconToken: "{icon.category.water}",
  },
  {
    id: "mixed",
    localizations: localisation({ name: "Mixed" }, {}, "surface:mixed"),
    iconToken: "{icon.object.route}",
  },
];

export const interestMix: InterestMixSlice[] = [
  {
    id: "nature",
    localizations: localisation({ name: "Nature" }, {}, "interest:nature"),
    iconToken: "{icon.category.nature}",
    iconColorClass: "text-emerald-400",
    allocation: 40,
  },
  {
    id: "history",
    localizations: localisation({ name: "History" }, {}, "interest:history"),
    iconToken: "{icon.category.history}",
    iconColorClass: "text-sky-400",
    allocation: 30,
  },
  {
    id: "food",
    localizations: localisation({ name: "Food & Drink" }, {}, "interest:food"),
    iconToken: "{icon.category.food}",
    iconColorClass: "text-amber-400",
    allocation: 30,
  },
];

export const routePreviews: RoutePreviewOption[] = [
  {
    id: "route-a",
    routeId: unsafeRouteId("harbour-lights"),
    iconColorClass: "text-accent",
    gradientClass: "from-accent/20 to-sky-400/20",
    featured: true,
  },
  {
    id: "route-b",
    routeId: unsafeRouteId("coffee-culture-loop"),
    iconColorClass: "text-emerald-400",
    gradientClass: "from-emerald-400/20 to-amber-400/20",
  },
  {
    id: "route-c",
    routeId: unsafeRouteId("hidden-garden-lanes"),
    iconColorClass: "text-purple-400",
    gradientClass: "from-purple-400/20 to-pink-400/20",
  },
];

export const resolvedRoutePreviews: ResolvedRoutePreviewOption[] = routePreviews.map((preview) => ({
  ...preview,
  route: requireRoute(preview.routeId),
}));

export const advancedOptions: AdvancedToggleOption[] = [
  {
    id: "safety",
    localizations: localisation(
      { name: "Safety Priority", description: "Well-lit, busy routes" },
      {},
      "advanced:safety",
    ),
    iconToken: "{icon.safety.priority}",
    defaultEnabled: false,
  },
  {
    id: "accessibility",
    localizations: localisation(
      { name: "Accessibility", description: "Step-free routes" },
      {},
      "advanced:accessibility",
    ),
    iconToken: "{icon.accessibility.stepFree}",
    defaultEnabled: true,
  },
  {
    id: "download",
    localizations: localisation(
      { name: "Offline download", description: "Preload maps and audio" },
      {},
      "advanced:download",
    ),
    iconToken: "{icon.action.download}",
    defaultEnabled: false,
  },
];

export const bottomNavigation: BottomNavigationItem[] = [
  { id: "map", label: "Map", iconToken: "{icon.navigation.map}", href: "/map/quick" },
  { id: "discover", label: "Discover", iconToken: "{icon.navigation.explore}", href: "/explore" },
  {
    id: "routes",
    label: "Routes",
    iconToken: "{icon.object.route}",
    href: "/customize",
    active: true,
  },
  { id: "profile", label: "Profile", iconToken: "{icon.navigation.profile}", href: "/offline" },
];

/**
 * Format a slider value with unit precision in keeping with the mockup copy.
 *
 * @example
 * ```ts
 * formatSliderValue("distance", 3200, t, "en-GB", "metric"); // "3.2 km"
 * ```
 */
export function formatSliderValue(
  configId: string,
  value: number,
  t: TFunction,
  locale: string,
  unitSystem: UnitSystem,
): string {
  const slider = sliders.find((entry) => entry.id === configId);
  if (!slider) return value.toString();

  const sharedOptions = { t, locale, unitSystem } as const;

  if (slider.quantity === "distance") {
    const { value: formattedValue, unitLabel } = formatDistance(value, {
      ...sharedOptions,
    });
    return `${formattedValue} ${unitLabel}`;
  }

  const { value: formattedValue, unitLabel } = formatDuration(value, {
    ...sharedOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formattedValue} ${unitLabel}`;
}
