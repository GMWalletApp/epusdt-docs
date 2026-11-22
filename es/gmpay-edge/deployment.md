---
title: "Implemente el gateway en Workers o Bun."
description: "Implemente GMPay Edge en Cloudflare Workers o un host de Bun. Compare la configuración en tiempo de ejecución, los requisitos de almacenamiento y las comprobaciones de despliegue."
titleTemplate: ":title | GMPay Edge"
---

# Despliegue {#deployment}

GMPay Edge admite dos ciclos de producción:

- **Auto-alojamiento de Bun/Nitro**: SQLite y un directorio de datos local persistente, utilizando Docker o un despliegue de origen con un gestor de servicios.
- **Cloudflare Workers**: D1, KV, R2, Colas y Disparadores Cron.

Ambas plataformas exponen las mismas APIs de comercio, el proceso de pago, la consola de administración, las tareas en segundo plano y el flujo `/install`.

## Docker Compose (recomendado) {#docker-compose-recommended}

El paquete público [GHCR](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) es compatible con `linux/amd64` y `linux/arm64`; no se requiere inicio de sesión en ningún registro.

Guarda lo siguiente como `compose.yml`:

```yaml
services:
  gmpay-edge:
    image: ghcr.io/gmwalletapp/gmpay-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMPAY_DATA_DIR: /var/lib/gmpay
    volumes:
      - gmpay-data:/var/lib/gmpay

volumes:
  gmpay-data:
```

Inicie el servicio.

```bash
docker compose pull
docker compose up -d
```

La etiqueta `latest` apunta a la última versión estable. Para reproducir el despliegue, fija una versión completa, por ejemplo `1.0.0`.

`GMPAY_DATA_DIR` contiene SQLite, archivos subidos, objetos privados, estado de la cola y todos los demás datos de ejecución.  Conserve y haga una copia de seguridad del volumen `gmpay-data` al actualizar o recrear el contenedor.

Lea [Operaciones de datos de Bun](./node-data-operations.md) antes de realizar una copia de seguridad, restauración o migración de una implementación.

Verifique el servicio e inspeccione los registros con:

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

Para actualizar manteniendo el volumen de datos.

```bash
docker compose pull
docker compose up -d
```

### Docker comando {#docker-command}

Si Compose no está disponible, ejecute el contenedor directamente.

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Despliegue en Bun desde el código fuente {#bun-source-deployment}

Puedes ejecutar el servidor de producción directamente desde el código fuente, sin utilizar Docker. Instala Git y Bun 1.3 o una versión posterior; Node.js solo es necesario si eliges PM2 como administrador de procesos.

```bash
git clone https://github.com/GMWalletApp/gmpay-edge.git
cd gmpay-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -o "$USER" -g "$USER" /var/lib/gmpay
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  bun run start:bun
```

El último comando se ejecuta en primer plano. Mantenlo bajo systemd, Supervisor, PM2 o cualquier otro gestor de servicios en producción. Conserve y haga una copia de seguridad de la carpeta `GMPAY_DATA_DIR` de la misma manera que se conservarían los volúmenes Docker.

### PM2 {#pm2}

PM2 en sí mismo requiere Node.js y npm, pero GMPay Edge sigue funcionando con Bun. Se debe mantener la opción explícita `--interpreter bun` para que PM2 no intente iniciar el servidor generado con Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

Ejecuta el comando que muestra `pm2 startup`, y luego ejecuta `pm2 save` nuevamente. Utiliza `pm2 logs gmpay-edge` y `curl --fail http://127.0.0.1:3000/healthz` para verificar el servicio.

Para actualizar un despliegue de origen:

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Botón de despliegue {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

Las provisiones de flujo guiado aplican los vínculos declarados en `wrangler.jsonc`, ejecutan migraciones de D1 y construyen el Worker.

- Comando de compilación: `bun run build`
- Comando de despliegue: `wrangler deploy`

Después de la implementación, abra `/install` en la URL del Worker para inicializar la instancia.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

Si D1 debe prepararse manualmente:

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

No se debe incluir el ID de la base de datos generado. El hook de despliegue crea o reutiliza los recursos denominados D1, KV, R2 y Cola, aplica la línea de base D1 y construye el Worker antes de la publicación.

## Desarrollo local {#local-development}

Requisitos:

- Bun 1.3 o posterior
- Un entorno local, respaldado por Wrangler para el entorno de ejecución de los trabajadores.

```bash
bun install
bun run dev
```

`bun run dev` aplica las migraciones pendientes a la base de datos local `gmpay-edge` D1 y inicia la aplicación en `http://localhost:3000`.

## Primera instalación {#first-install}

Después de que Docker o Bun comiencen, abra `http://your-host:3000/install`. Después de una implementación de Workers, abra `/install` en la URL del Worker. Confirme la dirección pública detectada y los Hosts Permitidos antes de crear el primer usuario raíz.

Instalación crea:

- El primer usuario.
- El rol protegido `root`.
- Secretos de ejecución.
- Incumplimientos de pago.
- Comandos públicos de Telegram y configuraciones predeterminadas de Telegram.

No crea un bot de Telegram ni se comunica con Telegram. La configuración de seguridad y de correo electrónico se gestionan a través de la interfaz de administración, en lugar de como variables de entorno del entorno de contenedores.
