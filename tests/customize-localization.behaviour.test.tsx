/** @file Behavioural tests for the customize screen localization flow. */

import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { CustomizeScreen } from "../src/app/features/customize/customize-screen";
import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { UnitPreferencesProvider } from "../src/app/units/unit-preferences-provider";
import { changeLanguage, i18n } from "./helpers/i18nTestHelpers";

const getWrappedCustomize = () => (
  <I18nextProvider i18n={i18n}>
    <DisplayModeProvider>
      <UnitPreferencesProvider>
        <CustomizeScreen />
      </UnitPreferencesProvider>
    </DisplayModeProvider>
  </I18nextProvider>
);

const renderWithI18n = () => render(getWrappedCustomize());

describe("CustomizeScreen localization", () => {
  it("swaps route preview labels when the language changes", async () => {
    await changeLanguage("es");
    const { rerender } = renderWithI18n();

    expect(await screen.findByText("Paseo Luces del Puerto")).toBeInTheDocument();

    await changeLanguage("en-GB");
    rerender(getWrappedCustomize());

    expect(await screen.findByText("Harbour Lights Promenade")).toBeInTheDocument();
  });
});
