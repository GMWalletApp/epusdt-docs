# Deployment

GMShop Edge supports two production runtimes:

- **Bun/Nitro self-hosting**: SQLite, private local objects, a durable local Queue, and a persistent data directory, using Docker or a source deployment with a service manager.
- **Cloudflare Workers**: D1, KV, R2, Queues, Cron Triggers, and optional Send Email.

Both runtimes expose the same storefront, customer accounts, checkout, fulfillment, administration console, supplier API, Telegram integration, and `/install` flow.

## Docker Compose

The public [GHCR package](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) supports `linux/amd64` and `linux/arm64`. Save the following as `compose.yml`:

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

Start and verify the service:

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

The container runs as a non-root user. `GMSHOP_DATA_DIR` contains `gmshop.sqlite`, private objects, durable Queue state, and all runtime data. Preserve and back up the `gmshop-data` volume whenever the container is updated or recreated.

`GMSHOP_DATA_DIR` is the only public Bun environment variable. Configure Origin, Allowed Hosts, email, payment, supplier, Telegram, and automation settings through `/install` or `/admin`.

Bun is single-instance only; multi-replica deployment and shared-network storage are unsupported. Read [Bun data operations](./node-data-operations.md) before upgrading, restoring, or migrating a deployment.

## Bun source deployment

You can run the production server directly from source without Docker. Install Git and Bun 1.3 or later; Node.js is only required if you choose PM2 as the process manager.

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

The last command runs in the foreground. Keep it under systemd, Supervisor, PM2, or another service manager in production. Preserve and back up `GMSHOP_DATA_DIR` just as you would preserve the Docker volume. The Bun runtime remains single-instance only; multi-replica deployment and shared-network storage are unsupported.

### PM2

PM2 itself requires Node.js and npm, but GMShop Edge still runs with Bun. Keep the explicit `--interpreter bun` option so PM2 does not try to start the generated server with Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup`, then run `pm2 save` again. Use `pm2 logs gmshop-edge` and `curl --fail http://127.0.0.1:3000/healthz` to verify the service.

To update a source deployment:

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers

### Deploy button

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

The guided flow prepares the Worker project. After deployment, open `/install` and verify these bindings:

- D1 `gmshop-edge` as `DB`.
- KV `gmshop-edge-cache` as `CACHE`.
- Private R2 `gmshop-edge-files` as `FILES`.
- Queue `gmshop-edge-commerce` as `COMMERCE_QUEUE`, with `gmshop-edge-commerce-dlq` as its dead-letter Queue.
- One-minute Cron and, when selected, Cloudflare Send Email as `EMAIL`.

### Wrangler CLI

```bash
bun install
bunx wrangler login
bun run deploy
```

The `predeploy` hook creates or reuses the named resources, applies remote migrations, and builds the Worker. Resolved D1/KV IDs are injected only into `dist/server/wrangler.json`; account-specific IDs are not written to the portable `wrangler.jsonc`.

## First install

After Docker or Bun starts, open `http://your-host:3000/install`. After a Workers deployment, open `/install` on the Worker URL. Confirm the detected public address and Allowed Hosts before creating the first root administrator.

Installation creates the first root administrator, protected built-in storefront roles, runtime secrets, and required commerce, exchange-rate, authentication, and notification defaults. It does not create fake products, inventory, provider credentials, or payment configurations.

After installation:

1. Review the generated system settings in `/admin` and back up the runtime configuration.
2. Configure branding, registration, authentication, email, commerce, fulfillment, retention, and provider settings.
3. Create a draft product with sellable items and stock, files, or automation configuration; pass its publish checks before making it public.
4. Configure a payment adapter and complete a real-provider acceptance order before opening the store.

Before production, verify exact Host/Origin rules, a real payment and recovery email, stock/download/automation fulfillment, Queue retry and dead-letter recovery, refunds, expired entitlements, backup restoration, both application locales, themes, mobile behavior, keyboard navigation, and administrator recovery.
