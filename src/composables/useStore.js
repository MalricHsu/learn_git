import { reactive, watch } from "vue";
import { DEFAULT_PROGRESS, migrateChallengeProgress } from "./progressRules.js";
import { upsertMistake, removeMistake } from "./mistakeRecords.js";

// -------- Persistent global store (theme, XP, progress, favorites) --------
const load = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};

export const store = reactive({
  theme: document.documentElement.getAttribute("data-theme") || "light",
  xp: load("gd-xp", DEFAULT_PROGRESS.xp),
  completedMissions: migrateChallengeProgress(load("gd-missions", [...DEFAULT_PROGRESS.completedMissions])),
  favorites: load("gd-favs", [...DEFAULT_PROGRESS.favorites]),
  recent: load("gd-recent", [...DEFAULT_PROGRESS.recent]),
  unlockedAchievements: load("gd-achievements", [...DEFAULT_PROGRESS.unlockedAchievements]),
  mistakes: load("gd-mistakes", []),
});

// -------- Persistence --------
watch(() => store.theme, (t) => {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("gd-theme", t);
});
watch(() => store.xp, (v) => localStorage.setItem("gd-xp", JSON.stringify(v)));
watch(() => store.completedMissions, (v) => localStorage.setItem("gd-missions", JSON.stringify(v)), { deep: true });
watch(() => store.favorites, (v) => localStorage.setItem("gd-favs", JSON.stringify(v)), { deep: true });
watch(() => store.recent, (v) => localStorage.setItem("gd-recent", JSON.stringify(v)), { deep: true });
watch(() => store.unlockedAchievements, (v) => localStorage.setItem("gd-achievements", JSON.stringify(v)), { deep: true });
watch(() => store.mistakes, (v) => localStorage.setItem("gd-mistakes", JSON.stringify(v)), { deep: true });

// -------- Actions --------
export function toggleTheme() {
  store.theme = store.theme === "dark" ? "light" : "dark";
}
export function addXp(n) { store.xp += n; }
export function completeMission(id) {
  if (!store.completedMissions.includes(id)) store.completedMissions.push(id);
}
export const completeChallenge = completeMission;
export function unlockAchievement(id) {
  if (store.unlockedAchievements.includes(id)) return false;
  store.unlockedAchievements.push(id);
  return true;
}
export function toggleFavorite(slug) {
  const i = store.favorites.indexOf(slug);
  if (i > -1) store.favorites.splice(i, 1);
  else store.favorites.push(slug);
}
export function pushRecent(slug) {
  const i = store.recent.indexOf(slug);
  if (i > -1) store.recent.splice(i, 1);
  store.recent.unshift(slug);
  store.recent = store.recent.slice(0, 6);
}
export function recordMistake(attempt) {
  store.mistakes = upsertMistake(store.mistakes, attempt);
}
export function resolveMistake(id) {
  store.mistakes = removeMistake(store.mistakes, id);
}
export function clearMistakes() {
  store.mistakes = [];
}

// -------- Toast (lightweight event bus) --------
export const toasts = reactive({ items: [] });
let tid = 0;
export function toast(title, sub, kind = "success") {
  const id = ++tid;
  toasts.items.push({ id, title, sub, kind });
  setTimeout(() => {
    const idx = toasts.items.findIndex((t) => t.id === id);
    if (idx > -1) toasts.items.splice(idx, 1);
  }, 3400);
}
