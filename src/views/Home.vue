<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { store } from "../composables/useStore.js";
import { challenges, chapters } from "../data/challenges.js";

const today = new Date().toLocaleDateString("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
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
// The chapter the reader is standing in — drawn as HEAD on the commit spine.
const headChapter = computed(() => nextChallenge.value.chapter);
const countOf = (id) => challenges.filter((item) => item.chapter === id).length;
// Jump straight to a chapter — its first challenge, or the furthest one the
// reader has already reached inside it.
function entryOf(chapterId) {
  const inChapter = challenges.filter((item) => item.chapter === chapterId);
  const open = inChapter.find(
    (item) => !store.completedMissions.includes(item.id),
  );
  return (open || inChapter[0]).id;
}

/* The one animated moment on the page: the demo types itself, answers, holds,
   then starts over. It only runs while actually on screen, and not at all when
   the reader has asked for reduced motion. */
const COMMAND = "git init";
const TYPE_DELAY = 90;
const ANSWER_PAUSE = 450;
const HOLD = 3200;

const typed = ref("");
const answered = ref(false);
const demoEl = ref(null);
let timers = [];
let observer = null;
let running = false;

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function cycle() {
  clearTimers();
  typed.value = "";
  answered.value = false;
  const typedAt = 300 + COMMAND.length * TYPE_DELAY;
  COMMAND.split("").forEach((char, i) => {
    timers.push(setTimeout(() => (typed.value += char), 300 + i * TYPE_DELAY));
  });
  timers.push(setTimeout(() => (answered.value = true), typedAt + ANSWER_PAUSE));
  timers.push(setTimeout(cycle, typedAt + ANSWER_PAUSE + HOLD));
}

function start() {
  if (running) return;
  running = true;
  cycle();
}

function stop() {
  running = false;
  clearTimers();
}

onMounted(() => {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || !("IntersectionObserver" in window)) {
    typed.value = COMMAND;
    answered.value = true;
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
    },
    { threshold: 0.55 },
  );
  if (demoEl.value) observer.observe(demoEl.value);
});

onBeforeUnmount(() => {
  clearTimers();
  observer?.disconnect();
});
</script>

<template>
  <div class="home">
    <header class="masthead">
      <div class="wrap">
        <div class="masthead__meta">
          <span>第 001 號</span><span>{{ today }}</span
          ><span>互動晨報</span>
        </div>
        <div class="masthead__title">
          <h1>Git Daily</h1>
          <p>像閱讀每日報紙一樣學習 Git</p>
        </div>
      </div>
    </header>

    <main class="wrap front">
      <section class="hero">
        <div class="hero__story">
          <h2>看著想法變成歷史。</h2>
          <p class="hero__en">Learn Git by watching ideas become history.</p>
          <p class="hero__deck">
            每輸入一個指令，工作流程、提交歷史與分支圖都會立刻回應。你是從變化裡看懂
            Git，而不是背下語法。
          </p>
          <div class="hero__actions">
            <RouterLink to="/reference" class="btn btn--ghost btn--lg"
              >翻開手冊</RouterLink
            >
            <RouterLink to="/game" class="btn btn--lg">{{
              completed ? "繼續闖關" : "開始第一關"
            }}</RouterLink>
          </div>
        </div>

        <RouterLink
          class="hero__next"
          :to="{ path: '/game', query: { c: nextChallenge.id } }"
        >
          <p class="hero__next-label">下一關</p>
          <p class="hero__next-no">{{ nextChallenge.code }}</p>
          <h3>{{ nextChallenge.title.zh }}</h3>
          <p class="hero__next-en">{{ nextChallenge.title.en }}</p>
          <div class="hero__meter">
            <div :style="{ width: progress + '%' }"></div>
          </div>
          <p class="hero__next-stat">
            已完成 {{ completed }} / {{ challenges.length }} 關
          </p>
        </RouterLink>
      </section>

      <section class="demo reveal">
        <div ref="demoEl" class="demo__terminal">
          <pre><code><b>$</b> <span>{{ typed.slice(0, 3) }}</span>{{ typed.slice(3)
            }}<i v-if="!answered" class="demo__caret"></i><template v-if="answered">
