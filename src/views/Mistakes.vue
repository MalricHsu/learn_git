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
        <p class="library-kicker">Learning Record · 學習紀錄</p>
        <h1>Mistake Journal <span>錯題簿</span></h1>
      </div>
      <div v-if="store.mistakes.length" class="journal-actions">
        <RouterLink class="btn" to="/practice?mode=mistakes">重新練習錯題 →</RouterLink>
        <button type="button" @click="clearMistakes">清空錯題</button>
      </div>
    </header>

    <section v-if="store.mistakes.length" class="journal-list">
      <article v-for="(mistake, index) in store.mistakes" :key="mistake.id" class="journal-entry">
        <aside>
          <span>ERROR {{ String(index + 1).padStart(2, "0") }}</span>
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
            <span>中文解釋</span>
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
      <p class="library-kicker">No corrections today · 今日沒有訂正</p>
      <h2>錯題簿目前是空的</h2>
      <p>練習時答錯的題目會自動保存在這裡，並附上正解與中文說明。</p>
      <RouterLink class="btn" to="/practice">開始練習 →</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.library-page { padding: 20px 0 56px; min-height: 70vh; }
.library-masthead { display: flex; justify-content: space-between; align-items: end; gap: 32px; padding: 10px 0 14px; border-top: 4px double var(--ink); border-bottom: 4px double var(--ink); }
.library-kicker { color: var(--primary); font-family: var(--mono); font-size: 14px; letter-spacing: .18em; text-transform: uppercase; }
.library-masthead h1 { margin: 5px 0 0; font-family: var(--display); font-size: clamp(32px, 3vw, 44px); line-height: 1; }
.library-masthead h1 span { display: inline-block; margin-left: 16px; font-family: var(--serif); font-size: .42em; font-weight: 500; }
.journal-actions { display: flex; align-items: center; gap: 20px; }
.journal-actions > button { border: 0; border-bottom: 1px solid var(--border); background: none; color: var(--ink-soft); font-size: 15px; cursor: pointer; }
.journal-list { border-bottom: 4px double var(--ink); }
.journal-entry { display: grid; grid-template-columns: 130px 1fr 145px; gap: 24px; padding: 18px 0; border-bottom: 1px solid var(--ink); }
.journal-entry aside { display: flex; flex-direction: column; gap: 7px; font-family: var(--mono); }
.journal-entry aside span { color: var(--accent); font-size: 14px; letter-spacing: .12em; }
.journal-entry aside b { font-size: 16px; }
.journal-entry aside small { color: var(--ink-faint); font-size: 14px; }
.journal-command { color: var(--primary); font: 700 17px var(--mono); }
.journal-entry h2 { margin: 8px 0 20px; font-family: var(--serif); font-size: 25px; line-height: 1.5; }
.answer-comparison { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.answer-comparison > div { display: flex; flex-direction: column; gap: 8px; padding: 16px 20px; }
.answer-comparison > div + div { border-left: 1px solid var(--border); }
.answer-comparison span, .journal-explanation span { color: var(--ink-faint); font-size: 14px; }
.answer-comparison code { font-size: 16px; }
.journal-explanation { padding-top: 16px; }
.journal-explanation p { margin-top: 7px; color: var(--ink-soft); font-family: var(--serif); font-size: 16px; line-height: 1.7; }
.journal-entry footer { display: flex; flex-direction: column; align-items: flex-end; gap: 16px; }
.journal-entry footer a { color: var(--primary); font-size: 15px; font-weight: 700; }
.journal-entry footer button { border: 0; border-bottom: 1px solid var(--border); background: none; color: var(--ink-soft); font-size: 14px; cursor: pointer; }
.library-empty { max-width: 720px; margin: 80px auto 0; padding: 44px; border: 1px solid var(--border); border-top: 4px double var(--ink); background: var(--paper-2); text-align: center; }
.library-empty h2 { margin: 14px 0; font-family: var(--display); font-size: 38px; }
.library-empty > p:not(.library-kicker) { margin-bottom: 28px; color: var(--ink-soft); font-family: var(--serif); font-size: 17px; }
@media (max-width: 800px) {
  .library-masthead { align-items: flex-start; flex-direction: column; }
  .journal-entry { grid-template-columns: 1fr; gap: 18px; }
  .journal-entry footer { align-items: flex-start; flex-direction: row; justify-content: space-between; }
  .answer-comparison { grid-template-columns: 1fr; }
  .answer-comparison > div + div { border-top: 1px solid var(--border); border-left: 0; }
}
</style>
