---
description: "Hãy xem cách GMPay Edge chia sẻ logic đơn hàng và thanh toán giữa Workers và Bun, cũng như các dịch vụ lưu trữ và chạy mà mỗi triển khai sử dụng."
titleTemplate: ":title | GMPay Edge"
---

# Kiến trúc {#architecture}

GMPay Edge hoạt động như một container Worker hoặc một container Bun/Nitro. Cả hai môi trường hoạt động đều sử dụng cùng một bộ giao diện sản phẩm và bộ lõi đơn hàng/thanh toán chung; chỉ sự khác biệt nằm ở các trình điều khiển cơ sở hạ tầng.

## Bề mặt sản phẩm {#product-surfaces}

- Khách hàng thương mại liên hệ với các giới hạn tương thích với GMPay hoặc EPay.
- Người thanh toán sử dụng giao diện thanh toán được cung cấp.
- Các nhà quản trị sử dụng `/admin`.
- Người dùng Telegram tương tác thông qua bot đã được cấu hình.

## Dịch vụ chạy nền {#runtime-services}

| Khả năng | Cloudflare Workers | Bun/Nitro Docker |
| --- | --- | --- |
| Cơ sở dữ liệu | D1 | SQLite trong `GMPAY_DATA_DIR` |
| Bộ nhớ đệm | KV | Bộ nhớ đệm chạy cục bộ |
| Vật tư nhân | R2 | Lưu trữ đối tượng cục bộ ổn định |
| Công việc nền | Cloudflare Queues | Hàng đợi địa phương bền vững |
| Lên lịch | Cron Triggers | Lịch trình cho món bún. |

Thư mục dữ liệu Bun cũng chứa các tệp đã tải lên và trạng thái hàng đợi ổn định. Nó cần được gắn kết (mount) vào một dung lượng lưu trữ (persistent volume) và được đưa vào các bản sao lưu.

## Binding Cloudflare {#cloudflare-bindings}

| Binding | Sản phẩm của Cloudflare | Mục đích |
| --- | --- | --- |
| `DB` | D1 | Dữ liệu chính xác và đáng tin cậy về ứng dụng, thanh toán, ủy quyền và giao hàng. |
| `CACHE` | KV | Bộ nhớ cache ngắn hạn và dữ liệu telemetry phụ trợ đã được xác minh |
| `FILES` | R2 | Bằng chứng đánh giá thanh toán riêng và các xuất bản được tạo. |
| `PAYMENT_QUEUE` | Hàng đợi | Quét thanh toán không đồng bộ |
| `WEBHOOK_QUEUE` | Hàng đợi | Thông báo từ người bán (merchant) theo phương thức không đồng bộ |

## Công việc nền {#background-work}

Các hàng đợi và trình lập lịch bền vững tùy theo thời gian thực di chuyển quét thanh toán và thử lại Webhook ra khỏi các yêu cầu đồng bộ. Chúng cũng quản lý thời gian hết hạn của thanh toán, dọn dẹp, kiểm tra sức khỏe kết nối và đồng bộ tốc độ.

Việc gửi thông báo qua webhook sử dụng một hộp ngoài (outbox) bền vững với lịch sử thử lại, khả năng thử lại thủ công, và ghi chú kiểm toán trên cả môi trường chạy.

## Mô hình dữ liệu và an toàn {#data-and-security-model}

- D1 hoặc SQLite là tiêu chuẩn cho môi trường chạy đã chọn.
- Các dịch vụ lưu trữ bộ nhớ (cache) và lưu trữ đối tượng riêng sử dụng các trình điều khiển (adapters) của thời gian chạy đã chọn.
- Các bộ chuyển đổi thanh toán là chỉ dành để đọc.
- Quản trị viên sử dụng Better Auth, TOTP và RBAC đa vai trò động.

## Giới hạn của quy trình {#protocol-boundaries}

GMPay sử dụng chữ ký **HMAC-SHA256**. Tính tương thích với EPay vẫn sử dụng biên độ **MD5** (cổ điển). Các phản hồi trả về vẫn giữ định dạng chữ ký của giao thức gốc.
