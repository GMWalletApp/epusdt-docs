---
title: "Workers 또는 Bun에 상점을 배포하십시오."
description: "Workers 또는 Bun에 GMShop Edge를 배포하고, 디지털 상품 판매대 사이에 저장, 대기, 그리고 백그라운드 작업을 설정합니다."
titleTemplate: ":title | GMShop Edge"
---

# 배포 {#deployment}

GMShop Edge는 두 가지 생산 단계를 지원합니다.

- **Bun/Nitro 자체 호스팅**: SQLite, 비공개 로컬 객체, 영구 로컬 큐 및 영구 데이터 디렉터리를 사용합니다. Docker로 배포하거나 소스 코드에서 실행하고 서비스 관리자로 관리할 수 있습니다.
- **Cloudflare Workers**: D1, KV, R2, Queues 및 Cron Triggers를 사용하며 필요에 따라 Send Email을 사용할 수 있습니다.

이 두 가지 실행 환경 모두 동일한 상점, 고객 계정, 결제, 배송, 관리 콘솔, 공급업체 API, Telegram 통합, 그리고 `/install` 흐름에 접근할 수 있습니다.

## Docker Compose {#docker-compose}

공개 [GHCR 패키지](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge)는 `linux/amd64` 및 `linux/arm64`를 지원합니다. 다음 내용을 `compose.yml`로 저장하세요.

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMSHOP_DATA_DIR: /var/lib/gmshop
    volumes:
      - gmshop-data:/var/lib/gmshop

volumes:
  gmshop-data:
```

서비스를 시작하고 확인하세요.

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

컨테이너는 루트 권한으로 실행됩니다. `GMSHOP_DATA_DIR`에는 `gmshop.sqlite`, 개인 객체, 지속적인 큐 상태, 그리고 모든 실행 시간 데이터가 포함되어 있습니다. 컨테이너가 업데이트되거나 재생성될 때마다 `gmshop-data` 볼륨을 보존하고 백업하십시오.

`GMSHOP_DATA_DIR`는 유일한 공개적인 Bun 환경 변수입니다. `/install` 또는 `/admin`을 통해 Origin, 허용 호스트, 이메일, 결제, 공급업체, Telegram, 그리고 자동화 설정을 구성하십시오.

Bun은 단일 인스턴스만 지원합니다. 다중 복제본 배포와 공유 네트워크 스토리지는 지원하지 않습니다. 업그레이드, 복원 또는 마이그레이션 전에 [Bun 데이터 관리](./node-data-operations.md)를 확인하세요.

## Bun으로 소스에서 배포 {#bun-source-deployment}

소스 코드에서 직접 프로덕션 서버를 실행할 수 있습니다. Git과 Bun 1.3 버전 이상을 설치해야 합니다. 만약 PM2를 프로세스 관리자로 선택한다면 Node.js는 필요합니다.

```bash
git clone https://github.com/GMWalletApp/gmshop-edge.git
cd gmshop-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -m 0700 -o "$USER" -g "$USER" /var/lib/gmshop
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  bun run start:bun
```

마지막 명령은 앞단에서 실행됩니다. 실제 환경에서는 systemd, Supervisor, PM2 또는 다른 서비스 관리자를 사용하여 유지합니다. Docker 볼륨과 동일하게 `GMSHOP_DATA_DIR`을 보존하고 백업합니다. Bun 실행 환경은 단일 인스턴드만 지원하며, 여러 복제 및 공유 네트워크 저장 기능은 지원되지 않습니다.

### PM2 {#pm2}

PM2 자체는 Node.js와 npm이 필요하지만, GMShop Edge는 Bun으로 계속 실행됩니다. PM2가 생성된 서버를 Node.js로 시작하려고 시도하지 않도록, 명시적인 `--interpreter bun` 옵션을 유지하십시오.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

`pm2 startup`이 출력한 명령을 실행하고 `pm2 save`를 다시 실행하세요. `pm2 logs gmshop-edge`와 `curl --fail http://127.0.0.1:3000/healthz`로 서비스를 확인하세요.

소스 배포를 업데이트하기 위해

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### 배포 버튼 {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

이 안내된 흐름은 워커 프로젝트를 준비합니다. 배포 후, `/install`을 열고 다음 연결을 확인하세요.

- D1 `gmshop-edge`를 `DB`로 지정합니다.
- KV `gmshop-edge-cache`를 `CACHE`로.
- 개인용 R2 `gmshop-edge-files`를 `FILES`로.
- `gmshop-edge-commerce` 큐를 `COMMERCE_QUEUE`로 설정하고, `gmshop-edge-commerce-dlq`를 데드 레터 큐로 지정합니다.
- 원분 Cron과, 선택 시에는 Cloudflare Send Email을 `EMAIL`로 설정합니다.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

`predeploy` 훅은 이름 있는 리소스를 생성하거나 재사용하고, 원격 마이그레이션을 적용하고, 워커를 빌드합니다. D1/KV ID는 `dist/server/wrangler.json`에만 주입되며, 계정별 ID는 휴대용 `wrangler.jsonc`에는 기록되지 않습니다.

## 최초 설치 {#first-install}

Docker 또는 Bun이 시작되면 `http://your-host:3000/install`을 엽니다. 워커 배포 후에는 워커 URL에서 `/install`을 엽니다. 첫 번째 루트 관리자를 생성하기 전에 감지된 공용 주소와 허용된 호스트를 확인하세요.

설치 과정은 첫 번째 루트 관리자를 생성하고, 기본 상점 역할, 실행 중인 비밀번호, 그리고 필수적인 상거래, 환율, 인증, 및 알림 설정을 만듭니다. 하지만 가짜 상품, 재고, 공급자 인증 정보, 또는 결제 설정을 생성하지 않습니다.

설치 후

1. `/admin`에서 생성된 시스템 설정을 검토하고, 실행 구성 파일을 백업하세요.
2. 브랜딩, 등록, 인증, 이메일, 상거래, 배송, 고객 유지, 그리고 제공업체 설정을 구성합니다.
3. 판매 가능한 상품과 재고, 파일 또는 자동화 설정이 포함된 제품 초안을 만들고, 공개하기 전에 게시물 검사를 통과하도록 합니다.
4. 결제 어댑터를 설정하고, 실제 제공업체 수락 주문을 완료한 후 상점을 개설하세요.

생산 전, 정확한 호스트/출처 규칙, 실제 결제 및 회복 이메일, 재고/다운로드/자동화 처리, 대기 재시도 및 사각 파일 회복, 환불, 만료된 권한, 백업 복구, 두 가지 애플리케이션 로케일, 테마, 모바일 동작, 키보드 탐색, 및 관리자 회복.
