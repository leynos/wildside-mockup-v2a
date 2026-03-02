/** @file Bold yellow showcase panel for saved route stats, attributes, and actions. */

import type { TFunction } from "i18next";
import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import type { WalkRouteSummary } from "../../../data/map";
import type { SavedRouteData } from "./use-saved-route-data";

export type RouteShowcasePanelProps = {
  readonly routeCopy: SavedRouteData["routeCopy"];
  readonly distance: SavedRouteData["distance"];
  readonly duration: SavedRouteData["duration"];
  readonly stops: SavedRouteData["stops"];
  readonly savedRoute: WalkRouteSummary;
  readonly difficultyLabel: string;
  readonly ratingFormatter: Intl.NumberFormat;
  readonly numberFormatter: Intl.NumberFormat;
  readonly isFavourite: boolean;
  readonly onToggleFavourite: () => void;
  readonly onViewDetails: () => void;
  readonly onCustomize: () => void;
  readonly onOffline: () => void;
  readonly onStartRoute: () => void;
  readonly t: TFunction;
};

/**
 * Renders a bold yellow panel showcasing route stats, attributes,
 * action buttons, and a start-route CTA.
 */
export function RouteShowcasePanel({
  routeCopy,
  distance,
  duration,
  stops,
  savedRoute,
  difficultyLabel,
  ratingFormatter,
  numberFormatter,
  isFavourite,
  onToggleFavourite,
  onViewDetails,
  onCustomize,
  onOffline,
  onStartRoute,
  t,
}: RouteShowcasePanelProps): JSX.Element {
  return (
    <section className="route-showcase" aria-label={routeCopy.name}>
      <div className="route-showcase__surface">
        <ShowcaseHeader
          routeName={routeCopy.name}
          distanceValue={distance.value}
          distanceUnit={distance.unitLabel}
          durationValue={duration.value}
          durationUnit={duration.unitLabel}
        />
        <ShowcaseStats
          rating={ratingFormatter.format(savedRoute.rating)}
          saves={numberFormatter.format(savedRoute.saves)}
          stopsValue={stops.value}
          t={t}
        />
        <ShowcaseAttributes
          difficultyLabel={difficultyLabel}
          highlightCount={savedRoute.highlightTagIds.length}
          stopsCount={savedRoute.stopsCount}
          t={t}
        />
        <ShowcaseActions
          isFavourite={isFavourite}
          onToggleFavourite={onToggleFavourite}
          onViewDetails={onViewDetails}
          onCustomize={onCustomize}
          onOffline={onOffline}
          t={t}
        />
        <button type="button" className="route-showcase__cta" onClick={onStartRoute}>
          <Icon token="{icon.object.locationArrow}" aria-hidden className="mr-2 inline h-5 w-5" />
          {t("saved-route-start", { defaultValue: "START ROUTE" })}
        </button>
      </div>
    </section>
  );
}

/* --- Header (title + distance + duration) --- */

type ShowcaseHeaderProps = {
  readonly routeName: string;
  readonly distanceValue: string;
  readonly distanceUnit: string;
  readonly durationValue: string;
  readonly durationUnit: string;
};

function ShowcaseHeader({
  routeName,
  distanceValue,
  distanceUnit,
  durationValue,
  durationUnit,
}: ShowcaseHeaderProps): JSX.Element {
  return (
    <div className="route-showcase__header">
      <h1 className="route-showcase__title">{routeName}</h1>
      <div>
        <p className="route-showcase__distance">
          {distanceValue}
          <span className="route-showcase__distance-unit">{distanceUnit}</span>
        </p>
        <p className="route-showcase__duration">
          ~{durationValue} {durationUnit}
        </p>
      </div>
    </div>
  );
}

/* --- Stats grid (rating · saves · stops) --- */

type ShowcaseStatsProps = {
  readonly rating: string;
  readonly saves: string;
  readonly stopsValue: string;
  readonly t: TFunction;
};

function ShowcaseStats({ rating, saves, stopsValue, t }: ShowcaseStatsProps): JSX.Element {
  return (
    <div className="route-showcase__stats">
      <StatCell
        iconToken="{icon.object.star}"
        value={rating}
        label={t("saved-route-metric-rating", { defaultValue: "Rating" })}
      />
      <StatCell
        iconToken="{icon.action.save}"
        value={saves}
        label={t("saved-route-metric-saves", { defaultValue: "Saves" })}
      />
      <StatCell
        iconToken="{icon.object.stops}"
        value={stopsValue}
        label={t("saved-route-metric-stops", { defaultValue: "Stops" })}
      />
    </div>
  );
}

