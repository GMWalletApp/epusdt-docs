# 手動部署

本文說明如何在普通 Linux 伺服器上直接部署 Epusdt。

**首次啟動無需手動建立 `.env`。** 若未檢測到配置檔案，Epusdt 會自動進入內建安裝嚮導，透過瀏覽器完成所有配置。

## 前置條件

- 如果準備從原始碼編譯，需要與當前原始碼倉庫 `src/go.mod` 相容的 Go 工具鏈（當前為 `Go 1.25.0`）
- 或者直接使用 [GitHub Releases](https://github.com/GMwalletApp/epusdt/releases) 釋出包
- 一臺 Linux 伺服器
- 一個用於收銀臺和 API 的公網域名，例如 `pay.example.com`
- 生產環境建議使用 Nginx 或其他反向代理提供 HTTPS
- 一個安全的 `api_auth_token`
- 可選但推薦填寫 `tron_grid_api_key`

## 1. 準備應用目錄

```bash
mkdir -p /opt/epusdt
cd /opt/epusdt
```

可以選擇以下兩種方式之一安裝。

### 方式 A，使用釋出包

```bash
wget https://github.com/GMwalletApp/epusdt/releases/latest/download/epusdt_Linux_x86_64.tar.gz -O epusdt.tar.gz

tar -xzf epusdt.tar.gz
rm epusdt.tar.gz
```

### 方式 B，從原始碼編譯

```bash
git clone https://github.com/GMwalletApp/epusdt.git
cd epusdt/src
go build -o /opt/epusdt/epusdt .
```

## 2. 啟動 Epusdt

```bash
chmod +x /opt/epusdt/epusdt
cd /opt/epusdt
./epusdt http start
```

若無 `.env` 檔案，Epusdt 會啟動安裝嚮導。用瀏覽器開啟 `http://你的伺服器IP:8000`，按提示完成初始配置（資料庫、API Token、域名等）。

提交後服務自動重啟，即可正常使用。

## 3. 配置 Nginx 反向代理

預設會監聽 `:8000`。

## 4. 配置 Nginx 反向代理

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

過載 Nginx：

```bash
nginx -t && systemctl reload nginx
```

## 5. 用 Supervisor 託管

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

應用配置：

```bash
supervisorctl reread
supervisorctl update
supervisorctl start epusdt
supervisorctl tail epusdt
```

## 6. 驗證服務與接入地址

對外接入時，使用你部署後的 Epusdt 域名作為基礎地址，例如：

```text
https://pay.example.com
```

建立訂單介面例如：

```text
POST /payments/epusdt/v1/order/create-transaction
```

## 注意事項

- 修改 `.env` 後需要重啟程序，`supervisorctl restart epusdt`
- 生產環境建議始終放在 HTTPS 反代之後
- `api_auth_token` 必須保密
- `tron_grid_api_key` 推薦配置，可提高鏈上查詢穩定性
