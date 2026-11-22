---
operation: create-order
method: POST
route: "/payments/gmpay/v1/order/create-transaction"
description: "Sign the request on your server and open payment_url for the buyer. Supply token and network together or omit both so the buyer can choose at checkout."
---

# Create a GMPay order

<span class="api-route"><b>POST</b> <code>/payments/gmpay/v1/order/create-transaction</code></span>

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Sign the request on your server and open `payment_url` for the buyer. Supply `token` and `network` together or omit both so the buyer can choose at checkout.

## Parameters

<!--@include: ../payment.md#create-fields-->

The sample signature uses the demonstration key `epusdt_secret_key`. Recalculate it on your server whenever the fields or merchant key change.

## Related resources

- [Open hosted checkout](./open-checkout)
- [Signatures](../payment#signing)
