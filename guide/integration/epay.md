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
- `token`
- `network`
- `currency`
- `sign_type`

`type` now has two supported shapes:

- `alipay` — compatibility value; token/network are resolved from explicit `token` + `network` request parameters, then from admin EPay defaults.
- `token.network` selector such as `usdt.tron` — accepted only when that token/network pair is currently supported. A valid selector overrides `token`, `network`, `epay.default_token`, and `epay.default_network`.

Other non-empty `type` values are rejected as invalid parameters. The selected or compatibility `type` is stored on the order for later EPay return/notify callbacks.

## EPay defaults

After signature verification succeeds, current source builds the internal shared order payload with admin settings:

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

Resolution order for EPay submit.php is:

1. Supported `type=token.network` selector, if supplied
2. Explicit request `token` / `network` parameters
3. Admin `epay.default_token` / `epay.default_network`
4. If both token and network are still empty, create a status `4` placeholder order for the cashier selection flow

Currency is independent: request `currency` → `epay.default_currency` → `cny`.

## Success behavior

On success, the endpoint redirects the browser to:

```text
/pay/checkout-counter/{trade_id}
```

In current source, that path is now the redirect entry for the hosted cashier SPA. The checkout page data is served through:

```text
/pay/checkout-counter-resp/{trade_id}
```

## Callback verification

When the created order carries `payment_type = Epay`, the worker later calls your `notify_url` with EPay-style query parameters and signs them with the **same merchant `secret_key`**.

The callback `type` reuses the stored request type. That means it returns either `alipay` or the accepted selector such as `usdt.tron`. If the request omitted `type`, outbound callbacks fall back to `alipay` for compatibility.

Do not verify those callbacks with an old standalone `epay_key`.
