---
description: "Đọc bản ghi nhớ về việc phát hành EPUSDT và kiểm tra các thay đổi liên quan đến cơ sở dữ liệu, API triển khai và API thanh toán trước khi nâng cấp một gateway được quản lý độc lập."
---

# Ghi chú phát hành {#release-notes}

## v2.1.1 {#v2-1-1}

2026-11-21 · [Ghi chú phát hành](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.1)

Hiện tại, EPUSDT chỉ sử dụng SQLite hoàn toàn. Người dùng SQLite hiện tại có thể giữ lại cấu hình và cơ sở dữ liệu của họ. Đối với MySQL hoặc PostgreSQL, hãy sao lưu, di chuyển và kiểm tra dữ liệu trước khi nâng cấp.

## v2.1.0 {#v2-1-0}

2026-11-21 · [Ghi chú phát hành](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

- ChainScanner tích hợp tiếp tục từ tiến trình đã lưu và thử lại các khối bị thiếu. Kiểm tra nghiêm ngặt bổ sung các trạng thái xác minh và đánh giá thủ công.
- Bảy mạng thanh toán trực tiếp mới, nâng tổng số lên 16. Quá trình thanh toán cũng hỗ trợ OKX OnchainOS trên X Layer, cùng với tính năng nhắc nhở về phí rút tiền từ sàn giao dịch (nếu có).
- Sửa lỗi xung đột khóa SQLite và giải quyết trường hợp đơn hàng hết hạn, đồng thời giải quyết việc hủy đặt cọc của đơn hàng mới hơn. Người dùng nâng cấp từ phiên bản v2.0.0 cần di chuyển dữ liệu của họ trước khi tạo lại container.

## v2.0.0 {#v2-0-0}

- Thẻ phát hành: `v2.0.0`
- Thời điểm phát hành: `2026-07-23T06:04:47Z`
- Ghi chú phát hành chính thức: `Breaking change for GMPay integrations: GMPay signatures changed from MD5 to HMAC-SHA256`
- Danh sách thay đổi đầy đủ: `https://github.com/GMWalletApp/epusdt/compare/v1.0.10...v2.0.0`

### Thay đổi đối với người dùng {#user-visible-changes}

- **Thay đổi chữ ký GMPay**: Các yêu cầu và phản hồi GMPay hiện sử dụng HMAC-SHA256 với khóa HMAC là `secret_key` của người bán. Các khách hàng GMPay hiện đang sử dụng dựa trên MD5 sẽ nhận được thông báo `401 Unauthorized` cho đến khi được nâng cấp.
- Các yêu cầu và phản hồi tương thích với EPay vẫn hoạt động bình thường và tiếp tục sử dụng MD5 với `sign` / `sign_type`.
- Dữ liệu khởi tạo kế toán được lưu trữ hiện bao gồm `server_time`, cho phép khách hàng tính toán thời gian đếm ngược dựa trên thời gian máy chủ, thay vì dựa vào đồng hồ của trình duyệt cục bộ.
- Đã thêm một ví dụ về tạo đơn hàng GMPay bằng thư viện tiêu chuẩn trong tệp `sdk/python/gmpay_create_order.py`.
- Việc khôi phục thanh toán EVM đã được cải thiện, giúp khôi phục các cửa sổ quét bị gián đoạn trở nên đáng tin cậy hơn.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes}

- Nâng cấp khách hàng GMPay trước khi triển khai phiên bản 2.0.0: loại trừ `signature`, loại trừ giá trị trống, sắp xếp các tham số theo thứ tự ký tự ASCII, nối các tham số thành `key=value&key=value`, sau đó tính toán HMAC-SHA256 nhỏ nhất bằng cách sử dụng `secret_key`.
- Các cài đặt tốc độ hiện tại hỗ trợ `rate.mode=fixed|auto` và `rate.cache_ttl_seconds` trong khoảng từ `10` đến `86400` giây. Chế độ "fixed" sử dụng `rate.forced_rate_list`, trong khi chế độ "auto" sẽ lấy `rate.api_url` và lưu trữ bộ nhớ cache bền vững.
- Cơ chế tự động đánh giá duy trì tỷ lệ giao dịch thành công trước đó khi phản hồi từ nhà cung cấp không đầy đủ, đồng thời tiếp tục hiển thị bộ nhớ cache bền vững cuối cùng khi các lần cập nhật hoặc duy trì không thành công.

### Thay đổi API {#api-changes}

- `POST /payments/gmpay/v1/order/create-transaction` hiện xác minh `signature` của GMPay bằng HMAC-SHA256 thay cho MD5.
- Các thông báo từ đối tác của GMPay phải được xác minh bằng cùng với quy tắc tham số chuẩn HMAC-SHA256.
- Dữ liệu phản hồi của `GET /pay/checkout-counter-resp/{trade_id}` hiện bao gồm `server_time`.
- Các API quản trị thêm `GET /admin/api/v1/settings/rate/status` và `POST /admin/api/v1/settings/rate/refresh` để kiểm tra và cập nhật lại bộ nhớ cache về tốc độ.

### Nguồn tham khảo {#evidence-used}

- Bản phát hành trên GitHub `v2.0.0`
- PR `#104` (hợp nhất từ nhóm phát triển) và PR `#99` (phục hồi và khôi phục EVM)
- Các giao dịch: `44d90b6` (phục hồi khôi phục EVM), `f086d8b` (chuyển về `server_time`), `3dc8ab0` (chế độ tỷ lệ tự động với bộ nhớ cache dự phòng), `58141cd` (chữ ký HMAC-SHA256 GMPay), `2353d85` (ví dụ SDK GMPay Python)
- Tệp: `src/middleware/check_sign.go`, `src/util/sign/sign.go`, `src/model/service/epay_return.go`, `src/model/response/pay_response.go`, `src/config/rate.go`, `src/controller/admin/settings_controller.go`, `src/route/router.go`, `src/task/listen_evm_backfill.go`, `sdk/python/gmpay_create_order.py`


## v1.0.10 {#v1-0-10}

- Thẻ phát hành: `v1.0.10`
- Thời điểm phát hành: `2026-07-10T13:24:42Z`
- Ghi chú phát hành chính thức: `Allow admin to mark expired on-chain orders as paid and seed rates`
- Danh sách thay đổi đầy đủ: `https://github.com/GMWalletApp/epusdt/compare/v1.0.9...v1.0.10`

### Thay đổi đối với người dùng {#user-visible-changes-1}

- Hướng dẫn quản trị viên: giờ có thể sửa chữa các đơn hàng đã hết hạn trên chuỗi sau khi hash giao dịch đã được xác minh. Con đường nộp giao dịch công khai vẫn chỉ chấp nhận các đơn hàng đang chờ và tiếp tục từ chối các đơn hàng hết hạn và đơn hàng từ OkPay/nhà cung cấp.
- Một tỷ giá mặc định bắt buộc đã được cài đặt cho việc chuyển đổi stablecoin CNY: `cny.usdt` và `cny.usdc` đều mặc định là `0.14705882352941177`.
- Nếu `rate.forced_rate_list` trống, nó sẽ được khôi phục về giá trị mặc định của stablecoin CNY (People's Currency) nội bộ sau khi cài đặt tỷ giá được cập nhật hoặc cài đặt bị xóa; bất kỳ JSON tùy chỉnh nào không trống sẽ thuộc sở hữu của người dùng và sẽ không được hợp nhất hoặc ghi đè.
- `rate.api_url` hiện tại là tùy chọn; nếu được cung cấp, nó vẫn phải là một URL công khai HTTP/HTTPS.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-1}

