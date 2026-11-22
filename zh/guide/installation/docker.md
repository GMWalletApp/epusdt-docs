---
description: "通过 Docker Compose 部署 EPUSDT，配置收银台公网地址，持久化网关和 ChainScanner 的数据。"
title: "使用 Docker Compose 部署收款网关"
---

# 使用 Docker Compose 部署

使用部署版本自带的 [Compose 配置](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml)。默认支付服务内置 ChainScanner。

全新安装时先下载该版本的文件。

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## 启动网关

在仓库根目录设置 Compose 环境变量（例如写入项目根目录的 `.env`）。入口脚本每次启动都会读取公开收银台地址。

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

将 HTTPS 反向代理指向映射端口。在后台添加收款地址后，检查响应中的 `data.supported_assets`。

## 持久化与升级

Compose 将宿主机 `./runtime/epusdt` 挂载到容器的 `/app/runtime`。其中包含应用的 `.env`、业务库、运行库和内置扫描器数据库。项目根目录的 Compose 环境文件与此处的应用配置文件分别维护。

从 v2.0.0 升级时，先停止旧服务，备份配置和数据库，**在重建旧容器之前**将数据迁移到新挂载目录。保留原备份，并核对配置中的数据库文件名。[升级说明](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

v2.1.1 起仅支持 SQLite。升级前备份配置、业务库、运行库和扫描器数据。旧版 MySQL 或 PostgreSQL 用户需先迁移并核对数据，再切换数据库。仅修改 `db_type` 不会迁移订单。

## 使用独立扫描器

设置 `CHAINSCANNER_URL=http://chainscanner:9081`，配置不同的消费者令牌和管理员令牌。升级已有独立部署时，应保留原扫描器数据卷（`./runtime/chainscanner`）、连接地址和凭据。

```sh
docker compose --profile scanner up -d
```

使用独立扫描服务时，在 EPUSDT 进程环境或启动用的 `.env` 填写以下设置，重启后生效。留空 `CHAINSCANNER_URL` 即使用内置扫描器。

| 配置 | 用途 |
| --- | --- |
| `CHAINSCANNER_URL` | 服务的 HTTP(S) 源站，例如同机部署的 `http://127.0.0.1:9081`。容器间使用可达的服务名。 |
| `CHAINSCANNER_TOKEN` | 独立服务分配给 EPUSDT 的消费者令牌。各业务使用不同令牌。 |
| `CHAINSCANNER_ADMIN_TOKEN` | 启用后台节点管理和黑名单所需的独立管理员令牌。 |
| `CHAINSCANNER_TRANSPORT` | 默认 `ws` 推送，也支持 `grpc` 双向流和 `http` 长轮询。gRPC 需要 HTTP/2 或内网 h2c。 |

后台接口使用 EPUSDT 管理员 JWT。公共前缀为 `/admin/api/v1/chainscanner`，服务器按路由选用相应的 ChainScanner 令牌。

| 用途 | 方法和相对路径 |
| --- | --- |
| 普通节点、兜底节点 | `GET /admin/nodes`、`POST /admin/nodes`、`POST /admin/nodes/fallback`、`DELETE /admin/nodes/{id}` |
| 首页各链追块延迟 | `GET /admin/progress`（使用扫描器管理员令牌） |
| 手动复测扫描节点 | `POST /admin/nodes/{id}/test`、`POST /admin/nodes/test?network=solana` |
| RPC 地址黑名单 | `GET /admin/blacklist`、`PUT /admin/blacklist/{rule}`、`DELETE /admin/blacklist/{rule}`。例如 `keyword:acme`、`exact:rpc.example.org` |
| 连续进度、普通与严格交易查询 | `GET /heights/{network}`、`GET /transactions/{network}/{hash}`、`GET /transactions/{network}/{hash}/strict` |

可为每条链配置两家独立服务商提供的兜底节点，用于补扫和严格核验。[ChainScanner API](https://github.com/GMWalletApp/epusdt/blob/master/chainscanner/docs/api/zh-CN.md) · [上游仓库](https://github.com/GMWalletApp/ChainScanner) · [本项目使用的版本](https://github.com/GMWalletApp/epusdt/blob/master/chainscanner.rev)
