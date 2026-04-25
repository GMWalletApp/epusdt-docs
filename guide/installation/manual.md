# Manual Installation

This guide covers running Epusdt on a normal Linux server without Docker or aaPanel.

**No manual `.env` is required for the first run.** If the config file does not exist, Epusdt starts the built-in install wizard in the browser.

## 1. Prepare the directory

```bash
mkdir -p /opt/epusdt
cd /opt/epusdt
```

## 2. Get the binary

### Option A. Download release

```bash
wget https://github.com/GMwalletApp/epusdt/releases/latest/download/epusdt_Linux_x86_64.tar.gz -O epusdt.tar.gz
tar -xzf epusdt.tar.gz
rm epusdt.tar.gz
```

### Option B. Build from source

```bash
git clone https://github.com/GMwalletApp/epusdt.git
cd epusdt/src
go build -o /opt/epusdt/epusdt .
```

## 3. Start service

```bash
chmod +x /opt/epusdt/epusdt
cd /opt/epusdt
./epusdt http start
```

Then open `http://your-server-ip:8000` and finish the install wizard.

## 4. Reverse proxy

Point your domain, for example `pay.example.com`, to `http://127.0.0.1:8000` behind Nginx.

## 5. Verify the real API base URL

Example base URL:

```text
https://pay.example.com
```

Recommended create-order route:

```text
POST /payments/gmpay/v1/order/create-transaction
```

## Notes

- `src/.env.example` is the current source template
- Initial merchant credentials are managed from the install flow / admin panel, not from old docs-only examples
- Do not rely on removed routes such as `/payments/epusdt/v1/order/create-transaction`
