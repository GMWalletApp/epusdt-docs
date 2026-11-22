---
description: "기존의 EPUSDT 상점 통합을 폐기된 주문 경로에서 GMPay 또는 EPay 호환 리디렉션 흐름으로 이동합니다."
---

# 이전 버전에서 마이그레이션 {#legacy-migration}

현재의 소스는 더 이상 이전의 Epusdt 주문 경로를 노출하지 않습니다.

## 제거된 경로 {#removed-routes}

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## 대체 경로 {#what-to-use-instead}

### 클라이언트 코드를 변경할 수 있는 경우 {#if-you-control-the-client-code}

**GMPay** 사용 시

```text
POST /payments/gmpay/v1/order/create-transaction
```

### 연동 시스템이 EPay 리디렉션 방식만 지원하는 경우 {#if-the-upstream-system-only-supports-redirect-style-epay-flows}

**EPay 호환 방식** 사용 시

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 마이그레이션 점검 목록 {#migration-checklist}

- 기존 엔드포인트 URL을 교체하세요.
- 모든 수신 요청에 `pid`를 추가하세요.
- 해당 가맹점 레코드의 `secret_key`로 요청에 다시 서명하세요.
- `/payments/epusdt/v1/...`를 안내하는 이전 문서는 더 이상 사용하지 마세요.
- 동적인 체인/토큰 UI가 필요하시면 `/payments/gmpay/v1/config`를 가져와서 `data.supported_assets`를 읽으세요.
