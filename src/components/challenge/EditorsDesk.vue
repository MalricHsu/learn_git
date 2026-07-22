<script setup>
defineProps({ content: { type: Object, required: true } });
</script>
<template>
  <section class="desk" :class="`desk--${content.tone}`">
    <header><b>編輯室</b></header>
    <Transition name="desk-copy" mode="out-in">
      <div :key="`${content.title}-${content.whatHappened}`" class="desk__copy">
        <h3 v-if="content.tone !== 'intro'">{{ content.title }}</h3>
        <dl>
          <div><dt>發生了什麼</dt><dd>{{ content.whatHappened }}</dd></div>
          <div><dt>為什麼重要</dt><dd>{{ content.whyItMatters }}</dd></div>
          <div><dt>常見誤解</dt><dd>{{ content.misconception }}</dd></div>
        </dl>
      </div>
    </Transition>
  </section>
</template>
<style scoped>
.desk{flex:none;padding:10px 6px 11px 15px;border:0;border-top:1px solid var(--border);border-bottom:1px solid var(--ink);border-left:3px solid var(--primary);background:transparent}.desk--warning{border-left-color:var(--danger)}.desk--warning header,.desk--warning dt{color:var(--danger)}header{font-family:var(--mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--primary)}header b{font-family:var(--serif-tc);font-weight:400}h3{font-family:var(--display);font-size:18px;margin:7px 0 5px}dl{margin:0}dl div{padding:3px 0}dt{display:inline;font-family:var(--mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--primary)}dt::after{content:"　"}dd{display:inline;margin:0;font-family:var(--serif-tc);font-size:12px;line-height:1.65;color:var(--ink-soft)}
.desk-copy-enter-active,.desk-copy-leave-active{transition:opacity 240ms ease,transform 240ms ease}.desk-copy-enter-from{opacity:0;transform:translateY(6px)}.desk-copy-leave-to{opacity:0;transform:translateY(-4px)}
@media(prefers-reduced-motion:reduce){.desk-copy-enter-active,.desk-copy-leave-active{transition:none}}
</style>
