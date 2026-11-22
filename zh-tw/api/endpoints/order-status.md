---
operation: order-status
method: GET
route: "/pay/check-status/{trade_id}"
description: "使用 EPUSDT 的 trade_id 輪詢並更新收銀台。商戶應在非同步回呼驗章成功後出貨。"
---

# 查詢訂單狀態

<span class="api-route"><b>GET</b> <code>/pay/check-status/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

使用 EPUSDT 的 `trade_id` 輪詢並更新收銀台。商戶應在非同步回呼驗章成功後出貨。

## 請求參數

`trade_id` · `string` · PATH

建立訂單時回傳的 EPUSDT 交易編號。

## 訂單狀態

<!--@include: ../payment.md#order-states-->

## 相關文件

- [讀取收銀台訂單明細](./checkout-details)
- [商戶回呼](../payment#callbacks)
