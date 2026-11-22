---
description: "Lea las notas de lanzamiento de EPUSDT y verifique los cambios en las APIs de base de datos, despliegue y pagos antes de actualizar un gateway auto-alojado."
---

# Notas de la versión {#release-notes}

## v2.1.1 {#v2-1-1}

2026-11-21 · [Notas de la versión](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.1)

EPUSDT ahora utiliza exclusivamente SQLite. Los usuarios existentes de SQLite pueden conservar su configuración y sus bases de datos. Para MySQL o PostgreSQL, realicen una copia de seguridad, migren los datos y verifiquen la información antes de actualizar.

## v2.1.0 {#v2-1-0}

2026-11-21 · [Notas de la versión](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

- El escáner ChainScanner, al reiniciarse, recupera el progreso guardado y vuelve a intentar los bloques faltantes. La verificación rigurosa añade estados de confirmación y revisión manual.
- Ocho nuevas redes de pago directo elevan el total a 16. El proceso de salida también admite OKX OnchainOS en la Capa X y una opción para recordar las tarifas de retiro de la plataforma.
- Corrige problemas de conflicto de bloqueo en SQLite y la liberación de una reserva de cantidad de un pedido más reciente debido a un pedido caducado. Los usuarios que actualizan desde la versión v2.0.0 deben migrar sus datos antes de recrear el contenedor.

## v2.0.0 {#v2-0-0}

- Etiqueta de la versión: `v2.0.0`
- Fecha de publicación: `2026-07-23T06:04:47Z`
- Nota de la versión oficial: `Breaking change for GMPay integrations: GMPay signatures changed from MD5 to HMAC-SHA256`
- Registro de cambios completo: `https://github.com/GMWalletApp/epusdt/compare/v1.0.10...v2.0.0`

### Cambios visibles para el usuario {#user-visible-changes}

- **Cambio incompatible en las firmas de GMPay**: las solicitudes y los callbacks de GMPay ahora usan HMAC-SHA256 con la `secret_key` del comercio como clave HMAC. Los clientes que sigan usando MD5 recibirán `401 Unauthorized` hasta que se actualicen.
- Las solicitudes y las llamadas de retorno compatibles con EPay no se ven afectadas y continúan utilizando MD5 con `sign` / `sign_type`.
- La inicialización de los datos del cajero ahora incluye `server_time`, lo que permite a los clientes calcular los tiempos de cuenta en relación con la hora del servidor, en lugar de confiar en los relojes del navegador local.
- Se añadió un ejemplo de creación de pedidos GMPay en Python, utilizando únicamente bibliotecas estándar, en el archivo `sdk/python/gmpay_create_order.py`.
- La recuperación de pagos de EVM se ha mejorado, lo que permite recuperar ventanas de escaneo interrumpidas de manera más confiable.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes}

- Actualiza los clientes GMPay antes de desplegar v2.0.0. Excluye `signature` y los valores vacíos, ordena los parámetros por nombre de clave en orden ASCII y concaténalos como `key=value&key=value`. Calcula el HMAC-SHA256 con `secret_key` y codifica el resultado en hexadecimal en minúsculas.
- La configuración de tipos de cambio admite `rate.mode=fixed|auto` y `rate.cache_ttl_seconds` entre `10` y `86400` segundos. El modo fijo usa `rate.forced_rate_list`. El modo automático consulta `rate.api_url` y guarda el resultado en una caché persistente.
- La función de actualización automática mantiene las tasas de monedas exitosas anteriores cuando la respuesta del proveedor es parcial, y continúa sirviendo la última caché duradera cuando las actualizaciones o la persistencia fallan.

### Cambios en la API {#api-changes}

- `POST /payments/gmpay/v1/order/create-transaction` ahora verifica la `signature` de GMPay con HMAC-SHA256 en lugar de MD5.
- Las llamadas de devolución de GMPay deben ser verificadas utilizando la misma regla de parámetros canónicos HMAC-SHA256.
- La respuesta de `GET /pay/checkout-counter-resp/{trade_id}` ahora incluye la información `server_time`.
- Las APIs de administración agregan `GET /admin/api/v1/settings/rate/status` y `POST /admin/api/v1/settings/rate/refresh` para la inspección y actualización forzada del caché de tasas.

### Fuentes consultadas {#evidence-used}

- Versión en GitHub `v2.0.0`
- PR `#104` (fusión de desarrollo) y PR `#99` (recuperación de recuperación de EVM).
- Commits: `44d90b6` (recuperación de respaldo de EVM), `f086d8b` (cambio a `server_time`), `3dc8ab0` (modo de tarifa automático con caché persistente de respaldo), `58141cd` (firmas HMAC-SHA256 para GMPay), `2353d85` (ejemplo del SDK GMPay en Python)
- Archivos: `src/middleware/check_sign.go`, `src/util/sign/sign.go`, `src/model/service/epay_return.go`, `src/model/response/pay_response.go`, `src/config/rate.go`, `src/controller/admin/settings_controller.go`, `src/route/router.go`, `src/task/listen_evm_backfill.go`, `sdk/python/gmpay_create_order.py`


## v1.0.10 {#v1-0-10}

- Etiqueta de la versión: `v1.0.10`
- Fecha de publicación: `2026-07-10T13:24:42Z`
- Nota de la versión oficial: `Allow admin to mark expired on-chain orders as paid and seed rates`
- Registro de cambios completo: `https://github.com/GMWalletApp/epusdt/compare/v1.0.9...v1.0.10`

### Cambios visibles para el usuario {#user-visible-changes-1}

- El manual de administración ahora puede reparar **órdenes caducadas dentro de la cadena** una vez que se haya verificado el hash de la transacción enviada. La ruta de envío del hash de transacción del cajero público continúa aceptando únicamente órdenes pendientes y sigue rechazando órdenes caducadas y órdenes de OkPay/proveedor.
- Se ha establecido un valor predeterminado forzado de tasa integrado para la conversión de la stablecoin CNY: tanto `cny.usdt` como `cny.usdc` se establecen en `0.14705882352941177`.
- La lista `rate.forced_rate_list` vacía se restaura al valor predeterminado de la stablecoin CNY integrada después de actualizar la configuración o eliminar la opción; cualquier JSON personalizado no vacío permanece de propiedad del usuario y no se fusiona ni se sobrescribe.
- `rate.api_url` ya no es obligatorio; si se proporciona, aún debe ser una URL pública HTTP/HTTPS.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-1}

