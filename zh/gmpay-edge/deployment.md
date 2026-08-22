# 部署

GMPay Edge 支持两种正式部署运行环境：

- **Bun/Nitro 自托管**：使用 SQLite 与本地持久化数据目录，可选择 Docker，或源码部署并交由服务管理器守护。
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

备份、恢复或迁移部署前，请阅读 [Bun 数据操作](./node-data-operations.md)。

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

## Bun 源码部署

不使用 Docker 时，也可以直接从源码构建并运行生产服务。请安装 Git 和 Bun 1.3 或更高版本；只有选择 PM2 作为进程管理器时才需要 Node.js。

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

最后一条命令会在前台运行。生产环境应交给 systemd、Supervisor、PM2 或其他服务管理器守护。`GMPAY_DATA_DIR` 与 Docker 数据卷一样需要持久保留并定期备份。

### PM2

PM2 本身需要 Node.js 和 npm，但 GMPay Edge 应用仍由 Bun 运行。必须保留 `--interpreter bun`，否则 PM2 可能尝试使用 Node.js 启动生成的服务。

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

按 `pm2 startup` 输出的提示执行启动项命令，然后再次运行 `pm2 save`。使用 `pm2 logs gmpay-edge` 和 `curl --fail http://127.0.0.1:3000/healthz` 检查服务。

更新源码部署：

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
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

Docker 或 Bun 启动后请打开 `http://your-host:3000/install`；Workers 部署完成后则打开 Worker URL 的 `/install`。创建首位 root 用户前，请先确认检测到的公开地址与 Allowed Hosts。

安装会建立：

- 第一个用户。
- 受保护的 `root` 角色。
- 运行时密钥。
- 支付默认值。
- 公共 Telegram 指令与 Telegram 默认值。

它不会建立 Telegram Bot，也不会调用 Telegram。应用、安全与邮件设置均在管理后台维护，不要改用容器环境变数设置。
