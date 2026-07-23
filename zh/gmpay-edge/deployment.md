# 部署

GMPay Edge 以單個 Cloudflare Worker 部署，使用 D1、KV、R2、Queues 與 Cron Triggers。

## 一鍵部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

引導流程會配置 `wrangler.jsonc` 宣告的 bindings、執行 D1 migrations 並建置 Worker。使用：

- Build command：`bun run build`
- Deploy command：`wrangler deploy`

部署完成後，開啟 Worker URL 的 `/install` 初始化實例。

## Wrangler CLI

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

不要提交產生的 database ID。部署 hook 會建立或復用具名 D1、R2 與 Queue 資源，透過 `DB` 套用 D1 baseline，並在發布前建置 Worker。

## 本地開發

環境要求：

- Bun 1.3 或更新版本
- Wrangler 支援的本地執行環境

```bash
bun install
bun run dev
```

`bun run dev` 會將待執行 migration 套用到本地 `gmpay-edge` D1 資料庫，並在 `http://localhost:3000` 啟動應用。

## 首次安裝

首次執行請開啟 `/install`。安裝會建立：

- 第一個使用者。
- 受保護的 `root` 角色。
- 執行時密鑰。
- 支付預設值。
- 公共 Telegram 指令與 Telegram 預設值。

它不會建立 Telegram Bot，也不會呼叫 Telegram。
