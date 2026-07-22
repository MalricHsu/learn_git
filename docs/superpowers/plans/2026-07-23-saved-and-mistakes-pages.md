# Saved and Mistakes Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add newspaper-style saved-command and persistent mistake-journal pages, including wrong-question retry and a 2026 7lun footer credit.

**Architecture:** Keep saved command slugs and normalized mistake records in the existing reactive localStorage store. Extract practice session selection into a query-aware path so `/practice?mode=mistakes` starts a retry session from saved mistake IDs, while dedicated views present and manage the two collections.

**Tech Stack:** Vue 3 Composition API, Vue Router hash history, browser localStorage, Node test runner, Vite.

## Global Constraints

- Preserve the existing Modern Editorial newspaper visual language.
- Persist mistakes after refresh and deduplicate them by question ID.
- A repeated wrong answer increments its count and updates the latest answer/time.
- A correct answer during mistake retry marks the item mastered and removes it from the active mistake journal.
- Footer copy must include `© 2026 Git Daily · 7lun 製作`.
- Do not overwrite or discard unrelated working-tree changes.

---

### Task 1: Persistent mistake model

**Files:**
- Create: `src/composables/mistakeRecords.js`
- Modify: `src/composables/useStore.js`
- Test: `tests/mistake-records.test.js`

**Interfaces:**
- Produces: `upsertMistake(records, payload)`, `removeMistake(records, id)`, and store actions `recordMistake`, `resolveMistake`, `clearMistakes`.

- [ ] Write failing tests proving first insertion, repeated-error deduplication, and removal.
- [ ] Run `node --test tests/mistake-records.test.js` and confirm failure because the module is missing.
- [ ] Implement immutable record helpers and connect `store.mistakes` to localStorage key `gd-mistakes`.
- [ ] Run the focused test and confirm it passes.

### Task 2: Favorites and mistake journal routes

**Files:**
- Create: `src/views/Favorites.vue`
- Create: `src/views/Mistakes.vue`
- Modify: `src/router.js`
- Modify: `src/components/SiteNav.vue`
- Modify: `src/components/SiteFooter.vue`
- Test: `tests/library-pages.test.js`

**Interfaces:**
- Consumes: `store.favorites`, `store.mistakes`, `toggleFavorite`, `resolveMistake`, `clearMistakes`, command `bySlug`, and drill IDs.
- Produces: routes `/favorites` and `/mistakes`, plus navigation links.

- [ ] Write failing source-level tests for both routes, both editorial views, empty states, management actions, retry link, and footer credit.
- [ ] Run `node --test tests/library-pages.test.js` and confirm failure because views/routes do not exist.
- [ ] Build both newspaper-style pages with accessible buttons and useful empty states.
- [ ] Add navigation/footer links and exact footer credit.
- [ ] Run the focused test and confirm it passes.

### Task 3: Record and retry wrong questions

**Files:**
- Modify: `src/data/drills.js`
- Modify: `src/views/Practice.vue`
- Test: `tests/practice-mistakes.test.js`

**Interfaces:**
- Consumes: persisted mistake IDs and store actions.
- Produces: `drillById(id)`, automatic wrong-answer recording, correct retry resolution, and `?mode=mistakes` sessions.

- [ ] Write failing tests for ID lookup, wrong-answer recording, retry mode, and resolution after a correct retry.
- [ ] Run `node --test tests/practice-mistakes.test.js` and confirm expected failures.
- [ ] Add drill lookup and query-aware mistake-session initialization.
- [ ] Record wrong attempts from `finishQuestion`; resolve only when answering inside mistake retry.
- [ ] Add retry-specific labels and a safe empty-state redirect/action.
- [ ] Run focused tests and confirm they pass.

### Task 4: Full verification

**Files:**
- Verify all modified files.

- [ ] Run `npm test` and confirm all tests pass.
- [ ] Run `npm run build` and confirm production build succeeds.
- [ ] Inspect `git diff --check` and confirm no whitespace errors.
- [ ] Review the final diff to ensure unrelated existing changes remain intact.
