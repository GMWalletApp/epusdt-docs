# Docker Deployment (Recommended)

This guide covers deploying Epusdt using Docker Compose — the easiest way to get started.

## Prerequisites

- Docker and Docker Compose installed

## Steps

### 1. Create a directory

```bash
mkdir epusdt && cd epusdt
```

### 2. Create the `.env` config file

Items marked ⚠️ **must** be changed:

```bash
cat <<EOF > env
app_name=epusdt
# ⚠️ Required: your payment cashier domain
app_uri=https://your-domain.com
log_level=info
http_access_log=false
sql_debug=false
http_listen=:8000

static_path=/static
runtime_root_path=/runtime

log_save_path=/logs
log_max_size=32
log_max_age=7
max_backups=3

# Database type: postgres / mysql / sqlite (default: sqlite)
db_type=sqlite

# SQLite config
sqlite_database_filename=
sqlite_table_prefix=

# MySQL config (if db_type=mysql)
mysql_host=127.0.0.1
mysql_port=3306
mysql_user=mysql_user
mysql_passwd=mysql_password
mysql_database=database_name
mysql_table_prefix=
mysql_max_idle_conns=10
mysql_max_open_conns=100
mysql_max_life_time=6

# Runtime SQLite
runtime_sqlite_filename=epusdt-runtime.db

# Queue config
queue_concurrency=10
queue_poll_interval_ms=1000
callback_retry_base_seconds=5

# Telegram bot (optional)
tg_bot_token=
tg_proxy=
tg_manage=

# ⚠️ Required: API authentication token (keep secret!)
api_auth_token=

# Order expiry in minutes
order_expiration_time=10
order_notice_max_retry=0
forced_usdt_rate=

# ⚠️ Recommended: exchange rate API URL
api_rate_url=https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/

# Recommended: TRON Grid API Key (improves stability)
tron_grid_api_key=

# Solana / Ethereum monitoring
solana_rpc_url=
ethereum_ws_url=wss://ethereum.publicnode.com

# EPay-compatible route
epay_pid=
epay_key=
EOF
```

### 3. Create `docker-compose.yaml`

```bash
cat <<EOF > docker-compose.yaml
services:
  epusdt:
    image: gmwallet/epusdt:alpine
    restart: always
    volumes:
      - ./env:/app/.env
    ports:
      - "8000:8000"
EOF
```

### 4. Start the service

```bash
docker compose up -d
```

### 5. Configure Dujiaoka

In the Dujiaoka admin panel, add a payment method:

| Field | Value |
|-------|-------|
| Merchant Key | Value of `api_auth_token` |
| API URL | `https://your-domain.com/payments/epusdt/v1/order/create-transaction` |

> 💡 If Dujiaoka and Epusdt are on the same server, use `http://127.0.0.1:8000/payments/epusdt/v1/order/create-transaction`

## Notes

- After editing `.env`, restart the container: `docker compose restart`
- Keep `api_auth_token` secret, it is also used by wallet management APIs
- If you use Solana or Ethereum payments, set `solana_rpc_url` and `ethereum_ws_url`
- Current `.env.example` also includes `epay_pid` and `epay_key` for the EPay-compatible route
