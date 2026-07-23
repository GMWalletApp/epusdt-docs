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

## 內建支付接入目錄

收銀臺是否展示某個支付方式，由已配置且可用的收款方式獨立控制。收款方式必須配置必要的公共連線或唯讀帳戶資訊，並通過可用性檢查後，才會提供給付款人選擇。

| 類型 | 接入 | 內建資產 |
| --- | --- | --- |
| 鏈上網路 | TRON / TRC20 | USDT、TRX |
| 鏈上網路 | Ethereum / ERC20 | USDT、USDC、ETH |
| 鏈上網路 | Base | USDT、USDC、ETH |
| 鏈上網路 | BNB Smart Chain / BEP20 | USDT、USDC、BNB |
| 鏈上網路 | Polygon | USDT、USDC、MATIC |
| 鏈上網路 | TON | USDT、GRAM |
| 鏈上網路 | Aptos | USDT、USDC |
| 鏈上網路 | Solana | USDT、USDC |
| 交易所 | Binance | USDT、USDC |
| 交易所 | OKX | USDT、USDC |
| 數字錢包 | OKPay | USDT、TRX |

## 架構摘要

單個 Cloudflare Worker 承載產品入口與共享訂單 / 支付核心：

- 商戶客戶端呼叫 GMPay 或 EPay 相容邊界。
- 付款人使用託管收銀臺。
- 營運者使用 `/admin`。
- Telegram 使用者透過已配置的 Bot 互動。
- D1 是權威應用與支付資料庫。
- KV 保存短期且經校驗的快取。
- R2 保存私有付款複核憑證與產生的匯出檔案。
- Queues 與 Cron Triggers 將支付掃描和 Webhook 重試移出同步請求。
- 支付適配器保持唯讀。

GMPay 使用 **HMAC-SHA256** 簽名。EPay 相容邊界仍保留舊版 **MD5** 規則。出站回撥會保留訂單來源協議的簽名格式。

## 部署到 Cloudflare Workers

GMPay Edge 以單個 Cloudflare Worker 部署，使用以下 bindings：

| Binding | Cloudflare 產品 | 用途 |
| --- | --- | --- |
| `DB` | D1 | 權威的應用、支付、授權與投遞資料 |
| `CACHE` | KV | 短期已校驗快取與輔助遙測資料 |
| `FILES` | R2 | 私有付款複核憑證與產生的匯出檔案 |
| `PAYMENT_QUEUE` | Queues | 非同步支付掃描 |
| `WEBHOOK_QUEUE` | Queues | 非同步商戶 Webhook 投遞 |

### 一鍵部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

引導流程會配置 `wrangler.jsonc` 宣告的 bindings、執行 D1 migrations 並建置 Worker。使用：

- Build command：`bun run build`
- Deploy command：`wrangler deploy`

部署完成後，開啟 Worker URL 的 `/install` 初始化實例。

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

如果需要手動準備 D1：

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

不要提交產生的 database ID。部署 hook 會建立或復用具名 D1、R2 與 Queue 資源，透過 `DB` 套用 D1 baseline，並在發布前建置 Worker。

## 本地開發

環境要求：

- Bun 1.3 或更新版本
- Wrangler 支援的本地執行環境

```bash
bun install
bun run dev
```

`bun run dev` 會將待執行 migration 套用到本地 `gmpay-edge` D1 資料庫，並在 `http://localhost:3000` 啟動應用。首次執行請開啟 `/install`。安裝會建立第一個使用者、受保護的 `root` 角色、執行時密鑰、支付預設值、公共 Telegram 指令與 Telegram 預設值；它不會建立 Telegram Bot，也不會呼叫 Telegram。

## 商戶接入

GMPay 是主商戶協議。EPay 是同一套憑證、訂單服務、冪等規則、狀態機、收銀臺、查詢行為與回撥流水線之上的相容適配器。

### 建立訂單

```text
POST /payments/gmpay/v1/order/create-transaction
```

請求包含數字 `pid`，以及使用憑證 Secret 作為 HMAC key、對排序後非空引數計算所得的小寫 HMAC-SHA256 `signature`。重複提交既有 `order_id` 不會建立第二筆訂單。同時省略 `token` 與 `network` 時會建立可選擇支付方式的訂單；GMPay Edge 不會靜默預設為 TRON。

### 查詢訂單

```text
GET /payments/gmpay/v1/order/query
```

請提供 `trade_id` 或 `order_id` 其中之一，並使用同一憑證簽名。憑證只能查詢自己建立的訂單。

### 接收回撥

商戶在建立訂單時提供 `notify_url`。回撥目標必須通過實例的 SSRF 與安全策略。已投遞事件帶有確定性簽名、保留投遞嘗試、執行有界重試，並提供經審計的人工重試。接收端應驗證簽名、冪等處理重複事件，並在本地狀態提交後再確認。

權威欄位與狀態值以已部署實例的 `/docs` 頁面或倉庫中的 OpenAPI 合約為準：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml)。

## 相關連結

- 倉庫：[GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- English README：[README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- 中文 README：[README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
