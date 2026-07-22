<script setup>
import { toasts } from "../composables/useStore.js";

const color = (k) =>
  k === "warn" ? "var(--warning)" : k === "danger" ? "var(--danger)" : "var(--success)";
</script>

<template>
  <div class="toast-wrap" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts.items"
        :key="t.id"
        class="toast"
        :style="{ borderLeftColor: color(t.kind) }"
        role="status"
      >
        <span class="dot" :style="{ color: color(t.kind) }"></span>
        <div>
          <b>{{ t.title }}</b>
          <small>{{ t.sub }}</small>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active { transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1); }
.toast-leave-active { transition: all 0.35s ease; }
.toast-enter-from { opacity: 0; transform: translateX(24px); }
.toast-leave-to { opacity: 0; transform: translateX(24px); }
</style>
