<script setup>
defineProps({ content: { type: Object, required: true } });
</script>
<template>
  <section class="desk" :class="`desk--${content.tone}`">
    <header><span>Editor's Desk</span><b>編輯室</b></header>
    <h3>{{ content.title }}</h3>
    <dl>
      <div><dt>發生了什麼</dt><dd>{{ content.whatHappened }}</dd></div>
      <div><dt>為什麼重要</dt><dd>{{ content.whyItMatters }}</dd></div>
      <div><dt>常見誤解</dt><dd>{{ content.misconception }}</dd></div>
    </dl>
  </section>
</template>
<style scoped>
.desk{padding:26px;border:1px solid var(--border);border-left:5px solid var(--primary);border-radius:2px 12px 12px 2px;background:var(--secondary-2);box-shadow:var(--shadow)}.desk--warning{border-left-color:var(--warning)}header{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--primary)}header b{font-family:var(--serif-tc);font-weight:400}h3{font-family:var(--display);font-size:25px;margin:20px 0}dl{margin:0}dl div{padding:13px 0;border-top:1px solid var(--border)}dt{font-family:var(--mono);font-size:9px;letter-spacing:.1em;color:var(--ink-faint)}dd{margin:6px 0 0;font-family:var(--serif-tc);font-size:13px;line-height:1.7;color:var(--ink-soft)}
</style>
