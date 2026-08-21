# aaPanel 部署

本文说明如何使用 aaPanel 部署 Epusdt 服务本体。

**首次启动通常不需要手动建立 `.env`。** 先把程序跑起来，再在浏览器里完成安装向导即可。

## 基本流程

1. 在 aaPanel 为支付域名建立站点
2. 上传 Epusdt 发布包或二进制
3. 把站点反代到 `http://127.0.0.1:8000`
4. 先修正程序目录权限
5. 在 aaPanel Supervisor 中设置正确的启动目录与命令
6. 优先直接打开绑定域名完成安装向导

## Supervisor 启动前的建议权限设置

如果 aaPanel Supervisor 以 `www` 用户执行程序，建议先执行：

```bash
cd /www/wwwroot/epusdt
chmod +x epusdt
chown -R www:www /www/wwwroot/epusdt
```

## 建议的 Supervisor 设置

- **启动目录：** `/www/wwwroot/epusdt`
- **启动命令：** `./epusdt http start`

不要只写 `epusdt http start`。如果工作目录不正确，`.env` 等相对路径可能会解析错误，导致启动失败或读到错误位置。

## 完成安装向导

- 建议直接打开绑定好的域名，例如 `https://pay.example.com`
- 只有在直连程序埠时，才使用 `http://服务器IP:8000`

## 验证

对外基础地址示例：

```text
https://pay.example.com
```

推荐下单路由：

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 注意事项

- 商户凭证与 EPay 默认值现在都由管理后台维护
- 不要再依赖旧文件里的 `/payments/epusdt/v1/order/create-transaction`
