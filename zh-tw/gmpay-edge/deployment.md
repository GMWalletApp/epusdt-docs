# 部署

GMPay Edge 支援兩種正式部署執行環境：

- **Bun/Nitro 自託管**：使用 SQLite 與本地持久化資料目錄，可選擇 Docker，或原始碼部署並交由服務管理器守護。
- **Cloudflare Workers**：使用 D1、KV、R2、Queues 與 Cron Triggers。

兩種執行環境提供相同的商戶 API、收銀臺、管理後臺、背景任務與 `/install` 安裝流程。

## Docker Compose（推薦）

公開的 [GHCR Package](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) 支援 `linux/amd64` 與 `linux/arm64`，無需登入 Registry。

將以下內容儲存為 `compose.yml`：

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

啟動服務：

```bash
docker compose pull
docker compose up -d
```

`latest` 追蹤最新穩定版。需要可重現部署時，可固定完整版本，例如 `1.0.0`。

`GMPAY_DATA_DIR` 會保存 SQLite、上傳檔案、私有物件、佇列狀態及其他全部執行資料。更新或重建容器時，請保留並備份 `gmpay-data` 資料卷。

備份、還原或遷移部署前，請閱讀 [Bun 資料操作](./node-data-operations.md)。

檢查服務與查看日誌：

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

保留資料卷並更新容器：

```bash
docker compose pull
docker compose up -d
```

### Docker 命令

無法使用 Compose 時，可以直接執行容器：

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Bun 原始碼部署

不使用 Docker 時，也可以直接從原始碼建置並執行正式服務。請安裝 Git 和 Bun 1.3 或更新版本；只有選擇 PM2 作為程序管理器時才需要 Node.js。

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

最後一條命令會在前景執行。正式環境應交由 systemd、Supervisor、PM2 或其他服務管理器守護。`GMPAY_DATA_DIR` 與 Docker 資料卷一樣需要持久保留並定期備份。

### PM2

PM2 本身需要 Node.js 和 npm，但 GMPay Edge 應用程式仍由 Bun 執行。必須保留 `--interpreter bun`，否則 PM2 可能嘗試使用 Node.js 啟動產生的服務。

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

依照 `pm2 startup` 輸出的提示執行啟動項目命令，然後再次執行 `pm2 save`。使用 `pm2 logs gmpay-edge` 和 `curl --fail http://127.0.0.1:3000/healthz` 檢查服務。

更新原始碼部署：

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
```

## Cloudflare Workers

### 一鍵部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

引導流程會配置 `wrangler.jsonc` 宣告的 bindings、執行 D1 migrations 並建置 Worker。使用：

- Build command：`bun run build`
- Deploy command：`wrangler deploy`

部署完成後，開啟 Worker URL 的 `/install` 初始化實例。

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

如果需要手動準備 D1：

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

不要提交產生的 database ID。部署 hook 會建立或復用具名 D1、KV、R2 與 Queue 資源、套用 D1 baseline，並在發布前建置 Worker。

## 本地開發

環境要求：

- Bun 1.3 或更新版本
- Workers 本地開發環境需受 Wrangler 支援

```bash
bun install
bun run dev
```

`bun run dev` 會將待執行 migration 套用到本地 `gmpay-edge` D1 資料庫，並在 `http://localhost:3000` 啟動應用。

## 首次安裝

Docker 或 Bun 啟動後請開啟 `http://your-host:3000/install`；Workers 部署完成後則開啟 Worker URL 的 `/install`。建立首位 root 使用者前，請先確認偵測到的公開地址與 Allowed Hosts。

安裝會建立：

- 第一個使用者。
- 受保護的 `root` 角色。
- 執行時密鑰。
- 支付預設值。
- 公共 Telegram 指令與 Telegram 預設值。

它不會建立 Telegram Bot，也不會呼叫 Telegram。應用、安全與郵件設定均在管理後臺維護，不要改用容器環境變數設定。
