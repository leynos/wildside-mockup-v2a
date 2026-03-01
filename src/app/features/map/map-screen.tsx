/** @file Bare map screen with toolbar and bookmark FAB — no overlay panels. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { MapToolbar } from "../../components/map/map-toolbar";
import { MapBottomNavigation } from "../../components/map-bottom-navigation";
import { MapViewport } from "../../components/map-viewport";
import { WildsideMap } from "../../components/wildside-map";
import { MobileShell } from "../../layout/mobile-shell";

export function MapScreen(): JSX.Element {
  const { t } = useTranslation();
  const saveWalkLabel = t("quick-walk-save-aria", { defaultValue: "Save quick walk" });

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <div className="map-shell__viewport">
          <MapViewport
            map={<WildsideMap />}
            gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
          />
          <MapToolbar t={t} />
        </div>

        <div className="map-fab-layer">
          <button
            type="button"
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-content shadow-xl shadow-glow transition hover:scale-105"
            aria-label={saveWalkLabel}
          >
            <Icon token="{icon.action.save}" aria-hidden />
          </button>
        </div>
        <MapBottomNavigation activeId="map" />
      </main>
    </MobileShell>
  );
}
