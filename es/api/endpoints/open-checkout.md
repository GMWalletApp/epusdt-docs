---
operation: open-checkout
method: GET
route: "/pay/checkout-counter/{trade_id}"
description: "Abre la URL de pago en el navegador. EPUSDT redirige al comprador a /cashier/{trade_id} con HTTP 301."
---

# Abrir la página de pago

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Abre la URL de pago en el navegador. EPUSDT redirige al comprador a `/cashier/{trade_id}` con HTTP 301.

## Parámetros

`trade_id` · `string` · PATH

ID de la transacción que devuelve EPUSDT al crear el pedido.

## Recursos relacionados

- [Consultar los datos del pago](./checkout-details)
- [Notificaciones al comercio](../payment#callbacks)
