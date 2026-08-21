# 手动部署

本文说明如何在普通 Linux 服务器上直接部署 Epusdt。

**首次启动通常不需要手动建立 `.env`。** 若配置文件不存在，Epusdt 会直接启动内建安装向导。

## 1. 准备目录

```bash
mkdir -p /opt/epusdt
cd /opt/epusdt
```

## 2. 取得执行档

### 方式 A：下载发布包

请先到目前的 release 页面依服务器架构选择对应文件，例如：

- `epusdt-1.0.9-linux-amd64.tar.gz`
- `epusdt-1.0.9-linux-arm64.tar.gz`

以下示例适用于 Linux x86_64 / amd64：

```bash
wget https://github.com/GMWalletApp/epusdt/releases/download/v1.0.9/epusdt-1.0.9-linux-amd64.tar.gz -O epusdt.tar.gz
tar -xzf epusdt.tar.gz
rm epusdt.tar.gz
```

如果你的主机不是 amd64，请直接到 release 页面下载对应架构的压缩包：

```text
https://github.com/GMWalletApp/epusdt/releases/latest
```

### 方式 B：从源代码编译

前置条件至少需要先安装：

- `git`
- `Go`

```bash
git clone https://github.com/GMWalletApp/epusdt.git
cd epusdt/src
go build -o /opt/epusdt/epusdt .
```

## 3. 启动服务

```bash
chmod +x /opt/epusdt/epusdt
cd /opt/epusdt
./epusdt http start
```

之后在浏览器打开 `http://你的服务器IP:8000`，完成安装向导。

## 4. 反向代理

把你的域名（例如 `pay.example.com`）反代到 `http://127.0.0.1:8000`。

## 5. 验证实际接入地址

基础地址示例：

```text
https://pay.example.com
```

推荐下单路由：

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 注意事项

- 目前源代码模板以 `src/.env.example` 为准
- 初始商户凭证请以安装流程 / 管理后台为准，不要照抄旧文件里的过时示例
- 不要再依赖已移除的 `/payments/epusdt/v1/order/create-transaction`
