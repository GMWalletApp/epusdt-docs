---
operation: checkout-details
method: GET
route: "/pay/checkout-counter-resp/{trade_id}"
description: "Đọc số tiền, địa chỉ nhận và lựa chọn hiện tại. created_at và expiration_time là thời gian Unix tính bằng mili giây."
---

# Đọc chi tiết thanh toán

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter-resp/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Đọc số tiền, địa chỉ nhận và lựa chọn hiện tại. `created_at` và `expiration_time` là thời gian Unix tính bằng mili giây.

## Tham số

`trade_id` · `string` · PATH

Mã giao dịch EPUSDT trả về khi tạo đơn.

## Tài liệu liên quan

- [Kiểm tra trạng thái đơn](./order-status)
- [Thông báo cho người bán](../payment#callbacks)
