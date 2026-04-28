# Payment API

## 1. GMPay create transaction

**Route**

```text
POST /payments/gmpay/v1/order/create-transaction
```

**Required fields**

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `pid` | string / integer | ✅ | Merchant identifier. Required by signature middleware. |
| `order_id` | string | ✅ | Max 32 chars |
| `currency` | string | ✅ | Example: `cny` |
| `token` | string | ✅ | Example: `usdt` |
| `network` | string | ✅ | Example: `tron` |
| `amount` | number | ✅ | Must be > `0.01` |
| `notify_url` | string | ✅ | Async callback URL |
| `signature` | string | ✅ | MD5 of sorted params + merchant `secret_key` |
| `redirect_url` | string | ❌ | Redirect after payment |
| `name` | string | ❌ | Display name |
| `payment_type` | string | ❌ | Optional source marker |

**Example request**

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "redirect_url": "https://merchant.example.com/return",
  "name": "VIP Plan",
  "signature": "md5(...)"
}
```

## 2. Supported assets

```text
GET /payments/gmpay/v1/supported-assets
```

Returns enabled chain/token pairs that also have at least one available wallet address. The result is computed from admin data, so do not hardcode a docs-era static list.

## 3. EPay-compatible redirect create-order

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

**Incoming parameters**

| Field | Required | Notes |
| --- | --- | --- |
| `pid` | ✅ | Merchant PID; looked up in `api_keys` |
| `money` | ✅ | Fiat amount |
| `out_trade_no` | ✅ | Merchant order ID |
| `notify_url` | ✅ | Callback URL |
| `return_url` | ❌ | Browser return URL |
| `name` | ❌ | Product name |
| `type` | ❌ | Client-facing payment label |
| `sign` | ✅ | MD5 signature using merchant `secret_key` |
| `sign_type` | ❌ | Usually `MD5` |

Current source verifies `sign`, checks the matched API key whitelist, then internally builds a shared order payload using admin settings:

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

On success the endpoint redirects to `/pay/checkout-counter/{trade_id}`.

In current source, that route now acts as a redirect entry and forwards the browser into the SPA cashier flow. The checkout data itself is fetched from `/pay/checkout-counter-resp/{trade_id}`.

## 4. Callback behavior

### Standard callback (GMPay / normal JSON flow)

Epusdt sends a **POST JSON** callback to `notify_url` after payment confirmation.

Important fields include:

- `pid`
- `trade_id`
- `order_id`
- `amount`
- `actual_amount`
- `receive_address`
- `token`
- `block_transaction_id`
- `status`
- `signature`

Verify `signature` with the same merchant `secret_key`, then return exact plain text `ok`.

### EPay callback

When the order `payment_type` is `Epay`, current worker sends a **GET** request to `notify_url` with query parameters such as:

- `pid`
- `trade_no`
- `out_trade_no`
- `type`
- `name`
- `money`
- `trade_status`
- `sign`
- `sign_type=MD5`

Verify `sign` with the same merchant `secret_key`, then return exact plain text `ok`.

## 5. Switch network

```text
POST /pay/switch-network
```

JSON body:

```json
{
  "trade_id": "T2026041612345678",
  "token": "USDT",
  "network": "ethereum"
}
```

Use this from the hosted cashier flow to switch to another network / token combination.
