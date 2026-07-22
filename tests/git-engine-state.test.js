import test from "node:test";
import assert from "node:assert/strict";
import { createGitEngine } from "../src/composables/useGitEngine.js";

test("GitState exposes visualization-ready fields", () => {
  const engine = createGitEngine({ workingDirectory: ["README.md"] });
  assert.equal(engine.state.initialized, false);
  assert.equal(engine.state.currentBranch, "main");
  assert.deepEqual(engine.state.branches, { main: null });
  assert.deepEqual(engine.state.workingDirectory, ["README.md"]);
  assert.deepEqual(engine.state.stagingArea, []);
  assert.deepEqual(engine.state.repository, []);
  assert.deepEqual(engine.state.commits, []);
  assert.equal(typeof engine.state.remote, "object");
  assert.equal(engine.state.lastAction, null);
});

test("foundation workflow moves files and creates a snapshot", () => {
  const engine = createGitEngine({ workingDirectory: ["README.md"] });
  engine.run("git init");
  engine.run("git status");
  engine.run("git add README.md");
  assert.deepEqual(engine.state.workingDirectory, []);
  assert.deepEqual(engine.state.stagingArea, ["README.md"]);
  engine.run('git commit -m "Initial commit"');
  assert.deepEqual(engine.state.stagingArea, []);
  assert.deepEqual(engine.state.repository, ["README.md"]);
  assert.equal(engine.state.commits[0].message, "Initial commit");
  assert.deepEqual(engine.state.commits[0].parents, []);
  assert.equal(engine.state.branches.main, engine.state.commits[0].hash);
  assert.equal(engine.state.lastAction.teachingKey, "commit");
});

test("branch, switch, and merge create a two-parent graph", () => {
  const engine = createGitEngine({ initialized: true, workingDirectory: ["base.txt"] });
  engine.run("git add .");
  engine.run('git commit -m "Base"');
  const base = engine.state.branches.main;
  engine.run("git branch feature/login");
  assert.equal(engine.state.branches["feature/login"], base);
  engine.run("git switch feature/login");
  engine.state.workingDirectory.push("login.js");
  engine.run("git add login.js");
  engine.run('git commit -m "Add login"');
  const featureTip = engine.state.branches["feature/login"];
  engine.run("git switch main");
  engine.run("git merge feature/login");
  const merge = engine.state.commits.at(-1);
  assert.deepEqual(merge.parents, [base, featureTip]);
  assert.equal(engine.state.branches.main, merge.hash);
});

test("cleanup commands distinguish disk, index, refs, and history", () => {
  const engine = createGitEngine({ initialized: true, workingDirectory: ["secret.env", "old.txt"] });
  engine.run("git add .");
  engine.run('git commit -m "Track files"');
  engine.run("git rm --cached secret.env");
  assert.ok(engine.state.workingDirectory.includes("secret.env"));
  assert.equal(engine.state.repository.includes("secret.env"), false);
  engine.run('git commit -m "Stop tracking secret"');
  assert.equal(engine.state.repository.includes("secret.env"), false);
  engine.run("git branch old-path");
  engine.run("git branch -d old-path");
  assert.equal("old-path" in engine.state.branches, false);
  engine.run("git tag v1.0");
  engine.run("git tag -d v1.0");
  assert.equal("v1.0" in engine.state.tags, false);
  engine.run("git remote add origin https://example.com/repo.git");
  engine.run("git remote remove origin");
  assert.equal("origin" in engine.state.remote.entries, false);
  const beforeRevert = engine.state.commits.length;
  engine.run("git revert HEAD");
  assert.equal(engine.state.commits.length, beforeRevert + 1);
  assert.match(engine.state.commits.at(-1).message, /^Revert/);
});

test("rebase creates a visible rewritten commit on the target base", () => {
  const engine = createGitEngine({
    initialized: true,
    currentBranch: "feature",
    branches: { main: "a", feature: "b" },
    commits: [
      { hash: "a", message: "Base", branch: "main", parents: [] },
      { hash: "b", message: "Feature", branch: "feature", parents: ["a"] },
    ],
  });
  const oldTip = engine.state.branches.feature;
  engine.run("git rebase main");
  assert.notEqual(engine.state.branches.feature, oldTip);
  assert.equal(engine.state.commits.at(-1).message, "Feature");
  assert.deepEqual(engine.state.commits.at(-1).parents, [engine.state.branches.main]);
});

test("destructive shell input is rejected without changing repository state", () => {
  const engine = createGitEngine({ initialized: true, workingDirectory: ["README.md"] });
  const before = JSON.stringify({
    initialized: engine.state.initialized,
    workingDirectory: engine.state.workingDirectory,
    stagingArea: engine.state.stagingArea,
    repository: engine.state.repository,
    commits: engine.state.commits,
    branches: engine.state.branches,
  });
  engine.run("rm -rf .git");
  assert.equal(engine.state.lastAction.success, false);
  assert.equal(engine.state.lastAction.teachingKey, "dangerous-remove-git");
  assert.equal(JSON.stringify({
    initialized: engine.state.initialized,
    workingDirectory: engine.state.workingDirectory,
    stagingArea: engine.state.stagingArea,
    repository: engine.state.repository,
    commits: engine.state.commits,
    branches: engine.state.branches,
  }), before);
});
