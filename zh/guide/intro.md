# 项目简介

## 安全审计

Epusdt 已完成第三方安全审计。
[查看安全审计报告](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)

## 目前源代码实际提供什么

`Epusdt` 是一个由 **Go** 编写的私有化 **加密支付网关**。

GMWalletApp 组织也维护 [GMPay Edge](/zh/gmpay-edge/)。它是支持 Cloudflare Workers 或 Bun/Nitro Docker 的独立网关，共用 GMPay / EPay 商户协议语境，但不是 Epusdt 的同一套运行时或部署模型。

如果需要数字商品商城，请看 [GMShop Edge](/zh/gmshop-edge/)，它是独立的 Cloudflare Workers 商城，负责商品、结账、交付与管理后台。

当前源代码对外提供两条建立订单主流程：

- **GMPay**：`POST /payments/gmpay/v1/order/create-transaction`
- **EPay 兼容**：`GET/POST /payments/epay/v1/order/create-transaction/submit.php`

另外还提供：

- `/pay/*` 之下的托管收银台页面
- 收银台切换网络：`POST /pay/switch-network`
- 前端 / 收银台初始化用的公开支付配置：`GET /payments/gmpay/v1/config`
- `/admin/api/v1/*` 管理 API，用于管理 API Keys、链、代币、钱包地址、通知通道与设置
- 后台汇率设置支持二选一：配置汇率 API 地址，或直接填写强制 USDT 汇率；如果只使用强制汇率，API 地址可以留空

## 商户凭证模型

目前支付 API 不再依赖单一全域密钥。

现在每个商户都对应后台建立的一条 **API key**：

- `pid`
- `secret_key`
- 可选 `ip_whitelist`
- 可选默认 `notify_url`

GMPay 与 EPay 入站请求都会先根据 `pid` 找到对应 API key，再使用该笔数据的 `secret_key` 验签。

## 支持的链与代币

目前源代码不再把固定的公开链清单直接写死在文件层。

`GET /payments/gmpay/v1/config` 的响应来自实际后台数据。

其中 `data.supported_assets` 会根据以下数据实时组装：

- 已启用的 `chains`
- 已启用的 `chain_tokens`
- 该链上存在可用 `wallet_address`

同一个响应还会带出公开站点 / 收银台品牌信息，以及 EPay / OkPay 前端配置字段。

也就是说，真正可用的网络与代币，取决于管理后台目前启用了什么。

## 首次安装

若首次启动时没有配置文件，Epusdt 会直接进入内建 **安装向导**。先在浏览器完成数据库、域名与初始化设置，之后再通过管理后台或管理 API 维护执行数据。

## 程序截图

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="管理面板首页" height="200"><br>
      <sub>管理面板首页</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="管理面板" height="200"><br>
      <sub>管理面板</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="收银台" height="200"><br>
      <sub>收银台</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="支付页面" height="200"><br>
      <sub>支付页面</sub>
    </td>
  </tr>
</table>
