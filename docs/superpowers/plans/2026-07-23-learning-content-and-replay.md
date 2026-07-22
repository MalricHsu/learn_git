# Git Daily 中文化、重玩與練習題庫 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將手冊說明內容改為中文優先、讓完成關卡可無提示重玩、清空儲存後從零開始，並把選擇與手寫題庫各擴充至 60 題且提供中文提示與答錯解釋。

**Architecture:** 題目資料與提示留在資料層，頁面只管理互動狀態；闖關將永久進度與單次作答狀態分離；持久化預設值改為真正的空白狀態。使用 Node 內建測試器驗證純資料與狀態規則，最後以 Vite build 與瀏覽器流程驗證 Vue 畫面。

**Tech Stack:** Vue 3、Vite 6、JavaScript ES modules、Node `node:test`、localStorage。

## Global Constraints

- 選擇題題庫必須剛好 60 題，手寫題題庫必須剛好 60 題。
- 每題必須有不直接透露完整答案的繁體中文提示。
- 答錯後必須顯示使用者答案、正確答案及繁體中文解釋。
- 已完成關卡可重玩，但不得重複取得 XP。
- 清空 localStorage 後必須是 0 XP、0 個完成關卡。
- Git 指令、參數、終端輸出與程式碼保留英文；說明型標題及重複說明改為繁體中文。
- 專案目前沒有 `.git`，因此本次無法執行任何 commit 步驟；每項任務以測試通過作為檢查點。

---

### Task 1: 建立資料與進度規則測試基線

**Files:**
- Modify: `package.json`
- Create: `tests/drills.test.js`
- Create: `tests/progress.test.js`
- Create: `src/composables/progressRules.js`

**Interfaces:**
- Consumes: `poolFor(game)`、`drills`。
- Produces: `isMissionPreviouslyCompleted(completedIds, missionId): boolean`、`shouldAwardMissionXp(completedIds, missionId): boolean`。

- [ ] **Step 1: 新增測試指令與題庫失敗測試**

在 `package.json` 加入 `"test": "node --test"`。建立 `tests/drills.test.js`，斷言 `poolFor("choice").length === 60`、`poolFor("input").length === 60`、所有 ID 唯一、所有題目皆有非空 `hint.zh`、所有 input 題皆有至少一個 `accept` 規則。

- [ ] **Step 2: 執行題庫測試並確認紅燈**

Run: `npm test -- tests/drills.test.js`

Expected: FAIL，顯示目前題數為 35/40，且題目缺少 `hint.zh`。

- [ ] **Step 3: 新增進度規則失敗測試**

建立 `tests/progress.test.js`，驗證已完成 ID 回傳 `true`、未完成 ID 回傳 `false`，以及只有第一次完成可以取得 XP。

```js
assert.equal(isMissionPreviouslyCompleted(["m1"], "m1"), true);
assert.equal(isMissionPreviouslyCompleted(["m1"], "m2"), false);
assert.equal(shouldAwardMissionXp(["m1"], "m1"), false);
assert.equal(shouldAwardMissionXp(["m1"], "m2"), true);
```

- [ ] **Step 4: 執行進度測試並確認紅燈**

Run: `npm test -- tests/progress.test.js`

Expected: FAIL，模組尚不存在。

- [ ] **Step 5: 實作最小進度規則**

在 `src/composables/progressRules.js` 匯出兩個純函式，皆以 `completedIds.includes(missionId)` 為唯一判斷來源。

- [ ] **Step 6: 確認進度測試轉綠**

Run: `npm test -- tests/progress.test.js`

Expected: 4 assertions PASS。

---

### Task 2: 修正空白進度與已完成關卡重玩

**Files:**
- Modify: `src/composables/useStore.js`
- Modify: `src/views/Game.vue`
- Test: `tests/progress.test.js`

