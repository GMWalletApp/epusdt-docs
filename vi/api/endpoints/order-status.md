---
operation: order-status
method: GET
route: "/pay/check-status/{trade_id}"
description: "Dùng trade_id của EPUSDT để cập nhật trạng thái. Chỉ giao hàng sau khi xác minh chữ ký callback."
---

# Kiểm tra trạng thái đơn

<span class="api-route"><b>GET</b> <code>/pay/check-status/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Dùng `trade_id` của EPUSDT để cập nhật trạng thái. Chỉ giao hàng sau khi xác minh chữ ký callback.

## Tham số

`trade_id` · `string` · PATH

Mã giao dịch EPUSDT trả về khi tạo đơn.

## Trạng thái đơn

<!--@include: ../payment.md#order-states-->

## Tài liệu liên quan

- [Đọc chi tiết thanh toán](./checkout-details)
- [Thông báo cho người bán](../payment#callbacks)