- `epctl upgrade` ahora requiere un archivo `/opt/epusdt/.env` existente, por lo que la actualización ya no crea una nueva configuración. Primero, ejecute `install` en una máquina nueva.
- El comando `epctl upgrade` reemplaza los archivos de lanzamiento y reinicia `epusdt` de forma predeterminada. Utilice `--no-restart` para cargar los archivos sin reiniciar, o `--prompt-restart` para preguntar en un terminal interactivo.
- La actualización de despliegue mantiene las copias de seguridad de retroceso para el binario actual, `.env.example` y la unidad de systemd. Si la implementación o el reinicio de archivos falla, `epctl` intenta restaurar los archivos de la versión anterior.

### Cambios en la API {#api-changes-1}

- El administrador de pagos aceptados marca el estado de "pendiente" y de "agotados" en las órdenes verificadas a través de la transacción en la cadena.
- `POST /pay/submit-tx-hash/{trade_id}` solo acepta pedidos en cadena pendientes de pago. Los pedidos caducados se rechazan antes de la verificación.
- La documentación de la configuración de tasas ahora trata a `rate.api_url` como opcional y documenta el comportamiento predeterminado de la restauración para `rate.forced_rate_list`.

### Fuentes consultadas {#evidence-used-1}

- Versión en GitHub `v1.0.10`
- PR `#97` (fusión de desarrollo)
- Commits: `392240e` (marca de administrador – pagado por órdenes caducadas en la cadena), `d18965d` (tasas predeterminadas por defecto para stablecoins en CNY), `6589ad1` (control de reinicio y despliegue seguro para la actualización de epctl), `8f03599` / `5668a2a` (sincronización de la construcción de la interfaz de usuario).
- Archivos: `src/controller/admin/order_controller.go`, `src/controller/comm/pay_controller.go`, `src/model/service/order_service.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/model/dao/mdb_table_init.go`, `src/controller/admin/settings_controller.go`, `epctl`, `wiki/EPCTL.md`, `wiki/EPCTL.en.md`


## v1.0.9 {#v1-0-9}

- Etiqueta de la versión: `v1.0.9`
- Fecha de publicación: `2026-06-29T10:11:08Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.8...v1.0.9`

### Cambios visibles para el usuario {#user-visible-changes-2}

- **Seletores de EPay**: EPay submit.php ahora acepta `type=alipay` o un selector compatible como `type=token.network` (por ejemplo, `usdt.tron`). Los selectores válidos seleccionan directamente el token/red de pago.
- Los callbacks de retorno y de notificación de EPay ahora conservan el `type` almacenado de la solicitud en lugar de devolver siempre `alipay`.
- El flujo de instalación puede devolver la contraseña de administrador inicial durante la configuración inicial, mientras que la API de administrador expuesta ahora solo mantiene el punto final del hash de la contraseña inicial para las advertencias de la interfaz de usuario.
- Se añadió el instalador/administrador de binarios Linux `epctl` en la raíz del repositorio, junto con `epctl-docker-test.sh` para la validación de extremo a extremo basada en Docker.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-2}

- `epctl` instala los binarios liberados en `/opt/epusdt`, crea `epusdt.service`, mantiene los archivos existentes en `/opt/epusdt/.env` durante la instalación/actualización, y puede instalarse globalmente en `/usr/local/bin/epctl`.
- EPay `epay.default_token` y `epay.default_network` se ignoran cuando se proporciona un selector válido `type=token.network`; `epay.default_currency` sigue proporcionando la moneda predeterminada.
- No se requieren nuevas variables de entorno.

### Cambios en la API {#api-changes-2}

- `GET` / `POST /payments/epay/v1/order/create-transaction/submit.php` ahora restringe que el parámetro `type` no esté vacío, limitándolo a `alipay` o a un selector de `token.network` actualmente soportado.
- La respuesta de `GET /pay/return/{trade_id}` y las notificaciones asíncronas de EPay reutilizan el `type` almacenado. Si falta `type`, se usa `alipay`.
- `GET /admin/api/v1/auth/init-password-hash` sigue siendo el punto final inicial para el estado de la contraseña; la antigua ruta de administración `init-password` en texto plano no está registrada en esta versión.

### Fuentes consultadas {#evidence-used-2}

- Versión en GitHub `v1.0.9`
- PR `#92` (fusión de desarrollo)
- Commits: `2dc538c` (selectores de tipo EPay), `73aef80` (restricción del tipo de envío), `15de0e6` (mantener la contraseña inicial disponible), `7d09adf` (retornar la contraseña inicial del administrador), `1cdb1ed` (instalador y documentación de epctl)
- Archivos: `src/route/router.go`, `src/controller/comm/order_controller.go`, `src/model/service/epay_return.go`, `src/install/installer.go`, `epctl`, `epctl-docker-test.sh`, `wiki/EPCTL.md`


## v1.0.8 {#v1-0-8}

- Etiqueta de la versión: `v1.0.8`
- Fecha de publicación: `2026-06-20T06:31:53Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.7...v1.0.8`

### Cambios visibles para el usuario {#user-visible-changes-3}

- El soporte para aptos blockchain ya está disponible para pagos con USDT y USDC – el sistema incluye la configuración de soporte de tokens, enrutamiento de RPC y escaneo de transacciones en la cadena para activos basados en Aptos Move.
- El soporte de tokens y la enrutamiento de RPC ahora se gestionan a partir de la cadena y la configuración de chain_token configuradas por el administrador, eliminando las direcciones de contrato codificadas en el escáner.
- La verificación de pagos manual ahora admite la validación de transacciones de Aptos.
- La documentación README se ha actualizado para incluir a Aptos junto con otras cadenas soportadas.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-3}

- Para la funcionalidad de la cadena, se requiere un punto final RPC configurado en el panel de administración: el escáner seguirá las versiones del libro mayor de Aptos y analizará los eventos del módulo Move para las transferencias de tokens.
- No se requieren nuevas variables de entorno; la configuración de la cadena y el token de Aptos sigue el flujo de configuración existente de la cadena/token administrativo.

