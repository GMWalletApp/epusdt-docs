# epusdt-docs

简体中文 · [繁體中文](README.zh-TW.md) · [English](README.md)

> [Epusdt](https://github.com/GMWalletApp/epusdt) 的文档站 —— 基于 Go 的私有化多链加密支付网关，提供 GMPay API、EPay 兼容跳转收银台，以及由后台管理的商户 PID / secret_key 模式。

## 本地开发

```bash
bun install
bun run docs:dev
```

## 构建

```bash
bun run docs:build
```

## 生产部署

Cloudflare Workers Builds 监听本仓库的 `main` 分支。推送或合并 PR 后，Cloudflare 会在仓库根目录执行 `npx wrangler deploy`。Wrangler 运行 `bun install && bun run docs:build`，并将 `.vitepress/dist` 中的静态文件发布到 [epusdt.com](https://epusdt.com)。

核对发布时，在 Cloudflare 的 **epusdt-docs** Worker 中找到对应合并提交的构建记录，再打开线上页面核对内容。如果日志提示部署令牌已删除或轮换，在 **Settings → Builds** 中为该站选用有效的部署令牌，再重试这次构建。

## 许可

[AGPL-3.0](LICENSE)
