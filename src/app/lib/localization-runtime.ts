/** @file Runtime localization helpers shared across feature screens. */

import type {
  EntityLocalizations,
  LocaleCode,
  LocalizedStringSet,
} from "../domain/entities/localization";
import { defaultFallbackLocales, pickLocalization } from "../domain/entities/localization";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../i18n/supported-locales";

type ResolutionOptions = {
  readonly fallbackLocales?: readonly LocaleCode[];
};

/**
 * Provide a safe localization fallback when resolution fails or data is sparse.
 *
 * @example
 * const fallback = fallbackLocalization(entity.localizations, entity.id);
 */
export const fallbackLocalization = (
  localizations: EntityLocalizations | null | undefined,
  fallbackName: string,
): LocalizedStringSet => {
  const values = localizations ? Object.values(localizations).filter(Boolean) : [];
  return values[0] ?? { name: fallbackName };
};

/**
 * Resolve an entity localization with predictable fallbacks and safe logging.
 *
 * @example
 * const title = resolveLocalization(route.localizations, "fr", route.id).name;
 */
export const resolveLocalization = (
  localizations: EntityLocalizations,
  locale: LocaleCode,
  fallbackName: string,
  { fallbackLocales = defaultFallbackLocales }: ResolutionOptions = {},
): LocalizedStringSet => {
  const fallback = fallbackLocalization(localizations, fallbackName);
  try {
    return pickLocalization(localizations, locale, fallbackLocales);
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("Falling back to default localization", { locale, fallbackName, error });
    }
    return fallback;
  }
};

/**
 * Normalize an incoming language tag to a supported LocaleCode.
 *
 * @example
 * const locale = coerceLocaleCode(i18n.language); // e.g. "en-GB" for "en"
 */
export const coerceLocaleCode = (
  language: string | undefined,
  fallback: LocaleCode = DEFAULT_LOCALE as LocaleCode,
): LocaleCode => {
  if (!language) return fallback;
  const normalized = language.trim().toLowerCase();
  const direct = SUPPORTED_LOCALES.find((locale) => locale.code.toLowerCase() === normalized);
  if (direct) return direct.code as LocaleCode;

  const [languagePart] = normalized.split("-");
  const languageMatch = SUPPORTED_LOCALES.find(
    (locale) => locale.code.split("-")[0]?.toLowerCase() === languagePart,
  );
  if (languageMatch) return languageMatch.code as LocaleCode;

  const fallbackLocale =
    SUPPORTED_LOCALES.find((locale) => locale.code === fallback) ?? SUPPORTED_LOCALES[0];
  return fallbackLocale.code as LocaleCode;
};
