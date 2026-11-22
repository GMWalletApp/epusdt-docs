---
description: "Obtenga información sobre GMPay y EPay, las credenciales del comerciante, los activos habilitados y la verificación de devolución al integrar EPUSDT."
title: "Preguntas frecuentes sobre la integración de comerciantes"
---

# FAQ {#faq}

## ¿Qué endpoint debo usar? {#which-route-should-i-use}

- Utilice GMPay para todas las nuevas integraciones.
- Utilice la redirección compatible con EPay solo cuando el sistema upstream requiera una redirección de pago similar a EPay.
- No cree nuevas integraciones en `/payments/epusdt/v1/order/create-transaction` ya que esta ruta ya no está registrada en la fuente actual.

## ¿De dónde provienen las claves `pid` y de firma? {#where-do-pid-and-signing-keys-come-from}

Consulta los registros de claves de API en el panel de administración. Cada comercio tiene un `pid` y su `secret_key` correspondiente.

## ¿Por qué la configuración de GMPay difiere entre los entornos? {#why-does-the-gmpay-config-differ-between-environments}

Dado que `GET /payments/gmpay/v1/config` se calcula a partir de tus propios datos de administración.

La lista `data.supported_assets` depende de las cadenas habilitadas, los tokens de cadena habilitados y las direcciones de billetera disponibles en ese entorno.

## ¿Qué nodos necesito? {#which-nodes-do-i-need}

El ChainScanner integrado incluye nodos públicos. TRON puede utilizar un punto final público compatible sin necesidad de una clave de TronGrid. Al agregar un nodo, seleccione su red y el protocolo que realmente ofrece el proveedor. Una suscripción WebSocket puede anunciar un nuevo bloque mientras un punto final HTTP separado lo lee.

El panel muestra el progreso de la exploración y alerta cuando se detecta un retraso superior a cinco minutos. Para consultas frecuentes de Solana, TON o Plasma, configure nodos de respaldo de dos proveedores independientes y verifique sus límites de uso.

## ¿Cómo se establecen los tipos de cambio? {#how-are-exchange-rates-set}

Selecciona `fixed` para utilizar `rate.forced_rate_list` o `auto` para obtener las tasas desde `rate.api_url`. El modo automático conserva las tasas almacenadas en caché si no se puede actualizar. Una lista vacía de tasas forzadas restaura las tasas predeterminadas para CNY de USDT y USDC.
