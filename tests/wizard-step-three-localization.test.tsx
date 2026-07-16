/**
 * @file Tests for wizard step-three localization, covering stop note interpolation, badge labels,
 * and route description copy.
 */

import { describe, expect, it } from "bun:test";
import { screen } from "@testing-library/react";
import type { TFunction } from "i18next";

import { wizardGeneratedStops, wizardRouteSummary } from "../src/app/data/wizard";
import { pickLocalization } from "../src/app/domain/entities/localization";
import { WizardStepThreeView } from "../src/app/features/wizard/step-three/step-three-screen";
import { formatDistance } from "../src/app/units/unit-format";
import { joinUnit } from "../src/app/units/unit-format-helpers";
import { createStubT, type TranslationCall } from "./i18n-stub";
import { renderWithProviders } from "./utils/render-with-providers";

type WizardStop = (typeof wizardGeneratedStops)[number];

function getStopById(
  stopId: string,
  requireDistance: true,
): WizardStop & { noteDistanceMetres: number };
function getStopById(stopId: string, requireDistance?: false): WizardStop;
function getStopById(stopId: string, requireDistance = false): WizardStop {
  const stop = wizardGeneratedStops.find((candidate) => candidate.id === stopId);
  if (!stop) {
    throw new Error(`Expected wizard stops fixture to include "${stopId}" stop`);
  }

  if (requireDistance && stop.noteDistanceMetres == null) {
    throw new Error(`Expected "${stopId}" stop to include noteDistanceMetres`);
  }

  return stop;
}

function formatStopDistance(
  distanceMetres: number,
  t: TFunction,
  locale: string,
  unitSystem: "metric" | "imperial",
): string {
  const formatted = formatDistance(distanceMetres, { t, locale, unitSystem });
  return joinUnit(formatted.value, formatted.unitLabel);
}

function findStopNoteCall(
  calls: readonly TranslationCall[],
  expectedNote: string,
): { note: string; distance: string } {
  const call = calls.find((candidate) => {
    if (candidate.key !== "wizard-step-three-stop-note-with-distance") return false;
    const options = candidate.options as { note?: unknown } | undefined;
    return options?.note === expectedNote;
  });

  if (!call?.options) {
    throw new Error(
      `Expected translation call "wizard-step-three-stop-note-with-distance" for note "${expectedNote}"`,
    );
  }

  const options = call.options as { note?: unknown; distance?: unknown };
  if (typeof options.note !== "string" || typeof options.distance !== "string") {
    throw new Error(
      `Expected translation call options to include { note: string, distance: string } for note "${expectedNote}"`,
    );
  }

  return { note: options.note, distance: options.distance };
}

describe("wizard step-three stop note distance interpolation", () => {
  it("generated stops have noteDistanceMetres for distance calculation", () => {
    const stopsWithDistance = wizardGeneratedStops.filter(
      (stop) => stop.noteDistanceMetres !== undefined,
    );

    expect(stopsWithDistance.length).toBeGreaterThan(0);

    stopsWithDistance.forEach((stop) => {
      expect(stop.noteDistanceMetres).toBeGreaterThan(0);
    });
  });

  it("renders stop note with interpolated distance", () => {
    const { t, calls } = createStubT();
    const stop = getStopById("art", true);

    renderWithProviders(
      <WizardStepThreeView t={t} language="en-GB" unitSystem="metric" navigateTo={() => {}} />,
    );

    const note = pickLocalization(stop.noteLocalizations, "en-GB").name;
    const distance = formatStopDistance(stop.noteDistanceMetres, t, "en-GB", "metric");
    const expected = `${note} • ${distance}`;

    screen.getByText(expected);

    const callOptions = findStopNoteCall(calls, note);
    expect(callOptions.note).toBe(note);
    expect(callOptions.distance).toBe(distance);
  });

  it("stop notes have localizations for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja", "ar"] as const;

    wizardGeneratedStops.forEach((stop) => {
      testLocales.forEach((locale) => {
        const noteLocalized = pickLocalization(stop.noteLocalizations, locale);
        expect(typeof noteLocalized.name).toBe("string");
        expect(noteLocalized.name.length).toBeGreaterThan(0);
      });
    });

    const cafeStop = getStopById("café");
    const spanishCafeNote = pickLocalization(cafeStop.noteLocalizations, "es").name;
    expect(spanishCafeNote).toBe("Baristas amables, ideal para llevar");

    const artStop = getStopById("art");
    const germanArtNote = pickLocalization(artStop.noteLocalizations, "de").name;
    expect(germanArtNote).toBe("Fotospot");

    const gardenStop = getStopById("garden");
    const frenchGardenNote = pickLocalization(gardenStop.noteLocalizations, "fr").name;
    expect(frenchGardenNote).toBe("Zone de repos");
  });
});

describe("wizard step-three badge localization", () => {
  it("route summary has badge localizations", () => {
    expect(wizardRouteSummary.badgeLocalizations).toBeDefined();
  });

  it("badge has localized names for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja", "ar", "zh-CN"] as const;

    testLocales.forEach((locale) => {
      const badgeLocalized = pickLocalization(wizardRouteSummary.badgeLocalizations, locale);
      expect(typeof badgeLocalized.name).toBe("string");
      expect(badgeLocalized.name.length).toBeGreaterThan(0);
    });
  });

  it("badge shows Custom in English", () => {
    const enGbBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "en-GB");
    expect(enGbBadge.name).toBe("Custom");
  });

  it("badge has different localizations for non-English locales", () => {
    const spanishBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "es");
    const germanBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "de");
    const japaneseBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "ja");

    expect(spanishBadge.name).toBe("Personalizada");
    expect(germanBadge.name).toBe("Individuell");
    expect(japaneseBadge.name).toBe("カスタム");
  });
});

describe("wizard step-three route description localization", () => {
  it("route has description in localizations", () => {
    const enGbRoute = pickLocalization(wizardRouteSummary.localizations, "en-GB");
    if (typeof enGbRoute.description !== "string") {
      throw new Error("Expected en-GB route description to be a string");
    }
    expect(enGbRoute.description.toLowerCase()).toContain("street-art");
  });

  it("route description has localizations for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja"] as const;

    testLocales.forEach((locale) => {
      const localized = pickLocalization(wizardRouteSummary.localizations, locale);
      if (typeof localized.description !== "string") {
        throw new Error(`Expected ${locale} route description to be a string`);
      }
      expect(localized.description.length).toBeGreaterThan(0);
    });
  });

  it("Spanish route description is properly translated", () => {
    const spanishRoute = pickLocalization(wizardRouteSummary.localizations, "es");
    if (typeof spanishRoute.description !== "string") {
      throw new Error("Expected Spanish route description to be a string");
    }
    // Spanish should have "arte urbano" for street art
    expect(spanishRoute.description.toLowerCase()).toContain("arte urbano");
  });
});
