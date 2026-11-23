---
description: "epctl을 사용하여 Linux에서 릴리스된 EPUSDT 바이너리를 설치하고, 릴리스를 확인하며, 서비스를 관리합니다."
---

# epctl 설치 및 검증 스크립트 {#epctl-installation-and-verification-scripts}

`epctl`은 GitHub Releases에서 배포된 `epusdt` 바이너리에 대한 루트 Linux 바이너리 설치 프로그램 및 서비스 관리자입니다.
`epctl-docker-test.sh`는 완벽한 테스트 스크립스로, Docker 환경에서 Ubuntu + systemd를 실행하고, 실제 릴리스 파일을 사용하여 다운로드, 설치, 실행, 업데이트, 그리고 init-password 동작의 완벽한 검증을 수행합니다.

신규 설치라면 먼저 해당 릴리스의 파일을 다운로드하세요.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## 적용 범위 {#scope}

- Linux 전용
- 바이너리 설치만 지원
- 출처는 `https://github.com/GMWalletApp/epusdt/releases`로 고정되었습니다.
- 시스템 관리는 systemd를 기반으로 합니다.

## 의존 및 권한 {#dependencies-and-privileges}

`epctl`은 다음 명령들을 필요로 합니다.

- `curl`
- `tar`
- `systemctl`
- `install`
- `grep`
- `sed`

참고 사항

- `install`, `upgrade`, `self-install`은 `/opt`, `/etc/systemd`, `/usr/local/bin`에 파일을 기록합니다.
- `status` 및 `logs`는 필요에 따라 `sudo`를 통해 자동으로 다시 실행됩니다.
- 실질적으로, 운영자는 `sudo` 권한을 갖춰야 합니다.

## 고정 경로 {#fixed-paths}

| 항목 | 경로 |
|------|------|
| 설치 디렉터리 | `/opt/epusdt` |
| 메인 실행 파일 | `/opt/epusdt/epusdt` |
| 스캐너 실행 파일 | `/opt/epusdt/chainscanner` |
| 사용 중인 설정 파일 | `/opt/epusdt/.env` |
| 스캐너 설정 파일 | `/opt/epusdt/chainscanner.json` |
| 예시 설정 파일 | `/opt/epusdt/.env.example` |
| 전면부 자산 추출 | `/opt/epusdt/www` |
| 다운로드 캐시 | `/tmp/epusdt/<tag>/` |
| systemd 유닛 | `/etc/systemd/system/epusdt.service`, `/etc/systemd/system/chainscanner.service` |
| 전역 epctl 경로 | `/usr/local/bin/epctl` |

## 빠른 시작 {#quick-start}

리포의 최상에서 인터랙티브 메뉴를 실행하세요.

```bash
./epctl
```

기본 인터페이스 언어는 중국어입니다. 원하는 언어를 강제로 선택할 수 있습니다.

```bash
./epctl zh
./epctl en
./epctl --lang zh help
./epctl --lang en help
```

스크립트를 PATH에 설치하세요.

```bash
./epctl self-install
epctl
```

## 자주 사용하는 명령 {#common-commands}

특정 버전 다운로드

```bash
./epctl download --tag v2.1.0
```

서비스를 설치합니다 (기본 설정은 `--component epusdt`와 내장 스캐너를 사용합니다). 두 개의 별도 서비스를 사용하려면 `--component all`을 사용하십시오.

```bash
./epctl install --tag v2.1.0 \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:18000
```

`chainscanner`를 독립적으로 배포합니다 (자동으로 토큰을 생성하거나, 토큰을 수용하고 연결 정보 출력):

```bash
./epctl install --component chainscanner \
  --scanner-listen 0.0.0.0:9081
```

`epusdt`를 독립적으로 배포하고 (원격의 `chainscanner`에 연결):

```bash
./epctl install --component epusdt \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:8000 \
  --scanner-url http://10.0.0.2:9081 \
  --scanner-token <chainscanner_token> \
  --scanner-admin-token <chainscanner_admin_token>
```

