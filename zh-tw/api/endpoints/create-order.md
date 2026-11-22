---
operation: create-order
method: POST
route: "/payments/gmpay/v1/order/create-transaction"
description: "在商戶伺服器上簽章，建立訂單後引導買家開啟 payment_url。token 與 network 必須同時傳入，也可同時省略，讓買家在收銀台選擇。"
---

# 建立 GMPay 訂單

<ApiRoute />

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

在商戶伺服器上簽章，建立訂單後引導買家開啟 `payment_url`。`token` 與 `network` 必須同時傳入，也可同時省略，讓買家在收銀台選擇。

## 請求參數

<!--@include: ../payment.md#create-fields-->

範例使用示範金鑰 `epusdt_secret_key` 簽章。變更參數或商戶金鑰後，請在伺服器重新簽章。

## 相關文件

- [開啟收銀台](./open-checkout)
- [簽章規則](../payment#signing)