### Cambios en la API {#api-changes-3}

- Aptos ahora está disponible como una opción en la lista de activos admitidos y los puntos de finalización para la creación de pedidos.
- Los puntos finales de administración de la cadena y gestión de tokens ahora admiten campos de configuración específicos de Aptos.

### Fuentes consultadas {#evidence-used-3}

- Versión en GitHub `v1.0.8`
- PR `#91` (fusión de desarrollo)
- Commits: `de96a5d` (Soporte de Aptos), `8216c91` (Soporte de tokens basado en la configuración)
- Archivos: `README.md`, `README.en.md`, `src/controller/admin/chain_token_controller.go`, `src/model/service/aptos_task.go`, `src/task/listen_aptos_scanner.go`, `src/util/address/move.go`


## v1.0.7 {#v1-0-7}

- Etiqueta de la versión: `v1.0.7`
- Fecha de publicación: `2026-06-16T11:37:43Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.6...v1.0.7`

### Cambios visibles para el usuario {#user-visible-changes-4}

- Las funciones de creación de órdenes de GMPay y EPay ahora admiten órdenes con marcadores — es posible crear órdenes sin necesidad de una dirección de pago en la cadena de bloques inmediata, lo que permite integraciones que requieren identificadores de órdenes antes de que se seleccione el método de pago real.
- Las órdenes de marcador se convierten en órdenes completas y en la cadena cuando el cliente selecciona una red de pago en el flujo de caja.
- El flujo de trabajo de pedidos ahora admite la selección de red diferida, permitiendo a los comerciantes crear los pedidos y dejar que los clientes elijan la opción de pago más adelante.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-4}

- No se requieren nuevas variables de entorno.
- El soporte para pedidos de marcador está habilitado de forma predeterminada para los flujos de GMPay y EPay.

### Cambios en la API {#api-changes-4}

- `POST /payments/gmpay/v1/order/create-transaction` y los endpoints de creación de pedidos de EPay ahora aceptan pedidos sin necesidad de los parámetros `network` o `token` al inicio – omitir estos crea un pedido de marcador.
- Las órdenes de marcador devuelven un `trade_id` y una URL del cajero, pero no incluyen una dirección de billetera hasta que el cliente selecciona una red.
- `POST /pay/switch-network` convierte un pedido de marcador en un pedido completo en la cadena, asignando la red seleccionada y generando una dirección de pago.

### Fuentes consultadas {#evidence-used-4}

- Versión en GitHub `v1.0.7`
- PR `#89` (fusión de desarrollo)
- Commit: `3ab3659` (soporte de pedidos de marcador)
- Archivos: `src/model/service/order_service.go`, `src/controller/comm/order_controller.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data.go`, `wiki/API.md`


## v1.0.6 {#v1-0-6}

- Etiqueta de la versión: `v1.0.6`
- Fecha de publicación: `2026-06-11T16:51:24Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.5...v1.0.6`

### Cambios visibles para el usuario {#user-visible-changes-5}

- El sistema ahora admite pagos con la blockchain TON y Jetton USDT, incluyendo escaneo de transacciones basado en liteclient, normalización de direcciones TON (formatos brutos/amigables al usuario/de retorno), y validación de contratos Jetton.
- La verificación de pagos manual ahora incluye la verificación de las transacciones TON con validación de prueba en la cadena.
- El nivel de registro ahora se puede ajustar en el panel de configuración del administrador sin necesidad de reiniciar el servidor: los cambios en el nivel de registro se aplican de inmediato en todos los registradores activos.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-5}

- TON liteclient requiere una configuración de liteserver pública (red principal o red de pruebas); el escáner se sincronizará a partir del bloque maestro más reciente y seguirá las cadenas de shards para las transferencias de Jetton.
- No se requieren nuevas variables de entorno; la configuración de la cadena TON y del token sigue el flujo de configuración existente de los nodos RPC y los tokens de la cadena.

### Cambios en la API {#api-changes-5}

- TON ahora está disponible como una opción en la lista de activos compatibles y los puntos de finalización para la creación de pedidos.
- La API de configuración de administrador ahora incluye `log_level` para ajustar los registros en tiempo de ejecución (valores válidos: `debug`, `info`, `warn`, `error`).

### Fuentes consultadas {#evidence-used-5}

- Versión en GitHub `v1.0.6`
- PR `#87` (fusión de desarrollo)
- Commits: `9b397bd` (soporte TON), `9ac9894` (nivel de registro en tiempo de ejecución)
- Archivos: `src/task/listen_ton.go`, `src/util/address/ton.go`, `src/model/service/ton_task.go`, `src/util/log/log.go`, `src/controller/admin/settings_controller.go`


## v1.0.5 {#v1-0-5}

- Etiqueta de la versión: `v1.0.5`
- Fecha de publicación: `2026-06-09T16:25:25Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.4...v1.0.5`

### Cambios visibles para el usuario {#user-visible-changes-6}

- El panel de administración ahora muestra estadísticas en tiempo real sobre la ejecución de nodos RPC a través de un punto final de Eventos Server-Sent (SSE), lo que permite a la interfaz de usuario mostrar el número de llamadas RPC en tiempo real, las tasas de éxito y las estadísticas de errores sin necesidad de realizar consultas.
- Las estadísticas de tareas RPC de Solana ahora rastrean el número de llamadas por nodo y por operación (escaneo de firmas, obtención de transacciones, obtención de confirmaciones) y los eventos de error.
- Las tareas de EVM websocket y escaneo de bloques ahora reportan métricas de llamadas RPC al rastreador de estadísticas en memoria.
- El archivo README ha sido actualizado con información sobre la auditoría de seguridad y capturas de pantalla nuevas.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-6}

- No se requieren nuevas variables de entorno.
- El punto final SSE está disponible en `/api/admin/v1/rpc/stats/stream` y requiere autenticación con JWT de administrador.

### Cambios en la API {#api-changes-6}

- `GET /api/admin/v1/rpc/stats/stream` (SSE) devuelve un flujo JSON de estadísticas de ejecución de nodos RPC; cada evento incluye el ID del nodo, el número de llamadas, el número de éxitos, el número de errores y la marca de tiempo de la última vez que se vio.

