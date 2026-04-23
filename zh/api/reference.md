# API 參考

本節說明當前原始碼中的 Epusdt HTTP API 基線，便於你按真實實現接入。

## 基礎地址

所有介面都以你的 Epusdt 部署地址作為基礎 URL，例如：

```text
http://your-server:8000
```

生產環境建議放到 HTTPS 反向代理之後：

```text
https://pay.example.com
```

::: info
當前原始碼裡註冊的是根路徑相對路由，例如 `/payments/...` 和 `/pay/...`。

如果你對外使用了 `https://example.com/epusdt` 這類子路徑部署，那麼這個字首應由反向代理或閘道器負責處理，不是應用內部自帶的統一路由字首。
:::

## 鑑權與簽名

當前原始碼的支付建立介面並沒有單獨實現 Bearer Token、查詢引數 Token 或請求體 `token` 鑑權。

實際校驗的是請求裡的 `signature`，簽名金鑰來自 `.env` 中的 `api_auth_token`。

::: warning
請妥善保管 `api_auth_token`，不要暴露到前端、移動端或公開倉庫。
:::

## 請求籤名規則

簽名演算法為 **MD5**，規則如下：

1. 收集所有非空引數，排除 `signature`
2. 按 key 的 ASCII 升序排序
3. 拼接為 `key=value&key=value`
4. 直接在末尾追加 `api_auth_token`
5. 計算小寫 MD5，結果即為 `signature`

示例：

```text
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirect
```

拼接 token：

```text
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirectepusdt_password_xasddawqe
```

## 請求格式

- Method：`POST`
- Content-Type：`application/json`
- 編碼：UTF-8

::: warning
當前原始碼僅註冊了 `POST` 的 `create-transaction` 路由，且驗籤中介軟體會先按 JSON 解析原始請求體再校驗簽名。實際接入中，`GET` 與 `application/x-www-form-urlencoded` 不是該介面的有效請求方式。
:::

## 響應格式

當前原始碼裡的 JSON API，無論成功還是失敗，HTTP 狀態碼都統一返回 **200**。業務結果要看頂層 `status_code` 欄位。

成功響應統一為：

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "202203271648380592218340",
    "order_id": "9",
    "amount": 53,
    "currency": "cny",
    "actual_amount": 7.9104,
    "receive_address": "TNEns8t9jbWENbStkQdVQtHMGpbsYsQjZK",
    "token": "usdt",
    "expiration_time": 1648381192,
    "payment_url": "http://example.com/pay/checkout-counter/202203271648380592218340"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

## 狀態碼說明

當前原始碼使用頂層 `status_code` 表示介面結果：

| 程式碼 | 含義 |
|------|------|
| `200` | 成功 |
| `400` | 系統錯誤或請求校驗失敗 |
| `401` | 簽名校驗失敗 |
| `10001` | 錢包地址已存在 |
| `10002` | 訂單已存在 |
| `10003` | 無可用錢包地址 |
| `10004` | 支付金額不合法 |
| `10005` | 無可用金額通道 |
| `10006` | 匯率計算失敗 |
| `10007` | 區塊交易已處理 |
| `10008` | 訂單不存在 |
| `10009` | 請求引數解析失敗 |
| `10010` | 訂單狀態已變化 |

## 介面列表

| Method | Endpoint | 說明 |
|--------|----------|------|
| `POST` | `/payments/epusdt/v1/order/create-transaction` | 建立支付訂單；舊相容路由，會在驗籤通過後為預設欄位補 `token=usdt`、`currency=cny`、`network=TRON` |
| `POST` | `/payments/gmpay/v1/order/create-transaction` | 建立支付訂單；不做舊相容預設值補充，因此必須顯式傳 `currency`、`token`、`network` |
| `GET` | `/pay/checkout-counter/:trade_id` | 託管收銀臺頁面 |
| `GET` | `/pay/check-status/:trade_id` | 收銀臺輪詢狀態介面 |

::: tip
當前真實 API 字首是 `/payments/...`。舊文件中的 `/api/v1/order/create-transaction` 僅可視為歷史路徑說明，不應再當作當前可用介面。
:::

## 路由字首說明

需要區分三類路徑：

- `/payments/...`：真實 API 建立訂單路由
- `/pay/...`：收銀臺與狀態輪詢頁面路由
- `app_uri`：僅用於拼接返回的絕對地址，例如 `payment_url`

示例：

```text
app_uri = https://pay.example.com
payment_url = https://pay.example.com/pay/checkout-counter/{trade_id}
```

如果你透過 `/epusdt` 這樣的代理子路徑對外暴露，使用者最終看到的地址可能是：

```text
https://example.com/epusdt/pay/checkout-counter/{trade_id}
```

這個部署字首來自代理配置加 `app_uri`，不是 Go 路由裡額外掛了一層 `/epusdt`。

## 安全建議

- `api_auth_token` 只儲存在服務端
- 生產環境務必啟用 HTTPS
- 即使在相容舊外掛的 `/payments/epusdt/v1/...` 路由上，也建議顯式傳 `currency`、`token`、`network`，避免業務依賴相容預設值
- 支付成功後先驗籤，再更新業務訂單
- 回撥成功條件應按 **HTTP 200 + 響應體精確等於 `ok`** 處理
- 限制 `.env` 與後臺管理入口訪問許可權
- 為 TRC20 監聽準備穩定的 `tron_grid_api_key`

## 下一步

- [支付介面](/zh/api/payment) — 建立訂單、回撥、狀態查詢與完整示例
