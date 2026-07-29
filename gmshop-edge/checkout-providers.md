# Checkout and Providers

GMShop Edge keeps checkout, order state, provider credentials, and notification delivery inside the store deployment.

## Checkout model

The store maintains customer-selected fiat currencies through D1 exchange rates. During checkout it creates one immutable quote and passes that quote to the selected typed provider.

This means:

- Store order amounts are tracked in integer minor units, not floating point.
- Checkout provider credentials are runtime configuration owned by the deployer.
- Production acceptance should use deployer-owned provider accounts and real-provider test orders.

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