### Fuentes consultadas {#evidence-used-6}

- Versión en GitHub `v1.0.5`
- PR `#86` (fusión de desarrollo)
- Commits: `08d409d` (estadísticas SSE vía RPC), `54b83f8` (actualización del README), `3879853` (archivos de activos)
- Archivos: `src/controller/admin/dashboard_controller.go`, `src/model/data/rpc_runtime_stats.go`, `src/task/listen_sol_job.go`, `src/task/listen_evm_ws.go`, `README.md`


## v1.0.4 {#v1-0-4}

- Etiqueta de la versión: `v1.0.4`
- Fecha de publicación: `2026-06-03T13:01:37Z`
- Nota de la versión oficial: `feat(www): enable RPC node create and edit actions — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.3...v1.0.4`

### Cambios visibles para el usuario {#user-visible-changes-7}

- La interfaz administrativa ahora permite crear y editar nodos RPC directamente en el navegador – anteriormente estas acciones estaban deshabilitadas o eran incompletas en la interfaz.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-7}

- No se requieren nuevas variables de entorno ni cambios en el backend; esta es una actualización únicamente en la interfaz de usuario.

### Cambios en la API {#api-changes-7}

- No se agregaron ni se eliminaron rutas de API; ahora la interfaz de usuario está llamando correctamente los endpoints existentes de gestión de nodos.

### Fuentes consultadas {#evidence-used-7}

- Versión en GitHub `v1.0.4`
- PR `#85`: función(www): habilitar acciones de creación y edición de nodos RPC
- Commit: `3e85bf7` (actualización de activo web)
- Archivos: `src/www/assets/*` (actualización del paquete frontend)


## v1.0.3 {#v1-0-3}

- Etiqueta de la versión: `v1.0.3`
- Fecha de publicación: `2026-05-27T11:42:43Z`
- Nota de la versión oficial: `docs: update payment API integration guide — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.2...v1.0.3`

### Cambios visibles para el usuario {#user-visible-changes-8}

- Los identificadores de comercio se generan ahora utilizando bytes aleatorios de forma segura criptográficamente y se codifican en base64 segura para URL, reemplazando el formato anterior basado en marcas de tiempo — esto reduce el riesgo de colisiones y mejora la anonimidad.
- Los nodos RPC admiten el campo `purpose` (`general`, `manual_verify` o `both`). Esto permite dedicar nodos a la verificación manual de pagos sin afectar al escaneo, las conexiones WSS ni las comprobaciones de estado.
- La verificación de pagos manual ahora prioriza los nodos `manual_verify` y, en caso de que no estén disponibles nodos dedicados, recurre a los nodos `general`, distribuyendo la carga de verificación de forma independiente de la carga de escaneo.
- La página de pago del cajero ahora permite a los usuarios enviar manualmente un hash de transacción para verificación. Los hashes enviados se validan en la cadena de bloques antes de que se marque el pedido como pagado.
- Las consultas de agregación de tendencias en el panel ahora utilizan SQL específico para cada sistema de bases de datos (MySQL/PostgreSQL/SQLite) para garantizar el truncamiento correcto de fechas en todas las bases de datos compatibles.
- Las URLs de llamada de pago y las URLs de la API de tasas ahora están validadas para rechazar rangos de direcciones IP privadas (RFC 1918), previniendo así los ataques SSRF a través de URLs de llamada controladas por el usuario.
- La guía de integración de la API de pagos en el archivo README del repositorio ha sido actualizada con ejemplos más claros y descripciones de los puntos finales.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-8}

- No se requieren nuevas variables de entorno.
- Los operadores ahora pueden etiquetar los nodos RPC con `purpose: manual_verify` en el panel de administración para aislar el tráfico de verificación del tráfico de escaneo.

### Cambios en la API {#api-changes-8}

- `POST /api/admin/v1/order/update-trade-status` y `POST /payments/gmpay/v1/pay/submit-hash` aceptan un parámetro `tx_hash` para la presentación manual del hash; el hash se valida en la cadena antes de cualquier cambio de estado.
- Los endpoints de creación y actualización de nodos RPC admiten `purpose` (`general`, `manual_verify`, `both`). El valor predeterminado es `general`.

### Fuentes consultadas {#evidence-used-8}

- Versión en GitHub `v1.0.3`
- PR `#81` (fusión de desarrollo)
- Commits: `c69b0d6` (aislamiento de propósito RPC), `13c81ee` (IDs de comercio aleatorios para cripto), `fca75a9` (súbida de hash del cajero), `b70995f` (corrección del dialecto SQL del panel), `0d97237` (actualización del README), `7fcb7b3` (documentación de la API de pago)
- Archivos: `src/model/mdb/rpc_node.go`, `src/model/data/rpc_node_data.go`, `src/controller/admin/rpc_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data_stats.go`, `src/controller/comm/pay_controller.go`, `README.md`


## v1.0.2 {#v1-0-2}

- Etiqueta de la versión: `v1.0.2`
- Fecha de publicación: `2026-05-22T15:16:34Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.1...v1.0.2`

### Cambios visibles para el usuario {#user-visible-changes-9}

- La API de administración admite un JWT directamente en el encabezado `Authorization` (sin el prefijo `Bearer `), además del formato estándar `Bearer <token>`. Los clientes que envían el token sin prefijo ya no reciben un error de autenticación por ese motivo.
- La detección de transferencias EVM ERC20 ahora omite las transferencias que llegaron antes de que se creara el pedido, eliminando coincidencias de pagos falsas provenientes de eventos de blockchain obsoletos.
- Las notificaciones de éxito de pago de OkPay ahora se envían correctamente después de que un pedido se completa a través del proceso de OkPay.
- El procesamiento de firmas ahora incluye reintentos en errores transitorios. Una firma solo se marca como procesada una vez que la coincidencia de la orden y el manejo de pagos se completen exitosamente. Por lo tanto, los fallos temporales ya no se ignoran y no impiden el procesamiento de los pagos.
- Las configuraciones de tasas ahora admiten una lista de tasas de cambio multi-divisa obligatoria, permitiendo a los operadores fijar las tasas de cambio para múltiples divisas simultáneamente, en lugar de una única tasa global.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-9}

