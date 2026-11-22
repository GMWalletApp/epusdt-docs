---
operation: okpay-notify
method: POST
route: "/payments/okpay/v1/notify"
description: "Cấu hình URL này trong OKPay. EPUSDT dùng token cửa hàng để xác minh thông báo đã ký. Phản hồi văn bản là success (200) hoặc fail (400)."
---

# Nhận thông báo OKPay

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Cấu hình URL này trong OKPay. EPUSDT dùng `token` cửa hàng để xác minh thông báo đã ký. Phản hồi văn bản là success (200) hoặc fail (400).

## Tài liệu liên quan

- [Chọn mạng hoặc nhà cung cấp](./switch-network)
- [Thông báo cho người bán](../payment#callbacks)
