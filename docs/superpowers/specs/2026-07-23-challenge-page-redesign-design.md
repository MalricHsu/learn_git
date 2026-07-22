# Git Daily Challenge 頁面重設計規格

## 產品定位

Challenge 頁面是一個具有關卡目標與即時視覺回饋的 Git 學習遊戲。它不是考試、LeetCode 或 Dashboard，而是「一本可以玩的 Git 教科書」。玩家透過操作理解 Git，不靠死背指令。

頁面保留 `/game` 路由與 `Game.vue`，對外名稱統一為 `Challenge／闖關`。頁面內容不得使用 `Mission`、`Exercise`、`Question`。

## 語言原則

- Chapter 與 Challenge 名稱保留自然的英文與繁體中文。
- Challenge 簡短描述依最新確認的版型顯示英文與繁體中文。
- 完整故事、提示與 Editor's Desk 的教學解說以繁體中文為主。
- Git 指令、參數、Branch 名稱與 Terminal 輸出保留英文。

## 頁面資訊架構

### 左側：Challenge Roadmap／闖關地圖

- 依六個 Chapter 排列 32 個可操作關卡：26 個一般 Challenge 與 6 個章末 Final Challenge。
- 已完成關卡顯示綠色勾選，目前關卡顯示橘色，未解鎖關卡顯示灰色。
- 每個一般關卡顯示編號、中英文名稱與一句簡短描述。
- Final Challenge 使用星號或獎盃作為低調的文字標記，不使用大量圖示。
- 已完成關卡可以重新進入複習，但不得重複取得 XP 或成就。

### 中間：Today's Challenge／今日闖關

每關固定顯示：

- `Challenge 09` 或 `Final Challenge`
- 中英文關卡名稱
- `Difficulty`：Easy、Normal、Hard
- `Level`：Beginner、Intermediate、Advanced
- `Reward`：例如 `+100 XP`
- `Learning Goal／學習目標`：顯示本關要理解的 Git 指令或指令組合
- 簡短的中英文任務描述
- 以繁體中文呈現的完整情境
- 三階段提示
- 現有模擬 Terminal

所有 32 關都是 Terminal Challenge，不保留選擇題或概念題。

### 右側：Git Visualization／Git 視覺化

右側固定且只包含四個區塊：

1. `Git Workflow／Git 工作流程`
2. `Git Graph／Git 分支圖`
3. `Commit Timeline／提交時間軸`
4. `Editor's Desk／編輯室`

不顯示 Repository Status、Staged 數字、Untracked 數字或 Pushed 狀態卡。頁面底部不放 Editor's Note。

## 32 個 Challenge

### Chapter 1 — Git Foundations／Git 基礎

1. **Start Your Journey／啟程** — `git init`
2. **What's Changed?／發生了什麼？** — `git status`
3. **Prepare for Commit／準備提交** — `git add`
4. **Make It Official／正式建立版本** — `git commit`
5. **Final Challenge: First Project Complete／完成你的第一個 Git 專案** — 依序完成 `git init`、`git status`、`git add .`、`git commit -m "Initial commit"`

完成章末關卡解鎖：

- `Achievement Unlocked／成就解鎖`
- `Git Explorer／Git 初學探險家`
- `You've mastered the Git Foundations chapter!／你已完成 Git Foundations！`

### Chapter 2 — History／版本歷史

6. **Travel Through Time／穿越版本歷史** — `git log --oneline`
7. **Find the Difference／找出差異** — `git diff`
8. **Who Changed This?／是誰改的？** — `git blame`
9. **Undo the Accident／撤銷這次失誤** — `git restore`
10. **Final Challenge: Time Traveler／版本旅行者** — 在預載歷史中依序使用精簡 log、查看指定檔案差異、追查修改來源並還原誤改檔案

完成章末關卡解鎖 `Time Traveler／版本旅行者` 成就。

### Chapter 3 — Branching／分支管理

11. **Open a New Path／開啟新路線** — `git branch`
12. **Walk Another Path／切換路線** — `git switch`
13. **Complete the Feature／完成功能開發** — `git add`＋`git commit`
14. **Merge Back Together／合併回主線** — `git merge`
15. **Final Challenge: Master of Branches／分支達人** — 建立 feature 分支、切換、完成一次提交、回到 main 並合併

完成章末關卡解鎖 `Master of Branches／分支達人` 成就。

### Chapter 4 — Remote Collaboration／遠端協作

16. **Meet GitHub／初次連線 GitHub** — `git remote add`
17. **Receive New Updates／接收最新消息** — `git fetch`
18. **Stay in Sync／保持同步** — `git pull`
19. **Share Your Progress／分享你的成果** — `git push`
20. **Final Challenge: Open Source Contributor／開源協作者** — 設定 origin、抓取更新、同步目前分支並推送本機提交

