import { beforeEach, describe, expect, it } from "bun:test";
import type { Map as MapLibreMap } from "maplibre-gl";

import { createMapStateStoreForTests, type MapStateStore } from "../src/app/features/map/map-state";

type ViewportOptions = {
  center?: [number, number];
  zoom?: number;
  bearing?: number;
  pitch?: number;
  animate?: boolean;
  duration?: number;
};

class MapStub {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  readonly jumpToCalls: ViewportOptions[] = [];
  readonly easeToCalls: ViewportOptions[] = [];
  readonly layoutCalls: Array<{ id: string; property: string; value: unknown }> = [];
  readonly sources = new Map<string, unknown>();
  readonly layers = new Map<string, unknown>();
  readonly featureStates = new Map<string, unknown>();
  readonly removedFeatureStates: string[] = [];
  private listeners = new Map<string, Set<() => void>>();

  constructor() {
    this.center = [11.404, 47.267];
    this.zoom = 12;
    this.bearing = 0;
    this.pitch = 0;
  }

  jumpTo(options: ViewportOptions) {
    this.jumpToCalls.push(options);
    this.updatePose(options);
  }

  easeTo(options: ViewportOptions) {
    this.easeToCalls.push(options);
    this.updatePose(options);
  }

  setLayoutProperty(id: string, property: string, value: unknown) {
    this.layoutCalls.push({ id, property, value });
  }

  addSource(id: string, source: unknown) {
    this.sources.set(id, source);
  }

  getSource(id: string) {
    return this.sources.get(id) as unknown;
  }

  addLayer(layer: { id: string }) {
    this.layers.set(layer.id, layer);
  }

  getLayer(id: string) {
    return this.layers.get(id);
  }

  setFeatureState(target: { id: string }, state: unknown) {
    this.featureStates.set(target.id, state);
  }

  removeFeatureState(target: { id: string }) {
    this.featureStates.delete(target.id);
    this.removedFeatureStates.push(target.id);
  }

  getCenter() {
    return { lng: this.center[0], lat: this.center[1] };
  }

  getZoom() {
    return this.zoom;
  }

  getBearing() {
    return this.bearing;
  }

  getPitch() {
    return this.pitch;
  }

  on(event: string, handler: () => void) {
    const handlers = this.listeners.get(event) ?? new Set();
    handlers.add(handler);
    this.listeners.set(event, handlers);
  }

  off(event: string, handler: () => void) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.delete(handler);
  }

  emit(event: string) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.forEach((handler) => {
      handler();
    });
  }

  private updatePose(options: ViewportOptions) {
    if (Array.isArray(options.center)) {
      this.center = options.center;
    }
    if (typeof options.zoom === "number") {
      this.zoom = options.zoom;
    }
    if (typeof options.bearing === "number") {
      this.bearing = options.bearing;
    }
    if (typeof options.pitch === "number") {
      this.pitch = options.pitch;
    }
  }
}

describe("MapStateStore", () => {
  let store: MapStateStore;
  let map: MapStub;

  beforeEach(() => {
    store = createMapStateStoreForTests();
    map = new MapStub();
  });

  it("applies stored viewport, layers, and highlights when registering", () => {
    store.actions.setViewport({
      center: [11.45, 47.29],
      zoom: 14,
      bearing: 10,
      pitch: 20,
      animate: false,
    });
    store.actions.highlightPois(["blue-bottle-coffee"]);
    store.actions.toggleLayer("wildside-pois-labels", false);

    store.actions.registerMap(map as unknown as MapLibreMap);

    expect(map.jumpToCalls).toHaveLength(1);
    const firstJump = map.jumpToCalls[0];
    if (!firstJump) {
      throw new Error("Expected a recorded jumpTo call");
    }
    expect(firstJump.center).toEqual([11.45, 47.29]);
    expect(map.sources.has("wildside-pois")).toBe(true);
    expect(map.layers.has("wildside-pois-circles")).toBe(true);
    expect(map.featureStates.get("blue-bottle-coffee")).toEqual({ highlighted: true });
    expect(map.layoutCalls).toContainEqual({
      id: "wildside-pois-labels",
      property: "visibility",
      value: "none",
    });
  });

  it("updates snapshot when the map emits move events", () => {
    store.actions.registerMap(map as unknown as MapLibreMap);
    map.center = [11.5, 47.3];
    map.zoom = 13.5;
    map.bearing = 5;
    map.pitch = 15;

    map.emit("moveend");

    const snapshot = store.getSnapshot();
    expect(snapshot.viewport.center).toEqual([11.5, 47.3]);
    expect(snapshot.viewport.zoom).toBeCloseTo(13.5);
    expect(snapshot.viewport.bearing).toBeCloseTo(5);
    expect(snapshot.viewport.pitch).toBeCloseTo(15);
  });

  it("delegates viewport changes to the live map", () => {
    store.actions.registerMap(map as unknown as MapLibreMap);

    store.actions.setViewport({ center: [11.39, 47.28] });
    expect(map.easeToCalls).toHaveLength(1);
    const firstEase = map.easeToCalls[0];
    if (!firstEase) {
      throw new Error("Expected a recorded easeTo call");
    }
    expect(firstEase.center).toEqual([11.39, 47.28]);

    store.actions.setViewport({ zoom: 10, animate: false });
    expect(map.jumpToCalls.at(-1)?.zoom).toBe(10);
  });

  it("clears previous highlights when new points are emphasized", () => {
    store.actions.highlightPois(["blue-bottle-coffee"]);
    store.actions.registerMap(map as unknown as MapLibreMap);

    store.actions.highlightPois(["skyline-bridge"]);

    expect(map.removedFeatureStates).toContain("blue-bottle-coffee");
    expect(map.featureStates.get("skyline-bridge")).toEqual({ highlighted: true });
  });
});
