---
description: "Cree un pedido GMPay, revise su estado de pago y verifique las llamadas de retorno de EPUSDT. Incluye parámetros de solicitud del comerciante, reglas de firma y ejemplos."
title: "API de pagos para comerciantes, firmas y notificaciones de retorno."
---

# API para comercios {#merchant-api}

Utilice el punto final de configuración público para descubrir las opciones de pago, crear un pedido en su servidor y dirigir al comprador a la URL de pago devuelta. Verifique la notificación firmada antes de completar el pedido. [Ejemplo de pedido en Python](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/sdk/python/gmpay_create_order.py) · [Especificación de OpenAPI](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/docs/swagger.json)

[Firmar una solicitud](#signing) · [Crear un pedido GMPay](#create) · [Estado de la encuesta](#status) · [Respuestas de los comerciantes](#callbacks)

## Endpoints {#endpoints}

| Finalidad | Método | Ruta | Autenticación |
| --- | --- | --- | --- |
| [Crear un pedido GMPay](/es/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | HMAC-SHA256 del comercio |
| [Consultar configuración](/es/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | Público |
| [Abrir la página de pago](/es/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | Público |
| [Consultar los datos del pago](/es/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | Público |
| [Consultar estado del pedido](/es/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | Público |
| [Seleccionar red o proveedor](/es/api/endpoints/switch-network) | POST | `/pay/switch-network` | Público |
| [Enviar el hash de la transacción](/es/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | Público |
| [Volver al comercio](/es/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | Redirección del navegador |
| [Crear un pedido EPay](/es/api/endpoints/epay-order) | GET o POST | `/payments/epay/v1/order/create-transaction/submit.php` | MD5 del comercio |
| [Recibir una notificación de OKPay](/es/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | Firma de OKPay |

## The quick brown fox jumps over the lazy dog. {#response-format}

Los puntos finales JSON devuelven `status_code` (200 en caso de éxito), `message`, `data` (objeto o null), y el `request_id` generado por el servidor. Las firmas inválidas devuelven un código HTTP 401. Los errores de negocio generalmente devuelven un código HTTP 400 con un código de error de la aplicación.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {},
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<a id="signing"></a>

## Firmar una solicitud {#sign-a-request}

Utilice la clave de comerciante asociada con el `pid` de la solicitud. Una nueva instalación inicializa un comerciante predeterminado con PID `1000`. Mantenga el secreto en el servidor del comerciante.

**GMPay** usa HMAC-SHA256. Excluye el campo `signature`, las cadenas vacías y los valores nulos. Ordena los demás nombres de campo en orden ASCII ascendente, respetando las mayúsculas. Concatena los pares `key=value` sin escapar con `&`. Usa `secret_key` como clave HMAC y expresa el resultado como 64 caracteres hexadecimales en minúsculas. Incluye `pid` y cualquier `payment_type` no vacío. En JSON, el servidor interpreta un número como `100.00` como `100`. Con la codificación de formulario puedes enviar la representación original como cadena.

Ejemplos de campos, cadena canónica y firma utilizando la clave de demostración `epusdt_secret_key`:

```text
pid=1000
order_id=ORD202605230001
currency=cny
token=usdt
network=tron
amount=100
notify_url=https://merchant.example/notify
redirect_url=https://merchant.example/return
name=VIP
```

```text
amount=100&currency=cny&name=VIP&network=tron&notify_url=https://merchant.example/notify&order_id=ORD202605230001&pid=1000&redirect_url=https://merchant.example/return&token=usdt
```

```text
signature=6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d
```

### Ejemplos de PHP {#php-examples}

GMPay:

```php
function gmpaySign(array $params, string $secretKey): string
{
    unset($params['signature']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return hash_hmac('sha256', implode('&', $pairs), $secretKey);
}
```

EPay excluye `sign` y `sign_type`, añade el secreto del comercio a la cadena canónica y utiliza MD5.

```php
function epaySign(array $params, string $secretKey): string
{
    unset($params['sign'], $params['sign_type']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

<a id="create"></a>

## Crear un pedido de GMPay {#create-a-gmpay-order}

`POST /payments/gmpay/v1/order/create-transaction` acepta JSON y `application/x-www-form-urlencoded`.

```json
{
  "pid": "1000",
  "order_id": "ORD202605230001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example/notify",
  "redirect_url": "https://merchant.example/return",
  "name": "VIP",
  "signature": "6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d"
}
```

<!-- #region create-fields -->

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `pid` | Cadena | Sí | El identificador de proceso (PID) del comerciante se utilizaba anteriormente para buscar la clave de firma. |
| `order_id` | Cadena | Sí | Identificador único de pedido de comercio, hasta 32 caracteres. |
| `currency` | Cadena | Sí | Moneda fiduciaria, por ejemplo `usd` o `cny`. |
| `token` | Cadena | Condicional | Activo recibido. Asociar con la red o omitir ambos. |
| `network` | Cadena | Condicional | ID de red desde la configuración pública, por ejemplo, `binance`. |
| `amount` | Número | Sí | Monto de Fiat mayor que 0.01. |
| `notify_url` | Cadena | Sí | URL de devolución de llamada asíncrona. |
| `redirect_url` | Cadena | No | URL de retorno del navegador. |
| `name` | Cadena | No | Nombre del producto o pedido. |
| `payment_type` | Cadena | No | Se asigna GMPay de forma predeterminada. EPay (insensible a mayúsculas) selecciona el formato de llamada de retorno de EPay y requiere un PID numérico. Incluir cualquier valor no vacío en la firma. |
| `signature` | Cadena | Sí | Firma HMAC-SHA256 de 64 caracteres en minúsculas. |

<!-- #endregion create-fields -->

Proporcione tanto `token` como `network` para asignar una dirección inmediatamente. Omita ambos para crear un marcador (estado 4) que contenga el monto en fiat y la moneda. Pasar solo uno es inválido. Verifique `data.supported_assets` en la configuración pública antes de seleccionar una pareja.

### Respuesta {#response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "order_id": "ORD202605230001",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.29,
    "receive_address": "TTestTronAddress001",
    "token": "USDT",
    "status": 1,
    "expiration_time": 1779530812,
    "payment_url": "https://pay.example.com/pay/checkout-counter/20260523171652123456001"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `trade_id` | Cadena | ID de transacción EPUSDT. |
| `order_id` | Cadena | Identificador del pedido en el comercio. |
| `amount` | Número | Monto de Fiat entregado. |
| `currency` | Cadena | Moneda fiduciaria. |
| `actual_amount` | Número | Importe adeudado en criptomonedas. |
| `receive_address` | Cadena | Dirección de entrega. |
| `token` | Cadena | Símbolo de activo. |
| `status` | Entero | Estado del pedido. Un valor de 4 significa "pendiente de selección". |
| `expiration_time` | Entero | Vencimiento como marca de tiempo Unix en segundos. |
| `payment_url` | Cadena | Enlace para abrir en un navegador. |

Un pedido provisional carece de dirección y token, y su `actual_amount` es cero. Si caduca o se cierra manualmente, pasa al estado 3 sin liberar ninguna reserva de pago. La opción elegida en la página de pago determina la dirección o la URL alojada.

## Configuración de autopasado público {#public-checkout-configuration}

`GET /payments/gmpay/v1/config` devuelve la marca de la tienda, los activos disponibles en la cadena, los valores predeterminados de EPay y la configuración de los proveedores públicos `okpay` y `xlayer`. Cada entrada en `supported_assets` requiere una cadena habilitada, una dirección de recepción disponible y un token configurado para el pago. Los métodos alojados exponen su propia bandera `enabled` y la lista `allow_tokens`.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "supported_assets": [
      {
        "network": "tron",
        "display_name": "TRON",
        "tokens": ["TRX", "USDT"]
      },
      {
        "network": "solana",
        "display_name": "Solana",
        "tokens": ["SOL", "USDC", "USDT"]
      }
    ],
    "site": {
      "cashier_name": "Acme Cashier",
      "logo_url": "https://cdn.example.com/logo.png",
      "website_title": "Acme Payments",
      "support_link": "https://example.com/support",
      "background_color": "#0f172a",
      "background_image_url": "https://cdn.example.com/background.png",
      "withdrawal_reminder_enabled": true
    },
    "epay": {
      "default_token": "",
      "default_currency": "cny",
      "default_network": ""
    },
    "okpay": {
      "enabled": false,
      "allow_tokens": ["USDT", "TRX"]
    },
    "xlayer": {
      "enabled": false,
      "allow_tokens": ["USDC", "USDT0", "USDG"]
    },
    "version": "v2.1.0"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### Aviso sobre retiros desde plataformas de intercambio {#exchange-withdrawal-reminder}

Después de cargar la configuración, mostrar la recordatorio únicamente cuando `site.withdrawal_reminder_enabled` sea verdadero, si el pedido en la cadena es "pendiente de pago", existe una dirección de recepción y `actual_amount > 0`. Tratar la ausencia de la bandera en versiones anteriores como verdadera. Mostrar la cantidad neta recibida (**después de las comisiones de cambio**) utilizando la misma precisión y token que el pedido. [Vista previa en luz](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-light.png) · [Vista previa en oscuridad](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-dark.png)

Los administradores consultan `GET /admin/api/v1/settings?group=brand`. El valor almacenado de `brand.withdrawal_reminder_enabled` es la cadena `"true"` o `"false"`. Para modificarlo, envíe la siguiente solicitud `PUT /admin/api/v1/settings` autenticada. Verifique la bandera `ok` del elemento devuelto y reabra el proceso de checkout.

```json
{"items":[{"group":"brand","key":"brand.withdrawal_reminder_enabled","type":"bool","value":false}]}
```

## Abra el carrito y revise el pedido. {#open-checkout-and-read-the-order}

La `payment_url` devuelta al momento de la creación apunta a `GET /pay/checkout-counter/{trade_id}`. Abrirla en un navegador devuelve una redirección 301 a:

```text
/cashier/{trade_id}
```

Obtén `GET /pay/checkout-counter-resp/{trade_id}` para mostrar los detalles. Esta respuesta utiliza **milésimas de segundo** para `created_at` y `expiration_time`.  Verifica el punto de acceso de estado para cualquier cambio posterior.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 14.29,
    "token": "USDT",
    "currency": "CNY",
    "receive_address": "TTestTronAddress001",
    "network": "tron",
    "status": 1,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

Para un marcador, se devuelve el mismo ID de padre con campos en cadena vacíos. Tanto GMPay como EPay pueden crear este estado.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 0,
    "token": "",
    "currency": "CNY",
    "receive_address": "",
    "network": "",
    "status": 4,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

El proceso de checkout devuelve `payment_type` en minúsculas (`gmpay` o `epay`), lo que selecciona el formato de la llamada de retorno del comerciante. Para OKX OnchainOS en la Capa X, abra la URL alojada que devuelve el servidor. EPUSDT verifica el pedido resuelto del proveedor antes de acreditarlo.

<a id="status"></a>

## Consultar el estado periódicamente {#poll-status}

`GET /pay/check-status/{trade_id}`

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "status": 1
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<!-- #region order-states -->

| Estado | Significado |
| --- | --- |
| 1 | Pendiente de pago |
| 2 | Pagado |
| 3 | Caducado |
| 4 | Esperando la selección de una red, un activo o un proveedor. |
| 5 | Se ha observado una transferencia coincidente y está confirmando. |
| 6 | Dos rondas de verificación rigurosa no fueron suficientes. Se requiere una revisión manual. |

<!-- #endregion order-states -->

En el estado 5, continúe verificando y mostrar "Confirmando" para que el comprador sepa que la transferencia ha sido registrada. Por defecto, EPUSDT verifica la profundidad de confirmación requerida y verifica la transacción con dos nodos independientes antes de acreditarla. Esperar la profundidad no consume un intento. Los intentos de verificación y los primeros IDs de nodos se conservan tras reiniciar. En el estado 6, la verificación automática y las notificaciones de éxito se detienen. Un administrador puede inspeccionar `review_transaction_hash` y volver a verificar la transacción tras investigar.

Para un hash proporcionado por el comprador, envíe `block_transaction_id` a `POST /pay/submit-tx-hash/{trade_id}`. El servidor verifica la transferencia. La ruta de retorno del navegador, `GET /pay/return/{trade_id}`, envía una redirección HTTP 302.

## Hash de Transacción de Caja {#submit-cashier-transaction-hash}

`POST /pay/submit-tx-hash/{trade_id}`

Este punto final permite que el cajero alojado envíe un hash de transacción en la cadena para verificación manual. Está intencionalmente más limitado que la acción "marcar como pagado" del administrador:

- El pedido debe ser un pedido dentro de la cadena.
- El pedido debe seguir teniendo `status=1`, esperando el pago.
- Los pedidos caducados son rechazados antes de la verificación en cadena.
- Las órdenes de OkPay/proveedores no son compatibles.

### Solicitar Hash de Transacción {#submit-transaction-hash-request}

```json
{
  "block_transaction_id": "0xabc123..."
}
```

### Respuesta de éxito al enviar transacción. {#submit-transaction-hash-success-response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "block_transaction_id": "0xabc123...",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

TON acepta referencias canónicas de la forma `ton:<receive_raw>:<lt>:<hash>`, `lt:hash`, o una referencia única basada únicamente en el hash para la dirección de recepción. Aptos acepta un hash de transacción.

## Cambiar la red o el proveedor de pagos. {#switch-payment-network-or-provider}

`POST /pay/switch-network` acepta el `trade_id` del pedido principal, el `token` de destino y la `network`. Para pagos alojados, selecciona `okpay` o `xlayer` con un activo admitido por ese proveedor.

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "solana"
}
```

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "okpay"
}
```

- Solo un pedido de padre pendiente (estado 1 o 4) puede ser cambiado. Un niño no puede cambiarlo nuevamente.
- La primera selección en un marcador completa el mismo pedido original y lo mueve al estado 1. El proceso de pago “on-chain” ahora asigna una dirección y un monto. El proceso de pago “hosted” devuelve la URL de pago del proveedor. Para OKPay, el campo de dirección de recepción contiene “`OKPAY`”.
- El marcador completado mantiene inicialmente `is_selected=false`. Al seleccionar el mismo objetivo nuevamente, se recupera el orden existente y se marca como seleccionado. Cambiar al objetivo diferente puede crear, como máximo, un hijo por cada padre.
- La respuesta tiene la estructura de “checkout-detail”. Los pedidos en la cadena tienen una URL de `payment_url` vacía.

## Pago con EPay {#epay-compatible-checkout}

Envía una consulta GET o un formulario POST a `/payments/epay/v1/order/create-transaction/submit.php`. El éxito devuelve un código HTTP 302 a:

```text
/pay/checkout-counter/{trade_id}
```

<!-- #region epay-fields -->

| Campo | Ubicación | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- | --- |
| `pid` | Consulta o formulario | Cadena | Sí | ID de comerciante PID. Utilice un PID numérico para las llamadas de retorno. |
| `money` | Consulta o formulario | Número | Sí | Monto de Fiat. |
| `out_trade_no` | Consulta o formulario | Cadena | Sí | Identificador del pedido en el comercio. |
| `notify_url` | Consulta o formulario | Cadena | Sí | URL de callback del comercio. |
| `return_url` | Consulta o formulario | Cadena | No | URL de retorno del navegador. |
| `name` | Consulta o formulario | Cadena | No | Nombre del producto o pedido. |
| `type` | Consulta o formulario | Cadena | No | Vacío, `alipay`, o un selector habilitado para `token.network`. |
| `token` | Consulta o formulario | Cadena | No | Se solicitó el token cuando no se encontró ningún selector. |
| `network` | Consulta o formulario | Cadena | No | Solicitar red cuando no se encuentra ningún selector. |
| `currency` | Consulta o formulario | Cadena | No | Sobrescribe la divisa predeterminada de EPay. |
| `sign` | Consulta o formulario | Cadena | Sí | Firma MD5 de EPay. |
| `sign_type` | Consulta o formulario | Cadena | No | Típicamente, `MD5`. |

<!-- #endregion epay-fields -->

Incluir en el cálculo MD5 todos los parámetros de entrada no vacíos (incluyendo campos de plugins como `sitename`), pero no `sign` ni `sign_type`. Ejemplo de entrada canónica que incluye el secreto de demostración, seguido de su firma:

```text
money=100&name=VIP&notify_url=https://merchant.example/notify&out_trade_no=ORD202605230001&pid=1000&return_url=https://merchant.example/return&type=alipayepusdt_secret_key
```

```text
sign=b865b0acbb2b01554c35a1bd33351452
```

**Selección de activo.** Cuando `type` contiene un selector `token.network` admitido, tiene prioridad sobre los campos explícitos de token y red y sus valores predeterminados. Un tipo no vacío desconocido devuelve `10009` (por ejemplo, `usdt-tron`). Si el tipo está vacío o es `alipay`, cada campo ausente toma su valor predeterminado de EPay. Si ambos siguen vacíos, el servidor crea un pedido provisional. Si falta solo uno, rechaza la solicitud. Para la moneda, usa primero el valor de la solicitud, después el predeterminado y por último `cny`.

Nuevas instalaciones inicializan `cny` y dejan el token y la red predeterminados vacíos. Las configuraciones existentes se conservan durante las actualizaciones. El servidor establece `payment_type=Epay` después de la verificación de la firma. Firma cualquier `type`, `token`, `network` y `currency` que realmente envíes.

<a id="callbacks"></a>

## Callbacks al comercio {#merchant-callbacks}

EPUSDT notifica la URL `notify_url` después de un pago exitoso. Verifica la firma, compara el pedido y la cantidad, y procesa las notificaciones repetidas de manera idempotente. Responde con HTTP 200 y un cuerpo que diga `ok` o `success` (insensible a mayúsculas). En caso de fallo en la entrega, se intenta nuevamente según `order_notice_max_retry` y `callback_retry_base_seconds`, con retroceso exponencial limitado a cinco minutos.

### GMPay {#gmpay}

GMPay envía JSON a través de POST. Busque la clave del comerciante local utilizando el `pid` y verifique el HMAC utilizando la misma canonización que se utiliza en la creación de pedidos. El cuerpo omite `payment_type`.

```json
{
  "pid": "1000",
  "trade_id": "20260523171652123456001",
  "order_id": "ORD202605230001",
  "amount": 100,
  "actual_amount": 14.29,
  "receive_address": "TTestTronAddress001",
  "token": "USDT",
  "block_transaction_id": "0xabc123...",
  "signature": "498975a97bc34563bdb14df53fc18054645df9684d6c67d9b9dd90ec62be1018",
  "status": 2
}
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `pid` | Cadena | Identificador de clave del comerciante. |
| `trade_id` | Cadena | ID de transacción EPUSDT. |
| `order_id` | Cadena | Identificador del pedido en el comercio. |
| `amount` | Número | Monto de Fiat. |
| `actual_amount` | Número | Importe recibido en criptomonedas. |
| `receive_address` | Cadena | Dirección de entrega. |
| `token` | Cadena | Recibido el activo. |
| `block_transaction_id` | Cadena | Referencia de hash o proveedor en la cadena. |
| `signature` | Cadena | Hash HMAC-SHA256. |
| `status` | Entero | Pagado (2). |

### EPay {#epay}

EPay envía una solicitud GET con un `pid` numérico. Usa un PID de comercio numérico tanto en EPay como en los pedidos GMPay con `payment_type=Epay`. El callback utiliza el `type` guardado en el pedido y, si falta, utiliza `alipay`. Verifica la firma MD5 igual que en una solicitud entrante de EPay.

```text
pid=1000
trade_no=20260523171652123456001
out_trade_no=ORD202605230001
type=alipay
name=VIP
money=100.0000
trade_status=TRADE_SUCCESS
sign=cc44fab3f264615d859f8a1fd36d2f08
sign_type=MD5
```

## Callback del proveedor OKPay. {#okpay-provider-callback}

Configure `POST /payments/okpay/v1/notify` en OKPay.  Este acepta JSON, formularios codificados en URL, formularios multipart o un cuerpo de cadena de consulta. EPUSDT verifica la firma del proveedor con el token de la tienda, procesa el pedido correspondiente y activa la llamada de retorno del comerciante. Esto cubre un pedido de marcador completo o un pedido hijo alojado.

Respuesta exitosa.

```text
success
```

Error (HTTP 400):

```text
fail
```

## Códigos de error de aplicación {#application-error-codes}

| Código | HTTP | Significado |
| --- | --- | --- |
| `200` | 200 | Correcto |
| `400` | 400 | Error del sistema o de validación. |
| `401` | 401 | Firma no válida |
| `10001` | 400 | La dirección de la billetera ya existe. |
| `10002` | 400 | El pedido ya existe |
| `10003` | 400 | No se dispone de dirección de entrega. |
| `10004` | 400 | Cantidad por debajo de la precisión del pago. |
| `10005` | 400 | No hay combinación disponible de dirección/cantidad. |
| `10006` | 400 | El cálculo de la tasa de cambio falló. |
| `10007` | 400 | El bloque ya ha sido procesado. |
| `10008` | 400 | Pedido no encontrado |
| `10009` | 400 | Parámetros inválidos. |
| `10010` | 400 | El estado del pedido ha cambiado. |
| `10011` | 400 | Límite de pedidos infantil alcanzado. |
| `10012` | 400 | No se puede cambiar de red en un pedido infantil. |
| `10013` | 400 | El pedido no está pendiente |
| `10014` | 400 | Red desactivada |
| `10016` | 400 | El activo no se encontró. |
| `10017` | 400 | El proveedor de pagos ha sido desactivado. |
| `10018` | 400 | Configuración del proveedor de pagos incompleta. |
| `10019` | 400 | Token o red del proveedor no admitidos. |
| `10038` | 400 | La verificación del hash de transacción falló. |
| `10039` | 400 | La verificación manual requiere un pedido en la cadena. |
| `10041` | 400 | URL de notificación inválida. |
| `10042` | 400 | La creación del pedido del proveedor falló. |
| `10044` | 400 | URL de redirección inválida. |
| `10045` | 400 | La clave del comerciante no está disponible. |
| `10046` | 400 | No se pudo registrar los parámetros de devolución de EPay. |

[Lista completa de errores de la aplicación](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/util/constant/errno.go)

Para las listas y la precedencia del método EPay, consulte la [guía de integración de EPay](/es/guide/integration/epay).
