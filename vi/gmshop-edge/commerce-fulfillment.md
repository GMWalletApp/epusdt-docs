---
description: "Theo dõi đơn hàng GMShop Edge từ quá trình thanh toán, phân bổ hàng tồn kho, giao hàng kỹ thuật số, cấp quyền và hỗ trợ sau bán hàng."
titleTemplate: ":title | GMShop Edge"
---

# Bán hàng và giao hàng {#commerce-and-fulfillment}

GMShop Edge sở hữu các tính năng như danh mục sản phẩm, thanh toán, quản lý hàng tồn kho, quản lý quyền, mua hàng từ nhà cung cấp, giao hàng, và dịch vụ hỗ trợ sau bán hàng – tất cả trong một triển khai cửa hàng duy nhất.

## Sản phẩm và quyền lợi {#products-and-entitlements}

Các loại sản phẩm là:

- `stock`: cấp phát trong một thao tác nguyên tử nội dung văn bản đã mã hóa và chuẩn bị sẵn, như khóa bản quyền, tài khoản, mã kích hoạt hoặc thông tin đăng nhập.
- `download`: cấp quyền truy cập có giới hạn vào các tệp riêng tư.
- `automation`: chạy tác vụ triển khai, tập lệnh, cấp phát tài nguyên hoặc quy trình xây dựng, với chính sách tệp kết quả `none | optional | required`.

Quyền truy cập có thể là vĩnh viễn, thời hạn cố định, giới hạn, không giới hạn, miễn phí, một lần, hoặc được gia hạn bởi khách hàng. Các đơn hàng bảo toàn các bản chụp (snapshots) không thể thay đổi về định nghĩa đầu vào, giá cả, quyền truy cập, thực hiện, và tự động hóa.

## Quyền sở hữu của khách hàng và ngân sách. {#customer-ownership-and-wallet}

Các đơn hàng đã đăng ký liên kết trực tiếp với người dùng Better Auth. Các đơn hàng của khách hàng giữ lại địa chỉ email xác minh và có thể được yêu cầu bởi một tài khoản xác minh tương ứng; không tạo bảng khách hàng ẩn.

Mỗi tài khoản có thể sử dụng ví cửa hàng. Nhật ký ghi lại các giao dịch nhỏ (số nguyên) và hỗ trợ thanh toán, hoàn tiền, cũng như điều chỉnh quản lý mà không sử dụng số thực.

## Nguồn cung cấp {#supplier-sourcing}

GMShop Edge hỗ trợ:

- API mở của ACG `3.5.5` phiên bản V4.
- Dujiao Next `v1.3.1`.
- Tích hợp nhà cung cấp gốc cho GMShop Edge.

API gốc từ nhà cung cấp sử dụng khóa API được tạo bởi quản trị viên, các điểm cuối HTTP được xác thực, quyền truy cập danh mục, và các thao tác đơn (idempotent). Một phiên bản GMShop Edge khác có thể sử dụng bộ chuyển đổi nhà cung cấp tích hợp để đồng bộ sản phẩm và thực hiện đơn hàng thông qua API này.

Đối với mỗi nhà cung cấp/nguồn API, các tài khoản đủ điều kiện tạo thành một nhóm ưu tiên bằng nhau. Đồng bộ danh mục, mua hàng, phản hồi/so sánh, và giao hàng đều đi qua các hệ thống trạng thái bền vững và luồng ghi nhận giao hàng thống nhất.

## Hoàn thành và hoạt động {#fulfillment-and-operations}

Hàng đợi và công việc theo lịch trình xử lý phân bổ hàng tồn kho, mua hàng từ nhà cung cấp, giao hàng riêng, công việc tự động hóa, thông báo, hoàn tiền, thử lại, hết hạn, hủy, giữ lại và phục hồi thủ công. Các khóa đối tượng riêng không bao giờ được chọn bởi đầu vào của khách hàng.

Đối với các tiêu chuẩn để được chấp nhận tại địa phương:

```bash
bun run seed:local
```

Lệnh này chỉ hoạt động cục bộ và có tính chất idempotent. Nó tạo ra các tài khoản nhà cung cấp bị vô hiệu hóa với nguồn `.example.invalid` và không thể liên hệ với các hệ thống thực cho đến khi thông tin đăng nhập được thay thế và các tài khoản được kích hoạt một cách rõ ràng.
