<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { categories, commands, byCategory, bySlug } from "../data/commands.js";
import { storyBySlug } from "../data/referenceStories.js";
import {
  store,
  toggleFavorite,
  pushRecent,
  toast,
} from "../composables/useStore.js";

const route = useRoute();
const router = useRouter();
const query = ref("");

const current = computed(() => bySlug(route.params.cmd) || commands[0]);
const story = computed(() => storyBySlug(current.value.slug));
const isFav = computed(() => store.favorites.includes(current.value.slug));
const currentCategory = computed(() =>
  categories.find((category) => category.id === current.value.category),
);
const visibleCommands = computed(() => {
  const q = query.value.trim().toLowerCase();
  const source = q ? commands : byCategory(current.value.category);
  return source.filter(
    (command) =>
      !q ||
      command.name.toLowerCase().includes(q) ||
      command.tagline.zh.includes(q),
  );
});
const relatedCmds = computed(() =>
  current.value.related.map(bySlug).filter(Boolean),
);
const commandIndex = computed(() =>
  commands.findIndex((item) => item.slug === current.value.slug),
);

watch(
  () => route.params.cmd,
  () => {
    if (current.value) pushRecent(current.value.slug);
  },
  { immediate: true },
);

onMounted(() => {
  if (!route.params.cmd) router.replace(`/reference/${commands[0].slug}`);
});

function fav() {
  toggleFavorite(current.value.slug);
  toast(
    isFav.value ? "已收藏" : "已取消收藏",
    current.value.name,
    isFav.value ? "success" : "warn",
  );
}
function renderParts(parts) {
  return parts
    .map(([cls, text]) => (cls ? `<span class="tok-${cls}">${text}</span>` : text))
    .join("");
}
</script>

<template>
  <main class="wrap ref">
    <header class="ref__head">
      <h1>指令手冊</h1>
      <label class="ref__search">
        <input
          v-model="query"
          type="search"
          placeholder="搜尋指令"
          aria-label="搜尋指令"
        />
      </label>
    </header>

    <nav class="ref__chapters" aria-label="全部章節">
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        :to="`/reference/${byCategory(category.id)[0].slug}`"
        :class="{
          active: category.id === current.category,
          'is-danger': category.id === 'danger',
        }"
        >{{ category.zh }}</RouterLink
      >
    </nav>

    <nav class="ref__strip" aria-label="章節指令">
      <RouterLink
        v-for="command in visibleCommands"
        :key="command.slug"
        :to="`/reference/${command.slug}`"
        :class="{ active: command.slug === current.slug }"
        >{{ command.name }}</RouterLink
      >
    </nav>

    <article class="ref__article">
      <header class="ref__title">
        <p class="ref__kicker">
          <b :class="{ 'is-danger': current.category === 'danger' }">{{
            currentCategory?.zh
          }}</b>
          <span>第 {{ commandIndex + 1 }} 篇，共 {{ commands.length }} 篇</span>
        </p>
        <h2>{{ current.name }}</h2>
        <p class="ref__tagline">{{ current.tagline.zh }}</p>
        <p class="ref__meta">
          <button
            class="ref__fav"
            :class="{ 'is-on': isFav }"
            :aria-pressed="isFav"
            :aria-label="isFav ? '取消收藏' : '加入收藏'"
            @click="fav"
          >
            <span>{{ isFav ? "★" : "☆" }}</span
            >{{ isFav ? "已收藏" : "收藏這篇" }}
          </button>
          <span>閱讀約 {{ current.reads }}</span>
        </p>
      </header>

      <section v-if="current.danger" class="ref__danger">
        <p class="ref__danger-flag">危險操作 · 執行前請先讀完</p>
        <dl>
          <div><dt>會失去什麼</dt><dd>{{ current.risk.zh }}</dd></div>
          <div><dt>救不救得回來</dt><dd>{{ current.recover.zh }}</dd></div>
          <div><dt>更安全的做法</dt><dd>{{ current.safer.zh }}</dd></div>
        </dl>
      </section>

      <div class="ref__body">
        <div class="ref__main">
          <p class="ref__lead">{{ story.scene }}</p>

          <h3>為什麼現在用 {{ current.name }}</h3>
          <p>{{ story.choice }}</p>

          <h3>核心概念</h3>
          <p>{{ current.what.zh }}</p>
          <p>{{ current.scenario?.zh || current.why.zh }}</p>

          <h3>Git 內部發生了什麼</h3>
          <p>
            {{
              current.internals?.zh ||
              current.workflowNote?.zh ||
              current.why.zh
            }}
          </p>
          <div class="ref__flow">
            <template v-for="(node, index) in current.workflow" :key="index">
              <span :class="{ active: node.active }">{{ node.zh }}</span>
              <i v-if="index < current.workflow.length - 1">→</i>
            </template>
          </div>

          <h3>在終端機試一次</h3>
          <div class="ref__terminal">
            <pre><span
              v-for="(line, index) in current.example"
              :key="index"
              v-html="renderParts(line.parts) + '\n'"
            ></span><em>{{ current.output }}</em></pre>
          </div>
          <p class="ref__note">
            {{
              current.outputNote?.zh ||
              "這是 Git 執行指令後回傳的結果；確認內容是否符合你預期的操作。"
            }}
          </p>

          <h3>結果</h3>
          <p>{{ story.result }}</p>
          <p class="ref__next-scene">{{ story.next }}</p>
        </div>

        <aside class="ref__aside">
          <section>
            <h4>語法</h4>
            <dl class="ref__syntax">
              <div v-for="(syntax, index) in current.syntax" :key="index">
                <dt><code>{{ syntax.code }}</code></dt>
                <dd>{{ syntax.note.zh }}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h4>容易踩到的坑</h4>
            <ul class="ref__mistakes">
              <li v-for="(mistake, index) in current.mistakes" :key="index">
                {{ mistake.zh }}
              </li>
            </ul>
          </section>

          <section v-if="relatedCmds.length">
            <h4>接著讀</h4>
            <nav class="ref__related">
              <RouterLink
                v-for="related in relatedCmds"
                :key="related.slug"
                :to="`/reference/${related.slug}`"
              >
                <b>{{ related.name }}</b>
                <span>{{ related.tagline.zh }}</span>
              </RouterLink>
            </nav>
          </section>
        </aside>
      </div>
    </article>
  </main>
