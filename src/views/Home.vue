<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { store } from "../composables/useStore.js";
import { commands, bySlug } from "../data/commands.js";
import { challenges, totalXp } from "../data/challenges.js";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

const done = computed(() => store.completedMissions.length);
const challengePct = computed(() => Math.round((done.value / challenges.length) * 100));
const xpPct = computed(() => Math.min(100, Math.round((store.xp / totalXp) * 100)));

const feature = bySlug("git-init");
const editorsPick = bySlug("git-commit");
const cotd = bySlug("git-branch");

const nextChallenge = computed(
  () => challenges.find((item) => !store.completedMissions.includes(item.id)) || challenges[0]
);
const recentCmds = computed(() => store.recent.map(bySlug).filter(Boolean));

const headlines = [
  { slug: "git-merge", kicker: "分支管理", en: "When Two Timelines Meet", zh: "當兩條時間線相遇" },
  { slug: "git-stash", kicker: "進階操作", en: "Shelving Work Without Regret", zh: "毫無後顧地收起工作" },
  { slug: "git-pull", kicker: "遠端儲存庫", en: "Catching Up With the Team", zh: "跟上團隊的腳步" },
];

const didYouKnow = {
  en: "The name “Git” was chosen by Linus Torvalds in 2005. He jokingly called it “the stupid content tracker.”",
  zh: "「Git」這個名字由 Linus Torvalds 在 2005 年命名。他打趣地稱它為「笨蛋內容追蹤器」。",
};
</script>

<template>
  <div class="home">
  <!-- ======================= MASTHEAD ======================= -->
  <header class="masthead">
    <div class="wrap">
      <div class="masthead__meta">
        <span>Issue No.001 · 創刊號</span>
        <span data-dateline>{{ today }}</span>
        <span>The Morning Paper Edition</span>
      </div>
      <div class="masthead__title">
        <h1>Git Daily</h1>
        <div class="zh">像閱讀每日報紙一樣學習 GIT</div>
      </div>
    </div>
  </header>

  <div class="wrap">
    <!-- ======================= HERO ======================= -->
    <section class="hero reveal">
      <div class="hero__lead">
        <p class="eyebrow">今日頭版</p>
        <h2 class="hero__headline">
          Learn Git like<br />reading the<br /><em>morning paper.</em>
        </h2>
        <p class="hero__deck">
          先閱讀，再理解，立即練習，最後真正記住 Git。
          一份為初學者印製的互動報紙——不是速查表，而是一本可以玩的教科書。
        </p>
        <div class="flex gap4 wrap-flex" style="margin-top: 28px">
          <RouterLink to="/game" class="btn btn--lg">開始學習</RouterLink>
          <RouterLink to="/reference" class="btn btn--ghost btn--lg">翻閱手冊</RouterLink>
        </div>
      </div>

      <!-- Continue learning + progress -->
      <aside class="hero__aside">
        <div class="card">
          <div class="card__kicker"><span>繼續學習</span></div>
          <div class="flex gap5 items-center">
            <div class="xp-ring" :style="{ '--v': xpPct }" role="img" :aria-label="`XP ${xpPct}%`">
              <div class="xp-ring__inner">
                <b>{{ store.xp }}</b>
                <small>XP</small>
              </div>
            </div>
            <div style="flex: 1">
              <div class="flex between" style="font-size: 12px; margin-bottom: 6px">
                <span class="u-mono">闖關進度</span>
                <span class="u-mono">{{ done }}/{{ challenges.length }}</span>
              </div>
              <div class="progress"><div class="progress__bar" :style="{ width: challengePct + '%' }"></div></div>
              <p class="u-serif" style="font-size: 13px; color: var(--ink-soft); margin: 12px 0 0">
                下一關：<strong>{{ nextChallenge.title.zh }}</strong>
              </p>
            </div>
          </div>
          <RouterLink to="/game" class="btn" style="width: 100%; margin-top: 20px">繼續闖關</RouterLink>
        </div>
      </aside>
    </section>

    <hr class="rule" />

    <!-- ======================= TODAY'S FEATURE ======================= -->
    <section class="feature-grid">
      <article class="feature reveal">
        <p class="eyebrow">今日焦點</p>
        <RouterLink :to="`/reference/${feature.slug}`" class="feature__link">
          <h3 class="feature__title">{{ feature.name }}</h3>
          <p class="feature__zh">{{ feature.tagline.zh }} — 建立你的第一個儲存庫</p>
        </RouterLink>
        <p class="feature__body">{{ feature.what.zh }}</p>
        <div class="codeblock" style="margin-top: 20px">
          <div class="codeblock__bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="label">Terminal</span></div>
          <pre><span class="tok-cmd">git</span> init
