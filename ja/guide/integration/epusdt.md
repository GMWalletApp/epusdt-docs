---
description: "既存のEPUSDTトレーダー連携を、退役した注文ルートから、GMPayまたはEPay互換の転送フローへ移行してください。"
---

# 旧版からの移行 {#legacy-migration}

現在のソースは、古いEpusdtのルートを露出していません。

## 削除されたルート {#removed-routes}

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## どのようなものを活用するか {#what-to-use-instead}

### クライアントコードを制御している場合 {#if-you-control-the-client-code}

**GMPay** を利用してください。

```text
POST /payments/gmpay/v1/order/create-transaction
```

### 上流のシステムが、EPayのルーティング形式のみをサポートしている場合 {#if-the-upstream-system-only-supports-redirect-style-epay-flows}

EPayに対応しています。

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 移行チェックリスト {#migration-checklist}

- 古いエンドポイントURLを置き換えてください。
- すべての受信リクエストに `pid` を追加してください。
- 加盟店のレコードにある `secret_key` でリクエストに署名し直します
- 古いドキュメントに依存するのをやめてください。`/payments/epusdt/v1/...` などの古い情報を参照するのはやめてください。
- 動的なチェーン/トークンUIが必要な場合は、`/payments/gmpay/v1/config` を取得し、`data.supported_assets` を読み取ってください。
