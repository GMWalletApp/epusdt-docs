# aaPanel 部署

本文说明如何使用 aaPanel 部署 Epusdt 服务本体，而不是部署文档站、VitePress 或 Cloudflare Pages。

## 前置条件

开始前请准备：

- 一台已安装 aaPanel 的 Linux 服务器
- aaPanel 中已安装 Nginx
- aaPanel 中已安装 Supervisor
- 已解析到服务器的公网域名，例如 `pay.example.com`
- Epusdt 发布包，或自行编译好的 `epusdt` 二进制
- 一个安全的 `api_auth_token`
- 可选但推荐填写 `tron_grid_api_key`

## 1. 新增站点

在 aaPanel 中新建站点，并绑定你的收银台域名。

这个站点的用途是给 Epusdt 提供公网入口和反向代理，不是部署 `epusdt-docs` 文档站。

## 2. 上传 Epusdt

把 Epusdt 发布包上传到站点目录并解压。

如果需要，赋予执行权限：

```bash
chmod +x /www/wwwroot/pay.example.com/epusdt
```

## 3. 配置 `.env`

在应用目录中创建或编辑 `.env`。

最小 SQLite 示例：

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

api_auth_token=请替换为高强度随机密钥
order_expiration_time=10
order_notice_max_retry=0
forced_usdt_rate=
api_rate_url=
tron_grid_api_key=
```

如果使用 MySQL：

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

如果使用 PostgreSQL：

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

## 4. 配置反向代理

在 aaPanel 站点设置中，把反向代理目标指向：

```text
http://127.0.0.1:8000
```

确保对外域名与 `app_uri` 一致。

## 5. 添加 Supervisor 守护进程

在 aaPanel Supervisor 中新增进程，启动命令示例：

```text
/www/wwwroot/pay.example.com/epusdt http start
```

工作目录设置为 Epusdt 所在目录。

## 6. 验证启动与接入

进程启动后，Epusdt 会在本机监听 `8000` 端口，再通过你的域名对外提供服务。

对外基础地址示例：

```text
https://pay.example.com
```

创建订单接口例如：

```text
POST /payments/epusdt/v1/order/create-transaction
```

## 注意事项

- 修改 `.env` 后，记得在 Supervisor 中重启进程
- `api_auth_token` 必须保密
- `tron_grid_api_key` 推荐填写，可提升稳定性
- 文中的路径请按你的 aaPanel 实际目录替换
