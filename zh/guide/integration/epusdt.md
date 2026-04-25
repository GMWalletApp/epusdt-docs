# 舊版遷移說明

目前原始碼已不再提供舊版 Epusdt 下單路由。

## 已移除路由

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## 現在應該改用什麼

### 如果你能控制客戶端程式碼

直接改用 **GMPay**：

```text
POST /payments/gmpay/v1/order/create-transaction
```

### 如果上游系統只支援跳轉式 EPay 流程

改用 **EPay 相容**：

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 遷移清單

- 替換舊下單 URL
- 所有入站請求補上 `pid`
- 改用商戶 API key 的 `secret_key` 重算簽名
- 不要再依賴舊文件裡的 `/payments/epusdt/v1/...`
- 如果前端需要動態顯示鏈 / 代幣，請改查 `/payments/gmpay/v1/supported-assets`
