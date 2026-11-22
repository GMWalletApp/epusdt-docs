---
operation: order-status
method: GET
route: "/pay/check-status/{trade_id}"
description: "Use o trade_id do EPUSDT para atualizar o checkout. Libere o pedido após verificar a assinatura da notificação."
---

# Consultar status do pedido

<ApiRoute />

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Use o `trade_id` do EPUSDT para atualizar o checkout. Libere o pedido após verificar a assinatura da notificação.

## Parâmetros

`trade_id` · `string` · PATH

ID da transação retornado pelo EPUSDT na criação do pedido.

## Status do pedido

<!--@include: ../payment.md#order-states-->

## Recursos relacionados

- [Consultar os dados do checkout](./checkout-details)
- [Notificações ao lojista](../payment#callbacks)
