<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { store } from "../composables/useStore.js";
import { bySlug } from "../data/commands.js";
import { challenges, chapters } from "../data/challenges.js";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const completed = computed(() => store.completedMissions.length);
const progress = computed(() =>
  Math.round((completed.value / challenges.length) * 100),
);
const nextChallenge = computed(
  () =>
    challenges.find((item) => !store.completedMissions.includes(item.id)) ||
    challenges[0],
);
const feature = bySlug("git-init");
</script>

<template>
  <div class="home">
    <header class="masthead">
      <div class="wrap">
        <div class="masthead__meta">
          <span>Issue No.001 · 創刊號</span><span>{{ today }}</span
          ><span>Interactive Morning Edition</span>
        </div>
        <div class="masthead__title">
          <h1>Git Daily</h1>
          <p>像閱讀每日報紙一樣學習 Git</p>
        </div>
      </div>
    </header>

    <main class="wrap front-page">
      <section class="front-page__lead">
        <article class="lead-story reveal">
          <p class="section-label"><span>Front Page</span><b>今日頭版</b></p>
          <h2>Learn Git by watching ideas become history.</h2>
          <p class="lead-story__zh">
            看著檔案移動、版本誕生、分支交會，真正理解 Git。
          </p>
          <p class="lead-story__deck">
            Git Daily 是一本可以玩的 Git
            教科書。每次輸入指令，工作流程、提交歷史與分支圖都會立即回應，讓你從變化中理解，而不是死背語法。
          </p>
          <div class="lead-story__actions">
            <RouterLink to="/game" class="btn btn--lg">{{
              completed ? "繼續闖關" : "開始第一關"
            }}</RouterLink>
          </div>
        </article>

        <aside class="continue-panel reveal">
          <header><span>Continue Reading</span><b>繼續學習</b></header>
          <p class="continue-panel__number">
            {{ String(nextChallenge.no).padStart(2, "0") }}
          </p>
          <small>Next Challenge · 下一關</small>
          <h3>{{ nextChallenge.title.en }}</h3>
          <p>{{ nextChallenge.title.zh }}</p>
          <blockquote>{{ nextChallenge.summary.zh }}</blockquote>
          <div class="continue-panel__progress">
            <span>{{ completed }} / {{ challenges.length }} completed</span
            ><span>{{ progress }}%</span>
          </div>
          <div class="progress">
            <div class="progress__bar" :style="{ width: progress + '%' }"></div>
          </div>
          <RouterLink to="/game" class="continue-panel__link"
            >繼續闖關 <span>→</span></RouterLink
          >
        </aside>
      </section>

      <section class="today-lesson reveal">
        <header class="edition-heading">
          <div><span>Today's Lesson</span><b>今日一課</b></div>
          <small>01 · Git Foundations</small>
        </header>
        <article class="lesson-layout">
          <div class="lesson-copy">
            <p class="eyebrow">Start Here · 從這裡開始</p>
            <RouterLink :to="`/reference/${feature.slug}`"
              ><h3>{{ feature.name }}</h3></RouterLink
            >
            <p class="lesson-copy__zh">{{ feature.tagline.zh }}</p>
            <p>{{ feature.what.zh }}</p>
            <RouterLink
              :to="`/reference/${feature.slug}`"
              class="btn btn--ghost"
              >閱讀完整教學</RouterLink
            >
          </div>
          <div class="lesson-terminal">
            <div class="lesson-terminal__bar">
              <i></i><i></i><i></i><span>gitdaily — zsh</span>
            </div>
            <pre><code><b>$</b> <span>git</span> init<br><em>Initialized empty Git repository in /project/.git/</em></code></pre>
          </div>
        </article>
      </section>

      <section class="chapter-editions reveal">
        <header class="edition-heading">
          <div><span>Chapter Editions</span><b>學習章節</b></div>
          <p>從第一個版本，到安全整理歷史。</p>
        </header>
        <div class="chapter-editions__grid">
          <RouterLink
            v-for="chapter in chapters"
            :key="chapter.id"
            to="/game"
            class="chapter-edition"
            ><span>CHAPTER {{ String(chapter.number).padStart(2, "0") }}</span>
            <h3>{{ chapter.title.en }}</h3>
            <p>{{ chapter.title.zh }}</p>
            <small
              >{{
                challenges.filter((item) => item.chapter === chapter.id).length
              }}
              Challenges</small
            ></RouterLink
          >
        </div>
      </section>

      <section class="reference-invitation reveal">
        <div>
          <span>Git Reference</span>
          <h2>需要查指令時，再翻開手冊。</h2>
        </div>
        <RouterLink to="/reference" class="btn btn--ghost btn--lg"
          >瀏覽完整手冊</RouterLink
        >
      </section>
    </main>
  </div>
</template>

