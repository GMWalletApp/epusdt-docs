# 介面遷移說明

目前原始碼 **已不再註冊** 舊路由 `POST /api/v1/order/create-transaction`。

同時也 **沒有註冊** 舊版相容路由 `POST /payments/epusdt/v1/order/create-transaction`。

## 舊接入請改用以下任一現行路由

| 使用場景 | 當前可用路由 |
| --- | --- |
| 原生 JSON API（推薦） | `POST /payments/gmpay/v1/order/create-transaction` |
| 跳轉式 / EPay 風格流程 | `GET / POST /payments/epay/v1/order/create-transaction/submit.php` |

## 遷移時請注意

1. **所有入站訂單都必須帶 `pid` 來識別商戶。**
2. **驗籤使用對應 `api_keys` 資料列的 `secret_key`**，而不是舊文件裡的單一路由金鑰。
3. **可用鏈與代幣由後臺資料決定**，請用 `/payments/gmpay/v1/supported-assets` 取得實際可用組合。
4. **EPay 預設值** 目前來自後臺設定 `epay.default_token` / `epay.default_currency` / `epay.default_network`，不是舊的 `epay_pid` / `epay_key` 類 env 配置。
