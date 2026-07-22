# Git Daily Challenge Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 `/game` 重建為 32 關、全 Terminal 操作且由 GitState 即時驅動 Workflow、Graph、Timeline 與 Editor's Desk 的故事型 Git 學習遊戲。

**Architecture:** 保留 `Terminal.vue` 與瀏覽器內 `useGitEngine.js`，將引擎狀態升級成可視覺化的單一 GitState，並以 `lastAction` 串接關卡完成條件與教學內容。`Game.vue` 僅協調進度和三欄布局，Roadmap、Brief 與四種視覺化拆成專責元件；所有關卡、提示和 Editor's Desk 文案來自資料層。

**Tech Stack:** Vue 3、Vite 6、JavaScript ES modules、Node `node:test`、CSS/SVG、localStorage。

## Global Constraints

- 路由保留 `/game`，對外名稱只使用 `Challenge／闖關`。
- 頁面與 Challenge Config 不得使用 `Mission`、`Exercise`、`Question`。
- 共 32 個 Terminal Challenge：26 個一般關卡、6 個 Final Challenge。
- 不呼叫 shell、本機 Git、Git CLI 或 GitHub API。
- `rm -rf .git` 不得執行或改變 GitState，只能顯示 Editor's Desk 警告。
- 右側固定只有 Git Workflow、Git Graph、Commit Timeline、Editor's Desk。
- 動畫介於 200–350ms，並尊重 `prefers-reduced-motion`。
- 已完成關卡可重玩，但不得重複取得 XP 或成就。
- 專案目前沒有 `.git`，無法建立 worktree 或 commit；每項任務以指定測試與建置作為檢查點。

---

### Task 1: 建立新 GitState 合約與失敗測試

**Files:**
- Create: `tests/git-engine-state.test.js`
- Modify: `src/composables/useGitEngine.js`
- Modify: `src/components/Terminal.vue`

**Interfaces:**
- Produces: `createGitEngine(options)`，其中 `engine.state` 固定提供 `initialized`、`currentBranch`、`branches`、`workingDirectory`、`stagingArea`、`repository`、`commits`、`remote`、`lastAction`、`lines`。
- Produces: `engine.run(rawCommand): void`。

- [ ] **Step 1: 寫 GitState shape 失敗測試**

