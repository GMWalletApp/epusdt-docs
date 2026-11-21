---
description: "透過 Docker Compose 部署 EPUSDT，設定收銀台對外網址，並保存閘道與 ChainScanner 的資料。"
title: "使用 Docker Compose 部署收款閘道"
---

# 使用 Docker Compose 部署

使用部署版本自帶的 [Compose 配置](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml)。預設支付服務內建 ChainScanner。

全新安裝時先下載該版本的檔案。

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## 啟動閘道器

在倉庫根目錄設定 Compose 環境變數（例如寫入專案根目錄的 `.env`）。入口指令碼每次啟動都會讀取公開收銀臺地址。

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

將 HTTPS 反向代理指向對映埠。在後臺新增收款地址後，檢查響應中的 `data.supported_assets`。

## 持久化與升級

Compose 將宿主機 `./runtime/epusdt` 掛載到容器的 `/app/runtime`。其中包含應用的 `.env`、業務庫、執行庫和內建掃描器資料庫。專案根目錄的 Compose 環境檔案與此處的應用配置檔案分別維護。

從 v2.0.0 升級時，先停止舊服務，備份配置和資料庫，**在重建舊容器之前**將資料遷移到新掛載目錄。保留原備份，並核對配置中的資料庫檔名。[升級說明](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

v2.1.1 起僅支援 SQLite。升級前備份配置、業務庫、執行庫和掃描器資料。舊版 MySQL 或 PostgreSQL 使用者需先遷移並核對資料，再切換資料庫。僅修改 `db_type` 不會遷移訂單。

## 使用獨立掃描器

設定 `CHAINSCANNER_URL=http://chainscanner:9081`，配置不同的消費者令牌和管理員令牌。升級已有獨立部署時，應保留原掃描器資料卷（`./runtime/chainscanner`）、連線地址和憑據。

```sh
docker compose --profile scanner up -d
```
