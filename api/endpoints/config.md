---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "Read supported_assets to find the networks and tokens currently available for checkout. No request parameters or merchant signature are required."
---

# Read checkout configuration

<ApiRoute />

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Read `supported_assets` to find the networks and tokens currently available for checkout. No request parameters or merchant signature are required.

On gateway builds with contract metadata, look up the symbol in `token_details` for its full identifier and decimals. Older versions return only `tokens`. [Built-in contracts](../../guide/intro#networks)

## Related resources

- [Create a GMPay order](./create-order)
- [Merchant callbacks](../payment#callbacks)