<span class="tok-comment"># Initialized empty Git repository in /project/.git/</span></pre>
        </div>
        <RouterLink :to="`/reference/${feature.slug}`" class="read-more">
          閱讀完整文章 →
        </RouterLink>
      </article>

      <div class="feature-side">
        <!-- Editor's Pick -->
        <article class="card card--hover reveal">
          <div class="card__kicker"><span>編輯精選</span></div>
          <RouterLink :to="`/reference/${editorsPick.slug}`">
            <h4 class="side-title">{{ editorsPick.name }}</h4>
            <p class="side-zh">{{ editorsPick.tagline.zh }}</p>
            <p class="side-body">{{ editorsPick.why.zh }}</p>
          </RouterLink>
        </article>

        <!-- Command of the Day -->
        <article class="card reveal" style="background: var(--primary); color: var(--paper-2); border-color: var(--primary)">
          <div class="card__kicker" style="color: var(--secondary)"><span>今日指令</span></div>
          <h4 class="side-title" style="color: var(--paper-2)">{{ cotd.name }}</h4>
          <p style="font-family: var(--serif-tc); font-size: 13px; opacity: .85; margin: 4px 0 14px">{{ cotd.tagline.zh }}</p>
          <RouterLink :to="`/reference/${cotd.slug}`" class="btn btn--ghost" style="--fg: var(--paper-2); border-color: rgba(255,255,255,.35); width: 100%">
            學習這個指令
          </RouterLink>
        </article>
      </div>
    </section>

    <hr class="rule-thin u-mt7" />

    <!-- ======================= HEADLINES ======================= -->
    <section class="u-mt7">
      <div class="flex between items-center" style="margin-bottom: 28px">
        <div class="bi"><span class="en" style="font-size: 26px; font-weight: 800">Today's Headlines</span></div>
        <RouterLink to="/reference" class="read-more">全部指令 →</RouterLink>
      </div>
      <div class="headlines">
        <RouterLink v-for="(h, i) in headlines" :key="h.slug" :to="`/reference/${h.slug}`" class="headline reveal">
          <span class="headline__no">{{ String(i + 1).padStart(2, "0") }}</span>
          <div>
            <span class="badge" style="margin-bottom: 12px">{{ h.kicker }}</span>
            <h4>{{ h.en }}</h4>
            <p class="u-serif">{{ h.zh }}</p>
            <code class="headline__cmd">{{ bySlug(h.slug).name }}</code>
          </div>
        </RouterLink>
      </div>
    </section>

    <hr class="rule-thin u-mt7" />

    <!-- ======================= LOWER GRID ======================= -->
    <section class="lower-grid u-mt7">
      <!-- Today's Challenge -->
      <article class="card reveal" style="border-color: var(--secondary)">
        <div class="card__kicker"><span>今日闖關</span></div>
        <div class="mission-hd">
          <div>
            <h3 style="font-family: var(--display); font-size: 24px; margin: 0 0 4px">{{ nextChallenge.title.en }}</h3>
            <p class="u-serif" style="color: var(--ink-soft); margin: 0">{{ nextChallenge.title.zh }}</p>
          </div>
          <span class="badge badge--warn"><span class="dot"></span>{{ nextChallenge.difficulty }}</span>
        </div>
        <p style="color: var(--ink-soft); margin: 16px 0 20px">{{ nextChallenge.summary.zh }}</p>
        <RouterLink to="/game" class="btn">開始闖關</RouterLink>
        <span class="u-mono" style="margin-left: 14px; font-size: 12px; color: var(--warning)">+{{ nextChallenge.xp }} XP</span>
      </article>

      <!-- Recent Commands -->
      <article class="reveal">
        <div class="card__kicker" style="margin-bottom: 18px"><span>最近學習</span></div>
        <div class="recent-list">
          <RouterLink v-for="c in recentCmds" :key="c.slug" :to="`/reference/${c.slug}`" class="recent-item">
            <code>{{ c.name }}</code>
            <span class="u-serif">{{ c.tagline.zh }}</span>
            <span class="recent-arrow">→</span>
          </RouterLink>
        </div>

        <!-- Did you know -->
        <div class="card u-mt5" style="background: var(--secondary-2); border: none">
          <div class="card__kicker"><span>Git 小知識</span></div>
          <p class="u-serif" style="font-size: 15px; line-height: 1.8; margin: 0; color: var(--ink)">{{ didYouKnow.zh }}</p>
        </div>
      </article>
    </section>

    <hr class="rule u-mt7" />

    <!-- ======================= ROADMAP ======================= -->
    <section class="u-mt7">
      <div class="u-center" style="margin-bottom: 40px">
        <p class="eyebrow" style="justify-content: center">學習路線圖</p>
        <h2 style="font-family: var(--display); font-size: clamp(28px, 4vw, 44px); margin: 12px 0 0">
          From first commit to shipping code.
        </h2>
        <p class="u-serif" style="color: var(--ink-soft)">從第一次提交，到把程式碼交付上線。</p>
      </div>
      <div class="roadmap">
        <div v-for="challenge in challenges" :key="challenge.id" class="roadmap__stop reveal" :class="{ done: store.completedMissions.includes(challenge.id) }">
          <div class="roadmap__dot">{{ store.completedMissions.includes(challenge.id) ? "✓" : challenge.no }}</div>
          <h5>{{ challenge.title.zh }}</h5>
          <span class="badge" style="margin-top: 8px">{{ challenge.difficulty }}</span>
        </div>
      </div>
    </section>
  </div>
  </div>
