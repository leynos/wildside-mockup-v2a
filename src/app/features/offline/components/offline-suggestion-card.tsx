/**
 * @file Card component for recommended offline map downloads.
 *
 * @example
 * <OfflineSuggestionCard
 *   suggestion={offlineSuggestions[0]}
 *   dismissLabel="Dismiss"
 *   i18nLanguage="en-GB"
 *   onAction={() => console.log("download started")}
 *   onDismiss={() => console.log("dismissed")}
 * />
 */

import clsx from "clsx";
import type { JSX } from "react";

import { Button } from "../../../components/button";
import { Icon } from "../../../components/icon";
import type { OfflineSuggestion } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";

type OfflineSuggestionCardProps = {
  readonly suggestion: OfflineSuggestion;
  readonly dismissLabel: string;
  readonly i18nLanguage: string;
  readonly onAction: () => void;
  readonly onDismiss: () => void;
};

export function OfflineSuggestionCard({
  suggestion,
  dismissLabel,
  i18nLanguage,
  onAction,
  onDismiss,
}: OfflineSuggestionCardProps): JSX.Element {
  const suggestionCopy = pickLocalization(suggestion.localizations, i18nLanguage);
  const ctaCopy = pickLocalization(suggestion.ctaLocalizations, i18nLanguage);

  return (
    <article
      className={clsx(
        "rounded-lg border border-neutral bg-gradient-to-r p-4",
        suggestion.accentClass,
      )}
      aria-label={suggestionCopy.name}
    >
      <div className="flex items-start gap-3 text-base-100">
        <Icon
          token={suggestion.iconToken}
          className={clsx("text-xl", suggestion.iconClassName)}
          aria-hidden
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-base-100">{suggestionCopy.name}</h3>
          <p className="mt-1 text-sm text-base-100/80">{suggestionCopy.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={onAction}>
              {ctaCopy.name}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="border-white/40 text-base-100 hover:bg-white/10"
              onClick={onDismiss}
            >
              {dismissLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
