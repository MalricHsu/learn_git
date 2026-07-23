import { commands, bySlug } from "./data/commands.js";
import { challenges } from "./data/challenges.js";

// Production origin. Used for the sitemap and as the fallback when the page is
// rendered outside a browser. At runtime the real origin always wins, so this
// only needs to be right for the generated sitemap.
export const SITE_URL = "https://git-daily.example.com";

export const SITE_NAME = "Git Daily";
export const DEFAULT_DESCRIPTION =
  "Git Daily 是一本可以互動的 Git 教科書。29 篇指令手冊、38 關情境闖關與隨機測驗，讓你看著檔案移動、版本誕生、分支交會，真正理解 Git 而不是死背語法。";

const origin = () =>
  typeof window === "undefined" ? SITE_URL : window.location.origin;

// One description per route. Search results show ~155 characters, so these are
// written to say something useful inside that budget rather than repeat the title.
const DESCRIPTIONS = {
  home: DEFAULT_DESCRIPTION,
  reference:
    "Git 指令手冊：29 篇中文文章，從 git init 到 git revert，每篇說明它做什麼、什麼時候用、Git 內部發生了什麼，並附上語法、實際輸出與常見錯誤。",
  game: `闖關學習：${challenges.length} 個情境關卡，在瀏覽器內建的 Git 模擬終端機輸入指令，即時看見工作目錄、暫存區與分支圖的變化。`,
  practice:
    "Git 測驗：選擇題與手寫題兩種模式，隨機抽題檢驗你對指令的掌握。答錯自動收進錯題簿，並附上正解與中文說明。",
  favorites: "把手冊裡想再讀一次的 Git 指令收藏起來，整理成自己的學習剪報。",
  mistakes:
    "錯題簿：測驗中答錯的題目會自動保存，附上你的答案、正確答案與中文解釋，可以直接重練。",
};

function describe(route) {
  if (route.name === "command") {
    const command = bySlug(route.params.cmd);
    if (command) {
      const risk = command.danger ? `這是破壞性指令：${command.risk.zh}` : "";
      return `${command.name} — ${command.tagline.zh}。${command.what.zh}${risk}`;
    }
  }
  return DESCRIPTIONS[route.name] || DEFAULT_DESCRIPTION;
}

function titleFor(route) {
  if (route.name === "command") {
    const command = bySlug(route.params.cmd);
    if (command) return `${command.name} · ${command.tagline.zh}`;
  }
  return route.meta.title || "";
}

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/) || [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Keep title, description, canonical and social cards in step with the route. */
export function applySeo(route) {
  const section = titleFor(route);
  const title = section ? `${section} · ${SITE_NAME}` : SITE_NAME;
  const description = describe(route).slice(0, 200);
  const url = origin() + route.path;

  document.title = title;
  setMeta('meta[name="description"]', "content", description);
  setLink("canonical", url);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
}

/** Every crawlable path, for the generated sitemap. */
export function allPaths() {
  return [
    "/",
    "/reference",
    ...commands.map((command) => `/reference/${command.slug}`),
    "/game",
    "/practice",
    "/favorites",
    "/mistakes",
  ];
}
