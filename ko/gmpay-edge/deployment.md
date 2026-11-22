---
title: "Workers 또는 Bun에 게이트웨이를 설치하십시오."
description: "클라우드플레어 워커 또는 Bun 호스트에 GMPay Edge를 배포합니다. 실행 시간 구성, 저장 용량 및 배포 확인 사항을 비교합니다."
titleTemplate: ":title | GMPay Edge"
---

# 배포 {#deployment}

GMPay Edge는 두 가지 생산 실행 모드를 지원합니다.

- **Bun/Nitro 자체 호스팅**: SQLite와 영구 로컬 데이터 디렉터리를 사용합니다. Docker로 배포하거나 소스 코드에서 실행하고 서비스 관리자로 관리할 수 있습니다.
- **Cloudflare Workers**: D1, KV, R2, Queues 및 Cron Triggers를 사용합니다.

두 환경 모두 동일한 가맹점 API, 결제 화면, 관리자 콘솔, 백그라운드 작업 및 `/install` 설치 절차를 제공합니다.

## Docker Compose (권장) {#docker-compose-recommended}

공개 [GHCR 패키지](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge)는 `linux/amd64` 및 `linux/arm64`를 지원하며 레지스트리에 로그인할 필요가 없습니다.

다음 내용을 `compose.yml` 파일에 저장하세요:

```yaml
services:
  gmpay-edge:
    image: ghcr.io/gmwalletapp/gmpay-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMPAY_DATA_DIR: /var/lib/gmpay
    volumes:
      - gmpay-data:/var/lib/gmpay

volumes:
  gmpay-data:
```

서비스를 시작하세요.

```bash
docker compose pull
docker compose up -d
```

`latest` 태그는 최신 안정 버전 정보를 추적합니다. 재현 가능한 배포를 위해, `1.0.0`과 같은 전체 버전을 태그로 설정합니다.

`GMPAY_DATA_DIR`에는 SQLite, 업로드된 파일, 개인 객체, 큐 상태 및 기타 모든 실행 시간 데이터가 포함되어 있습니다. 컨테이너를 업데이트하거나 재생성할 때 `gmpay-data` 볼륨을 보존하고 백업하십시오.

배포 환경을 백업, 복원 또는 이전하기 전에 [Bun 데이터 관리](./node-data-operations.md)를 읽어 보세요.

다음 서비스를 확인하고 로그를 검사하십시오:

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

데이터 양을 유지하면서 업데이트하기:

```bash
docker compose pull
docker compose up -d
```

### Docker 명령 {#docker-command}

Compose가 사용 불가능한 경우, 컨테이너를 직접 실행하세요.

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Bun으로 소스에서 배포 {#bun-source-deployment}

소스 코드에서 직접 프로덕션 서버를 실행할 수 있습니다. Git과 Bun 1.3 버전 이상을 설치해야 합니다. 만약 PM2를 프로세스 관리자로 선택한다면 Node.js는 필요합니다.

```bash
git clone https://github.com/GMWalletApp/gmpay-edge.git
cd gmpay-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -o "$USER" -g "$USER" /var/lib/gmpay
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  bun run start:bun
```

마지막 명령은 앞쪽에서 실행됩니다. 프로덕션 환경에서는 systemd, Supervisor, PM2 또는 다른 서비스 관리자를 사용하여 유지하고 백업하십시오. Docker 볼륨과 동일하게 `GMPAY_DATA_DIR`을 보존하고 백업하십시오.

### PM2 {#pm2}

PM2 자체는 Node.js와 npm이 필요하지만, GMPay Edge는 Bun으로 실행됩니다. PM2가 생성된 서버를 Node.js로 시작하려고 시도하지 않도록, 명시적인 `--interpreter bun` 옵션을 유지하십시오.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

`pm2 startup`이 출력한 명령을 실행하고 `pm2 save`를 다시 실행하세요. `pm2 logs gmpay-edge`와 `curl --fail http://127.0.0.1:3000/healthz`로 서비스를 확인하세요.

소스 배포를 업데이트하기 위해

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### 배포 버튼 {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

단계별 배포에서는 `wrangler.jsonc`에 선언된 바인딩을 준비하고 D1 마이그레이션을 적용한 뒤 Worker를 빌드합니다. 다음 명령을 사용하세요.

- 빌드 명령: `bun run build`
- 배포 명령어: `wrangler deploy`

배포 후, Worker URL의 `/install` 경로를 열어 인스턴스를 초기화합니다.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

D1이 수동으로 준비되어야 하는 경우

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

생성된 데이터베이스 ID를 사용하지 마십시오. 배포 훅은 "D1", "KV", "R2", 및 "Queue"라는 이름의 리소스를 생성하거나 재사용하고, D1 기본 설정을 적용하며, 게시하기 전에 워커를 구축합니다.

## 로컬 개발 {#local-development}

요구 사항

- Bun 1.3 이상
- Wrangler for the Workers 개발 환경에서 제공되는 지역 환경

```bash
bun install
bun run dev
```

`bun run dev`는 로컬 `gmpay-edge` D1 데이터베이스에 대기 중인 마이그레이션을 적용하고, `http://localhost:3000`에서 앱을 시작합니다.

## 최초 설치 {#first-install}

Docker 또는 Bun이 시작되면 `http://your-host:3000/install`을 엽니다. 워커 배포 후에는 워커 URL에서 `/install`을 엽니다. 첫 번째 루트 사용자를 생성하기 전에 감지된 공용 주소와 허용된 호스트를 확인하세요.

설치 시 다음 항목이 생성됩니다.

- 첫 번째 사용자
- 보호된 `root` 역할.
- 런타임 비밀 값
- 기본 결제 설정
- 공개 Telegram 명령어 및 기본 설정

Telegram Bot을 생성하거나 Telegram 앱을 호출하는 기능은, 컨테이너 환경 변수 대신 관리자 인터페이스에서 관리됩니다.
