<script setup>
defineProps({ achievement: { type: Object, required: true } });
defineEmits(["continue"]);
</script>
<template>
  <section class="achievement card">
    <p>Achievement Unlocked <span>成就解鎖</span></p>
    <h3>{{ achievement.en }}</h3>
    <h4>{{ achievement.zh }}</h4>
    <div>{{ achievement.messageEn }}<br /><span>{{ achievement.messageZh }}</span></div>
    <button class="btn" @click="$emit('continue')">繼續前進 →</button>
  </section>
</template>
<style scoped>
.achievement { margin-top: 24px; padding: 28px; border: 2px solid var(--success); background: color-mix(in srgb, var(--success) 5%, var(--paper-2)); }
p { font-family: var(--mono); color: var(--success); letter-spacing: .12em; text-transform: uppercase; font-size: 10px; } p span { margin-left: 8px; }
h3 { font-family: var(--display); font-size: 30px; margin: 14px 0 2px; } h4 { font-family: var(--serif-tc); margin: 0 0 14px; font-size: 17px; }
div { color: var(--ink-soft); line-height: 1.7; margin-bottom: 20px; } div span { font-family: var(--serif-tc); }
</style>
