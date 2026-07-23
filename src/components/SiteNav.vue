<script setup>
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { store, toggleTheme } from "../composables/useStore.js";
import GitDailyLogo from "./GitDailyLogo.vue";

const route = useRoute();
const menuOpen = ref(false);
const closeMenu = () => {
  menuOpen.value = false;
};

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <nav class="subnav" aria-label="Primary">
    <div class="wrap subnav__inner">
      <RouterLink to="/" class="subnav__brand" @click="closeMenu">
        <GitDailyLogo variant="compact" />
      </RouterLink>

      <div
        id="primary-menu"
        class="subnav__links"
        :class="{ 'is-open': menuOpen }"
      >
        <RouterLink
          to="/"
          :class="{ active: route.name === 'home' }"
          @click="closeMenu"
          >首頁</RouterLink
        >
        <RouterLink
          to="/reference"
          :class="{
            active: route.name === 'reference' || route.name === 'command',
          }"
          @click="closeMenu"
          >手冊</RouterLink
        >
        <RouterLink
          to="/game"
          :class="{ active: route.name === 'game' }"
          @click="closeMenu"
          >闖關</RouterLink
        >
        <RouterLink
          to="/practice"
          :class="{ active: route.name === 'practice' }"
          @click="closeMenu"
          >練習</RouterLink
        >
        <RouterLink
          to="/favorites"
          :class="{ active: route.name === 'favorites' }"
          @click="closeMenu"
          >收藏</RouterLink
        >
        <RouterLink
          to="/mistakes"
          :class="{ active: route.name === 'mistakes' }"
          @click="closeMenu"
          >錯題簿</RouterLink
        >
      </div>

      <div class="subnav__tools">
        <button
          class="icon-btn"
          :aria-label="store.theme === 'dark' ? 'Switch to light mode 切換淺色' : 'Switch to dark mode 切換深色'"
          @click="toggleTheme"
        >
          <span aria-hidden="true">{{ store.theme === "dark" ? "☀" : "☾" }}</span>
        </button>
        <button
          class="icon-btn subnav__menu-toggle"
          type="button"
          aria-controls="primary-menu"
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? '關閉選單' : '開啟選單'"
          @click="menuOpen = !menuOpen"
        >
          <span aria-hidden="true">{{ menuOpen ? "×" : "☰" }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
