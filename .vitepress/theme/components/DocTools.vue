<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useData } from "vitepress";
import UBreadcrumb from "@nuxt/ui/components/Breadcrumb.vue";
import UButton from "@nuxt/ui/components/Button.vue";
import UDropdownMenu from "@nuxt/ui/components/DropdownMenu.vue";

const { page, theme, localeIndex } = useData();
const labels = {
  root: { home: "Home", docs: "Docs", menu: "Page tools", copy: "Copy page link", markdown: "Open Markdown", deploy: "Agent deployment guide", copied: "Link copied", failed: "Select and copy the link" },
  zh: { home: "首页", docs: "文档", menu: "页面工具", copy: "复制页面链接", markdown: "查看 Markdown", deploy: "Agent 部署指南", copied: "链接已复制", failed: "请选择并复制链接" },
  "zh-tw": { home: "首頁", docs: "文件", menu: "頁面工具", copy: "複製頁面連結", markdown: "查看 Markdown", deploy: "Agent 部署指南", copied: "連結已複製", failed: "請選取並複製連結" },
};
const local = computed(() => labels[localeIndex.value as keyof typeof labels] ?? labels.root);
const prefix = computed(() => localeIndex.value === "root" ? "/" : "/" + localeIndex.value + "/");
const file = computed(() => page.value.relativePath);
const section = computed(() => {
  const directory = file.value.slice(prefix.value.length - 1).split("/")[0];
  return theme.value.nav?.find((item: {link?: string}) => item.link?.startsWith(prefix.value + directory + "/"));
});
const crumbs = computed(() => [
  { label: "EPUSDT", to: prefix.value },
  { label: section.value?.text ?? local.value.docs, to: section.value?.link },
]);
const status = ref<"ready" | "copied" | "manual">("ready");
const manual = ref("");
let timer: ReturnType<typeof setTimeout>;
function reset() {
  clearTimeout(timer);
  status.value = "ready";
  manual.value = "";
}
watch(file, reset);
onUnmounted(() => clearTimeout(timer));
async function copyLink() {
  reset();
  const href = new URL(location.pathname, location.origin).href;
  try {
    await navigator.clipboard.writeText(href);
    status.value = "copied";
    timer = setTimeout(reset, 2200);
  } catch {
    status.value = "manual";
    manual.value = href;
  }
}
const items = computed(() => {
  const actions = [{ label: local.value.copy, icon: "i-lucide-link", onSelect: copyLink }];
  const links = [];
  if (/^(?:(?:zh|zh-tw)\/)?(?:guide|api|gmpay-edge|gmshop-edge)\//.test(file.value)) {
    links.push({ label: local.value.markdown, icon: "i-lucide-file-text", to: "/agent-docs/" + file.value, target: "_blank" });
  }
  links.push({ label: local.value.deploy, icon: "i-lucide-terminal", to: "/agent-setup/prompt.md", target: "_blank" });
  return [actions, links];
});
</script>

<template>
  <div class="ep-doc-tools">
    <UBreadcrumb :items="crumbs" :aria-label="local.docs" class="ep-crumbs" />
    <div class="flex items-center gap-1"><slot />
    <UDropdownMenu :items="items" :content="{ align: 'end', sideOffset: 6 }">
      <UButton class="ep-tools-trigger" type="button" color="neutral" variant="outline" size="sm"
        :icon="status === 'copied' ? 'i-lucide-check' : 'i-lucide-ellipsis'" :label="status === 'copied' ? local.copied : local.menu" />
    </UDropdownMenu>
    </div>
    <span class="ep-sr" role="status">{{ status === 'copied' ? local.copied : '' }}</span>
    <label v-if="status === 'manual'" class="ep-copy-field">{{ local.failed }}<input readonly :value="manual" @focus="($event.target as HTMLInputElement).select()" /></label>
  </div>
</template>
