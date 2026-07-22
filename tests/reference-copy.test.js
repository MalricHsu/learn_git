import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { bySlug } from "../src/data/commands.js";

const source = await readFile(new URL("../src/views/Reference.vue", import.meta.url), "utf8");

test("reference article uses Chinese explanatory headings", () => {
  for (const englishHeading of [
    "What is it",
    "Why do we use it",
    "Workflow<span",
    "Syntax &amp; Example",
    "Common Mistakes",
    "Related Commands",
  ]) {
    assert.equal(source.includes(englishHeading), false, `remove ${englishHeading}`);
  }
});

test("reference article does not repeat English explanation paragraphs", () => {
  for (const binding of ["current.what.en", "current.why.en", "{{ m.en }}"]) {
    assert.equal(source.includes(binding), false, `remove ${binding}`);
  }
});

test("reference uses a single-screen book layout", () => {
  for (const className of [
    "reference-book",
    "book-chapters",
    "book-spread",
    "book-page",
    "book-command-strip",
    "newspaper-title",
    "book-lead-story",
    "book-left-bottom",
  ]) {
    assert.ok(source.includes(className), `render ${className}`);
  }

  assert.equal(source.includes('class="sidebar__group"'), false);
  assert.equal(source.includes('class="chapter-index"'), false);
  assert.equal(source.includes("Git 專有名詞"), false);
  assert.equal(source.includes("vocabulary.slice"), false);
  assert.equal(source.includes("currentPage"), false);
  assert.equal(source.includes("book-pagination"), false);
  assert.doesNotMatch(source, /\.reference-book\s*\{[^}]*height:\s*calc\(100vh - 64px\)/s);
  assert.equal(source.includes('class="book-title"'), false);
});

test("reference makes command navigation and terminal hierarchy explicit", () => {
  assert.ok(source.includes("本章指令"));
  assert.ok(source.includes("正在閱讀"));
  assert.ok(source.includes("核心概念"));
  assert.ok(source.includes("什麼時候會用到"));
  assert.ok(source.includes("Git 內部發生了什麼"));
  assert.ok(source.includes("實際操作"));
  assert.match(source, /\.book-terminal-section\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
});

test("git init provides a complete editorial explanation", () => {
  const command = bySlug("git-init");
  assert.ok(command.scenario.zh.length > 70);
  assert.ok(command.internals.zh.length > 70);
  assert.ok(command.outputNote.zh.length > 60);
});

test("every reference command provides complete editorial guidance", () => {
  for (const command of [
    "git-clone", "git-status", "git-add", "git-commit", "git-log",
    "git-branch", "git-switch", "git-merge", "git-rebase", "git-fetch",
    "git-pull", "git-push", "git-stash", "git-restore", "git-reset",
  ].map(bySlug)) {
    assert.ok(command.scenario.zh.length > 35, `${command.slug} scenario`);
    assert.ok(command.internals.zh.length > 35, `${command.slug} internals`);
    assert.ok(command.outputNote.zh.length > 35, `${command.slug} output note`);
  }
});

test("usage timing and internals read as stacked sections", () => {
  assert.match(source, /\.book-left-bottom\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test("article sections share one body size and newspaper endings", () => {
  assert.match(source, /\.reference-book\s*\{[^}]*--book-body:\s*16px/s);
  assert.match(source, /\.book-page section\s*\{[^}]*border-bottom:\s*3px double var\(--ink\)/s);
  assert.match(source, /\.book-notes-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(source, /\.book-related a\s*\{[^}]*border:\s*1px solid var\(--primary\)/s);
});

test("book removes the center seam and groups follow-up content", () => {
  assert.equal(source.includes(".book-spread::after"), false);
  assert.ok(source.includes('class="book-footer-flex"'));
  assert.match(source, /\.book-footer-flex\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
  assert.match(source, /\.book-footer-flex\s*\{[^}]*display:\s*flex/s);
  assert.equal(source.includes(".book-pitfalls, .book-next"), false);
  assert.match(source, /\.book-page--left \.book-workflow,[^}]*border-bottom:\s*0/s);
  assert.match(source, /\.book-footer-flex\s*\{[^}]*border-top:\s*3px double var\(--ink\)/s);
  assert.match(source, /\.book-footer-flex\s*\{[^}]*border-bottom:\s*0/s);
});
