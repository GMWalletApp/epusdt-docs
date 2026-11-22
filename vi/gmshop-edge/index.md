---
title: "GMShop Edge – cửa hàng hàng kỹ thuật số"
description: "Khám phá GMShop Edge, một cửa hàng hàng kỹ thuật số tự lưu trữ với các tính năng thanh toán, giao hàng và tích hợp nhà cung cấp dành cho Workers hoặc Bun."
---

# GMShop Edge {#gmshop-edge}

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) là một cửa hàng bán hàng kỹ thuật số, được tự lưu trữ, chỉ sử dụng một lần triển khai, và dành riêng cho **Cloudflare Workers**hoặc một**container Docker Bun/Nitro**.

Một triển khai cung cấp một cửa hàng công cộng phản ứng, tài khoản khách hàng, quy trình thanh toán và giao hàng, tích hợp Telegram, hoạt động của nhà cung cấp, và một bảng điều khiển quản trị dựa trên quyền truy cập.

Đây là một dự án hỗ trợ riêng biệt, khác với Epusdt và GMPay Edge. Hãy sử dụng GMShop Edge khi bạn cần quản lý một cửa hàng bán hàng kỹ thuật số với các quy trình như danh mục sản phẩm, thanh toán, giao hàng và quản lý nhà cung cấp.

> GMShop Edge đang trong giai đoạn phát triển tích cực. Các bộ chuyển đổi tích hợp sẵn có cho phép các phương thức tích hợp; tuy nhiên, việc sử dụng trong thực tế vẫn đòi hỏi phải có thông tin đăng nhập, sao lưu, giám sát và kiểm tra chấp nhận từ nhà cung cấp sở hữu.

## Điều này mang lại {#what-it-provides}

- Sản phẩm lưu trữ với việc phân bổ nguyên tử cho văn bản được mã hóa và cài đặt trước, sản phẩm tải riêng, và sản phẩm tự động hóa với các chính sách đối tượng rõ ràng.
- Quyền lợi cố định, có thời hạn, giới hạn, vô hạn, miễn phí, một lần, và quyền lợi được gia hạn bởi khách hàng.
- Khách hàng và thanh toán, mã giảm giá, hoàn tiền, hỗ trợ sau bán hàng, tìm kiếm đơn hàng riêng tư, và truy cập giao hàng dựa trên tài khoản.
- Thanh toán ví cửa hàng, cùng với Stripe, Cryptomus, GMpay, EPay, Alipay (trên trang/WAP) và các trình thích ứng cho WeChat (trực tiếp/H5).
- Tích hợp và hoàn tất danh mục nhà cung cấp thông qua ACG `3.5.5`, Dujiao Next `v1.3.1`, hoặc API nhà cung cấp gốc GMShop Edge.
- Xác thực email/mật khẩu được cấu hình khi chạy, cũng như các phương thức xác thực cho mạng xã hội, OIDC, Telegram OIDC, Widget đăng nhập Telegram, và Ứng dụng Telegram Mini.
- Một bot webhook grammY với lệnh được tùy chỉnh, nút của ứng dụng mini, và hỗ trợ khách hàng dựa trên chủ đề diễn đàn, mà không lưu nội dung tin nhắn.
- RBAC đa năng và linh hoạt cho `/admin`, với bảo vệ tài khoản gốc, kiểm tra quyền trên máy chủ, xác thực lại, và ghi lại nhật ký kiểm tra.
- Loại định dạng ứng dụng cho tiếng Anh (`en-US`) và tiếng Trung (`zh-CN`).

Tất cả các khả năng được liệt kê ở trên là một phần của dự án mã nguồn mở; không có cấp "Pro" hoặc "Enterprise" riêng.

## Phần tài liệu {#documentation-sections}

- [Kiến trúc](./architecture.md): nền tảng ứng dụng chung, các binding Workers, adapter Bun, quyền sở hữu dữ liệu và giới hạn thời gian thực hiện.
- [Triển khai](./deployment.md): Workers, Bun/Docker, cài đặt và kiểm tra trước khi đưa vào vận hành.
- [Quản lý dữ liệu Bun](./node-data-operations.md): sao lưu, khôi phục và nhập dữ liệu từ Cloudflare D1/R2.
- [API của nhà cung cấp gốc](./supplier-api.md): quản lý các hoạt động về danh mục sản phẩm, đơn hàng, kênh thanh toán và nạp tiền giữa các phiên bản GMShop Edge.
- [Bán hàng và giao hàng](./commerce-fulfillment.md): sản phẩm, hàng tồn kho, nhà cung cấp, ghi chú giao hàng, quyền lợi, và tự động hóa.
- [Thanh toán và nhà cung cấp](./checkout-providers.md): ví, thanh toán bên ngoài, báo giá tiền tệ, email, xác thực, và hỗ trợ Telegram.

## Liên kết {#links}

- Kho mã nguồn: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- Danh sách kiểm tra triển khai: [`docs/DEPLOYMENT.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.md)
- Các thao tác với dữ liệu Bun: [`docs/NODE_DATA_OPERATIONS.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
