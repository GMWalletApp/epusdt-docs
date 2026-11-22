---
description: "Configure los proveedores de pago y checkout de GMShop Edge, junto con la configuración de autenticación y notificaciones, para la tienda."
titleTemplate: ":title | GMShop Edge"
---

# Página de pago y proveedores {#checkout-and-providers}

GMShop Edge mantiene dentro de la implementación de la tienda: el proceso de pago, el estado de la billetera, las credenciales del proveedor, la configuración de autenticación y la entrega de notificaciones.

## Pagos {#payments}

Las cantidades de los pedidos en la tienda se utilizan con unidades enteras menores. Las monedas fiduciarias seleccionadas por el cliente se cotizan a partir de las tasas de cambio de la tienda, y una cotización inmutable se transmite al proveedor seleccionado.

| Proveedor | Página de pago | Reembolso | Notas de moneda |
| --- | --- | --- | --- |
| Stripe | Redireccionar | Automático | Control de la configuración del canal: monedas aceptadas |
| Cryptomus | Redireccionar | Manual | Utiliza la moneda configurada en la factura. |
| GMpay | Redireccionar | Manual | Utiliza el punto final compatible con Epusdt configurado. |
| EPay | Redireccionar | Manual | Requiere un `pid` numérico. El valor predeterminado de `paymentMethod` es `alipay`. |
| Alipay Page / WAP | Redireccionar | Automático | Requiere `CNY` con dos decimales |
| WeChat Native | Código QR o redirección | Automático | Requiere `CNY` con dos decimales |
| WeChat H5 | Redireccionar | Automático | Requiere `CNY` con dos decimales y la dirección IP del pagador. |

Los clientes registrados también pueden realizar pagos desde la billetera de la tienda integrada. Las operaciones de reembolso y postventa actualizan los registros de pagos y la billetera a través de transiciones idempotentes.

Un adaptador incorporado no garantiza que un proveedor esté listo para producción en un despliegue específico. Configure credenciales propias del proveedor y complete pruebas reales de creación de pedidos, callback/webhook, pago, reembolso y conciliación antes de abrir la tienda.

## Correo electrónico {#email}

El correo transaccional basado en plantillas admite SMTP, Resend, Postmark, SendGrid, Mailgun y el binding opcional `EMAIL` de Cloudflare Send Email. Los registros conservan el estado de entrega. La cola y las tareas programadas realizan un número limitado de reintentos.

## Autenticación {#authentication}

Better Auth admite la configuración en tiempo de ejecución de proveedores de correo electrónico/contraseña, redes sociales, OIDC genérico, OIDC de Telegram y el widget de inicio de sesión de Telegram verificado como respaldo. Las Mini Apps de Telegram verifican los `initData` para el registro/inicio de sesión automático y pueden importar un avatar de Telegram ausente. Los usuarios de Telegram pueden vincular una dirección de correo electrónico verificada independientemente de establecer una contraseña.

## Bot de Telegram y soporte. {#telegram-bot-and-support}

El bot de webhook de grammY sincroniza los comandos de la tienda localizados y los botones fijos de la Mini App. La función opcional mapea a un usuario de Telegram a un tema de foro y transmite mensajes en ambas direcciones sin almacenar el contenido de los mensajes. Esta función de puente solo confía en un espejo de administrador fresco de Telegram y cierra las conversaciones inactivas según la política de mantenimiento configurada.

Configure el token del bot, el secreto de OIDC, el grupo de soporte, la sincronización y la configuración de soporte web por separado en `/admin`; no los commits.

## Lista de verificación de seguridad {#security-checklist}

Utilice validación precisa de Hosts y Origen permitidos, HTTPS, protección contra CSRF, límites en los cuerpos de solicitud, límites de velocidad, supervisión de colas/DLQ, reautenticación con contraseñas frescas para exportaciones sensibles, recuperación de administrador y copias de seguridad probadas. Los secretos del proveedor y la autenticación deben utilizar una configuración de ejecución encriptada y nunca deben ser commitados.
