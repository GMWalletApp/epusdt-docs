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
  "signature": "hmac-sha256-hex(...)"
}
```

## 簽名規則

> 自 `v2.0.0` 起，GMPay 使用 HMAC-SHA256，不再使用 MD5。部署 v2 前請先升級客戶端，否則會收到 `401 Unauthorized`；EPay 相容請求不受影響。

1. 保留所有非空欄位，排除 `signature`
2. 依 ASCII 鍵名排序
3. 拼成 `key=value&...`
4. 使用商戶 `secret_key` 作為 HMAC key 計算 HMAC-SHA256
5. 將 64 位小寫十六進位摘要作為 `signature`

## 常用配套介面

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

如果前端需要動態取得可用鏈 / 代幣，請從 `/payments/gmpay/v1/config` 回應中的 `data.supported_assets` 讀取。

同一個 config 回應也會帶出公開收銀臺品牌資訊（`data.site`）以及 EPay / OkPay 前端預設值（`data.epay`、`data.okpay`）。

## 回撥驗證

GMPay 成功回撥會以 JSON `POST` 發送到 `notify_url`。

使用同一商戶的 `secret_key` 依相同 HMAC-SHA256 規則驗證回傳 `signature`，然後返回純文字 `ok`。

## 成功回應補充

目前原始碼在建單成功回應中也會返回 `payment_url`，因此呼叫端可以直接取得託管收銀臺跳轉地址，不必自行拼接。
