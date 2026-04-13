# API Reference

This section documents the current Epusdt HTTP API baseline based on the official source.

## Base URL

Use your deployed Epusdt server as the base URL, for example:

```text
http://your-server:8000
```

For production, place Epusdt behind HTTPS:

```text
https://pay.example.com
```

::: info
Current source registers routes at root-relative paths such as `/payments/...` and `/pay/...`.

If you deploy Epusdt under an external subpath like `https://example.com/epusdt`, that prefix must be handled by your reverse proxy or ingress. It is not a built-in router prefix inside the app.
:::

## Authentication and Signing

Current source does **not** implement separate bearer-token, query-token, or request-body token authentication for payment creation.

What the live payment endpoints validate is the request `signature`, generated with the `.env` value `api_auth_token`.

Current source also adds token-authenticated wallet management APIs. Those endpoints accept either:

- `Authorization: <api_auth_token>` header, or
- `?api_token=<api_auth_token>` query parameter

::: warning
Keep `api_auth_token` secret. Never expose it in frontend code, mobile apps, or public repositories.
:::

## Request Signature

Signature algorithm: **MD5**

Rules:

1. Collect all non-empty parameters except `signature`
2. Sort by key in ASCII ascending order
3. Join as `key=value&key=value`
4. Append `api_auth_token` directly to the end
5. Compute lowercase MD5

Example:

```text
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirect
```

Append token:

```text
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirectepusdt_password_xasddawqe
```

## Request Format

- Method: `POST`
- Content-Type: `application/json`
- Encoding: UTF-8

::: warning
Current source registers `create-transaction` as `POST` only, and signature middleware parses the raw body as JSON before verification. In practice, `GET` and `application/x-www-form-urlencoded` requests are not valid for this endpoint.
:::

## Response Format

For JSON API endpoints, current source returns **HTTP 200** for both success and failure envelopes. Check the top-level `status_code` field for the business result.

Successful responses use this shape:

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "202203271648380592218340",
    "order_id": "9",
    "amount": 53,
    "currency": "cny",
    "actual_amount": 7.9104,
    "receive_address": "TNEns8t9jbWENbStkQdVQtHMGpbsYsQjZK",
    "token": "usdt",
    "expiration_time": 1648381192,
    "payment_url": "http://example.com/pay/checkout-counter/202203271648380592218340"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

## Status Codes

Current source uses top-level `status_code` for API results:

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | System error or request validation failure |
| `401` | Signature verification failed |
| `10001` | Wallet address already exists |
| `10002` | Order already exists |
| `10003` | No available wallet address |
| `10004` | Invalid payment amount |
| `10005` | No available amount channel |
| `10006` | Rate calculation failed |
| `10007` | Block transaction already processed |
| `10008` | Order does not exist |
| `10009` | Failed to parse request params |
| `10010` | Order status already changed |
| `10011` | Cannot switch a child order again |
| `10012` | Order is not in waiting-for-payment status |
| `10013` | Child order limit exceeded |

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/payments/epusdt/v1/order/create-transaction` | Create a payment transaction; legacy-compatible route that injects default `token=usdt`, `currency=cny`, `network=tron` after signature verification when omitted |
| `POST` | `/payments/gmpay/v1/order/create-transaction` | Create a payment transaction without legacy default injection, so `currency`, `token`, and `network` must be sent explicitly |
| `GET` | `/payments/epay/v1/order/create-transaction/submit.php` | EPay-compatible create-order entrypoint that redirects to hosted checkout |
| `POST` | `/payments/gmpay/v1/wallet/add` | Add wallet address for a specific network, token-authenticated |
| `GET` | `/payments/gmpay/v1/wallet/list` | List wallets, optional `network` filter, token-authenticated |
| `GET` | `/payments/gmpay/v1/wallet/:id` | Get one wallet, token-authenticated |
| `POST` | `/payments/gmpay/v1/wallet/:id/status` | Enable or disable wallet (`status` = `1` or `2`), token-authenticated |
| `POST` | `/payments/gmpay/v1/wallet/:id/delete` | Delete wallet, token-authenticated |
| `GET` | `/pay/checkout-counter/:trade_id` | Hosted checkout page |
| `GET` | `/pay/check-status/:trade_id` | Checkout status polling endpoint |
| `POST` | `/pay/switch-network` | Switch hosted checkout to another token/network and possibly create a child order |

::: tip
The live API prefix is `/payments/...`. The older `/api/v1/order/create-transaction` path is legacy documentation, not a registered route in current source.
:::

## Prefix Distinctions

Keep these prefixes separate:

- `/payments/...` — live API routes for order creation
- `/pay/...` — hosted checkout and status polling routes
- `app_uri` — external absolute base used to build absolute URLs such as `payment_url`

Example:

```text
app_uri = https://pay.example.com
payment_url = https://pay.example.com/pay/checkout-counter/{trade_id}
```

If you expose Epusdt through a proxy path such as `/epusdt`, clients may see URLs like:

```text
https://example.com/epusdt/pay/checkout-counter/{trade_id}
```

That deployment prefix comes from proxy configuration plus `app_uri`, not from an internal route group in the Go router.

## Security Recommendations

- Keep `api_auth_token` secret and server-side only
- Always use HTTPS in production
- Prefer sending `currency`, `token`, and `network` explicitly even on the legacy-compatible `/payments/epusdt/v1/...` route, so your integration does not depend on compatibility defaults
- Use lowercase network identifiers from current source, such as `tron`, `solana`, and `ethereum`
- Verify callback signatures before marking orders paid
- Treat callback success as **HTTP 200 + exact body `ok`**
- Restrict access to `.env` and admin surfaces
- Use a stable `tron_grid_api_key` for TRC20 monitoring
- For Solana and Ethereum monitoring, configure `solana_rpc_url` and `ethereum_ws_url`

## Next Step

- [Payment API](/api/payment) — create-order, callback, status, and example details
