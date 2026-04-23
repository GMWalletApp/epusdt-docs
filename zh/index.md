---
layout: home
tk:
  teekHome: false

hero:
  name: "Epusdt"
  text: "私有化加密收款"
  tagline: Easy Payment Usdt — Go 语言驱动的 Tron、Solana、Ethereum 多网络支付中间件，私有部署，零手续费，快速接入。
  image:
    src: /logo.png
    alt: Epusdt
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/intro
    - theme: alt
      text: Docker 部署
      link: /zh/guide/installation/docker
    - theme: alt
      text: English
      link: /
    - theme: alt
      text: GitHub →
      link: https://github.com/GMwalletApp/epusdt

features:
  - icon: 🐳
    title: 官方 Docker 镜像
    details: 现在支持直接拉取 `docker pull gmwallet/epusdt:latest`，部署更直接。
  - icon: 🔒
    title: 私有化部署
    details: 自己的服务器，自己的钱包，完全掌控。无需担心资金被篡改或吞单。
  - icon: ⚡
    title: 高性能异步
    details: 异步队列 + 多网络钱包监听，优雅处理高并发订单。
  - icon: 🤖
    title: Telegram 机器人
    details: 实时接收包含网络信息的支付通知，并可通过 Telegram 管理钱包地址。
  - icon: 🔌
    title: 简单 HTTP API
    details: REST API 用于创建交易和接收异步支付回调，任何系统均可接入。
  - icon: 🌐
    title: 跨平台支持
    details: 单个 Go 二进制，支持 x86/ARM 的 Windows/Linux。
  - icon: 🧩
    title: 插件支持
    details: 已适配独角数卡，并提供开放 SDK 供自定义集成。
---
