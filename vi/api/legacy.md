---
description: "Tra cứu các điểm cuối API EPUSDT đã ngừng hoạt động và các đường dẫn API hiện hành dành cho người bán thay thế chúng."
---

# Di chuyển sang API mới {#api-migration}

Nguồn hiện tại **không ghi nhận** tuyến đường cũ `POST /api/v1/order/create-transaction`.

Nó cũng **không nhận diện** đường dẫn tương thích cũ: `POST /payments/epusdt/v1/order/create-transaction`.

## Thay thế các tích hợp cũ bằng một trong các tuyến đường trực tiếp này. {#replace-old-integrations-with-one-of-these-live-routes}

| Trường hợp sử dụng | Đường dẫn hiện hành |
| --- | --- |
| API JSON gốc (khuyên dùng) | [`POST /payments/gmpay/v1/order/create-transaction`](/vi/api/endpoints/create-order) |
| Chuyển hướng / Luồng thanh toán theo phong cách EPay | [`GET/POST /payments/epay/v1/order/create-transaction/submit.php`](/vi/api/endpoints/epay-order) |

## Các thay đổi quan trọng liên quan đến di cư {#important-migration-changes}

1. Mỗi yêu cầu đơn hàng mới phải chỉ rõ người bán hàng thông qua `pid`.
2. **Dùng `secret_key` của bản ghi `api_keys` tương ứng để xác minh chữ ký.** Khóa chung cũ dành riêng cho từng đường dẫn đã hết hiệu lực.
3. Các mạng/token được hỗ trợ được xác định bởi quản trị viên, vì vậy hãy truy vấn `/payments/gmpay/v1/config` và đọc `data.supported_assets` thay vì giả định một danh sách cố định.
4. Các lỗi của EPay hiện nay xuất phát từ cài đặt quản trị (`epay.default_token`, `epay.default_currency`, `epay.default_network`), chứ không phải từ các khóa môi trường đã lỗi thời như `epay_pid` / `epay_key`.
