# 支付介面

本頁說明當前版本的支付接入流程：建立訂單、跳轉收銀臺、處理回撥，以及查詢訂單狀態。

## 建立交易

建立新的支付訂單。Epusdt 會在訂單有效期內鎖定一個收款地址和應付金額。

**當前線上介面：**

```
POST /payments/epusdt/v1/order/create-transaction
```

**同時可用：**

```
POST /payments/gmpay/v1/order/create-transaction
```

::: tip
當前原始碼中的真實 API 字首是 `/payments/...`。舊文件中的 `/api/v1/order/create-transaction` 屬於歷史路徑，不是當前註冊路由。
:::

### 請求引數

建立訂單介面請求方式：

- `POST`
- `application/json`

::: info
簽名校驗發生在**原始 JSON 請求體**上，而且執行順序早於 `/payments/epusdt/v1/...` 這層相容路由補預設值。所以在 Epusdt 相容路由裡，即使你省略了 `currency`、`token`、`network`，只要簽名對應的是你實際提交的欄位，依然可以透過。

當驗籤通過後，這層相容包裝會重寫請求體，並把預設欄位補成 `cny`、`usdt`、`TRON`，然後再進入共享的建立訂單處理邏輯。
:::

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `order_id` | string | ✅ | 業務訂單號，最長 32 個字元 |
| `amount` | float | ✅ | 法幣金額，必須大於 `0.01` |
| `notify_url` | string | ✅ | 非同步通知地址，支付成功後會向此地址發起 POST |
| `redirect_url` | string | ❌ | 使用者支付成功後的跳轉地址 |
| `currency` | string | ✅* | 法幣幣種 |
| `token` | string | ✅* | 支付幣種 |
| `network` | string | ✅* | 區塊鏈網路 |
| `signature` | string | ✅ | MD5 簽名 |

`*` 共享請求校驗器要求 `currency`、`token`、`network` 必填。但當前 `/payments/epusdt/v1/...` 路由會在預設時自動補預設值：

- `currency = cny`
- `token = usdt`
- `network = TRON`

而 `/payments/gmpay/v1/...` 路由**不會**補這些預設值。

::: warning
新接入方即使呼叫 `/payments/epusdt/v1/...`，也建議顯式傳 `currency`、`token`、`network`。省略欄位只是為了相容舊外掛，不應當作為首選接入約定。
:::

### 簽名生成

`signature` 生成規則：

1. 收集所有非空引數，排除 `signature`
2. 按引數名 ASCII 升序排序
3. 拼成 `key=value&key=value`
4. 直接在末尾追加 `api_auth_token`
5. 計算小寫 MD5

#### 示例

已知：

```
order_id = "20220201030210321"
amount = 42
notify_url = "http://example.com/notify"
redirect_url = "http://example.com/redirect"
```

Token：

```
api_auth_token = "epusdt_password_xasddawqe"
```

排序後字串：

```
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirect
```

末尾追加 Token：

```
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirectepusdt_password_xasddawqe
```

MD5：

```
1cd4b52df5587cfb1968b0c0c6e156cd
```

#### 程式碼示例

::: code-group

```php [PHP]
<?php
function epusdtSign(array $parameter, string $signKey): string {
    ksort($parameter);
    reset($parameter);
    $sign = '';
    foreach ($parameter as $key => $val) {
        if ($val === '' || $val === null) continue;
        if ($key === 'signature') continue;
        if ($sign !== '') $sign .= '&';
        $sign .= "$key=$val";
    }
    return md5($sign . $signKey);
}
```

```python [Python]
import hashlib

def epusdt_sign(params: dict, token: str) -> str:
    filtered = {k: v for k, v in params.items() if v != '' and v is not None and k != 'signature'}
    sorted_str = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((sorted_str + token).encode()).hexdigest()
```

```go [Go]
import (
    "crypto/md5"
    "fmt"
    "sort"
    "strings"
)

func EpusdtSign(params map[string]string, token string) string {
    keys := make([]string, 0)
    for k, v := range params {
        if v != "" && k != "signature" {
            keys = append(keys, k)
        }
    }
    sort.Strings(keys)
    parts := make([]string, 0, len(keys))
    for _, k := range keys {
        parts = append(parts, k+"="+params[k])
    }
    raw := strings.Join(parts, "&") + token
    return fmt.Sprintf("%x", md5.Sum([]byte(raw)))
}
```

