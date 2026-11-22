---
title: "Triển khai cửa hàng trên Workers hoặc Bun."
description: "Triển khai GMShop Edge trên Workers hoặc Bun, và cấu hình lưu trữ, hàng đợi và công việc nền cho cửa hàng hàng kỹ thuật số."
titleTemplate: ":title | GMShop Edge"
---

# Triển khai {#deployment}

GMShop Edge hỗ trợ hai giai đoạn sản xuất:

- **Tự lưu trữ Bun/Nitro**: SQLite, đối tượng cục bộ riêng tư, hàng đợi cục bộ bền vững, và thư mục dữ liệu bền vững, sử dụng Docker hoặc triển khai nguồn với trình quản lý dịch vụ.
- **Cloudflare Workers**: D1, KV, R2, Hàng đợi, Kích hoạt Cron và tùy chọn Gửi Email.

Cả hai phiên bản đều tiếp cận cùng một giao diện, tài khoản khách hàng, quy trình thanh toán, quản lý đơn hàng, bảng điều khiển quản trị, API nhà cung cấp, tích hợp Telegram, và luồng `/install`.

## Docker Compose {#docker-compose}

Cộng đồng công khai [GHCR package](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) hỗ trợ `linux/amd64` và `linux/arm64`. Lưu nội dung sau vào file `compose.yml`.

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMSHOP_DATA_DIR: /var/lib/gmshop
    volumes:
      - gmshop-data:/var/lib/gmshop

volumes:
  gmshop-data:
```

Bắt đầu và kiểm tra dịch vụ:

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

Container này chạy với quyền người dùng không phải root. `GMSHOP_DATA_DIR` chứa `gmshop.sqlite`, các đối tượng riêng tư, trạng thái hàng đợi bền, và tất cả dữ liệu thực thi. Hãy sao lưu và bảo toàn thể tích `gmshop-data` mỗi khi container được cập nhật hoặc tạo lại.

`GMSHOP_DATA_DIR` là biến môi trường Bun duy nhất có thể truy cập công khai. Cấu hình các cài đặt Origin, Host được phép, email, thanh toán, nhà cung cấp, Telegram và tự động hóa thông qua `/install` hoặc `/admin`.

Bun chỉ hỗ trợ triển khai đơn lẻ; triển khai đa bản sao và lưu trữ mạng chung không được hỗ trợ. Vui lòng đọc [hoạt động dữ liệu Bun](./node-data-operations.md) trước khi nâng cấp, khôi phục hoặc di chuyển một triển khai.

## Triển khai Bun từ mã nguồn {#bun-source-deployment}

Bạn có thể chạy máy chủ sản xuất trực tiếp từ mã nguồn mà không cần Docker. Hãy cài đặt Git và Bun 1.3 trở lên; Node.js chỉ cần thiết nếu bạn chọn PM2 làm trình quản lý quy trình.

```bash
git clone https://github.com/GMWalletApp/gmshop-edge.git
cd gmshop-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -m 0700 -o "$USER" -g "$USER" /var/lib/gmshop
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  bun run start:bun
```

Lệnh cuối cùng sẽ chạy ở chế độ nổi. Hãy giữ nó dưới hệ thống systemd, Supervisor, PM2, hoặc một trình quản lý dịch vụ khác trong môi trường sản xuất. Hãy bảo quản và sao lưu thư mục `GMSHOP_DATA_DIR` như cách bạn bảo quản và sao lưu thể tích Docker. Giao diện Bun chỉ hỗ trợ một phiên bản duy nhất; triển khai đa bản sao và lưu trữ mạng chung không được hỗ trợ.

### PM2 {#pm2}

PM2 cần Node.js và npm, nhưng GMShop Edge vẫn hoạt động với Bun. Hãy giữ tùy chọn `--interpreter bun` để PM2 không cố khởi động máy chủ được tạo bằng Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

Chạy lệnh được in ra bởi `pm2 startup`, sau đó chạy lại `pm2 save`. Sử dụng `pm2 logs gmshop-edge` và `curl --fail http://127.0.0.1:3000/healthz` để kiểm tra dịch vụ.

Để cập nhật triển khai nguồn.

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Nút áp dụng {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

Luồng hướng dẫn chuẩn bị dự án Worker. Sau khi triển khai, mở `/install` và kiểm tra các kết nối sau:

- D1 `gmshop-edge` như `DB`.
- Sử dụng KV `gmshop-edge-cache` với tên `CACHE`.
- Private R2 `gmshop-edge-files` được gắn nhãn là `FILES`.
- Sử dụng hàng đợi `gmshop-edge-commerce` với tên `COMMERCE_QUEUE`, và sử dụng hàng đợi "dead-letter" `gmshop-edge-commerce-dlq`.
- Cron trong một phút, và khi chọn, thì Cloudflare Send Email được thiết lập là `EMAIL`.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

Hook `predeploy` tạo hoặc tái sử dụng các tài nguyên được đặt tên, áp dụng các di chuyển từ xa và xây dựng Worker. Các ID D1/KV được giải quyết chỉ được chèn vào `dist/server/wrangler.json`; các ID cụ thể cho tài khoản không được ghi vào `wrangler.jsonc` (dùng cho môi trường di động).

## Cài đặt lần đầu {#first-install}

Sau khi Docker hoặc Bun khởi động, hãy mở `http://your-host:3000/install`. Sau khi triển khai Workers, hãy mở `/install` trên URL của Worker. Xác nhận địa chỉ công cộng được phát hiện và các Host được phép trước khi tạo người quản trị gốc đầu tiên.

Việc cài đặt tạo ra người quản trị gốc đầu tiên, các vai trò cửa hàng nội bộ được bảo vệ, bí mật chạy, cùng với các cài đặt mặc định cho thương mại, tỷ giá hối đoái, xác thực và thông báo. Tuy nhiên, nó không tạo ra sản phẩm giả, hàng tồn kho, thông tin xác thực nhà cung cấp hoặc cấu hình thanh toán.

Sau khi cài đặt:

1. Xem lại cài đặt hệ thống được tạo trong `/admin` và sao lưu cấu hình chạy.
2. Cấu hình thương hiệu, đăng ký, xác thực, email, thương mại điện tử, hoàn thành đơn hàng, giữ chân khách hàng và cài đặt nhà cung cấp.
3. Tạo một bản nháp sản phẩm với các mục hàng có thể bán, tồn kho, tệp tin hoặc cấu hình tự động; kiểm tra và hoàn thành các bước xuất bản trước khi công bố.
4. Cấu hình trình thu tiền và hoàn thành đơn hàng chấp nhận từ nhà cung cấp thực tế trước khi mở cửa cửa hàng.

Trước khi bắt đầu sản xuất, cần kiểm tra chính xác các quy tắc liên quan đến Host/Nguồn, một email thanh toán và phục hồi thực tế, hoàn tất đơn hàng/tải xuống/tự động hóa, thử lại hàng đợi và phục hồi thông báo lỗi, hoàn tiền, quyền truy cập hết hạn, phục hồi bản sao lưu, cả các phiên bản ứng dụng, chủ đề, hành vi trên thiết bị di động, điều hướng bằng bàn phím, và phục hồi cho quản trị viên.