建立 `tests/git-engine-state.test.js`，用 `createGitEngine({ workingDirectory: ["README.md"] })` 驗證預設 `currentBranch === "main"`、`branches.main === null`、三個檔案區域是陣列、`commits` 是陣列、`remote` 是物件、`lastAction === null`。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/git-engine-state.test.js`

Expected: FAIL，舊引擎仍使用 `branch`、`working`、`staged`、`committed`。

- [ ] **Step 3: 實作新狀態 shape 與 seed 正規化**

在 `useGitEngine.js` 建立新欄位。`branches` 使用 `{ main: null }` 形式；舊 seed 的 `branch/working/staged/committed/remoteAdded` 轉成新 shape，讓尚未遷移的呼叫端不會立即失效。`repository` 初始值為 option 指定值或空陣列。

- [ ] **Step 4: 更新 Terminal branch binding**

把 `Terminal.vue` 的 prompt 從 `engine.state.branch` 改讀 `engine.state.currentBranch`；Terminal 仍只呼叫 `engine.run()`，不得加入 shell fallback。

- [ ] **Step 5: 執行測試與建置**

Run: `npm test -- tests/git-engine-state.test.js && npm run build`

Expected: GitState shape PASS，Vue build 成功。

---

### Task 2: 以 action metadata 完成 Git 指令狀態轉換

**Files:**
- Modify: `tests/git-engine-state.test.js`
- Modify: `src/composables/useGitEngine.js`

**Interfaces:**
- Consumes: Task 1 GitState。
- Produces: `lastAction = { raw, command, success, effect, files, branch, teachingKey, error? }`。
- Produces commit: `{ hash, message, branch, parents, files, timestamp }`。

- [ ] **Step 1: 寫 workflow 紅燈測試**

測試 `init → status → add README.md → commit -m "Initial commit"`：README 從 `workingDirectory` 移入 `stagingArea`，再進入 `repository`；commit 具有 message、空 parents、固定格式 timestamp；`branches.main` 指向新 hash；lastAction teachingKey 依序為 `init/status/add/commit`。

- [ ] **Step 2: 執行 workflow 測試確認紅燈**

Run: `npm test -- tests/git-engine-state.test.js --test-name-pattern="workflow"`

Expected: FAIL，舊欄位與 action metadata 不符合。

- [ ] **Step 3: 實作 init、status、add、commit、diff、blame、restore**

每個 case 使用共同 `finishAction(metadata)` 更新 `lastAction` 並呼叫 `options.onRun(raw, state.lastAction)`。無效操作設定 `success: false` 且不改動 GitState 的版本資料。

- [ ] **Step 4: 寫 branch graph 紅燈測試**

建立含 initial commit 的 engine，執行 `git branch feature/login`、`git switch feature/login`、add/commit、`git switch main`、`git merge feature/login`。驗證新分支起點、HEAD 切換、feature tip，以及 merge commit 的 `parents` 有 main 與 feature 兩個 hash。

- [ ] **Step 5: 實作 branch、switch 與真實雙親 merge**

`branch` 建立指向目前 commit 的 key；`switch` 只改 `currentBranch`；commit 前進目前 branch；merge 建立雙 parent commit 並前進目前 branch。

- [ ] **Step 6: 寫 remote 與 advanced 紅燈測試**

依序驗證 `remote add/remove`、fetch、pull、push、stash push/pop、tag 建立/刪除、rebase、reflog、rm、rm --cached、branch -d 與 revert 對 state 和 lastAction 的影響。

- [ ] **Step 7: 實作 remote、advanced 與 cleanup 指令**

remote 保存 `{ entries, trackingBranches, fetched, pushed }`；tag 保存於 state.tags；reflog 保存 HEAD 移動項目；revert 產生一筆新 commit 而非刪除歷史；`rm --cached` 只從 repository 移除並保留 workingDirectory；`rm` 同時從追蹤快照與工作目錄移除。

- [ ] **Step 8: 寫破壞性 shell 紅燈測試並實作拒絕**

執行 `rm -rf .git` 前後深比較 GitState 版本資料完全相同，驗證 `lastAction.success === false`、`teachingKey === "dangerous-remove-git"`。非 `git` 開頭一律只產生 terminal error/action，不執行任何系統操作。

- [ ] **Step 9: 執行完整 engine 測試**

Run: `npm test -- tests/git-engine-state.test.js`

Expected: 所有 GitState、graph、cleanup 與安全測試 PASS。

---

### Task 3: 建立 32 關 Challenge Config

**Files:**
- Create: `src/data/challenges.js`
- Create: `src/data/gitTeaching.js`
- Create: `tests/challenges.test.js`
- Modify: `src/data/missions.js`

**Interfaces:**
- Produces: `chapters: Array<{ id, number, title: { en, zh }, achievement }>`。
- Produces: `challenges: Array<ChallengeConfig>`。
- ChallengeConfig 固定包含 `id/no/chapter/final/title/difficulty/level/xp/learningGoal/summary/story/hints/seed/steps/editorial`。
- 每個 `steps` item 包含 `label` 與 `check(action, state): boolean`。

- [ ] **Step 1: 寫數量、命名與 schema 紅燈測試**

驗證 chapters 為 6、challenges 為 32、final 為 6、一般為 26、ID 唯一、每關 `hints.length === 3`、每關 steps 至少一個、所有 challenge 都標示 terminal。掃描序列化資料，禁止出現三個禁用頁面用詞。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/challenges.test.js`

Expected: FAIL，`challenges.js` 尚不存在。

- [ ] **Step 3: 建立六章與 32 關基本資料**

依設計規格逐字使用 32 個中英文名稱。一般關卡各自使用對應 Git 指令；六個 Final Challenge 分別串聯 Foundations、History、Branching、Remote、Advanced、Safe Cleanup 的多個 steps。Challenge 編號按 1–32 顯示，Final Challenge 仍有 no 但 badge 顯示 Final Challenge。

- [ ] **Step 4: 建立三階提示與 seed**

每關 hints 依序為概念、主指令、完整語法。需要歷史/分支/遠端的關卡提供可直接操作的 seed；第一關與 Foundations Final 以 `initialized: false` 開始。

- [ ] **Step 5: 建立 Editor's Desk 資料**