- `epctl upgrade` hiện nay yêu cầu một file `/opt/epusdt/.env` đã tồn tại. Do đó, quá trình nâng cấp không tạo ra một cấu hình mới. Hãy chạy lệnh `install` trước trên một máy tính mới.
- Lệnh `epctl upgrade` thay thế các file phát hành và khởi động lại `epusdt` theo mặc định. Sử dụng `--no-restart` để tải các file mà không khởi động lại, hoặc `--prompt-restart` để hỏi trong terminal tương tác.
- Cập nhật triển khai giữ lại các bản sao hoàn nguyên cho bản nhị phân hiện tại, `.env.example`, và đơn vị systemd. Nếu việc triển khai hoặc khởi động lại tệp bị lỗi, `epctl` sẽ cố gắng khôi phục các tệp từ bản phát hành trước.

### Thay đổi API {#api-changes-1}

- Quản trị viên (Admin) xác nhận và chấp nhận các đơn hàng (đang chờ và hết hạn) sau khi xác minh giao dịch trên chuỗi.
- `POST /pay/submit-tx-hash/{trade_id}` chỉ chấp nhận đơn hàng on-chain đang chờ thanh toán. Đơn đã hết hạn bị từ chối trước bước xác minh.
- Tài liệu về cài đặt tốc độ hiện tại coi `rate.api_url` là tùy chọn và ghi rõ hành vi khôi phục mặc định cho `rate.forced_rate_list`.

### Nguồn tham khảo {#evidence-used-1}

- Bản phát hành trên GitHub `v1.0.10`
- PR `#97` (hợp nhất phát triển)
- Các giao dịch: `392240e` (đánh dấu quản trị viên – thanh toán cho đơn hàng đã hết hạn trên chuỗi), `d18965d` (tỷ lệ mặc định cho stablecoin CNY), `6589ad1` (kiểm soát khởi động và khôi phục nâng cấp), `8f03599` / `5668a2a` (đồng bộ xây dựng giao diện).
- Tệp: `src/controller/admin/order_controller.go`, `src/controller/comm/pay_controller.go`, `src/model/service/order_service.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/model/dao/mdb_table_init.go`, `src/controller/admin/settings_controller.go`, `epctl`, `wiki/EPCTL.md`, `wiki/EPCTL.en.md`


## v1.0.9 {#v1-0-9}

- Thẻ phát hành: `v1.0.9`
- Thời điểm phát hành: `2026-06-29T10:11:08Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.8...v1.0.9`

### Thay đổi đối với người dùng {#user-visible-changes-2}

- **Các trình chọn EPay**: EPay submit.php hiện nay chấp nhận `type=alipay` hoặc trình chọn `type=token.network` được hỗ trợ như `usdt.tron`. Các trình chọn hợp lệ chọn trực tiếp token/mạng thanh toán.
- Các callback trả về và thông báo của EPay hiện giữ nguyên `type` đã lưu từ yêu cầu, thay vì luôn trả về `alipay`.
- Quy trình cài đặt có thể trả lại mật khẩu quản trị ban đầu trong lần thiết lập đầu tiên, trong khi API quản trị hiện tại chỉ giữ lại điểm cuối (endpoint) để tạo cảnh báo cho giao diện người dùng.
- Thêm trình cài đặt/quản lý tệp tin Linux `epctl` cùng với `epctl-docker-test.sh` để kiểm tra toàn diện dựa trên Docker.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-2}

- `epctl` cài đặt các file thực thi đã phát hành trong `/opt/epusdt`, tạo file `epusdt.service`, giữ nguyên file `/opt/epusdt/.env` trong quá trình cài đặt/nâng cấp, và có thể cài đặt toàn cục tại `/usr/local/bin/epctl`.
- Các giá trị `epay.default_token` và `epay.default_network` bị bỏ qua khi một trình chọn hợp lệ `type=token.network` được cung cấp; giá trị `epay.default_currency` vẫn cung cấp phương thức dự phòng tiền tệ.
- Không cần thêm các biến môi trường mới.

### Thay đổi API {#api-changes-2}

- `GET` / `POST /payments/epay/v1/order/create-transaction/submit.php` hiện đang giới hạn các giá trị `type` không rỗng chỉ cho `alipay` hoặc một trong các `token.network` được hỗ trợ hiện tại.
- Dữ liệu trả về từ `GET /pay/return/{trade_id}` và thông báo bất đồng bộ EPay dùng lại `type` đã lưu. Nếu thiếu `type`, giá trị mặc định là `alipay`.
- `GET /admin/api/v1/auth/init-password-hash` vẫn là điểm cuối (endpoint) để hiển thị trạng thái mật khẩu ban đầu; đường dẫn quản trị cũ sử dụng mật khẩu thuần văn bản (`init-password`) không được đăng ký trong bản phát hành này.

### Nguồn tham khảo {#evidence-used-2}

- Bản phát hành trên GitHub `v1.0.9`
- PR `#92` (hợp nhất phát triển)
- Các commit: `2dc538c` (chọn trình chọn EPay), `73aef80` (hạn chế loại gửi), `15de0e6` (giữ mật khẩu khởi tạo có sẵn), `7d09adf` (trả về mật khẩu quản trị ban đầu), `1cdb1ed` (cài đặt và tài liệu của epctl)
- Tệp: `src/route/router.go`, `src/controller/comm/order_controller.go`, `src/model/service/epay_return.go`, `src/install/installer.go`, `epctl`, `epctl-docker-test.sh`, `wiki/EPCTL.md`


## v1.0.8 {#v1-0-8}

- Thẻ phát hành: `v1.0.8`
- Thời điểm phát hành: `2026-06-20T06:31:53Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.7...v1.0.8`

### Thay đổi đối với người dùng {#user-visible-changes-3}

- Hiện tại, blockchain Aptos được hỗ trợ cho thanh toán bằng USDT và USDC – hệ thống bao gồm cấu hình hỗ trợ token, định tuyến RPC và quét giao dịch trên chuỗi để tài sản dựa trên Aptos Move.
- Hỗ trợ token Aptos và định tuyến RPC hiện được điều khiển từ chuỗi và cài đặt “chain_token” được cấu hình bởi quản trị viên, loại bỏ các địa chỉ hợp đồng được mã hóa cứng trong trình quét.
- Xác minh thanh toán thủ công hiện nay hỗ trợ xác minh giao dịch Aptos.
- Tài liệu hướng dẫn đã được cập nhật để liệt kê Aptos cùng với các chuỗi được hỗ trợ khác.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-3}

- Chuỗi Aptos yêu cầu một điểm cuối RPC (RPC endpoint) được cấu hình trong bảng điều khiển quản trị – trình quét sẽ theo dõi các phiên bản sổ cái Aptos và quét các sự kiện liên quan đến mô-đun Move cho việc chuyển token.
- Không cần thêm các biến môi trường mới; cấu hình chuỗi Aptos và token tuân theo luồng thiết lập hiện có của chuỗi/token quản trị.

