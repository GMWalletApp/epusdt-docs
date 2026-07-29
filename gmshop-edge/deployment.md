# Deployment

GMShop Edge deploys as one Cloudflare Worker with D1, KV, private R2, one commerce Queue, a dead-letter Queue, optional Cloudflare Send Email, and Cron Triggers.

## Deploy button

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

The guided flow creates the Worker project from the repository. After it finishes, open `/install`, verify the generated resource bindings, and complete the production checklist before accepting orders.

## Wrangler CLI

Authenticate Wrangler, install dependencies, and deploy:

```bash
bun install
bunx wrangler login
bun run deploy
```

`bun run deploy` uses the repository `predeploy` hook:

```text
bun run scripts/build.ts --remote
```

The hook creates or reuses the named D1, R2, and Queue resources, applies the D1 baseline through `DB`, and builds the Worker. It does not write account-specific IDs to `wrangler.jsonc`.

Configure the `CACHE` KV namespace and, when used, the `EMAIL` binding in the Cloudflare deployment environment. Provider secrets are entered through the administration console and must never be committed.

## Local development

Requirements:

- Bun 1.3 or later.
- A local environment supported by Wrangler.

```bash
bun install
bun run dev
```

`bun run dev` applies pending migrations to the local `gmshop-edge` D1 database and starts the application at `http://localhost:3000`. It does not migrate a remote database.

## First install

Open `/install` on the first run. Installation creates the first root administrator, protected built-in roles, runtime secrets, and required settings.

It does not create fake products, inventory, provider credentials, or payment configurations.

After installation:

1. Confirm the detected application URL and configure exact Allowed Hosts.
2. Configure public branding, registration, authentication, email, commerce, fulfillment, retention, and provider settings in `/admin`.
3. Create a draft product, its sellable items, and stock, files, or automation configuration; review publish checks before making it public.
4. Configure a payment adapter and complete a real-provider acceptance order before opening the store.
5. Back up D1, private R2 data, and runtime configuration.

## Useful development commands

```bash
bun run db:migrate:local
bun run generate-routes
bun run typecheck
bun run test
bun run check
bun run build
```

When intentionally changing the Drizzle schema, run `bun run db:generate` and review the generated migration. Normal development applies migrations; it does not regenerate the clean-install baseline.
