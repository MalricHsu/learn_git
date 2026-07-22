import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const home = await readFile(new URL("../src/views/Home.vue", import.meta.url), "utf8");

test("home is an interactive newspaper front page", () => {
  for (const name of ["front-page", "continue-panel", "today-lesson", "chapter-editions", "reference-invitation"]) {
    assert.ok(home.includes(name), name);
  }
  for (const copy of ["今日頭版", "繼續闖關", "Today's Lesson", "Chapter Editions"]) {
    assert.ok(home.includes(copy), copy);
  }
  assert.ok(home.includes("<h1>Git Daily</h1>"));
  assert.equal(home.includes("<h2>Git Daily</h2>"), false);
});

test("home removes dashboard widgets and the 32-card challenge wall", () => {
  for (const removed of ["xp-ring", "roadmap__stop", "lower-grid", "recent-list"]) {
    assert.equal(home.includes(removed), false, removed);
  }
  assert.ok(home.includes("chapters"));
});

test("home avoids repeated editorial recommendations", () => {
  for (const removed of ["newspaper-headlines", "edition-columns", "Editor's Pick", "Command of the Day", "今日標題", "編輯精選", "今日指令"]) {
    assert.equal(home.includes(removed), false, removed);
  }
});

test("front-page headline and actions stay visually distinct from the masthead", () => {
  assert.equal(home.includes("翻閱 Git 手冊"), false);
  assert.match(home, /\.lead-story h2\s*\{[^}]*font-family:\s*Georgia/s);
  assert.match(home, /\.lead-story h2\s*\{[^}]*font-size:\s*clamp\(40px,\s*4\.2vw,\s*56px\)/s);
  assert.doesNotMatch(home, /\.lead-story h2\s*\{[^}]*font-family:\s*var\(--display\)/s);
});

test("today lesson renders a visible terminal example", () => {
  assert.ok(home.includes("lesson-terminal__bar"));
  assert.ok(home.includes("Initialized empty Git repository"));
  assert.match(home, /background:\s*var\(--terminal-bg\)/);
  assert.doesNotMatch(home, /background:\s*var\(--terminal\)/);
});

test("continue panel reads as a squared newspaper clipping", () => {
  assert.match(home, /\.continue-panel\s*\{[^}]*border:\s*1px solid var\(--border\)/s);
  assert.match(home, /\.continue-panel\s*\{[^}]*border-top:\s*4px double var\(--ink\)/s);
  assert.match(home, /\.continue-panel\s*\{[^}]*background:\s*var\(--paper-2\)/s);
  assert.doesNotMatch(home, /\.continue-panel\{[^}]*border-radius/s);
  assert.match(home, /\.continue-panel__link\s*\{[^}]*justify-content:\s*flex-start/s);
  assert.match(home, /\.continue-panel__link\s*\{[^}]*gap:\s*12px/s);
});

test("front-page supporting copy remains comfortably readable", () => {
  assert.match(home, /\.lead-story__deck\s*\{[^}]*font-size:\s*18px/s);
  assert.match(home, /\.text-link\s*\{[^}]*font-size:\s*16px/s);
  assert.match(home, /\.continue-panel header\s*\{[^}]*font-size:\s*14px/s);
  assert.match(home, /\.continue-panel > small\s*\{[^}]*font-size:\s*14px/s);
  assert.match(home, /\.continue-panel blockquote\s*\{[^}]*font-size:\s*17px/s);
  assert.match(home, /\.continue-panel__progress\s*\{[^}]*font-size:\s*14px/s);
  assert.match(home, /\.edition-heading > p,[^}]*font-size:\s*14px/s);
  assert.match(home, /\.lesson-terminal__bar span\s*\{[^}]*font-size:\s*14px/s);
  assert.match(home, /\.lesson-terminal pre\s*\{[^}]*font-size:\s*16px/s);
  assert.match(home, /\.chapter-edition > span,[^}]*font-size:\s*14px/s);
  assert.match(home, /\.reference-invitation span\s*\{[^}]*font-size:\s*14px/s);
});
