---
operation: submit-hash
method: POST
route: "/pay/submit-tx-hash/{trade_id}"
description: "在 JSON 请求体中提交 block_transaction_id。仅限等待付款的链上订单（状态 1），服务端核验转账后更新订单。"
---

# 提交交易哈希

<ApiRoute />

<a class="api-example-jump" href="#request-example">请求示例 ↓</a>

在 JSON 请求体中提交 `block_transaction_id`。仅限等待付款的链上订单（状态 1），服务端核验转账后更新订单。

## 请求参数

`trade_id` · `string` · PATH

创建订单时返回的 EPUSDT 交易号。

## JSON 请求体

| 必填字段 | 类型 | 示例 |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## 相关文档

- [查询订单状态](./order-status)
- [商户回调](../payment#callbacks)
