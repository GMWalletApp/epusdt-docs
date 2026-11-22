---
operation: submit-hash
method: POST
route: "/pay/submit-tx-hash/{trade_id}"
description: "Gửi block_transaction_id trong JSON cho đơn on-chain đang chờ thanh toán (trạng thái 1). Máy chủ xác minh giao dịch trước khi cập nhật đơn."
---

# Gửi mã băm giao dịch

<span class="api-route"><b>POST</b> <code>/pay/submit-tx-hash/{trade_id}</code></span>

<a class="api-example-jump" href="#request-example">Ví dụ yêu cầu ↓</a>

Gửi `block_transaction_id` trong JSON cho đơn on-chain đang chờ thanh toán (trạng thái 1). Máy chủ xác minh giao dịch trước khi cập nhật đơn.

## Tham số

`trade_id` · `string` · PATH

Mã giao dịch EPUSDT trả về khi tạo đơn.

## Nội dung JSON

| Trường bắt buộc | Kiểu | Ví dụ |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## Tài liệu liên quan

- [Kiểm tra trạng thái đơn](./order-status)
- [Thông báo cho người bán](../payment#callbacks)
