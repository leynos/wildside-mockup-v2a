import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { within } from "@testing-library/dom";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { ThemeProvider } from "../src/app/providers/theme-provider";
import { AppRoutes, createAppRouter } from "../src/app/routes/app-routes";
import { UnitPreferencesProvider } from "../src/app/units/unit-preferences-provider";
import i18n from "../src/i18n";

async function renderRoute(path: string) {
  window.history.replaceState(null, "", path);
  const pathname = path.split("#")[0] as "/map/quick";
  const router = createAppRouter();
  await router.navigate({ to: pathname, replace: true });
  if (path.includes("#")) {
    const [, hash] = path.split("#");
    window.location.hash = `#${hash}`;
  }
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => {
    root.render(
      <React.Suspense fallback={null}>
        <UnitPreferencesProvider>
          <DisplayModeProvider>
            <ThemeProvider>
              <AppRoutes routerInstance={router} />
            </ThemeProvider>
          </DisplayModeProvider>
        </UnitPreferencesProvider>
      </React.Suspense>,
    );
    await Promise.resolve();
  });
  return { root, host };
}

describe("quick map hash fragments", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  const cleanup = () => {
    if (root && host) {
      act(() => root?.unmount());
    }
    host?.remove();
    document.body.innerHTML = "";
    root = null;
    host = null;
  };

  beforeEach(async () => {
    cleanup();
    await i18n.changeLanguage("en-GB");
  });
  afterEach(() => cleanup());

  it("activates the stops tab when loading #stops", async () => {
    ({ root, host } = await renderRoute("/map/quick#stops"));
    await act(async () => {
      await Promise.resolve();
    });
    const view = within(document.body);
    const mapViewport = view.getByRole("region", { name: /quick walk map viewport/i });
    expect(mapViewport.className.includes("flex")).toBe(true);

    const stopsTabpanel = view.getByRole("tabpanel", { name: /stops/i });
    expect(stopsTabpanel.hasAttribute("hidden")).toBe(false);
    const stopsPanel = within(stopsTabpanel).getByRole("region", { name: /quick walk stops/i });
    expect(stopsPanel).toBeTruthy();
  });

  it("activates the notes tab with updated max height when loading #notes", async () => {
    ({ root, host } = await renderRoute("/map/quick#notes"));
    await act(async () => {
      await Promise.resolve();
    });
    const view = within(document.body);
    const notesTabpanel = view.getByRole("tabpanel", { name: /notes/i });
    expect(notesTabpanel.hasAttribute("hidden")).toBe(false);
    const notesPanel = within(notesTabpanel).getByRole("region", { name: /planning notes/i });
    expect(notesPanel.className.includes("max-h-[53vh]")).toBe(true);
  });
});
