# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) 是面向 **Cloudflare Workers** 的自托管、单部署、单租户数字商品商城。

一个部署即可提供响应式公开商城、客户中心、结账与交付，以及用于运营数字商品的权限驱动管理后台。

> GMShop Edge 仍在持续开发。内建适配器表示项目已实作相关接入路径；生产使用仍需要部署者自己的服务商凭证、备份、监控与真实服务商验收测试。

## 它提供什么

- 响应式公开商城、客户中心、结账流程，以及权限驱动的管理后台。
- 销售预置库存商品，原子分配加密保存的卡密、账号、启用码或凭证。
- 从 ACG `3.5.5` V4 Open API 或独角数卡 Next `v1.3.1` 同步上游商品，并按 API 来源使用等优先级账号池履约。
- R2 私有下载交付、自动化商品、优惠券、退款、售后、保留策略与审计记录。
- 游客与注册客户结账，使用 Better Auth 用户与已验证结账信箱形成统一商业身份模型。
- 通过 SMTP、Resend、Postmark、SendGrid、Mailgun 或 Cloudflare Send Email 发送交易邮件。
- 在 D1 维护商城自有法币汇率，将不可变报价交给类型化结账 Provider。
- 运行时配置信箱密码、社交、OIDC 与 Telegram 登录 Provider。
- 以动态多角色 RBAC 保护 `/admin`，包含不可移除的 root 约束与服务端权限校验。
- 英文（`en-US`）与简体中文（`zh-CN`）两种接口语言。

## 文件章节

- [架构](./architecture.md)：Worker 入口、Cloudflare bindings、数据权威来源、伫列与模组边界。
- [部署](./deployment.md)：一键部署、Wrangler CLI、bindings、本地开发与首次安装。
- [交易与交付](./commerce-fulfillment.md)：商品、库存、上游供货、交付记录、客户归属与自动化商品。
- [结账与 Provider](./checkout-providers.md)：商城结账模型、法币报价、邮件与登录 Provider。

## 相关连结

- 仓库：[GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- English README：[README.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.md)
- 中文 README：[README.zh-CN.md](https://github.com/GMWalletApp/gmshop-edge/blob/main/README.zh-CN.md)
- OpenAPI YAML：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
