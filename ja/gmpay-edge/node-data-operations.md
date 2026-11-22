---
description: "Bun のデプロイ環境において、GMPay Edge の SQLite データベースとプライベートオブジェクトを特定し、バックアップ、復元、および移行の手順に従ってください。"
titleTemplate: ":title | GMPay Edge"
---

# Bun のデータ管理 {#bun-data-operations}

Bun のデプロイは、SQLite データベースを `$GMPAY_DATA_DIR/gmpay.sqlite` に保存し、プライベートなオブジェクトを `$GMPAY_DATA_DIR/objects` に保存します。Bun と SQLite ドライバーを使用して、CLI とアプリケーションサーバーの両方が動作します。

## バックアップと復元 {#backup-and-restore}

GMPay Edge コンテナをバックアップまたは復元を行う前に停止することで、データベースとオブジェクトファイルが同じ時点での論理的な状態を維持します。

```bash
GMPAY_DATA_DIR=/srv/gmpay bun run data -- backup --output /srv/backups/gmpay-backup
GMPAY_DATA_DIR=/srv/gmpay-restored bun run data -- restore --input /srv/backups/gmpay-backup
```

公開されている画像には、同じCLIが含まれています。サービスを停止した後、外部のバックアップディレクトリをマウントして、以下のコマンドを実行してください：

```bash
docker compose stop gmpay-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmpay-edge bun run data -- backup --output /backups/gmpay-backup
```

入力または出力パスは常に明示的です。バックアップされた出力は、データディレクトリの外に配置する必要があります。復元は、新しいまたは空のターゲットのみを受け取り、既存のディレクトリを上書きしません。マニフェストはすべてのファイルを検証し、復元はまた、SQLiteの整合性、外部キー、および移行のチェックも実行します。

バックアップには、認証情報、ユーザーデータ、支払い記録、およびプライベートアップロードが含まれます。保存時の暗号化、アクセス制限、および定期的な復元テストを実施してください。

## Cloudflareのエクスポートをインポートする {#import-a-cloudflare-export}

D1 を SQL 形式でエクスポートし、R2 オブジェクトを、元のオブジェクトキーを相対パスとするローカルディレクトリにエクスポートします。その後、新しいまたは空の Bun データディレクトリにインポートしてください。

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMPAY_DATA_DIR=/srv/gmpay bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` は、インスタンスにオブジェクトがない場合にオプションで使用します。 `--r2-manifest` もオプションですが、`--r2-dir` が必要です。これは、R2 HTTP およびカスタムメタデータを保持するために使用します。元の R2 オブジェクトキーでキー付けされた JSON オブジェクトです。

```json
{
  "evidence/receipt.txt": {
    "httpMetadata": {
      "contentType": "text/plain; charset=utf-8",
      "cacheExpiry": "2026-09-01T00:00:00.000Z"
    },
    "customMetadata": { "orderId": "order-123" }
  }
}
```

サポートされるHTTPフィールドは、`contentType`、`contentLanguage`、`contentDisposition`、`contentEncoding`、`cacheControl`、およびISO 8601形式の`cacheExpiry`です。また、文字列以外のカスタムメタデータ、および対応するエクスポートされたオブジェクトがないマニフェストキーも拒否されます。このサイドカーがない場合、オブジェクトのバイトとキーはインポートされますが、R2メタデータは再構築できません。

インポートは、すべてのリポジトリの移行が D1 輸出に含まれていることを確認し、Bun 移行実行者用のチェックサムを記録し、外部キーを検証し、R2 のキーパスをハッシュ化されたプライベートオブジェクトのレイアウトに変換します。空のターゲットを拒否するため、失敗または繰り返し実行されたインポートは、既存のインスタンスを上書きできません。
