---
description: "Tích hợp điểm cuối (endpoint) của đơn hàng EPUSDT-GMPay, ký yêu cầu từ người bán, và chuyển hướng người mua đến URL thanh toán được trả về bởi cổng thanh toán."
---

# Tích hợp GMPay (khuyên dùng) {#gmpay-integration-recommended}

Sử dụng GMPay cho tất cả các tích hợp mới.

## Đường dẫn {#route}

```text
POST /payments/gmpay/v1/order/create-transaction
```

## Yêu cầu về chứng nhận của thương nhân {#merchant-credential-requirement}

Trước khi gọi API, hãy tạo hoặc kiểm tra khóa API trong bảng quản trị.

Bạn cần:

- `pid`
- `secret_key`

Gửi `pid` trong yêu cầu và dùng `secret_key` làm khóa ký.

## Vận cần thiết tối thiểu {#minimal-request-body}

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "signature": "hmac-sha256-hex(...)"
}
```

## Quy tắc ký tên {#signature-rule}

> Kể từ phiên bản `v2.0.0`, GMPay sử dụng HMAC-SHA256 thay vì MD5. Vui lòng nâng cấp các ứng dụng trước khi triển khai phiên bản v2, nếu không, họ sẽ nhận được thông báo `401 Unauthorized`. Các yêu cầu tương thích với EPay sẽ không bị ảnh hưởng.

1. Giữ lại tất cả các trường có giá trị, trừ `signature`
2. Sắp xếp tên trường theo thứ tự ASCII
3. Nối các cặp theo dạng `key=value&...`
4. Tính HMAC-SHA256 bằng `secret_key` của người bán làm khóa HMAC
5. Gửi chuỗi băm gồm 64 ký tự hex viết thường trong trường `signature`

## Các tuyến đường hỗ trợ {#useful-companion-routes}

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

Nếu khách hàng cần các tùy chọn mạng/token linh hoạt, hãy đọc chúng từ `data.supported_assets` trong phản hồi `/payments/gmpay/v1/config`.

Xem `data.site` để thiết kế thương hiệu và `data.epay`, `data.okpay` và `data.xlayer` để cấu hình thanh toán.

## Xác minh callback {#callback-verification}

Các thông báo từ GMPay được gửi dưới dạng JSON `POST` đến `notify_url`.

Xác minh chữ ký HMAC-SHA256, đối chiếu đơn hàng đã thanh toán và bảo đảm việc nhận lại cùng một thông báo không khiến đơn được xử lý nhiều lần. Trả về HTTP 200 cùng văn bản thuần `ok` hoặc `success` (không phân biệt chữ hoa, chữ thường).

## Ghi chú về thành công {#success-response-note}

Nguồn hiện tại bao gồm `payment_url` trong các phản hồi tạo đơn hàng thành công, do đó, người gọi có một mục đích chuyển hướng thanh toán được quản lý trực tiếp, thay vì phải tự xây dựng lại URL đó.
