# Legacy Migration

Current source no longer exposes the old Epusdt order route.

## Removed routes

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## What to use instead

### If you control the client code

Use **GMPay**:

```text
POST /payments/gmpay/v1/order/create-transaction
```

### If the upstream system only supports redirect-style EPay flows

Use **EPay compatible**:

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Migration checklist

- Replace the old endpoint URL
- Add `pid` to all inbound requests
- Re-sign requests with the merchant row's `secret_key`
- Stop relying on old docs that mentioned `/payments/epusdt/v1/...`
- If you need dynamic chain/token UI, fetch `/payments/gmpay/v1/supported-assets`
