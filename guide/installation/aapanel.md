# aaPanel Deployment

This guide shows how to run the Epusdt service itself with aaPanel.

**No manual `.env` is required for first boot.** Start the binary, then finish setup in the browser wizard.

## Basic flow

1. Create a site in aaPanel for your payment domain
2. Upload the Epusdt release package or binary
3. Reverse proxy the site to `http://127.0.0.1:8000`
4. Use aaPanel Supervisor to run `epusdt http start`
5. Open the domain (or server IP) and finish the install wizard

## Verification

Use your deployed domain as the API base URL, for example:

```text
https://pay.example.com
```

Recommended order route:

```text
POST /payments/gmpay/v1/order/create-transaction
```

## Notes

- Admin panel settings now own merchant credentials and EPay defaults
- Do not follow old docs that still mention `/payments/epusdt/v1/order/create-transaction`
