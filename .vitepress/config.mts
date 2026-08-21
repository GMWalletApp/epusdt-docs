import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

const ignoredGeneratedPaths = [
  ".git",
  ".github",
  ".automation",
  ".local",
  "node_modules",
  "dist",
  "scripts",
];

const teekConfig = defineTeekConfig({
  themeEnhance: {
    themeColor: {
      defaultColorName: "vp-green",
    },
  },
  article: { author: "Epusdt" },
  footer: { copyright: "Copyright © 2025 GMwallet" },
  vitePlugins: {
    sidebarOption: {
      ignoreList: ignoredGeneratedPaths,
    },
    fileContentLoaderIgnore: ignoredGeneratedPaths.map((path) => `${path}/**`),
  },
  toComment: {
    enabled: true,
    done: () => { window.open("https://t.me/epusdt_group", "_blank"); },
  },
});

export default defineConfig({
  extends: teekConfig,

  title: "Epusdt",
  description:
    "Epusdt (Easy Payment Usdt) — a self-hosted multi-chain crypto payment gateway written in Go. GMPay API, EPay-compatible redirect checkout, hosted cashier, and Telegram notifications.",

  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
  ],

  locales: {
    root: {
      label: "English",
      lang: "en-US",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "Guide", link: "/guide/intro" },
          { text: "API", link: "/api/reference" },
          { text: "GMPay Edge", link: "/gmpay-edge/" },
          { text: "GMShop Edge", link: "/gmshop-edge/" },
          { text: "Sponsor", link: "/guide/sponsor" },
        ],
        sidebar: {
          "/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Introduction", link: "/guide/intro" },
                { text: "Release Notes", link: "/guide/changelog" },
                { text: "FAQ", link: "/guide/faq" },
                { text: "Sponsor", link: "/guide/sponsor" },
              ],
            },
            {
              text: "Installation",
              items: [
                { text: "Tutorial", link: "/guide/installation/tutorial" },
                { text: "epctl Binary Installer", link: "/guide/installation/epctl" },
                { text: "Docker (Recommended)", link: "/guide/installation/docker" },
                { text: "aaPanel", link: "/guide/installation/aapanel" },
                { text: "Manual", link: "/guide/installation/manual" },
              ],
            },
            {
              text: "Integration",
              items: [
                { text: "GMPay (Recommended)", link: "/guide/integration/gmpay" },
                { text: "EPay (Redirect)", link: "/guide/integration/epay" },
                { text: "Legacy Migration", link: "/guide/integration/epusdt" },
              ],
            },
          ],
          "/api/": [
            {
              text: "API Reference",
              items: [
                { text: "Overview", link: "/api/reference" },
                { text: "Payment API", link: "/api/payment" },
                { text: "API Migration", link: "/api/legacy" },
              ],
            },
          ],
          "/gmpay-edge/": [
            {
              text: "GMPay Edge",
              items: [
                { text: "Overview", link: "/gmpay-edge/" },
                { text: "Architecture", link: "/gmpay-edge/architecture" },
                { text: "Deployment", link: "/gmpay-edge/deployment" },
                { text: "Merchant API", link: "/gmpay-edge/merchant-api" },
                { text: "Payment Integrations", link: "/gmpay-edge/payment-integrations" },
              ],
            },
          ],
          "/gmshop-edge/": [
            {
              text: "GMShop Edge",
              items: [
                { text: "Overview", link: "/gmshop-edge/" },
                { text: "Architecture", link: "/gmshop-edge/architecture" },
                { text: "Deployment", link: "/gmshop-edge/deployment" },
                { text: "Node Data Operations", link: "/gmshop-edge/node-data-operations" },
                { text: "Native Supplier API", link: "/gmshop-edge/supplier-api" },
                { text: "Commerce and Fulfillment", link: "/gmshop-edge/commerce-fulfillment" },
                { text: "Checkout and Providers", link: "/gmshop-edge/checkout-providers" },
              ],
            },
          ],
        },
      },
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "Epusdt",
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
                { text: "Node 数据操作", link: "/zh/gmshop-edge/node-data-operations" },
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
      title: "Epusdt",
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
                { text: "Node 資料操作", link: "/zh-tw/gmshop-edge/node-data-operations" },
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
