export function layoutGitGraph(commits = [], branches = {}, currentBranch = "main", tags = {}) {
  const lanes = new Map();
  const nodes = commits.map((commit, index) => {
    if (!lanes.has(commit.branch)) lanes.set(commit.branch, lanes.size);
    return { ...commit, x: 28 + lanes.get(commit.branch) * 54, y: 28 + index * 58 };
  });
  const byHash = new Map(nodes.map((node) => [node.hash, node]));
  const edges = nodes.flatMap((node) => (node.parents || []).map((parent) => ({
    from: byHash.get(parent),
    to: node,
  })).filter((edge) => edge.from));
  const labels = [
    ...Object.entries(branches).map(([branch, hash]) => ({ branch, hash, head: branch === currentBranch, kind: "branch" })),
    ...Object.entries(tags).map(([tag, hash]) => ({ branch: tag, hash, head: false, kind: "tag" })),
  ];
  return { nodes, edges, labels };
}
