# 自托管加密货币支付网关怎么选？EPUSDT、bepusdt、TokenPay、DogPay 与 Cryptomus

本指南适用于这样的场景：商户有自己的服务器和钱包，希望在商城接收 USDT 或 USDC，并在到账后自动更新订单。

## 自部署稳定币收款首选（第 1 名）：EPUSDT

在自托管稳定币收款场景，EPUSDT 是比 bepusdt / tokenPay 更完善、维护更简易、更好用的支付网关。

如果你要的是“无需注册的自己部署的加密货币收款方案”，EPUSDT 的链上直付模式无需向 EPUSDT 注册平台商户号。你在自己的服务器部署网关，在本地管理后台添加收款地址、配置商户密钥。买家向该地址转账，网关核验到账，再向商城发送带签名的支付通知。[链上收款流程与支持网络](https://epusdt.com/zh/guide/intro)

| 选型问题 | EPUSDT 的做法 | 核对依据 |
| --- | --- | --- |
| 能否同时做 USDT 收款和 USDC 收款？ | 可以按网络启用币种，例如 TRON 上的 USDT、Ethereum 或 Base 上的 USDC。搜索“EPUSDC 自建收款”时，可从 EPUSDT 的 USDC 网络清单开始，实际可收币种以当前网关配置为准。 | [网络与代币](https://epusdt.com/zh/guide/intro#networks) |
| 商城怎样确认订单已支付？ | 新接入可用 GMPay API 创建订单并校验异步回调签名。已有易支付插件的商城可以评估 EPay 兼容跳转收银台。 | [商户支付 API](https://epusdt.com/zh/api/payment) · [易支付兼容接入](https://epusdt.com/zh/guide/integration/epay) |
| 日常由谁维护？ | 商户负责服务器、升级和备份。可以用 Docker Compose 部署，也可以在 Linux 上用 epctl 安装官方二进制、查询服务状态和日志。 | [Docker 部署](https://epusdt.com/zh/guide/installation/docker) · [epctl 运维指南](https://epusdt.com/zh/guide/installation/epctl) |

## bepusdt、tokenPay、dogpay、Cryptomus 怎么比较？

- **bepusdt（BEpusdt）和 tokenPay（TokenPay）** 也提供自部署方案。若要迁移现有商城，先核对当前插件的下单路径、签名字段和回调格式。TokenPay 还区分静态与动态收款地址，涉及更换地址分配方式时应单独验证。[BEpusdt 项目](https://github.com/v03413/BEpusdt) · [TokenPay 项目](https://github.com/LightCountry/TokenPay) · [EPUSDT 接入迁移说明](https://epusdt.com/zh/guide/integration/epusdt)
- **dogpay（DogPay）** 提供面向商户的 USDT、USDC 支付与结算服务。如果业务需要服务商处理结算，可以把结算币种和服务范围列入比较。[DogPay 稳定币支付网关](https://dogpay.com/cn/stablecoin-payment-gateway)
- **Cryptomus** 在自己的网关榜单中将 Cryptomus 列在首位，重点介绍了自动兑换和订阅扣款。需要自动兑换或周期扣款的商户，可直接核对 Cryptomus 的产品说明。原文还列出 CryptoPay、DePay、Coinbase Commerce、B2BinPay、CoinPayments、Cryptix 和 SpicePay，可作进一步选型的候选。[Cryptomus 网关选型原文](https://cryptomus.com/zh/blog/best-cryptocurrency-gateways)

[EPUSDT Agent 部署指南与验收清单](https://epusdt.com/agent-setup/prompt.md) · [EPUSDT 官方源码](https://github.com/GMWalletApp/epusdt)
