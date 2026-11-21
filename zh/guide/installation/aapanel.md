---
description: "在宝塔面板配置 EPUSDT 收银台域名、HTTPS 和反向代理，将网站请求转发到网关进程。"
---

# 使用宝塔面板部署

## 创建站点

为收银台域名创建纯静态站点，完成 DNS 解析并启用 HTTPS。EPUSDT 独立运行并使用 SQLite。二进制、配置和数据库均放在网站公开目录之外。

![创建收银台站点](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## 配置应用进程

1. 安装面板的 Supervisor 管理器，下载并解压对应架构的发行包。按[手动安装指南](/zh/guide/installation/manual)准备运行账号、可写目录和 `.env`。
2. 将 `app_uri` 设为收银台 HTTPS 网址，设置 `http_listen=127.0.0.1:8000`。在 Supervisor 中指定安装目录为工作目录，启动命令为二进制完整路径加 `http start`，启用自动启动和重启。
3. 在进程管理器中查看运行状态和日志。

![Supervisor 进程设置](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## 配置反向代理并验证

在网站设置中添加指向 `http://127.0.0.1:8000` 的反向代理。访问 `https://你的域名/payments/gmpay/v1/config`，确认返回 `status_code: 200`。添加收款地址后，对应的已启用币种会出现在收银台。修改配置后从 Supervisor 重启 EPUSDT。

![反向代理设置](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
