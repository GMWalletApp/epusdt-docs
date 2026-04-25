# 手動部署

本文說明如何在普通 Linux 伺服器上直接部署 Epusdt。

**首次啟動通常不需要手動建立 `.env`。** 若配置檔不存在，Epusdt 會直接啟動內建安裝嚮導。

## 1. 準備目錄

```bash
mkdir -p /opt/epusdt
cd /opt/epusdt
```

## 2. 取得執行檔

### 方式 A：下載釋出包

```bash
wget https://github.com/GMwalletApp/epusdt/releases/latest/download/epusdt_Linux_x86_64.tar.gz -O epusdt.tar.gz
tar -xzf epusdt.tar.gz
rm epusdt.tar.gz
```

### 方式 B：從原始碼編譯

```bash
git clone https://github.com/GMwalletApp/epusdt.git
cd epusdt/src
go build -o /opt/epusdt/epusdt .
```

## 3. 啟動服務

```bash
chmod +x /opt/epusdt/epusdt
cd /opt/epusdt
./epusdt http start
```

之後在瀏覽器打開 `http://你的伺服器IP:8000`，完成安裝嚮導。

## 4. 反向代理

把你的域名（例如 `pay.example.com`）反代到 `http://127.0.0.1:8000`。

## 5. 驗證實際接入地址

基礎地址示例：

```text
https://pay.example.com
```

推薦下單路由：

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 注意事項

- 目前原始碼模板以 `src/.env.example` 為準
- 初始商戶憑證請以安裝流程 / 管理後臺為準，不要照抄舊文件裡的過時示例
- 不要再依賴已移除的 `/payments/epusdt/v1/order/create-transaction`
