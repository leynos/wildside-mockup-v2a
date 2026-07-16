/** @file Standardized section heading with optional icon. */

import type { JSX, ReactNode } from "react";

import { Icon } from "./icon";

export interface SectionHeadingProps {
  readonly iconToken?: string;
  readonly iconClassName?: string;
  readonly children: ReactNode;
  readonly as?: "h2" | "h3";
}

export function SectionHeading({
  iconToken,
  iconClassName = "text-accent",
  children,
  as = "h2",
}: SectionHeadingProps): JSX.Element {
  const Tag = as;
  return (
    <Tag className="section-heading section-heading--spacious mb-4 text-base-content">
      {iconToken ? <Icon token={iconToken} className={iconClassName} aria-hidden /> : null}
      {children}
    </Tag>
  );
}
