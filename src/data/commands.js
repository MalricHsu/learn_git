// =====================================================================
// Git Reference content — every command is a full editorial article.
// =====================================================================

export const categories = [
  { id: "start", en: "Getting Started", zh: "開始使用" },
  { id: "basic", en: "Basic Commands", zh: "基礎指令" },
  { id: "branch", en: "Branch Management", zh: "分支管理" },
  { id: "remote", en: "Remote Repository", zh: "遠端儲存庫" },
  { id: "history", en: "History", zh: "歷史紀錄" },
  { id: "advanced", en: "Advanced", zh: "進階操作" },
];

// The three-stage mental model, reused across workflow diagrams.
const STAGES = [
  { en: "Working Directory", zh: "工作目錄" },
  { en: "Staging Area", zh: "暫存區" },
  { en: "Repository", zh: "儲存庫" },
];
const wf = (activeIndex) => STAGES.map((s, i) => ({ ...s, active: i === activeIndex }));

export const commands = [
  // ---------------------------------------------------------------- init
  {
    slug: "git-init",
    name: "git init",
    category: "start",
    tagline: { en: "Create a repository", zh: "建立儲存庫" },
    reads: "3 min",
    what: {
      en: "git init turns an ordinary folder into a Git repository. It creates a hidden .git directory where every version of your project will live.",
      zh: "git init 會把一個普通的資料夾變成 Git 儲存庫。它會建立一個隱藏的 .git 資料夾，你專案的每一個版本都會被保存在裡面。",
    },
    why: {
      en: "Before Git can track a single change, it needs a place to store history. init is the very first step of every project you start from scratch — the blank first page of the notebook.",
      zh: "在 Git 能追蹤任何變動之前，它需要一個地方存放歷史。init 是你從零開始的每個專案的第一步——筆記本的空白第一頁。",
    },
    workflow: wf(2),
    workflowNote: { en: "init prepares the Repository so it can receive history.", zh: "init 讓「儲存庫」準備好接收歷史紀錄。" },
    syntax: [
      { code: "git init", note: { en: "initialize in the current folder", zh: "在目前資料夾初始化" } },
      { code: "git init <name>", note: { en: "create a new folder and initialize it", zh: "建立新資料夾並初始化" } },
    ],
    example: [
      { t: "cmd", parts: [["cmd", "git"], ["", " init"]] },
    ],
    output: "Initialized empty Git repository in /project/.git/",
    mistakes: [
      { en: "Running init inside an existing repo — creating a repo within a repo.", zh: "在既有儲存庫裡再次 init，變成儲存庫中的儲存庫。" },
      { en: "Forgetting that init alone tracks nothing; you still need git add.", zh: "以為 init 就會開始追蹤，其實還需要 git add。" },
    ],
    related: ["git-status", "git-add", "git-clone"],
  },

  // ---------------------------------------------------------------- clone
  {
    slug: "git-clone",
    name: "git clone",
    category: "start",
    tagline: { en: "Copy a remote repository", zh: "複製遠端儲存庫" },
    reads: "2 min",
    what: {
      en: "git clone downloads an existing repository — all its files and full history — from a remote host such as GitHub onto your machine.",
      zh: "git clone 會從 GitHub 這類遠端主機，把一個既有的儲存庫（所有檔案與完整歷史）下載到你的電腦。",
    },
    why: {
      en: "You rarely start alone. Cloning is how you join a project that already exists, getting an exact copy plus a link back to the origin.",
      zh: "你很少從零開始。clone 讓你加入一個已存在的專案，取得完整副本，並保留與來源的連結。",
    },
    workflow: wf(2),
    syntax: [
      { code: "git clone <url>", note: { en: "clone into a new folder", zh: "複製到新資料夾" } },
      { code: "git clone <url> <dir>", note: { en: "clone into a chosen folder name", zh: "指定資料夾名稱" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " clone "], ["str", "https://github.com/you/app.git"]] }],
    output: "Cloning into 'app'...\nremote: Counting objects: 100% done.\nReceiving objects: 100% (128/128), done.",
    mistakes: [
      { en: "Cloning into a folder that already contains files.", zh: "複製到已經有檔案的資料夾。" },
      { en: "Confusing clone (once, to start) with pull (repeatedly, to update).", zh: "把 clone（一次性開始）跟 pull（重複更新）搞混。" },
    ],
    related: ["git-init", "git-pull", "git-fetch"],
  },

  // ---------------------------------------------------------------- status
  {
    slug: "git-status",
    name: "git status",
    category: "basic",
    tagline: { en: "See what changed", zh: "查看目前狀態" },
    reads: "2 min",
    what: {
      en: "git status reports the state of your working directory and staging area: which files are new, modified, or ready to commit.",
      zh: "git status 會回報你的工作目錄與暫存區的狀態：哪些檔案是新增、被修改，或已準備好提交。",
    },
    why: {
      en: "It is the command you run most. Before every add or commit, status tells you exactly where you stand — no surprises.",
      zh: "這是你用得最多的指令。在每次 add 或 commit 之前，status 都會告訴你目前確切的位置——不會有意外。",
    },
    workflow: wf(0),
    workflowNote: { en: "status reads across all three stages and summarizes them.", zh: "status 會橫跨三個階段並做出摘要。" },
    syntax: [
      { code: "git status", note: { en: "full, human-readable report", zh: "完整、易讀的報告" } },
      { code: "git status -s", note: { en: "short one-line-per-file format", zh: "每個檔案一行的精簡格式" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " status"]] }],
    output: "On branch main\nChanges to be committed:\n  new file:   index.html\nUntracked files:\n  app.js",
    mistakes: [
      { en: "Ignoring the “Untracked files” section and assuming everything is saved.", zh: "忽略「Untracked files」區塊，以為所有東西都存好了。" },
    ],
    related: ["git-add", "git-commit", "git-restore"],
  },

  // ---------------------------------------------------------------- add
  {
    slug: "git-add",
    name: "git add",
    category: "basic",
    tagline: { en: "Stage your changes", zh: "把變動加入暫存" },
    reads: "3 min",
    what: {
      en: "git add moves changes from your working directory into the staging area — a draft of the next commit that you assemble deliberately.",
      zh: "git add 會把變動從工作目錄移到暫存區——這是你刻意組合出來的、下一次提交的草稿。",
    },
    why: {
      en: "Git lets you choose exactly what goes into each commit. Staging is that choice: you decide which changes belong together before you record them.",
      zh: "Git 讓你精確決定每次提交要包含什麼。暫存就是這個「選擇」：在記錄之前，你決定哪些變動該放在一起。",
    },
    workflow: wf(1),
    workflowNote: { en: "add carries files from the Working Directory into the Staging Area.", zh: "add 把檔案從「工作目錄」帶進「暫存區」。" },
    syntax: [
      { code: "git add <file>", note: { en: "stage one file", zh: "暫存單一檔案" } },
      { code: "git add .", note: { en: "stage everything in this folder", zh: "暫存此資料夾內的所有變動" } },
      { code: "git add -A", note: { en: "stage all changes, including deletions", zh: "暫存所有變動（含刪除）" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " add "], ["path", "."]] }],
    output: "(no output — a silent success is a good sign)",
    mistakes: [
      { en: "Using git add . and accidentally staging files you did not mean to.", zh: "用 git add . 時，不小心把不想提交的檔案也加進去。" },
      { en: "Thinking add saves your work — it only stages; commit saves.", zh: "以為 add 就是儲存，其實它只是暫存，真正儲存的是 commit。" },
    ],
    related: ["git-status", "git-commit", "git-reset"],
  },

  // ---------------------------------------------------------------- commit
  {
    slug: "git-commit",
    name: "git commit",
    category: "basic",
    tagline: { en: "Record a snapshot", zh: "記錄一個版本" },
    reads: "4 min",
    what: {
      en: "git commit permanently records everything in the staging area as a new snapshot in your project's history, stamped with a message, author, and time.",
      zh: "git commit 會把暫存區裡的所有內容，永久記錄成專案歷史中的一個新版本，並附上訊息、作者與時間。",
    },
    why: {
      en: "Commits are the save points of your project. A good message is a note to your future self explaining why a change was made — the paper trail that makes history readable.",
      zh: "提交是專案的存檔點。一則好的訊息是寫給未來自己的筆記，說明「為什麼」要改——讓歷史變得可讀的紙本紀錄。",
    },
    workflow: wf(2),
    workflowNote: { en: "commit moves the staged snapshot into the Repository for good.", zh: "commit 把暫存的快照永久移進「儲存庫」。" },
    syntax: [
      { code: 'git commit -m "message"', note: { en: "commit with an inline message", zh: "直接附上訊息提交" } },
      { code: "git commit", note: { en: "open an editor to write a longer message", zh: "開啟編輯器撰寫較長訊息" } },
      { code: 'git commit -am "message"', note: { en: "stage tracked files and commit in one step", zh: "同時暫存已追蹤檔案並提交" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " commit "], ["flag", "-m"], ["", " "], ["str", '"Add login form"']] }],
    output: "[main 9f3a1c0] Add login form\n 1 file changed, 24 insertions(+)",
    mistakes: [
      { en: 'Vague messages like "fix" or "update" that tell your future self nothing.', zh: '寫出像「fix」「update」這種模糊訊息，未來的自己看不懂。' },
      { en: "Committing with nothing staged and wondering why it says 'nothing to commit'.", zh: "在沒有暫存任何東西時提交，然後困惑為何顯示 nothing to commit。" },
    ],
    related: ["git-add", "git-log", "git-push"],
  },

  // ---------------------------------------------------------------- log
  {
    slug: "git-log",
    name: "git log",
    category: "history",
    tagline: { en: "Read the history", zh: "閱讀歷史紀錄" },
    reads: "3 min",
    what: {
      en: "git log lists commits in reverse chronological order, showing who changed what and when — the archive of your project's story.",
      zh: "git log 會以時間倒序列出提交，顯示誰在何時改了什麼——你專案故事的檔案庫。",
    },
    why: {
      en: "History is only useful if you can read it. log lets you retrace decisions, find when a bug appeared, and understand how the code got to today.",
      zh: "歷史只有在能被閱讀時才有用。log 讓你回溯決策、找出 bug 是何時出現的，並理解程式碼是如何走到今天的。",
    },
    workflow: wf(2),
    syntax: [
      { code: "git log", note: { en: "full commit list", zh: "完整提交列表" } },
      { code: "git log --oneline", note: { en: "one compact line per commit", zh: "每個提交精簡成一行" } },
      { code: "git log --graph --all", note: { en: "draw the branch structure", zh: "畫出分支結構" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " log "], ["flag", "--oneline"]] }],
    output: "9f3a1c0 Add login form\n3b71e02 Set up project structure\n1a0c9d4 Initial commit",
    mistakes: [
      { en: "Getting stuck in the log pager — press q to quit.", zh: "卡在 log 的分頁畫面出不來——按 q 就能離開。" },
    ],
    related: ["git-commit", "git-reset", "git-restore"],
  },

  // ---------------------------------------------------------------- branch
  {
    slug: "git-branch",
    name: "git branch",
    category: "branch",
    tagline: { en: "Work in parallel", zh: "平行開發" },
    reads: "3 min",
    what: {
      en: "A branch is a movable pointer to a line of work. git branch lists your branches or creates a new one so you can develop a feature without touching main.",
      zh: "分支是指向某條開發線的可移動指標。git branch 會列出你的分支，或建立新分支，讓你能在不動 main 的情況下開發功能。",
    },
    why: {
      en: "Branches let a team try ideas in isolation. Break something on a branch and main stays safe — merge only when it is ready.",
      zh: "分支讓團隊能在隔離環境裡嘗試想法。在分支上弄壞東西，main 依然安全——準備好了再合併。",
    },
    workflow: wf(2),
    syntax: [
      { code: "git branch", note: { en: "list all branches", zh: "列出所有分支" } },
      { code: "git branch <name>", note: { en: "create a branch", zh: "建立分支" } },
      { code: "git branch -d <name>", note: { en: "delete a merged branch", zh: "刪除已合併的分支" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " branch "], ["path", "feature/login"]] }],
    output: "* main\n  feature/login",
    mistakes: [
      { en: "Creating a branch but forgetting to switch to it before working.", zh: "建立分支後忘記切換過去就開始工作。" },
    ],
    related: ["git-switch", "git-merge", "git-log"],
  },

  // ---------------------------------------------------------------- switch
  {
    slug: "git-switch",
    name: "git switch",
    category: "branch",
    tagline: { en: "Move between branches", zh: "切換分支" },
    reads: "2 min",
    what: {
      en: "git switch changes which branch you are working on. The modern, clearer replacement for git checkout when moving between branches.",
      zh: "git switch 會改變你目前所在的分支。它是切換分支時，比 git checkout 更清楚的現代替代指令。",
    },
    why: {
      en: "Your working files reflect one branch at a time. Switching updates them to match the branch you move to, so you always edit the right version.",
      zh: "你的工作檔案一次只反映一個分支。切換會把它們更新成目標分支的內容，讓你永遠在正確的版本上編輯。",
    },
    workflow: wf(0),
    syntax: [
      { code: "git switch <name>", note: { en: "move to an existing branch", zh: "切換到既有分支" } },
      { code: "git switch -c <name>", note: { en: "create a branch and switch to it", zh: "建立並切換到新分支" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " switch "], ["flag", "-c"], ["", " "], ["path", "feature/login"]] }],
    output: "Switched to a new branch 'feature/login'",
    mistakes: [
      { en: "Switching with uncommitted changes and losing track of them.", zh: "帶著未提交的變動切換，結果找不到它們。" },
    ],
    related: ["git-branch", "git-merge", "git-restore"],
  },

  // ---------------------------------------------------------------- merge
  {
    slug: "git-merge",
    name: "git merge",
    category: "branch",
    tagline: { en: "Combine two branches", zh: "合併分支" },
    reads: "4 min",
    what: {
      en: "git merge joins the history of another branch into your current one, bringing its commits together so both lines of work become one.",
      zh: "git merge 會把另一個分支的歷史併入你目前的分支，讓兩條開發線合而為一。",
    },
    why: {
      en: "Feature work eventually has to rejoin the main line. Merge is how a finished branch delivers its changes back — sometimes cleanly, sometimes asking you to resolve conflicts.",
      zh: "功能開發最終要回到主線。merge 是完成的分支把變動送回去的方式——有時很乾淨，有時需要你解決衝突。",
    },
    workflow: wf(2),
    syntax: [
      { code: "git merge <branch>", note: { en: "merge a branch into the current one", zh: "把某分支併入目前分支" } },
      { code: "git merge --no-ff <branch>", note: { en: "always create a merge commit", zh: "一律建立合併提交" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " merge "], ["path", "feature/login"]] }],
    output: "Updating 3b71e02..9f3a1c0\nFast-forward\n index.html | 24 ++++++++",
    mistakes: [
      { en: "Panicking at a merge conflict — Git marks the spot; you just choose what to keep.", zh: "遇到合併衝突就慌張——其實 Git 已標出位置，你只要選擇保留什麼。" },
      { en: "Merging into the wrong branch because you did not check where HEAD is.", zh: "沒確認 HEAD 在哪，結果合併到錯的分支。" },
    ],
    related: ["git-branch", "git-switch", "git-rebase"],
  },

  // ---------------------------------------------------------------- rebase
  {
    slug: "git-rebase",
    name: "git rebase",
    category: "advanced",
    tagline: { en: "Rewrite a cleaner history", zh: "重整歷史" },
    reads: "5 min",
    what: {
      en: "git rebase moves your branch's commits so they begin from the tip of another branch, producing a straight, linear history instead of a merge bubble.",
      zh: "git rebase 會把你分支上的提交搬到另一個分支的最新位置之後，產生一條筆直、線性的歷史，而不是合併的分岔。",
    },
    why: {
      en: "A linear history is easier to read. Rebase replays your work on top of the latest code, as if you had started from there all along.",
      zh: "線性的歷史更好讀。rebase 會把你的工作重新播放在最新程式碼之上，彷彿你一開始就是從那裡出發。",
    },
    workflow: wf(2),
    syntax: [
      { code: "git rebase <branch>", note: { en: "replay current work onto another branch", zh: "把目前工作重播到另一分支之上" } },
      { code: "git rebase -i HEAD~3", note: { en: "interactively edit the last 3 commits", zh: "互動式編修最近 3 個提交" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " rebase "], ["path", "main"]] }],
    output: "Successfully rebased and updated refs/heads/feature.",
    mistakes: [
      { en: "Rebasing commits you already pushed and shared — it rewrites history others rely on.", zh: "對已推送、已分享的提交做 rebase——那會改寫別人依賴的歷史。" },
    ],
    related: ["git-merge", "git-log", "git-reset"],
  },

  // ---------------------------------------------------------------- fetch
  {
    slug: "git-fetch",
    name: "git fetch",
    category: "remote",
    tagline: { en: "Download without merging", zh: "只抓取不合併" },
    reads: "2 min",
    what: {
      en: "git fetch downloads new commits from the remote but does not change your working files. It updates your knowledge of the remote, safely.",
      zh: "git fetch 會從遠端下載新的提交，但不會改動你的工作檔案。它安全地更新你對遠端的了解。",
    },
    why: {
      en: "Sometimes you want to see what others have done before merging it in. Fetch lets you look first, then decide.",
      zh: "有時你想在合併之前，先看看別人做了什麼。fetch 讓你先看、再決定。",
    },
    workflow: wf(2),
    syntax: [{ code: "git fetch", note: { en: "download from the default remote", zh: "從預設遠端下載" } }],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " fetch "], ["path", "origin"]] }],
    output: "From github.com:you/app\n   3b71e02..9f3a1c0  main -> origin/main",
    mistakes: [
      { en: "Expecting fetch to update your files — that's what pull does.", zh: "以為 fetch 會更新你的檔案——那是 pull 的工作。" },
    ],
    related: ["git-pull", "git-merge", "git-clone"],
  },

  // ---------------------------------------------------------------- pull
  {
    slug: "git-pull",
    name: "git pull",
    category: "remote",
    tagline: { en: "Fetch and merge", zh: "抓取並更新" },
    reads: "2 min",
    what: {
      en: "git pull is fetch and merge in one step: it downloads new commits from the remote and immediately integrates them into your current branch.",
      zh: "git pull 是 fetch 加 merge 的合體：它下載遠端的新提交，並立即把它們整合進你目前的分支。",
    },
    why: {
      en: "Before you start a session, you pull to catch up with your teammates so you are building on the latest work, not yesterday's.",
      zh: "開始工作前，你會 pull 來跟上隊友的進度，確保你是在最新的成果上開發，而不是昨天的。",
    },
    workflow: wf(0),
    syntax: [
      { code: "git pull", note: { en: "fetch + merge the tracked branch", zh: "抓取並合併所追蹤的分支" } },
      { code: "git pull --rebase", note: { en: "replay your commits on top instead of merging", zh: "改用 rebase 而非 merge" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " pull "], ["path", "origin"], ["", " "], ["path", "main"]] }],
    output: "Updating 3b71e02..9f3a1c0\nFast-forward\n README.md | 2 +-",
    mistakes: [
      { en: "Pulling with local uncommitted changes and hitting an unexpected conflict.", zh: "帶著本地未提交的變動 pull，撞上意料外的衝突。" },
    ],
    related: ["git-fetch", "git-push", "git-merge"],
  },

  // ---------------------------------------------------------------- push
  {
    slug: "git-push",
    name: "git push",
    category: "remote",
    tagline: { en: "Share your commits", zh: "推送到遠端" },
    reads: "3 min",
    what: {
      en: "git push uploads your local commits to the remote repository, making your work visible to everyone else on the project.",
      zh: "git push 會把你本地的提交上傳到遠端儲存庫，讓專案裡的其他人都能看到你的成果。",
    },
    why: {
      en: "Committing saves work on your machine; pushing publishes it. Push is how the team's shared history moves forward.",
      zh: "提交是把成果存在你的電腦上；推送則是把它公開。push 是團隊共享歷史往前推進的方式。",
    },
    workflow: wf(2),
    syntax: [
      { code: "git push", note: { en: "push the current branch", zh: "推送目前分支" } },
      { code: "git push -u origin <branch>", note: { en: "push and set upstream the first time", zh: "首次推送並設定追蹤" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " push "], ["flag", "-u"], ["", " "], ["path", "origin"], ["", " "], ["path", "main"]] }],
    output: "To github.com:you/app.git\n   3b71e02..9f3a1c0  main -> main",
    mistakes: [
      { en: "Trying to push before committing — push only sends commits.", zh: "還沒 commit 就想 push——push 只會送出已提交的內容。" },
      { en: "Force-pushing over a shared branch and erasing others' work.", zh: "對共享分支強制推送，抹掉別人的成果。" },
    ],
    related: ["git-commit", "git-pull", "git-fetch"],
  },

  // ---------------------------------------------------------------- stash
  {
    slug: "git-stash",
    name: "git stash",
    category: "advanced",
    tagline: { en: "Shelve work for later", zh: "暫時收起變動" },
    reads: "3 min",
    what: {
      en: "git stash tucks away your uncommitted changes and returns your working directory to a clean state, so you can come back to them later.",
      zh: "git stash 會把你未提交的變動收起來，讓工作目錄回到乾淨狀態，之後再回來繼續。",
    },
    why: {
      en: "An urgent fix arrives while you are mid-task. Stash lets you set unfinished work aside without committing something half-done.",
      zh: "任務做到一半，緊急修復突然來了。stash 讓你先把未完成的工作放到一邊，不用勉強提交半成品。",
    },
    workflow: wf(0),
    syntax: [
      { code: "git stash", note: { en: "shelve current changes", zh: "收起目前變動" } },
      { code: "git stash pop", note: { en: "reapply and remove the latest stash", zh: "取回並移除最新的暫存" } },
      { code: "git stash list", note: { en: "see everything you've stashed", zh: "查看所有暫存項目" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " stash"]] }],
    output: "Saved working directory and index state WIP on main: 9f3a1c0 Add login form",
    mistakes: [
      { en: "Forgetting a stash exists and losing track of unfinished work.", zh: "忘記還有一個 stash，未完成的工作就此消失在記憶裡。" },
    ],
    related: ["git-restore", "git-switch", "git-reset"],
  },

  // ---------------------------------------------------------------- restore
  {
    slug: "git-restore",
    name: "git restore",
    category: "advanced",
    tagline: { en: "Undo changes to files", zh: "還原檔案變動" },
    reads: "3 min",
    what: {
      en: "git restore discards changes in your working directory or unstages files — the modern, focused way to undo edits to specific files.",
      zh: "git restore 會捨棄工作目錄裡的變動，或把檔案移出暫存區——是還原特定檔案編輯的現代、專注做法。",
    },
    why: {
      en: "You edited a file and want it back the way it was. Restore reverts precisely, without touching the rest of your work.",
      zh: "你改了一個檔案，想把它變回原樣。restore 精準地還原，不會動到你其他的工作。",
    },
    workflow: wf(0),
    syntax: [
      { code: "git restore <file>", note: { en: "discard working changes to a file", zh: "捨棄某檔案的工作變動" } },
      { code: "git restore --staged <file>", note: { en: "unstage a file, keep the changes", zh: "把檔案移出暫存，保留變動" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " restore "], ["path", "index.html"]] }],
    output: "(no output — the file returns to its last committed state)",
    mistakes: [
      { en: "Discarding changes with restore that you actually wanted to keep — there is no undo.", zh: "用 restore 捨棄了其實想保留的變動——這一步沒有回頭路。" },
    ],
    related: ["git-status", "git-reset", "git-stash"],
  },

  // ---------------------------------------------------------------- reset
  {
    slug: "git-reset",
    name: "git reset",
    category: "advanced",
    tagline: { en: "Move the branch pointer", zh: "回退版本" },
    reads: "5 min",
    what: {
      en: "git reset moves your branch back to an earlier commit. Depending on the mode, it can unstage files, keep your edits, or discard them entirely.",
      zh: "git reset 會把你的分支移回較早的提交。依模式不同，它可以把檔案移出暫存、保留你的編輯，或完全捨棄它們。",
    },
    why: {
      en: "Sometimes you commit too early or stage the wrong thing. Reset rewinds the branch so you can redo it — powerful, and worth respecting.",
      zh: "有時你太早提交，或暫存了錯的東西。reset 會倒轉分支讓你重來——強大，值得謹慎對待。",
    },
    workflow: wf(2),
    syntax: [
      { code: "git reset <file>", note: { en: "unstage a file (default --mixed)", zh: "把檔案移出暫存（預設 --mixed）" } },
      { code: "git reset --soft HEAD~1", note: { en: "undo last commit, keep it staged", zh: "撤銷上一次提交，內容仍在暫存" } },
      { code: "git reset --hard HEAD~1", note: { en: "undo last commit and discard changes", zh: "撤銷上一次提交並丟棄變動" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " reset "], ["flag", "--soft"], ["", " "], ["path", "HEAD~1"]] }],
    output: "(HEAD moves back one commit; your staging area keeps the changes)",
    mistakes: [
      { en: "Using --hard without realizing it permanently deletes uncommitted work.", zh: "使用 --hard 時沒意識到它會永久刪除未提交的工作。" },
      { en: "Confusing reset (moves the branch) with restore (edits files).", zh: "把 reset（移動分支）和 restore（還原檔案）搞混。" },
    ],
    related: ["git-restore", "git-log", "git-commit"],
  },
];

