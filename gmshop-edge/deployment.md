# Deployment

GMShop Edge supports one Cloudflare Workers deployment or one Node/Nitro Docker container. Complete `/install` after either deployment before accepting orders.

> The current release is `v1.0.0-alpha.1`. Use the moving `alpha` image or the full prerelease tag for testing. `latest` is reserved for stable releases.

## Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

For a CLI deployment:

```bash
bun install
bunx wrangler login
bun run deploy
```

The `predeploy` hook creates or reuses the named D1, KV, private R2, Commerce Queue, and dead-letter Queue resources, applies remote migrations, and builds the Worker. Resolved D1/KV IDs are injected only into `dist/server/wrangler.json`; account-specific IDs are not written to the portable `wrangler.jsonc`.

Verify these bindings after deployment:

- D1 `gmshop-edge` as `DB`.
- KV `gmshop-edge-cache` as `CACHE`.
- Private R2 `gmshop-edge-files` as `FILES`.
- Queue `gmshop-edge-commerce` as `COMMERCE_QUEUE`, with `gmshop-edge-commerce-dlq` as its dead-letter Queue.
- One-minute Cron and, when selected, Cloudflare Send Email as `EMAIL`.

## Node and Docker

The public image `ghcr.io/gmwalletapp/gmshop-edge` supports `linux/amd64` and `linux/arm64`. For the current prerelease, replace the image tag in `compose.yml` with `alpha` or `1.0.0-alpha.1`:

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

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
```

The container runs as a non-root user and persists all state in `/var/lib/gmshop`. `GMSHOP_DATA_DIR` is the only public Node environment variable. Configure Origin, Allowed Hosts, email, payment, supplier, Telegram, and automation settings through `/install` or `/admin`; preserve the data volume whenever the container is recreated.

To build from source, install Bun 1.3+ and Node.js 24, run `bun run build:node`, then start it with `bun run start:node`.

See [Node data operations](./node-data-operations.md) before upgrading or migrating data.

## First install

Open `/install` to create the first root administrator, protected built-in roles, runtime secrets, and required settings. Installation does not create fake products, inventory, provider credentials, or payment configurations.

Before production:

1. Confirm the detected Origin and configure exact Allowed Hosts.
2. Configure branding, registration, authentication, email, commerce, fulfillment, retention, payment, supplier, Telegram, and automation settings.
3. Publish a tested product and verify stock, private-download, or automation fulfillment.
4. Complete a real-provider payment and email recovery test using deployer-owned credentials.
5. Test restart recovery, Queue retry/DLQ handling, refunds, expired entitlements, backups, and restoration.
6. Verify both application locales, themes, mobile and keyboard navigation, and administrator recovery.

## Releases

Semantic-release publishes `alpha` prereleases from the `alpha` channel and stable releases from `main`. Native amd64 and arm64 jobs smoke-test the image before publishing a multi-platform GHCR manifest with SBOM and provenance.
