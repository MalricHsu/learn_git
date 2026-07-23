<script setup>
defineProps({ achievement: { type: Object, required: true } });
defineEmits(["continue"]);
</script>
<template>
  <section class="achievement card">
    <p>成就解鎖</p>
    <h3>{{ achievement.zh }}</h3>
    <div>{{ achievement.messageZh }}</div>
    <button class="btn" @click="$emit('continue')">繼續前進 →</button>
  </section>
</template>
<style scoped>
.achievement { margin-top: 24px; padding: 28px; border: 2px solid var(--success); background: color-mix(in srgb, var(--success) 5%, var(--paper-2)); }
p { font-family: var(--serif-tc); color: var(--success); font-size: 12px; }
h3 { font-family: var(--serif-tc); font-weight: 900; font-size: 26px; margin: 10px 0 12px; }
div { font-family: var(--serif-tc); color: var(--ink-soft); line-height: 1.8; margin-bottom: 20px; }
</style>
