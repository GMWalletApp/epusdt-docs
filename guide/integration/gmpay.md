# GMPay Integration (Recommended)

Use GMPay for all new integrations.

## Route

```text
POST /payments/gmpay/v1/order/create-transaction
```

## Merchant credential requirement

Before calling the API, create or inspect an API key row in the admin panel.

You need:

- `pid`
- `secret_key`

`pid` must be sent in the request, and `secret_key` is the signing key.

## Minimal request body

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "signature": "hmac-sha256-hex(...)"
}
```

## Signature rule

> Since `v2.0.0`, GMPay uses HMAC-SHA256 instead of MD5. Upgrade clients before deploying v2 or they will receive `401 Unauthorized`. EPay-compatible requests are not affected.

1. Keep all non-empty fields except `signature`
2. Sort by ASCII key order
3. Join as `key=value&...`
4. Calculate HMAC-SHA256 with merchant `secret_key` as the HMAC key
5. Send the lowercase 64-character hex digest as `signature`

## Useful companion routes

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

If the client needs dynamic network/token options, read them from `data.supported_assets` in the `/payments/gmpay/v1/config` response.

That same config response also exposes public cashier branding (`data.site`) plus EPay / OkPay frontend defaults (`data.epay`, `data.okpay`).

## Callback verification

GMPay callbacks are sent as JSON `POST` to `notify_url`.

Verify the returned `signature` with the same HMAC-SHA256 rule and merchant `secret_key`, then reply with exact plain text `ok`.

## Success response note

Current source includes `payment_url` in successful create-order responses, so the caller has an explicit hosted-checkout redirect target instead of reconstructing that URL manually.
