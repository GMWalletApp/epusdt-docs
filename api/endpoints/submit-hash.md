---
operation: submit-hash
method: POST
route: "/pay/submit-tx-hash/{trade_id}"
description: "Submit block_transaction_id in the JSON body for an on-chain order awaiting payment (status 1). The server verifies the transfer before updating the order."
---

# Submit a transaction hash

<span class="api-route"><b>POST</b> <code>/pay/submit-tx-hash/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Submit `block_transaction_id` in the JSON body for an on-chain order awaiting payment (status 1). The server verifies the transfer before updating the order.

## Parameters

`trade_id` · `string` · PATH

The EPUSDT transaction ID returned when the order was created.

## JSON body

| Required field | Type | Example |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## Related resources

- [Poll order status](./order-status)
- [Merchant callbacks](../payment#callbacks)
