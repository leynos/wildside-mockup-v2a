/** @file Shared unit system primitives and conversions anchored in SI base units. */

export type UnitSystem = "metric" | "imperial";

export const METRES_PER_KILOMETRE = 1_000;
export const METRES_PER_MILE = 1_609.344;
export const SECONDS_PER_MINUTE = 60;
export const KILOJOULES_PER_KILOCALORIE = 4.184;

const IMPERIAL_LOCALE_PREFIXES = ["en-us"] as const;

export const detectUnitSystem = (localeCode?: string): UnitSystem => {
  if (!localeCode) {
    return "metric";
  }

  const normalized = localeCode.toLowerCase();
  return IMPERIAL_LOCALE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
    ? "imperial"
    : "metric";
};

export const metresToKilometres = (metres: number): number => metres / METRES_PER_KILOMETRE;

export const metresToMiles = (metres: number): number => metres / METRES_PER_MILE;

export const secondsToMinutes = (seconds: number): number => seconds / SECONDS_PER_MINUTE;

export const celsiusToFahrenheit = (celsius: number): number => celsius * (9 / 5) + 32;
