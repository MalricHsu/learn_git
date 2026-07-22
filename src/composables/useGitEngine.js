import { reactive } from "vue";

const copy = (value) => JSON.parse(JSON.stringify(value));
const unique = (items) => [...new Set(items)];

function normalizeCommits(items = []) {
  let previous = null;
  return items.map((item, index) => {
    const commit = {
      hash: item.hash || `seed${String(index + 1).padStart(3, "0")}`,
      message: item.message || item.msg || "Update project",
      branch: item.branch || "main",
      parents: item.parents ? [...item.parents] : previous ? [previous] : [],
      files: item.files ? [...item.files] : [],
      timestamp: item.timestamp || `09:${String(20 + index * 7).padStart(2, "0")}`,
    };
    previous = commit.hash;
    return commit;
  });
}

export function createGitEngine(options = {}) {
  const seedCommits = normalizeCommits(options.commits || options.committed);
  const currentBranch = options.currentBranch || options.branch || "main";
  const branchSeed = options.branches && !Array.isArray(options.branches)
    ? copy(options.branches)
    : Object.fromEntries((options.branches || [currentBranch]).map((name) => [name, null]));
  if (!(currentBranch in branchSeed)) branchSeed[currentBranch] = null;
  for (const commit of seedCommits) branchSeed[commit.branch] = commit.hash;

  const state = reactive({
    initialized: options.initialized ?? false,
    currentBranch,
    branches: branchSeed,
    workingDirectory: [...(options.workingDirectory || options.working || ["index.html", "app.js"])],
    stagingArea: [...(options.stagingArea || options.staged || [])],
    repository: [...(options.repository || [])],
    commits: seedCommits,
    remote: copy(options.remote || {
      entries: options.remoteAdded ? { origin: "git@github.com:you/app.git" } : {},
      trackingBranches: {},
      fetched: false,
      pushed: false,
    }),
    tags: copy(options.tags || {}),
    pendingDeletions: [...(options.pendingDeletions || [])],
    stash: copy(options.stash || options.stashed || []),
    reflog: copy(options.reflog || []),
    lastAction: null,
    lines: [],
  });

  if (!state.remote.entries) state.remote.entries = {};
  if (!state.remote.trackingBranches) state.remote.trackingBranches = {};
  if (state.remote.fetched == null) state.remote.fetched = false;
  if (state.remote.pushed == null) state.remote.pushed = false;

  let hashCounter = state.commits.length + 1;
  let minuteCounter = state.commits.length;
  const esc = (value) => String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const print = (html, cls = "") => state.lines.push({ html, cls, id: `${Date.now()}-${state.lines.length}` });
  const prompt = () => `<span class="term-prompt">gitdaily <span class="term-branch">(${esc(state.currentBranch)})</span> $</span> `;
  const head = () => state.branches[state.currentBranch] || null;
  const makeHash = () => (0xabc0000 + hashCounter++ * 0x101).toString(16).slice(-7);
  const makeTime = () => {
    const total = 9 * 60 + 20 + minuteCounter++ * 7;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  if (options.greeting) print(options.greeting, "term-dim");

  function finish(raw, metadata) {
    state.lastAction = {
      raw,
      command: metadata.command || raw.split(/\s+/).slice(0, 2).join(" "),
      success: metadata.success !== false,
      effect: metadata.effect || "observe",
      files: metadata.files ? [...metadata.files] : [],
      branch: metadata.branch || state.currentBranch,
      teachingKey: metadata.teachingKey || "git",
      ...(metadata.error ? { error: metadata.error } : {}),
    };
    options.onRun?.(raw, state.lastAction);
    return state.lastAction;
  }

  function fail(raw, teachingKey, message, command = raw) {
    print(message, "term-err");
    return finish(raw, { command, success: false, effect: "none", teachingKey, error: message });
  }

  function requireRepo(raw, command) {
    if (state.initialized) return true;
    fail(raw, "not-initialized", "fatal: not a git repository (run 'git init' first)", command);
    return false;
  }

  function addCommit(message, files, parents = [head()].filter(Boolean)) {
    const commit = {
      hash: makeHash(),
      message,
      branch: state.currentBranch,
      parents,
      files: [...files],
      timestamp: makeTime(),
    };
    state.commits.push(commit);
    state.branches[state.currentBranch] = commit.hash;
    state.reflog.unshift({ hash: commit.hash, action: `commit: ${message}`, branch: state.currentBranch });
    return commit;
  }

  function run(rawInput) {
    const raw = String(rawInput || "").trim();
    if (!raw) return null;
    print(prompt() + esc(raw), "term-cmd-echo");

    if (/^rm\s+.*\.git(?:\/|\s|$)/.test(raw)) {
      return fail(raw, "dangerous-remove-git", "Blocked: removing .git would erase this repository's history.", "rm");
    }

    const parts = raw.match(/(?:[^\s"']+|["'][^"']*["'])+/g) || [];
    if (parts[0] === "clear") {
      state.lines = [];
      return finish(raw, { command: "clear", effect: "terminal", teachingKey: "clear" });
    }
    if (parts[0] === "help") {
      print("Git commands available: init · status · add · commit · log · diff · blame · restore · branch · switch · merge · remote · fetch · pull · push · stash · tag · rebase · reflog · rm · revert", "term-dim");
      return finish(raw, { command: "help", effect: "observe", teachingKey: "help" });
    }
    if (parts[0] !== "git") return fail(raw, "not-git-command", `command not found: ${esc(parts[0])} — this terminal only speaks git.`, parts[0]);

    const sub = parts[1];
    const command = `git ${sub || ""}`.trim();

    if (sub === "init") {
      state.initialized = true;
      print("Initialized empty Git repository in /gitdaily/.git/", "term-ok");
      return finish(raw, { command, effect: "initialize", teachingKey: "init" });
    }

    if (sub === "clone") {
      state.initialized = true;
      state.remote.entries.origin = parts[2] || "https://github.com/example/project.git";
      state.workingDirectory = unique([...state.workingDirectory, "README.md"]);
      print("Cloning repository... done.", "term-ok");
      return finish(raw, { command, effect: "clone", files: state.workingDirectory, teachingKey: "clone" });
    }

    if (!requireRepo(raw, command)) return state.lastAction;

    switch (sub) {
      case "status": {
        print(`On branch <b>${esc(state.currentBranch)}</b>`);
        if (state.stagingArea.length) print(`Changes staged: ${state.stagingArea.map(esc).join(", ")}`, "term-ok");
        if (state.workingDirectory.length) print(`Working directory: ${state.workingDirectory.map(esc).join(", ")}`, "term-dim");
        if (!state.stagingArea.length && !state.workingDirectory.length) print("nothing to commit, working tree clean", "term-dim");
        return finish(raw, { command, effect: "observe", teachingKey: "status" });
      }

      case "add": {
        const target = parts[2];
        const files = target === "." || target === "-A" || target === "--all"
          ? [...state.workingDirectory]
          : state.workingDirectory.includes(target) ? [target] : [];
        if (!files.length) return fail(raw, "add-missing-path", `fatal: pathspec '${esc(target || "")}' did not match any files`, command);
        state.workingDirectory = state.workingDirectory.filter((file) => !files.includes(file));
        state.stagingArea = unique([...state.stagingArea, ...files]);
        print(`Staged ${files.join(", ")}`, "term-ok");
        return finish(raw, { command, effect: "stage", files, teachingKey: "add" });
      }

      case "commit": {
        if (!state.stagingArea.length) return fail(raw, "commit-empty-stage", "nothing to commit (use 'git add' first)", command);
        const messageMatch = raw.match(/-m\s+["']([^"']+)["']/);
        const message = messageMatch?.[1] || "Update project";
        const files = [...state.stagingArea];
        state.repository = unique([
          ...state.repository.filter((file) => !state.pendingDeletions.includes(file)),
          ...files.filter((file) => !state.pendingDeletions.includes(file)),
        ]);
        state.pendingDeletions = [];
        state.stagingArea = [];
        const commit = addCommit(message, files);
        print(`[${state.currentBranch} ${commit.hash}] ${esc(message)}`, "term-ok");
        return finish(raw, { command, effect: "commit", files, teachingKey: "commit" });
      }

      case "log": {
        const compact = parts.includes("--oneline");
        if (!state.commits.length) print("No commits yet.", "term-dim");
        [...state.commits].reverse().forEach((commit) => print(compact ? `${commit.hash} ${esc(commit.message)}` : `commit ${commit.hash}\n    ${esc(commit.message)}`));
        return finish(raw, { command, effect: "observe-history", teachingKey: compact ? "log-oneline" : "log" });
      }

      case "diff":
        print(state.workingDirectory.length ? `Modified: ${state.workingDirectory.map(esc).join(", ")}` : "No unstaged changes.", "term-dim");
        return finish(raw, { command, effect: "observe-diff", files: state.workingDirectory, teachingKey: "diff" });

      case "blame": {
        const file = parts.at(-1);
        print(`${head() || "0000000"} (Git Daily 09:20 1) ${esc(file || "file")}`, "term-dim");
        return finish(raw, { command, effect: "observe-author", files: file ? [file] : [], teachingKey: "blame" });
      }

      case "restore": {
        const staged = parts.includes("--staged");
        const file = parts.at(-1);
        if (staged && state.stagingArea.includes(file)) {
          state.stagingArea = state.stagingArea.filter((item) => item !== file);
          state.workingDirectory = unique([...state.workingDirectory, file]);
        } else if (!staged && file) {
          state.workingDirectory = state.workingDirectory.filter((item) => item !== file);
        } else return fail(raw, "restore-missing-path", `error: pathspec '${esc(file || "")}' did not match`, command);
        print(`Restored ${esc(file)}`, "term-ok");
        return finish(raw, { command, effect: staged ? "unstage" : "restore", files: [file], teachingKey: "restore" });
      }

      case "branch": {
        const deleteIndex = parts.findIndex((part) => ["-d", "-D", "--delete"].includes(part));
        if (deleteIndex > -1) {
          const name = parts[deleteIndex + 1];
          if (!(name in state.branches) || name === state.currentBranch) return fail(raw, "branch-delete-invalid", `error: cannot delete branch '${esc(name || "")}'`, command);
          delete state.branches[name];
          print(`Deleted branch ${esc(name)}`, "term-ok");
          return finish(raw, { command, effect: "delete-branch", branch: name, teachingKey: "branch-delete" });
        }
        const name = parts[2];
        if (!name) {
          Object.keys(state.branches).forEach((branch) => print(branch === state.currentBranch ? `* <b>${esc(branch)}</b>` : `  ${esc(branch)}`));
          return finish(raw, { command, effect: "observe-branches", teachingKey: "branch-list" });
        }
        if (name in state.branches) return fail(raw, "branch-exists", `fatal: a branch named '${esc(name)}' already exists`, command);
        state.branches[name] = head();
        print(`Created branch ${esc(name)}`, "term-ok");
        return finish(raw, { command, effect: "create-branch", branch: name, teachingKey: "branch" });
      }

      case "switch":
      case "checkout": {
        const create = ["-c", "-b"].includes(parts[2]);
        const target = parts[create ? 3 : 2];
        if (create && !(target in state.branches)) state.branches[target] = head();
        if (!(target in state.branches)) return fail(raw, "switch-missing-branch", `error: unknown branch '${esc(target || "")}'`, command);
        const from = state.currentBranch;
        state.currentBranch = target;
        state.reflog.unshift({ hash: head(), action: `switch: ${from} to ${target}`, branch: target });
        print(`Switched to branch '${esc(target)}'`, "term-ok");
        return finish(raw, { command, effect: "move-head", branch: target, teachingKey: "switch" });
      }

      case "merge": {
        const target = parts[2];
        if (!(target in state.branches)) return fail(raw, "merge-missing-branch", `merge: ${esc(target || "")} - not something we can merge`, command);
        if (target === state.currentBranch) return fail(raw, "merge-current-branch", "Already up to date.", command);
        const parents = unique([head(), state.branches[target]].filter(Boolean));
        const commit = addCommit(`Merge branch '${target}'`, state.repository, parents);
        print(`Merge made by the 'ort' strategy. ${commit.hash}`, "term-ok");
        return finish(raw, { command, effect: "merge", branch: target, teachingKey: "merge" });
      }

      case "remote": {
        const action = parts[2];
        if (action === "add") {
          const name = parts[3];
          const url = parts[4];
          if (!name || !url) return fail(raw, "remote-invalid", "usage: git remote add <name> <url>", command);
          state.remote.entries[name] = url;
          print(`Added remote ${esc(name)}`, "term-ok");
          return finish(raw, { command, effect: "add-remote", teachingKey: "remote-add" });
        }
        if (["remove", "rm"].includes(action)) {
          const name = parts[3];
          if (!(name in state.remote.entries)) return fail(raw, "remote-missing", `error: No such remote: '${esc(name || "")}'`, command);
          delete state.remote.entries[name];
          delete state.remote.trackingBranches[name];
          print(`Removed remote ${esc(name)}`, "term-ok");
          return finish(raw, { command, effect: "remove-remote", teachingKey: "remote-remove" });
        }
        Object.entries(state.remote.entries).forEach(([name, url]) => print(`${esc(name)}\t${esc(url)}`));
        return finish(raw, { command, effect: "observe-remotes", teachingKey: "remote-list" });
      }

      case "fetch": {
        state.remote.fetched = true;
        state.remote.trackingBranches[`origin/${state.currentBranch}`] = head();
        print("Fetched remote updates without changing your files.", "term-ok");
        return finish(raw, { command, effect: "fetch", teachingKey: "fetch" });
      }

      case "pull": {
        state.remote.fetched = true;
        print("Fetched and integrated remote updates.", "term-ok");
        return finish(raw, { command, effect: "pull", teachingKey: "pull" });
      }

      case "push": {
        if (!head()) return fail(raw, "push-no-commits", "Everything up-to-date: there are no commits to push.", command);
        state.remote.pushed = true;
        state.remote.trackingBranches[`origin/${state.currentBranch}`] = head();
        print(`${esc(state.currentBranch)} -> ${esc(state.currentBranch)}`, "term-ok");
        return finish(raw, { command, effect: "push", teachingKey: "push" });
      }

      case "stash": {
        const action = parts[2] || "push";
        if (["pop", "apply"].includes(action)) {
          const entry = action === "pop" ? state.stash.pop() : state.stash.at(-1);
          if (!entry) return fail(raw, "stash-empty", "No stash entries found.", command);
          state.workingDirectory = unique([...state.workingDirectory, ...entry.files]);
          print(`Applied ${esc(entry.label)}`, "term-ok");
          return finish(raw, { command, effect: "restore-stash", files: entry.files, teachingKey: `stash-${action}` });
        }
        if (action === "list") {
          state.stash.forEach((entry, index) => print(`stash@{${index}}: ${esc(entry.label)}`));
          return finish(raw, { command, effect: "observe-stash", teachingKey: "stash-list" });
        }
        const files = unique([...state.workingDirectory, ...state.stagingArea]);
        if (!files.length) return fail(raw, "stash-clean", "No local changes to save.", command);
        state.stash.push({ label: `WIP on ${state.currentBranch}`, files });
        state.workingDirectory = [];
        state.stagingArea = [];
        print("Saved working directory and index state.", "term-ok");
        return finish(raw, { command, effect: "stash", files, teachingKey: "stash" });
      }

      case "tag": {
        const deleteIndex = parts.findIndex((part) => ["-d", "--delete"].includes(part));
        if (deleteIndex > -1) {
          const name = parts[deleteIndex + 1];
          if (!(name in state.tags)) return fail(raw, "tag-missing", `error: tag '${esc(name || "")}' not found.`, command);
          delete state.tags[name];
          print(`Deleted tag '${esc(name)}'`, "term-ok");
          return finish(raw, { command, effect: "delete-tag", teachingKey: "tag-delete" });
        }
        const name = parts.find((part, index) => index > 1 && !part.startsWith("-"));
        if (!name) {
          Object.keys(state.tags).forEach((tag) => print(esc(tag)));
          return finish(raw, { command, effect: "observe-tags", teachingKey: "tag-list" });
        }
        state.tags[name] = head();
        print(`Tagged ${esc(name)}`, "term-ok");
        return finish(raw, { command, effect: "tag", teachingKey: "tag" });
      }

      case "rebase": {
        const target = parts.at(-1);
        if (!(target in state.branches)) return fail(raw, "rebase-missing-branch", `fatal: invalid upstream '${esc(target || "")}'`, command);
        const previousHead = head();
        const previous = state.commits.find((commit) => commit.hash === previousHead);
        if (previous && state.branches[target] !== previousHead) {
          addCommit(previous.message, previous.files, [state.branches[target]].filter(Boolean));
        }
        state.reflog.unshift({ hash: head(), action: `rebase onto ${target}`, branch: state.currentBranch });
        print(`Successfully rebased ${esc(state.currentBranch)} onto ${esc(target)}.`, "term-ok");
        return finish(raw, { command, effect: "rebase", branch: target, teachingKey: "rebase" });
      }

      case "reflog":
        state.reflog.forEach((entry, index) => print(`${entry.hash || "0000000"} HEAD@{${index}}: ${esc(entry.action)}`));
        return finish(raw, { command, effect: "observe-reflog", teachingKey: "reflog" });

      case "rm": {
        const cached = parts.includes("--cached");
        const file = parts.at(-1);
        if (!state.repository.includes(file) && !state.workingDirectory.includes(file)) return fail(raw, "rm-missing-path", `fatal: pathspec '${esc(file || "")}' did not match any files`, command);
        state.repository = state.repository.filter((item) => item !== file);
        state.stagingArea = unique([...state.stagingArea, file]);
        state.pendingDeletions = unique([...state.pendingDeletions, file]);
        if (cached) state.workingDirectory = unique([...state.workingDirectory, file]);
        else state.workingDirectory = state.workingDirectory.filter((item) => item !== file);
        print(cached ? `Stopped tracking ${esc(file)}; local file kept.` : `Removed ${esc(file)}`, "term-ok");
        return finish(raw, { command, effect: cached ? "untrack" : "remove-file", files: [file], teachingKey: cached ? "rm-cached" : "rm" });
      }

      case "revert": {
        if (!head()) return fail(raw, "revert-no-commit", "fatal: bad revision 'HEAD'", command);
        const target = state.commits.find((commit) => commit.hash === head()) || state.commits.at(-1);
        const commit = addCommit(`Revert "${target.message}"`, target.files);
        print(`[${state.currentBranch} ${commit.hash}] ${esc(commit.message)}`, "term-ok");
        return finish(raw, { command, effect: "revert", files: target.files, teachingKey: "revert" });
      }

      default:
        return fail(raw, "unsupported-git-command", `git: '${esc(sub || "")}' is not available in this learning terminal.`, command);
    }
  }

  return { state, run };
}
