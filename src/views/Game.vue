<script setup>
import { computed, nextTick, ref, shallowRef, watch } from "vue";
import Terminal from "../components/Terminal.vue";
import ChallengeRoadmap from "../components/challenge/ChallengeRoadmap.vue";
import ChallengeBrief from "../components/challenge/ChallengeBrief.vue";
import ChallengeAchievement from "../components/challenge/ChallengeAchievement.vue";
import GitVisualization from "../components/challenge/GitVisualization.vue";
import { createGitEngine } from "../composables/useGitEngine.js";
import { resolveEditorsDesk } from "../composables/useEditorsDesk.js";
import { gitTeaching } from "../data/gitTeaching.js";
import {
  challenges,
  chapters,
  totalXp,
  chapterFor,
} from "../data/challenges.js";
import {
  store,
  addXp,
  completeChallenge,
  unlockAchievement,
  toast,
} from "../composables/useStore.js";
import { shouldAwardMissionXp } from "../composables/progressRules.js";

const firstOpen = challenges.findIndex(
  (item) => !store.completedMissions.includes(item.id),
);
const index = ref(firstOpen < 0 ? 0 : firstOpen);
const challenge = computed(() => challenges[index.value]);
const engine = shallowRef(null);
const terminalRef = ref(null);
const feedbackRef = ref(null);
const stepState = ref([]);
const hintLevel = ref(0);
const completedNow = ref(false);
const achievementNow = ref(null);

const completedCount = computed(() => store.completedMissions.length);
const xpPercent = computed(() =>
  Math.min(100, Math.round((store.xp / totalXp) * 100)),
);
const currentChapter = computed(() => chapterFor(challenge.value.chapter));
const desk = computed(() =>
  engine.value
    ? resolveEditorsDesk(
        challenge.value,
        engine.value.state.lastAction,
        gitTeaching,
      )
    : null,
);
function deskRows(d) {
  if (!d) return [];
  return [
    { dt: "發生了什麼", dd: d.whatHappened },
    { dt: "為什麼重要", dd: d.whyItMatters },
    { dt: "常見誤解", dd: d.misconception },
  ];
}
const feedback = computed(() => {
  const action = engine.value && engine.value.state.lastAction;
  if (!action) return null;
  if (completedNow.value) {
    return {
      tone: "success",
      label: store.completedMissions.includes(challenge.value.id)
        ? "闖關完成"
        : "複習完成",
      title: `${challenge.value.title.zh}完成`,
      rows: deskRows(desk.value),
      showNext: index.value < challenges.length - 1,
    };
  }
  if (!action.success) {
    return {
      tone: "error",
      label: "指令沒有成功",
      title: "再看一下狀態",
      rows: [
        { dt: "發生了什麼", dd: action.error || "這個指令沒有成功執行。" },
        {
          dt: "怎麼辦",
          dd: "看看上方終端機的紅字提示，或按「需要提示？」對照正確語法。",
        },
      ],
      showNext: false,
    };
  }
  return {
    tone: "info",
    label: "已執行",
    title: desk.value?.title || "指令已執行",
    rows: deskRows(desk.value),
    showNext: false,
  };
});
const firstIncomplete = computed(() => {
  const position = challenges.findIndex(
    (item) => !store.completedMissions.includes(item.id),
  );
  return position < 0 ? challenges.length - 1 : position;
});

function isLocked(id) {
  const position = challenges.findIndex((item) => item.id === id);
  return (
    position > firstIncomplete.value && !store.completedMissions.includes(id)
  );
}

function setupChallenge() {
  hintLevel.value = 0;
  completedNow.value = false;
  achievementNow.value = null;
  const c = challenge.value;
  stepState.value = c.steps.map(() => false);
  const stepLine =
    c.steps.length > 1
      ? `\n# 步驟：${c.steps.map((s, i) => `${i + 1}. ${s.label}`).join("　")}`
      : "";
  engine.value = createGitEngine({
    ...c.seed,
    greeting: `# 入職日誌\n# ${c.task.zh}${stepLine}`,
    onRun: handleAction,
  });
  nextTick(() => terminalRef.value?.focus());
}

