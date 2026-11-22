---
operation: submit-hash
method: POST
route: "/pay/submit-tx-hash/{trade_id}"
description: "在 JSON 請求本文提交 block_transaction_id。僅限等待付款的鏈上訂單（狀態 1），伺服器核驗轉帳後才更新訂單。"
---

# 提交交易雜湊

<span class="api-route"><b>POST</b> <code>/pay/submit-tx-hash/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

在 JSON 請求本文提交 `block_transaction_id`。僅限等待付款的鏈上訂單（狀態 1），伺服器核驗轉帳後才更新訂單。

## 請求參數

`trade_id` · `string` · PATH

建立訂單時回傳的 EPUSDT 交易編號。

## JSON 請求本文

| 必填欄位 | 型別 | 範例 |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## 相關文件

- [查詢訂單狀態](./order-status)
- [商戶回呼](../payment#callbacks)
