---
operation: epay-order
method: GET/POST
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "Envía los parámetros firmados en la consulta GET o en un formulario POST. Tras verificar la firma MD5 y crear el pedido, la pasarela redirige con HTTP 302."
---

# Crear un pedido EPay

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Envía los parámetros firmados en la consulta GET o en un formulario POST. Tras verificar la firma MD5 y crear el pedido, la pasarela redirige con HTTP 302.

## Parámetros

<!--@include: ../payment.md#epay-fields-->

La firma del ejemplo usa la clave de demostración `epusdt_secret_key`. Vuelve a calcularla en tu servidor si cambian los parámetros o la clave.

## Recursos relacionados

- [Volver al comercio](./checkout-return)
- [Firmas](../payment#signing)
