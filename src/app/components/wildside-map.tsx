/** @file MapLibre wrapper rendering the Wildside demo map. */

import type { Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";

import { mapDefaults, useOptionalMapStore } from "../features/map/map-state";

const MAPLIBRE_RTL_PLUGIN_URL =
  "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js";

let hasRegisteredRtlTextPlugin = false;
type MapLibreNamespace = typeof import("maplibre-gl")["default"];

type MapLibreWithRtl = MapLibreNamespace & {
  setRTLTextPlugin?: (pluginUrl: string, callback?: () => void, deferred?: boolean) => void;
};

export const ensureRtlTextPlugin = (maplibre: MapLibreNamespace): void => {
  if (hasRegisteredRtlTextPlugin) return;
  const setPlugin = (maplibre as MapLibreWithRtl).setRTLTextPlugin;
  if (typeof setPlugin !== "function") return;

  setPlugin(MAPLIBRE_RTL_PLUGIN_URL, undefined, true);
  hasRegisteredRtlTextPlugin = true;
};

export const resetRtlTextPluginRegistrationForTests = (): void => {
  hasRegisteredRtlTextPlugin = false;
};

export interface WildsideMapProps {
  /** Longitude/latitude pair for the initial view. */
  center?: [number, number];
  /** Initial zoom level for the map. */
  zoom?: number;
}

/**
 * Embeds a MapLibre GL JS map using the OpenMapTiles bright demo style.
 * The map initializes lazily so tests and non-WebGL environments can opt out
 * without throwing. When a MapStateProvider is present, the map registers with
 * the shared store so viewport changes persist between screens.
 */
export function WildsideMap({ center, zoom }: WildsideMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const store = useOptionalMapStore();
  const actions = store?.actions;

  const storedViewport = useMemo(() => store?.getSnapshot().viewport, [store]);
  type MutableLngLat = [number, number];
  const resolvedCenter = [
    ...(center ?? storedViewport?.center ?? mapDefaults.center),
  ] as MutableLngLat;
  const resolvedZoom = zoom ?? storedViewport?.zoom ?? mapDefaults.zoom;
  const resolvedBearing = storedViewport?.bearing ?? 0;
  const resolvedPitch = storedViewport?.pitch ?? 0;

  const centerRef = useRef<MutableLngLat>([...resolvedCenter] as MutableLngLat);
  const zoomRef = useRef(resolvedZoom);
  const bearingRef = useRef(resolvedBearing);
  const pitchRef = useRef(resolvedPitch);

  useEffect(() => {
    if (!actions) return;
    actions.setViewport({
      center: centerRef.current,
      zoom: zoomRef.current,
      bearing: bearingRef.current,
      pitch: pitchRef.current,
      animate: false,
    });
  }, [actions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerElement: HTMLElement = container;
    if (typeof window === "undefined") return;
    if (!(window as typeof window & { WebGLRenderingContext?: unknown }).WebGLRenderingContext) {
      // Skip initialization when WebGL is unavailable (e.g., unit tests).
      return;
    }

    let isCancelled = false;
    let mapInstance: MapLibreMap | null = null;

    const initializeMap = async (): Promise<void> => {
      const [maplibreModule] = await Promise.all([
        import("maplibre-gl"),
        import("maplibre-gl/dist/maplibre-gl.css"),
      ]);

      const maplibreNamespace =
        (maplibreModule as { default?: MapLibreNamespace }).default ??
        (maplibreModule as unknown as MapLibreNamespace);

      if (isCancelled) return;
      ensureRtlTextPlugin(maplibreNamespace);

      try {
        mapInstance = new maplibreNamespace.Map({
          container: containerElement,
          style: "https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json",
          center: [...centerRef.current] as MutableLngLat,
          zoom: zoomRef.current,
          bearing: bearingRef.current,
          pitch: pitchRef.current,
          attributionControl: false,
        });
        mapRef.current = mapInstance;
        mapInstance.addControl(
          new maplibreNamespace.NavigationControl({ visualizePitch: true }),
          "top-right",
        );
        mapInstance.addControl(new maplibreNamespace.AttributionControl({ compact: true }));

        mapInstance.on("load", () => {
          if (!mapInstance) return;
          if (actions) {
            actions.registerMap(mapInstance);
          } else {
            ensureFallbackLayers(mapInstance);
          }
        });
      } catch (error) {
        console.warn("Wildside map failed to initialize", error);
      }
    };

    initializeMap().catch((error) => {
      console.warn("Wildside map encountered an error", error);
    });

    return () => {
      isCancelled = true;
      if (mapInstance && actions) {
        actions.unregisterMap(mapInstance);
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [actions]);

  useEffect(() => {
    if (center === undefined) return;
    centerRef.current = [...center] as MutableLngLat;
    if (actions) {
      actions.setViewport({ center: [...center] as MutableLngLat, animate: false });
    } else if (mapRef.current) {
      mapRef.current.easeTo({ center: [...center] as MutableLngLat, animate: false });
    }
  }, [actions, center]);

  useEffect(() => {
    if (zoom === undefined) return;
    zoomRef.current = zoom;
    if (actions) {
      actions.setViewport({ zoom, animate: false });
    } else if (mapRef.current) {
      mapRef.current.setZoom(zoom);
    }
  }, [actions, zoom]);

  return <div ref={containerRef} className="h-full w-full" />;
}

export function ensureFallbackLayers(mapInstance: MapLibreMap) {
  if (!mapInstance.getSource("wildside-pois")) {
    mapInstance.addSource("wildside-pois", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "start-exploring",
            properties: { name: "Start exploring" },
            geometry: { type: "Point", coordinates: [11.4, 47.268] },
          },
        ],
      },
    });
  }

  if (!mapInstance.getLayer("wildside-pois-circles")) {
    mapInstance.addLayer({
      id: "wildside-pois-circles",
      type: "circle",
      source: "wildside-pois",
      paint: {
        "circle-radius": 8,
        "circle-color": "#3b82f6",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });
  }

  if (!mapInstance.getLayer("wildside-pois-labels")) {
    mapInstance.addLayer({
      id: "wildside-pois-labels",
      type: "symbol",
      source: "wildside-pois",
      layout: {
        "text-field": ["get", "name"],
        "text-offset": [0, 1.2],
        "text-anchor": "top",
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#1f2937",
        "text-halo-width": 1,
      },
    });
  }
}
