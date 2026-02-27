/** @file Bottom navigation used across map-related flows. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { type BottomNavigationItem, bottomNavigation } from "../data/customize";
import { AppBottomNavigation, type AppBottomNavigationItem } from "./app-bottom-navigation";

export interface MapBottomNavigationProps {
  /** Route identifier that should render in an active state. */
  activeId: string;
  /** Navigation items shown along the bottom edge. */
  items?: BottomNavigationItem[];
}

export function MapBottomNavigation({ activeId, items }: MapBottomNavigationProps): JSX.Element {
  const { t } = useTranslation();
  const resolvedSource = items && items.length > 0 ? items : bottomNavigation;

  const appItems: AppBottomNavigationItem[] = resolvedSource.map((item) => ({
    id: item.id,
    label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
    iconToken: item.iconToken,
    ...(item.href !== undefined && { href: item.href }),
    isActive: item.id === activeId,
  }));

  return <AppBottomNavigation items={appItems} />;
}
