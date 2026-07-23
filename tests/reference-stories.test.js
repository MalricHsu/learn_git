import test from "node:test";
import assert from "node:assert/strict";
import { commands } from "../src/data/commands.js";
import {
  referenceStories,
  storyBySlug,
} from "../src/data/referenceStories.js";

const requiredFields = ["chapter", "scene", "choice", "result", "next"];

test("every reference command has a complete tailored newsroom story", () => {
  assert.equal(commands.length, 29);
  assert.deepEqual(
    Object.keys(referenceStories).sort(),
    commands.map((command) => command.slug).sort(),
  );

  for (const command of commands) {
    const story = storyBySlug(command.slug);
    for (const field of requiredFields) {
      assert.equal(typeof story[field], "string", `${command.slug}.${field}`);
      assert.ok(
        story[field].trim().length >= (field === "chapter" ? 6 : 18),
        `${command.slug}.${field} is substantial`,
      );
    }
  }
});

test("future commands receive a complete neutral story fallback", () => {
  const story = storyBySlug("git-future-command");
  for (const field of requiredFields) {
    assert.equal(typeof story[field], "string", field);
    assert.ok(story[field].trim().length >= (field === "chapter" ? 6 : 18), field);
  }
});
