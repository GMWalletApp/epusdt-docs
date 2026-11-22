---
operation: checkout-details
method: GET
route: "/pay/checkout-counter-resp/{trade_id}"
description: "读取应付金额、收款地址和当前选择。此接口的 created_at 和 expiration_time 均为毫秒级 Unix 时间戳。"
---

# 读取收银台订单详情

<ApiRoute />

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

读取应付金额、收款地址和当前选择。此接口的 `created_at` 和 `expiration_time` 均为毫秒级 Unix 时间戳。

## 请求参数

`trade_id` · `string` · PATH

创建订单时返回的 EPUSDT 交易号。

## 相关文档

- [查询订单状态](./order-status)
- [商户回调](../payment#callbacks)
