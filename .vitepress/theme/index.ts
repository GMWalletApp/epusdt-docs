import type { Theme } from "vitepress";
import { defineAsyncComponent } from "vue";
import ui from "@nuxt/ui/vue-plugin";
import SiteLayout from "./components/SiteLayout.vue";
import "./styles/ui.css";
import "./styles/custom.css";
import "./styles/docs.css";

export default {
  Layout: SiteLayout,
  enhanceApp({ app, router }) {
    if (import.meta.env.PROD && !import.meta.env.SSR) {
      const browser = window as Window & { __VP_HASH_MAP__: Record<string, string> };
      let loadedPages = browser.__VP_HASH_MAP__;
      router.onBeforePageLoad = (href) => {
        // VitePress replaces this manifest before retrying a missing page chunk.
        const pages = browser.__VP_HASH_MAP__;
        if (!router.route.component || pages === loadedPages) return;
        const previous = loadedPages;
        if (Object.keys(pages).length === Object.keys(previous).length &&
            Object.keys(previous).every(key => previous[key] === pages[key])) {
          loadedPages = pages;
          return;
        }

        // Only navigate for the active request if two page loads raced.
        if (new URL(href, location.href).pathname === location.pathname) location.reload();
        return false;
      };
    }

    app.use(ui);
    app.component("ApiRoute", defineAsyncComponent(() => import("./components/ApiRoute.vue")));
    app.component("SponsorPageEn", defineAsyncComponent(() => import("./components/SponsorPageEn.vue")));
    app.component("SponsorPageZh", defineAsyncComponent(() => import("./components/SponsorPageZh.vue")));
    app.component("SponsorPageZhTw", defineAsyncComponent(() => import("./components/SponsorPageZhTw.vue")));
  },
} satisfies Theme;
