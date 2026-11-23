---
description: "EPUSDT 출시 정보를 확인하고, 자체 호스팅 게이트웨이를 업그레이드하기 전에 데이터베이스, 배포 및 결제 API 변경 사항을 확인하십시오."
---

# 변경 이력 {#release-notes}

## v2.1.1 {#v2-1-1}

2026-11-21 · [릴리스 노트](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.1)

EPUSDT는 이제 SQLite만 사용합니다. 기존 SQLite 사용자는 설정 및 데이터베이스를 유지할 수 있습니다. MySQL 또는 PostgreSQL을 사용한다면 업그레이드 전에 백업하고 데이터를 이전한 뒤 검증하세요.

## v2.1.0 {#v2-1-0}

2026-11-21 · [릴리스 노트](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

- 내장 ChainScanner는 저장된 위치에서 스캔을 재개하고 누락된 블록을 다시 처리합니다. 엄격한 검증 모드에는 확인 중 및 수동 검토 상태가 추가됩니다.
- 새로운 8개의 직접 결제 네트워크가 추가되어 총 16개로 늘었습니다. 또한, 체크아웃은 X 레이어의 OKX OnchainOS와 함께, 그리고 선택적인 거래 출금 수수료 알림 기능을 지원합니다.
- SQLite 잠금 경쟁 문제와 만료된 주문으로 인한 예약된 주문 금액 문제를 해결합니다. v2.0.0 버전에서 업그레이드하는 사용자는 컨테이너를 다시 생성하기 전에 데이터를 이전해야 합니다.

## v2.0.0 {#v2-0-0}

- 릴리스 태그: `v2.0.0`
- 게시일: `2026-07-23T06:04:47Z`
- 공식 릴리스 노트: `Breaking change for GMPay integrations: GMPay signatures changed from MD5 to HMAC-SHA256`
- 전체 변경 이력: `https://github.com/GMWalletApp/epusdt/compare/v1.0.10...v2.0.0`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes}

- **호환성이 달라진 GMPay 서명**: GMPay 요청 및 콜백 서명은 이제 가맹점의 `secret_key`를 HMAC 키로 사용하는 HMAC-SHA256 방식입니다. 기존 MD5 방식 클라이언트는 업그레이드할 때까지 `401 Unauthorized`를 받습니다.
- EPay 호환 요청 및 콜백은 영향을 받지 않으며 기존대로 `sign` 및 `sign_type` 필드와 MD5를 사용합니다.
- 수동 계산사 초기화 데이터에 이제 `server_time` 정보가 포함되어, 클라이언트들이 서버 시간 기준으로 카운트다운을 계산할 수 있게 되었습니다.
- 표준 라이브러리만 사용하는 Python GMPay 주문 생성 예제를 `sdk/python/gmpay_create_order.py`에 추가했습니다.
- EVM 결제 이전 거래 복구 기능이 개선되어, 중단된 스캐너 창을 보다 안정적으로 복구할 수 있습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes}

- v2.0.0 배포 전에 GMPay 클라이언트를 업그레이드합니다: `signature` 제외, 빈 값 제외, ASCII 키 순서에 따라 매개변수 정렬, `key=value&key=value` 형식으로 결합, 그리고 `secret_key`를 사용하여 소문자 기반의 HEX HMAC-SHA256 계산.
- 현재 설정 기능은 `rate.mode=fixed|auto` 및 `rate.cache_ttl_seconds` (`10`초에서 `86400`초 사이)를 지원합니다. 고정 모드는 `rate.forced_rate_list`를 사용하며, 자동 모드는 `rate.api_url`을 가져와 지속적인 캐시를 저장합니다.
- 자동 평가지정 기능은 제공자 응답이 불완전하더라도 이전의 성공적인 거래 비율을 유지하며, 새로 고침이나 지속성 실패 시 마지막으로 저장된 캐시를 계속 제공합니다.

### API 변경 사항 {#api-changes}

- 이제 `POST /payments/gmpay/v1/order/create-transaction`은 GMPay `signature`를 MD5 대신 HMAC-SHA256으로 검증합니다.
- GMPay 상점의 모든 후속 연락은 동일한 HMAC-SHA256 표준 매개변수 규칙에 따라 확인되어야 합니다.
- 이제 `GET /pay/checkout-counter-resp/{trade_id}` 응답에 `server_time`이 포함됩니다.
- 관리 API는 속도 캐시 검사 및 강제 새로 고침 기능을 위해 `GET /admin/api/v1/settings/rate/status` 및 `POST /admin/api/v1/settings/rate/refresh` 엔드포인트를 추가합니다.

### 변경 사항 출처 {#evidence-used}

- GitHub 릴리스 `v2.0.0`
- PR `#104` (개발 통합) 및 PR `#99` (EVM 데이터 복구)
- 커밋: `44d90b6` (EVM 누락 데이터 복구), `f086d8b` (결제 화면 `server_time`), `3dc8ab0` (영구 대체 캐시를 사용하는 자동 환율), `58141cd` (GMPay HMAC-SHA256 서명), `2353d85` (Python GMPay SDK 예시).
- 파일: `src/middleware/check_sign.go`, `src/util/sign/sign.go`, `src/model/service/epay_return.go`, `src/model/response/pay_response.go`, `src/config/rate.go`, `src/controller/admin/settings_controller.go`, `src/route/router.go`, `src/task/listen_evm_backfill.go`, `sdk/python/gmpay_create_order.py`


## v1.0.10 {#v1-0-10}

- 릴리스 태그: `v1.0.10`
- 게시일: `2026-07-10T13:24:42Z`
- 공식 릴리스 노트: `Allow admin to mark expired on-chain orders as paid and seed rates`
- 전체 변경 이력: `https://github.com/GMWalletApp/epusdt/compare/v1.0.9...v1.0.10`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-1}

- 제출한 트랜잭션 해시를 검증한 후 관리자가 **만료된 온체인 주문**을 수동으로 결제 완료 처리할 수 있습니다. 공개 결제 화면에서 해시를 제출하는 경로는 여전히 대기 중인 주문만 허용하고, 만료된 주문과 OkPay 등 외부 결제 서비스 주문은 거부합니다.
- 내장된 강제 환율 기본값이 CNY 스테이블 코인 변환에 적용됩니다: `cny.usdt`와 `cny.usdc`는 모두 `0.14705882352941177`로 기본 설정됩니다.
- `rate.forced_rate_list`이 레이트 설정이 업데이트되거나 설정이 삭제되면, 기본 CNY 안정화 암호화폐의 기본값으로 복원됩니다. 어떤 비어 있지 않은 사용자 지정 JSON은 사용자가 소유하며, 병합되거나 덮어쓰이지 않습니다.
- `rate.api_url`는 이제 선택 사항이 아니지만, 제공될 경우 여전히 유효한 공용 HTTP/HTTPS URL이어야 합니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-1}

