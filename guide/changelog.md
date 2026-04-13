# Release Notes

This page summarizes published Epusdt releases using the repository's actual GitHub releases, tags, release notes, and compare diffs.

## Scope and Source Rules

- Primary source: GitHub Releases in `GMwalletApp/epusdt`
- Supplementary source: tag compare diffs and merged commit messages
- This page avoids inventing features that are not visible in release or code history

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
