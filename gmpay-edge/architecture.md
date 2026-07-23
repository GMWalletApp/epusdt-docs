# Architecture

GMPay Edge runs as one Cloudflare Worker that owns the product surface and the shared order/payment core.

## Product surfaces

- Merchant clients call the GMPay or EPay-compatible boundaries.
- Payers use the hosted checkout.
- Operators use `/admin`.
- Telegram users interact through the configured bot.

## Cloudflare runtime

| Binding | Cloudflare product | Purpose |
| --- | --- | --- |
| `DB` | D1 | Authoritative application, payment, authorization, and delivery data |
| `CACHE` | KV | Short-lived validated caches and ancillary telemetry |
| `FILES` | R2 | Private payment-review evidence and generated exports |
| `PAYMENT_QUEUE` | Queues | Asynchronous payment scanning |
| `WEBHOOK_QUEUE` | Queues | Asynchronous merchant Webhook delivery |

## Background work

Queues and Cron Triggers move payment scans and Webhook retries outside synchronous requests. They also handle payment expiry, cleanup, connection health checks, and rate sync.

Webhook delivery uses a Queue-backed outbox with retry history, manual retry, and audit records.

## Data and security model

- D1 is the authoritative application and payment database.
- KV stores short-lived validated caches.
- R2 stores private payment-review evidence and generated exports.
- Payment adapters are read-only.
- Administration uses Better Auth, TOTP, and dynamic multi-role RBAC.

## Protocol boundaries

GMPay uses **HMAC-SHA256** signatures. EPay compatibility remains a legacy **MD5** boundary. Outbound callbacks retain the originating protocol's signature format.
