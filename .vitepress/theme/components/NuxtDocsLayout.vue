<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { en, zh_cn, zh_tw } from "@nuxt/ui/locale";
import UApp from "@nuxt/ui/components/App.vue";
import UBadge from "@nuxt/ui/components/Badge.vue";
import UButton from "@nuxt/ui/components/Button.vue";
import UContainer from "@nuxt/ui/components/Container.vue";
import UDropdownMenu from "@nuxt/ui/components/DropdownMenu.vue";
import UKbd from "@nuxt/ui/components/Kbd.vue";
import UIcon from "@nuxt/ui/components/Icon.vue";
import UHeader from "@nuxt/ui/components/Header.vue";
import UNavigationMenu from "@nuxt/ui/components/NavigationMenu.vue";
import UPage from "@nuxt/ui/components/Page.vue";
import UPageAnchors from "@nuxt/ui/components/PageAnchors.vue";
import UPageAside from "@nuxt/ui/components/PageAside.vue";
import UPageBody from "@nuxt/ui/components/PageBody.vue";
import UPageCard from "@nuxt/ui/components/PageCard.vue";
import USeparator from "@nuxt/ui/components/Separator.vue";
import DocMotion from "./DocMotion.vue";
import DocTools from "./DocTools.vue";

const DocSearch = defineAsyncComponent(() => import("./DocSearch.vue"));
const { localeIndex, theme, page, isDark } = useData();
interface Nav { text: string; link: string }
interface Group { text: string; items: Nav[] }
const languages = [
  { key: "root", label: "English", prefix: "/", locale: en, docs: "Docs", search: "Search docs", contents: "On this page", skip: "Skip to content", mode: "Switch theme", language: "Language", prev: "Previous", next: "Next", missing: "Page not found" },
  { key: "zh", label: "简体中文", prefix: "/zh/", locale: zh_cn, docs: "文档", search: "搜索文档", contents: "本页目录", skip: "跳到正文", mode: "切换外观", language: "切换语言", prev: "上一篇", next: "下一篇", missing: "找不到此页面" },
  { key: "zh-tw", label: "繁體中文", prefix: "/zh-tw/", locale: zh_tw, docs: "文件", search: "搜尋文件", contents: "本頁目錄", skip: "跳到內文", mode: "切換外觀", language: "切換語言", prev: "上一篇", next: "下一篇", missing: "找不到此頁面" },
];
const local = computed(() => languages.find(l => l.key === localeIndex.value) ?? languages[0]);
const file = computed(() => page.value.relativePath || "");
const path = computed(() => "/" + file.value.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, ""));
const switches = computed(() => languages.map(l => ({
  label: l.label, icon: l.key === local.value.key ? "i-lucide-check" : undefined,
  to: /^README/.test(file.value) ? "/README" + ({ root: "", zh: ".zh-CN", "zh-tw": ".zh-TW" }[l.key] || "") :
    l.prefix + (page.value.isNotFound ? "" : path.value.slice(local.value.prefix.length)),
})));
const sections = computed(() => (theme.value.sidebar ?? {}) as Record<string, Group[]>);
const section = computed(() => Object.keys(sections.value).find(key => path.value.startsWith(key)));
const groups = computed(() => sections.value[section.value || ""] ?? []);
const linkItem = (item: Nav) => ({ label: item.text, to: item.link, active: path.value === item.link });
const navigation = computed(() => (theme.value.nav as Nav[] || []).slice(1).map((item, i) => ({
  ...linkItem(item), icon: ["i-lucide-book-open", "i-lucide-code-xml", "i-lucide-layers", "i-lucide-store", "i-lucide-heart"][i],
  active: path.value === item.link || (path.value !== local.value.prefix + "guide/sponsor" && !!section.value && item.link.startsWith(section.value) && !item.link.endsWith("/sponsor")),
})));
const side = computed(() => groups.value.map(group => [
  { label: group.text, type: "label" as const }, ...group.items.map(linkItem),
]));
const allPages = computed(() => Object.values(sections.value).flatMap(groups => groups.flatMap(g => g.items.map(linkItem))));
const pager = computed(() => {
  const list = groups.value.flatMap(g => g.items);
  const i = list.findIndex(p => p.link === path.value);
  return i < 0 ? [] : [
    { item: list[i - 1], label: local.value.prev, icon: "i-lucide-arrow-left" },
    { item: list[i + 1], label: local.value.next, icon: "i-lucide-arrow-right" },
  ].filter(p => p.item);
});
const outline = computed(() => (page.value.headers || []).map(h => ({ label: h.title, to: h.link })));
const menu = ref(false);
const search = ref(false);
const searchLoaded = ref(false);
function showSearch() { menu.value = false; searchLoaded.value = true; search.value = true; }
function shortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault(); showSearch();
  }
}
onMounted(() => window.addEventListener("keydown", shortcut));
onUnmounted(() => window.removeEventListener("keydown", shortcut));
watch(file, () => { menu.value = false; search.value = false; });
</script>

