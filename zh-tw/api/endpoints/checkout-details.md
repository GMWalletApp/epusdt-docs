---
operation: checkout-details
method: GET
route: "/pay/checkout-counter-resp/{trade_id}"
description: "讀取應付金額、收款地址與目前選項。此介面的 created_at 與 expiration_time 均為毫秒級 Unix 時間戳。"
---

# 讀取收銀台訂單明細

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter-resp/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

讀取應付金額、收款地址與目前選項。此介面的 `created_at` 與 `expiration_time` 均為毫秒級 Unix 時間戳。

## 請求參數

`trade_id` · `string` · PATH

建立訂單時回傳的 EPUSDT 交易編號。

## 相關文件

- [查詢訂單狀態](./order-status)
- [商戶回呼](../payment#callbacks)