**Interfaces:**
- Consumes: `shouldAwardMissionXp(completedIds, missionId)`。
- Produces: 永久進度只控制解鎖與 XP；`completedNow`、`selected`、`stepState` 與新 engine 控制本次重玩。

- [ ] **Step 1: 增加預設值測試**

把 store 的初始預設抽成匯出的 `DEFAULT_PROGRESS`，測試其 `xp` 為 `0`、`completedMissions`、`favorites`、`recent` 皆為空陣列。

- [ ] **Step 2: 執行測試並確認紅燈**

Run: `npm test -- tests/progress.test.js`

Expected: FAIL，因目前預設是 240 XP 與兩個已完成關卡。

- [ ] **Step 3: 實作乾淨預設值**

將 `useStore.js` 的 fallback 改為 `0` 與空陣列；每個陣列 fallback 使用展開複製，避免共用可變陣列。

- [ ] **Step 4: 分離永久與本次狀態**

在 `Game.vue` 移除 `handleRun`、`chooseOption` 對 `isDone` 的提前返回；選項按鈕不再因 `isDone` 被 disabled，也不再因永久完成紀錄自動套用 correct class；完成卡只依 `completedNow` 顯示。`succeed()` 透過 `shouldAwardMissionXp` 決定是否加 XP 與寫入完成紀錄。

- [ ] **Step 5: 驗證重玩狀態重設**

確認 `watch(idx, setupMission)` 每次換關都重設 hint、選項、完成卡、workflow 與 engine。必要時讓點擊目前關卡也呼叫 `setupMission()`，確保同關重新開始可重設。

- [ ] **Step 6: 執行測試與建置**

Run: `npm test -- tests/progress.test.js && npm run build`

Expected: PASS，Vite build 成功。

---

### Task 3: 完成手冊中文化清理

**Files:**
- Modify: `src/views/Reference.vue`
- Create: `tests/reference-copy.test.js`

**Interfaces:**
- Consumes: `commands.js` 既有 `.zh` 資料。
- Produces: 中文說明標題、中文內文與保留原樣的 Git 技術內容。

- [ ] **Step 1: 新增模板文字失敗測試**

讀取 `Reference.vue` 原始碼並斷言文章區不再包含 `What is it`、`Why do we use it`、`Workflow<span`、`Syntax &amp; Example`、`Common Mistakes`、`Related Commands`，且不再渲染 `current.what.en`、`current.why.en`、`m.en`。

- [ ] **Step 2: 執行測試並確認紅燈**

Run: `npm test -- tests/reference-copy.test.js`

Expected: FAIL，列出尚存的雙語標題與英文段落。

- [ ] **Step 3: 中文化所有說明型標題與重複段落**

將文章標題改為「什麼是這個指令」、「為什麼需要它」、「工作流程」、「語法與範例」、「常見錯誤」、「相關指令」、「Git 專有名詞」；移除 `what.en`、`why.en` 與錯誤說明 `m.en` 的重複呈現。文章主標題 `git ...`、syntax、example、output 與 Git 詞彙英文名稱保留。

- [ ] **Step 4: 執行測試與建置**

Run: `npm test -- tests/reference-copy.test.js && npm run build`

Expected: PASS，手冊模板正常編譯。

---

### Task 4: 題庫擴充至 60/60 並補齊提示

**Files:**
- Modify: `src/data/drills.js`
- Test: `tests/drills.test.js`

**Interfaces:**
- Consumes: 現有 drill shape。
- Produces: 每題 `{ hint: { zh: string } }`，choice pool 60、input pool 60。

- [ ] **Step 1: 為現有題目補齊中文提示**

每個 drill 增加 `hint.zh`；提示描述概念或指令骨架，例如 `git log --oneline` 題只提示「找找能把每筆提交壓成單行的 log 選項」，不得直接寫出完整答案。

- [ ] **Step 2: 新增 20 題雙模式題目**

