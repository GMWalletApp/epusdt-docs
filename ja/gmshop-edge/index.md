---
title: "GMShop Edge デジタル商品ストア"
description: "GMShop Edge を利用して、Workers または Bun で、独自のデジタル商品販売プラットフォームを構築できます。チェックアウト、履行、およびサプライヤーとの連携機能も備えています。"
---

# GMShop Edge {#gmshop-edge}

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) は、Cloudflare Workers または Bun/Nitro Docker コンテナを用いて、自hosting、単一デプロイ、単一テナントのデジタル商品販売プラットフォームです。

一つのデプロイメントは、迅速な公開販売、顧客アカウント、チェックアウトと履行、Telegramとの連携、サプライヤーの運用、そして権限ベースの管理コンソールを提供します。

Epusdt や GMPay Edgeとは別の独立したプロジェクトです。製品を扱う際に、カタログ、決済、配送、サプライヤーのワークフローを持つデジタル商品販売店の場合は、GMShop Edgeをご利用ください。

> GMShop Edgeは現在開発中です。組み込みのアダプターにより、連携の道が存在します。しかし、実用上は、導入者による認証、バックアップ、監視、および実際のプロバイダーによるテストが必要です。

## 提供するもの {#what-it-provides}

- 暗号化された固定テキスト、プライベートダウンロード製品、明示的な成果物ポリシーを備えた、原子レベルで暗号化された標準製品、自動化製品。
- 永続的な、固定期間、限定的な、無期限の、無料の、単回、および顧客による継続の権利。
- ゲストおよび登録からの退会、クーポン、払い戻し、アフターサービス対応、個別注文の検索、およびアカウントに基づく配送アクセス。
- ストアのウォレット決済に加え、Stripe、Cryptomus、GMpay、EPay、Alipay (ページ/WAP)、および WeChat のネイティブ/H5 アダプター。
- ACG `3.5.5`、Dujiao Next `v1.3.1`、またはネイティブのGMShop Edge サプライヤーAPIを通じて、サプライヤーカタログの同期と履行。
- 実行時に設定されるメール/パスワード、ソーシャル、OIDC、Telegram OIDC、Telegram ログインウィジェット、および Telegram ミニアプリ認証。
- GrammYのWebフックボットで、ローカライズされたコマンド、ミニアプリのボタン、そして、メッセージ内容を保存せずに、フォーラムトピックを活用したオプションの顧客サポート機能。
- `/admin` 向けの動的な多機能RBAC（ロールベースアクセス制御）で、ルートアカウントの保護、サーバーサイドでの権限確認、再認証、および監査記録機能。
- 英語 (`en-US`) および簡体中国語 (`zh-CN`) アプリケーションローカル。

上記に挙げられたすべての機能は、オープンソースプロジェクトの一部であり、Proまたはエンタープライズの別枠のプランはありません。

## ドキュメントのセクション {#documentation-sections}

- [アーキテクチャ](./architecture.md): 共有アプリケーションスタック、Workers 連携、Bun アダプター、データ所有権、および実行時間制限。
- [デプロイ](./deployment.md): Workers、Bun/Docker、インストール手順、本番環境の受け入れ確認。
- [Bun のデータ管理](./node-data-operations.md): バックアップ、復元、Cloudflare D1/R2 からのインポート。
- [ネイティブサプライAPI](./supplier-api.md): GMShop Edgeインスタンス間の、カタログ、注文、支払いチャネル、および残高の操作。
- [商業と履行](./commerce-fulfillment.md): 製品、在庫、サプライヤー、配送記録、権利、および自動化関連商品。
- [購入手続きと決済事業者](./checkout-providers.md): ウォレットと外部決済、法定通貨の提示、メール、認証、およびTelegramサポート。

## リンク {#links}

- リポジトリ: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- デプロイメントチェックリスト： [`docs/DEPLOYMENT.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.md)
- 関連するバインデータ操作: [`docs/NODE_DATA_OPERATIONS.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
