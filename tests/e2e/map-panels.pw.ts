/** @file Playwright assertions for map overlay styling semantics. */

import { expect, test } from "@playwright/test";

const alphaFromColor = (value: string | null): number | null => {
  if (!value) return null;
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return 1;
  const components = match[1];
  if (!components) return 1;
  const parts = components.split(/\s*,\s*/);
  if (parts.length < 4) return 1;
  const alpha = Number.parseFloat(parts[3] ?? "1");
  return Number.isNaN(alpha) ? 1 : alpha;
};

test.describe("Map overlay panels", () => {
  test("quick walk stops and notes panels have opaque map-panel background", async ({ page }) => {
    await page.goto("/map/quick");

    await page.getByRole("tab", { name: /stops/i }).click();
    const stopsPanel = page.getByRole("region", { name: /quick walk stops/i });
    await expect(stopsPanel).toBeVisible();
    const stopsStyle = await stopsPanel.evaluate((node) => {
      const style = window.getComputedStyle(node as HTMLElement);
      return { backgroundColor: style.backgroundColor };
    });
    const stopsAlpha = alphaFromColor(stopsStyle.backgroundColor);
    expect(stopsAlpha).not.toBeNull();
    expect(stopsAlpha).toBeGreaterThanOrEqual(0.9);

    await page.getByRole("tab", { name: /notes/i }).click();
    const notesPanel = page.getByRole("region", { name: /planning notes/i });
    await expect(notesPanel).toBeVisible();
    const notesStyle = await notesPanel.evaluate((node) => {
      const style = window.getComputedStyle(node as HTMLElement);
      return { backgroundColor: style.backgroundColor };
    });
    const notesAlpha = alphaFromColor(notesStyle.backgroundColor);
    expect(notesAlpha).not.toBeNull();
    expect(notesAlpha).toBeGreaterThanOrEqual(0.9);
  });
});
