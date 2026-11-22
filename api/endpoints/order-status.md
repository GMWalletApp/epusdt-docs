---
operation: order-status
method: GET
route: "/pay/check-status/{trade_id}"
description: "Poll with the EPUSDT trade_id to update checkout. Fulfil the order after verifying the merchant callback."
---

# Poll order status

<ApiRoute />

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Poll with the EPUSDT `trade_id` to update checkout. Fulfil the order after verifying the merchant callback.

## Parameters

`trade_id` · `string` · PATH

The EPUSDT transaction ID returned when the order was created.

## Order states

<!--@include: ../payment.md#order-states-->

## Related resources

- [Read checkout details](./checkout-details)
- [Merchant callbacks](../payment#callbacks)
