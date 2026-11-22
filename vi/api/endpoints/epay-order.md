---
operation: epay-order
method: GET/POST
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "Gửi các tham số đã ký qua truy vấn GET hoặc biểu mẫu POST. Sau khi xác minh MD5 và tạo đơn, cổng trả HTTP 302 đến trang thanh toán."
---

# Tạo đơn EPay

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Gửi các tham số đã ký qua truy vấn GET hoặc biểu mẫu POST. Sau khi xác minh MD5 và tạo đơn, cổng trả HTTP 302 đến trang thanh toán.

## Tham số

<!--@include: ../payment.md#epay-fields-->

Chữ ký mẫu dùng khóa minh họa `epusdt_secret_key`. Tính lại trên máy chủ khi thay đổi tham số hoặc khóa.

## Tài liệu liên quan

- [Quay về trang người bán](./checkout-return)
- [Quy tắc ký](../payment#signing)
