# Release Notes

This page summarizes published Epusdt releases using the repository's actual GitHub releases, tags, release notes, and compare diffs.

## Scope and Source Rules

- Primary source: GitHub Releases in `GMwalletApp/epusdt`
- Supplementary source: tag compare diffs and merged commit messages
- This page avoids inventing features that are not visible in release or code history

## v0.9.4

- Release tag: `v0.9.4`
- Published at: `2026-04-28T16:37:20Z`
- Official release note: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### User-visible changes

- TRON payment scanning is back on a block-based listener path in current source history, so the temporary revert of the newer TRON flow is no longer the effective upstream state.
- Follow-up payment-processing fixes adjusted order notification behavior after successful payment handling.
- Hosted checkout entry now redirects into the SPA cashier flow instead of rendering a dedicated server-side HTML template directly from `/pay/checkout-counter/:trade_id`.

### Deployment and configuration changes

- Startup now auto-copies missing built-in checkout static files from the binary image into the configured `static_path`.
- This directly addresses the Docker case where a deployment mounts only `./data:/data` and previously ended up with missing hosted checkout files under `/data/static`.
- Legacy embedded `static/` checkout assets were removed from the runtime path in favor of the SPA-based `www/` delivery.

### API changes

- `GET /pay/checkout-counter/:trade_id` now behaves as a redirect entry for the cashier SPA.
- Current source exposes `GET /pay/checkout-counter-resp/:trade_id` as the JSON response endpoint used by the new SPA checkout flow.
- No new merchant signature field or callback contract was introduced in this release.

### Evidence used

- GitHub release `v0.9.4`
- Compare diff `v0.9.3...v0.9.4`
- Commits `9e885d8`, `de9c45a`, `96ea748`, `51a2acc`, `d17d212`, `9c533a7`, `ff68279`
- Upstream issue `#55` about missing checkout files in Docker deployments

## v0.9.3

- Release tag: `v0.9.3`
- Published at: `2026-04-25T10:50:34Z`
- Official release note: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### User-visible changes

- Fixed the root route after installation so `GET /` consistently serves the SPA instead of being intercepted by the backend root handler.
- Install mode still redirects the root path to `/install`, so first-time setup flow remains intact.

### Deployment and configuration changes

- No new public environment variable or deployment flag was published for this release.
- The main runtime route behavior was adjusted so installed instances land on the web app more reliably.

### API changes

- No new public API route was introduced in this release.
- Root backend routing changed from a catch-all `Any("/")` style handler to a `POST("/")` backend handler, leaving normal browser `GET /` traffic to the SPA.

### Evidence used

- GitHub release `v0.9.3`
- Compare diff `v0.9.2...v0.9.3`
- Commits including `95879e3`, merge tag `67263da`

## v0.9.2

- Release tag: `v0.9.2`
- Published at: `2026-04-24T16:14:34Z`
- Official release note: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### User-visible changes

- Admin rate settings now allow configuring a forced USDT rate.
- Docker deployment examples remain aligned with the current `gmwallet/epusdt:latest` image reference.

### Deployment and configuration changes

- No new public environment variable was explicitly published in the release note.
- Existing Docker upgrade examples continue to use `gmwallet/epusdt:latest`.

### API changes

- No new public API route was visible in the release note or compare diff for this release.

### Evidence used

- GitHub release `v0.9.2`
- Compare diff `v0.9.1...v0.9.2`
- Commits including `dd1bf70`, `143bc84`

## v0.9.1

- Release tag: `v0.9.1`
- Published at: `2026-04-22T18:29:39Z`

### User-visible changes

- Built-in install wizard: first run without a usable config file now launches a web-based setup flow instead of failing. The current form focuses on `app_name`, `app_uri`, bind address/port, runtime path, log path, order expiration, and callback retry settings.
- Docker image now supports direct pull with `docker pull gmwallet/epusdt:latest`; no `.env` mount needed for initial deployment.

### Deployment and configuration changes

- The install wizard writes `.env` automatically on first submit; subsequent restarts skip the wizard and boot normally.
- `docker-compose.yaml` volume mount for `.env` is now optional — omit it for a clean wizard-based first run.

### API changes

- No new public API route in this release.

## v0.9.0

- Release tag: `v0.9.0`
- Published at: `2026-04-21T20:23:33Z`
- Official release note: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### User-visible changes

- Added a full admin panel for managing API keys, chains, chain tokens, wallets, orders, RPC nodes, settings, notifications, and dashboard statistics
- Multi-chain support was expanded further, including broader EVM listener coverage and admin-facing chain/token management flows
- Telegram notification channels were added and later synchronized with settings updates
- First-run installation flow was introduced to simplify initial setup

### Deployment and configuration changes

