/** @file Hook providing memoized formatters and lookups for route display. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { buildDifficultyLookup } from "../../../../data/registries/difficulties";

export type RouteFormatters = {
  readonly numberFormatter: Intl.NumberFormat;
  readonly ratingFormatter: Intl.NumberFormat;
  readonly difficultyLookup: ReturnType<typeof buildDifficultyLookup>;
};

/**
 * Provides memoized number formatters and difficulty lookup for route display.
 *
 * @returns Formatters for numbers, ratings, and a difficulty label lookup map.
 *
 * @example
 * ```tsx
 * const RouteRating = ({ rating, difficultyId }: Props) => {
 *   const { ratingFormatter, difficultyLookup } = useRouteFormatters();
 *   const difficulty = difficultyLookup.get(difficultyId);
 *
 *   return (
 *     <p>
 *       {ratingFormatter.format(rating)} · {difficulty?.label}
 *     </p>
 *   );
 * };
 * ```
 */
export const useRouteFormatters = (): RouteFormatters => {
  const { t, i18n } = useTranslation();

  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const ratingFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [i18n.language],
  );
  const difficultyLookup = useMemo(() => buildDifficultyLookup(t), [t]);

  return useMemo(
    () => ({ numberFormatter, ratingFormatter, difficultyLookup }),
    [numberFormatter, ratingFormatter, difficultyLookup],
  );
};
