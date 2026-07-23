import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Reference from "./views/Reference.vue";
import Game from "./views/Game.vue";
import Practice from "./views/Practice.vue";
import Favorites from "./views/Favorites.vue";
import Mistakes from "./views/Mistakes.vue";
import { applySeo } from "./seo.js";

const routes = [
  { path: "/", name: "home", component: Home, meta: { title: "首頁" } },
  {
    path: "/reference",
    name: "reference",
    component: Reference,
    meta: { title: "指令手冊" },
  },
  {
    path: "/reference/:cmd",
    name: "command",
    component: Reference,
    meta: { title: "指令手冊" },
  },
  {
    path: "/game",
    name: "game",
    component: Game,
    meta: { title: "闖關學習" },
  },
  {
    path: "/practice",
    name: "practice",
    component: Practice,
    meta: { title: "測驗" },
  },
  {
    path: "/favorites",
    name: "favorites",
    component: Favorites,
    meta: { title: "收藏剪報" },
  },
  {
    path: "/mistakes",
    name: "mistakes",
    component: Mistakes,
    meta: { title: "錯題簿" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 80 };
    return { top: 0 };
  },
});

router.afterEach(applySeo);

export default router;
