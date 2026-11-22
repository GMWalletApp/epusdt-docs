---
operation: okpay-notify
method: POST
route: "/payments/okpay/v1/notify"
description: "Configura esta URL en OKPay. EPUSDT verifica la notificación firmada con el token de la tienda. La respuesta de texto es success (200) o fail (400)."
---

# Recibir una notificación de OKPay

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Configura esta URL en OKPay. EPUSDT verifica la notificación firmada con el `token` de la tienda. La respuesta de texto es success (200) o fail (400).

## Recursos relacionados

- [Seleccionar red o proveedor](./switch-network)
- [Notificaciones al comercio](../payment#callbacks)