完成章末關卡解鎖 `Open Source Contributor／開源協作者` 成就。

### Chapter 5 — Advanced／進階

21. **Save It for Later／先收起來** — `git stash`
22. **Mark the Milestone／標記里程碑** — `git tag`
23. **Rewrite the Timeline／重寫歷史** — `git rebase`
24. **Rescue Lost Work／救回遺失成果** — `git reflog`
25. **Final Challenge: Git Daily Graduation／Git Daily 畢業挑戰** — 在預載情境中收起未完成工作、標記版本、整理分支歷史並透過 reflog 找到可復原位置

完成本章關卡解鎖 `Git History Keeper／Git 歷史守護者` 成就。

### Chapter 6 — Safe Cleanup／安全整理

26. **Remove a Tracked File／移除追蹤檔案** — `git rm`
27. **Keep It Local／只保留在本機** — `git rm --cached`
28. **Close an Old Path／刪除舊分支** — `git branch -d`
29. **Remove a Marker／移除標籤** — `git tag -d`
30. **Disconnect the Remote／移除遠端連線** — `git remote remove`
31. **Undo Without Erasing History／安全撤銷版本** — `git revert`
32. **Final Challenge: Clean Up Safely／安全整理專案** — 在預載專案中停止追蹤機密檔案、移除已合併分支與舊標籤、刪除不用的遠端，最後以 revert 安全撤銷已分享提交

完成最後關卡顯示獎盃式文字成果，解鎖 `Git Daily Graduate／Git Daily 畢業生` 成就。名稱不使用「畢業測驗」，避免考試感。

刪除 `.git` 不設計成可執行的 Challenge。Editor's Desk 會說明刪除 `.git` 會移除整個版本歷史與儲存庫身分，並明確警告不要在不確定時執行 `rm -rf .git`；模擬 Terminal 不接受或執行這個 shell 指令。

## 三階段提示

每個 Challenge Config 提供 `hints` 陣列，按下提示按鈕時依序顯示：

1. 概念提示：指出應理解的 Git 區域或狀態，不出現答案。
2. 指令提示：只顯示主指令，例如 `git log`。
3. 語法提示：顯示完整語法，例如 `git log --oneline`。

每次只增加一層。第三層顯示後按鈕改為收起，重新進入或重玩關卡時歸零。

## Git Engine 與資料流

保留瀏覽器內的 JavaScript 模擬器，不執行 shell、本機 Git 或 Git CLI。專案現有檔案為 `src/composables/useGitEngine.js`，本次沿用 JavaScript，不為了檔名要求單獨遷移 TypeScript。

GitState 統一為：

```js
{
  initialized,
  currentBranch,
  branches,
  workingDirectory,
  stagingArea,
  repository,
  commits,
  remote,
  lastAction
}
```

其中：

- `branches` 保存各分支指向的 commit ID，而不只是名稱陣列。
- `repository` 保存目前已納入版本控制的檔案快照。
- `commits` 保存 hash、message、branch、parents、files 與模擬 timestamp。
- `remote` 保存遠端名稱、URL、追蹤分支與同步狀態。
- `lastAction` 保存原始輸入、解析後 command、成功與否、effect、受影響檔案、分支與教學 key。

資料流：

```text
Terminal input
  → useGitEngine.run()
  → GitState mutation + lastAction
  → Challenge completion check
  → Workflow / Graph / Timeline / Editor's Desk rerender
```

合法但不符合目前目標的指令仍依 Git 規則更新狀態；關卡只在完成條件符合時通關。無效操作不改變狀態，但會更新 `lastAction` 供 Editor's Desk 解釋。

## Git Visualization

### Git Workflow

- 以三個紙張區域呈現 Working Directory、Staging Area、Repository。
- 顯示實際檔名，不顯示數量。
- `git add` 讓檔案以 200–350ms 滑入 Staging Area。
- `git commit` 讓檔案進入 Repository，並同步產生 commit。
- `git restore`、`git stash` 等操作依 GitState 移動或暫時移除檔案。

### Git Graph

- 使用 SVG 連線與 HTML commit 節點，保持 Modern Editorial 的紙本插圖感。
- Branch 呈現為指向 commit 的標籤。
- `git branch` 生成新分支標籤，`git switch` 平滑移動 HEAD。
- Commit 延伸目前分支；merge commit 保存兩個 parent 並畫出匯合線。
- 沒有提交時顯示中文空狀態，不放假資料。

### Commit Timeline

