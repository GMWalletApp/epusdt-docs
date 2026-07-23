# Merchant API

GMPay is the primary merchant protocol. EPay is a compatibility adapter over the same credential, order service, idempotency rules, state machine, checkout, query behavior, and callback pipeline.

For authoritative fields and status values, use the deployed instance's `/docs` page or the repository's tracked OpenAPI contract: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml).

## GMPay signatures

GMPay requests include numeric `pid` and a lowercase HMAC-SHA256 `signature`.

To sign a request:

1. Exclude `signature` and empty values.
2. Sort fields by ASCII key order.
3. Join as `key=value` with `&`.
4. Use the credential Secret as the HMAC key.
5. Compute lowercase HMAC-SHA256.

## Create order

```text
POST /payments/gmpay/v1/order/create-transaction
```

Reusing an existing `order_id` does not create a second order. Omitting both `token` and `network` creates a selectable order; GMPay Edge does not silently default it to TRON.

## Query order

```text
GET /payments/gmpay/v1/order/query
```

Provide exactly one of `trade_id` or `order_id`, then sign the request with the same credential. A credential can query only orders it created.

## Receive callbacks

The merchant supplies `notify_url` when creating an order. Callback destinations must pass the instance SSRF and security policy.

Delivered events have deterministic signatures, retained attempts, bounded retries, and an audited manual retry path. Handlers should verify the signature, process duplicate events idempotently, and acknowledge only after committing local state.

For GMPay callbacks, return plain text `ok` with HTTP 200 after successful processing.

## EPay compatibility

EPay compatibility uses the same credential and order pipeline, but keeps the legacy EPay MD5 boundary for inbound requests and compatible callbacks.
