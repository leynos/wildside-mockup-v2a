/** @file Tag descriptor registry with embedded localizations. */

import type {
  EntityLocalizations,
  LocaleCode,
  LocalizedStringSet,
} from "../../domain/entities/localization";
import { defaultFallbackLocales, pickLocalization } from "../../domain/entities/localization";

export interface TagDescriptor {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly iconToken?: string;
  readonly accentClass?: string;
}

export type TagId = TagDescriptor["id"];

export type ResolvedTagDescriptor = TagDescriptor & { readonly localization: LocalizedStringSet };

export const tagDescriptors: ReadonlyArray<TagDescriptor> = [
  {
    id: "coffee",
    iconToken: "{icon.category.food}",
    accentClass: "text-amber-400",
    localizations: {
      "en-GB": { name: "Coffee" },
      es: { name: "Café" },
    },
  },
  {
    id: "local",
    iconToken: "{icon.category.shops}",
    accentClass: "text-orange-400",
    localizations: {
      "en-GB": { name: "Local favourite" },
      es: { name: "Favorito local" },
    },
  },
  {
    id: "views",
    iconToken: "{icon.category.landmarks}",
    accentClass: "text-cyan-300",
    localizations: {
      "en-GB": { name: "Views" },
      es: { name: "Vistas" },
    },
  },
  {
    id: "photos",
    iconToken: "{icon.category.photography}",
    accentClass: "text-sky-400",
    localizations: {
      "en-GB": { name: "Photos" },
      es: { name: "Fotos" },
    },
  },
  {
    id: "free",
    iconToken: "{icon.object.ticket}",
    accentClass: "text-emerald-400",
    localizations: {
      "en-GB": { name: "Free" },
      es: { name: "Gratis" },
    },
  },
  {
    id: "nature",
    iconToken: "{icon.category.nature}",
    accentClass: "text-emerald-400",
    localizations: {
      "en-GB": { name: "Nature" },
      es: { name: "Naturaleza" },
    },
  },
  {
    id: "rest-stop",
    iconToken: "{icon.object.rest}",
    accentClass: "text-emerald-300",
    localizations: {
      "en-GB": { name: "Rest stop" },
      es: { name: "Parada de descanso" },
    },
  },
  {
    id: "market",
    iconToken: "{icon.category.shops}",
    accentClass: "text-orange-400",
    localizations: {
      "en-GB": { name: "Market" },
      es: { name: "Mercado" },
    },
  },
  {
    id: "architecture",
    iconToken: "{icon.category.landmarks}",
    accentClass: "text-indigo-300",
    localizations: {
      "en-GB": { name: "Architecture" },
      es: { name: "Arquitectura" },
    },
  },
  {
    id: "landmark",
    iconToken: "{icon.category.landmarks}",
    accentClass: "text-cyan-300",
    localizations: {
      "en-GB": { name: "Landmark" },
      es: { name: "Monumento" },
    },
  },
  {
    id: "instagram",
    iconToken: "{icon.brand.instagram}",
    accentClass: "text-pink-400",
    localizations: {
      "en-GB": { name: "Instagrammable" },
      es: { name: "Instagrameable" },
    },
  },
];

export const getTagDescriptor = (
  id: string,
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackLocales,
): ResolvedTagDescriptor | undefined => {
  const descriptor = tagDescriptors.find((entry) => entry.id === id);
  if (!descriptor) return undefined;
  return {
    ...descriptor,
    localization: pickLocalization(descriptor.localizations, locale, fallbackLocales),
  };
};
