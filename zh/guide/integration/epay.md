# EPay 相容接入（跳轉式）

只有當你的上游系統明確依賴 EPay 風格跳轉建單時，才建議使用這條流程。

## 路由

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 商戶憑證要求

入站請求 **不是** 用舊的 `epay_pid` / `epay_key` env 配置來驗證。

目前原始碼的實際流程是：

1. 讀取請求中的 `pid`
2. 在 `api_keys` 裡找到對應且已啟用的資料列
3. 使用該筆資料的 `secret_key` 驗證 `sign`
4. 視需要再檢查 IP 白名單

## 主要入站欄位

必填：

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

常見可選欄位：

- `return_url`
- `name`
- `type`
- `token`
- `network`
- `currency`
- `sign_type`

`type` 現在支援兩種形式：

- `alipay`：相容值；實際 token/network 會依序從請求中的 `token` + `network`、後臺 EPay 預設值解析。
- `token.network` 選擇器，例如 `usdt.tron`：只有當該 token/network 組合目前可用時才接受。有效選擇器會覆蓋 `token`、`network`、`epay.default_token` 和 `epay.default_network`。

其他非空 `type` 會被視為參數錯誤。通過校驗的 `type` 會保存到訂單，後續 EPay 同步返回和非同步回撥會沿用。

## EPay 預設值來源

驗籤成功後，目前原始碼會使用後臺設定補出共用訂單欄位：

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

EPay submit.php 的解析優先級是：

1. 有效的 `type=token.network` 選擇器
2. 請求中顯式傳入的 `token` / `network`
3. 後臺 `epay.default_token` / `epay.default_network`
4. 如果 token 和 network 最終仍同時為空，建立狀態 `4` 的占位訂單，由收銀臺引導使用者選擇

法幣幣種獨立解析：請求 `currency` → `epay.default_currency` → `cny`。

## 成功後行為

建立訂單成功後，瀏覽器會被跳轉到：

```text
/pay/checkout-counter/{trade_id}
```

在目前原始碼中，這條路徑現在作為託管收銀臺 SPA 的跳轉入口；收銀臺頁面資料則由：

```text
/pay/checkout-counter-resp/{trade_id}
```

提供。


## 直接指定鏈和幣種

上游「New API」或自訂支付方式列表可以把不同鏈 / 幣種拆成獨立支付選項，並把 `type` 設為有效的 `token.network` 選擇器。例如 `usdt.tron` 會直接建立 TRON USDT 訂單；如果 Binance/BSC 的 USDT 已啟用，`usdt.binance` 會直接建立對應訂單。

示例支付方式配置：

```json
[
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay", "type": "custom1" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.binance", "type": "usdt.binance" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.tron", "type": "usdt.tron" }
]
```

`custom1` 只是上游的通用支付選項名稱，不是 Epusdt 的鏈上選擇器。不要把 `custom1` 原樣提交到 EPay submit.php；通用入口應改為不傳 `type`、傳 `type=alipay`，或走普通 GMPay 占位訂單流程。

## 回撥驗證

當訂單 `payment_type = Epay` 時，worker 後續會以 EPay 風格 query 參數回撥你的 `notify_url`，並且使用**同一商戶的 `secret_key`** 來計算簽名。

回撥中的 `type` 會沿用訂單保存的請求類型，也就是 `alipay` 或已接受的 `usdt.tron` 這類選擇器；如果建單時沒有傳 `type`，出站回撥會為相容性回退到 `alipay`。

不要再用舊文件裡獨立的 `epay_key` 去驗這類回撥。
