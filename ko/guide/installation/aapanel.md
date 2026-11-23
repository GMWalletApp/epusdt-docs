---
description: "aaPanel에서 EPUSDT 결제 도메인을 설정하고, HTTPS를 구성하고, 역 프록시를 게이트웨이 프로세스와 연결합니다."
---

# aaPanel로 설치 {#install-using-aapanel}

## 사이트 생성 {#create-the-site}

결제 도메인용 정적 사이트를 만들고 DNS와 HTTPS를 설정하세요. EPUSDT는 SQLite를 사용하는 별도 프로세스로 실행됩니다. 실행 파일, 설정 및 데이터베이스를 사이트의 공개 디렉터리 밖에 보관하세요.

![결제 도메인 추가](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## 프로세스 설정 {#configure-the-process}

1. aaPanel에 Supervisor 관리자를 설치하세요. 아키텍처에 맞는 릴리스를 다운로드해 압축을 푸세요. [수동 설치 가이드](/ko/guide/installation/manual)에 따라 서비스 계정, 쓰기 가능한 디렉터리 및 `.env`를 준비하세요.
2. `app_uri`를 HTTPS 결제 URL로 설정하고, `http_listen=127.0.0.1:8000`으로 설정합니다. Supervisor에서는 작업 디렉토리를 설치 디렉토리로, 그리고 명령은 전체 바이너리 경로와 함께 `http start`로 설정합니다. 자동 시작 및 재시작 기능을 활성화합니다.
3. Supervisor에서 진행 상황 및 로그를 확인하세요.

![Supervisor 프로세스 설정](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## 역방향 프록시를 추가하고 확인하세요. {#add-the-reverse-proxy-and-verify}

사이트 설정에서 `http://127.0.0.1:8000`을 대상으로 리버스 프록시를 추가하세요. `https://YOUR-DOMAIN/payments/gmpay/v1/config`를 열어 `status_code: 200`을 확인하세요. 활성화한 자산을 결제 화면에 표시하려면 수신 주소를 추가하세요. 설정을 바꾼 뒤 Supervisor에서 EPUSDT를 다시 시작하세요.

![리버스 프록시 설정](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
