import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/views/Practice.vue", import.meta.url), "utf8");

test("practice offers a per-question Chinese hint that resets", () => {
  assert.ok(source.includes("current.hint.zh"));
  assert.ok(source.includes("showHint.value = false"));
  assert.ok(source.includes(':aria-expanded="showHint"'));
});

test("practice hint reveals concept before command syntax", () => {
  assert.equal(source.includes("Editor’s Hint"), false);
  assert.ok(source.includes("顯示語法"));
  assert.ok(source.includes("current.solution"));
  assert.ok(source.includes("showSyntaxHint.value = false"));
});

test("wrong-answer feedback identifies given answer, solution, and Chinese explanation", () => {
  assert.ok(source.includes("你的答案"));
  assert.ok(source.includes("current.solution"));
  assert.ok(source.includes("current.note.zh"));
  assert.equal(source.includes("current.note.en"), false);
});

test("practice uses the Git Daily editorial layout", () => {
  for (const value of [
    "測驗",
    "選擇題",
    "手寫題",
    "practice-edition",
    "practice-mode",
    "quiz-sheet",
    "editor-feedback",
  ]) assert.ok(source.includes(value), `render ${value}`);

  // Section wording is Chinese and matches the nav.
  assert.equal(source.includes("Practice Room"), false);
  assert.equal(source.includes("Weekend Practice Edition"), false);
  assert.equal(source.includes("Two Ways to Drill"), false);
  assert.equal(source.includes("Mission Complete"), false);
  assert.equal((source.match(/<div v-else class="quiz-terminal"/g) || []).length, 1);
  assert.match(source, /\.practice\s*\{[^}]*--practice-body:\s*16px/s);
});

test("practice questions present the scenario in Chinese only", () => {
  assert.ok(source.includes("current.scenario.zh"));
  assert.equal(source.includes("current.scenario.en"), false);
});
