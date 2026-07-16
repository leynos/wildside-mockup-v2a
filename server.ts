/** @file Minimal Bun static server with SPA fallback for the playground build. */

import { serve } from "bun";

function normalizeBasePath(input: string | undefined): string {
  if (!input || input === "/") {
    return "/";
  }
  const prefixed = input.startsWith("/") ? input : `/${input}`;
  return prefixed.endsWith("/") ? prefixed : `${prefixed}/`;
}

// biome-ignore lint/complexity/useLiteralKeys: process.env exposes string index keys at runtime.
const port = Number(process.env["PORT"] ?? 3000);
const dist = new URL("./dist", import.meta.url).pathname;
// biome-ignore lint/complexity/useLiteralKeys: process.env exposes string index keys at runtime.
const basePath = normalizeBasePath(process.env["APP_BASE_PATH"]);

serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const hasBase = basePath !== "/" && pathname.startsWith(basePath);
    const relativePath = hasBase ? `/${pathname.slice(basePath.length)}` : pathname;
    const targetPath = relativePath === "/" ? "/index.html" : relativePath;
    const candidate = Bun.file(`${dist}${targetPath}`);

    if (await candidate.exists()) {
      return new Response(candidate);
    }

    const fallback = Bun.file(`${dist}/index.html`);
    if (await fallback.exists()) {
      return new Response(fallback, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`🚀 Serving dist/ on http://localhost:${port}`);
