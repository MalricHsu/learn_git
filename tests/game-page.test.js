import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const game = await readFile(new URL("../src/views/Game.vue", import.meta.url), "utf8");

test("game page composes the challenge experience", () => {
  for (const name of ["ChallengeRoadmap", "ChallengeBrief", "GitVisualization", "Terminal"]) assert.ok(game.includes(name));
  for (const text of ["闖關學習", "闖關完成", "累計 XP", "已完成"]) assert.ok(game.includes(text), text);
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
  // Section names are Chinese and identical to the nav and footer wording.
  assert.ok(game.includes("闖關學習"));
  assert.equal(game.includes("Challenge Edition"), false);
  assert.match(game, /\.challenge-head\s*\{[^}]*border-top:\s*3px double var\(--ink\)/s);
  assert.match(game, /\.challenge-progress\s*\{[^}]*border-left:\s*1px solid var\(--border\)/s);
});
