import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

const teekConfig = defineTeekConfig({
  themeEnhance: {
    themeColor: {
      defaultColorName: "vp-green",
    },
  },
  article: { author: "Epusdt" },
  footer: { copyright: "Copyright © 2025 GMwallet" },
  toComment: {
    enabled: true,
    done: () => { window.open("https://t.me/epusdt_group", "_blank"); },
  },
});

export default defineConfig({
  extends: teekConfig,

  title: "Epusdt",
  description:
    "Epusdt (Easy Payment Usdt) — a self-hosted USDT (TRC20) payment middleware written in Go. Private deployment, HTTP API, Telegram notifications.",

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
          { text: "GitHub", link: "https://github.com/GMwalletApp/epusdt", target: "_blank" },
          { text: "Telegram", link: "https://t.me/epusdt_group", target: "_blank" },
        ],
        sidebar: {
          "/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Introduction", link: "/guide/intro" },
                { text: "Release Notes", link: "/guide/changelog" },
                { text: "FAQ", link: "/guide/faq" },
              ],
            },
            {
              text: "Installation",
              items: [
                { text: "Tutorial", link: "/guide/installation/tutorial" },
                { text: "Docker (Recommended)", link: "/guide/installation/docker" },
                { text: "aaPanel", link: "/guide/installation/aapanel" },
                { text: "Manual", link: "/guide/installation/manual" },
              ],
            },
            {
              text: "Integration",
              items: [
                { text: "Epusdt (Legacy)", link: "/guide/integration/epusdt" },
                { text: "GMPay (Recommended)", link: "/guide/integration/gmpay" },
                { text: "EPay (Redirect)", link: "/guide/integration/epay" },
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
        },
      },
    },
    zh: {
      label: "繁體中文",
      lang: "zh-TW",
      link: "/zh/",
      themeConfig: {
        nav: [
          { text: "首頁", link: "/zh/" },
          { text: "指南", link: "/zh/guide/intro" },
          { text: "API 文件", link: "/zh/api/reference" },
          { text: "GitHub", link: "https://github.com/GMwalletApp/epusdt", target: "_blank" },
          { text: "Telegram 交流群", link: "https://t.me/epusdt_group", target: "_blank" },
        ],
        sidebar: {
          "/zh/guide/": [
            {
              text: "指南",
              items: [
                { text: "項目簡介", link: "/zh/guide/intro" },
                { text: "版本日誌", link: "/zh/guide/changelog" },
                { text: "常見問題", link: "/zh/guide/faq" },
              ],
            },
            {
              text: "安裝部署",
              items: [
                { text: "教程合集", link: "/zh/guide/installation/tutorial" },
                { text: "Docker 部署（推薦）", link: "/zh/guide/installation/docker" },
                { text: "aaPanel 部署", link: "/zh/guide/installation/aapanel" },
                { text: "手動部署", link: "/zh/guide/installation/manual" },
              ],
            },
            {
              text: "接入教學",
              items: [
                { text: "Epusdt 接入（舊版相容）", link: "/zh/guide/integration/epusdt" },
                { text: "GMPay 接入（推薦）", link: "/zh/guide/integration/gmpay" },
                { text: "EPay 接入（跳轉式）", link: "/zh/guide/integration/epay" },
              ],
            },
          ],
          "/zh/api/": [
            {
              text: "API 文件",
              items: [
                { text: "概覽", link: "/zh/api/reference" },
                { text: "支付介面", link: "/zh/api/payment" },
                { text: "介面遷移說明", link: "/zh/api/legacy" },
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
      { icon: "github", link: "https://github.com/GMwalletApp/epusdt" },
    ],
  },
});
