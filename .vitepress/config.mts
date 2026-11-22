import { endpointNavigation } from "./api-navigation.mts";
import { tokenize } from "./search";
import { docsLocale, englishNavigation } from "./navigation.mts";
import { defineConfig } from "vitepress";
import ui from "@nuxt/ui/vite";

import { addPageMetadata, origin, sitemap } from "./seo.mts";

const config = defineConfig({
  markdown: { headers: { level: [2] } },
  vite: {
    plugins: [ui({
      router: false,
      colorMode: false,
      dts: false,
      icon: { clientBundle: { icons: [
        "lucide:chevron-right", "lucide:ellipsis", "lucide:link",
        "lucide:file-text", "lucide:terminal", "lucide:check",
        "lucide:search", "lucide:menu", "lucide:x", "lucide:languages", "lucide:sun", "lucide:moon",
        "lucide:chevron-down", "lucide:arrow-left", "lucide:arrow-right", "lucide:list",
        "lucide:book-open", "lucide:code-xml", "lucide:layers", "lucide:store", "lucide:heart",
        "lucide:send", "lucide:external-link", "lucide:arrow-up-right",
      ] } },
      ui: { colors: { primary: "blue", neutral: "neutral" } },
    })],
    ssr: { noExternal: [/^@nuxt\/ui/, "motion-v"] },
  },
  cleanUrls: true,
  srcExclude: ["public/**"],
  transformPageData: addPageMetadata,
  sitemap,

  title: "EPUSDT",
  description:
    "Epusdt (Easy Payment Usdt) — a self-hosted multi-chain crypto payment gateway written in Go. GMPay API, EPay-compatible redirect checkout, hosted cashier, and Telegram notifications.",

  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["link", { rel: "sitemap", type: "application/xml", href: origin + "/sitemap.xml" }],
  ],

  locales: {
    vi: docsLocale("vi"),
    ja: docsLocale("ja"),
    es: docsLocale("es"),
    pt: docsLocale("pt"),
    root: {
      label: "English",
      lang: "en-US",
      themeConfig: englishNavigation,
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "EPUSDT",
      description: "Epusdt（简易 USDT 收款）— 基于 Go 的私有化多链加密收款网关，支持 GMPay API、EPay 兼容跳转流程与托管收银台，并提供 Telegram 通知。",
      themeConfig: {
        darkModeSwitchLabel: "外观",
        sidebarMenuLabel: "目录",
        returnToTopLabel: "回到顶部",
        outlineTitle: "本页目录",
        lastUpdatedText: "最后更新",
        langMenuLabel: "切换语言",
        nav: [
          { text: "首页", link: "/zh/" },
          { text: "指南", link: "/zh/guide/intro" },
          { text: "API 文档", link: "/zh/api/reference" },
          { text: "GMPay Edge", link: "/zh/gmpay-edge/" },
          { text: "GMShop Edge", link: "/zh/gmshop-edge/" },
          { text: "赞助", link: "/zh/guide/sponsor" },
        ],
        sidebar: {
          "/zh/guide/": [
            {
              text: "指南",
              items: [
                { text: "项目简介", link: "/zh/guide/intro" },
                { text: "版本日志", link: "/zh/guide/changelog" },
                { text: "常见问题", link: "/zh/guide/faq" },
                { text: "赞助支持", link: "/zh/guide/sponsor" },
              ],
            },
            {
              text: "安装部署",
              items: [
                { text: "教程合集", link: "/zh/guide/installation/tutorial" },
                { text: "epctl 二进制安装", link: "/zh/guide/installation/epctl" },
                { text: "Docker 部署（推荐）", link: "/zh/guide/installation/docker" },
                { text: "aaPanel 部署", link: "/zh/guide/installation/aapanel" },
                { text: "手动部署", link: "/zh/guide/installation/manual" },
              ],
            },
            {
              text: "接入教程",
              items: [
                { text: "GMPay 接入（推荐）", link: "/zh/guide/integration/gmpay" },
                { text: "EPay 接入（跳转式）", link: "/zh/guide/integration/epay" },
                { text: "旧版迁移说明", link: "/zh/guide/integration/epusdt" },
              ],
            },
          ],
          "/zh/api/": [
            {
              text: "API 文档",
              items: [
                { text: "概览", link: "/zh/api/reference" },
                { text: "支付接口", link: "/zh/api/payment" },
                { text: "接口迁移说明", link: "/zh/api/legacy" },
              ],
            },
          ],
          "/zh/gmpay-edge/": [
            {
              text: "GMPay Edge",
              items: [
                { text: "概览", link: "/zh/gmpay-edge/" },
                { text: "架构", link: "/zh/gmpay-edge/architecture" },
                { text: "部署", link: "/zh/gmpay-edge/deployment" },
                { text: "Bun 数据操作", link: "/zh/gmpay-edge/node-data-operations" },
                { text: "商户 API", link: "/zh/gmpay-edge/merchant-api" },
                { text: "支付接入", link: "/zh/gmpay-edge/payment-integrations" },
              ],
            },
          ],
          "/zh/gmshop-edge/": [
            {
              text: "GMShop Edge",
              items: [
                { text: "概览", link: "/zh/gmshop-edge/" },
                { text: "架构", link: "/zh/gmshop-edge/architecture" },
                { text: "部署", link: "/zh/gmshop-edge/deployment" },
                { text: "Bun 数据操作", link: "/zh/gmshop-edge/node-data-operations" },
                { text: "原生供应商 API", link: "/zh/gmshop-edge/supplier-api" },
                { text: "商业与交付", link: "/zh/gmshop-edge/commerce-fulfillment" },
                { text: "结账与服务商", link: "/zh/gmshop-edge/checkout-providers" },
              ],
            },
          ],
        },
      },
    },
    "zh-tw": {
      label: "繁體中文",
      lang: "zh-TW",
      link: "/zh-tw/",
      title: "EPUSDT",
      description: "Epusdt（簡易 USDT 收款）— 基於 Go 的私有化多鏈加密收款閘道，支援 GMPay API、EPay 相容跳轉流程與託管收銀臺，並提供 Telegram 通知。",
      themeConfig: {
        darkModeSwitchLabel: "外觀",
        sidebarMenuLabel: "目錄",
        returnToTopLabel: "回到頂部",
        outlineTitle: "本頁目錄",
        lastUpdatedText: "最後更新",
        langMenuLabel: "切換語言",
        nav: [
          { text: "首頁", link: "/zh-tw/" },
          { text: "指南", link: "/zh-tw/guide/intro" },
          { text: "API 文件", link: "/zh-tw/api/reference" },
          { text: "GMPay Edge", link: "/zh-tw/gmpay-edge/" },
          { text: "GMShop Edge", link: "/zh-tw/gmshop-edge/" },
          { text: "贊助", link: "/zh-tw/guide/sponsor" },
        ],
        sidebar: {
          "/zh-tw/guide/": [
            {
              text: "指南",
              items: [
                { text: "項目簡介", link: "/zh-tw/guide/intro" },
                { text: "版本日誌", link: "/zh-tw/guide/changelog" },
                { text: "常見問題", link: "/zh-tw/guide/faq" },
                { text: "贊助支持", link: "/zh-tw/guide/sponsor" },
              ],
            },
            {
              text: "安裝部署",
              items: [
                { text: "教程合集", link: "/zh-tw/guide/installation/tutorial" },
                { text: "epctl 二進位安裝", link: "/zh-tw/guide/installation/epctl" },
                { text: "Docker 部署（推薦）", link: "/zh-tw/guide/installation/docker" },
                { text: "aaPanel 部署", link: "/zh-tw/guide/installation/aapanel" },
                { text: "手動部署", link: "/zh-tw/guide/installation/manual" },
              ],
            },
            {
              text: "接入教學",
              items: [
                { text: "GMPay 接入（推薦）", link: "/zh-tw/guide/integration/gmpay" },
                { text: "EPay 接入（跳轉式）", link: "/zh-tw/guide/integration/epay" },
                { text: "舊版遷移說明", link: "/zh-tw/guide/integration/epusdt" },
              ],
            },
          ],
          "/zh-tw/api/": [
            {
              text: "API 文件",
              items: [
                { text: "概覽", link: "/zh-tw/api/reference" },
                { text: "支付介面", link: "/zh-tw/api/payment" },
                { text: "介面遷移說明", link: "/zh-tw/api/legacy" },
              ],
            },
          ],
          "/zh-tw/gmpay-edge/": [
            {
              text: "GMPay Edge",
              items: [
                { text: "概覽", link: "/zh-tw/gmpay-edge/" },
                { text: "架構", link: "/zh-tw/gmpay-edge/architecture" },
                { text: "部署", link: "/zh-tw/gmpay-edge/deployment" },
                { text: "Bun 資料操作", link: "/zh-tw/gmpay-edge/node-data-operations" },
                { text: "商戶 API", link: "/zh-tw/gmpay-edge/merchant-api" },
                { text: "支付接入", link: "/zh-tw/gmpay-edge/payment-integrations" },
              ],
            },
          ],
          "/zh-tw/gmshop-edge/": [
            {
              text: "GMShop Edge",
              items: [
                { text: "概覽", link: "/zh-tw/gmshop-edge/" },
                { text: "架構", link: "/zh-tw/gmshop-edge/architecture" },
                { text: "部署", link: "/zh-tw/gmshop-edge/deployment" },
                { text: "Bun 資料操作", link: "/zh-tw/gmshop-edge/node-data-operations" },
                { text: "原生供應商 API", link: "/zh-tw/gmshop-edge/supplier-api" },
                { text: "商務與交付", link: "/zh-tw/gmshop-edge/commerce-fulfillment" },
                { text: "結帳與服務商", link: "/zh-tw/gmshop-edge/checkout-providers" },
              ],
            },
          ],
        },
      },
    },
  },

  themeConfig: {
    logo: "/logo.png",
    search: {
      provider: "local",
      options: { miniSearch: { options: { tokenize } }, locales: {
        zh: { translations: { button: { buttonText: "搜索文档", buttonAriaLabel: "搜索文档" }, modal: { noResultsText: "未找到相关文档", resetButtonTitle: "清除搜索", footer: { selectText: "选择", navigateText: "切换", closeText: "关闭" } } } },
        "zh-tw": { translations: { button: { buttonText: "搜尋文件", buttonAriaLabel: "搜尋文件" }, modal: { noResultsText: "找不到相關文件", resetButtonTitle: "清除搜尋", footer: { selectText: "選取", navigateText: "切換", closeText: "關閉" } } } },
      } },
    },
    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.543 2.498c.307-.233.749-.261 1.084-.07.336.191.486.555.371.9l-3.43 19.365c-.09.508-.525.91-1.113 1.031-.592.121-1.204-.062-1.567-.468l-4.578-5.12-2.332 2.313c-.398.394-1.08.578-1.688.455-.608-.123-1.005-.525-.982-.995l.557-6.734 10.986-8.806c.297-.238.269-.664-.05-.875-.32-.211-.794-.163-1.092.091L4.445 12.082.917 10.866c-.53-.183-.882-.584-.914-1.041-.032-.457.262-.885.764-1.112L21.543 2.498Z"/></svg>'
        },
        link: "https://t.me/epusdt_group"
      },
      { icon: "github", link: "https://github.com/GMwalletApp/epusdt" },
    ],
  },
});


// Each localized directory table supplies the endpoint names and order used in navigation.
for (const [locale, entry] of Object.entries(config.locales!)) {
  const prefix = locale === "root" ? "/" : "/" + locale + "/";
  const groups = entry.themeConfig?.sidebar?.[prefix + "api/"];
  if (groups) groups[0].items.push(...endpointNavigation(prefix));
}
export default config;
