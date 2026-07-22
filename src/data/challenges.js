const achievement = (id, en, zh, messageEn, messageZh) => ({ id, en, zh, messageEn, messageZh });

export const chapters = [
  { id: "foundations", number: 1, title: { en: "Git Foundations", zh: "Git 基礎" }, achievement: achievement("git-explorer", "Git Explorer", "Git 初學探險家", "You've mastered the Git Foundations chapter!", "你已完成 Git Foundations！") },
  { id: "history", number: 2, title: { en: "History", zh: "版本歷史" }, achievement: achievement("time-traveler", "Time Traveler", "版本旅行者", "You can now read and repair project history.", "你已掌握版本歷史的閱讀與修復。") },
  { id: "branching", number: 3, title: { en: "Branching", zh: "分支管理" }, achievement: achievement("branch-master", "Master of Branches", "分支達人", "You've brought separate paths back together.", "你已學會開闢、切換與合併分支。") },
  { id: "remote", number: 4, title: { en: "Remote Collaboration", zh: "遠端協作" }, achievement: achievement("open-source-contributor", "Open Source Contributor", "開源協作者", "Your work can now travel beyond your computer.", "你已能安全地與遠端協作者同步。") },
  { id: "advanced", number: 5, title: { en: "Advanced", zh: "進階" }, achievement: achievement("history-keeper", "Git History Keeper", "Git 歷史守護者", "You've learned to reshape and recover local history.", "你已學會整理並找回版本歷史。") },
  { id: "cleanup", number: 6, title: { en: "Safe Cleanup", zh: "安全整理" }, achievement: achievement("git-daily-graduate", "Git Daily Graduate", "Git Daily 畢業生", "You understand how to clean up without losing the story.", "你已能在保留歷史的前提下安全整理專案。") },
];

