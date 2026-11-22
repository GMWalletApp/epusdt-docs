---
description: "Cấu hình các nhà cung cấp thanh toán và trình thanh toán GMShop Edge, cùng với cài đặt xác thực và thông báo, cho cửa hàng."
titleTemplate: ":title | GMShop Edge"
---

# Thanh toán và nhà cung cấp {#checkout-and-providers}

GMShop Edge quản lý quy trình thanh toán, trạng thái ví, thông tin xác thực nhà cung cấp, cấu hình xác thực và việc gửi thông báo đều bên trong cài đặt cửa hàng.

## Thanh toán {#payments}

Số lượng đơn hàng được sử dụng với đơn vị nhỏ nguyên. Các đồng tiền tệ phổ biến được chọn bởi khách hàng được tính theo tỷ giá hối đoạt của cửa hàng, và một tỷ giá không thể thay đổi được được chuyển cho nhà cung cấp đã chọn.

| Nhà cung cấp | Trang thanh toán | Hoàn tiền | Tiền giấy |
| --- | --- | --- | --- |
| Stripe | Chuyển hướng | Tự động | Điều khiển cấu hình kênh chấp nhận các loại tiền tệ |
| Cryptomus | Chuyển hướng | Thủ công | Sử dụng đơn vị tiền tệ được cấu hình trên hóa đơn. |
| GMpay | Chuyển hướng | Thủ công | Sử dụng điểm cuối tương thích với Epusdt đã được cấu hình. |
| EPay | Chuyển hướng | Thủ công | Yêu cầu `pid` dạng số. Giá trị mặc định của `paymentMethod` là `alipay`. |
| Alipay Page / WAP | Chuyển hướng | Tự động | Yêu cầu `CNY` với hai chữ số thập phân |
| WeChat Native | QR hoặc chuyển hướng | Tự động | Yêu cầu `CNY` với hai chữ số thập phân |
| WeChat H5 | Chuyển hướng | Tự động | Yêu cầu thông tin `CNY` với hai chữ số sau dấu chấm thập phân và địa chỉ IP của người thanh toán. |

Khách hàng đã đăng ký cũng có thể thanh toán từ ví cửa hàng tích hợp. Các hoạt động hoàn tiền và sau bán hàng cập nhật sổ ghi chép thanh toán và ví thông qua các trạng thái chuyển đổi không trùng lặp.

Việc có một bộ chuyển đổi tích hợp không đồng nghĩa với việc nhà cung cấp đã sẵn sàng để triển khai cho một môi trường cụ thể. Hãy cấu hình thông tin đăng nhập thuộc sở hữu của nhà triển khai và hoàn thành các bài kiểm tra thực tế liên quan đến việc tạo đơn hàng, phản hồi/webhook, thanh toán, hoàn tiền và đối chiếu trước khi mở cửa cửa hàng.

## Email {#email}

Email giao dịch dùng mẫu hỗ trợ SMTP, Resend, Postmark, SendGrid, Mailgun và binding `EMAIL` tùy chọn của Cloudflare Send Email. Các bản ghi lưu trạng thái gửi. Hàng đợi và tác vụ định kỳ thực hiện số lần thử lại có giới hạn.

## Xác thực {#authentication}

Better Auth hỗ trợ cấu hình email/mật khẩu, các nhà cung cấp mạng xã hội, OIDC chung, OIDC Telegram, và tính năng thay thế Widget đăng nhập Telegram đã được xác minh. Các Mini App Telegram xác minh `initData` để đăng ký/đăng nhập tự động và có thể nhập lại ảnh đại diện Telegram bị thiếu. Người dùng Telegram có thể liên kết một email đã được xác minh mà không cần thiết lập mật khẩu.

## Bot Telegram và hỗ trợ {#telegram-bot-and-support}

Bot webhook của grammY đồng bộ hóa các lệnh cửa hàng được địa phương hóa và các nút cố định của Mini App. Tính năng tùy chọn này liên kết một người dùng Telegram với một chủ đề diễn đàn và truyền tin theo cả hai hướng mà không lưu nội dung tin nhắn. Tính năng này sử dụng một bản sao Telegram mới của người quản trị và đóng các cuộc trò chuyện không hoạt động theo chính sách bảo trì đã được cấu hình.

Cấu hình các cài đặt Token Bot, bí mật OIDC, nhóm hỗ trợ, đồng bộ hóa và cài đặt hỗ trợ web riêng biệt trong `/admin`; không commit chúng.

## Danh sách kiểm tra an toàn {#security-checklist}

Sử dụng xác thực máy chủ và nguồn được phép, HTTPS, bảo vệ chống CSRF, giới hạn kích thước yêu cầu, giới hạn tốc độ, giám sát hàng đợi/DLQ, xác thực lại mật khẩu mới cho các xuất khẩu nhạy cảm, phục hồi quản trị viên, và sao lưu đã được kiểm tra. Bí mật nhà cung cấp và xác thực phải sử dụng cấu hình thời gian mã hóa và không được lưu trữ.
