/** @file Saved walk detail screen with MapLibre map and tabbed layout. */

import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { MapToolbar } from "../../../components/map/map-toolbar";
import { useMapToolbarLabels } from "../../../components/map/use-map-toolbar-labels";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { WildsideMap } from "../../../components/wildside-map";
import { savedRoutes } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";
import { MapTabContent, NotesTabContent, StopsTabContent } from "./saved-screen-tabs";
import { useSavedRouteData } from "./use-saved-route-data";

const savedRoute = savedRoutes[0];
const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

export function SavedScreen(): JSX.Element {
  if (!savedRoute) {
    return (
      <MobileShell tone="dark">
        <main className="map-shell__main">
          <div className="flex flex-1 items-center justify-center px-6 text-center text-base-content/70">
            <p>No saved routes are available yet.</p>
          </div>
        </main>
      </MobileShell>
    );
  }

  return <SavedScreenWithRoute savedRoute={savedRoute} />;
}

type SavedScreenWithRouteProps = {
  readonly savedRoute: NonNullable<typeof savedRoute>;
};

function SavedScreenWithRoute({ savedRoute }: SavedScreenWithRouteProps): JSX.Element {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toolbarLabels = useMapToolbarLabels();
  const [isFavourite, setIsFavourite] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  const handleBack = useCallback(() => navigate({ to: "/map/quick" }), [navigate]);
  const handleDismissStops = useCallback(() => setActiveTab("map"), []);
  const handleViewDetails = useCallback(() => setActiveTab("notes"), []);
  const handleCustomize = useCallback(() => navigate({ to: "/wizard/step-1" }), [navigate]);
  const handleOffline = useCallback(() => navigate({ to: "/offline" }), [navigate]);
  const handleStartRoute = useCallback(() => navigate({ to: "/map/itinerary" }), [navigate]);
  const handleToggleFavourite = useCallback(() => setIsFavourite((prev) => !prev), []);

  const {
    routeCopy,
    distance,
    duration,
    stops,
    difficultyLabel,
    updatedLabel,
    numberFormatter,
    ratingFormatter,
  } = useSavedRouteData(savedRoute);

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="map-shell__pane">
          <div className="map-shell__viewport">
            <MapViewport
              map={<WildsideMap />}
              gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
            >
              <MapTabContent
                savedRoute={savedRoute}
                routeCopy={routeCopy}
                distance={distance}
                duration={duration}
                stops={stops}
                difficultyLabel={difficultyLabel}
                ratingFormatter={ratingFormatter}
                numberFormatter={numberFormatter}
                isFavourite={isFavourite}
                onToggleFavourite={handleToggleFavourite}
                onViewDetails={handleViewDetails}
                onCustomize={handleCustomize}
                onOffline={handleOffline}
                onStartRoute={handleStartRoute}
                t={t}
                onBack={handleBack}
                shareOpen={shareOpen}
                onShareOpenChange={setShareOpen}
              />

              <StopsTabContent savedRoute={savedRoute} onClose={handleDismissStops} t={t} />

              <NotesTabContent
                savedRoute={savedRoute}
                routeCopy={routeCopy}
                difficultyLabel={difficultyLabel}
                updatedLabel={updatedLabel}
                numberFormatter={numberFormatter}
                ratingFormatter={ratingFormatter}
                i18nLanguage={i18n.language}
                t={t}
              />
            </MapViewport>
            <MapToolbar labels={toolbarLabels} />
          </div>

          <nav className="map-panel__tablist" aria-label="Route views">
            <button
              type="button"
              className={tabTriggerClass}
              onClick={() => navigate({ to: "/map/quick" })}
            >
              Explore
            </button>
            <button
              type="button"
              className={tabTriggerClass}
              onClick={() => navigate({ to: "/map/quick", hash: "stops" })}
            >
              Stops
            </button>
            <button
              type="button"
              className={tabTriggerClass}
              onClick={() => navigate({ to: "/map/quick", hash: "notes" })}
            >
              Notes
            </button>
          </nav>
        </Tabs.Root>

        <MapBottomNavigation activeId="map" />
      </main>
    </MobileShell>
  );
}
