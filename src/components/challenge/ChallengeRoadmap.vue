<script setup>
import { computed, nextTick, ref, watch } from "vue";

const props = defineProps({
  chapters: { type: Array, required: true },
  challenges: { type: Array, required: true },
  currentId: { type: String, required: true },
  completedIds: { type: Array, required: true },
  isLocked: { type: Function, required: true },
});
defineEmits(["select"]);

const track = ref(null);
const visibleChallenges = computed(() => props.challenges);

const chapterNumber = (chapterId) => props.chapters.find((c) => c.id === chapterId)?.number || 0;
function cardCode(challenge) {
  const within = props.challenges.filter((c) => c.chapter === challenge.chapter).findIndex((c) => c.id === challenge.id) + 1;
  return `CH${chapterNumber(challenge.chapter)}.${within}`;
}

function slide(direction) {
  track.value?.scrollBy({ left: direction * Math.min(720, track.value.clientWidth * 0.75), behavior: "smooth" });
}

function revealCurrent() {
  nextTick(() => track.value?.querySelector(".current")?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));
}

watch(() => props.currentId, revealCurrent, { immediate: true });
</script>

<template>
  <nav class="roadmap" aria-label="Challenge Roadmap">
    <div class="roadmap__rail">
      <span class="roadmap__label">闖關地圖</span>
      <button class="roadmap__arrow" aria-label="向左瀏覽關卡" @click="slide(-1)">←</button>
      <div ref="track" class="roadmap__track">
        <button
          v-for="challenge in visibleChallenges"
          :key="challenge.id"
          class="roadmap__item"
          :class="{ done: completedIds.includes(challenge.id), current: challenge.id === currentId, locked: isLocked(challenge.id) }"
          :disabled="isLocked(challenge.id)"
          @click="$emit('select', challenge.id)"
        >
          <span class="roadmap__mark">{{ cardCode(challenge) }}</span>
          <span class="roadmap__copy">
            <b>{{ challenge.title.zh }}</b>
          </span>
        </button>
      </div>
      <button class="roadmap__arrow" aria-label="向右瀏覽關卡" @click="slide(1)">→</button>
    </div>
  </nav>
</template>

<style scoped>
.roadmap{margin-top:10px;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)}
.roadmap__track::-webkit-scrollbar{display:none}
.roadmap__label{align-self:center;padding-right:28px;font-family:var(--serif-tc);font-weight:700;font-size:15px;white-space:nowrap}
.roadmap__rail{display:grid;grid-template-columns:auto 34px minmax(0,1fr) 34px;align-items:stretch}
.roadmap__arrow{border:0;background:transparent;color:var(--ink-faint);font-family:var(--mono);font-size:17px;cursor:pointer}.roadmap__arrow:hover{color:var(--primary)}
.roadmap__track{display:flex;gap:0;overflow-x:auto;scroll-snap-type:x proximity;scroll-behavior:smooth}
.roadmap__item{flex:0 0 216px;display:flex;justify-content:center;align-items:center;gap:8px;min-height:48px;padding:10px 12px;border:0;border-right:1px solid var(--border);border-top:3px solid transparent;background:transparent;color:var(--ink);text-align:left;scroll-snap-align:center;cursor:pointer}
.roadmap__item:hover{background:color-mix(in srgb,var(--secondary) 28%,transparent)}.roadmap__item.done{color:var(--primary)}.roadmap__item.current{background:color-mix(in srgb,var(--warning) 17%,transparent);color:var(--ink)}.roadmap__item.locked{color:var(--ink-faint);cursor:not-allowed;opacity:.48}
.roadmap__mark{flex:none;font-family:var(--mono);font-size:11px}.roadmap__copy{min-width:0}.roadmap__copy b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--serif-tc);font-size:15px;font-weight:700}
@media(max-width:900px){.roadmap__label{display:none}.roadmap__rail{grid-template-columns:34px minmax(0,1fr) 34px}.roadmap__item{flex-basis:190px}}
@media(prefers-reduced-motion:reduce){.roadmap__track{scroll-behavior:auto}}
</style>
