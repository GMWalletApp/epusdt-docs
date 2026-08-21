# Architecture

GMPay Edge runs as one Worker or one Node/Nitro container. Both runtimes own the same product surfaces and shared order/payment core; only the infrastructure adapters differ.

## Product surfaces

- Merchant clients call the GMPay or EPay-compatible boundaries.
- Payers use the hosted checkout.
- Operators use `/admin`.
- Telegram users interact through the configured bot.

## Runtime services

| Capability | Cloudflare Workers | Node/Nitro Docker |
| --- | --- | --- |
| Database | D1 | SQLite in `GMPAY_DATA_DIR` |
| Cache | KV | Local runtime cache |
| Private objects | R2 | Persistent local object storage |
| Background work | Cloudflare Queues | Durable local queues |
| Scheduling | Cron Triggers | Node scheduler |

The Node data directory also contains uploaded files and durable queue state. It must be mounted to a persistent volume and included in backups.

## Cloudflare bindings

| Binding | Cloudflare product | Purpose |
| --- | --- | --- |
| `DB` | D1 | Authoritative application, payment, authorization, and delivery data |
| `CACHE` | KV | Short-lived validated caches and ancillary telemetry |
| `FILES` | R2 | Private payment-review evidence and generated exports |
| `PAYMENT_QUEUE` | Queues | Asynchronous payment scanning |
| `WEBHOOK_QUEUE` | Queues | Asynchronous merchant Webhook delivery |

## Background work

Runtime-specific durable queues and schedulers move payment scans and Webhook retries outside synchronous requests. They also handle payment expiry, cleanup, connection health checks, and rate sync.

Webhook delivery uses a durable outbox with retry history, manual retry, and audit records on either runtime.

## Data and security model

- D1 or SQLite is authoritative for the selected runtime.
- Cache and private-object storage use the selected runtime's adapters.
- Payment adapters are read-only.
- Administration uses Better Auth, TOTP, and dynamic multi-role RBAC.

## Protocol boundaries

GMPay uses **HMAC-SHA256** signatures. EPay compatibility remains a legacy **MD5** boundary. Outbound callbacks retain the originating protocol's signature format.