<template>
  <UApp :locale="local.locale" :toaster="null">
    <div class="ep-docs-shell">
      <a class="sr-only focus:not-sr-only focus:fixed focus:z-100 bg-default p-2" href="#VPContent">{{ local.skip }}</a>
      <DocMotion />
      <UHeader v-model:open="menu" :to="local.prefix" title="EPUSDT" mode="slideover" :menu="{ side: 'left' }">
        <template #title>
          <img src="/logo.png" width="28" height="28" alt=""><span>EPUSDT</span>
          <UBadge color="primary" variant="subtle" size="sm">{{ local.docs }}</UBadge>
        </template>
        <UNavigationMenu :items="navigation" variant="link" :ui="{ linkLeadingIcon: 'hidden' }" />
        <template #right>
          <UButton class="ep-search" color="neutral" variant="ghost" icon="i-lucide-search" :aria-label="local.search" @click="showSearch">
            <span class="hidden xl:inline">{{ local.search }}</span><UKbd class="hidden xl:inline-flex" size="sm">⌘ / Ctrl K</UKbd>
          </UButton>
          <UDropdownMenu :items="switches" :content="{ align: 'end' }">
            <UButton class="ep-lang" color="neutral" variant="ghost" icon="i-lucide-languages" :aria-label="local.language" />
          </UDropdownMenu>
          <UButton class="ep-theme" color="neutral" variant="ghost" :aria-label="local.mode" @click="isDark = !isDark">
            <UIcon name="i-lucide-moon" class="size-5 dark:hidden" /><UIcon name="i-lucide-sun" class="size-5 hidden dark:block" />
          </UButton>
        </template>
        <template #body>
          <UNavigationMenu orientation="vertical" :items="navigation" />
          <USeparator class="my-4" />
          <UNavigationMenu orientation="vertical" :items="side" />
        </template>
      </UHeader>
      <UContainer>
        <UPage :ui="{ center: 'min-w-0' }">
          <template #left>
            <UPageAside class="ep-sidebar self-start">
              <UNavigationMenu orientation="vertical" :items="side" />
            </UPageAside>
          </template>
          <main id="VPContent" tabindex="-1">
            <UPageBody>
              <template v-if="page.isNotFound">
                <h1 class="text-4xl font-bold">404 · {{ local.missing }}</h1>
                <UButton :to="local.prefix">EPUSDT</UButton>
              </template>
              <template v-else>
                <DocTools>
                  <UDropdownMenu v-if="outline.length" :items="outline" :content="{ align: 'start' }">
                    <UButton class="lg:hidden" color="neutral" variant="ghost" icon="i-lucide-list" size="sm" :aria-label="local.contents" />
                  </UDropdownMenu>
                </DocTools>
                <Content class="vp-doc" />
                <nav v-if="pager.length" class="ep-pager grid sm:grid-cols-2 gap-3">
                  <UPageCard v-for="entry in pager" :key="entry.item.link" :to="entry.item.link" :icon="entry.icon"
                    :title="entry.item.text" :description="entry.label" variant="outline" :ui="{ container: 'p-4 sm:p-5 gap-2' }" />
                </nav>
              </template>
            </UPageBody>
          </main>
          <template #right>
            <UPageAside class="self-start ep-outline">
              <template v-if="outline.length">
                <h2 class="text-sm font-semibold text-highlighted mb-3">{{ local.contents }}</h2>
                <UPageAnchors :links="outline" :ui="{ linkLabel: 'whitespace-normal' }" />
                <USeparator class="my-5" />
              </template>
              <UPageAnchors :links="[{ label: 'GitHub', to: 'https://github.com/GMWalletApp/epusdt', icon: 'i-lucide-code-xml', target: '_blank' }, { label: 'Telegram', to: 'https://t.me/epusdt_group', icon: 'i-lucide-send', target: '_blank' }]" />
            </UPageAside>
          </template>
        </UPage>
      </UContainer>
      <footer class="border-t border-default py-6 text-sm text-muted">
        <UContainer class="flex flex-wrap items-center justify-between gap-3">
          <span>© GMwallet</span><div class="flex gap-4"><a href="https://github.com/GMWalletApp/epusdt">GitHub</a><a href="https://t.me/epusdt_group">Telegram</a></div>
        </UContainer>
      </footer>
    </div>
    <DocSearch v-if="searchLoaded" v-model="search" :pages="allPages" :label="local.search" />
  </UApp>
</template>
