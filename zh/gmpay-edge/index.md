# GMPay Edge

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge) 是支持 **Cloudflare Workers 或 Node/Nitro Docker** 的自托管单租户加密货币支付网关。

它是独立于 Epusdt 的另一个项目。如果需要本文件站描述的 Go 版本网关，请使用 Epusdt；如果需要可部署到 Cloudflare Workers，或以 Docker 容器搭配 SQLite 本地持久化执行的 TypeScript 网关，可以评估 GMPay Edge。

> GMPay Edge 仍在持续开发。内建接入表示项目已实作相关能力；正式生产使用仍需要部署者自己的端点或只读凭证、配置完成的收款方式、备份、监控，以及真实平台验收测试。

## 它提供什么

- 带签名的 GMPay 商户 API，支持 JSON 与表单输入。
- 在 API 边界兼容 EPay，但不维护第二套订单模型。
- 响应式收银台、管理后台、公共状态页与运行时 OpenAPI 文档。
- 通过 Queue-backed outbox 可靠投递 Webhook，保留重试历史、人工重试与审计记录。
- 通过各运行环境对应的可靠伫列与排程器执行支付扫描、过期处理、清理、连接健康检查与汇率同步。
- 使用 Better Auth、TOTP 与动态多角色 RBAC 保护管理后台。
- 通过 grammY 管理 Telegram Bot，支持 Inline 下单、公共指令与通知订阅。
- 六语言用户接口。

## 文件章节

- [架构](./architecture.md)：Workers 与 Node 运行时服务、队列、回调和协议边界。
- [部署](./deployment.md)：Docker Compose、GHCR 镜像、Deploy Button、Wrangler CLI、本地开发和首次安装。
- [Node 数据操作](./node-data-operations.md)：备份、恢复及 Cloudflare D1/R2 导入。
- [商户 API](./merchant-api.md)：GMPay 订单创建、查询、签名、回调和 EPay 兼容。
- [支付接入](./payment-integrations.md)：内建链上、交易所与钱包适配器目录。

## 相关连结

- 仓库：[GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- English README：[README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- 中文 README：[README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
