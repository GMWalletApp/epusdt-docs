# Epusdt API 文件

開發者可透過 Epusdt 提供的 HTTP API 將收款能力整合到業務系統。本文件以當前程式碼路由為準。

> 舊版 `POST /api/v1/order/create-transaction` 已不再註冊；建立訂單請使用 `POST /payments/gmpay/v1/order/create-transaction`。

## 介面總覽

| 場景 | 方法 | 路徑 | 是否需要簽名 |
| --- | --- | --- | --- |
| 建立 GMPay 交易 | POST | `/payments/gmpay/v1/order/create-transaction` | 是 |
| 獲取公開支付配置 | GET | `/payments/gmpay/v1/config` | 否 |
| 收銀臺頁面 | GET | `/pay/checkout-counter/{trade_id}` | 否 |
| 收銀臺初始化資料 | GET | `/pay/checkout-counter-resp/{trade_id}` | 否 |
| 查詢支付狀態 | GET | `/pay/check-status/{trade_id}` | 否 |
| 切換支付網路/通道 | POST | `/pay/switch-network` | 否 |
| EPay 相容建立交易 | GET/POST | `/payments/epay/v1/order/create-transaction/submit.php` | 是 |
| OkPay 平臺回撥 | POST | `/payments/okpay/v1/notify` | OkPay 簽名 |

## 統一響應格式

除重定向和純文本回調介面外，介面返回 JSON：

