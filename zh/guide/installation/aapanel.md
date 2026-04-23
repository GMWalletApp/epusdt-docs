# aaPanel 部署

本文說明如何使用 aaPanel 部署 Epusdt 服務本體。

**首次啟動無需手動建立 `.env`。** 若未檢測到配置檔案，Epusdt 會自動進入內建安裝嚮導，瀏覽器完成配置即可。

## 前置條件

開始前請準備：

- 一臺已安裝 aaPanel 的 Linux 伺服器
- aaPanel 中已安裝 Nginx
- aaPanel 中已安裝 Supervisor
- 已解析到伺服器的公網域名，例如 `pay.example.com`
- Epusdt 釋出包，或自行編譯好的 `epusdt` 二進位制
- 一個安全的 `api_auth_token`
- 可選但推薦填寫 `tron_grid_api_key`

## 1. 新增站點

在 aaPanel 中新建站點，並繫結你的收銀臺域名。

這個站點的用途是給 Epusdt 提供公網入口和反向代理，不是部署 `epusdt-docs` 文件站。

## 2. 上傳 Epusdt

把 Epusdt 釋出包上傳到站點目錄並解壓。

如果需要，賦予執行許可權：

```bash
chmod +x /www/wwwroot/pay.example.com/epusdt
```

## 3. 配置反向代理

在 aaPanel 站點設定中，把反向代理目標指向：

```text
http://127.0.0.1:8000
```

## 4. 新增 Supervisor 守護程序

在 aaPanel Supervisor 中新增程序，啟動命令示例：

```text
/www/wwwroot/pay.example.com/epusdt http start
```

工作目錄設定為 Epusdt 所在目錄。

## 5. 完成安裝嚮導

程序啟動後，開啟瀏覽器訪問 `http://你的伺服器IP:8000`（如果反向代理已生效可直接用域名）。按提示完成資料庫、API Token、域名等配置，提交後服務自動重啟。

## 6. 驗證服務與接入

對外基礎地址示例：

```text
https://pay.example.com
```

建立訂單介面例如：

```text
POST /payments/epusdt/v1/order/create-transaction
```

## 注意事項

- 安裝完成後所有配置均可在管理後臺調整
- `api_auth_token` 是 API 簽名金鑰，請妥善保管
- 文中的路徑請按你的 aaPanel 實際目錄替換
