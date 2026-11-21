<script setup lang="ts">
import { computed, ref, onUnmounted } from "vue";
import { useRouter } from "vitepress";
import UButton from "@nuxt/ui/components/Button.vue";
import UModal from "@nuxt/ui/components/Modal.vue";
import GradientASCII from "./GradientASCII.vue";

const props = defineProps<{ language: "en" | "zh" | "zh-tw" }>();
const guide = "https://epusdt.com/agent-setup/prompt.md";
const translations = {
  en: { title: ["Onchain payments.", "Real-world commerce."], copy: "Copy deployment or migration prompt", shortAction: "Deploy/migrate to EPUSDT", action: "Deploy / migrate to EPUSDT", details: "Learn more", shortCopied: "Copied", copied: "Copied to clipboard", manual: "Copy the prompt", hint: "Press ⌘C or Ctrl+C. On a phone, touch and hold the text, then choose Copy.", close: "Close", instruction: "Read {url}. Inspect my target environment first, then deploy, upgrade or migrate to EPUSDT (GMPay) using Docker. Preserve existing data. For a new instance, open the setup wizard and let me complete password setup myself.", intro: "/guide/intro", nav: "Language" },
  zh: { title: ["为真实经济而建的", "链上支付基础设施。"], copy: "复制部署或迁移指令", shortAction: "部署/迁移到EPUSDT", action: "部署/迁移到EPUSDT", details: "了解详情", shortCopied: "已复制", copied: "部署指令已复制", manual: "手动复制指令", hint: "电脑按 ⌘C 或 Ctrl+C 复制；手机长按下方文字，再点「复制」。", close: "关闭", instruction: "读取 {url}。先检查我的目标环境，按现状用 Docker 新装、升级或从 bepusdt、TokenPay 迁移到 EPUSDT（GMPay），保全原有数据。新实例请打开初始化页面，由我自己完成密码设置。", intro: "/zh/guide/intro", nav: "语言" },
  "zh-tw": { title: ["為真實經濟而建的", "鏈上支付基礎設施。"], copy: "複製部署或遷移指令", shortAction: "部署/遷移到EPUSDT", action: "部署/遷移到EPUSDT", details: "瞭解詳情", shortCopied: "已複製", copied: "部署指令已複製", manual: "手動複製指令", hint: "電腦按 ⌘C 或 Ctrl+C 複製；手機長按下方文字，再點「複製」。", close: "關閉", instruction: "讀取 {url}。先檢查我的目標環境，依現況用 Docker 新裝、升級或從 bepusdt、TokenPay 遷移到 EPUSDT（GMPay），保全原有資料。新實例請開啟初始化頁面，由我自行完成密碼設定。", intro: "/zh-tw/guide/intro", nav: "語言" },
};
const languages = [{ id: "en", label: "EN", url: "/" }, { id: "zh", label: "简", url: "/zh/" }, { id: "zh-tw", label: "繁", url: "/zh-tw/" }];
// Static Lobe Icons (9752d96); license at /licenses/lobe-icons.txt.
const agentPairs = [
  [["codex", "Codex"], ["claudecode-color", "Claude Code"]],
  [["cursor", "Cursor"], ["opencode", "OpenCode"]],
];
const state = ref<"idle" | "copied" | "manual">("idle");
const promptText = computed(() => translations[props.language].instruction.replace("{url}", guide));
let copyTrigger: HTMLElement | null = null;
let attempt = 0;
const field = ref<HTMLTextAreaElement>();
const deployFace = ref<HTMLSpanElement>();
const detailFace = ref<HTMLSpanElement>();
const openingDetails = ref(false);
const router = useRouter();
let deployRebound: Animation | undefined;
let detailRebound: Animation | undefined;
let timer: ReturnType<typeof setTimeout>;
function animateRelease(pill: HTMLElement | undefined, duration: number) {
  if (!pill?.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const from = getComputedStyle(pill).transform;
  return pill.animate([
    { transform: from, offset: 0, easing: "ease-out" },
    { transform: "scale(.965)", offset: 0.16, easing: "cubic-bezier(.16,.8,.32,1)" },
    { transform: "scale(1.025)", offset: 0.48, easing: "ease-in-out" },
    { transform: "scale(.996)", offset: 0.78, easing: "ease-out" },
    { transform: "scale(1)", offset: 1 },
  ], { duration });
}
// Older browsers and embedded views may only support copying a selection.
function copySelection(text: string) {
  if (typeof document.execCommand !== "function") return false;
  const input = document.createElement("textarea");
  input.className = "ep-copy-buffer";
  input.value = text;
  input.readOnly = true;
  input.tabIndex = -1;
  document.body.appendChild(input);
  try {
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    input.remove();
    copyTrigger?.focus({ preventScroll: true });
  }
}

async function copyPrompt(event: MouseEvent) {
  const current = ++attempt;
  copyTrigger = event.currentTarget as HTMLElement;
  deployRebound?.cancel();
  deployRebound = animateRelease(deployFace.value, 390);
  clearTimeout(timer);
  state.value = "idle";
  const text = promptText.value;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    if (current !== attempt) return;
    if (!copySelection(text)) {
      state.value = "manual";
      return;
    }
  }
  if (current !== attempt) return;
  state.value = "copied";
  timer = setTimeout(() => { state.value = "idle"; }, 2400);
}

