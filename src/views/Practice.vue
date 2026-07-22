<script setup>
import { ref, computed, nextTick } from "vue";
import { RouterLink } from "vue-router";
import { drills, poolFor, checkInput } from "../data/drills.js";
import { bySlug } from "../data/commands.js";
import { addXp, toast } from "../composables/useStore.js";

// A review row links to the reference only when that command has an article.
const articleSlug = (cmd) => {
  const slug = cmd.replace(/ /g, "-");
  return bySlug(slug) ? slug : null;
};

const SESSION_SIZE = 10;

const phase = ref("select"); // select | quiz | result
const game = ref(null); // 'choice' | 'input'
const session = ref([]);
const index = ref(0);
const score = ref(0);
const results = ref([]); // { q, correct, given }

const answered = ref(false);
const wasCorrect = ref(false);
const chosen = ref(null);
const inputVal = ref("");
const inputEl = ref(null);
const showHint = ref(false);

const current = computed(() => session.value[index.value]);
const progress = computed(() => Math.round(((index.value + (answered.value ? 1 : 0)) / session.value.length) * 100));
const isLast = computed(() => index.value === session.value.length - 1);

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function start(which) {
  game.value = which;
  const pool = poolFor(which);
  const picked = shuffle(pool).slice(0, Math.min(SESSION_SIZE, pool.length));
  session.value = picked.map((q) => ({
    ...q,
    _options: which === "choice" ? shuffle([q.solution, ...q.distractors]) : null,
  }));
  index.value = 0;
  score.value = 0;
  results.value = [];
  resetQuestion();
  phase.value = "quiz";
}

function resetQuestion() {
  answered.value = false;
  wasCorrect.value = false;
  chosen.value = null;
  inputVal.value = "";
  showHint.value = false;
  if (game.value === "input") nextTick(() => inputEl.value?.focus());
}

function answerChoice(opt) {
  if (answered.value) return;
  chosen.value = opt;
  wasCorrect.value = opt === current.value.solution;
  finishQuestion(opt);
}

function submitInput() {
  if (answered.value) {
    next();
    return;
  }
  if (!inputVal.value.trim()) return;
  wasCorrect.value = checkInput(inputVal.value, current.value.accept);
  finishQuestion(inputVal.value.trim());
}

function finishQuestion(given) {
  answered.value = true;
  if (wasCorrect.value) score.value++;
  results.value.push({ q: current.value, correct: wasCorrect.value, given });
}

function next() {
  if (isLast.value) {
    const xp = score.value * 12;
    addXp(xp);
    toast("Round Complete · 一回合結束", `${score.value}/${session.value.length} 正確 · +${xp} XP`, score.value >= 6 ? "success" : "warn");
    phase.value = "result";
  } else {
    index.value++;
    resetQuestion();
  }
}

function backToSelect() {
  phase.value = "select";
  game.value = null;
}

const wrongOnes = computed(() => results.value.filter((r) => !r.correct));
const grade = computed(() => {
  const pct = score.value / session.value.length;
  if (pct === 1) return { en: "Flawless", zh: "全對，太強了" };
  if (pct >= 0.7) return { en: "Well read", zh: "讀得很扎實" };
  if (pct >= 0.4) return { en: "Getting there", zh: "漸入佳境" };
  return { en: "Keep reading", zh: "再多讀幾遍" };
});

const choiceCount = poolFor("choice").length;
const inputCount = poolFor("input").length;
</script>

