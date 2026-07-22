<script setup>
defineProps({ commits: { type: Array, required: true }, currentHead: { type: String, default: null } });
</script>
<template>
  <section class="viz-section timeline">
    <header><b>提交時間軸</b></header>
    <p v-if="!commits[0]" class="empty">尚未建立 Commit。第一個版本會出現在這裡。</p>
    <TransitionGroup v-else name="commit" tag="ol">
      <li v-for="commit in [...commits].reverse()" :key="commit.hash">
        <time>{{ commit.timestamp }}</time>
        <div><b>{{ commit.message }}</b><code>{{ commit.hash }}</code><small>{{ commit.branch }} <em v-if="commit.hash === currentHead">HEAD</em></small></div>
      </li>
    </TransitionGroup>
  </section>
</template>
<style scoped>
.viz-section{padding:16px;border:0;border-radius:0;background:transparent}header{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase}header b{font-family:var(--serif-tc);font-weight:400}.empty{font-family:var(--serif-tc);color:var(--ink-faint);font-size:11px;margin:14px 0 0}ol{list-style:none;margin:12px 0 0;padding:0}li{display:grid;grid-template-columns:42px 1fr;gap:10px;padding:9px 0;border-top:1px solid var(--border)}time,code,small{font-family:var(--mono);font-size:9px;color:var(--ink-faint)}li b{display:block;font-family:var(--display);font-size:13px;margin-bottom:3px}code{margin-right:8px;color:var(--warning)}em{font-style:normal;color:var(--primary)}.commit-enter-active{transition:all 260ms ease}.commit-enter-from{opacity:0;transform:translateY(-8px)}@media(prefers-reduced-motion:reduce){.commit-enter-active{transition:none}}
</style>