新增涵蓋 pathspec、commit amend、log 篩選、branch rename、switch restore、tag、remote、fetch prune、push upstream、stash、restore、reset、revert、diff、show、blame、reflog、cherry-pick、rebase 與 clean 的題目。每題包含唯一 ID、繁中情境、solution、accept regex、3 個 distractors、繁中 hint 與繁中 note。

- [ ] **Step 3: 新增 5 題選擇模式概念題**

新增 staged snapshot、HEAD、origin、merge commit、`.gitignore` 五個概念題；每題提供四個選項、繁中提示及答錯後可理解原因的 note。

- [ ] **Step 4: 執行題庫測試並修正精確數量**

Run: `npm test -- tests/drills.test.js`

Expected: PASS，輸出 choice 60、input 60，沒有重複 ID 或缺少提示/判定規則。

- [ ] **Step 5: 執行完整測試與建置**

Run: `npm test && npm run build`

Expected: 所有測試 PASS，Vite build 成功。

---

### Task 5: 練習提示與答錯解釋介面

**Files:**
- Modify: `src/views/Practice.vue`
- Modify: `src/style.css` 或 `Practice.vue` scoped style
- Create: `tests/practice-copy.test.js`

**Interfaces:**
- Consumes: `current.hint.zh`、`current.note.zh`、`current.solution`。
- Produces: 作答前 hint toggle；答錯後 given/correct/explanation feedback。

- [ ] **Step 1: 新增介面來源碼失敗測試**

讀取 `Practice.vue` 並斷言模板引用 `current.hint.zh`、錯誤狀態引用使用者作答、`current.solution` 與 `current.note.zh`，且 `resetQuestion()` 會把 `showHint` 重設為 false。

- [ ] **Step 2: 執行測試並確認紅燈**

Run: `npm test -- tests/practice-copy.test.js`

Expected: FAIL，因尚無提示狀態與提示按鈕。

- [ ] **Step 3: 實作提示開關**

新增 `showHint = ref(false)`，每題重設為 false；作答區加入「需要提示？」按鈕與 `aria-expanded`，展開時只顯示 `current.hint.zh`。答題後可保留已展開內容，但不得自動展開。

- [ ] **Step 4: 強化答錯回饋**

答錯時依序顯示「你的答案」、「正確答案」、「為什麼」與 `current.note.zh`；答對時只顯示正確結果與精簡中文補充。移除同區塊重複的英文 note。

- [ ] **Step 5: 執行測試與建置**

Run: `npm test && npm run build`

Expected: 所有測試 PASS，Vite build 成功。

---

### Task 6: 瀏覽器端完整驗證

**Files:**
- Verify only: `src/views/Reference.vue`
- Verify only: `src/views/Game.vue`
- Verify only: `src/views/Practice.vue`

**Interfaces:**
- Consumes: 完成後的 Vite 應用。
- Produces: 可重現的人工驗證結果。

- [ ] **Step 1: 啟動開發伺服器**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite 提供本機 URL，無編譯錯誤。

- [ ] **Step 2: 驗證手冊**

開啟 `/reference/git-init`，確認說明型標題與段落只顯示中文，Git 指令與終端範例仍為英文。

- [ ] **Step 3: 驗證闖關重玩與 XP**

完成第一關、記錄 XP、離開後重新點第一關；確認答案未顯示且可重新作答，第二次答對後 XP 不變。

- [ ] **Step 4: 驗證真正歸零**

清除 `gd-xp`、`gd-missions`、`gd-favs`、`gd-recent` 後重新整理；確認 0 XP、0/19 完成且第一關可開始。

- [ ] **Step 5: 驗證兩種練習**

確認首頁卡片皆顯示 60 questions；各進入一回合，展開提示確認不含完整答案，故意答錯確認顯示使用者答案、正確答案與中文原因。

- [ ] **Step 6: 最終驗證**

Run: `npm test && npm run build`

Expected: 測試全綠、build 成功、瀏覽器 console 無錯誤。
