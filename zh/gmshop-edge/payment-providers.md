# 支付與 Provider

GMShop Edge 將支付 Provider 作為本商城訂單的外部收銀適配器使用。它不是商戶閘道，也不對外提供 GMPay 相容商戶 API。

## 支付模型

商城透過 D1 匯率維護客戶可選的法幣。結帳時系統建立一份不可變報價，並把報價交給選定適配器，例如 Stripe、GMpay、EPay 或其他類型化 Provider。

這表示：

- GMpay 與 EPay 是本商城訂單的外部託管收銀適配器。
- 專案不掃描公鏈，也不運行交易所 / 錢包收款適配器。
- 專案不向第三方簽發商戶 PID / secret_key 憑證。
- 生產驗收必須使用部署者自己的 Provider 帳號與真實服務商測試訂單。

## Provider 秘密

Provider 秘密屬於執行時配置。請在管理後臺錄入；不要提交 `.dev.vars`、服務商憑證、執行時秘密、私鑰或 Cloudflare 憑證。

## 郵件 Provider

交易郵件使用模板產生，可透過以下 Provider 投遞：

- SMTP。
- Resend。
- Postmark。
- SendGrid。
- Mailgun。
- 透過 `EMAIL` binding 使用 Cloudflare Send Email。

郵件記錄保留投遞狀態，Queue 與 Cron 提供有界重試。

## 認證 Provider

Better Auth 提供帳號身份能力。應用可在執行時配置信箱密碼、社交、OIDC 與 Telegram 登入 Provider，無需重新構建 Worker。

## 安全檢查

生產前請配置精確 Allowed Hosts、HTTPS、Origin 與 CSRF 校驗、限流、Queue/DLQ 監控、管理員恢復與備份。請實際測試 D1 與 R2 恢復，不要把未經恢復驗證的備份視為完成。