### Thay đổi API {#api-changes-3}

- Aptos hiện có sẵn như một lựa chọn trong danh sách tài sản được hỗ trợ và các điểm cuối để tạo đơn hàng.
- Các điểm cuối quản lý chuỗi quản trị và token hiện nay hỗ trợ các trường cấu hình đặc biệt dành cho Aptos.

### Nguồn tham khảo {#evidence-used-3}

- Bản phát hành trên GitHub `v1.0.8`
- PR `#91` (hợp nhất phát triển)
- Các commit: `de96a5d` (hỗ trợ Aptos), `8216c91` (hỗ trợ token dựa trên cấu hình)
- Tệp: `README.md`, `README.en.md`, `src/controller/admin/chain_token_controller.go`, `src/model/service/aptos_task.go`, `src/task/listen_aptos_scanner.go`, `src/util/address/move.go`


## v1.0.7 {#v1-0-7}

- Thẻ phát hành: `v1.0.7`
- Thời điểm phát hành: `2026-06-16T11:37:43Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.6...v1.0.7`

### Thay đổi đối với người dùng {#user-visible-changes-4}

- Các điểm cuối (endpoints) tạo đơn hàng của GMPay và EPay hiện hỗ trợ đơn hàng mẫu – đơn hàng có thể được tạo mà không cần địa chỉ thanh toán trên chuỗi ngay lập tức, cho phép tích hợp các hệ thống cần ID đơn hàng trước khi phương thức thanh toán thực tế được chọn.
- Các đơn hàng dự phòng được chuyển thành đơn đặt hàng đầy đủ trên chuỗi khi khách hàng chọn mạng lưới thanh toán trong quy trình thanh toán.
- Quy trình đặt hàng hiện nay hỗ trợ hoãn chọn phương thức thanh toán, cho phép người bán tạo đơn hàng trước và để khách hàng chọn phương thức thanh toán sau.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-4}

- Không cần thêm các biến môi trường mới.
- Hỗ trợ đặt hàng tạm (placeholder) được kích hoạt mặc định cho các luồng GMPay và EPay.

### Thay đổi API {#api-changes-4}

- Các điểm cuối (endpoints) tạo đơn hàng EPay và `POST /payments/gmpay/v1/order/create-transaction` hiện nay chấp nhận tạo đơn hàng mà không yêu cầu các tham số `network` hoặc `token` trước – việc bỏ qua các tham số này sẽ tạo ra một đơn hàng mẫu.
- Các đơn hàng tạm (placeholder) hiển thị `trade_id` và URL của thu ngân, nhưng không bao gồm địa chỉ ví cho đến khi khách hàng chọn mạng lưới.
- `POST /pay/switch-network` chuyển đổi một đơn hàng mẫu thành một đơn hàng đầy đủ trên chuỗi, bằng cách chỉ định mạng lưới đã chọn và tạo một địa chỉ thanh toán.

### Nguồn tham khảo {#evidence-used-4}

- Bản phát hành trên GitHub `v1.0.7`
- PR `#89` (hợp nhất phát triển)
- Commit: `3ab3659` (hỗ trợ đơn hàng mẫu)
- Tệp: `src/model/service/order_service.go`, `src/controller/comm/order_controller.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data.go`, `wiki/API.md`


## v1.0.6 {#v1-0-6}

- Thẻ phát hành: `v1.0.6`
- Thời điểm phát hành: `2026-06-11T16:51:24Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.5...v1.0.6`

### Thay đổi đối với người dùng {#user-visible-changes-5}

- Hệ thống hiện nay hỗ trợ giao dịch trên blockchain TON và thanh toán bằng USDT Jetton, bao gồm quét giao dịch dựa trên liteclient, chuẩn hóa địa chỉ TON (dạng thô/dễ sử dụng/có thể phản hồi), và xác thực hợp đồng Jetton.
- Việc xác minh thanh toán thủ công hiện nay bao gồm xác minh giao dịch TON với xác minh bằng chứng trên chuỗi.
- Mức độ ghi log hiện có thể được điều chỉnh trong bảng điều khiển quản trị mà không cần khởi động lại máy chủ – thay đổi mức độ ghi log sẽ có hiệu lực ngay lập tức trên tất cả các trình ghi log đang hoạt động.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-5}

- TON liteclient cần một cấu hình liteserver công khai (mainnet hoặc testnet); trình quét sẽ bắt kịp từ khối masterchain mới nhất và theo dõi các chuỗi shard cho các giao dịch Jetton.
- Không cần thêm các biến môi trường mới; cấu hình chuỗi TON và token tuân theo quy trình thiết lập nút RPC và token chuỗi hiện có.

### Thay đổi API {#api-changes-5}

- TON hiện có sẵn như một tùy chọn trong danh sách tài sản được hỗ trợ và các điểm cuối để tạo đơn hàng.
- API cấu hình quản trị hiện bao gồm `log_level` để điều chỉnh nhật ký trong quá trình chạy (giá trị hợp lệ: `debug`, `info`, `warn`, `error`).

### Nguồn tham khảo {#evidence-used-5}

- Bản phát hành trên GitHub `v1.0.6`
- PR `#87` (hợp nhất phát triển)
- Commit: `9b397bd` (hỗ trợ TON), `9ac9894` (mức độ ghi log chạy)
- Tệp: `src/task/listen_ton.go`, `src/util/address/ton.go`, `src/model/service/ton_task.go`, `src/util/log/log.go`, `src/controller/admin/settings_controller.go`


## v1.0.5 {#v1-0-5}

- Thẻ phát hành: `v1.0.5`
- Thời điểm phát hành: `2026-06-09T16:25:25Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.4...v1.0.5`

### Thay đổi đối với người dùng {#user-visible-changes-6}

- Bảng điều khiển quản trị hiện nay hiển thị thống kê thời gian thực về các nút RPC thông qua một điểm cuối Server-Sent Events (SSE), cho phép giao diện trước (frontend) hiển thị số lượng cuộc gọi RPC, tỷ lệ thành công và thống kê lỗi mà không cần phải truy vấn (polling).
- Báo cáo thống kê công việc Solana RPC hiện nay theo dõi số lượng lệnh trên mỗi node và trên mỗi hoạt động (quét chữ ký, lấy giao dịch, lấy xác nhận) cũng như các sự kiện lỗi.
- Các tác vụ quét khối và WebSocket EVM hiện báo cáo các chỉ số về cuộc gọi RPC đến bộ theo dõi thống kê trong bộ nhớ.
- Tệp README đã được cập nhật với thông tin kiểm tra bảo mật và ảnh chụp màn hình mới.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-6}

- Không cần thêm các biến môi trường mới.
- Điểm cuối SSE có sẵn tại `/api/admin/v1/rpc/stats/stream` và yêu cầu xác thực JWT của người quản trị.

### Thay đổi API {#api-changes-6}

- `GET /api/admin/v1/rpc/stats/stream` (SSE) trả về một luồng JSON với thống kê về thời gian chạy các nút RPC; mỗi sự kiện bao gồm ID nút, số lượng cuộc gọi, số lượng thành công, số lượng lỗi và dấu thời gian lần cuối.

