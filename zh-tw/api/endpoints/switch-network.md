---
operation: switch-network
method: POST
route: "/pay/switch-network"
description: "JSON 請求本文須包含父訂單的 trade_id、token 與 network。父訂單狀態須為 1 或 4。請使用回應中的地址或託管付款連結。"
---

# 選擇網路或付款通道

<ApiRoute />

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

JSON 請求本文須包含父訂單的 `trade_id`、`token` 與 `network`。父訂單狀態須為 1 或 4。請使用回應中的地址或託管付款連結。

## JSON 請求本文

| 必填欄位 | 型別 | 範例 |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## 相關文件

- [取得收銀台設定](./config)
- [商戶回呼](../payment#callbacks)
