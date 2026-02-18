/** @file Route summary with title, description, and highlight tags. */

import { type JSX, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { TagId } from "../../../../data/registries/tags";
import { getTagDescriptor } from "../../../../data/registries/tags";

export type RouteSummarySectionProps = {
  readonly routeName: string;
  readonly routeDescription: string | undefined;
  readonly highlightTagIds: readonly TagId[];
  readonly language: string;
};

export function RouteSummarySection({
  routeName,
  routeDescription,
  highlightTagIds,
  language,
}: RouteSummarySectionProps): JSX.Element {
  const { t } = useTranslation();
  const suggestedRouteCaption = t("route-summary-suggested-caption", {
    defaultValue: "Suggested route",
  });

  const tagLabels = useMemo(
    () =>
      highlightTagIds.map((tagId) => {
        const tag = getTagDescriptor(tagId, language);
        return { tagId, label: tag?.localization.name ?? tagId };
      }),
    [highlightTagIds, language],
  );

  return (
    <div className="map-route__summary">
      <p className="text-sm font-medium text-base-content/60">{suggestedRouteCaption}</p>
      <h1 className="font-display mt-1 text-2xl font-extrabold text-base-content">{routeName}</h1>
      {routeDescription ? (
        <p className="mt-3 text-sm text-base-content/70">{routeDescription}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {tagLabels.map(({ tagId, label }) => (
          <span key={tagId} className="route-highlight">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
