import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [favorites, mistakes, router, nav, footer] = await Promise.all([
  read("../src/views/Favorites.vue"),
  read("../src/views/Mistakes.vue"),
  read("../src/router.js"),
  read("../src/components/SiteNav.vue"),
  read("../src/components/SiteFooter.vue"),
]);

test("favorites page is an editorial saved-command collection", () => {
  for (const text of ["Saved Clippings", "收藏剪報", "store.favorites", "toggleFavorite", "尚未收藏任何指令", "閱讀手冊"])
    assert.ok(favorites.includes(text), text);
  assert.ok(favorites.includes("groupIndex + 1"));
  assert.match(favorites, /font-size:\s*clamp\(32px,\s*3vw,\s*44px\)/);
  assert.match(favorites, /\.library-page\s*\{[^}]*padding:\s*20px 0 56px/s);
});

test("mistake journal explains errors and offers retry and management actions", () => {
  for (const text of ["Mistake Journal", "錯題簿", "store.mistakes", "你的答案", "正確答案", "中文解釋", "重新練習錯題", "resolveMistake", "clearMistakes"])
    assert.ok(mistakes.includes(text), text);
  assert.ok(mistakes.includes('/practice?mode=mistakes'));
  assert.match(mistakes, /font-size:\s*clamp\(32px,\s*3vw,\s*44px\)/);
  assert.match(mistakes, /\.library-page\s*\{[^}]*padding:\s*20px 0 56px/s);
});

test("router and primary navigation expose both library pages", () => {
  assert.ok(router.includes("createWebHistory"));
  assert.equal(router.includes("createWebHashHistory"), false);
  assert.ok(router.includes('path: "/favorites"'));
  assert.ok(router.includes('path: "/mistakes"'));
  assert.ok(nav.includes('to="/favorites"'));
  assert.ok(nav.includes('to="/mistakes"'));
});

test("footer links to the new pages and credits 7lun in English", () => {
  assert.ok(footer.includes('to="/favorites"'));
  assert.ok(footer.includes('to="/mistakes"'));
  assert.ok(footer.includes("© 2026 Git Daily · Made by 7lun"));
});
