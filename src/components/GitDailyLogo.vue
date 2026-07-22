<script setup>
defineProps({
  variant: { type: String, default: "compact" },
  tag: { type: String, default: "div" },
  tagline: { type: Boolean, default: false },
});
</script>

<template>
  <component :is="tag" class="logo" :class="`logo--${variant}`" aria-label="Git Daily">
    <span class="logo__seal" aria-hidden="true"><b>G</b><b>D</b></span>
    <span class="logo__copy">
      <span class="logo__wordmark">Git Daily</span>
      <small v-if="tagline">LEARN · COMMIT · GROW</small>
    </span>
  </component>
</template>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 11px; margin: 0; color: var(--ink); line-height: 1; }
.logo__seal { position: relative; display: grid; grid-template-columns: 1fr 1fr; place-items: center; width: 36px; height: 36px; border: 3px double currentColor; font-family: var(--display); font-size: 15px; letter-spacing: -.08em; }
.logo__seal::after { content: ""; position: absolute; top: 4px; bottom: 4px; left: 50%; border-left: 1px solid currentColor; opacity: .35; }
.logo__seal b { font-weight: 800; }
.logo__copy { display: flex; flex-direction: column; align-items: flex-start; }
.logo__wordmark { font-family: var(--display); font-size: 23px; font-weight: 800; letter-spacing: -.035em; white-space: nowrap; }
.logo__copy small { margin-top: 4px; font-family: var(--mono); font-size: 9px; font-weight: 500; letter-spacing: .17em; white-space: nowrap; }
.logo--masthead { gap: clamp(16px, 2vw, 28px); }
.logo--masthead .logo__seal { width: clamp(62px, 7vw, 86px); height: clamp(62px, 7vw, 86px); border-width: 4px; font-size: clamp(25px, 2.8vw, 36px); }
.logo--masthead .logo__seal::after { top: 8px; bottom: 8px; }
.logo--masthead .logo__wordmark { font-size: clamp(54px, 7vw, 94px); letter-spacing: -.055em; }
.logo--masthead .logo__copy small { margin-top: 7px; font-size: clamp(9px, 1vw, 12px); letter-spacing: .24em; }
@media (max-width: 560px) {
  .logo--masthead { gap: 12px; }
  .logo--masthead .logo__seal { width: 52px; height: 52px; font-size: 22px; }
  .logo--masthead .logo__wordmark { font-size: 44px; }
}
</style>
