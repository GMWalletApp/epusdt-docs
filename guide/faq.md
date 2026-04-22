# FAQ

This page collects common questions during Epusdt deployment and integration.

If your issue is not covered here, please open an issue on GitHub:

- GitHub Issues: [https://github.com/GMwalletApp/epusdt/issues](https://github.com/GMWalletApp/epusdt/issues)

When reporting a problem, include your deployment method, network, error message, logs, and reproduction steps. This makes troubleshooting much faster.

## Which deployment method should I choose?

For most users, start with **Docker deployment**. It is the easiest to reproduce, upgrade, and migrate.

Use **aaPanel** if you already manage websites through aaPanel.

Use **manual deployment** if you want full control over the binary, process manager, and reverse proxy.

## Is `tron_grid_api_key` required?

No. It is **optional**.

If you mainly use the TRON network, adding a TRON Grid API Key is recommended because it can improve request stability.

Apply here:

- [https://www.trongrid.io/](https://www.trongrid.io/)

## Why is my callback not being received?

Common causes:

- The callback URL is not publicly reachable
- Your server blocks inbound requests with firewall or reverse proxy rules
- Your business server does not return the expected success response
- The callback endpoint is too slow or returns 4xx/5xx

Check your Epusdt logs and your business server logs together.

## What should the callback return after successful processing?

For the current Epusdt implementation, your callback endpoint should return:

```text
ok
```

If it does not return `ok`, Epusdt may treat it as a failed callback and retry.

## Why can I create orders but payments are not matched?

Please check these items:

- The selected `network` and `token` are correct
- The monitored wallet address is enabled
- The actual transferred amount matches the locked order amount
- Chain monitoring configuration is available and healthy
- Your server time and environment are normal

If you are using Solana or Ethereum, also verify related RPC or WS settings.

## Can I deploy Epusdt behind Nginx or under HTTPS?

Yes.

In production, it is recommended to place Epusdt behind **Nginx** or another reverse proxy and expose it through **HTTPS**.

Make sure your public domain matches the configured `app_uri`.

## Which route should I use: Epusdt, GMPay, or EPay?

Use **GMPay** if you want the current recommended native multi-network API.

Use **Epusdt** if you need compatibility with older integrations or legacy plugins.

Use **EPay** if you need an EPay-style redirect checkout flow.

## How should I troubleshoot with logs?

When debugging a problem, check the **Epusdt application logs** first, then compare them with your **business system logs**, **Nginx logs**, and **callback endpoint logs**.

Start with these points:

- Whether there is any configuration loading error during startup
- Whether the database connection succeeds
- Whether wallet monitoring starts normally
- Whether order creation requests return errors
- Whether callback retries, timeouts, or signature verification failures appear
- Whether chain monitoring reports errors, or RPC / WS endpoints are unavailable

If you use Docker, container logs are usually the first place to check.

If you use manual deployment or aaPanel, check Supervisor, systemd, or application output logs.

When opening an issue, include the key error snippet, when it happened, what action triggered it, and which deployment method you used. That will make troubleshooting much easier.

## Where should I ask questions or report bugs?

If you find a documentation problem, deployment issue, integration bug, or feature request, please open an issue:

- GitHub Issues: [https://github.com/GMWalletApp/epusdt/issues](https://github.com/GMWalletApp/epusdt/issues)

Before opening a new issue, it is best to search existing issues first.
