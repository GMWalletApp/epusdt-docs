---
operation: checkout-details
method: GET
route: "/pay/checkout-counter-resp/{trade_id}"
description: "Read the amount, receiving address and current selection. Here created_at and expiration_time are Unix timestamps in milliseconds."
---

# Read checkout details

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter-resp/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Read the amount, receiving address and current selection. Here `created_at` and `expiration_time` are Unix timestamps in milliseconds.

## Parameters

`trade_id` · `string` · PATH

The EPUSDT transaction ID returned when the order was created.

## Related resources

- [Poll order status](./order-status)
- [Merchant callbacks](../payment#callbacks)
