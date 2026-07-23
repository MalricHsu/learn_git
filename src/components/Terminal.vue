<script setup>
import { ref, nextTick, watch } from "vue";

const props = defineProps({
  engine: { type: Object, required: true },
  title: { type: String, default: "gitdaily — zsh" },
});

const input = ref("");
const inputEl = ref(null);
const bodyEl = ref(null);
const history = ref([]);
const hIndex = ref(-1);

function submit() {
  const cmd = input.value;
  if (cmd.trim()) { history.value.unshift(cmd); hIndex.value = -1; }
  props.engine.run(cmd);
  input.value = "";
  scroll();
}
function onKey(e) {
  if (e.key === "ArrowUp") { e.preventDefault(); if (hIndex.value < history.value.length - 1) input.value = history.value[++hIndex.value]; }
  else if (e.key === "ArrowDown") { e.preventDefault(); if (hIndex.value > 0) input.value = history.value[--hIndex.value]; else { hIndex.value = -1; input.value = ""; } }
}
function scroll() {
  nextTick(() => { if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight; });
}
watch(() => props.engine.state.lines.length, scroll);
// A new engine means a new challenge — start with an empty prompt and no
// recallable history from the previous one.
watch(() => props.engine, () => {
  input.value = "";
  history.value = [];
  hIndex.value = -1;
});
function focus() { inputEl.value?.focus({ preventScroll: true }); }
defineExpose({ focus });
</script>

<template>
  <div class="terminal" @click="focus">
    <div class="terminal__bar">
      <span class="d r"></span><span class="d y"></span><span class="d g"></span>
      <span class="title">{{ title }}</span>
    </div>
    <div class="terminal__body" ref="bodyEl" aria-live="polite">
      <div v-for="l in engine.state.lines" :key="l.id" class="term-line" :class="l.cls" v-html="l.html || '&nbsp;'"></div>
    </div>
    <div class="terminal__input">
      <span class="p">gitdaily ({{ engine.state.currentBranch }}) $</span>
      <input
        ref="inputEl"
        v-model="input"
        type="text"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        aria-label="Type a git command"
        @keydown.enter="submit"
        @keydown="onKey"
      />
    </div>
  </div>
</template>
