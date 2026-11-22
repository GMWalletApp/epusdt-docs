---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "Consulta supported_assets para conocer las redes y los tokens disponibles. No requiere parámetros ni firma del comercio."
---

# Consultar configuración

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ejemplo de solicitud ↓</a>

Consulta `supported_assets` para conocer las redes y los tokens disponibles. No requiere parámetros ni firma del comercio.

En las versiones compatibles, busca el símbolo en `token_details` para consultar el identificador completo y los decimales. Las versiones anteriores solo devuelven `tokens`. [Directorio de contratos](../../guide/intro#networks)

## Recursos relacionados

- [Crear un pedido GMPay](./create-order)
- [Notificaciones al comercio](../payment#callbacks)
