---
description: "Entienda cómo GMShop Edge conecta la tienda, la administración, el almacenamiento y la gestión de pedidos a través de las implementaciones de Workers y Bun."
titleTemplate: ":title | GMShop Edge"
---

# Arquitectura {#architecture}

GMShop Edge utiliza el mismo stack React/TanStack completo en Cloudflare Workers o Bun/Nitro. Una única implementación gestiona la tienda pública, el área de cuentas de los clientes, el proceso de pago, la gestión de pedidos, la integración con proveedores, la integración con Telegram y el panel de administración.

## Límites de aplicación compartidos {#shared-application-boundaries}

Las rutas siguen siendo limitadas. Las páginas de características, los esquemas, las funciones del servidor y el comportamiento del dominio se encuentran en `src/features`; la infraestructura de ejecución entre dominios se encuentra en `src/server`; los esquemas de Drizzle se encuentran en `src/db/schema`.

La aplicación mantiene la identidad, el control de acceso basado en roles (RBAC), el catálogo, los pedidos, el inventario, los derechos de acceso, el estado de los proveedores, el registro de la billetera, las notificaciones, la protección contra la reproducción, los límites de velocidad, la cola de mensajes (outbox) y los datos de auditoría en la base de datos principal. El dinero se almacena como cadenas de enteros decimales en unidades menores y nunca se calcula con números de punto flotante.

## Adaptadores de Cloudflare Workers {#cloudflare-workers-adapters}

La asignación de personal utiliza:

- `DB`: D1 para aplicaciones y comercio de carácter autoritativo.
- `FILES`: almacenamiento privado en R2 para archivos de productos, descargas, resultados de automatizaciones y exportaciones.
- `CACHE`: Almacenamiento de datos para cachés validadas, con versiones y límites definidos; los límites de seguridad son determinados por la base de datos.
- `COMMERCE_QUEUE`: Cola para tareas de entrega, automatización, notificaciones, proveedores y reembolsos, con una cola de mensajes en espera.
- `EMAIL`: binding opcional de Cloudflare Send Email.
- Disparadores de Cron de 60 segundos para procesamiento y mantenimiento programado.

## Adaptadores para bún/nitro {#bun-nitro-adapters}

El entorno de ejecución de Bun proporciona adaptadores equivalentes dentro de un único directorio de datos:

- SQLite como la base de datos de referencia.
- Caché limitada en proceso.
- Almacenamiento local de objetos privado.
- Una cola duradera basada en SQLite.
- Un programador de procesos de un minuto.

`GMSHOP_DATA_DIR` contiene la base de datos, los objetos, el estado de la cola y los datos de ejecución. Bun está diseñado **exclusivamente para una sola instancia**: no se admiten despliegues con réplicas múltiples ni almacenamiento en red compartido.

## Datos y trabajo de fondo. {#data-and-background-work}

Los objetos privados se resuelven a través de registros de base de datos autorizados; los clientes nunca seleccionan claves de objeto. Las colas y el trabajo programado gestionan la sincronización con proveedores, la adquisición, la entrega, las notificaciones, las devoluciones, los reintentos, la retención, el mantenimiento de Telegram y la rotación de claves fuera de las solicitudes de tienda sincrónicas.

La línea de migración para la instalación limpia es `drizzle/0000_gmshop.sql`; las migraciones posteriores se aplican en orden y sus checksums son validados por las operaciones de datos de Bun.
