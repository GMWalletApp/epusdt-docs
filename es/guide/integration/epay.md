---
description: "Conecte un sistema de comercio compatible con EPay a EPUSDT utilizando el punto final de “checkout” con redirección y los parámetros de solicitud firmada."
title: "Redirección de pago EPay"
---

# Integración compatible con EPay mediante redirección {#epay-compatible-integration-redirect-checkout}

Utilice este flujo solo cuando su sistema previo requiera una entrada de orden de tipo EPay.

## Ruta {#route}

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Requisito de credenciales comerciales {#merchant-credential-requirement}

Las solicitudes entrantes **no** se validan utilizando claves de entorno obsoletas como `epay_pid` o `epay_key`.

La fuente actual hace esto en cambio:

1. Leer el `pid` entrante.
2. Encuentra la fila `api_keys` habilitada con ese PID.
3. Verifica `sign` con la `secret_key` de ese registro
4. Aplicar verificación opcional de lista blanca de IP.

## Campos obligatorios {#required-incoming-fields}

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

Campos opcionales comunes:

- `return_url`
- `name`
- `type`
- `token`
- `network`
- `currency`
- `sign_type`

`type` admite dos formatos:

- `alipay` — valor de compatibilidad; el token/red se resuelven a partir de los parámetros explícitos de la solicitud `token` + `network`, y posteriormente a partir de los valores predeterminados de EPay del administrador.
- El selector `token.network` como `usdt.tron` — solo se acepta cuando la combinación de ese token/red está actualmente soportada. Un selector válido anula `token`, `network`, `epay.default_token` y `epay.default_network`.

Otros valores no vacíos para `type` son rechazados como parámetros inválidos. El `type` seleccionado o compatible se almacena en el pedido para las posteriores llamadas de devolución/notificación de EPay.

## EPay: Por defecto, las opciones de EPay. {#epay-defaults}

Tras la verificación de la firma, la fuente actual construye el paquete de datos interno y compartido para el pedido, incluyendo la configuración del administrador.

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

Orden de resolución para EPay submit.php es:

1. Se admite el selector `type=token.network`, si se proporciona.
2. Solicitud explícita de los parámetros `token` / `network`.
3. Administrar `epay.default_token` / `epay.default_network`
4. Si tanto el token como la red siguen estando vacíos, crear un pedido con estado `4` como marcador para el flujo de selección del cajero.

La moneda es independiente: solicitar `currency` → `epay.default_currency` → `cny`.

## Comportamiento exitoso {#success-behavior}

En caso de éxito, la redirección del navegador se dirige a:

```text
/pay/checkout-counter/{trade_id}
```

En la fuente actual, esa ruta ahora es la entrada de redirección para el cajero alojado (SPA). Los datos de la página de pago se sirven a través de:

```text
/pay/checkout-counter-resp/{trade_id}
```


## Elecciones directas de tokens/redes {#direct-token-network-choices}

Para las listas de métodos de pago "New API" en la parte superior, se deben exponer opciones separadas cuyo `type` sea un selector de `token.network` compatible. Por ejemplo, `usdt.tron` crea un pedido de USDT en TRON directamente, mientras que `usdt.binance` crea un pedido de USDT en Binance/BSC cuando ese activo está habilitado.

Lista de métodos de origen:

```json
[
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay", "type": "custom1" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.binance", "type": "usdt.binance" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.tron", "type": "usdt.tron" }
]
```

`custom1` es simplemente un nombre genérico de opción de nivel superior. No lo envíe sin modificarlo a submit.php de EPay; no incluya `type`, `type=alipay`, o un selector válido como `usdt.tron`.

## Verificación de callbacks {#callback-verification}

Si el pedido creado tiene `payment_type = Epay`, el proceso en segundo plano llama después a tu `notify_url` con parámetros de consulta en formato EPay. Los firma con la **misma `secret_key` del comercio**.

La función de devolución de llamada `type` reutiliza el tipo de solicitud almacenado. Esto significa que devuelve ya sea `alipay` o el selector aceptado, como `usdt.tron`. Si la solicitud omitió el parámetro `type`, las devoluciones de llamada externas retroceden a `alipay` para garantizar la compatibilidad.

No verifique esas llamadas de retorno con una antigua clave `epay_key` independiente.
