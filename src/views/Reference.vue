<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { categories, commands, byCategory, bySlug, vocabulary } from "../data/commands.js";
import { store, toggleFavorite, pushRecent, toast } from "../composables/useStore.js";

const route = useRoute();
const router = useRouter();
const query = ref("");
const activeTab = ref("syntax");

const current = computed(() => bySlug(route.params.cmd) || commands[0]);
const isFav = computed(() => store.favorites.includes(current.value.slug));

const filtered = (catId) =>
  byCategory(catId).filter((c) => {
    const q = query.value.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.tagline.zh.includes(q) || c.tagline.en.toLowerCase().includes(q);
  });

const relatedCmds = computed(() => current.value.related.map(bySlug).filter(Boolean));

watch(
  () => route.params.cmd,
  () => { activeTab.value = "syntax"; if (current.value) pushRecent(current.value.slug); },
  { immediate: true }
);
onMounted(() => { if (!route.params.cmd) router.replace(`/reference/${commands[0].slug}`); });

function fav() {
  toggleFavorite(current.value.slug);
  toast(
    isFav.value ? "Added to Favorites" : "Removed from Favorites",
    isFav.value ? `${current.value.name} · 已收藏` : `${current.value.name} · 已取消`,
    isFav.value ? "success" : "warn"
  );
}

function renderParts(parts) {
  return parts.map(([cls, txt]) => (cls ? `<span class="tok-${cls}">${txt}</span>` : txt)).join("");
}
</script>

<template>
  <div class="wrap" style="padding-top: 40px">
    <div class="ref-layout">
      <!-- =================== SIDEBAR =================== -->
      <aside class="sidebar">
        <div class="search" style="margin-bottom: 28px">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input v-model="query" type="search" placeholder="搜尋指令" aria-label="搜尋指令" />
          <kbd>⌘K</kbd>
        </div>

        <nav aria-label="Command index">
          <div v-for="cat in categories" :key="cat.id" class="sidebar__group" v-show="filtered(cat.id).length">
            <h4><span>{{ cat.en }}</span><span class="zh">{{ cat.zh }}</span></h4>
            <RouterLink
              v-for="c in filtered(cat.id)"
              :key="c.slug"
              :to="`/reference/${c.slug}`"
              :class="{ active: c.slug === current.slug }"
            >
              <span>{{ c.name }}</span>
              <span v-if="store.favorites.includes(c.slug)" style="color: var(--warning)">★</span>
            </RouterLink>
          </div>
        </nav>
      </aside>

      <!-- =================== ARTICLE =================== -->
      <article class="article" :key="current.slug">
        <!-- Article header -->
        <header class="art-head reveal in">
          <div class="flex between items-center wrap-flex gap4">
            <span class="badge badge--solid">{{ categories.find((c) => c.id === current.category)?.en }}</span>
            <div class="flex gap3 items-center">
              <span class="u-mono" style="font-size: 12px; color: var(--ink-faint)">{{ current.reads }} read</span>
              <button class="icon-btn" :aria-pressed="isFav" :aria-label="isFav ? 'Remove favorite' : 'Add favorite'" @click="fav" :style="{ color: isFav ? 'var(--warning)' : '' }">
                {{ isFav ? "★" : "☆" }}
              </button>
            </div>
          </div>
          <h1 class="art-title">{{ current.name }}</h1>
          <p class="art-tagline u-serif">{{ current.tagline.zh }}</p>
        </header>

        <hr class="rule-thin" style="margin: 32px 0" />

        <!-- 這是什麼 -->
        <h2>什麼是這個指令</h2>
        <p class="lead">{{ current.what.zh }}</p>

        <!-- 為什麼使用 -->
        <h2>為什麼需要它</h2>
        <p>{{ current.why.zh }}</p>

        <!-- 工作流程 -->
        <h2>工作流程</h2>
        <p v-if="current.workflowNote">{{ current.workflowNote.zh }}</p>
        <div class="flow">
          <div class="flow__row">
            <template v-for="(node, i) in current.workflow" :key="i">
              <div class="flow__node" :class="{ 'is-active': node.active }">
                {{ node.zh }}
              </div>
              <span v-if="i < current.workflow.length - 1" class="flow__arrow" aria-hidden="true">→</span>
            </template>
          </div>
        </div>

        <!-- Syntax / Example / Output as tabs -->
        <h2>語法與範例</h2>
        <div data-tabs>
          <div class="tabs" role="tablist">
            <button role="tab" :class="{ active: activeTab === 'syntax' }" @click="activeTab = 'syntax'">語法</button>
            <button role="tab" :class="{ active: activeTab === 'example' }" @click="activeTab = 'example'">範例</button>
            <button role="tab" :class="{ active: activeTab === 'output' }" @click="activeTab = 'output'">執行結果</button>
          </div>

          <div v-show="activeTab === 'syntax'" class="tab-panel" :class="{ active: activeTab === 'syntax' }" role="tabpanel">
            <div class="syntax-list">
              <div v-for="(s, i) in current.syntax" :key="i" class="syntax-row">
                <code class="mono">{{ s.code }}</code>
                <span class="u-serif">{{ s.note.zh }}</span>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'example'" class="tab-panel" :class="{ active: activeTab === 'example' }" role="tabpanel">
            <div class="codeblock">
              <div class="codeblock__bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="label">終端機</span></div>
              <pre><span v-for="(l, i) in current.example" :key="i" v-html="renderParts(l.parts) + '\n'"></span></pre>
            </div>
          </div>

          <div v-show="activeTab === 'output'" class="tab-panel" :class="{ active: activeTab === 'output' }" role="tabpanel">
            <div class="codeblock">
              <div class="codeblock__bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="label">執行結果</span></div>
              <pre style="color: var(--code-fg)">{{ current.output }}</pre>
            </div>
          </div>
        </div>

        <!-- Common mistakes -->
        <h2>常見錯誤</h2>
        <ul class="mistakes">
          <li v-for="(m, i) in current.mistakes" :key="i">
            <span class="mistakes__mark" aria-hidden="true">✕</span>
            <div><span>{{ m.zh }}</span></div>
          </li>
        </ul>

        <!-- Related -->
        <h2>相關指令</h2>
        <div class="related">
          <RouterLink v-for="r in relatedCmds" :key="r.slug" :to="`/reference/${r.slug}`" class="related__card">
            <code>{{ r.name }}</code>
            <span class="u-serif">{{ r.tagline.zh }}</span>
          </RouterLink>
        </div>

        <!-- Vocabulary -->
        <h2>Git 專有名詞</h2>
        <dl class="vocab">
          <div v-for="v in vocabulary.slice(0, 8)" :key="v.en" class="vocab__card">
            <dt>{{ v.en }} <span class="zh">{{ v.zh }}</span></dt>
            <dd>{{ v.def.zh }}</dd>
          </div>
        </dl>

        <!-- Footer nav -->
        <div class="art-foot">
          <RouterLink to="/game" class="btn btn--ghost">到闖關練習</RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.art-head { padding-top: 8px; }
