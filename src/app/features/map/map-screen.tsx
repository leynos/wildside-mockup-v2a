/** @file Bare map screen with toolbar and bookmark FAB — no overlay panels. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { MapToolbar } from "../../components/map/map-toolbar";
import { MapBottomNavigation } from "../../components/map-bottom-navigation";
import { MapViewport } from "../../components/map-viewport";
import { WildsideMap } from "../../components/wildside-map";
import { MobileShell } from "../../layout/mobile-shell";

const tabTriggerClass = "py-3 text-sm font-semibold text-base-content/70";

export function MapScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const saveWalkLabel = t("quick-walk-save-aria", { defaultValue: "Save quick walk" });
  const exploreLabel = t("quick-walk-tab-map", { defaultValue: "Explore" });
  const stopsLabel = t("quick-walk-tab-stops", { defaultValue: "Stops" });
  const notesLabel = t("quick-walk-tab-notes", { defaultValue: "Notes" });

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <div className="flex flex-1 min-h-0 flex-col">
          <div className="map-shell__viewport">
            <MapViewport
              map={<WildsideMap />}
              gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
            />
            <MapToolbar t={t} />
          </div>

          <nav
            className="map-panel__tablist"
            aria-label={t("map-tab-navigation", { defaultValue: "Map views" })}
          >
            <button
              type="button"
              className={tabTriggerClass}
              onClick={() => navigate({ to: "/map/quick" })}
            >
              {exploreLabel}
            </button>
            <button
              type="button"
              className={tabTriggerClass}
              onClick={() => navigate({ to: "/map/quick", hash: "stops" })}
            >
              {stopsLabel}
            </button>
            <button
              type="button"
              className={tabTriggerClass}
              onClick={() => navigate({ to: "/map/quick", hash: "notes" })}
            >
              {notesLabel}
            </button>
          </nav>
        </div>

        <div className="map-fab-layer">
          <button
            type="button"
            className="map-fab"
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
