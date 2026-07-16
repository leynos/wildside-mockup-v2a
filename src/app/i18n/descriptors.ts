/** @file Helpers for resolving localized descriptors via Fluent. */

import type { TFunction } from "i18next";

type DescriptorDefaults = {
  readonly id: string;
  readonly labelKey: string;
  readonly defaultLabel: string;
  readonly descriptionKey?: string;
  readonly defaultDescription?: string;
};

export type LocalizedDescriptor<Extra extends Record<string, unknown> = Record<string, never>> =
  DescriptorDefaults & Extra;

export type ResolvedDescriptor<Extra extends Record<string, unknown> = Record<string, never>> =
  Omit<
    LocalizedDescriptor<Extra>,
    "labelKey" | "defaultLabel" | "descriptionKey" | "defaultDescription"
  > & {
    readonly label: string;
    readonly description?: string;
  };

export const resolveDescriptor = <Extra extends Record<string, unknown> = Record<string, never>>(
  descriptor: LocalizedDescriptor<Extra>,
  t: TFunction,
): ResolvedDescriptor<Extra> => {
  const { labelKey, defaultLabel, descriptionKey, defaultDescription, ...rest } = descriptor;

  const descriptionText = descriptionKey
    ? t(descriptionKey, { defaultValue: defaultDescription ?? "" })
    : defaultDescription;

  return {
    ...rest,
    label: t(labelKey, { defaultValue: defaultLabel }),
    ...(descriptionText?.length ? { description: descriptionText } : {}),
  } as ResolvedDescriptor<Extra>;
};

export const resolveDescriptors = <Extra extends Record<string, unknown> = Record<string, never>>(
  descriptors: ReadonlyArray<LocalizedDescriptor<Extra>>,
  t: TFunction,
): ResolvedDescriptor<Extra>[] => descriptors.map((descriptor) => resolveDescriptor(descriptor, t));

export const buildDescriptorLookup = <
  Extra extends Record<string, unknown> = Record<string, never>,
  T extends ReadonlyArray<LocalizedDescriptor<Extra>> = ReadonlyArray<LocalizedDescriptor<Extra>>,
>(
  descriptors: T,
  t: TFunction,
): Map<T[number]["id"], ResolvedDescriptor<Extra>> => {
  const entries: Array<readonly [T[number]["id"], ResolvedDescriptor<Extra>]> = [];
  const seen = new Set<string>();
  resolveDescriptors(descriptors, t).forEach((descriptor) => {
    if (seen.has(descriptor.id)) {
      throw new Error(`Duplicate descriptor id detected: ${descriptor.id}`);
    }
    seen.add(descriptor.id);
    entries.push([descriptor.id, descriptor]);
  });
  return new Map(entries);
};
