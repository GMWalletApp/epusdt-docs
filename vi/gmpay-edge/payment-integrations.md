---
title: "Thanh khoản, thanh toán qua sàn giao dịch và ví."
description: "Xem xét các tích hợp trên chuỗi, sàn giao dịch và ví trong GMPay Edge, và tìm hiểu xem những tùy chọn nào được hiển thị khi thanh toán."
titleTemplate: ":title | GMPay Edge"
---

# Tích hợp thanh toán {#payment-integrations}

GMPay Edge bao gồm các trình điều hợp (adapters) cho chuỗi, trao đổi và ví. Việc hiển thị thông tin thanh toán được kiểm soát riêng thông qua các phương pháp nhận (receiving) đã được cấu hình.

Phương pháp này cần có cấu hình kết nối công khai hoặc tài khoản đọc-chỉ phù hợp, đồng thời phải vượt qua các kiểm tra tính khả dụng trước khi có thể được cung cấp cho người thanh toán.

| Kiểu | Tích hợp | Tài sản tích hợp |
| --- | --- | --- |
| Trên chuỗi | TRON / TRC20 | USDT, TRX |
| Trên chuỗi | Ethereum / ERC20 | USDT, USDC, ETH |
| Trên chuỗi | Base | USDT, USDC, ETH |
| Trên chuỗi | BNB Smart Chain / BEP20 | USDT, USDC, BNB |
| Trên chuỗi | Hình đa giác | USDT, USDC, MATIC |
| Trên chuỗi | TON | USDT, GRAM |
| Trên chuỗi | Aptos | USDT, USDC |
| Trên chuỗi | Solana | USDT, USDC |
| Sàn giao dịch | Binance | USDT, USDC |
| Sàn giao dịch | OKX | USDT, USDC |
| Ví | OKPay | USDT, TRX |

Các tích hợp sẵn có có nghĩa là khả năng này đã được tích hợp trong dự án. Tuy nhiên, việc sử dụng trong môi trường thực tế vẫn đòi hỏi các điểm cuối (endpoints) thuộc sở hữu của người triển khai, thông tin truy cập chỉ đọc, phương thức nhận dữ liệu được cấu hình, sao lưu, giám sát, và các bài kiểm tra chấp nhận trên nền tảng thực tế.
