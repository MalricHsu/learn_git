<script setup>
defineProps({
  chapters: { type: Array, required: true },
  challenges: { type: Array, required: true },
  currentId: { type: String, required: true },
  completedIds: { type: Array, required: true },
  isLocked: { type: Function, required: true },
});
defineEmits(["select"]);
</script>

<template>
  <aside class="roadmap" aria-label="Challenge Roadmap">
    <header class="roadmap__header">
      <span>Challenge Roadmap</span>
      <strong>闖關地圖</strong>
    </header>
    <details v-for="chapter in chapters" :key="chapter.id" class="roadmap__chapter" open>
      <summary>
        <small>Chapter {{ chapter.number }}</small>
        <b>{{ chapter.title.en }}</b>
        <span>{{ chapter.title.zh }}</span>
      </summary>
      <button
        v-for="challenge in challenges.filter((item) => item.chapter === chapter.id)"
        :key="challenge.id"
        class="roadmap__item"
        :class="{ done: completedIds.includes(challenge.id), current: challenge.id === currentId, locked: isLocked(challenge.id) }"
        :disabled="isLocked(challenge.id)"
        @click="$emit('select', challenge.id)"
      >
        <span class="roadmap__mark">{{ completedIds.includes(challenge.id) ? "✓" : challenge.final ? (challenge.no === 32 ? "🏆" : "★") : String(challenge.no).padStart(2, "0") }}</span>
        <span class="roadmap__copy">
          <small>{{ challenge.final ? "Final Challenge" : `Challenge ${String(challenge.no).padStart(2, "0")}` }}</small>
          <b>{{ challenge.title.en }}</b>
          <span>{{ challenge.title.zh }}</span>
          <em>{{ challenge.summary.zh }}</em>
        </span>
      </button>
    </details>
  </aside>
</template>

<style scoped>
.roadmap { position: sticky; top: 78px; max-height: calc(100vh - 98px); overflow: auto; padding-right: 10px; }
.roadmap__header { padding-bottom: 18px; border-bottom: 2px solid var(--ink); font-family: var(--mono); font-size: 11px; letter-spacing: .13em; text-transform: uppercase; }
.roadmap__header strong { display: block; margin-top: 5px; font-family: var(--serif-tc); font-size: 14px; letter-spacing: .04em; }
.roadmap__chapter { border-bottom: 1px solid var(--border); }
.roadmap__chapter summary { list-style: none; cursor: pointer; padding: 18px 4px 12px; }
.roadmap__chapter summary::-webkit-details-marker { display: none; }
.roadmap__chapter summary small, .roadmap__chapter summary span { display: block; color: var(--ink-faint); font-size: 10px; }
.roadmap__chapter summary b { display: block; font-family: var(--display); font-size: 17px; margin: 3px 0; }
.roadmap__item { width: 100%; display: grid; grid-template-columns: 32px 1fr; gap: 10px; padding: 13px 6px; border: 0; border-left: 2px solid transparent; background: transparent; color: var(--ink); text-align: left; cursor: pointer; }
.roadmap__item:hover { background: var(--secondary-2); }
.roadmap__item.done { color: var(--primary); }
.roadmap__item.current { border-left-color: var(--warning); background: color-mix(in srgb, var(--warning) 8%, transparent); }
.roadmap__item.locked { color: var(--ink-faint); cursor: not-allowed; opacity: .55; }
.roadmap__mark { font-family: var(--mono); font-size: 11px; padding-top: 2px; }
.roadmap__copy small, .roadmap__copy b, .roadmap__copy span, .roadmap__copy em { display: block; }
.roadmap__copy small { font-family: var(--mono); color: var(--ink-faint); font-size: 9px; text-transform: uppercase; letter-spacing: .08em; }
.roadmap__copy b { font-family: var(--display); font-size: 14px; margin: 3px 0 1px; }
.roadmap__copy span { font-family: var(--serif-tc); font-size: 12px; }
.roadmap__copy em { margin-top: 5px; color: var(--ink-faint); font-family: var(--serif-tc); font-size: 10px; line-height: 1.45; font-style: normal; }
@media (max-width: 1080px) { .roadmap { position: static; max-height: none; } }
@media (max-width: 720px) { .roadmap__chapter:not([open]) .roadmap__item { display: none; } }
</style>
