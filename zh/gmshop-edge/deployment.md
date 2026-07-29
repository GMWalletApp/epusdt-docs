# 部署

GMShop Edge 以單個 Cloudflare Worker 部署，並使用 D1、KV、私有 R2、一個 commerce Queue、死信 Queue、可選 Cloudflare Send Email 與 Cron Triggers。

## 一鍵部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

引導流程會基於倉庫建立 Worker 專案。完成後請開啟 `/install`，核對自動建立的資源 bindings，並在接收訂單前完成生產檢查清單。

## Wrangler CLI

登入 Wrangler、安裝依賴並部署：

```bash
bun install
bunx wrangler login
bun run deploy
```

`bun run deploy` 會使用倉庫的 `predeploy` hook：

```text
bun run scripts/build.ts --remote
```

該 hook 會建立或復用具名 D1、R2 與 Queue 資源，透過 `DB` 套用 D1 基線並構建 Worker；不會把帳號專屬 ID 寫入 `wrangler.jsonc`。

請在 Cloudflare 部署環境中配置 `CACHE` KV namespace，以及啟用時需要的 `EMAIL` binding。服務商秘密從管理後臺錄入，禁止提交到倉庫。

## 本地開發

環境要求：

- Bun 1.3 或更高版本。
- Wrangler 支援的本地執行環境。

```bash
bun install
bun run dev
```

`bun run dev` 會將待執行 migration 套用到本地 `gmshop-edge` D1 資料庫，並在 `http://localhost:3000` 啟動應用；它不會遷移遠端資料庫。

## 首次安裝

首次執行請開啟 `/install`。安裝會建立首位 root 管理員、受保護的內建角色、執行時秘密與必要設定。

它不會建立假商品、庫存、服務商憑證或結帳 Provider 配置。

安裝完成後：

1. 確認自動識別的應用地址，並配置精確 Allowed Hosts。
2. 在 `/admin` 配置公開品牌、註冊、認證、郵件、交易、交付、保留與 Provider 設定。
3. 建立商品草稿、可售項及庫存、檔案或自動化配置，檢查發布條件後再公開。
4. 配置結帳 Provider，並在正式開店前完成一筆真實服務商驗收訂單。
5. 備份 D1、私有 R2 資料與執行時配置。

## 常用開發命令

```bash
bun run db:migrate:local
bun run generate-routes
bun run typecheck
bun run test
bun run check
bun run build
```

只有在有意修改 Drizzle schema 時才執行 `bun run db:generate`，並檢查產生的 migration。日常開發只套用 migration，不重新產生全新安裝基線。
