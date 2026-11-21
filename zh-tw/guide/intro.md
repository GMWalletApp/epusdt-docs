---
description: "查看 EPUSDT 支援的網路與代幣，瞭解如何設定收款地址，以及從建立訂單、買家付款到接收簽章通知的流程。"
title: "支援的收款網路、代幣與商戶收款流程"
---

# 專案簡介

EPUSDT 是可自行部署的支付閘道器。商戶建立訂單，買家在收銀臺付款，閘道器核驗到賬後向商戶傳送簽名回撥。鏈上直付的資金進入商戶配置的收款地址。

## 接入第一筆收款

1. [部署閘道器](/zh-tw/guide/installation/docker)，設定買家可以訪問的 HTTPS 收銀臺地址。
2. 在後臺啟用網路和幣種，新增收款地址。建立商戶 API 金鑰，將 `pid` 與 `secret_key` 儲存在商戶伺服器。
3. [建立 GMPay 訂單](/zh-tw/api/payment#create)，將買家跳轉至返回的 `payment_url`。已對接易支付的系統可使用 [EPay 相容入口](/zh-tw/guide/integration/epay).

## 支援的鏈與代幣 {#networks}

下表列出新安裝的預設網路和幣種。啟用鏈和幣種並配置收款地址後，收銀臺才會顯示對應選項。可通過 `GET /payments/gmpay/v1/config` 的 `data.supported_assets` 獲取當前閘道器的實際列表。

| 網路 | API 網路 ID | 預設幣種 |
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

Arc 支援原生和 ERC-20 兩種 USDC。Polygon 的 USDC 和 USDC.e 是兩種獨立資產。

### 託管支付方式

OKX OnchainOS 在 X Layer 上支援 USDC、USDT0 和 USDG。OKPay 預設支援 USDT 和 TRX。商戶須分別啟用服務商，客戶端從 `data.xlayer` 或 `data.okpay` 讀取選項。

## 從轉賬到發貨

ChainScanner 預設隨 EPUSDT 啟動。發現匹配轉賬後，訂單進入 **5 · 確認中**。預設開啟嚴格核驗，達到規定確認深度且兩個獨立節點結果一致後，訂單進入 **2 · 已支付**。兩輪核驗均未通過則進入 **6 · 人工複核**。商戶應在收到並驗證成功回撥後再發貨。

## 程式截圖

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="管理面板首頁" height="200"><br>
      <sub>管理面板首頁</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="管理面板" height="200"><br>
      <sub>管理面板</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="收銀臺" height="200"><br>
      <sub>收銀臺</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="支付頁面" height="200"><br>
      <sub>支付頁面</sub>
    </td>
  </tr>
</table>

## 相關專案與審計

- [GMPay Edge](/zh-tw/gmpay-edge/) · 可部署於 Workers 或 Bun 的支付閘道器。
- [GMShop Edge](/zh-tw/gmshop-edge/) · 數字商品商城。
- [EPUSDT 安全審計報告，2026 年 5 月](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
