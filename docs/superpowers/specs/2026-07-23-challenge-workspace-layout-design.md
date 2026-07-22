# Challenge 操作工作台版面修正規格

## 問題

目前 Challenge 頁面雖包含所有需要的內容，但首屏優先順序錯誤：Challenge Brief 過高、Terminal 被推到首屏下方，右側四個視覺化垂直堆疊，使 Editor's Desk、Git Graph 與 Commit Timeline 無法立即看見。Roadmap 同時顯示過多摘要，形成文件目錄而非遊戲地圖。

本次只修正版面結構、資訊層級與互動呈現，不改動 GitEngine、GitState、32 關資料、完成條件、XP、成就或進度遷移。

## 核心原則

玩家進入 `/game` 後，不需要捲動就能同時看到：

1. 目前關卡與必要情境
2. 可立即輸入的 Terminal
3. 動態 Editor's Desk
4. 目前最相關的 Git Visualization

## 桌面布局

```text
┌────────────────────────────────────────────────────────────────┐
│ Challenge header：標題、XP、完成進度（緊湊高度）               │
├──────────────┬───────────────────────────┬─────────────────────┤
│ Roadmap      │ Challenge Brief           │ Editor's Desk       │
│ 220px        │ 精簡情境與提示             │ 永久可見             │
│              ├───────────────────────────┼─────────────────────┤
│              │ Final steps（需要時）      │ Visualization tabs  │
│              ├───────────────────────────┤ Workflow｜Graph｜   │
│              │ Terminal                  │ Timeline            │
└──────────────┴───────────────────────────┴─────────────────────┘
```

- 欄寬：左欄約 `220px`，中欄 `minmax(560px, 1fr)`，右欄約 `380–420px`。
- 頁首減少上下留白，避免擠壓主要互動區。
- 中間與右側內容的起點對齊。
- 首屏以 900–1000px 高度為驗收基準，Terminal 輸入列與 Editor's Desk 必須可見。

## Challenge Roadmap

- 只展開目前 Chapter，其餘 Chapter 預設收合。
- 關卡列只顯示：狀態、Challenge 編號、中英文名稱。
- 移除每關中文摘要，詳細故事只在中間 Brief 顯示。
- 目前關卡狀態優先：使用橘色左線、淡橘底與深色文字。
- 已完成但不是目前關卡：使用綠色勾選與綠色標題。
- 已完成且目前選中：只呈現目前關卡的橘色樣式；勾選可以保留為小型次要標記，不讓綠色主導。
- 未解鎖：灰色文字與降低透明度。
- Final Challenge 保留星號或獎盃文字標記。

## Challenge Brief

- 採用與 Challenge Roadmap 相同的編輯式欄目語言，不再呈現大型圓角卡片。
- 題目區頂部依序顯示小型英文欄名 `Current Challenge`、中文欄名 `今日闖關`，下方使用深色橫線分隔內容。
- Challenge 編號、Difficulty、Level、Reward 放在橫線下方的單行 metadata，不使用獨立 Dashboard 卡片。
- 英文關卡名稱仍是中欄主要視覺焦點，中文名稱緊接其下；兩者直接排在紙張背景上。
- 英文標題調整為 `38–44px`，中文標題為 `16–18px`。
- Difficulty、Level、Reward 保持單行緊湊排列。
- 英文摘要與中文摘要各保留一行，不再額外顯示重複的長故事段落。
- `Learning Goal` 改為細線或紙色重點帶，不使用另一張大型卡片，且不得直接公布完整 Git 指令。Challenge Config 新增 `learningConcept`，例如：
  - `Inspect repository state`
  - `確認儲存庫目前狀態`
- `learningGoal` 中的實際語法只供第三階提示與完成條件使用。
- 提示按鈕保留三階段機制；未展開提示時不預留空白高度。
- 題目內容和 Terminal 之間維持清楚的欄目節奏，但不再以圓角外框包住整段內容。

## Terminal 與 Final Challenge Steps

- Terminal 緊接 Brief，下方或上方間距不超過 `20px`。
- Terminal 在桌面首屏可見，建議顯示高度約 `300–360px`。
- Final Challenge 多步驟進度放在 Terminal 上方，以單行或可換行的細型路徑呈現。
- 一般 Challenge 不顯示空的步驟區塊。

## 右側 Editor's Desk

- Editor's Desk 固定為右欄第一個區塊，永遠可見。
- 高度依內容自然延伸，但初始內容控制在三個精簡段落內。
- 保留「發生了什麼／為什麼重要／常見誤解」，降低段落間距。
- 輸入 Git 指令後，內容以 200–280ms 淡入更新。
- 警告狀態使用橘色書脊線，不新增警告 Dashboard 或大型 icon。

## Visualization Tabs

- Git Workflow、Git Graph、Commit Timeline 改為同一卡片內的三個文字分頁。
- 三個區塊仍存在且可隨時切換，但不再垂直堆疊。
- Editor's Desk 不放入分頁。
- 初始分頁由 Challenge Config 的學習目標決定。
- 每次成功操作後自動切換：
  - `init`、`status`、`add`、`commit`、`restore`、`stash`、`rm`、`rm-cached` → Workflow
  - `branch`、`branch-delete`、`switch`、`merge`、`tag`、`tag-delete`、`rebase` → Graph
  - `log`、`log-oneline`、`blame`、`reflog`、`revert` → Timeline
  - remote、fetch、pull、push 保留目前分頁，由 Editor's Desk 說明同步概念
- 玩家手動選擇分頁後仍可查看任一視覺化；下一個成功指令可以再次切到最相關分頁。
- 分頁內容高度控制在約 `300–360px`，內容過多時於區塊內捲動，不拉長整頁。

## 響應式

- `1080px` 以下改為單欄順序：Challenge Brief → Terminal → Editor's Desk → Visualization tabs → Roadmap。
- 手機 Roadmap 放在頁面下方或收合區，不阻擋主要操作。
- 平板與手機不使用 sticky，避免多個容器競爭捲動。
- 保留 `prefers-reduced-motion` 支援。

## 元件調整

- `ChallengeRoadmap.vue`：自動展開目前 Chapter、移除摘要。
- `ChallengeBrief.vue`：新增 `learningConcept` 顯示，移除重複故事與多餘高度。
- `GitVisualization.vue`：拆成 Editor's Desk＋Visualization tabs。
- 新增 `VisualizationTabs.vue`：管理三個分頁與 action 對應。
- `EditorsDesk.vue`：壓縮間距並加入內容切換 transition。
- `Game.vue`：調整三欄尺寸、首屏高度與響應式排列。
- `challenges.js`：每關新增中英文 `learningConcept`，不改 `learningGoal` 與完成條件。

## 驗收

- 1600×900 與 1440×900 桌面視窗中，Terminal 輸入列和 Editor's Desk 同時出現在首屏。
- 首屏不會同時垂直呈現 Workflow、Graph、Timeline 三張卡片。
- Roadmap 非目前章節預設收合，關卡列不顯示故事摘要。
- Learning Goal 區域不顯示完整 Git 語法。
- 第三階提示仍能顯示完整語法。
- add/commit 自動切換 Workflow；branch/switch/merge 自動切換 Graph；log/reflog/revert 自動切換 Timeline。
- 手動切換三個視覺化分頁可正常操作。
- GitEngine、32 關完成條件、XP、成就與重玩行為不變。
- Node 測試、Vite build 與桌面瀏覽器截圖驗證通過。
