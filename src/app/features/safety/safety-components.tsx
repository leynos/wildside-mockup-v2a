/** @file Presentational components for the safety screen. */

import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import type { JSX } from "react";

import { Icon } from "../../components/icon";
import type { SafetyToggleId } from "../../data/safety-fixtures";
import type {
  ResolvedSafetyPreset,
  ResolvedSafetySection,
  SafetyTranslations,
  ToggleState,
} from "./safety-types";

type SafetyAccordionSectionProps = {
  readonly section: ResolvedSafetySection;
  readonly toggleState: ToggleState;
  readonly onToggle: (id: SafetyToggleId, value: boolean) => void;
};

export const SafetyAccordionSection = ({
  section,
  toggleState,
  onToggle,
}: SafetyAccordionSectionProps): JSX.Element => (
  <Accordion.Item value={section.id} className="rounded-lg border border-neutral bg-base-200">
    <Accordion.Header>
      <Accordion.Trigger className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full ${section.accentClass}`}
          >
            <Icon token={section.iconToken} aria-hidden />
          </span>
          <div>
            <p className="text-base font-semibold text-base-100">{section.title}</p>
            <p className="text-xs text-base-300">{section.description}</p>
          </div>
        </div>
        <Icon
          token="{icon.navigation.chevronDown}"
          className="text-base-300 transition data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="space-y-5 px-5 pb-5 pt-2 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
      {section.toggles.map((toggle) => {
        const isEnabled = toggleState[toggle.id] ?? false;
        const labelId = `${toggle.id}-label`;
        const descriptionId = `${toggle.id}-description`;
        return (
          <div key={toggle.id} className="preference-toggle">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${toggle.accentClass}`}
              >
                <Icon token={toggle.iconToken} aria-hidden />
              </span>
              <div>
                <p id={labelId} className="font-medium text-base-100">
                  {toggle.label}
                </p>
                <p id={descriptionId} className="text-xs text-base-300">
                  {toggle.description}
                </p>
              </div>
            </div>
            <Switch.Root
              className="toggle-switch toggle-switch--accent"
              checked={isEnabled}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              onCheckedChange={(checked) => onToggle(toggle.id, checked)}
            >
              <Switch.Thumb className="toggle-switch__thumb" />
            </Switch.Root>
          </div>
        );
      })}
    </Accordion.Content>
  </Accordion.Item>
);

type SafetyPresetCardProps = {
  readonly preset: ResolvedSafetyPreset;
  readonly onApply: () => void;
};

export const SafetyPresetCard = ({ preset, onApply }: SafetyPresetCardProps): JSX.Element => (
  <button type="button" className="safety__preset" onClick={onApply}>
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-full ${preset.accentClass}`}
    >
      <Icon token={preset.iconToken} aria-hidden />
    </span>
    <div>
      <p className="font-semibold text-base-100">{preset.title}</p>
      <p className="text-xs text-base-300">{preset.description}</p>
    </div>
  </button>
);

type SavedPreferencesDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly toggleState: ToggleState;
  readonly toggleLabelLookup: Map<SafetyToggleId, string>;
  readonly translations: Pick<
    SafetyTranslations,
    "dialogTitle" | "dialogDescription" | "dialogContinue" | "dialogChipFallback"
  >;
};

export const SavedPreferencesDialog = ({
  open,
  onOpenChange,
  toggleState,
  toggleLabelLookup,
  translations,
}: SavedPreferencesDialogProps): JSX.Element => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60" />
      <Dialog.Content className="modal-panel">
        <Dialog.Title className="dialog-title">{translations.dialogTitle}</Dialog.Title>
        <Dialog.Description className="text-sm text-base-content/70">
          {translations.dialogDescription}
        </Dialog.Description>
        <div className="chip-row text-sm text-base-content/80">
          {Object.keys(toggleState)
            .filter((id) => toggleState[id as SafetyToggleId])
            .map((id) => {
              const toggleId = id as SafetyToggleId;
              return (
                <span key={toggleId} className="rounded-full border border-neutral px-3 py-1">
                  {toggleLabelLookup.get(toggleId) ?? translations.dialogChipFallback(toggleId)}
                </span>
              );
            })}
        </div>
        <div className="flex justify-end">
          <Dialog.Close asChild>
            <button type="button" className="btn btn-accent btn-sm">
              {translations.dialogContinue}
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
