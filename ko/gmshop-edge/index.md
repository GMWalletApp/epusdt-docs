---
title: "GMShop Edge 디지털 상품 쇼핑몰"
description: "GMShop Edge를 활용하여, 자체 호스팅 방식으로 디지털 상품 판매장을 구축하고, 결제, 배송, 그리고 공급업체 연동 기능을 제공합니다. (Workers 또는 Bun 사용 가능)"
---

# GMShop Edge {#gmshop-edge}

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge)는 단일 배포·단일 테넌트 방식으로 운영하는 자체 호스팅 디지털 상품 스토어입니다. **Cloudflare Workers** 또는 **Bun/Nitro Docker 컨테이너**에서 실행됩니다.

한 가지 배포는 반응형 공용 상점, 고객 계정, 결제 및 처리, Telegram 통합, 공급업체 운영, 그리고 권한 기반의 관리 콘솔을 제공합니다.

Epusdt와 GMPay Edge와는 별도의 독립적인 프로젝트입니다. 필요한 상품이 디지털 상품 쇼핑몰(카탈로그, 결제, 배송, 공급업체 워크플로우)일 때 GMShop Edge를 사용하세요.

> GMShop Edge는 현재 개발 중입니다. 내장된 어댑스로 인해 통합 경로가 존재하지만, 실제 사용에는 배포자 소유의 인증, 백업, 모니터링, 그리고 실제 제공업체 테스트가 필요합니다.

## 주요 기능 {#what-it-provides}

- 암호화된 미리 설정된 텍스트, 비공개 다운로드 제품, 그리고 명시적인 아티팩트 정책을 가진 상품들을 제공합니다.
- 지속적인, 고정된 기간의, 제한적인, 무제한의, 무료, 일회성, 그리고 고객 재신청 권한.
- 게스트 및 등록된 회원, 쿠폰, 환불, 사후 관리, 개인 주문 조회, 그리고 계정 기반 배송 접근.
- 스토어 지갑 결제와 Stripe, Cryptomus, GMpay, EPay, Alipay Page/WAP 및 WeChat Native/H5 어댑터를 지원합니다.
- ACG `3.5.5`, Dujiao Next `v1.3.1`, 또는 자체 GMShop Edge 공급업체 API를 통한 공급업체 카탈로그 동기화 및 주문 처리
- 실시간으로 구성된 이메일/비밀번호, 소셜, OIDC, Telegram OIDC, Telegram 로그인 위젯, 그리고 Telegram 미니 앱 인증.
- GrammY 웹훅 기반의 로컬화된 명령어, Mini 앱 버튼, 그리고 메시지 내용을 저장하지 않고, 포럼 토픽 기반의 선택적 고객 지원 기능.
- `/admin` 기능을 위한 동적 다중 역할 RBAC (역할 기반 접근 제어), 루트 계정 보호, 서버 측 권한 검사, 재인증, 그리고 감사 기록.
- 영어(`en-US`) 및 간략화 중국어(`zh-CN`) 애플리케이션 로케일.

위에 언급된 모든 기능은 오픈 소스 프로젝트의 일부이며, 별도의 Pro 또는 엔터프라이즈 버전은 존재하지 않습니다.

## 문서 목록 {#documentation-sections}

- [아키텍처](./architecture.md): 공통 애플리케이션 스택, Workers 바인딩, Bun 어댑터, 데이터 소유권 및 런타임 제약 사항.
- [배포](./deployment.md): Workers 및 Bun/Docker 설치와 운영 환경 검증.
- [Bun 데이터 관리](./node-data-operations.md): 백업, 복원 및 Cloudflare D1/R2에서 데이터 가져오기.
- [공급업체 API](./supplier-api.md): GMShop Edge 인스턴스 간에 서명된 요청으로 상품 목록, 주문, 결제 채널 및 충전을 처리합니다.
- [판매 및 주문 이행](./commerce-fulfillment.md): 상품, 재고, 공급업체, 배송 기록, 이용 권한 및 자동 제공 상품.
- [결제 및 제공 서비스](./checkout-providers.md): 지갑 및 외부 결제, 현금 거래, 이메일, 인증, 그리고 Telegram 지원.

## 링크 {#links}

- 저장소: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- 배포 확인 목록: [`docs/DEPLOYMENT.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.md)
- 본 데이터 운영 관련 문서: [`docs/NODE_DATA_OPERATIONS.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
