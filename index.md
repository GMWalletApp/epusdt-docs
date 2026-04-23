---
layout: home
tk:
  teekHome: false

hero:
  name: "Epusdt"
  text: "Self-Hosted Crypto Payment"
  tagline: Easy Payment Usdt — Go-powered Tron, Solana, and Ethereum middleware. Private, zero-fee, instant integration.
  image:
    src: /logo.png
    alt: Epusdt
  actions:
    - theme: brand
      text: Get Started
      link: /guide/intro
    - theme: alt
      text: Docker Install
      link: /guide/installation/docker
    - theme: alt
      text: 中文
      link: /zh/
    - theme: alt
      text: GitHub →
      link: https://github.com/GMwalletApp/epusdt

features:
  - icon: 🐳
    title: Docker Ready
    details: Official image now supports direct pull with `docker pull gmwallet/epusdt:latest` for faster deployment.
  - icon: 🔒
    title: Private Deployment
    details: Your server, your wallet, your keys. No risk of fund hijacking or missed orders.
  - icon: ⚡
    title: High Performance
    details: Async queue + multi-network wallet monitoring handles high-concurrency orders gracefully.
  - icon: 🤖
    title: Telegram Bot
    details: Receive instant payment notifications with network info through the Telegram bot.
  - icon: 🔌
    title: Simple HTTP API
    details: REST API for creating transactions and receiving async payment callbacks.
  - icon: 🌐
    title: Cross-Platform
    details: Single Go binary — x86 and ARM, Windows and Linux.
  - icon: 🧩
    title: Plugin Support
    details: Dujiaoka plugin included. Open SDK for custom integrations.
---
