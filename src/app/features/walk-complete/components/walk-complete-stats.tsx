/** @file Walk completion stats grids (primary and secondary). */

import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import type { WalkCompletionStat } from "../../../data/stage-four";
import { walkCompletionPrimaryStats, walkCompletionSecondaryStats } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";

const secondaryStatIconTone = {
  energy: "text-orange-400",
  stops: "text-amber-300",
  starred: "text-pink-400",
} satisfies Partial<Record<WalkCompletionStat["id"], string>>;

type WalkCompleteStatsProps = {
  readonly formatStatValue: (value: WalkCompletionStat["value"]) => string;
  readonly locale: string;
};

export function WalkCompletePrimaryStats({
  formatStatValue,
  locale,
}: WalkCompleteStatsProps): JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {walkCompletionPrimaryStats.map((stat) => {
        const localized = pickLocalization(stat.localizations, locale);
        return (
          <article key={stat.id} className="walk-complete__stat-card text-base-content">
            <div className="mb-2 flex items-center gap-3 text-base-content/70">
              <Icon token={stat.iconToken} className="text-accent" aria-hidden />
              <span className="text-sm font-medium">{localized.name}</span>
            </div>
            <p className="font-display text-2xl font-extrabold">{formatStatValue(stat.value)}</p>
          </article>
        );
      })}
    </div>
  );
}

export function WalkCompleteSecondaryStats({
  formatStatValue,
  locale,
}: WalkCompleteStatsProps): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-3">
      {walkCompletionSecondaryStats.map((stat) => {
        const localized = pickLocalization(stat.localizations, locale);
        return (
          <article
            key={stat.id}
            className="rounded-2xl border border-base-300/60 bg-base-200/30 p-4 text-center"
          >
            <Icon
              token={stat.iconToken}
              className={`walk-complete__secondary-icon ${secondaryStatIconTone[stat.id] ?? "text-accent"}`}
              aria-hidden
            />
            <p className="font-display text-lg font-bold text-base-content">
              {formatStatValue(stat.value)}
            </p>
            <p className="text-xs text-base-content/70">{localized.name}</p>
          </article>
        );
      })}
    </div>
  );
}
