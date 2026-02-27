/** @file Walk wizard step two: discovery preferences and accessibility toggles. */

import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { WizardLayout } from "../../../components/wizard-layout";
import { WizardSection } from "../../../components/wizard-section";
import { accessibilityOptions, wizardSteps } from "../../../data/wizard";

const discoverySummaryDefaults = {
  hidden: "Hidden gems heavy",
  hotspots: "Hotspot focused",
  balanced: "Balanced mix",
} as const;

type DiscoverySummaryKey = keyof typeof discoverySummaryDefaults;

export function WizardStepTwo(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [discoveryMix, setDiscoveryMix] = useState(60);
  const [accessibility, setAccessibility] = useState<Record<string, boolean>>({
    "well-lit": true,
    wheelchair: false,
    paved: true,
  });
  const helpMessage = t("wizard-help-placeholder", {
    defaultValue: "Contextual help coming soon",
  });
  const discoveryHeadingDefault = "Discovery style";
  const discoveryHeading = t("wizard-step-two-discovery-heading", {
    defaultValue: discoveryHeadingDefault,
  });
  const discoverySectionLabel = t("wizard-step-two-discovery-aria", {
    defaultValue: discoveryHeadingDefault,
  });
  const discoveryDescription = t("wizard-step-two-discovery-description", {
    defaultValue: "Balance popular hotspots with hidden gems to match today’s mood.",
  });
  const discoveryBadgeLabel = t("wizard-step-two-discovery-badge", { defaultValue: "New" });
  const discoveryScaleLeft = t("wizard-step-two-discovery-scale-left", {
    defaultValue: "Crowded",
  });
  const discoveryScaleMid = t("wizard-step-two-discovery-scale-mid", {
    defaultValue: "Balanced",
  });
  const discoveryScaleRight = t("wizard-step-two-discovery-scale-right", {
    defaultValue: "Secluded",
  });
  const discoverySliderAria = t("wizard-step-two-discovery-slider-aria", {
    defaultValue: "Discovery slider",
  });
  const discoveryThumbAria = t("wizard-step-two-discovery-thumb-aria", {
    defaultValue: "Adjust discovery style balance",
  });
  const discoverySummary = useMemo(() => {
    const summaryKey: DiscoverySummaryKey =
      discoveryMix >= 70 ? "hidden" : discoveryMix <= 30 ? "hotspots" : "balanced";
    return t(`wizard-step-two-discovery-summary-${summaryKey}`, {
      defaultValue: discoverySummaryDefaults[summaryKey],
    });
  }, [discoveryMix, t]);

  const accessibilitySectionLabel = t("wizard-step-two-accessibility-section-aria", {
    defaultValue: "Accessibility & safety",
  });
  const accessibilityHeading = t("wizard-step-two-accessibility-heading", {
    defaultValue: "Accessibility & safety",
  });
  const backButtonLabel = t("wizard-header-back-label", { defaultValue: "Back" });
  const nextLabel = t("wizard-step-two-next", { defaultValue: "Next" });

  const resolvedAccessibilityOptions = useMemo(
    () =>
      accessibilityOptions.map((option) => ({
        ...option,
        label: t(`wizard-step-two-accessibility-${option.id}-label`, {
          defaultValue: option.label,
        }),
        description: t(`wizard-step-two-accessibility-${option.id}-description`, {
          defaultValue: option.description,
        }),
      })),
    [t],
  );

  return (
    <WizardLayout
      steps={wizardSteps}
      activeStepId="step-2"
      onBack={() => navigate({ to: "/wizard/step-1" })}
      onHelp={() => window.alert(helpMessage)}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="cta-button cta-button--secondary"
            onClick={() => navigate({ to: "/wizard/step-1" })}
          >
            <Icon token="{icon.navigation.back}" aria-hidden className="me-2 inline" />
            {backButtonLabel}
          </button>
          <button
            type="button"
            className="cta-button"
            onClick={() => navigate({ to: "/wizard/step-3" })}
          >
            {nextLabel}
            <Icon token="{icon.navigation.forward}" aria-hidden className="ms-2 inline" />
          </button>
        </div>
      }
    >
      <WizardSection className="mb-8" aria-label={discoverySectionLabel}>
        <div className="section-header-row">
          <h2 className="section-heading section-heading--spacious text-base-content">
            <Icon token="{icon.navigation.explore}" className="text-accent" aria-hidden />
            {discoveryHeading}
          </h2>
          <span className="wizard-badge font-medium">{discoveryBadgeLabel}</span>
        </div>
        <p className="text-sm text-base-content/70">{discoveryDescription}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-base-content/60">
          <span>{discoveryScaleLeft}</span>
          <span>{discoveryScaleMid}</span>
          <span>{discoveryScaleRight}</span>
        </div>
        <Slider.Root
          value={[discoveryMix]}
          min={0}
          max={100}
          step={5}
          onValueChange={(value) => setDiscoveryMix(value[0] ?? discoveryMix)}
          aria-label={discoverySliderAria}
          className="relative mt-3 flex h-7 items-center"
        >
          <Slider.Track className="relative h-3 flex-1 rounded-full bg-neutral">
            <Slider.Range className="absolute h-full rounded-full bg-accent" />
          </Slider.Track>
          <Slider.Thumb
            aria-label={discoveryThumbAria}
            className="block h-6 w-6 rounded-full border-2 border-base-100 bg-accent shadow-lg shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          />
        </Slider.Root>
        <div className="wizard-discovery__summary">{discoverySummary}</div>
      </WizardSection>

      <WizardSection aria-label={accessibilitySectionLabel}>
        <h2 className="section-title">{accessibilityHeading}</h2>
        <div className="space-y-4">
          {resolvedAccessibilityOptions.map((option) => {
            const checked = accessibility[option.id] ?? false;
            const labelId = `${option.id}-label`;
            const descriptionId = `${option.id}-description`;
            const hasDescription = Boolean(option.description?.length);
            return (
              <div key={option.id} className="wizard-accessibility__option">
                <div className="flex items-center gap-3">
                  <span className="wizard-accessibility__icon">
                    <Icon token={option.iconToken} className="text-accent" aria-hidden />
                  </span>
                  <div>
                    <p id={labelId} className="text-sm font-semibold text-base-content">
                      {option.label}
                    </p>
                    {hasDescription ? (
                      <p id={descriptionId} className="text-xs text-base-content/60">
                        {option.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                <Switch.Root
                  id={option.id}
                  aria-labelledby={labelId}
                  aria-describedby={hasDescription ? descriptionId : undefined}
                  checked={checked}
                  onCheckedChange={(value) =>
                    setAccessibility((prev) => ({
                      ...prev,
                      [option.id]: value,
                    }))
                  }
                  className="wizard-accessibility__toggle"
                >
                  <Switch.Thumb className="wizard-accessibility__thumb" />
                </Switch.Root>
              </div>
            );
          })}
        </div>
      </WizardSection>
    </WizardLayout>
  );
}
