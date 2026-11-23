---
description: "Bun에서 GMShop Edge SQLite 데이터와 개인 객체를 백업하고 복원하고, Cloudflare D1과 R2의 가져오기 경로를 검토하십시오."
titleTemplate: ":title | GMShop Edge"
---

# Bun 데이터 관리 {#bun-data-operations}

Bun 실행 환경은 권한 있는 SQLite 데이터베이스를 `$GMSHOP_DATA_DIR/gmshop.sqlite`에 저장하고, 개인 정보는 동일한 데이터 디렉토리 내에 보관합니다. 유지 관리되는 `bun run data -- …` CLI를 사용하여 SQLite 파일을 직접 복사하는 대신 사용하십시오.

## 백업 및 복원 {#backup-and-restore}

백업 또는 복원 작업을 수행하기 전에 컨테이너를 중지하여 데이터베이스, 개인 객체, 그리고 내구성 큐 상태가 하나의 논리적인 시점으로 유지되도록 합니다.

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

백업은 데이터 디렉터리 밖에 저장하세요. 복원 대상은 새 디렉터리 또는 빈 디렉터리여야 합니다. 기존 인스턴스를 덮어쓰지 않습니다. 매니페스트로 각 파일을 검증하고 복원 시 SQLite 무결성, 외래 키 및 변경 불가능한 마이그레이션의 체크섬도 검사합니다.

게시된 이미지는 동일한 CLI를 포함합니다.

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

백업에는 계정 정보, 고객 기록, 주문 정보, 기본 재고, 개인 다운로드, 그리고 자동화 관련 파일 등이 포함되어 있습니다. 저장 시 암호화하고, 접근을 제한하며, 정기적으로 복원 테스트를 수행하십시오.

CLI는 `$GMSHOP_DATA_DIR/.maintenance.lock` 파일을 사용합니다. 시스템 오류로 인해 파일이 남아있는 경우, 먼저 해당 디렉토리를 사용하는 서버 또는 데이터 명령이 없는지 확인한 후, 단순히 오래된 잠금 파일을 삭제합니다.

## 클라우드플레어 내보내기 가져오기 {#import-a-cloudflare-export}

D1과 R2 객체를 원본 키와 일치하는 상대 경로를 가진 로컬 디렉토리로 내보내고, 새로운 또는 비어있는 Bun 데이터 디렉토리로만 가져오세요.

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir`은 인스턴스에 객체가 없을 때 선택 사항입니다. `--r2-manifest` 또한 선택 사항이지만 `--r2-dir`이 필요하며, R2 HTTP 및 사용자 지정 메타데이터를 보존합니다.

수입업체는 저장소 이전, SQLite 무결성, 그리고 외래 키를 검증한 후, R2 키를 암호화된 객체 레이아웃으로 변환합니다. 또한, 위험한 경로, 알 수 없는 메타데이터, 객체가 없는 메타데이터, 그리고 비어 있지 않은 대상들을 거부합니다. 덮어쓰기 모드나 양방향 동기화는 지원하지 않습니다.
