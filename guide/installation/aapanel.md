# aaPanel Deployment

This guide shows how to run the Epusdt service itself with aaPanel.

## Prerequisites

Prepare the following before deployment:

- A Linux server with aaPanel installed
- Nginx installed in aaPanel
- Supervisor installed in aaPanel
- A public domain pointed to the server, such as `pay.example.com`
- The Epusdt release package or a self-built `epusdt` binary
- A valid `api_auth_token`
- Optional but recommended: `tron_grid_api_key`
- Optional if using extra networks: `solana_rpc_url` and `ethereum_ws_url`

## 1. Create a site in aaPanel

In aaPanel, create a new site and bind your checkout domain.

This site is only used as the public entry for the Epusdt service behind reverse proxy. You are not deploying the documentation site, VitePress, or Cloudflare Pages here.

## 2. Upload Epusdt

Upload the Epusdt release package to the site directory, then extract it.

If needed, grant execute permission:

```bash
chmod +x /www/wwwroot/pay.example.com/epusdt
```

## 3. Configure `.env`

Rename or create `.env` in the application directory.

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

If you use MySQL instead:

```dotenv
db_type=mysql
mysql_host=127.0.0.1
mysql_port=3306
mysql_user=db_user
mysql_passwd=db_password
mysql_database=epusdt
mysql_table_prefix=
mysql_max_idle_conns=10
mysql_max_open_conns=100
mysql_max_life_time=6
```

If you use PostgreSQL instead:

```dotenv
db_type=postgres
postgres_host=127.0.0.1
postgres_port=5432
postgres_user=db_user
postgres_passwd=db_password
postgres_database=epusdt
postgres_table_prefix=
postgres_max_idle_conns=10
postgres_max_open_conns=100
postgres_max_life_time=6
```

## 4. Configure reverse proxy

In aaPanel, open the site settings and configure reverse proxy to:

```text
http://127.0.0.1:8000
```

Make sure the public domain used in proxy matches `app_uri`.

## 5. Add Supervisor process

In aaPanel Supervisor, add a process with a startup command like:

```text
/www/wwwroot/pay.example.com/epusdt http start
```

Use the Epusdt application directory as the working directory.

## 6. Verify startup

After the process starts, Epusdt should listen on port `8000` locally. Then access it through your bound domain and reverse proxy.

Use your deployed domain as the API base URL, for example:

```text
https://pay.example.com
```

Create orders through endpoints such as:

```text
POST /payments/epusdt/v1/order/create-transaction
```

## Notes

- Restart the Supervisor process after changing `.env`
- Keep `api_auth_token` secret, it is also used by wallet management APIs
- `tron_grid_api_key` is recommended for better Tron stability
- If you use Solana or Ethereum collection, configure `solana_rpc_url` and `ethereum_ws_url`
- Current `.env.example` also includes `epay_pid` and `epay_key`
- Use actual deployment paths from your aaPanel environment
