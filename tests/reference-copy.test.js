import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/views/Reference.vue", import.meta.url), "utf8");

test("reference article uses Chinese explanatory headings", () => {
  for (const englishHeading of [
    "What is it",
    "Why do we use it",
    "Workflow<span",
    "Syntax &amp; Example",
    "Common Mistakes",
    "Related Commands",
  ]) {
    assert.equal(source.includes(englishHeading), false, `remove ${englishHeading}`);
  }
});

test("reference article does not repeat English explanation paragraphs", () => {
  for (const binding of ["current.what.en", "current.why.en", "{{ m.en }}"]) {
    assert.equal(source.includes(binding), false, `remove ${binding}`);
  }
});