<template>
  <div class="wrap practice">
    <!-- ===================== SELECT ===================== -->
    <template v-if="phase === 'select'">
      <header class="pr-head reveal">
        <p class="eyebrow">Practice · 練習題庫</p>
        <h1 class="pr-title">Two Ways to Drill.</h1>
        <p class="u-serif pr-sub">兩種遊戲，練到記住為止。每回合隨機抽 {{ SESSION_SIZE }} 題，答完給你正解與說明。</p>
      </header>

      <div class="game-cards">
        <button class="game-card reveal" @click="start('choice')">
          <span class="game-card__kicker">Game A · 遊戲 A</span>
          <span class="game-card__mark" aria-hidden="true">◉</span>
          <h2>Multiple Choice</h2>
          <p class="u-serif">選擇題</p>
          <p class="game-card__desc">讀情境，從四個指令中挑對的。最適合剛入門、建立語感。</p>
          <div class="game-card__meta">
            <span class="badge badge--success"><span class="dot"></span>Beginner 入門</span>
            <span class="u-mono">{{ choiceCount }} questions</span>
          </div>
          <span class="game-card__cta">Start · 開始 →</span>
        </button>

        <button class="game-card reveal game-card--dark" @click="start('input')">
          <span class="game-card__kicker">Game B · 遊戲 B</span>
          <span class="game-card__mark" aria-hidden="true">▮</span>
          <h2>Terminal Input</h2>
          <p class="u-serif">手寫題</p>
          <p class="game-card__desc">自己把完整指令打出來。空格、連字號、參數位置都要對——最像真的在敲終端機。</p>
          <div class="game-card__meta">
            <span class="badge badge--warn"><span class="dot"></span>Advanced 進階</span>
            <span class="u-mono">{{ inputCount }} questions</span>
          </div>
          <span class="game-card__cta">Start · 開始 →</span>
        </button>
      </div>

      <p class="pr-tip u-serif">
        <span class="u-mono">TIP ·</span> Git 指令中的空格、連字號與參數位置都很重要。不確定狀態時，先 <code>git status</code>。
      </p>
    </template>

    <!-- ===================== QUIZ ===================== -->
    <template v-else-if="phase === 'quiz'">
      <div class="quiz">
        <!-- progress bar -->
        <div class="quiz-top">
          <button class="quiz-quit u-mono" @click="backToSelect">← 離開</button>
          <span class="u-mono quiz-count">
            {{ game === "choice" ? "選擇題" : "手寫題" }} · 第 {{ index + 1 }} / {{ session.length }} 題
          </span>
          <span class="u-mono quiz-score">SCORE {{ score }}</span>
        </div>
        <div class="progress" style="margin-bottom: 40px"><div class="progress__bar" :style="{ width: progress + '%' }"></div></div>

        <div class="quiz-card" :key="current.id">
          <div class="flex gap3 items-center" style="margin-bottom: 20px">
            <span class="badge badge--solid">{{ current.cmd === "concept" ? "Concept 概念" : current.cmd }}</span>
            <span class="badge" :class="{ 'badge--warn': current.difficulty === 2, 'badge--danger': current.difficulty === 3 }">
              <span class="dot"></span>{{ ["", "L1", "L2", "L3"][current.difficulty] }}
            </span>
          </div>

          <h2 class="quiz-scenario">{{ current.scenario.en }}</h2>
          <p class="u-serif quiz-scenario-zh">{{ current.scenario.zh }}</p>

          <div class="quiz-hint">
            <button
              class="btn btn--ghost quiz-hint__toggle"
              :aria-expanded="showHint"
              @click="showHint = !showHint"
            >
              {{ showHint ? "收起提示" : "需要提示？" }}
            </button>
            <Transition name="fade">
              <p v-if="showHint" class="u-serif quiz-hint__text">
                <span class="u-mono">提示 ·</span> {{ current.hint.zh }}
              </p>
            </Transition>
          </div>

          <!-- CHOICE -->
          <div v-if="game === 'choice'" class="choice" style="margin-top: 28px">
            <button
              v-for="(opt, i) in current._options"
              :key="i"
              :class="{
                correct: answered && opt === current.solution,
                wrong: answered && chosen === opt && opt !== current.solution,
              }"
              :disabled="answered"
              @click="answerChoice(opt)"
            >
              <span class="key">{{ String.fromCharCode(65 + i) }}</span>
              <span>{{ opt }}</span>
            </button>
          </div>

          <!-- INPUT -->
          <div v-else class="quiz-terminal" style="margin-top: 28px">
            <div class="terminal">
              <div class="terminal__bar">
                <span class="d r"></span><span class="d y"></span><span class="d g"></span>
                <span class="title">type the command · 輸入指令</span>
              </div>
              <div class="terminal__input" style="border-top: none">
                <span class="p">$</span>
                <input
                  ref="inputEl"
                  v-model="inputVal"
                  type="text"
                  spellcheck="false"
                  autocomplete="off"
                  autocapitalize="off"
                  :disabled="answered"
                  aria-label="Type the git command"
                  @keydown.enter="submitInput"
                />
              </div>
            </div>
            <button v-if="!answered" class="btn u-mt5" :disabled="!inputVal.trim()" @click="submitInput">
              Submit <span class="zh">送出</span>
            </button>
          </div>

          <!-- FEEDBACK -->
          <Transition name="fade">
            <div v-if="answered" class="feedback" :class="wasCorrect ? 'feedback--ok' : 'feedback--no'">
              <div class="feedback__head">
                <span class="feedback__badge">{{ wasCorrect ? "✓" : "✕" }}</span>
                <div>
                  <b>{{ wasCorrect ? "Mission Complete · 答對了" : "Not quite · 再看一次" }}</b>
                  <small v-if="wasCorrect" class="u-serif">Excellent — 做得很好。</small>
                  <small v-else class="u-serif">別擔心，看正解就記住了。</small>
                </div>
              </div>
              <div v-if="!wasCorrect" class="feedback__answer feedback__answer--given">
                <span class="u-mono feedback__label">你的答案</span>
                <code>{{ game === "choice" ? chosen : inputVal }}</code>
              </div>
              <div class="feedback__answer">
                <span class="u-mono feedback__label">正確答案</span>
                <code>{{ current.solution }}</code>
              </div>
              <div class="feedback__note">
                <span class="u-mono feedback__label">{{ wasCorrect ? "補充說明" : "為什麼答錯" }}</span>
                <p>{{ current.note.zh }}</p>
              </div>
              <button class="btn" @click="next">
                {{ isLast ? "See Results 看成績" : "Next 下一題" }} <span aria-hidden="true">→</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </template>

    <!-- ===================== RESULT ===================== -->
    <template v-else>
      <div class="result reveal in">
        <p class="eyebrow" style="justify-content: center">Round Complete · 一回合結束</p>
        <div class="result-score">
          <span class="result-num">{{ score }}</span>
          <span class="result-den">/ {{ session.length }}</span>
        </div>
        <h2 class="result-grade">{{ grade.en }}</h2>
        <p class="u-serif result-grade-zh">{{ grade.zh }}</p>

        <div class="result-actions">
          <button class="btn btn--lg" @click="start(game)">Play Again <span class="zh">再玩一次</span></button>
          <button class="btn btn--ghost btn--lg" @click="backToSelect">Switch Game <span class="zh">換一種</span></button>
        </div>

        <div v-if="wrongOnes.length" class="review">
          <div class="flex between items-center" style="margin-bottom: 20px">
            <div class="bi"><span class="en" style="font-size: 22px; font-weight: 800">Review</span><span class="zh">錯題複習</span></div>
            <span class="u-mono" style="color: var(--ink-faint); font-size: 12px">{{ wrongOnes.length }} to revisit</span>
          </div>
          <div v-for="(r, i) in wrongOnes" :key="i" class="review-row">
            <div>
              <p class="review-q u-serif">{{ r.q.scenario.zh }}</p>
              <div class="review-answers">
                <span class="review-given">你的答案：<code>{{ r.given }}</code></span>
                <span class="review-correct">正解：<code>{{ r.q.solution }}</code></span>
              </div>
            </div>
            <RouterLink v-if="articleSlug(r.q.cmd)" :to="`/reference/${articleSlug(r.q.cmd)}`" class="review-link">
              讀手冊 →
            </RouterLink>
          </div>
        </div>
        <p v-else class="u-serif result-perfect">滿分——連錯題複習都省了。要不要挑戰另一種遊戲？</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.practice { padding-top: 56px; min-height: 70vh; }

