---
title: "GMPay Edge, una puerta de pago para trabajadores y empresas."
description: "Explore GMPay Edge, un gateway de pagos independiente y auto-alojado para Cloudflare Workers o Bun, con una API de comerciante GMPay y compatibilidad con EPay."
---

# GMPay Edge {#gmpay-edge}

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge) es una pasarela de pagos con criptomonedas autoalojada y de un solo inquilino, para **Cloudflare Workers o Bun/Nitro en Docker**.

Es un proyecto independiente de Epusdt. Utilice Epusdt cuando desee que la puerta de enlace de Go esté documentada por este sitio; evalúe GMPay Edge cuando desee una puerta de enlace de TypeScript que pueda ser implementada ya sea en Cloudflare Workers o como un contenedor Docker con persistencia local basada en SQLite.

> GMPay Edge se encuentra en desarrollo activo. Gracias a las integraciones incorporadas, la funcionalidad ya existe en el proyecto; sin embargo, su uso en producción aún requiere puntos finales de propiedad del implementador, credenciales de solo lectura, métodos de recepción configurados, copias de seguridad, monitoreo y pruebas de aceptación en la plataforma real.

## Lo que ofrece {#what-it-provides}

- APIs de comercio GMPay firmadas con JSON y entrada de formulario.
- Compatibilidad de EPay en el límite de la API sin necesidad de mantener un modelo de pedido separado.
- Proceso de pago adaptable, panel de administración, páginas de estado públicas, y documentación OpenAPI en tiempo de ejecución.
- Entrega robusta de Webhooks a través de una cola con patrón de "outbox", historial de reintentos, reintentos manuales y registros de auditoría.
- Escaneo de pagos, vencimiento, limpieza, estado de conexión y sincronización de tasas a través de colas y programadores específicos para el tiempo de ejecución.
- Mejor autenticación, TOTP y control de acceso basado en roles dinámico y multi-rol para la administración.
- Automatización de bots de Telegram con grammY, incluyendo pedidos en línea, comandos públicos y suscripciones de notificaciones.
- Seis localizaciones de interfaz de usuario.

## Secciones de documentación {#documentation-sections}

- [Arquitectura](./architecture.md): servicios en Workers y Bun, colas, callbacks y límites entre protocolos.
- [Despliegue](./deployment.md): Docker Compose, imágenes de GHCR, Botón de Despliegue, CLI de Wrangler, desarrollo local y primera instalación.
- [Gestión de datos en Bun](./node-data-operations.md): copias de seguridad, restauración e importación desde Cloudflare D1/R2.
- [API para comercios](./merchant-api.md): creación y consulta de pedidos de GMPay, firmas, callbacks y compatibilidad con EPay.
- [Integraciones de pago](./payment-integrations.md): catálogo de adaptadores integrados para pagos en cadena, plataformas de intercambio y carteras.

## Enlaces {#links}

- Repositorio: [GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- README en inglés: [README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- README en chino: [README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
