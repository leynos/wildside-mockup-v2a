/** @file Vertical route-flow list rendering POI segments with numbered badges and connectors. */

import * as Dialog from "@radix-ui/react-dialog";
import type { TFunction } from "i18next";
import { type JSX, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../../components/button";
import { Icon } from "../../../components/icon";
import type { WalkPointOfInterest } from "../../../data/map";
import { getTagDescriptor, type ResolvedTagDescriptor } from "../../../data/registries/tags";
import { type LocalizedStringSet, pickLocalization } from "../../../domain/entities/localization";
import { useOptionalMapStore } from "../map-state";

// ── Data preparation (inlined — shared component does not export this) ─────

interface POIPresentation {
  localization: LocalizedStringSet;
  categoryDescriptor: ResolvedTagDescriptor | undefined;
  categoryLabel: string;
  tagDescriptors: ResolvedTagDescriptor[];
}

function preparePOIPresentation(poi: WalkPointOfInterest, language: string): POIPresentation {
  const localization = pickLocalization(poi.localizations, language);
  const categoryDescriptor = getTagDescriptor(poi.categoryId, language);
  const categoryLabel = categoryDescriptor?.localization.name ?? localization.name;
  const tagDescriptors = poi.tagIds
    .map((tagId) => getTagDescriptor(tagId, language))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return { localization, categoryDescriptor, categoryLabel, tagDescriptors };
}

// ── RouteFlowSegment (internal) ────────────────────────────────────────────

interface RouteFlowSegmentProps {
  readonly poi: WalkPointOfInterest;
  readonly presentation: POIPresentation;
  readonly index: number;
  readonly isLast: boolean;
  readonly highlightPois?: ((poiIds: readonly string[]) => void) | undefined;
  readonly t: TFunction;
}

function RouteFlowSegment({
  poi,
  presentation,
  index,
  isLast,
  highlightPois,
  t,
}: RouteFlowSegmentProps): JSX.Element {
  const { localization, categoryDescriptor, categoryLabel, tagDescriptors } = presentation;

  const handleHighlight = (ids: readonly string[]) => highlightPois?.(ids);

  const segmentClass = isLast
    ? "route-flow__segment"
    : "route-flow__segment route-flow__segment--connected";

  return (
    <div
      className={`${segmentClass} animate-route-flow-enter`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Dialog.Root>
        <div className="route-flow__row">
          {isLast ? (
            <span className="route-flow__badge route-flow__badge--finish">
              <Icon token="{icon.object.finish}" aria-hidden className="h-4 w-4" />
            </span>
          ) : (
            <span className="route-flow__badge">{index + 1}</span>
          )}
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="route-flow__card"
              onMouseEnter={() => handleHighlight([poi.id])}
              onFocus={() => handleHighlight([poi.id])}
              onMouseLeave={() => handleHighlight([])}
              onBlur={() => handleHighlight([])}
            >
              <h3 className="route-flow__title">{localization.name}</h3>
              {localization.description ? (
                <p className="route-flow__description">{localization.description}</p>
              ) : null}
              <div className="route-flow__meta">
                <span className="flex items-center gap-1">
                  <Icon
                    token={categoryDescriptor?.iconToken ?? "{icon.object.stops}"}
                    className="h-4 w-4"
                    label={categoryLabel}
                  />
                  <span aria-hidden>{categoryLabel}</span>
                </span>
                {tagDescriptors.map((tag) => (
                  <span key={tag.id} className="detail-badge">
                    {tag.localization.name}
                  </span>
                ))}
              </div>
            </button>
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="lightbox-overlay">
            <div className="poi-sheet">
              <div className="poi-list__summary">
                <div>
                  <Dialog.Title className="text-lg font-semibold text-base-content">
                    {localization.name}
                  </Dialog.Title>
                  {localization.description ? (
                    <Dialog.Description className="mt-1 text-sm text-base-content/70">
                      {localization.description}
                    </Dialog.Description>
                  ) : null}
                </div>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="sm">
                    {t("action-close", { defaultValue: "Close" })}
                  </Button>
                </Dialog.Close>
              </div>
              {tagDescriptors.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tagDescriptors.map((tag) => (
                    <span key={tag.id} className="detail-tag text-base-content/70">
                      {tag.localization.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// ── RouteFlowList (exported) ───────────────────────────────────────────────

export interface RouteFlowListProps {
  readonly points: readonly WalkPointOfInterest[];
}

/**
 * Renders points of interest as a vertical route-flow timeline with numbered
 * badges, gradient connector lines, and staggered entry animations.
 */
export function RouteFlowList({ points }: RouteFlowListProps): JSX.Element {
  const mapStore = useOptionalMapStore();
  const highlightPois = mapStore?.actions.highlightPois;
  const { t, i18n } = useTranslation();

  const presentations = useMemo(
    () => points.map((poi) => preparePOIPresentation(poi, i18n.language)),
    [points, i18n.language],
  );

  return (
    <div className="route-flow">
      {points.map((poi, index) => (
        <RouteFlowSegment
          key={poi.id}
          poi={poi}
          // biome-ignore lint/style/noNonNullAssertion: same-length parallel arrays
          presentation={presentations[index]!}
          index={index}
          isLast={index === points.length - 1}
          highlightPois={highlightPois}
          t={t}
        />
      ))}
    </div>
  );
}
