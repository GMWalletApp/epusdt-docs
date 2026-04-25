# GMPay 接入（推薦）

所有新接入都建議直接使用 GMPay。

## 路由

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 商戶憑證要求

呼叫前請先在管理後臺建立或查看 API key。

你需要：

- `pid`
- `secret_key`

其中 `pid` 必須出現在請求裡，`secret_key` 用來計算簽名。

## 最小請求體

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "signature": "md5(...)"
}
```

## 簽名規則

1. 保留所有非空欄位，排除 `signature`
2. 依 ASCII 鍵名排序
3. 拼成 `key=value&...`
4. 末尾追加商戶 `secret_key`
5. 計算小寫 MD5

## 常用配套介面

- `GET /payments/gmpay/v1/supported-assets`
- `POST /pay/switch-network`

## 回撥驗證

GMPay 成功回撥會以 JSON `POST` 發送到 `notify_url`。

使用同一商戶的 `secret_key` 驗證回傳 `signature`，然後返回純文字 `ok`。
