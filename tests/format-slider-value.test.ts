/** @file Unit tests for formatSliderValue covering localization-driven output and units; relies on i18n test helpers for language setup. */

import { describe, expect, it } from "bun:test";

import { formatSliderValue } from "../src/app/data/customize";
import { changeLanguage, i18n, i18nReady } from "./helpers/i18nTestHelpers";

const t = i18n.t.bind(i18n);

describe("formatSliderValue", () => {
  it("formats distance sliders with metric units", async () => {
    await changeLanguage("en-GB");
    const formatted = formatSliderValue("distance", 3200, t, i18n.language, "metric");
    expect(formatted).toBe("3.2 km");
  });

  it("formats distance sliders with imperial units", async () => {
    await changeLanguage("en-US");
    const formatted = formatSliderValue("distance", 3200, t, i18n.language, "imperial");
    expect(formatted).toBe("2.0 mi");
  });

  it("returns raw values for unknown sliders", async () => {
    await i18nReady;
    const formatted = formatSliderValue("unknown", 42, t, i18n.language, "metric");
    expect(formatted).toBe("42");
  });
});
