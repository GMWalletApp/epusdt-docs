---
description: "GMPay Edge の商取引認証、HMAC 依頼の署名、および注文の通知、または EPay 互換アダプターを使用してください。"
titleTemplate: ":title | GMPay Edge"
---

# 加盟店 API {#merchant-api}

GMPayは主要な決済プロトコルです。EPayは、同じ認証情報、注文サービス、冪等性ルール、状態遷移、チェックアウト、クエリ動作、およびコールバックパイプラインとの互換性を実現するためのアダプターです。

権威のあるフィールドやステータス値については、デプロイされたインスタンスの`/docs`ページ、またはリポジトリの追跡されたOpenAPI仕様を使用してください：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml).

## GMPay の署名 {#gmpay-signatures}

GMPay リクエストには数値の `pid` と、小文字の16進数で表した HMAC-SHA256 の `signature` を含めます。

申請を承認するために

1. `signature` と空の値を除外します。
2. ASCII順でフィールドを並べます。
3. `key=value` の各組を `&` で連結します。
4. 「秘密のクレデンシャルをHMACキーとして使用してください。」
5. 小文字で HMAC-SHA256 を計算する。

## 秩序を築く {#create-order}

```text
POST /payments/gmpay/v1/order/create-transaction
```

既存の `order_id` を再利用しても、別の注文は作成されません。`token` と `network` の両方を省略すると、選択可能な注文が作成されます。GMPay Edge は、黙って TRON にデフォルトしないように設計されています。

## クエリ順 {#query-order}

```text
GET /payments/gmpay/v1/order/query
```

`trade_id` と `order_id` のどちらか一方だけを指定し、注文を作成した認証情報でリクエストに署名します。照会できるのは、その認証情報で作成した注文だけです。

## 折り返し連絡を受ける {#receive-callbacks}

注文を作成する際に、商人（またはシステム）は `notify_url` を提供します。コールバック先は、SSRF（ステートフル反射型分散型サービス攻撃）対策とセキュリティポリシーを確認する必要があります。

手動で実施されたイベントは、一貫性のあるパターン、保存された試行、制限された再試行、および監査された手動再試行パスを持っています。ハンドラは、パターンを検証し、重複するイベントを同一性を持って処理し、ローカルの状態をコミットした後のみ、確認を行う必要があります。

GMPay のリクエストに対する応答として、処理が成功した場合、シンプルなテキスト形式の "`ok`" と HTTP 200 ステータスコードを返してください。

## EPayとの互換性 {#epay-compatibility}

EPayとの互換性では、同じ認証情報と注文パイプラインを使用しますが、受信リクエストと互換性のあるコールバックについては、従来のEPayのMD5境界を使用します。
