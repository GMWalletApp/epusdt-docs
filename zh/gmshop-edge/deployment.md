# 部署

GMShop Edge 以单个 Cloudflare Worker 部署，并使用 D1、KV、私有 R2、一个 commerce Queue、死信 Queue、可选 Cloudflare Send Email 与 Cron Triggers。

## 一键部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

引导流程会基于仓库建立 Worker 项目。完成后请开启 `/install`，核对自动建立的资源 bindings，并在接收订单前完成生产检查清单。

## Wrangler CLI

登录 Wrangler、安装依赖并部署：

```bash
bun install
bunx wrangler login
bun run deploy
```

`bun run deploy` 会使用仓库的 `predeploy` hook：

```text
bun run scripts/build.ts --remote
```

该 hook 会建立或复用具名 D1、R2 与 Queue 资源，通过 `DB` 套用 D1 基线并构建 Worker；不会把账号专属 ID 写入 `wrangler.jsonc`。

请在 Cloudflare 部署环境中配置 `CACHE` KV namespace，以及启用时需要的 `EMAIL` binding。服务商秘密从管理后台录入，禁止提交到仓库。

## 本地开发

环境要求：

- Bun 1.3 或更高版本。
- Wrangler 支持的本地运行环境。

```bash
bun install
bun run dev
```

`bun run dev` 会将待执行 migration 套用到本地 `gmshop-edge` D1 数据库，并在 `http://localhost:3000` 启动应用；它不会迁移远端数据库。

## 首次安装

首次执行请开启 `/install`。安装会建立首位 root 管理员、受保护的内建角色、运行时秘密与必要设置。

它不会建立假商品、库存、服务商凭证或结账 Provider 配置。

安装完成后：

1. 确认自动识别的应用地址，并配置精确 Allowed Hosts。
2. 在 `/admin` 配置公开品牌、注册、认证、邮件、交易、交付、保留与 Provider 设置。
3. 建立商品草稿、可售项及库存、文件或自动化配置，检查发布条件后再公开。
4. 配置结账 Provider，并在正式开店前完成一笔真实服务商验收订单。
5. 备份 D1、私有 R2 数据与运行时配置。

## 常用开发命令

```bash
bun run db:migrate:local
bun run generate-routes
bun run typecheck
bun run test
bun run check
bun run build
```

只有在有意修改 Drizzle schema 时才执行 `bun run db:generate`，并检查产生的 migration。日常开发只套用 migration，不重新产生全新安装基线。