function selectPrompt(event: Event) {
  event.preventDefault();
  field.value?.focus({ preventScroll: true });
  field.value?.select();
}

function restoreTrigger(event: Event) {
  event.preventDefault();
  if (copyTrigger?.isConnected) copyTrigger.focus({ preventScroll: true });
}
function openDetails(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (openingDetails.value) return;

  const destination = translations[props.language].intro;
  detailRebound = animateRelease(detailFace.value, 210);
  if (!detailRebound) {
    router.go(destination);
    return;
  }

  openingDetails.value = true;
  detailRebound.onfinish = () => {
    openingDetails.value = false;
    router.go(destination);
  };
}
onUnmounted(() => {
  ++attempt;
  clearTimeout(timer);
  deployRebound?.cancel();
  detailRebound?.cancel();
});
</script>

<template>
  <main class="VPHome ep-home">
    <div class="ep-atmosphere" aria-hidden="true">
      <GradientASCII shape="horizon" :cell-size="14" :speed="0.6" :dpr="1" :glow="0.18" :flicker="0.08" :grain="0.035" :colors="['#244ff5', '#cceeff', '#86caff', '#4977fc']" />
    </div>
    <header class="ep-bar">
      <a class="ep-brand" :href="languages.find(l => l.id === language)?.url" aria-label="EPUSDT"><img alt="" src="/logo.png" width="34" height="34">EPUSDT</a>
      <nav class="ep-languages" :aria-label="translations[language].nav">
        <UButton variant="ghost" color="neutral" v-for="item in languages" :key="item.id" :to="item.url" :active="item.id === language" :lang="item.id" :aria-current="item.id === language ? 'page' : undefined">{{ item.label }}</UButton>
      </nav>
    </header>
    <section class="ep-pitch">
      <h1><span v-for="line in translations[language].title" :key="line">{{ line }}</span></h1>
      <div class="ep-actions">
        <UButton variant="solid" color="neutral" class="ep-deploy" type="button"
          :class="{ 'is-copied': state === 'copied' }"
          :title="translations[language].copy" @click="copyPrompt">
          <span ref="deployFace" class="ep-deploy-face">
            <span class="ep-marks" aria-hidden="true">
              <span v-for="pair in agentPairs" :key="pair[0][0]" class="ep-mark-pair">
                <img v-for="[name, label] in pair" :key="name" :src="'/agent-icons/' + name + '.svg'" alt="" :title="label">
              </span>
            </span>
            <span class="ep-labels">
              <span class="ep-idle" :aria-hidden="state === 'copied'"><span class="ep-wide-label">{{ translations[language].action }}</span><span class="ep-short-label">{{ translations[language].shortAction }}</span></span>
              <span class="ep-success" :aria-hidden="state !== 'copied'"><span class="ep-wide-label">{{ translations[language].copied }}</span><span class="ep-short-label">{{ translations[language].shortCopied }}</span></span>
            </span>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6">
              <g class="ep-idle"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></g>
              <path class="ep-success" d="m4 12 5 5L20 6"/>
            </svg>
          </span>
        </UButton>
        <!-- vp-raw lets this link finish its feedback before VitePress takes over navigation. -->
        <UButton variant="outline" color="neutral" class="ep-details vp-raw" :class="{ 'is-opening': openingDetails }"
          :to="translations[language].intro" external @click="openDetails">
          <span ref="detailFace" class="ep-details-face">{{ translations[language].details }} <span class="ep-detail-arrow" aria-hidden="true">↗</span></span>
        </UButton>
      </div>
      <span class="ep-status" role="status">{{ state === 'copied' ? translations[language].copied : '' }}</span>
      <UModal :open="state === 'manual'" @update:open="open => { if (!open) state = 'idle' }"
        :title="translations[language].manual" :description="translations[language].hint"
        :close="{ 'aria-label': translations[language].close }"
        :content="{ onOpenAutoFocus: selectPrompt, onCloseAutoFocus: restoreTrigger }"
        :ui="{ content: 'ep-copy-dialog', overlay: 'ep-copy-overlay', close: 'ep-copy-close' }">
        <template #body>
          <textarea ref="field" class="ep-copy-text" readonly rows="4" spellcheck="false"
            :aria-label="translations[language].manual" :value="promptText" />
        </template>
      </UModal>
      <noscript><a :href="guide">Agent deployment guide ↗</a></noscript>
    </section>
  </main>
</template>
