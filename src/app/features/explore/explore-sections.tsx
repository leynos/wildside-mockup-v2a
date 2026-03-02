/** @file Presentational building blocks for the Explore catalogue screen. */

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { type JSX, type ReactNode, useId } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { formatRating } from "../../data/explore";
import type { Route, RouteCategory, RouteCollection, Theme } from "../../data/explore.models";
import { type BadgeId, getBadgeDescriptor } from "../../data/registries/badges";
import type {
  DifficultyId,
  ResolvedDifficultyDescriptor,
} from "../../data/registries/difficulties";
import {
  type EntityLocalizations,
  type LocaleCode,
  pickLocalization,
} from "../../domain/entities/localization";
import { CommunityPickPanel } from "./explore-community";
import { TrendingRoutesList } from "./explore-trending";

type RouteMetricProps = {
  readonly iconToken: string;
  readonly children: ReactNode;
};

export const defaultRouteCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "route" : "routes"}`;

export const defaultWalkCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "walk" : "walks"}`;

export const defaultSaveCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "save" : "saves"}`;

export function RouteMetric({ iconToken, children }: RouteMetricProps): JSX.Element {
  return (
    <span className="route-metric">
      <Icon token={iconToken} aria-hidden className="h-4 w-4" />
      {children}
    </span>
  );
}

type RouteBadgeProps = {
  readonly id: BadgeId;
  readonly locale: LocaleCode;
};

const safeLocalization = (
  localizations: EntityLocalizations,
  locale: LocaleCode,
  fallbackName: string,
): { readonly name: string; readonly description?: string } => {
  try {
    return pickLocalization(localizations, locale);
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("Falling back to safe localization", { locale, fallbackName, error });
    }
    return { name: fallbackName, description: "" };
  }
};

function RouteBadge({ id, locale }: RouteBadgeProps): JSX.Element {
  const badgeDescriptor = getBadgeDescriptor(id, locale);
  if (!badgeDescriptor && import.meta.env.DEV) {
    // Warn during development to surface missing descriptors early.
    // eslint-disable-next-line no-console
    console.warn(`Missing badge descriptor`, { id, locale });
  }
  const badgeLabel =
    badgeDescriptor?.localization.shortLabel ?? badgeDescriptor?.localization.name ?? id;
  const badgeToneClass = badgeDescriptor?.accentClass ?? "bg-accent text-accent-content";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeToneClass}`}>
      {badgeLabel}
    </span>
  );
}

export interface CategoryScrollerProps {
  categories: readonly RouteCategory[];
}

