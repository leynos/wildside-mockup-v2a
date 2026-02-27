/** @file Builds translated wizard route stats for step three. */

import type { TFunction } from "i18next";
import { wizardRouteSummary } from "../../../data/wizard";
import { formatDistance, formatDuration, formatStops } from "../../../units/unit-format";
import type { UnitSystem } from "../../../units/unit-system";

export type WizardRouteStatCopy = {
  readonly id: string;
  readonly iconToken: string;
  readonly value: string;
  readonly unitLabel: string;
};

export const buildWizardRouteStats = (
  t: TFunction,
  locale: string,
  unitSystem: UnitSystem,
): WizardRouteStatCopy[] => {
  const unitOptions = { t, locale, unitSystem } as const;
  return wizardRouteSummary.stats.map((stat) => {
    switch (stat.quantity.kind) {
      case "distance": {
        const { value, unitLabel } = formatDistance(stat.quantity.metres, unitOptions);
        return { id: stat.id, iconToken: stat.iconToken, value, unitLabel };
      }
      case "duration": {
        const duration = formatDuration(stat.quantity.seconds, {
          ...unitOptions,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const unitLabel = t("wizard-step-three-route-duration-unit", {
          count: duration.numericValue,
          defaultValue: duration.unitLabel,
        });
        return { id: stat.id, iconToken: stat.iconToken, value: duration.value, unitLabel };
      }
      case "count": {
        const stops = formatStops(stat.quantity.value, {
          ...unitOptions,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const unitLabel = t("wizard-step-three-route-stops-unit", {
          count: stops.numericValue,
          defaultValue: stops.unitLabel,
        });
        return { id: stat.id, iconToken: stat.iconToken, value: stops.value, unitLabel };
      }
      default: {
        return { id: stat.id, iconToken: stat.iconToken, value: "", unitLabel: "" };
      }
    }
  });
};
