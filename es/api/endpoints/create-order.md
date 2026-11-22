---
operation: create-order
method: POST
route: "/payments/gmpay/v1/order/create-transaction"
description: "Firma la solicitud en tu servidor y dirige al comprador a payment_url. Envía token y network juntos u omite ambos para que el comprador elija."
---

# Crear un pedido GMPay

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Firma la solicitud en tu servidor y dirige al comprador a `payment_url`. Envía `token` y `network` juntos u omite ambos para que el comprador elija.

## Parámetros

<!--@include: ../payment.md#create-fields-->

La firma del ejemplo usa la clave de demostración `epusdt_secret_key`. Vuelve a calcularla en tu servidor si cambian los parámetros o la clave.

## Recursos relacionados

- [Abrir la página de pago](./open-checkout)
- [Firmas](../payment#signing)
