---
operation: order-status
method: GET
route: "/pay/check-status/{trade_id}"
description: "EPUSDT の trade_id で決済状況を更新します。商品の提供は加盟店コールバックの署名を検証してから行います。"
---

# 注文ステータスを取得

<span class="api-route"><b>GET</b> <code>/pay/check-status/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

EPUSDT の `trade_id` で決済状況を更新します。商品の提供は加盟店コールバックの署名を検証してから行います。

## パラメータ

`trade_id` · `string` · PATH

注文作成時に返される EPUSDT の取引 ID。

## 注文ステータス

<!--@include: ../payment.md#order-states-->

## 関連資料

- [決済の詳細を取得](./checkout-details)
- [加盟店への通知](../payment#callbacks)