`gitTeaching.js` 以 teachingKey 匯出通用繁中說明，每項包含 `title/whatHappened/whyItMatters/misconception`。Challenge 的 `editorial.intro` 提供本關初始教學，`editorial.actions` 只覆寫需要情境化的 key。

- [ ] **Step 6: 保留 missions.js 相容出口**

將舊檔改成由 `challenges.js` re-export `challenges as missions`、`chapters` 與 `totalXp`，讓 Home 等尚未遷移檔案可正常 build；後續 Task 9 再改直接 import。

- [ ] **Step 7: 執行資料測試**

Run: `npm test -- tests/challenges.test.js && npm run build`

Expected: 32/26/6、schema、提示、名稱與 build 全部 PASS。

---

### Task 4: 進度、成就與舊資料遷移

**Files:**
- Modify: `src/composables/progressRules.js`
- Modify: `src/composables/useStore.js`
- Modify: `tests/progress.test.js`

**Interfaces:**
- Produces: `migrateChallengeProgress(ids): string[]`。
- Produces store field: `unlockedAchievements: string[]` persisted as `gd-achievements`。
- Produces: `unlockAchievement(id): boolean`，首次解鎖回傳 true。

- [ ] **Step 1: 寫進度遷移與成就紅燈測試**

驗證舊 `m1...m19` 只映射到對應的一般 Challenge ID；未知 ID 被忽略；新 ID 保留且去重。DEFAULT_PROGRESS 新增空 achievements。完成同一 Final Challenge 兩次只能首次解鎖成就。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/progress.test.js`

Expected: FAIL，尚無遷移與成就 API。

- [ ] **Step 3: 實作純遷移與 store persistence**

`useStore.js` 載入 `gd-missions` 後立即呼叫 migrate；增加 achievements watch。保留 storage key `gd-missions` 以避免無必要的雙重 migration。

- [ ] **Step 4: 執行測試**

Run: `npm test -- tests/progress.test.js`

Expected: migration、去重、空白預設與成就 PASS。

---

### Task 5: 建立 Roadmap 與 Challenge Brief

**Files:**
- Create: `src/components/challenge/ChallengeRoadmap.vue`
- Create: `src/components/challenge/ChallengeBrief.vue`
- Create: `src/components/challenge/ChallengeAchievement.vue`
- Create: `tests/challenge-components.test.js`

**Interfaces:**
- Roadmap props: `chapters/challenges/currentId/completedIds/isLocked`；emit `select(id)`。
- Brief props: `challenge/hintLevel`；emit `reveal-hint`、`collapse-hints`。
- Achievement props: `achievement`；emit `continue`。

- [ ] **Step 1: 寫來源碼合約紅燈測試**

檢查三元件存在、Roadmap 有 done/current/locked class、Brief 顯示 Challenge/Final Challenge、Difficulty/Level/Reward/Learning Goal、三階提示與繁中故事，且元件模板不包含禁用詞。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/challenge-components.test.js`

Expected: FAIL，元件尚不存在。

- [ ] **Step 3: 實作 Roadmap**

用 button 列表與章節文字完成，狀態只以顏色、勾選與鎖定文字呈現；Final Challenge 使用 `★ Final Challenge` 或最後一章 `🏆 Final Challenge`。手機版提供可展開的 Chapter 選單。

- [ ] **Step 4: 實作 Brief 與三階提示**

hintLevel 0–3；每按一次只顯示下一則 hints，level 3 時按鈕變「收起提示」。Learning Goal 可以顯示 Git 語法，完整故事不直接公布答案。

- [ ] **Step 5: 實作 Achievement**

顯示 Achievement Unlocked、成就中英文名與章節完成句；不呈現分數或考試語言。

- [ ] **Step 6: 執行測試與 build**

Run: `npm test -- tests/challenge-components.test.js && npm run build`

Expected: contract PASS，Vue build 成功。

---

### Task 6: 建立 Git Workflow 視覺化

**Files:**
- Create: `src/components/challenge/GitWorkflow.vue`
- Modify: `tests/challenge-components.test.js`

**Interfaces:**
- Props: `state`、`lastAction`。
- Renders: `workingDirectory`、`stagingArea`、`repository` 中的實際檔名。

