<script setup>
defineProps({
  challenge: { type: Object, required: true },
  hintLevel: { type: Number, required: true },
});
defineEmits(["reveal-hint", "collapse-hints"]);
</script>

<template>
  <section class="brief card">
    <div class="brief__meta">
      <span class="badge badge--solid">{{ challenge.final ? "Final Challenge" : `Challenge ${String(challenge.no).padStart(2, "0")}` }}</span>
      <dl><dt>Difficulty</dt><dd>{{ challenge.difficulty }}</dd></dl>
      <dl><dt>Level</dt><dd>{{ challenge.level }}</dd></dl>
      <dl><dt>Reward</dt><dd>+{{ challenge.xp }} XP</dd></dl>
    </div>
    <h2>{{ challenge.title.en }}</h2>
    <p class="brief__zh">{{ challenge.title.zh }}</p>
    <p class="brief__summary">{{ challenge.summary.en }}<br /><span>{{ challenge.summary.zh }}</span></p>
    <div class="brief__goal">
      <small>Learning Goal <span>學習目標</span></small>
      <code>{{ challenge.learningGoal }}</code>
    </div>
    <p class="brief__story">{{ challenge.story.zh }}</p>
    <div class="brief__hints">
      <button
        class="btn btn--ghost"
        :aria-expanded="hintLevel > 0"
        @click="hintLevel === 3 ? $emit('collapse-hints') : $emit('reveal-hint')"
      >{{ hintLevel === 3 ? "收起提示" : hintLevel ? "再給我一點提示" : "需要提示？" }}</button>
      <TransitionGroup name="hint" tag="ol">
        <li v-for="hint in challenge.hints.slice(0, hintLevel)" :key="hint">{{ hint }}</li>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.brief { border-color: var(--secondary); padding: 34px; }
.brief__meta { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; }
.brief__meta dl { margin: 0; padding-left: 14px; border-left: 1px solid var(--border); }
.brief__meta dt { font-family: var(--mono); font-size: 8px; color: var(--ink-faint); text-transform: uppercase; letter-spacing: .12em; }
.brief__meta dd { margin: 3px 0 0; font-size: 12px; }
h2 { margin: 28px 0 0; font-family: var(--display); font-size: clamp(30px, 4vw, 48px); line-height: 1.05; }
.brief__zh { margin: 6px 0 0; font-family: var(--serif-tc); font-size: 20px; color: var(--ink-soft); }
.brief__summary { margin: 24px 0 0; font-size: 15px; line-height: 1.7; color: var(--ink-soft); }
.brief__summary span { font-family: var(--serif-tc); }
.brief__goal { margin-top: 24px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; gap: 18px; background: var(--secondary-2); border-left: 3px solid var(--primary); }
.brief__goal small { font-family: var(--mono); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
.brief__goal small span { display: block; margin-top: 3px; font-family: var(--serif-tc); letter-spacing: 0; }
.brief__goal code { color: var(--primary); text-align: right; }
.brief__story { margin: 24px 0; font-family: var(--serif-tc); line-height: 1.9; color: var(--ink); }
.brief__hints ol { margin: 14px 0 0; padding-left: 22px; color: var(--ink-soft); font-family: var(--serif-tc); font-size: 13px; line-height: 1.7; }
.hint-enter-active { transition: all 260ms ease; }.hint-enter-from { opacity: 0; transform: translateY(6px); }
</style>
