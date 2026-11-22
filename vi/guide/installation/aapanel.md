---
description: "Thiết lập một miền thanh toán EPUSDT trong aaPanel, cấu hình HTTPS, và kết nối bộ định tuyến ngược với quy trình gateway."
---

# Cài đặt bằng aaPanel {#install-using-aapanel}

## Tạo trang web {#create-the-site}

Tạo một trang web tĩnh cho miền thanh toán của bạn và cấu hình DNS và HTTPS. EPUSDT chạy như một quy trình riêng với SQLite. Lưu trữ tệp thực thi, cấu hình và cơ sở dữ liệu bên ngoài thư mục công khai của trang web.

![Thêm tên miền thanh toán](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## Cấu hình quy trình {#configure-the-process}

1. Cài đặt trình quản lý Supervisor trong aaPanel. Tải xuống và giải nén phiên bản phù hợp với kiến trúc của bạn. Làm theo [hướng dẫn cài đặt](/vi/guide/installation/manual) để chuẩn bị tài khoản dịch vụ, thư mục có thể ghi, và `.env`.
2. Đặt `app_uri` thành URL kiểm tra HTTPS của bạn và `http_listen=127.0.0.1:8000`. Trong Supervisor, thiết lập thư mục làm việc là thư mục cài đặt và lệnh là đường dẫn đầy đủ đến file thực thi, sau đó thêm `http start`. Kích hoạt khởi động và khởi động lại tự động.
3. Kiểm tra trạng thái và nhật ký của quy trình trong Supervisor.

![Cài đặt tiến trình Supervisor](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## Thêm bộ reverse proxy và kiểm tra. {#add-the-reverse-proxy-and-verify}

Trong cài đặt trang web, thêm một reverse proxy hướng đến `http://127.0.0.1:8000`. Mở `https://YOUR-DOMAIN/payments/gmpay/v1/config` và kiểm tra xem `status_code: 200`. Thêm một địa chỉ nhận để các tài sản được kích hoạt có sẵn trong quá trình thanh toán. Sau khi thay đổi cấu hình, khởi động lại EPUSDT từ Supervisor.

![Cài đặt proxy ngược](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
