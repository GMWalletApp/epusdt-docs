# 架構

GMPay Edge 可作為單個 Worker 或單個 Bun/Nitro 容器執行。兩種執行環境承載相同的產品入口與共享訂單 / 支付核心，差異僅在基礎設施適配器。

## 產品入口

- 商戶客戶端呼叫 GMPay 或 EPay 相容邊界。
- 付款人使用託管收銀臺。
- 營運者使用 `/admin`。
- Telegram 使用者透過已配置的 Bot 互動。

## 執行環境服務

| 能力 | Cloudflare Workers | Bun/Nitro Docker |
| --- | --- | --- |
| 資料庫 | D1 | `GMPAY_DATA_DIR` 中的 SQLite |
| 快取 | KV | 本地執行時快取 |
| 私有物件 | R2 | 持久化本地物件儲存 |
| 背景任務 | Cloudflare Queues | 本地可靠佇列 |
| 排程 | Cron Triggers | Bun 排程器 |

Bun 資料目錄也包含上傳檔案與可靠佇列狀態，必須掛載持久化資料卷並納入備份。

## Cloudflare bindings

| Binding | Cloudflare 產品 | 用途 |
| --- | --- | --- |
| `DB` | D1 | 權威的應用、支付、授權與投遞資料 |
| `CACHE` | KV | 短期已校驗快取與輔助遙測資料 |
| `FILES` | R2 | 私有付款複核憑證與產生的匯出檔案 |
| `PAYMENT_QUEUE` | Queues | 非同步支付掃描 |
| `WEBHOOK_QUEUE` | Queues | 非同步商戶 Webhook 投遞 |

## 背景任務

各執行環境對應的可靠佇列與排程器會將支付掃描和 Webhook 重試移出同步請求，也負責支付過期處理、清理、連線健康檢查與匯率同步。

兩種執行環境的 Webhook 投遞都使用可靠 outbox，保留重試歷史、人工重試與審計記錄。

## 資料與安全模型

- 選定執行環境後，以 D1 或 SQLite 作為權威資料庫。
- 快取與私有物件儲存使用對應執行環境的適配器。
- 支付適配器保持唯讀。
- 管理後臺使用 Better Auth、TOTP 與動態多角色 RBAC。

## 協議邊界

GMPay 使用 **HMAC-SHA256** 簽名。EPay 相容邊界仍保留舊版 **MD5** 規則。出站回撥會保留訂單來源協議的簽名格式。
