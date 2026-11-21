---
description: "用 EPUSDT 自架 USDT、USDC 收款閘道，讓鏈上款項直接進入商戶錢包。查閱支援的網路、Docker Compose 部署步驟、GMPay 商戶 API 與易支付相容串接文件。"
title: "自架 USDT、USDC 收款閘道"
layout: home
tk:
  teekHome: false

hero:
  name: "EPUSDT"
  text: "私有化多鏈加密收款"
  tagline: 通過 GMPay 或 EPay 建立訂單，直接用自己的錢包收款，到賬核驗完成後接收簽名回撥。
  image:
    src: /logo.png
    alt: Epusdt
  actions:
    - theme: brand
      text: 部署 EPUSDT
      link: "/zh-tw/guide/installation/docker"
    - theme: alt
      text: 商戶 API
      link: "/zh-tw/api/payment"
    - theme: alt
      text: 網路與幣種
      link: "/zh-tw/guide/intro#networks"
    - theme: alt
      text: Telegram 頻道
      link: "https://t.me/epusdt"
    - theme: alt
      text: Telegram 群組
      link: "https://t.me/epusdt_group"

features:
  - icon: 🐳
    title: Docker 與 SQLite
    details: 預設 Compose 服務同時啟動支付閘道器與 ChainScanner，配置和資料庫儲存在宿主機的掛載目錄。
  - icon: 🔑
    title: 統一商戶憑證
    details: 每個商戶使用後臺建立的 PID + secret_key，同一組憑證可同時用於 GMPay 與 EPay 流程。
  - icon: 🌐
    title: 16 條鏈上直付網路
    details: 啟用所需幣種並新增收款地址，也可單獨開啟 OKX OnchainOS 或 OKPay 託管支付。
  - icon: 🧾
    title: 收銀臺 + 回撥
    details: 建立訂單後可跳轉內建收銀臺，鏈上確認後由系統發送已簽名的非同步回撥。
  - icon: 🔁
    title: EPay 相容跳轉
    details: 提供 `/payments/epay/v1/order/create-transaction/submit.php` 的 GET / POST 相容入口。
  - icon: 🤖
    title: 管理後臺
    details: 透過內建後臺管理 API Keys、通知通道、鏈、代幣、錢包地址與 EPay 預設值。
  - icon: ⚡
    title: GMPay Edge 相關專案
    details: GMWalletApp/gmpay-edge 是支援 Cloudflare Workers 或 Bun/Nitro Docker 的獨立閘道，支援 GMPay HMAC-SHA256 與 EPay 相容流程。
  - icon: 🛒
    title: GMShop Edge 商城
    details: GMWalletApp/gmshop-edge 是獨立的 Cloudflare Workers 數位商品商城，提供商品、結帳、交付、管理後臺、上游供貨與執行時 Provider。
---

## EPUSDT 是什麼？

EPUSDT 是以 Go 開發的自架加密貨幣收款閘道。例如，商戶可以啟用 TRON 上的 USDT 或 Ethereum 上的 USDC，並新增對應的收款地址。使用鏈上直付時，買家直接轉帳至該地址，EPUSDT 確認到帳後會向商戶伺服器傳送簽章通知。[查看支援的網路與代幣](/zh-tw/guide/intro#networks)。

### 我的商店要怎麼串接？

先[使用 Docker Compose 部署 EPUSDT](/zh-tw/guide/installation/docker)，再透過 [GMPay 商戶 API](/zh-tw/api/payment) 建立訂單、驗證付款回呼。如果商店已使用易支付外掛，可以依照[易支付相容指南](/zh-tw/guide/integration/epay)串接跳轉收銀台。

[閘道原始碼](https://github.com/GMWalletApp/epusdt) · [版本紀錄](/zh-tw/guide/changelog) · [AI 文件索引](https://epusdt.com/llms.txt)