<em>Initialized empty Git repository in /project/.git/</em>
<b>$</b> <i class="demo__caret"></i></template></code></pre>
        </div>
        <p class="demo__caption">一行指令，一個資料夾就此擁有記憶。</p>
      </section>

      <section class="log reveal">
        <h2 class="log__title">七章，三十八關</h2>
        <ol class="log__list">
          <li
            v-for="chapter in chapters"
            :key="chapter.id"
            class="log__item"
            :class="{ 'is-head': chapter.id === headChapter }"
          >
            <RouterLink
              :to="{ path: '/game', query: { c: entryOf(chapter.id) } }"
            >
              <span class="log__ref">CH{{ chapter.number }}</span>
              <span class="log__name">
                <b>{{ chapter.title.zh }}</b>
                <small>{{ chapter.title.en }}</small>
              </span>
              <span class="log__count">{{ countOf(chapter.id) }} 關</span>
            </RouterLink>
          </li>
        </ol>
      </section>

    </main>
  </div>
</template>

<style scoped>
.masthead__title p {
  margin: 0 0 6px;
  font-family: var(--serif-tc);
  font-size: 16px;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
}
.masthead__meta {
  font-size: 12px;
}
.front {
  padding-top: 72px;
  padding-bottom: 96px;
}

/* ---------- Hero: one dominant statement, asymmetric split ---------- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(196px, 2.2fr);
  gap: 80px;
  align-items: end;
  padding-bottom: 84px;
}
.hero__story h2 {
  margin: 0;
  font-family: var(--serif-tc);
  /* Sized so all nine characters stay on a single line at every width. */
  font-size: clamp(24px, 4.4vw, 62px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.hero__en {
  margin: 26px 0 0;
  font-family: var(--display);
  font-size: 17px;
  font-style: italic;
  color: var(--ink-faint);
}
.hero__deck {
  max-width: 38ch;
  margin: 20px 0 0;
  font-family: var(--serif-tc);
  font-size: 15px;
  line-height: 2;
  color: var(--ink-soft);
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 34px;
}

/* Borderless — held together by alignment and one hairline, not a card. */
.hero__next {
  display: block;
  padding-bottom: 6px;
}
.hero__next:hover h3 {
  color: var(--primary);
}
.hero__next h3 {
  transition: color 0.2s;
}
.hero__next-label {
  margin: 0;
  font-family: var(--serif-tc);
  font-size: 13px;
  color: var(--ink-faint);
}
.hero__next-no {
  margin: 2px 0 0;
  font-family: var(--display);
  /* Heavy — a large figure at 400 reads thin and loses its presence. */
  font-weight: 800;
  font-size: 68px;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--primary);
}
.hero__next h3 {
  margin: 16px 0 1px;
  font-family: var(--serif-tc);
  font-size: 22px;
  font-weight: 700;
}
.hero__next-en {
  margin: 0;
  font-family: var(--display);
  font-size: 14px;
  color: var(--ink-faint);
}
.hero__meter {
  height: 2px;
  margin: 22px 0 8px;
  background: var(--border);
}
.hero__meter div {
  height: 100%;
  background: var(--primary);
  transition: width 0.6s var(--ease);
}
.hero__next-stat {
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-faint);
}

/* ---------- Demo: the terminal breaks the text column ---------- */
.demo {
  margin: 0 calc(var(--gutter) * -1) 88px;
}
.demo__terminal {
  background: var(--terminal-bg);
  padding: 44px clamp(24px, 5vw, 76px);
}
.demo__terminal pre {
  /* Three lines are reserved up front so the answer cannot shift the page. */
  min-height: calc(3 * 2.1em);
  margin: 0;
  font-family: var(--mono);
  font-size: clamp(15px, 1.7vw, 22px);
  line-height: 2.1;
  color: var(--code-fg);
}
.demo__caret {
  display: inline-block;
  width: 0.5em;
  height: 1em;
  margin-left: 3px;
  background: var(--success);
  vertical-align: -0.14em;
  animation: demo-blink 1.05s step-end infinite;
}
@keyframes demo-blink {
  50% {
    opacity: 0;
  }
}
.demo__terminal em {
  display: inline-block;
  animation: demo-rise 0.4s var(--ease) both;
}
@keyframes demo-rise {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .demo__caret {
    animation: none;
  }
  .demo__terminal em {
    animation: none;
  }
}
.demo__terminal b {
  color: var(--success);
  font-weight: 400;
}
.demo__terminal span {
  color: var(--warning);
}
.demo__terminal em {
  color: var(--ink-faint);
  font-style: normal;
}
.demo__caption {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 18px;
  margin: 16px 0 0;
  padding: 0 var(--gutter);
  font-family: var(--serif-tc);
  font-size: 15px;
  color: var(--ink-soft);
}

