<script setup>
defineProps({ state: { type: Object, required: true }, lastAction: { type: Object, default: null } });
const zones = [
  { key: "workingDirectory", zh: "工作目錄", hint: "你正在編輯、還沒記錄的檔案" },
  { key: "stagingArea", zh: "暫存區", hint: "已挑好、準備寫進下一個版本" },
  { key: "repository", zh: "版本儲存庫", hint: "已存成版本、被 Git 永久保存" },
];
const flows = ["git add", "git commit"];
</script>
<template>
  <section class="viz-section workflow">
    <header><b>Git 工作流程</b></header>
    <p class="workflow__lead">檔案會從上往下，一步步被 Git 收好。</p>
    <div class="workflow__track">
      <template v-for="(zone, index) in zones" :key="zone.key">
        <div class="wf-zone" :class="{ 'wf-zone--filled': state[zone.key] && state[zone.key].length }">
          <div class="wf-zone__head">
            <span class="wf-zone__name">{{ zone.zh }}</span>
            <span class="wf-zone__hint">{{ zone.hint }}</span>
          </div>
          <TransitionGroup name="file" tag="div" class="wf-zone__files">
            <span v-for="file in state[zone.key]" :key="file" class="wf-file">{{ file }}</span>
          </TransitionGroup>
          <p v-if="!state[zone.key] || !state[zone.key].length" class="wf-zone__empty">目前是空的</p>
        </div>
        <div v-if="index < 2" class="wf-arrow">
          <span class="wf-arrow__glyph">↓</span>
          <span class="wf-arrow__cmd">{{ flows[index] }}</span>
        </div>
      </template>
    </div>
  </section>
</template>
<style scoped>
.viz-section { padding: 14px 16px 18px; border: 0; border-radius: 0; background: transparent; }
header { font-family: var(--mono); font-size: 10px; letter-spacing: .13em; text-transform: uppercase; } header b { font-family: var(--serif-tc); font-weight: 400; }
.workflow__lead { margin: 8px 0 13px; font-family: var(--serif-tc); font-size: 11px; color: var(--ink-faint); }
.workflow__track { display: flex; flex-direction: column; }
.wf-zone { padding: 11px 13px; border: 1px solid var(--border); background: var(--paper-2); transition: border-color .25s var(--ease), background .25s var(--ease); }
.wf-zone--filled { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 6%, var(--paper-2)); }
.wf-zone__head { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
.wf-zone__name { font-family: var(--serif-tc); font-size: 14px; font-weight: 700; }
.wf-zone__hint { font-family: var(--serif-tc); font-size: 10.5px; color: var(--ink-faint); }
.wf-zone__files { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 9px; min-height: 0; }
.wf-file { padding: 4px 9px; background: var(--paper); border: 1px solid var(--primary); font-family: var(--mono); font-size: 10px; color: var(--primary); }
.wf-zone__empty { margin: 8px 0 0; font-family: var(--serif-tc); font-size: 10.5px; color: var(--ink-faint); }
.wf-arrow { display: flex; align-items: center; justify-content: center; gap: 9px; padding: 7px 0; }
.wf-arrow__glyph { font-family: var(--mono); font-size: 16px; line-height: 1; color: var(--warning); }
.wf-arrow__cmd { padding: 3px 11px; border: 1px solid var(--warning); background: color-mix(in srgb, var(--warning) 10%, transparent); font-family: var(--mono); font-size: 11px; letter-spacing: .02em; color: var(--warning); }
.file-enter-active, .file-leave-active, .file-move { transition: all 260ms ease; } .file-enter-from, .file-leave-to { opacity: 0; transform: translateY(-8px); }
@media (prefers-reduced-motion: reduce) { .file-enter-active, .file-leave-active, .file-move { transition: none; } }
</style>
