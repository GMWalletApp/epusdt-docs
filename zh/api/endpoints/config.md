---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "读取 supported_assets，获取当前收银台可选的网络和币种。无需提交参数或商户签名。"
---

# 获取收银台配置

<ApiRoute />

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

读取 `supported_assets`，获取当前收银台可选的网络和币种。无需提交参数或商户签名。

支持合约信息的网关可按币种符号从 `token_details` 读取完整资产标识和小数位。旧版仅返回 `tokens`。 [内置币种合约表](../../guide/intro#networks)

## 相关文档

- [创建 GMPay 订单](./create-order)
- [商户回调](../payment#callbacks)