- [ ] **Step 1: 寫 Workflow 紅燈測試**

驗證元件只讀三個 GitState file collections、使用檔名為 key 的 TransitionGroup、包含 Working Directory/Staging Area/Repository 中英文標籤、不渲染 `.length` 數字。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/challenge-components.test.js --test-name-pattern="Workflow"`

Expected: FAIL，元件不存在。

- [ ] **Step 3: 實作三區紙張流程**

每個檔案是小型文字紙條；區域間以 `git add` 與 `git commit` 文字箭頭連接。TransitionGroup 使用 transform/opacity 260ms；reduced-motion 下 duration 為 0。

- [ ] **Step 4: 執行元件測試與 build**

Run: `npm test -- tests/challenge-components.test.js && npm run build`

Expected: PASS，無 Vue warning。

---

### Task 7: 建立 Git Graph 與 Commit Timeline

**Files:**
- Create: `src/components/challenge/GitGraph.vue`
- Create: `src/components/challenge/CommitTimeline.vue`
- Create: `src/composables/gitGraphLayout.js`
- Create: `tests/git-graph-layout.test.js`
- Modify: `tests/challenge-components.test.js`

**Interfaces:**
- `layoutGitGraph(commits, branches, currentBranch)` returns `{ nodes, edges, labels }`。
- Graph props: `commits/branches/currentBranch`。
- Timeline props: `commits/currentHead`。

- [ ] **Step 1: 寫純 graph layout 紅燈測試**

線性三 commit 產生同 lane 三 node；feature branch 產生另一 lane；雙 parent merge 產生兩條入邊；current branch label 與 HEAD 指向同一 node。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/git-graph-layout.test.js`

Expected: FAIL，layout 模組不存在。

- [ ] **Step 3: 實作穩定 graph layout**

依 commits 陣列順序配置 y，每個 branch 首次出現時分配 lane x；edge 由 parents 指向 child；labels 從 branches map 反查 tip。不得依畫面尺寸修改 GitState。

- [ ] **Step 4: 實作 GitGraph**

SVG 畫 edges，HTML/SVG group 畫 commit nodes、branch labels 與 HEAD；空 commits 顯示「建立第一個 Commit 後，分支圖會從這裡開始。」切換使用 280ms transform transition。

- [ ] **Step 5: 實作 CommitTimeline**

倒序顯示 timestamp、message、七碼 hash、branch；目前 `branches[currentBranch]` 相符者標示 HEAD；TransitionGroup 260ms 插入新 commit。

- [ ] **Step 6: 執行 graph、元件測試與 build**

Run: `npm test -- tests/git-graph-layout.test.js tests/challenge-components.test.js && npm run build`

Expected: graph topology 與 component contract PASS。

---

### Task 8: 建立動態 Editor's Desk 與 Visualization 容器

**Files:**
- Create: `src/components/challenge/EditorsDesk.vue`
- Create: `src/components/challenge/GitVisualization.vue`
- Create: `src/composables/useEditorsDesk.js`
- Create: `tests/editors-desk.test.js`

**Interfaces:**
- `resolveEditorsDesk(challenge, lastAction, teachingLibrary)` returns `{ title, whatHappened, whyItMatters, misconception, tone }`。
- Visualization props: `state/challenge`。

- [ ] **Step 1: 寫內容解析紅燈測試**

