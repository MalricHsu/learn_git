<script setup>
import { useRoute } from "vue-router";
import SiteNav from "./components/SiteNav.vue";
import SiteFooter from "./components/SiteFooter.vue";
import ToastHost from "./components/ToastHost.vue";

const route = useRoute();
// Key views by route name (not full path) so navigating between commands
// within Reference reuses the instance, but switching views swaps cleanly.
</script>

<template>
  <SiteNav />
  <main id="main">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.name" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
  <ToastHost />
</template>

<style scoped>
.page-enter-active { transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1); }
.page-leave-active { transition: opacity 0.2s ease; }
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .page-enter-active, .page-leave-active { transition: none; }
  .page-enter-from { transform: none; }
}
</style>
