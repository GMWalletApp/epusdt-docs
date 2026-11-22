---
description: "Cài đặt EPUSDT bằng Docker Compose, cấu hình URL kiểm tra công khai, và lưu giữ dữ liệu gateway và ChainScanner giữa các lần khởi động lại container."
title: "Cài đặt cổng thanh toán bằng Docker Compose"
---

# Cài đặt bằng Docker Compose {#install-with-docker-compose}

Sử dụng tệp [Compose file](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml) từ phiên bản bạn đang cài đặt. Dịch vụ mặc định bao gồm ChainScanner.

Đối với việc cài đặt mới, hãy tải xuống các file bản phát hành trước.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Khởi động cổng thanh toán {#start-the-gateway}

Từ thư mục gốc, hãy thiết lập URL kiểm tra công cộng trong môi trường Compose (ví dụ: một file `.env` ở cấp dự án).  Nó sử dụng URL này mỗi khi khởi động.

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

Chỉ định trình duyệt ngược HTTPS của bạn đến cổng đã ánh xạ. Cấu hình một địa chỉ nhận, sau đó kiểm tra `data.supported_assets` trong phản hồi.

## Lưu trữ và nâng cấp {#storage-and-upgrades}

Tạo các phương tiện `./runtime/epusdt` tại `/app/runtime`. Thư mục này chứa tệp `.env` của ứng dụng, cơ sở dữ liệu kinh doanh và runtime, cũng như cơ sở dữ liệu quét tích hợp. Môi trường Compose cấp dự án và cấu hình ứng dụng là các tệp riêng biệt.

Khi nâng cấp từ phiên bản v2.0.0, hãy dừng dịch vụ cũ, sao lưu cấu hình và cơ sở dữ liệu của nó, và sao chép chúng vào điểm gắn kết mới **trước khi tạo lại container cũ**. Giữ lại các bản sao lưu gốc và kiểm tra các tên tệp cơ sở dữ liệu đã cấu hình. [Ghi chú phát hành](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

Bắt đầu từ phiên bản 2.1.1, gateway chỉ sử dụng SQLite. Sao lưu các cơ sở dữ liệu cấu hình, nghiệp vụ và dữ liệu quét. Nếu bạn đang sử dụng MySQL hoặc PostgreSQL cũ hơn, hãy di chuyển và xác minh dữ liệu trước khi chuyển đổi. Chỉ thay đổi `db_type` sẽ không di chuyển đơn hàng.

## Sử dụng trình quét độc lập {#using-a-standalone-scanner}

Đặt `CHAINSCANNER_URL=http://chainscanner:9081` và cung cấp các token riêng biệt cho người dùng và quản trị viên. Duy trì dung lượng quét hiện tại (`./runtime/chainscanner`), URL và thông tin đăng nhập khi nâng cấp một triển khai độc lập.

```sh
docker compose --profile scanner up -d
```
