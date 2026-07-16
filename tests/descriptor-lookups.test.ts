import { describe, expect, it } from "bun:test";

import { getBadgeDescriptor } from "../src/app/data/registries/badges";
import { getTagDescriptor } from "../src/app/data/registries/tags";
import type { LocaleCode } from "../src/app/domain/entities/localization";

describe("descriptor lookup helpers", () => {
  describe("getTagDescriptor", () => {
    it("returns a resolved descriptor with localization applied", () => {
      const resolved = getTagDescriptor("coffee", "es-MX");
      expect(resolved).toBeDefined();
      expect(resolved?.localization.name).toBe("Café");
    });

    it("returns undefined for unknown ids", () => {
      expect(getTagDescriptor("unknown", "en-GB")).toBeUndefined();
    });
  });

  describe("getBadgeDescriptor", () => {
    it("returns a resolved descriptor with localization applied", () => {
      const resolved = getBadgeDescriptor("sunset-pick", "en-GB" satisfies LocaleCode);
      expect(resolved?.localization.shortLabel).toBe("Sunset");
    });

    it("respects fallback locales when the requested locale is missing", () => {
      const resolved = getBadgeDescriptor("teal-line", "fr" satisfies LocaleCode);
      expect(resolved?.localization.name).toBe("Teal line");
    });

    it("returns undefined for unknown ids", () => {
      // @ts-expect-error intentional invalid id to verify runtime guard
      expect(getBadgeDescriptor("unknown", "en-GB" satisfies LocaleCode)).toBeUndefined();
    });
  });
});
