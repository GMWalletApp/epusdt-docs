# Epusdt 接入（舊版相容）

當你需要相容舊版 Epusdt 外掛行為時，使用這個路由。

::: tip
介面地址：`POST /payments/epusdt/v1/order/create-transaction`
:::

## 配置說明

在 `.env` 中配置 `api_auth_token`。它同時用於請求籤名和非同步回撥驗籤。

```dotenv
api_auth_token=your-secret-token
```

::: info
當前原始碼會保留與舊版 `POST /api/v1/order/create-transaction` 一致的相容行為。如果你不傳 `currency`、`token`、`network`，包裝路由會自動補：

- `currency = cny`
- `token = usdt`
- `network = tron`
:::

## 簽名演算法

簽名規則與舊版 API 一致。

1. 保留所有非空引數，排除 `signature`
2. 按引數名 ASCII 升序排序
3. 按 `key=value&key=value` 形式拼接
4. 在末尾直接拼接 `api_auth_token`
5. 計算小寫 MD5

### 示例

假設引數如下：

```text
order_id=20220201030210321
amount=42
notify_url=http://example.com/notify
redirect_url=http://example.com/redirect
```

Token：

```text
api_auth_token=epusdt_password_xasddawqe
```

待簽名字串：

```text
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirectepusdt_password_xasddawqe
```

簽名結果：

```text
1cd4b52df5587cfb1968b0c0c6e156cd
```

::: code-group

```php [PHP]
<?php
function epusdtSign(array $params, string $token): string {
    ksort($params);
    $parts = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null || $key === 'signature') {
            continue;
        }
        $parts[] = $key . '=' . $value;
    }
    return md5(implode('&', $parts) . $token);
}
```

```python [Python]
import hashlib


def epusdt_sign(params: dict, token: str) -> str:
    filtered = {
        k: v for k, v in params.items()
        if v not in ('', None) and k != 'signature'
    }
    raw = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((raw + token).encode()).hexdigest()
```

```go [Go]
package main

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

## 建立訂單

### 請求

```http
POST /payments/epusdt/v1/order/create-transaction
Content-Type: application/json
```

```json
{
  "order_id": "2022123321312321321",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "redirect_url": "https://merchant.example.com/return",
  "signature": "1cd4b52df5587cfb1968b0c0c6e156cd"
}
```

### 請求欄位

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---:|---|
| `order_id` | string | ✅ | 商戶訂單號，最長 32 字元 |
| `amount` | float | ✅ | 法幣金額，必須大於 `0.01` |
| `notify_url` | string | ✅ | 非同步回撥地址 |
| `redirect_url` | string | ❌ | 支付成功後的瀏覽器跳轉地址 |
| `signature` | string | ✅ | MD5 簽名 |

::: warning
當前原始碼會在相容包裝層補預設值之前先驗籤。如果你省略了 `currency`、`token`、`network`，就只對你實際傳送的欄位做簽名。
:::

### 響應

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "202203271648380592218340",
    "order_id": "2022123321312321321",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.28,
    "receive_address": "TNEns8t9jbWENbStkQdVQtHMGpbsYsQjZK",
    "token": "USDT",
    "expiration_time": 1712500000,
    "payment_url": "https://pay.example.com/pay/checkout-counter/202203271648380592218340"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### 響應欄位

| 欄位 | 型別 | 說明 |
|---|---|---|
| `trade_id` | string | Epusdt 交易號 |
| `order_id` | string | 你的原始訂單號 |
| `amount` | float | 原始法幣金額 |
| `currency` | string | 法幣幣種 |
| `actual_amount` | float | 使用者實際需要支付的代幣金額 |
| `receive_address` | string | 收款地址 |
| `token` | string | 代幣符號 |
| `expiration_time` | int | 過期時間，Unix 秒級時間戳 |
| `payment_url` | string | 託管收銀臺地址 |

## 非同步回撥處理

支付成功後，Epusdt 會向你的 `notify_url` 傳送 HTTP POST。

```json
{
  "trade_id": "202203251648208648961728",
  "order_id": "2022123321312321321",
  "amount": 100,
  "actual_amount": 15.625,
  "receive_address": "TNEns8t9jbWENbStkQdVQtHMGpbsYsQjZK",
  "token": "USDT",
  "block_transaction_id": "123333333321232132131",
  "signature": "xsadaxsaxsa",
  "status": 2
}
```

### 回撥欄位

| 欄位 | 型別 | 說明 |
|---|---|---|
| `trade_id` | string | Epusdt 交易號 |
| `order_id` | string | 你的業務訂單號 |
| `amount` | float | 原始法幣金額 |
| `actual_amount` | float | 實際到賬代幣金額 |
| `receive_address` | string | 收款地址 |
| `token` | string | 代幣符號 |
| `block_transaction_id` | string | 鏈上交易 ID |
| `status` | int | `1` 待支付，`2` 已支付，`3` 已過期 |
| `signature` | string | MD5 簽名 |

### 驗籤規則

使用相同的 MD5 簽名步驟和 `api_auth_token` 驗證回撥，然後再更新你的業務訂單。

::: warning
處理成功後必須返回 HTTP 200，且響應體精確為純文字 `ok`。返回其他內容會被視為回撥失敗。
:::

## 完整程式碼示例

::: code-group

```php [PHP]
<?php
$apiUrl = 'https://pay.example.com/payments/epusdt/v1/order/create-transaction';
$token = 'your-api-auth-token';

