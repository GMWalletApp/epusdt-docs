---
description: "Di chuyển tích hợp hiện tại của nhà giao dịch EPUSDT từ các tuyến đơn hàng đã ngừng hoạt động sang GMPay hoặc một luồng chuyển hướng tương thích với EPay."
---

# Di chuyển từ phiên bản cũ {#legacy-migration}

Nguồn hiện tại không còn hiển thị đường dẫn của lệnh Epusdt cũ.

## Các tuyến đã bị loại bỏ {#removed-routes}

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## Bạn nên sử dụng cái gì? {#what-to-use-instead}

### Nếu bạn kiểm soát mã khách hàng {#if-you-control-the-client-code}

Sử dụng **GMPay**:

```text
POST /payments/gmpay/v1/order/create-transaction
```

### Nếu hệ thống trước (upstream) chỉ hỗ trợ các luồng EPay theo kiểu chuyển hướng. {#if-the-upstream-system-only-supports-redirect-style-epay-flows}

Tương thích với EPay:

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Danh sách kiểm tra khi di chuyển {#migration-checklist}

- Thay thế URL đích cũ
- Thêm `pid` vào tất cả các yêu cầu nhận vào.
- Ký lại các yêu cầu bằng `secret_key` trong bản ghi của người bán
- Dừng dựa vào các tài liệu cũ đề cập đến `/payments/epusdt/v1/...`
- Nếu bạn cần giao diện chuỗi/token động, hãy truy cập `/payments/gmpay/v1/config` và đọc `data.supported_assets`.
