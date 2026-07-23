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
        <h1>收藏剪報</h1>
      </div>
      <p class="library-summary">把想再讀一次的 Git 指令留在這裡，整理成自己的學習剪報。</p>
    </header>

    <template v-if="savedGroups.length">
      <section v-for="(group, groupIndex) in savedGroups" :key="group.id" class="clipping-section">
        <header>
          <h2>{{ group.zh }}</h2>
          <p>{{ group.commands.length }} 篇</p>
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
      <h2>尚未收藏任何指令</h2>
      <p>閱讀手冊時按下星號，就能把重要指令收進這一頁。</p>
      <RouterLink class="btn" to="/reference">前往指令手冊 →</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.library-page { padding-top: 34px; padding-bottom: 96px; min-height: 70vh; }
.library-masthead { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 20px 40px; padding-bottom: 16px; border-bottom: 1px solid var(--ink); }
.library-masthead h1 { margin: 0; font-family: var(--serif-tc); font-weight: 900; font-size: clamp(24px, 3vw, 34px); line-height: 1.1; }
.library-summary { max-width: 44ch; margin: 0; font-family: var(--serif-tc); font-size: 14px; line-height: 1.9; color: var(--ink-faint); }

.clipping-section { margin-top: 56px; }
.clipping-section > header { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--ink); }
.clipping-section > header h2 { margin: 0; font-family: var(--serif-tc); font-weight: 900; font-size: 20px; }
.clipping-section > header p { margin: 0; font-family: var(--mono); font-size: 12px; color: var(--ink-faint); }
.clipping-row { display: grid; grid-template-columns: 150px minmax(0, 1fr) auto; gap: 28px; align-items: baseline; padding: 20px 0; border-bottom: 1px solid var(--border-soft); }
.clipping-row:last-child { border-bottom: 0; }
.clipping-row__number { font-family: var(--mono); font-size: 15px; color: var(--primary); }
.clipping-row__copy h3 { margin: 0 0 6px; font-family: var(--serif-tc); font-size: 17px; font-weight: 700; }
.clipping-row__copy p { margin: 0; display: -webkit-box; overflow: hidden; font-family: var(--serif-tc); font-size: 14px; line-height: 1.8; color: var(--ink-soft); -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.clipping-row__actions { display: flex; align-items: center; gap: 20px; white-space: nowrap; }
.clipping-row__actions a { font-family: var(--serif-tc); font-size: 14px; color: var(--primary); }
.clipping-row__actions button { padding: 0; border: 0; background: none; font-family: var(--serif-tc); font-size: 14px; color: var(--ink-faint); cursor: pointer; transition: color .18s; }
.clipping-row__actions button:hover { color: var(--danger); }

.library-empty { max-width: 46ch; margin: 72px 0 0; }
.library-empty h2 { margin: 0 0 12px; font-family: var(--serif-tc); font-weight: 900; font-size: 26px; }
.library-empty > p { margin: 0 0 28px; font-family: var(--serif-tc); font-size: 15px; line-height: 1.9; color: var(--ink-soft); }
@media (max-width: 800px) {
  .clipping-row { grid-template-columns: 1fr; gap: 12px; }
  .clipping-row__actions { justify-content: space-between; }
}
</style>