function epusdtSign(array $params, string $token): string {
    ksort($params);
    $parts = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null || $key === 'signature') continue;
        $parts[] = $key . '=' . $value;
    }
    return md5(implode('&', $parts) . $token);
}

$params = [
    'order_id' => 'ORDER_10001',
    'amount' => 100,
    'notify_url' => 'https://merchant.example.com/notify',
    'redirect_url' => 'https://merchant.example.com/return',
];
$params['signature'] = epusdtSign($params, $token);

$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($params, JSON_UNESCAPED_SLASHES),
    CURLOPT_RETURNTRANSFER => true,
]);
$response = curl_exec($ch);
curl_close($ch);

echo $response;

// 回撥處理示例
$callback = json_decode(file_get_contents('php://input'), true);
$localSign = epusdtSign($callback, $token);
if (($callback['signature'] ?? '') !== $localSign) {
    http_response_code(400);
    exit('invalid sign');
}

// 在這裡更新你的業務訂單狀態
http_response_code(200);
echo 'ok';
```

```python [Python]
import hashlib
import requests
from flask import Flask, request

API_URL = 'https://pay.example.com/payments/epusdt/v1/order/create-transaction'
API_TOKEN = 'your-api-auth-token'


def epusdt_sign(params: dict, token: str) -> str:
    filtered = {
        k: v for k, v in params.items()
        if v not in ('', None) and k != 'signature'
    }
    raw = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((raw + token).encode()).hexdigest()


payload = {
    'order_id': 'ORDER_10001',
    'amount': 100,
    'notify_url': 'https://merchant.example.com/notify',
    'redirect_url': 'https://merchant.example.com/return',
}
payload['signature'] = epusdt_sign(payload, API_TOKEN)
response = requests.post(API_URL, json=payload, timeout=15)
print(response.json())

app = Flask(__name__)


@app.post('/notify')
def notify():
    data = request.get_json(force=True)
    if data.get('signature') != epusdt_sign(data, API_TOKEN):
        return 'invalid sign', 400

    # 在這裡更新你的業務訂單狀態
    return 'ok', 200
```

```go [Go]
package main

import (
    "bytes"
    "crypto/md5"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "sort"
    "strings"
)

const apiURL = "https://pay.example.com/payments/epusdt/v1/order/create-transaction"
const apiToken = "your-api-auth-token"

func epusdtSign(params map[string]string, token string) string {
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

func main() {
    payload := map[string]string{
        "order_id":     "ORDER_10001",
        "amount":       "100",
        "notify_url":   "https://merchant.example.com/notify",
        "redirect_url": "https://merchant.example.com/return",
    }
    payload["signature"] = epusdtSign(payload, apiToken)

    body, _ := json.Marshal(payload)
    req, _ := http.NewRequest(http.MethodPost, apiURL, bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    raw, _ := io.ReadAll(resp.Body)
    fmt.Println(string(raw))
}
```

:::

## 參見

- [/zh/api/reference](/zh/api/reference)
- [/zh/api/payment](/zh/api/payment)
