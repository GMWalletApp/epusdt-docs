---
title: "GMShop Edge, tienda digital de productos."
description: "Explore GMShop Edge, una tienda digital de productos auto-alojada con funciones de pago, gestión de pedidos e integraciones con proveedores, diseñada para Workers o Bun."
---

# GMShop Edge {#gmshop-edge}

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) es una tienda digital de productos, auto-alojada, de un solo despliegue y de un solo cliente, diseñada para **Cloudflare Workers**o un**contenedor Docker de Bun/Nitro**.

Una implementación ofrece una tienda pública receptiva, cuentas de clientes, proceso de compra y entrega, integración con Telegram, gestión de proveedores, y un panel de administración basado en permisos.

Es un proyecto complementario independiente de Epusdt y GMPay Edge. Utilice GMShop Edge cuando el producto que necesita gestionar es una tienda de bienes digitales con catálogo, proceso de compra, entrega y flujo de trabajo de proveedores.

> GMShop Edge se encuentra en desarrollo activo. Gracias a los adaptadores integrados, existen rutas de integración; sin embargo, su uso en producción aún requiere credenciales y copias de seguridad propias del proveedor, así como pruebas de aceptación con el proveedor real.

## Lo que ofrece {#what-it-provides}

- Productos estandarizados que asignan de manera atómica texto predefinido encriptado, productos de descarga privada, y productos de automatización con políticas de artefactos explícitas.
- Entendimientos permanentes, a plazo fijo, limitados, ilimitados, gratuitos, únicos y renovables por parte del cliente.
- Registro de clientes y salida, cupones, reembolsos, gestión postventa, búsqueda de pedidos privada y acceso a la entrega basado en la cuenta.
- Pagos a través de billetera de la tienda, además de Stripe, Cryptomus, GMpay, EPay, adaptadores de Alipay (Página/WAP) y WeChat (nativos/H5).
- Sincronización y cumplimiento del catálogo de proveedores a través de ACG `3.5.5`, Dujiao Next `v1.3.1`, o la API de proveedores nativa de GMShop Edge.
- Autenticación mediante credenciales de ejecución (correo electrónico/contraseña), redes sociales, OIDC, OIDC de Telegram, Widget de inicio de sesión de Telegram y Mini App de Telegram.
- Un bot de webhook de grammY con comandos localizados, botones de Mini App y soporte al cliente basado en temas de foros, sin necesidad de guardar el contenido de los mensajes.
- Control de acceso basado en roles (RBAC) dinámico y multi-rol para `/admin`, con protección de la cuenta raíz, comprobaciones de permisos en el servidor, reautenticación y registros de auditoría.
- Localizaciones de aplicaciones en inglés (`en-US`) y chino simplificado (`zh-CN`).

Cada una de las funcionalidades mencionadas anteriormente forman parte del proyecto de código abierto; no existe una versión Pro o Enterprise separada.

## Secciones de documentación {#documentation-sections}

- [Arquitectura](./architecture.md): pila de aplicaciones compartida, bindings de Workers, adaptadores de Bun, propiedad de los datos y límites de ejecución.
- [Despliegue](./deployment.md): Workers, Bun/Docker, instalación y pruebas de aceptación en producción.
- [Gestión de datos en Bun](./node-data-operations.md): copias de seguridad, restauración e importación desde Cloudflare D1/R2.
- [API de proveedor nativo](./supplier-api.md): operaciones de catálogo, pedido, canal de pago y recarga entre instancias de GMShop Edge.
- [Comercio y gestión de pedidos](./commerce-fulfillment.md): productos, inventario, proveedores, registros de envío, derechos y automatización de procesos.
- [Proceso de pago y proveedores](./checkout-providers.md): billetera y pagos externos, cotizaciones en moneda fiduciaria, correo electrónico, autenticación y soporte a través de Telegram.

## Enlaces {#links}

- Repositorio: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- Lista de verificación para el despliegue: [`docs/DEPLOYMENT.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.md)
- Buenas operaciones de datos: [`docs/NODE_DATA_OPERATIONS.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