### Nguồn tham khảo {#evidence-used-6}

- Bản phát hành trên GitHub `v1.0.5`
- PR `#86` (hợp nhất phát triển)
- Các thay đổi: `08d409d` (thống kê RPC SSE), `54b83f8` (cập nhật README), `3879853` (tệp tài sản)
- Tệp: `src/controller/admin/dashboard_controller.go`, `src/model/data/rpc_runtime_stats.go`, `src/task/listen_sol_job.go`, `src/task/listen_evm_ws.go`, `README.md`


## v1.0.4 {#v1-0-4}

- Thẻ phát hành: `v1.0.4`
- Thời điểm phát hành: `2026-06-03T13:01:37Z`
- Ghi chú phát hành chính thức: `feat(www): enable RPC node create and edit actions — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.3...v1.0.4`

### Thay đổi đối với người dùng {#user-visible-changes-7}

- Giao diện quản trị web hiện nay cho phép tạo và chỉnh sửa các nút RPC trực tiếp trong trình duyệt – trước đây, các thao tác này bị vô hiệu hóa hoặc không hoàn thành trong giao diện trước.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-7}

- Không cần thêm các biến môi trường mới hoặc thay đổi ở phía sau; đây là một bản cập nhật chỉ dành cho giao diện người dùng.

### Thay đổi API {#api-changes-7}

- Không có các tuyến API nào được thêm hoặc xóa; hiện tại, giao diện trước (frontend) đang gọi chính xác các điểm cuối (endpoints) quản lý nút RPC hiện có.

### Nguồn tham khảo {#evidence-used-7}

- Bản phát hành trên GitHub `v1.0.4`
- PR `#85`: Tính năng (www): cho phép tạo và chỉnh sửa hành động trên nút RPC
- Commit: `3e85bf7` (cập nhật tài sản)
- Tệp tin: `src/www/assets/*` (cập nhật tập hợp giao diện trước)


## v1.0.3 {#v1-0-3}

- Thẻ phát hành: `v1.0.3`
- Thời điểm phát hành: `2026-05-27T11:42:43Z`
- Ghi chú phát hành chính thức: `docs: update payment API integration guide — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.2...v1.0.3`

### Thay đổi đối với người dùng {#user-visible-changes-8}

- Các ID giao dịch hiện được tạo bằng cách sử dụng các byte ngẫu nhiên an toàn về mặt mật mã và mã hóa bằng base64 an toàn cho URL, thay thế cho định dạng dựa trên dấu thời gian trước đây – điều này giúp giảm nguy cơ xung đột và cải thiện tính ẩn danh.
- Các nút RPC hiện nay hỗ trợ trường `purpose` (có các giá trị: `general`, `manual_verify`, hoặc `both`), cho phép người quản trị chỉ định các nút để thực hiện xác minh thanh toán thủ công mà không ảnh hưởng đến lưu lượng truy cập của quét/WSS/kiểm tra sức khỏe.
- Việc xác minh thanh toán thủ công hiện nay ưu tiên các nút `manual_verify`, và nếu không có nút chuyên dụng, sẽ chuyển sang sử dụng các nút `general`, đồng thời phân phối công việc xác minh riêng với công việc quét.
- Trang thanh toán của nhân viên bán hàng hiện cho phép người dùng nhập thủ công một hash giao dịch để xác minh – các hash được nhập sẽ được xác minh trên chuỗi trước khi đơn hàng được đánh dấu là đã thanh toán.
- Các truy vấn tổng hợp xu hướng trên bảng điều khiển hiện nay sử dụng SQL cụ thể cho từng loại cơ sở dữ liệu (MySQL/PostgreSQL/SQLite) để đảm bảo cắt ngày chính xác trên tất cả các cơ sở dữ liệu được hỗ trợ.
- Các URL của callback và API để xác nhận thanh toán đã được kiểm tra và chặn các phạm vi địa chỉ IP riêng tư (RFC 1918), nhằm ngăn chặn các cuộc tấn công SSRF thông qua các URL callback được kiểm soát bởi người dùng.
- Hướng dẫn tích hợp API thanh toán trong tệp README của kho lưu trữ đã được cập nhật với các ví dụ rõ ràng hơn và mô tả về các điểm cuối (endpoints).

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-8}

- Không cần thêm các biến môi trường mới.
- Các nhà quản trị hiện có thể gắn nhãn các nút RPC bằng `purpose: manual_verify` trong bảng điều khiển để cô lập lưu lượng kiểm tra khỏi lưu lượng quét.

### Thay đổi API {#api-changes-8}

- Các phương thức `POST /api/admin/v1/order/update-trade-status` và `POST /payments/gmpay/v1/pay/submit-hash` nhận tham số `tx_hash` để gửi hash thủ công; hash được xác minh trên chuỗi trước khi thay đổi trạng thái.
- Các điểm cuối tạo và cập nhật nút RPC hiện chấp nhận trường `purpose` (`general`, `manual_verify`, `both`), mặc định là `general`.

### Nguồn tham khảo {#evidence-used-8}

- Bản phát hành trên GitHub `v1.0.3`
- PR `#81` (hợp nhất phát triển)
- Các commit: `c69b0d6` (tách biệt mục đích RPC), `13c81ee` (ID giao dịch ngẫu nhiên cho crypto), `fca75a9` (gửi hash của thủ ngân), `b70995f` (sửa lỗi cú pháp SQL cho dashboard), `0d97237` (cập nhật README), `7fcb7b3` (tài liệu API thanh toán)
- Tệp: `src/model/mdb/rpc_node.go`, `src/model/data/rpc_node_data.go`, `src/controller/admin/rpc_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data_stats.go`, `src/controller/comm/pay_controller.go`, `README.md`


## v1.0.2 {#v1-0-2}

- Thẻ phát hành: `v1.0.2`
- Thời điểm phát hành: `2026-05-22T15:16:34Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.1...v1.0.2`

### Thay đổi đối với người dùng {#user-visible-changes-9}

- API quản trị hiện chấp nhận JWT trực tiếp trong tiêu đề `Authorization` (không có tiền tố `Bearer `) bên cạnh dạng chuẩn `Bearer <token>`. Máy khách gửi token trực tiếp sẽ không còn gặp lỗi xác thực vì lý do này.
- Hiện tại, việc quét giao dịch EVM ERC20 giờ đây bỏ qua các giao dịch đến trước khi đơn hàng được tạo, loại bỏ các kết quả sai lệch từ các sự kiện blockchain đã cũ.
- Các thông báo thành công của thanh toán OkPay hiện được gửi chính xác sau khi đơn hàng được hoàn thành thông qua đường dẫn OkPay.
- Việc xử lý chữ ký Solana hiện nay đã được thiết lập để tự động thử lại trong trường hợp lỗi tạm thời – một chữ ký chỉ được đánh dấu là đã xử lý sau khi quá trình so sánh đơn hàng và xử lý thanh toán hoàn toàn thành công, do đó, các lỗi tạm thời không còn gây mất thanh toán một cách im lặng.
- Cài đặt tỷ giá hiện hỗ trợ danh sách tỷ giá đa tiền tệ, cho phép người dùng thiết lập tỷ giá trao đổi đồng loạt cho nhiều loại tiền tệ, thay vì một tỷ giá toàn cầu duy nhất.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-9}

