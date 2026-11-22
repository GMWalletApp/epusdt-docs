---
description: "Kết nối các cửa hàng GMShop Edge thông qua API nhà cung cấp gốc để thực hiện yêu cầu về danh mục, đơn hàng và kênh thanh toán đã được ký."
titleTemplate: ":title | GMShop Edge"
---

# API nhà cung cấp {#native-supplier-api}

GMShop Edge có thể hoạt động như một nhà cung cấp hàng kỹ thuật số ở phía trước (upstream) cho một instance GMShop Edge khác. Giao thức gốc này cung cấp các hoạt động liên quan đến danh mục sản phẩm, đơn hàng, kênh thanh toán và nạp ví, thông qua đường dẫn `/api/v1/supplier/*`. Đây là một giao thức cung cấp cho cửa hàng, chứ không phải API thanh toán.

## Kích hoạt và cấp phát thông tin đăng nhập {#enable-and-issue-credentials}

Kích hoạt API của nhà cung cấp trong cài đặt quản trị, sau đó tạo khóa API cho tài khoản của khách hàng sẽ mua hàng từ cửa hàng này. Khóa bí mật chỉ được hiển thị khi tạo và được lưu trữ một cách mã hóa. Các khóa có thể bị thu hồi, và có thể thêm một nguồn (Origin) được phép tùy chọn để giới hạn nơi các phản hồi về việc giao hàng được gửi.

Phiên bản GMShop Edge đang sử dụng, với cách tiếp cận toàn diện, chọn bộ điều phối nhà cung cấp `gmshop_edge` và lưu trữ ID khóa và bí mật đã phát hành trong cấu hình thời gian thực được mã hóa của nó.

## Yêu cầu ký {#request-signing}

Tất cả các yêu cầu phải sử dụng HTTPS mà không cần chỉ định cổng cụ thể và gửi:

- `GMShop-Edge-Api-Key`: khóa ID được phát hành.
- `GMShop-Edge-Timestamp`: dấu thời gian Unix gồm 10 chữ số, tính bằng giây.
- `GMShop-Edge-Nonce`: giá trị chữ số/dấu, duy nhất, từ 16 đến 100 ký tự.
- `GMShop-Edge-Signature`: chuỗi băm HMAC-SHA256 ở dạng hex viết thường.

Tạo payload ký kết bằng cách kết hợp các giá trị này với ký tự xuống dòng:

```text
UPPERCASE_HTTP_METHOD
PATH_WITH_RAW_QUERY
UNIX_TIMESTAMP
NONCE
SHA256_HEX_OF_RAW_BODY
```

Tính toán HMAC-SHA256 trên payload đó bằng API secret đã phát hành. Máy chủ chấp nhận độ lệch thời gian tối đa là 60 giây và lưu trữ mỗi nonce như một biên nhận (replay receipt). Sử dụng lại một nonce sẽ trả về lỗi. Hiện tại, giới hạn tốc độ là 120 yêu cầu trên mỗi khóa mỗi phút và 300 yêu cầu trên mỗi người dùng mỗi phút.

## Các điểm cuối API {#endpoints}

- `POST /api/v1/supplier/ping`
- `GET /api/v1/supplier/categories`
- `GET /api/v1/supplier/products`
- `GET /api/v1/supplier/products/{productId}`
- `POST /api/v1/supplier/orders`
- `GET /api/v1/supplier/orders/{orderId}`
- `POST /api/v1/supplier/orders/{orderId}/cancel`
- `GET /api/v1/supplier/payment-channels`
- `POST /api/v1/supplier/topups`
- `GET /api/v1/supplier/topups/{id}`

Việc tạo đơn hàng và các thao tác nạp tiền là vô trùng (idempotent). Khi thử lại một yêu cầu không chắc chắn, hãy duy trì tính vô trùng tương tự; đừng tạo một đơn hàng mới chỉ vì khách hàng hết thời gian.

## Tài liệu API {#api-reference}

Một bản sao được triển khai chuyển hướng `/openapi` đến tài liệu API tương tác của nó.  Kho lưu trữ cũng công bố toàn bộ [OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml), bao gồm xác thực, thực hiện đơn hàng, phản hồi từ nhà cung cấp, quản trị, hỗ trợ web và giao thức nhà cung cấp gốc.
