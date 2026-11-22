---
operation: epay-order
method: GET/POST
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "署名済みのパラメータを GET クエリまたは POST フォームで送信します。MD5 の検証と注文作成に成功すると HTTP 302 で決済画面に移動します。"
---

# EPay 注文を作成

<ApiRoute />

<a class="api-example-jump" href="#request-example">リクエスト例 ↓</a>

署名済みのパラメータを GET クエリまたは POST フォームで送信します。MD5 の検証と注文作成に成功すると HTTP 302 で決済画面に移動します。

## パラメータ

<!--@include: ../payment.md#epay-fields-->

サンプルの署名はデモ用の鍵 `epusdt_secret_key` で計算しています。パラメータや鍵を変更したらサーバーで再計算してください。

## 関連資料

- [加盟店サイトに戻る](./checkout-return)
- [署名規則](../payment#signing)
