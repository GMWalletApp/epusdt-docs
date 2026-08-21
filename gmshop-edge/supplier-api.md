# Native Supplier API

GMShop Edge can act as an upstream digital-goods supplier for another GMShop Edge instance. The native protocol exposes catalog, order, payment-channel, and wallet top-up operations under `/api/v1/supplier/*`; it is a storefront supply protocol, not a payment-gateway API.

## Enable and issue credentials

Enable the supplier API in the administration settings, then create an API key for the customer account that will buy from this store. The secret is shown only at issuance and is stored encrypted. Keys can be revoked, and an optional allowed callback Origin can restrict where fulfillment callbacks are sent.

The consuming GMShop Edge instance selects the `gmshop_edge` supplier adapter and stores the issued key ID and secret in its encrypted runtime configuration.

## Request signing

Every request must use HTTPS without an explicit port and send:

- `GMShop-Edge-Api-Key`: issued key ID.
- `GMShop-Edge-Timestamp`: 10-digit Unix timestamp in seconds.
- `GMShop-Edge-Nonce`: unique 16–100 character alphanumeric/hyphen value.
- `GMShop-Edge-Signature`: lowercase HMAC-SHA256 hex digest.

Build the signing payload by joining these values with newline characters:

```text
UPPERCASE_HTTP_METHOD
PATH_WITH_RAW_QUERY
UNIX_TIMESTAMP
NONCE
SHA256_HEX_OF_RAW_BODY
```

Compute HMAC-SHA256 over that payload with the issued API secret. The server accepts a timestamp skew of at most 60 seconds and stores each nonce as a replay receipt. Reusing a nonce returns a conflict. Current rate limits are 120 requests per key per minute and 300 requests per user per minute.

## Endpoints

- `POST /api/v1/supplier/ping`
- `GET /api/v1/supplier/categories`
- `GET /api/v1/supplier/products`
- `GET /api/v1/supplier/products/{productId}`
- `POST /api/v1/supplier/orders`
- `GET /api/v1/supplier/orders/{orderId}`
- `POST /api/v1/supplier/orders/{orderId}/cancel`
- `GET /api/v1/supplier/payment-channels`
- `POST /api/v1/supplier/topups`
- `GET /api/v1/supplier/topups/{id}`

Order creation and top-up operations are idempotent. Keep the same idempotency reference when retrying an uncertain request; do not create a new supplier order merely because the client timed out.

## API reference

A deployed instance redirects `/openapi` to its interactive API reference. The repository also publishes the complete [OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml), covering authentication, customer fulfillment, provider callbacks, administration, web support, and the native supplier protocol.
