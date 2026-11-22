---
operation: epay-order
method: GET/POST
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "透過 GET 查詢字串或 POST 表單提交已簽章的參數。MD5 驗章並成功建立訂單後，閘道透過 HTTP 302 導向收銀台。"
---

# 建立易支付訂單

<ApiRoute />

<a class="api-example-jump" href="#request-example">請求範例 ↓</a>

透過 GET 查詢字串或 POST 表單提交已簽章的參數。MD5 驗章並成功建立訂單後，閘道透過 HTTP 302 導向收銀台。

## 請求參數

<!--@include: ../payment.md#epay-fields-->

範例使用示範金鑰 `epusdt_secret_key` 簽章。變更參數或商戶金鑰後，請在伺服器重新簽章。

## 相關文件

- [返回商戶網站](./checkout-return)
- [簽章規則](../payment#signing)
