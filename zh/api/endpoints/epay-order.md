---
operation: epay-order
method: GET/POST
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "通过 GET 查询串或 POST 表单提交已签名参数。MD5 签名校验通过并成功创建订单后，网关通过 HTTP 302 跳转至收银台。"
---

# 创建易支付订单

<span class="api-route"><b>GET/POST</b> <code>/payments/epay/v1/order/create-transaction/submit.php</code></span>

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

通过 GET 查询串或 POST 表单提交已签名参数。MD5 签名校验通过并成功创建订单后，网关通过 HTTP 302 跳转至收银台。

## 请求参数

<!--@include: ../payment.md#epay-fields-->

示例使用演示密钥 `epusdt_secret_key` 签名。更改参数或商户密钥后，请在商户服务端重新签名。

## 相关文档

- [返回商户网站](./checkout-return)
- [签名规则](../payment#signing)