:::

### 響應示例

當前 JSON API 的返回外層統一是 HTTP 200，業務結果請看頂層 `status_code`。

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "EP20240101XXXXXXXX",
    "order_id": "ORDER_20240101_001",
    "amount": 100.0,
    "currency": "cny",
    "actual_amount": 14.28,
    "receive_address": "TXXXXXXXXXXXXXXXXXXxx",
    "token": "usdt",
    "expiration_time": 1712500000,
    "payment_url": "http://your-server:8000/pay/checkout-counter/EP20240101XXXXXXXX"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### 響應欄位說明

| 欄位 | 型別 | 說明 |
|------|------|------|
| `trade_id` | string | Epusdt 內部交易號 |
| `order_id` | string | 你的業務訂單號 |
| `amount` | float | 原始法幣金額 |
| `currency` | string | 法幣幣種 |
| `actual_amount` | float | 使用者實際需要支付的代幣金額 |
| `receive_address` | string | 收款地址 |
| `token` | string | 代幣符號，例如 `usdt` |
| `expiration_time` | int | 過期時間，Unix 秒級時間戳 |
| `payment_url` | string | 託管收銀臺地址 |

當前建立訂單響應中**不包含** `network` 欄位。

## 支付流程

```
1. 你的服務端呼叫建立交易介面
2. Epusdt 返回 `trade_id`、`receive_address`、`payment_url`
3. 將使用者跳轉到 `payment_url`，或自行展示地址 / 二維碼
4. 使用者向 `receive_address` 轉賬
5. Epusdt 監聽到鏈上到賬
6. Epusdt 向 `notify_url` 發起 POST 回撥
7. 你的服務端驗籤並返回精確的 `ok`
8. 如果配置了 `redirect_url`，託管收銀臺會在支付成功後跳轉
```

## 收銀臺頁面

託管收銀臺路由：

```
GET /pay/checkout-counter/:trade_id
```

示例：

```
https://pay.example.com/pay/checkout-counter/EP20240101XXXXXXXX
```

這個頁面路由和 API 字首是分開的。原始碼裡 `payment_url` 的拼接方式是：

```text
{app_uri}/pay/checkout-counter/{trade_id}
```

也就是說，如果 `app_uri` 是 `https://pay.example.com`，那麼收銀臺地址就是 `https://pay.example.com/pay/checkout-counter/{trade_id}`。

如果你的公網部署還帶了額外子路徑，比如 `https://example.com/epusdt`，那就應把 `app_uri` 設為這個公網基地址，並由代理把請求轉發到應用內部根掛載的 `/pay/...` 路由。

## 查詢訂單狀態

狀態輪詢路由：

```
GET /pay/check-status/:trade_id
```

示例：

```
GET https://pay.example.com/pay/check-status/EP20240101XXXXXXXX
```

這是 `/pay/...` 下的收銀臺輪詢介面，不是建立訂單 API。

響應示例：

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "EP20240101XXXXXXXX",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### 訂單狀態值

| 狀態值 | 含義 |
|--------|------|
| `1` | 等待支付 |
| `2` | 支付成功 |
| `3` | 已過期 |

## 回撥 / Webhook

當鏈上確認支付成功，且訂單狀態已經變為 `2`（已支付）後，Epusdt 會向建立訂單時傳入的 `notify_url` 發起 POST 請求。

回撥體使用與建立訂單相同的 MD5 演算法和 `api_auth_token` 進行簽名，原始碼裡傳送的是 JSON 請求體。

### 回撥資料格式

```json
{
  "trade_id": "EP20240101XXXXXXXX",
  "order_id": "ORDER_20240101_001",
  "amount": 100.0,
  "actual_amount": 14.28,
  "receive_address": "TXXXXXXXXXXXXXXXXXXxx",
  "token": "usdt",
  "block_transaction_id": "4d7d...",
  "status": 2,
  "signature": "a1b2c3d4e5f6..."
}
```

