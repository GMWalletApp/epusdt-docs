---
description: "EPUSDTがサポートするネットワークとトークンを見つけ、受信アドレスを設定し、チェックアウトから署名された支払い通知までの注文を追跡してください。"
title: "対応ネットワーク、トークン、および加盟店決済"
---

# はじめに {#introduction}

EPUSDTは、自社で運用される決済ゲートウェイです。販売者は注文を作成し、購入者はチェックアウト時に支払います。ゲートウェイは、支払いが確認された際に、署名された通知を送信します。直接オンチェーンでの支払いも、販売者の受け取りアドレスに送られます。

Codex、Claude Code、Cursor、OpenCode でデプロイする場合は、エージェントに[デプロイガイドと受け入れチェックリスト](https://epusdt.com/agent-setup/prompt.md)を渡してください。

## 最初の支払い設定をお願いします。 {#set-up-your-first-payment}

1. [ゲートウェイをデプロイ](/ja/guide/installation/docker)し、決済画面の公開 HTTPS URL を設定します。
2. 管理コンソールで、ネットワークとアセットを有効にし、受信アドレスを追加してください。また、商用APIキーを作成し、サーバー上にその`pid`と`secret_key`を保管してください。
3. [GMPay の注文を作成](/ja/api/payment#create)し、購入者を `payment_url` にリダイレクトします。既に EPay と連携している場合は [EPay のリダイレクト決済](/ja/guide/integration/epay)を利用してください。

## サポートされているチェーンとトークン {#networks}

チェックアウトは、ネットワークとアセットが有効になり、受信アドレスが設定されている場合に、直接支払いのアセットを提供します。これは、新規インストール時のデフォルト設定です。ゲートウェイのオプションについては、`GET /payments/gmpay/v1/config` から `data.supported_assets` を参照してください。

ダッシュはコントラクトを持たないネイティブ資産を示します。送金先は注文に表示された受取アドレスです。表のアドレスは資産の照合に使用してください。

<div class="asset-directory">

| ネットワーク（API ID） | トークン | コントラクトアドレス / 資産 ID | 小数桁数 |
| --- | --- | --- | ---: |
<!--@include: @/.vitepress/data/asset-rows.md-->

</div>

Arcは、ネイティブおよびERC-20のUSDCを受け付けます。Polygonでは、USDCとUSDC.eはそれぞれ別の資産です。

### A7A5 (TRC-20 / ERC-20) {#a7a5}

A7A5 はロシアルーブルに連動します。利用するネットワーク（TRON または Ethereum）ごとに A7A5 を有効にし、受取ウォレットを登録します。固定レートを使う場合は、請求通貨ごとに `a7a5` のレートを設定してください。値は請求通貨 1 単位に相当する A7A5 の数量です。

A7A5 対応版では、GMPay 注文で以下のフィールドを指定します。旧版はアップグレードが必要な場合があります。

| GMPay `network` | GMPay `token` | EPay `type` |
| --- | --- | --- |
| `tron` | `A7A5` | `a7a5.tron` |
| `ethereum` | `A7A5` | `a7a5.ethereum` |

[TRONSCAN](https://tronscan.org/#/token20/TLeVfrdym8RoJreJ23dAGyfJDygRtiWKBZ) · [Etherscan](https://etherscan.io/token/0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9)

### ホスト型決済 {#hosted-payment-methods}

OKX OnchainOS (Xレイヤー) は、USDC、USDT、USDGをサポートしています。OKPayは、デフォルトでUSDTとTRXをサポートしています。各プロバイダーを個別に有効化してください。詳細については、`data.xlayer` または `data.okpay` を参照してください。

## 移管から完了まで {#from-transfer-to-fulfillment}

ChainScannerは、デフォルトでEPUSDT内で動作します。マッチングの取引を検知した場合、注文は**5 · 確認**に進みます。厳格な検証が有効（デフォルト）の場合、必要な確認の深さと、2つの独立したノードからのマッチング結果が**2 · 決済**に進むために必要です。署名された成功コールバックの確認が完了した後にのみ、注文を履行します。

## スクリーンショット {#screenshots}

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="ダッシュボード概要" height="200"><br>
      <sub>ダッシュボード概要</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="管理パネル" height="200"><br>
      <sub>管理パネル</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="チェックアウトページ" height="200"><br>
      <sub>チェックアウトページ</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="支払いページ" height="200"><br>
      <sub>支払いページ</sub>
    </td>
  </tr>
</table>

## 関連プロジェクトおよび監査 {#related-projects-and-audit}

- [GMPay Edge](/ja/gmpay-edge/) · Workers または Bun で動作する決済ゲートウェイ。
- [GMShop Edge](/ja/gmshop-edge/) · デジタル商品向けのストアフロント。
- [EPUSDT セキュリティ監査報告書（2026年5月）](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
