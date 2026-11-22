---
title: "オンチェーン、取引所、ウォレットでの支払い"
description: "GMPay Edgeにおけるオンチェーン、取引所、ウォレットとの連携をレビューし、チェックアウト時にどのオプションが表示されるかを制御する仕組みを確認してください。"
titleTemplate: ":title | GMPay Edge"
---

# 決済サービスとの連携 {#payment-integrations}

GMPay Edgeは、オンチェーン、取引所、ウォレットとの連携機能を含んでいます。受け取りの露出は、設定された受け取り方法によって別途制御されます。

対象となる方法は、必要な公開接続または読み取り専用アカウント設定を持ち、可用性チェックに合格した後に、支払者に対して提供されるべきです。

| 型 | 連携 | 内蔵アセット |
| --- | --- | --- |
| オンチェーン | TRON / TRC20 | USDT, TRX |
| オンチェーン | Ethereum / ERC20 | USDT, USDC, ETH |
| オンチェーン | Base | USDT, USDC, ETH |
| オンチェーン | BNB Smart Chain / BEP20 | USDT, USDC, BNB |
| オンチェーン | 多角形 | USDT, USDC, MATIC |
| オンチェーン | TON | USDT, GRAM |
| オンチェーン | Aptos | USDT, USDC |
| オンチェーン | Solana | USDT, USDC |
| 取引所 | Binance | USDT, USDC |
| 取引所 | OKX | USDT, USDC |
| ウォレット | OKPay | USDT, TRX |

組み込み機能がある場合、その機能はプロジェクト内に存在します。しかし、実際の運用においては、導入者によるエンドポイントまたは読み取り専用の認証情報、設定された受信方法、バックアップ、監視、および実環境でのテストが必要となります。
