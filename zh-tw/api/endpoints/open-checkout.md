---
operation: open-checkout
method: GET
route: "/pay/checkout-counter/{trade_id}"
description: "在瀏覽器開啟訂單的付款連結。EPUSDT 透過 HTTP 301 將買家導向 /cashier/{trade_id}。"
---

# 開啟收銀台

<ApiRoute />

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

在瀏覽器開啟訂單的付款連結。EPUSDT 透過 HTTP 301 將買家導向 `/cashier/{trade_id}`。

## 請求參數

`trade_id` · `string` · PATH

建立訂單時回傳的 EPUSDT 交易編號。

## 相關文件

- [讀取收銀台訂單明細](./checkout-details)
- [商戶回呼](../payment#callbacks)
