# API 概覽

## 當前對外可用路由

| 方法 | 路由 | 說明 |
| --- | --- | --- |
| `POST` | `/payments/gmpay/v1/order/create-transaction` | 推薦的建立訂單 API |
| `GET` | `/payments/gmpay/v1/config` | 返回公開支付配置，包含 `supported_assets`、站點品牌資訊、EPay 預設值、OkPay 前端配置及伺服器 `version` |
| `GET` / `POST` | `/payments/epay/v1/order/create-transaction/submit.php` | EPay 相容跳轉式建立訂單入口 |
| `POST` | `/payments/okpay/v1/notify` | OkPay 伺服器端回撥入口 |
| `POST` | `/pay/switch-network` | 在託管收銀臺切換支付網路；可接受鏈上網路值與 `okpay` |
| `GET` | `/pay/checkout-counter/:trade_id` | 跳轉入口，會把瀏覽器導向託管收銀臺 SPA |
| `GET` | `/pay/checkout-counter-resp/:trade_id` | 託管收銀臺 SPA 使用的 JSON 資料介面 |
| `GET` | `/pay/check-status/:trade_id` | 查詢收銀臺訂單狀態 |

## 管理 API

管理 API 位於 `/admin/api/v1/*`，除登入與初始化密碼相關介面外，其餘都需要 JWT。

目前原始碼可見的主要群組：

- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- 鏈 / 代幣管理
- 錢包地址管理
- 設定管理

## 商戶憑證規則

### GMPay

- 商戶識別欄位：`pid`
- 簽名欄位：`signature`
- 簽名金鑰：對應 `pid` 的已啟用 `api_keys.secret_key`

### EPay 相容流程

- 商戶識別欄位：`pid`
- 簽名欄位：`sign`
- 簽名金鑰：對應 `pid` 的已啟用 `api_keys.secret_key`
- `sign_type` 一般傳 `MD5`
- EPay 的 `type` 接受 `alipay` 或有效的 `token.network` 選擇器（如 `usdt.tron`）；已接受的選擇器會沿用到 EPay 同步返回與非同步回撥。

## 建議接入順序

1. 先在管理後臺建立或查看商戶憑證（`pid` + `secret_key`）
2. 若前端需要動態展示可用鏈 / 代幣，先呼叫 `/payments/gmpay/v1/config`，並從 `data.supported_assets` 讀取
3. 新接入優先使用 GMPay
4. 只有在上游系統依賴跳轉式 EPay 流程時才使用 EPay 相容入口
5. 接收回撥時同樣使用該商戶的 `secret_key` 驗籤
