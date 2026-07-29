# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) 是面向 **Cloudflare Workers** 的自託管、單部署、單租戶數位商品商城。

一個部署即可提供響應式公開商城、客戶中心、結帳與交付，以及用於營運數位商品的權限驅動管理後臺。

> GMShop Edge 仍在持續開發。內建適配器表示專案已實作相關接入路徑；生產使用仍需要部署者自己的服務商憑證、備份、監控與真實服務商驗收測試。

## 它提供什麼

- 響應式公開商城、客戶中心、結帳流程，以及權限驅動的管理後臺。
- 銷售預置庫存商品，原子分配加密保存的卡密、帳號、啟用碼或憑證。
- 從 ACG `3.5.5` V4 Open API 或獨角數卡 Next `v1.3.1` 同步上游商品，並按 API 來源使用等優先級帳號池履約。
- R2 私有下載交付、自動化商品、優惠券、退款、售後、保留策略與審計記錄。
- 遊客與註冊客戶結帳，使用 Better Auth 使用者與已驗證結帳信箱形成統一商業身份模型。
- 透過 SMTP、Resend、Postmark、SendGrid、Mailgun 或 Cloudflare Send Email 發送交易郵件。
- 在 D1 維護商城自有法幣匯率，將不可變報價交給類型化結帳 Provider。
- 執行時配置信箱密碼、社交、OIDC 與 Telegram 登入 Provider。
- 以動態多角色 RBAC 保護 `/admin`，包含不可移除的 root 約束與服務端權限校驗。
- 英文（`en-US`）與簡體中文（`zh-CN`）兩種介面語言。

## 文件章節

- [架構](./architecture.md)：Worker 入口、Cloudflare bindings、資料權威來源、佇列與模組邊界。
- [部署](./deployment.md)：一鍵部署、Wrangler CLI、bindings、本地開發與首次安裝。
- [交易與交付](./commerce-fulfillment.md)：商品、庫存、上游供貨、交付記錄、客戶歸屬與自動化商品。
- [結帳與 Provider](./checkout-providers.md)：商城結帳模型、法幣報價、郵件與登入 Provider。

## 相關連結

- 倉庫：[GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- English README：[README.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.md)
- 中文 README：[README.zh-CN.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.zh-CN.md)
- OpenAPI YAML：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
