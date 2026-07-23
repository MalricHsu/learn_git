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
  { id: "danger", en: "Danger Zone", zh: "危險操作" },
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
    scenario: {
      en: "Use git init when a folder already contains work that you now want Git to manage, or when you are starting a local project from an empty directory.",
      zh: "當你已經有一個放著程式碼、筆記或設計稿的資料夾，現在想開始記錄它的版本時，就會使用 git init。從空資料夾開始新的本機專案時也一樣；但如果專案已經存在 GitHub，通常應該使用 git clone，而不是再次初始化。",
    },
    internals: {
      en: "Git creates a hidden .git directory containing the object database, references, configuration, and the information needed to identify the current branch.",
      zh: "執行後，Git 會在目前資料夾裡建立隱藏的 .git 目錄。裡面保存物件資料庫、分支指標、HEAD 與儲存庫設定；你的工作檔案不會被搬動，也還沒有任何版本被建立。刪除 .git 才會移除這個資料夾的 Git 歷史。",
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
    outputNote: {
      en: "This confirms that the repository metadata was created. It does not mean your files are tracked or committed yet.",
      zh: "這行訊息代表 Git 已成功建立儲存庫的內部資料，但不代表檔案已被追蹤，也不代表已經產生 Commit。接下來可以先用 git status 查看狀態，再使用 git add 與 git commit 建立第一個版本。",
    },
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

  // ---------------------------------------------------------------- diff
  {
    slug: "git-diff",
    name: "git diff",
    category: "history",
    tagline: { en: "See the exact changes", zh: "查看實際差異" },
    reads: "3 min",
    what: {
      en: "git diff shows the line-by-line difference between what you have now and what Git already recorded.",
      zh: "git diff 會逐行列出「你現在的內容」和「Git 已經記錄的內容」之間的差別。",
    },
    why: {
      en: "status tells you which files changed; diff tells you what actually changed inside them. It is the last check before a commit.",
      zh: "status 只告訴你「哪些檔案變了」,diff 才告訴你「裡面到底改了什麼」。它是提交前的最後一道確認,能擋下忘了刪的測試碼或誤貼的內容。",
    },
    scenario: {
      en: "Run it before staging or committing, and whenever you cannot remember what you changed.",
      zh: "在 git add 或 git commit 之前執行,或是當你回到一個放了幾天的專案、想不起來改過什麼的時候。也很適合在送出 PR 前,先自己審一遍。",
    },
    internals: {
      en: "By default Git compares the working directory with the staging area; --staged compares the staging area with the last commit.",
      zh: "預設情況下,Git 比較的是「工作目錄」與「暫存區」。如果加上 --staged,比較的則是「暫存區」與「上一次提交」。所以 git add 之後再打 git diff 常常一片空白——因為變動已經移到暫存區了,這時要用 --staged 才看得到。",
    },
    workflow: wf(0),
    workflowNote: { en: "diff reads across stages; it never changes them.", zh: "diff 只是跨層比對,不會改動任何一層。" },
    syntax: [
      { code: "git diff", note: { en: "working directory vs staging area", zh: "工作目錄 vs 暫存區" } },
      { code: "git diff --staged", note: { en: "staging area vs last commit", zh: "暫存區 vs 上一次提交" } },
      { code: "git diff <file>", note: { en: "limit the comparison to one file", zh: "只比較單一檔案" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " diff "], ["path", "app.js"]] }],
    output: "--- a/app.js\n+++ b/app.js\n@@ -12,3 +12,4 @@\n   const user = getUser();\n+  console.log(user);",
    outputNote: {
      en: "Lines starting with + were added, lines with - were removed.",
      zh: "開頭是 + 的是新增的行,- 是被刪掉的行。像上面這行 console.log,就是典型「差點被提交進去」的除錯殘留。",
    },
    mistakes: [
      { en: "Expecting output after git add — staged changes need --staged.", zh: "已經 git add 之後還打 git diff,看到空白就以為沒改;那時要用 --staged。" },
      { en: "Thinking diff can undo changes; it only displays them.", zh: "以為 diff 可以還原變更;它只負責顯示,還原要用 restore。" },
    ],
    related: ["git-status", "git-add", "git-restore"],
  },

  // ---------------------------------------------------------------- blame
  {
    slug: "git-blame",
    name: "git blame",
    category: "history",
    tagline: { en: "Trace each line's origin", zh: "追查每一行的來歷" },
    reads: "3 min",
    what: {
      en: "git blame annotates every line of a file with the commit, author and date that last touched it.",
      zh: "git blame 會在檔案的每一行前面,標註「最後修改這行的提交、作者與時間」。",
    },
    why: {
      en: "When you find puzzling code, the commit behind it usually explains why it exists. blame turns a line into a story.",
      zh: "當你看到一段看不懂、不敢刪的程式碼,背後那個提交通常就寫著理由。blame 把一行程式碼變回一個決策紀錄——名字雖然叫「怪罪」,實際用途是「理解背景」。",
    },
    scenario: {
      en: "Use it before changing unfamiliar code, or when tracking down when a bug was introduced.",
      zh: "適合用在你要動一段不熟悉的程式碼之前,先搞懂它為什麼長這樣;也常用來追查某個 bug 是從哪一次提交開始出現的。",
    },
    internals: {
      en: "Git walks the file's history backwards and assigns each line to the most recent commit that changed it.",
      zh: "Git 會沿著這個檔案的歷史往回走,判斷每一行最後是在哪一次提交被改動的,再把那次提交的 hash、作者、時間標在行首。它讀的是既有歷史,完全不會修改任何內容。",
    },
    workflow: wf(2),
    workflowNote: { en: "blame reads from the Repository only.", zh: "blame 只讀取「儲存庫」裡的歷史。" },
    syntax: [
      { code: "git blame <file>", note: { en: "annotate every line", zh: "標註整個檔案" } },
      { code: "git blame -L 10,20 <file>", note: { en: "only lines 10 to 20", zh: "只看第 10 到 20 行" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " blame "], ["path", "app.js"]] }],
    output: "1a0c9d4 (Ada  2024-03-02 10:14) const user = getUser();\n3b71e02 (Lin  2024-03-08 16:02)   console.log(user);",
    outputNote: {
      en: "Each line begins with the commit that last changed it — look that commit up to find the reasoning.",
      zh: "每行開頭就是最後改動它的提交 hash。拿那個 hash 去查 git log,通常就能看到當初為什麼這樣寫。",
    },
    mistakes: [
      { en: "Treating it as a way to assign fault rather than gather context.", zh: "把它當成「找戰犯」的工具,而不是理解脈絡的線索。" },
      { en: "Blaming a file after a reformat, which rewrites every line's author.", zh: "在程式碼被整批重新排版後 blame,結果每一行都指向排版那次提交。" },
    ],
    related: ["git-log", "git-diff", "git-commit"],
  },

  // ---------------------------------------------------------------- remote
  {
    slug: "git-remote",
    name: "git remote",
    category: "remote",
    tagline: { en: "Manage remote connections", zh: "管理遠端連線" },
    reads: "3 min",
    what: {
      en: "git remote lists, adds and removes the nicknames your repository uses for remote locations such as GitHub.",
      zh: "git remote 用來列出、新增、移除「遠端位置的代號」——例如把一長串 GitHub 網址記成 origin。",
    },
    why: {
      en: "fetch, pull and push all need to know where to talk to. remote is the address book that makes those commands short.",
      zh: "fetch、pull、push 都得知道「要跟哪裡同步」。remote 就是那本通訊錄,讓你不用每次都貼完整網址,只要說 origin 就好。",
    },
    scenario: {
      en: "Use it right after git init when the project will live on GitHub, or when a project needs a second destination.",
      zh: "最常見的是 git init 之後、準備推上 GitHub 時設定 origin。專案需要第二個目的地(例如同時推到公司內部與 GitHub)時,也會再加一個代號。",
    },
    internals: {
      en: "Remotes are just entries in .git/config — a name mapped to a URL. Adding one transfers nothing.",
      zh: "遠端設定只是寫在 .git/config 裡的一組「名稱 → 網址」對應,沒有任何檔案會因此上傳或下載。真正產生傳輸的是 fetch、pull 與 push。",
    },
    workflow: wf(2),
    workflowNote: { en: "It configures how the Repository reaches the outside world.", zh: "它設定的是「儲存庫」對外的連線方式。" },
    syntax: [
      { code: "git remote -v", note: { en: "list remotes with their URLs", zh: "列出所有遠端與網址" } },
      { code: "git remote add origin <url>", note: { en: "add a remote named origin", zh: "新增名為 origin 的遠端" } },
      { code: "git remote remove <name>", note: { en: "remove a remote", zh: "移除某個遠端" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " remote add "], ["path", "origin"], ["", " "], ["str", "https://github.com/you/app.git"]] }],
    output: "(沒有輸出。設定完成後可用 git remote -v 確認。)",
    outputNote: {
      en: "Silence means success. Verify with git remote -v before your first push.",
      zh: "沒有訊息就代表設定成功。第一次 push 之前,建議先用 git remote -v 確認網址沒打錯——網址錯了要到推送時才會發現。",
    },
    mistakes: [
      { en: "Expecting remote add to upload the project; it only saves an address.", zh: "以為 remote add 就會把專案上傳,其實它只記下位址。" },
      { en: "Adding origin twice instead of updating it with set-url.", zh: "想改網址卻再 add 一次 origin,應該用 git remote set-url。" },
    ],
    related: ["git-push", "git-fetch", "git-clone"],
  },

  // ---------------------------------------------------------------- tag
  {
    slug: "git-tag",
    name: "git tag",
    category: "advanced",
    tagline: { en: "Mark an important version", zh: "標記重要版本" },
    reads: "3 min",
    what: {
      en: "git tag attaches a permanent, human-readable name such as v1.0 to a specific commit.",
      zh: "git tag 會替某個提交掛上一個永久、好記的名字,例如 v1.0。",
    },
    why: {
      en: "Commit hashes are unreadable. A tag turns '3b71e02' into 'the version we shipped in March'.",
      zh: "提交的 hash 沒有人記得住。標籤把「3b71e02」變成「三月上線的那個版本」,日後要回頭找、要回報 bug 出現在哪一版,都靠它。",
    },
    scenario: {
      en: "Tag a commit when you release, deploy, or hand a version to someone else.",
      zh: "在發布、部署,或把某個版本交付給別人時,替那個提交加上標籤。之後只要說 v1.0,團隊裡每個人指的都是同一個提交。",
    },
    internals: {
      en: "A tag is a fixed pointer to one commit. Unlike a branch, it does not move forward as new commits appear.",
      zh: "標籤是一個「固定指向某個提交」的指標。它和分支最大的差別是:分支會隨著新提交往前跑,標籤永遠釘在原地。另外,標籤預設不會隨 git push 上傳,要用 git push --tags 才會。",
    },
    workflow: wf(2),
    workflowNote: { en: "It adds a fixed pointer inside the Repository.", zh: "它在「儲存庫」裡新增一個固定的指標。" },
    syntax: [
      { code: "git tag", note: { en: "list all tags", zh: "列出所有標籤" } },
      { code: "git tag v1.0", note: { en: "tag the current commit", zh: "替目前提交加標籤" } },
      { code: "git push --tags", note: { en: "share tags with the remote", zh: "把標籤推上遠端" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " tag "], ["path", "v1.0"]] }],
    output: "(沒有輸出。用 git tag 可以列出剛建立的 v1.0。)",
    outputNote: {
      en: "Tags stay local until you push them explicitly.",
      zh: "標籤建立後只存在本機,一般的 git push 不會帶上它。想讓團隊也看到,要另外執行 git push --tags。",
    },
    mistakes: [
      { en: "Assuming a normal push uploads tags too.", zh: "以為一般 push 就會把標籤一起上傳。" },
      { en: "Using a branch where a fixed marker was needed.", zh: "需要固定標記卻用了分支,結果它隨新提交一直往前跑。" },
    ],
    related: ["git-commit", "git-push", "git-log"],
  },

  // ---------------------------------------------------------------- reflog
  {
    slug: "git-reflog",
    name: "git reflog",
    category: "advanced",
    tagline: { en: "Your local safety net", zh: "本機的救命紀錄" },
    reads: "4 min",
    what: {
      en: "git reflog lists everywhere HEAD has pointed recently — including commits that no branch points to anymore.",
      zh: "git reflog 會列出 HEAD 最近去過的每一個位置,包含那些「已經沒有任何分支指向」的提交。",
    },
    why: {
      en: "After a bad reset, a force-deleted branch or a messy rebase, work looks gone. reflog is usually where you find it again.",
      zh: "當你 reset 錯了、強制刪了分支、或 rebase 弄亂歷史,成果看起來就像憑空消失。多數情況下它並沒有真的不見——只是沒有任何指標指向它,而 reflog 記得它的位址。這是 Git 最被低估的救命工具。",
    },
    scenario: {
      en: "Run it the moment you think you lost commits, before doing anything else.",
      zh: "只要你覺得「提交好像不見了」,第一件事就是打 git reflog,不要急著做別的操作。找到那個 hash 之後,就能用 git branch <名字> <hash> 把它救回來。",
    },
    internals: {
      en: "Git records every move of HEAD in a local log. It is not shared with the remote and expires after around 90 days.",
      zh: "Git 會把 HEAD 的每一次移動都記在本機的紀錄裡。重點是:它**只存在你這台電腦**,不會隨 clone 或 push 傳給別人,而且預設約 90 天後就會被清理。所以它救得了本機的失誤,救不了別人電腦上的。",
    },
    workflow: wf(2),
    workflowNote: { en: "It reads a local log of Repository movements.", zh: "它讀的是本機記錄的「儲存庫指標移動史」。" },
    syntax: [
      { code: "git reflog", note: { en: "list recent HEAD positions", zh: "列出 HEAD 最近的位置" } },
      { code: "git branch <name> <hash>", note: { en: "revive lost work as a branch", zh: "用找到的 hash 救回成果" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " reflog"]] }],
    output: "9f2c1ab HEAD@{0}: reset: moving to HEAD~1\n3b71e02 HEAD@{1}: commit: Add login form",
    outputNote: {
      en: "The hash on the left is what you need — point a new branch at it to get the work back.",
      zh: "左邊那串 hash 就是你要的東西。例如上面的 3b71e02 是被 reset 掉的提交,執行 git branch rescue 3b71e02 就能把它救回成一條分支。",
    },
    mistakes: [
      { en: "Expecting reflog to recover work that was never committed.", zh: "以為 reflog 什麼都救得回來——從未提交過的修改它幫不上忙。" },
      { en: "Assuming teammates can use your reflog; it is local only.", zh: "以為隊友也能查到你的 reflog;它只存在你的電腦。" },
    ],
    related: ["git-reset", "git-branch", "git-log"],
  },

  // ---------------------------------------------------------------- rm
  {
    slug: "git-rm",
    name: "git rm",
    category: "basic",
    tagline: { en: "Delete a file, and record it", zh: "刪除檔案並記錄下來" },
    reads: "3 min",
    what: {
      en: "git rm deletes a file from your working directory and stages that deletion, so the next commit records it.",
      zh: "git rm 會把檔案從工作目錄刪掉,同時把「這個刪除動作」放進暫存區,讓下一次提交正式記錄它。",
    },
    why: {
      en: "Deleting a file in your editor removes it from disk but Git still needs to be told. git rm does both in one step.",
      zh: "在編輯器裡直接刪檔案,只是從硬碟移除,Git 還得另外被告知(要再 git add 一次)。git rm 一步完成兩件事,不容易漏掉。",
    },
    scenario: {
      en: "Use it when a tracked file is genuinely no longer part of the project.",
      zh: "適合用在某個已被追蹤的檔案確定不再屬於這個專案時。如果你只是不想再追蹤、但檔案要留著,那要用 --cached。",
    },
    internals: {
      en: "Git removes the file from disk and marks the deletion in the staging area. With --cached it only stops tracking.",
      zh: "Git 會把檔案從硬碟移除,並在暫存區記下「已刪除」。加上 --cached 則只做後半段:檔案留在你的電腦上,但 Git 從此不再追蹤它——處理不小心被加入的機密檔案時最常用。",
    },
    workflow: wf(1),
    workflowNote: { en: "The deletion waits in the Staging Area until you commit.", zh: "刪除動作會停在「暫存區」,等你提交才成立。" },
    syntax: [
      { code: "git rm <file>", note: { en: "delete the file and stage the deletion", zh: "刪除檔案並暫存這次刪除" } },
      { code: "git rm --cached <file>", note: { en: "stop tracking but keep the local file", zh: "停止追蹤,但保留本機檔案" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " rm "], ["flag", "--cached"], ["", " "], ["path", "secret.env"]] }],
    output: "rm 'secret.env'",
    outputNote: {
      en: "The deletion is staged, not final — it becomes history at the next commit.",
      zh: "這時刪除只是被暫存,還沒成為歷史;要等下一次 git commit 才正式生效。用了 --cached 的話,記得同時把該檔案加進 .gitignore,否則下次 git add 又會被收回去。",
    },
    mistakes: [
      { en: "Using git rm when --cached was needed, deleting a needed local file.", zh: "只是想停止追蹤卻用了 git rm,把本機還需要的檔案一起刪掉。" },
      { en: "Forgetting .gitignore after --cached, so the file gets re-added.", zh: "用了 --cached 卻忘記加 .gitignore,下次 add 又被追蹤回來。" },
    ],
    related: ["git-add", "git-commit", "git-status"],
  },

  // ---------------------------------------------------------------- revert
  {
    slug: "git-revert",
    name: "git revert",
    category: "advanced",
    tagline: { en: "Undo without rewriting history", zh: "不改寫歷史地撤銷" },
    reads: "4 min",
    what: {
      en: "git revert creates a new commit that undoes the changes of an earlier one, leaving the original commit in place.",
      zh: "git revert 會建立一個「反向的新提交」來抵銷先前那次變更,原本的提交仍然留在歷史裡。",
    },
    why: {
      en: "Once a commit is shared, deleting it breaks everyone else's history. revert undoes the effect while keeping the record honest.",
      zh: "提交一旦分享出去,直接刪掉它會弄壞所有人的歷史。revert 的做法是「加一筆抵銷」而不是「擦掉一筆」——效果一樣是撤銷,但歷史保持完整,隊友也不用做任何補救。",
    },
    scenario: {
      en: "Use it when a bad commit is already on the remote and other people may have pulled it.",
      zh: "適合用在有問題的提交已經推上遠端、別人可能已經拉下去的時候。反過來說,如果那個提交還只在你本機、沒分享過,用 reset 反而更乾淨。",
    },
    internals: {
      en: "Git computes the inverse of the target commit's changes and commits that as a new snapshot on top.",
      zh: "Git 會算出目標提交的「相反變更」(它加的就刪、它刪的就加),然後把結果做成一個新的提交疊在最上面。歷史因此只會往前長,不會有任何既有提交被改寫或消失。",
    },
    workflow: wf(2),
    workflowNote: { en: "It appends a new commit to the Repository.", zh: "它在「儲存庫」上新增一個提交,而不是移除舊的。" },
    syntax: [
      { code: "git revert HEAD", note: { en: "undo the most recent commit", zh: "撤銷最近一次提交" } },
      { code: "git revert <hash>", note: { en: "undo a specific commit", zh: "撤銷指定的某個提交" } },
    ],
    example: [{ t: "cmd", parts: [["cmd", "git"], ["", " revert "], ["path", "HEAD"]] }],
    output: '[main 5c31f77] Revert "Add login form"\n 1 file changed, 1 deletion(-)',
    outputNote: {
      en: "A new commit appears — the original is still in the log, now followed by its reversal.",
      zh: "歷史上會多出一個 Revert 提交。原本那次提交仍然看得到,只是後面接了一筆把它抵銷掉的紀錄——這正是它安全的原因。",
    },
    mistakes: [
      { en: "Reaching for reset on shared commits when revert was the safe choice.", zh: "對已分享的提交用了 reset,結果得靠 force push 收拾,反而傷到隊友。" },
      { en: "Expecting the original commit to disappear from the log.", zh: "以為原本的提交會從歷史消失;revert 是新增抵銷,不是刪除。" },
    ],
    related: ["git-reset", "git-commit", "git-log"],
  },

  // ============================================================== DANGER ZONE
  // Destructive commands. Each entry leads with what you lose, whether it can
  // be recovered, and the safer alternative — so nobody runs them by accident.

  // ---------------------------------------------------------- rm -rf .git
  {
    slug: "rm-rf-git",
    name: "rm -rf .git",
    category: "danger",
    danger: true,
    tagline: { en: "Deletes the entire history", zh: "刪掉整個版本歷史" },
    reads: "3 min",
    risk: { zh: "整個專案的版本歷史一次消失：所有 Commit、分支、標籤、stash 與 reflog 全部不見，只剩下目前資料夾裡的檔案。這個資料夾會退回成「從來沒用過 Git」的狀態。" },
    recover: { zh: "本機幾乎救不回來。.git 被刪掉後沒有任何本機備份可以還原，連 reflog 也一起消失。只有當這個專案曾經 push 到遠端，才能靠 git clone 重新取回歷史。" },
    safer: { zh: "只是想讓某些檔案不被追蹤 → 用 .gitignore 搭配 git rm --cached。想放棄修改 → 用 git restore。真的要移除 Git，先確認遠端有完整備份，並把資料夾複製一份再動手。" },
    what: {
      en: "rm -rf .git is not a Git command — it is a shell command that deletes the hidden .git folder, which is where Git keeps every version of your project.",
      zh: "rm -rf .git 不是 Git 指令，而是作業系統的刪除指令。它會直接刪掉隱藏的 .git 資料夾——那裡存放著你專案的每一個版本。",
    },
    why: {
      en: "People run it after copying a template or when Git 'feels broken', not realizing the entire history lives inside that one folder.",
      zh: "很多人是在「複製了別人的專案模板」或覺得「Git 好像壞掉了」時執行它，沒意識到整個專案的歷史就住在那一個資料夾裡。刪掉它不是重設 Git，而是把歷史整個丟掉。",
    },
    scenario: {
      en: "The only legitimate use is when you deliberately want to strip a downloaded template of its original history before starting your own.",
      zh: "唯一合理的情境，是你下載了別人的專案模板，想去掉對方的歷史、重新開始自己的版本紀錄。除此之外，幾乎沒有理由執行它。",
    },
    internals: {
      en: "The .git directory holds the object database, refs, HEAD, config and reflog. Removing it removes all of them at once.",
      zh: ".git 目錄裡有物件資料庫（所有 Commit 的內容）、分支與標籤指標、HEAD、設定檔與 reflog。刪掉它等於同時刪掉這一切；你的工作檔案雖然還在，但它們之間再也沒有任何版本關係。",
    },
    workflow: wf(2),
    workflowNote: { en: "It wipes the Repository stage entirely.", zh: "它會把「儲存庫」這一層整個抹掉。" },
    syntax: [
      { code: "rm -rf .git", note: { en: "delete the repository metadata (irreversible)", zh: "刪除儲存庫資料（不可逆）" } },
    ],
    example: [
      { t: "cmd", parts: [["comment", "# 幾乎不該執行；執行前請先確認遠端有備份"]] },
      { t: "cmd", parts: [["cmd", "rm"], ["", " "], ["flag", "-rf"], ["", " "], ["path", ".git"]] },
    ],
    output: "(沒有任何輸出。指令安靜地完成，歷史已經消失。)",
    outputNote: {
      en: "The silence is the danger: nothing warns you, and there is no confirmation step.",
      zh: "最危險的地方就是它「什麼都不說」——沒有警告、沒有確認、也沒有復原選項。等你發現 git log 不能用時，歷史早就沒了。",
    },
    mistakes: [
      { en: "Running it to 'reset Git' without a remote backup.", zh: "想「把 Git 重設一下」就執行它，卻沒有任何遠端備份。" },
      { en: "Typing it in the wrong folder — a parent repo instead of the template.", zh: "在錯的資料夾執行，刪到的是上層真正的專案而不是模板。" },
    ],
    related: ["git-init", "git-clone", "git-status"],
  },

  // ------------------------------------------------------- git reset --hard
  {
    slug: "git-reset-hard",
    name: "git reset --hard",
    category: "danger",
    danger: true,
    tagline: { en: "Throws away uncommitted work", zh: "丟掉所有未提交的修改" },
    reads: "4 min",
    risk: { zh: "工作目錄與暫存區裡所有「還沒提交」的修改會被直接覆蓋掉，不會進垃圾桶、也不會問你要不要保留。若同時指定了較早的 Commit，分支還會往回退。" },
    recover: { zh: "已經提交過的內容可以用 git reflog 找回；但**從未提交過**的修改沒有任何紀錄，救不回來。這是它和其他「危險指令」最大的差別。" },
    safer: { zh: "想暫時收起修改 → git stash（之後還能拿回來）。只想還原某個檔案 → git restore <檔案>。只想撤銷提交但保留內容 → git reset --soft。" },
    what: {
      en: "git reset --hard moves the branch pointer and forces your files to match that commit exactly, discarding every uncommitted change along the way.",
      zh: "git reset --hard 會移動分支指標，並強制讓你的檔案完全等於那個 Commit 的內容——過程中所有未提交的修改都會被丟棄。",
    },
    why: {
      en: "It is the fastest way to get back to a known-good state, which is exactly why people reach for it before they understand what it erases.",
      zh: "它是「回到一個乾淨狀態」最快的方法，也正因為快，很多人在還沒搞懂它會抹掉什麼之前就用了。--hard 這個參數看起來只是「比較徹底」，實際上是「不留退路」。",
    },
    scenario: {
      en: "Use it when you are certain the current uncommitted changes are worthless — a failed experiment you want gone.",
      zh: "適合用在你「百分之百確定」目前未提交的修改沒有價值時，例如一個失敗的實驗，你只想立刻回到乾淨狀態。只要還有一點猶豫，就該先 git stash。",
    },
    internals: {
      en: "Git moves the branch ref, resets the index, and overwrites the working tree to match — the last step is the destructive one.",
      zh: "Git 會做三件事：移動分支指標、重設暫存區、然後覆寫工作目錄。前兩步都還能靠 reflog 回頭，第三步「覆寫工作目錄」才是真正無法復原的部分。",
    },
    workflow: wf(0),
    workflowNote: { en: "It overwrites the Working Directory, where unsaved work lives.", zh: "它會覆寫「工作目錄」——那裡放的正是還沒被記錄的心血。" },
    syntax: [
      { code: "git reset --hard", note: { en: "discard all uncommitted changes", zh: "丟棄所有未提交的修改" } },
      { code: "git reset --hard HEAD~1", note: { en: "also move the branch back one commit", zh: "同時把分支退回上一個版本" } },
    ],
    example: [
      { t: "cmd", parts: [["comment", "# 先確認要丟掉的東西真的不要了"]] },
      { t: "cmd", parts: [["cmd", "git"], ["", " reset "], ["flag", "--hard"]] },
    ],
    output: "HEAD is now at 3b71e02 Add login form",
    outputNote: {
      en: "Git only reports where HEAD landed — it never lists the changes it just destroyed.",
      zh: "Git 只會告訴你 HEAD 停在哪裡，完全不會列出剛剛被它銷毀的內容。所以你不會從輸出看出自己損失了什麼。",
    },
    mistakes: [
      { en: "Using it to 'undo a commit' and losing unrelated uncommitted work too.", zh: "只是想撤銷一個提交，卻連旁邊無關的未提交修改一起賠掉。" },
      { en: "Assuming reflog can recover work that was never committed.", zh: "以為 reflog 什麼都救得回來——它救不了從未提交過的內容。" },
    ],
    related: ["git-reset", "git-stash", "git-restore"],
  },

  // ------------------------------------------------------------ git clean -fd
  {
    slug: "git-clean",
    name: "git clean -fd",
    category: "danger",
    danger: true,
    tagline: { en: "Deletes untracked files", zh: "刪除未追蹤的檔案" },
    reads: "3 min",
    risk: { zh: "所有 Git 沒在追蹤的檔案與資料夾會被直接從硬碟刪除——包含你剛寫好還沒 add 的新檔案、本機設定、筆記、暫存產物。" },
    recover: { zh: "救不回來。這些檔案從來沒進過 Git，所以 reflog、reset 都幫不上忙；它們也不會進系統垃圾桶。" },
    safer: { zh: "先用 git clean -n（dry run）列出「將會被刪掉的檔案」確認清單，再決定要不要真的執行。想保留被 .gitignore 的檔案就不要加 -x。" },
    what: {
      en: "git clean deletes files in your working directory that Git is not tracking. With -f it forces the deletion and with -d it includes whole directories.",
      zh: "git clean 會刪除工作目錄裡「Git 沒有在追蹤」的檔案。-f 代表強制執行，-d 代表連整個資料夾一起刪。",
    },
    why: {
      en: "Build artifacts and stray files pile up; clean sweeps them away in one step. The catch is that a brand-new file you just wrote is also 'untracked'.",
      zh: "編譯產物、暫存檔會越積越多，clean 一次掃乾淨很方便。問題在於——你剛剛寫好、還沒 git add 的新檔案，在 Git 眼中同樣是「未追蹤」，會被一起刪掉。",
    },
    scenario: {
      en: "Use it to reset a workspace to a pristine state, after checking exactly what will go with a dry run.",
      zh: "適合用在你想把工作區清成全新狀態時（例如編譯產物太亂）。但一定要先跑 git clean -n 看清單，確認裡面沒有你還要的新檔案。",
    },
    internals: {
      en: "Git lists paths that are untracked and not ignored, then removes them from disk. Ignored files are only touched when -x is added.",
      zh: "Git 會列出所有未被追蹤、且沒有被 .gitignore 忽略的路徑，然後直接從硬碟移除。加上 -x 才會連被忽略的檔案（例如 .env、node_modules）一起刪除，那更危險。",
    },
    workflow: wf(0),
    workflowNote: { en: "It only touches the Working Directory — but permanently.", zh: "它只動「工作目錄」,但動的方式是永久刪除。" },
    syntax: [
      { code: "git clean -n", note: { en: "dry run — list what would be deleted", zh: "試跑,只列出將被刪除的檔案" } },
      { code: "git clean -fd", note: { en: "delete untracked files and folders", zh: "刪除未追蹤的檔案與資料夾" } },
      { code: "git clean -fdx", note: { en: "also delete ignored files (most dangerous)", zh: "連被忽略的檔案一起刪（最危險）" } },
    ],
    example: [
      { t: "cmd", parts: [["comment", "# 先試跑，確認清單"]] },
      { t: "cmd", parts: [["cmd", "git"], ["", " clean "], ["flag", "-n"]] },
      { t: "cmd", parts: [["cmd", "git"], ["", " clean "], ["flag", "-fd"]] },
    ],
    output: "Would remove notes.md\nWould remove build/\nRemoving notes.md\nRemoving build/",
    outputNote: {
      en: "The -n run says 'Would remove'. Read that list carefully — it is your only chance to change your mind.",
      zh: "試跑時會顯示「Would remove」。那份清單是你唯一一次反悔的機會,一旦改成 -f,同樣的檔案就會真的從硬碟消失。",
    },
    mistakes: [
      { en: "Skipping the -n dry run and deleting a new file that was never added.", zh: "跳過 -n 試跑,把還沒 git add 的新檔案一起刪掉。" },
      { en: "Adding -x out of habit and wiping local .env or config files.", zh: "習慣性加上 -x,連本機的 .env、設定檔都一起清空。" },
    ],
    related: ["git-status", "git-add", "git-stash"],
  },

  // --------------------------------------------------------- git push --force
  {
    slug: "git-push-force",
    name: "git push --force",
    category: "danger",
    danger: true,
    tagline: { en: "Overwrites the remote history", zh: "覆蓋遠端的版本歷史" },
    reads: "4 min",
    risk: { zh: "遠端分支會被你本機的版本直接覆蓋。若隊友在你之後推過東西,他們的提交會從遠端分支上消失——這是唯一一個會傷到別人的危險指令。" },
    recover: { zh: "有機會救。被覆蓋的提交還留在原作者的本機 reflog 裡,或在 GitHub 的分支保護/活動紀錄中;但前提是有人發現得夠早、而且那個人的電腦還留著。" },
    safer: { zh: "改用 git push --force-with-lease——如果遠端在你之後有新的提交,它會拒絕推送而不是覆蓋。若只是想撤銷已分享的提交,用 git revert 產生新提交,完全不需要 force。" },
    what: {
      en: "git push --force replaces the remote branch with your local one, even when the remote contains commits you do not have.",
      zh: "git push --force 會用你本機的分支直接取代遠端分支,即使遠端上有你沒有的提交也照樣覆蓋。",
    },
    why: {
      en: "After a rebase or an amend, your local history no longer matches the remote and a normal push is rejected. Force is the shortcut people take.",
      zh: "當你做過 rebase 或 commit --amend,本機歷史就跟遠端對不上,一般的 push 會被拒絕。此時 Git 的錯誤訊息會提到 force,很多人就照著加上去——卻沒發現這代表「用我的版本蓋掉大家的版本」。",
    },
    scenario: {
      en: "Acceptable only on a branch that nobody else uses — your own feature branch before it is shared or reviewed.",
      zh: "只有在「這條分支確定只有你一個人用」時才可以接受,例如尚未分享、也還沒開 PR 的個人功能分支。對 main 或任何多人共用的分支,幾乎永遠不該使用。",
    },
    internals: {
      en: "Git normally refuses a push that is not a fast-forward. --force disables that safety check entirely.",
      zh: "正常情況下,Git 只接受「快進」的推送,以確保沒有人的提交會被弄丟。--force 等於直接關掉這道安全檢查;--force-with-lease 則保留檢查,只在遠端狀態與你預期相同時才推送。",
    },
    workflow: wf(2),
    workflowNote: { en: "It rewrites history on the shared Repository.", zh: "它改寫的是大家共用的那份「儲存庫」歷史。" },
    syntax: [
      { code: "git push --force-with-lease", note: { en: "safer: refuses if the remote moved", zh: "較安全:遠端有新提交就拒絕" } },
      { code: "git push --force", note: { en: "overwrite the remote branch", zh: "直接覆蓋遠端分支" } },
    ],
    example: [
      { t: "cmd", parts: [["comment", "# 優先使用這個版本"]] },
      { t: "cmd", parts: [["cmd", "git"], ["", " push "], ["flag", "--force-with-lease"]] },
    ],
    output: "+ 3b71e02...9f2c1ab main -> main (forced update)",
    outputNote: {
      en: "The plus sign and '(forced update)' mean commits were removed from the remote branch.",
      zh: "開頭的「+」和結尾的「(forced update)」就是警訊:代表遠端分支上有提交被移除了。如果那些提交是隊友的,他們下次 pull 時就會發現自己的工作不見了。",
    },
    mistakes: [
      { en: "Forcing onto main because a normal push was rejected.", zh: "因為一般 push 被拒絕,就直接對 main 加上 --force。" },
      { en: "Using --force when --force-with-lease would have caught the conflict.", zh: "用了 --force,而 --force-with-lease 本來就能擋下這次衝突。" },
    ],
    related: ["git-push", "git-rebase", "git-fetch"],
  },

  // ---------------------------------------------------------- git branch -D
  {
    slug: "git-branch-delete",
    name: "git branch -D",
    category: "danger",
    danger: true,
    tagline: { en: "Force-deletes an unmerged branch", zh: "強制刪除尚未合併的分支" },
    reads: "3 min",
    risk: { zh: "大寫 -D 會忽略「這條分支還沒合併」的警告,直接刪掉分支指標。該分支上獨有、還沒併回任何地方的提交,就此失去入口。" },
    recover: { zh: "通常救得回來。提交本身還在物件庫裡,用 git reflog 找到最後的 hash,再 git branch <名字> <hash> 就能復活——但只在本機、且尚未被 Git 自動清理前有效。" },
    safer: { zh: "改用小寫 git branch -d:它會在分支尚未合併時拒絕刪除並提出警告。真的要刪之前,先用 git log <分支> 確認上面沒有還需要的提交。" },
    what: {
      en: "git branch -D deletes a branch pointer even when its commits have not been merged anywhere else.",
      zh: "git branch -D 會刪除分支指標,即使這條分支上的提交還沒有被合併到任何其他地方。",
    },
    why: {
      en: "The lowercase -d refuses to delete unmerged branches on purpose. -D is the override — and the two look almost identical when typing.",
      zh: "小寫 -d 之所以會擋下未合併的分支,是刻意設計的保護。大寫 -D 就是「我知道,照刪」。兩者只差一個大小寫,是最容易手滑打錯的一組參數。",
    },
    scenario: {
      en: "Use it when you are sure the branch was a dead end you never want back.",
      zh: "適合用在你確定這條分支是死路、上面的實驗完全不需要保留時。如果只是「應該合併過了吧」,就該用小寫 -d 讓 Git 幫你確認。",
    },
    internals: {
      en: "Only the ref is removed; the commits stay in the object database until garbage collection, which is why reflog can still find them.",
      zh: "被刪掉的其實只有「指標」,提交本身還留在物件資料庫裡,直到 Git 進行垃圾回收為止。這就是為什麼短時間內還能靠 reflog 把分支救回來。",
    },
    workflow: wf(2),
    workflowNote: { en: "It removes a pointer inside the Repository.", zh: "它移除的是「儲存庫」裡的一個指標。" },
    syntax: [
      { code: "git branch -d <name>", note: { en: "safe: refuses if unmerged", zh: "安全:未合併就拒絕刪除" } },
      { code: "git branch -D <name>", note: { en: "force: delete regardless", zh: "強制:不管有沒有合併都刪" } },
    ],
    example: [
      { t: "cmd", parts: [["comment", "# 先讓 Git 幫你把關"]] },
      { t: "cmd", parts: [["cmd", "git"], ["", " branch "], ["flag", "-d"], ["", " "], ["path", "old-feature"]] },
    ],
    output: "Deleted branch old-feature (was 9f2c1ab).",
    outputNote: {
      en: "Write down that hash — it is exactly what you need if you want the branch back.",
      zh: "括號裡的 hash（例如 9f2c1ab）很重要:萬一刪錯了,用 git branch old-feature 9f2c1ab 就能立刻救回來。刪除訊息一閃而過,建議先複製起來。",
    },
    mistakes: [
      { en: "Typing -D out of habit and losing an unmerged experiment.", zh: "習慣性打成大寫 -D,把還沒合併的實驗分支弄丟。" },
      { en: "Deleting a branch that was only pushed, assuming the remote still has it.", zh: "以為遠端還留著,結果遠端分支也早就被刪了。" },
    ],
    related: ["git-branch", "git-merge", "git-switch"],
  },

  // ------------------------------------------------------------ git restore .
  {
    slug: "git-restore-all",
    name: "git restore .",
    category: "danger",
    danger: true,
    tagline: { en: "Discards every local edit", zh: "放棄目前所有修改" },
    reads: "3 min",
    risk: { zh: "工作目錄裡所有已追蹤檔案的修改會被還原成上次提交的樣子。那個「.」代表「全部」,所以會一次清掉你今天改過的每一個檔案。" },
    recover: { zh: "救不回來。這些修改從未被提交,Git 沒有留下任何副本;編輯器的復原紀錄可能是你唯一的機會。" },
    safer: { zh: "先用 git status 看清楚哪些檔案有變動,再指定單一檔案 git restore <檔案>。如果只是想暫時收起來,用 git stash,之後還能 git stash pop 拿回來。" },
    what: {
      en: "git restore . overwrites every tracked file in the working directory with the version from the last commit.",
      zh: "git restore . 會把工作目錄裡每一個「已追蹤」的檔案,都覆寫成上一次提交時的內容。",
    },
    why: {
      en: "It is the modern replacement for git checkout -- . and reads harmlessly, which is what makes it easy to run too broadly.",
      zh: "它是舊寫法 git checkout -- . 的現代版本,字面上看起來只是「還原」,語氣溫和,所以很容易在沒想清楚的情況下就套用到整個專案。真正危險的是那個「.」。",
    },
    scenario: {
      en: "Use it when an entire round of edits turned out to be wrong and you want the last commit back, unchanged.",
      zh: "適合用在整輪修改都做錯了、你只想完整回到上一個提交的狀態時。只要有任何一個檔案的修改還想留著,就不該用「.」。",
    },
    internals: {
      en: "Git copies the content from the last commit over your files. There is no snapshot of what was there a second earlier.",
      zh: "Git 直接用上一次提交的內容覆蓋你的檔案。它不會先幫你備份「覆蓋前」的樣子,所以也沒有任何地方可以回頭查。",
    },
    workflow: wf(0),
    workflowNote: { en: "It overwrites the Working Directory from the Repository.", zh: "它用「儲存庫」的內容覆蓋掉「工作目錄」。" },
    syntax: [
      { code: "git restore <file>", note: { en: "discard changes in one file", zh: "只還原單一檔案" } },
      { code: "git restore .", note: { en: "discard changes in every tracked file", zh: "還原所有已追蹤檔案" } },
    ],
    example: [
      { t: "cmd", parts: [["comment", "# 先看清楚有哪些變動"]] },
      { t: "cmd", parts: [["cmd", "git"], ["", " status"]] },
      { t: "cmd", parts: [["cmd", "git"], ["", " restore "], ["path", "app.js"]] },
    ],
    output: "(沒有輸出。檔案已被還原,修改已經消失。)",
    outputNote: {
      en: "Like most destructive commands, it succeeds silently.",
      zh: "跟多數破壞性指令一樣,它成功時什麼都不會說。等你切回編輯器才會發現整天的修改都不見了。",
    },
    mistakes: [
      { en: "Using '.' when only one file needed restoring.", zh: "其實只想還原一個檔案,卻用了「.」把全部一起還原。" },
      { en: "Forgetting that stash would have kept the work retrievable.", zh: "忘了改用 git stash 的話,這些修改本來還拿得回來。" },
    ],
    related: ["git-restore", "git-stash", "git-status"],
  },
];

