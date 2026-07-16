/** @file Unit tests validating Explore fixture integrity and relationships. */

import { describe, expect, it } from "bun:test";

import {
  communityPick,
  curatedCollections,
  exploreRoutes,
  featuredRoute,
  trendingRoutes,
} from "../src/app/data/explore";
import type { RouteId } from "../src/app/data/explore.models";

const routesById = new Map<RouteId, (typeof exploreRoutes)[number]>(
  exploreRoutes.map((route) => [route.id, route]),
);

describe("Explore entity fixtures", () => {
  it("exposes a featured route present in the explore catalogue", () => {
    expect(routesById.has(featuredRoute.id)).toBe(true);
  });

  it("ensures all trending highlights reference existing routes", () => {
    const missing = trendingRoutes.filter((highlight) => !routesById.has(highlight.routeId));
    expect(missing).toHaveLength(0);
  });

  it("ensures all curated collections reference existing routes", () => {
    const missing = curatedCollections.flatMap((collection) =>
      collection.routeIds.filter((id) => !routesById.has(id)),
    );
    expect(missing).toHaveLength(0);
  });

  it("provides localization for the community pick and curator", () => {
    expect(communityPick.localizations["en-GB"]?.name).toBeDefined();
    expect(communityPick.curator.localizations["en-GB"]?.name).toBeDefined();
  });
});
