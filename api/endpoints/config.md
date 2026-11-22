---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "Read supported_assets to find the networks and tokens currently available for checkout. No request parameters or merchant signature are required."
---

# Read checkout configuration

<span class="api-route"><b>GET</b> <code>/payments/gmpay/v1/config</code></span>

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Read `supported_assets` to find the networks and tokens currently available for checkout. No request parameters or merchant signature are required.

## Related resources

- [Create a GMPay order](./create-order)
- [Merchant callbacks](../payment#callbacks)
