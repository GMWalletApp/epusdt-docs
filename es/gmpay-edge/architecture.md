---
description: "Observa cómo GMPay Edge comparte su lógica de pedidos y pagos entre Workers y Bun, y cuáles son los servicios de almacenamiento y ejecución que utiliza cada despliegue."
titleTemplate: ":title | GMPay Edge"
---

# Arquitectura {#architecture}

GMPay Edge se ejecuta ya sea como un único Worker o dentro de un contenedor Bun/Nitro. Ambos entornos de ejecución comparten las mismas superficies de producto y el núcleo de pedidos/pagos; solo las adaptadoras de infraestructura difieren.

## Superficies de producto {#product-surfaces}

- Los clientes comerciales se refieren a los límites compatibles con GMPay o EPay.
- Los pagadores utilizan el sistema de pago alojado.
- Los operadores utilizan `/admin`.
- Los usuarios de Telegram interactúan a través del bot configurado.

## Servicios de ejecución {#runtime-services}

| Capacidad | Cloudflare Workers | Bun/Nitro Docker |
| --- | --- | --- |
| Base de datos | D1 | SQLite en `GMPAY_DATA_DIR` |
| Cache | KV | Almacenamiento en caché local |
| Objetos privados | R2 | Almacenamiento local persistente |
| Trabajo de fondo | Cloudflare Queues | Colas locales duraderas |
| Programación | Cron Triggers | Programador de tareas eficiente. |

El directorio de datos de Bun también contiene archivos subidos y el estado duradero de la cola. Debe montarse en un volumen persistente e incluirse en las copias de seguridad.

## Bindings de Cloudflare {#cloudflare-bindings}

| Binding | Producto de Cloudflare | Finalidad |
| --- | --- | --- |
| `DB` | D1 | Datos autorizados de aplicación, pago, autorización y entrega. |
| `CACHE` | KV | Cachés validadas de corta duración y telemetría complementaria. |
| `FILES` | R2 | Evidencia de revisión de pagos privados y exportaciones generadas. |
| `PAYMENT_QUEUE` | Colas | Escaneo de pagos asíncronos |
| `WEBHOOK_QUEUE` | Colas | Entrega asíncrona de Webhooks de comercio electrónico. |

## Trabajo de fondo {#background-work}

Las colas y los programadores duraderos específicos para cada ejecución permiten mover los escaneos de pagos y los reintentos de Webhook fuera de las solicitudes sincrónicas. Además, gestionan la expiración de pagos, la limpieza, las comprobaciones de estado de la conexión y la sincronización de tasas.

La entrega de webhooks utiliza una salida duradera con historial de reintentos, reintentos manuales y registros de auditoría en ambas etapas.

## Modelo de datos y seguridad {#data-and-security-model}

- D1 o SQLite son la fuente de autoridad para el entorno de ejecución seleccionado.
- Cache y el almacenamiento privado utilizan los adaptadores de la ejecución seleccionada.
- Los adaptadores de pago son de solo lectura.
- La administración utiliza Better Auth, TOTP y RBAC de roles múltiples dinámicos.

## Límites del protocolo {#protocol-boundaries}

GMPay utiliza firmas **HMAC-SHA256**. La compatibilidad con EPay requiere seguir una frontera de **MD5** heredada. Las llamadas de retorno (callbacks) mantienen el formato de firma del protocolo original.
