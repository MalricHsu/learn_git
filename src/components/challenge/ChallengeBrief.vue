<script setup>
import { computed } from "vue";
import { bySlug } from "../../data/commands.js";

const props = defineProps({
  challenge: { type: Object, required: true },
  hintLevel: { type: Number, required: true },
});
defineEmits(["reveal-hint", "collapse-hints"]);

// Link the focus command to its reference article when one exists. Finals
// list a whole sequence, so they stay plain text.
const focusSlug = computed(() => {
  const focus = props.challenge.focus || "";
  if (focus.includes("→")) return null;
  const slug = focus.trim().replace(/\s+/g, "-");
  return bySlug(slug) ? slug : null;
});
</script>

<template>
  <section class="brief">
    <span class="badge badge--solid brief__badge">{{ challenge.code }}</span>
    <div class="brief__lead">
      <div class="brief__headline">
        <h2>{{ challenge.title.en }}</h2>
        <span class="brief__zh">{{ challenge.title.zh }}</span>
      </div>
      <dl class="brief__focus">
        <dt>本關指令</dt>
        <dd>
          <RouterLink v-if="focusSlug" :to="`/reference/${focusSlug}`" class="brief__focus-link" title="到手冊看這個指令">
            <code>{{ challenge.focus }}</code><span>手冊 →</span>
          </RouterLink>
          <code v-else>{{ challenge.focus }}</code>
        </dd>
      </dl>
    </div>
    <div class="brief__side">
    <dl class="brief__goal"><dt>學習目標</dt><dd>{{ challenge.learningConcept.zh }}</dd></dl>
    <div class="brief__stats">
      <dl><dt>難度</dt><dd>{{ challenge.difficulty }}</dd></dl>
      <dl><dt>獎勵</dt><dd>+{{ challenge.xp }} XP</dd></dl>
    </div>
    <div class="brief__hint">
      <button
        class="brief__hint-toggle"
        :aria-expanded="hintLevel > 0"
        @click="hintLevel === 3 ? $emit('collapse-hints') : $emit('reveal-hint')"
      >{{ hintLevel === 3 ? "收起提示" : hintLevel ? "再給我一點" : "需要提示？" }}</button>
      <TransitionGroup name="hint" tag="ol" class="brief__hints" v-show="hintLevel">
        <li v-for="hint in challenge.hints.slice(0, hintLevel)" :key="hint">{{ hint }}</li>
      </TransitionGroup>
    </div>
    </div>
  </section>
</template>

<style scoped>
.brief { margin-top: 12px; display: flex; align-items: center; gap: 18px 30px; flex-wrap: wrap; padding: 6px 0 15px; border-bottom: 1px solid var(--border); }
.brief__badge { flex: none; align-self: center; }
.brief__lead { flex: none; min-width: 0; display: flex; flex-direction: column; gap: 9px; }
.brief__headline { display: flex; align-items: baseline; gap: 11px; min-width: 0; }
.brief__headline h2 { margin: 0; font-family: var(--display); font-size: clamp(24px, 2.3vw, 32px); line-height: 1; }
.brief__zh { font-family: var(--serif-tc); font-size: 16px; color: var(--ink-soft); white-space: nowrap; }
.brief__focus { margin: 0; display: flex; align-items: center; gap: 11px; }
.brief__focus dt { flex: none; font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-faint); }
.brief__focus dd { margin: 0; min-width: 0; }
.brief__focus code { display: inline-block; padding: 3px 10px; border: 1px solid var(--primary); background: color-mix(in srgb, var(--primary) 8%, transparent); font-family: var(--mono); font-size: 13px; color: var(--primary); }
.brief__focus-link { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; }
.brief__focus-link span { font-family: var(--serif-tc); font-size: 11px; color: var(--ink-faint); transition: color .18s; }
.brief__focus-link:hover code { background: var(--primary); color: var(--paper); }
.brief__focus-link:hover span { color: var(--primary); }
.brief__side { flex: none; margin-left: auto; display: flex; align-items: center; gap: 24px; }
.brief__goal { flex: none; margin: 0; padding-left: 16px; border-left: 3px solid var(--primary); }
.brief__goal dt { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-faint); }
.brief__goal dd { margin: 4px 0 0; font-family: var(--serif-tc); font-size: 15px; color: var(--primary); }
.brief__stats { display: flex; gap: 24px; flex: none; }
.brief__stats dl { margin: 0; padding-left: 18px; border-left: 1px solid var(--border); }
.brief__stats dt { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-faint); }
.brief__stats dd { margin: 4px 0 0; font-family: var(--mono); font-size: 13px; letter-spacing: .01em; }
.brief__hint { position: relative; flex: none; }
.brief__hint-toggle { padding: 8px 16px; border: 1px solid var(--border); background: transparent; font-family: var(--serif-tc); font-size: 12px; color: var(--ink-soft); cursor: pointer; transition: border-color .18s, color .18s; }
.brief__hint-toggle:hover, .brief__hint-toggle[aria-expanded="true"] { border-color: var(--primary); color: var(--primary); }
.brief__hints { position: absolute; top: calc(100% + 8px); right: 0; z-index: 30; width: 340px; max-width: 78vw; margin: 0; padding: 15px 16px 15px 36px; list-style: decimal; background: var(--paper); border: 1px solid var(--ink); box-shadow: var(--shadow); color: var(--ink-soft); font-family: var(--serif-tc); font-size: 12.5px; line-height: 1.65; }
.brief__hints li { margin: 5px 0; }
.brief__hints li::marker { font-family: var(--mono); font-size: 11px; color: var(--ink-faint); }
.hint-enter-active { transition: opacity .2s ease, transform .2s ease; }
.hint-enter-from { opacity: 0; transform: translateY(-4px); }
@media (max-width: 900px) {
  .brief__goal { margin-left: 0; }
  .brief__hint { margin-left: auto; }
}
@media (prefers-reduced-motion: reduce) { .hint-enter-active { transition: none; } }
</style>
