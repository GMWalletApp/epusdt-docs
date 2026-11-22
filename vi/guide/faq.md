---
description: "Tìm hiểu thêm về GMPay và EPay, thông tin tài khoản của người bán, tài sản được kích hoạt, và xác minh thông qua hồi âm khi tích hợp EPUSDT."
title: "Câu hỏi thường gặp về tích hợp với nhà bán hàng"
---

# FAQ {#faq}

## Nên dùng điểm cuối API nào? {#which-route-should-i-use}

- Sử dụng GMPay cho tất cả các tích hợp mới.
- Chỉ sử dụng chuyển hướng EPay tương thích, chỉ khi hệ thống trước sử dụng chuyển hướng thanh toán theo phong cách EPay.
- Không nên tạo các tích hợp mới trên `/payments/epusdt/v1/order/create-transaction` vì đường dẫn này hiện không còn được đăng ký trong nguồn hiện tại.

## `pid` và khóa ký kết đến từ đâu? {#where-do-pid-and-signing-keys-come-from}

Xem danh sách khóa API trong bảng quản trị. Mỗi người bán có một `pid` và một `secret_key` tương ứng.

## Tại sao cấu hình GMPay lại khác nhau giữa các môi trường? {#why-does-the-gmpay-config-differ-between-environments}

Vì `GET /payments/gmpay/v1/config` được tính toán dựa trên dữ liệu quản trị của bạn.

Danh sách `data.supported_assets` phụ thuộc vào các chuỗi được kích hoạt, các token chuỗi được kích hoạt, và các địa chỉ ví có sẵn trong môi trường đó.

## Những nút nào tôi cần? {#which-nodes-do-i-need}

Chức năng ChainScanner tích hợp bao gồm các nút công khai. TRON có thể sử dụng một điểm cuối công khai được hỗ trợ mà không cần sử dụng khóa TronGrid. Khi thêm một nút, hãy chọn mạng và giao thức mà nhà cung cấp thực sự cung cấp. Một kết nối WebSocket có thể thông báo về một khối mới, trong khi một điểm cuối HTTP riêng biệt sẽ đọc nó.

Bảng điều khiển hiển thị tiến trình quét và cảnh báo khi độ trễ được quan sát vượt quá 5 phút. Đối với các truy vấn thường xuyên liên quan đến Solana, TON hoặc Plasma, hãy cấu hình các nút dự phòng từ hai nhà cung cấp độc lập và kiểm tra giới hạn của họ.

## Các tỷ giá hối đoái được xác định như thế nào? {#how-are-exchange-rates-set}

Chọn `fixed` để sử dụng danh sách `rate.forced_rate_list`, hoặc chọn `auto` để lấy tỷ giá từ `rate.api_url`. Chế độ tự động sẽ giữ lại tỷ giá đã lưu trước đó nếu cập nhật không thành công. Danh sách forced_rate trống sẽ khôi phục tỷ giá CNY mặc định cho USDT và USDC.
