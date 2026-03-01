/** @file Discover onboarding screen composed from Radix primitives. */

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { SectionHero } from "../../components/section-hero";
import { type DiscoverInterest, defaultSelectedInterests } from "../../data/discover";
import { buildInterestLookup } from "../../data/registries/interests";
import { MobileShell } from "../../layout/mobile-shell";

interface InterestChipProps {
  interest: DiscoverInterest;
}

function InterestChip({ interest }: InterestChipProps): JSX.Element {
  return (
    <ToggleGroup.Item value={interest.id} className="discover-interest__card group">
      <div
        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform group-data-[state=on]:scale-105 group-data-[state=on]:bg-[#EFDC68] ${interest.iconBackgroundClass}`}
      >
        <Icon
          token={interest.iconToken}
          className={`${interest.iconColorClass} group-data-[state=on]:text-accent-content text-2xl`}
          aria-hidden
        />
      </div>
      <h3 className="text-center text-sm font-medium">
        {interest.localization.shortLabel ?? interest.localization.name}
      </h3>
    </ToggleGroup.Item>
  );
}

export function DiscoverScreen(): JSX.Element {
  const [selected, setSelected] = useState<string[]>([...defaultSelectedInterests]);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const interests = useMemo(() => {
    const lookup = buildInterestLookup(i18n.language);
    return Array.from(lookup.values());
  }, [i18n.language]);

  const selectedCount = useMemo(() => selected.length, [selected]);

  const handleStart = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      navigate({ to: "/explore" });
    }, 800);
  };

  return (
    <MobileShell
      tone="dark"
      background={
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(254,234,0,0.06),_transparent_55%),linear-gradient(135deg,_#000000_0%,_#1A1A1A_100%)]" />
      }
    >
      <div className="discover-screen__content">
        <button
          type="button"
          onClick={() => navigate({ to: "/explore" })}
          className="discover-screen__skip"
        >
          {t("discover-skip", { defaultValue: "Skip" })}
        </button>

        <SectionHero
          iconToken="{icon.object.magic}"
          title={t("discover-hero-title", { defaultValue: "Discover your perfect walk" })}
          description={t("discover-hero-description", {
            defaultValue:
              "Tell us what interests you and we’ll craft magical routes tailored for you.",
          })}
        />

        <section className="discover-interests__section">
          <div className="mb-6 text-center">
            <h2 className="font-display font-bold tracking-wider uppercase text-base text-base-content">
              {t("discover-curiosity-heading", { defaultValue: "What sparks your curiosity?" })}
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              {t("discover-curiosity-subheading", {
                defaultValue: "Select a few themes that catch your eye.",
              })}
            </p>
          </div>
          <ToggleGroup.Root
            type="multiple"
            className="grid flex-1 grid-cols-2 gap-3"
            aria-label={t("wizard-step-one-interests-heading", { defaultValue: "Interests" })}
            value={selected}
            onValueChange={(values) => setSelected(values)}
          >
            {interests.map((interest) => (
              <InterestChip key={interest.id} interest={interest} />
            ))}
          </ToggleGroup.Root>
          <p className="mt-8 text-center text-sm text-base-content/70">
            <span className="font-semibold text-accent">{selectedCount}</span>{" "}
            {t("discover-themes-selected", {
              count: selectedCount,
              defaultValue: selectedCount === 1 ? "theme selected" : "themes selected",
            })}
          </p>
        </section>

        <section className="mt-6">
          <button
            type="button"
            className="cta-button cta-button--rounded"
            onClick={handleStart}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="inline-action-cluster">
                <Icon token="{icon.action.loading}" className="h-5 w-5 animate-spin" aria-hidden />
                {t("discover-start-loading", { defaultValue: "Creating your experience…" })}
              </span>
            ) : (
              <span className="inline-action-cluster">
                {t("discover-start", { defaultValue: "Start exploring" })}
                <Icon token="{icon.navigation.forward}" aria-hidden className="h-4 w-4" />
              </span>
            )}
          </button>
          <p className="mt-3 text-center text-sm text-base-content/60">
            {t("discover-change-later", { defaultValue: "You can always change these later." })}
          </p>
        </section>
      </div>
    </MobileShell>
  );
}
