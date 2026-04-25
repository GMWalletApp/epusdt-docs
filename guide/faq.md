# FAQ

## Which route should I use?

- **Use GMPay** for all new integrations.
- **Use EPay-compatible redirect** only when the upstream system expects an EPay-style cashier redirect.
- Do **not** build new integrations on `/payments/epusdt/v1/order/create-transaction` because that route is no longer registered in current source.

## Where do `pid` and signing keys come from?

From the admin panel API key records. Each merchant has a `pid` and a matching `secret_key`.

## Why does supported-assets differ between environments?

Because `/payments/gmpay/v1/supported-assets` is computed from enabled chains, enabled chain tokens, and available wallet addresses in your own admin data.
