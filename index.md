---
layout: home
tk:
  teekHome: false

hero:
  name: "Epusdt"
  text: "Self-Hosted Multi-Chain Crypto Payment"
  tagline: Go-powered gateway for hosted checkout, GMPay API, and EPay-compatible redirect flow. Private deployment, direct-to-wallet settlement.
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
      text: API Reference
      link: /api/reference
    - theme: alt
      text: 繁體中文
      link: /zh/

features:
  - icon: 🐳
    title: Wizard-Based Deployment
    details: First boot launches the install wizard in your browser. No need to handwrite a config file before startup.
  - icon: 🔑
    title: Unified Merchant Credentials
    details: Each merchant uses a PID + secret_key pair from the admin panel. The same credential works for GMPay and EPay flows.
  - icon: 🌐
    title: Multi-Chain Receiving
    details: Current source includes chain and token management backed by admin-configured chains, chain_tokens, and wallet addresses.
  - icon: 🧾
    title: Hosted Checkout + Callback
    details: Create orders, redirect customers to the cashier page, and receive signed async callbacks after on-chain confirmation.
  - icon: 🔁
    title: EPay-Compatible Redirect Flow
    details: Supports GET/POST redirect-style order creation at /payments/epay/v1/order/create-transaction/submit.php.
  - icon: 🤖
    title: Telegram + Admin Console
    details: Manage settings, wallets, chains, API keys, and notifications from the built-in admin API and UI.
---
