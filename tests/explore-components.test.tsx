/** @file Unit tests for Explore presentational components.
 * Validates localization, imagery, and badge rendering via the i18n test
 * harness.
 */
import { beforeAll, describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { I18nextProvider } from "react-i18next";

import {
  communityPick,
  curatedCollections,
  exploreCategories,
  exploreRoutes,
  featuredRoute,
  popularThemes,
  trendingRoutes,
} from "../src/app/data/explore";
import { buildDifficultyLookup } from "../src/app/data/registries/difficulties";
import {
  CategoryScroller,
  CommunityPickPanel,
  CuratedCollectionsList,
  FeaturedRouteCard,
  PopularThemesGrid,
  type TrendingRouteCard,
  TrendingRoutesList,
} from "../src/app/features/explore/explore-sections";
import { changeLanguage, i18n, i18nReady } from "./helpers/i18nTestHelpers";

const renderWithI18n = (ui: JSX.Element) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

const formatDistanceLabel = (value: number) => `${value}m`;
const formatDurationLabel = (value: number) => `${value}s`;
const formatRangeLabel = (range: readonly [number, number]) => `${range[0]}–${range[1]}`;
const formatSaveCount = (count: number) => `${count} saves`;

beforeAll(async () => {
  await i18nReady;
});

describe("Explore presentational components", () => {
  it("renders categories using localization", async () => {
    await changeLanguage("es");
    renderWithI18n(<CategoryScroller categories={exploreCategories} />);

    expect(screen.getByText("Arte urbano")).toBeInTheDocument();
  });

  it("renders the featured route with badge localization", async () => {
    await changeLanguage("en-GB");
    renderWithI18n(
      <FeaturedRouteCard
        formatDistanceLabel={formatDistanceLabel}
        formatDurationLabel={formatDurationLabel}
        route={featuredRoute}
      />,
    );

    expect(screen.getByRole("img", { name: featuredRoute.heroImage.alt })).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
  });

  it("renders themes and collections with entity localization", async () => {
    await changeLanguage("es");
    const difficultyLookup = buildDifficultyLookup(i18n.t.bind(i18n));

    renderWithI18n(
      <>
        <PopularThemesGrid formatDistanceRangeLabel={formatRangeLabel} themes={popularThemes} />
        <CuratedCollectionsList
          collections={curatedCollections}
          difficultyLookup={difficultyLookup}
          formatDistanceRangeLabel={formatRangeLabel}
          formatDurationRangeLabel={formatRangeLabel}
        />
      </>,
    );

    expect(screen.getByText("Cultura del café")).toBeInTheDocument();
    expect(screen.getByText("Circuitos cafeteros")).toBeInTheDocument();
  });

  it("renders trending routes and community pick from localization maps", async () => {
    await changeLanguage("es");
    const routesById = new Map(exploreRoutes.map((route) => [route.id, route]));
    const cards: TrendingRouteCard[] = trendingRoutes
      .map((highlight) => {
        const route = routesById.get(highlight.routeId);
        return route ? { route, highlight } : undefined;
      })
      .filter((card): card is TrendingRouteCard => card !== undefined);

    renderWithI18n(
      <>
        <TrendingRoutesList cards={cards} />
        <CommunityPickPanel
          pick={communityPick}
          formatDistanceLabel={formatDistanceLabel}
          formatDurationLabel={formatDurationLabel}
          formatSaveCount={formatSaveCount}
        />
      </>,
    );

    expect(screen.getByText("Tiempo limitado — solo primavera")).toBeInTheDocument();
    expect(screen.getByText("Ruta de librerías y bistrós")).toBeInTheDocument();
  });
});