- Không cần thêm các biến môi trường mới.
- Tính năng tỷ giá hối đoái đa dạng có thể yêu cầu cập nhật cấu hình tỷ giá trong bảng điều khiển quản trị nếu trước đây bạn đã sử dụng một tỷ giá USDT cố định.

### Thay đổi API {#api-changes-9}

- Middleware JWT quản trị hiện chấp nhận cả `Authorization: Bearer <token>` và `Authorization: <token>` (token không có tiền tố).
- Không có tuyến đường công cộng mới nào được thêm hoặc loại bỏ.

### Nguồn tham khảo {#evidence-used-9}

- Bản phát hành trên GitHub `v1.0.2`
- PR `#80` (hợp nhất phát triển)
- Các commit: `f4ef71b3`, `4b4701f5`, `449d22a4`, `dec1b97b`, `8a486116`, `2a00a033`
- Các thay đổi: middleware JWT cho quản trị viên, trình nghe khối ERC20 của EVM, trình xử lý thông báo OkPay, logic thử lại chữ ký Solana, mô hình cài đặt giới hạn


## v1.0.1 {#v1-0-1}

- Thẻ phát hành: `v1.0.1`
- Thời điểm phát hành: `2026-05-21T11:40:39Z`
- Ghi chú phát hành chính thức: `feat: expose build version in public config — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.0...v1.0.1`

### Thay đổi đối với người dùng {#user-visible-changes-10}

- Phản hồi của `GET /payments/gmpay/v1/config` hiện chứa trường `version` cho biết phiên bản đang chạy trên máy chủ (ví dụ `"version": "v1.0.1"`).
- Các bản ghi cài đặt đã bị xóa mềm (soft-deleted) hiện được khôi phục thông qua thao tác upsert, thay vì chỉ bị xóa một cách lặng lẽ, đảm bảo các thay đổi cấu hình có hiệu lực chính xác sau khi xóa trước đó.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-10}

- Việc xuất bản hình ảnh Docker hiện chỉ được giới hạn ở việc đẩy các thẻ `v*`; các bản dựng không có thẻ phiên bản không còn được xuất bản lên registry.
- Phiên bản được tích hợp trong quá trình biên dịch thông qua các quy trình xây dựng Docker và GoReleaser, do đó, phiên bản được báo cáo trong phản hồi API sẽ khớp với tag phát hành.

### Thay đổi API {#api-changes-10}

- Phản hồi của `GET /payments/gmpay/v1/config` hiện bao gồm `version` (chuỗi), phản ánh phiên bản xây dựng của máy chủ.

### Nguồn tham khảo {#evidence-used-10}

- Bản phát hành trên GitHub `v1.0.1`
- PR `#72`: tính năng: hiển thị phiên bản xây dựng trong cấu hình công khai
- Các commit: `85b81e66`, `09642d4c`, `c19a7e5f`
- Tệp: `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/data/settings_data.go`, `.github/workflows/docker-alpine.yml`, `src/.goreleaser.yaml`

## v1.0.0 {#v1-0-0}

- Thẻ phát hành: `v1.0.0`
- Thời điểm phát hành: `2026-05-20T16:09:00Z`
- Ghi chú phát hành chính thức: `feat: verify manual mark-paid payments — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.7...v1.0.0`

### Thay đổi đối với người dùng {#user-visible-changes-11}

- Hướng dẫn quản trị: đánh dấu đơn hàng là đã thanh toán hiện thực hiện xác minh trên chuỗi trước khi đánh dấu đơn hàng là đã thanh toán – thông tin hash giao dịch được kiểm tra trên chuỗi trước khi thay đổi trạng thái được chấp nhận.
- Kiểm tra tính hợp lệ của địa chỉ người nhận, địa chỉ hợp đồng token, số tiền thanh toán, số lần xác nhận và dấu thời gian giao dịch để ngăn chặn các kết quả sai.
- Các bản ghi hash giao dịch trùng lặp bị từ chối – một giao dịch trên chuỗi không thể được sử dụng để đánh dấu nhiều đơn hàng là đã thanh toán.
- Các giao dịch mà không được tạo thành các giao dịch trên chuỗi sẽ bị loại trừ khỏi quy trình kiểm tra thủ công (các loại giao dịch không trên chuỗi sẽ bị từ chối).
- Phản hồi `supported_assets` hiện bao gồm trường `display_name` cùng với khóa `network` hiện có, giúp giao diện người dùng hiển thị tên chuỗi dễ đọc mà không cần thay đổi định danh mạng cơ bản.
- Chỉ số mạng BSC đã được đổi tên từ `bsc` thành `binance` trong danh sách tài sản được hỗ trợ.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-11}

- Không cần thêm các biến môi trường mới.
- Không có thay đổi nào đối với cấu hình hình ảnh Docker hoặc cấu hình docker-compose.

### Thay đổi API {#api-changes-11}

- Hiện tại, điểm cuối được quản lý bởi admin yêu cầu một tham số tx_hash hợp lệ và thực hiện xác minh trên chuỗi trước khi chấp nhận yêu cầu. Nếu `tx_hash` không hợp lệ hoặc trùng lặp, sẽ có phản hồi lỗi.
- Các mục tài sản được hỗ trợ do `GET /payments/gmpay/v1/config` trả về hiện bao gồm `display_name`.
- Giá trị mạng BSC đã thay đổi từ `bsc` sang `binance`.

### Nguồn tham khảo {#evidence-used-11}

- Bản phát hành trên GitHub `v1.0.0`
- PR `#70`: bổ sung: xác minh thanh toán do người dùng tạo
- Commit: `049a15c`
- Tệp: `src/controller/admin/order_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`

## v0.9.7 {#v0-9-7}

- Thẻ phát hành: `v0.9.7`
- Thời điểm phát hành: `2026-05-13T09:01:26Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.6...v0.9.7`

### Thay đổi đối với người dùng {#user-visible-changes-12}

- Tệp `README.zh-CN.md` đã bị xóa; hiện tại, `README.md` là tệp README chính duy nhất, tập hợp tất cả tài liệu vào một điểm truy cập duy nhất.
- Các tài sản quản trị phía trước (manifest của service worker và tất cả các đoạn mã JavaScript được đóng gói) đã được xây dựng lại với các hash nội dung cập nhật, giải quyết các vấn đề về bộ nhớ cache cũ đối với người dùng đã truy cập vào bảng điều khiển quản trị trước đó.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-12}

- Không có các biến môi trường mới nào được thêm vào.
- Không có thay đổi nào trong hoạt động thực thi – đây chỉ là việc cập nhật tài sản giao diện và làm sạch tài liệu.

### Thay đổi API {#api-changes-12}

- Không có các tuyến đường API nào được thêm, xóa hoặc sửa đổi.

### Nguồn tham khảo {#evidence-used-12}

- Bản phát hành trên GitHub `v0.9.7`
- So sánh các thay đổi `v0.9.6...v0.9.7`
- Các commit: `52b171b`, `4a69b7c`, `b0093c4`, `864eb59`
- Tệp: `README.md`, `README.zh-CN.md`, `src/www/sw.js`, `src/www/index.html`, `src/www/assets/*`

