/** @file Community pick panel for the Explore screen. */

import { type JSX, useId } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import type { CommunityPick } from "../../data/explore.models";
import { pickLocalization } from "../../domain/entities/localization";
import { appLogger } from "../../observability/logger";
import { RouteMetric } from "./explore-sections";

type CommunityPickPanelProps = {
  pick: CommunityPick;
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
  formatSaveCount: (count: number) => string;
};

type CommunityPickLocalisation = {
  readonly heading: string;
  readonly subtitle: string;
  readonly pickLocalization: { readonly name: string; readonly description?: string };
  readonly curatorLocalization: { readonly name: string; readonly description?: string };
};

const useCommunityPickLocalisation = (pick: CommunityPick): CommunityPickLocalisation => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const heading = t("explore-community-heading", { defaultValue: "Community Favourite" });
  const subtitle = t("explore-community-subtitle", { defaultValue: "Most shared this week" });

  const safePick = (
    localizations: CommunityPick["localizations"] | CommunityPick["curator"]["localizations"],
    fallbackName: string,
  ) => {
    try {
      return pickLocalization(localizations, locale);
    } catch (error) {
      if (import.meta.env.DEV) {
        appLogger.warn("Missing community pick localisation", { locale, fallbackName }, error);
      }
      return { name: fallbackName, description: "" };
    }
  };

  return {
    heading,
    subtitle,
    pickLocalization: safePick(pick.localizations, pick.id),
    curatorLocalization: safePick(pick.curator.localizations, "curator"),
  };
};

export function CommunityPickPanel({
  pick,
  formatDistanceLabel,
  formatDurationLabel,
  formatSaveCount,
}: CommunityPickPanelProps): JSX.Element {
  const { heading, subtitle, pickLocalization, curatorLocalization } =
    useCommunityPickLocalisation(pick);
  const headingId = useId();
  return (
    <section className="explore-info__panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading mb-4 text-base-content">
        <Icon token="{icon.object.family}" className="text-accent" aria-hidden />
        {heading}
      </h2>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-neutral">
          <img
            src={pick.curator.avatar.url}
            alt={pick.curator.avatar.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content">{curatorLocalization.name}</p>
          <p className="text-xs text-base-content/60">{subtitle}</p>
        </div>
        <span className="rating-indicator rating-indicator--strong">
          <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
          {pick.rating.toFixed(1)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-content">{pickLocalization.name}</h3>
      <p className="mt-2 text-sm text-base-content/70">{pickLocalization.description}</p>
      <div className="mt-3 explore-meta-list">
        <RouteMetric iconToken="{icon.object.route}">
          {formatDistanceLabel(pick.distanceMetres)}
        </RouteMetric>
        <RouteMetric iconToken="{icon.object.duration}">
          {formatDurationLabel(pick.durationSeconds)}
        </RouteMetric>
        <RouteMetric iconToken="{icon.action.save}">{formatSaveCount(pick.saves)}</RouteMetric>
      </div>
    </section>
  );
}

export type { CommunityPickPanelProps };
