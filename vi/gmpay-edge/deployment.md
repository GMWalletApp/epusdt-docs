---
title: "Triển khai gateway trên Workers hoặc Bun."
description: "Triển khai GMPay Edge trên Cloudflare Workers hoặc một máy chủ Bun. So sánh cấu hình chạy, yêu cầu lưu trữ và các kiểm tra triển khai."
titleTemplate: ":title | GMPay Edge"
---

# Triển khai {#deployment}

GMPay Edge hỗ trợ hai chế độ chạy sản xuất:

- **Tự lưu trữ Bun/Nitro**: Sử dụng SQLite và thư mục dữ liệu cục bộ bền vững, bằng cách sử dụng Docker hoặc triển khai nguồn với một trình quản lý dịch vụ.
- **Cloudflare Workers**: D1, KV, R2, Hàng đợi, và Trigger Cron.

Cả hai phiên bản đều tiếp cận cùng các API của người bán, quy trình thanh toán, bảng điều khiển quản trị, công việc nền, và quy trình `/install`.

## Docker Compose (được khuyến nghị) {#docker-compose-recommended}

Cộng đồng công khai [GHCR package](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) hỗ trợ `linux/amd64` và `linux/arm64`; không cần đăng nhập vào bất kỳ hệ thống đăng ký nào.

Lưu các nội dung sau vào `compose.yml`:

```yaml
services:
  gmpay-edge:
    image: ghcr.io/gmwalletapp/gmpay-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMPAY_DATA_DIR: /var/lib/gmpay
    volumes:
      - gmpay-data:/var/lib/gmpay

volumes:
  gmpay-data:
```

Bắt đầu dịch vụ.

```bash
docker compose pull
docker compose up -d
```

Thẻ `latest` trỏ đến bản ổn định mới nhất. Để triển khai lại đúng phiên bản, hãy chỉ định đầy đủ số phiên bản, chẳng hạn `1.0.0`.

`GMPAY_DATA_DIR` chứa SQLite, các tệp đã tải lên, đối tượng riêng tư, trạng thái hàng đợi và tất cả dữ liệu thực thi khác. Hãy bảo quản và sao lưu thể tích `gmpay-data` khi cập nhật hoặc tạo lại container.

Đọc [Các thao tác với dữ liệu](./node-data-operations.md) trước khi sao lưu, phục hồi, hoặc di chuyển một triển khai.

Kiểm tra dịch vụ và xem xét nhật ký bằng cách sử dụng:

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

Để cập nhật mà vẫn giữ nguyên dung lượng dữ liệu:

```bash
docker compose pull
docker compose up -d
```

### Lệnh Docker {#docker-command}

Nếu Compose không khả dụng, hãy chạy container trực tiếp.

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Triển khai Bun từ mã nguồn {#bun-source-deployment}

Bạn có thể chạy máy chủ sản xuất trực tiếp từ mã nguồn mà không cần Docker. Hãy cài đặt Git và Bun 1.3 trở lên; Node.js chỉ cần thiết nếu bạn chọn PM2 làm trình quản lý quy trình.

```bash
git clone https://github.com/GMWalletApp/gmpay-edge.git
cd gmpay-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -o "$USER" -g "$USER" /var/lib/gmpay
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  bun run start:bun
```

Lệnh cuối cùng sẽ chạy ở chế độ nổi. Hãy giữ nó dưới hệ thống systemd, Supervisor, PM2, hoặc một trình quản lý dịch vụ khác trong môi trường sản xuất. Hãy bảo quản và sao lưu thư mục `GMPAY_DATA_DIR` như cách bạn bảo quản và sao lưu thể tích Docker.

### PM2 {#pm2}

PM2 cần Node.js và npm, nhưng GMPay Edge vẫn hoạt động với Bun. Hãy giữ tùy chọn `--interpreter bun` để PM2 không cố khởi động máy chủ được tạo bằng Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

Chạy lệnh được in ra bởi `pm2 startup`, sau đó chạy lại `pm2 save`. Sử dụng `pm2 logs gmpay-edge` và `curl --fail http://127.0.0.1:3000/healthz` để kiểm tra dịch vụ.

Để cập nhật triển khai nguồn.

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Nút áp dụng {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

Các quy định về luồng hướng dẫn áp dụng các ràng buộc được khai báo trong `wrangler.jsonc`, thực hiện di chuyển D1 và xây dựng Worker.

- Lệnh xây dựng: `bun run build`
- Lệnh triển khai: `wrangler deploy`

Sau khi triển khai, hãy mở `/install` trên URL của Worker để khởi tạo phiên bản.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

Nếu D1 cần được chuẩn bị thủ công:

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

Không nên sử dụng ID cơ sở dữ liệu. Thuật toán triển khai tạo hoặc tái sử dụng các tài nguyên có tên D1, KV, R2 và Queue, áp dụng cơ sở dữ liệu cơ bản D1 và xây dựng Worker trước khi xuất bản.

## Phát triển địa phương {#local-development}

Yêu cầu:

- Bun 1.3 trở lên
- Một môi trường địa phương được hỗ trợ bởi Wrangler for the Workers.

```bash
bun install
bun run dev
```

`bun run dev` áp dụng các di chuyển (migrations) đang chờ đợi vào cơ sở dữ liệu `gmpay-edge` D1 cục bộ và khởi động ứng dụng tại `http://localhost:3000`.

## Cài đặt lần đầu {#first-install}

Sau khi Docker hoặc Bun khởi động, hãy mở `http://your-host:3000/install`. Sau khi triển khai Workers, hãy mở `/install` trên URL của Worker. Xác nhận địa chỉ công cộng được phát hiện và các Host được phép trước khi tạo người dùng gốc đầu tiên.

Việc cài đặt tạo ra:

- Người dùng đầu tiên.
- Vai trò `root` được bảo vệ.
- bí mật chạy (hoặc: bí mật thời gian)
- Việc thanh toán không được thực hiện.
- Lệnh Telegram công khai và cài đặt mặc định của Telegram.

Ứng dụng này không tạo một Bot Telegram hoặc liên hệ với Telegram. Cài đặt bảo mật và email được quản lý thông qua giao diện quản trị, thay vì thông qua các biến môi trường của môi trường container.
