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

**Success response note**

Current source includes `payment_url` in the create-order success payload, so callers can use that field directly as the hosted-checkout redirect target.

## 2. GMPay public config

```text
GET /payments/gmpay/v1/config
```

Current source returns frontend-facing payment config in one payload.

Important fields inside `data` include:

- `supported_assets` — enabled chain/token pairs that also have at least one available wallet address
- `site` — public cashier branding: cashier name, logo URL, website title, support link, `background_color`, and `background_image_url`
- `epay` — EPay default token / currency / network
- `okpay` — public OkPay toggle / token allowance config
- `amount_precision` — decimal places used when computing crypto amounts (range 2–6, default 2; configured via `system.amount_precision`)

So if a client needs dynamic network/token options, read them from `data.supported_assets` instead of hardcoding a docs-era static list.

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
| `type` | ❌ | Accepted for compatibility, but current source does not persist it into the shared order payload |
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
- `type` *(currently fixed to `alipay`, not inherited from the inbound create-order request)*
- `name`
- `money`
- `trade_status`
- `sign`
- `sign_type=MD5`

Verify `sign` with the same merchant `secret_key`, then return exact plain text `ok`.

Important: in current source, the inbound EPay `type` field is accepted as a compatibility parameter, but it is not written into the shared order payload. The later EPay callback currently emits a fixed `type=alipay` value instead of replaying the merchant's inbound `type`.

## 5. Switch network

```text
POST /pay/switch-network
```

JSON body:

```json
{
  "trade_id": "3nQ9pL2xV7sK1mR8cT4yB_aZ",
  "token": "USDT",
  "network": "ethereum"
}
```

Use this from the hosted cashier flow to switch to another network / token combination.

Current source also accepts the special value `network=okpay`, which creates or reuses an OkPay-hosted child order and returns its `payment_url`.

## 6. OkPay callback entry

```text
POST /payments/okpay/v1/notify
```

This is the server-side callback entry consumed by the OkPay payment flow in current source. Normal merchant integrations do not call it directly from the browser.
