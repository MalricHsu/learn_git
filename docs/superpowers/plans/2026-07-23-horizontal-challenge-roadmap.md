# Horizontal Challenge Roadmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task.

**Goal:** 將左側垂直 Roadmap 改為頁面上方的章節選擇器與橫向關卡滑軌，並把下方工作區改為 65/35 雙欄。

**Architecture:** `ChallengeRoadmap.vue` 繼續接收原有 props/events，自行管理正在瀏覽的 Chapter 與橫向 scroll。`Game.vue` 只移動元件位置並調整 grid，不變更引擎與進度函式。

**Tech Stack:** Vue 3、CSS scroll、Node `node:test`、Playwright。

### Task 1: Horizontal Roadmap

- [ ] 在 `tests/challenge-components.test.js` 要求 chapter selector、track、scrollBy 與 horizontal overflow。
- [ ] 執行測試確認紅燈。
- [ ] 重寫 `ChallengeRoadmap.vue`，保留 done/current/locked 狀態與 select event。
- [ ] 執行 component tests。

### Task 2: Two-column Workspace

- [ ] 在 `tests/game-page.test.js` 要求 Roadmap 位於 layout 前、grid 為主欄加右欄。
- [ ] 執行測試確認紅燈。
- [ ] 移動 Roadmap 並實作 65/35 雙欄與 mobile 單欄。
- [ ] 執行全部測試、build 與瀏覽器首屏驗證。
