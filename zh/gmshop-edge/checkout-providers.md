# 結帳與 Provider

GMShop Edge 在商城部署內持有結帳、訂單狀態、Provider 憑證與通知投遞。

## 結帳模型

商城透過 D1 匯率維護客戶可選的法幣。結帳時系統建立一份不可變報價，並把報價交給選定的類型化 Provider。

這表示：

- 商城訂單金額以最小貨幣單位整數追蹤，不使用浮點數。
- 結帳 Provider 憑證屬於部署者擁有的執行時配置。
- 生產驗收應使用部署者自己的 Provider 帳號與真實服務商測試訂單。

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
