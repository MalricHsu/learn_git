<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div class="footer__brand">
          <h3>Git Daily</h3>
          <p>像閱讀每日報紙一樣學習 Git。一本可以互動、可以玩的 Git 教科書。</p>
          <p class="u-mono" style="margin-top: 12px; font-size: 11px; letter-spacing: .1em">
            EST. 2026 · PRINTED DAILY FOR CURIOUS BEGINNERS
          </p>
        </div>
        <div>
          <h5>版面</h5>
          <RouterLink to="/">首頁</RouterLink>
          <RouterLink to="/reference">指令手冊</RouterLink>
          <RouterLink to="/game">闖關</RouterLink>
          <RouterLink to="/practice">練習題庫</RouterLink>
          <RouterLink to="/favorites">收藏剪報</RouterLink>
          <RouterLink to="/mistakes">錯題簿</RouterLink>
        </div>
        <div>
          <h5>主題</h5>
          <RouterLink to="/reference/git-init">開始使用</RouterLink>
          <RouterLink to="/reference/git-branch">分支管理</RouterLink>
          <RouterLink to="/reference/git-push">遠端儲存庫</RouterLink>
        </div>
        <div>
          <h5>讀者</h5>
          <a href="#">指令搜尋</a>
          <RouterLink to="/favorites">收藏</RouterLink>
          <a href="#">無障礙</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© 2026 Git Daily · Made by 7lun</span>
        <span>Set in Playfair Display, Noto Serif TC &amp; JetBrains Mono</span>
      </div>
    </div>
  </footer>
</template>
