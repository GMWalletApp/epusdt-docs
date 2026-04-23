# Docker 部署（推荐）

本教程基于官方 Docker 镜像部署 Epusdt，支持 Docker Compose 或 `docker run` 方式。

**无需手动创建 `.env` 文件。** 首次启动时，若检测到没有配置文件，Epusdt 会自动进入内置安装向导，通过浏览器完成所有配置。

## 前置条件

- 已安装 Docker 和 Docker Compose

## 步骤

### 1. 创建目录

```bash
mkdir epusdt && cd epusdt
```

### 2. 创建 `docker-compose.yaml`

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

### 3. 启动服务

```bash
docker compose up -d
```

### 4. 完成安装向导

浏览器打开 `http://你的服务器IP:8000`，按页面提示完成初始配置（数据库、API Token、域名等）。

提交后服务自动重启，即可正常使用。

---

## 备选：`docker run` 快速启动

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -p 8000:8000 \
  gmwallet/epusdt:latest
```

启动后同样访问 `http://你的服务器IP:8000` 完成安装向导。

---

## 手动管理配置文件（可选）

如果你希望以文件方式管理配置，可以挂载 `.env`：

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -p 8000:8000 \
  -v $(pwd)/env:/app/.env \
  gmwallet/epusdt:latest
```

> 修改 `.env` 后需重启容器：`docker restart epusdt`

---

## 注意事项

- 安装完成后，所有配置均可在管理后台调整
- `api_auth_token` 是 API 签名密钥，请妥善保管，勿泄露
- 升级镜像：`docker pull gmwallet/epusdt:latest && docker compose up -d`
