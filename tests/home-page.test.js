import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const home = await readFile(
  new URL("../src/views/Home.vue", import.meta.url),
  "utf8",
);

test("home keeps its editorial hero, terminal demo, and chapter log", () => {
  for (const name of [
    'class="hero"',
    "hero__next",
    "demo__terminal",
    "log__list",
    "entryOf(chapter.id)",
  ]) {
    assert.ok(home.includes(name), name);
  }
  assert.ok(home.includes("<h1>Git Daily</h1>"));
  assert.ok(home.includes("七章，三十八關"));
});

test("tablet layout stacks the hero without horizontal overflow", () => {
  assert.match(
    home,
    /@media \(max-width:\s*900px\)[\s\S]*?\.hero\s*\{[^}]*grid-template-columns:\s*1fr/,
  );
  assert.match(
    home,
    /@media \(max-width:\s*900px\)[\s\S]*?\.hero__next\s*\{[^}]*border-top:\s*1px solid var\(--border\)/,
  );
});

test("mobile layout wraps headline, terminal output, and chapter metadata", () => {
  assert.match(
    home,
    /@media \(max-width:\s*600px\)[\s\S]*?\.hero__story h2\s*\{[^}]*white-space:\s*normal/,
  );
  assert.match(
    home,
    /@media \(max-width:\s*600px\)[\s\S]*?\.demo__terminal pre\s*\{[^}]*overflow-wrap:\s*anywhere/,
  );
  assert.match(
    home,
    /@media \(max-width:\s*600px\)[\s\S]*?\.log__item a\s*\{[^}]*grid-template-columns:\s*50px minmax\(0,\s*1fr\)/,
  );
});

test("small phones use full-width actions and compact spacing", () => {
  assert.match(
    home,
    /@media \(max-width:\s*420px\)[\s\S]*?\.hero__actions\s*\{[^}]*grid-template-columns:\s*1fr/,
  );
  assert.match(
    home,
    /@media \(max-width:\s*420px\)[\s\S]*?\.hero__actions \.btn\s*\{[^}]*width:\s*100%/,
  );
});

test("terminal animation respects reduced motion", () => {
  assert.ok(home.includes('matchMedia("(prefers-reduced-motion: reduce)")'));
  assert.match(
    home,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.demo__caret\s*\{[^}]*animation:\s*none/,
  );
});