<style scoped>
.masthead__title p {
  margin: 0 0 6px;
  font-family: var(--serif-tc);
  font-size: 18px;
  color: var(--ink-soft);
}
.masthead__meta {
  font-size: 14px;
}
.front-page .btn {
  font-size: 16px;
}
.front-page {
  padding-top: 34px;
  padding-bottom: 80px;
}
.front-page__lead {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.75fr);
  gap: 54px;
  padding-bottom: 42px;
  border-bottom: 3px double var(--ink);
}
.section-label,
.edition-heading > div {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 0;
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.section-label b,
.edition-heading b {
  font-family: var(--serif-tc);
  font-size: 16px;
  letter-spacing: 0.04em;
}
.lead-story h2 {
  max-width: 760px;
  margin: 20px 0 10px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(40px, 4.2vw, 56px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.035em;
}
.lead-story__zh {
  margin: 20px 0 0;
  font-family: var(--serif-tc);
  font-size: clamp(20px, 2vw, 28px);
  color: var(--primary);
  font-weight: 700;
}
.lead-story__deck {
  max-width: 54ch;
  margin: 22px 0 0;
  font-family: var(--serif-tc);
  font-size: 18px;
  line-height: 1.9;
  color: var(--ink-soft);
  font-weight: 700;
}
.lead-story__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
}
.text-link {
  font-family: var(--mono);
  font-size: 16px;
  letter-spacing: 0.06em;
  color: var(--primary);
  border-bottom: 1px solid var(--secondary);
  padding-bottom: 3px;
}
.continue-panel {
  align-self: end;
  padding: 20px 22px 16px;
  border: 1px solid var(--border);
  border-top: 4px double var(--ink);
  background: var(--paper-2);
  box-shadow: 0 16px 38px -28px rgba(35, 66, 51, 0.45);
}
.continue-panel header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.continue-panel header b {
  font-family: var(--serif-tc);
  font-weight: 400;
}
.continue-panel__number {
  float: right;
  margin: 14px 0 0 16px;
  font-family: var(--display);
  font-size: 58px;
  line-height: 0.8;
  color: var(--secondary);
}
.continue-panel > small {
  display: block;
  margin-top: 18px;
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
}
.continue-panel h3 {
  margin: 6px 0 2px;
  font-family: var(--display);
  font-size: 28px;
}
.continue-panel > p:not(.continue-panel__number) {
  margin: 0;
  font-family: var(--serif-tc);
  font-size: 18px;
  color: var(--primary);
}
.continue-panel blockquote {
  clear: both;
  margin: 18px 0 16px;
  padding: 12px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  font-family: var(--serif-tc);
  font-size: 17px;
  line-height: 1.7;
  color: var(--ink-soft);
}
.continue-panel__progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--ink-faint);
}
.continue-panel__link {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 0 2px;
  border-top: 3px double var(--ink);
  font-family: var(--serif-tc);
  font-size: 18px;
  color: var(--primary);
  font-weight: 700;
}
.today-lesson,
.chapter-editions {
  padding: 42px 0;
  border-bottom: 1px solid var(--ink);
}
.edition-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 13px;
  border-bottom: 2px solid var(--ink);
}
.edition-heading > p,
.edition-heading > small {
  margin: 0;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--ink-faint);
}
.lesson-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  gap: 48px;
  align-items: center;
  padding: 34px 0 4px;
}
.lesson-copy h3 {
  margin: 12px 0 3px;
  font-family: var(--mono);
  font-size: 36px;
  color: var(--primary);
}
.lesson-copy__zh {
  font-family: var(--serif-tc);
  font-size: 20px;
  color: var(--ink);
}
.lesson-copy > p:last-of-type {
  max-width: 48ch;
  margin-bottom: 24px;
  font-size: 18px;
  line-height: 1.8;
  color: var(--ink-soft);
}
.lesson-terminal {
  overflow: hidden;
  border: 1px solid var(--code-line);
  border-radius: 8px;
  background: var(--terminal-bg);
  box-shadow: var(--shadow);
}
.lesson-terminal__bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--code-line);
}
.lesson-terminal__bar i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--danger);
}
.lesson-terminal__bar i:nth-child(2) {
  background: var(--warning);
}
.lesson-terminal__bar i:nth-child(3) {
  background: var(--success);
}
.lesson-terminal__bar span {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.12em;
  color: var(--ink-faint);
}
.lesson-terminal pre {
  margin: 0;
  min-height: 145px;
  padding: 32px;
  background: var(--terminal-bg);
  color: var(--code-fg);
  font-family: var(--mono);
  font-size: 16px;
  line-height: 2;
}
.lesson-terminal pre b {
  color: var(--success);
}
.lesson-terminal pre span {
  color: var(--warning);
}
.lesson-terminal pre em {
  color: var(--ink-faint);
  font-style: normal;
}
.chapter-editions__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-left: 1px solid var(--border);
}
.chapter-edition {
  min-height: 160px;
  padding: 24px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}
.chapter-edition:hover {
  background: var(--secondary-2);
}
.chapter-edition > span,
.chapter-edition small {
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
}
.chapter-edition h3 {
  margin: 18px 0 3px;
  font-family: var(--display);
  font-size: 26px;
}
.chapter-edition p {
  margin: 0 0 18px;
  font-family: var(--serif-tc);
  font-size: 17px;
  color: var(--primary);
}
.reference-invitation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 42px 0;
  border-bottom: 3px double var(--ink);
}
.reference-invitation span {
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.12em;
  color: var(--primary);
}
.reference-invitation h2 {
  margin: 7px 0 0;
  font-family: var(--serif-tc);
  font-size: 28px;
  font-weight: 600;
}
@media (max-width: 900px) {
  .front-page__lead,
  .lesson-layout {
    grid-template-columns: 1fr;
  }
  .front-page__lead {
    gap: 38px;
  }
  .continue-panel {
    width: 100%;
  }
  .chapter-editions__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .front-page {
    padding-top: 24px;
  }
  .lead-story h2 {
    font-size: 40px;
  }
  .lead-story__actions,
  .edition-heading,
  .reference-invitation {
    align-items: flex-start;
    flex-direction: column;
  }
  .chapter-editions__grid {
    grid-template-columns: 1fr;
  }
  .chapter-edition {
    min-height: 130px;
  }
  .lesson-terminal pre {
    min-height: 120px;
    padding: 22px;
    font-size: 16px;
  }
}
</style>
