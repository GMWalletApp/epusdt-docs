# 架構

GMPay Edge 以單個 Cloudflare Worker 承載產品入口與共享訂單 / 支付核心。

## 產品入口

- 商戶客戶端呼叫 GMPay 或 EPay 相容邊界。
- 付款人使用託管收銀臺。
- 營運者使用 `/admin`。
- Telegram 使用者透過已配置的 Bot 互動。

## Cloudflare 執行環境

| Binding | Cloudflare 產品 | 用途 |
| --- | --- | --- |
| `DB` | D1 | 權威的應用、支付、授權與投遞資料 |
| `CACHE` | KV | 短期已校驗快取與輔助遙測資料 |
| `FILES` | R2 | 私有付款複核憑證與產生的匯出檔案 |
| `PAYMENT_QUEUE` | Queues | 非同步支付掃描 |
| `WEBHOOK_QUEUE` | Queues | 非同步商戶 Webhook 投遞 |

## 背景任務

Queues 與 Cron Triggers 將支付掃描和 Webhook 重試移出同步請求，也負責支付過期處理、清理、連線健康檢查與匯率同步。

Webhook 投遞使用 Queue-backed outbox，保留重試歷史、人工重試與審計記錄。

## 資料與安全模型

- D1 是權威應用與支付資料庫。
- KV 保存短期且經校驗的快取。
- R2 保存私有付款複核憑證與產生的匯出檔案。
- 支付適配器保持唯讀。
- 管理後臺使用 Better Auth、TOTP 與動態多角色 RBAC。

## 協議邊界

GMPay 使用 **HMAC-SHA256** 簽名。EPay 相容邊界仍保留舊版 **MD5** 規則。出站回撥會保留訂單來源協議的簽名格式。
