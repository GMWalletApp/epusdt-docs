---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "讀取 supported_assets，取得收銀台目前可用的網路和幣種。無需參數或商戶簽章。"
---

# 取得收銀台設定

<ApiRoute />

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

讀取 `supported_assets`，取得收銀台目前可用的網路和幣種。無需參數或商戶簽章。

支援合約資訊的閘道可依幣種符號從 `token_details` 讀取完整資產識別碼及小數位數。舊版僅回傳 `tokens`。 [內建幣種合約表](../../guide/intro#networks)

## 相關文件

- [建立 GMPay 訂單](./create-order)
- [商戶回呼](../payment#callbacks)
