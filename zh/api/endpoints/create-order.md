---
operation: create-order
method: POST
route: "/payments/gmpay/v1/order/create-transaction"
description: "在商户服务器上签名，创建订单后引导买家打开 payment_url。token 和 network 必须同时传入，也可以同时省略，让买家在收银台选择。"
---

# 创建 GMPay 订单

<ApiRoute />

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

在商户服务器上签名，创建订单后引导买家打开 `payment_url`。`token` 和 `network` 必须同时传入，也可以同时省略，让买家在收银台选择。

## 请求参数

<!--@include: ../payment.md#create-fields-->

示例使用演示密钥 `epusdt_secret_key` 签名。更改参数或商户密钥后，请在商户服务端重新签名。

## 相关文档

- [打开收银台](./open-checkout)
- [签名规则](../payment#signing)