</template>

<style scoped>
.ref {
  padding-top: 34px;
  padding-bottom: 96px;
}

/* ---------- Masthead strip ---------- */
.ref__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ink);
}
.ref__head h1 {
  margin: 0;
  font-family: var(--serif-tc);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 900;
}
.ref__search input {
  width: 230px;
  padding: 7px 2px;
  border: 0;
  border-bottom: 1px solid var(--border);
  background: transparent;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--ink);
}
.ref__search input:focus {
  outline: none;
  border-bottom-color: var(--primary);
}

/* ---------- Two navigation rows, both plain type ---------- */
.ref__chapters,
.ref__strip {
  display: flex;
  gap: 26px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 14px 0;
}
.ref__chapters::-webkit-scrollbar,
.ref__strip::-webkit-scrollbar {
  display: none;
}
.ref__chapters a {
  flex: none;
  font-family: var(--serif-tc);
  font-size: 15px;
  font-weight: 400;
  color: var(--ink-faint);
  padding-bottom: 7px;
  border-bottom: 3px solid transparent;
  transition:
    color 0.18s,
    border-color 0.18s;
}
.ref__chapters a:hover {
  color: var(--ink);
}
/* You-are-here has to beat the focus ring, so it takes colour + weight + rule. */
.ref__chapters a.active {
  color: var(--primary);
  font-weight: 900;
  border-bottom-color: var(--primary);
}
.ref__chapters a.is-danger {
  color: color-mix(in srgb, var(--danger) 72%, var(--ink-faint));
}
.ref__chapters a.is-danger.active {
  color: var(--danger);
  border-bottom-color: var(--danger);
}
.ref__strip {
  gap: 20px;
  padding: 2px 0 0;
  border-bottom: 1px solid var(--border);
}
.ref__strip a {
  flex: none;
  padding-bottom: 6px;
  border-bottom: 1px solid transparent;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--ink-faint);
  transition:
    color 0.18s,
    border-color 0.18s;
}
.ref__strip a:hover {
  color: var(--primary);
}
/* Thinner rule than the chapter row above, so the two levels stay distinct. */
.ref__strip a.active {
  color: var(--primary);
  font-weight: 700;
  border-bottom-color: var(--primary);
}

/* ---------- Title: the command itself is the headline ---------- */
.ref__title {
  padding: 56px 0 40px;
}
.ref__kicker {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 0;
  font-family: var(--serif-tc);
  font-size: 13px;
  color: var(--ink-faint);
}
.ref__kicker b {
  font-size: 15px;
  font-weight: 900;
  color: var(--primary);
}
.ref__kicker b.is-danger {
  color: var(--danger);
}
.ref__title h2 {
  margin: 10px 0 0;
  font-family: var(--mono);
  font-size: clamp(38px, 6.6vw, 88px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--primary);
}
.ref__tagline {
  margin: 16px 0 0;
  font-family: var(--serif-tc);
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
}
.ref__meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 22px 0 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-faint);
}
/* Saving an article is a real action, so it gets a real control. */
.ref__fav {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border);
  background: transparent;
  font-family: var(--serif-tc);
  font-size: 14px;
  color: var(--ink-soft);
  transition:
    border-color 0.18s,
    color 0.18s,
    background 0.18s;
}
.ref__fav span {
  font-size: 15px;
  line-height: 1;
}
.ref__fav:hover {
  border-color: var(--warning);
  color: var(--warning);
}
.ref__fav.is-on {
  border-color: var(--warning);
  background: color-mix(in srgb, var(--warning) 10%, transparent);
  color: var(--warning);
}