function handleAction(_raw, action) {
  if (completedNow.value || !action) return;
  const nextStep = stepState.value.findIndex((done) => !done);
  if (nextStep < 0) return;
  if (challenge.value.steps[nextStep].check(action, engine.value.state)) {
    stepState.value[nextStep] = true;
    if (stepState.value.every(Boolean)) completeCurrentChallenge();
  }
}

function completeCurrentChallenge() {
  const firstCompletion = shouldAwardMissionXp(
    store.completedMissions,
    challenge.value.id,
  );
  completedNow.value = true;
  if (firstCompletion) {
    addXp(challenge.value.xp);
    completeChallenge(challenge.value.id);
  }
  if (
    challenge.value.final &&
    firstCompletion &&
    unlockAchievement(currentChapter.value.achievement.id)
  ) {
    achievementNow.value = currentChapter.value.achievement;
  }
  toast(
    firstCompletion ? "闖關完成" : "複習完成",
    firstCompletion ? `+${challenge.value.xp} XP` : "本次複習不重複計算 XP",
    "success",
  );
}

function selectChallenge(id) {
  if (isLocked(id)) return;
  const nextIndex = challenges.findIndex((item) => item.id === id);
  if (nextIndex === index.value) setupChallenge();
  else index.value = nextIndex;
}

function goNext() {
  if (index.value < challenges.length - 1) {
    index.value += 1;
    nextTick(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }
}

function revealHint() {
  hintLevel.value = Math.min(3, hintLevel.value + 1);
}
function collapseHints() {
  hintLevel.value = 0;
}

watch(index, setupChallenge, { immediate: true });
watch(
  () => engine.value && engine.value.state.lastAction,
  (action) => {
    if (!action) return;
    nextTick(() =>
      feedbackRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      }),
    );
  },
);
</script>

<template>
  <div class="challenge-page wrap">
    <header class="challenge-head">
      <div class="challenge-head__intro">
        <h1>Challenge Edition</h1>
        <p>看著 Git 的狀態一步步改變，理解每個指令真正做了什麼。</p>
      </div>
      <div class="challenge-progress">
        <div>
          <span>TOTAL XP</span><b>{{ store.xp }} / {{ totalXp }}</b>
        </div>
        <div class="progress">
          <div class="progress__bar" :style="{ width: xpPercent + '%' }"></div>
        </div>
        <small
          >{{ completedCount }} / {{ challenges.length }} CHALLENGES
          COMPLETE</small
        >
      </div>
    </header>

    <ChallengeRoadmap
      :chapters="chapters"
      :challenges="challenges"
      :current-id="challenge.id"
      :completed-ids="store.completedMissions"
      :is-locked="isLocked"
      @select="selectChallenge"
    />

    <ChallengeBrief
      :challenge="challenge"
      :hint-level="hintLevel"
      @reveal-hint="revealHint"
      @collapse-hints="collapseHints"
    />

    <div class="challenge-layout">
      <main class="challenge-main">
        <div class="terminal-frame">
          <div class="terminal-frame__title"><b>終端機</b></div>
          <Terminal v-if="engine" ref="terminalRef" :engine="engine" />
        </div>

        <div
          v-if="achievementNow || feedback"
          ref="feedbackRef"
          class="challenge-feedback"
        >
          <ChallengeAchievement
            v-if="achievementNow"
            :achievement="achievementNow"
            @continue="goNext"
          />
          <section
            v-else-if="feedback"
            class="challenge-complete card"
            :class="`is-${feedback.tone}`"
          >
            <p>{{ feedback.label }}</p>
            <h3>{{ feedback.title }}</h3>
            <dl class="challenge-complete__desk">
              <div v-for="row in feedback.rows" :key="row.dt">
                <dt>{{ row.dt }}</dt>
                <dd>{{ row.dd }}</dd>
              </div>
            </dl>
            <button
              v-if="feedback.showNext"
              class="btn challenge-complete__next"
              @click="goNext"
            >
              下一關 →
            </button>
          </section>
        </div>
      </main>

      <GitVisualization
        v-if="engine"
        :state="engine.state"
        :challenge="challenge"
      />
    </div>
  </div>
