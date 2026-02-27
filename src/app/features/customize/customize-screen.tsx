/** @file Route customiser translating slider-heavy mockups to Radix UI. */
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Icon } from "../../components/icon";
import { bottomNavigation, formatSliderValue } from "../../data/customize";
import { AppHeader } from "../../layout/app-header";
import { MobileShell } from "../../layout/mobile-shell";
import { coerceLocaleCode } from "../../lib/localization-runtime";
import { useUnitFormatters } from "../../units/use-unit-formatters";
import { useUnitLabelFormatters } from "../../units/use-unit-labels";
import { CustomizeContent } from "./customize-content";
import {
  useCustomizeData,
  useCustomizeState,
  useCustomizeTranslations,
} from "./use-customize-data";

export function CustomizeScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = coerceLocaleCode(i18n.language);
  const translations = useCustomizeTranslations();
  const navigate = useNavigate();
  const { unitSystem } = useUnitFormatters();
  const { formatDistanceLabel: fmtDistRaw, formatDurationLabel: fmtDurRaw } =
    useUnitLabelFormatters();
  const { resolvedSliders, sliderInitialValues, interestInitialValues, advancedInitialValues } =
    useCustomizeData(locale);
  const state = useCustomizeState({
    sliders: sliderInitialValues,
    interests: interestInitialValues,
    advanced: advancedInitialValues,
  });
  const formatSlider = useCallback(
    (id: string, value: number) => formatSliderValue(id, value, t, i18n.language, unitSystem),
    [t, i18n.language, unitSystem],
  );
  return (
    <MobileShell
      tone="dark"
      background={
        <div className="h-full w-full bg-gradient-to-b from-base-300 via-transparent to-transparent" />
      }
    >
      <div className="screen-stack">
        <AppHeader
          title={translations.headerTitle}
          subtitle={translations.headerSubtitle}
          leading={
            <button
              type="button"
              aria-label={translations.backLabel}
              className="header-nav-button"
              onClick={() => navigate({ to: "/map/quick" })}
            >
              <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
            </button>
          }
          trailing={
            <button
              type="button"
              aria-label={translations.helpLabel}
              className="header-icon-button"
            >
              <Icon token="{icon.action.help}" aria-hidden className="h-5 w-5" />
            </button>
          }
        />
        <CustomizeContent
          sliders={resolvedSliders}
          sliderValues={state.sliderValues}
          onSliderChange={(id, value) =>
            state.setSliderValues((current) => ({ ...current, [id]: value }))
          }
          formatSliderValue={formatSlider}
          crowdLabel={translations.crowdHeading}
          elevationLabel={translations.elevationHeading}
          crowdValue={state.crowdLevel}
          elevationValue={state.elevation}
          onCrowdChange={state.setCrowdLevel}
          onElevationChange={state.setElevation}
          surfaceHeading={translations.surfaceHeading}
          surfaceAriaLabel={translations.surfaceAriaLabel}
          surfaceValue={state.surface}
          onSurfaceChange={state.setSurface}
          interestValues={state.interestValues}
          onInterestChange={(id, value) =>
            state.setInterestValues((current) => ({
              ...current,
              [id]: Math.min(100, Math.max(0, value)),
            }))
          }
          selectedRoute={state.selectedRoute}
          onRouteSelect={state.setSelectedRoute}
          formatDistanceLabel={(metres) =>
            fmtDistRaw(metres, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
          }
          formatDurationLabel={(seconds) =>
            fmtDurRaw(seconds, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
          }
          advancedValues={state.advancedValues}
          onAdvancedToggle={(id, value) =>
            state.setAdvancedValues((current) => ({ ...current, [id]: value }))
          }
        />
        <AppBottomNavigation
          aria-label={translations.bottomNavAriaLabel}
          items={bottomNavigation.map((item) => ({
            ...item,
            label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
            isActive: Boolean(item.active),
          }))}
        />
      </div>
    </MobileShell>
  );
}
