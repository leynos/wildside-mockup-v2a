/** @file Localized interest descriptors resolved without Fluent. */

import type {
  EntityLocalizations,
  LocaleCode,
  LocalizedStringSet,
} from "../../domain/entities/localization";
import { defaultFallbackLocales, pickLocalization } from "../../domain/entities/localization";

type InterestVisualMetadata = {
  readonly iconToken: string;
  readonly iconBackgroundClass: string;
  readonly iconColorClass: string;
};

export interface InterestDescriptor extends InterestVisualMetadata {
  readonly id: string;
  readonly localizations: EntityLocalizations;
}

export interface ResolvedInterestDescriptor extends InterestDescriptor {
  readonly localization: LocalizedStringSet;
}

export const interestDescriptors: ReadonlyArray<InterestDescriptor> = [
  {
    id: "parks",
    iconToken: "{icon.category.trails}",
    iconBackgroundClass: "bg-green-500/20",
    iconColorClass: "text-green-400",
    localizations: {
      "en-GB": { name: "Parks & Nature" },
      es: { name: "Parques y naturaleza" },
    },
  },
  {
    id: "coffee",
    iconToken: "{icon.category.food}",
    iconBackgroundClass: "bg-amber-500/20",
    iconColorClass: "text-amber-400",
    localizations: {
      "en-GB": { name: "Coffee Spots" },
      es: { name: "Cafés" },
    },
  },
  {
    id: "street-art",
    iconToken: "{icon.category.art}",
    iconBackgroundClass: "bg-accent/20",
    iconColorClass: "text-accent",
    localizations: {
      "en-GB": { name: "Street Art" },
      es: { name: "Arte urbano" },
    },
  },
  {
    id: "historic",
    iconToken: "{icon.category.landmarks}",
    iconBackgroundClass: "bg-purple-500/20",
    iconColorClass: "text-purple-400",
    localizations: {
      "en-GB": { name: "Historic Sites" },
      es: { name: "Sitios históricos" },
    },
  },
  {
    id: "waterfront",
    iconToken: "{icon.category.water}",
    iconBackgroundClass: "bg-accent/20",
    iconColorClass: "text-accent",
    localizations: {
      "en-GB": { name: "Waterfront" },
      es: { name: "Frente marítimo" },
    },
  },
  {
    id: "food",
    iconToken: "{icon.category.food}",
    iconBackgroundClass: "bg-rose-500/20",
    iconColorClass: "text-rose-400",
    localizations: {
      "en-GB": { name: "Street Food" },
      es: { name: "Comida callejera" },
    },
  },
  {
    id: "markets",
    iconToken: "{icon.category.shops}",
    iconBackgroundClass: "bg-orange-500/20",
    iconColorClass: "text-orange-400",
    localizations: {
      "en-GB": { name: "Markets" },
      es: { name: "Mercados" },
    },
  },
] as const;

export type InterestId = (typeof interestDescriptors)[number]["id"];

export const buildInterestLookup = (
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackLocales,
): Map<InterestId, ResolvedInterestDescriptor> =>
  new Map(
    interestDescriptors.map((descriptor) => [
      descriptor.id,
      {
        ...descriptor,
        localization: pickLocalization(descriptor.localizations, locale, fallbackLocales),
      },
    ]),
  );

export const getInterestDescriptor = (
  id: InterestId,
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackLocales,
): ResolvedInterestDescriptor | undefined => {
  const descriptor = interestDescriptors.find((entry) => entry.id === id);
  if (!descriptor) return undefined;
  return {
    ...descriptor,
    localization: pickLocalization(descriptor.localizations, locale, fallbackLocales),
  };
};

export const resolveInterestDescriptors = (
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackLocales,
): ResolvedInterestDescriptor[] =>
  Array.from(buildInterestLookup(locale, fallbackLocales).values());
