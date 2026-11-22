---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "supported_assets から利用可能なネットワークとトークンを取得します。パラメータや加盟店署名は不要です。"
---

# 決済設定を取得

<ApiRoute />

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

`supported_assets` から利用可能なネットワークとトークンを取得します。パラメータや加盟店署名は不要です。

対応バージョンでは、`token_details` をシンボルで引くと資産 ID と小数桁数を確認できます。旧版は `tokens` のみを返します。 [収録済みのコントラクト一覧](../../guide/intro#networks)

## 関連資料

- [GMPay 注文を作成](./create-order)
- [加盟店への通知](../payment#callbacks)
