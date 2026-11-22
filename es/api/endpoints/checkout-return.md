---
operation: checkout-return
method: GET
route: "/pay/return/{trade_id}"
description: "Los pedidos EPay pagados vuelven al comercio con parámetros firmados. Los demás vuelven a la página de pago. Verifica la notificación asíncrona antes de entregar el pedido."
---

# Volver al comercio

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Los pedidos EPay pagados vuelven al comercio con parámetros firmados. Los demás vuelven a la página de pago. Verifica la notificación asíncrona antes de entregar el pedido.

## Parámetros

`trade_id` · `string` · PATH

ID de la transacción que devuelve EPUSDT al crear el pedido.

## Recursos relacionados

- [Crear un pedido EPay](./epay-order)
- [Notificaciones al comercio](../payment#callbacks)
