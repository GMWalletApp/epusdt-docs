---
title: "Workers または Bun でストアフロントを導入してください。"
description: "GMShop Edge を Workers または Bun にデプロイし、デジタル商品のストア向けのストレージ、キュー、およびバックグラウンドジョブを設定してください。"
titleTemplate: ":title | GMShop Edge"
---

# デプロイ {#deployment}

GMShop Edgeは、2種類の生産サイクルをサポートしています。

- Bun/ニトロ自Hosting：SQLite、プライベートローカルオブジェクト、耐久性のあるローカルキュー、および永続的なデータディレクトリを使用。Dockerまたは、サービスマネージャーを用いたソースデプロイメントを使用。
- Cloudflare Workers：D1、KV、R2、キュー、Cron トリガー、およびオプションのメール送信。

これらの実行環境は、共通のストアフロント、顧客アカウント、チェックアウト、履行、管理コンソール、サプライヤーAPI、Telegram連携、および`/install`フローにアクセスできます。

## Docker Compose {#docker-compose}

公開の [GHCR パッケージ](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) は、`linux/amd64` と `linux/arm64` をサポートしています。以下の内容を `compose.yml` として保存してください。

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMSHOP_DATA_DIR: /var/lib/gmshop
    volumes:
      - gmshop-data:/var/lib/gmshop

volumes:
  gmshop-data:
```

サービスを開始し、確認してください。

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

このコンテナは、root権限で動作します。`GMSHOP_DATA_DIR` には、`gmshop.sqlite`、プライベートなオブジェクト、耐久性のあるキューの状態、およびすべての実行時のデータが含まれています。コンテナが更新または再作成されるたびに、`gmshop-data` ボリュームを保持し、バックアップしてください。

`GMSHOP_DATA_DIR`は、唯一の公開されているBun環境変数です。`/install`または`/admin`を通じて、Origin、許可されるホスト、メール、支払い、サプライヤー、Telegram、および自動化の設定を構成してください。

Bunはシングルインスタンスのみをサポートしています。複数のレプリカでの展開や共有ネットワークストレージはサポートされていません。アップグレード、復元、または展開の移行を行う前に、[Bun データ操作](./node-data-operations.md) を必ず読んでください。

## ソースから Bun でデプロイ {#bun-source-deployment}

ソースから直接、プロダクションサーバーを実行できます。Dockerを使用せずに、GitとBun 1.3以降をインストールしてください。PM2をプロセスマネージャーとして選択した場合のみ、Node.jsが必要です。

```bash
git clone https://github.com/GMWalletApp/gmshop-edge.git
cd gmshop-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -m 0700 -o "$USER" -g "$USER" /var/lib/gmshop
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  bun run start:bun
```

最後のコマンドは前景色で実行されます。本番環境では、systemd、Supervisor、PM2、または別のサービスマネージャーで実行してください。`GMSHOP_DATA_DIR` のデータは、Dockerボリュームと同様に、保存しバックアップしてください。Bun 実行環境はシングルインスタンスのみをサポートしており、複数レプリカの展開や共有ネットワークストレージはサポートされていません。

### PM2 {#pm2}

PM2 自体は Node.js と npm が必要ですが、GMShop Edge は Bun で動作します。PM2 が生成されたサーバーを Node.js で起動しようとするのを防ぐため、`--interpreter bun` オプションを明示的に指定してください。

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

`pm2 startup` で表示されたコマンドを実行し、再度 `pm2 save` を実行してください。`pm2 logs gmshop-edge` と `curl --fail http://127.0.0.1:3000/healthz` を使用して、サービスの動作を確認してください。

ソースのデプロイを更新する：

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### デプロイボタン {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

このガイド付きの手順で、「Worker」プロジェクトを準備します。 展開後、`/install`を開き、以下の設定を確認してください。

- `gmshop-edge` を `DB` として。
- KV `gmshop-edge-cache` を `CACHE` として。
- プライベート R2 `gmshop-edge-files` を `FILES` として扱う。
- `gmshop-edge-commerce` を `COMMERCE_QUEUE` としてキューを作成し、`gmshop-edge-commerce-dlq` をその死キューとして設定します。
- ワンミニュート・クローン、および、選択された場合、Cloudflare Send Email を「`EMAIL`」として。

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

`predeploy` 連携は、指定されたリソースを作成または再利用し、リモートのマイグレーションを実行し、Worker を構築します。解決された D1/KV ID は、`dist/server/wrangler.json` にのみ注入されます。アカウント固有の ID は、ポータブルな `wrangler.jsonc` には書き込まれません。

## 初回インストール {#first-install}

DockerまたはBunが起動したら、`http://your-host:3000/install`を開いてください。Workersのデプロイ後には、WorkerのURLで`/install`を開き、検知された公開アドレスと許可されているホストを確認してから、最初のルート管理者を作成してください。

インストールにより、最初のルート管理者、保護された組み込みのストアロール、実行時の秘密、および必要な商業、為替、認証、および通知のデフォルト設定が作成されます。ただし、偽の製品、在庫、プロバイダーの資格情報、または支払い設定は作成されません。

インストール後：

1. `/admin` で生成されたシステム設定をレビューし、実行構成をバックアップしてください。
2. ブランディング、登録、認証、メール、EC、配送、顧客維持、およびプロバイダーの設定を構成する。
3. 販売可能な商品と在庫、ファイル、または自動化設定を含む、販売可能な製品のドラフトを作成し、公開する前に、公開確認を実行してください。
4. 支払いアダプターを設定し、実の販売者との受取注文を完了させてから、店舗を開設してください。

生産前に、正確なホスト/オリジンルール、実際の支払いおよび回収メール、在庫/ダウンロード/自動化の履行、キューの再試行と死信処理、払い戻し、期限切れの権利、バックアップ復元、両方のアプリケーションのローカライズ、テーマ、モバイル動作、キーボード操作、および管理者による復元について確認してください。