- `epctl upgrade`는 이제 기존의 `/opt/epusdt/.env` 파일이 필요하므로, 업그레이드 과정에서 새로운 설정 파일을 생성하지 않습니다. 신규 머신에서는 먼저 `install` 명령을 실행하십시오.
- `epctl upgrade` 명령은 기본적으로 릴리스 파일을 교체하고 `epusdt`를 재시작합니다. `--no-restart` 옵션을 사용하면 파일을 준비하되 재시작하지 않거나, `--prompt-restart` 옵션을 사용하여 인터랙티브 터미널에서 확인합니다.
- 업그레이드 배포는 현재 바이너리, `.env.example`, 그리고 systemd 유닛에 대한 이전 버전 복구 파일을 유지합니다. 파일 배포 또는 재시작에 실패할 경우, `epctl`은 이전 버전 파일로 복구 시도합니다.

### API 변경 사항 {#api-changes-1}

- 어드민 마크-페이드는 체인 거래 검증 후 대기 중인 및 만료된 온체인 주문을 수락합니다.
- `POST /pay/submit-tx-hash/{trade_id}` 경로의 요청은 더욱 엄격해졌습니다. 현재 체인 내에서 대기 중인 주문만 허용하며, 만료된 주문은 검증 전에 거부됩니다.
- Rate 설정 설명서에서 `rate.api_url`을 선택 사항으로 처리하고, `rate.forced_rate_list`에 대한 기본값 복원 동작에 대한 설명을 제공합니다.

### 변경 사항 출처 {#evidence-used-1}

- GitHub 릴리스 `v1.0.10`
- PR `#97` (개발 통합)
- 커밋: `392240e` (관리자 - 만료된 온체인 주문에 대한 지불), `d18965d` (CNY 스테이블코인에 대한 기본 강제 비율), `6589ad1` (epctl 업그레이드 재시작 및 안전한 배포 제어), `8f03599` / `5668a2a` (프론트엔드 빌드 동기화
- 파일: `src/controller/admin/order_controller.go`, `src/controller/comm/pay_controller.go`, `src/model/service/order_service.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/model/dao/mdb_table_init.go`, `src/controller/admin/settings_controller.go`, `epctl`, `wiki/EPCTL.md`, `wiki/EPCTL.en.md`


## v1.0.9 {#v1-0-9}

- 릴리스 태그: `v1.0.9`
- 게시일: `2026-06-29T10:11:08Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.8...v1.0.9`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-2}

- **EPay 타입 선택기**: EPay submit.php는 이제 `type=alipay` 또는 지원되는 `type=token.network` 선택기 (예: `usdt.tron`)를 사용하여 제출할 수 있습니다. 유효한 선택기는 직접 결제 토큰/네트워크를 선택합니다.
- EPay의 반환 및 알림 콜백은 이제 항상 `alipay`를 반환하는 대신 주문 요청에 저장된 `type`을 유지합니다.
- 설치 과정에서 초기 관리자 비밀번호를 처음 설정 시 반환할 수 있으며, 현재 노출된 관리자 API는 프런트엔드 경고를 위해 초기 비밀번호 해시 엔드포인트를만 유지합니다.
- `epctl` Linux 바이너리 설치/관리 프로그램과 함께, Docker 기반의 엔드투엔드 검증을 위한 `epctl-docker-test.sh` 파일을 추가했습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-2}

- `epctl`는 릴리스된 바이너리를 `/opt/epusdt`에 설치하고, `epusdt.service` 파일을 생성하며, 설치 또는 업그레이드 시 기존의 `/opt/epusdt/.env` 파일을 유지하며, 전역적으로 `/usr/local/bin/epctl`에 설치할 수 있습니다.
- 올바른 `type=token.network` 값을 지정하면 EPay의 `epay.default_token` 및 `epay.default_network`는 무시합니다. 통화 대체값에는 여전히 `epay.default_currency`를 사용합니다.
- 새로운 환경 변수는 필요하지 않습니다.

### API 변경 사항 {#api-changes-2}

- `GET` 및 `POST /payments/epay/v1/order/create-transaction/submit.php`는 이제 비어 있지 않은 `type`을 `alipay` 또는 현재 지원되는 `token.network` 선택자와 제한합니다.
- `GET /pay/return/{trade_id}`와 EPay 비동기 알림에는 주문에 저장된 `type`을 사용합니다. `type`이 없으면 `alipay`를 사용합니다.
- `GET /admin/api/v1/auth/init-password-hash` 엔드포인트는 초기 비밀번호 상태를 노출하는 경로로 유지됩니다. 이전의 평문 방식인 `init-password` 관리 경로가 이번 릴리스에서 등록되지 않았습니다.

### 변경 사항 출처 {#evidence-used-2}

- GitHub 릴리스 `v1.0.9`
- PR `#92` (개발 통합)
- 커밋: `2dc538c` (EPay 타입 선택자), `73aef80` (제출 타입 제한), `15de0e6` (초기 비밀번호 유지), `7d09adf` (초기 관리자 비밀번호 반환), `1cdb1ed` (epctl 설치 프로그램 및 설명서
- 파일: `src/route/router.go`, `src/controller/comm/order_controller.go`, `src/model/service/epay_return.go`, `src/install/installer.go`, `epctl`, `epctl-docker-test.sh`, `wiki/EPCTL.md`


## v1.0.8 {#v1-0-8}

- 릴리스 태그: `v1.0.8`
- 게시일: `2026-06-20T06:31:53Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.7...v1.0.8`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-3}

- Aptos 체인의 USDT 및 USDC 결제를 지원합니다. Aptos Move 기반 자산에 대한 토큰 설정, RPC 라우팅 및 온체인 거래 스캔 기능이 포함됩니다.
- 이제 Aptos 토큰 지원 및 RPC 라우팅은 관리자가 설정한 chain과 chain_token을 따릅니다. 스캐너에 고정된 컨트랙트 주소를 제거했습니다.
- 수동 결제 확인 기능이 이제 Aptos 거래 검증을 지원합니다.
- README 문서는 Aptos를 다른 지원되는 체인과 함께 목록으로 업데이트되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-3}