/* ---------- Danger ---------- */
.ref__danger {
  margin-bottom: 44px;
  padding: 20px 24px 22px;
  border-left: 3px solid var(--danger);
  background: color-mix(in srgb, var(--danger) 5%, transparent);
}
.ref__danger-flag {
  margin: 0 0 14px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--danger);
}
.ref__danger dl {
  margin: 0;
  display: grid;
  gap: 14px;
}
.ref__danger dt {
  font-family: var(--serif-tc);
  font-size: 13px;
  font-weight: 700;
  color: var(--danger);
}
.ref__danger dd {
  margin: 5px 0 0;
  font-family: var(--serif-tc);
  font-size: 15px;
  line-height: 1.9;
  color: var(--ink-soft);
}

/* ---------- Article body: long-form left, reference right ---------- */
.ref__body {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(230px, 3fr);
  gap: 88px;
  align-items: start;
}
.ref__lead {
  margin: 0 0 40px;
  font-family: var(--serif-tc);
  font-size: clamp(18px, 1.9vw, 21px);
  line-height: 1.95;
  color: var(--ink);
}
.ref__main h3 {
  margin: 44px 0 14px;
  font-family: var(--serif-tc);
  font-size: 20px;
  font-weight: 700;
}
.ref__main p {
  margin: 0 0 14px;
  font-family: var(--serif-tc);
  font-size: 16px;
  line-height: 2;
  color: var(--ink-soft);
}
.ref__next-scene {
  margin-top: 22px !important;
  padding-left: 16px;
  border-left: 1px solid var(--secondary);
  color: var(--ink-faint) !important;
}

.ref__flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 20px 0 0;
}
.ref__flow span {
  font-family: var(--serif-tc);
  font-size: 14px;
  color: var(--ink-faint);
}
.ref__flow span.active {
  color: var(--primary);
  font-weight: 700;
}
.ref__flow i {
  font-style: normal;
  color: var(--secondary);
}

.ref__terminal {
  margin: 4px 0 0;
  padding: 22px 24px;
  background: var(--terminal-bg);
}
.ref__terminal pre {
  margin: 0;
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.9;
  color: var(--code-fg);
  white-space: pre-wrap;
  word-break: break-word;
}
.ref__terminal em {
  display: block;
  margin-top: 12px;
  color: var(--ink-faint);
  font-style: normal;
}
.ref__note {
  margin-top: 14px !important;
  font-size: 14px !important;
  color: var(--ink-faint) !important;
}

/* ---------- Sidebar ---------- */
.ref__aside {
  min-width: 0;
}
.ref__aside section + section {
  margin-top: 40px;
}
.ref__aside h4 {
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ink);
  font-family: var(--serif-tc);
  font-size: 14px;
  font-weight: 700;
}
.ref__syntax {
  margin: 0;
}
.ref__syntax > div + div {
  margin-top: 16px;
}
.ref__syntax code {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--primary);
}
.ref__syntax dd {
  margin: 5px 0 0;
  font-family: var(--serif-tc);
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-faint);
}
.ref__mistakes {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ref__mistakes li {
  position: relative;
  padding: 0 0 0 18px;
  font-family: var(--serif-tc);
  font-size: 13px;
  line-height: 1.8;
  color: var(--ink-soft);
}
.ref__mistakes li + li {
  margin-top: 12px;
}
.ref__mistakes li::before {
  content: "×";
  position: absolute;
  left: 0;
  color: var(--danger);
}
.ref__related {
  display: grid;
  gap: 14px;
}
.ref__related a {
  display: block;
}
.ref__related b {
  display: block;
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
}
.ref__related span {
  font-family: var(--serif-tc);
  font-size: 12px;
  color: var(--ink-faint);
}
.ref__related a:hover b {
  border-bottom: 1px solid var(--primary);
}

@media (max-width: 900px) {
  .ref__body {
    grid-template-columns: 1fr;
    gap: 56px;
  }
  .ref__aside {
    padding-top: 40px;
    border-top: 1px solid var(--border);
  }
  .ref__title {
    padding: 40px 0 32px;
  }
}
@media (max-width: 600px) {
  .ref__head {
    align-items: stretch;
    flex-direction: column;
  }
  .ref__search input {
    width: 100%;
  }
}
</style>
