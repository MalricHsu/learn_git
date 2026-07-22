<script setup>
import { RouterLink, useRoute } from "vue-router";
import { store, toggleTheme } from "../composables/useStore.js";
import GitDailyLogo from "./GitDailyLogo.vue";

const route = useRoute();
</script>

<template>
  <nav class="subnav" aria-label="Primary">
    <div class="wrap subnav__inner">
      <RouterLink to="/" class="subnav__brand">
        <GitDailyLogo variant="compact" />
      </RouterLink>

      <div class="subnav__links">
        <RouterLink to="/" :class="{ active: route.name === 'home' }">首頁</RouterLink>
        <RouterLink to="/reference" :class="{ active: route.name === 'reference' || route.name === 'command' }">手冊</RouterLink>
        <RouterLink to="/game" :class="{ active: route.name === 'game' }">闖關</RouterLink>
        <RouterLink to="/practice" :class="{ active: route.name === 'practice' }">練習</RouterLink>
        <RouterLink to="/favorites" :class="{ active: route.name === 'favorites' }">收藏</RouterLink>
        <RouterLink to="/mistakes" :class="{ active: route.name === 'mistakes' }">錯題簿</RouterLink>
        <button
          class="icon-btn"
          :aria-label="store.theme === 'dark' ? 'Switch to light mode 切換淺色' : 'Switch to dark mode 切換深色'"
          @click="toggleTheme"
        >
          <span aria-hidden="true">{{ store.theme === "dark" ? "☀" : "☾" }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
