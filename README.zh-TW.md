# Epusdt 文件

[English](./README.md)

[![GitHub Repo](https://img.shields.io/badge/GitHub-GMwalletApp%2Fepusdt-blue?logo=github)](https://github.com/GMwalletApp/epusdt)
[![GitHub Stars](https://img.shields.io/github/stars/GMwalletApp/epusdt?style=flat&logo=github)](https://github.com/GMwalletApp/epusdt/stargazers)
[![License](https://img.shields.io/badge/license-GPLv3-blue)](https://www.gnu.org/licenses/gpl-3.0.html)
[![Telegram](https://img.shields.io/badge/Telegram-epusdt__group-blue?logo=telegram)](https://t.me/epusdt_group)

> [Epusdt](https://github.com/GMwalletApp/epusdt) 的文件站 —— 一個由 Go 編寫的私有化加密支付中介軟體，支援 Tron、Solana、Ethereum。

## 簡介

**Epusdt**（Easy Payment Usdt）是一個私有化加密支付中介軟體。透過 HTTP API 將代幣收款整合至任意系統，訂單資料可使用 MySQL/SQLite/PostgreSQL，無需手續費，代幣直達您的錢包。

**特點：** 私有部署 · 多網路監聽 · 錢包管理 API · 非同步佇列 · Telegram 機器人 · 跨平台二進位 · 內建安裝精靈

## 快速開始

- 📖 [專案簡介](/zh/guide/intro)
- 📝 [版本日誌](/zh/guide/changelog)
- 🐳 [Docker 部署](/zh/guide/installation/docker)
- 🔌 [API 文件](/zh/api/reference)

## Docker 快速啟動

```bash
docker run -d --name epusdt --restart always -p 8000:8000 gmwallet/epusdt:latest
```

啟動後開啟 `http://你的伺服器IP:8000`，透過安裝精靈完成初始設定。

## 連結

- GitHub: <https://github.com/GMwalletApp/epusdt>
- Telegram 頻道: <https://t.me/epusdt>
- Telegram 交流群: <https://t.me/epusdt_group>

## 授權

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)