- No se requieren nuevas variables de entorno.
- La función de tipo de cambio forzado en múltiples divisas podría requerir la actualización de la configuración de tasas en el panel de administración si anteriormente utilizabas una tasa forzada de USDT única.

### Cambios en la API {#api-changes-9}

- El middleware JWT de administración ahora acepta tanto `Authorization: Bearer <token>` como `Authorization: <token>` (token sin prefijo).
- No se agregaron ni se eliminaron nuevas rutas públicas.

### Fuentes consultadas {#evidence-used-9}

- Versión en GitHub `v1.0.2`
- PR `#80` (fusión de desarrollo)
- Commits: `f4ef71b3`, `4b4701f5`, `449d22a4`, `dec1b97b`, `8a486116`, `2a00a033`
- Cambios: middleware JWT para el administrador, receptor de bloques ERC20 de EVM, manejador de notificaciones de OkPay, lógica de reintento de firmas de Solana, modelo de configuración de tasas.


## v1.0.1 {#v1-0-1}

- Etiqueta de la versión: `v1.0.1`
- Fecha de publicación: `2026-05-21T11:40:39Z`
- Nota de la versión oficial: `feat: expose build version in public config — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.0...v1.0.1`

### Cambios visibles para el usuario {#user-visible-changes-10}

- La respuesta de `GET /payments/gmpay/v1/config` incluye el campo `version`, que indica la versión del servidor en ejecución (por ejemplo, `"version": "v1.0.1"`).
- Las entradas de configuración que se han eliminado de forma "suave" ahora se restauran mediante upsert, en lugar de simplemente dejarlas eliminadas, lo que garantiza que los cambios de configuración se apliquen correctamente después de una eliminación previa.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-10}

- La publicación de imágenes de Docker ahora está restringida a las cargas de etiquetas `v*`; las construcciones sin etiquetas de versión ya no se publican en el registro.
- La versión de compilación se introduce durante la compilación a través de las construcciones de Docker y GoReleaser, por lo que la versión reportada en la respuesta de la API coincide con la etiqueta de lanzamiento.

### Cambios en la API {#api-changes-10}

- La respuesta de `GET /payments/gmpay/v1/config` ahora incluye `version` (cadena), que refleja la versión de compilación del servidor.

### Fuentes consultadas {#evidence-used-10}

- Versión en GitHub `v1.0.1`
- PR `#72`: característica: mostrar la versión de construcción en la configuración pública.
- Commits: `85b81e66`, `09642d4c`, `c19a7e5f`
- Archivos: `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/data/settings_data.go`, `.github/workflows/docker-alpine.yml`, `src/.goreleaser.yaml`

## v1.0.0 {#v1-0-0}

- Etiqueta de la versión: `v1.0.0`
- Fecha de publicación: `2026-05-20T16:09:00Z`
- Nota de la versión oficial: `feat: verify manual mark-paid payments — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.7...v1.0.0`

### Cambios visibles para el usuario {#user-visible-changes-11}

- El manual de administración para pagos ahora realiza una verificación en la cadena antes de marcar un pedido como pagado: el hash de la transacción se verifica contra la cadena antes de que se acepte el cambio de estado.
- Verificación de la dirección del destinatario, la dirección del contrato de token, el monto del pago, la cantidad de confirmaciones y la marca de tiempo de la transacción para evitar falsos positivos.
- Las transacciones duplicadas con los mismos hashes son rechazadas — no se puede utilizar la misma transacción en la cadena para marcar múltiples pedidos como pagados.
- Las órdenes que no fueron creadas como órdenes en la cadena no se incluyen en la ruta de verificación manual (los tipos de órdenes que no se crearon en la cadena son rechazados).
- La respuesta `supported_assets` ahora incluye un campo `display_name` junto con la clave existente `network`, lo que facilita que las interfaces de usuario muestren los nombres de las cadenas de manera legible para el usuario, sin modificar el identificador de la red subyacente.
- La clave de red de BSC ha sido renombrada de `bsc` a `binance` en la lista de activos soportados.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-11}

- No se requieren nuevas variables de entorno.
- Sin modificaciones a la configuración de la imagen de Docker ni a la configuración de docker-compose.

### Cambios en la API {#api-changes-11}

- El punto de administración para marcas pagadas ahora requiere un parámetro `tx_hash` válido y realiza una validación en la cadena antes de aceptar la solicitud; los hashes inválidos o duplicados resultan en una respuesta de error.
- Las entradas de activos compatibles de `GET /payments/gmpay/v1/config` ahora incluyen `display_name`.
- El valor de la red BSC en los activos soportados ha cambiado de `bsc` a `binance`.

### Fuentes consultadas {#evidence-used-11}

- Versión en GitHub `v1.0.0`
- PR `#70`: característica: verificar pagos manuales marcados como pagados
- Commit: `049a15c`
- Archivos: `src/controller/admin/order_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`

## v0.9.7 {#v0-9-7}

- Etiqueta de la versión: `v0.9.7`
- Fecha de publicación: `2026-05-13T09:01:26Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.6...v0.9.7`

### Cambios visibles para el usuario {#user-visible-changes-12}

- El archivo `README.zh-CN.md` fue eliminado; ahora `README.md` es el único archivo README principal, consolidando la documentación en un único punto de acceso.
- Los activos de administración de la interfaz (manifesto de precarga del service worker y todos los fragmentos de JS combinados) fueron reconstruidos con hashes de contenido actualizados, resolviendo los problemas de caché obsoleta para los usuarios que previamente habían accedido al panel de administración.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-12}

- No se introdujeron nuevas variables de entorno.
- No cambios en el comportamiento en tiempo de ejecución — esto es simplemente una actualización de los activos de la interfaz de usuario y una limpieza de la documentación.

### Cambios en la API {#api-changes-12}

- No se agregaron, eliminaron o modificaron ninguna ruta de API.

### Fuentes consultadas {#evidence-used-12}

- Versión en GitHub `v0.9.7`
- Comparar cambios `v0.9.6...v0.9.7`
- Commits `52b171b`, `4a69b7c`, `b0093c4`, `864eb59`
- Archivos: `README.md`, `README.zh-CN.md`, `src/www/sw.js`, `src/www/index.html`, `src/www/assets/*`

