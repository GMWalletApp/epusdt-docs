---
description: "본인의 서비스 관리자 아래에서 EPUSDT Linux 버전을 실행하고, 작업 디렉토리와 게이트웨이 설정을 구성하십시오."
---

# Linux에 수동 설치 {#manual-linux-installation}

이 절차를 사용하여 출시된 바이너리를 본인의 서비스 관리자 아래에서 실행하십시오. 관리형 systemd 설치의 경우, [epctl 가이드](/ko/guide/installation/epctl)를 참조하십시오.

## 애플리케이션 디렉토리를 준비하십시오. {#prepare-the-application-directory}

[릴리스](https://github.com/GMWalletApp/epusdt/releases)에서 사용 중인 아키텍처에 맞는 Linux 압축 파일을 받아 `/opt/epusdt` 같은 비공개 애플리케이션 디렉터리에 푸세요. 설정 및 SQLite 디렉터리에 쓰기 권한이 있는 전용 서비스 계정을 준비하세요. 해당 디렉터리는 웹 서버의 공개 루트 밖에 두세요.

## 설정 및 테스트 {#configure-and-test}

새로운 설치 시 제공된 예제를 복사한 후, 복사본을 수정합니다. 업그레이드 시 기존의 `.env` 파일을 보존합니다.

```sh
cd /opt/epusdt
chmod +x epusdt
cp -n .env.example .env
```

HTTPS 프록시 뒤에 설정된 서비스의 경우, `.env` 파일에 다음 항목을 설정하고, 본인의 공용 도메인을 사용하세요. 첫 실행 시 SQLite 테이블이 생성됩니다.

```dotenv
app_uri=https://pay.example.com
http_listen=127.0.0.1:8000
runtime_root_path=./runtime
sqlite_database_filename=epusdt.db
install=false
```

애플리케이션 디렉토리에서 `./epusdt http start`를 실행합니다. 다른 터미널에서 `curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config`를 확인합니다. 관리 서비스를 시작하기 전에 현재 실행 중인 프로세스를 중지합니다.

## 서비스 상시 실행 {#keep-the-service-running}

다음 프로그램 정의를 사용하여 관리자를 설정하고, 사용자 필드의 `epusdt`를 준비한 서비스 계정으로 변경합니다. `supervisorctl reread`를 실행한 후, `supervisorctl update`를 실행하십시오.

```ini
[program:epusdt]
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
user=epusdt
autostart=true
autorestart=true
redirect_stderr=true
```

HTTPS 가상 호스트를 `http://127.0.0.1:8000`으로 설정하십시오. Nginx의 경우, TLS 서버 블록 내에서 다음 위치를 사용하십시오. 설정을 변경한 후 서비스의 재시작을 수행하십시오. 업그레이드하기 전에 설정 및 데이터 디렉토리의 백업을 수행하십시오.

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
