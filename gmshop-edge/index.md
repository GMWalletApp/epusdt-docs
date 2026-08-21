# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) is a self-hosted, single-deployment, single-tenant digital-goods storefront for **Cloudflare Workers** or a **Node/Nitro Docker container**.

One deployment provides a responsive public shop, customer accounts, checkout and fulfillment, Telegram integration, supplier operations, and a permission-driven administration console.

> GMShop Edge is under active development. The current release is [`v1.0.0-alpha.1`](https://github.com/GMWalletApp/gmshop-edge/releases/tag/v1.0.0-alpha.1). Built-in adapters mean integration paths exist; production use still requires deployer-owned credentials, backups, monitoring, and real-provider acceptance tests.

## What it provides

- Stock products that atomically allocate encrypted preset text, private-download products, and automation products with explicit artifact policies.
- Permanent, fixed-term, limited, unlimited, free, one-time, and customer-renewed entitlements.
- Guest and registered checkout, coupons, refunds, after-sales handling, private order lookup, and account-based delivery access.
- Store wallet payments plus Stripe, Cryptomus, GMpay, EPay, Alipay Page/WAP, and WeChat Native/H5 adapters.
- Supplier catalog synchronization and fulfillment through ACG `3.5.5`, Dujiao Next `v1.3.1`, or the native GMShop Edge supplier API.
- Runtime-configured email/password, social, OIDC, Telegram OIDC, Telegram Login Widget, and Telegram Mini App authentication.
- A grammY webhook bot with localized commands, Mini App buttons, and optional Forum Topic-backed customer support without persisting message content.
- Dynamic multi-role RBAC for `/admin`, with root-account protection, server-side permission checks, reauthentication, and audit records.
- English (`en-US`) and Simplified Chinese (`zh-CN`) application locales.

Every capability listed above is part of the open-source project; there is no separate Pro or Enterprise tier.

## Documentation sections

- [Architecture](./architecture.md): shared application stack, Workers bindings, Node adapters, data ownership, and runtime limits.
- [Deployment](./deployment.md): Workers, Node/Docker, release channels, installation, and production acceptance.
- [Node data operations](./node-data-operations.md): backup, restore, and Cloudflare D1/R2 import.
- [Commerce and fulfillment](./commerce-fulfillment.md): products, inventory, suppliers, delivery records, entitlements, and automation goods.
- [Checkout and providers](./checkout-providers.md): wallet and external payments, fiat quotes, email, authentication, and Telegram support.

## Links

- Repository: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- Deployment checklist: [`docs/DEPLOYMENT.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.md)
- Node data operations: [`docs/NODE_DATA_OPERATIONS.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
