<script setup>
import { computed } from "vue";
import GitWorkflow from "./GitWorkflow.vue";
import GitGraph from "./GitGraph.vue";
import CommitTimeline from "./CommitTimeline.vue";
import EditorsDesk from "./EditorsDesk.vue";
import { gitTeaching } from "../../data/gitTeaching.js";
import { resolveEditorsDesk } from "../../composables/useEditorsDesk.js";
const props = defineProps({ state: { type: Object, required: true }, challenge: { type: Object, required: true } });
const desk = computed(() => resolveEditorsDesk(props.challenge, props.state.lastAction, gitTeaching));
const currentHead = computed(() => props.state.branches[props.state.currentBranch] || null);
</script>
<template>
  <aside class="visualization">
    <div class="visualization__title"><span>Git Visualization</span><b>Git 視覺化</b></div>
    <GitWorkflow :state="state" :last-action="state.lastAction" />
    <GitGraph :commits="state.commits" :branches="state.branches" :current-branch="state.currentBranch" :tags="state.tags" />
    <CommitTimeline :commits="state.commits" :current-head="currentHead" />
    <EditorsDesk :content="desk" />
  </aside>
</template>
<style scoped>
.visualization{display:flex;flex-direction:column;gap:18px;position:sticky;top:78px}.visualization__title{padding-bottom:16px;border-bottom:2px solid var(--ink);font-family:var(--mono);font-size:11px;letter-spacing:.13em;text-transform:uppercase}.visualization__title b{display:block;margin-top:5px;font-family:var(--serif-tc);font-size:14px;letter-spacing:.04em}@media(max-width:1080px){.visualization{position:static}}
</style>
