import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./style.css";

// Restore saved theme before mount to avoid flash
const savedTheme = localStorage.getItem("gd-theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

createApp(App).use(router).mount("#app");

// -------- Scroll reveal (works across SPA route changes) --------
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const io =
  "IntersectionObserver" in window && !reduce
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.08 }
      )
    : null;

function scanReveals() {
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
    if (io) io.observe(el);
    else el.classList.add("in"); // reduced motion / no IO: show immediately
  });
}

// Re-scan whenever the DOM changes (route transitions, mounts)
let raf = 0;
const mo = new MutationObserver(() => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(scanReveals);
});
mo.observe(document.getElementById("app"), { childList: true, subtree: true });
scanReveals();
