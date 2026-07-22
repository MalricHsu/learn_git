import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const game = await readFile(new URL("../src/views/Game.vue", import.meta.url), "utf8");

test("game page composes the challenge experience", () => {
  for (const name of ["ChallengeRoadmap", "ChallengeBrief", "GitVisualization", "Terminal"]) assert.ok(game.includes(name));
  for (const text of ["Challenge", "闖關", "CHALLENGES COMPLETE"]) assert.ok(game.includes(text));
});

test("game page is terminal-only and removes old dashboard panels", () => {
  for (const removed of ["Repository Status", "Untracked", "Pushed", "Branch Tree", "Commit History", "Editor's Note"]) {
    assert.equal(game.includes(removed), false, removed);
  }
  assert.equal(game.includes("mission.options"), false);
});
