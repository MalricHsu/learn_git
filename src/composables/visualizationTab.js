const workflowKeys = new Set(["init", "status", "add", "commit", "restore", "stash", "stash-pop", "rm", "rm-cached"]);
const graphKeys = new Set(["branch", "branch-delete", "switch", "merge", "tag", "tag-delete", "rebase"]);
const timelineKeys = new Set(["log", "log-oneline", "blame", "reflog", "revert"]);

export function tabForTeachingKey(key, fallback = "workflow") {
  if (workflowKeys.has(key)) return "workflow";
  if (graphKeys.has(key)) return "graph";
  if (timelineKeys.has(key)) return "timeline";
  return fallback;
}
