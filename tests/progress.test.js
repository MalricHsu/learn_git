import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PROGRESS,
  isMissionPreviouslyCompleted,
  migrateChallengeProgress,
  shouldUnlockAchievement,
  shouldAwardMissionXp,
} from "../src/composables/progressRules.js";

test("mission completion rules separate permanent progress from replay", () => {
  assert.equal(isMissionPreviouslyCompleted(["m1"], "m1"), true);
  assert.equal(isMissionPreviouslyCompleted(["m1"], "m2"), false);
  assert.equal(shouldAwardMissionXp(["m1"], "m1"), false);
  assert.equal(shouldAwardMissionXp(["m1"], "m2"), true);
});

test("a cleared browser starts with blank progress", () => {
  assert.deepEqual(DEFAULT_PROGRESS, {
    xp: 0,
    completedMissions: [],
    favorites: [],
    recent: [],
    unlockedAchievements: [],
  });
});

test("legacy progress maps to new challenge ids and removes unknown values", () => {
  assert.deepEqual(migrateChallengeProgress(["m1", "m2", "m2", "unknown"]), ["c01", "c02"]);
  assert.deepEqual(migrateChallengeProgress(["c01", "c32", "c32"]), ["c01", "c32"]);
});

test("achievement unlocks only after every chapter challenge is complete", () => {
  assert.equal(shouldUnlockAchievement(["c01", "c02"], ["c01", "c02", "c03"]), false);
  assert.equal(shouldUnlockAchievement(["c01", "c02", "c03"], ["c01", "c02", "c03"]), true);
});
