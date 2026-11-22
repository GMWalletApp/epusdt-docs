---
description: "EPUSDTを統合する際に、GMPayとEPayに関する情報、加盟資格、有効な資産、およびコールバック検証についてご質問ください。"
title: "商人との連携に関するよくある質問"
---

# FAQ {#faq}

## どのエンドポイントを使えばよいですか？ {#which-route-should-i-use}

- 新しい連携には、GMPay をご使用ください。
- EPayに対応したリダイレクトを使用するのは、上流のシステムがEPay形式のリダイレクトを期待する場合のみです。
- `/payments/epusdt/v1/order/create-transaction` のルートは、現在のソースでは登録されていないため、新規の連携は作成しないでください。

## `pid`と署名キーはどこから来ているのでしょうか。 {#where-do-pid-and-signing-keys-come-from}

管理画面の API キー一覧で確認できます。加盟店ごとに `pid` と対応する `secret_key` があります。

## GMPayの設定が、環境によって異なる理由は何ですか？ {#why-does-the-gmpay-config-differ-between-environments}

`GET /payments/gmpay/v1/config` は、お客様の管理データに基づいて計算されます。

`data.supported_assets` のリストは、有効なチェーン、有効なチェーンのトークン、およびその環境における利用可能なウォレットアドレスによって依存します。

## どのノードが必要ですか。 {#which-nodes-do-i-need}

埋め込まれた ChainScanner には公開ノードが含まれています。TRON は、TronGrid キーなしで、サポートされている公開エンドポイントを使用できます。ノードを追加する際は、ネットワークと、プロバイダーが実際に提供しているプロトコルを選択してください。WebSocket 接続が新しいブロックを通知できる一方で、別の HTTP エンドポイントがそれを読み取ります。

ダッシュボードはスキャン状況を表示し、観測された遅延が5分を超えた場合に警告を表示します。頻繁にSolana、TON、またはPlasmaへのクエリを行う場合は、2つの独立したプロバイダーから代替ノードを設定し、それぞれの利用限度を確認してください。

## 為替レートはどのように決定されるのですか。 {#how-are-exchange-rates-set}

`fixed` を選択すると、`rate.forced_rate_list` を使用します。auto を選択すると、`rate.api_url` からレートを取得します。`auto` モードでは、リフレッシュに失敗した場合、最後のキャッシュされたレートを保持します。空の forced_rate_list は、USDT と USDC の標準的な CNY レートを復元します。
