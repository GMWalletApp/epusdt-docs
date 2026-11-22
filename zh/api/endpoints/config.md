---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "读取 supported_assets，获取当前收银台可选的网络和币种。无需提交参数或商户签名。"
---

# 获取收银台配置

<span class="api-route"><b>GET</b> <code>/payments/gmpay/v1/config</code></span>

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

读取 `supported_assets`，获取当前收银台可选的网络和币种。无需提交参数或商户签名。

## 相关文档

- [创建 GMPay 订单](./create-order)
- [商户回调](../payment#callbacks)
