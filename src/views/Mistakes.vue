<script setup>
import { RouterLink } from "vue-router";
import { store, resolveMistake, clearMistakes } from "../composables/useStore.js";
import { bySlug } from "../data/commands.js";

const articleSlug = (cmd) => {
  const slug = cmd.replace(/ /g, "-");
  return bySlug(slug) ? slug : null;
};
const formatDate = (value) => new Intl.DateTimeFormat("zh-TW", {
  month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
}).format(new Date(value));
</script>

<template>
  <div class="wrap library-page mistake-journal">
    <header class="library-masthead">
      <div>
        <h1>錯題簿</h1>
      </div>
      <div v-if="store.mistakes.length" class="journal-actions">
        <RouterLink class="btn" to="/practice?mode=mistakes">重新練習錯題 →</RouterLink>
        <button type="button" @click="clearMistakes">清空錯題</button>
      </div>
    </header>

    <section v-if="store.mistakes.length" class="journal-list">
      <article v-for="(mistake, index) in store.mistakes" :key="mistake.id" class="journal-entry">
        <aside>
          <span>第 {{ index + 1 }} 題</span>
          <b>{{ mistake.mode === "choice" ? "選擇題" : "手寫題" }}</b>
          <small>答錯 {{ mistake.count }} 次</small>
          <small>{{ formatDate(mistake.answeredAt) }}</small>
        </aside>
        <div class="journal-entry__body">
          <p class="journal-command">{{ mistake.cmd }}</p>
          <h2>{{ mistake.scenario }}</h2>
          <div class="answer-comparison">
            <div><span>你的答案</span><code>{{ mistake.given }}</code></div>
            <div><span>正確答案</span><code>{{ mistake.solution }}</code></div>
          </div>
          <div class="journal-explanation">
            <span>說明</span>
            <p>{{ mistake.explanation }}</p>
          </div>
        </div>
        <footer>
          <RouterLink v-if="articleSlug(mistake.cmd)" :to="`/reference/${articleSlug(mistake.cmd)}`">閱讀手冊 →</RouterLink>
          <button type="button" @click="resolveMistake(mistake.id)">標記為已掌握</button>
        </footer>
      </article>
    </section>

    <section v-else class="library-empty">
      <h2>錯題簿目前是空的</h2>
      <p>練習時答錯的題目會自動保存在這裡，並附上正解與中文說明。</p>
      <RouterLink class="btn" to="/practice">開始練習 →</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.library-page { padding-top: 34px; padding-bottom: 96px; min-height: 70vh; }
.library-masthead { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 20px 40px; padding-bottom: 16px; border-bottom: 1px solid var(--ink); }
.library-masthead h1 { margin: 0; font-family: var(--serif-tc); font-weight: 900; font-size: clamp(24px, 3vw, 34px); line-height: 1.1; }
.journal-actions { display: flex; align-items: center; gap: 22px; }
.journal-actions > button { padding: 0; border: 0; background: none; font-family: var(--serif-tc); font-size: 14px; color: var(--ink-faint); cursor: pointer; transition: color .18s; }
.journal-actions > button:hover { color: var(--danger); }

.journal-entry { display: grid; grid-template-columns: 120px minmax(0, 1fr) 130px; gap: 32px; padding: 32px 0; border-bottom: 1px solid var(--border); }
.journal-entry aside { display: flex; flex-direction: column; gap: 6px; }
.journal-entry aside span { font-family: var(--mono); font-size: 12px; color: var(--ink-faint); }
.journal-entry aside b { font-family: var(--serif-tc); font-size: 15px; font-weight: 700; }
.journal-entry aside small { font-family: var(--mono); font-size: 11px; color: var(--ink-faint); }
.journal-command { margin: 0; font-family: var(--mono); font-size: 14px; color: var(--primary); }
.journal-entry h2 { margin: 8px 0 20px; font-family: var(--serif-tc); font-size: 19px; font-weight: 700; line-height: 1.7; }
.answer-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 16px 0; border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); }
.answer-comparison > div { display: flex; flex-direction: column; gap: 7px; }
.answer-comparison span, .journal-explanation span { font-family: var(--serif-tc); font-size: 12px; color: var(--ink-faint); }
.answer-comparison code { font-family: var(--mono); font-size: 14px; }
.answer-comparison > div:first-child code { color: var(--danger); }
.answer-comparison > div:last-child code { color: var(--success); }
.journal-explanation { padding-top: 16px; }
.journal-explanation p { margin: 6px 0 0; font-family: var(--serif-tc); font-size: 14px; line-height: 1.9; color: var(--ink-soft); }
.journal-entry footer { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }
.journal-entry footer a { font-family: var(--serif-tc); font-size: 14px; color: var(--primary); }
.journal-entry footer button { padding: 0; border: 0; background: none; font-family: var(--serif-tc); font-size: 13px; color: var(--ink-faint); cursor: pointer; transition: color .18s; }
.journal-entry footer button:hover { color: var(--success); }

.library-empty { max-width: 46ch; margin: 72px 0 0; }
.library-empty h2 { margin: 0 0 12px; font-family: var(--serif-tc); font-weight: 900; font-size: 26px; }
.library-empty > p { margin: 0 0 28px; font-family: var(--serif-tc); font-size: 15px; line-height: 1.9; color: var(--ink-soft); }
@media (max-width: 800px) {
  .journal-entry { grid-template-columns: 1fr; gap: 18px; }
  .journal-entry footer { align-items: flex-start; flex-direction: row; justify-content: space-between; }
  .answer-comparison { grid-template-columns: 1fr; gap: 14px; }
}
</style>
