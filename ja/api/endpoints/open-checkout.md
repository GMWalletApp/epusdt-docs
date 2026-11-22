---
operation: open-checkout
method: GET
route: "/pay/checkout-counter/{trade_id}"
description: "決済 URL をブラウザで開くと、HTTP 301 で /cashier/{trade_id} に転送されます。"
---

# 決済画面を開く

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

決済 URL をブラウザで開くと、HTTP 301 で `/cashier/{trade_id}` に転送されます。

## パラメータ

`trade_id` · `string` · PATH

注文作成時に返される EPUSDT の取引 ID。

## 関連資料

- [決済の詳細を取得](./checkout-details)
- [加盟店への通知](../payment#callbacks)
