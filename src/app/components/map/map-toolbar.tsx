/** @file Floating map control toolbar with zoom, layers, and recentre buttons. */

import type { JSX } from "react";

import { Icon } from "../icon";

export type MapToolbarLabels = {
  readonly controls: string;
  readonly zoomIn: string;
  readonly zoomOut: string;
  readonly layers: string;
  readonly recentre: string;
};

type MapToolbarProps = {
  readonly labels: MapToolbarLabels;
};

const toolbarButtons = [
  { token: "{icon.map.zoomIn}", key: "zoomIn" },
  { token: "{icon.map.zoomOut}", key: "zoomOut" },
  { token: "{icon.map.layers}", key: "layers" },
  { token: "{icon.map.recentre}", key: "recentre" },
] as const;

/**
 * Vertical stack of four cut-corner map control buttons.
 *
 * All buttons are presentational (no-op handlers) since the map is a
 * static mockup. Wire to MapLibre APIs when the map becomes interactive.
 */
export function MapToolbar({ labels }: MapToolbarProps): JSX.Element {
  return (
    <nav className="map-toolbar" aria-label={labels.controls}>
      <div className="map-toolbar__stack">
        {toolbarButtons.map(({ token, key }) => (
          <button key={key} type="button" className="map-toolbar__button" aria-label={labels[key]}>
            <Icon token={token} aria-hidden />
          </button>
        ))}
      </div>
    </nav>
  );
}
