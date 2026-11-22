---
description: "Sigue un pedido de GMShop Edge a través del proceso de pago, la asignación de inventario, la entrega digital, la gestión de derechos y el servicio postventa."
titleTemplate: ":title | GMShop Edge"
---

# Ventas y entrega {#commerce-and-fulfillment}

GMShop Edge gestiona el catálogo, el proceso de compra, el inventario, las autorizaciones, la adquisición de proveedores, la gestión de pedidos y el servicio postventa, todo en una única implementación de tienda.

## Productos y derechos. {#products-and-entitlements}

Los tipos de producto son:

- `stock`: asigna de forma atómica texto cifrado precargado, como claves de licencia, cuentas, códigos de activación o credenciales.
- `download`: concede acceso limitado a archivos privados.
- `automation`: ejecuta despliegues, scripts, aprovisionamiento de recursos o compilaciones con políticas de artefactos `none | optional | required`.

Las autorizaciones pueden ser permanentes, a plazo fijo, limitadas, ilimitadas, gratuitas, únicas o renovables por el cliente. Los pedidos conservan instantáneas inmutables de la definición de entrada, los precios, las autorizaciones, la ejecución y la automatización.

## Propiedad del cliente y poder adquisitivo. {#customer-ownership-and-wallet}

Las órdenes registradas dirigen las referencias directamente a los usuarios de “Better Auth”. Las órdenes de invitados conservan una dirección de correo electrónico de verificación y pueden ser reclamadas por una cuenta verificada correspondiente; no se crea una tabla de clientes ocultos.

Cada cuenta puede utilizar la billetera de la tienda. El registro registra movimientos menores en unidades enteras y soporta pagos, reembolsos y ajustes administrativos sin dinero con decimales.

## Abastecimiento de proveedores {#supplier-sourcing}

GMShop Edge es compatible con:

- ACG `3.5.5` V4 API abierta.
- Dujiao Next `v1.3.1`.
- Integración nativa de GMShop: proveedor-a-proveedor.

El proveedor nativo utiliza API con claves de API creadas por administradores, puntos de acceso HTTP autenticados, acceso al catálogo y operaciones de pedido idempotentes. Otra instancia de GMShop Edge puede utilizar su adaptador de proveedor integrado para sincronizar productos y gestionar los pedidos a través de esta API.

Para cada fuente de proveedor/API, las cuentas elegibles forman un grupo de prioridad igual. La sincronización del catálogo, la compra, la devolución/conciliación y la entrega pasan a través de máquinas de estado duraderas y la tubería unificada de registro de entrega.

## Satisfacción y operaciones {#fulfillment-and-operations}

Gestionar colas y tareas programadas permite la asignación de inventario, la adquisición de proveedores, la entrega privada, trabajos automatizados, notificaciones, reembolsos, reintentos, expiración, cancelación, retención y recuperación manual. Las claves de objetos privadas nunca son seleccionadas por la entrada del cliente.

Para la aceptación local:

```bash
bun run seed:local
```

El comando es específico para un entorno local y es idempotente. Crea cuentas de proveedores deshabilitadas con orígenes de `.example.invalid` y no puede contactar a los servidores upstream reales hasta que se reemplacen las credenciales y las cuentas se habiliten explícitamente.
