# aaPanel 部署

本文說明如何使用 aaPanel 部署 Epusdt 服務本體。

**首次啟動通常不需要手動建立 `.env`。** 先把程式跑起來，再在瀏覽器裡完成安裝嚮導即可。

## 基本流程

1. 在 aaPanel 為支付域名建立站點
2. 上傳 Epusdt 釋出包或二進位制
3. 把站點反代到 `http://127.0.0.1:8000`
4. 用 aaPanel Supervisor 執行 `epusdt http start`
5. 打開域名或伺服器 IP，完成安裝嚮導

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
