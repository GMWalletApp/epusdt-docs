# Payment and Providers

GMShop Edge uses payment providers as outbound checkout adapters for the store's own orders. It is not a merchant gateway and does not expose a GMPay-compatible API for other merchants.

## Payment model

The store maintains customer-selected fiat currencies through D1 exchange rates. During checkout it creates one immutable quote and passes that quote to the selected adapter, such as Stripe, GMpay, EPay, or another typed provider.

This means:

- GMpay and EPay are outbound hosted-checkout adapters for store orders.
- The project does not scan blockchains or operate exchange/wallet receiving adapters.
- It does not issue merchant PID / secret_key credentials to third parties.
- Production acceptance must use deployer-owned provider accounts and real-provider test orders.

## Provider secrets

Provider secrets are runtime configuration. Enter them in the administration console; do not commit `.dev.vars`, provider credentials, runtime secrets, private keys, or Cloudflare credentials.

## Email providers

Transactional email is template-based and can be delivered through:

- SMTP.
- Resend.
- Postmark.
- SendGrid.
- Mailgun.
- Cloudflare Send Email through the `EMAIL` binding.

Email records retain delivery state while Queue and Cron provide bounded retries.

## Authentication providers

Better Auth powers account identity. The application can configure email/password, social, OIDC, and Telegram authentication providers at runtime without rebuilding the Worker.

## Security checklist

Before production, configure exact Allowed Hosts, HTTPS, Origin and CSRF checks, rate limits, Queue/DLQ monitoring, administrator recovery, and backups. Test D1 and R2 recovery instead of treating untested backups as complete.
