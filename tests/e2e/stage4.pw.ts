/** @file Playwright checks for Stage 4 completion and safety flows. */

import { expect, test } from "@playwright/test";

test.describe("Stage 4 routes", () => {
  const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  test("walk complete triggers rating toast", async ({ page }) => {
    await page.goto("/walk-complete");
    await expect(page.getByRole("heading", { name: /walk complete/i })).toBeVisible();
    await page.getByRole("button", { name: /rate this walk/i }).click();
    const toast = page.getByText(/rating saved/i).first();
    await expect(toast).toBeVisible();
  });

  test("offline manager lists downloads", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: /offline maps/i })).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("offline manager delete flow", async ({ page }) => {
    await page.goto("/offline");
    await page.getByRole("button", { name: /manage/i }).click();
    const doneToggle = page.getByRole("button", { name: /^done$/i });
    const downloadsRegion = page.getByRole("region", { name: /downloaded areas/i });
    const downloadCards = downloadsRegion.getByRole("article").filter({ hasNotText: /deleted/i });
    const undoCards = downloadsRegion.getByRole("article").filter({ hasText: /deleted/i });
    const deleteButtons = downloadsRegion.getByRole("button", { name: /^delete /i });

    const cardsBefore = await downloadCards.count();
    const firstCard = downloadCards.first();
    const deletedTitle = (await firstCard.locator("h3").textContent())?.trim() ?? "";
    await expect(deleteButtons).toHaveCount(cardsBefore);
    await deleteButtons.first().click();
    await expect(downloadCards).toHaveCount(cardsBefore - 1);
    const undoForDeleted = undoCards.filter({
      hasText: new RegExp(`${escapeRegExp(deletedTitle)}.+deleted`, "i"),
    });
    await expect(undoForDeleted).toBeVisible();
    await undoForDeleted.getByRole("button", { name: /^undo$/i }).click();
    await expect(undoCards).toHaveCount(0);
    await expect(downloadCards).toHaveCount(cardsBefore);

    // Delete again and confirm Done clears the undo state permanently
    await deleteButtons.first().click();
    await expect(undoCards).toHaveCount(1);
    await doneToggle.click();
    await expect(page.getByRole("button", { name: /manage/i })).toBeVisible();
    await expect(undoCards).toHaveCount(0);
    await expect(downloadCards).toHaveCount(cardsBefore - 1);
  });

  test("auto-management switches respond to toggling", async ({ page }) => {
    await page.goto("/offline");
    const autoSwitch = page.getByRole("switch", { name: /auto-update maps/i });
    await expect(autoSwitch).toHaveAttribute("data-state", "unchecked");
    const offBackground = await autoSwitch.evaluate(
      (element) => getComputedStyle(element as HTMLElement).backgroundColor,
    );
    expect(offBackground).toBeTruthy();

    await autoSwitch.click();
    await expect(autoSwitch).toHaveAttribute("data-state", "checked");

    const onBackground = await autoSwitch.evaluate(
      (element) => getComputedStyle(element as HTMLElement).backgroundColor,
    );
    expect(onBackground).not.toBe(offBackground);
  });

  test("safety preferences accordion toggles", async ({ page }) => {
    await page.goto("/safety-accessibility");
    const mobilitySection = page.getByRole("button", { name: /mobility support/i });
    const triggerState = await mobilitySection.getAttribute("data-state");
    if (triggerState !== "open") {
      await mobilitySection.click();
      await expect(mobilitySection).toHaveAttribute("data-state", "open");
    }
    const toggle = page.getByRole("switch", { name: /step-free routes/i });
    const initialState = await toggle.getAttribute("data-state");
    await toggle.scrollIntoViewIfNeeded();
    await toggle.evaluate((element) => {
      (element as HTMLElement).click();
    });
    await expect(toggle).not.toHaveAttribute("data-state", initialState ?? "");
    await page.getByRole("button", { name: /save preferences/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
