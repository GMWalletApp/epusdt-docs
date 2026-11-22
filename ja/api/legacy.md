---
description: "廃止された EPUSDT API のエンドポイントと、移行先となる現行の加盟店 API を確認できます。"
---

# API の移行 {#api-migration}

現在のソースは、古いルート `POST /api/v1/order/create-transaction` を認識していません。

また、古い互換ルート `POST /payments/epusdt/v1/order/create-transaction` は認識されません。

## これらのライブルートで、古い統合を置き換えてください。 {#replace-old-integrations-with-one-of-these-live-routes}

| 用途 | 現在のエンドポイント |
| --- | --- |
| ネイティブ JSON API（推奨） | `POST /payments/gmpay/v1/order/create-transaction` |
| EPay形式のフロー | `GET/POST /payments/epay/v1/order/create-transaction/submit.php` |

## 重要な移住の変化 {#important-migration-changes}

1. すべての新規注文依頼には、`pid` を用いて取引先を明示する必要があります。
2. **署名の検証には、該当する `api_keys` レコードの `secret_key` を使用します。** 旧式のルート別グローバルキーは使用しません。
3. 管理によってサポートされているネットワーク/トークンがあるため、`/payments/gmpay/v1/config` をクエリし、`data.supported_assets` を参照して、固定されたリストを仮定するのではなく、最新の情報を確認してください。
4. EPayのデフォルト設定は、現在、管理設定 (`epay.default_token`, `epay.default_currency`, `epay.default_network`) から行われ、以前の環境変数 (`epay_pid` / `epay_key`) は廃止されました。
