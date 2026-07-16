/** @file Hook providing memoized route metrics (distance, duration, stops). */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkRouteSummary } from "../../../../data/map";
import { formatDistance, formatDuration, formatStops } from "../../../../units/unit-format";
import { useUnitPreferences } from "../../../../units/unit-preferences-provider";

export type RouteMetrics = {
  readonly distance: ReturnType<typeof formatDistance>;
  readonly duration: ReturnType<typeof formatDuration>;
  readonly stops: ReturnType<typeof formatStops>;
};

/**
 * Provides memoized, formatted route metrics for distance, duration, and stops.
 *
 * @param route - The walk route summary containing raw metric values.
 * @returns Formatted metrics with localized values and unit labels.
 *
 * @example
 * ```tsx
 * const RouteStats = ({ route }: { route: WalkRouteSummary }) => {
 *   const { distance, duration, stops } = useRouteMetrics(route);
 *
 *   return (
 *     <p>
 *       {distance.value} {distance.unitLabel} ·{" "}
 *       {duration.value} {duration.unitLabel} ·{" "}
 *       {stops.value} {stops.unitLabel}
 *     </p>
 *   );
 * };
 * ```
 */
export const useRouteMetrics = (route: WalkRouteSummary): RouteMetrics => {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();

  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

  const distance = useMemo(
    () => formatDistance(route.distanceMetres, unitOptions),
    [route.distanceMetres, unitOptions],
  );

  const duration = useMemo(
    () =>
      formatDuration(route.durationSeconds, {
        ...unitOptions,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [route.durationSeconds, unitOptions],
  );

  const stops = useMemo(
    () =>
      formatStops(route.stopsCount, {
        ...unitOptions,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [route.stopsCount, unitOptions],
  );

  return useMemo(() => ({ distance, duration, stops }), [distance, duration, stops]);
};