- `.env.example` changed the install flag default to enabled for first-run setup flow
- The runtime now includes RPC node health checks with automatic failover support
- Built admin static assets were added to the server runtime
- New persistence models were introduced for admin users, API keys, chains, chain tokens, RPC nodes, settings, and notification channels

### API changes

- Added a full admin REST API surface covering auth, API keys, chains, chain tokens, wallets, orders, RPC nodes, settings, dashboard statistics, and notifications
- Added JWT-based admin authentication and API-key authentication middleware
- Payment, supported-asset, wallet, and order-related response/request structures were expanded alongside the admin workstream

### Evidence used

- GitHub release `v0.9.0`
- Compare diff `v0.0.8...v0.9.0`
- Commits including `6bb47d4`, `5edc9dc`, `b499bc0`, `6ea5637`, `9163943`

## v0.0.8

- Release tag: `v0.0.8`
- Published at: `2026-04-15T10:44:56Z`
- Official release note: `- Enable polygon,plasma supports`

### User-visible changes

- Added `polygon` and `plasma` network support
- Payment page network selection behavior was adjusted
- EVM wallet address storage logic was corrected

### Deployment and configuration changes

- No new environment variables were visible in the release note or compare diff

### API changes

- No new public API route was clearly introduced in the official release note
- Supported-network related behavior continues from the `v0.0.7` workstream

### Evidence used

- GitHub release `v0.0.8`
- Compare diff `v0.0.7...v0.0.8`
- Commits including `f7c5f67`, `097c716`

## v0.0.7

- Release tag: `v0.0.7`
- Published at: `2026-04-15T06:00:55Z`
- Official release note: `suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### User-visible changes

- Added support for `bsc`, `polygon`, and `plasma`
- EPay-compatible submit-form parameters were added for broader integration compatibility
- Telegram interaction and payment-related handling were updated in the payment workstream

### Deployment and configuration changes

- New supported-network work added multiple EVM listening paths in source history
- No clearly documented new `.env` variable was published in the official release note body

### API changes

- Added supported-chain / supported-asset related API work in source history
- Router logic was updated to support both `GET` and `POST` forms for EPay-compatible submission flow

### Evidence used

- GitHub release `v0.0.7`
- Compare diff `v0.0.6...v0.0.7`
- Commits including `9c003fb`, `8cd816c`, `786c5e8`, `70f8ed4`

## v0.0.6

- Release tag: `v0.0.6`
- Published at: `2026-04-12T20:06:08Z`
- Official release note: compare `v0.0.5...v0.0.6`

### User-visible changes

- Hosted checkout UI was redesigned into a two-step payment flow
- Payment route switching was added for multi-network checkout selection
- Solana payment scanning now supports `USDT` and `USDC`
- Ethereum ERC-20 payment scanning was added for `USDT` and `USDC`
- Telegram payment notifications now include network information
- Telegram wallet validation was improved for multi-network addresses

### Deployment and configuration changes

- Added `solana_rpc_url`
- Added `ethereum_ws_url`
- Added `epay_pid`
- Added `epay_key`
- Order locking and matching now include `network` in the runtime flow

### API changes

- Added wallet management endpoints under `/payments/gmpay/v1/wallet/*`
- Added `POST /pay/switch-network`
- Added EPay-compatible route `GET /payments/epay/v1/order/create-transaction/submit.php`
- Checkout response now includes `is_selected`
- Create-order flow accepts optional `name` and `payment_type`
- Current source uses lowercase network identifiers such as `tron`, `solana`, and `ethereum`

### Evidence used

- GitHub release `v0.0.6`
- Compare diff `v0.0.5...v0.0.6`
- Commits including `3f071e6`, `32ca778`, `5e4d5df`

## v0.0.5

- Release tag: `v0.0.5`
- Published at: `2026-04-03T17:05:30Z`
- Official release note: `test: fix macOS path assertion and wallet address unique index`

### User-visible changes

- No major end-user feature was described in the official release note

### Deployment and configuration changes

- No new deployment variables were visible from the official release note

### API changes

- Wallet address unique index behavior was adjusted in code history

### Evidence used

- GitHub release `v0.0.5`
- Compare diff `v0.0.4...v0.0.5`

## v0.0.4

- Release tag: `v0.0.4`
- Release name: `New UI Update`
- Published at: `2026-04-03T16:05:23Z`
- Official release note: `feat: change payment ui`

### User-visible changes

- Payment UI was updated

### Deployment and configuration changes

- No deployment-facing changes were stated in the release note

### API changes

- No API-facing changes were stated in the release note

### Evidence used

- GitHub release `v0.0.4`
- Official release note body

## Notes for Maintainers

For future releases, the most useful release format is:

1. User-visible changes
2. Deployment or config changes
3. API or schema changes
4. Upgrade notes or breaking changes

That structure maps cleanly to both docs readers and integrators.
