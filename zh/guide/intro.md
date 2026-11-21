# 项目简介

EPUSDT 是可自行部署的支付网关。商户创建订单，买家在收银台付款，网关核验到账后向商户发送签名回调。链上直付的资金进入商户配置的收款地址。

## 接入第一笔收款

1. [部署网关](/zh/guide/installation/docker)，设置买家可以访问的 HTTPS 收银台地址。
2. 在后台启用网络和币种，添加收款地址。创建商户 API 密钥，将 `pid` 与 `secret_key` 保存在商户服务器。
3. [创建 GMPay 订单](/zh/api/payment#create)，将买家跳转至返回的 `payment_url`。已对接易支付的系统可使用 [EPay 兼容入口](/zh/guide/integration/epay).

## 支持的链与代币 {#networks}

下表列出新安装的默认网络和币种。启用链和币种并配置收款地址后，收银台才会显示对应选项。可通过 `GET /payments/gmpay/v1/config` 的 `data.supported_assets` 获取当前网关的实际列表。

| 网络 | API 网络 ID | 默认币种 |
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

Arc 支持原生和 ERC-20 两种 USDC。Polygon 的 USDC 和 USDC.e 是两种独立资产。

### 托管支付方式

OKX OnchainOS 在 X Layer 上支持 USDC、USDT0 和 USDG。OKPay 默认支持 USDT 和 TRX。商户须分别启用服务商，客户端从 `data.xlayer` 或 `data.okpay` 读取选项。

## 从转账到发货

ChainScanner 默认随 EPUSDT 启动。发现匹配转账后，订单进入 **5 · 确认中**。默认开启严格核验，达到规定确认深度且两个独立节点结果一致后，订单进入 **2 · 已支付**。两轮核验均未通过则进入 **6 · 人工复核**。商户应在收到并验证成功回调后再发货。

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

## 相关项目与审计

- [GMPay Edge](/zh/gmpay-edge/) · 可部署于 Workers 或 Bun 的支付网关。
- [GMShop Edge](/zh/gmshop-edge/) · 数字商品商城。
- [EPUSDT 安全审计报告，2026 年 5 月](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