```json
{
  "status_code": 200,
  "message": "success",
  "data": {},
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

說明：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `status_code` | integer | 業務狀態碼。成功為 `200`，錯誤碼見文末。 |
| `message` | string | 返回訊息。 |
| `data` | object/null | 介面資料。 |
| `request_id` | string | 請求 ID，服務端自動生成。 |

簽名錯誤會返回 HTTP 401；業務錯誤通常返回 HTTP 400，並在 `status_code` 中給出具體業務碼。

## 簽名規則

當前版本使用統一商戶憑證。請求必須攜帶 `pid`，服務端用 `pid` 查詢對應的 `secret_key` 作為簽名金鑰。預設安裝會建立一個 PID 為 `1000` 的預設金鑰。

### GMPay 簽名

1. 將所有非空引數按引數名 ASCII 字典序升序排序。
2. 使用 `key=value` 形式以 `&` 拼接。
3. 不參與簽名的欄位：`signature`。
4. 在拼接字串末尾直接追加 `secret_key`。
5. 對最終字串做 MD5，結果轉小寫，作為 `signature`。

注意：

- `pid` 必須參與簽名。
- 空字串和 `null` 不參與簽名。
- 引數名區分大小寫。
- JSON 數字會按服務端數字格式參與簽名，例如 `100.00` 會被解析為 `100`；如果需要保留字串格式，可使用 `application/x-www-form-urlencoded`。

示例引數：

```text
pid=1000
order_id=ORD202605230001
currency=cny
token=usdt
network=tron
amount=100
notify_url=https://merchant.example/notify
redirect_url=https://merchant.example/return
name=VIP
```

以下示例假設 `secret_key` 為 `epusdt_secret_key`，僅用於演示簽名計算。

待簽名字串：

```text
amount=100&currency=cny&name=VIP&network=tron&notify_url=https://merchant.example/notify&order_id=ORD202605230001&pid=1000&redirect_url=https://merchant.example/return&token=usdtepusdt_secret_key
```

得到：

```text
signature=476412c422f4dd75c3d533f5c47a9cac
```

### PHP 簽名示例

GMPay 使用 `signature` 欄位，簽名時只排除 `signature`：

```php
function gmpaySign(array $params, string $secretKey): string
{
    unset($params['signature']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

EPay 相容介面使用 `sign` 欄位，簽名時排除 `sign` 和 `sign_type`：

```php
function epaySign(array $params, string $secretKey): string
{
    unset($params['sign'], $params['sign_type']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

## 建立 GMPay 交易

`POST /payments/gmpay/v1/order/create-transaction`

支援：

- `Content-Type: application/json`
- `Content-Type: application/x-www-form-urlencoded`

### 請求示例

```json
{
  "pid": "1000",
  "order_id": "ORD202605230001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example/notify",
  "redirect_url": "https://merchant.example/return",
  "name": "VIP",
  "signature": "476412c422f4dd75c3d533f5c47a9cac"
}
```

### 請求引數

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `pid` | string | 是 | 商戶 PID，用於查詢 API Key，並參與簽名。 |
| `order_id` | string | 是 | 商戶訂單號，最長 32 字元，不能重複。 |
| `currency` | string | 是 | 法幣幣種，如 `cny`、`usd`。 |
| `token` | string | 是 | 收款幣種，如 `usdt`、`trx`、`usdc`、`sol`。 |
| `network` | string | 是 | 收款網路，如 `tron`、`solana`、`ethereum`、`bsc`、`polygon`、`plasma`。 |
| `amount` | number | 是 | 法幣金額，必須大於 `0.01`。 |
| `notify_url` | string | 是 | 支付成功非同步回撥地址。 |
| `redirect_url` | string | 否 | 支付完成後的同步跳轉地址。 |
| `name` | string | 否 | 商品/訂單名稱。 |
| `payment_type` | string | 否 | 相容欄位。普通 GMPay 不需要傳；傳 `Epay` 會使用 EPay 回撥格式，且 PID 必須是數字。 |
| `signature` | string | 是 | GMPay 簽名。 |

建議先呼叫 `/payments/gmpay/v1/config` 獲取可用的 `network` 和 `token` 組合。

### 成功響應

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "order_id": "ORD202605230001",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.29,
    "receive_address": "TTestTronAddress001",
    "token": "USDT",
    "expiration_time": 1779530812,
    "payment_url": "https://pay.example.com/pay/checkout-counter/20260523171652123456001"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `trade_id` | string | Epusdt 交易號。 |
| `order_id` | string | 商戶訂單號。 |
| `amount` | number | 商戶提交的法幣金額。 |
| `currency` | string | 法幣幣種。 |
| `actual_amount` | number | 實際需支付的加密貨幣數量。 |
| `receive_address` | string | 收款地址。 |
| `token` | string | 收款幣種。 |
| `expiration_time` | integer | 訂單過期時間，秒級時間戳。 |
| `payment_url` | string | 收銀臺地址。該地址會跳轉到前端收銀臺。 |

## 獲取公開支付配置

`GET /payments/gmpay/v1/config`

返回收銀臺展示配置、可用鏈/幣種、EPay 預設配置和 OkPay 公共配置。

### 成功響應示例

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "supported_assets": [
      {
        "network": "tron",
        "display_name": "TRON",
        "tokens": ["TRX", "USDT"]
      },
      {
        "network": "solana",
        "display_name": "Solana",
        "tokens": ["SOL", "USDC", "USDT"]
      }
    ],
    "site": {
      "cashier_name": "Acme Cashier",
      "logo_url": "https://cdn.example.com/logo.png",
      "website_title": "Acme Payments",
      "support_link": "https://example.com/support",
      "background_color": "#0f172a",
      "background_image_url": "https://cdn.example.com/background.png"
    },
    "epay": {
      "default_token": "usdt",
      "default_currency": "cny",
      "default_network": "tron"
    },
    "okpay": {
      "enabled": false,
      "allow_tokens": ["USDT", "TRX"]
    },
    "version": "v1.0.1"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

`supported_assets` 只包含同時滿足以下條件的組合：

- 鏈已啟用。
- 該鏈有可用錢包地址。
- 該鏈至少有一個啟用中的 token。

## 收銀臺頁面

`GET /pay/checkout-counter/{trade_id}`

用於瀏覽器開啟收銀臺。當前實現會返回 301，並跳轉到：

```text
/cashier/{trade_id}
```

建立交易介面返回的 `payment_url` 即為該地址。

## 收銀臺初始化資料

`GET /pay/checkout-counter-resp/{trade_id}`

用於前端收銀臺讀取訂單展示資料。該介面只確認訂單存在並返回基礎資料；當前支付狀態請呼叫 `/pay/check-status/{trade_id}`。

### 成功響應示例

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 14.29,
    "token": "USDT",
    "currency": "CNY",
    "receive_address": "TTestTronAddress001",
    "network": "tron",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

注意：該介面的 `expiration_time` 和 `created_at` 是毫秒級時間戳。

## 查詢支付狀態

`GET /pay/check-status/{trade_id}`

### 成功響應示例

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "status": 1
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

訂單狀態：

| 值 | 說明 |
| --- | --- |
| `1` | 等待支付 |
| `2` | 支付成功 |
| `3` | 已過期 |

## 切換支付網路/通道

`POST /pay/switch-network`

該介面通常由收銀臺前端呼叫，用於切換到另一個鏈上收款地址，或切換到 OkPay 託管收銀臺。

### 請求示例

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "solana"
}
```

切換到 OkPay：

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "okpay"
}
```

### 請求引數

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `trade_id` | string | 是 | 父訂單交易號。 |
| `token` | string | 是 | 目標幣種。 |
| `network` | string | 是 | 目標網路，或特殊值 `okpay`。 |

### 成功響應

返回結構與收銀臺初始化資料一致。鏈上子訂單的 `payment_url` 通常是本地收銀臺地址；OkPay 子訂單的 `payment_url` 是 OkPay 返回的託管支付連結。

說明：

- 只能對父訂單切換網路，不能對子訂單繼續切換。
- 父訂單必須仍處於等待支付狀態。
- 每個父訂單最多建立 2 個等待支付中的子訂單。
- 如果切換到同一組 `token + network`，會返回已有訂單。

## EPay 相容建立交易

`GET /payments/epay/v1/order/create-transaction/submit.php`

`POST /payments/epay/v1/order/create-transaction/submit.php`

該介面相容傳統 EPay/易支付接入方式。成功後不會返回 JSON，而是 HTTP 302 跳轉到：

```text
/pay/checkout-counter/{trade_id}
```

### 請求引數

| 欄位 | 位置 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- | --- |
| `pid` | query/form | string | 是 | 商戶 PID。建議使用數字 PID；EPay 回撥會按數字 PID 輸出。 |
| `money` | query/form | number | 是 | 法幣金額。 |
| `out_trade_no` | query/form | string | 是 | 商戶訂單號。 |
| `notify_url` | query/form | string | 是 | 非同步回撥地址。 |
| `return_url` | query/form | string | 否 | 支付完成後的同步跳轉地址。 |
| `name` | query/form | string | 否 | 商品/訂單名稱。 |
| `type` | query/form | string | 否 | 相容欄位，如 `alipay`。建立訂單時不決定實際鏈上幣種。 |
| `sign` | query/form | string | 是 | EPay 簽名。 |
| `sign_type` | query/form | string | 否 | 通常為 `MD5`。 |

簽名規則：

- 使用 `pid` 對應的 `secret_key`。
- 排除 `sign` 和 `sign_type`。
- 其他非空引數按 ASCII 字典序拼接後追加 `secret_key` 並 MD5；如果接入外掛額外傳了 `sitename` 等欄位，也要一起參與簽名。

示例待簽名字串：

```text
money=100&name=VIP&notify_url=https://merchant.example/notify&out_trade_no=ORD202605230001&pid=1000&return_url=https://merchant.example/return&type=alipayepusdt_secret_key
```

得到：

```text
sign=b865b0acbb2b01554c35a1bd33351452
```

EPay 介面會使用後臺配置的預設 `token`、`currency`、`network` 建立實際訂單，預設配置可透過 `/payments/gmpay/v1/config` 的 `epay` 欄位檢視。

## 商戶非同步回撥

訂單支付成功後，Epusdt 會向訂單的 `notify_url` 傳送非同步通知。目標伺服器處理完成後需返回 HTTP 200，響應體為 `ok` 或 `success`（大小寫不敏感）。否則會按佇列配置重試：首次失敗後最多重試 `order_notice_max_retry` 次，重試間隔按 `callback_retry_base_seconds` 指數退避，最大 5 分鐘。

### GMPay 回撥

普通 GMPay 訂單使用 POST JSON 回撥。

```json
{
  "pid": "1000",
  "trade_id": "20260523171652123456001",
  "order_id": "ORD202605230001",
  "amount": 100,
  "actual_amount": 14.29,
  "receive_address": "TTestTronAddress001",
  "token": "USDT",
  "block_transaction_id": "0xabc123...",
  "signature": "a1b2c3d4e5f6...",
  "status": 2
}
```

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `pid` | string | 訂單所屬 API Key 的 PID。商戶應使用該 PID 查本地金鑰驗籤。 |
| `trade_id` | string | Epusdt 交易號。 |
| `order_id` | string | 商戶訂單號。 |
| `amount` | number | 商戶提交的法幣金額。 |
| `actual_amount` | number | 實際到賬的加密貨幣數量。 |
| `receive_address` | string | 收款地址。 |
| `token` | string | 收款幣種。 |
| `block_transaction_id` | string | 鏈上交易雜湊或第三方支付訂單號。 |
| `signature` | string | 回撥簽名。 |
| `status` | integer | 當前僅支付成功時回撥，值為 `2`。 |

GMPay 回撥驗籤方式與建立訂單一致，但排除 `signature` 欄位。

### EPay 相容回撥

透過 EPay 相容介面建立的訂單，會使用 GET 請求回撥 `notify_url`，引數如下：

> EPay 回撥會把 `pid` 輸出為數字；使用 EPay 相容介面或 `payment_type=Epay` 時，請確保 API Key 的 PID 是數字。

```text
pid=1000
trade_no=20260523171652123456001
out_trade_no=ORD202605230001
type=alipay
name=VIP
money=100.0000
trade_status=TRADE_SUCCESS
sign=a1b2c3d4...
sign_type=MD5
```

驗籤時排除 `sign` 和 `sign_type`，其餘非空引數按 ASCII 字典序拼接後追加 `secret_key` 並 MD5。

## OkPay 平臺回撥

`POST /payments/okpay/v1/notify`

這是 OkPay/OkayPay 平臺通知 Epusdt 的介面，不是商戶系統主動呼叫的介面。配置 OkPay 時，回撥地址應填寫該路徑。

支援 JSON、`application/x-www-form-urlencoded`、multipart form 和原始 query-string 風格 body。成功返回純文字：

```text
success
```

失敗返回 HTTP 400：

```text
fail
```

Epusdt 會按配置的 OkPay shop token 驗證 OkPay 簽名，成功後將對應 OkPay 子訂單標記為已支付，並觸發父訂單商戶回撥。

## status_code 返回狀態碼及含義

| 狀態碼 | HTTP 狀態 | 說明 |
| --- | --- | --- |
| `200` | 200 | 成功 |
| `400` | 400 | 系統錯誤，或普通引數/驗證錯誤 |
| `401` | 401 | 簽名認證錯誤 |
| `10001` | 400 | 錢包地址已存在 |
| `10002` | 400 | 支付交易已存在，請勿重複建立 |
| `10003` | 400 | 無可用錢包地址，無法發起支付 |
| `10004` | 400 | 支付金額有誤，無法滿足最小支付單位 |
| `10005` | 400 | 無可用金額通道 |
| `10006` | 400 | 匯率計算錯誤 |
| `10007` | 400 | 訂單區塊已處理 |
| `10008` | 400 | 訂單不存在 |
| `10009` | 400 | 無法解析引數 |
| `10010` | 400 | 訂單狀態已變化 |
| `10011` | 400 | 超過子訂單數量上限 |
| `10012` | 400 | 不能對子訂單切換網路 |
| `10013` | 400 | 訂單不是等待支付狀態 |
| `10014` | 400 | 鏈未啟用 |
| `10016` | 400 | 支援的資產不存在 |
| `10017` | 400 | 支付服務商未啟用 |
| `10018` | 400 | 支付服務商配置不完整 |
| `10019` | 400 | 支付服務商不支援該幣種或網路 |