- Aptos 체인은 관리 패널에 구성된 RPC 엔드포인트를 필요로 합니다. 스캐너는 Aptos 리더십 버전과 토큰 전송에 대한 Move 모듈 이벤트를 스캔합니다.
- 새로운 환경 변수는 필요하지 않습니다. Aptos 체인 및 토큰 설정은 기존 관리 체인/토큰 설정 흐름을 따릅니다.

### API 변경 사항 {#api-changes-3}

- Aptos는 지원되는 자산 목록 및 주문 생성 엔드포인트에서 네트워크 옵션으로 이용할 수 있습니다.
- 관리 체인 및 토큰 관리 엔드포인트가 이제 Aptos에 특화된 설정 필드를 지원합니다.

### 변경 사항 출처 {#evidence-used-3}

- GitHub 릴리스 `v1.0.8`
- PR `#91` (개발 통합)
- 커밋: `de96a5d` (Aptos 지원), `8216c91` (설정 기반 토큰 지원)
- 파일: `README.md`, `README.en.md`, `src/controller/admin/chain_token_controller.go`, `src/model/service/aptos_task.go`, `src/task/listen_aptos_scanner.go`, `src/util/address/move.go`


## v1.0.7 {#v1-0-7}

- 릴리스 태그: `v1.0.7`
- 게시일: `2026-06-16T11:37:43Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.6...v1.0.7`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-4}

- GMPay 및 EPay 주문 생성 엔드포인트가 이제 대체 주문 기능을 지원합니다. 주문 생성 시 즉각적인 체인 내 결제 주소가 필요하지 않으므로, 실제 결제 방법이 선택되기 전에 주문 ID가 필요한 통합을 가능하게 합니다.
- 플래스홀더 주문은 고객이 계산 단계에서 결제 네트워크를 선택했을 때, 실제 체인 내 주문으로 변환됩니다.
- 주문 워크플로우가 이제 네트워크 선택 지연 기능을 지원하여, 상점들이 먼저 주문을 생성하고 고객이 나중에 결제 방식을 선택할 수 있도록 합니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-4}

- 새로운 환경 변수는 필요하지 않습니다.
- GMPay 및 EPay 흐름에서 기본적으로 대체 주문 지원 기능이 활성화되어 있습니다.

### API 변경 사항 {#api-changes-4}

- `POST /payments/gmpay/v1/order/create-transaction` 및 EPay 주문 생성 엔드포인트가 이제 `network` 또는 `token` 매개변수를 미리 요구하지 않고 주문을 받을 수 있습니다. 이러한 매개변수를 생략하면 대체 주문이 생성됩니다.
- 대체 주문은 `trade_id`와 계산대 URL을 반환하지만, 고객이 네트워크를 선택할 때까지 지갑 주소를 포함하지 않습니다.
- `POST /pay/switch-network` API 호출은 임시 주문을 실제 체인 기반 주문으로 전환합니다. 선택된 네트워크를 할당하고 결제 주소를 생성합니다.

### 변경 사항 출처 {#evidence-used-4}

- GitHub 릴리스 `v1.0.7`
- PR `#89` (개발 통합)
- Commit: `3ab3659` (대체 주문 지원)
- 파일: `src/model/service/order_service.go`, `src/controller/comm/order_controller.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data.go`, `wiki/API.md`


## v1.0.6 {#v1-0-6}

- 릴리스 태그: `v1.0.6`
- 게시일: `2026-06-11T16:51:24Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.5...v1.0.6`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-5}

- 현재 시스템은 TON 블록체인 및 USDT Jetton 결제를 지원하며, liteclient 기반의 거래 스캔, TON 주소 정규화 (원시/사용자 친화적/반환 가능한 형식), 그리고 Jetton 계약 검증 기능을 제공합니다.
- 수동 결제 확인 과정에 이제 TON 거래 확인 및 체인상 증명 검증이 포함되었습니다.
- 관리 설정 패널에서 서버를 재시작하지 않고도 실행 시간 로그 레벨을 조정할 수 있습니다. 로그 레벨 변경은 모든 활성 로거에서 즉시 적용됩니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-5}

- TON liteclient은 공용 liteserver 설정(메인넷 또는 테스트넷)을 필요로 합니다. 스캐너는 최신 마스터체인 블록부터 시작하여 Jetton 전송에 대한 샤드 체인 정보를 따라가며 업데이트됩니다.
- 새로운 환경 변수가 필요하지 않습니다. TON 체인 및 토큰 설정은 기존 RPC 노드 및 체인 토큰 설정 흐름을 따릅니다.

### API 변경 사항 {#api-changes-5}

- TON은 지원되는 자산 목록 및 주문 생성 엔드포인트에서 체인 옵션으로 이용할 수 있습니다.
- 관리자 설정 API가 이제 `log_level`을 포함하여 런타임 로그 설정을 추가했습니다. (유효한 값: `debug`, `info`, `warn`, `error`).

### 변경 사항 출처 {#evidence-used-5}

- GitHub 릴리스 `v1.0.6`
- PR `#87` (개발 통합)
- 커밋: `9b397bd` (TON 지원), `9ac9894` (실행 시간 로그 레벨)
- 파일: `src/task/listen_ton.go`, `src/util/address/ton.go`, `src/model/service/ton_task.go`, `src/util/log/log.go`, `src/controller/admin/settings_controller.go`


## v1.0.5 {#v1-0-5}

- 릴리스 태그: `v1.0.5`
- 게시일: `2026-06-09T16:25:25Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.4...v1.0.5`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-6}

- 관리자 대시보드가 이제 Server-Sent Events (SSE) 엔드포인트를 통해 실시간 RPC 노드 실행 통계를 제공합니다. 이를 통해 프론트엔드는 별도의 요청 없이, RPC 호출 횟수, 성공률, 오류 통계를 실시간으로 표시할 수 있습니다.
- 솔라나 RPC 작업 통계는 이제 각 노드 및 각 작업의 호출 횟수 (서명 스캔, 거래 가져오기, 확인 가져오기)와 오류 이벤트를 추적합니다.
- EVM 웹소켓 및 블록 스캔 작업이 이제 메모리 내의 통계 추적기에 RPC 호출 메트릭 정보를 보고합니다.
- README 파일이 보안 감사 정보와 새로운 스크린샷으로 업데이트되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-6}

- 새로운 환경 변수는 필요하지 않습니다.
- SSE 엔드포인트는 `/api/admin/v1/rpc/stats/stream`에서 이용할 수 있으며, 관리자 JWT 인증이 필요합니다.

### API 변경 사항 {#api-changes-6}

