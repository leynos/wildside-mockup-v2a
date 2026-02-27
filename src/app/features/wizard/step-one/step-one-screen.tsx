/** @file Walk wizard step one: duration and interests. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { InterestToggleGroup } from "../../../components/interest-toggle-group";
import { SliderControl } from "../../../components/slider-control";
import { WizardLayout } from "../../../components/wizard-layout";
import { WizardSection } from "../../../components/wizard-section";
import { defaultSelectedInterests, discoverInterestDescriptors } from "../../../data/discover";
import { wizardSteps } from "../../../data/wizard";
import { secondsFromMinutes } from "../../../units/unit-format";
import { useUnitLabelFormatters } from "../../../units/use-unit-labels";

export function WizardStepOne(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatDurationValue } = useUnitLabelFormatters();
  const [duration, setDuration] = useState(60);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    ...defaultSelectedInterests,
  ]);
  const helpMessage = t("wizard-help-placeholder", {
    defaultValue: "Contextual help coming soon",
  });
  const durationSectionLabel = t("wizard-step-one-duration-section-aria", {
    defaultValue: "Walk duration controls",
  });
  const durationLabel = t("wizard-step-one-duration-label", { defaultValue: "Walk duration" });
  const durationAriaLabel = t("wizard-step-one-duration-aria", {
    defaultValue: "Walk duration slider",
  });
  const durationMarkerMinutes = useMemo(() => [15, 90, 180] as const, []);
  const durationMarkerDefaults = useMemo(
    () =>
      durationMarkerMinutes.map((minutes) => {
        const { value, unitLabel } = formatDurationValue(secondsFromMinutes(minutes), {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return `${value} ${unitLabel}`;
      }),
    [formatDurationValue, durationMarkerMinutes],
  );
  const durationMarkerKeys = useMemo(
    () =>
      [
        "wizard-step-one-duration-marker-start",
        "wizard-step-one-duration-marker-mid",
        "wizard-step-one-duration-marker-end",
      ] as const,
    [],
  );
  const durationMarkers = useMemo(
    () =>
      durationMarkerKeys.map((key, index) =>
        t(key, {
          count: durationMarkerMinutes[index] ?? 0,
          defaultValue: durationMarkerDefaults[index] ?? "",
        }),
      ),
    [t, durationMarkerDefaults, durationMarkerKeys, durationMarkerMinutes],
  );
  const interestsSectionLabel = t("wizard-step-one-interests-section-aria", {
    defaultValue: "Interests",
  });
  const interestsHeading = t("wizard-step-one-interests-heading", { defaultValue: "Interests" });
  const interestPickerAria = t("wizard-step-one-interests-picker-aria", {
    defaultValue: "Select walk interests",
  });
  const nextStepLabel = t("wizard-step-one-next", {
    defaultValue: "Next step",
  });

  const interestIds = useMemo(() => discoverInterestDescriptors.map((option) => option.id), []);

  const selectedLabel = useMemo(
    () =>
      t("wizard-step-one-interests-selected", {
        count: selectedInterests.length,
        defaultValue: `${selectedInterests.length} selected`,
      }),
    [selectedInterests.length, t],
  );

  const formatDuration = useCallback(
    (value: number) => {
      const {
        value: minutesLabel,
        unitLabel,
        numericValue,
      } = formatDurationValue(secondsFromMinutes(value), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return t("wizard-step-one-duration-format", {
        count: numericValue,
        unit: unitLabel,
        defaultValue: `${minutesLabel} ${unitLabel}`,
      });
    },
    [formatDurationValue, t],
  );

  return (
    <WizardLayout
      steps={wizardSteps}
      activeStepId="step-1"
      onBack={() => navigate({ to: "/explore" })}
      onHelp={() => window.alert(helpMessage)}
      footer={
        <button
          type="button"
          className="cta-button"
          onClick={() => navigate({ to: "/wizard/step-2" })}
        >
          {nextStepLabel}
          <Icon token="{icon.navigation.forward}" aria-hidden className="ms-3 inline" />
        </button>
      }
    >
      <WizardSection className="mb-8" aria-label={durationSectionLabel}>
        <SliderControl
          id="wizard-duration"
          label={durationLabel}
          iconToken="{icon.object.duration}"
          value={duration}
          min={15}
          max={180}
          step={5}
          valueFormatter={formatDuration}
          markers={durationMarkers}
          ariaLabel={durationAriaLabel}
          onValueChange={setDuration}
        />
      </WizardSection>

      <WizardSection aria-label={interestsSectionLabel}>
        <header className="mb-4 flex items-center justify-between">
          <h2 className="section-heading section-heading--spacious text-base-content">
            <Icon token="{icon.action.like}" className="text-accent" aria-hidden />
            {interestsHeading}
          </h2>
          <span className="text-xs font-medium text-base-content/60">{selectedLabel}</span>
        </header>
        <InterestToggleGroup
          interestIds={interestIds}
          selected={selectedInterests}
          onChange={setSelectedInterests}
          ariaLabel={interestPickerAria}
        />
      </WizardSection>
    </WizardLayout>
  );
}
