---
description: "Bun 배포 환경에서 GMPay Edge SQLite 데이터베이스와 개인 객체를 찾고, 백업, 복구 및 마이그레이션 절차를 따르세요."
titleTemplate: ":title | GMPay Edge"
---

# Bun 데이터 관리 {#bun-data-operations}

Bun 배포 방식은 SQLite 데이터베이스를 `$GMPAY_DATA_DIR/gmpay.sqlite`에 저장하고, 개인 객체는 `$GMPAY_DATA_DIR/objects`에 저장합니다. Bun과 SQLite 드라이버를 사용하여 관리되는 CLI와 애플리케이션 서버 모두 작동합니다.

## 백업 및 복원 {#backup-and-restore}

GMPay Edge 컨테이너를 백업 또는 복원하기 전에 중단하여 데이터베이스 및 객체 파일이 동일한 시간적 위치로 유지되도록 합니다.

```bash
GMPAY_DATA_DIR=/srv/gmpay bun run data -- backup --output /srv/backups/gmpay-backup
GMPAY_DATA_DIR=/srv/gmpay-restored bun run data -- restore --input /srv/backups/gmpay-backup
```

게시된 이미지는 동일한 CLI를 포함하고 있습니다. 서비스를 중단한 후, 외부 백업 디렉토리를 마운트하고 다음 명령을 실행하세요:

```bash
docker compose stop gmpay-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmpay-edge bun run data -- backup --output /backups/gmpay-backup
```

입력 또는 출력 경로를 항상 명시하세요. 백업은 데이터 디렉터리 밖에 저장합니다. 복원 대상은 새 디렉터리 또는 빈 디렉터리여야 하며, 파일이 있는 디렉터리를 덮어쓰지 않습니다. 매니페스트로 모든 파일을 검증하고 복원 시 SQLite 무결성, 외래 키 및 마이그레이션 체크섬도 검사합니다.

백업에는 계정 정보, 사용자 데이터, 결제 기록 및 개인 업로드가 포함되어 있습니다. 저장 시 암호화하고, 접근을 제한하며, 정기적으로 복원 테스트를 수행하십시오.

## 클라우드플레어 내보내기 가져오기 {#import-a-cloudflare-export}

D1 데이터를 SQL 형식으로 내보내고, R2 객체들을 원본 객체 키를 기준으로 하는 로컬 디렉토리로 내보냅니다. 그런 다음, 새로운 또는 비어 있는 Bun 데이터 디렉토리로 가져옵니다.

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMPAY_DATA_DIR=/srv/gmpay bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir`은 인스턴스에 객체가 없을 때 선택 사항입니다. `--r2-manifest` 또한 선택 사항이지만 `--r2-dir`이 필요합니다. R2 HTTP 및 사용자 지정 메타데이터를 유지하기 위해 사용되며, 원래 R2 객체 키로 키워진 JSON 객체입니다.

```json
{
  "evidence/receipt.txt": {
    "httpMetadata": {
      "contentType": "text/plain; charset=utf-8",
      "cacheExpiry": "2026-09-01T00:00:00.000Z"
    },
    "customMetadata": { "orderId": "order-123" }
  }
}
```

지원되는 HTTP 필드는 `contentType`, `contentLanguage`, `contentDisposition`, `contentEncoding`, `cacheControl`, 및 ISO 8601 형식의 `cacheExpiry`입니다. 정의되지 않은 필드, 문자열이 아닌 사용자 지정 메타데이터, 매칭되는 내보낸 객체가 없는 메타데이터 키는 거부됩니다. 이 측면이 없으면 객체 바이트와 키는 가져오지만, R2 메타데이터는 재구성할 수 없습니다.

이 기능은 모든 저장소 마이그레이션이 D1 내보내기에 존재하는지 확인하고, Bun 마이그레이션 실행자를 위한 체크섬을 기록하며, 외래 키를 검증하고, R2 키 경로를 해시된 개인 객체 레이아웃으로 변환합니다. 비어있는 대상에 대해 거부하기 때문에, 실패하거나 반복적인 가져오기는 기존 인스턴스를 덮어쓰지 않습니다.
