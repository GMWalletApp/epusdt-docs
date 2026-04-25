# 支付介面

## 1. GMPay 建立訂單

**路由**

```text
POST /payments/gmpay/v1/order/create-transaction
```

**必要欄位**

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `pid` | string / integer | ✅ | 商戶識別碼。驗籤中介層必填。 |
| `order_id` | string | ✅ | 最長 32 字元 |
| `currency` | string | ✅ | 例如 `cny` |
| `token` | string | ✅ | 例如 `usdt` |
| `network` | string | ✅ | 例如 `tron` |
| `amount` | number | ✅ | 必須大於 `0.01` |
| `notify_url` | string | ✅ | 非同步回撥地址 |
| `signature` | string | ✅ | 使用商戶 `secret_key` 計算的 MD5 簽名 |
| `redirect_url` | string | ❌ | 支付完成後跳轉網址 |
| `name` | string | ❌ | 商品顯示名稱 |
| `payment_type` | string | ❌ | 可選來源標記 |

**請求示例**

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "redirect_url": "https://merchant.example.com/return",
  "name": "VIP Plan",
  "signature": "md5(...)"
}
```

## 2. 可用鏈與代幣

```text
GET /payments/gmpay/v1/supported-assets
```

回傳的是目前後臺已啟用、且該鏈上至少存在一個可用錢包地址的鏈 / 代幣組合，所以不要把文件裡某個固定清單當成永遠正確。

## 3. EPay 相容跳轉建單

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

**入站引數**

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `pid` | ✅ | 商戶 PID，會在 `api_keys` 中查找 |
| `money` | ✅ | 法幣金額 |
| `out_trade_no` | ✅ | 商戶訂單號 |
| `notify_url` | ✅ | 回撥地址 |
| `return_url` | ❌ | 瀏覽器返回地址 |
| `name` | ❌ | 商品名稱 |
| `type` | ❌ | 前端展示的支付型別標識 |
| `sign` | ✅ | 使用商戶 `secret_key` 計算的 MD5 簽名 |
| `sign_type` | ❌ | 一般為 `MD5` |

目前原始碼會先校驗 `sign`，檢查 API key 白名單，然後用後臺設定補出共用訂單欄位：

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

成功後會 302 跳轉到 `/pay/checkout-counter/{trade_id}`。

## 4. 回撥行為

### 標準回撥（GMPay / 一般 JSON 流程）

鏈上確認成功後，Epusdt 會向 `notify_url` 發送 **POST JSON**。

重要欄位包括：

- `pid`
- `trade_id`
- `order_id`
- `amount`
- `actual_amount`
- `receive_address`
- `token`
- `block_transaction_id`
- `status`
- `signature`

使用同一商戶的 `secret_key` 驗 `signature`，處理完成後返回純文字 `ok`。

### EPay 回撥

當訂單 `payment_type = Epay` 時，當前 worker 會對 `notify_url` 發起 **GET** 請求，附帶以下查詢引數：

- `pid`
- `trade_no`
- `out_trade_no`
- `type`
- `name`
- `money`
- `trade_status`
- `sign`
- `sign_type=MD5`

這裡的 `sign` 同樣使用該商戶的 `secret_key` 驗證，成功後返回純文字 `ok`。

## 5. 切換支付網路

```text
POST /pay/switch-network
```

JSON 範例：

```json
{
  "trade_id": "T2026041612345678",
  "token": "USDT",
  "network": "ethereum"
}
```

這個介面主要給託管收銀臺使用，用來切換到另一個可用的鏈 / 代幣組合。
