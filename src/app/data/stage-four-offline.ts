/** @file Stage 4 fixtures for offline flows (suggestions and downloads). */

import type { EntityLocalizations, ImageAsset } from "../domain/entities/localization";
import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";

export type { OfflineSuggestion } from "./offline-models";

/**
 * Prefix an asset path with the Vite `BASE_URL` so fixtures resolve correctly
 * when the app is hosted under a sub-path.
 *
 * The URL normalization collapses duplicate slashes whilst preserving protocol
 * separators (so `https://example.com//foo` remains a valid absolute URL).
 *
 * Absolute URLs (including protocol-relative ones) are returned unchanged so
 * fixture authors can reference remote thumbnails when needed.
 *
 * @example
 * // BASE_URL = "/app/"
 * // path = "images/foo.png"
 * // url = "/app/images/foo.png"
 */
const withBasePath = (path: string, alt: string): ImageAsset => {
  if (/^(https?:)?\/\//u.test(path) || /^[a-zA-Z][a-zA-Z\d+\-.]*:/u.test(path)) {
    return { url: path, alt };
  }

  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const cleanedPath = path.replace(/^\/+/, "");
  // Collapse duplicate slashes but preserve protocol separators (://).
  const url = `${normalizedBase}${cleanedPath}`.replace(/([^:]\/)\/+/g, "$1");
  return { url, alt };
};

const localize = (
  base: Parameters<typeof localizeAcrossLocales>[0],
  overrides: Parameters<typeof localizeAcrossLocales>[1] = {},
  context?: string,
): EntityLocalizations =>
  fillLocalizations(localizeAcrossLocales(base, overrides), "en-GB", context);

/**
 * A downloaded offline map area with progress and status metadata.
 *
 * @property id - Unique identifier for the map area.
 * @property localizations - Localized name and description for display.
 * @property image - Thumbnail image asset for the area.
 * @property sizeBytes - Total download size in bytes.
 * @property progress - Download progress as a decimal (0 to 1).
 * @property status - Current download state: complete, updating, or downloading.
 * @property lastUpdatedAt - ISO 8601 timestamp of last update.
 */
export interface OfflineMapArea {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly image: ImageAsset;
  readonly sizeBytes: number;
  readonly progress: number;
  readonly status: "complete" | "updating" | "downloading";
  readonly lastUpdatedAt: string;
}

/**
 * Configuration option for automatic offline map management.
 *
 * @property id - Unique identifier for the option.
 * @property localizations - Localized name and description for display.
 * @property iconToken - Design token for the option icon.
 * @property iconClassName - Tailwind classes for icon styling.
 * @property defaultEnabled - Whether the option is enabled by default.
 * @property retentionDays - Number of days to retain maps (for auto-delete option).
 */
export type AutoManagementOptionId = "auto-delete" | "wifi-only" | "auto-update";

export interface AutoManagementOption {
  readonly id: AutoManagementOptionId;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly iconClassName: string;
  readonly defaultEnabled: boolean;
  readonly retentionDays?: number;
}

export { offlineSuggestions } from "./offline-fixtures";

export const offlineMapAreas: ReadonlyArray<OfflineMapArea> = [
  {
    id: "nyc",
    localizations: localize(
      { name: "New York, NY", description: "Downtown and Brooklyn offline pack" },
      { es: { name: "Nueva York, NY", description: "Paquete offline de Downtown y Brooklyn" } },
      "offline-area: nyc",
    ),
    image: withBasePath("images/empire.png", "Empire State Building viewed from above"),
    sizeBytes: 847 * 1024 ** 2,
    progress: 1,
    status: "complete",
    lastUpdatedAt: "2025-11-29T15:00:00Z",
  },
  {
    id: "sf",
    localizations: localize(
      { name: "San Francisco, CA", description: "Waterfront and downtown core" },
      { es: { name: "San Francisco, CA", description: "Embarcadero y centro de la ciudad" } },
      "offline-area: sf",
    ),
    image: withBasePath("images/goldengate.png", "Golden Gate Bridge from an overlook"),
    sizeBytes: 623 * 1024 ** 2,
    progress: 1,
    status: "complete",
    lastUpdatedAt: "2025-11-23T10:00:00Z",
  },
  {
    id: "london",
    localizations: localize(
      { name: "London, UK", description: "Central London with Thames overlays" },
      { es: { name: "Londres, Reino Unido", description: "Centro de Londres y el Támesis" } },
      "offline-area: london",
    ),
    image: withBasePath("images/londoneye.png", "London skyline with the London Eye"),
    sizeBytes: Math.round(1.2 * 1024 ** 3),
    progress: 0.65,
    status: "downloading",
    lastUpdatedAt: "2025-12-04T08:30:00Z",
  },
];

export const autoManagementOptions: ReadonlyArray<AutoManagementOption> = [
  {
    id: "auto-delete",
    localizations: localize(
      { name: "Auto-delete old maps", description: "Remove maps after a retention window" },
      {},
      "offline-auto: auto-delete",
    ),
    iconToken: "{icon.offline.delete}",
    iconClassName: "text-amber-400",
    defaultEnabled: true,
    retentionDays: 30,
  },
  {
    id: "wifi-only",
    localizations: localize(
      { name: "Wi-Fi-only downloads", description: "Download maps only on trusted networks" },
      {},
      "offline-auto: wifi-only",
    ),
    iconToken: "{icon.offline.connectivity}",
    iconClassName: "text-accent",
    defaultEnabled: true,
  },
  {
    id: "auto-update",
    localizations: localize(
      { name: "Auto-update maps", description: "Keep offline areas fresh in the background" },
      {},
      "offline-auto: auto-update",
    ),
    iconToken: "{icon.offline.sync}",
    iconClassName: "text-purple-400",
    defaultEnabled: false,
  },
];
