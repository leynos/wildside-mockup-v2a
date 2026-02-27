/** @file Data backing the walk wizard flow. */

import type { EntityLocalizations } from "../domain/entities/localization";
import { metresFromMiles } from "../units/unit-format";
import {
  artStopLocalizations,
  artStopNoteLocalizations,
  cafeStopLocalizations,
  cafeStopNoteLocalizations,
  easyDifficultyLocalizations,
  gardenStopLocalizations,
  gardenStopNoteLocalizations,
  hiddenGemsLocalizations,
  lightingLocalizations,
  loopRouteLocalizations,
  routeBadgeLocalizations,
  routeTitleLocalizations,
  routeTypeDetailLocalizations,
  surfacesDetailLocalizations,
  terrainDetailLocalizations,
  weatherSentimentLocalizations,
  weatherSkyLocalizations,
  weatherTitleLocalizations,
  weatherWindLocalizations,
} from "./wizard-localizations";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export const wizardSteps: WizardStep[] = [
  { id: "step-1", title: "Duration & interests", description: "Set walk length and themes" },
  { id: "step-2", title: "Discovery preferences", description: "Balance hotspots vs. hidden gems" },
  { id: "step-3", title: "Review & confirm", description: "Generate the tailored walk" },
];

export interface DiscoveryPreferenceOption {
  id: string;
  label: string;
  iconToken: string;
  description: string;
}

export const accessibilityOptions: DiscoveryPreferenceOption[] = [
  {
    id: "well-lit",
    label: "Well-lit paths",
    iconToken: "{icon.object.guidance}",
    description: "Prioritise brightly lit evening routes",
  },
  {
    id: "wheelchair",
    label: "Wheelchair friendly",
    iconToken: "{icon.accessibility.stepFree}",
    description: "Smooth, wide pathways",
  },
  {
    id: "paved",
    label: "Paved surfaces",
    iconToken: "{icon.category.paved}",
    description: "Avoid dirt trails and grass",
  },
];

export interface WizardSummaryHighlight {
  readonly id: string;
  readonly iconToken: string;
  readonly localizations: EntityLocalizations;
}

export const wizardSummaryHighlights: ReadonlyArray<WizardSummaryHighlight> = [
  { id: "lighting", iconToken: "{icon.object.guidance}", localizations: lightingLocalizations },
  { id: "hidden-gems", iconToken: "{icon.safety.hide}", localizations: hiddenGemsLocalizations },
  { id: "loop", iconToken: "{icon.object.route}", localizations: loopRouteLocalizations },
  { id: "easy", iconToken: "{icon.customizer.gauge}", localizations: easyDifficultyLocalizations },
] as const;

export interface WizardWeatherSummary {
  readonly localizations: EntityLocalizations;
  readonly windLocalizations: EntityLocalizations;
  readonly skyLocalizations: EntityLocalizations;
  readonly sentimentLocalizations: EntityLocalizations;
  readonly temperatureCelsius: number;
}

export const wizardWeatherSummary: WizardWeatherSummary = {
  temperatureCelsius: 22,
  localizations: weatherTitleLocalizations,
  windLocalizations: weatherWindLocalizations,
  skyLocalizations: weatherSkyLocalizations,
  sentimentLocalizations: weatherSentimentLocalizations,
} as const;

export interface WizardGeneratedStop {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly noteLocalizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly noteDistanceMetres?: number;
}

export const wizardGeneratedStops: ReadonlyArray<WizardGeneratedStop> = [
  {
    id: "café",
    iconToken: "{icon.customizer.warmBeverage}",
    accentClass: "text-amber-400",
    localizations: cafeStopLocalizations,
    noteLocalizations: cafeStopNoteLocalizations,
  },
  {
    id: "art",
    iconToken: "{icon.customizer.decoration}",
    accentClass: "text-purple-400",
    noteDistanceMetres: metresFromMiles(1.1),
    localizations: artStopLocalizations,
    noteLocalizations: artStopNoteLocalizations,
  },
  {
    id: "garden",
    iconToken: "{icon.category.trails}",
    accentClass: "text-emerald-400",
    noteDistanceMetres: metresFromMiles(1.8),
    localizations: gardenStopLocalizations,
    noteLocalizations: gardenStopNoteLocalizations,
  },
] as const;

export interface WizardRouteStat {
  readonly id: string;
  readonly iconToken: string;
  readonly quantity:
    | { kind: "distance"; metres: number }
    | { kind: "duration"; seconds: number }
    | { kind: "count"; value: number };
}

export interface WizardRouteDetail {
  readonly id: string;
  readonly iconToken: string;
  readonly localizations: EntityLocalizations;
}

export interface WizardRouteSummary {
  readonly localizations: EntityLocalizations;
  readonly badgeLocalizations: EntityLocalizations;
  readonly stats: ReadonlyArray<WizardRouteStat>;
  readonly details: ReadonlyArray<WizardRouteDetail>;
}

export const wizardRouteSummary: WizardRouteSummary = {
  localizations: routeTitleLocalizations,
  badgeLocalizations: routeBadgeLocalizations,
  stats: [
    {
      id: "distance",
      iconToken: "{icon.object.distance}",
      quantity: { kind: "distance", metres: 3_700 },
    },
    {
      id: "duration",
      iconToken: "{icon.object.duration}",
      quantity: { kind: "duration", seconds: 2_700 },
    },
    { id: "stops", iconToken: "{icon.object.stops}", quantity: { kind: "count", value: 7 } },
  ],
  details: [
    {
      id: "terrain",
      iconToken: "{icon.accessibility.elevation}",
      localizations: terrainDetailLocalizations,
    },
    {
      id: "route-type",
      iconToken: "{icon.object.routeType}",
      localizations: routeTypeDetailLocalizations,
    },
    {
      id: "surfaces",
      iconToken: "{icon.object.surfaces}",
      localizations: surfacesDetailLocalizations,
    },
  ],
} as const;