type StatCellProps = {
  readonly iconToken: string;
  readonly value: string;
  readonly label: string;
};

function StatCell({ iconToken, value, label }: StatCellProps): JSX.Element {
  return (
    <div className="text-center">
      <Icon token={iconToken} aria-hidden className="route-showcase__icon" />
      <p className="route-showcase__stat-value">{value}</p>
      <p className="route-showcase__stat-label">{label}</p>
    </div>
  );
}

/* --- Route attributes (difficulty · highlights · waypoints) --- */

type ShowcaseAttributesProps = {
  readonly difficultyLabel: string;
  readonly highlightCount: number;
  readonly stopsCount: number;
  readonly t: TFunction;
};

function ShowcaseAttributes({
  difficultyLabel,
  highlightCount,
  stopsCount,
  t,
}: ShowcaseAttributesProps): JSX.Element {
  return (
    <div className="route-showcase__attributes">
      <div className="route-showcase__attribute">
        <span className="flex items-center gap-1">
          <Icon token="{icon.object.energy}" aria-hidden className="h-4 w-4" />
          {t("saved-route-attr-difficulty", { defaultValue: "Difficulty" })}
        </span>
        <span className="font-semibold">{difficultyLabel}</span>
      </div>
      <div className="route-showcase__attribute">
        <span className="flex items-center gap-1">
          <Icon token="{icon.category.nature}" aria-hidden className="h-4 w-4" />
          {t("saved-route-attr-highlights", { defaultValue: "Highlights" })}
        </span>
        <span className="font-semibold">
          {t("saved-route-tags-count", {
            count: highlightCount,
            defaultValue: `${highlightCount} tags`,
          })}
        </span>
      </div>
      <div className="route-showcase__attribute">
        <span className="flex items-center gap-1">
          <Icon token="{icon.object.stops}" aria-hidden className="h-4 w-4" />
          {t("saved-route-attr-waypoints", { defaultValue: "Waypoints" })}
        </span>
        <span className="font-semibold">
          {t("saved-route-stops-count", {
            count: stopsCount,
            defaultValue: `${stopsCount} stops`,
          })}
        </span>
      </div>
    </div>
  );
}

/* --- Action button grid + save/offline --- */

type ShowcaseActionsProps = {
  readonly isFavourite: boolean;
  readonly onToggleFavourite: () => void;
  readonly onViewDetails: () => void;
  readonly onCustomize: () => void;
  readonly onOffline: () => void;
  readonly t: TFunction;
};

function ShowcaseActions({
  isFavourite,
  onToggleFavourite,
  onViewDetails,
  onCustomize,
  onOffline,
  t,
}: ShowcaseActionsProps): JSX.Element {
  return (
    <div className="route-showcase__action-grid">
      <button type="button" className="route-showcase__action-button" onClick={onViewDetails}>
        <Icon token="{icon.action.preview}" aria-hidden className="route-showcase__icon" />
        {t("saved-route-action-details", { defaultValue: "VIEW DETAILS" })}
      </button>
      <button type="button" className="route-showcase__action-button" onClick={onCustomize}>
        <Icon token="{icon.action.settings}" aria-hidden className="route-showcase__icon" />
        {t("saved-route-action-customize", { defaultValue: "CUSTOMIZE" })}
      </button>
      <button
        type="button"
        className="route-showcase__action-button"
        aria-pressed={isFavourite}
        onClick={onToggleFavourite}
      >
        <Icon
          token={isFavourite ? "{icon.action.save}" : "{icon.action.unsave}"}
          aria-hidden
          className="route-showcase__icon"
        />
        {t("saved-route-action-save", { defaultValue: "SAVE ROUTE" })}
      </button>
      <button type="button" className="route-showcase__action-button" onClick={onOffline}>
        <Icon token="{icon.action.download}" aria-hidden className="route-showcase__icon" />
        {t("saved-route-action-offline", { defaultValue: "OFFLINE" })}
      </button>
    </div>
  );
}
