---
description: "Investigue las rutas y los métodos HTTP para los pedidos de comerciantes, el proceso de pago y el estado de los pagos, y luego abra los ejemplos de firma y devolución."
title: "Referencia al punto final de la API de pago."
---

# Referencia de la API {#api-reference}

Consulte [API de Comerciante](/es/api/payment) para ejemplos de firma, estados de los pedidos y verificación de notificaciones.

## Rutas públicas en vivo {#live-public-routes}

| Finalidad | Método | Ruta | Autenticación |
| --- | --- | --- | --- |
| Crear un pedido de GMPay | POST | `/payments/gmpay/v1/order/create-transaction` | HMAC-SHA256 del comercio |
| Revisar la configuración de pago público. | GET | `/payments/gmpay/v1/config` | Público |
| Abrir la página de pago | GET | `/pay/checkout-counter/{trade_id}` | Público |
| Revisa los detalles del pago. | GET | `/pay/checkout-counter-resp/{trade_id}` | Público |
| Consultar periódicamente el estado del pedido | GET | `/pay/check-status/{trade_id}` | Público |
| Seleccione la red o el proveedor. | POST | `/pay/switch-network` | Público |
| Envía un hash de transferencia para verificación. | POST | `/pay/submit-tx-hash/{trade_id}` | Público |
| Regresar al inicio. | GET | `/pay/return/{trade_id}` | Redirección del navegador |
| Crear un pedido de EPay. | GET o POST | `/payments/epay/v1/order/create-transaction/submit.php` | MD5 del comercio |
| Recibir una notificación de Proveedor OKPay | POST | `/payments/okpay/v1/notify` | Firma de OKPay |

## Superficie de la API de administración {#admin-api-surface}

Las APIs de gestión se encuentran en `/admin/api/v1/*` y están protegidas con JWT, excepto los puntos finales de inicio de sesión y el establecimiento inicial de la contraseña.

Grupos principales visibles en la fuente actual:

- El cajero público acepta un hash para un pedido pendiente en la cadena. Un administrador también puede revisar un pedido caducado o un candidato en revisión manual.
- Tipos de cambio: `rate.mode` admite `fixed` o `auto`. El modo fijo usa `rate.forced_rate_list`. El automático consulta `rate.api_url`, guarda en caché las respuestas correctas por moneda base y conserva la última caché persistente si falla la actualización. Dejar `rate.forced_rate_list` vacío restaura el tipo predeterminado de CNY para USDT y USDC.
- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- gestión de cadenas / gestión de tokens de cadena
- Gestión de la dirección de billetera
- gestión de la configuración

## Normas sobre credenciales comerciales {#merchant-credential-rules}

### GMPay {#gmpay}

- Identificador obligatorio del comercio: `pid`
- Campo de firma: `signature`
- Algoritmo de firma desde `v2.0.0`: HMAC-SHA256 sobre la cadena de parámetros canónica y no vacía, con clave utilizando la clave secreta habilitada de `api_keys.secret_key` que coincida con `pid`.
- Los clientes de Pre-v2 GMPay MD5 deben actualizarse antes de implementar `v2.0.0` o versiones posteriores.

### Flujo compatible con EPay {#epay-compatible-flow}

- Identificador obligatorio del comercio: `pid`
- Campo de firma: `sign`
- Clave de firma: la `secret_key` de la fila `api_keys` habilitada que coincida con `pid`.
- `sign_type` es aceptado y, normalmente, se utiliza `MD5`.
- EPay `type` acepta `alipay` o un selector compatible de `token.network` como `usdt.tron`. Los selectores aceptados se conservan en las funciones de devolución/notificación de EPay.

## Orden de integración recomendado {#recommended-integration-order}

1. Crear o inspeccionar las credenciales de los comerciantes en el panel de administración (`pid` + `secret_key`)
2. Consulta `/payments/gmpay/v1/config` y lee `data.supported_assets` si el cliente necesita opciones de red/token dinámicas.
3. Prefiera GMPay para nuevas integraciones.
4. Utilice la redirección compatible con EPay únicamente cuando el sistema upstream (o de origen) lo requiera.
5. Verifica los callbacks con la misma `secret_key` del comercio
