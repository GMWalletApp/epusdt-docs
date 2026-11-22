---
operation: checkout-return
method: GET
route: "/pay/return/{trade_id}"
description: "支払済みの EPay 注文は署名付きで加盟店サイトへ、それ以外は決済画面へ戻ります。商品提供前に非同期通知を検証してください。"
---

# 加盟店サイトに戻る

<ApiRoute />

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

支払済みの EPay 注文は署名付きで加盟店サイトへ、それ以外は決済画面へ戻ります。商品提供前に非同期通知を検証してください。

## パラメータ

`trade_id` · `string` · PATH

注文作成時に返される EPUSDT の取引 ID。

## 関連資料

- [EPay 注文を作成](./epay-order)
- [加盟店への通知](../payment#callbacks)
