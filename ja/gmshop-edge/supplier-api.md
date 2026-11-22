---
description: "ネイティブサプライヤーAPIを通じて、GMShop Edgeの店舗を接続し、署名されたカタログ、注文、および支払いチャネルの要求を処理します。"
titleTemplate: ":title | GMShop Edge"
---

# サプライヤー API {#native-supplier-api}

GMShop Edgeは、別のGMShop Edgeインスタンスに対し、デジタル商品のアップストリームサプライヤーとして機能します。ネイティブなプロトコルは、`/api/v1/supplier/*` 以下の、カタログ、注文、決済チャネル、ウォレットのチャージといった操作を公開しています。これは、決済ゲートウェイAPIではなく、ストアフロント向けのサプライプロトコルです。

## 認証機能を有効にし、認証情報を発行する。 {#enable-and-issue-credentials}

サプライヤーAPIを管理設定で有効にし、このストアから購入する顧客アカウントに対してAPIキーを作成してください。APIキーは発行時にのみ表示され、暗号化して保存されます。キーは無効化でき、履行に関するコールバックが送信される場所を制限するために、オプションで許可されるコールバックオリジンを設定できます。

GMShop Edge の高度なインスタンスは、`gmshop_edge` 供給者アダプターを選択し、発行されたキーIDと秘密鍵を、暗号化された実行時設定に保存します。

## 署名依頼 {#request-signing}

すべてのリクエストは、ポート番号を明示せずにHTTPSを使用し、以下の内容を送信する必要があります。

- `GMShop-Edge-Api-Key`：発行されたキーID。
- `GMShop-Edge-Timestamp`: 秒単位の10桁の Unix タイムスタンプ。
- `GMShop-Edge-Nonce`：16～100文字のアルファベットとハイフンで構成される、固有の識別コード。
- `GMShop-Edge-Signature`: HMAC-SHA256 のダイジェストを小文字の16進数で表したもの。

これらの値を改行文字で結合して、署名用のペイロードを作成してください。

```text
UPPERCASE_HTTP_METHOD
PATH_WITH_RAW_QUERY
UNIX_TIMESTAMP
NONCE
SHA256_HEX_OF_RAW_BODY
```

発行されたAPIシークレットを使って、そのペイロードに対して HMAC-SHA256 を計算します。サーバーは、最大60秒のタイムスタンプのずれを受け入れ、各ノンストを再利用記録として保存します。ノンストの再利用はエラーを返します。現在のレート制限は、キーあたり1分あたり120リクエスト、ユーザーあたり1分あたり300リクエストです。

## エンドポイント一覧 {#endpoints}

| 操作 | HTTP | パス |
| --- | --- | --- |
| 認証情報を確認 | POST | `/api/v1/supplier/ping` |
| カテゴリ一覧 | GET | `/api/v1/supplier/categories` |
| 商品一覧 | GET | `/api/v1/supplier/products` |
| 商品詳細 | GET | `/api/v1/supplier/products/{productId}` |
| 仕入れ注文を作成 | POST | `/api/v1/supplier/orders` |
| 仕入れ注文を取得 | GET | `/api/v1/supplier/orders/{orderId}` |
| 仕入れ注文をキャンセル | POST | `/api/v1/supplier/orders/{orderId}/cancel` |
| 決済チャネル一覧 | GET | `/api/v1/supplier/payment-channels` |
| チャージを申請 | POST | `/api/v1/supplier/topups` |
| チャージ状況を取得 | GET | `/api/v1/supplier/topups/{id}` |

注文の作成および残高の補充は、同一性を持ちます。 不確実なリクエストを再試行する場合、同一性を維持してください。 クライアントがタイムアウトした場合、単に新しいサプライヤーの注文を作成することは避けてください。

## API 参照 {#api-reference}

展開されたインスタンスは、`/openapi` を、そのインタラクティブなAPIリファレンスにリダイレクトします。このリポジトリは、認証、顧客対応、プロバイダからの応答、管理、Webサポート、およびネイティブサプライヤープロトコルを含む、完全な[OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml) も公開しています。
