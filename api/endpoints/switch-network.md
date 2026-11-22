---
operation: switch-network
method: POST
route: "/pay/switch-network"
description: "Send the parent trade_id, token and network in the JSON body. The parent must be pending (status 1 or 4). Read the returned address or hosted payment URL."
---

# Select a network or provider

<span class="api-route"><b>POST</b> <code>/pay/switch-network</code></span>

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Send the parent `trade_id`, `token` and `network` in the JSON body. The parent must be pending (status 1 or 4). Read the returned address or hosted payment URL.

## JSON body

| Required field | Type | Example |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## Related resources

- [Read checkout configuration](./config)
- [Merchant callbacks](../payment#callbacks)
