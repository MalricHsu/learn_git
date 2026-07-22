<script setup>
import VisualizationTabs from "./VisualizationTabs.vue";
defineProps({ state: { type: Object, required: true }, challenge: { type: Object, required: true } });
</script>
<template>
  <aside class="visualization">
    <div class="visualization__title"><b>Git 視覺化</b></div>
    <VisualizationTabs :state="state" />
  </aside>
</template>
<style scoped>
.visualization{display:flex;flex-direction:column;gap:10px}.visualization__title{flex:none;display:flex;justify-content:flex-start;align-items:baseline;padding-bottom:10px;border-bottom:2px solid var(--ink);font-family:var(--mono);font-size:11px;letter-spacing:.13em;text-transform:uppercase}.visualization__title b{font-family:var(--serif-tc);font-size:14px;letter-spacing:.04em}@media(max-width:1080px){.visualization{height:auto}}
</style>
