# GMPay Edge

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge) 是面向 **Cloudflare Workers** 的自託管單租戶加密貨幣支付閘道。

它是獨立於 Epusdt 的另一個專案。如果需要本文件站描述的 Go 版本閘道，請使用 Epusdt；如果希望部署在 Cloudflare Workers，並使用 D1、KV、R2、Queues 與 Cron Triggers，可以評估 GMPay Edge。

> GMPay Edge 仍在持續開發。內建接入表示專案已實作相關能力；正式生產使用仍需要部署者自己的端點或唯讀憑證、配置完成的收款方式、備份、監控，以及真實平台驗收測試。

## 它提供什麼

- 帶簽名的 GMPay 商戶 API，支援 JSON 與表單輸入。
- 在 API 邊界相容 EPay，但不維護第二套訂單模型。
- 響應式收銀臺、管理後臺、公共狀態頁與執行時 OpenAPI 文件。
- 透過 Queue-backed outbox 可靠投遞 Webhook，保留重試歷史、人工重試與審計記錄。
- 透過 Cloudflare Queues 與 Cron Triggers 執行支付掃描、過期處理、清理、連線健康檢查與匯率同步。
- 使用 Better Auth、TOTP 與動態多角色 RBAC 保護管理後臺。
- 透過 grammY 管理 Telegram Bot，支援 Inline 下單、公共指令與通知訂閱。
- 六語言使用者介面。

## 文件章節

- [架構](./architecture.md)：Worker 入口、Cloudflare bindings、佇列、回撥與協議邊界。
- [部署](./deployment.md)：一鍵部署、Wrangler CLI、D1 準備、本地開發與首次安裝。
- [商戶 API](./merchant-api.md)：GMPay 建單、查詢、簽名、回撥與 EPay 相容。
- [支付接入](./payment-integrations.md)：內建鏈上、交易所與錢包適配器目錄。

## 相關連結

- 倉庫：[GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- English README：[README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- 中文 README：[README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
