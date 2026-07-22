import test from "node:test";
import assert from "node:assert/strict";
import { layoutGitGraph } from "../src/composables/gitGraphLayout.js";

test("graph layout creates lanes, merge edges, branch labels, and HEAD", () => {
  const commits = [
    { hash: "a", branch: "main", parents: [] },
    { hash: "b", branch: "feature", parents: ["a"] },
    { hash: "c", branch: "main", parents: ["a", "b"] },
  ];
  const layout = layoutGitGraph(commits, { main: "c", feature: "b" }, "main");
  assert.equal(layout.nodes.length, 3);
  assert.equal(layout.edges.length, 3);
  assert.notEqual(layout.nodes.find((node) => node.hash === "a").x, layout.nodes.find((node) => node.hash === "b").x);
  assert.deepEqual(layout.labels.find((label) => label.branch === "main"), { branch: "main", hash: "c", head: true, kind: "branch" });
});

test("graph layout places tag labels on their commit", () => {
  const layout = layoutGitGraph([{ hash: "a", branch: "main", parents: [] }], { main: "a" }, "main", { "v1.0": "a" });
  assert.deepEqual(layout.labels.find((label) => label.kind === "tag"), { branch: "v1.0", hash: "a", head: false, kind: "tag" });
});
