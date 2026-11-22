---
operation: order-status
method: GET
route: "/pay/check-status/{trade_id}"
description: "使用 EPUSDT 的 trade_id 轮询并更新收银台。商户应在异步回调验签成功后发货。"
---

# 查询订单状态

<ApiRoute />

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

使用 EPUSDT 的 `trade_id` 轮询并更新收银台。商户应在异步回调验签成功后发货。

## 请求参数

`trade_id` · `string` · PATH

创建订单时返回的 EPUSDT 交易号。

## 订单状态

<!--@include: ../payment.md#order-states-->

## 相关文档

- [读取收银台订单详情](./checkout-details)
- [商户回调](../payment#callbacks)
