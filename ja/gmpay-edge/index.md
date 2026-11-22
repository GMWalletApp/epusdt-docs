---
title: "GMPay Edge 支払いゲートウェイ、労働者とブン向け"
description: "Cloudflare Workers または Bun 用の、独自のホスト型の決済ゲートウェイ「GMPay Edge」をご紹介します。GMPay の商用 API と EPay との互換性も備えています。"
---

# GMPay Edge {#gmpay-edge}

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge) は **Cloudflare Workers または Docker 上の Bun/Nitro** で動作する、セルフホスト型のシングルテナント暗号資産決済ゲートウェイです。

これはEpusdtとは別のプロジェクトです。このサイトでGoゲートウェイのドキュメントが必要な場合は、Epusdtを使用してください。Cloudflare WorkersまたはSQLiteバックのローカルストレージを備えたDockerコンテナとしてデプロイできるTypeScriptゲートウェイが必要な場合は、GMPay Edgeをご利用ください。

> GMPay Edgeは現在開発中です。組み込み機能により、プロジェクト内で機能は存在しますが、実際の運用には、導入者によるエンドポイントまたは読み取り専用の認証情報、設定された受信方法、バックアップ、監視、および実環境でのテストが必要です。

## 提供するもの {#what-it-provides}

- JSON およびフォーム入力を用いた、GMPayの商用API。
- APIの境界でEPayとの互換性を実現し、別々の注文モデルを維持することなく対応する。
- 応答性の高いチェックアウト、管理者コンソール、公開されているステータスページ、および実行時のOpenAPIドキュメント。
- 堅牢なWebhook配信を実現する、キューベースのアウトボックス機能に加え、再試行履歴、手動での再試行、および監査記録。
- 実行時固有の堅牢なキューとスケジューラを通じて、支払いのスキャン、有効期限の確認、整理、接続の健全性、およびレートの同期。
- より高度な認証、TOTP、および、管理のための動的マルチロールRBAC。
- grammY を用いた Telegram ボットの自動化、具体的には、インライン注文、公開コマンド、および通知の購読機能。
- 6つのUI地域。

## ドキュメントのセクション {#documentation-sections}

- [アーキテクチャ](./architecture.md): Workers と Bun のランタイムサービス、キュー、コールバック、各プロトコルの適用範囲。
- [デプロイ](./deployment.md): Docker Compose、GHCRイメージ、デプロイボタン、Wrangler CLI、ローカル開発、および初回インストール。
- [Bun のデータ管理](./node-data-operations.md): バックアップ、復元、Cloudflare D1/R2 からのインポート。
- [加盟店 API](./merchant-api.md): GMPay の注文作成・照会、署名、コールバック、EPay 互換機能。
- [決済サービスとの連携](./payment-integrations.md): オンチェーン決済、取引所、ウォレット用の組み込みアダプター一覧。

## リンク {#links}

- リポジトリ: [GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- 英語版 README: [README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- 中国語版 README: [README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
