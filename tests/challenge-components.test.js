import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (name) => readFile(new URL(`../src/components/challenge/${name}`, import.meta.url), "utf8");

test("roadmap and brief expose challenge states and three hint levels", async () => {
  const [roadmap, brief] = await Promise.all([read("ChallengeRoadmap.vue"), read("ChallengeBrief.vue")]);
  for (const state of ["done", "current", "locked"]) assert.ok(roadmap.includes(state));
  for (const label of ["Challenge Roadmap", "闖關地圖", "Difficulty", "Reward", "Learning Goal"]) {
    assert.ok((roadmap + brief).includes(label), label);
  }
  assert.ok(brief.includes("challenge.hints"));
});

test("visualization contains workflow, graph, timeline, and editor desk only", async () => {
  const [container, workflow] = await Promise.all([read("GitVisualization.vue"), read("GitWorkflow.vue")]);
  for (const component of ["GitWorkflow", "GitGraph", "CommitTimeline", "EditorsDesk"]) assert.ok(container.includes(component));
  for (const field of ["workingDirectory", "stagingArea", "repository"]) assert.ok(workflow.includes(field));
  assert.equal(workflow.includes(".length"), false);
  assert.equal(container.includes("Repository Status"), false);
});
