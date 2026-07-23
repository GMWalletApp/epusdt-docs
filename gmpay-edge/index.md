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

## Built-in payment integration catalog

Checkout exposure is controlled separately by configured receiving methods. A method must have the required public connection or read-only account configuration and pass availability checks before it can be offered to a payer.

| Type | Integration | Built-in assets |
| --- | --- | --- |
| On-chain | TRON / TRC20 | USDT, TRX |
| On-chain | Ethereum / ERC20 | USDT, USDC, ETH |
| On-chain | Base | USDT, USDC, ETH |
| On-chain | BNB Smart Chain / BEP20 | USDT, USDC, BNB |
| On-chain | Polygon | USDT, USDC, MATIC |
| On-chain | TON | USDT, GRAM |
| On-chain | Aptos | USDT, USDC |
| On-chain | Solana | USDT, USDC |
| Exchange | Binance | USDT, USDC |
| Exchange | OKX | USDT, USDC |
| Wallet | OKPay | USDT, TRX |

## Architecture summary

One Cloudflare Worker owns the product surface and the shared order/payment core:

- Merchant clients call the GMPay or EPay-compatible boundaries.
- Payers use the hosted checkout.
- Operators use `/admin`.
- Telegram users interact through the configured bot.
- D1 is the authoritative application and payment database.
- KV stores short-lived validated caches.
- R2 stores private payment-review evidence and generated exports.
- Queues and Cron Triggers move payment scans and Webhook retries outside synchronous requests.
- Payment adapters are read-only.

GMPay uses **HMAC-SHA256** signatures. EPay compatibility remains a legacy **MD5** boundary. Outbound callbacks retain the originating protocol's signature format.

## Deploy to Cloudflare Workers

GMPay Edge deploys as one Cloudflare Worker with these bindings:

| Binding | Cloudflare product | Purpose |
| --- | --- | --- |
| `DB` | D1 | Authoritative application, payment, authorization, and delivery data |
| `CACHE` | KV | Short-lived validated caches and ancillary telemetry |
| `FILES` | R2 | Private payment-review evidence and generated exports |
| `PAYMENT_QUEUE` | Queues | Asynchronous payment scanning |
| `WEBHOOK_QUEUE` | Queues | Asynchronous merchant Webhook delivery |

### Deploy button

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

The guided flow provisions the bindings declared by `wrangler.jsonc`, applies D1 migrations, and builds the Worker. Use:

- Build command: `bun run build`
- Deploy command: `wrangler deploy`

After deployment, open `/install` on the Worker URL to initialize the instance.

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

If D1 must be prepared manually:

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

Do not commit the generated database ID. The deployment hook creates or reuses the named D1, R2, and Queue resources, applies the D1 baseline through `DB`, and builds the Worker before publication.

## Local development

Requirements:

- Bun 1.3 or later
- A local environment supported by Wrangler

```bash
bun install
bun run dev
```

`bun run dev` applies pending migrations to the local `gmpay-edge` D1 database and starts the app at `http://localhost:3000`. Open `/install` on the first run. Installation creates the first user, protected `root` role, runtime secrets, payment defaults, public Telegram commands, and Telegram defaults. It does not create a Telegram Bot or call Telegram.

## Merchant integration

GMPay is the primary merchant protocol. EPay is a compatibility adapter over the same credential, order service, idempotency rules, state machine, checkout, query behavior, and callback pipeline.

### Create order

```text
POST /payments/gmpay/v1/order/create-transaction
```

Requests include numeric `pid` and a lowercase HMAC-SHA256 `signature` over sorted, non-empty parameters using the credential Secret as the HMAC key. Reusing an existing `order_id` does not create a second order. Omitting both `token` and `network` creates a selectable order; GMPay Edge does not silently default it to TRON.

### Query order

```text
GET /payments/gmpay/v1/order/query
```

Provide exactly one of `trade_id` or `order_id`, then sign the request with the same credential. A credential can query only orders it created.

### Receive callbacks

The merchant supplies `notify_url` when creating an order. Callback destinations must pass the instance SSRF and security policy. Delivered events have deterministic signatures, retained attempts, bounded retries, and an audited manual retry path. Handlers should verify the signature, process duplicate events idempotently, and acknowledge only after committing local state.

For authoritative fields and status values, use the deployed instance's `/docs` page or the repository's tracked OpenAPI contract: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml).

## Links

- Repository: [GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- English README: [README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- Chinese README: [README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
