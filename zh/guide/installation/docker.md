# Docker 部署（推荐）

本教程基于官方 Docker 镜像部署 Epusdt，支持 Docker Compose 或 `docker run` 方式。

**首次启动通常不需要手动建立 `.env` 文件。** 推荐做法是挂载一个独立的宿主机目录，并把 `EPUSDT_CONFIG` 指向这个目录里的配置文件。这样可以同时持久化设置、默认 SQLite 主数据库与运行时数据，且**不会**把镜像内的 `/app` 文件整个覆盖掉。

## 前置条件

- 已安装 Docker 和 Docker Compose

## 步骤

### 1. 建立目录

```bash
mkdir epusdt && cd epusdt
```

### 2. 建立 `docker-compose.yaml`

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

这种挂载方式的好处是：

- `/data/.env` 会保存安装向导产生的配置文件
- `/data/epusdt.db` 会成为默认主 SQLite 数据库
- `/data/runtime/` 会保存运行时 SQLite 数据与日志
- 镜像内 `/app` 保持干净，升级时不会被旧卷内容遮蔽

### 3. 启动服务

```bash
docker compose up -d
```

### 4. 完成安装向导

浏览器开启 `http://你的服务器IP:8000`，按页面提示完成安装。当前安装向导主要涵盖以下字段：

- `app_name`
- `app_uri`
- `http_bind_addr`
- `http_bind_port`
- `runtime_root_path`
- `log_save_path`
- `order_expiration_time`
- `order_notice_max_retry`

::: warning Docker 绑定地址要求
Docker 部署时，`http_bind_addr` 必须填 `0.0.0.0`。

**不要**填 `127.0.0.1`。目前安装页的默认值仍可能显示 `127.0.0.1`，但如果在 Docker 场景直接保存这个值，Epusdt 重启后只会在容器内监听 `127.0.0.1:8000`，导致 Docker 映射端口或反向代理无法正常访问。
:::

如果你已经用错默认值完成安装，请直接在宿主机编辑 `./data/.env`，把：

```ini
http_listen=127.0.0.1:8000
```

改成：

```ini
http_listen=0.0.0.0:8000
```

然后重启容器：

```bash
docker restart epusdt
```

提交后服务自动重启，即可正常使用。

---

## 备选：`docker run` 快速启动

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -e EPUSDT_CONFIG=/data/.env \
  -p 8000:8000 \
  -v $(pwd)/data:/data \
  gmwallet/epusdt:latest
```

启动后同样访问 `http://你的服务器IP:8000` 完成安装向导。

---

## 以文件方式管理设置（可选）

如果你希望后续直接在宿主机检视或修改设置，安装完成后可直接编辑：

```text
./data/.env
```

修改完成后重启容器：

```bash
docker restart epusdt
```

---

## 注意事项

- 安装完成后，商户凭证与执行设置都可在管理后台调整
- 新接入请使用管理后台建立的商户 `pid` + `secret_key`
- 不要把整个 `/app` 直接挂成持久卷，否则升级时旧数据可能遮蔽新镜像中的新二进制与新文件
- 升级镜像：`docker pull gmwallet/epusdt:latest && docker compose up -d`
