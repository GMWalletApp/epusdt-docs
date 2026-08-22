# 部署

GMShop Edge 支持两种生产运行时：

- **Bun/Nitro 自托管**：SQLite、私有本地对象、持久本地队列及数据目录，可选择 Docker，或源码部署并交由服务管理器守护。
- **Cloudflare Workers**：D1、KV、R2、Queues、Cron Triggers 和可选 Send Email。

两种运行时提供相同的商城、用户账户、结账、交付、管理后台、供应商 API、Telegram 集成和 `/install` 流程。

## Docker Compose

公共 [GHCR Package](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) 支持 `linux/amd64` 和 `linux/arm64`。将以下内容保存为 `compose.yml`：

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

启动并检查服务：

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

容器以非 root 用户运行。`GMSHOP_DATA_DIR` 包含 `gmshop.sqlite`、私有对象、持久队列状态及全部运行时数据。更新或重建容器时必须保留并备份 `gmshop-data` 数据卷。

`GMSHOP_DATA_DIR` 是唯一公开的 Bun 环境变量。Origin、Allowed Hosts、邮件、支付、供应商、Telegram 和自动化设置均通过 `/install` 或 `/admin` 配置。

Bun 仅支持单实例，不支持多副本部署或共享网络存储。升级、恢复或迁移前请阅读 [Bun 数据操作](./node-data-operations.md)。

## Bun 源码部署

不使用 Docker 时，也可以直接从源码构建并运行生产服务。请安装 Git 和 Bun 1.3 或更高版本；只有选择 PM2 作为进程管理器时才需要 Node.js。

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

最后一条命令会在前台运行。生产环境应交给 systemd、Supervisor、PM2 或其他服务管理器守护。`GMSHOP_DATA_DIR` 与 Docker 数据卷一样需要持久保留并定期备份。Bun 运行时仍仅支持单实例，不支持多副本部署或共享网络存储。

### PM2

PM2 本身需要 Node.js 和 npm，但 GMShop Edge 应用仍由 Bun 运行。必须保留 `--interpreter bun`，否则 PM2 可能尝试使用 Node.js 启动生成的服务。

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

按 `pm2 startup` 输出的提示执行启动项命令，然后再次运行 `pm2 save`。使用 `pm2 logs gmshop-edge` 和 `curl --fail http://127.0.0.1:3000/healthz` 检查服务。

更新源码部署：

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

引导流程会准备 Worker 项目。部署后打开 `/install` 并检查：

- D1 `gmshop-edge` 绑定为 `DB`。
- KV `gmshop-edge-cache` 绑定为 `CACHE`。
- 私有 R2 `gmshop-edge-files` 绑定为 `FILES`。
- 队列 `gmshop-edge-commerce` 绑定为 `COMMERCE_QUEUE`，死信队列为 `gmshop-edge-commerce-dlq`。
- 每分钟 Cron，以及按需配置的 Cloudflare Send Email `EMAIL` 绑定。

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

`predeploy` Hook 会创建或复用命名资源、应用远程迁移并构建 Worker。解析后的 D1/KV ID 仅注入 `dist/server/wrangler.json`，不会将账户专属 ID 写入可移植的 `wrangler.jsonc`。

## 首次安装

Docker 或 Bun 启动后，打开 `http://your-host:3000/install`。Workers 部署完成后，在 Worker URL 打开 `/install`。创建第一个根管理员前，先确认检测到的公开地址和 Allowed Hosts。

安装程序会创建第一个根管理员、受保护的内置商城角色、运行时密钥，以及必要的商业、汇率、身份验证和通知默认设置。它不会创建虚假商品、库存、服务商凭据或支付配置。

安装完成后：

1. 在 `/admin` 检查生成的系统设置，并备份运行时配置。
2. 配置品牌、注册、身份验证、邮件、商业、交付、保留策略和服务商设置。
3. 创建草稿商品，为其添加可售项目及库存、文件或自动化配置；通过发布检查后再公开商品。
4. 配置支付适配器，并在商城开放前完成真实服务商验收订单。

上线前应验证精确的 Host/Origin 规则、真实支付与找回密码邮件、库存/下载/自动化交付、队列重试与死信恢复、退款、权益到期、备份恢复、两种应用语言、主题、移动端、键盘导航和管理员恢复。
