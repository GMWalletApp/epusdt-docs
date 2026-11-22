---
description: "Install EPUSDT with Docker Compose, configure the public checkout URL, and persist the gateway and ChainScanner data across container restarts."
title: "Install the payment gateway with Docker Compose"
---

# Install with Docker Compose

Use the [Compose file](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml) from the version you are installing. The default service includes ChainScanner.

For a fresh installation, get the release files first.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Start the gateway

From the repository root, set the public checkout URL in the Compose environment (for example, a project-level `.env`). The entrypoint uses it on each startup.

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

Point your HTTPS reverse proxy at the mapped port. Configure a receiving address, then check `data.supported_assets` in the response.

## Storage and upgrades

Compose mounts `./runtime/epusdt` at `/app/runtime`. That directory holds the application `.env`, business and runtime databases, and the embedded scanner database. The project-level Compose environment and the application configuration are separate files.

When upgrading from v2.0.0, stop the old service, back up its configuration and databases, and copy them to the new mount **before recreating the old container**. Preserve the original backups and check the configured database filenames. [Release notes](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

Starting with v2.1.1, the gateway uses SQLite only. Back up the configuration, business and runtime databases, and scanner data. For an older MySQL or PostgreSQL installation, migrate and verify the data before switching. Changing `db_type` alone does not migrate orders.

## Using a standalone scanner

Set `CHAINSCANNER_URL=http://chainscanner:9081` and provide distinct consumer and admin tokens. Keep the existing scanner volume (`./runtime/chainscanner`), URL and credentials when upgrading a standalone deployment.

```sh
docker compose --profile scanner up -d
```

EPUSDT starts ChainScanner in-process by default, using a private loopback port and automatically generated credentials. Subscriptions, cursors and node settings persist in `chainscanner.sqlite` in the EPUSDT runtime directory. To use a standalone scanner instead, configure its HTTP(S) origin in `CHAINSCANNER_URL` and a dedicated consumer credential in `CHAINSCANNER_TOKEN`. Set a separate `CHAINSCANNER_ADMIN_TOKEN` for scan progress, node diagnostics and blacklist management. Configure persistent scanner storage and reconcile pending orders when migrating. The default event transport is WebSocket. Set `CHAINSCANNER_TRANSPORT=grpc` for bidirectional streaming or `http` for long polling.

You can configure fallback nodes from two independent providers per network for retries and strict verification. [ChainScanner API](https://github.com/GMWalletApp/epusdt/blob/master/chainscanner/docs/api/en.md) · [Upstream project](https://github.com/GMWalletApp/ChainScanner) · [Pinned revision](https://github.com/GMWalletApp/epusdt/blob/master/chainscanner.rev)
