---
title: "GPMoney – Giao diện thanh toán dành cho người lao động và Bun"
description: "Khám phá GMPay Edge, một cổng thanh toán độc lập, được tự lưu trữ dành cho Cloudflare Workers hoặc Bun, với API của GMPay và khả năng tương thích với EPay."
---

# GMPay Edge {#gmpay-edge}

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge) là cổng thanh toán tiền mã hóa tự lưu trữ, mỗi phiên bản phục vụ một đơn vị duy nhất và chạy trên **Cloudflare Workers hoặc Bun/Nitro trong Docker**.

Đây là một dự án riêng biệt so với Epusdt. Hãy sử dụng Epusdt khi bạn muốn có một gateway Go được tài liệu hóa bởi trang web này; hãy đánh giá GMPay Edge khi bạn muốn một gateway TypeScript có thể triển khai trên Cloudflare Workers hoặc dưới dạng một container Docker với lưu trữ cục bộ dựa trên SQLite.

> GMPay Edge đang được phát triển tích cực. Với các tích hợp sẵn có, khả năng này đã được hiện diện trong dự án; tuy nhiên, việc sử dụng trong sản xuất vẫn đòi hỏi các điểm cuối (endpoints) thuộc sở hữu của người triển khai, hoặc thông tin đăng nhập chỉ đọc, cùng với các phương thức nhận, sao lưu, giám sát và kiểm thử thực tế trên nền tảng.

## Điều này mang lại {#what-it-provides}

- Tích hợp API của nhà chấp nhận GMPay với định dạng JSON và đầu vào dạng biểu mẫu.
- Tương thích EPay tại biên giới API mà không cần duy trì một mô hình đơn hàng riêng.
- Giao diện thanh toán linh hoạt, bảng điều khiển quản trị, trang trạng thái công khai, và tài liệu OpenAPI thời gian thực.
- Hoàn thành việc gửi Webhook đáng tin cậy thông qua hàng đợi (queue) với cơ chế "outbox", lịch sử thử lại, khả năng thử lại thủ công và ghi chú kiểm toán.
- Quét thanh toán, kiểm tra hết hạn, dọn dẹp, kiểm tra sức khỏe kết nối, và đồng bộ tốc độ thông qua hàng đợi (queues) và trình lập lịch (schedulers) đặc trưng cho thời gian chạy.
- Tự động hóa nâng cao, TOTP, và RBAC đa năng với nhiều vai trò cho quản trị.
- Tự động hóa bot Telegram bằng grammY, bao gồm lệnh trực tiếp, lệnh công khai và đăng ký nhận thông báo.
- Sáu khu vực giao diện (UI).

## Phần tài liệu {#documentation-sections}

- [Kiến trúc](./architecture.md): dịch vụ chạy trên Workers và Bun, hàng đợi, callback và phạm vi các giao thức.
- [Triển khai](./deployment.md): Docker Compose, hình ảnh GHCR, Nút Triển khai, CLI Wrangler, phát triển cục bộ và cài đặt lần đầu.
- [Quản lý dữ liệu Bun](./node-data-operations.md): sao lưu, khôi phục và nhập dữ liệu từ Cloudflare D1/R2.
- [API cho người bán](./merchant-api.md): tạo và truy vấn đơn hàng GMPay, chữ ký, callback và khả năng tương thích với EPay.
- [Tích hợp thanh toán](./payment-integrations.md): danh mục các bộ điều hợp tích hợp sẵn cho thanh toán on-chain, sàn giao dịch và ví.

## Liên kết {#links}

- Kho mã nguồn: [GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- README tiếng Anh: [README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- README tiếng Trung: [README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
