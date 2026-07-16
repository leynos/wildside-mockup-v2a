/** @file Tests for safety hooks behaviour and localization */
import { beforeEach, describe, expect, it } from "bun:test";
import { renderHook } from "@testing-library/react";
import { act, type FC, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import { safetyToggleId, safetyToggles } from "../src/app/data/safety-fixtures";
import {
  useSafetyData,
  useSafetyToggles,
  useSafetyTranslations,
} from "../src/app/features/safety/use-safety-data";
import { changeLanguage, i18n } from "./helpers/i18nTestHelpers";

const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe("safety hooks", () => {
  beforeEach(async () => {
    await changeLanguage("es");
  });

  it("initializes toggle state from fixture defaults and updates on toggle", () => {
    const { result } = renderHook(() => useSafetyToggles());

    safetyToggles.forEach((toggle) => {
      expect(result.current.toggleState[toggle.id]).toBe(toggle.defaultChecked);
    });

    const avoidHillsId = safetyToggleId("avoid-hills");
    act(() => result.current.handleToggle(avoidHillsId, true));
    expect(result.current.toggleState[avoidHillsId]).toBe(true);
  });

  it("resolves section and toggle labels from translations", () => {
    const { result } = renderHook(() => useSafetyData("es"), { wrapper });

    const stepFree = result.current.resolvedSections
      .flatMap((section) => section.toggles)
      .find((toggle) => toggle.id === safetyToggleId("step-free"));
    expect(stepFree?.label).toBe("Rutas sin escalones");

    const dialogLabels = result.current.toggleLabelLookup.get(safetyToggleId("step-free"));
    expect(dialogLabels).toBe("Rutas sin escalones");
  });

  it("provides translated UI chrome strings", () => {
    const { result } = renderHook(() => useSafetyTranslations(), { wrapper });

    expect(result.current.headerTitle).toBe("Seguridad y accesibilidad");
    expect(result.current.presetsHeading).toBe("Perfiles predefinidos");
  });
});
