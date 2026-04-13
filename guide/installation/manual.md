# Manual Installation

This guide covers running Epusdt on a normal Linux server without Docker or aaPanel.

## Prerequisites

- A Go toolchain compatible with the current source repository `src/go.mod` (currently `Go 1.25.0`) if you plan to build from source
- Or a release package from [GitHub Releases](https://github.com/GMwalletApp/epusdt/releases)
- A Linux server
- A public domain for the checkout service, such as `pay.example.com`
- Nginx or another reverse proxy for HTTPS in production
- A valid `api_auth_token`
- Optional but recommended: `tron_grid_api_key`
- Optional if using extra networks: `solana_rpc_url` and `ethereum_ws_url`

## 1. Prepare the application directory

```bash
mkdir -p /opt/epusdt
cd /opt/epusdt
```

Choose one of the following installation methods.

### Option A. Use a release package

```bash
wget https://github.com/GMwalletApp/epusdt/releases/latest/download/epusdt_Linux_x86_64.tar.gz -O epusdt.tar.gz

tar -xzf epusdt.tar.gz
rm epusdt.tar.gz
```

### Option B. Build from source

```bash
git clone https://github.com/GMwalletApp/epusdt.git
cd epusdt/src
go build -o /opt/epusdt/epusdt .
cp .env.example /opt/epusdt/.env
```

If you used the release package and it includes `.env.example`, copy it to `.env`. Otherwise create `.env` manually.

## 2. Create `.env`

Current source supports `sqlite`, `mysql`, and `postgres`.

Minimal SQLite example:

```dotenv
app_name=epusdt
app_uri=https://pay.example.com
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

db_type=sqlite
sqlite_database_filename=
sqlite_table_prefix=

runtime_sqlite_filename=epusdt-runtime.db

queue_concurrency=10
queue_poll_interval_ms=1000
callback_retry_base_seconds=5

tg_bot_token=
tg_proxy=
tg_manage=

api_auth_token=replace_with_a_long_random_secret
order_expiration_time=10
order_notice_max_retry=0
forced_usdt_rate=
api_rate_url=
tron_grid_api_key=
solana_rpc_url=
ethereum_ws_url=wss://ethereum.publicnode.com
epay_pid=
epay_key=
```

MySQL example fields:

```dotenv
db_type=mysql
mysql_host=127.0.0.1
mysql_port=3306
mysql_user=your_user
mysql_passwd=your_password
mysql_database=epusdt
mysql_table_prefix=
mysql_max_idle_conns=10
mysql_max_open_conns=100
mysql_max_life_time=6
```

PostgreSQL example fields:

```dotenv
db_type=postgres
postgres_host=127.0.0.1
postgres_port=5432
postgres_user=your_user
postgres_passwd=your_password
postgres_database=epusdt
postgres_table_prefix=
postgres_max_idle_conns=10
postgres_max_open_conns=100
postgres_max_life_time=6
```

> Epusdt is the application you deploy. This guide does not involve VitePress, `epusdt-docs`, or Cloudflare Pages.

## 3. Start Epusdt directly for a quick test

```bash
chmod +x /opt/epusdt/epusdt
cd /opt/epusdt
./epusdt http start
```

If startup succeeds, Epusdt listens on `:8000` by default.

## 4. Configure Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name pay.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pay.example.com;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then reload Nginx:

```bash
nginx -t && systemctl reload nginx
```

## 5. Run with Supervisor

```ini
[program:epusdt]
process_name=epusdt
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/supervisor/epusdt.log
```

Apply it:

```bash
supervisorctl reread
supervisorctl update
supervisorctl start epusdt
supervisorctl tail epusdt
```

## 6. Verify service and integration

Use your deployed Epusdt domain as the API base URL, for example:

```text
https://pay.example.com
```

Create orders through endpoints such as:

```text
POST /payments/epusdt/v1/order/create-transaction
```

## Notes

- After editing `.env`, restart the process: `supervisorctl restart epusdt`
- Put Epusdt behind HTTPS in production
- Keep `api_auth_token` secret, it is also used by wallet management APIs
- `tron_grid_api_key` is recommended for better Tron query stability
- If you enable Solana or Ethereum collection, configure `solana_rpc_url` and `ethereum_ws_url`
- Current `.env.example` also includes `epay_pid` and `epay_key` for the EPay-compatible route
