import test from "node:test";
import assert from "node:assert/strict";
import { chapters, challenges } from "../src/data/challenges.js";

test("curriculum contains six chapters and exactly 32 terminal challenges", () => {
  assert.equal(chapters.length, 6);
  assert.equal(challenges.length, 32);
  assert.equal(challenges.filter((challenge) => challenge.final).length, 6);
  assert.equal(challenges.filter((challenge) => !challenge.final).length, 26);
  assert.ok(challenges.every((challenge) => challenge.type === "terminal"));
});

test("every challenge has complete game and teaching configuration", () => {
  assert.equal(new Set(challenges.map((challenge) => challenge.id)).size, 32);
  for (const challenge of challenges) {
    assert.ok(challenge.title.en && challenge.title.zh, `${challenge.id} title`);
    assert.ok(challenge.summary.en && challenge.summary.zh, `${challenge.id} summary`);
    assert.ok(challenge.story.zh, `${challenge.id} story`);
    assert.equal(challenge.hints.length, 3, `${challenge.id} hints`);
    assert.ok(challenge.steps.length > 0, `${challenge.id} steps`);
    assert.ok(challenge.editorial.intro.title, `${challenge.id} editorial`);
  }
});

test("challenge UI data avoids test-site terminology", () => {
  const text = JSON.stringify(challenges);
  for (const banned of ["Mission", "Exercise", "Question"]) {
    assert.equal(text.includes(banned), false, `remove ${banned}`);
  }
});
