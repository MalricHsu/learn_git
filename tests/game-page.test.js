import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const game = await readFile(new URL("../src/views/Game.vue", import.meta.url), "utf8");

test("game page composes the challenge experience", () => {
  for (const name of ["ChallengeRoadmap", "ChallengeBrief", "GitVisualization", "Terminal"]) assert.ok(game.includes(name));
  for (const text of ["Challenge", "闖關", "CHALLENGES", "COMPLETE"]) assert.ok(game.includes(text));
});

test("game page is terminal-only and removes old dashboard panels", () => {
  for (const removed of ["Repository Status", "Untracked", "Pushed", "Branch Tree", "Commit History", "Editor's Note"]) {
    assert.equal(game.includes(removed), false, removed);
  }
  assert.equal(game.includes("mission.options"), false);
});

test("desktop layout prioritizes terminal and editor desk in the first viewport", () => {
  assert.match(game, /grid-template-columns:\s*minmax\(0,\s*1fr\) minmax\(360px,\s*460px\)/);
  assert.match(game, /\.terminal-frame\s*\{[^}]*height:\s*clamp\(360px,\s*52vh,\s*500px\)/s);
  assert.ok(game.includes(":deep(.terminal__body)"));
  assert.match(game, /@media \(max-width: 1080px\)[\s\S]*grid-template-columns:\s*1fr/);
});

test("roadmap sits above the two-column challenge workspace", () => {
  assert.ok(game.indexOf("<ChallengeRoadmap") < game.indexOf('<div class="challenge-layout">'));
  assert.equal(game.includes('grid-template-areas: "roadmap main visualization"'), false);
});

test("page masthead keeps its editorial copy together without orphaned words", () => {
  assert.ok(game.includes("challenge-head__intro"));
  assert.ok(game.includes("Challenge Edition"));
  assert.equal(game.includes("每日闖關"), false);
  assert.match(game, /\.challenge-head\s*\{[^}]*border-top:\s*3px double var\(--ink\)/s);
  assert.match(game, /\.challenge-progress\s*\{[^}]*border-left:\s*1px solid var\(--border\)/s);
});
