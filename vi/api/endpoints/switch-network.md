---
operation: switch-network
method: POST
route: "/pay/switch-network"
description: "Gửi trade_id của đơn cha, token và network trong JSON. Đơn cha phải ở trạng thái 1 hoặc 4. Dùng địa chỉ hoặc URL thanh toán trả về."
---

# Chọn mạng hoặc nhà cung cấp

<span class="api-route"><b>POST</b> <code>/pay/switch-network</code></span>

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Gửi `trade_id` của đơn cha, `token` và `network` trong JSON. Đơn cha phải ở trạng thái 1 hoặc 4. Dùng địa chỉ hoặc URL thanh toán trả về.

## Nội dung JSON

| Trường bắt buộc | Kiểu | Ví dụ |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## Tài liệu liên quan

- [Đọc cấu hình thanh toán](./config)
- [Thông báo cho người bán](../payment#callbacks)