.art-title { font-family: var(--mono); font-weight: 700; font-size: clamp(32px, 5vw, 52px); margin: 20px 0 8px; color: var(--primary); letter-spacing: -.01em; }
.art-tagline { font-family: var(--display); font-size: 20px; color: var(--ink); margin: 0; }

.syntax-list { display: flex; flex-direction: column; gap: 2px; }
.syntax-row { display: flex; align-items: center; gap: 20px; padding: 14px 16px; border-bottom: 1px solid var(--border); }
.syntax-row code { font-size: 14px; color: var(--primary); min-width: 220px; }
.syntax-row .u-serif { color: var(--ink-soft); font-size: 14px; }

.mistakes { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.mistakes li { display: flex; gap: 14px; padding: 16px; border: 1px solid var(--border); border-left: 3px solid var(--danger); border-radius: 6px; background: var(--paper-2); }
.mistakes__mark { color: var(--danger); font-weight: 700; }
.mistakes li span { color: var(--ink); }
.mistakes li small { display: block; color: var(--ink-faint); font-size: 13px; margin-top: 4px; font-style: italic; }

.related { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.related__card { padding: 18px; border: 1px solid var(--border); border-radius: 8px; background: var(--paper-2); transition: all .2s; }
.related__card:hover { border-color: var(--primary); transform: translateY(-3px); }
.related__card code { display: block; color: var(--primary); font-size: 15px; margin-bottom: 6px; }
.related__card .u-serif { color: var(--ink-soft); font-size: 13px; }

.art-foot { margin-top: 56px; padding-top: 32px; border-top: 3px double var(--ink); }

@media (max-width: 720px) {
  .syntax-row { flex-direction: column; align-items: flex-start; gap: 6px; }
  .related { grid-template-columns: 1fr; }
}
</style>
