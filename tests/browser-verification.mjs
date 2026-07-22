import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const consoleErrors = [];

async function verifyViewport(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

  await page.goto("http://127.0.0.1:5173/#/game");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector(".challenge-layout");

  const terminalInput = await page.locator(".terminal__input").boundingBox();
  const editorDesk = await page.locator(".desk").boundingBox();
  const measurements = await page.evaluate(() => Object.fromEntries(
    [".challenge-head", ".challenge-layout", ".brief", ".terminal-frame", ".terminal__input", ".visualization__title", ".desk"].map((selector) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect();
      return [selector, rect ? { top: Math.round(rect.top), height: Math.round(rect.height), bottom: Math.round(rect.bottom) } : null];
    }),
  ));
  console.log(`${width}px measurements`, measurements);
  assert.ok(terminalInput && terminalInput.y + terminalInput.height <= 900, `${width}px: Terminal input must be above the fold`);
  assert.ok(editorDesk && editorDesk.y + editorDesk.height <= 900, `${width}px: Editor's Desk must be above the fold`);
  assert.equal(await page.locator(".viz-tabs__viewport .viz-section").count(), 1, `${width}px: render one visualization at a time`);

  for (const label of ["Workflow", "Graph", "Timeline"]) {
    await page.getByRole("tab", { name: new RegExp(`^${label}`) }).click();
    assert.equal(await page.locator(".viz-tabs__viewport .viz-section").count(), 1);
  }

  await page.screenshot({ path: `/tmp/git-daily-challenge-workspace-${width}.png`, fullPage: true });
  await page.close();
}

await verifyViewport(1440);
await verifyViewport(1600);

assert.equal(consoleErrors.length, 0, consoleErrors.join("\n"));
console.log("browser verification passed: Terminal, Editor's Desk, and one visualization are visible at 1440×900 and 1600×900");
await browser.close();
