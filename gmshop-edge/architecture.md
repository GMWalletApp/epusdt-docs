# Architecture

GMShop Edge runs the same React/TanStack full stack on Cloudflare Workers or Node/Nitro. One deployment owns the public shop, customer account area, checkout, fulfillment, supplier integration, Telegram integration, and administration console.

## Shared application boundaries

Routes remain thin. Feature pages, schemas, server functions, and domain behavior live under `src/features`; cross-domain runtime plumbing lives under `src/server`; Drizzle schemas live under `src/db/schema`.

The application keeps identity, RBAC, catalog, orders, inventory, entitlements, supplier state, wallet ledger, notifications, replay protection, rate limits, outbox, and audit data in the authoritative database. Money is stored as decimal integer strings in minor units and is never computed with floating point.

## Cloudflare Workers adapters

The Workers deployment uses:

- `DB`: D1 for authoritative application and commerce state.
- `FILES`: private R2 for product media, downloads, automation artifacts, and exports.
- `CACHE`: KV for validated, versioned, bounded read caches; security limits remain database-authoritative.
- `COMMERCE_QUEUE`: Queue for delivery, automation, notification, supplier, and refund work, with a dead-letter Queue.
- `EMAIL`: optional Cloudflare Send Email binding.
- One-minute Cron Triggers for scheduled processing and maintenance.

## Node/Nitro adapters

The Node runtime provides equivalent adapters inside one data directory:

- SQLite as the authoritative database.
- An in-process bounded cache.
- Private local object storage.
- A durable SQLite-backed Queue.
- A one-minute in-process scheduler.

`GMSHOP_DATA_DIR` contains the database, objects, Queue state, and runtime data. Node is deliberately **single-instance only**: multi-replica deployment and shared-network storage are unsupported.

## Data and background work

Private objects are resolved through authorized database records; clients never select object keys. Queue and scheduled work handle supplier synchronization and purchasing, fulfillment, notifications, refunds, retries, retention, Telegram maintenance, and key rotation outside synchronous storefront requests.

The clean-install migration baseline is `drizzle/0000_gmshop.sql`; later migrations are applied in order and their checksums are validated by Node data operations.