/* Select */
.pr-head { text-align: center; margin-bottom: 56px; }
.pr-title { font-family: var(--display); font-weight: 900; font-size: clamp(38px, 6vw, 68px); margin: 16px 0 8px; letter-spacing: -.02em; }
.pr-sub { color: var(--ink-soft); max-width: 48ch; margin: 0 auto; font-size: 16px; }

.game-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; max-width: 900px; margin: 0 auto; }
.game-card { text-align: left; background: var(--paper-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 36px; cursor: pointer; transition: transform .25s var(--ease), box-shadow .3s var(--ease), border-color .2s; display: flex; flex-direction: column; }
.game-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); border-color: var(--primary); }
.game-card__kicker { font-family: var(--mono); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-faint); }
.game-card__mark { font-size: 30px; color: var(--primary); margin: 20px 0 12px; }
.game-card h2 { font-family: var(--display); font-size: 30px; margin: 0; }
.game-card > .u-serif { color: var(--ink-soft); margin: 2px 0 0; font-size: 15px; }
.game-card__desc { color: var(--ink-soft); font-size: 14px; line-height: 1.7; margin: 18px 0 24px; flex: 1; }
.game-card__meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.game-card__meta .u-mono { font-size: 12px; color: var(--ink-faint); }
.game-card__cta { font-family: var(--mono); font-size: 13px; letter-spacing: .05em; color: var(--primary); }
.game-card--dark { background: var(--code-bg); border-color: var(--code-line); }
.game-card--dark .game-card__kicker { color: #85817a; }
.game-card--dark h2 { color: var(--code-fg); }
.game-card--dark > .u-serif, .game-card--dark .game-card__desc { color: #b3aea3; }
.game-card--dark .game-card__mark, .game-card--dark .game-card__cta { color: #9ec7ae; }

.pr-tip { text-align: center; margin-top: 48px; color: var(--ink-soft); font-size: 14px; }
.pr-tip code { font-family: var(--mono); color: var(--primary); background: var(--secondary-2); padding: 2px 7px; border-radius: 4px; }

/* Quiz */
.quiz { max-width: 760px; margin: 0 auto; }
.quiz-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-size: 12px; }
.quiz-quit { background: none; border: none; color: var(--ink-faint); cursor: pointer; letter-spacing: .05em; }
.quiz-quit:hover { color: var(--primary); }
.quiz-count { color: var(--ink-soft); letter-spacing: .08em; }
.quiz-score { color: var(--warning); letter-spacing: .1em; }
.quiz-card { background: var(--paper-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 40px; }
.quiz-scenario { font-family: var(--display); font-size: clamp(22px, 3.2vw, 30px); line-height: 1.3; margin: 0; }
.quiz-scenario-zh { color: var(--ink-soft); font-size: 16px; margin: 10px 0 0; }
.quiz-hint { margin-top: 22px; }
.quiz-hint__toggle { padding: 8px 14px; font-size: 12px; }
.quiz-hint__text { margin: 12px 0 0; padding: 14px 16px; border-left: 3px solid var(--warning); background: color-mix(in srgb, var(--warning) 7%, transparent); color: var(--ink-soft); font-size: 14px; line-height: 1.7; }
.quiz-hint__text .u-mono { color: var(--warning); font-size: 11px; letter-spacing: .12em; }

/* Feedback */
.feedback { margin-top: 28px; padding: 24px; border-radius: var(--radius); border: 1px solid var(--border); }
.feedback--ok { border-color: color-mix(in srgb, var(--success) 45%, transparent); background: color-mix(in srgb, var(--success) 6%, transparent); }
.feedback--no { border-color: color-mix(in srgb, var(--danger) 45%, transparent); background: color-mix(in srgb, var(--danger) 5%, transparent); }
.feedback__head { display: flex; gap: 14px; align-items: center; margin-bottom: 20px; }
.feedback__badge { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 15px; flex-shrink: 0; color: var(--paper-2); }
.feedback--ok .feedback__badge { background: var(--success); }
.feedback--no .feedback__badge { background: var(--danger); }
.feedback__head b { font-family: var(--display); font-size: 18px; }
.feedback__head small { display: block; color: var(--ink-soft); font-size: 13px; }
.feedback__label { font-size: 10px; letter-spacing: .15em; color: var(--ink-faint); display: block; margin-bottom: 6px; }
.feedback__answer { margin-bottom: 18px; }
.feedback__answer code { font-family: var(--mono); font-size: 15px; color: var(--primary); background: var(--paper); border: 1px solid var(--border); padding: 8px 14px; border-radius: 6px; display: inline-block; }
.feedback__answer--given code { color: var(--danger); }
.feedback__note p { margin: 0 0 4px; color: var(--ink-soft); font-size: 14px; line-height: 1.7; }
.feedback .btn { margin-top: 20px; }

/* Result */
.result { max-width: 640px; margin: 0 auto; text-align: center; }
.result-score { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin: 20px 0 8px; }
.result-num { font-family: var(--display); font-weight: 900; font-size: 96px; line-height: 1; color: var(--primary); }
.result-den { font-family: var(--display); font-size: 32px; color: var(--ink-faint); }
.result-grade { font-family: var(--display); font-size: 32px; margin: 8px 0 2px; }
.result-grade-zh { color: var(--ink-soft); margin: 0; }
.result-actions { display: flex; gap: 16px; justify-content: center; margin: 36px 0 56px; flex-wrap: wrap; }
.result-perfect { color: var(--ink-soft); }

.review { text-align: left; border-top: 3px double var(--ink); padding-top: 32px; }
.review-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--border); }
.review-q { font-size: 15px; margin: 0 0 10px; color: var(--ink); }
.review-answers { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.review-given code { color: var(--danger); font-family: var(--mono); }
.review-correct code { color: var(--success); font-family: var(--mono); }
.review-link { font-family: var(--mono); font-size: 12px; color: var(--primary); white-space: nowrap; }
.review-link:hover { text-decoration: underline; }

@media (max-width: 720px) {
  .game-cards { grid-template-columns: 1fr; }
  .quiz-card { padding: 28px 22px; }
  .review-row { flex-direction: column; gap: 10px; }
}
</style>