</template>

<style scoped>
.challenge-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - 54px);
  padding: 10px 0 72px;
}
.challenge-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  padding: 8px 0 12px;
  border-top: 3px double var(--ink);
  border-bottom: 3px double var(--ink);
  flex: none;
}
.challenge-head__intro {
  min-width: 0;
}
.challenge-head h1 {
  margin: 8px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(34px, 3.2vw, 46px);
  line-height: 0.98;
  letter-spacing: -0.035em;
}
.challenge-head p:last-child {
  margin: 8px 0 0;
  font-family: var(--serif-tc);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-soft);
  max-width: 56ch;
}
.challenge-progress {
  width: min(320px, 38%);
  flex: none;
  padding-left: 30px;
  border-left: 1px solid var(--border);
}
.challenge-progress > div:first-child {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-family: var(--mono);
  font-size: 14px;
}
.challenge-progress b {
  color: var(--warning);
  font-weight: 400;
}
.challenge-progress small {
  display: block;
  margin-top: 7px;
  font-family: var(--mono);
  color: var(--ink-faint);
  font-size: 14px;
  letter-spacing: 0.08em;
}

.challenge-layout {
  flex: none;
  margin-top: 12px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 460px);
  gap: 32px;
  align-items: start;
}
.challenge-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.terminal-frame {
  flex: none;
  height: clamp(360px, 52vh, 500px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.terminal-frame__title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 0 2px 10px;
  border-bottom: 2px solid var(--ink);
  flex: none;
}
.terminal-frame__title b {
  flex: none;
  font-family: var(--serif-tc);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.terminal-frame__title span {
  font-family: var(--serif-tc);
  font-size: 13px;
  color: var(--ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.terminal-frame :deep(.terminal) {
  flex: 1 1 auto;
  min-height: 0;
}
.terminal-frame :deep(.terminal__body) {
  flex: 1 1 auto;
  min-height: 90px;
  max-height: none;
}

.challenge-complete {
  flex: none;
  margin: 0;
  padding: 16px 22px 18px;
  border: 2px solid var(--success);
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.challenge-complete.is-error {
  border-color: var(--danger);
}
.challenge-complete.is-info {
  border-color: var(--primary);
}
.challenge-complete p {
  margin: 0;
  font-family: var(--mono);
  color: var(--success);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.challenge-complete.is-error p,
.challenge-complete.is-error .challenge-complete__desk dt {
  color: var(--danger);
}
.challenge-complete.is-info p,
.challenge-complete.is-info .challenge-complete__desk dt {
  color: var(--primary);
}
.challenge-complete h3 {
  margin: 0;
  font-family: var(--display);
  font-size: 22px;
}
.challenge-complete__desk {
  margin: 2px 0 3px;
}
.challenge-complete__desk div {
  padding: 4px 0;
}
.challenge-complete__desk dt {
  display: inline;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--success);
}
.challenge-complete__desk dt::after {
  content: "　";
}
.challenge-complete__desk dd {
  display: inline;
  margin: 0;
  font-family: var(--serif-tc);
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-soft);
}
.challenge-complete__next {
  align-self: flex-end;
}

@media (max-width: 1080px) {
  .challenge-page {
    min-height: 0;
    padding-bottom: 48px;
  }
  .challenge-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  .challenge-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }
  .challenge-progress {
    width: 100%;
    padding-left: 0;
    border-left: 0;
  }
  .terminal-frame {
    height: 340px;
  }
}
@media (max-width: 720px) {
  .challenge-head h1 {
    font-size: 29px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
</style>
