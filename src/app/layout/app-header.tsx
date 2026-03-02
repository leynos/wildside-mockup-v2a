/** @file Shared top navigation bar for primary Wildside screens. */

import type { JSX, ReactNode } from "react";

import { useDisplayMode } from "../providers/display-mode-provider";

export interface AppHeaderProps {
  /** Main heading displayed within the shell. */
  title: string;
  /** Optional secondary text beneath the title. */
  subtitle?: string | undefined;
  /** Slot for leading controls (e.g., back button). */
  leading?: ReactNode;
  /** Slot for trailing controls (e.g., settings, theme toggle). */
  trailing?: ReactNode;
  /** Optional slot rendered beneath the primary heading row. */
  children?: ReactNode;
  /** Visual variant for the header shell. */
  variant?: "default" | "wizard";
}

/**
 * Presents a consistent header layout with optional leading/trailing actions.
 *
 * @example
 * ```tsx
 * <AppHeader
 *   title="Discover"
 *   subtitle="Explore curated walks"
 *   trailing={<button className="btn btn-sm btn-ghost">Menu</button>}
 * />
 * ```
 */
export function AppHeader({
  children,
  leading,
  subtitle,
  title,
  trailing,
  variant = "default",
}: AppHeaderProps): JSX.Element {
  const isWizard = variant === "wizard";
  const { isFullBrowser } = useDisplayMode();

  const headerClassName = [
    "select-none px-6 bg-base-200 text-base-content",
    isWizard ? "py-6" : "border-b border-neutral pb-4 pt-8",
    isFullBrowser ? "sticky top-0 inset-x-0 z-30" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isWizard) {
    return (
      <header className={headerClassName}>
        <div className="mb-6 flex items-center justify-between">
          <div>{leading}</div>
          <div>{children}</div>
        </div>
        <h1 className="brand-heading mb-2 text-3xl">{title}</h1>
        {subtitle ? <p className="text-sm text-base-content/60">{subtitle}</p> : null}
      </header>
    );
  }

  const leadingContainerClassName =
    "flex h-10 w-10 items-center justify-center rounded-full border border-neutral bg-base-200 text-base-content/80";

  const trailingContainerClassName = "flex items-center gap-2 text-base-content/80";

  const subtitleClassName = "text-sm font-medium text-base-content/60";

  return (
    <header className={headerClassName}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {leading ? <div className={leadingContainerClassName}>{leading}</div> : null}
          <div className="flex-1 text-start">
            <h1 className="brand-heading">{title}</h1>
            {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
          </div>
        </div>
        {trailing ? <div className={trailingContainerClassName}>{trailing}</div> : null}
      </div>
      {children ? <div className="mt-4 space-y-2">{children}</div> : null}
    </header>
  );
}