## v0.9.6 {#v0-9-6}

- Thẻ phát hành: `v0.9.6`
- Thời điểm phát hành: `2026-05-11T10:09:43Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.5...v0.9.6`

### Thay đổi đối với người dùng {#user-visible-changes-13}

- Hiện tại, cơ chế khởi động (bootstrap) giờ đây hiển thị thông tin đăng nhập quản trị ban đầu lên console, giúp người dùng có thể đăng nhập lần đầu một cách dễ dàng mà không cần kiểm tra cơ sở dữ liệu.
- Cài đặt giao diện trong bảng quản trị hiện hỗ trợ `background_color` và `background_image_url` để tùy chỉnh nền trang thanh toán.
- Độ chính xác của số tiền thanh toán hiện có thể tùy chỉnh – các nhân viên có thể thiết lập số lượng chữ số thập phân được áp dụng khi tạo số tiền thanh toán.
- Giải quyết token của TRON chain hiện đã trở nên động trong trình nghe khối, loại bỏ sự cần thiết phải mã hóa cứng địa chỉ hợp đồng token khi khởi động.
- `README.md` hiện là file README chính bằng tiếng Trung (giản thể); một file `README.en.md` riêng biệt được tạo để dành cho người đọc tiếng Anh. File `README.zh-CN.md` đã bị xóa trong một commit tiếp theo (4a69b7c8).
- Thư mục `plugins/` và ví dụ plugin `dujiaoka` đã được xóa khỏi kho lưu trữ.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-13}

- Không cần thêm biến môi trường nào cả.
- Việc tái cấu trúc tài liệu README chỉ liên quan đến việc chỉnh sửa, và không ảnh hưởng đến cách hoạt động của chương trình.

### Thay đổi API {#api-changes-13}

- Phản hồi của `GET /payments/gmpay/v1/config` hiện chứa các trường `background_color` và `background_image_url` từ phần cài đặt giao diện.
- Phản hồi của `GET /payments/gmpay/v1/config` hiện có `payment_amount_precision` lấy từ cấu hình thanh toán.
- Không có tuyến đường nào được thêm hoặc xóa.

### Nguồn tham khảo {#evidence-used-13}

- Bản phát hành trên GitHub `v0.9.6`
- So sánh các thay đổi `v0.9.5...v0.9.6`
- Các commit: `1a35cab`, `2d546e3`, `a8a3b86`, `3e0be9b`, `7c9e3e1`, `84972ea`, `1c805ed`, `8d2ddbd`, `07d1d83`, `7a905ba`, `4dc1ba8`, `4a69b7c`
- Tệp: `src/bootstrap/bootstrap.go`, `src/controller/admin/settings_controller.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/task/listen_trc20_block.go`

## v0.9.5 {#v0-9-5}

- Thẻ phát hành: `v0.9.5`
- Thời điểm phát hành: `2026-05-09T13:51:58Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.4...v0.9.5`

### Thay đổi đối với người dùng {#user-visible-changes-14}

- Chính xác, quy trình thanh toán mới được tích hợp giờ đây bao gồm cả đường dẫn thanh toán `okpay` cùng với luồng lựa chọn mạng lưới trên chuỗi hiện tại.
- Luồng thanh toán hiện có thể trả về một `payment_url` trong các phản hồi thanh toán, do đó, các giao dịch thanh toán bên thứ ba như đơn hàng con của OkPay có thể có một đích chuyển hướng rõ ràng, thay vì chỉ dựa vào việc hiển thị địa chỉ của thu ngân cục bộ.
- Các phản hồi cấu hình công khai hiện nay hiển thị thông tin chi tiết về kế toán (cashier) hướng đến trang web, bao gồm tên, URL logo, tiêu đề trang web và liên kết hỗ trợ. Điều này giúp giảm sự phụ thuộc vào cấu hình và thiết kế giao diện trước.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-14}

- Tệp môi trường mẫu đã loại bỏ các khối cấu hình cũ cho PostgreSQL và MySQL; hướng dẫn cấu hình hiện tại phản ánh các cài đặt mặc định tập trung vào SQLite thay vì đề xuất rằng các hệ cơ sở dữ liệu này vẫn là một phần của quy trình cài đặt thông thường.
- Tệp Docker đã được tối ưu hóa để loại bỏ các bước sao chép `static` dư thừa, vốn không còn phù hợp với đường dẫn phân phối giao diện trước hiện tại.
- Cập nhật các thủ tục bảo trì cũng bao gồm việc làm mới nội dung logo và tuyên bố miễn trừ, nhưng những điều này là thứ yếu so với các thay đổi liên quan đến thời gian chạy và thanh toán ở trên.

### Thay đổi API {#api-changes-14}

- Hiện tại, cấu hình giao diện frontend của Public GMPay được lấy từ `GET /payments/gmpay/v1/config` thay vì phương thức tìm kiếm tài sản độc lập cũ.
- `GET /payments/gmpay/v1/config` trả về các thông tin `supported_assets`, cùng với định dạng thương hiệu của trang web, cài đặt mặc định của EPay, và các trường cấu hình công khai của OkPay.
- Thêm phương thức thông báo OkPay: `POST /payments/okpay/v1/notify`.
- `POST /pay/switch-network` hiện nay ghi nhận/liệt kê `network=okpay` cùng với các giá trị mạng trên chuỗi.
- Các payload phản hồi thanh toán hiện bao gồm `payment_url`.

### Nguồn tham khảo {#evidence-used-14}

- Bản phát hành trên GitHub `v0.9.5`
- So sánh các thay đổi `v0.9.4...v0.9.5`
- Các commit: `377176a`, `3623a54`, `51ad344`, `ff157c3`, `1a35cab`, `2d546e3`
- Các đường dẫn mã nguồn bao gồm `src/route/router.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/response/order_response.go`, `src/model/response/support_response.go`, `src/.env.example`

## v0.9.4 {#v0-9-4}

- Thẻ phát hành: `v0.9.4`
- Thời điểm phát hành: `2026-04-28T16:37:20Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### Thay đổi đối với người dùng {#user-visible-changes-15}

- Việc quét thanh toán TRON đã trở lại trên đường dẫn người nghe dựa trên khối, do đó, sự đảo ngược tạm thời của luồng TRON mới không còn là trạng thái đầu lên hiệu quả.
- Cập nhật các sửa đổi liên quan đến xử lý thanh toán để điều chỉnh hành vi thông báo đơn hàng sau khi thanh toán thành công.
- Hiện tại, quá trình thanh toán được lưu trữ giờ đây chuyển hướng đến luồng thanh toán SPA thay vì hiển thị một mẫu HTML riêng của máy chủ trực tiếp từ `/pay/checkout-counter/:trade_id`.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-15}

- Luồng thanh toán được lưu trữ hiện dựa trên đường dẫn phân phối `www/` dựa trên SPA, thay vì đường dẫn tài sản thanh toán chuyên dụng cũ `static/`.
- Hình ảnh Docker sau đó đã được làm sạch để loại bỏ các bước sao chép `static` dư thừa, những bước này không còn phù hợp với đường dẫn phân phối SPA (Single Page Application) đang hoạt động.

### Thay đổi API {#api-changes-15}

- Hiện tại, đường dẫn `GET /pay/checkout-counter/:trade_id` hoạt động như một lối chuyển hướng dành cho giao diện ứng dụng (SPA) của nhân viên bán hàng.
- Nguồn hiện tại chỉ ra rằng điểm cuối `GET /pay/checkout-counter-resp/:trade_id` được sử dụng như điểm trả lời JSON cho luồng thanh toán mới của SPA.
- Không có trường ký tên mới cho người bán hàng hoặc hợp đồng thông báo (callback) nào được giới thiệu trong bản phát hành này.

### Nguồn tham khảo {#evidence-used-15}

- Bản phát hành trên GitHub `v0.9.4`
- So sánh các thay đổi `v0.9.3...v0.9.4`
- Các commit: `9e885d8`, `de9c45a`, `96ea748`, `51a2acc`, `d17d212`, `9c533a7`, `ff68279`
- Vấn đề trước (số `#55`) liên quan đến việc thiếu các tệp checkout trong triển khai Docker.

