/** @file Walk wizard step three: review summary and confirm dialog. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import type { TFunction } from "i18next";
import { type JSX, type ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { WizardLayout } from "../../../components/wizard-layout";
import { WizardSection, type WizardSectionProps } from "../../../components/wizard-section";
import {
  wizardGeneratedStops,
  wizardRouteSummary,
  wizardSteps,
  wizardSummaryHighlights,
} from "../../../data/wizard";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatDistance, type UnitToken } from "../../../units/unit-format";
import { useUnitPreferences } from "../../../units/unit-preferences-provider";
import type { UnitSystem } from "../../../units/unit-system";
import { buildWizardRouteStats } from "./build-wizard-route-stats";
import { buildWizardWeatherCopy } from "./build-wizard-weather-copy";

type DistanceUnitToken = Extract<UnitToken, "distance-mile" | "distance-kilometre">;

type StopDistanceUnitKey =
  | "wizard-step-three-stop-distance-unit-km"
  | "wizard-step-three-stop-distance-unit-mi";

/** Maps unit tokens to translation keys for stop distance units. */
const unitTokenToKey = {
  "distance-mile": "wizard-step-three-stop-distance-unit-mi",
  "distance-kilometre": "wizard-step-three-stop-distance-unit-km",
} as const satisfies Record<DistanceUnitToken, StopDistanceUnitKey>;

const formatValueWithUnitLabel = (value: string, unitLabel: string): string => {
  if (!unitLabel) return value;
  const hasLeadingWhitespace = /^[\s\u00A0\u202F]/u.test(unitLabel);
  return `${value}${hasLeadingWhitespace ? "" : " "}${unitLabel}`;
};

type WizardSummaryPanelProps = WizardSectionProps & {
  readonly className?: string;
  readonly children: ReactNode;
};

function WizardSummaryPanel({
  className,
  children,
  ...rest
}: WizardSummaryPanelProps): JSX.Element {
  const classNames = className ? `wizard-summary__panel ${className}` : "wizard-summary__panel";

  return (
    <WizardSection className={classNames} {...rest}>
      {children}
    </WizardSection>
  );
}

type NavigateFn = ReturnType<typeof useNavigate>;
type NavigateTo = NonNullable<Parameters<NavigateFn>[0]["to"]>;

export interface WizardStepThreeViewProps {
  readonly t: TFunction;
  readonly language: string;
  readonly unitSystem: UnitSystem;
  readonly navigateTo: (to: NavigateTo) => void;
}

