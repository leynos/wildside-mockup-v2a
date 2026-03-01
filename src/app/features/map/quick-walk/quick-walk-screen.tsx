/** @file Quick map generator flow with interactive MapLibre canvas and tabs. */

import type { TabsContentProps } from "@radix-ui/react-tabs";
import * as Tabs from "@radix-ui/react-tabs";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { type JSX, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { InterestToggleGroup } from "../../../components/interest-toggle-group";
import { MapToolbar } from "../../../components/map/map-toolbar";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { SliderControl } from "../../../components/slider-control";
import { WildsideMap } from "../../../components/wildside-map";
import { defaultSelectedInterests } from "../../../data/discover";
import { quickWalkConfig, waterfrontDiscoveryRoute } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";
import { useUnitLabelFormatters } from "../../../units/use-unit-labels";
import { RouteFlowList } from "../saved/route-flow-list";

type TabKey = "map" | "stops" | "notes";

const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

const panelHandleClass = "mx-auto mb-4 block h-2 w-12 rounded-full bg-neutral";

type MapViewportTabProps = TabsContentProps;

function MapViewportTab({ className, ...props }: MapViewportTabProps): JSX.Element {
  const composedClassName = className ? `map-viewport__tab ${className}` : "map-viewport__tab";
  return <Tabs.Content {...props} className={composedClassName} />;
}

export function QuickWalkScreen(): JSX.Element {
  const [durationSeconds, setDurationSeconds] = useState<number>(
    quickWalkConfig.defaultDurationSeconds,
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    ...defaultSelectedInterests,
  ]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window === "undefined") {
      return "map";
    }
    return getHashTab(window.location.hash) ?? "map";
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatDurationValue } = useUnitLabelFormatters();

  const formatDurationLabel = useCallback(
    (seconds: number) => {
      const { value, unitLabel, numericValue } = formatDurationValue(seconds, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return t("quick-walk-duration-format", {
        count: numericValue,
        unit: unitLabel,
        defaultValue: `${value} ${unitLabel}`,
      });
    },
    [formatDurationValue, t],
  );

  const mapViewportAria = t("quick-walk-map-aria-label", {
    defaultValue: "Quick walk map viewport",
  });
  const dismissPanelLabel = t("quick-walk-dismiss-aria", { defaultValue: "Dismiss panel" });
  const headerTitle = t("quick-walk-header-title", { defaultValue: "Quick Walk Generator" });
  const headerDescription = t("quick-walk-header-description", {
    defaultValue: "Dial in duration and interests to refresh suggestions.",
  });
  const generateWalkLabel = t("quick-walk-generate-aria", {
    defaultValue: "Generate a new walk",
  });
  const durationLabel = t("quick-walk-duration-label", { defaultValue: "Duration" });
  const durationAria = t("quick-walk-duration-aria", { defaultValue: "Walk duration" });
  const { min: minDurationSeconds, max: maxDurationSeconds } = quickWalkConfig.durationRangeSeconds;
  const durationMarkers = useMemo(
    () => [
      formatDurationLabel(minDurationSeconds),
      formatDurationLabel(quickWalkConfig.markerMidpointSeconds),
      formatDurationLabel(maxDurationSeconds),
    ],
    [formatDurationLabel, maxDurationSeconds, minDurationSeconds],
  );
  const interestsHeading = t("quick-walk-interests-heading", { defaultValue: "Interests" });
  const interestsAria = t("quick-walk-interests-aria", {
    defaultValue: "Select quick walk interests",
  });
  const selectedLabel = t("quick-walk-interests-selected", {
    count: selectedInterests.length,
    defaultValue:
      selectedInterests.length === 1 ? "1 selected" : `${selectedInterests.length} selected`,
  });
  const stopsHeading = t("quick-walk-stops-heading", { defaultValue: "Quick walk stops" });
  const notesHeading = t("quick-walk-notes-heading", { defaultValue: "Planning notes" });
  const notesItems = useMemo(
    () => [
      {
        id: "calendar",
        text: t("quick-walk-notes-item-1", {
          defaultValue: "Sync the plan with your calendar to block out discovery time.",
        }),
      },
      {
        id: "bottle",
        text: t("quick-walk-notes-item-2", {
          defaultValue:
            "Pack a reusable bottle – refill points are highlighted along the waterfront.",
        }),
      },
      {
        id: "friends",
        text: t("quick-walk-notes-item-3", {
          defaultValue: "Invite friends and keep pace options flexible for an inclusive stroll.",
        }),
      },
    ],
    [t],
  );
  const tabLabels = useMemo(
    () => ({
      map: t("quick-walk-tab-map", { defaultValue: "Explore" }),
      stops: t("quick-walk-tab-stops", { defaultValue: "Stops" }),
      notes: t("quick-walk-tab-notes", { defaultValue: "Notes" }),
    }),
    [t],
  );
  const saveWalkLabel = t("quick-walk-save-aria", { defaultValue: "Save quick walk" });

  const handleDismissPanels = () => {
    navigate({ to: "/map" });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handleHashChange = () => setActiveTab(getHashTab(window.location.hash) ?? "map");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    setActiveTab((current) => {
      const next = getHashTab(location.hash) ?? "map";
      return current === next ? current : next;
    });
  }, [location.hash]);

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) => {
            const nextTab = value as TabKey;
            setActiveTab(nextTab);
            if (nextTab === "map") {
              navigate({ to: "." });
            } else {
              navigate({ to: ".", hash: nextTab });
            }
          }}
          className="map-shell__pane"
        >
          <div className="map-shell__viewport">
            <MapViewport
              map={<WildsideMap />}
              gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
              containerTestId="quick-walk-map-container"
              ariaLabel={mapViewportAria}
            >
              <MapViewportTab value="map" forceMount>
                <div className="pointer-events-none px-6 pb-6">
                  <div className="quick-walk__panel max-h-[60vh] overflow-y-auto">
                    <div className="map-panel__handle bg-transparent">
                      <button
                        type="button"
                        onClick={handleDismissPanels}
                        className={panelHandleClass}
                        aria-label={dismissPanelLabel}
                      />
                    </div>
                    <header className="mb-6 flex items-center justify-between">
                      <div>
                        <h1 className="font-sans font-bold tracking-wider text-xl text-base-content">
                          {headerTitle}
                        </h1>
                        <p className="text-sm text-base-content/70">{headerDescription}</p>
                      </div>
                      <button
                        type="button"
                        className="cut-corner flex h-12 w-12 shrink-0 items-center justify-center bg-accent text-accent-content shadow-lg shadow-glow transition hover:scale-105"
                        aria-label={generateWalkLabel}
                        onClick={() => navigate({ to: "/wizard/step-1" })}
                      >
                        <Icon token="{icon.object.magic}" aria-hidden className="h-6 w-6" />
                      </button>
                    </header>

                    <div className="mb-6 rounded-lg bg-base-300 p-4">
                      <SliderControl
                        id="quick-walk-duration"
                        label={durationLabel}
                        iconToken="{icon.object.duration}"
                        value={durationSeconds}
                        min={quickWalkConfig.durationRangeSeconds.min}
                        max={quickWalkConfig.durationRangeSeconds.max}
                        step={quickWalkConfig.durationRangeSeconds.step}
                        valueFormatter={formatDurationLabel}
                        markers={durationMarkers}
                        ariaLabel={durationAria}
                        onValueChange={setDurationSeconds}
                      />
                    </div>

                    <div className="rounded-lg bg-base-300 p-4">
                      <section>
                        <div className="section-header-row">
                          <h2 className="section-heading text-base-content">
                            <Icon token="{icon.action.like}" className="text-accent" aria-hidden />
                            {interestsHeading}
                          </h2>
                          <span className="text-xs font-medium text-base-content/60">
                            {selectedLabel}
                          </span>
                        </div>
                        <InterestToggleGroup
                          interestIds={quickWalkConfig.interestIds}
                          selected={selectedInterests}
                          onChange={setSelectedInterests}
                          ariaLabel={interestsAria}
                        />
                      </section>
                    </div>
                  </div>
                </div>
              </MapViewportTab>

              <MapViewportTab value="stops" forceMount>
                <div className="pointer-events-none px-6 pb-6">
                  <section
                    className="map-panel map-panel--stacked max-h-[53vh]"
                    data-testid="quick-walk-stops-panel"
                    aria-labelledby="quick-walk-stops-heading"
                  >
                    <h2 id="quick-walk-stops-heading" className="sr-only">
                      {stopsHeading}
                    </h2>
                    <div className="map-panel__handle bg-transparent">
                      <button
                        type="button"
                        onClick={handleDismissPanels}
                        className={panelHandleClass}
                        aria-label={dismissPanelLabel}
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-5">
                      <RouteFlowList points={waterfrontDiscoveryRoute.pointsOfInterest} />
                    </div>
                    <div className="map-overlay__fade map-overlay__fade--top" aria-hidden="true" />
                    <div
                      className="map-overlay__fade map-overlay__fade--bottom"
                      aria-hidden="true"
                    />
                  </section>
                </div>
              </MapViewportTab>

              <MapViewportTab value="notes" forceMount>
                <div className="pointer-events-none px-6 pb-6">
                  <section
                    className="map-panel map-panel--scroll max-h-[53vh] px-6 pb-6 text-sm text-base-content"
                    data-testid="quick-walk-notes-panel"
                    aria-labelledby="quick-walk-notes-heading"
                  >
                    <div className="map-panel__handle bg-transparent">
                      <button
                        type="button"
                        onClick={handleDismissPanels}
                        className={panelHandleClass}
                        aria-label={dismissPanelLabel}
                      />
                    </div>
                    <h2
                      id="quick-walk-notes-heading"
                      className="text-base font-semibold text-base-content"
                    >
                      {notesHeading}
                    </h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-base-content/80">
                      {notesItems.map((note) => (
                        <li key={note.id}>{note.text}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </MapViewportTab>
            </MapViewport>
            <MapToolbar t={t} />
          </div>

          <Tabs.List className="map-panel__tablist">
            <Tabs.Trigger value="map" className={tabTriggerClass}>
              {tabLabels.map}
            </Tabs.Trigger>
            <Tabs.Trigger value="stops" className={tabTriggerClass}>
              {tabLabels.stops}
            </Tabs.Trigger>
            <Tabs.Trigger value="notes" className={tabTriggerClass}>
              {tabLabels.notes}
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <div className="map-fab-layer">
          <button
            type="button"
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-content shadow-xl shadow-glow transition hover:scale-105"
            aria-label={saveWalkLabel}
            onClick={() => navigate({ to: "/saved" })}
          >
            <Icon token="{icon.action.save}" aria-hidden />
          </button>
        </div>
        <MapBottomNavigation activeId="map" />
      </main>
    </MobileShell>
  );
}

function getHashTab(hash?: string | null): TabKey | null {
  if (!hash || hash.length <= 1) {
    return null;
  }
  const candidate = hash.startsWith("#") ? hash.slice(1) : hash;
  return candidate === "map" || candidate === "stops" || candidate === "notes"
    ? (candidate as TabKey)
    : null;
}
