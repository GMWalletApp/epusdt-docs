---
description: "EPUSDT GMPay の注文エンドポイントを統合し、商人のリクエストに署名し、ゲートウェイから返されるチェックアウトURLに買い手（ユーザー）をリダイレクトする。"
---

# GMPay による連携（推奨） {#gmpay-integration-recommended}

新しい連携には、GMPay を利用してください。

## エンドポイント {#route}

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 商人の資格要件 {#merchant-credential-requirement}

API を呼び出す前に、管理画面で API キーを作成するか、既存のキーを確認します。

必要なものは：

- `pid`
- `secret_key`

`pid` をリクエストに含め、`secret_key` を署名鍵として使います。

## 最小のリクエストボディ {#minimal-request-body}

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "signature": "hmac-sha256-hex(...)"
}
```

## 署名規則 {#signature-rule}

> `v2.0.0` 以降、GMPay は MD5 の代わりに HMAC-SHA256 を使用します。v2 の導入前に、クライアントをアップグレードしてください。そうしないと、`401 Unauthorized` エラーが発生します。EPay と互換性のあるリクエストには影響しません。

1. `signature` 以外の空でないフィールドをすべて残します
2. キー名を ASCII 順に並べます
3. `key=value&...` の形式で連結します
4. 加盟店の `secret_key` を HMAC 鍵として HMAC-SHA256 を計算します
5. 64 桁の小文字の 16 進数で表したダイジェストを `signature` に設定します

## 役立つルート {#useful-companion-routes}

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

クライアントが動的なネットワーク/トークンオプションが必要な場合、`/payments/gmpay/v1/config` のレスポンスから `data.supported_assets` に記載されているオプションを参照してください。

`data.site` はブランド情報、`data.epay`、`data.okpay` および `data.xlayer` は決済設定について参照してください。

## コールバックの検証 {#callback-verification}

GMPay の応答は、JSON 形式の `POST` リクエストとして `notify_url` に送信されます。

HMAC-SHA256 署名を検証し、支払い済みの注文と照合します。同じ通知を再受信しても二重処理が起きないようにしてください。受理後は HTTP 200 とプレーンテキストの `ok` または `success` を返します。大文字と小文字は区別されません。

## 成功時のメッセージ {#success-response-note}

現在のソースには、成功した注文作成の応答に `payment_url` が含まれているため、呼び出し元は、URLを手動で再構築する代わりに、明示的なホストされたチェックアウトの転送先を持つことができます。
