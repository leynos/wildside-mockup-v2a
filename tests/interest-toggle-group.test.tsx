import { beforeAll, describe, expect, it } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { I18nextProvider } from "react-i18next";

import { InterestToggleGroup } from "../src/app/components/interest-toggle-group";
import { changeLanguage, i18n, i18nReady } from "./helpers/i18nTestHelpers";

beforeAll(async () => {
  await i18nReady;
});

const renderWithI18n = (ui: JSX.Element) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

describe("InterestToggleGroup", () => {
  it("renders localized interest labels and toggles selection", async () => {
    await changeLanguage("es");

    let selected: string[] = ["street-art"];
    const onChange = (next: string[]) => {
      selected = next;
    };

    renderWithI18n(
      <InterestToggleGroup
        interestIds={["street-art", "food"]}
        selected={selected}
        onChange={onChange}
        ariaLabel="Intereses"
      />,
    );

    const foodChip = screen.getByRole("button", { name: /comida callejera/i });
    expect(foodChip).toBeInTheDocument();

    fireEvent.click(foodChip);
    expect(selected).toContain("food");
  });
});
