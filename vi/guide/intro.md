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

| Mạng | ID mạng API | Tài sản mặc định |
| --- | --- | --- |
| TRON | `tron` | TRX, USDT |
| Ethereum | `ethereum` | USDT, USDC |
| BNB Smart Chain | `binance` | USDT, USDC |
| Polygon PoS | `polygon` | USDT, USDC, USDC.e |
| Solana | `solana` | SOL, USDT, USDC |
| TON | `ton` | TON, USDT |
| Plasma | `plasma` | USDT |
| Aptos | `aptos` | USDT, USDC |
| Sui | `sui` | SUI, USDC |
| Arbitrum One | `arbitrum` | ETH, USDC |
| Base | `base` | ETH, USDC |
| OP Mainnet | `optimism` | ETH, USDC |
| Avalanche C-Chain | `avalanche` | AVAX, USDC |
| HyperEVM | `hyperevm` | HYPE, USDC |
| Monad | `monad` | MON, USDC |
| Arc | `arc` | USDC |

Arc chấp nhận cả USDC gốc và USDC ERC-20. Trên Polygon, USDC và USDC.e là các tài sản riêng biệt.

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
