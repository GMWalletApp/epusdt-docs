# Bun 資料操作

Bun 部署將 SQLite 資料庫儲存在 `$GMPAY_DATA_DIR/gmpay.sqlite`，私有物件儲存在 `$GMPAY_DATA_DIR/objects`。維護中的 CLI 和應用服務均使用 Bun 及其 SQLite 驅動執行。

## 備份與還原

備份或還原前先停止 GMPay Edge 容器，確保資料庫與物件檔案處在同一個業務時間點。

```bash
GMPAY_DATA_DIR=/srv/gmpay bun run data -- backup --output /srv/backups/gmpay-backup
GMPAY_DATA_DIR=/srv/gmpay-restored bun run data -- restore --input /srv/backups/gmpay-backup
```

釋出映像內建同一個 CLI。停止服務後，掛載外部備份目錄並執行：

```bash
docker compose stop gmpay-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmpay-edge bun run data -- backup --output /backups/gmpay-backup
```

輸入或輸出路徑必須顯式指定，備份輸出還必須位於資料目錄之外。還原只接受全新或空目標目錄，不會覆蓋非空目錄。清單會驗證每個檔案；還原還會執行 SQLite 完整性、外鍵和遷移驗證碼檢查。

備份包含憑證、使用者資料、支付記錄和私有上傳。請加密儲存、限制訪問，並定期演練還原。

## 匯入 Cloudflare 資料

先將 D1 匯出為 SQL，並將 R2 物件匯出到本地目錄；物件在該目錄中的相對路徑必須保持原始 Object Key。然後將資料匯入全新或空的 Bun 資料目錄：

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMPAY_DATA_DIR=/srv/gmpay bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

例項沒有物件時可以省略 `--r2-dir`。`--r2-manifest` 也是可選引數，但必須與 `--r2-dir` 一起使用；它用於保留 R2 HTTP 元資料和自定義元資料。該檔案是一個以原始 R2 Object Key 為鍵的 JSON 物件：

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

支援的 HTTP 欄位為 `contentType`、`contentLanguage`、`contentDisposition`、`contentEncoding`、`cacheControl`，以及 ISO 8601 格式的 `cacheExpiry`。未知欄位、非字串自定義元資料，以及找不到對應匯出物件的清單 Key 都會被拒絕。不提供這個 Sidecar 時仍會匯入物件內容和 Key，但無法還原 R2 元資料。

匯入會確認 D1 匯出包含倉庫中的全部遷移，為 Bun 遷移器記錄驗證碼，驗證外鍵，並將 R2 Key 路徑轉換成私有物件的雜湊佈局。非空目標會被拒絕，因此失敗或重複執行匯入不會覆蓋現有例項。
