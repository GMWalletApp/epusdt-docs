---
description: "依路徑與 HTTP 方法查找 EPUSDT 下單、收銀台及付款狀態介面，並查看簽章與回呼範例。"
title: "支付 API 路徑與 HTTP 方法速查"
---

# API 概覽

參閱[商戶 API](/zh-tw/api/payment)，瞭解簽名示例、訂單狀態和回撥驗籤。

## 當前對外可用路由

| 場景 | 方法 | 路徑 | 是否需要簽名 |
| --- | --- | --- | --- |
| [建立 GMPay 訂單](/zh-tw/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | 是 |
| [取得收銀台設定](/zh-tw/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | 否 |
| [開啟收銀台](/zh-tw/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | 否 |
| [讀取收銀台訂單明細](/zh-tw/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | 否 |
| [查詢訂單狀態](/zh-tw/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | 否 |
| [選擇網路或付款通道](/zh-tw/api/endpoints/switch-network) | POST | `/pay/switch-network` | 否 |
| [建立易支付訂單](/zh-tw/api/endpoints/epay-order) | GET/POST | `/payments/epay/v1/order/create-transaction/submit.php` | 是 |
| [提交交易雜湊](/zh-tw/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | 否，提交 `block_transaction_id` |
| [返回商戶網站](/zh-tw/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | 否，返回 HTTP 302 |
| [接收 OKPay 通知](/zh-tw/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | OkPay 簽名 |

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
- 自 `v2.0.0` 起的簽名演算法：對規範化後的非空引數字串做 HMAC-SHA256，HMAC key 為對應 `pid` 的已啟用 `api_keys.secret_key`
- v2 之前的 GMPay MD5 客戶端必須先升級後才能部署 `v2.0.0` 或更新版本

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
