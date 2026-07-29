# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) 是面向 **Cloudflare Workers** 的自託管、單部署、單租戶數位商品商城。

它是獨立於 Epusdt 與 GMPay Edge 的另一個專案。Epusdt 與 GMPay Edge 是支付閘道；GMShop Edge 是商城應用。它負責數位商品銷售、客戶結帳與交付，並把本商城訂單交給 GMpay、EPay、Stripe 或其他類型化 Provider 進行外部託管收銀。

> GMShop Edge 仍在持續開發。內建適配器表示專案已實作相關接入路徑；生產使用仍需要部署者自己的服務商憑證、備份、監控與真實服務商驗收測試。

## 它提供什麼

- 響應式公開商城、客戶中心、結帳流程，以及權限驅動的管理後臺。
- 銷售預置庫存商品，原子分配加密保存的卡密、帳號、啟用碼或憑證。
- 從 ACG `3.5.5` V4 Open API 或獨角數卡 Next `v1.3.1` 同步上游商品，並按 API 來源使用等優先級帳號池履約。
- R2 私有下載交付、自動化商品、優惠券、退款、售後、保留策略與審計記錄。
- 遊客與註冊客戶結帳，使用 Better Auth 使用者與已驗證結帳信箱形成統一商業身份模型。
- 透過 SMTP、Resend、Postmark、SendGrid、Mailgun 或 Cloudflare Send Email 發送交易郵件。
- 在 D1 維護商城自有法幣匯率，將不可變報價交給 Stripe、GMpay、EPay 或其他支付適配器。
- 執行時配置信箱密碼、社交、OIDC 與 Telegram 登入 Provider。
- 以動態多角色 RBAC 保護 `/admin`，包含不可移除的 root 約束與服務端權限校驗。
- 英文（`en-US`）與簡體中文（`zh-CN`）兩種介面語言。

## 重要邊界

GMShop Edge **不是**支付閘道。它不提供商戶 API 憑證或閘道訂單協議，不掃描公鏈，也不運行交易所 / 錢包收款適配器。GMpay 與 EPay 只是本商城訂單的外部託管收銀適配器。

## 文件章節

- [架構](./architecture.md)：Worker 入口、Cloudflare bindings、資料權威來源、佇列與模組邊界。
- [部署](./deployment.md)：一鍵部署、Wrangler CLI、bindings、本地開發與首次安裝。
- [交易與交付](./commerce-fulfillment.md)：商品、庫存、上游供貨、交付記錄、客戶歸屬與自動化商品。
- [支付與 Provider](./payment-providers.md)：商城支付模型、法幣報價、GMpay / EPay / Stripe 適配器邊界、郵件與登入 Provider。

## 相關連結

- 倉庫：[GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- English README：[README.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.md)
- 中文 README：[README.zh-CN.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.zh-CN.md)
- OpenAPI YAML：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
