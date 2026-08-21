# aaPanel 部署

本文說明如何使用 aaPanel 部署 Epusdt 服務本體。

**首次啟動通常不需要手動建立 `.env`。** 先把程式跑起來，再在瀏覽器裡完成安裝嚮導即可。

## 基本流程

1. 在 aaPanel 為支付域名建立站點
2. 上傳 Epusdt 釋出包或二進位制
3. 把站點反代到 `http://127.0.0.1:8000`
4. 先修正程式目錄權限
5. 在 aaPanel Supervisor 中設定正確的啟動目錄與命令
6. 優先直接打開綁定域名完成安裝嚮導

## Supervisor 啟動前的建議權限設定

如果 aaPanel Supervisor 以 `www` 使用者執行程式，建議先執行：

```bash
cd /www/wwwroot/epusdt
chmod +x epusdt
chown -R www:www /www/wwwroot/epusdt
```

## 建議的 Supervisor 設定

- **啟動目錄：** `/www/wwwroot/epusdt`
- **啟動命令：** `./epusdt http start`

不要只寫 `epusdt http start`。如果工作目錄不正確，`.env` 等相對路徑可能會解析錯誤，導致啟動失敗或讀到錯誤位置。

## 完成安裝嚮導

- 建議直接打開綁定好的域名，例如 `https://pay.example.com`
- 只有在直連程式埠時，才使用 `http://伺服器IP:8000`

## 驗證

對外基礎地址示例：

```text
https://pay.example.com
```

推薦下單路由：

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 注意事項

- 商戶憑證與 EPay 預設值現在都由管理後臺維護
- 不要再依賴舊文件裡的 `/payments/epusdt/v1/order/create-transaction`
