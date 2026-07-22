<script setup>
import { computed } from "vue";
import { layoutGitGraph } from "../../composables/gitGraphLayout.js";
const props = defineProps({ commits: { type: Array, required: true }, branches: { type: Object, required: true }, currentBranch: { type: String, required: true }, tags: { type: Object, default: () => ({}) } });
const graph = computed(() => layoutGitGraph(props.commits, props.branches, props.currentBranch, props.tags));
const height = computed(() => Math.max(90, 55 + props.commits.length * 58));
const labelAt = (hash) => graph.value.labels.filter((label) => label.hash === hash);
</script>
<template>
  <section class="viz-section graph">
    <header><span>Git Graph</span><b>Git 分支圖</b></header>
    <p v-if="!commits[0]" class="empty">建立第一個 Commit 後，分支圖會從這裡開始。</p>
    <svg v-else viewBox="0 0 300 400" :style="{ height: height + 'px' }" aria-label="Git branch graph">
      <path v-for="(edge, index) in graph.edges" :key="index" :d="`M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${edge.to.y}, ${edge.to.x} ${edge.from.y}, ${edge.to.x} ${edge.to.y}`" />
      <g v-for="node in graph.nodes" :key="node.hash" class="graph__node" :style="{ transform: `translate(${node.x}px, ${node.y}px)` }">
        <circle r="6" />
        <text x="14" y="4">{{ node.message }}</text>
        <text v-for="(label, index) in labelAt(node.hash)" :key="`${label.kind}-${label.branch}`" x="14" :y="19 + index * 14" class="branch-label">{{ label.head ? 'HEAD → ' : label.kind === 'tag' ? 'TAG · ' : '' }}{{ label.branch }}</text>
      </g>
    </svg>
  </section>
</template>
<style scoped>
.viz-section { padding: 22px; border: 1px solid var(--border); border-radius: 12px; background: var(--paper-2); } header { display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase } header b{font-family:var(--serif-tc);font-weight:400}.empty{font-family:var(--serif-tc);color:var(--ink-faint);font-size:11px;line-height:1.7;margin:18px 0 0}svg{width:100%;margin-top:15px;overflow:visible}path{fill:none;stroke:var(--secondary);stroke-width:1.5}.graph__node{transition:transform 280ms ease}.graph__node circle{fill:var(--primary);stroke:var(--paper-2);stroke-width:3}.graph__node text{font-family:var(--mono);font-size:9px;fill:var(--ink-soft)}.graph__node .branch-label{fill:var(--warning);font-weight:700}@media(prefers-reduced-motion:reduce){.graph__node{transition:none}}
</style>
