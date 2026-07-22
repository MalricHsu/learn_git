import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { drillById } from "../src/data/drills.js";

const practice = await readFile(new URL("../src/views/Practice.vue", import.meta.url), "utf8");

test("drillById returns the original drill or null", () => {
  assert.equal(drillById("q-status")?.solution, "git status");
  assert.equal(drillById("missing-question"), null);
});

test("practice records normalized wrong attempts", () => {
  assert.ok(practice.includes("recordMistake"));
  assert.ok(practice.includes("drillId: current.value.id"));
  assert.ok(practice.includes("explanation: current.value.note.zh"));
  assert.ok(practice.includes("answeredAt: new Date().toISOString()"));
});

test("practice starts a mixed retry session from persisted mistake records", () => {
  assert.ok(practice.includes('route.query.mode === "mistakes"'));
  assert.ok(practice.includes("startMistakes"));
  assert.ok(practice.includes("drillById(mistake.drillId)"));
  assert.ok(practice.includes('game.value = "mistakes"'));
  assert.ok(practice.includes("currentMode"));
});

test("a correct answer resolves its record only during mistake retry", () => {
  assert.ok(practice.includes('if (game.value === "mistakes")'));
  assert.ok(practice.includes("resolveMistake(current.value._mistakeId)"));
});
