# Docker 部署（推薦）

本教程基於官方 Docker 映象部署 Epusdt，支援 Docker Compose 或 `docker run` 方式。

**無需手動建立 `.env` 檔案。** 首次啟動時，若檢測到沒有配置檔案，Epusdt 會自動進入內建安裝嚮導，透過瀏覽器完成所有配置。

## 前置條件

- 已安裝 Docker 和 Docker Compose

## 步驟

### 1. 建立目錄

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
    ports:
      - "8000:8000"
    volumes:
      - epusdt_data:/app

volumes:
  epusdt_data:
EOF
```

### 3. 啟動服務

```bash
docker compose up -d
```

### 4. 完成安裝嚮導

瀏覽器開啟 `http://你的伺服器IP:8000`，按頁面提示完成初始配置（資料庫、API Token、域名等）。

提交後服務自動重啟，即可正常使用。

---

## 備選：`docker run` 快速啟動

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -p 8000:8000 \
  gmwallet/epusdt:latest
```

啟動後同樣訪問 `http://你的伺服器IP:8000` 完成安裝嚮導。

---

## 手動管理配置檔案（可選）

如果你希望以檔案方式管理配置，可以掛載 `.env`：

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -p 8000:8000 \
  -v $(pwd)/env:/app/.env \
  gmwallet/epusdt:latest
```

> 修改 `.env` 後需重啟容器：`docker restart epusdt`

---

## 注意事項

- 安裝完成後，所有配置均可在管理後臺調整
- `api_auth_token` 是 API 簽名金鑰，請妥善保管，勿洩露
- 升級映象：`docker pull gmwallet/epusdt:latest && docker compose up -d`
