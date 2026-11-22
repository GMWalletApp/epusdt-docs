---
description: "Tạo đơn GMPay, kiểm tra trạng thái thanh toán và xác minh các phản hồi EPUSDT. Bao gồm các thông số yêu cầu của người bán, quy tắc ký và các ví dụ."
title: "API thanh toán cho nhà bán hàng, chữ ký và thông báo trở về"
---

# API cho người bán {#merchant-api}

Sử dụng điểm cuối cấu hình công khai để khám phá các tùy chọn thanh toán, tạo đơn hàng trên máy chủ của bạn, và chuyển hướng người mua đến URL thanh toán được trả về. Xác minh thông báo đã ký trước khi hoàn tất đơn hàng. [Ví dụ đơn hàng Python](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/sdk/python/gmpay_create_order.py) · [Tài liệu API](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/docs/swagger.json)

[Đăng ký yêu cầu](#signing) · [Tạo đơn GMPay](#create) · [Trạng thái khảo sát](#status) · [Phản hồi từ đối tác thanh toán](#callbacks)

## Các điểm cuối API {#endpoints}

| Mục đích | Phương thức | Đường dẫn | Xác thực |
| --- | --- | --- | --- |
| [Tạo đơn GMPay](/vi/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | HMAC-SHA256 của người bán |
| [Đọc cấu hình thanh toán](/vi/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | Công khai |
| [Mở trang thanh toán](/vi/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | Công khai |
| [Đọc chi tiết thanh toán](/vi/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | Công khai |
| [Kiểm tra trạng thái đơn](/vi/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | Công khai |
| [Chọn mạng hoặc nhà cung cấp](/vi/api/endpoints/switch-network) | POST | `/pay/switch-network` | Công khai |
| [Gửi mã băm giao dịch](/vi/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | Công khai |
| [Quay về trang người bán](/vi/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | Chuyển hướng trình duyệt |
| [Tạo đơn EPay](/vi/api/endpoints/epay-order) | GET hoặc POST | `/payments/epay/v1/order/create-transaction/submit.php` | MD5 của người bán |
| [Nhận thông báo OKPay](/vi/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | Chữ ký OKPay |

## The quick brown fox jumps over the lazy dog. {#response-format}

Các điểm cuối (endpoints) JSON trả về `status_code` (200 khi thành công), `message`, `data` (đối tượng hoặc null), và `request_id` do máy chủ tạo. Các chữ ký không hợp lệ trả về HTTP 401. Lỗi kinh doanh thường trả về HTTP 400 với mã lỗi ứng dụng.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {},
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<a id="signing"></a>

## Ký yêu cầu {#sign-a-request}

Sử dụng khóa thương nhân liên quan đến `pid` của yêu cầu. Việc cài đặt mới sẽ khởi tạo một khóa thương nhân mặc định với PID là `1000`. Lưu giữ bí mật trên máy chủ thương nhân.

**GMPay** sử dụng HMAC-SHA256. Xóa `signature`, chuỗi rỗng và giá trị null. Sắp xếp các tên trường (case-sensitive) còn lại theo thứ tự ASCII tăng dần. Nối các cặp `key=value` (không mã hóa) bằng dấu `&`, sử dụng `secret_key` làm khóa HMAC và mã hóa digest thành 64 ký tự hex nhỏ (thường). Bao gồm `pid` và bất kỳ `payment_type` nào không rỗng. Với định dạng JSON, máy chủ đọc một số như `100.00` là `100`. Định dạng mã hóa cho phép bạn cung cấp chuỗi gốc.

Ví dụ về trường, chuỗi chuẩn và chữ ký sử dụng khóa demo `epusdt_secret_key`:

```text
pid=1000
order_id=ORD202605230001
currency=cny
token=usdt
network=tron
amount=100
notify_url=https://merchant.example/notify
redirect_url=https://merchant.example/return
name=VIP
```

```text
amount=100&currency=cny&name=VIP&network=tron&notify_url=https://merchant.example/notify&order_id=ORD202605230001&pid=1000&redirect_url=https://merchant.example/return&token=usdt
```

```text
signature=6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d
```

### Ví dụ PHP {#php-examples}

GMPay:

```php
function gmpaySign(array $params, string $secretKey): string
{
    unset($params['signature']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return hash_hmac('sha256', implode('&', $pairs), $secretKey);
}
```

EPay loại trừ `sign` và `sign_type`, thêm bí mật của người bán vào chuỗi chuẩn, và sử dụng MD5.

```php
function epaySign(array $params, string $secretKey): string
{
    unset($params['sign'], $params['sign_type']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

<a id="create"></a>

## Tạo đơn hàng GMPay {#create-a-gmpay-order}

`POST /payments/gmpay/v1/order/create-transaction` chấp nhận JSON và `application/x-www-form-urlencoded`.

```json
{
  "pid": "1000",
  "order_id": "ORD202605230001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example/notify",
  "redirect_url": "https://merchant.example/return",
  "name": "VIP",
  "signature": "6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d"
}
```

<!-- #region create-fields -->

| Trường | Kiểu | Bắt buộc | Mô tả |
| --- | --- | --- | --- |
| `pid` | Chuỗi | Có | Trước đây, Merchant PID đã sử dụng để tìm kiếm khóa ký. |
| `order_id` | Chuỗi | Có | Mã đơn hàng độc đáo của nhà bán hàng, tối đa 32 ký tự. |
| `currency` | Chuỗi | Có | Loại tiền pháp định, chẳng hạn `usd` hoặc `cny`. |
| `token` | Chuỗi | Có điều kiện | Tiếp nhận tài sản. Kết hợp với mạng hoặc bỏ cả hai. |
| `network` | Chuỗi | Có điều kiện | ID mạng từ cấu hình công khai, ví dụ: `binance`. |
| `amount` | Số | Có | Số fiat lớn hơn 0,01. |
| `notify_url` | Chuỗi | Có | URL hồi báo thành công không đồng bộ. |
| `redirect_url` | Chuỗi | Không | Trang web được trả về bởi trình duyệt. |
| `name` | Chuỗi | Không | Tên sản phẩm hoặc đơn hàng. |
| `payment_type` | Chuỗi | Không | Mặc định sử dụng GMPay. EPay (không phân biệt chữ hoa/chữ thường) chọn định dạng callback của EPay và yêu cầu một PID số. Bao gồm bất kỳ giá trị nào không rỗng trong chữ ký. |
| `signature` | Chuỗi | Có | Chữ ký HMAC-SHA256 với độ dài 64 ký tự (thường là chữ). |

<!-- #endregion create-fields -->

Cung cấp cả `token` và `network` để phân bổ địa chỉ ngay lập tức. Bỏ cả hai để tạo một giá trị thay thế (trạng thái 4) chứa số tiền fiat và đơn vị tiền tệ. Cung cấp chỉ một trong hai là không hợp lệ. Kiểm tra `data.supported_assets` trong cấu hình công khai trước khi chọn một cặp.

### Phản hồi {#response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "order_id": "ORD202605230001",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.29,
    "receive_address": "TTestTronAddress001",
    "token": "USDT",
    "status": 1,
    "expiration_time": 1779530812,
    "payment_url": "https://pay.example.com/pay/checkout-counter/20260523171652123456001"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

| Trường | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `trade_id` | Chuỗi | ID giao dịch EPUSDT. |
| `order_id` | Chuỗi | Mã đơn hàng của người bán. |
| `amount` | Số | Số tiền đã được đề xuất. |
| `currency` | Chuỗi | Tiền tệ quốc tế. |
| `actual_amount` | Số | Số tiền mã hóa cần thanh toán. |
| `receive_address` | Chuỗi | Địa chỉ nhận hàng. |
| `token` | Chuỗi | Biểu tượng tài sản. |
| `status` | Số nguyên | Trạng thái đơn hàng. Giá trị 4 có nghĩa là đang chờ lựa chọn. |
| `expiration_time` | Số nguyên | Thời gian hết hạn tính bằng dấu thời gian Unix (tính bằng giây). |
| `payment_url` | Chuỗi | Liên kết để mở trong trình duyệt. |

Một giá trị tạm (placeholder) không có địa chỉ hoặc mã định danh, và một `actual_amount` bằng 0. Việc hết hạn hoặc đóng thủ công sẽ chuyển nó sang trạng thái 3 mà không thực hiện việc giữ lại thanh toán. Lựa chọn thanh toán xác định địa chỉ hoặc URL được lưu trữ.

## Cài đặt thanh toán công khai {#public-checkout-configuration}

`GET /payments/gmpay/v1/config` trả về thông tin định dạng thanh toán, danh mục tài sản có sẵn, cài đặt mặc định của EPay, cũng như cài đặt nhà cung cấp công cộng `okpay` và `xlayer`. Mỗi mục trong `supported_assets` yêu cầu một chuỗi được kích hoạt, một địa chỉ nhận được có sẵn và một token được cấu hình để thanh toán. Các phương thức được lưu trữ có cờ `enabled` và danh sách `allow_tokens` riêng của chúng.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "supported_assets": [
      {
        "network": "tron",
        "display_name": "TRON",
        "tokens": ["A7A5", "TRX", "USDT"],
        "token_details": {
          "A7A5": {"contract_address": "TLeVfrdym8RoJreJ23dAGyfJDygRtiWKBZ", "decimals": 6},
          "TRX": {"contract_address": "", "decimals": 6},
          "USDT": {"contract_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", "decimals": 6}
        }
      },
      {
        "network": "solana",
        "display_name": "Solana",
        "tokens": ["SOL", "USDC", "USDT"],
        "token_details": {
          "SOL": {"contract_address": "", "decimals": 9},
          "USDC": {"contract_address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "decimals": 6},
          "USDT": {"contract_address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "decimals": 6}
        }
      }
    ],
    "site": {
      "cashier_name": "Acme Cashier",
      "logo_url": "https://cdn.example.com/logo.png",
      "website_title": "Acme Payments",
      "support_link": "https://example.com/support",
      "background_color": "#0f172a",
      "background_image_url": "https://cdn.example.com/background.png",
      "withdrawal_reminder_enabled": true
    },
    "epay": {
      "default_token": "",
      "default_currency": "cny",
      "default_network": ""
    },
    "okpay": {
      "enabled": false,
      "allow_tokens": ["USDT", "TRX"]
    },
    "xlayer": {
      "enabled": false,
      "allow_tokens": ["USDC", "USDT0", "USDG"]
    },
    "version": "0.0.0-dev"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### Nhắc phí rút tiền từ sàn {#exchange-withdrawal-reminder}

Sau khi tải cấu hình, hiển thị thông báo chỉ khi `site.withdrawal_reminder_enabled` là đúng, đơn hàng trên chuỗi đang chờ thanh toán, có địa chỉ nhận được, và `actual_amount > 0` lớn hơn 0. Xử lý trường hợp thiếu thông báo trên các phiên bản cũ như thể nó là đúng. Hiển thị số tiền nhận được **thực tế** sau khi trừ phí giao dịch, sử dụng cùng độ chính xác và loại tiền tệ với đơn hàng. [Xem trước (ánh sáng)](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-light.png) · [Xem trước (tối)](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-dark.png)

Quản trị viên truy cập `GET /admin/api/v1/settings?group=brand`. Giá trị đã lưu của `brand.withdrawal_reminder_enabled` là chuỗi `"true"` hoặc `"false"`. Để thay đổi, hãy gửi yêu cầu `PUT /admin/api/v1/settings` được xác thực. Kiểm tra cờ `ok` của mục trả về và khôi phục lại quá trình thanh toán.

```json
{"items":[{"group":"brand","key":"brand.withdrawal_reminder_enabled","type":"bool","value":false}]}
```

## Mở trang thanh toán và xem đơn hàng. {#open-checkout-and-read-the-order}

URL `payment_url` được trả về khi tạo chỉ dẫn đến `GET /pay/checkout-counter/{trade_id}`. Mở URL này trong trình duyệt sẽ trả về chuyển hướng 301 đến:

```text
/cashier/{trade_id}
```

Lấy thông tin chi tiết bằng cách gọi `GET /pay/checkout-counter-resp/{trade_id}`.  Phản hồi này sử dụng **mil giây** cho `created_at` và `expiration_time`. Kiểm tra điểm cuối (endpoint) để theo dõi các thay đổi tiếp theo.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 14.29,
    "token": "USDT",
    "currency": "CNY",
    "receive_address": "TTestTronAddress001",
    "network": "tron",
    "status": 1,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

Để làm một giá trị thay thế, cùng một ID của bên cha sẽ được trả về với các trường trên chuỗi trống. Cả GMPay và EPay đều có thể tạo ra trạng thái này.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 0,
    "token": "",
    "currency": "CNY",
    "receive_address": "",
    "network": "",
    "status": 4,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

Việc thanh toán trả về `payment_type` ở dạng chữ thường (`gmpay` hoặc `epay`), điều này chọn định dạng phản hồi của người bán. Đối với OKX OnchainOS trên X Layer, hãy mở URL được cung cấp bởi máy chủ. EPUSDT kiểm tra đơn hàng đã thanh toán của nhà cung cấp trước khi ghi nợ.

<a id="status"></a>

## Truy vấn trạng thái định kỳ {#poll-status}

`GET /pay/check-status/{trade_id}`

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "status": 1
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<!-- #region order-states -->

| Trạng thái | Ý nghĩa |
| --- | --- |
| 1 | Chờ thanh toán |
| 2 | Đã thanh toán |
| 3 | Đã hết hạn |
| 4 | Đang chờ lựa chọn mạng, tài sản hoặc nhà cung cấp. |
| 5 | Một giao dịch phù hợp đã được ghi nhận và đang được xác nhận. |
| 6 | Hai vòng kiểm tra nghiêm ngặt đều không thành công. Cần phải xem xét thủ công. |

<!-- #endregion order-states -->

Ở trạng thái 5, tiếp tục truy vấn và hiển thị “Đang xác nhận” để người mua biết hệ thống đã ghi nhận giao dịch. Theo mặc định, EPUSDT chờ đủ số khối xác nhận và kiểm tra giao dịch qua hai nút độc lập trước khi ghi nhận thanh toán. Thời gian chờ đủ số khối không tính là một lần thử. Các lần xác minh và nhóm ID nút đầu tiên được lưu qua các lần khởi động lại. Ở trạng thái 6, hệ thống tạm dừng xác minh tự động và callback thành công. Quản trị viên có thể xem `review_transaction_hash`, điều tra rồi kiểm tra lại giao dịch.

Nếu người mua cung cấp mã băm giao dịch, hãy gửi `block_transaction_id` đến `POST /pay/submit-tx-hash/{trade_id}`. Máy chủ sẽ xác minh giao dịch chuyển tiền. Đường dẫn trả người dùng về từ trình duyệt, `GET /pay/return/{trade_id}`, trả về chuyển hướng HTTP 302.

## Hash giao dịch thủ công {#submit-cashier-transaction-hash}

`POST /pay/submit-tx-hash/{trade_id}`

Điểm cuối này cho phép nhân viên thu ngân được lưu trữ cho phép gửi một hash giao dịch trên chuỗi để kiểm tra thủ công. Nó được thiết kế để giới hạn hơn so với hành động "gửi-đã thanh toán" dành cho quản trị viên.

- Lệnh này phải là một lệnh được thực hiện trên chuỗi (on-chain).
- Đơn hàng vẫn cần phải có trạng thái `status=1`, đang chờ thanh toán.
- Các đơn hàng hết hạn bị từ chối trước khi xác minh chuỗi.
- Các đơn hàng từ OkPay/nhà cung cấp không được hỗ trợ.

### Yêu cầu hash giao dịch {#submit-transaction-hash-request}

```json
{
  "block_transaction_id": "0xabc123..."
}
```

### Phản hồi Thành công về Hash Giao dịch {#submit-transaction-hash-success-response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "block_transaction_id": "0xabc123...",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

TON chấp nhận các tham chiếu chuẩn như `ton:<receive_raw>:<lt>:<hash>`, `lt:hash`, hoặc một tham chiếu duy nhất chỉ chứa hash cho địa chỉ nhận đơn hàng. Aptos chấp nhận một hash giao dịch.

## Chuyển đổi mạng thanh toán hoặc nhà cung cấp dịch vụ. {#switch-payment-network-or-provider}

`POST /pay/switch-network` nhận các thông số: `trade_id` cha, `token` đích và `network`. Để thanh toán được lưu trữ, chọn `okpay` hoặc `xlayer` với một token được phép bởi nhà cung cấp đó.

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "solana"
}
```

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "okpay"
}
```

- Chỉ các đơn hàng của phụ huynh đang chờ xử lý (trạng thái 1 hoặc 4) mới có thể được chuyển đổi. Một đơn hàng con không thể được chuyển đổi lại.
- Việc chọn đầu tiên trên trường placeholder hoàn thành đơn hàng gốc và chuyển nó sang trạng thái 1. Thanh toán trên chuỗi hiện nay sẽ phân bổ một địa chỉ và số tiền. Thanh toán được lưu trữ sẽ trả về URL thanh toán của nhà cung cấp. Đối với OKPay, trường nhập địa chỉ nhận sẽ chứa `OKPAY`.
- Ban đầu, đơn giữ chỗ vừa được hoàn thiện vẫn có `is_selected=false`. Nếu chọn lại cùng đích thanh toán, hệ thống trả về đơn hiện có và đánh dấu đơn đã được chọn. Khi chuyển sang đích khác, mỗi đơn cha chỉ có thể có tối đa một đơn con.
- Phản hồi này có cấu trúc giống với chi tiết thanh toán. Các đơn hàng trên chuỗi có địa chỉ `payment_url` trống.

## Thanh toán tương thích với EPay {#epay-compatible-checkout}

Gửi một truy vấn GET hoặc một biểu mẫu POST đến `/payments/epay/v1/order/create-transaction/submit.php`. Thành công sẽ trả về HTTP 302 đến:

```text
/pay/checkout-counter/{trade_id}
```

<!-- #region epay-fields -->

| Trường | Địa điểm | Kiểu | Bắt buộc | Mô tả |
| --- | --- | --- | --- | --- |
| `pid` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Có | ID của người bán hàng. Sử dụng PID số cho các phản hồi. |
| `money` | Chuỗi truy vấn hoặc biểu mẫu | Số | Có | Số tiền (được chỉ định). |
| `out_trade_no` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Có | Mã đơn hàng của người bán. |
| `notify_url` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Có | URL nhận callback của người bán. |
| `return_url` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Không | Trang web được trả về bởi trình duyệt. |
| `name` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Không | Tên sản phẩm hoặc đơn hàng. |
| `type` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Không | Trống, `alipay`, hoặc một trình chọn `token.network` được kích hoạt. |
| `token` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Không | Yêu cầu token khi không có trình chọn nào khớp. |
| `network` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Không | Yêu cầu kết nối khi không tìm thấy trình chọn nào. |
| `currency` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Không | Làm thế để thay đổi cài đặt tiền tệ mặc định của EPay. |
| `sign` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Có | Chữ ký MD5 của EPay. |
| `sign_type` | Chuỗi truy vấn hoặc biểu mẫu | Chuỗi | Không | Thông thường, `MD5`. |

<!-- #endregion epay-fields -->

Tính toán MD5 bao gồm tất cả các tham số đầu vào không rỗng (bao gồm các trường plugin như `sitename`), ngoại trừ `sign` và `sign_type`. Ví dụ về đầu vào chuẩn bao gồm bí mật minh họa, tiếp theo là chữ ký của nó.

```text
money=100&name=VIP&notify_url=https://merchant.example/notify&out_trade_no=ORD202605230001&pid=1000&return_url=https://merchant.example/return&type=alipayepusdt_secret_key
```

```text
sign=b865b0acbb2b01554c35a1bd33351452
```

**Lựa chọn tài sản.** Việc hỗ trợ trình chọn `token.network` trong type sẽ ghi đè trên các trường token và mạng cụ thể, cũng như các cài đặt mặc định của chúng. Nếu type không xác định và không trống, nó sẽ trả về `10009` (ví dụ: `usdt-tron`). Nếu `type` hoặc `alipay` trống, bất kỳ trường nào bị thiếu sẽ chuyển sang cài đặt mặc định EPay tương ứng. Nếu cả hai đều trống, máy chủ sẽ tạo một giá trị thay thế. Nếu chỉ một trong hai bị thiếu sau khi áp dụng các cài đặt mặc định, yêu cầu sẽ bị từ chối. Tiền tệ sử dụng giá trị trong yêu cầu, sau đó là cài đặt mặc định đã cấu hình, rồi `cny`.

Các cài đặt mới tạo `cny` và để lại token và mạng mặc định là trống. Các cài đặt hiện tại được bảo toàn khi nâng cấp. Máy chủ thiết lập `payment_type=Epay` sau khi xác minh chữ ký. Ghi lại bất kỳ `type`, `token`, `network` và `currency` mà bạn thực sự gửi.

<a id="callbacks"></a>

## Callback gửi đến người bán {#merchant-callbacks}

Sau khi thanh toán thành công, EPUSDT gửi thông báo tới `notify_url` của đơn hàng. Xác minh chữ ký, đối chiếu đơn hàng và số tiền, và bảo đảm việc nhận lại thông báo không khiến đơn được xử lý hai lần. Phản hồi bằng HTTP 200 với nội dung `ok` hoặc `success` (không phân biệt chữ hoa và chữ thường). Nếu gửi thất bại, hệ thống thử lại theo `order_notice_max_retry` và `callback_retry_base_seconds`. Khoảng chờ tăng theo cấp số nhân, tối đa năm phút.

### GMPay {#gmpay}

GMPay gửi dữ liệu JSON qua phương thức POST. Tìm kiếm khóa của người bán địa phương bằng `pid` và xác minh HMAC bằng cách sử dụng cùng phương thức chuẩn hóa như khi tạo đơn hàng. Phần thân bỏ qua thông tin `payment_type`.

```json
{
  "pid": "1000",
  "trade_id": "20260523171652123456001",
  "order_id": "ORD202605230001",
  "amount": 100,
  "actual_amount": 14.29,
  "receive_address": "TTestTronAddress001",
  "token": "USDT",
  "block_transaction_id": "0xabc123...",
  "signature": "498975a97bc34563bdb14df53fc18054645df9684d6c67d9b9dd90ec62be1018",
  "status": 2
}
```

| Trường | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `pid` | Chuỗi | Mã khóa ký của thương nhân. |
| `trade_id` | Chuỗi | ID giao dịch EPUSDT. |
| `order_id` | Chuỗi | Mã đơn hàng của người bán. |
| `amount` | Số | Số tiền (được chỉ định). |
| `actual_amount` | Số | Số tiền mã hóa đã nhận. |
| `receive_address` | Chuỗi | Địa chỉ nhận hàng. |
| `token` | Chuỗi | Tài sản đã nhận. |
| `block_transaction_id` | Chuỗi | Tham chiếu giao dịch hoặc tham chiếu hash trên chuỗi. |
| `signature` | Chuỗi | Tính toán HMAC-SHA256 (chữ ký). |
| `status` | Số nguyên | Đã thanh toán (2). |

### EPay {#epay}

EPay gửi một yêu cầu GET với một số `type`. Sử dụng số `pid` của nhà bán hàng cho các đơn hàng EPay và GMPay, chọn `payment_type=Epay`.  Khi nhận phản hồi, sử dụng loại đơn hàng đã lưu hoặc chuyển sang `alipay`. Kiểm tra chữ ký MD5 như đối với đơn hàng EPay đến.

```text
pid=1000
trade_no=20260523171652123456001
out_trade_no=ORD202605230001
type=alipay
name=VIP
money=100.0000
trade_status=TRADE_SUCCESS
sign=cc44fab3f264615d859f8a1fd36d2f08
sign_type=MD5
```

## Thông báo trả lời từ nhà cung cấp OKPay {#okpay-provider-callback}

Cấu hình `POST /payments/okpay/v1/notify` trong OKPay. Nó chấp nhận định dạng JSON, biểu mẫu URL-encoded, biểu mẫu đa phần, hoặc cơ thể chuỗi truy vấn thô. EPUSDT xác minh chữ ký của nhà cung cấp với mã token của cửa hàng, thanh toán đơn hàng tương ứng và kích hoạt phản hồi của người bán. Điều này áp dụng cho đơn hàng mẫu hoàn thành hoặc đơn hàng con được quản lý.

Phản hồi thành công.

```text
success
```

Thất bại (HTTP 400):

```text
fail
```

## Mã lỗi ứng dụng {#application-error-codes}

| Mã | HTTP | Ý nghĩa |
| --- | --- | --- |
| `200` | 200 | Thành công |
| `400` | 400 | Lỗi hệ thống hoặc lỗi xác thực |
| `401` | 401 | Chữ ký không hợp lệ |
| `10001` | 400 | Địa chỉ ví đã tồn tại. |
| `10002` | 400 | Đơn hàng đã tồn tại |
| `10003` | 400 | Không có địa chỉ nhận được. |
| `10004` | 400 | Số tiền dưới mức chính xác thanh toán |
| `10005` | 400 | Không có kết hợp địa chỉ/số nào khả dụng. |
| `10006` | 400 | Tính toán tỷ giá hối đoái không thành công. |
| `10007` | 400 | Đã xử lý rồi |
| `10008` | 400 | Không tìm thấy đơn hàng |
| `10009` | 400 | Tham số không hợp lệ |
| `10010` | 400 | Trạng thái đơn hàng đã thay đổi |
| `10011` | 400 | Giới hạn đơn hàng của trẻ em đã đạt đến. |
| `10012` | 400 | Không thể chuyển sang mạng khác cho đơn hàng con. |
| `10013` | 400 | Đơn hàng không ở trạng thái chờ |
| `10014` | 400 | Mạng không hoạt động |
| `10016` | 400 | Tài sản không được tìm thấy. |
| `10017` | 400 | Nhà cung cấp thanh toán đã bị vô hiệu hóa. |
| `10018` | 400 | Cấu hình nhà cung cấp thanh toán chưa hoàn thành. |
| `10019` | 400 | Token hoặc mạng không được hỗ trợ. |
| `10038` | 400 | Xác minh hash giao dịch không thành công. |
| `10039` | 400 | Việc kiểm tra thủ công đòi hỏi một đơn hàng trên chuỗi. |
| `10041` | 400 | URL thông báo không hợp lệ |
| `10042` | 400 | Tạo đơn hàng từ nhà cung cấp không thành công. |
| `10044` | 400 | URL chuyển hướng không hợp lệ |
| `10045` | 400 | Khóa của người giao dịch không khả dụng. |
| `10046` | 400 | Không thể ký các thông số trả lại của EPay. |

[Danh sách đầy đủ các mã lỗi ứng dụng](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/util/constant/errno.go)

Để biết về danh sách phương thức thanh toán EPay và thứ tự ưu tiên, vui lòng tham khảo [hướng dẫn tích hợp EPay](/vi/guide/integration/epay).