- `GET /api/admin/v1/rpc/stats/stream` (SSE)는 RPC 노드 실행 통계의 JSON 스트림을 반환합니다. 각 이벤트에는 노드 ID, 호출 횟수, 성공 횟수, 오류 횟수 및 마지막 확인 시간 정보가 포함됩니다.

### 변경 사항 출처 {#evidence-used-6}

- GitHub 릴리스 `v1.0.5`
- PR `#86` (개발 통합)
- 커밋: `08d409d` (RPC 통계 SSE), `54b83f8` (README 업데이트), `3879853` (자산 파일)
- 파일: `src/controller/admin/dashboard_controller.go`, `src/model/data/rpc_runtime_stats.go`, `src/task/listen_sol_job.go`, `src/task/listen_evm_ws.go`, `README.md`


## v1.0.4 {#v1-0-4}

- 릴리스 태그: `v1.0.4`
- 게시일: `2026-06-03T13:01:37Z`
- 공식 릴리스 노트: `feat(www): enable RPC node create and edit actions — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.3...v1.0.4`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-7}

- 관리자 웹 인터페이스에서 이제 브라우저 내에서 직접 RPC 노드를 생성하고 편집할 수 있습니다. 이전에는 이러한 기능이 프론트엔드에서 사용되지 않거나 불완전했습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-7}

- 새로운 환경 변수나 백엔드 변경은 필요하지 않습니다. 이 업데이트는 전면적인 업데이트입니다.

### API 변경 사항 {#api-changes-7}

- API 경로가 추가되거나 삭제되지 않았습니다. 현재 프론트엔드는 기존 RPC 노드 관리 엔드포인트에 정확하게 접근하고 있습니다.

### 변경 사항 출처 {#evidence-used-7}

- GitHub 릴리스 `v1.0.4`
- PR `#85`: 기능(www): RPC 노드 생성 및 편집 기능 활성화
- 커밋: `3e85bf7` (자산 업데이트)
- 파일: `src/www/assets/*` (프론트엔드 번들 업데이트)


## v1.0.3 {#v1-0-3}

- 릴리스 태그: `v1.0.3`
- 게시일: `2026-05-27T11:42:43Z`
- 공식 릴리스 노트: `docs: update payment API integration guide — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.2...v1.0.3`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-8}

- 거래 ID는 이제 암호학적으로 안전한 무작위 바이트를 사용하여 생성되고, URL에서 안전하게 사용 가능한 Base64로 인코딩됩니다. 이전의 타임스탬프 기반 형식 대신 사용되므로, 충돌 위험을 줄이고 익명성을 향상시킵니다.
- RPC 노드에 `purpose` 필드(`general`, `manual_verify`, `both`)가 추가되었습니다. 운영자는 스캔, WSS 및 상태 확인 트래픽에 영향을 주지 않고 수동 결제 검증 전용 노드를 지정할 수 있습니다.
- 수동 결제 검증은 `manual_verify` RPC 노드를 우선 사용합니다. 전용 노드가 없으면 `general` 노드를 사용합니다. 이 방식으로 검증 부하와 스캔 부하를 분리합니다.
- 계산대 결제 페이지가 이제 사용자가 거래 해시를 수동으로 제출할 수 있도록 기능을 추가했습니다. 제출된 해시는 주문이 결제된 것으로 표시되기 전에 체인 상에서 검증됩니다.
- 대시보드 트렌드 집계 쿼리가 이제는 데이터베이스별 특정 SQL (MySQL/PostgreSQL/SQLite)을 사용하여 모든 지원되는 데이터베이스에서 정확한 날짜 자르기를 보장합니다.
- 결제 후 확인 및 요금 API URL이 이제 검증을 거쳐 사설 IP 범위(RFC 1918)를 거부하도록 변경되어, 사용자 제어 가능한 콜백 URL을 통한 SSRF 공격을 방지합니다.
- 저장소 README 파일에 있는 결제 API 통합 가이드가 더욱 명확한 예시와 엔드포인트 설명으로 업데이트되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-8}

- 새로운 환경 변수는 필요하지 않습니다.
- 운영자는 관리 패널에서 `purpose: manual_verify`로 RPC 노드를 태그하여, 검증 트래픽과 스캔 트래픽을 분리할 수 있습니다.

### API 변경 사항 {#api-changes-8}

- `POST /api/admin/v1/order/update-trade-status` 및 `POST /payments/gmpay/v1/pay/submit-hash`는 수동적인 해시 제출을 위한 `tx_hash` 매개변수를 사용합니다. 상태 변경 전에 체인 상에서 해시가 유효성 검증됩니다.
- RPC 노드 생성 및 업데이트 엔드포인트가 이제 `purpose` 필드를 받게 되었습니다. (`general`, `manual_verify`, `both`). 기본값은 `general`입니다.

### 변경 사항 출처 {#evidence-used-8}

- GitHub 릴리스 `v1.0.3`
- PR `#81` (개발 통합)
- 커밋: `c69b0d6` (RPC 목적 격리), `13c81ee` (암호화된 무작위 거래 ID), `fca75a9` (캐셔 해시 제출), `b70995f` (대시보드 SQL 구문 수정), `0d97237` (README 업데이트), `7fcb7b3` (결제 API 문서
- 파일: `src/model/mdb/rpc_node.go`, `src/model/data/rpc_node_data.go`, `src/controller/admin/rpc_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data_stats.go`, `src/controller/comm/pay_controller.go`, `README.md`


## v1.0.2 {#v1-0-2}

- 릴리스 태그: `v1.0.2`
- 게시일: `2026-05-22T15:16:34Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.1...v1.0.2`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-9}

- 관리자 API의 `Authorization` 헤더는 표준 `Bearer <token>` 형식 외에 `Bearer ` 접두사가 없는 JWT도 허용합니다. 토큰만 보내는 클라이언트도 인증할 수 있습니다.
- EVM ERC20 전송 스캔 기능이, 주문 생성 전에 도착한 전송을 제외하도록 변경되어, 오래된 블록체인 이벤트에서 발생하는 잘못된 결합을 제거합니다.
- OkPay 결제 완료 알림이 주문이 OkPay 경로를 통해 완료된 후에도 정확하게 전송됩니다.
- 솔라나 서명 처리 과정이 일시적인 오류 발생 시 재시도 – 주문 매칭 및 결제 처리가 완전히 완료된 후에만 서명이 처리된 것으로 표시되므로, 일시적인 실패로 인해 결제가 무시되는 현상이 더 이상 발생하지 않습니다.
- 현재 설정 기능은 다국 통화 강제 환율 목록을 지원하여, 운영자가 여러 통화의 환율을 동시에 고정할 수 있도록 합니다. 단, 이전에는 하나의 글로벌 환율만 적용되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-9}

