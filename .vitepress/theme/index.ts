// https://vitepress.dev/guide/custom-theme
import Teek, { zhCn } from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import "./styles/custom.css";
import type { Theme } from "vitepress";
import { useData } from "vitepress";
import { h, computed } from "vue";
import GithubStarButton from "./components/GithubStarButton.vue";
import BreadcrumbLocaleFix from "./components/BreadcrumbLocaleFix.vue";
import SponsorPageEn from "./components/SponsorPageEn.vue";
import SponsorPageZh from "./components/SponsorPageZh.vue";
import SponsorPageZhTw from "./components/SponsorPageZhTw.vue";

const theme: Theme = {
  extends: Teek,
  enhanceApp({ app }) {
    app.component("SponsorPageEn", SponsorPageEn);
    app.component("SponsorPageZh", SponsorPageZh);
    app.component("SponsorPageZhTw", SponsorPageZhTw);
  },
  Layout: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Layout = Teek.Layout as any;
    const { localeIndex } = useData();
    const locale = computed(() =>
      localeIndex.value === "zh" || localeIndex.value === "zh-tw" ? zhCn : undefined
    );

    return h(Layout, { locale: locale.value }, {
      "nav-bar-content-after": () => h(GithubStarButton),
      "doc-before": () => h(BreadcrumbLocaleFix),
    });
  },
};

export default theme;
