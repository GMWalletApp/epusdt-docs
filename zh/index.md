---
description: "用 EPUSDT 自建 USDT、USDC 收款网关，将链上付款直接收至商户钱包。查看支持的网络、Docker Compose 部署步骤、GMPay 商户 API 和易支付兼容接入文档。"
title: "自建 USDT、USDC 收款网关"
layout: home
tk:
  teekHome: false

hero:
  name: "EPUSDT"
  text: "私有化多链加密收款"
  tagline: 通过 GMPay 或 EPay 创建订单，直接用自己的钱包收款，到账核验完成后接收签名回调。
  image:
    src: /logo.png
    alt: Epusdt
  actions:
    - theme: brand
      text: 部署 EPUSDT
      link: "/zh/guide/installation/docker"
    - theme: alt
      text: 商户 API
      link: "/zh/api/payment"
    - theme: alt
      text: 网络与币种
      link: "/zh/guide/intro#networks"
    - theme: alt
      text: Telegram 频道
      link: "https://t.me/epusdt"
    - theme: alt
      text: Telegram 群组
      link: "https://t.me/epusdt_group"

features:
  - icon: 🐳
    title: Docker 与 SQLite
    details: 默认 Compose 服务同时启动支付网关与 ChainScanner，配置和数据库保存在宿主机的挂载目录。
  - icon: 🔑
    title: 统一商户凭证
    details: 每个商户使用后台建立的 PID + secret_key，同一组凭证可同时用于 GMPay 与 EPay 流程。
  - icon: 🌐
    title: 16 条链上直付网络
    details: 启用所需币种并添加收款地址，也可单独开启 OKX OnchainOS 或 OKPay 托管支付。
  - icon: 🧾
    title: 收银台 + 回调
    details: 建立订单后可跳转内建收银台，链上确认后由系统发送已签名的异步回调。
  - icon: 🔁
    title: EPay 兼容跳转
    details: 提供 `/payments/epay/v1/order/create-transaction/submit.php` 的 GET / POST 兼容入口。
  - icon: 🤖
    title: 管理后台
    details: 通过内建后台管理 API Keys、通知通道、链、代币、钱包地址与 EPay 默认值。
  - icon: ⚡
    title: GMPay Edge 相关项目
    details: GMWalletApp/gmpay-edge 是支持 Cloudflare Workers 或 Bun/Nitro Docker 的独立网关，支持 GMPay HMAC-SHA256 与 EPay 兼容流程。
  - icon: 🛒
    title: GMShop Edge 商城
    details: GMWalletApp/gmshop-edge 是独立的 Cloudflare Workers 数字商品商城，提供商品、结账、交付、管理后台、上游供货与运行时 Provider。
---

## EPUSDT 是什么？

EPUSDT 是用 Go 编写的自托管加密货币收款网关。例如，商户可以启用 TRON 上的 USDT，或 Ethereum 上的 USDC，并添加对应的收款地址。使用链上直付时，买家向该地址转账，EPUSDT 核验到账后向商户服务器发送签名通知。[查看支持的网络与代币](/zh/guide/intro#networks)。

### 我的商城怎么接入？

先[用 Docker Compose 部署 EPUSDT](/zh/guide/installation/docker)，再通过 [GMPay 商户 API](/zh/api/payment) 创建订单、验证支付回调。如果商城已经使用易支付插件，可以按[易支付兼容指南](/zh/guide/integration/epay)接入跳转收银台。

[网关源代码](https://github.com/GMWalletApp/epusdt) · [版本记录](/zh/guide/changelog) · [AI 文档索引](https://epusdt.com/llms.txt)
