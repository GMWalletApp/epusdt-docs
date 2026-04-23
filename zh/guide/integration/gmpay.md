# GMPay 接入（推薦）

如果你要使用原生多網路 API，對接時推薦使用 GMPay 路由。

::: tip
介面地址：`POST /payments/gmpay/v1/order/create-transaction`
:::

## 配置說明

在 `.env` 中配置 `api_auth_token`。

```dotenv
api_auth_token=your-secret-token
```

::: info
與舊版相容的 Epusdt 路由不同，GMPay 不會自動補預設值。你必須顯式傳 `currency`、`token`、`network`。
:::

## 支援的網路和幣種

當前原始碼和已有文件對外暴露了這些組合：

| Network | Token |
|---|---|
| `tron` | `usdt` |
| `solana` | `usdt` |
| `solana` | `usdc` |
| `ethereum` | `usdt` |
| `ethereum` | `usdc` |

## 簽名演算法

簽名規則和 Epusdt 一致。

1. 保留所有非空引數，排除 `signature`
2. 按引數名 ASCII 升序排序
3. 按 `key=value&key=value` 形式拼接
4. 末尾拼接 `api_auth_token`
5. 計算小寫 MD5

::: code-group

```php [PHP]
<?php
function gmpaySign(array $params, string $token): string {
    ksort($params);
    $parts = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null || $key === 'signature') continue;
        $parts[] = $key . '=' . $value;
    }
    return md5(implode('&', $parts) . $token);
}
```

```python [Python]
import hashlib


def gmpay_sign(params: dict, token: str) -> str:
    filtered = {k: v for k, v in params.items() if v not in ('', None) and k != 'signature'}
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

func GMPaySign(params map[string]string, token string) string {
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
POST /payments/gmpay/v1/order/create-transaction
Content-Type: application/json
```

```json
{
  "order_id": "ORDER_10002",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "redirect_url": "https://merchant.example.com/return",
  "signature": "e5f5d7f78516d5b51f8ef0dfec6177dd"
}
```

### 請求欄位

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---:|---|
| `order_id` | string | ✅ | 商戶訂單號，最長 32 字元 |
| `currency` | string | ✅ | 法幣幣種，例如 `cny` |
| `token` | string | ✅ | 代幣符號，例如 `usdt`、`usdc` |
| `network` | string | ✅ | 小寫網路值：`tron`、`solana`、`ethereum` |
| `amount` | float | ✅ | 法幣金額，必須大於 `0.01` |
| `notify_url` | string | ✅ | 非同步回撥地址 |
| `redirect_url` | string | ❌ | 支付成功後的瀏覽器跳轉地址 |
| `signature` | string | ✅ | MD5 簽名 |
| `name` | string | ❌ | 可選商品名稱 |
| `payment_type` | string | ❌ | 可選來源標記 |

### 響應

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "EP20240101XXXXXXXX",
    "order_id": "ORDER_10002",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.28,
    "receive_address": "TXXXXXXXXXXXXXXXXXXxx",
    "token": "USDT",
    "expiration_time": 1712500000,
    "payment_url": "https://pay.example.com/pay/checkout-counter/EP20240101XXXXXXXX"
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

::: warning
當前建立訂單響應裡不包含 `network`，即使請求裡 `network` 是必填。
:::

## 網路切換子訂單機制

託管收銀臺支援切換支付路線。

```http
POST /pay/switch-network
Content-Type: application/json
```

```json
{
  "trade_id": "EP20240101XXXXXXXX",
  "token": "usdc",
  "network": "solana"
}
```

### 請求欄位

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---:|---|
| `trade_id` | string | ✅ | 父訂單 trade_id |
| `token` | string | ✅ | 目標代幣 |
| `network` | string | ✅ | 目標網路 |

### 機制說明

- 如果請求的 `token + network` 與父訂單一致，原始碼直接返回當前收銀臺資料
- 如果該路線已經存在有效子訂單，原始碼會直接複用
- 否則原始碼會建立新的子訂單，並在目標網路上預留一個錢包地址
- 當前原始碼每個父訂單最多允許 `2` 個有效子訂單
- 某一條路線支付成功後，其它兄弟子訂單會被置為過期並釋放鎖定

## 非同步回撥

回撥處理方式與 Epusdt 一致。

```json
{
  "trade_id": "202203251648208648961728",
  "order_id": "ORDER_10002",
  "amount": 100,
  "actual_amount": 15.625,
  "receive_address": "TNEns8t9jbWENbStkQdVQtHMGpbsYsQjZK",
  "token": "USDT",
  "block_transaction_id": "123333333321232132131",
  "signature": "xsadaxsaxsa",
  "status": 2
}
```

使用相同的 MD5 規則和 `api_auth_token` 驗籤，處理成功後返回 HTTP 200 且響應體精確為 `ok`。

## 完整程式碼示例

::: code-group

```php [PHP]
<?php
$apiUrl = 'https://pay.example.com/payments/gmpay/v1/order/create-transaction';
$token = 'your-api-auth-token';

function gmpaySign(array $params, string $token): string {
    ksort($params);
    $parts = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null || $key === 'signature') continue;
        $parts[] = $key . '=' . $value;
    }
    return md5(implode('&', $parts) . $token);
}

$params = [
    'order_id' => 'ORDER_10002',
    'currency' => 'cny',
    'token' => 'usdt',
    'network' => 'tron',
    'amount' => 100,
    'notify_url' => 'https://merchant.example.com/notify',
    'redirect_url' => 'https://merchant.example.com/return',
];
$params['signature'] = gmpaySign($params, $token);

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
```

```python [Python]
import hashlib
import requests

API_URL = 'https://pay.example.com/payments/gmpay/v1/order/create-transaction'
API_TOKEN = 'your-api-auth-token'


def gmpay_sign(params: dict, token: str) -> str:
    filtered = {k: v for k, v in params.items() if v not in ('', None) and k != 'signature'}
    raw = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((raw + token).encode()).hexdigest()


payload = {
    'order_id': 'ORDER_10002',
    'currency': 'cny',
    'token': 'usdt',
    'network': 'tron',
    'amount': 100,
    'notify_url': 'https://merchant.example.com/notify',
    'redirect_url': 'https://merchant.example.com/return',
}
payload['signature'] = gmpay_sign(payload, API_TOKEN)
response = requests.post(API_URL, json=payload, timeout=15)
print(response.json())
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

const apiURL = "https://pay.example.com/payments/gmpay/v1/order/create-transaction"
const apiToken = "your-api-auth-token"

func gmpaySign(params map[string]string, token string) string {
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
        "order_id":     "ORDER_10002",
        "currency":     "cny",
        "token":        "usdt",
        "network":      "tron",
        "amount":       "100",
        "notify_url":   "https://merchant.example.com/notify",
        "redirect_url": "https://merchant.example.com/return",
    }
    payload["signature"] = gmpaySign(payload, apiToken)

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
