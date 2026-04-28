# Docker Deployment (Recommended)

This guide covers deploying Epusdt with the official Docker image using Docker Compose or `docker run`.

**No manual `.env` is required for the first boot.** The recommended Docker layout is to mount a dedicated host directory and point `EPUSDT_CONFIG` to a file inside it. That keeps config, the default SQLite database, and runtime data persistent **without** shadowing files from the image.

## Prerequisites

- Docker and Docker Compose installed

## Steps

### 1. Create a directory

```bash
mkdir epusdt && cd epusdt
```

### 2. Create `docker-compose.yaml`

```bash
cat <<EOF > docker-compose.yaml
services:
  epusdt:
    image: gmwallet/epusdt:latest
    restart: always
    environment:
      EPUSDT_CONFIG: /data/.env
    ports:
      - "8000:8000"
    volumes:
      - ./data:/data
EOF
```

Why this layout:

- `/data/.env` stores the generated config file
- `/data/epusdt.db` becomes the default primary SQLite database
- `/data/runtime/` stores runtime SQLite data and logs by default
- the container image under `/app` stays untouched, so upgrades do not get masked by an old `/app` volume

### 3. Start the service

```bash
docker compose up -d
```

### 4. Complete the install wizard

Open `http://your-server-ip:8000` in your browser. The install wizard currently focuses on these fields:

- `app_name`
- `app_uri`
- `http_bind_addr`
- `http_bind_port`
- `runtime_root_path`
- `log_save_path`
- `order_expiration_time`
- `order_notice_max_retry`

::: warning Docker binding requirement
For Docker deployments, set `http_bind_addr` to `0.0.0.0`.

Do **not** use `127.0.0.1`. If you save `127.0.0.1` in the wizard, Epusdt will only listen on `127.0.0.1:8000` inside the container after restart, so the published Docker port and reverse proxy access can fail.
:::

Once submitted, the service restarts automatically and is ready to use.

::: tip Checkout UI files in `/data`
If you deploy with the recommended `-v ./data:/data` layout and previously hit missing hosted checkout files under `/data/static`, current upstream now auto-copies any missing built-in static files from the image into your configured `static_path` during startup.

So the Docker layout shown above should work without a separate manual copy step for the checkout UI.
:::

---

## Alternative: `docker run` quick start

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -e EPUSDT_CONFIG=/data/.env \
  -p 8000:8000 \
  -v $(pwd)/data:/data \
  gmwallet/epusdt:latest
```

Then open `http://your-server-ip:8000` to complete setup.

---

## File-based config management (optional)

If you prefer to review or edit the generated config later, use the same `./data` directory created above. After installation, the config file is stored at:

```text
./data/.env
```

You can edit it directly on the host, then restart the container:

```bash
docker restart epusdt
```

---

## Notes

- After setup completes, merchant credentials and runtime options are managed from the admin panel
- For new integrations, use the merchant `pid` + `secret_key` created in the admin panel
- Avoid mounting the entire `/app` directory. It can cause old files from a previous container volume to shadow the new image during upgrades.
- To upgrade: `docker pull gmwallet/epusdt:latest && docker compose up -d`
