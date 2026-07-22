import test from "node:test";
import assert from "node:assert/strict";
import { drills, poolFor } from "../src/data/drills.js";

test("practice pools contain exactly 60 questions each", () => {
  assert.equal(poolFor("choice").length, 60);
  assert.equal(poolFor("input").length, 60);
});

test("every drill has a unique id and a Chinese hint", () => {
  assert.equal(new Set(drills.map((drill) => drill.id)).size, drills.length);
  for (const drill of drills) {
    assert.equal(typeof drill.hint?.zh, "string", `${drill.id} needs hint.zh`);
    assert.ok(drill.hint.zh.trim(), `${drill.id} needs a non-empty hint.zh`);
  }
});

test("every input drill has at least one answer matcher", () => {
  for (const drill of poolFor("input")) {
    assert.ok(drill.accept.length > 0, `${drill.id} needs an input matcher`);
  }
});
