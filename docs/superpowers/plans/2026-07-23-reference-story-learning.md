# Reference Story Learning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every Git reference command a connected newsroom story and reorganize the reference page around task, choice, execution, result, warning, and continuation.

**Architecture:** Add a standalone story-data module keyed by existing command slugs, leaving technical command facts in `commands.js`. `Reference.vue` resolves the current story through one computed value and combines it with existing syntax, terminal, workflow, safety, and related-command content.

**Tech Stack:** Vue 3 Composition API, JavaScript ES modules, CSS, Node built-in test runner, Vite.

## Global Constraints

- Cover all 29 current command slugs with tailored story content.
- Preserve existing search, categories, favorites, danger warnings, terminal examples, workflow diagrams, mistakes, and related links.
- Keep destructive-command warnings ahead of execution details.
- Add no dependencies.
- Do not overwrite unrelated working-tree changes in `commands.js` or challenge components.

---

### Task 1: Complete Newsroom Story Data

**Files:**
- Create: `src/data/referenceStories.js`
- Create: `tests/reference-stories.test.js`

**Interfaces:**
- Consumes: a command slug string.
- Produces: `storyBySlug(slug): { chapter, scene, choice, result, next }`.

- [ ] Write a failing test that imports `commands` and `storyBySlug`, asserts all
  five fields are non-empty for every command, asserts all 29 slugs are
  tailored, and verifies an unknown slug returns a complete fallback.
- [ ] Run `node --test tests/reference-stories.test.js`; expect module-not-found.
- [ ] Create `referenceStories.js` with a five-field story for every current
  slug. Follow the command order as a continuous first-issue newsroom journey:
  project setup, daily editing, parallel desks, delivery, investigation,
  advanced history work, and a safety drill.
- [ ] Run `node --test tests/reference-stories.test.js`; expect all story-data
  tests to pass.

---

### Task 2: Story-Led Reference Reading Order

**Files:**
- Modify: `src/views/Reference.vue`
- Modify: `tests/reference-copy.test.js`

**Interfaces:**
- Consumes: `storyBySlug(current.slug)`.
- Produces: computed `story` and the visible sections `今日任務`, `你的選擇`,
  `技術拆解`, `執行現場`, `任務結果`, `編輯提醒`, and `下一幕`.

- [ ] Add a failing source test for the `storyBySlug` import, computed story,
  seven section labels, `.book-scene`, `.book-result`, and `.book-next-scene`.
- [ ] Run `node --test tests/reference-copy.test.js`; expect the new assertions
  to fail while existing reference assertions pass.
- [ ] Import `storyBySlug`, define
  `const story = computed(() => storyBySlug(current.value.slug))`, and reorder
  the book spread to show story context before technical explanation.
- [ ] Keep `book-danger` before the book spread, keep existing syntax and
  terminal rendering unchanged, and place the narrative bridge beside related
  commands in the footer.
- [ ] Add scoped styles for the story kicker, scene block, result block, and
  next-scene copy using existing design tokens and the current mobile stack.
- [ ] Run `node --test tests/reference-copy.test.js`; expect all reference-page
  tests to pass.

---

### Task 3: Regression Verification and Commit

**Files:**
- Verify: `src/data/referenceStories.js`
- Verify: `src/views/Reference.vue`
- Verify: `tests/reference-stories.test.js`
- Verify: `tests/reference-copy.test.js`

- [ ] Run
  `node --test tests/reference-stories.test.js tests/reference-copy.test.js`;
  expect zero failures.
- [ ] Run `npm run build`; expect Vite to exit successfully.
- [ ] Run `npm test`; record any failures from unrelated in-progress curriculum
  work without changing that work.
- [ ] Run `git diff --check`; expect no whitespace errors.
- [ ] Review the scoped diff and confirm `commands.js` and challenge components
  were not changed by this implementation.
- [ ] Commit only the four implementation/test files with
  `git commit -m "feat: turn reference into a learning story"`.
