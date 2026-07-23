# Deployment

GMPay Edge deploys as one Cloudflare Worker with D1, KV, R2, Queues, and Cron Triggers.

## Deploy button

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

The guided flow provisions the bindings declared by `wrangler.jsonc`, applies D1 migrations, and builds the Worker. Use:

- Build command: `bun run build`
- Deploy command: `wrangler deploy`

After deployment, open `/install` on the Worker URL to initialize the instance.

## Wrangler CLI

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

Do not commit the generated database ID. The deployment hook creates or reuses the named D1, R2, and Queue resources, applies the D1 baseline through `DB`, and builds the Worker before publication.

## Local development

Requirements:

- Bun 1.3 or later
- A local environment supported by Wrangler

```bash
bun install
bun run dev
```

`bun run dev` applies pending migrations to the local `gmpay-edge` D1 database and starts the app at `http://localhost:3000`.

## First install

Open `/install` on the first run. Installation creates:

- The first user.
- The protected `root` role.
- Runtime secrets.
- Payment defaults.
- Public Telegram commands and Telegram defaults.

It does not create a Telegram Bot or call Telegram.