## v0.9.3 {#v0-9-3}

- Thẻ phát hành: `v0.9.3`
- Thời điểm phát hành: `2026-04-25T10:50:34Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### Thay đổi đối với người dùng {#user-visible-changes-16}

- Sửa lại đường dẫn gốc sau khi cài đặt, để `GET /` luôn hiển thị ứng dụng SPA thay vì bị chặn bởi trình xử lý gốc phía sau.
- Chế độ cài đặt vẫn chuyển hướng đường dẫn gốc về `/install`, do đó, quy trình cài đặt ban đầu vẫn được duy trì.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-16}

- Không có biến môi trường công mới hoặc cờ triển khai nào được công bố cho bản phát hành này.
- Chính hành vi đường dẫn thời gian thực đã được điều chỉnh để đảm bảo các phiên bản được cài đặt hiển thị đáng tin cậy hơn trên ứng dụng web.

### Thay đổi API {#api-changes-16}

- Không có đường dẫn API công cộng mới nào được giới thiệu trong bản phát hành này.
- Việc định tuyến phía sau (backend) đã được thay đổi từ một trình xử lý kiểu `Any("/")` (chỉ tất cả) sang một trình xử lý `POST("/")`, đồng thời giữ lưu lượng truy cập `GET /` thông thường của trình duyệt cho ứng dụng SPA.

### Nguồn tham khảo {#evidence-used-16}

- Bản phát hành trên GitHub `v0.9.3`
- So sánh các thay đổi `v0.9.2...v0.9.3`
- Các commit bao gồm `95879e3` và tag merge `67263da`.

## v0.9.2 {#v0-9-2}

- Thẻ phát hành: `v0.9.2`
- Thời điểm phát hành: `2026-04-24T16:14:34Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### Thay đổi đối với người dùng {#user-visible-changes-17}

- Cài đặt phí quản lý hiện tại cho phép cấu hình tỷ giá USDT cố định.
- Các ví dụ triển khai Docker vẫn dựa trên tham chiếu hình ảnh hiện tại `gmwallet/epusdt:latest`.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-17}

- Không có biến môi trường công mới nào được công bố rõ ràng trong bản ghi chú phát hành.
- Các ví dụ nâng cấp Docker hiện tại vẫn tiếp tục sử dụng `gmwallet/epusdt:latest`.

### Thay đổi API {#api-changes-17}

- Không có đường dẫn API công cộng mới nào được hiển thị trong bản ghi chú phát hành hoặc so sánh sự khác biệt cho bản phát hành này.

### Nguồn tham khảo {#evidence-used-17}

- Bản phát hành trên GitHub `v0.9.2`
- So sánh các thay đổi `v0.9.1...v0.9.2`
- Các commit bao gồm `dd1bf70`, `143bc84`.

## v0.9.1 {#v0-9-1}

- Thẻ phát hành: `v0.9.1`
- Thời điểm phát hành: `2026-04-22T18:29:39Z`

### Thay đổi đối với người dùng {#user-visible-changes-18}

- Trình hướng dẫn cài đặt tích hợp: nếu lần chạy đầu không tìm được tệp cấu hình hợp lệ, chương trình sẽ mở trang thiết lập trên web. Biểu mẫu hiện gồm `app_name`, `app_uri`, địa chỉ và cổng lắng nghe, đường dẫn dữ liệu khi chạy và nhật ký, thời hạn đơn hàng và cấu hình thử lại callback.
- Hình ảnh Docker hiện nay hỗ trợ tải trực tiếp bằng `docker pull gmwallet/epusdt:latest`; không cần gắn kết file `.env` để triển khai ban đầu.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-18}

- Wizard cài đặt tự động tạo file `.env` khi lần đầu nhập; khởi động lại sau đó sẽ bỏ qua wizard và khởi động bình thường.
- Việc gắn (mount) volume cho `docker-compose.yaml` để sử dụng file `.env` hiện không bắt buộc—bỏ qua nó để có trải nghiệm khởi động sạch sẽ với giao diện hướng dẫn.

### Thay đổi API {#api-changes-18}

- Không có đường API công cộng mới nào trong bản phát hành này.

## v0.9.0 {#v0-9-0}

- Thẻ phát hành: `v0.9.0`
- Thời điểm phát hành: `2026-04-21T20:23:33Z`
- Ghi chú phát hành chính thức: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### Thay đổi đối với người dùng {#user-visible-changes-19}

- Thêm một giao diện quản trị đầy đủ để quản lý khóa API, chuỗi, token chuỗi, ví, đơn hàng, nút RPC, cài đặt, thông báo và thống kê bảng điều khiển.
- Hỗ trợ đa chuỗi được mở rộng hơn nữa, bao gồm khả năng giám sát EVM rộng hơn và các luồng quản lý chuỗi/token dành cho người quản trị.
- Các kênh thông báo Telegram đã được thêm vào và sau đó được đồng bộ với các bản cập nhật cài đặt.
- Quy trình cài đặt mới (đầu tiên) được giới thiệu để đơn giản hóa quá trình thiết lập ban đầu.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-19}

- Tệp `.env.example` đã thay đổi cài đặt mặc định của cờ cài đặt thành được bật cho quy trình thiết lập lần đầu.
- Thời gian thực hiện hiện nay bao gồm kiểm tra sức khỏe của các nút RPC với hỗ trợ chuyển hướng tự động.
- Các tài sản tĩnh quản trị đã được thêm vào thời gian chạy của máy chủ.
- Các mô hình tính toán mới đã được giới thiệu dành cho người dùng quản trị, khóa API, chuỗi, token chuỗi, nút RPC, cài đặt và kênh thông báo.

### Thay đổi API {#api-changes-19}

- Thêm một giao diện API quản trị đầy đủ, bao gồm xác thực, khóa API, chuỗi, token chuỗi, ví, đơn hàng, nút RPC, cài đặt, thống kê bảng điều khiển và thông báo.
- Thêm xác thực quản trị dựa trên JWT và middleware xác thực API-key.
- Các cấu trúc phản hồi/yêu cầu liên quan đến thanh toán, tài sản được hỗ trợ, ví và đơn hàng đã được mở rộng, cùng với công việc quản trị.

### Nguồn tham khảo {#evidence-used-18}

