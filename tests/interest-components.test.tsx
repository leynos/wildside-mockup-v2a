/** @file Behavioural tests for interest-driven UI components.
 *
 * Bun provides the test runner.
 */

import { beforeAll, describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { I18nextProvider } from "react-i18next";

import { InterestToggleGroup } from "../src/app/components/interest-toggle-group";
import { DiscoverScreen } from "../src/app/features/discover";
import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { changeLanguage, i18n, i18nReady } from "./helpers/i18nTestHelpers";

const renderWithI18n = (ui: JSX.Element) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

beforeAll(async () => {
  await i18nReady;
});

describe("Interest-driven UI", () => {
  it("renders InterestToggleGroup labels from the registry", async () => {
    await changeLanguage("es");

    renderWithI18n(
      <InterestToggleGroup
        ariaLabel="Interests"
        interestIds={["markets", "food"]}
        selected={[]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Mercados")).toBeInTheDocument();
    expect(screen.getByText("Comida callejera")).toBeInTheDocument();
  });

  it("uses registry localizations in DiscoverScreen interest chips", async () => {
    await changeLanguage("es");

    renderWithI18n(
      <DisplayModeProvider>
        <DiscoverScreen />
      </DisplayModeProvider>,
    );

    expect(screen.getByText("Arte urbano")).toBeInTheDocument();
    expect(screen.getByText("Parques y naturaleza")).toBeInTheDocument();
  });
});
