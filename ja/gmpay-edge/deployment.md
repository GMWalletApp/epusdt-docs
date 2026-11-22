---
title: "Workers または Bun にゲートウェイを設置してください。"
description: "Cloudflare Workers または Bun ホストに GMPay Edge をデプロイします。実行時の設定、ストレージの要件、およびデプロイ時の確認事項を比較してください。"
titleTemplate: ":title | GMPay Edge"
---

# デプロイ {#deployment}

GMPay Edgeは、2つの生産サイクルをサポートしています。

- SQLite と永続的なローカルデータディレクトリを使用し、Docker またはサービスマネージャーを用いたソースデプロイ方式で、Bun/Nitro を自 host する。
- Cloudflare Workers：D1、KV、R2、キュー、および Cron トリガー。

これらの実行環境は、すべて同じ商取引API、チェックアウト、管理者コンソール、バックグラウンドジョブ、および`/install`フローにアクセスできます。

## Docker Compose (推奨) {#docker-compose-recommended}

公開されている [GHCR パッケージ](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) は、`linux/amd64` および `linux/arm64` をサポートしており、登録は不要です。

以下の内容を `compose.yml` として保存してください。

```yaml
services:
  gmpay-edge:
    image: ghcr.io/gmwalletapp/gmpay-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMPAY_DATA_DIR: /var/lib/gmpay
    volumes:
      - gmpay-data:/var/lib/gmpay

volumes:
  gmpay-data:
```

サービスを開始してください。

```bash
docker compose pull
docker compose up -d
```

`latest` タグは最新の安定版を指します。同じバージョンを再現してデプロイするには、`1.0.0` のような完全なバージョン番号を指定します。

`GMPAY_DATA_DIR` には、SQLite、アップロードされたファイル、プライベートオブジェクト、キューの状態、およびその他の実行時データが含まれています。コンテナを更新または再作成する際には、`gmpay-data` ボリュームを保持し、バックアップしてください。

バックアップ、復元、またはデプロイの移行を行う前に、[Bun データ操作](./node-data-operations.md) を必ず読んでください。

サービスを検証し、ログを調査してください。

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

データを保持したまま更新する：

```bash
docker compose pull
docker compose up -d
```

### Dockerコマンド {#docker-command}

Composeが利用できない場合は、コンテナを直接実行してください。

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## ソースから Bun でデプロイ {#bun-source-deployment}

ソースから直接、プロダクションサーバーを実行できます。Dockerを使用せずに、GitとBun 1.3以降をインストールしてください。PM2をプロセスマネージャーとして選択した場合のみ、Node.jsが必要です。

```bash
git clone https://github.com/GMWalletApp/gmpay-edge.git
cd gmpay-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -o "$USER" -g "$USER" /var/lib/gmpay
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  bun run start:bun
```

最後のコマンドは前景色で実行されます。本番環境では、systemd、Supervisor、PM2、または別のサービスマネージャーで実行してください。`GMPAY_DATA_DIR` は、Dockerボリュームと同様に、保存しバックアップしてください。

### PM2 {#pm2}

PM2 自体は Node.js と npm が必要ですが、GMPay Edge は Bun で動作します。PM2 が生成されたサーバーを Node.js で起動しようとするのを防ぐため、 `--interpreter bun` オプションを明示的に指定してください。

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

`pm2 startup` で表示されたコマンドを実行し、再度 `pm2 save` を実行してください。`pm2 logs gmpay-edge` と `curl --fail http://127.0.0.1:3000/healthz` を使用して、サービスの動作を確認してください。

ソースのデプロイを更新する：

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### デプロイボタン {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

このガイド付きの仕組みは、`wrangler.jsonc` で宣言されたバインディングを適用し、D1 のマイグレーションを実行し、Worker を構築します。

- ビルドコマンド: `bun run build`
- デプロイコマンド: `wrangler deploy`

デプロイ後、WorkerのURLで`/install`を開き、インスタンスを初期化してください。

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

もし D1 を手動で準備する必要がある場合：

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

データベースのIDを生成しないでください。デプロイメントフックは、D1、KV、R2、およびキューという名前のリソースを作成または再利用し、D1のベースラインを適用し、公開前にワーカーを構築します。

## 地域開発 {#local-development}

要件：

- バージョン 1.3 以降
- 開発環境：Wrangler for the Workers を利用した地域環境

```bash
bun install
bun run dev
```

`bun run dev` は、ローカルの `gmpay-edge` D1 データベースへの未完了のマイグレーションを実行し、`http://localhost:3000` でアプリケーションを起動します。

## 初回インストール {#first-install}

DockerまたはBunが起動したら、`http://your-host:3000/install`を開いてください。Workersのデプロイ後には、WorkerのURLで`/install`を開きます。最初のルートユーザーを作成する前に、検出された公開アドレスと許可されているホストを確認してください。

インストールにより、以下のものが作成されます：

- 最初のユーザー。
- 保護された `root` ロール。
- 実行時の秘密
- 支払い遅延
- 公開されているテレグラムのコマンドと、テレグラムのデフォルト設定。

Telegram Bot の作成や Telegram へのアクセスは、コンテナ環境変数ではなく、管理インターフェースで管理されます。セキュリティとメール設定も、同様に管理インターフェースで行います。