const entries = [
  [1,"foundations","Start Your Journey","啟程","git init","init","Create a Git repository in this project folder.","讓這個專案資料夾開始由 Git 管理。"],
  [2,"foundations","What's Changed?","發生了什麼？","git status","status","Inspect the project before making your next move.","先確認專案目前有哪些變動，再決定下一步。"],
  [3,"foundations","Prepare for Commit","準備提交","git add README.md","add","Choose README.md for the next snapshot.","把 README.md 選入下一個版本快照。"],
  [4,"foundations","Make It Official","正式建立版本","git commit -m \"Initial commit\"","commit","Turn the staged work into an official version.","把暫存內容正式建立成第一個版本。"],
  [5,"foundations","First Project Complete","完成你的第一個 Git 專案","git init → status → add → commit","final-foundations","Complete the full first-project workflow.","從初始化到提交，完成第一個完整 Git 流程。"],
  [6,"history","Travel Through Time","穿越版本歷史","git log --oneline","log-oneline","Read the project history in its clearest compact form.","用最精簡的方式閱讀專案版本歷史。"],
  [7,"history","Find the Difference","找出差異","git diff","diff","Inspect what changed before it becomes history.","在變動成為版本前，先找出內容差異。"],
  [8,"history","Who Changed This?","是誰改的？","git blame app.js","blame","Trace the latest change to each line in app.js.","追查 app.js 每一行最後由哪次修改留下。"],
  [9,"history","Undo the Accident","撤銷這次失誤","git restore app.js","restore","Discard the accidental edit to app.js.","放棄 app.js 這次意外修改。"],
  [10,"history","Time Traveler","版本旅行者","log → diff → blame → restore","final-history","Investigate and repair a mistake across project history.","沿著版本歷史找出問題，並安全還原誤改。"],
  [11,"branching","Open a New Path","開啟新路線","git branch feature/login","branch","Create a separate path for the login feature.","替登入功能建立一條獨立開發路線。"],
  [12,"branching","Walk Another Path","切換路線","git switch feature/login","switch","Move HEAD onto the feature branch.","把 HEAD 移到新的功能分支。"],
  [13,"branching","Complete the Feature","完成功能開發","git add . → git commit","feature-complete","Finish and record the work on the feature branch.","在功能分支完成修改並建立版本。"],
  [14,"branching","Merge Back Together","合併回主線","git merge feature/login","merge","Bring the finished feature back into main.","把完成功能的分支合併回主線。"],
  [15,"branching","Master of Branches","分支達人","branch → switch → add → commit → merge","final-branching","Complete an entire branch workflow from start to merge.","從建立支線到合併，完成一次完整分支流程。"],
  [16,"remote","Meet GitHub","初次連線 GitHub","git remote add origin https://github.com/you/app.git","remote-add","Connect the local project to its remote home.","替本機專案設定遠端協作位置。"],
  [17,"remote","Receive New Updates","接收最新消息","git fetch","fetch","Check for remote progress without touching your files.","取得遠端新進度，但先不要改動工作檔案。"],
  [18,"remote","Stay in Sync","保持同步","git pull","pull","Bring the latest remote work into your branch.","把遠端最新進度整合到目前分支。"],
  [19,"remote","Share Your Progress","分享你的成果","git push","push","Publish your local commits for collaborators.","把本機提交分享給遠端協作者。"],
  [20,"remote","Open Source Contributor","開源協作者","remote → fetch → pull → push","final-remote","Connect, receive, integrate, and publish a contribution.","完成從連線、接收到分享的完整遠端協作。"],
  [21,"advanced","Save It for Later","先收起來","git stash","stash","Put unfinished work aside without committing it.","先收起未完成內容，不急著建立版本。"],
  [22,"advanced","Mark the Milestone","標記里程碑","git tag v1.0","tag","Mark the current commit as an important release.","替目前版本加上重要里程碑標記。"],
  [23,"advanced","Rewrite the Timeline","重寫歷史","git rebase main","rebase","Replay the feature work on top of main.","把功能分支的工作重新整理到 main 之上。"],
  [24,"advanced","Rescue Lost Work","救回遺失成果","git reflog","reflog","Find where HEAD pointed before the work disappeared.","從 HEAD 的移動足跡找回看似遺失的成果。"],
  [25,"advanced","Git Daily Graduation","Git Daily 畢業挑戰","stash → tag → rebase → reflog","final-advanced","Protect, mark, reshape, and recover project history.","收起、標記、整理並找回專案歷史。"],
  [26,"cleanup","Remove a Tracked File","移除追蹤檔案","git rm old.txt","rm","Remove old.txt and record that deletion for the next commit.","移除 old.txt，並讓下一次提交記錄這項刪除。"],
  [27,"cleanup","Keep It Local","只保留在本機","git rm --cached secret.env","rm-cached","Stop tracking secret.env while keeping the local file.","停止追蹤 secret.env，但保留本機檔案。"],
  [28,"cleanup","Close an Old Path","刪除舊分支","git branch -d old-feature","branch-delete","Remove a branch that is no longer needed.","移除已完成且不再需要的舊分支。"],
  [29,"cleanup","Remove a Marker","移除標籤","git tag -d v0.9","tag-delete","Delete an outdated local version marker.","移除已過期的本機版本標籤。"],
  [30,"cleanup","Disconnect the Remote","移除遠端連線","git remote remove backup","remote-remove","Remove a remote destination the project no longer uses.","移除專案不再使用的遠端連線。"],
  [31,"cleanup","Undo Without Erasing History","安全撤銷版本","git revert HEAD","revert","Reverse a shared change without rewriting history.","不改寫共享歷史，以新提交安全撤銷變更。"],
  [32,"cleanup","Clean Up Safely","安全整理專案","rm --cached → branch -d → tag -d → remote remove → revert","final-cleanup","Clean the project without destroying its story.","在不破壞歷史的前提下完成專案整理。"],
];

