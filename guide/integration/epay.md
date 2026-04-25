# EPay-Compatible Integration (Redirect Checkout)

Use this flow only when your upstream system expects an EPay-style redirect order entry.

## Route

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Merchant credential requirement

Incoming requests are **not** validated with deprecated env keys like `epay_pid` or `epay_key`.

Current source does this instead:

1. Read incoming `pid`
2. Find the enabled `api_keys` row with that PID
3. Verify `sign` with that row's `secret_key`
4. Apply optional IP whitelist check

## Required incoming fields

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

Optional common fields:

- `return_url`
- `name`
- `type`
- `sign_type`

## EPay defaults

After signature verification succeeds, current source builds the internal shared order payload with admin settings:

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

So update those values from the admin settings page if your redirect flow should target a different token, fiat currency, or network.

## Success behavior

On success, the endpoint redirects the browser to:

```text
/pay/checkout-counter/{trade_id}
```

## Callback verification

When the created order carries `payment_type = Epay`, the worker later calls your `notify_url` with EPay-style query parameters and signs them with the **same merchant `secret_key`**.

Do not verify those callbacks with an old standalone `epay_key`.
