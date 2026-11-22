---
description: "Tích hợp thông tin tài khoản người bán GMPay Edge, chữ ký yêu cầu HMAC và thông báo về đơn hàng, hoặc sử dụng bộ chuyển đổi tương thích EPay của nó."
titleTemplate: ":title | GMPay Edge"
---

# API cho người bán {#merchant-api}

GMPay là giao thức thương mại chính. EPay là một trình điều chỉnh tương thích, hoạt động trên cùng một thông tin đăng nhập, dịch vụ đơn hàng, các quy tắc về tính nhất quán, trạng thái, quá trình thanh toán, hành vi truy vấn và luồng phản hồi.

Đối với các lĩnh vực và giá trị trạng thái có tính chất chính xác, hãy sử dụng trang `/docs` của phiên bản đang triển khai hoặc hợp đồng OpenAPI được theo dõi trong kho lưu trữ: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml).

## Chữ ký GMPay {#gmpay-signatures}

Yêu cầu GMPay phải chứa `pid` dạng số và `signature` HMAC-SHA256 viết thường.

Để đồng ý với yêu cầu này:

1. Loại bỏ `signature` và các giá trị trống.
2. Sắp xếp các trường theo thứ tự ký tự ASCII.
3. Nối các cặp `key=value` bằng `&`.
4. Sử dụng chứng nhận "Secret" làm khóa HMAC.
5. Tính toán HMAC-SHA256 ở dạng chữ thường.

## Tạo ra trật tự {#create-order}

<span class="api-route"><b>POST</b> <code>/payments/gmpay/v1/order/create-transaction</code></span>

Việc sử dụng lại một `order_id` hiện có không tạo ra một đơn hàng thứ hai. Bỏ cả `token` và `network` sẽ tạo ra một đơn hàng có thể chọn; GMPay Edge không tự động mặc định thành TRON.

## Yêu cầu về đơn hàng {#query-order}

<span class="api-route"><b>GET</b> <code>/payments/gmpay/v1/order/query</code></span>

Chỉ cung cấp một trong hai trường `trade_id` hoặc `order_id`, rồi ký yêu cầu bằng chính thông tin xác thực đã tạo đơn hàng. Mỗi thông tin xác thực chỉ có thể truy vấn các đơn hàng do nó tạo.

## Nhận lại liên hệ {#receive-callbacks}

Người bán hàng cung cấp `notify_url` khi tạo đơn hàng. Các đích callback phải kiểm tra phiên bản SSRF và chính sách bảo mật.

Các sự kiện được giao đã có dấu vân tay (signatures) nhất định, lưu giữ các nỗ lực, giới hạn số lần thử lại, và một con đường thử lại thủ công được kiểm tra. Các trình xử lý (handlers) nên xác minh dấu vân tay, xử lý các sự kiện trùng lặp một cách nhất quán (idempotent), và chỉ xác nhận sau khi ghi lại trạng thái cục bộ.

Đối với các phản hồi từ GMPay, hãy trả về văn bản đơn giản "`ok`" với mã HTTP 200 sau khi xử lý thành công.

## Khả năng tương thích với EPay {#epay-compatibility}

Tính tương thích của EPay sử dụng cùng thông tin đăng nhập và quy trình xử lý đơn hàng, nhưng vẫn duy trì cơ chế kiểm tra MD5 của EPay cũ cho các yêu cầu đến và phản hồi tương thích.
