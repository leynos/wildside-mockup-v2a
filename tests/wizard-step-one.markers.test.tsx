import { afterAll, beforeEach, describe, expect, it, vi } from "bun:test";
import * as router from "@tanstack/react-router";
import { screen } from "@testing-library/react";

import { WizardStepOne } from "../src/app/features/wizard/step-one/step-one-screen";
import { UnitPreferencesProvider } from "../src/app/units/unit-preferences-provider";
import { setupI18nTestHarness } from "./support/i18n-test-runtime";
import { renderWithProviders } from "./utils/render-with-providers";

const navigateSpy = vi.fn();
vi.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);
globalThis.alert = vi.fn();

afterAll(() => {
  vi.restoreAllMocks();
});

const renderStepOne = async (locale: string) => {
  await setupI18nTestHarness();
  const i18n = (await import("../src/i18n")).default;
  await i18n.changeLanguage(locale);

  return renderWithProviders(
    <UnitPreferencesProvider>
      <WizardStepOne />
    </UnitPreferencesProvider>,
  );
};

describe("WizardStepOne duration markers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders pluralized markers in en-GB", async () => {
    await renderStepOne("en-GB");

    expect(screen.getByText("15 minutes")).toBeInTheDocument();
    expect(screen.getByText("90 minutes")).toBeInTheDocument();
    expect(screen.getByText("180 minutes")).toBeInTheDocument();
  });

  it("renders markers in Spanish with locale labels", async () => {
    await renderStepOne("es");

    const markers = screen
      .getAllByText(/15|90|180/)
      .filter((node) => node.classList.contains("slider-control__marker"));
    expect(markers).toHaveLength(3);
    expect(markers[0]?.textContent).toMatch(/15/);
    expect(markers[1]?.textContent).toMatch(/90/);
    expect(markers[2]?.textContent).toMatch(/180/);
  });
});
