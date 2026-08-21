# Commerce and Fulfillment

GMShop Edge owns catalog, checkout, inventory, entitlements, supplier purchasing, fulfillment, and after-sales state in one store deployment.

## Products and entitlements

The product types are:

- `stock`: atomically allocates encrypted preset text such as license keys, accounts, activation codes, or credentials.
- `download`: grants bounded access to private files.
- `automation`: runs deployments, scripts, resource provisioning, or build workflows with `none | optional | required` artifact policies.

Entitlements can be permanent, fixed-term, limited, unlimited, free, one-time, or customer-renewed. Orders preserve immutable input-definition, pricing, entitlement, fulfillment, and automation snapshots.

## Customer ownership and wallet

Registered orders reference Better Auth users directly. Guest orders retain a verified checkout email and can be claimed by a matching verified account; no shadow customer table is created.

Each account can use the store wallet. The ledger records integer minor-unit movements and supports payment, refund, and administration adjustments without floating-point money.

## Supplier sourcing

GMShop Edge supports:

- ACG `3.5.5` V4 Open API.
- Dujiao Next `v1.3.1`.
- Native GMShop Edge supplier-to-supplier integration.

The native supplier API uses administrator-created API keys, authenticated HTTP endpoints, catalog access, and idempotent order operations. Another GMShop Edge instance can use its built-in supplier adapter to synchronize products and fulfill through this API.

For each provider/API source, eligible accounts form an equal-priority pool. Catalog synchronization, purchasing, callback/reconciliation, and delivery pass through durable state machines and the unified delivery-record pipeline.

## Fulfillment and operations

Queue and scheduled work handle stock allocation, supplier purchasing, private-download delivery, automation jobs, notifications, refunds, retries, expiry, cancellation, retention, and manual recovery. Private object keys are never selected by client input.

For local acceptance fixtures:

```bash
bun run seed:local
```

The command is local-only and idempotent. It creates disabled supplier accounts with `.example.invalid` origins and cannot contact real upstreams until credentials are replaced and accounts are explicitly enabled.
