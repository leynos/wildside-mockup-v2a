/** @file Download and undo cards for offline map areas. */

import type { TFunction } from "i18next";
import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import type { OfflineMapArea } from "../../../data/stage-four";
import type { OfflineDownloadMetaComponent, OfflineDownloadMetaProps } from "./offline-meta";

export type DownloadEntry =
  | { kind: "download"; area: OfflineMapArea }
  | { kind: "undo"; area: OfflineMapArea };

export type DownloadStatusLabels = {
  statusCompleteLabel: string;
  statusUpdatingLabel: string;
  statusDownloadingLabel: string;
};

export type { OfflineDownloadMetaProps };

export type FormatAreaCopy = (area: OfflineMapArea) => {
  readonly localization: { name: string; description?: string };
  readonly sizeLabel: string;
  readonly updatedLabel: string;
};

export type OfflineDownloadCardProps = {
  readonly entry: DownloadEntry;
  readonly isManaging: boolean;
  readonly statusLabels: DownloadStatusLabels;
  readonly formatAreaCopy: FormatAreaCopy;
  readonly percentFormatter: Intl.NumberFormat;
  readonly undoDescription: string;
  readonly undoDescriptionDefault: string;
  readonly undoButtonLabel: string;
  readonly MetaComponent: OfflineDownloadMetaComponent;
  readonly renderStatusBadge: (
    status: OfflineMapArea["status"],
    labels: DownloadStatusLabels,
  ) => JSX.Element | null;
  readonly onDelete: (downloadId: string) => void;
  readonly onUndo: (downloadId: string) => void;
  readonly t: TFunction;
};

export function OfflineDownloadCard({
  entry,
  isManaging,
  statusLabels,
  formatAreaCopy,
  percentFormatter,
  undoDescription,
  undoDescriptionDefault,
  undoButtonLabel,
  MetaComponent,
  renderStatusBadge,
  onDelete,
  onUndo,
  t,
}: OfflineDownloadCardProps): JSX.Element {
  const area = entry.area;
  const { localization, sizeLabel, updatedLabel } = formatAreaCopy(area);
  // Clamp progress to valid percentage bounds (0-100%), defaulting to 0 for non-finite values
  const clampedProgress = Number.isFinite(area.progress)
    ? Math.max(0, Math.min(1, area.progress))
    : 0;
  const progressPercent = percentFormatter.format(clampedProgress);

  if (entry.kind === "undo") {
    return (
      <article
        data-testid="offline-undo-card"
        className="offline-download__undo"
        aria-label={t("offline-downloads-undo-aria", {
          title: localization.name,
          description: undoDescriptionDefault,
          defaultValue: "{{title}} deleted. {{description}}",
        })}
      >
        <div>
          <p className="font-semibold">
            {t("offline-downloads-undo-title", {
              title: localization.name,
              defaultValue: `${localization.name} deleted`,
            })}
          </p>
          <MetaComponent>{undoDescription}</MetaComponent>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => onUndo(area.id)}
          data-testid="offline-undo-button"
        >
          {undoButtonLabel}
        </button>
      </article>
    );
  }

  return (
    <article
      data-testid="offline-download-card"
      className="offline-download__card"
      aria-labelledby={`${area.id}-title`}
    >
      {isManaging ? (
        <button
          type="button"
          data-testid="offline-delete-button"
          aria-label={t("offline-downloads-delete-aria", {
            title: localization.name,
            defaultValue: `Delete ${localization.name}`,
          })}
          className="offline-download__dismiss"
          onClick={() => onDelete(area.id)}
        >
          <Icon token="{icon.action.remove}" className="text-lg" aria-hidden />
        </button>
      ) : null}
      <img
        src={area.image.url}
        alt={area.image.alt}
        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
      />
      <div className="flex-1">
        <div className="split-row">
          <div>
            <h3 id={`${area.id}-title`} className="font-semibold text-base-content">
              {localization.name}
            </h3>
            <MetaComponent>
              {updatedLabel} • {sizeLabel}
            </MetaComponent>
          </div>
          {renderStatusBadge(area.status, statusLabels)}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-neutral">
            <div
              className={`h-1.5 rounded-full ${area.status === "downloading" ? "bg-accent/60" : "bg-accent"}`}
              style={{ width: `${Math.round(clampedProgress * 100)}%` }}
            />
          </div>
          <MetaComponent as="span">{progressPercent}</MetaComponent>
        </div>
      </div>
    </article>
  );
}
