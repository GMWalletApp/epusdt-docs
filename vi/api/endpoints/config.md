---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "Đọc supported_assets để lấy các mạng và token đang khả dụng. Không cần tham số hoặc chữ ký của người bán."
---

# Đọc cấu hình thanh toán

<ApiRoute />

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Đọc `supported_assets` để lấy các mạng và `token` đang khả dụng. Không cần tham số hoặc chữ ký của người bán.

Trên các phiên bản hỗ trợ thông tin hợp đồng, tra ký hiệu token trong `token_details` để lấy ID tài sản và số chữ số thập phân. Phiên bản cũ chỉ trả về `tokens`. [Danh sách hợp đồng tích hợp](../../guide/intro#networks)

## Tài liệu liên quan

- [Tạo đơn GMPay](./create-order)
- [Thông báo cho người bán](../payment#callbacks)
