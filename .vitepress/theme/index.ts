import type { Theme } from "vitepress";
import { defineAsyncComponent } from "vue";
import ui from "@nuxt/ui/vue-plugin";
import SiteLayout from "./components/SiteLayout.vue";
import "./styles/ui.css";
import "./styles/custom.css";
import "./styles/docs.css";

export default {
  Layout: SiteLayout,
  enhanceApp({ app }) {
    app.use(ui);
    app.component("SponsorPageEn", defineAsyncComponent(() => import("./components/SponsorPageEn.vue")));
    app.component("SponsorPageZh", defineAsyncComponent(() => import("./components/SponsorPageZh.vue")));
    app.component("SponsorPageZhTw", defineAsyncComponent(() => import("./components/SponsorPageZhTw.vue")));
  },
} satisfies Theme;
