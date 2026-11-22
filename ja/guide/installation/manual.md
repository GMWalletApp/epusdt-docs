---
description: "ご自身のサービスマネージャーでEPUSDT Linuxのリリースを実行し、作業ディレクトリとゲートウェイ設定を構成してください。"
---

# Linux への手動インストール {#manual-linux-installation}

この手順に従って、ご自身のサービスマネージャーでリリースされたバイナリを実行してください。systemdの管理環境をご利用の場合、[epctlのガイド](/ja/guide/installation/epctl)を参照してください。

## アプリケーションのディレクトリを準備してください。 {#prepare-the-application-directory}

[Releases](https://github.com/GMWalletApp/epusdt/releases) から CPU アーキテクチャに合った Linux 用アーカイブをダウンロードし、`/opt/epusdt` などの非公開ディレクトリに展開します。専用のサービスアカウントを用意し、設定ディレクトリと SQLite ディレクトリへの書き込み権限を付与します。これらは Web サーバーが公開するディレクトリの外に配置してください。

## 設定とテスト {#configure-and-test}

新しいインストール時に付属のサンプルをコピーし、それを編集します。アップグレード時に既存の `.env` ファイルを保持してください。

```sh
cd /opt/epusdt
chmod +x epusdt
cp -n .env.example .env
```

設定済みのサービスをHTTPSプロキシの背後で利用する場合、`.env` ファイルに以下の設定を行い、ご自身の公開ドメインを使用してください。初回起動時にSQLiteのテーブルが作成されます。

```dotenv
app_uri=https://pay.example.com
http_listen=127.0.0.1:8000
runtime_root_path=./runtime
sqlite_database_filename=epusdt.db
install=false
```

アプリケーションディレクトリで `./epusdt http start` を実行してください。別のターミナルから `curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config` を実行します。 サービスを起動する前に、現在のプロセスを停止してください。

## サービスを維持する。 {#keep-the-service-running}

監督者は、以下のプログラム定義を使用し、ユーザーフィールドの `epusdt` を、事前に準備したサービスアカウントに置き換えてください。その後、`supervisorctl reread`、そして `supervisorctl update` を実行してください。

```ini
[program:epusdt]
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
user=epusdt
autostart=true
autorestart=true
redirect_stderr=true
```

HTTPS仮想ホストを `http://127.0.0.1:8000` に設定してください。Nginxを使用する場合は、TLSサーバーブロック内にこの場所を使用します。設定を編集した後は、サービスを再起動してください。アップグレードする前に、設定とデータディレクトリのバックアップを作成してください。

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
