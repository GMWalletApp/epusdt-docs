# Deployment

GMPay Edge supports two production runtimes:

- **Node/Nitro with Docker**: SQLite and a persistent local data volume. This is the recommended self-hosted path for a server or NAS.
- **Cloudflare Workers**: D1, KV, R2, Queues, and Cron Triggers.

Both runtimes expose the same merchant APIs, checkout, admin console, background jobs, and `/install` flow.

## Docker Compose (recommended)

The public [GHCR package](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) supports `linux/amd64` and `linux/arm64`; no registry login is required.

Save the following as `compose.yml`:

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

Start the service:

```bash
docker compose pull
docker compose up -d
```

The `latest` tag tracks the latest stable release. Pin a full version such as `1.0.0` for reproducible deployment.

`GMPAY_DATA_DIR` contains SQLite, uploaded files, private objects, queue state, and all other runtime data. Preserve and back up the `gmpay-data` volume when updating or recreating the container.

Read [Node data operations](./node-data-operations.md) before backing up, restoring, or migrating a deployment.

Verify the service and inspect logs with:

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

To update while retaining the data volume:

```bash
docker compose pull
docker compose up -d
```

### Docker command

If Compose is unavailable, run the container directly:

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Cloudflare Workers

### Deploy button

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

The guided flow provisions the bindings declared by `wrangler.jsonc`, applies D1 migrations, and builds the Worker. Use:

- Build command: `bun run build`
- Deploy command: `wrangler deploy`

After deployment, open `/install` on the Worker URL to initialize the instance.

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

If D1 must be prepared manually:

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

Do not commit the generated database ID. The deployment hook creates or reuses the named D1, KV, R2, and Queue resources, applies the D1 baseline, and builds the Worker before publication.

## Local development

Requirements:

- Bun 1.3 or later
- A local environment supported by Wrangler for the Workers development runtime

```bash
bun install
bun run dev
```

`bun run dev` applies pending migrations to the local `gmpay-edge` D1 database and starts the app at `http://localhost:3000`.

## First install

After Docker starts, open `http://your-host:3000/install`. After a Workers deployment, open `/install` on the Worker URL. Confirm the detected public address and Allowed Hosts before creating the first root user.

Installation creates:

- The first user.
- The protected `root` role.
- Runtime secrets.
- Payment defaults.
- Public Telegram commands and Telegram defaults.

It does not create a Telegram Bot or call Telegram. Application, security, and email settings are managed in the admin interface rather than as container environment variables.
