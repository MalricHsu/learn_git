<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { store, toggleFavorite } from "../composables/useStore.js";
import { commands, categories } from "../data/commands.js";

const savedGroups = computed(() => categories.map((category) => ({
  ...category,
  commands: commands.filter((command) => command.category === category.id && store.favorites.includes(command.slug)),
})).filter((category) => category.commands.length));
</script>

<template>
  <div class="wrap library-page saved-clippings">
    <header class="library-masthead">
      <div>
        <p class="library-kicker">Reader's Archive · 讀者檔案</p>
        <h1>Saved Clippings <span>收藏剪報</span></h1>
      </div>
      <p class="library-summary">把想再讀一次的 Git 指令留在這裡，整理成自己的學習剪報。</p>
    </header>

    <template v-if="savedGroups.length">
      <section v-for="(group, groupIndex) in savedGroups" :key="group.id" class="clipping-section">
        <header>
          <span>{{ String(groupIndex + 1).padStart(2, "0") }}</span>
          <h2>{{ group.en }}</h2>
          <p>{{ group.zh }}</p>
        </header>
        <article v-for="command in group.commands" :key="command.slug" class="clipping-row">
          <div class="clipping-row__number">{{ command.name }}</div>
          <div class="clipping-row__copy">
            <h3>{{ command.tagline.zh }}</h3>
            <p>{{ command.what.zh }}</p>
          </div>
          <div class="clipping-row__actions">
            <RouterLink :to="`/reference/${command.slug}`">閱讀手冊 <span>→</span></RouterLink>
            <button type="button" @click="toggleFavorite(command.slug)">移除收藏</button>
          </div>
        </article>
      </section>
    </template>

    <section v-else class="library-empty">
      <p class="library-kicker">The archive is quiet · 剪報簿還是空的</p>
      <h2>尚未收藏任何指令</h2>
      <p>閱讀手冊時按下星號，就能把重要指令收進這一頁。</p>
      <RouterLink class="btn" to="/reference">前往指令手冊 →</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.library-page { padding: 20px 0 56px; min-height: 70vh; }
.library-masthead { display: grid; grid-template-columns: 1.4fr .6fr; align-items: end; gap: 36px; padding: 10px 0 14px; border-top: 4px double var(--ink); border-bottom: 4px double var(--ink); }
.library-kicker { color: var(--primary); font-family: var(--mono); font-size: 14px; letter-spacing: .18em; text-transform: uppercase; }
.library-masthead h1 { margin: 5px 0 0; font-family: var(--display); font-size: clamp(32px, 3vw, 44px); line-height: 1; }
.library-masthead h1 span { display: inline-block; margin-left: 16px; font-family: var(--serif); font-size: .42em; font-weight: 500; }
.library-summary { max-width: 430px; color: var(--ink-soft); font-family: var(--serif); font-size: 17px; line-height: 1.8; }
.clipping-section { margin-top: 20px; border-bottom: 3px double var(--ink); }
.clipping-section > header { display: flex; align-items: baseline; gap: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--ink); }
.clipping-section > header span { color: var(--accent); font: 16px var(--mono); }
.clipping-section > header h2 { font-family: var(--display); font-size: 24px; }
.clipping-section > header p { color: var(--ink-soft); font-family: var(--serif); font-size: 16px; }
.clipping-row { display: grid; grid-template-columns: 170px 1fr auto; gap: 24px; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--border); }
.clipping-row:last-child { border-bottom: 0; }
.clipping-row__number { color: var(--primary); font: 700 20px var(--mono); }
.clipping-row__copy h3 { margin-bottom: 5px; font-family: var(--serif); font-size: 20px; }
.clipping-row__copy p { display: -webkit-box; overflow: hidden; color: var(--ink-soft); font-family: var(--serif); font-size: 16px; line-height: 1.7; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.clipping-row__actions { display: flex; align-items: center; gap: 18px; }
.clipping-row__actions a, .clipping-row__actions button { white-space: nowrap; font-size: 15px; }
.clipping-row__actions a { color: var(--primary); font-weight: 700; }
.clipping-row__actions button { padding: 8px 0; border: 0; border-bottom: 1px solid var(--border); background: none; color: var(--ink-soft); cursor: pointer; }
.library-empty { max-width: 720px; margin: 80px auto 0; padding: 44px; border: 1px solid var(--border); border-top: 4px double var(--ink); background: var(--paper-2); text-align: center; }
.library-empty h2 { margin: 14px 0; font-family: var(--display); font-size: 38px; }
.library-empty > p:not(.library-kicker) { margin-bottom: 28px; color: var(--ink-soft); font-family: var(--serif); font-size: 17px; }
@media (max-width: 800px) {
  .library-masthead { grid-template-columns: 1fr; gap: 18px; }
  .clipping-row { grid-template-columns: 1fr; gap: 12px; }
  .clipping-row__actions { justify-content: space-between; }
}
</style>