const editorialExtras = {
  "git-clone": {
    scenario: { zh: "當你要加入一個已存在於 GitHub、GitLab 或公司伺服器的專案時，使用 git clone 取得完整副本。它適合第一次把專案帶到本機；之後更新同一份專案，通常改用 git pull 或 git fetch。" },
    internals: { zh: "Git 會下載遠端儲存庫的物件與提交歷史，建立工作目錄，設定 origin 遠端名稱，並讓本機分支追蹤對應的遠端分支。因此 clone 不只是下載檔案，也帶回版本歷史與遠端關係。" },
    outputNote: { zh: "輸出會依序顯示物件計數、壓縮與接收進度。看到完成訊息後，進入新建立的資料夾並執行 git status，就能確認目前分支及它追蹤的遠端分支。" },
  },
  "git-status": {
    scenario: { zh: "準備暫存、提交、切換分支或推送之前，都可以先執行 git status。它是最安全的確認動作，能快速回答目前在哪個分支、哪些檔案有變動，以及哪些內容已準備進入下一次提交。" },
    internals: { zh: "Git 會比較三個位置：HEAD 指向的最新提交、暫存區，以及工作目錄。比較結果決定檔案顯示為未追蹤、已修改或已暫存；status 本身只讀取狀態，不會更改任何檔案。" },
    outputNote: { zh: "先看分支名稱，再依序閱讀 staged、not staged 與 untracked 區域。輸出中的提示指令只是建議，不會自動執行；沒有變動時會看到 working tree clean。" },
  },
  "git-add": {
    scenario: { zh: "完成一小段修改並決定哪些內容要進入下一個版本時，使用 git add。你可以逐一加入檔案，讓一個提交只包含同一件事；也可以在確認所有變動相關後一次加入目前目錄。" },
    internals: { zh: "git add 會把指定檔案當下的內容寫入 Git 物件資料庫，並更新暫存區索引。它保存的是那一刻的內容快照；之後若再次修改同一檔案，新變動仍留在工作目錄，需要再次 add。" },
    outputNote: { zh: "成功的 git add 通常不顯示任何文字。請接著執行 git status，確認檔案已出現在 Changes to be committed；若位置不對，可以在提交前把它移出暫存區。" },
  },
  "git-commit": {
    scenario: { zh: "當暫存區已經整理成一個完整、可說明的改動時，使用 git commit 建立版本。適合在完成一個小功能、修正一個錯誤或更新一份文件後提交，而不是等到一天結束才全部混在一起。" },
    internals: { zh: "Git 會根據暫存區建立新的樹狀快照，產生包含作者、時間、訊息與父提交的 Commit 物件，接著把目前分支指標移到新 Commit。工作目錄中未暫存的內容不會被包含。" },
    outputNote: { zh: "輸出包含所在分支、短版 Commit ID、提交訊息，以及變更檔案與行數統計。完成後可用 git status 確認剩餘變動，或以 git log 查看新版本是否出現在歷史中。" },
  },
  "git-log": {
    scenario: { zh: "想知道最近做了哪些修改、尋找某個版本，或在合併與回復之前確認歷史時，使用 git log。精簡的 oneline 模式適合快速掃描，完整模式則能查看作者、時間與完整訊息。" },
    internals: { zh: "Git 從目前 HEAD 指向的 Commit 開始，沿著父提交關係向過去走訪。log 不會修改歷史，只是用不同格式呈現可到達的 Commit；加入圖形與全部分支參數時，也能看到分支如何分岔與合併。" },
    outputNote: { zh: "每一行通常包含 Commit ID 與提交訊息，最上方是較新的版本。HEAD 與分支標籤指出目前所在位置；需要離開分頁檢視器時按 q，不必關閉終端機。" },
  },
  "git-branch": {
    scenario: { zh: "準備開發新功能、修正問題，或想在不影響主線的情況下嘗試做法時，先建立分支。清楚的分支名稱能表達工作目的，例如 feature/login 或 fix/navbar。" },
    internals: { zh: "建立分支不會複製整份專案；Git 只新增一個指向目前 Commit 的輕量指標。新分支建立後 HEAD 仍留在原分支，必須再使用 git switch 才會切換工作位置。" },
    outputNote: { zh: "成功建立分支通常沒有輸出。執行 git branch 可以看到完整清單，星號表示目前分支；若名稱已存在，Git 會拒絕建立並顯示對應錯誤。" },
  },
  "git-switch": {
    scenario: { zh: "需要從主線移到功能分支繼續工作，或完成任務後回到 main 時，使用 git switch。切換前先確認工作目錄，避免尚未提交的變動與目標分支內容互相衝突。" },
    internals: { zh: "Git 會讓 HEAD 指向目標分支，並更新工作目錄與暫存區，使它們符合該分支目前的 Commit。未提交變動若能安全保留會跟著移動，可能覆寫內容時 Git 會阻止切換。" },
    outputNote: { zh: "成功時會顯示已切換到哪個分支。接著可用 git status 再確認分支名稱；若 Git 阻止切換，先提交、還原或使用 git stash 暫時收起目前變動。" },
  },
  "git-merge": {
    scenario: { zh: "功能分支完成並通過檢查後，先切回要接收成果的分支，再使用 git merge 合併。團隊也常透過 Pull Request 完成相同概念的整合與審查。" },
    internals: { zh: "Git 會尋找兩條歷史的共同祖先，再計算需要整合的變動。若主線沒有新增 Commit，可能只移動指標形成 fast-forward；兩邊都有進展時則建立合併提交，衝突時暫停等待處理。" },
    outputNote: { zh: "Fast-forward 代表只移動分支指標；Merge made 表示產生新的合併提交。若列出 CONFLICT，先打開衝突檔案完成選擇，再 add 並 commit 才能結束合併。" },
  },
  "git-rebase": {
    scenario: { zh: "功能分支落後主線，而你希望在合併前整理出線性的提交歷史時，可以使用 rebase。它適合整理尚未分享的個人分支；已被其他人使用的公開歷史不宜任意改寫。" },
    internals: { zh: "Git 先找出目前分支獨有的 Commit，暫時移開，將分支移到新的基底，再逐一重播這些變動。重播後會產生新的 Commit ID，即使檔案內容看起來相同，歷史也已被改寫。" },
    outputNote: { zh: "成功訊息表示分支已更新到新的基底。遇到衝突時，修正並 add 後使用 rebase --continue；想放棄整個過程則使用 rebase --abort 回到開始前。" },
  },
  "git-fetch": {
    scenario: { zh: "想先查看遠端有什麼新進度，又不希望立刻改動目前工作分支時，使用 git fetch。它適合在合併前審查同事更新，或確認遠端分支與標籤的最新狀態。" },
    internals: { zh: "Git 下載本機尚未擁有的物件，並更新 origin/main 這類遠端追蹤分支。本機 main、工作目錄與暫存區都不會移動，因此 fetch 是取得資訊而不立即整合的安全動作。" },
    outputNote: { zh: "輸出會列出新增或更新的遠端參照。完成後可用 git log main..origin/main 查看遠端多出的 Commit，再自行決定要 merge、rebase，或暫時不處理。" },
  },
  "git-pull": {
    scenario: { zh: "準備開始工作或推送前，需要把目前分支更新到遠端最新狀態時，使用 git pull。執行前最好保持工作目錄乾淨，並先理解團隊採用 merge 還是 rebase 的同步策略。" },
    internals: { zh: "pull 其實先執行 fetch 下載遠端更新，再把遠端追蹤分支整合進目前分支。預設可能使用 merge，也能設定為 rebase；因此它會直接改變本機分支與工作目錄。" },
    outputNote: { zh: "Already up to date 代表沒有新內容；Fast-forward 表示分支直接前進。若自動整合失敗，輸出會列出衝突檔案，需要完成處理後才能繼續工作。" },
  },
  "git-push": {
    scenario: { zh: "本機 Commit 已完成並確認無誤，希望備份到遠端、交給同事審查或分享分支時，使用 git push。第一次推送新分支通常要設定 upstream，後續才能直接使用簡短指令。" },
    internals: { zh: "Git 會找出遠端缺少的物件並上傳，再要求遠端移動對應分支指標。如果遠端分支包含本機沒有的歷史，為避免覆蓋他人工作，普通 push 會被拒絕。" },
    outputNote: { zh: "輸出中的 main -> main 表示哪個本機分支更新了哪個遠端分支。Rejected 通常代表遠端已前進，應先 pull 或 fetch 理解差異，不要直接使用強制推送。" },
  },
  "git-stash": {
    scenario: { zh: "工作做到一半，突然需要切換分支處理緊急問題，但目前變動還不適合提交時，使用 git stash 暫時收起。處理完成後回到原分支，再把這份工作取回。" },
    internals: { zh: "Git 會把已追蹤檔案在工作目錄與暫存區的變動保存成特殊的 stash 記錄，接著讓工作目錄回到乾淨狀態。未追蹤檔案預設不包含，除非加上對應參數。" },
    outputNote: { zh: "輸出會顯示 stash 建立在哪個分支及當時的 Commit。可用 stash list 查看清單；apply 會保留記錄，pop 會套用後移除，若產生衝突仍需手動解決。" },
  },
  "git-restore": {
    scenario: { zh: "修改檔案後發現方向錯誤，想捨棄尚未提交的內容，或需要把檔案移出暫存區時，使用 git restore。執行前要確認那些變動確實不再需要。" },
    internals: { zh: "Git 會從指定來源取出檔案內容，覆寫工作目錄或暫存區。預設來源通常是暫存區；搭配 staged 或 source 時可明確指定要還原哪個位置，但不會移動分支歷史。" },
    outputNote: { zh: "成功通常沒有輸出，請用 git status 與 git diff 確認結果。工作目錄中被覆寫且未提交的內容通常無法由 Git 找回，因此不要把 restore 當成可隨意復原的動作。" },
  },
  "git-reset": {
    scenario: { zh: "提交太早、暫存了錯誤檔案，或需要讓目前分支回到較早位置時，使用 git reset。先判斷只是要取消暫存、保留修改，還是連工作內容都要捨棄，再選擇模式。" },
    internals: { zh: "reset 首先移動目前分支指標；soft 只移動指標，mixed 再重設暫存區，hard 還會覆寫工作目錄。三種模式影響範圍不同，hard 可能讓未提交內容永久消失。" },
    outputNote: { zh: "reset 成功常沒有一般訊息，範例中的 HEAD 後退但暫存內容保留，是 soft 模式的結果。接著應用 git status 與 git log 同時確認檔案狀態和分支位置。" },
  },
};

for (const command of commands) {
  if (editorialExtras[command.slug]) Object.assign(command, editorialExtras[command.slug]);
}

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
