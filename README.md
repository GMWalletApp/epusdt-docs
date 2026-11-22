# epusdt-docs

[简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · English

> Documentation for [Epusdt](https://github.com/GMWalletApp/epusdt) — a self-hosted multi-chain crypto payment gateway written in Go, with GMPay API, EPay-compatible redirect checkout, hosted cashier pages, and an admin-managed merchant credential model.

## Local development

```bash
bun install
bun run docs:dev
```

## Build

```bash
bun run docs:build
```

## Production deployment

Cloudflare Workers Builds watches `main` in this repository. A push or merged pull request triggers `npx wrangler deploy` from the repository root. Wrangler runs `bun install && bun run docs:build` and serves the files in `.vitepress/dist` at [epusdt.com](https://epusdt.com).

To check a release, open the **epusdt-docs** Worker in Cloudflare, find the build for the merged commit, and check the updated page on the public site. If the build reports a deleted or rotated token, select a valid deployment token under **Settings → Builds** and retry that commit.

## License

[AGPL-3.0](https://github.com/GMWalletApp/epusdt-docs/blob/main/LICENSE)
