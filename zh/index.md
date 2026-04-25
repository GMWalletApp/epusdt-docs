---
layout: home
tk:
  teekHome: false

hero:
  name: "Epusdt"
  text: "私有化多鏈加密收款"
  tagline: Go 驅動的多鏈支付閘道，提供 GMPay API、EPay 相容跳轉流程與託管收銀臺。私有部署，資金直接進錢包。
  image:
    src: /logo.png
    alt: Epusdt
  actions:
    - theme: brand
      text: 快速開始
      link: /zh/guide/intro
    - theme: alt
      text: Docker 部署
      link: /zh/guide/installation/docker
    - theme: alt
      text: API 文件
      link: /zh/api/reference
    - theme: alt
      text: English
      link: /

features:
  - icon: 🐳
    title: 安裝嚮導優先
    details: 首次啟動直接進瀏覽器安裝嚮導，通常不需要先手動編寫配置檔。
  - icon: 🔑
    title: 統一商戶憑證
    details: 每個商戶使用後臺建立的 PID + secret_key，同一組憑證可同時用於 GMPay 與 EPay 流程。
  - icon: 🌐
    title: 多鏈收款
    details: 當前原始碼以後臺配置的 chains、chain_tokens、wallet_address 作為可用鏈與代幣來源。
  - icon: 🧾
    title: 收銀臺 + 回撥
    details: 建立訂單後可跳轉內建收銀臺，鏈上確認後由系統發送已簽名的非同步回撥。
  - icon: 🔁
    title: EPay 相容跳轉
    details: 提供 `/payments/epay/v1/order/create-transaction/submit.php` 的 GET / POST 相容入口。
  - icon: 🤖
    title: 管理後臺
    details: 透過內建後臺管理 API Keys、通知通道、鏈、代幣、錢包地址與 EPay 預設值。
---
