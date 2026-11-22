---
title: "Implemente la tienda en Workers o Bun."
description: "Implement GMShop Edge en Workers o Bun, y configure el almacenamiento, las colas y las tareas en segundo plano para la tienda de productos digitales."
titleTemplate: ":title | GMShop Edge"
---

# Despliegue {#deployment}

GMShop Edge admite dos tiempos de producción:

- **Auto-alojamiento de Bun/Nitro**: SQLite, objetos locales privados, una cola local duradera, y un directorio de datos persistente, utilizando Docker o un despliegue de origen con un gestor de servicios.
- **Cloudflare Workers**: D1, KV, R2, Colas, Disparadores de Cron, y opción para enviar correo electrónico.

Ambas plataformas exponen la misma tienda, cuentas de clientes, proceso de pago, gestión de envíos, panel de administración, API de proveedores, integración con Telegram y el flujo `/install`.

## Docker Compose {#docker-compose}

El paquete público [GHCR package](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) es compatible con `linux/amd64` y `linux/arm64`. Guarde el siguiente contenido como `compose.yml`:

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMSHOP_DATA_DIR: /var/lib/gmshop
    volumes:
      - gmshop-data:/var/lib/gmshop

volumes:
  gmshop-data:
```

Inicie y verifique el servicio.

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

El contenedor se ejecuta como un usuario que no es administrador. `GMSHOP_DATA_DIR` contiene `gmshop.sqlite`, objetos privados, estado duradero de la cola y todos los datos de ejecución.  Conserva y realiza una copia de seguridad del volumen `gmshop-data` cada vez que se actualice o reconstruya el contenedor.

`GMSHOP_DATA_DIR` es la única variable de entorno de Bun pública. Configure las opciones de Origin, Hosts Permitidos, correo electrónico, pago, proveedor, Telegram y automatización a través de `/install` o `/admin`.

Bun solo admite una instancia; no se permiten despliegues con réplicas múltiples ni almacenamiento en red compartido. Lea [operaciones de datos de Bun](./node-data-operations.md) antes de actualizar, restaurar o migrar un despliegue.

## Despliegue en Bun desde el código fuente {#bun-source-deployment}

Puedes ejecutar el servidor de producción directamente desde el código fuente, sin utilizar Docker. Instala Git y Bun 1.3 o una versión posterior; Node.js solo es necesario si eliges PM2 como administrador de procesos.

```bash
git clone https://github.com/GMWalletApp/gmshop-edge.git
cd gmshop-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -m 0700 -o "$USER" -g "$USER" /var/lib/gmshop
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  bun run start:bun
```

El último comando se ejecuta en primer plano. Manténgalo bajo un servicio como systemd, Supervisor, PM2, o cualquier otro gestor de servicios en producción. Asegúrese de preservar y hacer una copia de seguridad del directorio `GMSHOP_DATA_DIR`, de la misma manera que preservaría un volumen Docker. El entorno de ejecución de Bun solo admite una instancia; la implementación con réplicas múltiples y el almacenamiento en red compartido no son compatibles.

### PM2 {#pm2}

PM2 en sí mismo requiere Node.js y npm, pero GMShop Edge sigue funcionando con Bun. Se debe mantener la opción explícita `--interpreter bun` para que PM2 no intente iniciar el servidor generado con Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

Ejecuta el comando que muestra `pm2 startup`, y luego ejecuta `pm2 save` nuevamente. Utiliza `pm2 logs gmshop-edge` y `curl --fail http://127.0.0.1:3000/healthz` para verificar el servicio.

Para actualizar un despliegue de origen:

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Botón de despliegue {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

La secuencia guiada prepara el proyecto Worker. Después de la implementación, abra `/install` y verifique las siguientes asociaciones:

- D1 `gmshop-edge` como `DB`.
- KV `gmshop-edge-cache` como `CACHE`.
- Privado R2 `gmshop-edge-files` como `FILES`.
- Cola `gmshop-edge-commerce` como `COMMERCE_QUEUE`, con `gmshop-edge-commerce-dlq` como su cola de mensajes en espera.
- Cron de un minuto, y al seleccionar, Cloudflare Send Email como `EMAIL`.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

El hook `predeploy` crea o reutiliza los recursos nombrados, aplica las migraciones remotas y construye el Worker. Los IDs de D1/KV se inyectan únicamente en `dist/server/wrangler.json`; los IDs específicos de la cuenta no se escriben en el `wrangler.jsonc` portable.

## Primera instalación {#first-install}

Después de que Docker o Bun comiencen, abra `http://your-host:3000/install`. Después de una implementación de Workers, abra `/install` en la URL del Worker. Confirme la dirección pública detectada y los Hosts Permitidos antes de crear el primer administrador raíz.

La instalación crea el primer administrador raíz, roles integrados de tienda protegidos, secretos en tiempo de ejecución, y valores predeterminados para comercio, tasas de cambio, autenticación y notificaciones. No crea productos falsos, inventario, credenciales de proveedores ni configuraciones de pago.

Después de la instalación:

1. Revise la configuración del sistema generado en `/admin` y realiza una copia de seguridad de la configuración de ejecución.
2. Configure la identidad de marca, el registro, la autenticación, el correo electrónico, el comercio electrónico, la gestión de pedidos, la retención de clientes y la configuración del proveedor.
3. Cree un borrador de producto con elementos y stock que puedan vender, archivos o configuración de automatización; realice las comprobaciones de publicación antes de hacerlo público.
4. Configure un adaptador de pago y completa un pedido de aceptación con un proveedor real antes de abrir la tienda.

Antes de la producción, verificar las reglas exactas de Host/Origen, un correo electrónico de pago y recuperación real, cumplimiento de stock/descarga/automatización, reintento de cola y recuperación de mensajes en cola, reembolsos, derechos expirados, restauración de copias de seguridad, ambas localizaciones de la aplicación, temas, comportamiento móvil, navegación con teclado y recuperación del administrador.