- 새로운 환경 변수는 필요하지 않습니다.
- 다중 통화 강제 환율 기능은 이전에는 단일 강제 USDT 환율을 사용하신 경우, 관리 설정 패널에서 환율 설정을 업데이트해야 할 수 있습니다.

### API 변경 사항 {#api-changes-9}

- 관리자 JWT 미들웨어는 이제 `Authorization: Bearer <token>`과 `Authorization: <token>`(토큰만 전송) 두 형식을 모두 지원합니다.
- 새로운 공공 노선은 추가되거나 삭제되지 않았습니다.

### 변경 사항 출처 {#evidence-used-9}

- GitHub 릴리스 `v1.0.2`
- PR `#80` (개발 통합)
- 커밋: `f4ef71b3`, `4b4701f5`, `449d22a4`, `dec1b97b`, `8a486116`, `2a00a033`
- 변경 사항: 관리자 JWT 미들웨어, EVM ERC20 블록 리스너, OkPay 알림 처리기, 솔라나 서명 재시도 로직, 요율 설정 모델


## v1.0.1 {#v1-0-1}

- 릴리스 태그: `v1.0.1`
- 게시일: `2026-05-21T11:40:39Z`
- 공식 릴리스 노트: `feat: expose build version in public config — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.0...v1.0.1`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-10}

- `GET /payments/gmpay/v1/config` 응답에 이제 `version` 필드가 추가되어, 현재 실행 중인 서버 빌드 버전을 나타냅니다 (예: `"version": "v1.0.1"`).
- 삭제된 설정 기록이 이제 업서트 기능을 사용하여 복구되도록 변경되었으며, 이전 삭제 후에도 설정 변경이 제대로 적용되도록 합니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-10}

- Docker 이미지 게시는 이제 `v*` 태그로의 푸시로 제한됩니다. 버전 태그가 없는 빌드는 더 이상 레지스트리에 게시되지 않습니다.
- 컴파일 시간에 Docker와 GoReleaser 빌드를 통해 버전이 주입됩니다. API 응답에서 보고되는 버전은 릴리스 태그와 일치합니다.

### API 변경 사항 {#api-changes-10}

- 현재 `GET /payments/gmpay/v1/config`에 대한 응답에 `version`(문자열)이 추가되어, 서버 빌드 버전을 반영합니다.

### 변경 사항 출처 {#evidence-used-10}

- GitHub 릴리스 `v1.0.1`
- PR `#72`: 기능: 공개 설정에 빌드 버전 노출
- 커밋: `85b81e66`, `09642d4c`, `c19a7e5f`
- 파일: `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/data/settings_data.go`, `.github/workflows/docker-alpine.yml`, `src/.goreleaser.yaml`

## v1.0.0 {#v1-0-0}

- 릴리스 태그: `v1.0.0`
- 게시일: `2026-05-20T16:09:00Z`
- 공식 릴리스 노트: `feat: verify manual mark-paid payments — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.7...v1.0.0`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-11}

- 관리자 매뉴얼에서 결제 표시 기능이 이제 체인 내에서 결제 확인을 수행한 후 주문을 결제된 상태로 표시합니다. 거래 해시가 상태 변경이 적용되기 전에 체인 내에서 유효성 검증됩니다.
- 수정 및 검증을 통해 수신 주소, 토큰 계약 주소, 결제 금액, 확인 횟수, 거래 시간 정보를 확인하여 잘못된 긍정적인 결과를 방지합니다.
- 중복 트랜잭션 해시가 거부됩니다. 즉, 동일한 체인 내 트랜잭션은 여러 주문을 결제된 것으로 표시하는 데 사용될 수 없습니다.
- 온체인으로 생성되지 않은 주문은 수동 검증 경로에서 제외되며 (비온체인 주문 유형은 거부됨).
- `supported_assets` 응답에 이제 `display_name` 필드가 기존의 `network` 키와 함께 추가되어, 프론트엔드에서 네트워크 식별자를 변경하지 않고도 사람이 읽기 쉬운 체인 이름을 표시하는 것이 더 쉬워졌습니다.
- 지원 자산 목록에서 BSC 네트워크 키가 `bsc`에서 `binance`로 이름이 변경되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-11}

- 새로운 환경 변수는 필요하지 않습니다.
- Docker 이미지 구성이나 docker-compose 설정에 변경 없음.

### API 변경 사항 {#api-changes-11}

- 관리자 Mark-페이 엔드포인트는 유효한 `tx_hash` 매개변수를 필요로 하며, 요청을 수락하기 전에 체인 상에서의 유효성 검증을 수행합니다. 유효하지 않거나 중복된 해시는 오류 응답을 발생시킵니다.
- `GET /payments/gmpay/v1/config`에서 지원하는 자산 항목에 이제 `display_name`이 포함됩니다.
- 지원 자산 목록에서 BSC의 네트워크 값이 `bsc`에서 `binance`로 변경되었습니다.

### 변경 사항 출처 {#evidence-used-11}

- GitHub 릴리스 `v1.0.0`
- PR `#70`: 기능 추가: 수동으로 지불된 결제 확인
- 커밋: `049a15c`
- 파일: `src/controller/admin/order_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`

## v0.9.7 {#v0-9-7}

- 릴리스 태그: `v0.9.7`
- 게시일: `2026-05-13T09:01:26Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.6...v0.9.7`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-12}

- `README.zh-CN.md` 파일이 삭제되었으며, 현재 `README.md` 파일이 유일한 주요 README 파일로 변경되어, 모든 문서를 하나의 진입점으로 통합했습니다.
- 프론트엔드 관리자 자산(서비스 워커 사전 로딩 목록 및 모든 결합된 JS 조각)이 업데이트된 해시 값으로 재구축되었으며, 이전 관리 패널을 로드했던 사용자들의 오래된 캐시 문제를 해결했습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-12}

- 새로운 환경 변수는 추가되지 않았습니다.
- 실행 시 동작에 변화 없음 – 이는 프론트엔드 자산 업데이트 및 설명서 정리 작업만을 의미합니다.

### API 변경 사항 {#api-changes-12}

- API 경로가 추가되거나 삭제되거나 수정되지 않았습니다.

### 변경 사항 출처 {#evidence-used-12}

- GitHub 릴리스 `v0.9.7`
- 변경 사항 비교 `v0.9.6...v0.9.7`
- `52b171b`, `4a69b7c`, `b0093c4`, `864eb59`
- 파일: `README.md`, `README.zh-CN.md`, `src/www/sw.js`, `src/www/index.html`, `src/www/assets/*`

