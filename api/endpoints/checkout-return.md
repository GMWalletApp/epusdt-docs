---
operation: checkout-return
method: GET
route: "/pay/return/{trade_id}"
description: "A paid EPay order redirects to the merchant with signed return parameters. Other orders redirect back to checkout. Use the verified asynchronous notification for fulfilment."
---

# Return to the merchant

<ApiRoute />

<a class="api-example-jump" href="#request-example">Request example ↓</a>

A paid EPay order redirects to the merchant with signed return parameters. Other orders redirect back to checkout. Use the verified asynchronous notification for fulfilment.

## Parameters

`trade_id` · `string` · PATH

The EPUSDT transaction ID returned when the order was created.

## Related resources

- [Create an EPay order](./epay-order)
- [Merchant callbacks](../payment#callbacks)