## v0.9.6 {#v0-9-6}

- Etiqueta de la versión: `v0.9.6`
- Fecha de publicación: `2026-05-11T10:09:43Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.5...v0.9.6`

### Cambios visibles para el usuario {#user-visible-changes-13}

- La funcionalidad de inicio (bootstrap) ahora muestra las credenciales administrativas iniciales en la consola, lo que permite descubrir el primer inicio sin necesidad de inspeccionar la base de datos.
- La configuración de apariencia del panel de administración admite `background_color` y `background_image_url` para personalizar el fondo de la página de pago.
- La precisión del monto de pago ahora es configurable: los operadores pueden establecer cuántas cifras decimales se aplican al generar los montos de pago.
- La resolución del token TRON ya es dinámica en el receptor de bloques, eliminando la necesidad de codificar manualmente las direcciones de los contratos de token al inicio.
- `README.md` ahora es el archivo README principal en chino simplificado; existe un archivo separado `README.en.md` para los lectores en inglés. El archivo `README.zh-CN.md` fue eliminado en una actualización (4a69b7c8).
- Se eliminaron el directorio `plugins/` y el ejemplo del plugin `dujiaoka` empaquetado del repositorio.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-13}

- No se requiere una nueva variable de entorno.
- La reorganización del archivo README es únicamente para documentación y no afecta el comportamiento en tiempo de ejecución.

### Cambios en la API {#api-changes-13}

- La respuesta de `GET /payments/gmpay/v1/config` ahora incluye los campos de apariencia `background_color` y `background_image_url`.
- La respuesta de `GET /payments/gmpay/v1/config` ahora incluye `payment_amount_precision` de la configuración de pagos.
- No se agregaron ni se eliminaron rutas.

### Fuentes consultadas {#evidence-used-13}

- Versión en GitHub `v0.9.6`
- Comparar cambios `v0.9.5...v0.9.6`
- Commits: `1a35cab`, `2d546e3`, `a8a3b86`, `3e0be9b`, `7c9e3e1`, `84972ea`, `1c805ed`, `8d2ddbd`, `07d1d83`, `7a905ba`, `4dc1ba8`, `4a69b7c`
- Archivos: `src/bootstrap/bootstrap.go`, `src/controller/admin/settings_controller.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/task/listen_trc20_block.go`

## v0.9.5 {#v0-9-5}

- Etiqueta de la versión: `v0.9.5`
- Fecha de publicación: `2026-05-09T13:51:58Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.4...v0.9.5`

### Cambios visibles para el usuario {#user-visible-changes-14}

- La integración de pago ahora incluye una ruta de pago `okpay` además del flujo existente de selección de red en la cadena.
- El flujo de pagos ahora puede devolver una `payment_url` en las respuestas del checkout, de modo que los procesos de pago de terceros, como los sub-pedidos de OkPay, tengan un destino de redirección explícito en lugar de depender únicamente de la visualización de la dirección del cajero local.
- Las respuestas de configuración pública ahora exponen los metadatos del cajero visible para el sitio, como nombre, URL del logo, título del sitio web y enlace de soporte, lo que reduce la codificación rígida en la renderización de la marca/configuración del frontend.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-14}

- El archivo de entorno de ejemplo eliminó los bloques de configuración antiguos de PostgreSQL y MySQL; la guía de configuración publicada actual refleja valores predeterminados de ejecución centrados en SQLite en lugar de sugerir que esas bases de datos siguen siendo parte de la configuración estándar.
- La limpieza del Dockerfile eliminó los pasos redundantes de copia `static` que ya no coinciden con la ruta de entrega del frontend activo.
- El mantenimiento también actualizó el contenido del logo/descargo de responsabilidad, pero esto es secundario a los cambios relacionados con la ejecución/pago mencionados anteriormente.

### Cambios en la API {#api-changes-14}

- La configuración frontal de GMPay ahora se obtiene a través de `GET /payments/gmpay/v1/config` en lugar del método anterior de búsqueda de activos soportados de forma independiente.
- `GET /payments/gmpay/v1/config` devuelve `supported_assets` junto con la identidad visual del sitio, los valores predeterminados de EPay y los campos de configuración pública de OkPay.
- Se añadió la entrada de callback de OkPay: `POST /payments/okpay/v1/notify`.
- `POST /pay/switch-network` ahora documenta/acepta `network=okpay` además de los valores de red en la cadena.
- Los payloads de respuesta de checkout ahora incluyen `payment_url`.

### Fuentes consultadas {#evidence-used-14}

- Versión en GitHub `v0.9.5`
- Comparar cambios `v0.9.4...v0.9.5`
- Commits `377176a`, `3623a54`, `51ad344`, `ff157c3`, `1a35cab`, `2d546e3`
- Archivos de código relevantes: `src/route/router.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/response/order_response.go`, `src/model/response/support_response.go`, `src/.env.example`

## v0.9.4 {#v0-9-4}

- Etiqueta de la versión: `v0.9.4`
- Fecha de publicación: `2026-04-28T16:37:20Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### Cambios visibles para el usuario {#user-visible-changes-15}

- La escaneo de pagos de TRON ha vuelto a una ruta basada en bloques en el historial de la versión actual, por lo que la reversión temporal del flujo más reciente de TRON ya no representa el estado ascendente efectivo.
- Las correcciones para el procesamiento de pagos de seguimiento ajustaron el comportamiento de las notificaciones de los pedidos después del manejo exitoso del pago.
- La entrada de pago alojada ahora redirige al flujo de caja de la SPA en lugar de renderizar una plantilla HTML específica del lado del servidor directamente desde `/pay/checkout-counter/:trade_id`.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-15}

- El flujo de pago alojado ahora se basa en la ruta de entrega `www/` basada en SPA, en lugar de la ruta anterior de activos de pago dedicada `static/`.
- La imagen de Docker fue posteriormente limpiada para eliminar los pasos de copia `static` redundantes que ya no se corresponden con la ruta de entrega actual de la SPA.

### Cambios en la API {#api-changes-15}

- `GET /pay/checkout-counter/:trade_id` ahora funciona como una entrada de redirección para el personal de caja.
- La fuente actual identifica `GET /pay/checkout-counter-resp/:trade_id` como el punto final de respuesta JSON utilizado por el nuevo flujo de pago de la SPA.
- No se añadió un nuevo campo de firma de comerciantes ni un contrato de callback en esta versión.

### Fuentes consultadas {#evidence-used-15}

- Versión en GitHub `v0.9.4`
- Comparar cambios `v0.9.3...v0.9.4`
- Commits `9e885d8`, `de9c45a`, `96ea748`, `51a2acc`, `d17d212`, `9c533a7`, `ff68279`
- Problema previo `#55` relativo a la falta de archivos de checkout en las implementaciones de Docker.

