---
operation: checkout-return
method: GET
route: "/pay/return/{trade_id}"
description: "已付款的 EPay 訂單會攜帶簽章參數跳回商戶網站，其他訂單返回收銀台。請依驗章後的非同步回呼出貨。"
---

# 返回商戶網站

<ApiRoute />

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

已付款的 EPay 訂單會攜帶簽章參數跳回商戶網站，其他訂單返回收銀台。請依驗章後的非同步回呼出貨。

## 請求參數

`trade_id` · `string` · PATH

建立訂單時回傳的 EPUSDT 交易編號。

## 相關文件

- [建立易支付訂單](./epay-order)
- [商戶回呼](../payment#callbacks)
