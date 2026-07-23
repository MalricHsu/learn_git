import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [favorites, mistakes, router, nav, footer, styles] = await Promise.all([
  read("../src/views/Favorites.vue"),
  read("../src/views/Mistakes.vue"),
  read("../src/router.js"),
  read("../src/components/SiteNav.vue"),
  read("../src/components/SiteFooter.vue"),
  read("../src/style.css"),
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

test("mobile navigation exposes and closes an accessible menu", () => {
  assert.ok(nav.includes('id="primary-menu"'));
  assert.ok(nav.includes(':aria-expanded="menuOpen"'));
  assert.ok(nav.includes('aria-controls="primary-menu"'));
  assert.ok(nav.includes('class="icon-btn subnav__menu-toggle"'));
  assert.ok(nav.includes('@click="closeMenu"'));
  assert.match(
    nav,
    /watch\(\s*\(\) => route\.fullPath,[\s\S]*?menuOpen\.value = false/,
  );
});

test("mobile navigation defines a compact responsive menu", () => {
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

test("mobile footer keeps its brand full width and link groups in two columns", () => {
  assert.equal(
    (footer.match(/class="footer__links(?: footer__links--primary)?"/g) || [])
      .length,
    3,
  );
  assert.ok(footer.includes("footer__links--primary"));
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
    /@media \(max-width:\s*720px\)[\s\S]*?\.footer__links--primary\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
  );
});
