import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

await page.goto("http://127.0.0.1:5173/#/game");
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForSelector(".challenge-layout");

assert.match(await page.locator(".challenge-progress").innerText(), /0 \/ 32 CHALLENGES COMPLETE/);
assert.equal(await page.locator(".roadmap__chapter").count(), 6);
for (const label of ["Git Workflow", "Git Graph", "Commit Timeline", "Editor's Desk"]) {
  assert.match(await page.locator(".visualization").innerText(), new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

const hintButton = page.locator(".brief__hints button");
await hintButton.click();
assert.equal(await page.locator(".brief__hints li").count(), 1);
await hintButton.click();
assert.equal(await page.locator(".brief__hints li").count(), 2);
await hintButton.click();
assert.equal(await page.locator(".brief__hints li").count(), 3);

const terminal = page.getByLabel("Type a git command");
const run = async (command) => { await terminal.fill(command); await terminal.press("Enter"); };
const next = async () => { await page.locator(".challenge-complete .btn").click(); await page.waitForTimeout(50); };

await run("git init");
await page.waitForSelector(".challenge-complete");
assert.match(await page.locator(".desk").innerText(), /建立儲存庫/);
assert.match(await page.locator(".challenge-progress").innerText(), /1 \/ 32/);
await next();

await run("git status");
await page.waitForSelector(".challenge-complete");
assert.match(await page.locator(".desk").innerText(), /先確認，再行動/);
await next();

await run("git add README.md");
await page.waitForSelector(".challenge-complete");
assert.match(await page.locator(".workflow__zone").nth(1).innerText(), /README\.md/);
assert.match(await page.locator(".desk").innerText(), /放入暫存區/);
await next();

await run('git commit -m "Initial commit"');
await page.waitForSelector(".challenge-complete");
assert.match(await page.locator(".timeline").innerText(), /Initial commit/);
assert.match(await page.locator(".graph").innerText(), /HEAD → main/);
const xpAfterFour = await page.locator(".challenge-progress").innerText();
assert.match(xpAfterFour, /200 \/ /);

await page.locator(".roadmap__item").nth(3).click();
assert.equal(await page.locator(".challenge-complete").count(), 0);
await run('git commit -m "Initial commit"');
await page.waitForSelector(".challenge-complete");
assert.equal(await page.locator(".challenge-progress").innerText(), xpAfterFour);

await page.locator(".roadmap__item").nth(4).click();
await run("git init");
await run("git status");
await run("git add .");
await run('git commit -m "Initial commit"');
await page.waitForSelector(".achievement");
assert.match(await page.locator(".achievement").innerText(), /Git Explorer/);

const stateBeforeDanger = await page.locator(".workflow").innerText();
await run("rm -rf .git");
assert.match(await page.locator(".desk").innerText(), /刪除整個 Git 歷史/);
assert.equal(await page.locator(".workflow").innerText(), stateBeforeDanger);

await page.screenshot({ path: "/tmp/git-daily-challenge.png", fullPage: true });
assert.equal(consoleErrors.length, 0, consoleErrors.join("\n"));
console.log("browser verification passed: 32 challenges, hints, workflow, graph, timeline, editor desk, replay, achievement, safety");
await browser.close();
