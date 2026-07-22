<script setup>
import { ref, watch } from "vue";
import GitWorkflow from "./GitWorkflow.vue";
import GitGraph from "./GitGraph.vue";
import CommitTimeline from "./CommitTimeline.vue";
import { tabForTeachingKey } from "../../composables/visualizationTab.js";

const props = defineProps({
  state: { type: Object, required: true },
  initialTab: { type: String, default: "workflow" },
});
const activeTab = ref(props.initialTab);
const tabs = [
  { id: "workflow", en: "Workflow", zh: "工作流程" },
  { id: "graph", en: "Graph", zh: "分支圖" },
  { id: "timeline", en: "Timeline", zh: "時間軸" },
];

watch(() => props.state, () => { activeTab.value = props.initialTab; }, { immediate: true });
watch(() => props.state.lastAction, (action) => {
  if (action?.success) activeTab.value = tabForTeachingKey(action.teachingKey, activeTab.value);
});
</script>

<template>
  <section class="viz-tabs">
    <div class="viz-tabs__buttons" role="tablist" aria-label="Git visualizations">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.zh }}</button>
    </div>
    <div class="viz-tabs__viewport">
      <Transition name="viz" mode="out-in">
        <GitWorkflow v-if="activeTab === 'workflow'" key="workflow" :state="state" :last-action="state.lastAction" />
        <GitGraph v-else-if="activeTab === 'graph'" key="graph" :commits="state.commits" :branches="state.branches" :current-branch="state.currentBranch" :tags="state.tags" />
        <CommitTimeline v-else key="timeline" :commits="state.commits" :current-head="state.branches[state.currentBranch] || null" />
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.viz-tabs { border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink); border-radius: 0; background: transparent; overflow: hidden; }
.viz-tabs__buttons { flex: none; display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--border); }
.viz-tabs__buttons button { padding: 11px 6px; border: 0; border-right: 1px solid var(--border); background: transparent; color: var(--ink-faint); font-family: var(--serif-tc); font-size: 13px; cursor: pointer; }
.viz-tabs__buttons button:last-child { border-right: 0; }
.viz-tabs__buttons button.active { color: var(--primary); background: transparent; box-shadow: inset 0 -3px var(--primary); }
.viz-tabs__viewport { overflow: visible; }.viz-tabs__viewport :deep(.viz-section) { border: 0; border-radius: 0; }
.viz-enter-active,.viz-leave-active { transition: opacity 220ms ease, transform 220ms ease; }.viz-enter-from { opacity: 0; transform: translateY(4px); }.viz-leave-to { opacity: 0; }
@media(prefers-reduced-motion:reduce){.viz-enter-active,.viz-leave-active{transition:none}}
</style>
