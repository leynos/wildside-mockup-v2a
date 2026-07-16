/** @file Small helper to format past/future instants as relative time labels. */

import { SECONDS_PER_MINUTE } from "../units/unit-system";

type SupportedUnit = "day" | "hour" | "minute" | "second";

const MILLISECONDS_PER_SECOND = 1000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const UNIT_THRESHOLDS: Array<{ unit: SupportedUnit; seconds: number }> = [
  { unit: "day", seconds: HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE },
  { unit: "hour", seconds: MINUTES_PER_HOUR * SECONDS_PER_MINUTE },
  { unit: "minute", seconds: SECONDS_PER_MINUTE },
  { unit: "second", seconds: 1 },
];

const normalizeInstant = (input: Date | number | string): number => {
  if (input instanceof Date) {
    return input.getTime();
  }
  if (typeof input === "number") {
    return input;
  }
  return new Date(input).getTime();
};

/**
 * Format a timestamp relative to `now`, favouring the largest meaningful unit.
 *
 * Returns an empty string when `input` cannot be parsed as a finite timestamp.
 *
 * @example
 * import { getNow } from "./time";
 * formatRelativeTime(getNow() - 36_000_000, "en-GB", getNow()); // "10 hours ago"
 */
export const formatRelativeTime = (
  input: Date | number | string,
  locale: string,
  now: number,
): string => {
  const targetMs = normalizeInstant(input);
  if (!Number.isFinite(targetMs)) return "";

  const deltaSeconds = Math.round((targetMs - now) / MILLISECONDS_PER_SECOND);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const magnitude = Math.abs(deltaSeconds);
  for (const { unit, seconds } of UNIT_THRESHOLDS) {
    if (magnitude >= seconds || unit === "second") {
      const value = Math.round(deltaSeconds / seconds);
      return formatter.format(value, unit);
    }
  }

  // Satisfy TypeScript's control flow analysis. The loop always returns at the
  // "second" threshold, making this path unreachable at runtime.
  throw new Error("Unreachable: UNIT_THRESHOLDS must include 'second'");
};
