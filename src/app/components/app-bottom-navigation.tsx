/** @file Shared bottom navigation bar used in discovery flows. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";

import { Icon } from "./icon";

export interface AppBottomNavigationItem {
  id: string;
  label: string;
  iconToken: string;
  href?: string;
  isActive?: boolean;
}

export interface AppBottomNavigationProps {
  items: AppBottomNavigationItem[];
  "aria-label"?: string;
}

export function AppBottomNavigation({
  items,
  "aria-label": ariaLabel,
}: AppBottomNavigationProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav" aria-label={ariaLabel ?? "Primary navigation"}>
      <div className="bottom-nav__grid">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav__item ${item.isActive ? "bottom-nav__item--active" : ""}`}
            onClick={() => {
              if (item.href) {
                navigate({ to: item.href });
              }
            }}
          >
            <Icon token={item.iconToken} className="text-lg" label={item.label} />
            {item.label}
            {item.isActive ? <span className="bottom-nav__dot" /> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}
