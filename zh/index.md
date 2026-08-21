---
layout: home
tk:
  teekHome: false

hero:
  name: "Epusdt"
  text: "私有化多链加密收款"
  tagline: Go 驱动的多链支付网关，提供 GMPay API、EPay 兼容跳转流程与托管收银台。私有部署，资金直接进钱包。
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
      text: API 文档
      link: /zh/api/reference
    - theme: alt
      text: GMPay Edge
      link: /zh/gmpay-edge/
    - theme: alt
      text: GMShop Edge
      link: /zh/gmshop-edge/

features:
  - icon: 🐳
    title: 安装向导优先
    details: 首次启动直接进浏览器安装向导，通常不需要先手动编写配置文件。
  - icon: 🔑
    title: 统一商户凭证
    details: 每个商户使用后台建立的 PID + secret_key，同一组凭证可同时用于 GMPay 与 EPay 流程。
  - icon: 🌐
    title: 多链收款
    details: 当前源代码以后台配置的 chains、chain_tokens、wallet_address 作为可用链与代币来源。
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
    details: GMWalletApp/gmpay-edge 是支持 Cloudflare Workers 或 Node/Nitro Docker 的独立网关，支持 GMPay HMAC-SHA256 与 EPay 兼容流程。
  - icon: 🛒
    title: GMShop Edge 商城
    details: GMWalletApp/gmshop-edge 是独立的 Cloudflare Workers 数字商品商城，提供商品、结账、交付、管理后台、上游供货与运行时 Provider。
---
