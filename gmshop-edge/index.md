# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) is a self-hosted, single-deployment, single-tenant digital-goods storefront built for **Cloudflare Workers**.

It is a separate project from Epusdt and GMPay Edge. Epusdt and GMPay Edge are payment gateways; GMShop Edge is a store application. It sells digital goods, manages customer checkout and fulfillment, and calls outbound hosted-checkout adapters such as GMpay, EPay, Stripe, or other typed providers for its own store orders.

> GMShop Edge is under active development. Built-in adapters mean the integration paths exist in the project; production use still requires deployer-owned provider credentials, backups, monitoring, and real-provider acceptance tests.

## What it provides

- Responsive public storefront, customer accounts, checkout, and a permission-driven administration console.
- Stock products that atomically allocate encrypted preset text such as license keys, accounts, activation codes, or credentials.
- Upstream supplier catalog synchronization from ACG `3.5.5` V4 Open API or Dujiao Next `v1.3.1`, with equal-priority account pools per API source.
- Private R2 download delivery, automation products, coupons, refunds, after-sales handling, retention, and audit records.
- Guest and registered checkout with one commerce identity model backed by Better Auth users and verified checkout email.
- Transactional email through SMTP, Resend, Postmark, SendGrid, Mailgun, or Cloudflare Send Email.
- Store-owned D1 exchange rates used to pass immutable quotes to Stripe, GMpay, EPay, or another typed payment adapter.
- Runtime-configured email/password, social, OIDC, and Telegram authentication providers.
- Dynamic multi-role RBAC for `/admin`, with a non-removable root invariant and server-side permission checks.
- English (`en-US`) and Simplified Chinese (`zh-CN`) UI locales.

## Important boundary

GMShop Edge is **not** a payment gateway. It does not expose merchant API credentials or gateway order protocols, scan blockchains, or operate exchange/wallet receiving adapters. GMpay and EPay are outbound hosted-checkout adapters for the store's own orders only.

## Documentation sections

- [Architecture](./architecture.md): Worker surface, Cloudflare bindings, data ownership, queues, and module boundaries.
- [Deployment](./deployment.md): Deploy Button, Wrangler CLI, bindings, local development, and first install.
- [Commerce and fulfillment](./commerce-fulfillment.md): Products, inventory, supplier sourcing, delivery records, customer ownership, and automation goods.
- [Payment and providers](./payment-providers.md): Store payment model, fiat quotes, GMpay / EPay / Stripe adapter boundary, email, and authentication providers.

## Links

- Repository: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- English README: [README.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.md)
- Chinese README: [README.zh-CN.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.zh-CN.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