export function CategoryScroller({ categories }: CategoryScrollerProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as LocaleCode;
  const ariaLabel = t("explore-categories-aria-label", { defaultValue: "Popular categories" });
  const formatRouteCount = (count: number) =>
    t("explore-curated-route-count", {
      count,
      defaultValue: defaultRouteCountLabel(count),
    });
  const headingId = useId();
  return (
    <section className="w-full pt-2" aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {ariaLabel}
      </h2>
      <ScrollArea.Root className="w-full" type="scroll">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-3 pb-2" style={{ paddingInlineEnd: "1.5rem" }}>
            {categories.map((category) => (
              <article
                key={category.id}
                className={`flex min-w-[150px] flex-col gap-1 rounded-lg p-4 text-white ${category.gradientClass}`}
              >
                <Icon token={category.iconToken} className="text-lg" aria-hidden />
                <p className="text-sm font-semibold">
                  {safeLocalization(category.localizations, locale, category.id).name}
                </p>
                <p className="text-xs text-white/70">{formatRouteCount(category.routeCount)}</p>
              </article>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" className="h-1 rounded bg-neutral">
          <ScrollArea.Thumb className="rounded bg-accent" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-neutral" />
      </ScrollArea.Root>
    </section>
  );
}

type FeaturedRouteCardProps = {
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
  route: Route;
};

export function FeaturedRouteCard({
  formatDistanceLabel,
  formatDurationLabel,
  route,
}: FeaturedRouteCardProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as LocaleCode;
  const heading = t("explore-featured-heading", { defaultValue: "Walk of the Week" });
  const headingId = useId();
  const distanceLabel = formatDistanceLabel(route.distanceMetres);
  const durationLabel = formatDurationLabel(route.durationSeconds);
  const localization = safeLocalization(route.localizations, locale, route.id);
  return (
    <section className="explore-featured__panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading text-base-content">
        <Icon token="{icon.object.crown}" className="text-amber-400" aria-hidden />
        {heading}
      </h2>
      <figure className="overflow-hidden rounded-lg border border-neutral">
        <img
          src={route.heroImage.url}
          alt={route.heroImage.alt}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      </figure>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-subheading font-sans text-base-content">{localization.name}</h3>
            <p className="text-sm text-base-content/70">{localization.description}</p>
          </div>
          <div className="explore-stat-group">
            <span className="flex items-center gap-1 font-semibold text-base-content">
              <Icon token="{icon.object.route}" aria-hidden className="h-4 w-4" />
              {distanceLabel}
            </span>
            <span className="mt-1 flex items-center gap-1">
              <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
              {durationLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-base-content/80">
          <span className="rating-indicator">
            <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
            {formatRating(route.rating)}
          </span>
          {route.badges.map((badgeId) => (
            <RouteBadge key={badgeId} id={badgeId} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

type PopularThemesGridProps = {
  formatDistanceRangeLabel: (range: readonly [number, number]) => string;
  themes: readonly Theme[];
};

export function PopularThemesGrid({
  formatDistanceRangeLabel,
  themes,
}: PopularThemesGridProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as LocaleCode;
  const heading = t("explore-popular-heading", { defaultValue: "Popular Themes" });
  const headingId = useId();
  const formatWalkCount = (count: number) =>
    t("explore-theme-walk-count", {
      count,
      defaultValue: defaultWalkCountLabel(count),
    });
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => {
          const localization = safeLocalization(theme.localizations, locale, theme.id);
          return (
            <article key={theme.id} className="explore-compact__card">
              <div className="relative mb-3 h-24 overflow-hidden rounded-lg">
                <img
                  src={theme.image.url}
                  alt={theme.image.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25" />
                <span className="explore-theme__badge">{formatWalkCount(theme.walkCount)}</span>
              </div>
              <h3 className="text-sm font-semibold text-base-content">{localization.name}</h3>
              <p className="mt-1 text-xs text-base-content/60">{localization.description}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
                <span className="flex items-center gap-1">
                  <Icon token="{icon.object.route}" aria-hidden className="h-4 w-4" />
                  {formatDistanceRangeLabel(theme.distanceRangeMetres)}
                </span>
                <span className="rating-indicator">
                  <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
                  {formatRating(theme.rating)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type CuratedCollectionsListProps = {
  collections: readonly RouteCollection[];
  difficultyLookup: Map<DifficultyId, ResolvedDifficultyDescriptor>;
  formatDistanceRangeLabel: (range: readonly [number, number]) => string;
  formatDurationRangeLabel: (range: readonly [number, number]) => string;
};

export function CuratedCollectionsList({
  collections,
  difficultyLookup,
  formatDistanceRangeLabel,
  formatDurationRangeLabel,
}: CuratedCollectionsListProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as LocaleCode;
  const heading = t("explore-curated-heading", { defaultValue: "Curated Collections" });
  const formatRouteCount = (count: number) =>
    t("explore-curated-route-count", {
      count,
      defaultValue: defaultRouteCountLabel(count),
    });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-4">
        {collections.map((collection) => {
          const localization = safeLocalization(collection.localizations, locale, collection.id);
          const difficulty = difficultyLookup.get(collection.difficultyId);
          const badgeToneClass = difficulty?.badgeToneClass ?? "bg-neutral text-base-content";
          return (
            <article key={collection.id} className="explore-collection__card">
              <div className="flex gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-lg border border-neutral">
                  <img
                    src={collection.leadImage.url}
                    alt={collection.leadImage.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-base-content">{localization.name}</h3>
                  <p className="text-sm text-base-content/70">{localization.description}</p>
                  <div className="mt-2 explore-meta-list">
                    <span className="flex items-center gap-1">
                      <Icon token="{icon.object.route}" aria-hidden className="h-4 w-4" />
                      {formatDistanceRangeLabel(collection.distanceRangeMetres)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
                      {formatDurationRangeLabel(collection.durationRangeSeconds)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeToneClass}`}
                    >
                      {difficulty?.label ?? collection.difficultyId}
                    </span>
                  </div>
                </div>
                <div className="explore-stat-group explore-stat-group--right">
                  <span className="text-sm font-semibold text-base-content">
                    {formatRouteCount(collection.routeIds.length)}
                  </span>
                </div>
              </div>
              <figure className="mt-3 h-12 overflow-hidden rounded-lg border border-neutral">
                <img
                  src={collection.mapPreview.url}
                  alt={collection.mapPreview.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </figure>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export { CommunityPickPanel, TrendingRoutesList };
export type { TrendingRouteCard } from "./explore-trending";
