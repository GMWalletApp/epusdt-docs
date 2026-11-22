---
description: "GMPay の注文を作成し、その支払い状況を確認し、EPUSDT のリクエストを検証します。商取引のパラメータ、署名ルール、および例を含みます。"
title: "商用決済API、署名とコールバック"
---

# 加盟店 API {#merchant-api}

公開設定のエンドポイントを使用して支払いオプションを特定し、サーバー上で注文を作成し、購入者を有料決済URLに転送してください。注文の実行前に、署名された通知を検証してください。 [Python 注文例](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/sdk/python/gmpay_create_order.py) · [OpenAPI 仕様](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/docs/swagger.json)

[リクエストの申請を完了する](#signing) · [GMPay の注文を作成する](#create) · [投票の状況を確認する](#status) · [商人からの応答を確認する](#callbacks)

## エンドポイント一覧 {#endpoints}

| 用途 | メソッド | パス | 認証 |
| --- | --- | --- | --- |
| [GMPay 注文を作成](/ja/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | 加盟店の HMAC-SHA256 署名 |
| [決済設定を取得](/ja/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | 公開 |
| [決済画面を開く](/ja/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | 公開 |
| [決済の詳細を取得](/ja/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | 公開 |
| [注文ステータスを取得](/ja/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | 公開 |
| [ネットワークまたは決済事業者を選択](/ja/api/endpoints/switch-network) | POST | `/pay/switch-network` | 公開 |
| [取引ハッシュを送信](/ja/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | 公開 |
| [加盟店サイトに戻る](/ja/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | ブラウザのリダイレクト |
| [EPay 注文を作成](/ja/api/endpoints/epay-order) | GET または POST | `/payments/epay/v1/order/create-transaction/submit.php` | 加盟店の MD5 署名 |
| [OKPay 通知を受信](/ja/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | OKPay の署名 |

## レスポンス形式 {#response-format}

JSON エンドポイントは、`status_code` (成功時は 200)、`message`、`data` (オブジェクトまたは null)、およびサーバーが生成した `request_id` を返します。 無効な署名は HTTP 401 を返します。 ビジネスエラーは、通常 HTTP 400 を返し、アプリケーションエラーコードを伴います。

```json
{
  "status_code": 200,
  "message": "success",
  "data": {},
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<a id="signing"></a>

## リクエストに署名する {#sign-a-request}

リクエストの `pid` に関連付けられた商人のキーを使用します。新しいインストールでは、PID `1000` のデフォルトの商人が設定されます。秘密情報を商人のサーバーに保持してください。

GMPayは、HMAC-SHA256を使用します。`signature`、空の文字列、および null 以外の値を削除してください。残りの、大文字・小文字を区別するフィールド名を、ASCII 順に昇順にソートします。unescaped の `key=value` ペアを `&` で結合し、`secret_key` を HMAC キーとして、ダイジェストを 64 桁の小文字の 16 進数でエンコードします。`pid` と、いずれかの非空の `payment_type` を含めます。JSON の場合、サーバーは `100.00` のような数値 (`100`) を読み取ります。フォームエンコーディングを使用すると、元の文字列の形式を提供できます。

例示のフィールド、標準的な文字列、およびデモンストレーションキー `epusdt_secret_key` を使用。

```text
pid=1000
order_id=ORD202605230001
currency=cny
token=usdt
network=tron
amount=100
notify_url=https://merchant.example/notify
redirect_url=https://merchant.example/return
name=VIP
```

```text
amount=100&currency=cny&name=VIP&network=tron&notify_url=https://merchant.example/notify&order_id=ORD202605230001&pid=1000&redirect_url=https://merchant.example/return&token=usdt
```

```text
signature=6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d
```

### PHPの例 {#php-examples}

GMPay:

```php
function gmpaySign(array $params, string $secretKey): string
{
    unset($params['signature']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return hash_hmac('sha256', implode('&', $pairs), $secretKey);
}
```

EPayは、`sign`と`sign_type`を除外し、標準的な文字列に商人の秘密鍵を追加し、MD5を使用します。

```php
function epaySign(array $params, string $secretKey): string
{
    unset($params['sign'], $params['sign_type']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

<a id="create"></a>

## GMPay の注文を作成 {#create-a-gmpay-order}

`POST /payments/gmpay/v1/order/create-transaction` は、JSON および `application/x-www-form-urlencoded` を受け付けます。

```json
{
  "pid": "1000",
  "order_id": "ORD202605230001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example/notify",
  "redirect_url": "https://merchant.example/return",
  "name": "VIP",
  "signature": "6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d"
}
```

<!-- #region create-fields -->

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `pid` | 文字列 | はい | 商人のPIDは、以前は署名鍵を検索するために使用されていました。 |
| `order_id` | 文字列 | はい | 固有の商用注文ID。32文字以内でお願いします。 |
| `currency` | 文字列 | はい | 法定通貨。例: `usd`、`cny`。 |
| `token` | 文字列 | 条件付き | 受取資産。ネットワークとペアリングするか、または両方を省略します。 |
| `network` | 文字列 | 条件付き | 公開設定からのネットワークID、例えば`binance`。 |
| `amount` | 数値 | はい | 0.01を超える金額。 |
| `notify_url` | 文字列 | はい | 非同期実行時の成功コールバックURL。 |
| `redirect_url` | 文字列 | いいえ | ブラウザの戻るURL。 |
| `name` | 文字列 | いいえ | 製品名 または 注文名 |
| `payment_type` | 文字列 | いいえ | GMPay がデフォルトです。EPay (大文字・小文字区別なし) は、EPay のコールバック形式を選択し、数値の PID を必要とします。署名には、空でない値を含める必要があります。 |
| `signature` | 文字列 | はい | 64文字の小文字の HMAC-SHA256署名。 |

<!-- #endregion create-fields -->

`token` と `network` の両方を渡すことで、すぐにアドレスを割り当てられます。両方を省略すると、(ステータス 4) で金額と通貨を含むプレースホルダーを作成します。どちらか一方だけ渡すことは無効です。ペアを選択する前に、`data.supported_assets` を公開設定で確認してください。

### レスポンス {#response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "order_id": "ORD202605230001",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.29,
    "receive_address": "TTestTronAddress001",
    "token": "USDT",
    "status": 1,
    "expiration_time": 1779530812,
    "payment_url": "https://pay.example.com/pay/checkout-counter/20260523171652123456001"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

| フィールド | 型 | 意味 |
| --- | --- | --- |
| `trade_id` | 文字列 | EPUSDT 取引ID |
| `order_id` | 文字列 | 加盟店側の注文 ID。 |
| `amount` | 数値 | 提出された金額（フィアット）。 |
| `currency` | 文字列 | 貨幣（かべい） |
| `actual_amount` | 数値 | 支払う暗号資産の数量。 |
| `receive_address` | 文字列 | お届け先住所 |
| `token` | 文字列 | アセット記号 |
| `status` | 整数 | 注文状況。4は「選択待ち」の状態です。 |
| `expiration_time` | 整数 | Unixタイムスタンプ（秒）での有効期限。 |
| `payment_url` | 文字列 | ブラウザで開くURL |

プレースホルダーは、住所やトークンを持たず、`actual_amount` は 0 です。有効期限や手動による終了により、支払い予約を解放することなく、ステータス 3 に移行します。チェックアウトの選択が、住所またはホスト URL を決定します。

## 公開チェックアウト設定 {#public-checkout-configuration}

`GET /payments/gmpay/v1/config` は、チェックアウトのブランド、オンチェーンで利用可能な資産、EPay のデフォルト設定、および公開されている `okpay` と `xlayer` プロバイダーの設定を返します。`supported_assets` の各項目には、有効なチェーン、利用可能な受信アドレス、および支払い用の設定されたトークンが必要です。ホストされたメソッドは、それぞれ自身の `enabled` フラグと `allow_tokens` リストを公開します。

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "supported_assets": [
      {
        "network": "tron",
        "display_name": "TRON",
        "tokens": ["TRX", "USDT"]
      },
      {
        "network": "solana",
        "display_name": "Solana",
        "tokens": ["SOL", "USDC", "USDT"]
      }
    ],
    "site": {
      "cashier_name": "Acme Cashier",
      "logo_url": "https://cdn.example.com/logo.png",
      "website_title": "Acme Payments",
      "support_link": "https://example.com/support",
      "background_color": "#0f172a",
      "background_image_url": "https://cdn.example.com/background.png",
      "withdrawal_reminder_enabled": true
    },
    "epay": {
      "default_token": "",
      "default_currency": "cny",
      "default_network": ""
    },
    "okpay": {
      "enabled": false,
      "allow_tokens": ["USDT", "TRX"]
    },
    "xlayer": {
      "enabled": false,
      "allow_tokens": ["USDC", "USDT0", "USDG"]
    },
    "version": "v2.1.0"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### 取引所からの出金に関する注意表示 {#exchange-withdrawal-reminder}

設定を読み込んだ後、`site.withdrawal_reminder_enabled` が true の場合にのみリマインダーを表示します。オンチェーンの注文が支払い待ち、受取アドレスが利用可能、かつ `actual_amount > 0` が 0 より大きい場合に適用されます。古いバージョンのフラグがない場合、true として扱います。取引手数料後の**期待される総受取額**を、注文と同じ精度とトークンで表示します。 [ライトプレビュー](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-light.png) · [ダークプレビュー](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-dark.png)

管理者が `GET /admin/api/v1/settings?group=brand` を実行します。`brand.withdrawal_reminder_enabled` の保存された値は、文字列の `"true"` または `"false"` です。変更するには、以下の認証された `PUT /admin/api/v1/settings` リクエストを送信してください。返されたアイテムの `ok` フラグを確認し、チェックアウトを再開してください。

```json
{"items":[{"group":"brand","key":"brand.withdrawal_reminder_enabled","type":"bool","value":false}]}
```

## チェックアウト画面を開いて、注文内容を確認してください。 {#open-checkout-and-read-the-order}

作成時に返される `payment_url` は、`GET /pay/checkout-counter/{trade_id}` を指します。ブラウザで開くと、301リダイレクトで以下のURLに移動します。

```text
/cashier/{trade_id}
```

画面に表示する詳細は `GET /pay/checkout-counter-resp/{trade_id}` で取得します。このレスポンスの `created_at` と `expiration_time` の単位は **ミリ秒** です。その後の変更はステータス用エンドポイントを定期的に照会してください。

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 14.29,
    "token": "USDT",
    "currency": "CNY",
    "receive_address": "TTestTronAddress001",
    "network": "tron",
    "status": 1,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

同じ親IDをプレースホルダーとして、オンチェーンのフィールドは空で返されます。GMPayまたはEPayが、この状態を作り出すことができます。

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 0,
    "token": "",
    "currency": "CNY",
    "receive_address": "",
    "network": "",
    "status": 4,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

チェックアウトは `payment_type` を小文字で返します（`gmpay` または `epay`）。これは、商事側のコールバック形式を選択します。OKX OnchainOS の Xレイヤーでは、サーバーから返されたホストされたURLを開きます。EPUSDTは、取引所の決済された注文を確認してから、残高を反映します。

<a id="status"></a>

## ステータスのポーリング {#poll-status}

`GET /pay/check-status/{trade_id}`

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "status": 1
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<!-- #region order-states -->

| ステータス | 意味 |
| --- | --- |
| 1 | 支払い待ち |
| 2 | 支払い済み |
| 3 | 期限切れ |
| 4 | ネットワーク、資産、またはプロバイダーの選定を待っています。 |
| 5 | マッチングが確認されました。 |
| 6 | 二回の厳格な確認が失敗しました。手動での確認が必要です。 |

<!-- #endregion order-states -->

ステータス5では、継続的に確認状況を通知し、「確認中」と表示することで、購入者が取引が確認されたことを認識できるようにします。通常、EPUSDTは必要な確認深度をチェックし、2つの独立したノードで取引を検証してから資金を反映します。確認深度を待つことは、試行回数を消費しません。検証の試行と、最初のノードIDは再起動しても保持されます。ステータス6では、自動検証と成功時の通知が停止します。管理者は`review_transaction_hash`を調査し、調査後に取引を再確認できます。

購入者から提供されたハッシュの場合、`block_transaction_id` を `POST /pay/submit-tx-hash/{trade_id}` に送信してください。サーバーはトランザクションの転送を確認します。 転送完了後に、`GET /pay/return/{trade_id}` 経由でリダイレクト (HTTP 302) を返送します。

## 現金受取り取引ハッシュを送信してください。 {#submit-cashier-transaction-hash}

`POST /pay/submit-tx-hash/{trade_id}`

このエンドポイントは、ホストされたレジストが、手動での検証のために、オンチェーンのトランザクションハッシュを送信することを可能にします。これは、管理者による支払いアクションと比較して、より限定された機能です。

- この注文は、オンチェーンでの注文である必要があります。
- 注文は引き続き `status=1` で、支払い待ちの状態です。
- 重複注文は、チェーン検証の前に拒否されます。
- OkPay/プロバイダの注文はサポートされていません。

### トランザクションハッシュリクエストを送信 {#submit-transaction-hash-request}

```json
{
  "block_transaction_id": "0xabc123..."
}
```

### トランザクションハッシュの処理成功応答 {#submit-transaction-hash-success-response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "block_transaction_id": "0xabc123...",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

TON では、標準形式の `ton:<receive_raw>:<lt>:<hash>`、`lt:hash`、または注文の受取アドレスについて直近の取引を一意に識別できるハッシュ単体を指定できます。Aptos ではトランザクションハッシュを指定します。

## 支払いネットワークまたはプロバイダー {#switch-payment-network-or-provider}

`POST /pay/switch-network` エンドポイントは、親の `trade_id`、ターゲットの `token`、および `network` を受け取ります。ホストされたチェックアウトの場合、提供元の許可された `okpay` または `xlayer` を選択してください。

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "solana"
}
```

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "okpay"
}
```

- 保留中の親からの注文（ステータス1または4）のみが切り替え可能です。子どもの注文は再度切り替えることはできません。
- 最初のプレースホルダーの選択により、元の親注文が完了し、ステータス1に移動します。オンチェーンでのチェックアウトは、アドレスと金額を割り当てます。ホストされたチェックアウトは、プロバイダーの支払いURLを返します。OKPayの場合、受取アドレスの入力欄には「`OKPAY`」と表示されます。
- 完了したプレースホルダーは、当初は `is_selected=false` の状態を維持します。同じターゲットを再度選択すると、既存の順序を復元し、選択状態にします。異なるターゲットを選択すると、親ごとに最大1つの子要素のみが作成されます。
- この応答は、チェックアウト詳細の形式を持っています。オンチェーンの注文は、ホストされた `payment_url` が空です。

## EPayに対応したチェックアウト {#epay-compatible-checkout}

`/payments/epay/v1/order/create-transaction/submit.php` への GET リクエストまたは POST フォームを送信してください。正常に処理された場合、HTTP 302 を返します。

```text
/pay/checkout-counter/{trade_id}
```

<!-- #region epay-fields -->

| フィールド | 場所 | 型 | 必須 | 説明 |
| --- | --- | --- | --- | --- |
| `pid` | クエリ／フォーム | 文字列 | はい | 商人のPID。コールバックには数値のPIDを使用してください。 |
| `money` | クエリ／フォーム | 数値 | はい | Fiat の金額 |
| `out_trade_no` | クエリ／フォーム | 文字列 | はい | 加盟店側の注文 ID。 |
| `notify_url` | クエリ／フォーム | 文字列 | はい | 加盟店のコールバック URL。 |
| `return_url` | クエリ／フォーム | 文字列 | いいえ | ブラウザの戻るURL。 |
| `name` | クエリ／フォーム | 文字列 | いいえ | 製品名 または 注文名 |
| `type` | クエリ／フォーム | 文字列 | いいえ | 空、`alipay`、または有効な `token.network` 選択肢。 |
| `token` | クエリ／フォーム | 文字列 | いいえ | 選択子が一致しなかった場合にトークンを要求。 |
| `network` | クエリ／フォーム | 文字列 | いいえ | 選択肢に一致しない場合に、要求されたネットワーク。 |
| `currency` | クエリ／フォーム | 文字列 | いいえ | EPayの通貨設定を上書きします。 |
| `sign` | クエリ／フォーム | 文字列 | はい | EPay MD5 署名 |
| `sign_type` | クエリ／フォーム | 文字列 | いいえ | 通常、`MD5`。 |

<!-- #endregion epay-fields -->

MD5 の計算には `sign` と `sign_type` を除くすべての空でない受信パラメーターを含めます。`sitename` などのプラグイン固有のフィールドも対象です。以下はデモ用の秘密鍵を含む署名対象の文字列と、その署名の例です。

```text
money=100&name=VIP&notify_url=https://merchant.example/notify&out_trade_no=ORD202605230001&pid=1000&return_url=https://merchant.example/return&type=alipayepusdt_secret_key
```

```text
sign=b865b0acbb2b01554c35a1bd33351452
```

**資産選択。** `token.network` 選択子が type でサポートされている場合、明示的なトークンとネットワークのフィールド、およびそれらの管理者設定を上書きします。未知の空でない type の場合、`10009` (例: `usdt-tron`) を返します。 `type` が空の場合、または `alipay` の場合、欠落したフィールドはそれぞれの EPay デフォルトにフォールバックします。もし両方とも空の場合、サーバーはプレースホルダーを作成します。デフォルト値を使用した後、正確に1つのフィールドが欠落した場合、リクエストを拒否します。通貨はリクエスト値を使用し、次に設定されたデフォルトを使用し、最後に `cny` を使用します。

新規インストール時の通貨は `cny` で、既定のトークンとネットワークは空のままです。アップグレードでは既存の設定が引き継がれます。署名検証後、サーバーは `payment_type=Epay` を設定します。実際に送信する `type`、`token`、`network`、`currency` を署名対象に含めてください。

<a id="callbacks"></a>

## 加盟店へのコールバック {#merchant-callbacks}

EPUSDTは、支払い完了後に、注文の`notify_url`を通知します。署名の確認、注文と金額の一致、および、重複した通知を効率的に処理します。HTTP 200で「`ok`」または「`success`」（大文字・小文字を区別しない）の応答を送信し、失敗した配信は、`order_notice_max_retry`と`callback_retry_base_seconds`に基づいて、最大5分間、指数関数的な遅延を適用して再試行します。

### GMPay {#gmpay}

GMPayはJSONをPOSTで送信します。`pid`でローカルの商事キーを検索し、注文作成時の同じ正規化を使用してHMACを検証します。本文には`payment_type`は含まれていません。

```json
{
  "pid": "1000",
  "trade_id": "20260523171652123456001",
  "order_id": "ORD202605230001",
  "amount": 100,
  "actual_amount": 14.29,
  "receive_address": "TTestTronAddress001",
  "token": "USDT",
  "block_transaction_id": "0xabc123...",
  "signature": "498975a97bc34563bdb14df53fc18054645df9684d6c67d9b9dd90ec62be1018",
  "status": 2
}
```

| フィールド | 型 | 意味 |
| --- | --- | --- |
| `pid` | 文字列 | 商人用シグネチャルID。 |
| `trade_id` | 文字列 | EPUSDT 取引ID |
| `order_id` | 文字列 | 加盟店側の注文 ID。 |
| `amount` | 数値 | Fiat の金額 |
| `actual_amount` | 数値 | 受領した暗号資産の数量。 |
| `receive_address` | 文字列 | お届け先住所 |
| `token` | 文字列 | 受け取りました。 |
| `block_transaction_id` | 文字列 | オンチェーンのハッシュまたはプロバイダーの注文参照 |
| `signature` | 文字列 | 小文字の HMAC-SHA256 ハッシュ値。 |
| `status` | 整数 | 支払い済み（2）。 |

### EPay {#epay}

EPayは、数値の`pid`を含むGETリクエストを送信します。EPayおよびGMPayの注文において、`payment_type=Epay`を選択した場合は、数値の商用PIDを使用します。コールバックは、注文の保存された`type`を使用するか、`alipay`にフォールバックします。受信したEPayの注文におけるMD5署名を検証します。

```text
pid=1000
trade_no=20260523171652123456001
out_trade_no=ORD202605230001
type=alipay
name=VIP
money=100.0000
trade_status=TRADE_SUCCESS
sign=cc44fab3f264615d859f8a1fd36d2f08
sign_type=MD5
```

## OKPay サービスからの応答 {#okpay-provider-callback}

`POST /payments/okpay/v1/notify` を OKPay で設定してください。JSON、URLエンコードされたフォーム、または生のクエリ文字列形式のデータを受け付けます。EPUSDT は、ショップトークンとプロバイダーの署名を検証し、対応する注文を処理し、商人側のコールバックをトリガーします。これは、完了したプレースホルダーまたはホストされた子注文をカバーします。

成功 (Seikou)

```text
success
```

エラー (HTTP 400):

```text
fail
```

## アプリケーションエラーコード {#application-error-codes}

| コード | HTTP | 意味 |
| --- | --- | --- |
| `200` | 200 | 成功 |
| `400` | 400 | システムまたは検証エラー |
| `401` | 401 | 署名が無効です |
| `10001` | 400 | ウォレットのアドレスは既に存在します。 |
| `10002` | 400 | 注文は既に存在します |
| `10003` | 400 | 受信アドレスが利用できません。 |
| `10004` | 400 | 支払い精度の下限額 |
| `10005` | 400 | 利用可能な住所/金額の組み合わせがありません。 |
| `10006` | 400 | 為替計算に失敗しました。 |
| `10007` | 400 | 既に処理済み |
| `10008` | 400 | 注文が見つかりません |
| `10009` | 400 | 無効なパラメータ |
| `10010` | 400 | 注文状況が変更されました。 |
| `10011` | 400 | 子供の注文制限に達しました。 |
| `10012` | 400 | 子供の注文では、ネットワークの変更ができません。 |
| `10013` | 400 | 注文は保留中ではありません |
| `10014` | 400 | ネットワークがオフです。 |
| `10016` | 400 | 該当する資産が見つかりません。 |
| `10017` | 400 | 支払いプロバイダーが停止されています。 |
| `10018` | 400 | 支払いプロバイダーの設定が完了していません。 |
| `10019` | 400 | サポートされていないプロバイダのトークンまたはネットワーク |
| `10038` | 400 | トランザクションハッシュの検証に失敗しました。 |
| `10039` | 400 | 手動による確認には、オンチェーンの注文が必要です。 |
| `10041` | 400 | 無効な通知URL |
| `10042` | 400 | プロバイダの注文作成に失敗しました。 |
| `10044` | 400 | 無効なリダイレクトURL |
| `10045` | 400 | 商用キーが利用できません。 |
| `10046` | 400 | EPay 返金パラメータの登録ができません。 |

[アプリケーションエラーの一覧](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/util/constant/errno.go)

EPayの支払い方法のリストとセレクターの優先順位については、[EPay連携ガイド](/ja/guide/integration/epay) を参照してください。
