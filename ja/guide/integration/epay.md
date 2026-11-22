---
description: "EPayに対応した加盟店システムをEPUSDTと連携させるため、リダイレクトチェックアウトエンドポイントと署名されたリクエストパラメータを使用してください。"
title: "EPayに対応したリダイレクトチェックアウト"
---

# EPay 互換連携（リダイレクト決済） {#epay-compatible-integration-redirect-checkout}

EPay形式の転送注文入力が必要な場合に、以下の手順を使用してください。

## エンドポイント {#route}

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 商人の資格要件 {#merchant-credential-requirement}

受信リクエストは、古い環境変数（`epay_pid` や `epay_key` など）を使用する方法で検証されません。

現在の状況では、以下のようになります。

1. 受信中の `pid` を読み取る
2. そのPIDに対応する、有効な`api_keys`の行を見つけてください。
3. 該当する行の `secret_key` を使用して `sign` を検証します
4. オプションでIPホワイトリストの確認を適用する

## 必要な入力項目 {#required-incoming-fields}

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

オプションの共通項目：

- `return_url`
- `name`
- `type`
- `token`
- `network`
- `currency`
- `sign_type`

`type` には次の2つの形式を指定できます。

- `alipay` — 互換性値; トークン/ネットワークは、明示的な `token` + `network` リクエストパラメータから、さらに管理者のEPay設定から解決されます。
- `token.network`のようなセレクター（例：`usdt.tron`）は、そのトークン/ネットワークのペアが現在サポートされている場合にのみ適用されます。有効なセレクターは、`token`、`network`、`epay.default_token`、および `epay.default_network` を上書きします。

その他の非空の `type` の値は無効なパラメータとして拒否されます。選択された、または互換性のある `type` は、後の EPay の返金/通知コールバックのために保存されます。

## EPay のデフォルト {#epay-defaults}

署名認証が成功した場合、現在のソースが管理者設定を含む内部共有注文ペイロードを作成します。

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

EPay 提交の PHP ファイルの解決手順は：

1. `type=token.network` タイプのセレクターがサポートされます（指定された場合）。
2. 明示的な要求：`token` / `network` パラメータ
3. Admin `epay.default_token` / `epay.default_network`
4. トークンとネットワークがどちらも空の場合、レジ選択フローのための「ステータス `4`」の代替注文を作成します。

通貨は独立しています: `currency` を指定 → `epay.default_currency` → `cny`

## 成功するための行動 {#success-behavior}

成功した場合、ブラウザは以下のURLにリダイレクトされます：

```text
/pay/checkout-counter/{trade_id}
```

現在のソースでは、この経路はホストされたカシヤSPAの再配置のエントリとして機能しています。チェックアウトページのデータは、以下の方法で提供されます：

```text
/pay/checkout-counter-resp/{trade_id}
```


## 直接的なトークン/ネットワークの選択 {#direct-token-network-choices}

上流の「New API」で決済手段を設定する場合は、対応する `token.network` セレクターを `type` に指定し、選択肢を個別に登録します。例えば `usdt.tron` は TRON の USDT 注文を直接作成します。`usdt.binance` は当該資産が有効な場合に Binance/BSC の USDT 注文を作成します。

例：上流工程リスト

```json
[
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay", "type": "custom1" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.binance", "type": "usdt.binance" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.tron", "type": "usdt.tron" }
]
```

`custom1`は、単なる上流の汎用的なオプション名です。EPayのsubmit.phpにそのまま送信しないでください。`type`、`type=alipay`、または有効なセレクター（例：`usdt.tron`）を送信しないでください。

## コールバックの検証 {#callback-verification}

作成された注文が `payment_type = Epay` の場合、作業者は後にあなたの `notify_url` に EPay 形式のパラメータを付与し、**同じ商事 `secret_key`** を使用して署名します。

コールバックの `type` は、保存されたリクエストのタイプを再利用します。つまり、`alipay` または受け入れられたセレクター（例：`usdt.tron`）を返します。リクエストに `type` が含まれていない場合、外部へのコールバックは互換性のために `alipay` にフォールバックします。

古い単独の `epay_key` で、それらのコールバックを検証しないでください。
