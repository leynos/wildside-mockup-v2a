/** @file Shared localization primitives and helpers for entity-driven cards. */

export type LocaleCode =
  | "ar"
  | "cy"
  | "da"
  | "de"
  | "el"
  | "en-GB"
  | "en-US"
  | "es"
  | "fi"
  | "fr"
  | "gd"
  | "he"
  | "hi"
  | "it"
  | "ja"
  | "ko"
  | "nb"
  | "nl"
  | "pl"
  | "pt"
  | "ru"
  | "sv"
  | "ta"
  | "th"
  | "tr"
  | "vi"
  | "zh-CN"
  | "zh-TW";

export type LocalizedStringSet = {
  readonly name: string;
  readonly description?: string;
  readonly shortLabel?: string;
};

export type EntityLocalizations = Partial<Record<LocaleCode, LocalizedStringSet>>;

export type ImageAsset = {
  readonly url: string;
  readonly alt: string;
};

const defaultFallbackChain: readonly LocaleCode[] = ["en-GB", "en-US"];

const normalizeLocale = (input: string): string => input.trim().toLowerCase();

const buildCandidateLocales = (requested: string): string[] => {
  const trimmed = normalizeLocale(requested);
  const parts = trimmed.split("-");
  if (parts.length > 1) {
    return [parts.join("-"), parts[0] ?? trimmed];
  }
  return [trimmed];
};

const toNormalizedLocalizationMap = (
  localizations: EntityLocalizations,
): Record<string, LocalizedStringSet> => {
  const map: Record<string, LocalizedStringSet> = {};
  for (const [key, value] of Object.entries(localizations)) {
    if (value) {
      map[normalizeLocale(key)] = value;
    }
  }
  return map;
};

/**
 * Pick the best available localization, falling back predictably.
 *
 * @example
 * const localizations = {
 *   "en-GB": { name: "Harbour Loop" },
 *   fr: { name: "Boucle du port" },
 * };
 * const resolved = pickLocalization(localizations, "es-MX", ["en-US", "fr"]);
 * // resolved.name === "Boucle du port"
 *
 * @throws {Error} when no localization entries are present.
 */
export function pickLocalization(
  localizations: EntityLocalizations | undefined,
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackChain,
): LocalizedStringSet {
  if (!localizations || Object.keys(localizations).length === 0) {
    throw new Error("No localizations available for entity");
  }

  const normalizedMap = toNormalizedLocalizationMap(localizations);

  const candidateOrder = [
    ...buildCandidateLocales(locale),
    ...fallbackLocales.map(normalizeLocale),
    ...Object.keys(normalizedMap),
  ];

  for (const candidate of candidateOrder) {
    const localization = normalizedMap[candidate];
    if (localization) return localization;
  }

  throw new Error("Failed to resolve localization for entity");
}

export const defaultFallbackLocales = defaultFallbackChain;

/**
 * Safely pick a localization, falling back to an id-based name if unavailable.
 *
 * This is intended for "best effort" UI surfaces where missing localization
 * data should not crash rendering.
 *
 * @example
 * const localized = safePickLocalization(undefined, "es", "mural");
 * // localized.name === "mural"
 *
 * @example
 * const localizations = { "en-GB": { name: "Coffee stop", description: "…" } };
 * const localized = safePickLocalization(localizations, "en-GB", "coffee");
 * // localized.name === "Coffee stop"
 */
export function safePickLocalization(
  localizations: EntityLocalizations | undefined,
  locale: string,
  fallbackName: string,
): LocalizedStringSet {
  try {
    return pickLocalization(localizations, locale);
  } catch {
    return { name: fallbackName, description: "" };
  }
}
