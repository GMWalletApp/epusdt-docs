---
operation: checkout-return
method: GET
route: "/pay/return/{trade_id}"
description: "Pedidos EPay pagos voltam à loja com parâmetros assinados. Os demais retornam ao checkout. Verifique a notificação assíncrona antes de liberar o pedido."
---

# Voltar à loja

<ApiRoute />

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Pedidos EPay pagos voltam à loja com parâmetros assinados. Os demais retornam ao checkout. Verifique a notificação assíncrona antes de liberar o pedido.

## Parâmetros

`trade_id` · `string` · PATH

ID da transação retornado pelo EPUSDT na criação do pedido.

## Recursos relacionados

- [Criar um pedido EPay](./epay-order)
- [Notificações ao lojista](../payment#callbacks)
