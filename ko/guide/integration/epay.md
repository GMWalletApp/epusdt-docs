---
description: "리디렉션 결제 경로와 서명된 요청 매개변수를 사용해 EPay 호환 가맹점 시스템을 EPUSDT에 연동하세요."
title: "EPay 호환 리다이렉트 체크아웃"
---

# EPay 호환 연동 (결제 페이지 리디렉션) {#epay-compatible-integration-redirect-checkout}

연동 시스템이 EPay 방식의 리디렉션 주문 경로를 요구할 때만 이 방식을 사용하세요.

## 경로 {#route}

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 상업 신용 증명 요구 {#merchant-credential-requirement}

수신 요청을 검증할 때 이전 환경 변수인 `epay_pid`나 `epay_key`는 **사용하지 않습니다**.

현재 방식은 다음과 같이 작동합니다:

1. 들어오는 `pid` 읽기
2. 해당 PID에 해당하는 활성화된 `api_keys` 행을 찾으세요.
3. `sign`을 해당 행의 `secret_key`로 확인하세요.
4. 선택적 IP 목록 확인 기능 활성화

## 필수 요청 필드 {#required-incoming-fields}

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

공통 선택 필드

- `return_url`
- `name`
- `type`
- `token`
- `network`
- `currency`
- `sign_type`

현재 `type`는 두 가지 지원되는 형태를 가지고 있습니다.

- `alipay` — 호환용 값입니다. 먼저 요청에 명시된 `token`과 `network`에서 토큰과 네트워크를 가져오며, 없으면 관리자의 EPay 기본값을 사용합니다.
- `token.network` 선택자, 예를 들어 `usdt.tron` – 현재 지원되는 토큰/네트워크 쌍일 때만 유효합니다. 유효한 선택자는 `token`, `network`, `epay.default_token`, 및 `epay.default_network`을 대체합니다.

다른 비어 있지 않은 `type` 값은 유효하지 않은 매개변수로 거부됩니다. 선택되거나 호환되는 `type`은 나중에 EPay 반환/알림 콜백에 저장됩니다.

## EPay 기본값 {#epay-defaults}

서명 확인이 완료되면, 현재 소스가 관리자 설정을 포함한 내부 공유 주문 페이로드를 생성합니다.

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

EPay submit.php의 해결 절차는 다음과 같습니다:

1. `type=token.network` 선택자를 지원합니다 (제공된 경우).
2. 명시적인 요청: `token` / `network` 매개변수
3. 관리자 설정 `epay.default_token` / `epay.default_network`
4. 토큰과 네트워크 모두 비어 있는 경우, 계산대 선택 흐름에 대한 '`4`' 번의 대체 주문 상태를 생성합니다.

화폐는 독립적입니다: `currency` 요청 → `epay.default_currency` → `cny`.

## 성공 시 동작 {#success-behavior}

성공 시, 최종 결과는 브라우저를 다음 주소로 리디렉션합니다:

```text
/pay/checkout-counter/{trade_id}
```

현재, 해당 경로는 호스팅된 계산 시스템(SPA)의 리디렉션 엔트리로 사용되고 있습니다. 결제 페이지의 데이터는 다음과 방식으로 제공됩니다:

```text
/pay/checkout-counter-resp/{trade_id}
```


## 직접적인 토큰/네트워크 선택 {#direct-token-network-choices}

상류의 "새로운 API" 결제 방법 목록에서, 지원되는 `token.network` 선택자와 `type`이 같은 별도의 옵션을 노출합니다. 예를 들어, `usdt.tron`은 직접 TRON USDT 주문을 생성하는 반면, `usdt.binance`는 해당 자산이 활성화되면 Binance/BSC USDT 주문을 생성합니다.

예시적인 상류 방법 목록:

```json
[
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay", "type": "custom1" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.binance", "type": "usdt.binance" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.tron", "type": "usdt.tron" }
]
```

`custom1`은 연동 시스템에서 사용하는 일반 옵션명입니다. EPay submit.php에 그대로 보내지 마세요. `type`을 생략하거나 `type=alipay` 또는 `usdt.tron`처럼 유효한 값을 전달하세요.

## 콜백 검증 {#callback-verification}

생성된 주문의 `payment_type = Epay`이면 Worker가 이후 EPay 형식의 쿼리 매개변수로 `notify_url`을 호출하며 **동일한 가맹점 `secret_key`**로 서명합니다.

콜백의 `type`은 저장된 요청 유형을 재사용합니다. 즉, `alipay` 또는 수용된 선택자(예: `usdt.tron`)를 반환합니다. 요청에 `type`이 누락된 경우, 외부 콜백은 호환성을 위해 `alipay`로 기본값으로 돌아갑니다.

오래된 독립적인 `epay_key`를 사용하여 해당 콜백을 확인하지 마세요.
