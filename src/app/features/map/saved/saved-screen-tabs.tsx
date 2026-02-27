/** @file Tabbed content components for the saved route screen. */

import * as Dialog from "@radix-ui/react-dialog";
import type { TabsContentProps } from "@radix-ui/react-tabs";
import * as Tabs from "@radix-ui/react-tabs";
import type { TFunction } from "i18next";
import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import { DRAGGABLE_HANDLE_CLASS } from "../../../components/map/map-panel-constants";
import { getRouteShareUrl } from "../../../config/route-urls";
import type { WalkRouteSummary } from "../../../data/map";
import { getTagDescriptor } from "../../../data/registries/tags";
import { pickLocalization } from "../../../domain/entities/localization";
import { RouteFlowList } from "./route-flow-list";
import type { RouteShowcasePanelProps } from "./saved-route-showcase";
import { RouteShowcasePanel } from "./saved-route-showcase";
import type { SavedRouteData } from "./use-saved-route-data";

/**
 * Props for the MapOverlay component (extends Radix Tabs.Content).
 */
type MapOverlayProps = TabsContentProps;

/**
 * Wrapper for Radix Tabs.Content with map-overlay styling.
 */
export function MapOverlay({ className, ...props }: MapOverlayProps): JSX.Element {
  const composedClassName = className ? `map-overlay ${className}` : "map-overlay";
  return <Tabs.Content {...props} className={composedClassName} />;
}

/**
 * Displays a single metric value with a label beneath it.
 *
 * @param label - The descriptive label for the metric.
 * @param value - The formatted metric value to display.
 */
export function Metric({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="text-center">
      <p className="font-display text-lg font-bold text-base-content">{value}</p>
      <p className="text-xs text-base-content/60">{label}</p>
    </div>
  );
}

/**
 * Props for the MapTabContent component.
 */
type MapTabContentProps = {
  readonly savedRoute: WalkRouteSummary;
  readonly routeCopy: SavedRouteData["routeCopy"];
  readonly distance: SavedRouteData["distance"];
  readonly duration: SavedRouteData["duration"];
  readonly stops: SavedRouteData["stops"];
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
  readonly onBack: () => void;
  readonly shareOpen: boolean;
  readonly onShareOpenChange: (next: boolean) => void;
};

/**
 * Renders the map tab overlay with back/share actions and the route
 * showcase panel. The map canvas itself lives in the parent viewport.
 */
export function MapTabContent({
  savedRoute,
  routeCopy,
  distance,
  duration,
  stops,
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
  onBack,
  shareOpen,
  onShareOpenChange,
}: MapTabContentProps): JSX.Element {
  const showcaseProps: RouteShowcasePanelProps = {
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
  };

  return (
    <MapOverlay value="map" forceMount>
      <div className="flex flex-col justify-between px-6 pb-6 pt-8">
        <div className="flex items-center justify-between text-base-100">
          <button
            type="button"
            aria-label={t("action-back", { defaultValue: "Back" })}
            className="circle-action-button"
            onClick={onBack}
          >
            <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
          </button>
          <Dialog.Root open={shareOpen} onOpenChange={onShareOpenChange}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={t("action-share", { defaultValue: "Share" })}
                className="circle-action-button"
              >
                <Icon token="{icon.action.share}" aria-hidden className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
              <Dialog.Content className="dialog-surface">
                <Dialog.Title className="text-lg font-semibold text-base-content">
                  {t("map-saved-share-title", { defaultValue: "Share saved walk" })}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-base-content/70">
                  {t("map-saved-share-description", {
                    defaultValue:
                      "Sharing is not wired up yet, but this is where the integration will live.",
                  })}
                </Dialog.Description>
                <div className="route-share__preview">{getRouteShareUrl(savedRoute.id)}</div>
                <Dialog.Close asChild>
                  <button type="button" className="btn btn-accent btn-sm self-end">
                    {t("action-close", { defaultValue: "Close" })}
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <RouteShowcasePanel {...showcaseProps} />
    </MapOverlay>
  );
}

