---
description: "Docker Compose로 EPUSDT를 설치하고 외부 결제 URL을 설정하는 방법을 설명합니다. 게이트웨이와 ChainScanner 데이터는 컨테이너를 다시 시작해도 유지됩니다."
title: "Docker Compose로 결제 게이트웨이 설치"
---

# Docker Compose로 설치 {#install-with-docker-compose}

설치할 버전에서 제공하는 [Compose 파일](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml)을 사용하세요. 기본 서비스에 ChainScanner가 포함되어 있습니다.

신규 설치라면 먼저 해당 릴리스의 파일을 다운로드하세요.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## 게이트웨이 시작 {#start-the-gateway}

저장소 루트에서 Compose 환경(예: 프로젝트의 `.env`)에 공개 결제 URL을 설정하세요. 컨테이너를 시작할 때마다 이 값을 사용합니다.

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

HTTPS 리버스 프록시가 호스트에 매핑된 포트를 가리키도록 설정하세요. 수신 주소를 등록한 뒤 응답의 `data.supported_assets`를 확인하세요.

## 데이터 저장 및 업그레이드 {#storage-and-upgrades}

Compose는 `./runtime/epusdt`를 컨테이너의 `/app/runtime`에 마운트합니다. 이 디렉터리에는 애플리케이션의 `.env`, 비즈니스 및 런타임 데이터베이스, 내장 스캐너의 데이터베이스가 저장됩니다. 프로젝트의 Compose 환경 파일과 애플리케이션 설정 파일은 별개입니다.

v2.0.0에서 업그레이드할 때는 기존 서비스를 중지하고 설정과 데이터베이스를 백업하세요. **기존 컨테이너를 다시 만들기 전에** 백업본을 새 마운트 디렉터리에 복사하세요. 원본 백업을 보관하고 설정에 지정된 데이터베이스 파일명을 확인하세요. [릴리스 노트](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

v2.1.1부터 게이트웨이는 SQLite만 지원합니다. 설정, 비즈니스 및 런타임 데이터베이스, 스캐너 데이터를 백업하세요. 기존 설치가 MySQL 또는 PostgreSQL을 사용한다면 전환 전에 데이터를 마이그레이션하고 검증하세요. `db_type` 값만 바꿔서는 주문 데이터가 이전되지 않습니다.

## 독립 스캐너 사용 {#using-a-standalone-scanner}

`CHAINSCANNER_URL=http://chainscanner:9081`로 설정하고 소비자용 토큰과 관리자용 토큰을 각각 지정하세요. 별도 스캐너를 업그레이드할 때는 기존 볼륨(`./runtime/chainscanner`), URL 및 인증 정보를 유지하세요.

```sh
docker compose --profile scanner up -d
```
