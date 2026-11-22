---
operation: submit-hash
method: POST
route: "/pay/submit-tx-hash/{trade_id}"
description: "Envie block_transaction_id no corpo JSON para um pedido on-chain aguardando pagamento (status 1). O servidor verifica a transferência antes de atualizar o pedido."
---

# Enviar o hash da transação

<span class="api-route"><b>POST</b> <code>/pay/submit-tx-hash/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Envie `block_transaction_id` no corpo JSON para um pedido on-chain aguardando pagamento (status 1). O servidor verifica a transferência antes de atualizar o pedido.

## Parâmetros

`trade_id` · `string` · PATH

ID da transação retornado pelo EPUSDT na criação do pedido.

## Corpo JSON

| Campo obrigatório | Tipo | Exemplo |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## Recursos relacionados

- [Consultar status do pedido](./order-status)
- [Notificações ao lojista](../payment#callbacks)
