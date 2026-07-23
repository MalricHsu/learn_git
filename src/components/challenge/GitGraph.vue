<script setup>
import { computed } from "vue";
import { layoutGitGraph } from "../../composables/gitGraphLayout.js";
const props = defineProps({ commits: { type: Array, required: true }, branches: { type: Object, required: true }, currentBranch: { type: String, required: true }, tags: { type: Object, default: () => ({}) } });
const graph = computed(() => layoutGitGraph(props.commits, props.branches, props.currentBranch, props.tags));
const height = computed(() => Math.max(120, 66 + props.commits.length * 58));
const labelAt = (hash) => graph.value.labels.filter((label) => label.hash === hash);
</script>
<template>
  <section class="viz-section graph">
    <p v-if="!commits[0]" class="empty">建立第一個 Commit 後，分支圖會從這裡開始。</p>
    <svg v-else :viewBox="`0 0 300 ${height}`" preserveAspectRatio="xMinYMin meet" :style="{ height: height + 'px' }" aria-label="Git branch graph">
      <path v-for="(edge, index) in graph.edges" :key="index" :d="`M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${edge.to.y}, ${edge.to.x} ${edge.from.y}, ${edge.to.x} ${edge.to.y}`" />
      <g v-for="node in graph.nodes" :key="node.hash" class="graph__node" :style="{ transform: `translate(${node.x}px, ${node.y}px)` }">
        <circle r="7" />
        <text x="19" y="5">{{ node.message }}</text>
        <text v-for="(label, index) in labelAt(node.hash)" :key="`${label.kind}-${label.branch}`" x="19" :y="24 + index * 17" class="branch-label">{{ label.head ? 'HEAD → ' : label.kind === 'tag' ? 'TAG · ' : '' }}{{ label.branch }}</text>
      </g>
    </svg>
  </section>
</template>
<style scoped>
.viz-section { padding: 6px 16px 16px; border: 0; border-radius: 0; background: transparent; }.empty{font-family:var(--serif-tc);color:var(--ink-faint);font-size:11px;line-height:1.7;margin:14px 0 0}svg{width:100%;margin-top:12px;overflow:visible}path{fill:none;stroke:var(--secondary);stroke-width:1.5}.graph__node{transition:transform 280ms ease}.graph__node circle{fill:var(--primary);stroke:var(--paper-2);stroke-width:3}.graph__node text{font-family:var(--mono);font-size:12px;fill:var(--ink-soft)}.graph__node .branch-label{font-size:11px;fill:var(--warning);font-weight:700}@media(prefers-reduced-motion:reduce){.graph__node{transition:none}}
</style>
