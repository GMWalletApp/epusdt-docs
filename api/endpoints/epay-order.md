---
operation: epay-order
method: GET/POST
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "Send signed parameters as a GET query or POST form. With a valid MD5 signature the gateway redirects to checkout with HTTP 302."
---

# Create an EPay order

<span class="api-route"><b>GET/POST</b> <code>/payments/epay/v1/order/create-transaction/submit.php</code></span>

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Send signed parameters as a GET query or POST form. With a valid MD5 signature the gateway redirects to checkout with HTTP 302.

## Parameters

<!--@include: ../payment.md#epay-fields-->

The sample signature uses the demonstration key `epusdt_secret_key`. Recalculate it on your server whenever the fields or merchant key change.

## Related resources

- [Return to the merchant](./checkout-return)
- [Signatures](../payment#signing)
