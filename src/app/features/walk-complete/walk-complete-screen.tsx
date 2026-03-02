/** @file Walk completion summary with celebratory toast and recap details. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useState } from "react";

import { Icon } from "../../components/icon";
import { walkCompletionShareOptions } from "../../data/stage-four";
import { isRtlLocale } from "../../i18n/supported-locales";
import { MobileShell } from "../../layout/mobile-shell";
import { WalkCompleteActions } from "./components/walk-complete-actions";
import { WalkCompleteHero } from "./components/walk-complete-hero";
import { WalkCompleteMoments } from "./components/walk-complete-moments";
import {
  WalkCompletePrimaryStats,
  WalkCompleteSecondaryStats,
} from "./components/walk-complete-stats";
import { useWalkCompleteFormatting } from "./hooks/use-walk-complete-formatting";
import {
  useWalkCompleteTranslations,
  type WalkCompletionShareChannelId,
} from "./hooks/use-walk-complete-translations";

type WalkCompleteSectionProps = {
  readonly spacing?: "default" | "tight" | "spacious";
  readonly className?: string;
  readonly children: ReactNode;
};

type WalkCompleteShareDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly shareDialogTitle: string;
  readonly shareDialogDescription: string;
  readonly shareDialogCancel: string;
  readonly shareDialogGenerate: string;
  readonly shareChannelLabels: Readonly<Record<WalkCompletionShareChannelId, string>>;
};

type WalkCompleteRatingToastProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly ratingSavedLabel: string;
};

type WalkCompleteRemixSectionProps = {
  readonly remixTitle: string;
  readonly remixDescription: string;
  readonly remixButtonLabel: string;
  readonly onRemix: () => void;
};

type WalkCompleteShareChannelsSectionProps = {
  readonly shareSectionHeading: string;
  readonly shareChannelLabels: Readonly<Record<WalkCompletionShareChannelId, string>>;
};

function WalkCompleteSection({
  spacing = "default",
  className,
  children,
}: WalkCompleteSectionProps): JSX.Element {
  const spacingClasses: Record<NonNullable<WalkCompleteSectionProps["spacing"]>, string> = {
    default: "walk-complete__section",
    tight: "walk-complete__section walk-complete__section--tight",
    spacious: "walk-complete__section walk-complete__section--spacious",
  };

  const composedClassName = className
    ? `${spacingClasses[spacing]} ${className}`
    : spacingClasses[spacing];

  return <section className={composedClassName}>{children}</section>;
}

function WalkCompleteShareDialog({
  open,
  onOpenChange,
  shareDialogTitle,
  shareDialogDescription,
  shareDialogCancel,
  shareDialogGenerate,
  shareChannelLabels,
}: WalkCompleteShareDialogProps): JSX.Element {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="dialog-surface">
          <Dialog.Title className="dialog-title">{shareDialogTitle}</Dialog.Title>
          <Dialog.Description className="text-sm text-base-content/70">
            {shareDialogDescription}
          </Dialog.Description>
          <div className="flex flex-wrap gap-2 text-sm text-base-content/80">
            {walkCompletionShareOptions.map((option) => {
              const label = shareChannelLabels[option.id] ?? option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-label={label}
                  className="walk-share__option"
                >
                  <Icon token={option.iconToken} aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button type="button" className="btn btn-ghost btn-sm">
                {shareDialogCancel}
              </button>
            </Dialog.Close>
            <button type="button" className="btn btn-accent btn-sm">
              {shareDialogGenerate}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function WalkCompleteRatingToast({
  open,
  onOpenChange,
  ratingSavedLabel,
}: WalkCompleteRatingToastProps): JSX.Element {
  return (
    <Toast.Root
      open={open}
      onOpenChange={onOpenChange}
      className="toast toast-end pointer-events-auto"
      duration={4000}
    >
      <div className="alert alert-success shadow-lg">
        <Icon token="{icon.object.star}" aria-hidden />
        <span className="font-semibold">{ratingSavedLabel}</span>
      </div>
    </Toast.Root>
  );
}

function WalkCompleteRemixSection({
  remixTitle,
  remixDescription,
  remixButtonLabel,
  onRemix,
}: WalkCompleteRemixSectionProps): JSX.Element {
  return (
    <WalkCompleteSection>
      <div className="walk-complete__remix">
        <div className="inline-action-cluster mb-3 items-start">
          <Icon token="{icon.object.magic}" className="text-accent" aria-hidden />
          <div>
            <h3 className="section-subheading">{remixTitle}</h3>
            <p className="text-sm text-base-content/70">{remixDescription}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-neutral btn-sm font-display tracking-widest"
          onClick={onRemix}
        >
          {remixButtonLabel}
        </button>
      </div>
    </WalkCompleteSection>
  );
}

function WalkCompleteShareChannelsSection({
  shareSectionHeading,
  shareChannelLabels,
}: WalkCompleteShareChannelsSectionProps): JSX.Element {
  return (
    <WalkCompleteSection spacing="spacious" className="pb-12">
      <h3 className="section-subheading mb-4 text-center text-base-content">
        {shareSectionHeading}
      </h3>
      <div className="flex justify-center gap-4">
        {walkCompletionShareOptions.map((option) => {
          const label = shareChannelLabels[option.id] ?? option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-label={label}
              className={`walk-share__icon ${option.accentClass}`}
            >
              <Icon token={option.iconToken} aria-hidden />
            </button>
          );
        })}
      </div>
    </WalkCompleteSection>
  );
}

export function WalkCompleteScreen(): JSX.Element {
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { formatStatValue } = useWalkCompleteFormatting();
  const {
    locale,
    heroTitle,
    heroDescription,
    mapAlt,
    routeBadgeLabel,
    rateActionLabel,
    shareActionLabel,
    saveActionLabel,
    favouriteHeading,
    remixTitle,
    remixDescription,
    remixButtonLabel,
    shareSectionHeading,
    shareDialogTitle,
    shareDialogDescription,
    shareDialogCancel,
    shareDialogGenerate,
    ratingSavedLabel,
    shareChannelLabels,
  } = useWalkCompleteTranslations();

  const toastSwipeDirection = isRtlLocale(locale) ? "left" : "right";

  return (
    <Toast.Provider swipeDirection={toastSwipeDirection}>
      <MobileShell tone="dark">
        <div className="relative screen-stack">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(254,234,0,0.06),_transparent_55%)]" />
          <main className="relative z-10 flex-1 overflow-y-auto pb-28">
            <WalkCompleteHero
              heroTitle={heroTitle}
              heroDescription={heroDescription}
              mapAlt={mapAlt}
              routeBadgeLabel={routeBadgeLabel}
              locale={locale}
            />

            <WalkCompleteSection>
              <WalkCompletePrimaryStats formatStatValue={formatStatValue} locale={locale} />
            </WalkCompleteSection>

            <WalkCompleteSection spacing="tight">
              <WalkCompleteSecondaryStats formatStatValue={formatStatValue} locale={locale} />
            </WalkCompleteSection>

            <WalkCompleteSection>
              <WalkCompleteMoments heading={favouriteHeading} locale={locale} />
            </WalkCompleteSection>

            <WalkCompleteSection>
              <WalkCompleteActions
                rateActionLabel={rateActionLabel}
                shareActionLabel={shareActionLabel}
                saveActionLabel={saveActionLabel}
                onRate={() => setToastOpen(true)}
                onShare={() => setShareOpen(true)}
                onSave={() => navigate({ to: "/saved" })}
              />
            </WalkCompleteSection>

            <WalkCompleteRemixSection
              remixTitle={remixTitle}
              remixDescription={remixDescription}
              remixButtonLabel={remixButtonLabel}
              onRemix={() => navigate({ to: "/wizard/step-1" })}
            />

            <WalkCompleteShareChannelsSection
              shareSectionHeading={shareSectionHeading}
              shareChannelLabels={shareChannelLabels}
            />
          </main>
        </div>
      </MobileShell>

      <WalkCompleteShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareDialogTitle={shareDialogTitle}
        shareDialogDescription={shareDialogDescription}
        shareDialogCancel={shareDialogCancel}
        shareDialogGenerate={shareDialogGenerate}
        shareChannelLabels={shareChannelLabels}
      />

      <WalkCompleteRatingToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        ratingSavedLabel={ratingSavedLabel}
      />
      <Toast.Viewport className="pointer-events-none fixed inset-x-0 bottom-4 flex flex-col gap-3 px-4 sm:items-end" />
    </Toast.Provider>
  );
}
