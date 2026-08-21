# Deployment

GMShop Edge supports two production runtimes:

- **Node/Nitro with Docker**: SQLite, private local objects, a durable local Queue, and a persistent data volume.
- **Cloudflare Workers**: D1, KV, R2, Queues, Cron Triggers, and optional Send Email.

Both runtimes expose the same storefront, customer accounts, checkout, fulfillment, administration console, supplier API, Telegram integration, and `/install` flow.

> GMShop Edge is currently on the `alpha` release channel. Use `alpha` or a full prerelease tag for testing; `latest` is reserved for stable releases.

## Docker Compose

The public [GHCR package](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) supports `linux/amd64` and `linux/arm64`. Save the following as `compose.yml`:

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:alpha
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

`GMSHOP_DATA_DIR` is the only public Node environment variable. Configure Origin, Allowed Hosts, email, payment, supplier, Telegram, and automation settings through `/install` or `/admin`.

Node is single-instance only; multi-replica deployment and shared-network storage are unsupported. Read [Node data operations](./node-data-operations.md) before upgrading, restoring, or migrating a deployment.

To build from source, install Bun 1.3+ and Node.js 24:

```bash
bun install
bun run build:node
bun run start:node
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

Open `/install` to create the first root administrator, protected built-in roles, runtime secrets, and required settings. Installation does not create fake products, inventory, provider credentials, or payment configurations.

Before production, verify exact Host/Origin rules, a real payment and recovery email, stock/download/automation fulfillment, Queue retry and dead-letter recovery, refunds, expired entitlements, backup restoration, both application locales, themes, mobile behavior, keyboard navigation, and administrator recovery.

## Releases

Semantic-release publishes prereleases from the `alpha` channel and stable releases from `main`. Native amd64 and arm64 jobs smoke-test the image before publishing a multi-platform GHCR manifest with SBOM and provenance.
