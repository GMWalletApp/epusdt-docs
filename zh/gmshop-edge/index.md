# GMShop Edge

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) 是一个可自托管、单部署、单租户的数字商品商城，可运行在 **Cloudflare Workers** 或 **Bun/Nitro Docker 容器**中。

一次部署即可提供响应式商城、用户账户、结账与交付、Telegram 集成、供应商运营以及基于权限的管理后台。

它是独立于 Epusdt 和 GMPay Edge 的配套项目。当你需要运营带商品目录、结账、交付和供应商流程的数字商品商城时，应选择 GMShop Edge。

> GMShop Edge 正在积极开发中。内置适配器表示项目已实现对应集成路径；生产使用仍需部署者提供凭据、备份、监控，并完成真实服务商验收测试。

## 核心能力

- 原子分配加密预置文本的库存商品、私有下载商品，以及带明确产物策略的自动化商品。
- 永久、固定期限、限次、无限、免费、一次性及用户续期等权益策略。
- 游客与注册用户结账、优惠券、退款、售后、私有订单查询及基于账户的交付访问。
- 商城余额支付，以及 Stripe、Cryptomus、GMpay、EPay、支付宝网页/WAP、微信 Native/H5 适配器。
- 通过 ACG `3.5.5`、Dujiao Next `v1.3.1` 或原生 GMShop Edge 供应商 API 同步商品并完成交付。
- 运行时配置邮箱密码、社交登录、OIDC、Telegram OIDC、Telegram 登录组件和 Telegram Mini App 身份验证。
- 基于 grammY Webhook 的机器人，支持本地化命令、Mini App 按钮，以及不保存消息内容的 Forum Topic 客服。
- `/admin` 动态多角色 RBAC，包括根账户保护、服务端权限校验、重新验证和审计记录。
- 英文（`en-US`）和简体中文（`zh-CN`）应用界面。

以上能力均属于开源项目，不另设 Pro 或 Enterprise 版本。

## 文档目录

- [架构](./architecture.md)：共享应用栈、Workers 绑定、Bun 适配器、数据归属和运行限制。
- [部署](./deployment.md)：Workers、Bun/Docker、初始化和生产验收。
- [Bun 数据操作](./node-data-operations.md)：备份、恢复及 Cloudflare D1/R2 导入。
- [原生供应商 API](./supplier-api.md)：GMShop Edge 实例间经过签名的商品目录、订单、支付通道和充值操作。
- [商业与交付](./commerce-fulfillment.md)：商品、库存、供应商、交付记录、权益和自动化商品。
- [结账与服务商](./checkout-providers.md)：余额与外部支付、法币报价、邮件、身份验证和 Telegram 客服。

## 链接

- 仓库：[GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- 部署清单：[`docs/DEPLOYMENT.zh-CN.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.zh-CN.md)
- Bun 数据操作：[`docs/NODE_DATA_OPERATIONS.zh-CN.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.zh-CN.md)
- OpenAPI：[`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
