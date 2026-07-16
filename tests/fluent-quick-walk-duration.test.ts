/** @file Verifies Fluent translations and quick-walk duration formatting. */
import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { FluentBundle, FluentResource } from "@fluent/bundle";

const loadMessage = (minutes: number, locale = "en-US") => {
  const ftlPath = path.join("public", "locales", locale, "common.ftl");
  const source = fs.readFileSync(ftlPath, "utf-8");
  const bundle = new FluentBundle(locale);
  bundle.addResource(new FluentResource(source));

  const message = bundle.getMessage("quick-walk-duration-format");
  if (!message?.value) throw new Error("missing message");

  const formatted = bundle.formatPattern(message.value, { count: minutes });
  return formatted.replace(/\u2068|\u2069/g, "");
};

describe("quick walk duration Fluent message", () => {
  it("pluralizes minutes using the term with count", () => {
    expect(loadMessage(1)).toBe("1 minute");
    expect(loadMessage(2)).toBe("2 minutes");
  });

  it("uses Italian plural rules when count is provided", () => {
    expect(loadMessage(1, "it")).toBe("1 minuto");
    expect(loadMessage(2, "it")).toBe("2 minuti");
    expect(loadMessage(0, "it")).toBe("0 minuti");
  });

  it("pluralizes Vietnamese minute labels correctly", () => {
    expect(loadMessage(1, "vi")).toBe("1 phút");
    expect(loadMessage(3, "vi")).toBe("3 phút");
  });

  it("throws when the required count is omitted", () => {
    const ftlPath = path.join("public", "locales", "it", "common.ftl");
    const source = fs.readFileSync(ftlPath, "utf-8");
    const bundle = new FluentBundle("it");
    bundle.addResource(new FluentResource(source));
    const message = bundle.getMessage("quick-walk-duration-format");
    if (!message?.value) throw new Error("missing message");
    const pattern = message.value;
    expect(() => bundle.formatPattern(pattern)).toThrow();
  });
});
