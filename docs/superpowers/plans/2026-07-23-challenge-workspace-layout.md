# Challenge Workspace Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 Challenge 頁面改為首屏可同時操作 Terminal、閱讀 Editor's Desk 並查看單一相關視覺化的三欄工作台。

**Architecture:** 保留 GitEngine、GitState、32 關完成條件與進度邏輯，只調整資料顯示與 Vue 元件組合。右欄由固定 Editor's Desk 加上一個 VisualizationTabs 組成；tabs 監聽 `lastAction.teachingKey` 自動選擇 Workflow、Graph 或 Timeline。

**Tech Stack:** Vue 3、Vite 6、JavaScript、Node `node:test`、CSS/SVG。

## Global Constraints

- 不修改 GitEngine、Challenge steps、XP、成就或 localStorage 遷移。
- Terminal 輸入列與 Editor's Desk 必須在 1440×900 和 1600×900 首屏可見。
- Roadmap 不顯示故事摘要，只展開目前 Chapter。
- Learning Goal 顯示概念，不直接顯示 Git 指令；完整語法只在第三階提示出現。
- Workflow、Graph、Timeline 使用同一張分頁容器，不得垂直堆疊。
- 保持 Modern Editorial 風格與 reduced-motion 支援。

---

### Task 1: 新增 Learning Concept 資料

**Files:**
- Modify: `src/data/challenges.js`
- Modify: `tests/challenges.test.js`

**Interfaces:**
- ChallengeConfig 新增 `learningConcept: { en: string, zh: string }`。
- `learningGoal` 保留作為第三階提示與資料用途。

- [ ] **Step 1: 寫失敗測試**

在 `tests/challenges.test.js` 驗證 32 關皆有非空 `learningConcept.en/zh`，且一般關卡的概念文字不等於 `learningGoal`。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/challenges.test.js`

Expected: FAIL，現有資料沒有 learningConcept。

- [ ] **Step 3: 實作概念資料**

在 entries 加入概念欄位或建立 teachingKey 對應表，例如 status 為 `Inspect repository state／確認儲存庫目前狀態`、add 為 `Choose the next snapshot／選擇下一個版本快照`。Final Challenge 使用該章的整合概念，不顯示指令串。

- [ ] **Step 4: 執行測試**

Run: `npm test -- tests/challenges.test.js`

Expected: 32 關資料測試 PASS。

---

### Task 2: 精簡 Roadmap 與 Brief

**Files:**
- Modify: `src/components/challenge/ChallengeRoadmap.vue`
- Modify: `src/components/challenge/ChallengeBrief.vue`
- Modify: `tests/challenge-components.test.js`

**Interfaces:**
- Roadmap 使用 `currentId` 判斷目前 Chapter 的 `<details open>`。
- Brief 顯示 `challenge.learningConcept`，不直接顯示 `challenge.learningGoal`。

- [ ] **Step 1: 寫來源碼失敗測試**

驗證 Roadmap 不渲染 `challenge.summary.zh`，目前章節才綁定 open；Brief 引用 `learningConcept.en/zh`，且模板不直接輸出 `challenge.learningGoal`。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/challenge-components.test.js`

Expected: FAIL，Roadmap 仍顯示摘要，Brief 仍顯示答案。

- [ ] **Step 3: 精簡 Roadmap**

新增 `currentChapter` helper，`details :open="chapter.id === currentChapter"`。移除摘要 `em` 與其 CSS；目前狀態樣式放在 done 之後並覆寫綠色文字，保留小型勾選。

- [ ] **Step 4: 壓縮 Brief**

移除 `challenge.story.zh` 的重複段落；摘要保持英文一行、中文一行。Goal 改顯示 learningConcept。縮小 padding、標題、段落與提示間距；提示清單未展開時不佔高度。

- [ ] **Step 5: 執行測試與 build**

Run: `npm test -- tests/challenge-components.test.js && npm run build`

Expected: component contract PASS，Vue build 成功。

---

### Task 3: 建立 Visualization Tabs

**Files:**
- Create: `src/components/challenge/VisualizationTabs.vue`
- Modify: `src/components/challenge/GitVisualization.vue`
- Create: `src/composables/visualizationTab.js`
- Create: `tests/visualization-tab.test.js`
- Modify: `tests/challenge-components.test.js`

