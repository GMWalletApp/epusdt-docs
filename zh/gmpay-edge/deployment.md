# 部署

GMPay Edge 支持两种正式部署运行环境：

- **Node/Nitro + Docker**：使用 SQLite 与本地持久化数据卷，建议自建服务器或 NAS 优先采用。
- **Cloudflare Workers**：使用 D1、KV、R2、Queues 与 Cron Triggers。

两种运行环境提供相同的商户 API、收银台、管理后台、背景任务与 `/install` 安装流程。

## Docker Compose（推荐）

公开的 [GHCR Package](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) 支持 `linux/amd64` 与 `linux/arm64`，无需登录 Registry。

将以下内容储存为 `compose.yml`：

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

启动服务：

```bash
docker compose pull
docker compose up -d
```

`latest` 追踪最新稳定版。需要可重现部署时，可固定完整版本，例如 `1.0.0`。

`GMPAY_DATA_DIR` 会保存 SQLite、上传文件、私有对象、队列状态及其他全部运行时数据。更新或重建容器时，请保留并备份 `gmpay-data` 数据卷。

备份、恢复或迁移部署前，请阅读 [Node 数据操作](./node-data-operations.md)。

检查服务与查看日志：

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

保留数据卷并更新容器：

```bash
docker compose pull
docker compose up -d
```

### Docker 命令

无法使用 Compose 时，可以直接执行容器：

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Cloudflare Workers

### 一键部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

引导流程会配置 `wrangler.jsonc` 宣告的 bindings、执行 D1 migrations 并构建 Worker。使用：

- Build command：`bun run build`
- Deploy command：`wrangler deploy`

部署完成后，开启 Worker URL 的 `/install` 初始化实例。

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

如果需要手动准备 D1：

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

不要提交产生的 database ID。部署 hook 会建立或复用具名 D1、KV、R2 与 Queue 资源、套用 D1 baseline，并在发布前构建 Worker。

## 本地开发

环境要求：

- Bun 1.3 或更新版本
- Workers 本地开发环境需受 Wrangler 支持

```bash
bun install
bun run dev
```

`bun run dev` 会将待执行 migration 套用到本地 `gmpay-edge` D1 数据库，并在 `http://localhost:3000` 启动应用。

## 首次安装

Docker 启动后请开启 `http://your-host:3000/install`；Workers 部署完成后则开启 Worker URL 的 `/install`。建立首位 root 用户前，请先确认侦测到的公开地址与 Allowed Hosts。

安装会建立：

- 第一个用户。
- 受保护的 `root` 角色。
- 运行时密钥。
- 支付默认值。
- 公共 Telegram 指令与 Telegram 默认值。

它不会建立 Telegram Bot，也不会调用 Telegram。应用、安全与邮件设置均在管理后台维护，不要改用容器环境变数设置。
