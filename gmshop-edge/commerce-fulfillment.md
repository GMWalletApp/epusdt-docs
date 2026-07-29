# Commerce and Fulfillment

GMShop Edge is designed for digital-goods storefronts where the store owns catalog, checkout, inventory, entitlement, and fulfillment state.

## Product and entitlement model

The project supports combinations of:

- Permanent, fixed-term, limited, unlimited, free, one-time, and customer-renewed entitlements.
- Stock products backed by encrypted preset text such as license keys, accounts, activation codes, or credentials.
- Private download products stored in R2 and resolved through authorized D1 records.
- Automation products for deployments, scripts, resource provisioning, or build workflows.

Money is stored as decimal integer strings in minor units and is not computed with floating point.

## Supplier sourcing

GMShop Edge can synchronize upstream products from:

- ACG `3.5.5` V4 Open API.
- Dujiao Next `v1.3.1`.

The supplier module synchronizes one catalog per provider and API source, automatically selects from the eligible equal-priority account pool for that source, and passes upstream content through the unified delivery-record pipeline.

For local acceptance testing, the repository provides idempotent fixtures:

```bash
bun run seed:acceptance:local
# Also write product media, downloads, and automation artifacts
bun run seed:acceptance:local:r2
```

The seed uses disabled supplier accounts, `.example.invalid` origins, and disabled automatic synchronization, so it cannot contact real upstreams until you replace credentials and enable accounts in the admin console.

## Checkout identity

Registered ownership references Better Auth users directly. Guest orders use a verified checkout email until a matching verified account claims them. The system does not create a shadow account or separate customer table.

## Fulfillment and operations

Fulfillment work is routed through D1, R2, Queues, and Cron rather than depending on synchronous storefront requests. This covers supplier purchasing and reconciliation, delivery, notification, retry, retention, and key-rotation workflows.

The administration console also covers coupons, refunds, after-sales handling, operational retention, and audit records.
