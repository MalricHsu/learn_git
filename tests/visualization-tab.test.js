import test from "node:test";
import assert from "node:assert/strict";
import { tabForTeachingKey } from "../src/composables/visualizationTab.js";

test("teaching keys select the visualization that best explains the action", () => {
  for (const key of ["init", "status", "add", "commit", "restore", "stash", "rm", "rm-cached"]) assert.equal(tabForTeachingKey(key, "graph"), "workflow");
  for (const key of ["branch", "branch-delete", "switch", "merge", "tag", "tag-delete", "rebase"]) assert.equal(tabForTeachingKey(key, "workflow"), "graph");
  for (const key of ["log", "log-oneline", "blame", "reflog", "revert"]) assert.equal(tabForTeachingKey(key, "workflow"), "timeline");
  for (const key of ["remote-add", "fetch", "pull", "push", "unknown"]) assert.equal(tabForTeachingKey(key, "graph"), "graph");
});