**Interfaces:**
- `tabForTeachingKey(key, fallback): "workflow" | "graph" | "timeline"`。
- VisualizationTabs props: `state`；內部 state `activeTab`。

- [ ] **Step 1: 寫 mapping 失敗測試**

驗證 add/commit/restore/rm → workflow；branch/switch/merge/tag/rebase → graph；log/blame/reflog/revert → timeline；remote/fetch/pull/push 保留 fallback。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/visualization-tab.test.js`

Expected: FAIL，mapping 模組不存在。

- [ ] **Step 3: 實作純 mapping**

使用三個 Set 分組 teachingKey，未知或 remote key 回傳 fallback。

- [ ] **Step 4: 實作 VisualizationTabs**

建立三個文字 tab button 與單一內容 viewport。watch `state.lastAction?.teachingKey`，成功 action 時用 mapping 更新 activeTab；玩家點擊可手動切換。viewport 高度限制 `320px` 並允許內部 overflow。

- [ ] **Step 5: 重組 GitVisualization**

保留標題，固定先顯示 EditorsDesk，再顯示 VisualizationTabs；移除三個視覺化元件的垂直直接渲染。

- [ ] **Step 6: 執行測試與 build**

Run: `npm test -- tests/visualization-tab.test.js tests/challenge-components.test.js && npm run build`

Expected: mapping、四區資料保留與 Vue build PASS。

---

### Task 4: 重做首屏三欄與響應式布局

**Files:**
- Modify: `src/views/Game.vue`
- Modify: `src/components/challenge/EditorsDesk.vue`
- Modify: `src/components/challenge/GitWorkflow.vue`
- Modify: `src/components/challenge/GitGraph.vue`
- Modify: `src/components/challenge/CommitTimeline.vue`
- Modify: `tests/game-page.test.js`

**Interfaces:**
- Game 仍向元件提供相同 challenge、engine.state、progress props。
- 不改任何 complete、unlock、XP 或 achievement function。

- [ ] **Step 1: 寫布局來源碼失敗測試**

驗證 Game grid 使用約 220px／minmax 560px／380px 結構、Terminal 距 Brief 不超過 20px、1080px 以下順序符合規格；EditorsDesk 使用內容 transition。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/game-page.test.js`

Expected: FAIL，現有欄寬和垂直間距過大。

- [ ] **Step 3: 壓縮頁首與中欄**

減少 header、layout top gap、Brief/Terminal 間距；Terminal 保持 300–360px 可視高度。Final steps 使用細型橫向路徑。

- [ ] **Step 4: 壓縮 Editor's Desk 與視覺化內容**

Desk padding 和段落間距降低，加入 240ms fade transition。Workflow 每區縮短；Graph/Timeline 在 tabs viewport 內捲動，不改資料呈現。

- [ ] **Step 5: 實作響應式順序**

1080px 以下使用單欄，透過 grid areas 排列 Brief/Terminal → Editor/Visualization → Roadmap；取消 sticky。720px 以下降低標題與 padding。

- [ ] **Step 6: 執行測試與 build**

Run: `npm test -- tests/game-page.test.js && npm run build`

Expected: layout contract PASS，build 成功。

---

### Task 5: 回歸與首屏驗證

**Files:**
- Modify: `tests/browser-verification.mjs`
- Verify: all modified files

- [ ] **Step 1: 執行完整測試與 build**

Run: `npm test && npm run build`

Expected: 所有既有 GitEngine、32 關、進度、練習與新版布局測試 PASS。

- [ ] **Step 2: 更新瀏覽器檢查**

在 1440×900 與 1600×900 檢查 Terminal input 和 Editor's Desk bounding box bottom 均小於 viewport height；檢查首屏只有一個 visualization panel 可見。

- [ ] **Step 3: 驗證 tab 自動切換**

輸入 add、branch、log 類 action，分別確認 workflow、graph、timeline tab active；再手動切換 tab 確認可讀。

- [ ] **Step 4: 執行瀏覽器腳本與截圖**

Run: `node tests/browser-verification.mjs`

Expected: 首屏、tab mapping、Terminal、Editor's Desk 與 console error 驗證 PASS，輸出新版截圖。

- [ ] **Step 5: 最終驗證**

Run: `npm test && npm run build && git status --short`

Expected: 測試全綠、build 成功，只列出本次預期修改。
