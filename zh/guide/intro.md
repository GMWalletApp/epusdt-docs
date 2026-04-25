# 專案簡介

## 目前原始碼實際提供什麼

`Epusdt` 是一個由 **Go** 編寫的私有化 **加密支付閘道**。

當前原始碼對外提供兩條建立訂單主流程：

- **GMPay**：`POST /payments/gmpay/v1/order/create-transaction`
- **EPay 相容**：`GET /POST /payments/epay/v1/order/create-transaction/submit.php`

另外還提供：

- `/pay/*` 之下的託管收銀臺頁面
- 收銀臺切換網路：`POST /pay/switch-network`
- 可用鏈與代幣查詢：`GET /payments/gmpay/v1/supported-assets`
- `/admin/api/v1/*` 管理 API，用於管理 API Keys、鏈、代幣、錢包地址、通知通道與設定

## 商戶憑證模型

目前支付 API 不再依賴單一全域金鑰。

現在每個商戶都對應後臺建立的一條 **API key**：

- `pid`
- `secret_key`
- 可選 `ip_whitelist`
- 可選預設 `notify_url`

GMPay 與 EPay 入站請求都會先根據 `pid` 找到對應 API key，再使用該筆資料的 `secret_key` 驗籤。

## 支援的鏈與代幣

目前原始碼不再把固定的公開鏈清單直接寫死在文件層。

`/payments/gmpay/v1/supported-assets` 的回應來自實際後臺資料：

- 已啟用的 `chains`
- 已啟用的 `chain_tokens`
- 該鏈上存在可用 `wallet_address`

也就是說，真正可用的網路與代幣，取決於管理後臺目前啟用了什麼。

## 首次安裝

若首次啟動時沒有配置檔，Epusdt 會直接進入內建 **安裝嚮導**。先在瀏覽器完成資料庫、域名與初始化設定，之後再透過管理後臺或管理 API 維護執行資料。