/* ---------- The commit spine: chapters drawn as a git log ---------- */
.log {
  margin-bottom: 88px;
}
.log__title {
  margin: 0 0 34px;
  font-family: var(--serif-tc);
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 900;
}
.log__list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 34px;
  border-left: 1px solid var(--border);
}
.log__item {
  position: relative;
}
/* Each chapter is a commit node on the branch line. */
.log__item::before {
  content: "";
  position: absolute;
  left: -40px;
  top: 26px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid var(--secondary);
  background: var(--paper);
  transition:
    background 0.2s,
    border-color 0.2s;
}
.log__item.is-head::before {
  border-color: var(--primary);
  background: var(--primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 16%, transparent);
}
.log__item a {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 24px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-soft);
}
.log__item:last-child a {
  border-bottom: 0;
}
.log__item a:hover .log__name b {
  color: var(--primary);
}
.log__ref {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--ink-faint);
}
.log__name b {
  font-family: var(--serif-tc);
  font-size: 21px;
  font-weight: 700;
  transition: color 0.2s;
}
.log__name small {
  margin-left: 12px;
  font-family: var(--display);
  font-size: 14px;
  color: var(--ink-faint);
}
.log__count {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-faint);
}
.log__item.is-head .log__ref {
  color: var(--primary);
}


@media (max-width: 900px) {
  .front {
    padding-top: 48px;
    padding-bottom: 72px;
  }
  .hero {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-bottom: 60px;
  }
  .hero__next {
    padding-top: 28px;
    border-top: 1px solid var(--border);
  }
  .hero__next-no {
    font-size: 58px;
  }
}
@media (max-width: 600px) {
  .masthead__title p {
    font-size: 14px;
    letter-spacing: 0.08em;
  }
  .front {
    padding-top: 34px;
    padding-bottom: 56px;
  }
  .hero {
    gap: 36px;
    padding-bottom: 48px;
  }
  .hero__story h2 {
    font-size: clamp(32px, 10.5vw, 46px);
    line-height: 1.2;
    white-space: normal;
  }
  .hero__en {
    margin-top: 16px;
    font-size: 15px;
    line-height: 1.5;
  }
  .hero__deck {
    max-width: none;
    margin-top: 16px;
    font-size: 15px;
    line-height: 1.8;
  }
  .hero__actions {
    margin-top: 26px;
  }
  .hero__next {
    padding-top: 24px;
  }
  .hero__next-no {
    font-size: 50px;
  }
  .demo {
    margin-bottom: 60px;
  }
  .demo__terminal pre {
    font-size: 14px;
    line-height: 1.8;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .demo__caption {
    margin-top: 12px;
    font-size: 14px;
  }
  .log {
    margin-bottom: 56px;
  }
  .log__title {
    margin-bottom: 22px;
  }
  .log__list {
    padding-left: 28px;
  }
  .log__item::before {
    left: -34px;
  }
  .log__item a {
    grid-template-columns: 50px minmax(0, 1fr);
    gap: 14px;
    padding: 16px 0;
  }
  .log__count {
    grid-column: 2;
  }
  .log__name small {
    display: block;
    margin: 3px 0 0;
  }
  .demo__terminal {
    padding: 30px 22px;
  }
}
@media (max-width: 420px) {
  .hero__actions {
    display: grid;
    grid-template-columns: 1fr;
  }
  .hero__actions .btn {
    width: 100%;
  }
  .log__item a {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 10px;
  }
  .log__name b {
    font-size: 19px;
  }
  .demo__terminal {
    padding: 26px 18px;
  }
}
</style>
