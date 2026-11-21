<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vitepress";
import UButton from "@nuxt/ui/components/Button.vue";
import GradientASCII from "./GradientASCII.vue";

const props = defineProps<{ language: "en" | "zh" | "zh-tw" }>();
const guide = "https://epusdt.com/agent-setup/prompt.md";
const translations = {
  en: { title: ["Onchain payments.", "Real-world commerce."], copy: "Copy deployment or migration prompt", shortAction: "Deploy/migrate to EPUSDT", action: "Deploy / migrate to EPUSDT", details: "Learn more", shortCopied: "Copied", copied: "Copied to clipboard", manual: "Copy this instruction", instruction: "Read {url}. Inspect my target environment first, then deploy, upgrade or migrate to EPUSDT using Docker. Preserve existing data. For a new instance, open the setup wizard and let me complete password setup myself.", intro: "/guide/intro", nav: "Language" },
  zh: { title: ["为真实经济而建的", "链上支付基础设施。"], copy: "复制部署或迁移指令", shortAction: "部署/迁移到EPUSDT", action: "部署/迁移到EPUSDT", details: "了解详情", shortCopied: "已复制", copied: "部署指令已复制", manual: "请复制这条部署或迁移指令", instruction: "读取 {url}。先检查我的目标环境，按现状用 Docker 新装、升级或从 bepusdt、TokenPay 迁移到 EPUSDT，保全原有数据。新实例请打开初始化页面，由我自己完成密码设置。", intro: "/zh/guide/intro", nav: "语言" },
  "zh-tw": { title: ["為真實經濟而建的", "鏈上支付基礎設施。"], copy: "複製部署或遷移指令", shortAction: "部署/遷移到EPUSDT", action: "部署/遷移到EPUSDT", details: "瞭解詳情", shortCopied: "已複製", copied: "部署指令已複製", manual: "請複製這段部署或遷移指令", instruction: "讀取 {url}。先檢查我的目標環境，依現況用 Docker 新裝、升級或從 bepusdt、TokenPay 遷移到 EPUSDT，保全原有資料。新實例請開啟初始化頁面，由我自行完成密碼設定。", intro: "/zh-tw/guide/intro", nav: "語言" },
};
const languages = [{ id: "en", label: "EN", url: "/" }, { id: "zh", label: "简", url: "/zh/" }, { id: "zh-tw", label: "繁", url: "/zh-tw/" }];
// Static Lobe Icons (9752d96); license at /licenses/lobe-icons.txt.
const agents = [["codex", "Codex"], ["claudecode-color", "Claude Code"], ["cursor", "Cursor"], ["opencode", "OpenCode"]];
const state = ref<"idle" | "copied" | "manual">("idle");
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
async function copyPrompt() {
  deployRebound?.cancel();
  deployRebound = animateRelease(deployFace.value, 390);
  clearTimeout(timer);
  const text = translations[props.language].instruction.replace("{url}", guide);
  try {
    await navigator.clipboard.writeText(text);
    state.value = "copied";
    timer = setTimeout(() => { state.value = "idle"; }, 2400);
  } catch {
    state.value = "manual";
    await nextTick();
    field.value?.focus();
    field.value?.select();
  }
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
            <span class="ep-marks" aria-hidden="true"><img v-for="[name, label] in agents" :key="name" :src="'/agent-icons/' + name + '.svg'" alt="" :title="label"></span>
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
      <label v-if="state === 'manual'" class="ep-manual">{{ translations[language].manual }}<textarea ref="field" readonly :value="translations[language].instruction.replace('{url}', guide)" /></label>
      <noscript><a :href="guide">Agent deployment guide ↗</a></noscript>
    </section>
  </main>
</template>

<style>
/* Paint the viewport behind the hero during browser chrome changes and overscroll. */
html:has(.ep-home), body:has(.ep-home) { background-color:#000; }
</style>

<style scoped>
.ep-home { position:relative; isolation:isolate; overflow:hidden; display:flex; flex-direction:column; min-height:100vh; min-height:100dvh; margin:0; background:#000; color:#f3f6ff; font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif; }
.ep-atmosphere { position:absolute; inset:0; z-index:-1; pointer-events:none; background:#000; }
.ep-atmosphere::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.78),rgba(0,0,0,.30) 45%,transparent 76%); }
.ep-bar { display:flex; align-items:center; justify-content:space-between; padding:clamp(20px,3vw,42px) clamp(22px,5.6vw,100px); }
.ep-brand { display:inline-flex; align-items:center; gap:9px; color:inherit; font-size:21px; font-weight:710; letter-spacing:-.055em; text-decoration:none; }
.ep-brand img { width:32px; height:32px; }
.ep-languages { display:flex; align-items:center; gap:4px; }
.ep-languages a { display:grid; place-items:center; min-width:34px; min-height:36px; border-radius:50%; color:#bcc6d8; font-size:13px; text-decoration:none; }
.ep-languages [aria-current], .ep-languages a:hover { color:white; background:#ffffff1a; }
.ep-pitch { position:relative; text-align:center; padding:clamp(60px,12vh,150px) 20px clamp(160px,25vh,300px); }
.ep-pitch h1 { margin:0 auto; color:#f7f8ff; font-size:clamp(46px,6.5vw,110px); font-weight:580; letter-spacing:-.058em; line-height:1.08; }
.ep-pitch h1 span { display:block; }
:lang(zh) .ep-pitch h1 { letter-spacing:-.035em; font-weight:600; line-height:1.2; font-size:clamp(36px,6.1vw,100px); }
.ep-actions { --action-height:54px; display:flex; flex-wrap:nowrap; align-items:center; justify-content:center; gap:12px; margin-top:clamp(27px,4.8vh,54px); }
.ep-short-label { display:none; }
.ep-deploy,.ep-details { box-sizing:border-box; height:var(--action-height); display:inline-flex; align-items:center; justify-content:center; border-radius:100px; text-decoration:none; white-space:nowrap; }
.ep-actions :is(.ep-deploy,.ep-details) { padding:0; border:0; box-shadow:none; background:transparent; cursor:pointer; }
.ep-deploy-face, .ep-details-face { display:inline-flex; align-items:center; justify-content:center; height:100%; border-radius:inherit; }
.ep-deploy-face { gap:13px; padding:0 20px; background:#f7f8fa; color:#14171c; font:inherit; font-weight:620; font-size:15px; box-shadow:0 1px 4px #0004; cursor:pointer; }
.ep-deploy:hover .ep-deploy-face { background:#fff; box-shadow:0 0 0 3px #ffffff2b; }
.ep-labels { display:inline-grid; text-align:center; }
.ep-labels > span { grid-area:1 / 1; }
.ep-success, .is-copied .ep-idle { opacity:0; }
.is-copied .ep-success { opacity:1; }
@media(prefers-reduced-motion:no-preference) {
  .ep-deploy-face, .ep-details-face { transition:transform 100ms ease-out, background-color 150ms, box-shadow 150ms; }
  .ep-deploy:active .ep-deploy-face, .ep-details:active .ep-details-face { transform:scale(.965); }
  .ep-detail-arrow { transition:transform 150ms ease-out; }
  .ep-details.is-opening .ep-detail-arrow { transform:translate(2px,-2px); }
  .ep-idle, .ep-success { transition:opacity 160ms ease, transform 180ms ease; }
  .ep-success { transform:translateY(3px); }
  .is-copied .ep-idle { transform:translateY(-3px); }
  .is-copied .ep-success { transform:translateY(0); }
}
.ep-marks { display:inline-flex; align-items:center; gap:5px; border-right:1px solid #cdd0d6; padding-right:12px; }
.ep-marks img { width:19px; height:19px; }
.ep-details-face { padding:0 17px; gap:7px; border:1px solid #dce7ff59; color:#fff; background:#000b; font-size:14px; }
.ep-details:hover .ep-details-face { background:#1e2941; }
.ep-home :focus-visible { outline:3px solid #8fe8ff; outline-offset:4px; }
.ep-status { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); }
.ep-manual { margin:16px auto; display:grid; gap:5px; max-width:540px; }
.ep-manual textarea { background:white; color:#111; padding:9px; border-radius:7px; }
@media(max-width:600px) { .ep-pitch { padding-top:16vh; } .ep-actions { --action-height:36px; gap:8px; } .ep-deploy,.ep-details { position:relative; } .ep-deploy::after,.ep-details::after { content:""; position:absolute; inset:-5px 0; border-radius:100px; } .ep-wide-label { display:none; } .ep-short-label { display:inline; } .ep-deploy-face { gap:6px; padding:0 12px; font-size:13px; } .ep-marks { gap:3px; padding-right:6px; } .ep-marks img { width:15px; height:15px; } .ep-details-face { padding:0 11px; font-size:13px; } .ep-pitch h1 { font-size:clamp(26px,8.8vw,50px); } :lang(zh) .ep-pitch h1 { font-size:clamp(26px,8.2vw,48px); } }
@media(max-width:359px) { .ep-pitch { padding-inline:8px; } .ep-actions { gap:6px; } .ep-deploy-face { padding:0 9px; font-size:13px; } .ep-marks { gap:2px; } .ep-details-face { padding:0 9px; font-size:13px; } }
@media(max-width:359px) {
  :lang(en) .ep-deploy-face, :lang(en) .ep-details-face { padding-inline:6px; font-size:12px; gap:4px; }
  :lang(en) .ep-marks { gap:2px; padding-right:4px; }
  :lang(en) .ep-marks img { width:12px; height:12px; }
}
@media(prefers-reduced-motion:no-preference) { .ep-pitch { animation:ep-arrive .75s ease-out both; } @keyframes ep-arrive { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } } }
</style>
