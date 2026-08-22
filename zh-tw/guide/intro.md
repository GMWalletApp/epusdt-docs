# 專案簡介

## 安全審計

Epusdt 已完成第三方安全審計。
[查看安全審計報告](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)

## 目前原始碼實際提供什麼

`Epusdt` 是一個由 **Go** 編寫的私有化 **加密支付閘道**。

GMWalletApp 組織也維護 [GMPay Edge](/zh-tw/gmpay-edge/)。它是支援 Cloudflare Workers 或 Bun/Nitro Docker 的獨立閘道，共用 GMPay / EPay 商戶協議語境，但不是 Epusdt 的同一套執行時或部署模型。

如果需要數位商品商城，請看 [GMShop Edge](/zh-tw/gmshop-edge/)，它是獨立的 Cloudflare Workers 商城，負責商品、結帳、交付與管理後臺。

當前原始碼對外提供兩條建立訂單主流程：

- **GMPay**：`POST /payments/gmpay/v1/order/create-transaction`
- **EPay 相容**：`GET/POST /payments/epay/v1/order/create-transaction/submit.php`

另外還提供：

- `/pay/*` 之下的託管收銀臺頁面
- 收銀臺切換網路：`POST /pay/switch-network`
- 前端 / 收銀臺初始化用的公開支付配置：`GET /payments/gmpay/v1/config`
- `/admin/api/v1/*` 管理 API，用於管理 API Keys、鏈、代幣、錢包地址、通知通道與設定
- 後臺匯率設定支援二選一：配置匯率 API 位址，或直接填寫強制 USDT 匯率；如果只使用強制匯率，API 位址可以留空

## 商戶憑證模型

目前支付 API 不再依賴單一全域金鑰。

現在每個商戶都對應後臺建立的一條 **API key**：

- `pid`
- `secret_key`
- 可選 `ip_whitelist`
- 可選預設 `notify_url`

GMPay 與 EPay 入站請求都會先根據 `pid` 找到對應 API key，再使用該筆資料的 `secret_key` 驗籤。

## 支援的鏈與代幣

目前原始碼不再把固定的公開鏈清單直接寫死在文件層。

`GET /payments/gmpay/v1/config` 的回應來自實際後臺資料。

其中 `data.supported_assets` 會根據以下資料即時組裝：

- 已啟用的 `chains`
- 已啟用的 `chain_tokens`
- 該鏈上存在可用 `wallet_address`

同一個回應還會帶出公開站點 / 收銀臺品牌資訊，以及 EPay / OkPay 前端配置欄位。

也就是說，真正可用的網路與代幣，取決於管理後臺目前啟用了什麼。

## 首次安裝

若首次啟動時沒有配置檔，Epusdt 會直接進入內建 **安裝嚮導**。先在瀏覽器完成資料庫、域名與初始化設定，之後再透過管理後臺或管理 API 維護執行資料。

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
