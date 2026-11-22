---
operation: submit-hash
method: POST
route: "/pay/submit-tx-hash/{trade_id}"
description: "支払い待ち（状態 1）のオンチェーン注文について、JSON 本文に block_transaction_id を指定します。サーバーは送金を検証してから注文を更新します。"
---

# 取引ハッシュを送信

<span class="api-route"><b>POST</b> <code>/pay/submit-tx-hash/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

支払い待ち（状態 1）のオンチェーン注文について、JSON 本文に `block_transaction_id` を指定します。サーバーは送金を検証してから注文を更新します。

## パラメータ

`trade_id` · `string` · PATH

注文作成時に返される EPUSDT の取引 ID。

## JSON リクエスト本文

| 必須フィールド | 型 | 例 |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## 関連資料

- [注文ステータスを取得](./order-status)
- [加盟店への通知](../payment#callbacks)
