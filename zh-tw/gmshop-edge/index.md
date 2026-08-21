# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) 是一個可自託管、單部署、單租戶的數字商品商城，可執行在 **Cloudflare Workers** 或 **Node/Nitro Docker 容器**中。

一次部署即可提供回應式商城、使用者帳戶、結帳與交付、Telegram 整合、供應商營運以及基於權限的管理後台。

> GMShop Edge 正在積極開發中，目前版本為 [`v1.0.0-alpha.1`](https://github.com/GMWalletApp/gmshop-edge/releases/tag/v1.0.0-alpha.1)。內建介面卡表示專案已實現對應整合路徑；生產使用仍需部署者提供憑證、備份、監控，並完成真實服務商驗收測試。

## 核心能力

- 原子分配加密預置文字的庫存商品、私有下載商品，以及帶明確產物策略的自動化商品。
- 永久、固定期限、限次、無限、免費、一次性及使用者續期等權益策略。
- 遊客與註冊使用者結帳、優惠券、退款、售後、私有訂單查詢及基於帳戶的交付存取。
- 商城餘額支付，以及 Stripe、Cryptomus、GMpay、EPay、支付寶網頁/WAP、微信 Native/H5 介面卡。
- 透過 ACG `3.5.5`、Dujiao Next `v1.3.1` 或原生 GMShop Edge 供應商 API 同步商品並完成交付。
- 執行時設定信箱密碼、社交登入、OIDC、Telegram OIDC、Telegram 登入元件和 Telegram Mini App 身分驗證。
- 基於 grammY Webhook 的機器人，支援本地化命令、Mini App 按鈕，以及不儲存訊息內容的 Forum Topic 客服。
- `/admin` 動態多角色 RBAC，包括根帳戶保護、伺服器端權限驗證、重新驗證和審計記錄。
- 英文（`en-US`）和簡體中文（`zh-CN`）應用介面。

以上能力均屬於開源專案，不另設 Pro 或 Enterprise 版本。

## 文件目錄

- [架構](./architecture.md)：共享應用棧、Workers 繫結、Node 介面卡、資料歸屬和執行限制。
- [部署](./deployment.md)：Workers、Node/Docker、釋出通道、初始化和生產驗收。
- [Node 資料操作](./node-data-operations.md)：備份、恢復及 Cloudflare D1/R2 匯入。
- [商務與交付](./commerce-fulfillment.md)：商品、庫存、供應商、交付記錄、權益和自動化商品。
- [結帳與服務商](./checkout-providers.md)：餘額與外部支付、法幣報價、郵件、身分驗證和 Telegram 客服。

## 連結

- 倉庫：[GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- 部署清單：[`docs/DEPLOYMENT.zh-CN.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.zh-CN.md)
- Node 資料操作：[`docs/NODE_DATA_OPERATIONS.zh-CN.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.zh-CN.md)
- OpenAPI：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
