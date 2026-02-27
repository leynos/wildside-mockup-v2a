/** @file Safety & accessibility preferences screen composed from hooks and UI parts. */

import * as Accordion from "@radix-ui/react-accordion";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { MobileShell } from "../../layout/mobile-shell";
import {
  SafetyAccordionSection,
  SafetyPresetCard,
  SavedPreferencesDialog,
} from "./safety-components";
import { useSafetyData, useSafetyToggles, useSafetyTranslations } from "./use-safety-data";

export function SafetyAccessibilityScreen(): JSX.Element {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const translations = useSafetyTranslations();
  const { resolvedSections, resolvedPresets, toggleLabelLookup } = useSafetyData(i18n.language);
  const { toggleState, handleToggle } = useSafetyToggles();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MobileShell tone="dark">
      <div className="screen-stack">
        <header className="px-6 pt-16 pb-6 text-base-100">
          <div className="mb-4 flex items-center gap-4">
            <button
              type="button"
              aria-label={translations.backLabel}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral bg-base-200"
              onClick={() => navigate({ to: "/explore" })}
            >
              <Icon token="{icon.navigation.back}" className="text-accent" aria-hidden />
            </button>
            <h1 className="font-display font-bold tracking-wider text-2xl">
              {translations.headerTitle}
            </h1>
          </div>
          <p className="text-sm text-base-300">{translations.headerDescription}</p>
        </header>

        <main className="shell-scroll space-y-6">
          <Accordion.Root
            type="multiple"
            defaultValue={resolvedSections.map((section) => section.id)}
            className="space-y-4"
          >
            {resolvedSections.map((section) => (
              <SafetyAccordionSection
                key={section.id}
                section={section}
                toggleState={toggleState}
                onToggle={handleToggle}
              />
            ))}
          </Accordion.Root>

          <section className="space-y-3">
            <h2 className="font-display font-bold tracking-wider text-base text-base-100">
              {translations.presetsHeading}
            </h2>
            <div className="grid gap-3">
              {resolvedPresets.map((preset) => (
                <SafetyPresetCard
                  key={preset.id}
                  preset={preset}
                  onApply={() => window.alert(translations.presetAlert(preset.title))}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <button
              type="button"
              className="btn btn-accent w-full justify-center gap-2"
              onClick={() => setDialogOpen(true)}
            >
              <Icon token="{icon.action.savePrefs}" aria-hidden />
              {translations.saveButtonLabel}
            </button>
          </section>
        </main>
      </div>

      <SavedPreferencesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        toggleState={toggleState}
        toggleLabelLookup={toggleLabelLookup}
        translations={{
          dialogTitle: translations.dialogTitle,
          dialogDescription: translations.dialogDescription,
          dialogContinue: translations.dialogContinue,
          dialogChipFallback: translations.dialogChipFallback,
        }}
      />
    </MobileShell>
  );
}
