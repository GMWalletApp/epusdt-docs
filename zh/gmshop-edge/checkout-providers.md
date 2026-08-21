# 结账与 Provider

GMShop Edge 在商城部署内持有结账、订单状态、Provider 凭证与通知投递。

## 结账模型

商城通过 D1 汇率维护客户可选的法币。结账时系统建立一份不可变报价，并把报价交给选定的类型化 Provider。

这表示：

- 商城订单金额以最小货币单位整数追踪，不使用浮点数。
- 结账 Provider 凭证属于部署者拥有的运行时配置。
- 生产验收应使用部署者自己的 Provider 账号与真实服务商测试订单。

## Provider 秘密

Provider 秘密属于运行时配置。请在管理后台录入；不要提交 `.dev.vars`、服务商凭证、运行时秘密、私钥或 Cloudflare 凭证。

## 邮件 Provider

交易邮件使用模板产生，可通过以下 Provider 投递：

- SMTP。
- Resend。
- Postmark。
- SendGrid。
- Mailgun。
- 通过 `EMAIL` binding 使用 Cloudflare Send Email。

邮件记录保留投递状态，Queue 与 Cron 提供有界重试。

## 认证 Provider

Better Auth 提供账号身份能力。应用可在运行时配置信箱密码、社交、OIDC 与 Telegram 登录 Provider，无需重新构建 Worker。

## 安全检查

生产前请配置精确 Allowed Hosts、HTTPS、Origin 与 CSRF 校验、限流、Queue/DLQ 监控、管理员恢复与备份。请实际测试 D1 与 R2 恢复，不要把未经恢复验证的备份视为完成。
