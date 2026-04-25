# Docker Deployment (Recommended)

This guide covers deploying Epusdt with the official Docker image using Docker Compose or `docker run`.

**No manual `.env` required.** If no config file is present, Epusdt starts a built-in install wizard — just open your browser and follow the steps.

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
    ports:
      - "8000:8000"
    volumes:
      - epusdt_data:/app

volumes:
  epusdt_data:
EOF
```

### 3. Start the service

```bash
docker compose up -d
```

### 4. Complete the install wizard

Open `http://your-server-ip:8000` in your browser. Epusdt will guide you through the initial setup — database, API token, domain, etc.

Once submitted, the service restarts automatically and is ready to use.

---

## Alternative: `docker run` quick start

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -p 8000:8000 \
  gmwallet/epusdt:latest
```

Then open `http://your-server-ip:8000` to complete setup.

---

## Persistent config (optional)

If you prefer to manage config as a file, mount a volume to `/app/.env`:

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -p 8000:8000 \
  -v $(pwd)/env:/app/.env \
  gmwallet/epusdt:latest
```

> After editing `.env`, restart the container: `docker restart epusdt`

---

## Notes

- After setup completes, merchant credentials and runtime options are managed from the admin panel
- For new integrations, use the merchant `pid` + `secret_key` created in the admin panel
- To upgrade: `docker pull gmwallet/epusdt:latest && docker compose up -d`
