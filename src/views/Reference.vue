<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { categories, commands, byCategory, bySlug } from "../data/commands.js";
import { store, toggleFavorite, pushRecent, toast } from "../composables/useStore.js";

const route = useRoute();
const router = useRouter();
const query = ref("");

const current = computed(() => bySlug(route.params.cmd) || commands[0]);
const isFav = computed(() => store.favorites.includes(current.value.slug));
const currentCategory = computed(() => categories.find((category) => category.id === current.value.category));
const visibleCommands = computed(() => {
  const q = query.value.trim().toLowerCase();
  const source = q ? commands : byCategory(current.value.category);
  return source.filter((command) => !q || command.name.toLowerCase().includes(q) || command.tagline.zh.includes(q));
});
const relatedCmds = computed(() => current.value.related.map(bySlug).filter(Boolean));
const commandIndex = computed(() => commands.findIndex((item) => item.slug === current.value.slug));

watch(
  () => route.params.cmd,
  () => {
    if (current.value) pushRecent(current.value.slug);
  },
  { immediate: true },
);

onMounted(() => {
  if (!route.params.cmd) router.replace(`/reference/${commands[0].slug}`);
});

function fav() {
  toggleFavorite(current.value.slug);
  toast(
    isFav.value ? "Added to Favorites" : "Removed from Favorites",
    isFav.value ? `${current.value.name} · 已收藏` : `${current.value.name} · 已取消`,
    isFav.value ? "success" : "warn",
  );
}
function renderParts(parts) {
  return parts.map(([cls, text]) => (cls ? `<span class="tok-${cls}">${text}</span>` : text)).join("");
}
</script>

<template>
  <main class="wrap reference-book">
    <header class="book-header">
      <div><span>Git Reference</span><b>指令手冊</b></div>
      <label class="book-search">
        <span>搜尋</span>
        <input v-model="query" type="search" placeholder="搜尋指令" aria-label="搜尋指令" />
      </label>
    </header>

    <nav class="book-chapters" aria-label="全部章節">
      <RouterLink
        v-for="(category, index) in categories"
        :key="category.id"
        :to="`/reference/${byCategory(category.id)[0].slug}`"
        :class="{ active: category.id === current.category }"
      ><small>{{ String(index + 1).padStart(2, "0") }}</small><span>{{ category.en }}</span><b>{{ category.zh }}</b></RouterLink>
    </nav>

    <section class="book-command-nav">
      <header><span>本章指令</span><b>選擇指令閱讀</b></header>
      <nav class="book-command-strip" aria-label="章節指令">
        <RouterLink v-for="command in visibleCommands" :key="command.slug" :to="`/reference/${command.slug}`" :class="{ active: command.slug === current.slug }">
          <span>{{ command.name }}</span><small>{{ command.slug === current.slug ? "正在閱讀" : "開啟 →" }}</small>
        </RouterLink>
      </nav>
    </section>

    <header class="newspaper-title">
      <div class="newspaper-title__eyebrow"><span>{{ currentCategory?.en }} · {{ currentCategory?.zh }}</span><b>{{ String(commandIndex + 1).padStart(2, "0") }}</b></div>
      <div class="newspaper-title__main"><div><h1>{{ current.name }}</h1><p>{{ current.tagline.zh }}</p></div><div class="newspaper-title__tools"><span>{{ current.reads }} read</span><button class="icon-btn" :aria-pressed="isFav" :aria-label="isFav ? 'Remove favorite' : 'Add favorite'" @click="fav">{{ isFav ? "★" : "☆" }}</button></div></div>
    </header>

    <section class="book-spread">
      <article class="book-page book-page--left">
        <section class="book-lead-story"><span class="book-page__label">概念導讀</span><h2>核心概念</h2><p class="book-lead">{{ current.what.zh }}</p></section>
        <div class="book-left-bottom">
          <section><span class="book-page__label">使用時機</span><h2>什麼時候會用到</h2><p>{{ current.scenario?.zh || current.why.zh }}</p></section>
          <section class="book-workflow"><span class="book-page__label">運作原理</span><h2>Git 內部發生了什麼</h2><p>{{ current.internals?.zh || current.workflowNote?.zh || current.why.zh }}</p><div class="book-flow"><template v-for="(node, index) in current.workflow" :key="index"><div :class="{ active: node.active }">{{ node.zh }}</div><span v-if="index < current.workflow.length - 1">→</span></template></div></section>
        </div>
      </article>

      <article class="book-page book-page--right">
        <div class="book-practice-grid">
          <section><span class="book-page__label">常用寫法</span><h2>語法與用途</h2><div class="book-syntax"><div v-for="(syntax, index) in current.syntax" :key="index"><code>{{ syntax.code }}</code><p>{{ syntax.note.zh }}</p></div></div></section>
          <section class="book-terminal-section"><span class="book-page__label">實際操作</span><h2>在終端機試一次</h2><div class="codeblock book-terminal"><div class="codeblock__bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="label">終端機</span></div><pre><span v-for="(line, index) in current.example" :key="index" v-html="renderParts(line.parts) + '\n'"></span><em>{{ current.output }}</em></pre></div><p class="book-output-note">{{ current.outputNote?.zh || "這是 Git 執行指令後回傳的結果；確認內容是否符合你預期的操作。" }}</p></section>
        </div>
      </article>
      <footer class="book-footer-flex">
        <section><h3>容易踩到的坑</h3><ul class="book-mistakes"><li v-for="(mistake, index) in current.mistakes" :key="index">{{ mistake.zh }}</li></ul></section>
        <section><h3>接著可以學</h3><nav class="book-related"><RouterLink v-for="related in relatedCmds" :key="related.slug" :to="`/reference/${related.slug}`">{{ related.name }}<span>{{ related.tagline.zh }}</span></RouterLink></nav></section>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.reference-book { --book-body: 16px; padding-top: 16px; padding-bottom: 28px; }
