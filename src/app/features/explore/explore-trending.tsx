/** @file Trending routes list for the Explore screen. */

import { type JSX, useId } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import type { Route, TrendingRouteHighlight } from "../../data/explore.models";
import {
  type EntityLocalizations,
  type LocaleCode,
  pickLocalization,
} from "../../domain/entities/localization";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../../i18n/supported-locales";

export type TrendingRouteCard = {
  readonly route: Route;
  readonly highlight: TrendingRouteHighlight;
};

type TrendingRouteViewModel = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly trendDelta: string;
};

const safePickLocalization = (
  localizations: EntityLocalizations,
  locale: LocaleCode,
  fallbackName: string,
) => {
  try {
    return pickLocalization(localizations, locale);
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("Missing localisation for trending route card", {
        locale,
        fallbackName,
        error,
      });
    }
    return { name: fallbackName };
  }
};

/**
 * Map a trending route card to a view model with resolved localisation.
 *
 * @param card - Trending route data containing a route and its highlight meta.
 * @param locale - Locale code to resolve localised strings.
 * @returns A view model ready for rendering.
 *
 * @example
 * ```ts
 * const card = {
 *   route: {
 *     id: "harbour-lights",
 *     localizations: { "en-GB": { name: "Harbour Lights", description: "Sunset loop" } },
 *     heroImage: { url: "/harbour.jpg", alt: "Harbour at dusk" },
 *   },
 *   highlight: {
 *     trendDelta: "+25%",
 *     subtitleLocalizations: { "en-GB": { name: "Weekly favourite" } },
 *   },
 * };
 *
 * const viewModel = toTrendingRouteViewModel(card, "en-GB");
 * // viewModel = {
 * //   id: "harbour-lights",
 * //   title: "Harbour Lights",
 * //   subtitle: "Weekly favourite",
 * //   imageUrl: "/harbour.jpg",
 * //   imageAlt: "Harbour at dusk",
 * //   trendDelta: "+25%",
 * // }
 * ```
 */
const toTrendingRouteViewModel = (
  card: TrendingRouteCard,
  locale: LocaleCode,
): TrendingRouteViewModel => {
  const { route, highlight } = card;
  const routeLocalization = safePickLocalization(route.localizations, locale, route.id);
  const subtitle = safePickLocalization(highlight.subtitleLocalizations, locale, route.id).name;

  return {
    id: route.id,
    title: routeLocalization.name,
    subtitle,
    imageUrl: route.heroImage.url,
    imageAlt: route.heroImage.alt,
    trendDelta: highlight.trendDelta,
  };
};

type TrendingRoutesListProps = {
  readonly cards: readonly TrendingRouteCard[];
};

const toLocaleCode = (value: string | undefined): LocaleCode => {
  const supportedCodes = SUPPORTED_LOCALES.map((locale) => locale.code) as readonly LocaleCode[];
  return supportedCodes.find((code) => code === value) ?? (DEFAULT_LOCALE as LocaleCode);
};

export function TrendingRoutesList({ cards }: TrendingRoutesListProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = toLocaleCode(i18n.language);
  const heading = t("explore-trending-heading", { defaultValue: "Trending Now" });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-3">
        {cards.map((card) => {
          const viewModel = toTrendingRouteViewModel(card, locale);
          return (
            <article key={viewModel.id} className="explore-trending__card">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                  <img
                    src={viewModel.imageUrl}
                    alt={viewModel.imageAlt}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-base-content">{viewModel.title}</p>
                  <p className="text-xs text-base-content/60">{viewModel.subtitle}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                  <Icon token="{icon.object.trend}" aria-hidden className="h-4 w-4" />
                  {viewModel.trendDelta}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export type { TrendingRoutesListProps };
