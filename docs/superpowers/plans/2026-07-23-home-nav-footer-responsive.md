# Home, Navigation, and Footer Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Balance the seven homepage chapter cards and provide a compact, accessible mobile navigation and footer.

**Architecture:** Keep the existing Vue components and CSS breakpoints. Add local menu state and route-driven closing behavior to `SiteNav.vue`, adjust the existing responsive grids in scoped/global CSS, and extend the repository's source-level Node tests without adding dependencies.

**Tech Stack:** Vue 3 Composition API, Vue Router 4, CSS media queries, Node built-in test runner, Vite.

## Global Constraints

- Desktop navigation and footer appearance must remain unchanged.
- Homepage chapters use four columns on desktop, two at 900px and below, and one at 600px and below.
- Mobile navigation keeps the logo and theme button visible while page links live in an accessible collapsible menu.
- Mobile footer keeps all links visible and uses two columns beneath a full-width brand introduction.
- Do not modify chapter data or the user's in-progress teaching-content changes.
- Add no new dependencies.

---

### Task 1: Homepage Chapter Grid

**Files:**
- Modify: `src/views/Home.vue`
- Test: `tests/home-page.test.js`

**Interfaces:**
- Consumes: `chapters` from `src/data/challenges.js`.
- Produces: responsive `.chapter-editions__grid` CSS with four, two, and one-column states.

- [ ] **Step 1: Write the failing responsive-grid test**

Append to `tests/home-page.test.js`:

```js
test("chapter editions balance seven chapters across responsive columns", () => {
  assert.match(
    home,
    /\.chapter-editions__grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/s,
  );
  assert.match(
    home,
    /@media \(max-width:\s*900px\)[\s\S]*?\.chapter-editions__grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/,
  );
  assert.match(
    home,
    /@media \(max-width:\s*600px\)[\s\S]*?\.chapter-editions__grid\s*\{[^}]*grid-template-columns:\s*1fr/,
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/home-page.test.js`

Expected: FAIL because the desktop declaration still contains `repeat(3, 1fr)`.

- [ ] **Step 3: Implement the four-column desktop grid**

In `src/views/Home.vue`, change only the desktop declaration:

```css
.chapter-editions__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-left: 1px solid var(--border);
}
```

Keep the existing 900px two-column and 600px one-column rules unchanged.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `node --test tests/home-page.test.js`

Expected: all tests in `tests/home-page.test.js` pass.

- [ ] **Step 5: Commit the homepage grid change**

```bash
git add src/views/Home.vue tests/home-page.test.js
git commit -m "fix: balance homepage chapter grid"
```

---

### Task 2: Accessible Mobile Navigation

**Files:**
- Modify: `src/components/SiteNav.vue`
- Modify: `src/style.css`
- Test: `tests/library-pages.test.js`

**Interfaces:**
- Consumes: `route` from `useRoute()`, `store`, `toggleTheme()`, and existing named routes.
- Produces: `menuOpen: Ref<boolean>`, `closeMenu(): void`, `#primary-menu`, and `.subnav__menu-toggle`.

- [ ] **Step 1: Write the failing navigation structure test**

Append to `tests/library-pages.test.js`:

```js
test("mobile navigation exposes and closes an accessible menu", () => {
  assert.ok(nav.includes('id="primary-menu"'));
  assert.ok(nav.includes(':aria-expanded="menuOpen"'));
  assert.ok(nav.includes('aria-controls="primary-menu"'));
  assert.ok(nav.includes('class="icon-btn subnav__menu-toggle"'));
  assert.ok(nav.includes('@click="closeMenu"'));
  assert.match(nav, /watch\(\s*\(\) => route\.fullPath,[\s\S]*?menuOpen\.value = false/);
});

test("mobile navigation and footer define compact responsive layouts", () => {
  assert.match(
    styles,
    /@media \(max-width:\s*720px\)[\s\S]*?\.subnav__menu-toggle\s*\{[^}]*display:\s*grid/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*720px\)[\s\S]*?\.subnav__links\s*\{[^}]*display:\s*none/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*720px\)[\s\S]*?\.subnav__links\.is-open\s*\{[^}]*display:\s*flex/,
  );
});
```

Update the existing `Promise.all` at the top of the file to load the stylesheet:

```js
const [favorites, mistakes, router, nav, footer, styles] = await Promise.all([
  readFile(new URL("../src/views/Favorites.vue", import.meta.url), "utf8"),
  readFile(new URL("../src/views/Mistakes.vue", import.meta.url), "utf8"),
  readFile(new URL("../src/router.js", import.meta.url), "utf8"),
  readFile(new URL("../src/components/SiteNav.vue", import.meta.url), "utf8"),
  readFile(new URL("../src/components/SiteFooter.vue", import.meta.url), "utf8"),
  readFile(new URL("../src/style.css", import.meta.url), "utf8"),
]);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/library-pages.test.js`

Expected: FAIL because `menuOpen`, the menu toggle, menu semantics, and mobile CSS do not exist.

- [ ] **Step 3: Add local menu state and route-driven closing**

Replace the `SiteNav.vue` script with:

```vue
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
```

- [ ] **Step 4: Add accessible menu markup**

Restructure the content inside `.subnav__inner` as:

