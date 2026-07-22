<script setup>
defineProps({ state: { type: Object, required: true }, lastAction: { type: Object, default: null } });
const zones = [
  { key: "workingDirectory", en: "Working Directory", zh: "工作目錄" },
  { key: "stagingArea", en: "Staging Area", zh: "暫存區" },
  { key: "repository", en: "Repository", zh: "版本儲存庫" },
];
</script>
<template>
  <section class="viz-section workflow">
    <header><span>Git Workflow</span><b>Git 工作流程</b></header>
    <div class="workflow__track">
      <template v-for="(zone, index) in zones" :key="zone.key">
        <div class="workflow__zone">
          <h4>{{ zone.en }}<small>{{ zone.zh }}</small></h4>
          <TransitionGroup name="file" tag="div" class="workflow__files">
            <span v-for="file in state[zone.key]" :key="file" class="workflow__file">{{ file }}</span>
          </TransitionGroup>
          <p v-if="!state[zone.key][0]">等待檔案</p>
        </div>
        <div v-if="index < 2" class="workflow__arrow">↓<small>{{ index === 0 ? "git add" : "git commit" }}</small></div>
      </template>
    </div>
  </section>
</template>
<style scoped>
.viz-section { padding: 22px; border: 1px solid var(--border); border-radius: 12px; background: var(--paper-2); }
header { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 10px; letter-spacing: .13em; text-transform: uppercase; } header b { font-family: var(--serif-tc); font-weight: 400; }
.workflow__track { margin-top: 18px; }.workflow__zone { padding: 13px; border: 1px solid var(--border); background: var(--paper); }
h4 { margin: 0 0 10px; font-family: var(--mono); font-size: 11px; } h4 small { display: block; margin-top: 3px; font-family: var(--serif-tc); color: var(--ink-faint); }
.workflow__files { display: flex; gap: 6px; flex-wrap: wrap; min-height: 24px; }.workflow__file { padding: 4px 7px; background: var(--secondary-2); border-left: 2px solid var(--primary); font-family: var(--mono); font-size: 9px; }
p { margin: 0; color: var(--ink-faint); font-family: var(--serif-tc); font-size: 10px; }.workflow__arrow { display: grid; place-items: center; height: 38px; color: var(--warning); font-size: 15px; }.workflow__arrow small { font-family: var(--mono); font-size: 8px; }
.file-enter-active,.file-leave-active,.file-move { transition: all 260ms ease; }.file-enter-from,.file-leave-to { opacity: 0; transform: translateY(-8px); }
@media (prefers-reduced-motion: reduce) { .file-enter-active,.file-leave-active,.file-move { transition: none; } }
</style>
