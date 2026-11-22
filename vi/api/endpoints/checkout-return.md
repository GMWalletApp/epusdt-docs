---
operation: checkout-return
method: GET
route: "/pay/return/{trade_id}"
description: "Đơn EPay đã thanh toán chuyển về trang người bán với các tham số đã ký. Các đơn khác quay lại trang thanh toán. Xác minh thông báo bất đồng bộ trước khi giao hàng."
---

# Quay về trang người bán

<span class="api-route"><b>GET</b> <code>/pay/return/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Đơn EPay đã thanh toán chuyển về trang người bán với các tham số đã ký. Các đơn khác quay lại trang thanh toán. Xác minh thông báo bất đồng bộ trước khi giao hàng.

## Tham số

`trade_id` · `string` · PATH

Mã giao dịch EPUSDT trả về khi tạo đơn.

## Tài liệu liên quan

- [Tạo đơn EPay](./epay-order)
- [Thông báo cho người bán](../payment#callbacks)
