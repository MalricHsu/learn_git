import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [logo, nav, home, html, favicon] = await Promise.all([
  readFile(new URL("../src/components/GitDailyLogo.vue", import.meta.url), "utf8"),
  readFile(new URL("../src/components/SiteNav.vue", import.meta.url), "utf8"),
  readFile(new URL("../src/views/Home.vue", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
]);

test("logo contains a GD newspaper seal and wordmark", () => {
  assert.ok(logo.includes("logo__seal"));
  assert.ok(logo.includes("logo__wordmark"));
  assert.ok(logo.includes("LEARN · COMMIT · GROW"));
  assert.ok(logo.includes('aria-label="Git Daily"'));
});

test("navigation and homepage use compact and masthead logo variants", () => {
  assert.ok(nav.includes("GitDailyLogo"));
  assert.ok(nav.includes('variant="compact"'));
  assert.ok(home.includes("GitDailyLogo"));
  assert.ok(home.includes('variant="masthead"'));
});

test("document links to a matching SVG favicon", () => {
  assert.ok(html.includes('rel="icon"'));
  assert.ok(html.includes('/favicon.svg'));
  assert.ok(favicon.includes("GD"));
});
