/** @file Localized difficulty descriptor registry shared across flows. */

import type { TFunction } from "i18next";

import {
  buildDescriptorLookup,
  type LocalizedDescriptor,
  type ResolvedDescriptor,
} from "../../i18n/descriptors";

type DifficultyVisualMetadata = {
  readonly badgeToneClass: string;
};

export type DifficultyDescriptor = LocalizedDescriptor<DifficultyVisualMetadata>;
export type ResolvedDifficultyDescriptor = ResolvedDescriptor<DifficultyVisualMetadata>;

export const difficultyDescriptors = [
  {
    id: "easy",
    labelKey: "difficulty-easy-label",
    defaultLabel: "Easy",
    badgeToneClass: "bg-emerald-500/15 text-emerald-300",
  },
  {
    id: "moderate",
    labelKey: "difficulty-moderate-label",
    defaultLabel: "Moderate",
    badgeToneClass: "bg-amber-500/15 text-amber-300",
  },
  {
    id: "challenging",
    labelKey: "difficulty-challenging-label",
    defaultLabel: "Challenging",
    badgeToneClass: "bg-rose-500/15 text-rose-300",
  },
] as const satisfies ReadonlyArray<DifficultyDescriptor>;

export type DifficultyId = (typeof difficultyDescriptors)[number]["id"];

export const buildDifficultyLookup = (
  t: TFunction,
): Map<DifficultyId, ResolvedDifficultyDescriptor> =>
  buildDescriptorLookup<DifficultyVisualMetadata, typeof difficultyDescriptors>(
    difficultyDescriptors,
    t,
  );
