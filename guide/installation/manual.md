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

Choose the archive that matches your server architecture from the current release page:

- `epusdt-1.0.9-linux-amd64.tar.gz`
- `epusdt-1.0.9-linux-arm64.tar.gz`

Example for Linux x86_64 / amd64:

```bash
wget https://github.com/GMWalletApp/epusdt/releases/download/v1.0.9/epusdt-1.0.9-linux-amd64.tar.gz -O epusdt.tar.gz
tar -xzf epusdt.tar.gz
rm epusdt.tar.gz
```

If you are not on amd64, open the release page and download the matching archive for your architecture:

```text
https://github.com/GMWalletApp/epusdt/releases/latest
```

### Option B. Build from source

Prerequisites:

- `git`
- `Go`

```bash
git clone https://github.com/GMWalletApp/epusdt.git
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