새로운 버전으로 업그레이드 (설치된 구성 요소를 자동으로 감지하거나, `--component all|epusdt|chainscanner` 옵션을 사용):

```bash
./epctl upgrade --tag v2.1.0
```

다음 명령 `./epctl upgrade --tag ...`을 직접 실행하면 `epusdt`가 파일이 대체된 직후 즉시 재시작됩니다.
파일만 교체하고 싶다면 `--no-restart` 옵션을 사용하세요.
명시적인 확인 단계를 원하시면 `--prompt-restart` 옵션을 사용하세요. 인터랙티브 터미널에서는 프롬프트가 `[Y/n]`으로 표시되므로, 엔터를 누르면 기본적으로 재시작됩니다.

설정, 상태, 로그를 확인하세요.

```bash
./epctl show-config
./epctl status
./epctl logs --lines 200
```

초기 관리자 비밀번호를 요청합니다.

```bash
./epctl init-password
```

## `--tag` 옵션이 생략될 경우의 동작 {#behavior-when-tag-is-omitted}

`download`, `install`, `upgrade` 명령을 실행하면 `epctl`은 먼저 GitHub에서 최신 릴리스 태그를 조회한 뒤 정확한 태그를 표시하고 확인을 요청합니다.

예시

```bash
./epctl install --app-uri https://pay.example.com
```

상호작용 모드에서, 스크립트는 진행하기 전에 가장 최신의 해결된 태그를 표시합니다.
자동화를 위해, `--tag` 옵션을 명시적으로 지정하는 것이 좋습니다. 의도적으로 확인 단계를 건너뛰고 싶다면, 다음을 사용하세요:

```bash
EPCTL_ASSUME_YES=1 ./epctl download
```

## 초기 설치 시 발생하는 일 {#what-happens-on-first-install}

`install`은 다음 단계를 실행합니다.

1. 현재 CPU 아키텍처를 감지하고, 이에 맞는 GitHub Release 아카이브를 다운로드합니다.
2. `/tmp/epusdt/<tag>/extract/`
3. `/opt/epusdt/epusdt`에 바이너리를 설치하십시오.
4. `.env.example` 파일을 `/opt/epusdt/.env.example`로 설치합니다.
5. `epusdt` 사용자 및 그룹을 생성합니다.
6. `/opt/epusdt/.env` 파일이 존재하지 않는 경우, `.env.example` 파일에서 자동으로 생성합니다.
7. `epusdt.service`를 작성하고 활성화하세요.

`.env` 파일이 자동으로 생성되면, 스크립트는 최소한의 기본적인 변경 사항만 적용합니다.

- `install=false`
- `app_uri=<--app-uri, default http://127.0.0.1:8000>`
- `http_listen=<--listen, default 127.0.0.1:8000>`

`/opt/epusdt/.env` 파일이 이미 존재한다면, 설치 및 업그레이드는 그대로 유지합니다.
`/opt/epusdt/.env.example`는 설치 또는 업그레이드 시 현재 버전에서 최신 정보로 업데이트됩니다.

## 업그레이드 과정은 무엇인가요 {#what-happens-during-upgrade}

`upgrade`는 다음 단계를 실행합니다.

1. 현재 CPU 아키텍처를 감지하고, 대상 GitHub 릴리스 아카이브를 다운로드합니다.
2. `/tmp/epusdt/<tag>/extract/`
3. `/opt/epusdt/.env` 파일을 요구합니다. 파일이 없으면 명령이 실패하고 `install`을 먼저 실행하라는 메시지를 표시합니다.
4. `/opt/epusdt/epusdt`
5. `/opt/epusdt/.env.example` 를
6. `/opt/epusdt/.env` 를 유지하세요.
7. `epusdt.service`를 다시 시작하고, `systemctl daemon-reload` 명령을 실행하세요.
8. `epusdt`를 기본적으로 즉시 재시작합니다.

추가 동작

