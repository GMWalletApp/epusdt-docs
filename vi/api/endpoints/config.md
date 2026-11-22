---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "Đọc supported_assets để lấy các mạng và token đang khả dụng. Không cần tham số hoặc chữ ký của người bán."
---

# Đọc cấu hình thanh toán

<span class="api-route"><b>GET</b> <code>/payments/gmpay/v1/config</code></span>

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Đọc `supported_assets` để lấy các mạng và `token` đang khả dụng. Không cần tham số hoặc chữ ký của người bán.

## Tài liệu liên quan

- [Tạo đơn GMPay](./create-order)
- [Thông báo cho người bán](../payment#callbacks)
