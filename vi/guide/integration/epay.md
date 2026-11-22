---
description: "Kết nối hệ thống người bán tương thích với EPay với EPUSDT bằng cách sử dụng điểm cuối (endpoint) thanh toán chuyển hướng và các thông số yêu cầu được ký."
title: "Kiểm tra thanh toán tích hợp với EPay"
---

# Tích hợp tương thích EPay (chuyển hướng thanh toán) {#epay-compatible-integration-redirect-checkout}

Sử dụng định dạng này khi hệ thống của bạn yêu cầu tạo đơn hàng chuyển hướng theo phong cách EPay.

## Đường dẫn {#route}

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Yêu cầu về chứng nhận của thương nhân {#merchant-credential-requirement}

Các yêu cầu đến **không** được xác thực bằng các khóa môi trường lỗi thời như `epay_pid` hoặc `epay_key`.

Nguồn hiện tại thực hiện điều này thay vào đó:

1. Đọc `pid` đang đến
2. Tìm dòng `api_keys` được kích hoạt với PID đó.
3. Xác minh `sign` bằng `secret_key` của bản ghi đó
4. Áp dụng kiểm tra danh sách IP tùy chọn

## Các trường nhập cần thiết {#required-incoming-fields}

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

Các trường thông tin phổ biến (tùy chọn):

- `return_url`
- `name`
- `type`
- `token`
- `network`
- `currency`
- `sign_type`

`type` hiện hỗ trợ hai dạng sau:

- `alipay` – giá trị tương thích; token/mạng được giải quyết từ các tham số yêu cầu rõ ràng `token` + `network`, sau đó từ cài đặt mặc định EPay của quản trị viên.
- Chỉ chọn `token.network` như `usdt.tron` – chỉ được chấp nhận khi cặp token/mạng này hiện đang được hỗ trợ. Một trình chọn hợp lệ sẽ ghi đè cho `token`, `network`, `epay.default_token`, và `epay.default_network`.

Các giá trị `type` khác không rỗng cũng bị từ chối như các tham số không hợp lệ. Giá trị `type` được chọn hoặc giá trị tương thích được lưu trong đơn hàng để sử dụng sau này trong các cuộc gọi trả lại/thông báo EPay.

## EPay mặc định {#epay-defaults}

Sau khi xác minh chữ ký thành công, nguồn hiện tại sẽ tạo payload đơn hàng nội bộ, bao gồm cài đặt từ quản trị viên.

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

Thứ tự giải quyết cho submit.php của EPay là:

1. Hỗ trợ trình chọn `type=token.network`, nếu được cung cấp.
2. Yêu cầu rõ ràng về các thông số `token` / `network`.
3. Admin `epay.default_token` / `epay.default_network`
4. Nếu cả token và mạng vẫn trống, hãy tạo một đơn hàng dự phòng với trạng thái “`4`” cho luồng chọn của nhân viên bán hàng.

Tiền tệ là độc lập: yêu cầu `currency` → `epay.default_currency` → `cny`.

## Hành vi thành công {#success-behavior}

Về mặt thành công, trình duyệt sẽ được chuyển hướng đến:

```text
/pay/checkout-counter/{trade_id}
```

Hiện tại, đường dẫn này đã trở thành lối chuyển hướng cho giao diện ứng dụng (SPA) thanh toán của chúng tôi. Dữ liệu trang thanh toán được phục vụ thông qua:

```text
/pay/checkout-counter-resp/{trade_id}
```


## Lựa chọn trực tiếp về token/mạng lưới {#direct-token-network-choices}

Đối với danh sách phương thức thanh toán "New API" ở phía trước (upstream), hãy hiển thị các tùy chọn riêng biệt, trong đó `type` là trình chọn `token.network` được hỗ trợ. Ví dụ, `usdt.tron` tạo một đơn hàng USDT trên TRON trực tiếp, trong khi `usdt.binance` tạo một đơn hàng USDT trên Binance/BSC khi tài sản đó được kích hoạt.

Danh sách phương pháp upstream:

```json
[
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay", "type": "custom1" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.binance", "type": "usdt.binance" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.tron", "type": "usdt.tron" }
]
```

`custom1` chỉ là một tên tùy chỉnh chung, dùng cho phía trước. Không nên gửi nó một cách trực tiếp đến submit.php của EPay; không nên sử dụng `type`, `type=alipay`, hoặc bất kỳ lựa chọn hợp lệ nào như `usdt.tron`.

## Xác minh callback {#callback-verification}

Khi hệ thống tạo ra (creation) sử dụng `payment_type = Epay`, người làm (worker) sau đó gọi `notify_url` của bạn với các tham số giống kiểu Epay, và ký chúng bằng cùng khóa bí mật `secret_key` của người bán.

Hàm gọi lại (`type`) sử dụng lại loại yêu cầu đã lưu. Điều này có nghĩa là nó trả về hoặc `alipay` hoặc trình chọn được chấp nhận, chẳng hạn như `usdt.tron`. Nếu yêu cầu không bao gồm `type`, các hàm gọi lại bên ngoài sẽ mặc định là `alipay` để đảm bảo tính tương thích.

Không cần xác nhận các cuộc gọi lại này với một khóa `epay_key` cũ và độc lập.
