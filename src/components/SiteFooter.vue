<script setup>
import { RouterLink } from "vue-router";

const sections = [
  { to: "/", label: "首頁" },
  { to: "/reference", label: "指令手冊" },
  { to: "/game", label: "闖關學習" },
  { to: "/practice", label: "測驗" },
  { to: "/favorites", label: "收藏剪報" },
  { to: "/mistakes", label: "錯題簿" },
];
</script>

<template>
  <footer class="footer">
    <div class="wrap footer__inner">
      <div class="footer__brand">
        <h3>Git Daily</h3>
        <p>像閱讀每日報紙一樣學習 Git。</p>
      </div>

      <nav class="footer__nav" aria-label="頁面">
        <RouterLink v-for="section in sections" :key="section.to" :to="section.to">
          {{ section.label }}
        </RouterLink>
      </nav>

      <div class="footer__colophon">
        <span>© 2026 Git Daily · Made by 7lun</span>
        <span>Playfair Display · Noto Serif TC · IBM Plex Mono</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 96px;
  padding: 40px 0 56px;
  border-top: 1px solid var(--ink);
}
.footer__inner {
  display: grid;
  gap: 34px;
}
.footer__brand h3 {
  margin: 0;
  font-family: var(--display);
  font-weight: 900;
  font-size: 26px;
  letter-spacing: -0.02em;
}
.footer__brand p {
  margin: 6px 0 0;
  font-family: var(--serif-tc);
  font-size: 14px;
  color: var(--ink-faint);
}
/* One honest row of real destinations — no placeholder links. */
.footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 30px;
  padding: 22px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.footer__nav a {
  font-family: var(--serif-tc);
  font-size: 15px;
  color: var(--ink-soft);
  transition: color 0.18s;
}
.footer__nav a:hover {
  color: var(--primary);
}
.footer__colophon {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px 24px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
}
</style>
