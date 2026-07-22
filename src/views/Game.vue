<script setup>
import { computed, nextTick, ref, shallowRef, watch } from "vue";
import Terminal from "../components/Terminal.vue";
import ChallengeRoadmap from "../components/challenge/ChallengeRoadmap.vue";
import ChallengeBrief from "../components/challenge/ChallengeBrief.vue";
import ChallengeAchievement from "../components/challenge/ChallengeAchievement.vue";
import GitVisualization from "../components/challenge/GitVisualization.vue";
import { createGitEngine } from "../composables/useGitEngine.js";
import { challenges, chapters, totalXp, chapterFor } from "../data/challenges.js";
import { store, addXp, completeChallenge, unlockAchievement, toast } from "../composables/useStore.js";
import { shouldAwardMissionXp } from "../composables/progressRules.js";

const firstOpen = challenges.findIndex((item) => !store.completedMissions.includes(item.id));
const index = ref(firstOpen < 0 ? 0 : firstOpen);
const challenge = computed(() => challenges[index.value]);
const engine = shallowRef(null);
const terminalRef = ref(null);
const stepState = ref([]);
const hintLevel = ref(0);
const completedNow = ref(false);
const achievementNow = ref(null);

const completedCount = computed(() => store.completedMissions.length);
const xpPercent = computed(() => Math.min(100, Math.round((store.xp / totalXp) * 100)));
const currentChapter = computed(() => chapterFor(challenge.value.chapter));
const firstIncomplete = computed(() => {
  const position = challenges.findIndex((item) => !store.completedMissions.includes(item.id));
  return position < 0 ? challenges.length - 1 : position;
});

function isLocked(id) {
  const position = challenges.findIndex((item) => item.id === id);
  return position > firstIncomplete.value && !store.completedMissions.includes(id);
}

