# epusdt-docs

[简体中文](README.zh-CN.md) · 繁體中文 · [English](README.md)

> [Epusdt](https://github.com/GMWalletApp/epusdt) 的文件站 —— 基於 Go 的私有化多鏈加密支付閘道，提供 GMPay API、EPay 相容跳轉收銀臺，以及由後臺管理的商戶 PID / secret_key 模式。

## 本機開發

```bash
bun install
bun run docs:dev
```

## 建置

```bash
bun run docs:build
```

## 正式環境部署

Cloudflare Workers Builds 監聽本儲存庫的 `main` 分支。推送或合併 PR 後，Cloudflare 會在儲存庫根目錄執行 `npx wrangler deploy`。Wrangler 執行 `bun install && bun run docs:build`，並將 `.vitepress/dist` 中的靜態檔案發佈至 [epusdt.com](https://epusdt.com)。

驗證發佈時，在 Cloudflare 的 **epusdt-docs** Worker 中找到對應合併提交的建置紀錄，再開啟網站檢查內容。若紀錄顯示部署權杖已刪除或輪替，請在 **Settings → Builds** 為本站選用有效的部署權杖，然後重新執行該次建置。
