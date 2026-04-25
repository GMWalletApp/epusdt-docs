# API Reference

## Live public routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/payments/gmpay/v1/order/create-transaction` | Recommended order creation API |
| `GET` | `/payments/gmpay/v1/supported-assets` | List enabled network/token combinations with available wallets |
| `GET` / `POST` | `/payments/epay/v1/order/create-transaction/submit.php` | EPay-compatible redirect create-order entry |
| `POST` | `/pay/switch-network` | Switch token/network from hosted checkout |
| `GET` | `/pay/checkout-counter/:trade_id` | Hosted cashier page |
| `GET` | `/pay/check-status/:trade_id` | Poll hosted checkout status |

## Admin API surface

Management APIs live under `/admin/api/v1/*` and are JWT-protected except login and initial password endpoints.

Key groups visible in current source:

- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/supported-assets`
- chain / chain token management
- wallet address management
- settings management

## Merchant credential rules

### GMPay

- Required merchant identifier: `pid`
- Signature field: `signature`
- Signature key: the `secret_key` of the enabled `api_keys` row matching `pid`

### EPay-compatible flow

- Required merchant identifier: `pid`
- Signature field: `sign`
- Signature key: the `secret_key` of the enabled `api_keys` row matching `pid`
- `sign_type` is accepted and typically `MD5`

## Recommended integration order

1. Create or inspect merchant credentials in the admin panel (`pid` + `secret_key`)
2. Query `/payments/gmpay/v1/supported-assets` if the client needs dynamic network/token options
3. Prefer GMPay for new integrations
4. Use EPay-compatible redirect only when the upstream system expects that flow
5. Verify callbacks with the same merchant `secret_key`