function setupChallenge() {
  hintLevel.value = 0;
  completedNow.value = false;
  achievementNow.value = null;
  stepState.value = challenge.value.steps.map(() => false);
  engine.value = createGitEngine({
    ...challenge.value.seed,
    greeting: `# ${challenge.value.summary.zh}`,
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
  const firstCompletion = shouldAwardMissionXp(store.completedMissions, challenge.value.id);
  completedNow.value = true;
  if (firstCompletion) {
    addXp(challenge.value.xp);
    completeChallenge(challenge.value.id);
  }
  if (challenge.value.final && firstCompletion && unlockAchievement(currentChapter.value.achievement.id)) {
    achievementNow.value = currentChapter.value.achievement;
  }
  toast(
    firstCompletion ? "Challenge Complete · 闖關完成" : "Review Complete · 複習完成",
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
  if (index.value < challenges.length - 1) index.value += 1;
}

function revealHint() { hintLevel.value = Math.min(3, hintLevel.value + 1); }
function collapseHints() { hintLevel.value = 0; }

watch(index, setupChallenge, { immediate: true });
</script>

<template>
  <div class="challenge-page wrap">
    <header class="challenge-head">
      <div>
        <p class="eyebrow">Challenge · 闖關</p>
        <h1>Today's Challenge</h1>
        <p>今日闖關 — 看著 Git 的狀態改變，理解每個指令真正做了什麼。</p>
      </div>
      <div class="challenge-progress">
        <div><span>TOTAL XP</span><b>{{ store.xp }} / {{ totalXp }}</b></div>
        <div class="progress"><div class="progress__bar" :style="{ width: xpPercent + '%' }"></div></div>
        <small>{{ completedCount }} / {{ challenges.length }} CHALLENGES COMPLETE</small>
      </div>
    </header>

    <div class="challenge-layout">
      <ChallengeRoadmap
        :chapters="chapters"
        :challenges="challenges"
        :current-id="challenge.id"
        :completed-ids="store.completedMissions"
        :is-locked="isLocked"
        @select="selectChallenge"
      />

      <main class="challenge-main">
        <ChallengeBrief
          :challenge="challenge"
          :hint-level="hintLevel"
          @reveal-hint="revealHint"
          @collapse-hints="collapseHints"
        />

        <div v-if="challenge.steps.length > 1" class="challenge-steps" aria-label="Challenge progress">
          <div v-for="(step, stepIndex) in challenge.steps" :key="step.label" :class="{ done: stepState[stepIndex] }">
            <span>{{ stepState[stepIndex] ? "✓" : stepIndex + 1 }}</span>{{ step.label }}
          </div>
        </div>

        <div class="terminal-frame">
          <div class="terminal-frame__title"><span>Terminal</span><b>終端機</b></div>
          <Terminal v-if="engine" ref="terminalRef" :engine="engine" />
        </div>

        <ChallengeAchievement v-if="achievementNow" :achievement="achievementNow" @continue="goNext" />
        <section v-else-if="completedNow" class="challenge-complete card">
          <p>{{ store.completedMissions.includes(challenge.id) ? "Challenge Complete" : "Review Complete" }}</p>
          <h3>{{ challenge.title.zh }}完成</h3>
          <span>右側保留了這次操作的 GitState 與觀念解說，你可以先回顧再繼續。</span>
          <button v-if="index < challenges.length - 1" class="btn" @click="goNext">下一關 →</button>
        </section>
      </main>

      <GitVisualization v-if="engine" :state="engine.state" :challenge="challenge" />
    </div>
  </div>
</template>

<style scoped>
.challenge-page { padding-top: 40px; padding-bottom: 80px; }
.challenge-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 36px; padding-bottom: 30px; border-bottom: 3px double var(--ink); }
.challenge-head h1 { margin: 12px 0 4px; font-family: var(--display); font-size: clamp(38px, 5vw, 64px); line-height: 1; }
.challenge-head p:last-child { margin: 10px 0 0; font-family: var(--serif-tc); color: var(--ink-soft); }
.challenge-progress { width: min(340px, 100%); }
.challenge-progress > div:first-child { display: flex; justify-content: space-between; margin-bottom: 9px; font-family: var(--mono); font-size: 11px; }
.challenge-progress b { color: var(--warning); font-weight: 400; }
.challenge-progress small { display: block; margin-top: 8px; font-family: var(--mono); color: var(--ink-faint); font-size: 10px; letter-spacing: .08em; }
.challenge-layout { display: grid; grid-template-columns: 250px minmax(500px, 1fr) minmax(330px, 410px); gap: 30px; align-items: start; margin-top: 38px; }
.challenge-main { min-width: 0; }
.challenge-steps { display: flex; flex-wrap: wrap; gap: 7px; margin: 20px 0; }
.challenge-steps div { padding: 8px 11px; border: 1px solid var(--border); background: var(--paper-2); font-family: var(--serif-tc); font-size: 11px; color: var(--ink-faint); }
.challenge-steps div.done { border-color: var(--success); color: var(--success); }
.challenge-steps span { margin-right: 7px; font-family: var(--mono); }
.terminal-frame { margin-top: 24px; }
.terminal-frame__title { display: flex; justify-content: space-between; padding: 0 2px 10px; font-family: var(--mono); font-size: 10px; letter-spacing: .13em; text-transform: uppercase; }
.terminal-frame__title b { font-family: var(--serif-tc); font-weight: 400; }
.challenge-complete { margin-top: 24px; padding: 28px; border: 2px solid var(--success); }
.challenge-complete p { margin: 0; font-family: var(--mono); color: var(--success); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; }
.challenge-complete h3 { margin: 12px 0 8px; font-family: var(--display); font-size: 27px; }
.challenge-complete span { display: block; margin-bottom: 20px; font-family: var(--serif-tc); color: var(--ink-soft); line-height: 1.7; }
@media (max-width: 1280px) { .challenge-layout { grid-template-columns: 220px minmax(460px, 1fr) 330px; gap: 22px; } }
@media (max-width: 1080px) { .challenge-layout { grid-template-columns: 1fr; } .challenge-head { align-items: flex-start; flex-direction: column; } }
@media (max-width: 720px) { .challenge-page { padding-top: 24px; } .challenge-layout { margin-top: 26px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; } }
</style>
