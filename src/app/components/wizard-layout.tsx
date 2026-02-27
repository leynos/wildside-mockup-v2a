/** @file Shared layout for wizard steps providing header, stepper, and footer actions. */

import type { JSX, ReactNode } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WizardStep } from "../data/wizard";
import { AppHeader } from "../layout/app-header";
import { MobileShell } from "../layout/mobile-shell";
import { Icon } from "./icon";
import { WizardStepper } from "./wizard-stepper";

export interface WizardLayoutProps {
  steps: WizardStep[];
  activeStepId: string;
  onBack?: () => void;
  onHelp?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function WizardLayout({
  activeStepId,
  children,
  footer,
  onBack,
  steps,
}: WizardLayoutProps): JSX.Element {
  const { t } = useTranslation();
  const wizardTitle = t("wizard-header-title", { defaultValue: "Route Wizard" });

  const localizedSteps = useMemo(
    () =>
      steps.map((step) => ({
        ...step,
        title: t(`wizard-${step.id}-title`, { defaultValue: step.title }),
        description: t(`wizard-${step.id}-description`, {
          defaultValue: step.description,
        }),
      })),
    [steps, t],
  );

  const isFirstStep = activeStepId === steps[0]?.id;
  const backLabel = isFirstStep
    ? t("wizard-header-back-to-explore", { defaultValue: "Back to Explore" })
    : t("wizard-header-back-label", { defaultValue: "Back" });

  const activeIndex = localizedSteps.findIndex((s) => s.id === activeStepId);
  const activeStep = localizedSteps[activeIndex];
  const subtitle = activeStep
    ? t("wizard-header-step-subtitle", {
        step: activeIndex + 1,
        total: localizedSteps.length,
        description: activeStep.title,
        defaultValue: `Step ${activeIndex + 1} of ${localizedSteps.length} \u2013 ${activeStep.title}`,
      })
    : undefined;

  return (
    <MobileShell tone="dark">
      <div className="screen-stack">
        <AppHeader
          variant="wizard"
          title={wizardTitle}
          subtitle={subtitle}
          leading={
            onBack ? (
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-semibold text-base-content/60 transition-colors hover:text-accent"
                onClick={onBack}
              >
                <Icon token="{icon.navigation.back}" aria-hidden className="text-lg" />
                <span>{backLabel}</span>
              </button>
            ) : undefined
          }
        >
          <WizardStepper steps={localizedSteps} activeStepId={activeStepId} />
        </AppHeader>
        <main className="screen-scroll pt-6">{children}</main>
        {footer ? (
          <footer className="sticky bottom-0 bg-base-900/85 px-6 py-5 backdrop-blur">
            {footer}
          </footer>
        ) : null}
      </div>
    </MobileShell>
  );
}
