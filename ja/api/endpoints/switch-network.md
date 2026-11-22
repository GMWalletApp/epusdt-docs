---
operation: switch-network
method: POST
route: "/pay/switch-network"
description: "JSON 本文に親注文の trade_id、token、network を指定します。親注文は状態 1 または 4 が対象です。返されたアドレスまたは決済 URL を使用します。"
---

# ネットワークまたは決済事業者を選択

<ApiRoute />

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

JSON 本文に親注文の `trade_id`、`token`、`network` を指定します。親注文は状態 1 または 4 が対象です。返されたアドレスまたは決済 URL を使用します。

## JSON リクエスト本文

| 必須フィールド | 型 | 例 |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## 関連資料

- [決済設定を取得](./config)
- [加盟店への通知](../payment#callbacks)
