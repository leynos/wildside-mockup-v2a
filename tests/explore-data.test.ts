/** @file Unit tests validating Explore fixture integrity and localization coverage. */

import { describe, expect, it } from "bun:test";

import {
  communityPick,
  curatedCollections,
  exploreCategories,
  exploreRoutes,
  featuredRoute,
  popularThemes,
  trendingRoutes,
} from "../src/app/data/explore";
import type { EntityLocalizations } from "../src/app/domain/entities/localization";
import { SUPPORTED_LOCALES } from "../src/app/i18n/supported-locales";

const localeCodes = SUPPORTED_LOCALES.map((locale) => locale.code);

const expectHasLocalizations = (localizations: EntityLocalizations, label: string) => {
  localeCodes.forEach((code) => {
    expect(localizations[code], `${label} missing localisation for ${code}`).toBeDefined();
  });
};

describe("Explore fixtures", () => {
  it("expose localization entries for all supported locales", () => {
    for (const route of exploreRoutes) {
      expectHasLocalizations(route.localizations, route.id);
    }
    for (const category of exploreCategories) {
      expectHasLocalizations(category.localizations, category.id);
    }
    for (const theme of popularThemes) {
      expectHasLocalizations(theme.localizations, theme.id);
    }
    for (const collection of curatedCollections) {
      expectHasLocalizations(collection.localizations, collection.id);
    }
    for (const highlight of trendingRoutes) {
      expectHasLocalizations(highlight.subtitleLocalizations, highlight.routeId);
    }
    expectHasLocalizations(communityPick.localizations, communityPick.id);
    expectHasLocalizations(communityPick.curator.localizations, `${communityPick.id}-curator`);
  });

  it("keeps route references consistent across highlights and collections", () => {
    const routesById = new Map(exploreRoutes.map((route) => [route.id, route]));

    for (const collection of curatedCollections) {
      for (const routeId of collection.routeIds) {
        expect(routesById.has(routeId)).toBe(true);
      }
    }

    for (const highlight of trendingRoutes) {
      expect(routesById.has(highlight.routeId)).toBe(true);
    }

    expect(routesById.has(featuredRoute.id)).toBe(true);
  });
});