無 action 時回傳 challenge editorial intro；有 challenge override 時優先；否則用 gitTeaching 通用 key；失敗 action 使用 error key；`dangerous-remove-git` 一定回傳 `.git` 資料遺失警告。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/editors-desk.test.js`

Expected: FAIL，resolver 尚不存在。

- [ ] **Step 3: 實作 resolver 與 EditorsDesk**

元件顯示編輯室標題、發生了什麼、為什麼重要、常見誤解四段；以紙張底色和綠色左書脊提高權重，不使用 dashboard icon。

- [ ] **Step 4: 實作 GitVisualization 容器**

固定依序組合 Workflow、Graph、Timeline、Editor's Desk。不得包含 Repository Status、Staged/Untracked/Pushed 數字卡或底部 Editor's Note。

- [ ] **Step 5: 執行測試與 build**

Run: `npm test -- tests/editors-desk.test.js tests/challenge-components.test.js && npm run build`

Expected: fallback、override、danger warning 與四區結構 PASS。

---

### Task 9: 整合 Game.vue 與全 Terminal 闖關流程

**Files:**
- Rewrite: `src/views/Game.vue`
- Modify: `src/router.js`
- Modify: `src/views/Home.vue`
- Create: `tests/game-page.test.js`

**Interfaces:**
- Consumes: Tasks 1–8 所有介面。
- Produces: `/game` 完整 Challenge 頁面與 sequential unlock/replay/achievement 流程。

- [ ] **Step 1: 寫頁面來源碼紅燈測試**

驗證 Game import challenges 與新元件、只建立 Terminal play area、不包含 choice/options、右側只有 GitVisualization、頁面文案包含 Challenge Roadmap/Today's Challenge/Git Visualization。掃描 Game、router、Home 與 challenges，禁用詞不得以 UI 文案出現。

- [ ] **Step 2: 執行測試確認紅燈**

Run: `npm test -- tests/game-page.test.js`

Expected: FAIL，Game 仍是舊三欄與 status cards。

- [ ] **Step 3: 重寫 Game orchestration**

以 current challenge seed 建立 engine；每次 `onRun(raw, action)` 依目前未完成 step 呼叫 check；完成全部 steps 時只在首次加 XP，Final Challenge 首次解鎖 achievement。切換或重點目前關卡重建 engine、stepState 與 hintLevel。

- [ ] **Step 4: 建立三欄 editorial layout**

左欄 Roadmap 260px，中欄 minmax(520px, 1fr)，右欄 minmax(340px, 420px)；Terminal 放在 Brief 下方。移除所有 Repository Status、Branch Tree、Commit History 與舊 Editor's Note。

- [ ] **Step 5: 更新路由與首頁文案**

路由仍為 `/game`，meta title 改 `Challenge · 闖關`。Home 的進度與入口使用 challenges，UI 不再顯示舊稱；既有 `/practice` 不變。

- [ ] **Step 6: 實作 responsive 與 reduced motion**

1080px 以下單欄依 Roadmap、Brief/Terminal、Visualization 排列；720px 以下 Roadmap 使用 Chapter disclosure。動畫 CSS 使用 260–280ms，`prefers-reduced-motion` 關閉 transition/transform。

- [ ] **Step 7: 執行頁面測試與 build**

Run: `npm test -- tests/game-page.test.js && npm run build`

Expected: UI contract PASS，Vue build 無錯誤或 warning。

---

### Task 10: 全面回歸與瀏覽器流程驗證

**Files:**
- Modify: `tests/browser-verification.mjs`
- Verify: all changed files

**Interfaces:**
- Consumes: 完成後應用。
- Produces: 自動測試、production build 與實際瀏覽器證據。

- [ ] **Step 1: 執行完整單元測試**

Run: `npm test`

Expected: 原有手冊、練習、進度測試與新增 engine/challenge/component/page 測試全數 PASS。

- [ ] **Step 2: 執行 production build**

Run: `npm run build`

Expected: Vite build 成功，無 Vue template error。

- [ ] **Step 3: 更新瀏覽器驗證腳本**

腳本清空 localStorage 後開 `/game`，驗證 0/32、六章、Challenge 01；完成 init 後 Workflow/Editor's Desk 更新；完成 Foundations Final 的四步驟後顯示 Git Explorer；重玩 XP 不變。

- [ ] **Step 4: 驗證 branch 視覺化**

瀏覽器跳至已解鎖的 Branching seed，輸入 branch、switch、add/commit、merge；驗證 Graph branch label、HEAD、雙 parent merge node 與 Timeline 新項目。

- [ ] **Step 5: 驗證 safe cleanup 與安全警告**

在對應關卡驗證 rm --cached 檔案仍在 Working Directory、branch/tag/remote 移除反映於 GitState；輸入 `rm -rf .git` 後狀態不變且 Editor's Desk 顯示警告。

- [ ] **Step 6: 執行瀏覽器腳本**

Run: `node tests/browser-verification.mjs`

Expected: reference、practice 與全部 Challenge 核心流程 PASS，browser console 無 error。

- [ ] **Step 7: 最終重新驗證**

Run: `npm test && npm run build`

Expected: 全綠並成功 build；記錄無 `.git` 因此未建立 commit。