- Bản phát hành trên GitHub `v0.9.0`
- So sánh các thay đổi `v0.0.8...v0.9.0`
- Các commit bao gồm: `6bb47d4`, `5edc9dc`, `b499bc0`, `6ea5637`, `9163943`

## v0.0.8 {#v0-0-8}

- Thẻ phát hành: `v0.0.8`
- Thời điểm phát hành: `2026-04-15T10:44:56Z`
- Ghi chú phát hành chính thức: `- Enable polygon,plasma supports`

### Thay đổi đối với người dùng {#user-visible-changes-20}

- Thêm hỗ trợ mạng cho `polygon` và `plasma`.
- Việc lựa chọn mạng lưới trang thanh toán đã được điều chỉnh.
- Logic lưu trữ địa chỉ ví EVM đã được sửa chữa.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-20}

- Không có biến môi trường mới nào được hiển thị trong bản ghi chú phát hành hoặc so sánh sự khác biệt.

### Thay đổi API {#api-changes-20}

- Không có đường dẫn API công cộng mới nào được giới thiệu rõ ràng trong bản ghi chú chính thức.
- Các hành vi liên quan đến mạng được hỗ trợ tiếp tục từ luồng công việc `v0.0.7`.

### Nguồn tham khảo {#evidence-used-19}

- Bản phát hành trên GitHub `v0.0.8`
- So sánh các thay đổi `v0.0.7...v0.0.8`
- Các commit bao gồm `f7c5f67`, `097c716`

## v0.0.7 {#v0-0-7}

- Thẻ phát hành: `v0.0.7`
- Thời điểm phát hành: `2026-04-15T06:00:55Z`
- Ghi chú phát hành chính thức: `suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### Thay đổi đối với người dùng {#user-visible-changes-21}

- Thêm hỗ trợ cho `bsc`, `polygon`, và `plasma`.
- Các thông số để gửi biểu mẫu tương thích với EPay đã được thêm vào để tăng khả năng tích hợp rộng hơn.
- Các tương tác và xử lý liên quan đến Telegram và thanh toán đã được cập nhật trong luồng công việc thanh toán.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-21}

- Thêm các đường dẫn nghe theo EVM mới được hỗ trợ trong lịch sử nguồn.
- Không có biến `.env` mới nào được ghi rõ trong bản ghi chú phát hành chính thức.

### Thay đổi API {#api-changes-21}

- Thêm công việc liên quan đến API cho chuỗi hỗ trợ và tài sản hỗ trợ trong lịch sử nguồn.
- Logic của router đã được cập nhật để hỗ trợ cả các biểu mẫu `GET` và `POST` cho quy trình nộp đơn tương thích với EPay.

### Nguồn tham khảo {#evidence-used-20}

- Bản phát hành trên GitHub `v0.0.7`
- So sánh các thay đổi `v0.0.6...v0.0.7`
- Các commit bao gồm: `9c003fb`, `8cd816c`, `786c5e8`, `70f8ed4`

## v0.0.6 {#v0-0-6}

- Thẻ phát hành: `v0.0.6`
- Thời điểm phát hành: `2026-04-12T20:06:08Z`
- Thông báo chính thức: so sánh `v0.0.5...v0.0.6`

### Thay đổi đối với người dùng {#user-visible-changes-22}

- Giao diện thanh toán được thiết kế lại, chuyển sang quy trình thanh toán hai bước.
- Việc chuyển đổi phương thức thanh toán đã được thêm vào để chọn thanh toán trên nhiều mạng lưới.
- Hiện tại, tính năng quét thanh toán Solana hỗ trợ cả `USDT` và `USDC`.
- Bổ sung chức năng quét giao dịch thanh toán ERC-20 trên Ethereum cho `USDT` và `USDC`.
- Thông báo thanh toán trên Telegram hiện bao gồm thông tin về mạng lưới.
- Việc xác thực ví Telegram đã được cải thiện cho các địa chỉ đa mạng.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-22}

- Đã thêm `solana_rpc_url`
- Đã thêm `ethereum_ws_url`
- Đã thêm `epay_pid`
- Đã thêm `epay_key`
- Quy trình khóa và đối chiếu đơn hàng hiện đã tính đến `network` khi chạy.

### Thay đổi API {#api-changes-22}

- Thêm các điểm cuối (endpoints) quản lý ví dưới `/payments/gmpay/v1/wallet/*`
- Đã thêm `POST /pay/switch-network`
- Thêm đường dẫn tương thích với EPay: `GET /payments/epay/v1/order/create-transaction/submit.php`
- Phản hồi thanh toán hiện bao gồm `is_selected`.
- Luồng tạo đơn (create-order) chấp nhận tùy chọn `name` và `payment_type`.
- Nguồn hiện tại sử dụng các định danh mạng ở dạng chữ thường, chẳng hạn như `tron`, `solana`, và `ethereum`.

### Nguồn tham khảo {#evidence-used-21}

- Bản phát hành trên GitHub `v0.0.6`
- So sánh các thay đổi `v0.0.5...v0.0.6`
- Các commit bao gồm: `3f071e6`, `32ca778`, `5e4d5df`

## v0.0.5 {#v0-0-5}

- Thẻ phát hành: `v0.0.5`
- Thời điểm phát hành: `2026-04-03T17:05:30Z`
- Ghi chú phát hành chính thức: `test: fix macOS path assertion and wallet address unique index`

### Thay đổi đối với người dùng {#user-visible-changes-23}

- Không có tính năng chính cho người dùng nào được mô tả trong bản ghi chú phát hành chính thức.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-23}

- Không có các biến triển khai mới nào được hiển thị trong bản ghi chú chính thức.

### Thay đổi API {#api-changes-23}

- Hành vi chỉ số duy nhất của địa chỉ ví đã được điều chỉnh trong lịch sử mã.

### Nguồn tham khảo {#evidence-used-22}

- Bản phát hành trên GitHub `v0.0.5`
- So sánh các thay đổi `v0.0.4...v0.0.5`

## v0.0.4 {#v0-0-4}

- Thẻ phát hành: `v0.0.4`
- Tên bản phát hành: `New UI Update`
- Thời điểm phát hành: `2026-04-03T16:05:23Z`
- Ghi chú phát hành chính thức: `feat: change payment ui`

### Thay đổi đối với người dùng {#user-visible-changes-24}

- Giao diện thanh toán đã được cập nhật.

### Thay đổi về triển khai và cấu hình {#deployment-and-configuration-changes-24}

- Không có thay đổi nào liên quan đến triển khai được đề cập trong bản ghi chú phát hành.

### Thay đổi API {#api-changes-24}

- Không có thay đổi nào liên quan đến API được đề cập trong bản ghi chú phát hành.

### Nguồn tham khảo {#evidence-used-23}

- Bản phát hành trên GitHub `v0.0.4`
- Thông báo chính thức

## Ghi chú dành cho những người quản lý {#notes-for-maintainers}

Để các bản phát hành tiếp theo, định dạng bản phát hành hữu ích nhất là:

1. Thay đổi đối với người dùng
2. Thay đổi về triển khai hoặc cấu hình
3. Thay đổi API hoặc lược đồ
4. Ghi chú về nâng cấp hoặc thay đổi lớn
