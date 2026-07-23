# Reference Story Learning Design

## Goal

Turn the Git reference from a collection of explanatory articles into a
continuous story-led learning experience without weakening its accuracy,
searchability, command examples, or safety guidance.

## Story Premise

The reader joins Git Daily as a new digital editor preparing the publication's
first interactive issue. Each command solves the next concrete problem in that
journey: opening the project, choosing changes for an edition, coordinating
parallel drafts, sending work to the newsroom, investigating history, and
recovering safely from mistakes.

The reader remains the protagonist. Supporting roles such as the senior editor
and other desk members appear only when they clarify collaboration or risk.
The tone is practical and warm rather than fictional for its own sake.

## Content Model

Story content lives in a new `src/data/referenceStories.js` module so the
existing command reference data can continue to hold technical facts.

Each of the 29 command slugs maps to:

- `chapter`: the reader's current stage in the newsroom journey;
- `scene`: the concrete situation that creates a need for the command;
- `choice`: why the reader chooses this command now;
- `result`: what changes after running it, expressed in story terms;
- `next`: a short narrative bridge toward related learning.

The module exports `storyBySlug(slug)`. Unknown slugs return a neutral fallback
story derived from the reference UI so rendering remains safe if future
commands are added before their tailored story.

## Reference Page Structure

The command title, search, categories, danger warning, syntax, terminal output,
workflow visualization, mistakes, and related links remain available.

The explanatory reading order becomes:

1. `今日任務` — the current newsroom scene;
2. `你的選擇` — why this command fits;
3. `技術拆解` — the existing precise command explanation;
4. `執行現場` — syntax and terminal example;
5. `任務結果` — what changed in Git and in the story;
6. `編輯提醒` — mistakes and safe alternatives;
7. `下一幕` — narrative bridge plus related commands.

The story content is visibly distinct through an editorial scene block, but
the page retains the established newspaper design system.

## Responsive Behavior

The existing single-column mobile book layout remains. Story blocks stack in
reading order, with no carousel, pagination, hidden content, or new interaction
state.

## Safety and Accuracy

Danger commands continue to show `會失去什麼`, `救不救得回來`, and
`更安全的做法` before technical execution details. Story copy must never
encourage the reader to execute a destructive command casually.

## Verification

Tests verify that:

- all 29 command slugs have complete tailored story fields;
- unknown slugs receive a complete fallback;
- the reference page renders the seven story-led sections;
- existing terminal, danger, navigation, workflow, and related-command
  structures remain present;
- the production build succeeds.
