---
operation: checkout-return
method: GET
route: "/pay/return/{trade_id}"
description: "已支付的 EPay 订单会携带签名参数跳回商户网站，其他订单跳回收银台。发货以验签后的异步回调为准。"
---

# 返回商户网站

<span class="api-route"><b>GET</b> <code>/pay/return/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

已支付的 EPay 订单会携带签名参数跳回商户网站，其他订单跳回收银台。发货以验签后的异步回调为准。

## 请求参数

`trade_id` · `string` · PATH

创建订单时返回的 EPUSDT 交易号。

## 相关文档

- [创建易支付订单](./epay-order)
- [商户回调](../payment#callbacks)
