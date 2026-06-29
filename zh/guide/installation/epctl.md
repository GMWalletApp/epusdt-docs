# epctl 安裝與驗證指令碼

`epctl` 是倉庫頂層的 Linux 二進位制安裝管理指令碼，面向已經發布到 GitHub Releases 的 `epusdt` 二進位制包。
`epctl-docker-test.sh` 是配套的真實驗收指令碼，用本機 Docker 啟動 Ubuntu + systemd 容器，完整驗證安裝、啟動、升級和服務流程。

## 適用範圍

- 僅支援 Linux
- 僅支援二進位制安裝
- 安裝源固定為 `https://github.com/GMWalletApp/epusdt/releases`
- 預設透過 systemd 管理服務

## 依賴與許可權

`epctl` 依賴這些基礎命令：

- `curl`
- `tar`
- `systemctl`
- `install`
- `grep`
- `sed`

其中：

- `install`、`upgrade`、`self-install` 需要寫入 `/opt`、`/etc/systemd`、`/usr/local/bin`
- `status`、`logs` 會在需要時自動透過 `sudo` 重新執行
- 所以日常使用建議當前使用者具備 `sudo` 許可權

## 固定路徑

| 專案 | 路徑 |
|------|------|
| 安裝目錄 | `/opt/epusdt` |
| 主程式 | `/opt/epusdt/epusdt` |
| 配置檔案 | `/opt/epusdt/.env` |
| 示例配置 | `/opt/epusdt/.env.example` |
| 前端釋放目錄 | `/opt/epusdt/www` |
| 下載快取 | `/tmp/epusdt/<tag>/` |
| systemd unit | `/etc/systemd/system/epusdt.service` |
| epctl 全域性安裝位置 | `/usr/local/bin/epctl` |

## 快速開始

直接在倉庫根目錄執行互動選單：

```bash
./epctl
```

預設優先進入中文介面。你也可以顯式指定語言：

```bash
./epctl zh
./epctl en
./epctl --lang zh help
./epctl --lang en help
```

如果想把指令碼裝進 PATH：

```bash
./epctl self-install
epctl
```

## 常用命令

下載指定版本：

```bash
./epctl download --tag v1.0.8
```

安裝服務：

```bash
./epctl install --tag v1.0.8 \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:18000
```

升級到新版本：

```bash
./epctl upgrade --tag v1.0.9
```

檢視配置、狀態、日誌：

```bash
./epctl show-config
./epctl status
./epctl logs --lines 200
```

請求初始化管理員密碼（僅當部署版本仍暴露舊版明文路由時可用）：

```bash
./epctl init-password
```

::: warning v1.0.9 路由說明
`v1.0.9` 服務端註冊的是 `/admin/api/v1/auth/init-password-hash`，沒有註冊 `epctl init-password` 會請求的舊版明文 `/admin/api/v1/auth/init-password` 路由。v1.0.9 首次安裝時，請從安裝 API 回應中的 `init_password` 讀取初始密碼。
:::

## 不傳 `--tag` 時的行為

`download`、`install`、`upgrade` 在未傳 `--tag` 時，會先呼叫 GitHub API 解析當前 latest release tag，再向使用者顯示實際 tag 並確認。

例如：

```bash
./epctl install --app-uri https://pay.example.com
```

互動模式下會先提示檢測到的最新 tag。
非互動指令碼執行時，建議顯式傳入 `--tag`。如果你明確要跳過確認，可以設定：

```bash
EPCTL_ASSUME_YES=1 ./epctl download
```

## 首次安裝時會發生什麼

執行 `install` 時，指令碼會：

1. 按當前機器架構下載 GitHub Release 壓縮包
2. 解壓到 `/tmp/epusdt/<tag>/extract/`
3. 安裝二進位制到 `/opt/epusdt/epusdt`
4. 安裝 `.env.example` 到 `/opt/epusdt/.env.example`
5. 建立系統使用者和組 `epusdt`
6. 若 `/opt/epusdt/.env` 不存在，則從 `.env.example` 自動生成
7. 寫入並啟用 `epusdt.service`

自動生成 `.env` 時，指令碼只會補預設上線所需的最小改動：

- `install=false`
- `app_uri=<--app-uri，預設 http://127.0.0.1:8000>`
- `http_listen=<--listen，預設 127.0.0.1:8000>`

如果 `/opt/epusdt/.env` 已存在，則安裝和升級都會保留它，不會覆蓋。

## systemd 服務說明

指令碼註冊的服務名固定為 `epusdt.service`，核心引數如下：

```ini
WorkingDirectory=/opt/epusdt
ExecStart=/opt/epusdt/epusdt http start
User=epusdt
Group=epusdt
Restart=always
RestartSec=3
```

`WorkingDirectory` 固定為 `/opt/epusdt`，因為程式會在二進位制同級目錄釋放 `www/` 靜態檔案。

## `init-password` 的含義

`epctl init-password` 只會請求本地 HTTP 路由。這是舊版明文路由，實際部署版本不一定註冊：

```text
GET /admin/api/v1/auth/init-password
```

它不會直接讀資料庫。

指令碼會從 `/opt/epusdt/.env` 解析 `http_listen`，然後自動把這些監聽寫法轉成本地可請求地址：

- `:8000` -> `127.0.0.1:8000`
- `0.0.0.0:8000` -> `127.0.0.1:8000`

如果介面返回 `10040`，含義是初始化明文密碼已經不可用。常見原因是：

- 管理員已經登入並修改過密碼
- 初始化密碼已經被消費，當前不再允許再次取回

如果介面返回 `404`，表示部署版本沒有暴露這個舊版明文端點；請改用安裝流程回應或初始化密碼雜湊狀態端點判斷。上述情況下，指令碼會直接把介面原始錯誤輸出出來，方便排查。

## Docker 驗收指令碼

倉庫頂層提供：

```bash
./epctl-docker-test.sh <install-tag> [upgrade-tag]
```

示例：

```bash
./epctl-docker-test.sh v1.0.6
./epctl-docker-test.sh --lang zh v1.0.6 v1.0.8
```

它會在本機：

- 構建 `ubuntu:24.04` + systemd 測試映象
- 啟動一個特權容器
- 在容器內執行 `epctl self-install`
- 下載真實 GitHub Release
- 安裝 `epusdt`
- 檢查 `systemd` 服務、`www/index.html`、配置檔案、日誌、狀態輸出
- 以真實 release artifact 驗證服務行為；較早的指令碼版本也會嘗試驗證舊版明文 `init-password` 路由

執行前提：

- 本機已安裝 Docker
- 當前使用者有許可權執行 Docker
- 宿主機能夠訪問 GitHub Releases

## 建議

- 自動化部署場景優先顯式傳 `--tag`
- 生產環境建議安裝完成後先執行一次 `./epctl show-config`
- 首次拿到初始化密碼後，建議立即登入後臺修改管理員密碼
- 如果只是驗證指令碼是否可用，優先跑 `./epctl-docker-test.sh`
