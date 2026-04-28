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
- `sign_type`

## EPay 預設值來源

驗籤成功後，目前原始碼會使用後臺設定補出共用訂單欄位：

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

如果你的跳轉流程需要改代幣、法幣或網路，請在後臺設定頁調整這三個值。

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

## 回撥驗證

當訂單 `payment_type = Epay` 時，worker 後續會以 EPay 風格 query 參數回撥你的 `notify_url`，並且使用**同一商戶的 `secret_key`** 來計算簽名。

不要再用舊文件裡獨立的 `epay_key` 去驗這類回撥。
