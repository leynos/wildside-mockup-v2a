/** @file Stepper indicator for the three-step walk wizard. */

import type { JSX } from "react";
import type { WizardStep } from "../data/wizard";

export interface WizardStepperProps {
  steps: WizardStep[];
  activeStepId: string;
}

export function WizardStepper({ activeStepId, steps }: WizardStepperProps): JSX.Element {
  const activeIndex = steps.findIndex((s) => s.id === activeStepId);
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isReached = index <= activeIndex;
        return (
          <div
            key={step.id}
            className={`h-3 w-3 rounded-full transition ${isReached ? "bg-accent" : "bg-neutral"}`}
            style={isReached ? { boxShadow: "0 0 12px rgba(254, 234, 0, 0.6)" } : undefined}
          />
        );
      })}
    </div>
  );
}
