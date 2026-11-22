---
description: "Integre los credenciales del comerciante de GMPay Edge, las firmas de solicitud HMAC y las notificaciones de devolución de pedidos, o utilice su adaptador de compatibilidad con EPay."
titleTemplate: ":title | GMPay Edge"
---

# API para comercios {#merchant-api}

GMPay es el protocolo comercial principal. EPay es un adaptador de compatibilidad que utiliza el mismo sistema de credenciales, servicio de pedidos, reglas de idempotencia, máquina de estados, proceso de checkout, comportamiento de consulta y canal de callback.

Para campos de autoridad y valores de estado, utilice la página `/docs` de la instancia desplegada o el contrato OpenAPI rastreado del repositorio: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml).

## Firmas de GMPay {#gmpay-signatures}

Las solicitudes de GMPay incluyen un `pid` numérico y una `signature` HMAC-SHA256 en minúsculas.

Para firmar una solicitud:

1. Excluye `signature` y los valores vacíos.
2. Ordenar los campos por el orden de los caracteres ASCII.
3. Une los pares `key=value` con `&`.
4. Utilice el credencial "Secret" como clave HMAC.
5. Calcular HMAC-SHA256 en minúsculas.

## Establecer orden. {#create-order}

<span class="api-route"><b>POST</b> <code>/payments/gmpay/v1/order/create-transaction</code></span>

Reutilizar un `order_id` existente no crea un segundo pedido. Omitir tanto el `token` como la `network` crea un pedido seleccionable; GMPay Edge no lo establece silenciosamente en TRON.

## Solicitud de orden {#query-order}

<span class="api-route"><b>GET</b> <code>/payments/gmpay/v1/order/query</code></span>

Indica exactamente uno de los dos campos, `trade_id` u `order_id`, y firma la solicitud con la misma credencial. Cada credencial solo puede consultar los pedidos que creó.

## Recibir llamadas de retorno {#receive-callbacks}

El comerciante proporciona la URL `notify_url` al crear un pedido. Los destinos de llamada (callbacks) deben pasar la instancia de SSRF y la política de seguridad.

Los eventos entregados tienen firmas deterministas, intentos conservados, reintentos limitados y una ruta de reintento manual auditada. Los manejadores deben verificar la firma, procesar eventos duplicados de forma idempotente y solo confirmar una vez que se haya confirmado el estado local.

Para las respuestas de GMPay, devuelve texto plano "`ok`" con código HTTP 200 después del procesamiento exitoso.

## Compatibilidad con EPay {#epay-compatibility}

La compatibilidad de EPay utiliza la misma credencial y flujo de procesamiento de pedidos, pero mantiene el límite MD5 de EPay heredado para las solicitudes entrantes y las llamadas de retorno compatibles.