.book-header { display: flex; justify-content: space-between; align-items: end; gap: 28px; padding: 0 0 10px; border-bottom: 3px double var(--ink); }
.book-header > div { display: flex; align-items: baseline; gap: 14px; font-family: var(--mono); font-size: 15px; letter-spacing: .14em; text-transform: uppercase; }
.book-header b { font-family: var(--serif-tc); font-size: 18px; letter-spacing: .04em; }
.book-search { display: flex; align-items: center; gap: 10px; font-family: var(--serif-tc); font-size: 14px; }
.book-search input { width: 210px; padding: 8px 4px; border: 0; border-bottom: 1px solid var(--ink); background: transparent; font-family: var(--mono); font-size: 14px; }
.book-chapters { display: grid; grid-template-columns: repeat(6,1fr); border-bottom: 1px solid var(--ink); }
.book-chapters a { display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; padding: 9px 12px; border-right: 1px solid var(--border); color: var(--ink-soft); }
.book-chapters a:last-child { border-right: 0; }
.book-chapters small { grid-row: 1 / 3; font-family: var(--mono); font-size: 14px; color: var(--ink-faint); }
.book-chapters span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--display); font-size: 15px; font-weight: 700; }
.book-chapters b { font-family: var(--serif-tc); font-size: 14px; font-weight: 400; color: var(--ink-faint); }
.book-chapters a.active { background: var(--secondary-2); color: var(--primary); }
.book-chapters a.active small { color: var(--warning); }
.book-command-nav { display: grid; grid-template-columns: 150px 1fr; align-items: stretch; border-bottom: 1px solid var(--ink); }
.book-command-nav > header { display: flex; flex-direction: column; justify-content: center; gap: 3px; padding: 9px 14px 9px 0; border-right: 1px solid var(--border); }
.book-command-nav > header span { font-family: var(--serif-tc); font-size: 16px; font-weight: 700; color: var(--ink); }
.book-command-nav > header b { font-family: var(--serif-tc); font-size: 14px; font-weight: 400; color: var(--ink-faint); }
.book-command-strip { display: flex; gap: 8px; overflow-x: auto; padding: 8px 0 8px 12px; }
.book-command-strip a { flex: none; display: flex; align-items: center; gap: 12px; min-width: 154px; padding: 8px 11px; border: 1px solid var(--border); background: var(--paper-2); font-family: var(--mono); color: var(--ink-soft); transition: border-color .18s,background .18s; }
.book-command-strip a > span { font-size: 15px; }
.book-command-strip a small { margin-left: auto; font-family: var(--serif-tc); font-size: 14px; color: var(--ink-faint); }
.book-command-strip a:hover { border-color: var(--primary); color: var(--primary); }
.book-command-strip a.active { border-color: var(--primary); background: var(--secondary-2); color: var(--primary); font-weight: 700; }
.book-command-strip a.active small { color: var(--primary); }
.newspaper-title { padding: 13px 22px 15px; border: 1px solid var(--border); border-bottom: 3px double var(--ink); background: var(--paper-2); }
.newspaper-title__eyebrow { display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-size: 14px; letter-spacing: .13em; color: var(--ink-faint); text-transform: uppercase; }
.newspaper-title__eyebrow b { font-family: var(--display); font-size: 28px; font-weight: 500; color: var(--secondary); }
.newspaper-title__main { display: flex; justify-content: space-between; align-items: end; gap: 28px; }
.newspaper-title h1 { margin: 2px 0 0; font-family: var(--mono); font-size: clamp(32px,3.7vw,48px); line-height: 1; color: var(--primary); }
.newspaper-title p { margin: 7px 0 0; font-family: var(--serif-tc); font-size: 19px; color: var(--ink); }
.newspaper-title__tools { display: flex; align-items: center; gap: 12px; font-family: var(--mono); font-size: 14px; letter-spacing: .1em; color: var(--ink-faint); text-transform: uppercase; }
.book-spread { position: relative; display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--border); border-top: 0; background: var(--paper-2); box-shadow: 0 24px 55px -42px rgba(35,66,51,.55); }
.book-page { min-width: 0; padding: 20px 26px 24px; }
.book-page section { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 3px double var(--ink); }
.book-page__label { display: block; margin-bottom: 7px; font-family: var(--mono); font-size: 14px; letter-spacing: .12em; color: var(--primary); text-transform: uppercase; }
.book-page h2 { margin: 0 0 8px; font-family: var(--display); font-size: 23px; }
.book-page h3 { margin: 0 0 6px; font-family: var(--display); font-size: 20px; }
.book-page p { margin: 0; font-family: var(--serif-tc); font-size: var(--book-body); line-height: 1.65; color: var(--ink-soft); }
.book-page .book-lead { font-size: var(--book-body); color: var(--ink); }
.book-practice-grid,.book-notes-grid,.book-left-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.book-left-bottom { grid-template-columns: 1fr; gap: 0; }
.book-lead-story .book-lead { max-width: 52ch; }
.book-left-bottom { padding-top: 16px; }
.book-left-bottom > section + section { margin-top: 0; }
.book-practice-grid { grid-template-columns: 1fr; gap: 0; }
.book-terminal-section { grid-column: 1 / -1; }
.book-page--left .book-workflow, .book-page--right .book-terminal-section { margin-bottom: 0; padding-bottom: 0; border-bottom: 0; }
.book-notes-grid { grid-template-columns: 1fr; gap: 0; }
.book-footer-flex { grid-column: 1 / -1; display: flex; border-top: 3px double var(--ink); border-bottom: 0; }
.book-footer-flex > section { flex: 1; padding: 18px 26px 20px; }
.book-footer-flex h3 { margin: 0 0 10px; font-family: var(--display); font-size: 20px; }
.editor-mark { margin-top: 34px; padding: 15px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); font-family: var(--serif-tc); font-size: 16px; color: var(--primary); }
.book-page blockquote { margin: 34px 0 0; padding: 18px 0 0; border-top: 3px double var(--ink); font-family: var(--serif-tc); font-size: 17px; line-height: 1.8; color: var(--ink-soft); }
.book-flow { display: flex; align-items: center; gap: 7px; margin-top: 10px; text-align: center; }
.book-flow div { flex: 1; padding: 7px 3px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); font-family: var(--serif-tc); font-size: 14px; }
.book-flow div.active { border-color: var(--primary); color: var(--primary); font-weight: 700; }
.book-flow span { color: var(--warning); font-size: 17px; }
.book-syntax > div { padding: 7px 0; border-top: 1px solid var(--border); }
.book-syntax code { font-family: var(--mono); font-size: var(--book-body); color: var(--primary); }
.book-syntax p { margin-top: 3px; font-size: var(--book-body); }
.book-terminal { margin-top: 4px; }
.book-terminal .codeblock__bar { padding: 7px 10px; }
.book-terminal pre { min-height: 104px; max-height: 150px; padding: 10px 12px; font-size: var(--book-body); line-height: 1.5; white-space: pre-wrap; overflow: auto; }
.book-terminal pre em { display: block; margin-top: 8px; color: var(--code-muted); font-style: normal; }
.book-output-note { margin-top: 16px !important; padding-left: 11px; border-left: 2px solid var(--secondary); font-size: var(--book-body) !important; line-height: 1.5 !important; }
.book-mistakes { list-style: none; margin: 0; padding: 0; }
.book-mistakes li { position: relative; padding: 7px 0 7px 20px; border-top: 1px solid var(--border); font-family: var(--serif-tc); font-size: var(--book-body); line-height: 1.5; }
.book-mistakes li::before { content: "×"; position: absolute; left: 0; color: var(--danger); font-weight: 700; }
.book-related { display: flex; flex-wrap: wrap; gap: 10px; }
.book-related a { display: inline-flex; align-items: center; padding: 9px 14px; border: 1px solid var(--primary); background: var(--paper); font-family: var(--mono); font-size: var(--book-body); color: var(--primary); transition: background .18s,color .18s; }
.book-related a:hover { background: var(--primary); color: var(--paper); }
.book-related span { display: none; }
.turn-enter-active,.turn-leave-active { transition: opacity .2s ease,transform .2s ease; }
.turn-enter-from { opacity: 0; transform: translateX(16px); }.turn-leave-to { opacity: 0; transform: translateX(-16px); }
@media (max-width: 760px) {
  .reference-book { height: auto; min-height: 0; overflow: visible; }
  .book-header { align-items: stretch; flex-direction: column; }
  .book-search input { flex: 1; width: auto; }
  .book-chapters { display: flex; overflow-x: auto; }
  .book-chapters a { flex: 0 0 170px; }
  .book-command-nav { grid-template-columns: 1fr; }
  .book-command-nav > header { border-right: 0; border-bottom: 1px solid var(--border); }
  .book-spread { grid-template-columns: 1fr; }
  .book-page { padding: 30px 24px; }
  .book-page + .book-page { border-top: 1px solid var(--border); }
  .newspaper-title__main { align-items: flex-start; flex-direction: column; }
  .book-practice-grid,.book-notes-grid,.book-left-bottom { grid-template-columns: 1fr; }
  .book-left-bottom > section + section { padding-top: 0; border-left: 0; }
  .book-related { grid-template-columns: 1fr; }
  .book-footer-flex { flex-direction: column; }
  .book-footer-flex > section + section { border-top: 1px solid var(--border); }
}
@media (prefers-reduced-motion: reduce) { .turn-enter-active,.turn-leave-active { transition: none; } }
</style>
