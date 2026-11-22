---
title: "GMPay Edge 결제 게이트웨이 (노동자와 번을 위한)"
description: "GMPay Edge를 소개합니다. Cloudflare Workers 또는 Bun을 위한 자체 호스팅 방식의 별도 결제 게이트웨이로, GMPay 상점 API와 EPay 호환성을 제공합니다."
---

# GMPay Edge {#gmpay-edge}

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge)는 **Cloudflare Workers 또는 Bun/Nitro Docker**에 자체 호스팅할 수 있는 단일 테넌트 암호화폐 결제 게이트웨이입니다.

이 프로젝트는 Epusdt와는 별개입니다. 이 사이트에서 Go 게이트웨이를 문서화하고 싶을 때는 Epusdt를 사용하십시오. Cloudflare 워커 또는 SQLite 기반의 로컬 지속성을 가진 Docker 컨테이너로 배포할 수 있는 TypeScript 게이트웨이가 필요할 때는 GMPay Edge를 사용하세요.

> GMPay Edge는 현재 개발 중입니다. 내장된 기능들 덕분에 프로젝트 내에서 기능이 존재하지만, 실제 사용을 위해서는 배포자 소유의 엔드포인트 또는 읽기 전용 자격 증명, 설정된 수신 방법, 백업, 모니터링, 그리고 실제 플랫폼과의 테스트가 필요합니다.

## 주요 기능 {#what-it-provides}

- GMPay 상점 API (JSON 및 폼 입력 방식)
- API 경계에서 EPay 호환성을 유지하면서 별도의 주문 모델을 관리할 필요가 없습니다.
- 반응형 결제 시스템, 관리 콘솔, 공개 상태 페이지, 그리고 실행 중인 OpenAPI 문서.
- 내구성 있는 웹훅 전달: 큐 기반의 아웃박스와 재시도 기록, 수동 재시도, 감사 기록을 통해.
- 실행 환경에 특화된 강력한 대기(queues)와 스케줄러를 통해, 결제 스캔, 만료 확인, 정리, 연결 상태, 그리고 속도 동기화를 관리합니다.
- 관리자를 위한 향상된 권한 부여, TOTP, 그리고 동적 다중 역할 RBAC.
- grammY를 통한 텔레그램 봇 자동화, 여기에는 인라인 주문, 공용 명령, 그리고 알림 구독 기능이 포함됩니다.
- 6개 언어로 제공되는 인터페이스

## 문서 목록 {#documentation-sections}

- [아키텍처](./architecture.md): Workers 및 Bun 런타임 서비스, 큐, 콜백과 프로토콜 적용 범위.
- [배포](./deployment.md): Docker Compose, GHCR 이미지, 배포 버튼, Wrangler CLI, 로컬 개발 및 최초 설치.
- [Bun 데이터 관리](./node-data-operations.md): 백업, 복원 및 Cloudflare D1/R2에서 데이터 가져오기.
- [가맹점 API](./merchant-api.md): GMPay 주문 생성과 조회, 서명, 콜백 및 EPay 호환성.
- [결제 연동 기능](./payment-integrations.md): 내장된 체인, 거래소, 지갑 연동 기능 목록.

## 링크 {#links}

- 저장소: [GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- README: [README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- 중국어 README: [README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
