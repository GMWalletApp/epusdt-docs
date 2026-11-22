---
operation: okpay-notify
method: POST
route: "/payments/okpay/v1/notify"
description: "在 OKPay 設定此通知網址。OKPay 傳送已簽章的通知，EPUSDT 使用商店權杖驗章。成功回傳純文字 success（200），失敗回傳 fail（400）。"
---

# 接收 OKPay 通知

<span class="api-route"><b>POST</b> <code>/payments/okpay/v1/notify</code></span>

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

在 OKPay 設定此通知網址。OKPay 傳送已簽章的通知，EPUSDT 使用商店權杖驗章。成功回傳純文字 success（200），失敗回傳 fail（400）。

## 相關文件

- [選擇網路或付款通道](./switch-network)
- [商戶回呼](../payment#callbacks)
