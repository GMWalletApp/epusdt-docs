---
description: "EPUSDTの経路とHTTPメソッドに関する情報、および、注文、決済完了、支払い状況の関連情報、さらに、署名とコールバックのサンプルを調べてください。"
title: "支払い API エンドポイントの参照"
---

# API リファレンス {#api-reference}

[商用API](/ja/api/payment) を参照して、サインの例、注文の状態、およびコールバックの確認方法を確認してください。

## 公開ルート {#live-public-routes}

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

## Admin API の表面 {#admin-api-surface}

管理APIは `/admin/api/v1/*` の下に配置されており、ログインと初期パスワードのエンドポイントを除くすべてのAPIはJWTで保護されています。

現在のソースで確認できる主なグループ：

- 一般のレジ係は、保留中のオンチェーン注文のハッシュを受け付けます。また、管理者も、有効期限切れの注文や、手動審査の候補を再確認できます。
- レート設定: `rate.mode` は `fixed` または `auto` です。固定モードは `rate.forced_rate_list` を使います。自動モードは `rate.api_url` から取得できた基準通貨ごとの応答をキャッシュし、更新失敗時は最後に保存したキャッシュを使います。`rate.forced_rate_list` を空にすると、CNY と USDT/USDC の組み込みの既定レートに戻ります。
- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- チェーン/チェーントーク管理
- ウォレットアドレスの管理
- 設定管理

## 商人の資格に関する規則 {#merchant-credential-rules}

### GMPay {#gmpay}

- 必須の加盟店 ID: `pid`
- 署名フィールド: `signature`
- `v2.0.0` 以降の署名アルゴリズム：`api_keys.secret_key` を利用し、`pid` に一致する、canonical な空でないパラメータ文字列に対する HMAC-SHA256
- v2 GMPay MD5 のクライアントは、`v2.0.0` 以後のリリース前に、アップグレードが必要です。

### EPayに対応した流れ {#epay-compatible-flow}

- 必須の加盟店 ID: `pid`
- 署名フィールド: `sign`
- シグネチャードメイン：有効な `api_keys` の行における、`pid` に一致する `secret_key`
- `sign_type` は一般的に受け入れられ、通常は `MD5` を使用します。
- EPay `type` は、`alipay` または、サポートされている `token.network` セレクター（例：`usdt.tron`）を受け付けます。受け付けたセレクターは、EPay の返送/通知コールバックにおいて保存されます。

## 推奨される統合の順序 {#recommended-integration-order}

1. 管理パネルで、商人の資格を作成または確認（`pid` + `secret_key`）
2. `/payments/gmpay/v1/config` のクエリを実行し、クライアントが動的ネットワーク/トークンオプションが必要な場合に、`data.supported_assets` を読み取る。
3. 新しい連携には、GMPayをご利用をおすすめします。
4. EPayに対応したリダイレクトは、上流システムがその流れを期待する場合にのみ使用してください。
5. 同じ加盟店の `secret_key` でコールバックを検証します
