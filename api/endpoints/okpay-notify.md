---
operation: okpay-notify
method: POST
route: "/payments/okpay/v1/notify"
description: "Configure this URL in OKPay. The provider sends its signed payload; EPUSDT checks it with the shop token. The plain-text acknowledgement is success (200) or fail (400)."
---

# Receive an OKPay notification

<span class="api-route"><b>POST</b> <code>/payments/okpay/v1/notify</code></span>

<a class="api-example-jump" href="#request-example">Request example ↓</a>

Configure this URL in OKPay. The provider sends its signed payload; EPUSDT checks it with the shop `token`. The plain-text acknowledgement is success (200) or fail (400).

## Related resources

- [Select a network or provider](./switch-network)
- [Merchant callbacks](../payment#callbacks)
