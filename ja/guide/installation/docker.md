---
description: "Docker Compose を使用して EPUSDT をインストールし、公開の取引URLを設定し、コンテナの再起動時にゲートウェイと ChainScanner のデータを保持する。"
title: "Docker Compose を使用して、決済ゲートウェイをインストールしてください。"
---

# Docker Compose でインストール {#install-with-docker-compose}

インストールしているバージョンから、[Compose file](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml) を使用してください。デフォルトのサービスにはChainScannerが含まれています。

新規インストールの場合、まずリリースファイルをダウンロードしてください。

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## ゲートウェイを起動する {#start-the-gateway}

リポジトリのルートから、Compose環境で公開チェックアウトURLを設定します（例えば、プロジェクトレベルの`.env`ファイル）。このエントリーポイントは、起動するたびに利用します。

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

HTTPSリバースプロキシを、設定されたポートに設定してください。受信アドレスを設定し、応答で `data.supported_assets` を確認してください。

## データの保存とアップグレード {#storage-and-upgrades}

以下のコマンドで、モント (Compose) を作成します: `./runtime/epusdt` を `/app/runtime` に配置します。このディレクトリには、アプリケーションの `.env` ファイル、ビジネスおよび実行時データベース、および組み込みスキャナデータベースが含まれています。プロジェクトレベルの Compose 環境とアプリケーション設定は、それぞれ別のファイルに保存されています。

v2.0.0 からアップグレードする際は、古いサービスを停止し、設定ファイルとデータベースをバックアップして、新しいマウントにコピーしてください。古いコンテナを再作成する前に、元のバックアップを保持し、設定されたデータベースファイル名を必ず確認してください。 [リリースノート](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

v2.1.1 以降、ゲートウェイは SQLite のみを使用します。設定、ビジネス、および実行時データベース、およびスキャナデータのバックアップを作成してください。以前に MySQL または PostgreSQL を使用していた場合は、データを移行し、移行後に確認してください。`db_type` のみを変更しても、注文は移行されません。

## スキャナーを独立して実行する {#using-a-standalone-scanner}

`CHAINSCANNER_URL=http://chainscanner:9081` を設定し、利用側と管理用に別々のトークンを指定します。独立したスキャナーをアップグレードするときは、既存のスキャナーボリューム（`./runtime/chainscanner`）、URL、認証情報を引き継いでください。

```sh
docker compose --profile scanner up -d
```