</template>

<style scoped>
/* Hero */
.hero { display: grid; grid-template-columns: 1.5fr 1fr; gap: 56px; padding: 56px 0; align-items: center; }
.hero__headline { font-family: var(--display); font-weight: 900; font-size: clamp(40px, 6vw, 76px); line-height: .98; letter-spacing: -.02em; margin: 20px 0 0; }
.hero__headline em { font-style: italic; color: var(--primary); }
.hero__deck { font-family: var(--serif-tc); font-size: 17px; line-height: 1.9; color: var(--ink-soft); max-width: 46ch; margin-top: 24px; }

/* Feature grid */
.feature-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 48px; padding: 48px 0; }
.feature__link { display: block; }
.feature__title { font-family: var(--mono); font-size: clamp(28px, 4vw, 40px); font-weight: 700; margin: 16px 0 4px; color: var(--primary); }
.feature__zh { font-family: var(--serif-tc); font-size: 18px; color: var(--ink); margin: 0 0 20px; }
.feature__body { font-size: 17px; line-height: 1.85; color: var(--ink-soft); max-width: 54ch; }
.read-more { display: inline-block; margin-top: 24px; font-family: var(--mono); font-size: 13px; letter-spacing: .05em; color: var(--primary); border-bottom: 1px solid var(--secondary); padding-bottom: 2px; }
.feature-side { display: flex; flex-direction: column; gap: 24px; }
.side-title { font-family: var(--display); font-size: 24px; margin: 0; }
.side-zh { font-family: var(--serif-tc); color: var(--ink-soft); font-size: 13px; margin: 4px 0 12px; }
.side-body { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0; }

/* Headlines */
.headlines { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
.headline { display: flex; gap: 20px; padding-top: 20px; border-top: 2px solid var(--ink); transition: transform .25s var(--ease); }
.headline:hover { transform: translateY(-3px); }
.headline:hover h4 { color: var(--primary); }
.headline__no { font-family: var(--display); font-size: 44px; font-weight: 900; color: var(--secondary); line-height: 1; }
.headline h4 { font-family: var(--display); font-size: 22px; margin: 0 0 6px; transition: color .2s; }
.headline p { color: var(--ink-soft); font-size: 14px; margin: 0 0 12px; }
.headline__cmd { font-size: 12px; color: var(--primary); background: var(--secondary-2); padding: 3px 8px; border-radius: 4px; }

/* Lower grid */
.lower-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; }
.recent-list { display: flex; flex-direction: column; }
.recent-item { display: flex; align-items: center; gap: 16px; padding: 14px 4px; border-bottom: 1px solid var(--border); transition: padding .2s; }
.recent-item:hover { padding-left: 12px; }
.recent-item:hover .recent-arrow { opacity: 1; transform: translateX(0); }
.recent-item code { font-size: 14px; color: var(--primary); min-width: 130px; }
.recent-item .u-serif { flex: 1; color: var(--ink-soft); font-size: 14px; }
.recent-arrow { color: var(--primary); opacity: 0; transform: translateX(-6px); transition: all .2s; }

/* Roadmap */
.roadmap { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
.roadmap__stop { text-align: center; padding: 24px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--paper-2); }
.roadmap__stop.done { border-color: color-mix(in srgb, var(--success) 40%, transparent); }
.roadmap__dot { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--border); display: grid; place-items: center; margin: 0 auto 16px; font-family: var(--display); font-weight: 700; }
.roadmap__stop.done .roadmap__dot { background: var(--success); color: var(--paper-2); border-color: var(--success); }
.roadmap__stop h5 { font-family: var(--serif-tc); font-weight: 600; font-size: 14px; margin: 0 0 4px; }
.roadmap__stop p { font-size: 12px; color: var(--ink-faint); margin: 0; }

/* Responsive */
@media (max-width: 900px) {
  .hero, .feature-grid, .lower-grid { grid-template-columns: 1fr; gap: 40px; }
  .headlines { grid-template-columns: 1fr; gap: 28px; }
  .roadmap { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .roadmap { grid-template-columns: 1fr; }
}
</style>