// Beginner-friendly, plain-language "what to do" per challenge. Falls back to
// the short summary when a challenge has no dedicated task copy yet.
const tasks = {
  1: "你今天新建了一個專案資料夾，準備開始寫程式。可是 Git 還不認識它。用一個指令讓 Git 接手這個資料夾，從現在起你的每次改動它都會默默記錄下來。",
  2: "寫了一陣子，你有點記不得剛剛動過哪些檔案。開工前的好習慣：先問問 Git，「現在哪些檔案被改了、哪些還沒被收進版本？」",
  3: "你想把成果存成一個版本，但 Git 不會全部亂收——你得先「點名」這次要記錄哪些檔案。先把 README.md 挑進暫存區排隊。",
  4: "檔案都挑好在暫存區排隊了。現在正式拍一張「版本快照」，並寫一句話說明這次做了什麼，這就是你的第一個提交。",
  5: "第一天上工，把流程完整跑一遍：讓 Git 接手資料夾 → 查看狀態 → 挑選檔案 → 建立版本。恭喜完成你的第一個 Git 專案。",
  6: "專案跑了一段時間，已經累積不少提交。你想快速回顧「一路上到底做過哪些版本」，用一行一筆的精簡方式把整段歷史看過去。",
  7: "你剛動了幾行程式，但還沒建立版本。送出之前，先跟上次記錄的版本比對一下：這次到底改了哪些內容？",
  8: "app.js 裡有一行看起來怪怪的，你想知道「這是誰、在哪一次提交寫下的」。用一個指令，把每一行的來歷逐行查清楚。",
  9: "糟了，你不小心把 app.js 改壞了，而且還沒提交。趁還來得及，把它還原成上次記錄的乾淨樣子。",
  10: "團隊回報某個檔案最近怪怪的。當一次偵探：用 log 看歷史、diff 比差異、blame 找兇手，最後把誤改的檔案安全還原。",
  11: "你接到一個新的登入功能要開發，但不想干擾正在運作的主線。先另闢一條分支，讓新功能在自己的路線上安心進行。",
  12: "分支開好了，可是你人還站在 main 上。切換到 feature/login，這樣接下來的修改才會記錄在這條新路線，而不是主線。",
  13: "登入功能寫完了。把改動全部放進暫存區，再建立一個版本，把這次的成果正式記錄在功能分支上。",
  14: "功能分支測試都過了。回到 main，把 feature/login 的成果合併進來，讓它正式成為主線的一部分。",
  15: "獨立完成一次完整的分支開發：開分支 → 切過去 → 完成功能並提交 → 合併回主線。",
  16: "你想把專案放上 GitHub，和其他人一起協作。先替本機專案設定一個遠端位置，取名 origin，指向 GitHub 上那個儲存庫的網址。",
  17: "隊友說他們剛推了新東西上去。你想先偷看一下遠端有什麼新進度，但暫時不要動到自己手上正在改的檔案。",
  18: "確認過遠端的更新沒問題了。把最新進度抓下來、整合進目前的分支，讓自己跟上大家的版本。",
  19: "你在本機已經做好幾個提交。把它們推上遠端，讓隊友也能拿到你的成果。",
  20: "完整走一次協作循環：連上遠端 → 接收消息 → 整合進度 → 分享自己的提交，體驗一次開源貢獻。",
  21: "工作做到一半，主管臨時請你先去修別的地方。先把手上還沒完成的改動整包收起來，讓工作目錄回到乾淨、方便切換。",
  22: "專案終於到了可以對外發布的版本。替目前這個提交貼上標籤 v1.0，日後要回頭找這個里程碑就很方便。",
  23: "你的功能分支落後 main 好幾步了。把你這條分支的工作，重新接到最新的 main 之上，讓歷史看起來像乾淨的一直線。",
  24: "你剛做的提交好像憑空消失了，有點慌。別急——查一下 HEAD 走過的足跡，看似不見的成果通常都能從這份紀錄找回來。",
  25: "把進階技巧全串起來：收起未完工作 → 標記重要版本 → 整理歷史基底 → 從足跡救回成果。",
  26: "old.txt 已經確定用不到了。用 Git 的方式把它刪掉，讓下一次提交正式記錄下「這個檔案被移除了」。",
  27: "你發現 secret.env 不小心被 Git 追蹤了，但這個檔案本身還得留在本機。讓 Git 停止追蹤它，檔案卻不要被刪掉。",
  28: "old-feature 已經合併完、不會再用了。把這條舊分支的指標刪掉，讓分支清單保持乾淨清爽。",
  29: "v0.9 是個先前貼錯的舊標籤。把這個過期的本機版本標記刪掉。",
  30: "backup 這個遠端很久沒在用了。把它從專案的遠端設定裡移除。",
  31: "剛剛那個提交已經分享給大家了，不能直接抹掉。改用一個新的提交來抵銷它，安全撤銷變更、又不改寫共享歷史。",
  32: "畢業考：在不破壞歷史的前提下整理專案——停止追蹤機密檔 → 刪掉舊分支 → 移除舊標籤 → 移除遠端 → 用 revert 安全撤銷。",
};

