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

Companies whose worldwide revenue with affiliates strictly exceeds USD 1,000,000 over the preceding 12 months need a paid license, including loss-making groups. Under the community terms, release, delivery or operational deployment of a modified version requires free public access to its exact corresponding source, prominent attribution and an original-project link. For each such version, including SaaS deployments, submit the exact revision upstream by pull request or a branch as described in section 13. GM Wallet decides whether to merge it. Separate written commercial terms may apply. [License](LICENSE) · [Contributor terms](CONTRIBUTING.md) · [info@gmwallet.app](mailto:info@gmwallet.app)
