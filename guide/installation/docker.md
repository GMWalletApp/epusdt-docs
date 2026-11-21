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
