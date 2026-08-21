# 部署

GMShop Edge 支援單個 Cloudflare Workers 部署或單個 Node/Nitro Docker 容器。無論選擇哪種方式，接單前都必須完成 `/install` 初始化。

> 目前版本為 `v1.0.0-alpha.1`。測試時使用滾動 `alpha` 映像或完整預釋出版本標籤；`latest` 保留給穩定版本。

## Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

使用 CLI 部署：

```bash
bun install
bunx wrangler login
bun run deploy
```

`predeploy` Hook 會建立或複用命名的 D1、KV、私有 R2、商務佇列和死信佇列，應用遠端遷移並建置 Worker。解析後的 D1/KV ID 僅注入 `dist/server/wrangler.json`，不會把帳戶專屬 ID 寫入可移植的 `wrangler.jsonc`。

部署後檢查：

- D1 `gmshop-edge` 繫結為 `DB`。
- KV `gmshop-edge-cache` 繫結為 `CACHE`。
- 私有 R2 `gmshop-edge-files` 繫結為 `FILES`。
- 佇列 `gmshop-edge-commerce` 繫結為 `COMMERCE_QUEUE`，死信佇列為 `gmshop-edge-commerce-dlq`。
- 每分鐘 Cron，以及按需設定的 Cloudflare Send Email `EMAIL` 繫結。

## Node 與 Docker

公共映像 `ghcr.io/gmwalletapp/gmshop-edge` 支援 `linux/amd64` 和 `linux/arm64`。目前預釋出版本請將 `compose.yml` 中的映像標籤改為 `alpha` 或 `1.0.0-alpha.1`：

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

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
```

容器以非 root 使用者執行，並將全部狀態持久化到 `/var/lib/gmshop`。`GMSHOP_DATA_DIR` 是唯一公開的 Node 環境變數；Origin、Allowed Hosts、郵件、支付、供應商、Telegram 和自動化設定均透過 `/install` 或 `/admin` 設定。重建容器時必須保留資料卷。

原始碼建置需要 Bun 1.3+ 和 Node.js 24：執行 `bun run build:node`，再執行 `bun run start:node`。

升級或遷移前請先閱讀 [Node 資料操作](./node-data-operations.md)。

## 首次安裝與生產驗收

開啟 `/install` 建立第一個根管理員、受保護的內建角色、執行時金鑰和必要設定。安裝程式不會建立虛假商品、庫存、服務商憑證或支付設定。

上線前應完成：

1. 確認檢測到的 Origin，並設定精確的 Allowed Hosts。
2. 設定品牌、註冊、身分驗證、郵件、商務、交付、保留、支付、供應商、Telegram 和自動化設定。
3. 釋出測試商品，驗證庫存、私有下載或自動化交付。
4. 使用部署者自己的憑證完成真實支付和找回密碼郵件測試。
5. 驗證重啟恢復、佇列重試/死信處理、退款、權益到期、備份與恢復。
6. 驗證兩種應用語言、兩種主題、移動端、鍵盤導航和管理員恢復。

## 釋出通道

Semantic Release 從 `alpha` 通道釋出預覽版本，從 `main` 釋出穩定版本。原生 amd64 和 arm64 任務會先完成映像冒煙測試，再發布帶 SBOM 與 provenance 的多架構 GHCR Manifest。