```vue
<RouterLink to="/" class="subnav__brand" @click="closeMenu">
  <GitDailyLogo variant="compact" />
</RouterLink>

<div
  id="primary-menu"
  class="subnav__links"
  :class="{ 'is-open': menuOpen }"
>
  <RouterLink to="/" :class="{ active: route.name === 'home' }" @click="closeMenu">首頁</RouterLink>
  <RouterLink to="/reference" :class="{ active: route.name === 'reference' || route.name === 'command' }" @click="closeMenu">手冊</RouterLink>
  <RouterLink to="/game" :class="{ active: route.name === 'game' }" @click="closeMenu">闖關</RouterLink>
  <RouterLink to="/practice" :class="{ active: route.name === 'practice' }" @click="closeMenu">練習</RouterLink>
  <RouterLink to="/favorites" :class="{ active: route.name === 'favorites' }" @click="closeMenu">收藏</RouterLink>
  <RouterLink to="/mistakes" :class="{ active: route.name === 'mistakes' }" @click="closeMenu">錯題簿</RouterLink>
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
```

- [ ] **Step 5: Add desktop tool placement and mobile menu CSS**

Near the existing `.subnav` rules in `src/style.css`, add:

```css
.subnav__links { margin-left: auto; }
.subnav__tools { display: flex; align-items: center; gap: var(--s2); }
.subnav__menu-toggle { display: none; }
```

Change `.subnav__inner` to allow the menu to occupy a second row:

```css
.subnav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s4);
  padding: var(--s3) 0;
}
```

Inside the existing `@media (max-width: 720px)` block, add:

```css
.subnav__inner { flex-wrap: wrap; }
.subnav__links { margin-left: 0; order: 3; }
.subnav__tools { margin-left: auto; order: 2; }
.subnav__menu-toggle { display: grid; }
.subnav__links {
  display: none;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  padding-top: var(--s2);
  border-top: var(--hairline);
}
.subnav__links.is-open { display: flex; }
.subnav__links a {
  padding: 11px 2px;
  border-bottom: var(--hairline);
}
```

- [ ] **Step 6: Run the focused test and verify it passes**

Run: `node --test tests/library-pages.test.js`

Expected: all tests in `tests/library-pages.test.js` pass.

- [ ] **Step 7: Commit the mobile navigation**

```bash
git add src/components/SiteNav.vue src/style.css tests/library-pages.test.js
git commit -m "feat: add accessible mobile navigation"
```

---

### Task 3: Compact Mobile Footer and Full Verification

**Files:**
- Modify: `src/components/SiteFooter.vue`
- Modify: `src/style.css`
- Test: `tests/library-pages.test.js`

**Interfaces:**
- Consumes: the existing `.footer__grid`, `.footer__brand`, and `.footer__bottom` elements.
- Produces: `.footer__links` wrappers that participate in the mobile two-column grid.

- [ ] **Step 1: Write the failing footer layout test**

Append to `tests/library-pages.test.js`:

```js
test("mobile footer keeps its brand full width and link groups in two columns", () => {
  assert.equal((footer.match(/class="footer__links"/g) || []).length, 3);
  assert.match(
    styles,
    /@media \(max-width:\s*720px\)[\s\S]*?\.footer__grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*720px\)[\s\S]*?\.footer__brand\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*720px\)[\s\S]*?\.footer__links:first-of-type\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/library-pages.test.js`

Expected: FAIL because the footer link groups are not identified and the 720px rule still uses one column.

- [ ] **Step 3: Identify footer link groups**

In `src/components/SiteFooter.vue`, add `class="footer__links"` to each of the three direct grid children headed by `版面`, `主題`, and `讀者`. Leave `.footer__brand` unchanged.

- [ ] **Step 4: Implement the mobile two-column footer**

In the existing `@media (max-width: 720px)` block in `src/style.css`, replace the one-column footer rule with:

```css
.footer__grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s6) var(--s5);
}
.footer__brand { grid-column: 1 / -1; }
.footer__links:first-of-type {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-column: 1 / -1;
}
.footer__links:first-of-type h5 { grid-column: 1 / -1; }
.footer__bottom { flex-direction: column; gap: var(--s2); }
```

The first link group spans both columns so its six primary destinations can
use the available width while the shorter topic and reader groups share the
last row.

- [ ] **Step 5: Run focused and full verification**

Run:

```bash
node --test tests/home-page.test.js tests/library-pages.test.js
npm test
npm run build
git diff --check
```

Expected:

- focused tests pass;
- the full Node test suite reports zero failures;
- Vite production build exits with code 0;
- `git diff --check` produces no output.

- [ ] **Step 6: Commit the mobile footer**

```bash
git add src/components/SiteFooter.vue src/style.css tests/library-pages.test.js
git commit -m "fix: compact mobile footer layout"
```

- [ ] **Step 7: Review final scope**

Run:

```bash
git status --short
git diff HEAD~3 -- src/views/Home.vue src/components/SiteNav.vue src/components/SiteFooter.vue src/style.css tests/home-page.test.js tests/library-pages.test.js
```

Expected: only the planned responsive files appear in the three implementation commits; the user's unrelated working-tree changes remain uncommitted and untouched.
