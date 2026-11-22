---
description: "Sử dụng epctl để cài đặt một bản binary EPUSDT đã phát hành trên Linux, xác minh bản phát hành và quản lý dịch vụ."
---

# Cài đặt và kiểm tra bằng epctl {#epctl-installation-and-verification-scripts}

`epctl` là trình cài đặt và quản lý dịch vụ nhị phân Linux, dành cho các nhị phân `epusdt` đã phát hành trên GitHub Releases.
`epctl-docker-test.sh` là script kiểm tra toàn diện. Nó khởi động Ubuntu + systemd trong Docker và xác minh hành vi tải xuống, cài đặt, khởi động, nâng cấp và cài đặt mật khẩu với các file thực tế.

Đối với việc cài đặt mới, hãy tải xuống các file bản phát hành trước.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Phạm vi {#scope}

- Chỉ Linux
- Chỉ cài đặt phiên bản cơ bản.
- Nguồn phát hành đã được thiết lập ở: `https://github.com/GMWalletApp/epusdt/releases`
- Quản lý dịch vụ dựa trên systemd.

## Quyền truy cập và đặc quyền {#dependencies-and-privileges}

`epctl` mong đợi các lệnh sau:

- `curl`
- `tar`
- `systemctl`
- `install`
- `grep`
- `sed`

Ghi chú

- Các lệnh `install`, `upgrade` và `self-install` ghi dữ liệu vào `/opt`, `/etc/systemd` và `/usr/local/bin`.
- `status` và `logs` sẽ tự động chạy lại thông qua `sudo` khi cần thiết.
- Trong thực tế, người vận hành nên có quyền `sudo`.

## Đường đi cố định {#fixed-paths}

| Hàng | Đường dẫn |
|------|------|
| Thư mục cài đặt | `/opt/epusdt` |
| Binary chính. | `/opt/epusdt/epusdt` |
| Dữ liệu nhị phân quét | `/opt/epusdt/chainscanner` |
| Cấu hình đang hoạt động | `/opt/epusdt/.env` |
| Cấu hình máy quét | `/opt/epusdt/chainscanner.json` |
| Cấu hình mẫu | `/opt/epusdt/.env.example` |
| Tài sản giao diện trước đã được trích xuất | `/opt/epusdt/www` |
| Tải bộ nhớ cache | `/tmp/epusdt/<tag>/` |
| Đơn vị dịch vụ systemd | `/etc/systemd/system/epusdt.service`, `/etc/systemd/system/chainscanner.service` |
| Đường dẫn epctl toàn cầu | `/usr/local/bin/epctl` |

## Bắt đầu nhanh chóng {#quick-start}

Chạy menu tương tác từ thư mục gốc:

```bash
./epctl
```

Ngôn ngữ tương tác mặc định là tiếng Trung. Bạn có thể chọn bất kỳ ngôn ngữ nào.

```bash
./epctl zh
./epctl en
./epctl --lang zh help
./epctl --lang en help
```

Cài đặt script vào PATH:

```bash
./epctl self-install
epctl
```

## Các lệnh thông thường {#common-commands}

Tải xuống phiên bản cụ thể.

```bash
./epctl download --tag v2.1.0
```

Cài đặt dịch vụ (mặc định là `--component epusdt` với trình quét tích hợp. Sử dụng `--component all` để có hai dịch vụ riêng biệt).

```bash
./epctl install --tag v2.1.0 \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:18000
```

Triển khai `chainscanner` độc lập (tự động tạo hoặc chấp nhận token và in thông tin đăng nhập kết nối).

```bash
./epctl install --component chainscanner \
  --scanner-listen 0.0.0.0:9081
```

Triển khai `epusdt` độc lập (kết nối với `chainscanner` từ xa).

```bash
./epctl install --component epusdt \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:8000 \
  --scanner-url http://10.0.0.2:9081 \
  --scanner-token <chainscanner_token> \
  --scanner-admin-token <chainscanner_admin_token>
```

Nâng cấp lên phiên bản mới hơn (tự động phát hiện các thành phần đã cài đặt, hoặc nhập `--component all|epusdt|chainscanner`).

```bash
./epctl upgrade --tag v2.1.0
```

Chạy `./epctl upgrade --tag ...` sẽ khởi động lại `epusdt` ngay lập tức sau khi các tệp được thay thế.
Nếu bạn muốn chỉ thay thế các tệp tin, hãy sử dụng `--no-restart`.
Nếu bạn muốn một bước xác nhận rõ ràng, hãy sử dụng `--prompt-restart`. Trong một terminal tương tác, dòng lệnh là `[Y/n]`, vì vậy việc nhấn Enter sẽ khởi động lại theo mặc định.

Kiểm tra cấu hình, trạng thái và nhật ký.

```bash
./epctl show-config
./epctl status
./epctl logs --lines 200
```

Yêu cầu mật khẩu quản trị ban đầu.

```bash
./epctl init-password
```

## Hành vi khi không sử dụng `--tag` {#behavior-when-tag-is-omitted}

Với các lệnh `download`, `install` và `upgrade`, `epctl` tìm thẻ phát hành mới nhất trên GitHub, hiển thị chính xác thẻ đó rồi yêu cầu xác nhận.

Please provide the English text you would like me to translate. I’m ready when you are.

```bash
./epctl install --app-uri https://pay.example.com
```

Trong quá trình sử dụng tương tác, kịch bản sẽ hiển thị thẻ mới nhất đã được giải quyết trước khi tiếp tục.
Để tự động hóa, việc chỉ định `--tag` một cách rõ ràng được ưu tiên. Nếu bạn muốn bỏ qua bước xác nhận một cách có chủ đích, hãy sử dụng:

```bash
EPCTL_ASSUME_YES=1 ./epctl download
```

## Điều gì xảy ra khi cài đặt lần đầu {#what-happens-on-first-install}

`install` thực hiện các bước sau:

1. Phát hiện kiến trúc CPU hiện tại và tải xuống tệp lưu trữ GitHub Release phù hợp.
2. Giải nén vào `/tmp/epusdt/<tag>/extract/`
3. Cài đặt tệp nhị phân vào `/opt/epusdt/epusdt`
4. Cài đặt `.env.example` vào `/opt/epusdt/.env.example`
5. Tạo người dùng và nhóm hệ thống `epusdt`.
6. Tự tạo `/opt/epusdt/.env` từ `.env.example` nếu file không tồn tại.
7. Viết và kích hoạt dịch vụ `epusdt.service`.

Khi file `.env` được tạo tự động, script chỉ áp dụng những thay đổi cơ bản nhất.

- `install=false`
- `app_uri=<--app-uri, default http://127.0.0.1:8000>`
- `http_listen=<--listen, default 127.0.0.1:8000>`

Nếu file `/opt/epusdt/.env` đã tồn tại, vui lòng không cài đặt hoặc nâng cấp, giữ nguyên như hiện tại.
`/opt/epusdt/.env.example` được cập nhật từ phiên bản hiện tại mỗi khi cài đặt hoặc nâng cấp.

## Điều gì diễn ra trong quá trình nâng cấp {#what-happens-during-upgrade}

`upgrade` thực hiện các bước sau:

1. Xác định kiến trúc CPU hiện tại và tải xuống tệp lưu trữ GitHub Release mục tiêu.
2. Giải nén vào `/tmp/epusdt/<tag>/extract/`
3. Yêu cầu sử dụng tệp `/opt/epusdt/.env`. Nếu tệp này không tồn tại, lệnh sẽ không hoạt động và thông báo bạn cần chạy lệnh `install` trước.
4. Thay thế `/opt/epusdt/epusdt`
5. Thay thế `/opt/epusdt/.env.example`
6. Giữ `/opt/epusdt/.env`
7. Cập nhật `epusdt.service` và chạy `systemctl daemon-reload`.
8. Khởi động `epusdt` ngay lập tức theo mặc định

Hành vi bổ sung:

- `upgrade` không còn tạo `.env` hoặc chạy `systemctl enable`.
- `upgrade --no-restart` chỉ thay đổi các tệp tin và in cảnh báo về việc khởi động thủ công.
- `upgrade --prompt-restart` hỏi xem có muốn khởi động lại khi có một terminal tương tác hay không.
- Nếu quá trình khởi động lại không thành công sau khi nâng cấp, script sẽ cố gắng khôi phục phiên bản trước, `.env.example`, và tệp đơn vị.

## Chi tiết dịch vụ systemd {#systemd-service-details}

Tên dịch vụ đã được đặt là `epusdt.service` và sử dụng các cài đặt cốt lõi sau:

```ini
WorkingDirectory=/opt/epusdt
ExecStart=/opt/epusdt/epusdt http start
User=epusdt
Group=epusdt
Restart=always
RestartSec=3
```

Thư mục làm việc vẫn ở `/opt/epusdt` vì chương trình lưu các tài sản `www/` của nó bên cạnh tệp thực thi.

## Chức năng của `init-password` {#what-init-password-does}

`epctl init-password` chỉ gọi đường dẫn HTTP cục bộ.

```text
GET /admin/api/v1/auth/init-password
```

Nó không truy cập trực tiếp vào cơ sở dữ liệu.

Файл скрипта đọc giá trị `http_listen` từ `/opt/epusdt/.env` và chuẩn hóa các giá trị lắng nghe thành một mục tiêu yêu cầu cục bộ.

- `:8000` -> `127.0.0.1:8000`
- `0.0.0.0:8000` -> `127.0.0.1:8000`

Nếu API trả về `10040`, mật khẩu plaintext khởi tạo không còn khả dụng. Các nguyên nhân phổ biến bao gồm:

- Đã thay đổi mật khẩu quản trị.
- Mật khẩu ban đầu đã được sử dụng và không thể lấy lại.

Trong trường hợp này, `epctl` sẽ hiển thị nội dung lỗi HTTP gốc để chẩn đoán.

## Script kiểm tra Docker {#docker-validation-script}

Repo này cũng cung cấp:

```bash
./epctl-docker-test.sh <install-tag> [upgrade-tag]
```

Ví dụ:

```bash
./epctl-docker-test.sh v2.1.0
./epctl-docker-test.sh --lang en v2.0.0 v2.1.0
```

Nó thực hiện các kiểm tra này trên máy tính cục bộ:

- Bắt đầu trực tiếp từ `ubuntu:24.04` và cài đặt systemd cùng với các thư viện kiểm tra trong quá trình khởi động container.
- bắt đầu một môi trường đặc quyền
- chạy `epctl self-install` bên trong container
- Tải xuống các tệp thực thi GitHub Release
- Cài đặt `epusdt`
- Khi `upgrade-tag` được cung cấp, kiểm tra `upgrade --no-restart`, `upgrade` mặc định (không tương tác), và cả các nhánh `n` / Enter của `upgrade --prompt-restart`.
- kiểm tra dịch vụ systemd, `www/index.html`, cấu hình, nhật ký và trạng thái
- Xác minh rằng `init-password` hoạt động một lần, và sau đó trả về `10040` sau khi mật khẩu quản trị được thay đổi.

Yêu cầu:

- Docker đã được cài đặt cục bộ.
- quyền để chạy Docker
- Tiếp cận GitHub Releases ra ngoài

## Đề xuất {#recommendations}

- Ưu tiên các giá trị `--tag` rõ ràng trong tự động hóa.
- Sau khi cài đặt, hãy chạy `./epctl show-config` một lần để kiểm tra `.env` đang được sử dụng.
- Thay đổi mật khẩu quản trị ngay lập tức sau khi lấy được mật khẩu ban đầu.
- Nếu bạn muốn kiểm tra trình cài đặt, hãy chạy `./epctl-docker-test.sh` trước.
