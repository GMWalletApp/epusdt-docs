---
description: "在寶塔面板設定 EPUSDT 收銀台網域、HTTPS 與反向代理，將網站請求轉送至閘道程序。"
---

# 使用寶塔面板部署

## 建立站點

為收銀臺域名建立純靜態站點，完成 DNS 解析並啟用 HTTPS。EPUSDT 獨立執行並使用 SQLite。二進位制、配置和資料庫均放在網站公開目錄之外。

![建立收銀臺站點](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## 配置應用程序

1. 安裝面板的 Supervisor 管理器，下載並解壓對應架構的發行包。按[手動安裝指南](/zh-tw/guide/installation/manual)準備執行賬號、可寫目錄和 `.env`。
2. 將 `app_uri` 設為收銀臺 HTTPS 網址，設定 `http_listen=127.0.0.1:8000`。在 Supervisor 中指定安裝目錄為工作目錄，啟動命令為二進位制完整路徑加 `http start`，啟用自動啟動和重啟。
3. 在程序管理器中檢視執行狀態和日誌。

![Supervisor 程序設定](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## 配置反向代理並驗證

在網站設定中新增指向 `http://127.0.0.1:8000` 的反向代理。訪問 `https://你的域名/payments/gmpay/v1/config`，確認返回 `status_code: 200`。新增收款地址後，對應的已啟用幣種會出現在收銀臺。修改配置後從 Supervisor 重啟 EPUSDT。

![反向代理設定](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
