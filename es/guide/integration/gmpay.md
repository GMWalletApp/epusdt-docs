---
description: "Integre el punto final de la orden EPUSDT GMPay, valide las solicitudes del comerciante y redirige al comprador a la URL de pago devuelta por la pasarela."
---

# Integración con GMPay (recomendada) {#gmpay-integration-recommended}

Utilice GMPay para todas las nuevas integraciones.

## Ruta {#route}

```text
POST /payments/gmpay/v1/order/create-transaction
```

## Requisito de credenciales comerciales {#merchant-credential-requirement}

Antes de llamar a la API, crea o consulta una clave de API en el panel de administración.

Necesitas:

- `pid`
- `secret_key`

Incluye `pid` en la solicitud y usa `secret_key` como clave de firma.

## Solicitud mínima. {#minimal-request-body}

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "signature": "hmac-sha256-hex(...)"
}
```

## Regla de firma {#signature-rule}

> Desde la versión `v2.0.0`, GMPay utiliza HMAC-SHA256 en lugar de MD5.  Es necesario actualizar a los clientes antes de implementar la versión v2, de lo contrario recibirán un error `401 Unauthorized`. Las solicitudes compatibles con EPay no se verán afectadas.

1. Conserva todos los campos no vacíos salvo `signature`
2. Ordena las claves según el orden ASCII
3. Concatena los pares en la forma `key=value&...`
4. Calcula el HMAC-SHA256 usando la `secret_key` del comercio como clave HMAC
5. Envía el resumen hexadecimal de 64 caracteres en minúscula en `signature`

## Rutas de compañía útiles {#useful-companion-routes}

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

Si el cliente necesita opciones de red/tokens dinámicas, léelas de `data.supported_assets` en la respuesta de `/payments/gmpay/v1/config`.

Consulte `data.site` para la imagen de marca y `data.epay`, `data.okpay` y `data.xlayer` para la configuración de los pagos.

## Verificación de callbacks {#callback-verification}

Las respuestas de GMPay se envían como un `POST` JSON a la URL `notify_url`.

Verifica la firma HMAC-SHA256, comprueba que el pago corresponda al pedido y procésalo de forma idempotente. Confirma la recepción con HTTP 200 y el texto plano `ok` o `success`, sin distinción entre mayúsculas y minúsculas.

## Nota de respuesta exitosa {#success-response-note}

La fuente actual incluye `payment_url` en las respuestas exitosas de la creación de pedidos, lo que permite al usuario un destino de redirección de pago alojado explícitamente, en lugar de reconstruir esa URL manualmente.
