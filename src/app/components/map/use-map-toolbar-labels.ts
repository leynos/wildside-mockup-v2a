/** @file Hook to resolve translated labels for the map toolbar. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { MapToolbarLabels } from "./map-toolbar";

/** Resolve all map toolbar labels from the current translation context. */
export function useMapToolbarLabels(): MapToolbarLabels {
  const { t, i18n } = useTranslation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: i18n.language triggers re-computation on locale change
  return useMemo<MapToolbarLabels>(
    () => ({
      controls: t("map-controls", { defaultValue: "Map controls" }),
      zoomIn: t("map-control-zoom-in", { defaultValue: "Zoom in" }),
      zoomOut: t("map-control-zoom-out", { defaultValue: "Zoom out" }),
      layers: t("map-control-layers", { defaultValue: "Layers" }),
      recentre: t("map-control-recentre", { defaultValue: "Recentre" }),
    }),
    [t, i18n.language],
  );
}
