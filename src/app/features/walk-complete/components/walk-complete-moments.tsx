/**
 * @file Walk completion favourite moments list.
 *
 * Responsibilities:
 * - Render the "Favourite moments" section heading and list.
 * - Localize moment names and descriptions for the current locale.
 * - Fail safely if a localization entry is missing for a moment.
 *
 * Usage:
 * - `<WalkCompleteMoments heading="Favourite moments" locale="en-GB" />`
 */

import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import { SectionHeading } from "../../../components/section-heading";
import { walkCompletionMoments } from "../../../data/stage-four-walk-complete";
import { safePickLocalization } from "../../../domain/entities/localization";

type WalkCompleteMomentsProps = {
  readonly heading: string;
  readonly locale: string;
};

export function WalkCompleteMoments({ heading, locale }: WalkCompleteMomentsProps): JSX.Element {
  return (
    <>
      <SectionHeading iconToken="{icon.action.like}" iconClassName="text-pink-400">
        {heading}
      </SectionHeading>
      <ul className="space-y-3">
        {walkCompletionMoments.map((moment) => {
          const localized = safePickLocalization(moment.localizations, locale, moment.id);

          return (
            <li key={moment.id}>
              <article className="flex items-center gap-4 rounded-2xl border border-base-300/60 bg-base-200/30 p-4">
                <img
                  src={moment.imageUrl}
                  alt={localized.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1 text-start text-base-content">
                  <p className="font-semibold">{localized.name}</p>
                  <p className="text-sm text-base-content/70">{localized.description}</p>
                </div>
                <Icon token="{icon.object.star}" className="text-amber-300" aria-hidden />
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
