# 原生供应商 API

GMShop Edge 可以作为另一套 GMShop Edge 的上游数字商品供应商。原生协议在 `/api/v1/supplier/*` 下提供商品目录、订单、支付通道和余额充值操作；这是商城供货协议，不是支付网关 API。

## 启用并签发凭据

在管理设置中启用供应商 API，然后为需要从本商城采购的用户账户创建 API Key。密钥只在签发时显示，并以加密形式保存。Key 可以撤销，也可通过 Allowed Callback Origin 限制交付回调的目标来源。

消费端 GMShop Edge 选择 `gmshop_edge` 供应商适配器，并将签发的 Key ID 和密钥保存到加密运行时配置中。

## 请求签名

所有请求必须使用不带显式端口的 HTTPS，并发送：

- `GMShop-Edge-Api-Key`：签发的 Key ID。
- `GMShop-Edge-Timestamp`：10 位 Unix 秒级时间戳。
- `GMShop-Edge-Nonce`：唯一的 16–100 位字母、数字或连字符。
- `GMShop-Edge-Signature`：小写 HMAC-SHA256 十六进制摘要。

使用换行符连接以下内容生成签名载荷：

```text
大写_HTTP_方法
包含原始查询参数的路径
UNIX_时间戳
NONCE
原始请求体的_SHA256_十六进制摘要
```

使用签发的 API Secret 对载荷计算 HMAC-SHA256。服务端只接受最多 60 秒时间偏差，并将每个 Nonce 保存为防重放记录；重复使用 Nonce 会返回冲突。当前限流为每个 Key 每分钟 120 次、每个用户每分钟 300 次。

## 接口

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

创建订单和充值操作具有幂等性。重试状态不确定的请求时必须沿用同一个幂等引用，不能仅因客户端超时就创建新的供应商订单。

## API 文档

已部署实例的 `/openapi` 会跳转到交互式 API 文档。仓库同时提供完整的 [OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)，覆盖身份验证、用户交付、服务商回调、后台管理、网页客服和原生供应商协议。
