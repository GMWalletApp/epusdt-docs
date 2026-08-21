# Checkout and Providers

GMShop Edge keeps checkout, wallet state, provider credentials, authentication configuration, and notification delivery inside the store deployment.

## Payments

Store order amounts use integer minor units. Customer-selected fiat currencies are quoted from store-owned exchange rates, and one immutable quote is passed to the selected provider.

Available external payment adapters are:

- Stripe.
- Cryptomus hosted invoices.
- GMpay.
- EPay.
- Alipay Page and WAP.
- WeChat Native and H5.

Registered customers can also pay from the built-in store wallet. Refund and after-sales operations update payment and wallet ledgers through idempotent state transitions.

A built-in adapter is not proof that a provider is production-ready for a particular deployment. Configure deployer-owned credentials and complete real create-order, callback/webhook, payment, refund, and reconciliation tests before opening the store.

## Email

Template-based transactional email supports SMTP, Resend, Postmark, SendGrid, Mailgun, and the optional Cloudflare Send Email `EMAIL` binding. Delivery records retain state while Queue and scheduled work provide bounded retries.

## Authentication

Better Auth supports runtime-configured email/password, social providers, generic OIDC, Telegram OIDC, and the verified Telegram Login Widget fallback. Telegram Mini Apps verify `initData` for automatic sign-up/sign-in and can import a missing Telegram avatar. Telegram users can bind a verified email independently from setting a password.

## Telegram bot and support

The grammY webhook bot synchronizes localized shop commands and fixed Mini App buttons. Optional support maps a Telegram user to a Forum Topic and relays messages in both directions without storing message content. The support bridge trusts only a fresh Telegram administrator mirror and closes idle conversations according to configured maintenance policy.

Configure the Bot Token, OIDC secret, support group, synchronization, and web-support settings separately in `/admin`; do not commit them.

## Security checklist

Use exact Allowed Hosts and Origin validation, HTTPS, CSRF protection, bounded request bodies, rate limits, Queue/DLQ monitoring, fresh-password reauthentication for sensitive exports, administrator recovery, and tested backups. Provider and authentication secrets use encrypted runtime configuration and must never be committed.
