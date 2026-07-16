/** @file Unit and behavioural coverage for interest registry resolution. */

import { describe, expect, it } from "bun:test";

import {
  buildInterestLookup,
  getInterestDescriptor,
  interestDescriptors,
  resolveInterestDescriptors,
} from "../src/app/data/registries/interests";

describe("interest descriptor registry", () => {
  it("builds a stable lookup of all descriptors for a locale", () => {
    const lookup = buildInterestLookup("es");
    expect(lookup.size).toBe(interestDescriptors.length);
    const markets = lookup.get("markets");
    expect(markets?.localization.name).toBe("Mercados");
  });

  it("falls back to default locales when localization is missing", () => {
    const descriptor = getInterestDescriptor("parks", "fr");
    expect(descriptor?.localization.name).toBe("Parks & Nature");
  });

  it("returns an array view with resolveInterestDescriptors", () => {
    const descriptors = resolveInterestDescriptors("en-GB");
    expect(descriptors).toHaveLength(interestDescriptors.length);
    const streetArt = descriptors.find((entry) => entry.id === "street-art");
    expect(streetArt?.localization.name).toBe("Street Art");
  });
});
