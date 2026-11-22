---
operation: okpay-notify
method: POST
route: "/payments/okpay/v1/notify"
description: "この URL を OKPay に設定します。EPUSDT はショップトークンで通知の署名を検証し、プレーンテキストで success（200）または fail（400）を返します。"
---

# OKPay 通知を受信

<ApiRoute />

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

この URL を OKPay に設定します。EPUSDT はショップトークンで通知の署名を検証し、プレーンテキストで success（200）または fail（400）を返します。

## 関連資料

- [ネットワークまたは決済事業者を選択](./switch-network)
- [加盟店への通知](../payment#callbacks)
