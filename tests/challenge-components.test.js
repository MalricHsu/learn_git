import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (name) => readFile(new URL(`../src/components/challenge/${name}`, import.meta.url), "utf8");

test("roadmap and brief expose Chinese challenge metadata and three hint levels", async () => {
  const [roadmap, brief] = await Promise.all([read("ChallengeRoadmap.vue"), read("ChallengeBrief.vue")]);
  for (const state of ["done", "current", "locked"]) assert.ok(roadmap.includes(state));
  for (const label of ["Challenge Roadmap", "闖關地圖", "難度", "獎勵", "學習目標"]) {
    assert.ok((roadmap + brief).includes(label), label);
  }
  assert.ok(brief.includes("challenge.hints"));
  assert.equal(roadmap.includes("challenge.summary.zh"), false);
  assert.ok(roadmap.includes("visibleChallenges"));
  assert.ok(roadmap.includes("challenge.code"));
  assert.ok(roadmap.includes("roadmap__track"));
  assert.ok(roadmap.includes("scrollBy"));
  assert.match(roadmap, /overflow-x:\s*auto/);
  assert.ok(brief.includes("challenge.learningConcept.zh"));
  assert.equal(brief.includes("challenge.learningConcept.en"), false);
  assert.equal(brief.includes("challenge.learningGoal"), false);
  assert.ok(brief.includes("brief__headline"));
  assert.ok(brief.includes("brief__stats"));
  assert.equal(brief.includes('class="brief card"'), false);
});

test("visualization uses tabs while the game renders dynamic teaching feedback", async () => {
  const [container, tabs, workflow, game] = await Promise.all([
    read("GitVisualization.vue"),
    read("VisualizationTabs.vue"),
    read("GitWorkflow.vue"),
    readFile(new URL("../src/views/Game.vue", import.meta.url), "utf8"),
  ]);
  assert.ok(container.includes("VisualizationTabs"));
  assert.ok(game.includes("resolveEditorsDesk"));
  assert.ok(game.includes("challenge-complete__desk"));
  for (const component of ["GitWorkflow", "GitGraph", "CommitTimeline"]) assert.ok(tabs.includes(component));
  for (const field of ["workingDirectory", "stagingArea", "repository"]) assert.ok(workflow.includes(field));
  assert.equal(workflow.includes("{{ state[zone.key].length }}"), false);
  assert.equal(container.includes("Repository Status"), false);
  assert.match(tabs, /border-radius:\s*0/);
});

test("game terminal opens each challenge with a compact story prompt", async () => {
  const game = await readFile(new URL("../src/views/Game.vue", import.meta.url), "utf8");
  for (const field of ["c.title.zh", "c.story.prompt", "c.story.pressure", "c.summary.zh"]) {
    assert.ok(game.includes(field), field);
  }
  assert.ok(game.includes("入職任務"));
  assert.ok(game.includes("# 情境："));
  assert.ok(game.includes("# 為什麼現在要做："));
  assert.ok(game.includes("# 任務："));
  assert.equal(game.includes("c.story.opening"), false);
  assert.equal(game.includes("c.story.stakes"), false);
  assert.equal(game.includes("c.story.payoff"), false);
});
