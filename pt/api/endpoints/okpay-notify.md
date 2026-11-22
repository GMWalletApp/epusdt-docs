---
operation: okpay-notify
method: POST
route: "/payments/okpay/v1/notify"
description: "Configure esta URL no OKPay. O EPUSDT verifica a notificação assinada com o token da loja. A resposta em texto é success (200) ou fail (400)."
---

# Receber uma notificação do OKPay

<span class="api-route"><b>POST</b> <code>/payments/okpay/v1/notify</code></span>

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Configure esta URL no OKPay. O EPUSDT verifica a notificação assinada com o `token` da loja. A resposta em texto é success (200) ou fail (400).

## Recursos relacionados

- [Selecionar rede ou provedor](./switch-network)
- [Notificações ao lojista](../payment#callbacks)
