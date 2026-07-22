import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/views/Practice.vue", import.meta.url), "utf8");

test("practice offers a per-question Chinese hint that resets", () => {
  assert.ok(source.includes("current.hint.zh"));
  assert.ok(source.includes("showHint.value = false"));
  assert.ok(source.includes(':aria-expanded="showHint"'));
});

test("wrong-answer feedback identifies given answer, solution, and Chinese explanation", () => {
  assert.ok(source.includes("你的答案"));
  assert.ok(source.includes("current.solution"));
  assert.ok(source.includes("current.note.zh"));
  assert.equal(source.includes("current.note.en"), false);
});
