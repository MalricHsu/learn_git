# Editorial Challenge Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將中欄 Challenge 題目由大型圓角卡片改為與 Challenge Roadmap 一致的編輯式欄目。

**Architecture:** 保留 `ChallengeBrief` 的 props、提示事件與所有關卡資料，只重組模板層級和 scoped CSS。新增欄目 header，將 metadata 與內容排在紙張背景上，Terminal 和其他元件介面不變。

**Tech Stack:** Vue 3、Vite 6、JavaScript、Node `node:test`、CSS。

## Global Constraints

- 不修改 GitEngine、GitState、完成條件、XP、成就或 localStorage。
- 保留三階提示與 `learningConcept`，不得提前顯示 Git 語法。
- 1440×900 與 1600×900 的 Terminal 輸入列仍須在首屏。
- 保持 Modern Editorial 紙張風格與 reduced-motion 支援。

---

### Task 1: 欄目式 Challenge Brief

**Files:**
- Modify: `tests/challenge-components.test.js`
- Modify: `src/components/challenge/ChallengeBrief.vue`

**Interfaces:**
- Consumes: `challenge`、`hintLevel` props。
- Produces: 原有 `reveal-hint`、`collapse-hints` events；新增 `.brief__header` 欄目結構。

- [ ] **Step 1: Write the failing test**

在 component source contract 中要求 `Current Challenge`、`今日闖關`、`brief__header` 存在，並要求 `.brief` 不再使用 `card` class。

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/challenge-components.test.js`

Expected: FAIL，現有 Brief 沒有欄目 header 且仍使用 `card`。

- [ ] **Step 3: Write minimal implementation**

將模板改為：

```vue
<section class="brief">
  <header class="brief__header">
    <span>Current Challenge</span>
    <strong>今日闖關</strong>
  </header>
  <div class="brief__meta">...</div>
  <!-- 原有 title、summary、learningConcept、hints -->
</section>
```

CSS 移除整張卡片的 border、radius、shadow、paper background；欄目 header 使用 `2px solid var(--ink)` 下線。Learning Goal 保留紙色重點帶與綠色細線。

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/challenge-components.test.js tests/game-page.test.js && npm run build`

Expected: component contract、page contract 與 Vite build PASS。

---

### Task 2: Browser Regression

**Files:**
- Verify: `tests/browser-verification.mjs`

**Interfaces:**
- Consumes: `/game` rendered layout。
- Produces: 1440×900、1600×900 首屏驗證與截圖。

- [ ] **Step 1: Run browser verification**

Run: `node tests/browser-verification.mjs`

Expected: Terminal input、Editor's Desk 與單一 visualization 均通過首屏檢查。

- [ ] **Step 2: Run complete verification**

Run: `npm test && npm run build && git diff --check && git status --short`

Expected: 所有測試與 build 通過，diff 無 whitespace error，只列出本次預期變更。
