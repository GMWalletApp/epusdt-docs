---
description: "Chạy phiên bản EPUSDT Linux dưới quản lý dịch vụ của bạn và cấu hình thư mục làm việc và cài đặt gateway."
---

# Cài đặt thủ công trên Linux {#manual-linux-installation}

Sử dụng quy trình này để chạy tệp thực thi đã phát hành dưới quản lý của trình quản lý dịch vụ của bạn. Đối với cài đặt systemd được quản lý, vui lòng tham khảo [hướng dẫn epctl](/vi/guide/installation/epctl).

## Chuẩn bị thư mục ứng dụng {#prepare-the-application-directory}

Tải tệp tin lưu trữ Linux cho kiến trúc của bạn từ [Phát hành](https://github.com/GMWalletApp/epusdt/releases). Giải nén nó vào một thư mục ứng dụng riêng, ví dụ như `/opt/epusdt`. Cấu hình một tài khoản dịch vụ chuyên dụng với quyền ghi vào các thư mục cấu hình và SQLite. Giữ các thư mục này bên ngoài thư mục gốc của trang web công khai.

## Cấu hình và kiểm tra {#configure-and-test}

Khi cài đặt mới, sao chép các ví dụ đi kèm, sau đó chỉnh sửa bản sao. Giữ lại file `.env` hiện có khi nâng cấp.

```sh
cd /opt/epusdt
chmod +x epusdt
cp -n .env.example .env
```

Đối với một dịch vụ được cấu hình sau một máy chủ HTTPS, hãy thiết lập các mục sau trong `.env` và sử dụng miền công khai của bạn. Lần khởi động đầu tiên sẽ tạo các bảng SQLite.

```dotenv
app_uri=https://pay.example.com
http_listen=127.0.0.1:8000
runtime_root_path=./runtime
sqlite_database_filename=epusdt.db
install=false
```

Chạy `./epusdt http start` trong thư mục ứng dụng. Từ một terminal khác, kiểm tra `curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config`. Dừng tiến trình hiện tại trước khi khởi động dịch vụ được quản lý.

## Giữ dịch vụ hoạt động liên tục. {#keep-the-service-running}

Đối với người quản lý, hãy sử dụng định nghĩa chương trình sau và thay thế `epusdt` trong trường người dùng bằng tài khoản dịch vụ mà bạn đã chuẩn bị. Chạy `supervisorctl reread`, sau đó là `supervisorctl update`.

```ini
[program:epusdt]
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
user=epusdt
autostart=true
autorestart=true
redirect_stderr=true
```

Chỉ định host HTTPS ảo của bạn về `http://127.0.0.1:8000`. Đối với Nginx, sử dụng định vị này trong khối TLS. Khởi động lại dịch vụ sau khi chỉnh sửa cấu hình. Sao lưu các thư mục cấu hình và dữ liệu trước khi nâng cấp.

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
