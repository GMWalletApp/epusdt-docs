---
operation: create-order
method: POST
route: "/payments/gmpay/v1/order/create-transaction"
description: "サーバーで署名し、購入者を payment_url に案内します。token と network は両方指定するか、両方省略して購入者に選択させます。"
---

# GMPay 注文を作成

<span class="api-route"><b>POST</b> <code>/payments/gmpay/v1/order/create-transaction</code></span>

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

サーバーで署名し、購入者を `payment_url` に案内します。`token` と `network` は両方指定するか、両方省略して購入者に選択させます。

## パラメータ

<!--@include: ../payment.md#create-fields-->

サンプルの署名はデモ用の鍵 `epusdt_secret_key` で計算しています。パラメータや鍵を変更したらサーバーで再計算してください。

## 関連資料

- [決済画面を開く](./open-checkout)
- [署名規則](../payment#signing)
