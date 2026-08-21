# Node 資料操作

Node 執行時將權威 SQLite 資料庫儲存在 `$GMSHOP_DATA_DIR/gmshop.sqlite`，私有物件也位於同一資料目錄。請使用維護中的 `bun run data -- …` CLI，不要複製正在執行的 SQLite 檔案。

## 備份與恢復

備份或恢復前先停止容器，確保資料庫、私有物件和持久佇列狀態處於同一邏輯時間點。

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

備份輸出必須位於資料目錄之外。恢復只接受全新或空目標，絕不會覆蓋已有例項。Manifest 會驗證每個檔案；恢復還會檢查 SQLite 完整性、外鍵和不可變遷移驗證碼。

釋出映像包含相同 CLI：

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

備份中包含憑證、使用者記錄、訂單、預置庫存、私有下載和自動化產物。應加密儲存、限制訪問，並定期測試恢復。

CLI 使用 `$GMSHOP_DATA_DIR/.maintenance.lock`。如果主機崩潰後遺留鎖檔案，請先確認沒有伺服器或資料命令正在使用該目錄，再僅刪除過期鎖檔案。

## 匯入 Cloudflare 匯出資料

將 D1 匯出為 SQL，並把 R2 物件匯出到相對路徑與原始鍵一致的本地目錄。只能匯入到全新或空的 Node 資料目錄：

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

例項沒有物件時可省略 `--r2-dir`。`--r2-manifest` 也可省略，但使用時必須同時提供 `--r2-dir`；它用於保留 R2 HTTP 和自定義元資料。

匯入程式會驗證倉庫遷移、SQLite 完整性和外鍵，再把 R2 鍵轉換為私有雜湊物件佈局。它會拒絕不安全路徑、未知元資料、缺少對應物件的元資料和非空目標；不提供覆蓋模式或雙向同步。
