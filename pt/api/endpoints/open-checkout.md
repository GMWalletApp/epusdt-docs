---
operation: open-checkout
method: GET
route: "/pay/checkout-counter/{trade_id}"
description: "Abra a URL de pagamento no navegador. O EPUSDT redireciona o comprador para /cashier/{trade_id} com HTTP 301."
---

# Abrir o checkout

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Abra a URL de pagamento no navegador. O EPUSDT redireciona o comprador para `/cashier/{trade_id}` com HTTP 301.

## Parâmetros

`trade_id` · `string` · PATH

ID da transação retornado pelo EPUSDT na criação do pedido.

## Recursos relacionados

- [Consultar os dados do checkout](./checkout-details)
- [Notificações ao lojista](../payment#callbacks)
