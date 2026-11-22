---
description: "Tìm cơ sở dữ liệu GMPay Edge SQLite và các đối tượng riêng trong một triển khai Bun, và làm theo các quy trình sao lưu, phục hồi và di chuyển."
titleTemplate: ":title | GMPay Edge"
---

# Quản lý dữ liệu Bun {#bun-data-operations}

Việc triển khai Bun giữ lại cơ sở dữ liệu SQLite của nó ở `$GMPAY_DATA_DIR/gmpay.sqlite` và các đối tượng riêng tư ở `$GMPAY_DATA_DIR/objects`. Cả giao diện dòng lệnh (CLI) và máy chủ ứng dụng đều chạy với Bun và trình điều khiển SQLite của nó.

## Sao lưu và khôi phục {#backup-and-restore}

Dừng container GMPay Edge trước khi sao lưu hoặc khôi phục để đảm bảo rằng cơ sở dữ liệu và các tệp đối tượng vẫn ở cùng một điểm thời gian logic.

```bash
GMPAY_DATA_DIR=/srv/gmpay bun run data -- backup --output /srv/backups/gmpay-backup
GMPAY_DATA_DIR=/srv/gmpay-restored bun run data -- restore --input /srv/backups/gmpay-backup
```

Hình ảnh đã được công bố hiển thị cùng CLI. Sau khi dừng dịch vụ, hãy gắn kết thư mục sao lưu bên ngoài và thực hiện:

```bash
docker compose stop gmpay-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmpay-edge bun run data -- backup --output /backups/gmpay-backup
```

Đường dẫn đầu vào hoặc đầu ra luôn được chỉ rõ. Sao lưu đầu ra phải nằm bên ngoài thư mục dữ liệu. Khôi phục chỉ chấp nhận một đích mới hoặc trống, và không bao giờ ghi đè lên một thư mục không trống. Manifest kiểm tra mọi tệp; khôi phục cũng chạy các kiểm tra tính toàn vẹn, khóa ngoại và kiểm tra checksum của di chuyển.

Sao lưu chứa thông tin đăng nhập, dữ liệu người dùng, ghi chú thanh toán và tải lên riêng tư. Mã hóa khi đang lưu, hạn chế quyền truy cập và kiểm tra phục hồi thường xuyên.

## Nhập một bản xuất từ Cloudflare {#import-a-cloudflare-export}

Xuất D1 dưới dạng SQL và xuất các đối tượng R2 vào một thư mục cục bộ, với các đường dẫn tương đối dựa trên các khóa đối tượng gốc. Sau đó, nhập vào một thư mục dữ liệu Bun mới hoặc trống.

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMPAY_DATA_DIR=/srv/gmpay bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` là tùy chọn khi phiên bản không có đối tượng nào. `--r2-manifest` cũng là tùy chọn, nhưng cần `--r2-dir`; sử dụng nó để giữ lại thông tin HTTP R2 và thông tin tùy chỉnh. Đây là một đối tượng JSON được đánh chỉ mục bằng khóa đối tượng R2 ban đầu.

```json
{
  "evidence/receipt.txt": {
    "httpMetadata": {
      "contentType": "text/plain; charset=utf-8",
      "cacheExpiry": "2026-09-01T00:00:00.000Z"
    },
    "customMetadata": { "orderId": "order-123" }
  }
}
```

Các trường HTTP được hỗ trợ là `contentType`, `contentLanguage`, `contentDisposition`, `contentEncoding`, `cacheControl`, và một ISO 8601 `cacheExpiry`. Các trường không rõ, dữ liệu tùy chỉnh không phải là chuỗi, và khóa manifest mà không có đối tượng được xuất, sẽ bị từ chối. Nếu không có thông tin phụ trợ này, dữ liệu byte và khóa đối tượng sẽ được nhập, nhưng dữ liệu R2 không thể được tái tạo.

Việc nhập dữ liệu xác minh rằng tất cả các di chuyển của kho lưu trữ tồn tại trong bản xuất D1, ghi lại các checksum cho trình chạy di chuyển Bun, xác minh các khóa ngoại, và chuyển đổi các đường dẫn khóa R2 thành bố cục riêng tư đã được mã hóa. Nó từ chối một mục tiêu trống, do đó, một việc nhập hoặc lặp lại không thành công không thể ghi đè một bản sao hiện có.
