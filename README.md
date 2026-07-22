# Git Daily — 像閱讀每日報紙一樣學習 Git

> Learn Git like reading the morning paper. 一本可以互動、可以玩的 Git 教科書。

An interactive, bilingual (EN / 繁中) Git learning platform built with **Vue 3 + Vite**.
Modern-editorial design — cream paper, forest-green ink, Playfair Display headlines —
that reads like a magazine and lets you open a terminal to practice on the spot.

## Run it

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # production build to /dist
npm run preview  # preview the production build
```

## The three sections

| Route          | Section                    | What it is |
|----------------|----------------------------|------------|
| `/`            | **Home · 首頁**            | A newspaper front page: masthead, hero, Today's Feature, headlines, Command of the Day, learning progress, roadmap. |
| `/reference`   | **Git Reference · 指令手冊** | Every command is a full article — What / Why / Workflow diagram / Syntax / Example / Output / Common Mistakes / Related / Vocabulary. Searchable sidebar, favorites. |
| `/game`        | **Git Adventure · 闖關**    | Missions, not quizzes. Five challenge types (choice, terminal, scenario, workflow, concept) against a live Git simulator, with XP, Repository Status, Branch Tree, Commit History, and an Editor's Comment on completion. |

## Project structure

```
src/
├── main.js               # app bootstrap + SPA scroll-reveal observer
├── App.vue               # nav + <RouterView> + footer + toasts
├── router.js             # hash-based routing
├── style.css             # the full design system (tokens, components, dark mode)
├── components/           # SiteNav, SiteFooter, ToastHost, Terminal
├── composables/
│   ├── useStore.js       # reactive store: theme, XP, progress, favorites (localStorage)
│   └── useGitEngine.js   # a small, honest Git simulator
├── data/
│   ├── commands.js       # reference articles + vocabulary
│   └── missions.js       # the mission set
└── views/                # Home.vue, Reference.vue, Game.vue
```

## Design system

- **Palette** — Paper `#F8F5EE`, Primary `#315C46`, Secondary `#C6B79C`, Text `#1F2937`,
  Border `#DDD5C5`, plus Success / Warning / Danger. Full dark-mode palette included.
- **Type** — Playfair Display (EN display), Noto Serif TC (中文標題), Inter (body), JetBrains Mono (code).
- **Grid** — 12-column, 8pt spacing scale, generous whitespace.
- **Motion** — restrained: fade, slide-up, hover, button ripple. Respects `prefers-reduced-motion`.
- **A11y** — visible focus rings, ARIA roles/labels, keyboard-navigable terminal (↑/↓ history), light/dark toggle persisted.

Progress (XP, completed missions, favorites, recent commands) persists in `localStorage`.
