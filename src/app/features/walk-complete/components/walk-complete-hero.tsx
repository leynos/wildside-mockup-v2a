/**
 * @file Walk completion hero title and map preview card.
 *
 * Responsibilities:
 * - Render the walk completion hero (title and description).
 * - Show a map preview and completion badge.
 * - Display a localised avatar stack for favourite moments.
 *
 * Usage:
 * - `<WalkCompleteHero heroTitle="…" heroDescription="…" locale="en-GB" />`
 */

import type { JSX } from "react";

import { SectionHero } from "../../../components/section-hero";
import {
  walkCompletionMapImage,
  walkCompletionMoments,
} from "../../../data/stage-four-walk-complete";
import { safePickLocalization } from "../../../domain/entities/localization";

type WalkCompleteHeroProps = {
  readonly heroTitle: string;
  readonly heroDescription: string;
  readonly mapAlt: string;
  readonly routeBadgeLabel: string;
  readonly locale: string;
};

export function WalkCompleteHero({
  heroTitle,
  heroDescription,
  mapAlt,
  routeBadgeLabel,
  locale,
}: WalkCompleteHeroProps): JSX.Element {
  return (
    <>
      <div className="animate-burst px-6 pt-16 pb-8">
        <SectionHero
          iconToken="{icon.object.trophy}"
          iconClassName="animate-pulse-glow"
          title={heroTitle}
          description={heroDescription}
          badgeTone="celebration"
        />
      </div>

      <section className="px-6">
        <div className="walk-complete__hero-card">
          <div className="relative h-44 overflow-hidden rounded-lg border border-neutral">
            <img
              src={walkCompletionMapImage}
              alt={mapAlt}
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <span className="walk-complete__badge">{routeBadgeLabel}</span>
            <div className="walk-complete__avatar-stack">
              {walkCompletionMoments.slice(0, 3).map((moment) => {
                const localized = safePickLocalization(moment.localizations, locale, moment.id);
                return (
                  <img
                    key={moment.id}
                    src={moment.imageUrl}
                    alt={localized.name}
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-9 rounded-full border-2 border-accent object-cover shadow"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