## v0.9.6 {#v0-9-6}

- 릴리스 태그: `v0.9.6`
- 게시일: `2026-05-11T10:09:43Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.5...v0.9.6`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-13}

- 새로운 버전의 부트스트랩이 이제 초기 관리자 계정 정보를 콘솔에 출력하므로, 처음 로그인 시 별도의 데이터베이스 검사가 필요 없이도 쉽게 접근할 수 있습니다.
- 관리자 화면 설정에서 `background_color`와 `background_image_url`로 결제 페이지의 배경을 변경할 수 있습니다.
- 결제 금액의 정밀도는 이제 설정 가능합니다. 운영자는 결제 금액을 생성할 때 적용할 소수점 자리 수를 설정할 수 있습니다.
- 블록 리스너에서 TRON 체인 토큰 해결이 이제 동적으로 이루어지므로, 초기 실행 시 토큰 계약 주소를 직접 코딩할 필요가 없습니다.
- `README.md`는 이제 간략화된 중국어 메인 README 파일입니다. 영어 독자를 위한 `README.en.md` 파일도 별도로 존재합니다. `README.zh-CN.md`는 이후 커밋 (4a69b7c8)에서 삭제되었습니다.
- `plugins/` 디렉토리와 함께 제공되는 `dujiaoka` 플러그인 예제가 저장소에서 제거되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-13}

- 새로운 환경 변수는 필요하지 않습니다.
- README 파일의 구조 변경은 문서 관련 작업이며, 실행 시간에 영향을 미치지 않습니다.

### API 변경 사항 {#api-changes-13}

- `GET /payments/gmpay/v1/config` 응답에 이제 `background_color` 및 `background_image_url` 필드가 외관 설정에서 추가되었습니다.
- 이제 `GET /payments/gmpay/v1/config` 응답에 결제 설정의 `payment_amount_precision`이 포함됩니다.
- 새로운 경로가 추가되거나 삭제되지 않았습니다.

### 변경 사항 출처 {#evidence-used-13}

- GitHub 릴리스 `v0.9.6`
- 변경 사항 비교 `v0.9.5...v0.9.6`
- `1a35cab`, `2d546e3`, `a8a3b86`, `3e0be9b`, `7c9e3e1`, `84972ea`, `1c805ed`, `8d2ddbd`, `07d1d83`, `7a905ba`, `4dc1ba8`, `4a69b7c`
- 파일: `src/bootstrap/bootstrap.go`, `src/controller/admin/settings_controller.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/task/listen_trc20_block.go`

## v0.9.5 {#v0-9-5}

- 릴리스 태그: `v0.9.5`
- 게시일: `2026-05-09T13:51:58Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.4...v0.9.5`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-14}

- 새로운 호스팅 결제 기능에는 기존의 온체인 네트워크 선택 흐름과 함께 `okpay` 결제 연동 기능이 추가되었습니다.
- 결제 프로세스가 이제 체크아웃 응답에서 `payment_url`을 반환할 수 있게 되었으므로, OkPay과 같은 외부 결제 연관 주문은 현지 계산대 주소 표시에 의존하는 대신, 명시적인 리디렉션 대상이 제공됩니다.
- 공공 설정 응답이 이제 사이트와 직접적으로 관련된 계산대 메타데이터를 노출합니다. 여기에는 이름, 로고 URL, 웹사이트 제목, 그리고 지원 링크 등이 포함됩니다. 따라서, 프론트엔드 브랜딩 및 설정 렌더링이 더욱 고정된 방식에서 벗어나게 됩니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-14}

- 환경 설정 예시에서 기존 PostgreSQL 및 MySQL 설정 블록을 제거했습니다. 현재 설정 가이드는 SQLite 기반의 런타임 기본값을 설명하며 두 데이터베이스를 일반 설치 경로로 제시하지 않습니다.
- Dockerfile 정리 작업으로 불필요한 `static` 복사 단계를 제거하여 현재 프론트엔드 배포 경로와 일치하지 않는 부분을 수정했습니다.
- README 관련 정리 작업은 로고 및 면책 조항 내용도 업데이트했지만, 위에 언급된 실행/결제 변경 사항과는 별개입니다.

### API 변경 사항 {#api-changes-14}

- 현재 공공 GMPay 프론트엔드 설정은 이전의 독립적인 자산 조회 방식 대신 `GET /payments/gmpay/v1/config`에서 가져옵니다.
- `GET /payments/gmpay/v1/config`는 `supported_assets`와 함께 사이트 브랜딩, EPay 기본값 및 OkPay 공개 설정을 반환합니다.
- OkPay 콜백 엔트리 추가: `POST /payments/okpay/v1/notify`
- `POST /pay/switch-network` 요청은 기존의 온체인 네트워크 값 외에도 `network=okpay`를 포함하여 문서화/처리합니다.
- 결제 응답 페이로드에 이제 `payment_url`이 포함됩니다.

### 변경 사항 출처 {#evidence-used-14}

- GitHub 릴리스 `v0.9.5`
- 변경 사항 비교 `v0.9.4...v0.9.5`
- `377176a`, `3623a54`, `51ad344`, `ff157c3`, `1a35cab`, `2d546e3`
- `src/route/router.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/response/order_response.go`, `src/model/response/support_response.go`, `src/.env.example`

## v0.9.4 {#v0-9-4}

- 릴리스 태그: `v0.9.4`
- 게시일: `2026-04-28T16:37:20Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-15}

- 현재 소스 기록에서, TRON 결제 스캔 기능이 블록 기반 리스너 경로로 돌아왔습니다. 따라서, 최근 TRON 흐름의 일시적인 되돌림은 더 이상 효과적인 상류 상태가 아닙니다.
- 결제 처리가 완료된 후, 주문 알림 동작이 수정되었습니다.
- 현재 체크아웃 진입이, 별도의 서버 측 HTML 템플릿을 `/pay/checkout-counter/:trade_id`에서 직접 렌더링하는 대신, SPA 계산 페이지 흐름으로 리디렉션됩니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-15}

- 호스팅된 결제 흐름은 이제 이전의 전용 `static/` 결제 자산 경로 대신, SPA 기반의 `www/` 경로를 사용합니다.
- Docker 이미지는 이후 불필요한 `static` 복사 단계를 제거하여 현재 활성 SPA 체크아웃 배송 경로와 일치하지 않는 부분을 정리했습니다.

### API 변경 사항 {#api-changes-15}

- `GET /pay/checkout-counter/:trade_id` 경로가 현재, 계산대 SPA를 위한 리디렉션 엔트로 동작합니다.
- 현재 소스는 새로운 SPA 체크아웃 흐름에서 사용되는 JSON 응답 엔드포인트인 `GET /pay/checkout-counter-resp/:trade_id`를 나타냅니다.
- 이 릴리스에는 새로운 상점 서명 필드 또는 콜백 계약 기능이 추가되지 않았습니다.

### 변경 사항 출처 {#evidence-used-15}

- GitHub 릴리스 `v0.9.4`
- 변경 사항 비교 `v0.9.3...v0.9.4`
- `9e885d8`, `de9c45a`, `96ea748`, `51a2acc`, `d17d212`, `9c533a7`, `ff68279`
- 상위 문제 `#55`: Docker 배포 환경에서 결제 파일 누락 문제

