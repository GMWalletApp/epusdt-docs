---
operation: open-checkout
method: GET
route: "/pay/checkout-counter/{trade_id}"
description: "Mở liên kết thanh toán trong trình duyệt. EPUSDT chuyển hướng người mua tới /cashier/{trade_id} bằng HTTP 301."
---

# Mở trang thanh toán

<span class="api-route"><b>GET</b> <code>/pay/checkout-counter/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Mở liên kết thanh toán trong trình duyệt. EPUSDT chuyển hướng người mua tới `/cashier/{trade_id}` bằng HTTP 301.

## Tham số

`trade_id` · `string` · PATH

Mã giao dịch EPUSDT trả về khi tạo đơn.

## Tài liệu liên quan

- [Đọc chi tiết thanh toán](./checkout-details)
- [Thông báo cho người bán](../payment#callbacks)
