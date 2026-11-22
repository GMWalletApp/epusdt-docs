---
operation: create-order
method: POST
route: "/payments/gmpay/v1/order/create-transaction"
description: "Ký yêu cầu trên máy chủ rồi mở payment_url cho người mua. Gửi cả token và network hoặc bỏ cả hai để người mua tự chọn."
---

# Tạo đơn GMPay

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Ký yêu cầu trên máy chủ rồi mở `payment_url` cho người mua. Gửi cả `token` và `network` hoặc bỏ cả hai để người mua tự chọn.

## Tham số

<!--@include: ../payment.md#create-fields-->

Chữ ký mẫu dùng khóa minh họa `epusdt_secret_key`. Tính lại trên máy chủ khi thay đổi tham số hoặc khóa.

## Tài liệu liên quan

- [Mở trang thanh toán](./open-checkout)
- [Quy tắc ký](../payment#signing)
