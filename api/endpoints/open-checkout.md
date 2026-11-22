---
operation: open-checkout
method: GET
route: "/pay/checkout-counter/{trade_id}"
description: "Open the payment URL in a browser. EPUSDT redirects the buyer to /cashier/{trade_id} with HTTP 301."
---

# Open hosted checkout

<ApiRoute />

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Open the payment URL in a browser. EPUSDT redirects the buyer to `/cashier/{trade_id}` with HTTP 301.

## Parameters

`trade_id` · `string` · PATH

The EPUSDT transaction ID returned when the order was created.

## Related resources

- [Read checkout details](./checkout-details)
- [Merchant callbacks](../payment#callbacks)