- 完全由 `GitState.commits` 產生。
- 顯示模擬時間、commit message、短 hash、branch 與 HEAD。
- 新 commit 以 200–350ms 插入時間軸。
- 不使用統計卡、數字儀表或 Dashboard 視覺語言。

### Editor's Desk

- 是頁面唯一的教學說明區塊，也是右側視覺權重最高的區塊。
- 初始內容由目前 Challenge Config 的 `editorial.intro` 提供。
- 每次輸入後，以 `lastAction.teachingKey` 查找 Challenge Config 的 `editorial.actions`。
- 每則內容說明「發生了什麼」、「為什麼需要」與「常見誤解」。
- `git add` 說明暫存區；`git commit` 說明 Snapshot；`git branch` 說明指標；`git switch` 說明 HEAD；`git merge` 說明匯合與衝突可能性。
- 元件內不寫死個別關卡教學文案。若 Challenge Config 沒有專屬內容，使用由 engine 提供、同樣存放於資料層的通用 teaching content。

## 元件邊界

- `src/views/Game.vue`：三欄編排、目前關卡與通關協調。
- `src/components/challenge/ChallengeRoadmap.vue`：Chapter 與關卡狀態。
- `src/components/challenge/ChallengeBrief.vue`：關卡資訊、故事與三階提示。
- `src/components/challenge/GitVisualization.vue`：右側四區容器。
- `src/components/challenge/GitWorkflow.vue`：檔案流動。
- `src/components/challenge/GitGraph.vue`：commit、branch、HEAD 與 merge 線。
- `src/components/challenge/CommitTimeline.vue`：提交時間軸。
- `src/components/challenge/EditorsDesk.vue`：動態教學內容。
- `src/data/challenges.js`：32 關設定、提示、完成條件與 Editor's Desk 文案。
- `src/data/gitTeaching.js`：跨關卡共用的指令概念說明。
- `src/composables/useGitEngine.js`：純瀏覽器 GitState 與指令模擬。

舊 `missions.js` 的內容遷移至 `challenges.js`。localStorage 的既有完成 ID 在讀取時做一次映射；不讓舊資料造成崩潰或重複 XP。

## 視覺與響應式

- 延續紙張底色、森林綠、橘色提示、襯線大標與大量留白。
- 不使用霓虹、玻璃擬態、大量 icon 或 Dashboard 卡片網格。
- 寬螢幕為 Roadmap／Challenge＋Terminal／Visualization 三欄。
- 平板依序排列 Roadmap、Challenge＋Terminal、Visualization。
- 手機將 Roadmap 收成 Chapter 選單，四個視覺化區塊放在 Terminal 下方。
- 所有狀態動畫為 200–350ms，並尊重 `prefers-reduced-motion`。

## 錯誤與教學回饋

- 非 Git 指令：Terminal 顯示錯誤，Editor's Desk 解釋這是 Git 教學終端。
- 前置條件不足：GitState 不變，Editor's Desk 說明缺少的步驟與概念，但不直接公布完整答案。
- 合法但不是本關目標：GitState 正常更新，Editor's Desk 解釋本次操作；玩家仍可繼續。
- 三次提示用完後才會看到完整語法。

## 測試與驗收

- 32 關皆為 Terminal Challenge；26 個一般關卡與 6 個 Final Challenge 數量正確。
- 頁面與關卡設定不出現 `Mission`、`Exercise`、`Question`。
- Final Challenge 能依序驗證多個步驟並只給一次 XP／成就。
- 三階段提示依序揭露並在重玩時重設。
- GitState 測試涵蓋 init、status、add、commit、diff、blame、restore、branch、switch、merge、remote、fetch、pull、push、stash、tag、rebase、reflog、rm、rm --cached、branch -d、tag -d、remote remove 與 revert。
- 模擬 Terminal 必須拒絕 `rm -rf .git` 與其他非 Git shell 指令，GitState 不得因此變動；Editor's Desk 顯示資料遺失警告。
- Git Graph 測試涵蓋 branch pointer、HEAD 移動與雙 parent merge commit。
- Workflow 與 Timeline 由 GitState 實際檔案和 commit 生成。
- Editor's Desk 會隨成功、失敗與不同 Git 指令更新。
- 完成關卡可重玩但不重複取得 XP 或成就。
- Vite build、Node 單元測試與瀏覽器端流程驗證全部通過。

## 不在本次範圍

- 不呼叫 shell、本機 Git 或遠端 GitHub API。
- 不把 Terminal 改成真正終端機。
- 不建立競速、排行榜、計時器或考試分數。
- 不重設先前已完成的手冊中文化與練習題庫功能。
