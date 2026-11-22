---
operation: switch-network
method: POST
route: "/pay/switch-network"
description: "JSON 请求体必须包含父订单的 trade_id、token 和 network。父订单须处于状态 1 或 4。使用响应中的地址或托管支付链接。"
---

# 选择网络或支付通道

<span class="api-route"><b>POST</b> <code>/pay/switch-network</code></span>

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

JSON 请求体必须包含父订单的 `trade_id`、`token` 和 `network`。父订单须处于状态 1 或 4。使用响应中的地址或托管支付链接。

## JSON 请求体

| 必填字段 | 类型 | 示例 |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## 相关文档

- [获取收银台配置](./config)
- [商户回调](../payment#callbacks)
