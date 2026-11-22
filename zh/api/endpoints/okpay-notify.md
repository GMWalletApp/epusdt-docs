---
operation: okpay-notify
method: POST
route: "/payments/okpay/v1/notify"
description: "在 OKPay 配置此通知地址。OKPay 发送已签名的通知，EPUSDT 用商店令牌验签。成功返回纯文本 success（200），失败返回 fail（400）。"
---

# 接收 OKPay 通知

<ApiRoute />

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

在 OKPay 配置此通知地址。OKPay 发送已签名的通知，EPUSDT 用商店令牌验签。成功返回纯文本 success（200），失败返回 fail（400）。

## 相关文档

- [选择网络或支付通道](./switch-network)
- [商户回调](../payment#callbacks)
