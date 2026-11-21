---
description: "手動安裝 EPUSDT 的 Linux 發行版，設定工作目錄、閘道與服務管理方式。"
---

# 手動部署 Linux 二進位制

可按以下步驟使用自己的程序管理器執行釋出包。使用 systemd 自動安裝請參閱 [epctl 指南](/zh-tw/guide/installation/epctl)。

## 準備應用目錄

從[釋出頁](https://github.com/GMWalletApp/epusdt/releases)下載與伺服器架構相符的 Linux 壓縮包，解壓到 `/opt/epusdt` 等私有應用目錄。為服務賬號授予配置及 SQLite 目錄寫許可權，資料目錄應位於網站公開目錄之外。

## 配置並驗證

首次安裝時複製示例後編輯副本。升級時保留已有的 `.env`。

```sh
cd /opt/epusdt
chmod +x epusdt
cp -n .env.example .env
```

在已配置、使用 HTTPS 反向代理的服務上，將以下配置寫入 `.env` 並替換為自己的域名。首次啟動會建立 SQLite 表。

```dotenv
app_uri=https://pay.example.com
http_listen=127.0.0.1:8000
runtime_root_path=./runtime
sqlite_database_filename=epusdt.db
install=false
```

在應用目錄執行 `./epusdt http start`。另開終端執行 `curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config`。驗證後停止前臺程序，再使用程序管理器啟動。

## 程序守護與代理

Supervisor 可使用以下配置，按實際服務賬號修改 `user`，然後執行 `supervisorctl reread` 和 `supervisorctl update`。

```ini
[program:epusdt]
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
user=epusdt
autostart=true
autorestart=true
redirect_stderr=true
```

將 HTTPS 站點的反向代理指向 `http://127.0.0.1:8000`。Nginx 可在 TLS 站點配置中加入以下片段。修改應用配置後重啟服務；升級前備份配置和資料目錄。

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
