---
description: "Tìm các mạng và token mà EPUSDT hỗ trợ, cấu hình địa chỉ nhận, và làm theo một giao dịch từ thông báo thanh toán đã hoàn tất đến thông báo thanh toán đã được xác nhận."
title: "Các mạng lưới được hỗ trợ, các token và thanh toán của người bán"
---

# Giới thiệu {#introduction}

EPUSDT là một cổng thanh toán được quản lý độc lập. Khi một người bán tạo đơn hàng, người mua thanh toán khi thanh toán, và cổng thanh toán sẽ gửi thông báo đã ký sau khi thanh toán được xác minh. Thanh toán trực tiếp trên chuỗi sẽ được chuyển đến địa chỉ nhận của người bán.

Để triển khai với Codex, Claude Code, Cursor hoặc OpenCode, hãy gửi cho Agent [hướng dẫn triển khai và danh sách kiểm tra nghiệm thu](https://epusdt.com/agent-setup/prompt.md).

## Thiết lập thanh toán đầu tiên {#set-up-your-first-payment}

1. [Triển khai cổng thanh toán](/vi/guide/installation/docker) và đặt URL HTTPS công khai cho trang thanh toán.
2. Trong bảng điều khiển quản trị, hãy kích hoạt một mạng và một tài sản, đồng thời thêm địa chỉ nhận. Tạo khóa API cho người bán và lưu `pid` và `secret_key` của bạn trên máy chủ.
3. [Tạo đơn hàng GMPay](/vi/api/payment#create) và chuyển người mua tới `payment_url`. Nếu đã tích hợp EPay, hãy dùng [quy trình chuyển hướng EPay](/vi/guide/integration/epay).

## Chuỗi và token được hỗ trợ {#networks}

Việc thanh toán cung cấp một tài sản thanh toán trực tiếp khi mạng lưới và tài sản của nó được kích hoạt, và khi một địa chỉ nhận được đã được cấu hình. Đây là cài đặt mặc định trong cài đặt mới. Hãy đọc `data.supported_assets` từ `GET /payments/gmpay/v1/config` để biết các tùy chọn cho cổng thanh toán của bạn.

Dấu gạch ngang biểu thị đồng gốc không có hợp đồng. Người mua chuyển tiền đến địa chỉ nhận ghi trong đơn hàng. Các địa chỉ bên dưới chỉ dùng để xác định tài sản.

<div class="asset-directory">

| Mạng (ID trong API) | Token | Địa chỉ hợp đồng / ID tài sản | Số chữ số thập phân |
| --- | --- | --- | ---: |
<!--@include: @/.vitepress/data/asset-rows.md-->

</div>

Arc chấp nhận cả USDC gốc và USDC ERC-20. Trên Polygon, USDC và USDC.e là các tài sản riêng biệt.

### A7A5 (TRC-20 / ERC-20) {#a7a5}

A7A5 được neo theo đồng rúp Nga. Hãy bật A7A5 riêng trên từng mạng cần dùng (TRON hoặc Ethereum) và thêm ví nhận tiền của mạng đó. Nếu dùng tỷ giá cố định, hãy thêm tỷ giá `a7a5` cho từng đồng tiền lập hóa đơn. Giá trị này là số A7A5 cho một đơn vị tiền lập hóa đơn.

Trên phiên bản hỗ trợ A7A5, hãy dùng các trường sau để chọn tài sản trong đơn hàng GMPay. Bản cài đặt cũ có thể cần nâng cấp.

| GMPay `network` | GMPay `token` | EPay `type` |
| --- | --- | --- |
| `tron` | `A7A5` | `a7a5.tron` |
| `ethereum` | `A7A5` | `a7a5.ethereum` |

[TRONSCAN](https://tronscan.org/#/token20/TLeVfrdym8RoJreJ23dAGyfJDygRtiWKBZ) · [Etherscan](https://etherscan.io/token/0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9)

### Phương thức thanh toán được tích hợp {#hosted-payment-methods}

OKX OnchainOS trên lớp X hỗ trợ USDC, USDT và USDG. OKPay hỗ trợ USDT và TRX theo mặc định. Kích hoạt từng nhà cung cấp riêng lẻ. Tham khảo các tùy chọn của chúng từ `data.xlayer` hoặc `data.okpay`.

## Từ quá trình chuyển đổi đến hoàn thành {#from-transfer-to-fulfillment}

ChainScanner hoạt động mặc định trong EPUSDT. Khi nó phát hiện giao dịch phù hợp, đơn hàng sẽ chuyển sang **5 · Xác nhận**. Với kiểm tra nghiêm ngặt được kích hoạt (mặc định), cần độ sâu xác nhận và kết quả so khớp từ hai nút độc lập để đạt đến **2 · Thanh toán**. Sau hai vòng không thành công, đơn hàng sẽ chuyển sang **6 · Xem xét thủ công**. Chỉ thực hiện đơn hàng sau khi xác minh callback thành công đã được ký.

## Ảnh chụp màn hình {#screenshots}

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="Tổng quan" height="200"><br>
      <sub>Tổng quan</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="Bảng điều khiển quản trị" height="200"><br>
      <sub>Bảng điều khiển quản trị</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="Trang thanh toán" height="200"><br>
      <sub>Trang thanh toán</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="Trang thanh toán" height="200"><br>
      <sub>Trang thanh toán</sub>
    </td>
  </tr>
</table>

## Dự án liên quan và kiểm toán {#related-projects-and-audit}

- [GMPay Edge](/vi/gmpay-edge/) · Cổng thanh toán chạy trên Workers hoặc Bun.
- [GMShop Edge](/vi/gmshop-edge/) · Cửa hàng bán sản phẩm số.
- [Kiểm toán bảo mật EPUSDT, tháng 5 năm 2026](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
