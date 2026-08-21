# 部署

GMShop Edge 支援兩種生產執行時：

- **Node/Nitro + Docker**：SQLite、私有本地物件、持久本地佇列及資料卷。
- **Cloudflare Workers**：D1、KV、R2、Queues、Cron Triggers 和可選 Send Email。

兩種執行時提供相同的商城、使用者帳戶、結帳、交付、管理後台、供應商 API、Telegram 整合和 `/install` 流程。

> GMShop Edge 目前位於 `alpha` 釋出通道。測試時使用 `alpha` 或完整預釋出版本標籤；`latest` 保留給穩定版本。

## Docker Compose

公共 [GHCR Package](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) 支援 `linux/amd64` 和 `linux/arm64`。將以下內容儲存為 `compose.yml`：

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:alpha
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

`GMSHOP_DATA_DIR` 是唯一公開的 Node 環境變數。Origin、Allowed Hosts、郵件、支付、供應商、Telegram 和自動化設定均透過 `/install` 或 `/admin` 設定。

Node 僅支援單一執行個體，不支援多副本部署或共享網路儲存。升級、恢復或遷移前請閱讀 [Node 資料操作](./node-data-operations.md)。

原始碼建置需要 Bun 1.3+ 和 Node.js 24：

```bash
bun install
bun run build:node
bun run start:node
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

開啟 `/install` 建立第一個根管理員、受保護的內建角色、執行時金鑰和必要設定。安裝程式不會建立虛假商品、庫存、服務商憑證或支付設定。

上線前應驗證精確的 Host/Origin 規則、真實支付與找回密碼郵件、庫存/下載/自動化交付、佇列重試與死信恢復、退款、權益到期、備份恢復、兩種應用語言、主題、移動端、鍵盤導航和管理員恢復。

## 釋出通道

Semantic Release 從 `alpha` 通道釋出預覽版本，從 `main` 釋出穩定版本。原生 amd64 和 arm64 任務會先完成映像冒煙測試，再發布帶 SBOM 與 provenance 的多架構 GHCR Manifest。
