/** @file Hook to prepare formatted and localized data for a saved route. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkRouteSummary } from "../../../data/map";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatRelativeTime } from "../../../lib/relative-time";
import { getNow } from "../../../lib/time";
import { type RouteFormatters, useRouteFormatters } from "./hooks/use-route-formatters";
import { type RouteMetrics, useRouteMetrics } from "./hooks/use-route-metrics";

export type SavedRouteData = RouteFormatters &
  RouteMetrics & {
    readonly routeCopy: ReturnType<typeof pickLocalization>;
    readonly difficultyLabel: string;
    readonly updatedLabel: string;
  };

/**
 * Prepare formatted and localized data for presenting a saved route.
 *
 * @param route - The walk route summary to format.
 * @returns Localized route copy, formatted metrics, and route-related labels.
 *
 * @example
 * ```tsx
 * const SavedRouteCard = ({ route }: { route: WalkRouteSummary }) => {
 *   const {
 *     routeCopy,
 *     distance,
 *     duration,
 *     difficultyLabel,
 *     updatedLabel,
 *   } = useSavedRouteData(route);
 *
 *   return (
 *     <article>
 *       <h2>{routeCopy.name}</h2>
 *       <p>{routeCopy.description}</p>
 *       <p>
 *         {distance.value} {distance.unitLabel} ·{" "}
 *         {duration.value} {duration.unitLabel}
 *       </p>
 *       <p>
 *         {difficultyLabel} · {updatedLabel}
 *       </p>
 *     </article>
 *   );
 * };
 * ```
 */
export const useSavedRouteData = (route: WalkRouteSummary): SavedRouteData => {
  const { i18n } = useTranslation();
  const formatters = useRouteFormatters();
  const metrics = useRouteMetrics(route);

  const routeCopy = useMemo(
    () => pickLocalization(route.localizations, i18n.language),
    [route.localizations, i18n.language],
  );

  const difficultyLabel = useMemo(
    () => formatters.difficultyLookup.get(route.difficultyId)?.label ?? route.difficultyId,
    [route.difficultyId, formatters.difficultyLookup],
  );

  const updatedLabel = useMemo(
    () => formatRelativeTime(route.lastUpdatedAt, i18n.language, getNow()),
    [route.lastUpdatedAt, i18n.language],
  );

  return useMemo(
    () => ({
      ...formatters,
      ...metrics,
      routeCopy,
      difficultyLabel,
      updatedLabel,
    }),
    [formatters, metrics, routeCopy, difficultyLabel, updatedLabel],
  );
};
