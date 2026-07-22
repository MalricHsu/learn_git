# Interactive Front Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans and TDD.

**Goal:** 將首頁重構為精簡的互動報紙頭版。

**Architecture:** 只重寫 `Home.vue` 的資訊架構與 scoped CSS，沿用現有資料與路由介面。

**Tech Stack:** Vue 3、Vue Router、CSS、Node test。

### Task 1: Front-page structure

- [ ] 新增來源碼合約測試，要求 front page、continue panel、chapter editions，並排除 XP ring、Dashboard card 與 32 關卡牆。
- [ ] 執行測試確認紅燈。
- [ ] 重寫 Home template 與 computed data。
- [ ] 實作 editorial desktop/mobile CSS。
- [ ] 執行 component tests 與 build。

### Task 2: Verification

- [ ] 執行完整測試與 build。
- [ ] 檢查首頁桌面與手機資訊順序。
- [ ] 確認不影響 Challenge、Reference 與 Practice。
