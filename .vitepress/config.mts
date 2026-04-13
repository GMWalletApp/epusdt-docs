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
              ],
            },
            {
              text: "Installation",
              items: [
                { text: "Docker (Recommended)", link: "/guide/installation/docker" },
                { text: "aaPanel", link: "/guide/installation/aapanel" },
                { text: "Manual", link: "/guide/installation/manual" },
              ],
            },
            {
              text: "Plugins",
              items: [{ text: "Dujiaoka", link: "/guide/plugins/dujiaoka" }],
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
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      themeConfig: {
        nav: [
          { text: "首页", link: "/zh/" },
          { text: "指南", link: "/zh/guide/intro" },
          { text: "API 文档", link: "/zh/api/reference" },
          { text: "GitHub", link: "https://github.com/GMwalletApp/epusdt", target: "_blank" },
          { text: "Telegram 交流群", link: "https://t.me/epusdt_group", target: "_blank" },
        ],
        sidebar: {
          "/zh/guide/": [
            {
              text: "指南",
              items: [
                { text: "项目简介", link: "/zh/guide/intro" },
                { text: "版本日志", link: "/zh/guide/changelog" },
              ],
            },
            {
              text: "安装部署",
              items: [
                { text: "Docker 部署（推荐）", link: "/zh/guide/installation/docker" },
                { text: "aaPanel 部署", link: "/zh/guide/installation/aapanel" },
                { text: "手动部署", link: "/zh/guide/installation/manual" },
              ],
            },
            {
              text: "插件",
              items: [{ text: "独角数卡", link: "/zh/guide/plugins/dujiaoka" }],
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
