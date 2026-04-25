# API Migration

Current source **does not register** the old route `POST /api/v1/order/create-transaction`.

It also **does not register** the old compatibility route `POST /payments/epusdt/v1/order/create-transaction`.

## Replace old integrations with one of these live routes

| Use case | Current live route |
| --- | --- |
| Native JSON API (recommended) | `POST /payments/gmpay/v1/order/create-transaction` |
| Redirect / EPay-style flow | `GET/POST /payments/epay/v1/order/create-transaction/submit.php` |

## Important migration changes

1. **Every incoming order request must identify the merchant with `pid`.**
2. **Signature verification uses the `secret_key` of the matching `api_keys` row**, not an old global route-specific key.
3. **Supported networks/tokens are admin-driven**, so query `/payments/gmpay/v1/supported-assets` instead of assuming a fixed list.
4. **EPay defaults** now come from admin settings (`epay.default_token`, `epay.default_currency`, `epay.default_network`), not from deprecated env keys like `epay_pid` / `epay_key`.