## v0.9.3 {#v0-9-3}

- Etiqueta de la versión: `v0.9.3`
- Fecha de publicación: `2026-04-25T10:50:34Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### Cambios visibles para el usuario {#user-visible-changes-16}

- Se corrigió la ruta raíz después de la instalación, para que `GET /` sirva consistentemente la SPA en lugar de ser interceptada por el controlador raíz del backend.
- El modo de instalación sigue redirigiendo la ruta raíz a `/install`, por lo que el flujo de configuración inicial se mantiene intacto.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-16}

- No se ha publicado ninguna nueva variable de entorno pública ni indicador de despliegue para esta versión.
- La principal modificación en el comportamiento de la ruta de ejecución se realizó para asegurar que las instancias instaladas se carguen de manera más confiable en la aplicación web.

### Cambios en la API {#api-changes-16}

- No se introdujeron nuevas rutas de API públicas en esta versión.
- La ruta del backend se ha cambiado de un controlador de tipo "`Any("/")`" (que capturaba todo) a un controlador backend de tipo "`POST("/")`", dejando el tráfico normal de los navegadores "`GET /`" para la SPA.

### Fuentes consultadas {#evidence-used-16}

- Versión en GitHub `v0.9.3`
- Comparar cambios `v0.9.2...v0.9.3`
- Commits que incluyen `95879e3`, etiqueta de merge `67263da`

## v0.9.2 {#v0-9-2}

- Etiqueta de la versión: `v0.9.2`
- Fecha de publicación: `2026-04-24T16:14:34Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### Cambios visibles para el usuario {#user-visible-changes-17}

- La configuración de las tarifas administrativas ahora permite configurar una tasa de USDT obligatoria.
- Los ejemplos de despliegue de Docker siguen estando alineados con la imagen de referencia actual `gmwallet/epusdt:latest`.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-17}

- No se ha publicado ninguna nueva variable de entorno público en las notas de lanzamiento.
- Los ejemplos existentes de actualización de Docker continúan utilizando `gmwallet/epusdt:latest`.

### Cambios en la API {#api-changes-17}

- No se observó ninguna nueva ruta de API pública en las notas de la versión ni en la comparación de diferencias para esta versión.

### Fuentes consultadas {#evidence-used-17}

- Versión en GitHub `v0.9.2`
- Comparar cambios `v0.9.1...v0.9.2`
- Commits que incluyen `dd1bf70`, `143bc84`

## v0.9.1 {#v0-9-1}

- Etiqueta de la versión: `v0.9.1`
- Fecha de publicación: `2026-04-22T18:29:39Z`

### Cambios visibles para el usuario {#user-visible-changes-18}

- Asistente de instalación integrado: si no encuentra un archivo de configuración válido en el primer arranque, abre el asistente web. El formulario incluye `app_name`, `app_uri`, dirección y puerto de escucha, rutas de ejecución y de registros, caducidad de pedidos y reintentos de callbacks.
- La imagen de Docker ahora admite la descarga directa con `docker pull gmwallet/epusdt:latest`; no es necesario montar un archivo `.env` para la implementación inicial.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-18}

- El asistente de instalación crea automáticamente el archivo `.env` al primer envío; los reinicios posteriores omiten el asistente y arrancan normalmente.
- El montaje de volumen en `docker-compose.yaml` para `.env` ya no es obligatorio; omítalo para una primera ejecución limpia basada en un asistente.

### Cambios en la API {#api-changes-18}

- No se han añadido nuevas rutas de API públicas en esta versión.

## v0.9.0 {#v0-9-0}

- Etiqueta de la versión: `v0.9.0`
- Fecha de publicación: `2026-04-21T20:23:33Z`
- Nota de la versión oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### Cambios visibles para el usuario {#user-visible-changes-19}

- Se añadió un panel de administración completo para gestionar las claves API, las cadenas, los tokens de cadena, los carteras, los pedidos, los nodos RPC, la configuración, las notificaciones y las estadísticas del panel.
- Se amplió el soporte multi-cadena, incluyendo una mayor cobertura de los listeners EVM y flujos de gestión de cadenas/tokens orientados al administrador.
- Se agregaron canales de notificaciones de Telegram y posteriormente se sincronizaron con las actualizaciones de configuración.
- Se introdujo un flujo de instalación inicial para simplificar la configuración inicial.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-19}

- El archivo `.env.example` ha modificado la opción predeterminada de instalación para la secuencia de configuración inicial, estableciéndola en "habilitada".
- Ahora, el tiempo de ejecución incluye comprobaciones de estado de los nodos RPC con soporte automático de conmutación.
- Se agregaron los activos estáticos de administración al tiempo de ejecución del servidor.
- Se han introducido nuevos modelos de persistencia para usuarios administrativos, claves API, cadenas, tokens de cadena, nodos RPC, configuraciones y canales de notificación.

### Cambios en la API {#api-changes-19}

- Se añadió una interfaz completa de API REST de administración, que abarca la autenticación, las claves de API, las cadenas, los tokens de cadena, los carteras, los pedidos, los nodos RPC, la configuración, las estadísticas del panel y las notificaciones.
- Se añadió la autenticación de administradores basada en JWT y un middleware de autenticación con claves API.
- Las estructuras de respuesta/solicitud relacionadas con el pago, los activos soportados, la billetera y los pedidos se ampliaron, junto con el flujo de trabajo administrativo.

### Fuentes consultadas {#evidence-used-18}

- Versión en GitHub `v0.9.0`
- Comparar cambios `v0.0.8...v0.9.0`
- Commits que incluyen: `6bb47d4`, `5edc9dc`, `b499bc0`, `6ea5637`, `9163943`