- 이제 `upgrade`는 `.env`를 새로 만들거나 `systemctl enable`을 실행하지 않습니다.
- `upgrade --no-restart` 옵션을 사용하면 파일만 업데이트하고, 수동 재시작 경고를 표시합니다.
- `upgrade --prompt-restart` 옵션을 사용하면, 인터랙티브 터미널이 있을 때 재시작 여부를 묻습니다.
- 업그레이드 후 재시도가 실패할 경우, 스크립트는 이전 바이너리 파일인 `.env.example`과 유닛 파일을 되돌립니다.

## systemd 서비스 세부 정보 {#systemd-service-details}

서비스 이름은 `epusdt.service`로 고정되어 있으며, 다음 핵심 설정들을 사용합니다.

```ini
WorkingDirectory=/opt/epusdt
ExecStart=/opt/epusdt/epusdt http start
User=epusdt
Group=epusdt
Restart=always
RestartSec=3
```

작업 디렉토리는 `/opt/epusdt`로 유지됩니다. 프로그램이 실행 파일과 함께 `www/` 자원을 추출하기 때문입니다.

## `init-password`의 기능 {#what-init-password-does}

`epctl init-password`는 로컬 HTTP 경로만 호출합니다.

```text
GET /admin/api/v1/auth/init-password
```

데이터베이스를 직접 읽지는 않습니다.

`/opt/epusdt/.env` 파일에서 `http_listen`을 읽어, 이를 로컬 요청 대상으로 정규화합니다.

- `:8000` -> `127.0.0.1:8000`
- `0.0.0.0:8000` -> `127.0.0.1:8000`

API에서 `10040`을 반환하면, 초기화된 평문 비밀번호는 더 이상 사용되지 않습니다. 일반적인 이유는 다음과 같습니다:

- 관리자 비밀번호가 이미 변경되었습니다.
- 초기 비밀번호는 이미 사용되었으며, 다시는 가져올 수 없습니다.

이 경우, `epctl`은 진단 목적으로 원래 HTTP 오류 본문을 출력합니다.

## Docker 검증 스크립트 {#docker-validation-script}

저장소에는 다음 항목도 포함됩니다.

```bash
./epctl-docker-test.sh <install-tag> [upgrade-tag]
```

예시

```bash
./epctl-docker-test.sh v2.1.0
./epctl-docker-test.sh --lang en v2.0.0 v2.1.0
```

다음과 같은 검사를 로컬 기기에서 수행합니다:

- `ubuntu:24.04` 환경에서 바로 시작하여, 컨테이너 부팅 과정에서 systemd와 테스트 종속성을 설치합니다.
- 특별한 컨테이너를 시작합니다.
- `epctl self-install` 명령을 컨테이너 내부에서 실행합니다.
- 실제 GitHub Release 자료 다운로드
- `epusdt` 설치
- `upgrade-tag`를 지정하면 `upgrade --no-restart`, 기본 비대화형 `upgrade`, 그리고 `upgrade --prompt-restart`에서 `n`을 선택하거나 Enter를 누르는 두 경우를 검증합니다.
- `www/index.html` 시스템 서비스의 상태, 설정 출력, 로그, 그리고 상태를 확인합니다.
- `init-password`가 한 번 성공적으로 실행된 후, 관리자 비밀번호가 변경된 후에는 `10040`을 반환합니다.

요구 사항

- 로컬에 Docker 설치 필요
- Docker 실행 권한
- GitHub Releases로의 외부 접근

## 권장 사항 {#recommendations}

- 명시적인 `--tag` 값을 자동화에 선호합니다.
- 설치 후, 현재 `.env` 파일이 제대로 적용되었는지 확인하기 위해 `./epctl show-config` 명령을 한 번 실행하세요.
- 초기 비밀번호를 받은 후 즉시 관리자 비밀번호를 변경하세요.
- 설치 프로그램 자체를 검증하려면, 먼저 `./epctl-docker-test.sh`를 실행하세요.
