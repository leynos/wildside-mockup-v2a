import { describe, expect, it } from "bun:test";

import type { EntityLocalizations } from "../src/app/domain/entities/localization";
import { defaultFallbackLocales, pickLocalization } from "../src/app/domain/entities/localization";

describe("pickLocalization", () => {
  const localizations: EntityLocalizations = {
    "en-GB": { name: "Harbour Walk", description: "Sunset loop" },
    es: { name: "Paseo del puerto", description: "Ruta al atardecer" },
  };

  it("returns the exact locale match when available", () => {
    const resolved = pickLocalization(localizations, "es");
    expect(resolved.name).toBe("Paseo del puerto");
  });

  it("falls back to base language when region variant is missing", () => {
    const resolved = pickLocalization(localizations, "es-MX");
    expect(resolved.name).toBe("Paseo del puerto");
  });

  it("falls back to default chain when requested locale is absent", () => {
    const resolved = pickLocalization(localizations, "fr-CA");
    expect(resolved.name).toBe("Harbour Walk");
  });

  it("falls back to the first available localization as a last resort", () => {
    const singleLocale: EntityLocalizations = { "en-GB": { name: "Single" } };
    const resolved = pickLocalization(singleLocale, "de", []);
    expect(resolved.name).toBe("Single");
  });

  it("throws when no localizations are available", () => {
    expect(() => pickLocalization({}, "en-GB", defaultFallbackLocales)).toThrow();
  });
});
