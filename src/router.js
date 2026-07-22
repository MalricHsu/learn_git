import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./views/Home.vue";
import Reference from "./views/Reference.vue";
import Game from "./views/Game.vue";
import Practice from "./views/Practice.vue";

const routes = [
  { path: "/", name: "home", component: Home, meta: { title: "Home · 首頁" } },
  { path: "/reference", name: "reference", component: Reference, meta: { title: "Git Reference · 指令手冊" } },
  { path: "/reference/:cmd", name: "command", component: Reference, meta: { title: "Git Reference · 指令手冊" } },
  { path: "/game", name: "game", component: Game, meta: { title: "Challenge · 闖關" } },
  { path: "/practice", name: "practice", component: Practice, meta: { title: "Practice · 練習題庫" } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 80 };
    return { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = "Git Daily · " + (to.meta.title || "");
});

export default router;
