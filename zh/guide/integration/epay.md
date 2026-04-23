# EPay 相容接入（跳轉式）

如果你需要 EPay 風格的跳轉式支付流程，可以使用這個相容入口。

::: tip
介面地址：`GET /payments/epay/v1/order/create-transaction/submit.php`
:::

## 配置說明

當前 `.env.example` 中包含以下 EPay 相關配置：

```dotenv
epay_pid=
epay_key=
```

::: info
當前原始碼會在 EPay 相容引數中使用 `epay_pid`，並在 EPay 格式回撥時使用 `epay_key` 進行簽名。

但對於 `/payments/epay/v1/order/create-transaction/submit.php` 這個入站建立訂單請求，當前路由程式碼實際使用 `api_auth_token` 來校驗 `sign`。
:::

## 接入方式說明

這是瀏覽器跳轉模式。你需要先拼接 GET 請求 URL，然後把使用者重定向到這個地址。

```text
GET /payments/epay/v1/order/create-transaction/submit.php?pid=1001&type=alipay&out_trade_no=ORDER_10003&notify_url=https%3A%2F%2Fmerchant.example.com%2Fnotify&return_url=https%3A%2F%2Fmerchant.example.com%2Freturn&name=VIP%20Order&money=100&sign=xxxx&sign_type=MD5
```

Epusdt 建立訂單後，當前原始碼會把瀏覽器繼續跳轉到託管收銀臺：

```text
/pay/checkout-counter/{trade_id}
```

## 請求引數

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---:|---|
| `pid` | int | ✅ | 商戶 PID，應與配置的 `epay_pid` 一致 |
| `type` | string | ✅ | EPay 客戶端使用的支付型別標識，當前回撥使用 `alipay` |
| `out_trade_no` | string | ✅ | 商戶訂單號 |
| `notify_url` | string | ✅ | 非同步回撥地址 |
| `return_url` | string | ❌ | 瀏覽器返回地址 |
| `name` | string | ❌ | 商品名稱 |
| `money` | string | ✅ | 訂單金額 |
| `sign` | string | ✅ | MD5 簽名 |
| `sign_type` | string | ✅ | 簽名型別，使用 `MD5` |

::: warning
當前路由程式碼從查詢引數中讀取 `money`、`name`、`notify_url`、`out_trade_no`、`return_url` 和 `sign`，然後在內部強制使用 `currency=cny`、`token=usdt`、`network=tron` 建立訂單。
:::

## 簽名規則

EPay 相容簽名依然使用相同的 MD5 排序規則。

1. 保留所有非空引數，排除 `sign` 或 `signature`
2. 按引數名 ASCII 升序排序
3. 按 `key=value&key=value` 形式拼接
4. 在末尾直接拼接簽名金鑰
5. 計算小寫 MD5

### 當前原始碼說明

- 入站建立訂單請求：當前路由程式碼使用 `money + name + notify_url + out_trade_no + pid + return_url` 配合 `api_auth_token` 計算簽名
- 出站 EPay 回撥：當前 worker 使用 `epay_key` 對 EPay 回撥欄位簽名

### 示例字串

```text
money=100&name=VIP Order&notify_url=https://merchant.example.com/notify&out_trade_no=ORDER_10003&pid=1001&return_url=https://merchant.example.com/returnYOUR_SIGN_KEY
```

::: code-group

```php [PHP]
<?php
function epaySign(array $params, string $signKey): string {
    ksort($params);
    $parts = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null || in_array($key, ['sign', 'signature'], true)) {
            continue;
        }
        $parts[] = $key . '=' . $value;
    }
    return md5(implode('&', $parts) . $signKey);
}
```

```python [Python]
import hashlib


def epay_sign(params: dict, sign_key: str) -> str:
    filtered = {
        k: v for k, v in params.items()
        if v not in ('', None) and k not in ('sign', 'signature')
    }
    raw = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((raw + sign_key).encode()).hexdigest()
```

:::

