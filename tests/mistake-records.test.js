import test from "node:test";
import assert from "node:assert/strict";
import { upsertMistake, removeMistake } from "../src/composables/mistakeRecords.js";

const attempt = {
  id: "choice-01",
  mode: "choice",
  cmd: "git status",
  scenario: "主管想知道目前有哪些檔案被修改。",
  given: "git log",
  solution: "git status",
  explanation: "status 用來查看工作目錄與暫存區狀態。",
  answeredAt: "2026-07-23T01:00:00.000Z",
};

test("upsertMistake creates a normalized first record", () => {
  assert.deepEqual(upsertMistake([], attempt), [{ ...attempt, count: 1 }]);
});

test("upsertMistake deduplicates by question ID and refreshes the latest attempt", () => {
  const first = upsertMistake([], attempt);
  const next = upsertMistake(first, {
    ...attempt,
    given: "git diff",
    answeredAt: "2026-07-23T02:00:00.000Z",
  });

  assert.equal(next.length, 1);
  assert.equal(next[0].count, 2);
  assert.equal(next[0].given, "git diff");
  assert.equal(next[0].answeredAt, "2026-07-23T02:00:00.000Z");
});

test("removeMistake removes only the matching question", () => {
  const records = [
    { ...attempt, count: 1 },
    { ...attempt, id: "input-02", count: 1 },
  ];
  assert.deepEqual(removeMistake(records, "choice-01").map((item) => item.id), ["input-02"]);
});
