---
description: "Conecte las tiendas GMShop Edge a través de la API de proveedores nativa para solicitudes de catálogo, pedidos y canales de pago firmados."
titleTemplate: ":title | GMShop Edge"
---

# API nativa de proveedores {#native-supplier-api}

GMShop Edge puede funcionar como un proveedor digital de bienes upstream para otra instancia de GMShop Edge. El protocolo nativo expone las operaciones de catálogo, pedido, canal de pago y recarga de billetera bajo `/api/v1/supplier/*`; es un protocolo de suministro para una tienda, no una API de pasarela de pago.

## Activar y emitir credenciales. {#enable-and-issue-credentials}

Habilite la API del proveedor en la configuración de administración, y luego cree una clave de API para la cuenta del cliente que realizará compras en esta tienda. La clave secreta solo se muestra al momento de su creación y se almacena encriptada. Las claves pueden ser revocadas, y se puede establecer una URL de callback permitida opcional para restringir dónde se envían las notificaciones de cumplimiento.

La instancia de GMShop Edge, que consume intensamente, selecciona el adaptador de proveedor `gmshop_edge` y almacena el ID de clave y el secreto emitido en su configuración de ejecución encriptada.

## Solicitud de firma {#request-signing}

Todas las solicitudes deben utilizar HTTPS sin especificar un puerto y enviar:

- `GMShop-Edge-Api-Key`: ID de clave emitida.
- `GMShop-Edge-Timestamp`: marca de tiempo Unix de 10 dígitos, expresada en segundos.
- `GMShop-Edge-Nonce`: valor alfanumérico/con guiones único de 16-100 caracteres.
- `GMShop-Edge-Signature`: resumen HMAC-SHA256 en hexadecimal y minúsculas.

Construye el payload de firma uniendo estos valores con caracteres de nueva línea:

```text
UPPERCASE_HTTP_METHOD
PATH_WITH_RAW_QUERY
UNIX_TIMESTAMP
NONCE
SHA256_HEX_OF_RAW_BODY
```

Calcular el HMAC-SHA256 sobre ese payload utilizando el secreto API emitido. El servidor acepta una desviación de tiempo de hasta 60 segundos y almacena cada nonce como un recibo de reuso. Reutilizar una nonce devuelve un conflicto. Los límites de velocidad actuales son 120 solicitudes por clave por minuto y 300 solicitudes por usuario por minuto.

## Endpoints {#endpoints}

| Operación | HTTP | Ruta |
| --- | --- | --- |
| Comprobar credenciales | POST | `/api/v1/supplier/ping` |
| Listar categorías | GET | `/api/v1/supplier/categories` |
| Listar productos | GET | `/api/v1/supplier/products` |
| Consultar un producto | GET | `/api/v1/supplier/products/{productId}` |
| Crear un pedido | POST | `/api/v1/supplier/orders` |
| Consultar un pedido | GET | `/api/v1/supplier/orders/{orderId}` |
| Cancelar un pedido | POST | `/api/v1/supplier/orders/{orderId}/cancel` |
| Listar canales de pago | GET | `/api/v1/supplier/payment-channels` |
| Crear una recarga | POST | `/api/v1/supplier/topups` |
| Consultar una recarga | GET | `/api/v1/supplier/topups/{id}` |

La creación de pedidos y las operaciones de recarga son idempotentes. Al reintentar una solicitud incierta, mantenga la misma referencia de idempotencia; no cree un nuevo pedido de proveedor simplemente porque el cliente expiró.

## Referencia de la API {#api-reference}

Una instancia desplegada redirige `/openapi` a su referencia API interactiva. El repositorio también publica la documentación completa de [OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml), que abarca la autenticación, la gestión de pedidos, las notificaciones de los proveedores, la administración, el soporte web y el protocolo nativo de los proveedores.