// ---------------------------------------------------------------- Vocabulary
export const vocabulary = [
  { en: "Repository", zh: "儲存庫", def: { en: "The full project plus its entire history.", zh: "整個專案加上它的完整歷史。" } },
  { en: "Branch", zh: "分支", def: { en: "A movable pointer to a line of development.", zh: "指向某條開發線的可移動指標。" } },
  { en: "Commit", zh: "提交", def: { en: "A recorded snapshot of your project.", zh: "專案某個時間點的快照紀錄。" } },
  { en: "HEAD", zh: "目前版本", def: { en: "A pointer to the commit you're currently on.", zh: "指向你目前所在提交的指標。" } },
  { en: "Clone", zh: "複製", def: { en: "A full local copy of a remote repository.", zh: "遠端儲存庫的完整本地副本。" } },
  { en: "Fetch", zh: "抓取", def: { en: "Download remote changes without merging.", zh: "下載遠端變動但不合併。" } },
  { en: "Push", zh: "推送", def: { en: "Upload your commits to the remote.", zh: "把你的提交上傳到遠端。" } },
  { en: "Pull", zh: "拉取更新", def: { en: "Fetch remote changes and merge them in.", zh: "抓取遠端變動並合併進來。" } },
  { en: "Merge", zh: "合併", def: { en: "Combine another branch's history into yours.", zh: "把另一分支的歷史併入你的分支。" } },
  { en: "Staging Area", zh: "暫存區", def: { en: "The draft of your next commit.", zh: "你下一次提交的草稿。" } },
];

export const bySlug = (slug) => commands.find((c) => c.slug === slug);
export const byCategory = (id) => commands.filter((c) => c.category === id);
