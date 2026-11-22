---
operation: checkout-details
method: GET
route: "/pay/checkout-counter-resp/{trade_id}"
description: "Consulta el importe, la dirección de recepción y la selección actual. created_at y expiration_time son marcas de tiempo Unix en milisegundos."
---

# Consultar los datos del pago

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Consulta el importe, la dirección de recepción y la selección actual. `created_at` y `expiration_time` son marcas de tiempo Unix en milisegundos.

## Parámetros

`trade_id` · `string` · PATH

ID de la transacción que devuelve EPUSDT al crear el pedido.

## Recursos relacionados

- [Consultar estado del pedido](./order-status)
- [Notificaciones al comercio](../payment#callbacks)
