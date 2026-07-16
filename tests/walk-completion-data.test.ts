/** @file Walk completion stage-four localization fixtures tests. */

import { describe, expect, it } from "bun:test";

import {
  type WalkCompletionStat,
  walkCompletionMoments,
  walkCompletionPrimaryStats,
  walkCompletionSecondaryStats,
  walkCompletionShareOptions,
} from "../src/app/data/stage-four";
import { pickLocalization } from "../src/app/domain/entities/localization";
import { SUPPORTED_LOCALES } from "../src/app/i18n/supported-locales";

/**
 * Helper to test stat localizations across multiple locales.
 * Finds the stat by ID, verifies it exists, checks all locales have names,
 * and optionally verifies specific translations.
 */
const testStatLocalization = (
  stats: readonly WalkCompletionStat[],
  statId: string,
  testLocales: readonly string[],
  expectedTranslations?: Record<string, string>,
) => {
  const stat = stats.find((s) => s.id === statId);
  expect(stat).toBeDefined();
  if (!stat) throw new Error(`Missing stat with id ${statId}`);

  testLocales.forEach((locale) => {
    const localized = pickLocalization(stat.localizations, locale);
    expect(localized.name).toBeTruthy();
  });

  if (expectedTranslations) {
    for (const [locale, expected] of Object.entries(expectedTranslations)) {
      expect(pickLocalization(stat.localizations, locale).name).toBe(expected);
    }
  }
};

describe("walkCompletionPrimaryStats localizations", () => {
  const testLocales = ["en-GB", "es", "de", "ja", "ar"] as const;

  it("Distance stat has localized names across multiple locales", () => {
    testStatLocalization(walkCompletionPrimaryStats, "distance", testLocales, {
      es: "Distancia",
      de: "Distanz",
      ja: "距離",
    });
  });

  it("Duration stat has localized names across multiple locales", () => {
    testStatLocalization(walkCompletionPrimaryStats, "duration", testLocales, {
      es: "Duración",
      de: "Dauer",
      ja: "所要時間",
    });
  });
});

describe("walkCompletionSecondaryStats localizations", () => {
  const testLocales = ["en-GB", "es", "fr", "ko", "he"] as const;

  it("Energy stat has localized names across multiple locales", () => {
    testStatLocalization(walkCompletionSecondaryStats, "energy", testLocales, {
      es: "Energía",
      fr: "Énergie",
      ko: "에너지",
    });
  });

  it("Stops stat has localized names across multiple locales", () => {
    testStatLocalization(walkCompletionSecondaryStats, "stops", testLocales);
  });

  it("Starred stat has localized names across multiple locales", () => {
    testStatLocalization(walkCompletionSecondaryStats, "starred", testLocales);
  });
});

describe("walkCompletionMoments localizations", () => {
  it("all moments have name and description localizations", () => {
    expect(walkCompletionMoments.length).toBeGreaterThan(0);

    walkCompletionMoments.forEach((moment) => {
      const localized = pickLocalization(moment.localizations, "en-GB");
      expect(localized.name).toBeTruthy();
      expect(localized.description).toBeTruthy();
    });
  });

  it("moments provide localized name and description across all supported locales", () => {
    expect(walkCompletionMoments.length).toBeGreaterThan(0);

    for (const locale of SUPPORTED_LOCALES) {
      for (const moment of walkCompletionMoments) {
        const localized = pickLocalization(moment.localizations, locale.code);
        expect(localized.name).toBeTruthy();
        expect(localized.description).toBeTruthy();
      }
    }
  });

  it("coffee moment has correct English localization", () => {
    const coffeeMoment = walkCompletionMoments.find((m) => m.id === "coffee");
    expect(coffeeMoment).toBeDefined();
    if (!coffeeMoment) throw new Error("Missing moment: coffee");

    const localized = pickLocalization(coffeeMoment.localizations, "en-GB");
    expect(localized.name).toBe("Blue Bottle Coffee");
    expect(localized.description).toBe("Perfect cortado & friendly barista");
  });

  it("coffee moment has non-English localizations", () => {
    const coffeeMoment = walkCompletionMoments.find((m) => m.id === "coffee");
    expect(coffeeMoment).toBeDefined();
    if (!coffeeMoment) throw new Error("Missing moment: coffee");

    const es = pickLocalization(coffeeMoment.localizations, "es");
    expect(es.name).toBeTruthy();
    expect(es.description).toBeTruthy();
  });

  it("mural moment has correct English localization", () => {
    const muralMoment = walkCompletionMoments.find((m) => m.id === "mural");
    expect(muralMoment).toBeDefined();
    if (!muralMoment) throw new Error("Missing moment: mural");

    const localized = pickLocalization(muralMoment.localizations, "en-GB");
    expect(localized.name).toBe("Hidden Mural");
    expect(localized.description).toBe("Amazing street art in quiet alley");
  });

  it("moments have image URLs", () => {
    walkCompletionMoments.forEach((moment) => {
      expect(moment.imageUrl).toMatch(/^https?:\/\//);
    });
  });
});

describe("walkCompletionShareOptions localizations", () => {
  it("Facebook has localized names for non-Latin scripts", () => {
    const facebookOption = walkCompletionShareOptions.find((o) => o.id === "facebook");
    expect(facebookOption).toBeDefined();
    if (!facebookOption) throw new Error("Missing share option: facebook");

    // Latin scripts should use "Facebook"
    expect(pickLocalization(facebookOption.localizations, "en-GB").name).toBe("Facebook");
    expect(pickLocalization(facebookOption.localizations, "es").name).toBe("Facebook");

    // Non-Latin scripts should have transliterated names
    expect(pickLocalization(facebookOption.localizations, "ar").name).toBe("فيسبوك");
    expect(pickLocalization(facebookOption.localizations, "he").name).toBe("פייסבוק");
    expect(pickLocalization(facebookOption.localizations, "ko").name).toBe("페이스북");
    expect(pickLocalization(facebookOption.localizations, "ta").name).toBe("பேஸ்புக்");
  });

  it("Instagram has localized names for non-Latin scripts", () => {
    const instagramOption = walkCompletionShareOptions.find((o) => o.id === "instagram");
    expect(instagramOption).toBeDefined();
    if (!instagramOption) throw new Error("Missing share option: instagram");

    // Latin scripts should use "Instagram"
    expect(pickLocalization(instagramOption.localizations, "en-GB").name).toBe("Instagram");

    // Non-Latin scripts should have transliterated names
    expect(pickLocalization(instagramOption.localizations, "ar").name).toBe("إنستغرام");
    expect(pickLocalization(instagramOption.localizations, "ko").name).toBe("인스타그램");
  });

  it("all share options have icon tokens and accent classes", () => {
    walkCompletionShareOptions.forEach((option) => {
      expect(option.iconToken).toBeTruthy();
      expect(option.accentClass).toMatch(/^bg-/);
    });
  });
});
