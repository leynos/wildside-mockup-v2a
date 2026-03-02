/** @file Utility wrapper rendering map placeholders with overlay slots. */

import type { JSX, ReactNode } from "react";

export interface MapViewportProps {
  /** Background image URL representing the map snapshot (fallback when map is absent). */
  backgroundImageUrl?: string;
  /** Accessible description for the decorative background. */
  backgroundAlt?: string;
  /** Optional live map canvas rendered beneath the overlays. */
  map?: ReactNode;
  /** Overlay content rendered above the map/placeholder. */
  children?: ReactNode;
  /** Optional gradient overlay appended above the image/map for contrast. */
  gradientClassName?: string;
  /** Extra classes passed to the container. */
  className?: string;
  /** Optional test id applied to the outer container for UI tests. */
  containerTestId?: string;
  /** Accessible label describing the viewport contents. */
  ariaLabel?: string;
}

function joinClassNames(...tokens: Array<string | undefined | null | false>): string {
  return tokens.filter(Boolean).join(" ");
}

/**
 * Provides a consistent map canvas with darkened imagery and overlay slots.
 *
 * @example
 * ```tsx
 * <MapViewport backgroundImageUrl="/mock.png" backgroundAlt="City map">
 *   <div className="absolute inset-0">Controls</div>
 * </MapViewport>
 * ```
 */
export function MapViewport({
  ariaLabel,
  backgroundAlt,
  backgroundImageUrl,
  children,
  className,
  gradientClassName,
  containerTestId,
  map,
}: MapViewportProps): JSX.Element {
  const containerClasses = joinClassNames(
    "relative flex flex-1 min-h-0 flex-col justify-end overflow-hidden",
    className,
  );
  const regionAttributes = ariaLabel ? { role: "region", "aria-label": ariaLabel } : {};

  return (
    <div className={containerClasses} data-testid={containerTestId} {...regionAttributes}>
      {map ? (
        <div className="absolute inset-0" role="presentation">
          {map}
        </div>
      ) : null}
      {!map && backgroundImageUrl ? (
        <img
          src={backgroundImageUrl}
          alt={backgroundAlt ?? "Map background"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {gradientClassName ? (
        <div
          className={`pointer-events-none absolute inset-0 ${gradientClassName}`}
          aria-hidden="true"
        />
      ) : null}
      <div className="relative z-[1] flex h-full flex-col justify-end" role="presentation">
        {children}
      </div>
    </div>
  );
}