## v0.9.3 {#v0-9-3}

- 릴리스 태그: `v0.9.3`
- 게시일: `2026-04-25T10:50:34Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-16}

- 설치 후 루트 경로를 수정하여, `GET /` 요청이 백엔드 루트 핸들러에 의해 중단되지 않고, SPA를 일관되게 제공하도록 했습니다.
- 설치 모드는 여전히 루트 경로를 `/install`로 리디렉션하기 때문에, 초기 설정 과정이 그대로 유지됩니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-16}

- 이번 릴리스에서는 새로운 공용 환경 변수 또는 배포 플래그는 출시되지 않았습니다.
- 주요 실행 경로 동작이 조정되어, 설치된 인스턴스가 웹 앱에 더욱 안정적으로 배치되도록 변경되었습니다.

### API 변경 사항 {#api-changes-16}

- 이번 릴리스에서는 새로운 공개 API 경로가 추가되지 않았습니다.
- 백엔드 라우팅이 `Any("/")` 스타일의 포괄적인 핸들러에서 `POST("/")` 백엔드 핸들러로 변경되어, 일반 브라우저의 `GET /` 트래픽은 SPA로 계속 전달됩니다.

### 변경 사항 출처 {#evidence-used-16}

- GitHub 릴리스 `v0.9.3`
- 변경 사항 비교 `v0.9.2...v0.9.3`
- `95879e3` 커밋, `67263da` 머지 태그

## v0.9.2 {#v0-9-2}

- 릴리스 태그: `v0.9.2`
- 게시일: `2026-04-24T16:14:34Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-17}

- 관리자 환율 설정에서 USDT 고정 환율을 지정할 수 있습니다.
- Docker 배포 예시는 현재 `gmwallet/epusdt:latest` 이미지 레퍼런스를 따릅니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-17}

- 출시 노트에는 새로운 공용 환경 변수가 명시적으로 언급되지 않았습니다.
- 현재 Docker 업그레이스 예시들은 계속해서 `gmwallet/epusdt:latest`를 사용하고 있습니다.

### API 변경 사항 {#api-changes-17}

- 이번 릴리스 노트나 변경 사항 비교에서 새로운 공개 API 경로가 나타나지 않았습니다.

### 변경 사항 출처 {#evidence-used-17}

- GitHub 릴리스 `v0.9.2`
- 변경 사항 비교 `v0.9.1...v0.9.2`
- `dd1bf70` 및 `143bc84` 커밋

## v0.9.1 {#v0-9-1}

- 릴리스 태그: `v0.9.1`
- 게시일: `2026-04-22T18:29:39Z`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-18}

- 내장 설치 가이드: 초기 실행 시 유효한 설정 파일이 없는 경우, 이제 웹 기반 설치 과정을 시작합니다. 현재 인터페이스는 `app_name`, `app_uri`, 바인드 주소/포트, 실행 경로, 로그 경로, 만료 시간, 그리고 콜백 재시도 설정을 중심으로 합니다.
- Docker 이미지가 이제 `docker pull gmwallet/epusdt:latest` 명령으로 직접 다운로드할 수 있습니다. 초기 배포 시 `.env` 파일을 마운트할 필요가 없습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-18}

- 설치 마법사가 첫 제출 시 자동으로 `.env` 파일을 생성합니다. 이후 재시작 시 마법사를 건너뛰고 정상적으로 부팅됩니다.
- 이제 `docker-compose.yaml`에서 `.env`를 볼륨으로 마운트하는 것은 선택 사항입니다. 초기 설정 마법사로 새로 설치하려면 해당 마운트를 생략하세요.

### API 변경 사항 {#api-changes-18}

- 이번 릴리스에는 새로운 공개 API 경로가 없습니다.

## v0.9.0 {#v0-9-0}

- 릴리스 태그: `v0.9.0`
- 게시일: `2026-04-21T20:23:33Z`
- 공식 릴리스 노트: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-19}

- API 키, 체인, 체인 토큰, 지갑, 주문, RPC 노드, 설정, 알림 및 대시보드 통계를 관리하기 위한 완전한 관리 패널을 추가했습니다.
- 다중 체인 지원이 더욱 확대되었으며, 더욱 포괄적인 EVM 리스너 커버리지와 관리자용 체인/토큰 관리 기능이 추가되었습니다.
- 텔레그램 알림 채널이 추가되었으며, 이후 설정 업데이트와 동기화되었습니다.
- 초기 설치 과정을 간편하게 하기 위해, 신규 설치 방식이 도입되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-19}

- `.env.example` 파일의 설치 플래그 기본값을 첫 실행 설정 과정에서 활성화로 변경했습니다.
- 현재 실행 시간에는 RPC 노드 상태 확인 기능이 추가되었으며, 자동 장애 조치 기능도 포함되어 있습니다.
- 서버 실행 환경에 정적 관리자 자원들이 추가되었습니다.
- 관리자 사용자, API 키, 체인, 체인 토큰, RPC 노드, 설정, 그리고 알림 채널에 대한 새로운 유지 관리 모델이 도입되었습니다.

### API 변경 사항 {#api-changes-19}

- 인증, API 키, 체인, 체인 토큰, 지갑, 주문, RPC 노드, 설정, 대시보드 통계 및 알림을 포함한, 완전한 관리 REST API 기능 추가
- JWT 기반의 관리자 인증 및 API 키 인증 미들웨어 추가됨
- 결제, 지원 자산, 지갑 및 주문 관련 응답/요청 구조가 관리 업무 흐름과 함께 확장되었습니다.

### 변경 사항 출처 {#evidence-used-18}

- GitHub 릴리스 `v0.9.0`
- 변경 사항 비교 `v0.0.8...v0.9.0`
- `6bb47d4`, `5edc9dc`, `b499bc0`, `6ea5637`, `9163943`과 관련된 커밋

