# API Reference

## Live public routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/payments/gmpay/v1/order/create-transaction` | Recommended order creation API |
| `GET` | `/payments/gmpay/v1/config` | Return public payment config including `supported_assets`, site branding, EPay defaults, OkPay frontend config, and server `version` |
| `GET` / `POST` | `/payments/epay/v1/order/create-transaction/submit.php` | EPay-compatible redirect create-order entry |
| `POST` | `/payments/okpay/v1/notify` | OkPay server-side callback entry |
| `POST` | `/pay/switch-network` | Switch token/network from hosted checkout; accepts on-chain networks and `okpay` |
| `GET` | `/pay/checkout-counter/:trade_id` | Redirect entry that sends the browser into the hosted cashier SPA |
| `GET` | `/pay/checkout-counter-resp/:trade_id` | JSON payload used by the hosted cashier SPA |
| `GET` | `/pay/check-status/:trade_id` | Poll hosted checkout status |
| `POST` | `/pay/submit-tx-hash/:trade_id` | Submit an on-chain transaction hash from the cashier for a waiting order |

## Admin API surface

Management APIs live under `/admin/api/v1/*` and are JWT-protected except login and initial password endpoints.

Key groups visible in current source:

- Admin manual mark-paid accepts waiting or expired on-chain orders after transaction verification; public cashier hash submission remains waiting-order only.
- Rate settings: `rate.mode` can be `fixed` or `auto`. Fixed mode uses `rate.forced_rate_list`; auto mode fetches `rate.api_url`, caches successful base-currency responses, and keeps the last durable cache when refreshes fail. Empty `rate.forced_rate_list` restores the built-in CNY USDT/USDC default.
- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- chain / chain token management
- wallet address management
- settings management

## Merchant credential rules

### GMPay

- Required merchant identifier: `pid`
- Signature field: `signature`
- Signature algorithm since `v2.0.0`: HMAC-SHA256 over the canonical non-empty parameter string, keyed by the enabled `api_keys.secret_key` matching `pid`
- Pre-v2 GMPay MD5 clients must be upgraded before deploying `v2.0.0` or later

### EPay-compatible flow

- Required merchant identifier: `pid`
- Signature field: `sign`
- Signature key: the `secret_key` of the enabled `api_keys` row matching `pid`
- `sign_type` is accepted and typically `MD5`
- EPay `type` accepts `alipay` or a supported `token.network` selector such as `usdt.tron`; accepted selectors are preserved in EPay return/notify callbacks.

## Recommended integration order

1. Create or inspect merchant credentials in the admin panel (`pid` + `secret_key`)
2. Query `/payments/gmpay/v1/config` and read `data.supported_assets` if the client needs dynamic network/token options
3. Prefer GMPay for new integrations
4. Use EPay-compatible redirect only when the upstream system expects that flow
5. Verify callbacks with the same merchant `secret_key`
