# 商戶 API

GMPay 是主商戶協議。EPay 是同一套憑證、訂單服務、冪等規則、狀態機、收銀臺、查詢行為與回撥流水線之上的相容適配器。

權威欄位與狀態值以已部署實例的 `/docs` 頁面或倉庫中的 OpenAPI 合約為準：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml)。

## GMPay 簽名

GMPay 請求包含數字 `pid`，以及小寫 HMAC-SHA256 `signature`。

簽名流程：

1. 排除 `signature` 與空值。
2. 按欄位名 ASCII 順序排序。
3. 以 `key=value` 形式用 `&` 連接。
4. 使用憑證 Secret 作為 HMAC key。
5. 計算小寫 HMAC-SHA256。

## 建立訂單

```text
POST /payments/gmpay/v1/order/create-transaction
```

重複提交既有 `order_id` 不會建立第二筆訂單。同時省略 `token` 與 `network` 時會建立可選擇支付方式的訂單；GMPay Edge 不會靜默預設為 TRON。

## 查詢訂單

```text
GET /payments/gmpay/v1/order/query
```

請提供 `trade_id` 或 `order_id` 其中之一，並使用同一憑證簽名。憑證只能查詢自己建立的訂單。

## 接收回撥

商戶在建立訂單時提供 `notify_url`。回撥目標必須通過實例的 SSRF 與安全策略。

已投遞事件帶有確定性簽名、保留投遞嘗試、執行有界重試，並提供經審計的人工重試。接收端應驗證簽名、冪等處理重複事件，並在本地狀態提交後再確認。

GMPay 回撥成功處理後，請回傳 plain text `ok` 和 HTTP 200。

## EPay 相容

EPay 相容使用同一套憑證與訂單流水線，但入站請求和相容回撥仍保持舊版 EPay MD5 邊界。
