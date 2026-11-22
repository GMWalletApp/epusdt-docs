---
description: "Bun上でGMShop EdgeのSQLiteデータとプライベートオブジェクトのバックアップと復元を行い、Cloudflare D1とR2からのインポートパスを確認してください。"
titleTemplate: ":title | GMShop Edge"
---

# Bun のデータ管理 {#bun-data-operations}

Bun 実行環境は、信頼性の高い SQLite データベースを `$GMSHOP_DATA_DIR/gmshop.sqlite` に保存し、プライベートなオブジェクトを同じデータディレクトリ内に保存します。 メンテナンスされている `bun run data -- …` コマンドを使用し、ライブな SQLite ファイルをコピーするのではなく、利用してください。

## バックアップと復元 {#backup-and-restore}

バックアップまたは復元を行う前に、コンテナを停止することで、データベース、プライベートオブジェクト、および耐久性キューの状態を、一つの論理的な時点に保ちます。

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

バックアップ出力はデータディレクトリ外に出します。復元は、新しいまたは空のターゲットのみを受け取り、既存のインスタンスを上書きしません。マニフェストはすべてのファイルを検証し、復元時にはSQLiteの整合性、外部キー、および不変な移行チェックサムも確認します。

公開された画像には、同じCLIが含まれています。

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

バックアップには、認証情報、顧客記録、注文、既定の在庫、プライベートダウンロード、および自動化関連データが含まれます。保存時の暗号化、アクセス制限、定期的な復元テストを実施してください。

CLIは `$GMSHOP_DATA_DIR/.maintenance.lock` を使用します。クラッシュによってロックファイルが残った場合、まず、そのディレクトリがサーバーまたはデータコマンドによって使用されていないことを確認し、古いロックファイルのみを削除してください。

## Cloudflareのエクスポートをインポートする {#import-a-cloudflare-export}

D1 と R2 を、元のキーに一致するローカルディレクトリに SQL および R2 オブジェクトとしてエクスポートします。新しいまたは空の Bun データディレクトリにのみインポートしてください。

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` は、インスタンスにオブジェクトがない場合にオプションです。 `--r2-manifest` もオプションですが、`--r2-dir` が必要です。R2 HTTP およびカスタムメタデータが保持されます。

輸入者は、リポジトリの移行、SQLiteの整合性、および外部キーを検証し、R2キーをハッシュ化されたオブジェクトの形式に変換します。同時に、危険なパス、不明なメタデータ、オブジェクトなしのメタデータ、および空でないターゲットを拒否します。 復帰モードや双方向の同期機能は提供されません。