/**
 * Props for the StopsTabContent component.
 */
type StopsTabContentProps = {
  readonly savedRoute: WalkRouteSummary;
  readonly onClose: () => void;
  readonly t: TFunction;
};

/**
 * Renders the stops tab content displaying points of interest for the route.
 *
 * Shows a dismissible panel with a list of route POIs.
 */
export function StopsTabContent({ savedRoute, onClose, t }: StopsTabContentProps): JSX.Element {
  return (
    <MapOverlay value="stops" forceMount>
      <div className="pointer-events-none px-6 pb-6">
        <div className="map-panel map-panel--stacked max-h-[60vh]">
          <div className="map-panel__handle">
            <button
              type="button"
              className={DRAGGABLE_HANDLE_CLASS}
              aria-label={t("action-dismiss-panel", { defaultValue: "Dismiss panel" })}
              onClick={onClose}
            />
          </div>
          <div className="map-panel__body">
            <RouteFlowList points={savedRoute.pointsOfInterest} />
          </div>
          <div className="map-overlay__fade map-overlay__fade--top" aria-hidden="true" />
          <div className="map-overlay__fade map-overlay__fade--bottom" aria-hidden="true" />
        </div>
      </div>
    </MapOverlay>
  );
}

/**
 * Props for the NotesTabContent component.
 */
export type NotesTabContentProps = {
  readonly savedRoute: WalkRouteSummary;
  readonly routeCopy: SavedRouteData["routeCopy"];
  readonly difficultyLabel: SavedRouteData["difficultyLabel"];
  readonly updatedLabel: SavedRouteData["updatedLabel"];
  readonly numberFormatter: SavedRouteData["numberFormatter"];
  readonly ratingFormatter: SavedRouteData["ratingFormatter"];
  readonly i18nLanguage: string;
  readonly t: TFunction;
};

/**
 * Renders the notes tab content displaying route metrics, highlights,
 * description, and notes.
 */
export function NotesTabContent({
  savedRoute,
  routeCopy,
  difficultyLabel,
  updatedLabel,
  numberFormatter,
  ratingFormatter,
  i18nLanguage,
  t,
}: NotesTabContentProps): JSX.Element {
  return (
    <MapOverlay value="notes" forceMount>
      <div className="pointer-events-none px-6 pb-6">
        <div className="map-panel map-panel--scroll map-panel__notes map-panel__notes--spacious">
          <div className="grid grid-cols-4 gap-4 text-base-content">
            <Metric
              label={t("saved-route-metric-rating", { defaultValue: "Rating" })}
              value={ratingFormatter.format(savedRoute.rating)}
            />
            <Metric
              label={t("saved-route-metric-saves", { defaultValue: "Saves" })}
              value={numberFormatter.format(savedRoute.saves)}
            />
            <Metric
              label={t("saved-route-metric-difficulty", { defaultValue: "Difficulty" })}
              value={difficultyLabel}
            />
            <Metric
              label={t("saved-route-metric-updated", { defaultValue: "Updated" })}
              value={updatedLabel}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {savedRoute.highlightTagIds.map((tagId) => {
              const tag = getTagDescriptor(tagId, i18nLanguage);
              const label = tag?.localization.name ?? tagId;
              return (
                <span key={tagId} className="route-highlight">
                  {label}
                </span>
              );
            })}
          </div>
          <p className="text-base-content/80">{routeCopy.description}</p>
          <ul
            className="route-note-list"
            aria-label={t("saved-route-notes-label", { defaultValue: "Route notes" })}
          >
            {savedRoute.notes.map((note) => {
              const noteCopy = pickLocalization(note.localizations, i18nLanguage);
              return <li key={note.id}>{noteCopy.name}</li>;
            })}
          </ul>
        </div>
      </div>
    </MapOverlay>
  );
}
