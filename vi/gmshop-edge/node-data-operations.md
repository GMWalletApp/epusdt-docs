---
description: "Sao lưu và khôi phục dữ liệu GMShop Edge SQLite và các đối tượng riêng trên Bun, đồng thời xem xét các đường dẫn nhập liệu từ Cloudflare D1 và R2."
titleTemplate: ":title | GMShop Edge"
---

# Quản lý dữ liệu Bun {#bun-data-operations}

Runtime Bun duy trì cơ sở dữ liệu SQLite chính tại `$GMSHOP_DATA_DIR/gmshop.sqlite` và các đối tượng riêng tư trong cùng thư mục dữ liệu. Hãy sử dụng lệnh CLI `bun run data -- …` được quản lý thay vì sao chép một tệp SQLite đang hoạt động.

## Sao lưu và khôi phục {#backup-and-restore}

Dừng hoạt động của container trước khi sao lưu hoặc khôi phục, để đảm bảo cơ sở dữ liệu, đối tượng riêng và trạng thái hàng đợi bền vững duy trì ở một thời điểm logic duy nhất.

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

Sao lưu chỉ chấp nhận các mục tiêu mới hoặc trống, và không bao giờ ghi đè lên các bản cài đặt hiện có.  File manifest kiểm tra tất cả các tệp, đồng thời, quá trình khôi phục cũng kiểm tra tính toàn vẹn của SQLite, khóa ngoại và checksum của các bản di chuyển bất biến.

Hình ảnh được công bố bao gồm cùng một CLI:

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

Sao lưu chứa thông tin đăng nhập, hồ sơ khách hàng, đơn hàng, tồn kho mặc định, tải xuống riêng tư và các thành phần tự động hóa. Mã hóa khi đang lưu, hạn chế quyền truy cập và kiểm tra phục hồi thường xuyên.

CLI sử dụng `$GMSHOP_DATA_DIR/.maintenance.lock`. Nếu hệ thống gặp sự cố và để lại file khóa, trước tiên hãy kiểm tra xem không có dịch vụ hoặc lệnh dữ liệu nào đang sử dụng thư mục này. Sau đó, chỉ xóa file khóa cũ.

## Nhập một bản xuất từ Cloudflare {#import-a-cloudflare-export}

Xuất D1 dưới dạng đối tượng SQL và R2 vào một thư mục cục bộ, sao cho các đường dẫn tương đối khớp với các khóa gốc. Chỉ nhập vào thư mục dữ liệu Bun mới hoặc trống.

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` là tùy chọn khi phiên bản không có đối tượng nào. `--r2-manifest` cũng là tùy chọn, nhưng cần `--r2-dir`; nó lưu trữ thông tin HTTP R2 và thông tin tùy chỉnh.

Nhà nhập khẩu xác minh các chuyển đổi kho lưu trữ, tính toàn vẹn của SQLite và khóa ngoại, sau đó chuyển đổi các khóa R2 thành bố cục đối tượng đã được băm riêng tư. Hệ thống loại bỏ các đường dẫn không an toàn, dữ liệu siêu dữ liệu không rõ, siêu dữ liệu mà không có đối tượng, và các mục tiêu không trống. Không có chế độ ghi đè hoặc đồng bộ hai chiều.
