/** @file Accessibility tree snapshot tests for key Wildside routes. */

import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import type { StyleTarget } from "./utils/accessibility";
import {
  captureAccessibilityTree,
  captureComputedStyles,
  slugifyPath,
  waitForPrimaryContent,
} from "./utils/accessibility";

interface SnapshotTarget {
  path: string;
  label: string;
  waitForSelector?: string;
  styleTargets?: StyleTarget[];
}

const snapshotTargets: SnapshotTarget[] = [
  { path: "/explore", label: "Explore" },
  { path: "/map/quick", label: "Quick Map" },
  { path: "/wizard/step-1", label: "Wizard Step 1" },
  {
    path: "/customize",
    label: "Customize",
    waitForSelector: "[data-segment-id='crowd'] [data-radix-collection-item]",
    styleTargets: [
      {
        selector: "[data-segment-id='crowd'] [data-radix-collection-item][data-state='on']",
        properties: [
          "background-color",
          "border-top-color",
          "border-radius",
          "box-shadow",
          "padding-top",
          "padding-left",
          "color",
        ],
      },
      {
        selector: "[data-segment-id='crowd'] [data-radix-collection-item][data-state='off']",
        properties: [
          "background-color",
          "border-top-color",
          "border-radius",
          "box-shadow",
          "padding-top",
          "padding-left",
          "color",
        ],
      },
    ],
  },
];

async function removeMapLibreControls(page: Page): Promise<void> {
  const controls = page.locator(".maplibregl-ctrl");
  const count = await controls.count();
  for (let index = count - 1; index >= 0; index -= 1) {
    await controls.nth(index).evaluate((node) => node.remove());
  }
}

test.describe("Accessibility tree snapshots", () => {
  for (const target of snapshotTargets) {
    test(`${target.label} matches stored accessibility tree`, async ({ page }) => {
      await page.goto(target.path);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      if (target.waitForSelector) {
        await page.waitForSelector(target.waitForSelector);
      }
      if (target.path === "/map/quick") {
        await removeMapLibreControls(page);
      }
      await waitForPrimaryContent(page);

      const tree = await captureAccessibilityTree(page);
      const styleSamples = target.styleTargets
        ? await captureComputedStyles(page, target.styleTargets)
        : [];
      const snapshotPayload = `${JSON.stringify(
        { accessibilityTree: tree, computedStyles: styleSamples },
        null,
        2,
      )}\n`;
      expect(snapshotPayload).toMatchSnapshot(`${slugifyPath(target.path)}-aria-tree.json`);
    });
  }
});
