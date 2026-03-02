/** @file Shared list rendering points of interest with Radix dialog sheets. */

import * as Dialog from "@radix-ui/react-dialog";
import type { TFunction } from "i18next";
import { type JSX, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkPointOfInterest } from "../data/map";
import { getTagDescriptor, type ResolvedTagDescriptor } from "../data/registries/tags";
import { type LocalizedStringSet, pickLocalization } from "../domain/entities/localization";
import { useOptionalMapStore } from "../features/map/map-state";
import { Button } from "./button";
import { Icon } from "./icon";

interface POIPresentation {
  localization: LocalizedStringSet;
  categoryDescriptor: ResolvedTagDescriptor | undefined;
  categoryLabel: string;
  tagDescriptors: ResolvedTagDescriptor[];
  formattedRating: string | undefined;
  openHoursCopy: string | null;
}

interface PointOfInterestItemProps {
  poi: WalkPointOfInterest;
  presentation: POIPresentation;
  highlightPois?: ((poiIds: readonly string[]) => void) | undefined;
  highlightBadgeLabel: string;
  t: TFunction;
}

const preparePOIPresentation = (
  poi: WalkPointOfInterest,
  language: string,
  t: TFunction,
  ratingFormatter: Intl.NumberFormat,
): POIPresentation => {
  const localization = pickLocalization(poi.localizations, language);
  const categoryDescriptor = getTagDescriptor(poi.categoryId, language);
  const categoryLabel = categoryDescriptor?.localization.name ?? localization.name;
  const tagDescriptors = poi.tagIds
    .map((tagId) => getTagDescriptor(tagId, language))
    .filter((descriptor): descriptor is NonNullable<typeof descriptor> => Boolean(descriptor));
  const formattedRating =
    typeof poi.rating === "number" ? ratingFormatter.format(poi.rating) : undefined;
  const openHoursCopy = poi.openHours
    ? t("poi-open-hours", {
        opensAt: poi.openHours.opensAt,
        closesAt: poi.openHours.closesAt,
        defaultValue: `${poi.openHours.opensAt}–${poi.openHours.closesAt}`,
      })
    : null;

  return {
    localization,
    categoryDescriptor,
    categoryLabel,
    tagDescriptors,
    formattedRating,
    openHoursCopy,
  };
};

const PointOfInterestItem = ({
  poi,
  presentation,
  highlightPois,
  highlightBadgeLabel,
  t,
}: PointOfInterestItemProps): JSX.Element => {
  const {
    localization,
    categoryDescriptor,
    categoryLabel,
    tagDescriptors,
    formattedRating,
    openHoursCopy,
  } = presentation;

  const handleHighlight = (ids: readonly string[]) => highlightPois?.(ids);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="poi-list__item"
          onMouseEnter={() => handleHighlight([poi.id])}
          onFocus={() => handleHighlight([poi.id])}
          onMouseLeave={() => handleHighlight([])}
          onBlur={() => handleHighlight([])}
        >
          <div className="poi-list__summary">
            <div>
              <h3 className="text-base font-semibold text-base-content">{localization.name}</h3>
              {localization.description ? (
                <p className="mt-1 text-sm text-base-content/70">{localization.description}</p>
              ) : null}
            </div>
            {formattedRating ? (
              <span className="rating-indicator rating-indicator--strong">
                <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
                {formattedRating}
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-accent">
            <span className="poi-highlight">
              <Icon
                token={categoryDescriptor?.iconToken ?? "{icon.object.marker}"}
                className={`h-4 w-4 ${categoryDescriptor?.accentClass ?? ""}`.trim()}
                label={categoryLabel}
              />
              <span aria-hidden>{highlightBadgeLabel}</span>
            </span>
            {tagDescriptors.map((tag) => (
              <span key={tag.id} className="detail-badge text-base-content/70">
                {tag.localization.name}
              </span>
            ))}
          </div>
        </button>
      </Dialog.Trigger>
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
            <div className="mt-4 space-y-2 text-sm text-base-content/70">
              {tagDescriptors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tagDescriptors.map((tag) => (
                    <span key={tag.id} className="detail-tag">
                      {tag.localization.name}
                    </span>
                  ))}
                </div>
              ) : null}
              {openHoursCopy ? (
                <p className="flex items-center gap-2 text-xs text-base-content/60">
                  <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
                  {openHoursCopy}
                </p>
              ) : null}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export interface PointOfInterestListProps {
  readonly points: readonly WalkPointOfInterest[];
}

export function PointOfInterestList({ points }: PointOfInterestListProps): JSX.Element {
  const mapStore = useOptionalMapStore();
  const highlightPois = mapStore?.actions.highlightPois;
  const { t, i18n } = useTranslation();
  const highlightBadgeLabel = t("poi-highlight-label", { defaultValue: "Highlight" });
  const ratingFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [i18n.language],
  );

  return (
    <div className="space-y-3">
      {points.map((poi) => {
        const presentation = preparePOIPresentation(poi, i18n.language, t, ratingFormatter);
        return (
          <PointOfInterestItem
            key={poi.id}
            poi={poi}
            presentation={presentation}
            highlightPois={highlightPois}
            highlightBadgeLabel={highlightBadgeLabel}
            t={t}
          />
        );
      })}
    </div>
  );
}
