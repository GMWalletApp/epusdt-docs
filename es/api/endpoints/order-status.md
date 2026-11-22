---
operation: order-status
method: GET
route: "/pay/check-status/{trade_id}"
description: "Consulta el trade_id de EPUSDT para actualizar el pago. Entrega el pedido tras verificar la firma de la notificación."
---

# Consultar estado del pedido

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Consulta el `trade_id` de EPUSDT para actualizar el pago. Entrega el pedido tras verificar la firma de la notificación.

## Parámetros

`trade_id` · `string` · PATH

ID de la transacción que devuelve EPUSDT al crear el pedido.

## Estados del pedido

<!--@include: ../payment.md#order-states-->

## Recursos relacionados

- [Consultar los datos del pago](./checkout-details)
- [Notificaciones al comercio](../payment#callbacks)
