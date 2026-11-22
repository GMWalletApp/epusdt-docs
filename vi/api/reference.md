---
description: "Tìm hiểu về các đường dẫn EPUSDT và phương thức HTTP cho đơn hàng, quá trình thanh toán và trạng thái thanh toán của người bán, sau đó mở các ví dụ về ký và gọi lại."
title: "Tham khảo điểm cuối (endpoint) API thanh toán"
---

# Tài liệu API {#api-reference}

Xem [API của Thương nhân](/vi/api/payment) để tham khảo các ví dụ, trạng thái đơn hàng và xác minh thông báo.

## Các tuyến đường công cộng trực tiếp {#live-public-routes}

| Mục đích | Phương thức | Đường dẫn | Xác thực |
| --- | --- | --- | --- |
| Tạo đơn hàng GMPay | POST | `/payments/gmpay/v1/order/create-transaction` | HMAC-SHA256 của người bán |
| Xem cài đặt thanh toán công khai | GET | `/payments/gmpay/v1/config` | Công khai |
| Mở trang thanh toán | GET | `/pay/checkout-counter/{trade_id}` | Công khai |
| Xem chi tiết thanh toán | GET | `/pay/checkout-counter-resp/{trade_id}` | Công khai |
| Truy vấn trạng thái đơn hàng | GET | `/pay/check-status/{trade_id}` | Công khai |
| Chọn mạng hoặc nhà cung cấp | POST | `/pay/switch-network` | Công khai |
| Cung cấp hash của chuyển khoản để xác minh. | POST | `/pay/submit-tx-hash/{trade_id}` | Công khai |
| Trở về | GET | `/pay/return/{trade_id}` | Chuyển hướng trình duyệt |
| Tạo đơn EPay | GET hoặc POST | `/payments/epay/v1/order/create-transaction/submit.php` | MD5 của người bán |
| Nhận thông báo từ nhà cung cấp OKPay | POST | `/payments/okpay/v1/notify` | Chữ ký OKPay |

## Giao diện API quản trị {#admin-api-surface}

Các API quản lý nằm ở `/admin/api/v1/*` và được bảo vệ bằng JWT, ngoại trừ các điểm cuối (endpoints) đăng nhập và thiết lập mật khẩu ban đầu.

Các nhóm chính được hiển thị trong nguồn hiện tại:

- Nhân viên thu ngân công cộng chấp nhận một hash cho đơn hàng đang chờ xử lý trên chuỗi. Đồng thời, một quản trị viên cũng có thể kiểm tra lại các đơn hàng hết hạn hoặc các đơn hàng đang được xem xét thủ công.
- Cài đặt tỷ giá: `rate.mode` có thể là fixed hoặc auto. Chế độ `fixed` sử dụng `rate.forced_rate_list`, trong khi chế độ `auto` sẽ lấy `rate.api_url`, lưu trữ các phản hồi tỷ giá cơ bản thành công, và duy trì bộ nhớ cache bền vững cuối cùng khi cập nhật thất bại. Nếu `rate.forced_rate_list` trống, hệ thống sẽ khôi phục tỷ giá mặc định CNY USDT/USDC mặc định.
- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- quản lý chuỗi / quản lý token chuỗi
- quản lý địa chỉ ví
- quản lý cài đặt

## Quy định về chứng nhận thương nhân {#merchant-credential-rules}

### GMPay {#gmpay}

- Mã người bán bắt buộc: `pid`
- Trường chữ ký: `signature`
- Thuật toán chữ ký từ phiên bản `v2.0.0`: HMAC-SHA256 dựa trên chuỗi tham số không trống và chuẩn, được mã hóa bằng khóa `api_keys.secret_key` phù hợp với `pid`.
- Khách hàng GMPay MD5 trước phiên bản v2 phải được nâng cấp trước khi triển khai phiên bản `v2.0.0` trở lên.

### Luồng thanh toán tương thích với EPay {#epay-compatible-flow}

- Mã người bán bắt buộc: `pid`
- Trường chữ ký: `sign`
- Khóa ký: `secret_key` của dòng `api_keys` được kích hoạt, phù hợp với `pid`.
- `sign_type` được chấp nhận, thường là `MD5`.
- EPay `type` chấp nhận `alipay` hoặc một trình chọn (selector) được hỗ trợ từ `token.network` như `usdt.tron`. Các trình chọn được chấp nhận sẽ được lưu giữ trong các callback trả về/thông báo của EPay.

## Thứ tự tích hợp được đề xuất {#recommended-integration-order}

1. Tạo hoặc kiểm tra thông tin xác thực của người bán trong bảng điều khiển (`pid` + `secret_key`)
2. Truy vấn `/payments/gmpay/v1/config` và đọc `data.supported_assets` nếu khách hàng cần các tùy chọn mạng/token động
3. Ưu tiên sử dụng GMPay cho các tích hợp mới.
4. Chỉ sử dụng chuyển hướng tương thích với EPay khi hệ thống trước đó yêu cầu luồng này.
5. Xác minh callback bằng chính `secret_key` của người bán