const finalNumbers = new Set([5, 10, 15, 20, 25, 32]);
const careerStory = {
  foundations: "你剛進新公司的第一週，資深工程師請你先熟悉團隊最基本的版本流程。",
  history: "進入新公司第二週，你開始接手既有專案，主管請你從版本歷史調查問題。",
  branching: "主管交給你進公司後的第一個正式功能，這次要在不影響主線的情況下完成開發。",
  remote: "你開始和公司裡的其他工程師共同開發，需要學會接收、整合與分享彼此的進度。",
  advanced: "在公司獨立工作一段時間後，你開始處理臨時切換、版本發布與歷史整理等複雜情況。",
  cleanup: "公司專案準備交接與發布，主管請你安全整理檔案、分支、標籤和遠端設定。",
};
const keySteps = {
  "final-foundations": [["初始化儲存庫","init"],["確認目前狀態","status"],["準備所有檔案","add"],["建立 Initial commit","commit"]],
  "final-history": [["閱讀精簡歷史","log-oneline"],["查看差異","diff"],["追查修改來源","blame"],["還原誤改檔案","restore"]],
  "feature-complete": [["準備功能檔案","add"],["建立功能版本","commit"]],
  "final-branching": [["建立功能分支","branch"],["切換到功能分支","switch"],["準備功能檔案","add"],["建立功能版本","commit"],["回到 main","switch"],["合併功能分支","merge"]],
  "final-remote": [["設定 origin","remote-add"],["取得遠端消息","fetch"],["同步目前分支","pull"],["分享本機提交","push"]],
  "final-advanced": [["收起未完成工作","stash"],["標記里程碑","tag"],["整理分支歷史","rebase"],["查看 HEAD 足跡","reflog"]],
  "final-cleanup": [["停止追蹤機密檔案","rm-cached"],["刪除舊分支","branch-delete"],["移除舊標籤","tag-delete"],["移除備份遠端","remote-remove"],["安全撤銷共享提交","revert"]],
};