## 回撥說明

當 `payment_type = epay` 時，當前原始碼會發送 EPay 格式的非同步回撥。

### 回撥欄位

| 欄位 | 型別 | 說明 |
|---|---|---|
| `pid` | int | 商戶 PID |
| `trade_no` | string | 平臺交易號 |
| `out_trade_no` | string | 商戶訂單號 |
| `type` | string | 支付型別，當前原始碼使用 `alipay` |
| `name` | string | 商品名稱 |
| `money` | string | 保留 4 位小數的訂單金額 |
| `trade_status` | string | 當前原始碼使用 `TRADE_SUCCESS` |
| `sign` | string | MD5 簽名 |
| `sign_type` | string | `MD5` |

使用 `epay_key` 校驗回撥簽名，處理成功後返回 HTTP 200 且響應體精確為純文字 `ok`。

## 程式碼示例

::: code-group

```php [PHP]
<?php
$baseUrl = 'https://pay.example.com/payments/epay/v1/order/create-transaction/submit.php';
$pid = 1001;
$apiAuthToken = 'your-api-auth-token'; // 當前原始碼入站請求驗籤實際使用這個
$epayKey = 'your-epay-key'; // 當前原始碼出站回撥驗籤使用這個

function epaySign(array $params, string $signKey): string {
    ksort($params);
    $parts = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null || in_array($key, ['sign', 'signature'], true)) continue;
        $parts[] = $key . '=' . $value;
    }
    return md5(implode('&', $parts) . $signKey);
}

$query = [
    'pid' => $pid,
    'type' => 'alipay',
    'out_trade_no' => 'ORDER_10003',
    'notify_url' => 'https://merchant.example.com/notify',
    'return_url' => 'https://merchant.example.com/return',
    'name' => 'VIP Order',
    'money' => '100',
    'sign_type' => 'MD5',
];
$query['sign'] = epaySign($query, $apiAuthToken);

$redirectUrl = $baseUrl . '?' . http_build_query($query);
header('Location: ' . $redirectUrl);
exit;

// EPay 回撥處理示例
$callback = $_POST;
if (($callback['sign'] ?? '') !== epaySign($callback, $epayKey)) {
    http_response_code(400);
    exit('invalid sign');
}

// 在這裡更新你的業務訂單狀態
http_response_code(200);
echo 'ok';
```

```python [Python]
import hashlib
from flask import Flask, redirect, request
from urllib.parse import urlencode

BASE_URL = 'https://pay.example.com/payments/epay/v1/order/create-transaction/submit.php'
PID = 1001
API_AUTH_TOKEN = 'your-api-auth-token'  # 當前原始碼入站請求驗籤實際使用這個
EPAY_KEY = 'your-epay-key'  # 當前原始碼出站回撥驗籤使用這個


def epay_sign(params: dict, sign_key: str) -> str:
    filtered = {
        k: v for k, v in params.items()
        if v not in ('', None) and k not in ('sign', 'signature')
    }
    raw = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((raw + sign_key).encode()).hexdigest()


app = Flask(__name__)


@app.get('/create-epay-order')
def create_epay_order():
    query = {
        'pid': PID,
        'type': 'alipay',
        'out_trade_no': 'ORDER_10003',
        'notify_url': 'https://merchant.example.com/notify',
        'return_url': 'https://merchant.example.com/return',
        'name': 'VIP Order',
        'money': '100',
        'sign_type': 'MD5',
    }
    query['sign'] = epay_sign(query, API_AUTH_TOKEN)
    return redirect(f"{BASE_URL}?{urlencode(query)}")


@app.post('/notify')
def notify():
    data = request.form.to_dict()
    if data.get('sign') != epay_sign(data, EPAY_KEY):
        return 'invalid sign', 400

    # 在這裡更新你的業務訂單狀態
    return 'ok', 200
```

:::

## 參見

- [/zh/api/reference](/zh/api/reference)
- [/zh/api/payment](/zh/api/payment)
