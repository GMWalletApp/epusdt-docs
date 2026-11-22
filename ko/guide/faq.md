---
description: "GMPay 및 EPay, 상점 정보, 활성화된 자산, 그리고 EPUSDT 통합 시 콜백 확인에 대한 정보 문의."
title: "가맹점 연동 FAQ"
---

# FAQ {#faq}

## 어떤 길을 사용해야 할까요? {#which-route-should-i-use}

- 새로 연동할 때는 모두 **GMPay를 사용하세요**.
- 연동 시스템이 EPay 방식의 결제 페이지 리디렉션을 요구할 때만 **EPay 호환 리디렉션을 사용하세요**.
- 현재 소스에는 `/payments/epusdt/v1/order/create-transaction` 경로가 등록되어 있지 않습니다. **새 연동에 사용하지 마세요.**

## `pid`와 서명 키는 어디에서 얻어지는 걸까요? {#where-do-pid-and-signing-keys-come-from}

관리자 패널 API 키 기록에서, 각 상점은 `pid`와 일치하는 `secret_key`를 가지고 있습니다.

## GMPay 설정이 환경마다 다른 이유는 무엇입니까? {#why-does-the-gmpay-config-differ-between-environments}

`GET /payments/gmpay/v1/config`은 귀하의 관리 데이터에서 계산되기 때문입니다.

`data.supported_assets` 목록은 해당 환경에서 활성화된 체인, 활성화된 체인 토큰, 그리고 사용 가능한 지갑 주소에 따라 결정됩니다.

## 어떤 노드가 필요한가요? {#which-nodes-do-i-need}

내장 ChainScanner에는 공개 노드가 포함되어 있습니다. TRON은 지원되는 공개 엔드포인트를 TronGrid 키 없이 사용할 수 있습니다. 노드 추가 시 네트워크와 제공자가 실제 제공하는 프로토콜을 선택하세요. WebSocket 구독으로 새 블록 알림을 받고 별도 HTTP 엔드포인트에서 블록을 읽을 수 있습니다.

대시보드에는 스캔 진행 상황이 표시되고, 관찰 시간 지연이 5분 이상 지속될 경우 경고합니다. 빈번하게 Solana, TON 또는 Plasma에 대한 쿼리를 사용하는 경우, 두 개의 독립적인 제공업체로부터 백업 노드를 구성하고, 그들의 용량을 확인하십시오.

## 환율은 어떻게 결정되나요? {#how-are-exchange-rates-set}

`fixed` 모드는 `rate.forced_rate_list`를 사용하고 `auto` 모드는 `rate.api_url`에서 환율을 가져옵니다. 자동 갱신이 실패하면 마지막 캐시 값을 유지합니다. 고정 환율 목록을 비우면 USDT 및 USDC에 대한 기본 CNY 환율이 복원됩니다.
