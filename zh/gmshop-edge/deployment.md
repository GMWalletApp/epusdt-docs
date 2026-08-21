# 部署

GMShop Edge 支持单个 Cloudflare Workers 部署或单个 Node/Nitro Docker 容器。无论选择哪种方式，接单前都必须完成 `/install` 初始化。

> 当前版本为 `v1.0.0-alpha.1`。测试时使用滚动 `alpha` 镜像或完整预发布版本标签；`latest` 保留给稳定版本。

## Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

使用 CLI 部署：

```bash
bun install
bunx wrangler login
bun run deploy
```

`predeploy` Hook 会创建或复用命名的 D1、KV、私有 R2、商业队列和死信队列，应用远程迁移并构建 Worker。解析后的 D1/KV ID 仅注入 `dist/server/wrangler.json`，不会把账户专属 ID 写入可移植的 `wrangler.jsonc`。

部署后检查：

- D1 `gmshop-edge` 绑定为 `DB`。
- KV `gmshop-edge-cache` 绑定为 `CACHE`。
- 私有 R2 `gmshop-edge-files` 绑定为 `FILES`。
- 队列 `gmshop-edge-commerce` 绑定为 `COMMERCE_QUEUE`，死信队列为 `gmshop-edge-commerce-dlq`。
- 每分钟 Cron，以及按需配置的 Cloudflare Send Email `EMAIL` 绑定。

## Node 与 Docker

公共镜像 `ghcr.io/gmwalletapp/gmshop-edge` 支持 `linux/amd64` 和 `linux/arm64`。当前预发布版本请将 `compose.yml` 中的镜像标签改为 `alpha` 或 `1.0.0-alpha.1`：

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

容器以非 root 用户运行，并将全部状态持久化到 `/var/lib/gmshop`。`GMSHOP_DATA_DIR` 是唯一公开的 Node 环境变量；Origin、Allowed Hosts、邮件、支付、供应商、Telegram 和自动化设置均通过 `/install` 或 `/admin` 配置。重建容器时必须保留数据卷。

源码构建需要 Bun 1.3+ 和 Node.js 24：运行 `bun run build:node`，再执行 `bun run start:node`。

升级或迁移前请先阅读 [Node 数据操作](./node-data-operations.md)。

## 首次安装与生产验收

打开 `/install` 创建第一个根管理员、受保护的内置角色、运行时密钥和必要设置。安装程序不会创建虚假商品、库存、服务商凭据或支付配置。

上线前应完成：

1. 确认检测到的 Origin，并配置精确的 Allowed Hosts。
2. 配置品牌、注册、身份验证、邮件、商业、交付、保留、支付、供应商、Telegram 和自动化设置。
3. 发布测试商品，验证库存、私有下载或自动化交付。
4. 使用部署者自己的凭据完成真实支付和找回密码邮件测试。
5. 验证重启恢复、队列重试/死信处理、退款、权益到期、备份与恢复。
6. 验证两种应用语言、两种主题、移动端、键盘导航和管理员恢复。

## 发布通道

Semantic Release 从 `alpha` 通道发布预览版本，从 `main` 发布稳定版本。原生 amd64 和 arm64 任务会先完成镜像冒烟测试，再发布带 SBOM 与 provenance 的多架构 GHCR Manifest。