### 回撥欄位說明

| 欄位 | 型別 | 說明 |
|------|------|------|
| `trade_id` | string | Epusdt 內部交易號 |
| `order_id` | string | 你的業務訂單號 |
| `amount` | float | 原始法幣金額 |
| `actual_amount` | float | 實際到賬代幣金額 |
| `receive_address` | string | 收款地址 |
| `token` | string | 代幣符號 |
| `block_transaction_id` | string | 鏈上交易 ID |
| `status` | int | 訂單狀態，`2` 表示已支付 |
| `signature` | string | 用於驗籤的 MD5 簽名 |

當前回撥體中**不包含** `network` 欄位。

### 如何校驗回撥簽名

規則與建立訂單簽名完全一致：

1. 保留所有非空欄位，排除 `signature`
2. 按 key 排序
3. 拼成 `key=value&key=value`
4. 末尾追加 `api_auth_token`
5. 計算小寫 MD5 後比對

### 回撥響應要求

::: danger 重要
你的服務端**必須**返回 **HTTP 200**，且響應體必須是精確的純文字 `ok`。

例如：

- `ok` ✅
- `OK`、`ok\n`、`{"message":"ok"}` ❌

當前原始碼中的重試行為由配置決定，不是固定寫死的重試次數：

- `order_notice_max_retry`：首次嘗試之後允許的最大重試次數
- `callback_retry_base_seconds`：指數退避的基礎秒數

`.env.example` 預設值為：

- `order_notice_max_retry=0`
- `callback_retry_base_seconds=5`

所以在預設配置下，會執行第一次回撥；如果失敗，不會繼續額外重試。
:::

## 完整接入示例

```python
import hashlib
import requests

API_BASE = "https://pay.example.com"
API_AUTH_TOKEN = "your_api_auth_token"

def epusdt_sign(params: dict, token: str) -> str:
    filtered = {k: v for k, v in params.items() if v != '' and v is not None and k != 'signature'}
    sorted_str = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((sorted_str + token).encode()).hexdigest()

def create_order(order_id: str, amount: float, notify_url: str):
    params = {
        "order_id": order_id,
        "amount": amount,
        "notify_url": notify_url,
        "currency": "cny",
        "token": "usdt",
        "network": "TRON",
    }
    params["signature"] = epusdt_sign(params, API_AUTH_TOKEN)

    response = requests.post(
        f"{API_BASE}/payments/epusdt/v1/order/create-transaction",
        json=params,
    )
    result = response.json()

    if result["status_code"] == 200:
        data = result["data"]
        print(f"Trade ID:     {data['trade_id']}")
        print(f"USDT 金額:     {data['actual_amount']}")
        print(f"收款地址:      {data['receive_address']}")
        print(f"收銀臺連結:    {data['payment_url']}")
        return data
    else:
        print(f"錯誤: {result['message']}")
        return None

create_order("ORDER_001", 100.00, "https://example.com/callback")
```

這個顯式傳參示例同時適用於兩個當前可用的建立訂單路由，也是更推薦的新接入方式。如果你呼叫的是 `/payments/epusdt/v1/...`，當前原始碼也允許省略 `currency`、`token`、`network`，因為相容路由會在驗籤之後補預設值，但新客戶端不建議依賴這個舊相容行為。

如果服務是透過代理子路徑對外暴露，請讓這裡的 `API_BASE` 與 `app_uri` 保持一致，使用對外可訪問的完整基地址。

## 錯誤處理建議

| 狀態碼 | 訊息 | 處理建議 |
|--------|------|----------|
| `400` | system / validation error | 檢查請求體和必填欄位 |
| `401` | `signature verification failed` | 檢查簽名邏輯與 `api_auth_token` |
| `10002` | `order already exists` | 使用未重複的 `order_id` |
| `10003` | `no available wallet address` | 增加更多錢包地址 |
| `10004` | `invalid payment amount` | 檢查金額限制和最小值 |
| `10005` | `no available amount channel` | 更換金額重試，或檢查金額通道分配 |
| `10008` | `order does not exist` | 檢查查詢的 `trade_id` 是否正確 |
