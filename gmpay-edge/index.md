# GMPay Edge

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge) is a self-hosted, single-tenant cryptocurrency payment gateway built for **Cloudflare Workers**.

It is a separate project from Epusdt. Use Epusdt when you want the Go gateway documented by this site; evaluate GMPay Edge when you want an edge-native deployment that runs on Cloudflare Workers with D1, KV, R2, Queues, and Cron Triggers.

> GMPay Edge is under active development. Built-in integrations mean the capability exists in the project; production use still requires deployer-owned endpoints or read-only credentials, configured receiving methods, backups, monitoring, and real-platform acceptance tests.

## What it provides

- Signed GMPay merchant APIs with JSON and form input.
- EPay compatibility at the API boundary without maintaining a separate order model.
- Responsive checkout, admin console, public status pages, and runtime OpenAPI documentation.
- Durable Webhook delivery through a Queue-backed outbox with retry history, manual retry, and audit records.
- Payment scanning, expiry, cleanup, connection health, and rate sync through Cloudflare Queues and Cron Triggers.
- Better Auth, TOTP, and dynamic multi-role RBAC for administration.
- Telegram Bot automation through grammY, including Inline orders, public commands, and notification subscriptions.
- Six UI locales.

## Documentation sections

- [Architecture](./architecture.md): Worker surface, Cloudflare bindings, queues, callbacks, and protocol boundaries.
- [Deployment](./deployment.md): Deploy Button, Wrangler CLI, D1 preparation, local development, and first install.
- [Merchant API](./merchant-api.md): GMPay order creation, query, signatures, callbacks, and EPay compatibility.
- [Payment integrations](./payment-integrations.md): Built-in on-chain, exchange, and wallet adapter catalog.

## Links

- Repository: [GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- English README: [README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- Chinese README: [README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
