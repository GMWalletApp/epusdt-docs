# 部署

GMShop Edge 支援兩種生產執行時：

- **Bun/Nitro 自託管**：SQLite、私有本地物件、持久本地佇列及資料目錄，可選擇 Docker，或原始碼部署並交由服務管理器守護。
- **Cloudflare Workers**：D1、KV、R2、Queues、Cron Triggers 和可選 Send Email。

兩種執行時提供相同的商城、使用者帳戶、結帳、交付、管理後台、供應商 API、Telegram 整合和 `/install` 流程。

## Docker Compose

公共 [GHCR Package](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) 支援 `linux/amd64` 和 `linux/arm64`。將以下內容儲存為 `compose.yml`：

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

啟動並檢查服務：

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

容器以非 root 使用者執行。`GMSHOP_DATA_DIR` 包含 `gmshop.sqlite`、私有物件、持久佇列狀態及全部執行時資料。更新或重建容器時必須保留並備份 `gmshop-data` 資料卷。

`GMSHOP_DATA_DIR` 是唯一公開的 Bun 環境變數。Origin、Allowed Hosts、郵件、支付、供應商、Telegram 和自動化設定均透過 `/install` 或 `/admin` 設定。

Bun 僅支援單一執行個體，不支援多副本部署或共享網路儲存。升級、還原或遷移前請閱讀 [Bun 資料操作](./node-data-operations.md)。

## Bun 原始碼部署

不使用 Docker 時，也可以直接從原始碼建置並執行正式服務。請安裝 Git 和 Bun 1.3 或更新版本；只有選擇 PM2 作為程序管理器時才需要 Node.js。

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

最後一條命令會在前景執行。正式環境應交由 systemd、Supervisor、PM2 或其他服務管理器守護。`GMSHOP_DATA_DIR` 與 Docker 資料卷一樣需要持久保留並定期備份。Bun 執行時仍僅支援單一執行個體，不支援多副本部署或共享網路儲存。

### PM2

PM2 本身需要 Node.js 和 npm，但 GMShop Edge 應用程式仍由 Bun 執行。必須保留 `--interpreter bun`，否則 PM2 可能嘗試使用 Node.js 啟動產生的服務。

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

依照 `pm2 startup` 輸出的提示執行啟動項目命令，然後再次執行 `pm2 save`。使用 `pm2 logs gmshop-edge` 和 `curl --fail http://127.0.0.1:3000/healthz` 檢查服務。

更新原始碼部署：

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers

### Deploy Button

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

引導流程會準備 Worker 專案。部署後開啟 `/install` 並檢查：

- D1 `gmshop-edge` 繫結為 `DB`。
- KV `gmshop-edge-cache` 繫結為 `CACHE`。
- 私有 R2 `gmshop-edge-files` 繫結為 `FILES`。
- 佇列 `gmshop-edge-commerce` 繫結為 `COMMERCE_QUEUE`，死信佇列為 `gmshop-edge-commerce-dlq`。
- 每分鐘 Cron，以及按需設定的 Cloudflare Send Email `EMAIL` 繫結。

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

`predeploy` Hook 會建立或複用命名資源、應用遠端遷移並建置 Worker。解析後的 D1/KV ID 僅注入 `dist/server/wrangler.json`，不會將帳戶專屬 ID 寫入可移植的 `wrangler.jsonc`。

## 首次安裝

Docker 或 Bun 啟動後，開啟 `http://your-host:3000/install`。Workers 部署完成後，在 Worker URL 開啟 `/install`。建立第一個根管理員前，先確認檢測到的公開地址和 Allowed Hosts。

安裝程式會建立第一個根管理員、受保護的內建商城角色、執行時金鑰，以及必要的商務、匯率、身分驗證和通知預設設定。它不會建立虛假商品、庫存、服務商憑證或支付設定。

安裝完成後：

1. 在 `/admin` 檢查生成的系統設定，並備份執行時設定。
2. 設定品牌、註冊、身分驗證、郵件、商務、交付、保留策略和服務商設定。
3. 建立草稿商品，為其新增可售專案及庫存、檔案或自動化設定；透過釋出檢查後再公開商品。
4. 設定支付介面卡，並在商城開放前完成真實服務商驗收訂單。

上線前應驗證精確的 Host/Origin 規則、真實支付與找回密碼郵件、庫存/下載/自動化交付、佇列重試與死信恢復、退款、權益到期、備份還原、兩種應用語言、主題、移動端、鍵盤導航和管理員恢復。
