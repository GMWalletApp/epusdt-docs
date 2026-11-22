---
operation: switch-network
method: POST
route: "/pay/switch-network"
description: "Envía el trade_id del pedido principal, token y network en el cuerpo JSON. El estado debe ser 1 o 4. Usa la dirección o URL devuelta."
---

# Seleccionar red o proveedor

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Envía el `trade_id` del pedido principal, `token` y `network` en el cuerpo JSON. El estado debe ser 1 o 4. Usa la dirección o URL devuelta.

## Cuerpo JSON

| Campo obligatorio | Tipo | Ejemplo |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## Recursos relacionados

- [Consultar configuración](./config)
- [Notificaciones al comercio](../payment#callbacks)