export function WizardStepThreeView({
  t,
  language,
  unitSystem,
  navigateTo,
}: WizardStepThreeViewProps): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);
  const helpMessage = t("wizard-help-placeholder", {
    defaultValue: "Contextual help coming soon",
  });
  const routeStats = useMemo(
    () => buildWizardRouteStats(t, language, unitSystem),
    [t, language, unitSystem],
  );
  const weatherCopy = useMemo(
    () => buildWizardWeatherCopy(t, language, unitSystem),
    [t, language, unitSystem],
  );

  const routeLocalization = pickLocalization(wizardRouteSummary.localizations, language);
  const routeTitle = routeLocalization.name;
  const routeDescription = routeLocalization.description;
  const badgeTitle = pickLocalization(wizardRouteSummary.badgeLocalizations, language).name;

  return (
    <WizardLayout
      steps={wizardSteps}
      activeStepId="step-3"
      onBack={() => navigateTo("/wizard/step-2")}
      onHelp={() => window.alert(helpMessage)}
      footer={
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigateTo("/wizard/step-1")}
          >
            {t("wizard-step-three-start-over", { defaultValue: "Start over" })}
          </button>
          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="btn btn-accent btn-lg w-full">
                {t("wizard-step-three-save-button", {
                  defaultValue: "Save walk and view map",
                })}
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
              <Dialog.Content className="dialog-surface">
                {dialogOpen
                  ? (() => {
                      return (
                        <>
                          <Dialog.Title className="text-lg font-semibold text-base-content">
                            {t("wizard-step-three-dialog-title", {
                              defaultValue: "Walk saved!",
                            })}
                          </Dialog.Title>
                          <Dialog.Description className="text-sm text-base-content/70">
                            {t("wizard-step-three-dialog-description", {
                              routeTitle,
                              defaultValue: `${routeTitle} is ready under your saved walks. Start the route now or continue exploring other wizard options.`,
                            })}
                          </Dialog.Description>
                        </>
                      );
                    })()
                  : null}
                <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button type="button" className="btn btn-ghost btn-sm">
                      {t("wizard-step-three-dialog-close", {
                        defaultValue: "Close",
                      })}
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={() => navigateTo("/map/quick")}
                  >
                    {t("wizard-step-three-dialog-view-map", {
                      defaultValue: "View on map",
                    })}
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      }
    >
      <WizardSummaryPanel
        aria-label={t("wizard-step-three-route-panel-aria", {
          routeName: routeTitle,
          defaultValue: "{{routeName}}",
        })}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{routeTitle}</h2>
          <span className="wizard-badge font-semibold">{badgeTitle}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-base-content/70">
          {routeStats.map((stat) => (
            <div key={stat.id}>
              <p className="font-display text-lg font-bold text-accent">{stat.value}</p>
              <p>{stat.unitLabel}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-base-content/70">{routeDescription}</p>
      </WizardSummaryPanel>

      <WizardSummaryPanel
        aria-label={t("wizard-step-three-preferences-panel-aria", {
          defaultValue: "Your preferences applied",
        })}
      >
        <h3 className="text-lg font-semibold">
          {t("wizard-step-three-preferences-heading", {
            defaultValue: "Your preferences applied",
          })}
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {wizardSummaryHighlights.map((highlight) => {
            const localized = pickLocalization(highlight.localizations, language);
            return (
              <div key={highlight.id} className="wizard-summary__highlight">
                <Icon
                  token={highlight.iconToken}
                  className="wizard-summary__highlight-icon"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold">{localized.name}</p>
                  <p className="text-xs text-base-content/60">{localized.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel
        aria-label={t("wizard-step-three-stops-panel-aria", {
          defaultValue: "Featured stops",
        })}
      >
        <h3 className="text-lg font-semibold">
          {t("wizard-step-three-stops-heading", {
            defaultValue: "Featured stops",
          })}
        </h3>
        <div className="mt-4 space-y-3">
          {wizardGeneratedStops.map((stop) => {
            const localized = pickLocalization(stop.localizations, language);
            const noteLocalized = pickLocalization(stop.noteLocalizations, language);
            const distanceLabel =
              stop.noteDistanceMetres != null
                ? (() => {
                    const formatted = formatDistance(stop.noteDistanceMetres, {
                      t,
                      locale: language,
                      unitSystem,
                    });
                    const unitKey =
                      unitTokenToKey[formatted.unitToken as DistanceUnitToken] ??
                      (unitSystem === "imperial"
                        ? "wizard-step-three-stop-distance-unit-mi"
                        : "wizard-step-three-stop-distance-unit-km");
                    const unitLabel = t(unitKey, {
                      defaultValue: formatted.unitLabel,
                    });
                    return { ...formatted, unitLabel };
                  })()
                : undefined;
            const note = distanceLabel
              ? t("wizard-step-three-stop-note-with-distance", {
                  note: noteLocalized.name,
                  distance: formatValueWithUnitLabel(distanceLabel.value, distanceLabel.unitLabel),
                  defaultValue: "{{note}} • {{distance}}",
                })
              : noteLocalized.name;
            return (
              <div key={stop.id} className="wizard-summary__stop">
                <span className="wizard-summary__stop-icon">
                  <Icon token={stop.iconToken} className={stop.accentClass} aria-hidden />
                </span>
                <div>
                  <p className="text-base font-semibold">{localized.name}</p>
                  <p className="text-sm text-base-content/70">{localized.description}</p>
                  <p className="mt-1 text-xs text-base-content/60">{note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel aria-label={weatherCopy.title}>
        <h3 className="section-heading text-base-content">
          <Icon token="{icon.object.weatherSunny}" className="text-amber-400" aria-hidden />
          {weatherCopy.title}
        </h3>
        <div className="wizard-summary__weather">
          <div>
            <p className="font-semibold">{weatherCopy.summary}</p>
            <p className="text-xs text-base-content/60">{weatherCopy.reminder}</p>
          </div>
          <div className="text-end">
            <p className="text-lg font-semibold text-accent">{weatherCopy.temperatureLabel}</p>
            <p className="text-xs text-base-content/60">{weatherCopy.sentiment}</p>
          </div>
        </div>
      </WizardSummaryPanel>
    </WizardLayout>
  );
}

export function WizardStepThree(): JSX.Element {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();
  const navigateTo = useCallback((to: NavigateTo) => navigate({ to }), [navigate]);

  return (
    <WizardStepThreeView
      t={t}
      language={i18n.language}
      unitSystem={unitSystem}
      navigateTo={navigateTo}
    />
  );
}
