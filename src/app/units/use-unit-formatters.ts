/** @file Exposes a hook that consumers call to obtain memoized unit-formatting helpers. */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  formatDistance,
  formatDuration,
  formatEnergy,
  formatStops,
  formatTemperature,
  type LocalisedUnitValue,
  type UnitFormatOptions,
} from "./unit-format";
import { useUnitPreferences } from "./unit-preferences-provider";

type FormatterOverrides = Partial<
  Pick<UnitFormatOptions, "minimumFractionDigits" | "maximumFractionDigits">
>;

type FormatFn = (value: number, overrides?: FormatterOverrides) => LocalisedUnitValue;

export interface UnitFormatters {
  readonly unitOptions: UnitFormatOptions;
  readonly unitSystem: UnitFormatOptions["unitSystem"];
  readonly formatDistanceValue: FormatFn;
  readonly formatDurationValue: FormatFn;
  readonly formatStopsValue: FormatFn;
  readonly formatTemperatureValue: FormatFn;
  readonly formatEnergyValue: FormatFn;
}

export const useUnitFormatters = (): UnitFormatters => {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();

  const unitOptions = useMemo<UnitFormatOptions>(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

  const formatDistanceValue = useCallback<FormatFn>(
    (metres, overrides) => formatDistance(metres, { ...unitOptions, ...(overrides ?? {}) }),
    [unitOptions],
  );

  const formatDurationValue = useCallback<FormatFn>(
    (seconds, overrides) => formatDuration(seconds, { ...unitOptions, ...(overrides ?? {}) }),
    [unitOptions],
  );

  const formatStopsValue = useCallback<FormatFn>(
    (value, overrides) => formatStops(value, { ...unitOptions, ...(overrides ?? {}) }),
    [unitOptions],
  );

  const formatTemperatureValue = useCallback<FormatFn>(
    (celsius, overrides) => formatTemperature(celsius, { ...unitOptions, ...(overrides ?? {}) }),
    [unitOptions],
  );

  const formatEnergyValue = useCallback<FormatFn>(
    (kilocalories, overrides) =>
      formatEnergy(kilocalories, { ...unitOptions, ...(overrides ?? {}) }),
    [unitOptions],
  );

  return {
    unitOptions,
    unitSystem,
    formatDistanceValue,
    formatDurationValue,
    formatStopsValue,
    formatTemperatureValue,
    formatEnergyValue,
  };
};
