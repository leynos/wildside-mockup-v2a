/** @file Map itinerary route with MapLibre canvas, tabs, and POI details. */

import type { TabsContentProps } from "@radix-ui/react-tabs";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useCallback, useState } from "react";

import { MapToolbar } from "../../../components/map/map-toolbar";
import { useMapToolbarLabels } from "../../../components/map/use-map-toolbar-labels";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { WildsideMap } from "../../../components/wildside-map";
import { waterfrontDiscoveryRoute } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";
import { ItineraryMapHeader } from "./components/itinerary-map-header";
import { NotesOverlayPanel } from "./components/notes-overlay-panel";
import { RouteActionButtons } from "./components/route-action-buttons";
import { RouteSummarySection } from "./components/route-summary-section";
import { StopsOverlayPanel } from "./components/stops-overlay-panel";
import { useItineraryData } from "./hooks/use-itinerary-data";

const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

type MapOverlayProps = TabsContentProps;

function MapOverlay({ className, ...props }: MapOverlayProps): JSX.Element {
  const composedClassName = className ? `map-overlay ${className}` : "map-overlay";
  return <Tabs.Content {...props} className={composedClassName} />;
}

export function ItineraryScreen(): JSX.Element {
  const navigate = useNavigate();
  const toolbarLabels = useMapToolbarLabels();
  const [activeTab, setActiveTab] = useState("map");
  const { language, routeCopy, distance, duration, stops, labels } =
    useItineraryData(waterfrontDiscoveryRoute);

  const handleBack = useCallback(() => navigate({ to: "/map/quick" }), [navigate]);
  const handleDismissStops = useCallback(() => setActiveTab("map"), []);

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="map-shell__pane">
          <div className="map-shell__viewport">
            <MapOverlay value="map" forceMount>
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/85 via-base-900/40 to-transparent"
              >
                <div className="flex flex-col justify-between px-6 pb-6 pt-12">
                  <ItineraryMapHeader
                    distance={distance}
                    duration={duration}
                    stops={stops}
                    labels={labels}
                    onBack={handleBack}
                  />

                  <div className="mt-auto space-y-4">
                    <RouteSummarySection
                      routeName={routeCopy.name}
                      routeDescription={routeCopy.description}
                      highlightTagIds={waterfrontDiscoveryRoute.highlightTagIds}
                      language={language}
                    />
                    <RouteActionButtons routeId={waterfrontDiscoveryRoute.id} />
                  </div>
                </div>
              </MapViewport>
            </MapOverlay>

            <MapOverlay value="stops" forceMount>
              <StopsOverlayPanel
                points={waterfrontDiscoveryRoute.pointsOfInterest}
                onDismiss={handleDismissStops}
              />
            </MapOverlay>

            <MapOverlay value="notes" forceMount>
              <NotesOverlayPanel notes={waterfrontDiscoveryRoute.notes} language={language} />
            </MapOverlay>
            <MapToolbar labels={toolbarLabels} />
          </div>

          <Tabs.List className="map-panel__tablist">
            <Tabs.Trigger value="map" className={tabTriggerClass}>
              Map
            </Tabs.Trigger>
            <Tabs.Trigger value="stops" className={tabTriggerClass}>
              Stops
            </Tabs.Trigger>
            <Tabs.Trigger value="notes" className={tabTriggerClass}>
              Notes
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <MapBottomNavigation activeId="map" />
      </main>
    </MobileShell>
  );
}