## v0.0.8 {#v0-0-8}

- Etiqueta de la versión: `v0.0.8`
- Fecha de publicación: `2026-04-15T10:44:56Z`
- Nota de la versión oficial: `- Enable polygon,plasma supports`

### Cambios visibles para el usuario {#user-visible-changes-20}

- Se añadió el soporte para las redes `polygon` y `plasma`.
- La conducta de selección de red en la página de pago se ha ajustado.
- La lógica de almacenamiento de la dirección de la billetera EVM fue corregida.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-20}

- No se pudieron ver nuevas variables de entorno en la nota de lanzamiento ni en la comparación de diferencias.

### Cambios en la API {#api-changes-20}

- No se introdujo de forma clara una nueva ruta de API pública en la nota oficial.
- El comportamiento relacionado con la red, que ha sido respaldado, continúa a partir de la línea de trabajo `v0.0.7`.

### Fuentes consultadas {#evidence-used-19}

- Versión en GitHub `v0.0.8`
- Comparar cambios `v0.0.7...v0.0.8`
- Commits que incluyen `f7c5f67`, `097c716`

## v0.0.7 {#v0-0-7}

- Etiqueta de la versión: `v0.0.7`
- Fecha de publicación: `2026-04-15T06:00:55Z`
- Nota de la versión oficial: `suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### Cambios visibles para el usuario {#user-visible-changes-21}

- Se añadió soporte para `bsc`, `polygon` y `plasma`.
- Se añadieron parámetros de formulario compatibles con EPay para una mayor compatibilidad con la integración.
- La interacción a través de Telegram y el manejo de pagos se han actualizado en el flujo de trabajo de pagos.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-21}

- Se han añadido múltiples rutas de escucha EVM en el historial de código fuente, para soportar nuevas redes.
- No se ha publicado una nueva variable `.env` bien documentada en el cuerpo de las notas oficiales.

### Cambios en la API {#api-changes-21}

- Se añadió el trabajo relacionado con las API relacionadas con la cadena de soporte / el activo soportado en el historial de código.
- La lógica del router se ha actualizado para soportar tanto los formatos `GET` como `POST` para el flujo de envío compatible con EPay.

### Fuentes consultadas {#evidence-used-20}

- Versión en GitHub `v0.0.7`
- Comparar cambios `v0.0.6...v0.0.7`
- Commits que incluyen: `9c003fb`, `8cd816c`, `786c5e8`, `70f8ed4`

## v0.0.6 {#v0-0-6}

- Etiqueta de la versión: `v0.0.6`
- Fecha de publicación: `2026-04-12T20:06:08Z`
- Anuncio oficial: comparar `v0.0.5...v0.0.6`

### Cambios visibles para el usuario {#user-visible-changes-22}

- La interfaz de pago para la compra en línea fue rediseñada para un flujo de pago de dos pasos.
- Se añadió la opción de cambiar la ruta de pago para seleccionar múltiples redes de pago.
- La función de escaneo de pagos de Solana ahora admite `USDT` y `USDC`.
- Se añadió la detección de pagos ERC-20 en Ethereum para `USDT` y `USDC`.
- Las notificaciones de pago de Telegram ahora incluyen información de la red.
- La validación de la billetera de Telegram se ha mejorado para direcciones de múltiples redes.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-22}

- Se añadió `solana_rpc_url`
- Se añadió `ethereum_ws_url`
- Se añadió `epay_pid`
- Se añadió `epay_key`
- El bloqueo y la conciliación de pedidos ahora tienen en cuenta `network` durante la ejecución.

### Cambios en la API {#api-changes-22}

- Se han añadido puntos de acceso para la gestión de billeteras bajo `/payments/gmpay/v1/wallet/*`
- Se añadió `POST /pay/switch-network`
- Se añadió la ruta compatible con EPay: `GET /payments/epay/v1/order/create-transaction/submit.php`
- La respuesta de checkout ahora incluye `is_selected`.
- El flujo de creación acepta opcionalmente los parámetros `name` y `payment_type`.
- La fuente actual utiliza identificadores de red en minúsculas, como `tron`, `solana` y `ethereum`.

### Fuentes consultadas {#evidence-used-21}

- Versión en GitHub `v0.0.6`
- Comparar cambios `v0.0.5...v0.0.6`
- Commits que incluyen `3f071e6`, `32ca778`, `5e4d5df`

## v0.0.5 {#v0-0-5}

- Etiqueta de la versión: `v0.0.5`
- Fecha de publicación: `2026-04-03T17:05:30Z`
- Nota de la versión oficial: `test: fix macOS path assertion and wallet address unique index`

### Cambios visibles para el usuario {#user-visible-changes-23}

- Ninguna función principal para el usuario final fue descrita en las notas oficiales.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-23}

- No se pudieron ver nuevas variables de despliegue en la nota oficial.

### Cambios en la API {#api-changes-23}

- El comportamiento del índice único de la dirección de la billetera se ajustó en el historial de código.

### Fuentes consultadas {#evidence-used-22}

- Versión en GitHub `v0.0.5`
- Comparar cambios `v0.0.4...v0.0.5`

## v0.0.4 {#v0-0-4}

- Etiqueta de la versión: `v0.0.4`
- Nombre de la versión: `New UI Update`
- Fecha de publicación: `2026-04-03T16:05:23Z`
- Nota de la versión oficial: `feat: change payment ui`

### Cambios visibles para el usuario {#user-visible-changes-24}

- La interfaz de pago ha sido actualizada.

### Cambios en el despliegue y la configuración {#deployment-and-configuration-changes-24}

- No se mencionaron cambios orientados al despliegue en la nota de lanzamiento.

### Cambios en la API {#api-changes-24}

- No se mencionaron cambios que afecten a la API en la nota de lanzamiento.

### Fuentes consultadas {#evidence-used-23}

- Versión en GitHub `v0.0.4`
- Anuncio oficial de lanzamiento

## Notas para los encargados. {#notes-for-maintainers}

Para las próximas versiones, el formato de lanzamiento más útil es:

1. Cambios visibles para el usuario
2. Cambios en la implementación o configuración.
3. Cambios en la API o en el esquema.
4. Notas de actualización o cambios importantes.
