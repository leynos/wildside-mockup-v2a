/** @file Accented card with gradient background and start-side yellow bar. */

import type { JSX, ReactNode } from "react";

export interface AccentCardProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function AccentCard({ children, className, ...rest }: AccentCardProps): JSX.Element {
  const combinedClassName = ["accent-card", className].filter(Boolean).join(" ");
  return (
    <section className={combinedClassName} {...rest}>
      {children}
    </section>
  );
}