const seeds = {
  1: { initialized: false, workingDirectory: ["README.md"] },
  2: { initialized: true, workingDirectory: ["README.md", "app.js"] },
  3: { initialized: true, workingDirectory: ["README.md"] },
  4: { initialized: true, stagingArea: ["README.md"] },
  5: { initialized: false, workingDirectory: ["README.md", "app.js"] },
  6: { initialized: true, repository: ["README.md"], commits: [{ hash: "1a0c9d4", message: "Initial commit", branch: "main", files: ["README.md"] }, { hash: "3b71e02", message: "Add login form", branch: "main", files: ["app.js"] }] },
  7: { initialized: true, repository: ["app.js"], workingDirectory: ["app.js"] },
  8: { initialized: true, repository: ["app.js"], commits: [{ hash: "3b71e02", message: "Add app", branch: "main", files: ["app.js"] }] },
  9: { initialized: true, repository: ["app.js"], workingDirectory: ["app.js"] },
  10: { initialized: true, repository: ["app.js"], workingDirectory: ["app.js"], commits: [{ hash: "3b71e02", message: "Add app", branch: "main", files: ["app.js"] }] },
  11: { initialized: true, commits: [{ hash: "1a0c9d4", message: "Initial commit", branch: "main", files: ["README.md"] }] },
  12: { initialized: true, branches: { main: "1a0c9d4", "feature/login": "1a0c9d4" }, commits: [{ hash: "1a0c9d4", message: "Initial commit", branch: "main", files: ["README.md"] }] },
  13: { initialized: true, currentBranch: "feature/login", branches: { main: "1a0c9d4", "feature/login": "1a0c9d4" }, workingDirectory: ["login.js"], commits: [{ hash: "1a0c9d4", message: "Initial commit", branch: "main", files: ["README.md"] }] },
  14: { initialized: true, branches: { main: "1a0c9d4", "feature/login": "3b71e02" }, commits: [{ hash: "1a0c9d4", message: "Initial commit", branch: "main", files: ["README.md"] }, { hash: "3b71e02", message: "Add login", branch: "feature/login", parents: ["1a0c9d4"], files: ["login.js"] }] },
  15: { initialized: true, workingDirectory: ["login.js"], commits: [{ hash: "1a0c9d4", message: "Initial commit", branch: "main", files: ["README.md"] }] },
  16: { initialized: true, commits: [{ hash: "1a0c9d4", message: "Initial commit", branch: "main", files: ["README.md"] }] },
  17: { initialized: true, remote: { entries: { origin: "https://github.com/you/app.git" }, trackingBranches: {}, fetched: false, pushed: false } },
  18: { initialized: true, remote: { entries: { origin: "https://github.com/you/app.git" }, trackingBranches: {}, fetched: false, pushed: false } },
  19: { initialized: true, commits: [{ hash: "3b71e02", message: "Add feature", branch: "main", files: ["app.js"] }], remote: { entries: { origin: "https://github.com/you/app.git" }, trackingBranches: {}, fetched: false, pushed: false } },
  20: { initialized: true, commits: [{ hash: "3b71e02", message: "Add feature", branch: "main", files: ["app.js"] }] },
  21: { initialized: true, workingDirectory: ["draft.js"] },
  22: { initialized: true, commits: [{ hash: "3b71e02", message: "Release", branch: "main", files: ["app.js"] }] },
  23: { initialized: true, currentBranch: "feature", branches: { main: "1a0c9d4", feature: "3b71e02" }, commits: [{ hash: "1a0c9d4", message: "Initial", branch: "main", files: ["README.md"] }, { hash: "3b71e02", message: "Feature", branch: "feature", parents: ["1a0c9d4"], files: ["app.js"] }] },
  24: { initialized: true, reflog: [{ hash: "3b71e02", action: "reset: moving to HEAD~1", branch: "main" }] },
  25: { initialized: true, currentBranch: "feature", branches: { main: "1a0c9d4", feature: "3b71e02" }, workingDirectory: ["draft.js"], commits: [{ hash: "1a0c9d4", message: "Initial", branch: "main", files: ["README.md"] }, { hash: "3b71e02", message: "Feature", branch: "feature", parents: ["1a0c9d4"], files: ["app.js"] }] },
  26: { initialized: true, repository: ["old.txt"], workingDirectory: ["old.txt"] },
  27: { initialized: true, repository: ["secret.env"] },
  28: { initialized: true, branches: { main: "1a0c9d4", "old-feature": "1a0c9d4" }, commits: [{ hash: "1a0c9d4", message: "Initial", branch: "main", files: ["README.md"] }] },
  29: { initialized: true, tags: { "v0.9": "1a0c9d4" }, commits: [{ hash: "1a0c9d4", message: "Initial", branch: "main", files: ["README.md"] }] },
  30: { initialized: true, remote: { entries: { backup: "https://example.com/backup.git" }, trackingBranches: {}, fetched: false, pushed: false } },
  31: { initialized: true, commits: [{ hash: "3b71e02", message: "Broken release", branch: "main", files: ["app.js"] }] },
  32: { initialized: true, repository: ["secret.env", "app.js"], branches: { main: "3b71e02", "old-feature": "3b71e02" }, tags: { "v0.9": "3b71e02" }, remote: { entries: { backup: "https://example.com/backup.git" }, trackingBranches: {}, fetched: false, pushed: false }, commits: [{ hash: "3b71e02", message: "Shared mistake", branch: "main", files: ["app.js"] }] },
};

