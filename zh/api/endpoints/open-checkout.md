---
operation: open-checkout
method: GET
route: "/pay/checkout-counter/{trade_id}"
description: "在浏览器打开订单的支付链接。EPUSDT 通过 HTTP 301 将买家引导至 /cashier/{trade_id}。"
---

# 打开收银台

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

在浏览器打开订单的支付链接。EPUSDT 通过 HTTP 301 将买家引导至 `/cashier/{trade_id}`。

## 请求参数

`trade_id` · `string` · PATH

创建订单时返回的 EPUSDT 交易号。

## 相关文档

- [读取收银台订单详情](./checkout-details)
- [商户回调](../payment#callbacks)
