/** @file Hooks for resolving customize fixture data, state, and translations. */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  advancedOptions,
  crowdLevelOptions,
  elevationOptions,
  interestMix,
  resolvedRoutePreviews,
  sliders,
  surfaceOptions,
} from "../../data/customize";
import type { LocaleCode } from "../../domain/entities/localization";
import { resolveLocalization } from "../../lib/localization-runtime";

export const useCustomizeData = (locale: LocaleCode) => {
  const resolvedSliders = useMemo(
    () =>
      sliders.map((slider) => ({
        ...slider,
        localization: resolveLocalization(slider.localizations, locale, slider.id),
      })),
    [locale],
  );

  const sliderInitialValues = useMemo(
    () => Object.fromEntries(sliders.map((slider) => [slider.id, slider.initialValue])),
    [],
  );

  const interestInitialValues = useMemo(
    () => Object.fromEntries(interestMix.map((slice) => [slice.id, slice.allocation])),
    [],
  );

  const advancedInitialValues = useMemo(
    () => Object.fromEntries(advancedOptions.map((option) => [option.id, option.defaultEnabled])),
    [],
  );

  return {
    resolvedSliders,
    sliderInitialValues,
    interestInitialValues,
    advancedInitialValues,
  } as const;
};

export const useCustomizeState = (initialValues: {
  sliders: Record<string, number>;
  interests: Record<string, number>;
  advanced: Record<string, boolean>;
}) => {
  const [sliderValues, setSliderValues] = useState(initialValues.sliders);
  const [crowdLevel, setCrowdLevel] = useState(crowdLevelOptions[1]?.id ?? "balanced");
  const [elevation, setElevation] = useState(elevationOptions[0]?.id ?? "flat");
  const [surface, setSurface] = useState(
    surfaceOptions.find((option) => option.emphasis)?.id ?? surfaceOptions[0]?.id ?? "paved",
  );
  const [interestValues, setInterestValues] = useState(initialValues.interests);
  const [selectedRoute, setSelectedRoute] = useState(resolvedRoutePreviews[0]?.id ?? "route-a");
  const [advancedValues, setAdvancedValues] = useState(initialValues.advanced);

  return {
    sliderValues,
    setSliderValues,
    crowdLevel,
    setCrowdLevel,
    elevation,
    setElevation,
    surface,
    setSurface,
    interestValues,
    setInterestValues,
    selectedRoute,
    setSelectedRoute,
    advancedValues,
    setAdvancedValues,
  } as const;
};

export const useCustomizeTranslations = () => {
  const { t } = useTranslation();

  return {
    headerTitle: t("customize-header-title", { defaultValue: "Customize Route" }),
    headerSubtitle: t("customize-header-subtitle", {
      defaultValue: "Fine-tune your walking adventure",
    }),
    backLabel: t("customize-header-back-label", { defaultValue: "Back to map" }),
    helpLabel: t("customize-header-help-label", { defaultValue: "Help" }),
    crowdHeading: t("customize-crowd-heading", { defaultValue: "Crowd Level" }),
    elevationHeading: t("customize-elevation-heading", { defaultValue: "Elevation Preference" }),
    surfaceHeading: t("customize-surface-heading", { defaultValue: "Surface Type" }),
    surfaceAriaLabel: t("customize-surface-aria-label", { defaultValue: "Surface type" }),
    bottomNavAriaLabel: t("nav-primary-aria-label", { defaultValue: "Primary navigation" }),
  } as const;
};