const rootCommand = (syntax) => syntax.split(/\s|→/).slice(0, 2).join(" ").trim();
const concepts = {
  init: ["Create a repository", "建立版本管理空間"], status: ["Inspect repository state", "確認儲存庫目前狀態"],
  add: ["Choose the next snapshot", "選擇下一個版本快照"], commit: ["Create a version snapshot", "建立正式版本快照"],
  "final-foundations": ["Complete the first Git workflow", "完成第一個 Git 工作流程"],
  "log-oneline": ["Read compact project history", "閱讀精簡版本歷史"], diff: ["Compare unrecorded changes", "比較尚未記錄的變動"],
  blame: ["Trace a line through history", "追查每行修改來源"], restore: ["Recover recorded file content", "還原已記錄的檔案內容"],
  "final-history": ["Investigate and repair history", "調查並修復版本歷史"], branch: ["Create an independent work path", "建立獨立工作路線"],
  switch: ["Move HEAD between branches", "讓 HEAD 在分支間移動"], "feature-complete": ["Record work on a feature branch", "在功能分支建立版本"],
  merge: ["Bring separate histories together", "讓不同版本路線重新匯合"], "final-branching": ["Complete a branching workflow", "完成分支開發與合併流程"],
  "remote-add": ["Connect a remote repository", "連結遠端儲存庫"], fetch: ["Inspect remote progress safely", "安全取得遠端進度"],
  pull: ["Integrate remote progress", "整合遠端最新進度"], push: ["Share local commits", "分享本機版本"],
  "final-remote": ["Complete a collaboration cycle", "完成一次遠端協作循環"], stash: ["Set unfinished work aside", "暫時收起未完成工作"],
  tag: ["Mark an important version", "標記重要版本"], rebase: ["Rebuild a clean history base", "重新整理版本基底"],
  reflog: ["Trace local HEAD movement", "追查本機 HEAD 足跡"], "final-advanced": ["Protect and recover local history", "整理並找回本機歷史"],
  rm: ["Record a file removal", "記錄檔案移除"], "rm-cached": ["Separate local files from tracking", "保留本機檔案並停止追蹤"],
  "branch-delete": ["Remove an obsolete branch pointer", "移除不再需要的分支指標"], "tag-delete": ["Remove an obsolete version marker", "移除過期版本標記"],
  "remote-remove": ["Disconnect an unused remote", "移除不再使用的遠端設定"], revert: ["Undo safely without erasing history", "不抹除歷史地安全撤銷"],
  "final-cleanup": ["Clean up without losing history", "在保留歷史下安全整理專案"],
};
const makeSteps = (number, key, syntax) => {
  const definitions = keySteps[key] || [[`完成 ${syntax}`, key]];
  return definitions.map(([label, teachingKey]) => ({
    label,
    check: (action) => action?.success && action.teachingKey === teachingKey,
  }));
};

export const challenges = entries.map(([no, chapter, en, zh, syntax, key, summaryEn, summaryZh]) => {
  const final = finalNumbers.has(no);
  const level = no <= 5 ? "Beginner" : no <= 20 ? "Intermediate" : "Advanced";
  const difficulty = final ? "Hard" : no <= 8 ? "Easy" : "Normal";
  return {
    id: `c${String(no).padStart(2, "0")}`,
    no,
    chapter,
    final,
    type: "terminal",
    title: { en, zh },
    difficulty,
    level,
    xp: final ? 150 : no > 20 ? 100 : 50,
    learningGoal: syntax,
    learningConcept: { en: concepts[key]?.[0] || "Understand the next Git state", zh: concepts[key]?.[1] || "理解下一個 Git 狀態" },
    summary: { en: summaryEn, zh: summaryZh },
    task: { zh: `${careerStory[chapter]}${tasks[no] || summaryZh}` },
    story: { zh: `${careerStory[chapter]}${summaryZh}觀察右側 Git 視覺化的變化，理解每一步真正改變了什麼。` },
    hints: [
      `概念提示：${summaryZh}`,
      `指令提示：${rootCommand(syntax)}`,
      `完整語法：${syntax}`,
    ],
    seed: seeds[no] || { initialized: true },
    steps: makeSteps(no, key, syntax),
    editorial: {
      intro: {
        title: "新進工程師的 Git 入職日誌",
        whatHappened: "還沒有任何動作。輸入下方指令後，這裡會逐步說明每個變化。",
        whyItMatters: "右側的工作流程、分支圖與時間軸，是你判斷下一步的依據。",
        misconception: "先觀察 Git 狀態的位置變化，再決定要輸入的指令。",
      },
      actions: {},
    },
  };
});

export const totalXp = challenges.reduce((sum, challenge) => sum + challenge.xp, 0);
export const chapterFor = (id) => chapters.find((chapter) => chapter.id === id);
