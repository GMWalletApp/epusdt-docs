# 原生供應商 API

GMShop Edge 可以作為另一套 GMShop Edge 的上游數字商品供應商。原生協議在 `/api/v1/supplier/*` 下提供商品目錄、訂單、支付通道和餘額充值操作；這是商城供貨協議，不是支付閘道器 API。

## 啟用並簽發憑證

在管理設定中啟用供應商 API，然後為需要從本商城採購的使用者帳戶建立 API Key。金鑰只在簽發時顯示，並以加密形式儲存。Key 可以撤銷，也可透過 Allowed Callback Origin 限制交付回呼的目標來源。

消費端 GMShop Edge 選擇 `gmshop_edge` 供應商介面卡，並將簽發的 Key ID 和金鑰儲存到加密執行時設定中。

## 請求籤名

所有請求必須使用不帶顯式埠的 HTTPS，併發送：

- `GMShop-Edge-Api-Key`：簽發的 Key ID。
- `GMShop-Edge-Timestamp`：10 位 Unix 秒級時間戳。
- `GMShop-Edge-Nonce`：唯一的 16–100 位字母、數字或連字元。
- `GMShop-Edge-Signature`：小寫 HMAC-SHA256 十六進位制摘要。

使用換行符連線以下內容生成簽名載荷：

```text
大寫_HTTP_方法
包含原始查詢引數的路徑
UNIX_時間戳
NONCE
原始請求體的_SHA256_十六進位制摘要
```

使用簽發的 API Secret 對載荷計算 HMAC-SHA256。伺服器端只接受最多 60 秒時間偏差，並將每個 Nonce 儲存為防重放記錄；重複使用 Nonce 會返回衝突。目前限流為每個 Key 每分鐘 120 次、每個使用者每分鐘 300 次。

## 介面

- `POST /api/v1/supplier/ping`
- `GET /api/v1/supplier/categories`
- `GET /api/v1/supplier/products`
- `GET /api/v1/supplier/products/{productId}`
- `POST /api/v1/supplier/orders`
- `GET /api/v1/supplier/orders/{orderId}`
- `POST /api/v1/supplier/orders/{orderId}/cancel`
- `GET /api/v1/supplier/payment-channels`
- `POST /api/v1/supplier/topups`
- `GET /api/v1/supplier/topups/{id}`

建立訂單和充值操作具有冪等性。重試狀態不確定的請求時必須沿用同一個冪等引用，不能僅因客戶端超時就建立新的供應商訂單。

## API 文件

已部署例項的 `/openapi` 會跳轉到互動式 API 文件。倉庫同時提供完整的 [OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)，覆蓋身分驗證、使用者交付、服務商回呼、後台管理、網頁客服和原生供應商協議。
