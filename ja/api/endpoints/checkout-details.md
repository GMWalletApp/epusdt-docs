---
operation: checkout-details
method: GET
route: "/pay/checkout-counter-resp/{trade_id}"
description: "支払額、受取アドレス、現在の選択を取得します。created_at と expiration_time はミリ秒単位の Unix 時刻です。"
---

# 決済の詳細を取得

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter-resp/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

支払額、受取アドレス、現在の選択を取得します。`created_at` と `expiration_time` はミリ秒単位の Unix 時刻です。

## パラメータ

`trade_id` · `string` · PATH

注文作成時に返される EPUSDT の取引 ID。

## 関連資料

- [注文ステータスを取得](./order-status)
- [加盟店への通知](../payment#callbacks)
