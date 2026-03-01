/** @file Floating map control toolbar with zoom, layers, and recentre buttons. */

import type { TFunction } from "i18next";
import type { JSX } from "react";

import { Icon } from "../icon";

type MapToolbarProps = {
  readonly t: TFunction;
};

const toolbarButtons = [
  { token: "{icon.map.zoomIn}", labelKey: "map-control-zoom-in", defaultLabel: "Zoom in" },
  { token: "{icon.map.zoomOut}", labelKey: "map-control-zoom-out", defaultLabel: "Zoom out" },
  { token: "{icon.map.layers}", labelKey: "map-control-layers", defaultLabel: "Layers" },
  { token: "{icon.map.recentre}", labelKey: "map-control-recentre", defaultLabel: "Recentre" },
] as const;

/**
 * Vertical stack of four cut-corner map control buttons.
 *
 * All buttons are presentational (no-op handlers) since the map is a
 * static mockup. Wire to MapLibre APIs when the map becomes interactive.
 */
export function MapToolbar({ t }: MapToolbarProps): JSX.Element {
  return (
    <nav className="map-toolbar" aria-label={t("map-controls", { defaultValue: "Map controls" })}>
      <div className="map-toolbar__stack">
        {toolbarButtons.map(({ token, labelKey, defaultLabel }) => (
          <button
            key={labelKey}
            type="button"
            className="map-toolbar__button"
            aria-label={t(labelKey, { defaultValue: defaultLabel })}
          >
            <Icon token={token} aria-hidden />
          </button>
        ))}
      </div>
    </nav>
  );
}
