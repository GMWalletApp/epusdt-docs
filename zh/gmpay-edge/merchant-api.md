# 商户 API

GMPay 是主商户协议。EPay 是同一套凭证、订单服务、幂等规则、状态机、收银台、查询行为与回调流水线之上的兼容适配器。

权威字段与状态值以已部署实例的 `/docs` 页面或仓库中的 OpenAPI 合约为准：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml)。

## GMPay 签名

GMPay 请求包含数字 `pid`，以及小写 HMAC-SHA256 `signature`。

签名流程：

1. 排除 `signature` 与空值。
2. 按字段名 ASCII 顺序排序。
3. 以 `key=value` 形式用 `&` 连接。
4. 使用凭证 Secret 作为 HMAC key。
5. 计算小写 HMAC-SHA256。

## 建立订单

```text
POST /payments/gmpay/v1/order/create-transaction
```

重复提交既有 `order_id` 不会建立第二笔订单。同时省略 `token` 与 `network` 时会建立可选择支付方式的订单；GMPay Edge 不会静默默认为 TRON。

## 查询订单

```text
GET /payments/gmpay/v1/order/query
```

请提供 `trade_id` 或 `order_id` 其中之一，并使用同一凭证签名。凭证只能查询自己建立的订单。

## 接收回调

商户在建立订单时提供 `notify_url`。回调目标必须通过实例的 SSRF 与安全策略。

已投递事件带有确定性签名、保留投递尝试、执行有界重试，并提供经审计的人工重试。接收端应验证签名、幂等处理重复事件，并在本地状态提交后再确认。

GMPay 回调成功处理后，请回传 plain text `ok` 和 HTTP 200。

## EPay 兼容

EPay 兼容使用同一套凭证与订单流水线，但入站请求和兼容回调仍保持旧版 EPay MD5 边界。
