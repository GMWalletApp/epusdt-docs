---
description: "Deploy EPUSDT to accept USDT and USDC in your own wallet. Explore supported networks, install with Docker Compose, and integrate checkout with GMPay or EPay."
title: "Self-hosted USDT and USDC payment gateway"
layout: home
tk:
  teekHome: false

hero:
  name: "EPUSDT"
  text: "Self-Hosted Multi-Chain Crypto Payment"
  tagline: Accept on-chain payments to your own wallet. Create an order with GMPay or EPay and receive a signed notification when payment is verified.
  image:
    src: /logo.png
    alt: Epusdt
  actions:
    - theme: brand
      text: Install EPUSDT
      link: "/guide/installation/docker"
    - theme: alt
      text: Merchant API
      link: "/api/payment"
    - theme: alt
      text: Networks and assets
      link: "/guide/intro#networks"
    - theme: alt
      text: Telegram channel
      link: "https://t.me/epusdt"
    - theme: alt
      text: Telegram group
      link: "https://t.me/epusdt_group"

features:
  - icon: 🐳
    title: Docker and SQLite
    details: The default Compose service starts the gateway and ChainScanner together. A single host directory holds the configuration and databases.
  - icon: 🔑
    title: Unified Merchant Credentials
    details: Each merchant uses a PID + secret_key pair from the admin panel. The same credential works for GMPay and EPay flows.
  - icon: 🌐
    title: 16 direct-payment networks
    details: Enable the assets you accept and add receiving addresses. Checkout also offers optional hosted payments through OKX OnchainOS and OKPay.
  - icon: 🧾
    title: Hosted Checkout + Callback
    details: Create orders, redirect customers to the cashier page, and receive signed async callbacks after on-chain confirmation.
  - icon: 🔁
    title: EPay-Compatible Redirect Flow
    details: Supports GET/POST redirect-style order creation at /payments/epay/v1/order/create-transaction/submit.php.
  - icon: 🤖
    title: Telegram + Admin Console
    details: Manage settings, wallets, chains, API keys, and notifications from the built-in admin API and UI.
  - icon: ⚡
    title: GMPay Edge Companion
    details: GMWalletApp/gmpay-edge is a separate gateway for Cloudflare Workers or Bun/Nitro Docker, with GMPay HMAC-SHA256 and EPay compatibility.
  - icon: 🛒
    title: GMShop Edge Storefront
    details: GMWalletApp/gmshop-edge is a separate Cloudflare Workers digital-goods store with catalog, checkout, fulfillment, administration, supplier sourcing, and runtime providers.
---

## What is EPUSDT?

EPUSDT is a self-hosted cryptocurrency payment gateway written in Go. A merchant can accept USDT on TRON or USDC on Ethereum, for example, by enabling the asset and adding a receiving address. For direct on-chain payments, the buyer sends funds to that address. EPUSDT checks the payment and notifies the merchant’s server. [View supported networks and assets](/guide/intro#networks).

### How do I connect my store?

[Deploy EPUSDT with Docker Compose](/guide/installation/docker), then use the [GMPay merchant API](/api/payment) to create an order and verify its callback. If your store already uses an EPay checkout plugin, follow the [EPay redirect guide](/guide/integration/epay).

[Gateway source code](https://github.com/GMWalletApp/epusdt) · [Release notes](/guide/changelog) · [AI documentation index](https://epusdt.com/llms.txt)
