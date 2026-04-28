# Docker 部署（推薦）

本教程基於官方 Docker 映象部署 Epusdt，支援 Docker Compose 或 `docker run` 方式。

**首次啟動通常不需要手動建立 `.env` 檔案。** 推薦做法是掛載一個獨立的宿主機目錄，並把 `EPUSDT_CONFIG` 指向這個目錄裡的設定檔。這樣可以同時持久化設定、預設 SQLite 主資料庫與執行時資料，且**不會**把映象內的 `/app` 檔案整個覆蓋掉。

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
    environment:
      EPUSDT_CONFIG: /data/.env
    ports:
      - "8000:8000"
    volumes:
      - ./data:/data
EOF
```

這種掛載方式的好處是：

- `/data/.env` 會保存安裝嚮導產生的設定檔
- `/data/epusdt.db` 會成為預設主 SQLite 資料庫
- `/data/runtime/` 會保存執行時 SQLite 資料與日誌
- 映象內 `/app` 保持乾淨，升級時不會被舊卷內容遮蔽

### 3. 啟動服務

```bash
docker compose up -d
```

### 4. 完成安裝嚮導

瀏覽器開啟 `http://你的伺服器IP:8000`，按頁面提示完成安裝。當前安裝嚮導主要涵蓋以下欄位：

- `app_name`
- `app_uri`
- `http_bind_addr`
- `http_bind_port`
- `runtime_root_path`
- `log_save_path`
- `order_expiration_time`
- `order_notice_max_retry`

::: warning Docker 綁定位址要求
Docker 部署時，`http_bind_addr` 必須填 `0.0.0.0`。

**不要**填 `127.0.0.1`。如果在安裝嚮導裡保存成 `127.0.0.1`，Epusdt 重啟後只會在容器內監聽 `127.0.0.1:8000`，導致 Docker 映射端口或反向代理無法正常存取。
:::

提交後服務自動重啟，即可正常使用。

::: tip `/data` 內的收銀臺靜態檔
如果你使用上面的推薦掛載方式 `-v ./data:/data`，且之前遇到 `/data/static` 缺少託管收銀臺檔案，現在上游已補上啟動時自動補齊機制：程式會把映象內建、但目標 `static_path` 中缺失的靜態檔自動複製過去。

也就是說，按本文推薦的 Docker 佈局部署時，正常情況下不需要再手動補拷收銀臺檔案。
:::

---

## 備選：`docker run` 快速啟動

```bash
docker run -d \
  --name epusdt \
  --restart always \
  -e EPUSDT_CONFIG=/data/.env \
  -p 8000:8000 \
  -v $(pwd)/data:/data \
  gmwallet/epusdt:latest
```

啟動後同樣訪問 `http://你的伺服器IP:8000` 完成安裝嚮導。

---

## 以檔案方式管理設定（可選）

如果你希望後續直接在宿主機檢視或修改設定，安裝完成後可直接編輯：

```text
./data/.env
```

修改完成後重啟容器：

```bash
docker restart epusdt
```

---

## 注意事項

- 安裝完成後，商戶憑證與執行設定都可在管理後臺調整
- 新接入請使用管理後臺建立的商戶 `pid` + `secret_key`
- 不要把整個 `/app` 直接掛成持久卷，否則升級時舊資料可能遮蔽新映象中的新二進位與新檔案
- 升級映象：`docker pull gmwallet/epusdt:latest && docker compose up -d`
