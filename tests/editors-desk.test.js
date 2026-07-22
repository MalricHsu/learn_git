import test from "node:test";
import assert from "node:assert/strict";
import { resolveEditorsDesk } from "../src/composables/useEditorsDesk.js";
import { gitTeaching } from "../src/data/gitTeaching.js";

const challenge = {
  editorial: {
    intro: { title: "開始觀察", whatHappened: "尚未輸入", whyItMatters: "先看狀態", misconception: "不要猜" },
    actions: { add: { title: "本關 Add", whatHappened: "特別說明", whyItMatters: "本關原因", misconception: "本關誤解" } },
  },
};

test("editor desk resolves intro, challenge override, library, and danger warning", () => {
  assert.equal(resolveEditorsDesk(challenge, null, gitTeaching).title, "開始觀察");
  assert.equal(resolveEditorsDesk(challenge, { teachingKey: "add", success: true }, gitTeaching).title, "本關 Add");
  assert.equal(resolveEditorsDesk(challenge, { teachingKey: "commit", success: true }, gitTeaching).title, "建立版本快照");
  assert.match(resolveEditorsDesk(challenge, { teachingKey: "dangerous-remove-git", success: false }, gitTeaching).title, /刪除整個 Git 歷史/);
});
