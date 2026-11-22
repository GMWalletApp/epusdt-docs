---
description: "Hiểu cách GMShop Edge kết nối cửa hàng, quản trị, kho và giao hàng trên các triển khai Workers và Bun."
titleTemplate: ":title | GMShop Edge"
---

# Kiến trúc {#architecture}

GMShop Edge sử dụng cùng nền tảng React/TanStack đầy đủ trên Cloudflare Workers hoặc Bun/Nitro. Một lần triển khai bao gồm cửa hàng công khai, khu vực tài khoản của khách hàng, thanh toán, xử lý đơn hàng, tích hợp nhà cung cấp, tích hợp Telegram và bảng điều khiển quản trị.

## Giới hạn ứng dụng chung {#shared-application-boundaries}

Phần xử lý tại mỗi tuyến chỉ gồm các bước cần thiết. Các trang chức năng, lược đồ, hàm máy chủ và logic nghiệp vụ nằm trong `src/features`. Mã hạ tầng dùng chung giữa các miền nằm trong `src/server`, còn lược đồ Drizzle nằm trong `src/db/schema`.

Ứng dụng lưu trữ thông tin định danh, RBAC, danh mục sản phẩm, đơn hàng, kho hàng, quyền truy cập, trạng thái nhà cung cấp, nhật ký ví, thông báo, bảo vệ chống sao chép, giới hạn tốc độ, outbox và dữ liệu kiểm toán trong cơ sở dữ liệu chính. Tiền được lưu trữ dưới dạng chuỗi số nguyên thập phân ở đơn vị nhỏ nhất và không được tính toán bằng số thực.

## Các trình thích ứng Cloudflare Workers {#cloudflare-workers-adapters}

Việc triển khai nhân công sử dụng:

- `DB`: D1 cho ứng dụng và hoạt động kinh doanh có tính xác thực.
- `FILES`: bộ lưu trữ R2 riêng tư cho nội dung sản phẩm, tệp tải xuống, tệp do tác vụ tự động tạo và bản xuất dữ liệu.
- `CACHE`: Khu vực lưu trữ cho bộ nhớ đã được xác minh, phiên bản, và giới hạn đọc; các giới hạn bảo mật vẫn dựa trên thông tin từ cơ sở dữ liệu.
- `COMMERCE_QUEUE`
- `EMAIL`: binding tùy chọn của Cloudflare Send Email.
- Các kích hoạt Cron trong 1 phút để lên lịch xử lý và bảo trì.

## Bộ chuyển đổi Bun/Nitro {#bun-nitro-adapters}

Runtime Bun cung cấp các trình chuyển đổi tương đương trong một thư mục dữ liệu duy nhất.

- SQLite như cơ sở dữ liệu chính.
- Bộ nhớ đệm có giới hạn trong quá trình.
- Lưu trữ dữ liệu cục bộ riêng tư.
- Một hàng đợi bền vững dựa trên SQLite.
- Một trình lập lịch (hoạt động) kéo dài một phút.

`GMSHOP_DATA_DIR` chứa cơ sở dữ liệu, đối tượng, trạng thái hàng đợi và dữ liệu thực thi. Bun được thiết kế để chỉ hoạt động với một phiên bản duy nhất: triển khai nhiều bản sao và lưu trữ trên mạng chung không được hỗ trợ.

## Dữ liệu và công việc nền tảng {#data-and-background-work}

Các đối tượng riêng được giải quyết thông qua các bản ghi cơ sở dữ liệu được ủy quyền; khách hàng không bao giờ chọn khóa đối tượng. Hệ thống hàng đợi và công việc theo lịch trình xử lý đồng bộ với nhà cung cấp, mua hàng, giao hàng, thông báo, hoàn tiền, thử lại, lưu giữ, bảo trì Telegram và xoay vòng khóa bên ngoài các yêu cầu cửa hàng đồng bộ.

Điểm khởi đầu cho việc di chuyển (clean-install) là `drizzle/0000_gmshop.sql`; các bản di chuyển tiếp theo được áp dụng theo thứ tự và tính toàn vẹn của chúng được xác minh bởi các hoạt động dữ liệu của Bun.
