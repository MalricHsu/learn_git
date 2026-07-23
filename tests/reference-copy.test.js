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

test("reference uses the long-form article layout", () => {
  for (const className of [
    "ref__head",
    "ref__chapters",
    "ref__strip",
    "ref__title",
    "ref__body",
    "ref__main",
    "ref__aside",
  ]) {
    assert.ok(source.includes(className), `render ${className}`);
  }

  // The old two-page "book spread" skeuomorphism is gone.
  assert.equal(source.includes("book-spread"), false);
  assert.equal(source.includes("book-page__label"), false);
  assert.equal(source.includes("newspaper-title"), false);
  assert.equal(source.includes("Git 專有名詞"), false);
  assert.equal(source.includes("vocabulary.slice"), false);
});

test("reference keeps the teaching headings and marks where you are", () => {
  for (const heading of ["核心概念", "Git 內部發生了什麼", "在終端機試一次", "語法", "容易踩到的坑", "接著讀"])
    assert.ok(source.includes(heading), heading);
  // Chapter and command rows each show an active state, at different weights.
  assert.match(source, /\.ref__chapters a\.active\s*\{[^}]*border-bottom-color:\s*var\(--primary\)/s);
  assert.match(source, /\.ref__strip a\.active\s*\{[^}]*border-bottom-color:\s*var\(--primary\)/s);
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

test("article runs long-form on the left with a reference sidebar", () => {
  assert.match(source, /\.ref__body\s*\{[^}]*grid-template-columns:\s*minmax\(0, 7fr\) minmax\(230px, 3fr\)/s);
  // The sidebar scrolls with the page — it is not pinned.
  assert.equal(source.includes("position: sticky"), false);
});

test("the command name is the headline and saving it is a real control", () => {
  assert.match(source, /\.ref__title h2\s*\{[^}]*font-family:\s*var\(--mono\)/s);
  assert.match(source, /\.ref__title h2\s*\{[^}]*font-size:\s*clamp\(38px, 6\.6vw, 88px\)/s);
  assert.ok(source.includes('class="ref__fav"'));
  assert.ok(source.includes("toggleFavorite"));
});

test("destructive commands lead with what they cost", () => {
  assert.ok(source.includes("ref__danger"));
  for (const label of ["會失去什麼", "救不救得回來", "更安全的做法"])
    assert.ok(source.includes(label), label);
});

test("reference reads as a connected newsroom learning story", () => {
  assert.ok(source.includes('from "../data/referenceStories.js"'));
  assert.ok(source.includes("storyBySlug(current.value.slug)"));
  for (const part of ["story.scene", "story.choice", "story.result", "story.next"])
    assert.ok(source.includes(part), part);
  assert.ok(source.includes("為什麼現在用"));
});
