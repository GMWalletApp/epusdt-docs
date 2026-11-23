---
description: "GMPay Edge의 주문 및 결제 로직이 Workers와 Bun 간에 어떻게 공유되고, 각 배포 환경에서 어떤 저장 및 실행 서비스가 사용되는지 확인해 보세요."
titleTemplate: ":title | GMPay Edge"
---

# 아키텍처 {#architecture}

GMPay Edge는 Worker 하나 또는 Bun/Nitro 컨테이너 하나로 실행됩니다. 두 환경 모두 동일한 인터페이스와 주문·결제 로직을 사용하며, 인프라에 연결하는 어댑터만 다릅니다.

## 서비스 인터페이스 {#product-surfaces}

- 가맹점 클라이언트는 GMPay 또는 EPay 호환 인터페이스를 호출합니다.
- 구매자는 호스팅 결제 페이지에서 결제합니다.
- 운영자들은 `/admin`을 사용합니다.
- 텔레그램 사용자들은 설정된 봇을 통해 상호작용합니다.

## 런타임 서비스 {#runtime-services}

| 기능 | Cloudflare Workers | Bun/Nitro Docker |
| --- | --- | --- |
| 데이터베이스 | D1 | `GMPAY_DATA_DIR`에 저장되는 SQLite |
| 캐시 | KV | 로컬 런타임 캐시 |
| 비공개 객체 | R2 | 지속적인 로컬 객체 저장 |
| 백그라운드 작업 | Cloudflare Queues | 영구 저장되는 로컬 큐 |
| 작업 예약 | Cron Triggers | Bun 스케줄러 |

Bun 데이터 디렉터리에는 업로드된 파일과 안정적인 큐 상태도 포함되어 있습니다. 지속적인 볼륨에 마운트되어야 하며, 백업에 포함되어야 합니다.

## Cloudflare 바인딩 {#cloudflare-bindings}

| 바인딩 | Cloudflare 제품 | 용도 |
| --- | --- | --- |
| `DB` | D1 | 신뢰할 수 있는 애플리케이션, 결제, 승인, 그리고 배송 데이터 |
| `CACHE` | KV | 짧은 시간 동안 유효한 캐시 및 부가적인 통계 데이터 |
| `FILES` | R2 | 개인 결제 검토 증거 및 생성된 내보내기 |
| `PAYMENT_QUEUE` | 큐 | 비동기 결제 스캔 |
| `WEBHOOK_QUEUE` | 큐 | 비동기 상점 웹훅 전달 |

## 백그라운드 작업 {#background-work}

실행 환경에 특화된 내구성 있는 큐와 스케줄러는 결제 스캔 및 Webhook 재시도를 동시 요청 외부로 이동합니다. 또한 결제 만료, 정리, 연결 상태 확인, 그리고 속도 동기화 기능을 처리합니다.

Webhook 전송은 내구성 있는 아웃박스와 재시도 기록, 수동 재시도, 그리고 두 가지 환경에서 감사 기록을 사용합니다.

## 데이터 및 보안 모델 {#data-and-security-model}

- 선택한 런타임에 따라 D1 또는 SQLite를 기준 데이터베이스로 사용합니다.
- 캐시 및 개인 객체 저장소는 선택된 런타임의 어댑터를 사용합니다.
- 결제 어댑서는 읽기 전용입니다.
- 관리팀은 Better Auth, TOTP, 그리고 동적 다중 역할 RBAC을 사용합니다.

## 프로토콜 적용 범위 {#protocol-boundaries}

GMPay는 **HMAC-SHA256** 서명을 사용합니다. EPay 호환 인터페이스는 기존 **MD5** 방식을 사용합니다. 발신 콜백은 주문을 생성한 프로토콜의 서명 형식을 따릅니다.
