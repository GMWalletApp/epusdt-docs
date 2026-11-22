---
description: "Look up EPUSDT route paths and HTTP methods for merchant orders, checkout and payment status, then open the signing and callback examples."
title: "Payment API endpoint reference"
---

# API Reference

See [Merchant API](/api/payment) for signing examples, order states and callback verification.

## Live public routes

| Purpose | Method | Path | Authentication |
| --- | --- | --- | --- |
| [Create a GMPay order](/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | Merchant HMAC-SHA256 |
| [Read checkout configuration](/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | Public |
| [Open hosted checkout](/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | Public |
| [Read checkout details](/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | Public |
| [Poll order status](/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | Public |
| [Select a network or provider](/api/endpoints/switch-network) | POST | `/pay/switch-network` | Public |
| [Submit a transaction hash](/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | Public |
| [Return to the merchant](/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | Browser redirect |
| [Create an EPay order](/api/endpoints/epay-order) | GET or POST | `/payments/epay/v1/order/create-transaction/submit.php` | Merchant MD5 |
| [Receive an OKPay notification](/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | OKPay signature |

## Admin API surface

Management APIs live under `/admin/api/v1/*` and are JWT-protected except login and initial password endpoints.

Key groups visible in current source:

- The public cashier accepts a hash for a waiting on-chain order. An administrator can also recheck an expired order or a candidate in manual review.
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
