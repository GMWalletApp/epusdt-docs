---
operation: checkout-details
method: GET
route: "/pay/checkout-counter-resp/{trade_id}"
description: "Consulte o valor, o endereço de recebimento e a seleção atual. created_at e expiration_time são timestamps Unix em milissegundos."
---

# Consultar os dados do checkout

<ApiRoute />

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Consulte o valor, o endereço de recebimento e a seleção atual. `created_at` e `expiration_time` são timestamps Unix em milissegundos.

## Parâmetros

`trade_id` · `string` · PATH

ID da transação retornado pelo EPUSDT na criação do pedido.

## Recursos relacionados

- [Consultar status do pedido](./order-status)
- [Notificações ao lojista](../payment#callbacks)
