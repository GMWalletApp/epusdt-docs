---
operation: submit-hash
method: POST
route: "/pay/submit-tx-hash/{trade_id}"
description: "Envía block_transaction_id en el cuerpo JSON para un pedido en cadena pendiente (estado 1). El servidor verifica la transferencia antes de actualizar el pedido."
---

# Enviar el hash de la transacción

<span class="api-route"><b>POST</b> <code>/pay/submit-tx-hash/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Envía `block_transaction_id` en el cuerpo JSON para un pedido en cadena pendiente (estado 1). El servidor verifica la transferencia antes de actualizar el pedido.

## Parámetros

`trade_id` · `string` · PATH

ID de la transacción que devuelve EPUSDT al crear el pedido.

## Cuerpo JSON

| Campo obligatorio | Tipo | Ejemplo |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## Recursos relacionados

- [Consultar estado del pedido](./order-status)
- [Notificaciones al comercio](../payment#callbacks)