## v0.0.8 {#v0-0-8}

- 릴리스 태그: `v0.0.8`
- 게시일: `2026-04-15T10:44:56Z`
- 공식 릴리스 노트: `- Enable polygon,plasma supports`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-20}

- `polygon` 및 `plasma` 네트워크 지원 추가됨
- 결제 페이지 네트워크 선택 행동이 조정되었습니다.
- EVM 지갑 주소 저장 로직이 수정되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-20}

- 릴리스 노트나 비교 차이에 새로운 환경 변수는 표시되지 않았습니다.

### API 변경 사항 {#api-changes-20}

- 공식 릴리스 노트에 새로운 공개 API 경로가 명확하게 소개되지 않았습니다.
- `v0.0.7` 작업 흐름에서 네트워크 관련 동작이 계속 진행 중입니다.

### 변경 사항 출처 {#evidence-used-19}

- GitHub 릴리스 `v0.0.8`
- 변경 사항 비교 `v0.0.7...v0.0.8`
- `f7c5f67` 및 `097c716`을 포함한 커밋

## v0.0.7 {#v0-0-7}

- 릴리스 태그: `v0.0.7`
- 게시일: `2026-04-15T06:00:55Z`
- 공식 릴리스 노트: `suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-21}

- `bsc`, `polygon`, 및 `plasma`에 대한 지원이 추가되었습니다.
- EPay 호환성을 위한 폼 파라미터가 추가되어, 더 넓은 통합 호환성을 제공합니다.
- 결제 워크스트림에서 텔레그램과의 상호작용 및 결제 관련 업무가 업데이트되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-21}

- 새롭게 지원되는 네트워크 환경에서, 소스 기록에 여러 EVM 감시 경로가 추가되었습니다.
- 공식 릴리스 노트에 명확하게 문서화된 새로운 `.env` 변수는 포함되지 않았습니다.

### API 변경 사항 {#api-changes-21}

- 지원되는 체인/자산 관련 API 작업이 소스 기록에 추가되었습니다.
- 라우터 로직이 업데이트되어 EPay 호환 제출 흐름에 대해 `GET` 및 `POST` 양식을 모두 지원하도록 변경되었습니다.

### 변경 사항 출처 {#evidence-used-20}

- GitHub 릴리스 `v0.0.7`
- 변경 사항 비교 `v0.0.6...v0.0.7`
- `9c003fb`, `8cd816c`, `786c5e8`, `70f8ed4` 커밋들

## v0.0.6 {#v0-0-6}

- 릴리스 태그: `v0.0.6`
- 게시일: `2026-04-12T20:06:08Z`
- 공식 릴리스 노트: `v0.0.5...v0.0.6` 변경 사항 비교

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-22}

- 호스팅 결제 UI를 두 단계 결제 흐름으로 재설계했습니다.
- 다중 네트워크 결제 선택 기능을 위해 결제 방식 변경 기능이 추가되었습니다.
- 솔라나 결제 스캔 기능이 이제 `USDT`와 `USDC`를 지원합니다.
- Ethereum의 ERC-20 `USDT` 및 `USDC` 결제 스캔 기능이 추가되었습니다.
- 텔레그램 결제 알림에 이제 네트워크 정보가 포함되었습니다.
- 텔레그램 지갑 검증 기능이 여러 네트워크 주소에 대해 개선되었습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-22}

- `solana_rpc_url`을 추가했습니다.
- `ethereum_ws_url`이 추가되었습니다.
- `epay_pid` 추가됨
- `epay_key`를 추가했습니다.
- 현재 주문 잠금 및 매칭 기능에 `network`가 실행 시간 흐름에 포함됩니다.

### API 변경 사항 {#api-changes-22}

- `/payments/gmpay/v1/wallet/*` 경로에 새로운 지갑 관리 엔드포인트 추가됨
- `POST /pay/switch-network`를 추가했습니다.
- EPay 호환 경로가 추가되었습니다: `GET /payments/epay/v1/order/create-transaction/submit.php`
- 현재 결제 응답에 `is_selected` 정보가 포함됩니다.
- 새로운 주문 흐름은 선택적인 `name`과 `payment_type`을 받습니다.
- 현재 사용되는 네트워크 식별자는 소문자로 표시된 `tron`, `solana`, 및 `ethereum`을 사용합니다.

### 변경 사항 출처 {#evidence-used-21}

- GitHub 릴리스 `v0.0.6`
- 변경 사항 비교 `v0.0.5...v0.0.6`
- `3f071e6`, `32ca778`, `5e4d5df`과 같은 커밋

## v0.0.5 {#v0-0-5}

- 릴리스 태그: `v0.0.5`
- 게시일: `2026-04-03T17:05:30Z`
- 공식 릴리스 노트: `test: fix macOS path assertion and wallet address unique index`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-23}

- 공식 출시 노트에는 주요 사용 기능에 대한 설명이 포함되어 있지 않습니다.

### 배포 및 설정 변경 {#deployment-and-configuration-changes-23}

- 공식 릴리스 노트에서 새로운 배포 변수에 대한 정보는 표시되지 않았습니다.

### API 변경 사항 {#api-changes-23}

- 코드 이력에서 지갑 주소의 고유 인덱스 동작이 수정되었습니다.

### 변경 사항 출처 {#evidence-used-22}

- GitHub 릴리스 `v0.0.5`
- 변경 사항 비교 `v0.0.4...v0.0.5`

## v0.0.4 {#v0-0-4}

- 릴리스 태그: `v0.0.4`
- 릴리스 이름: `New UI Update`
- 게시일: `2026-04-03T16:05:23Z`
- 공식 릴리스 노트: `feat: change payment ui`

### 사용자에게 영향을 주는 변경 사항 {#user-visible-changes-24}

- 결제 화면 업데이트

### 배포 및 설정 변경 {#deployment-and-configuration-changes-24}

- 릴리스 노트에 언급된 배포 관련 변경 사항은 없습니다.

### API 변경 사항 {#api-changes-24}

- 릴리스 노트에 API 관련 변경 사항은 언급되지 않았습니다.

### 변경 사항 출처 {#evidence-used-23}

- GitHub 릴리스 `v0.0.4`
- 공식 릴리스 노트 본문

## 유지보수 참고 사항 {#notes-for-maintainers}

향후 출시를 위해, 가장 효과적인 출시 형식은:

1. 사용자에게 영향을 주는 변경 사항
2. 배포 또는 설정 변경
3. API 및 스키마 변경 사항
4. 업그레이드 내역 또는 변경 사항
