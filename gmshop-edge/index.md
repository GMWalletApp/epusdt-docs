# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) is a self-hosted, single-deployment, single-tenant digital-goods storefront built for **Cloudflare Workers**.

One deployment provides a responsive public shop, customer accounts, checkout and fulfillment, and a permission-driven administration console for operating digital products.

> GMShop Edge is under active development. Built-in adapters mean the integration paths exist in the project; production use still requires deployer-owned provider credentials, backups, monitoring, and real-provider acceptance tests.

## What it provides

- Responsive public storefront, customer accounts, checkout, and a permission-driven administration console.
- Stock products that atomically allocate encrypted preset text such as license keys, accounts, activation codes, or credentials.
- Upstream supplier catalog synchronization from ACG `3.5.5` V4 Open API or Dujiao Next `v1.3.1`, with equal-priority account pools per API source.
- Private R2 download delivery, automation products, coupons, refunds, after-sales handling, retention, and audit records.
- Guest and registered checkout with one commerce identity model backed by Better Auth users and verified checkout email.
- Transactional email through SMTP, Resend, Postmark, SendGrid, Mailgun, or Cloudflare Send Email.
- Store-owned D1 exchange rates used to pass immutable quotes to typed checkout providers.
- Runtime-configured email/password, social, OIDC, and Telegram authentication providers.
- Dynamic multi-role RBAC for `/admin`, with a non-removable root invariant and server-side permission checks.
- English (`en-US`) and Simplified Chinese (`zh-CN`) UI locales.

## Documentation sections

- [Architecture](./architecture.md): Worker surface, Cloudflare bindings, data ownership, queues, and module boundaries.
- [Deployment](./deployment.md): Deploy Button, Wrangler CLI, bindings, local development, and first install.
- [Commerce and fulfillment](./commerce-fulfillment.md): Products, inventory, supplier sourcing, delivery records, customer ownership, and automation goods.
- [Checkout and providers](./checkout-providers.md): Store checkout model, fiat quotes, email, and authentication providers.

## Links

- Repository: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- English README: [README.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.md)
- Chinese README: [README.zh-CN.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.zh-CN.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
