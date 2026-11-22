---
description: "epctl を使用して、Linux へのリリース版の EPUSDT バイナリをインストールし、リリース内容を確認し、サービスを管理します。"
---

# epctl によるインストールと動作確認 {#epctl-installation-and-verification-scripts}

`epctl`は、GitHub Releasesで公開された`epusdt`バイナリの、リポジトリのルートであり、Linuxのバイナリインストーラおよびサービスマネージャーです。
`epctl-docker-test.sh` は、エンドツーエンドの検証スクリプトです。Docker上でUbuntu + systemdを起動し、実際のリリースアーティファクトを用いて、ダウンロード、インストール、起動、アップデート、および init-password の動作を確認します。

新規インストールの場合、まずリリースファイルをダウンロードしてください。

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## 範囲 {#scope}

- Linuxのみ
- バイナリのみのインストール
- リリース元は `https://github.com/GMWalletApp/epusdt/releases` に固定されています。
- システム管理は systemd に基づいています。

## 依存関係と特権 {#dependencies-and-privileges}

`epctl`は、以下のコマンドを必要とします。

- `curl`
- `tar`
- `systemctl`
- `install`
- `grep`
- `sed`

備考

- `install`、`upgrade`、`self-install` は `/opt`、`/etc/systemd`、`/usr/local/bin` に書き込みます。
- `status` と `logs` は、必要に応じて `sudo` を利用して自動的に再実行されます。
- 実践的には、オペレーターは `sudo` 権限を持つ必要があります。

## 固定された道 {#fixed-paths}

| 項目 | パス |
|------|------|
| インストール先ディレクトリ | `/opt/epusdt` |
| 主要な二値 | `/opt/epusdt/epusdt` |
| スキャナーのバイナリ | `/opt/epusdt/chainscanner` |
| アクティブ設定 | `/opt/epusdt/.env` |
| スキャナー設定 | `/opt/epusdt/chainscanner.json` |
| 例：設定 | `/opt/epusdt/.env.example` |
| フロントエンドの資産を抽出 | `/opt/epusdt/www` |
| キャッシュをダウンロードする | `/tmp/epusdt/<tag>/` |
| systemd ユニット | `/etc/systemd/system/epusdt.service`, `/etc/systemd/system/chainscanner.service` |
| Global epctl のパス | `/usr/local/bin/epctl` |

## クイックスタート {#quick-start}

リポジトリのルートからインタラクティブなメニューを実行してください。

```bash
./epctl
```

デフォルトのインタラクティブ言語は中国語です。どちらかの言語を強制することも可能です。

```bash
./epctl zh
./epctl en
./epctl --lang zh help
./epctl --lang en help
```

スクリプトをPATHにインストールしてください。

```bash
./epctl self-install
epctl
```

## 一般的なコマンド {#common-commands}

特定のバージョンをダウンロードしてください。

```bash
./epctl download --tag v2.1.0
```

サービスをインストールしてください。デフォルトでは `--component epusdt` (埋め込みスキャン機能付き) を使用します。別個の2つのサービスを使用する場合は、`--component all` を指定してください。

```bash
./epctl install --tag v2.1.0 \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:18000
```

`chainscanner` をスタンドアロンで実行します (自動でトークンを生成したり、受け付けたり、接続情報を出力します)。

```bash
./epctl install --component chainscanner \
  --scanner-listen 0.0.0.0:9081
```

`epusdt` を単独で展開し、リモートの `chainscanner` への接続を確立する。

```bash
./epctl install --component epusdt \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:8000 \
  --scanner-url http://10.0.0.2:9081 \
  --scanner-token <chainscanner_token> \
  --scanner-admin-token <chainscanner_admin_token>
```

より新しいバージョンへアップグレードしてください（インストールされているコンポーネントを自動で検知するか、`--component all|epusdt|chainscanner` を指定してください）。

```bash
./epctl upgrade --tag v2.1.0
```

`./epctl upgrade --tag ...` を直接実行すると、ファイルが置き換えられた直後に `epusdt` がすぐに再起動されます。
ファイルのみを置き換えたい場合は、`--no-restart` オプションを使用してください。
もし、明示的な確認ステップをご希望の場合は、`--prompt-restart` を指定してください。インタラクティブなターミナルでは、プロンプトは `[Y/n]` で、Enterキーを押すとデフォルトで再起動します。

設定、ステータス、およびログを点検してください。

```bash
./epctl show-config
./epctl status
./epctl logs --lines 200
```

初期管理者パスワードをリクエストしてください。

```bash
./epctl init-password
```

## `--tag` が指定されていない場合の動作 {#behavior-when-tag-is-omitted}

`download`、`install`、`upgrade` では、`epctl` が GitHub の最新リリースタグを取得し、対象のタグを表示して確認を求めます。

Please provide the English text you would like me to translate. I'm ready when you are.

```bash
./epctl install --app-uri https://pay.example.com
```

インタラクティブな使用において、スクリプトは処理された最新のタグを表示し、その後続する。
自動化を行う場合、`--tag` を明示的に指定することを推奨します。確認を意図的にスキップしたい場合は、以下のようにお願いします。

```bash
EPCTL_ASSUME_YES=1 ./epctl download
```

## 初回インストール時に何が起こるか {#what-happens-on-first-install}

`install` は次の手順を実行します。

1. 現在のCPUアーキテクチャを検出し、対応するGitHub Releaseのアーカイブをダウンロードしてください。
2. `/tmp/epusdt/<tag>/extract/` に展開します
3. `/opt/epusdt/epusdt` にバイナリをインストールしてください。
4. `.env.example` を `/opt/epusdt/.env.example` にインストールしてください。
5. `epusdt`というシステムユーザーとグループを作成してください。
6. `/opt/epusdt/.env` ファイルが存在しない場合、`.env.example` から自動的に作成する。
7. `epusdt.service` を作成し、有効にする。

`.env` ファイルが自動生成された場合、スクリプトは最小限の基本的な変更のみを適用します。

- `install=false`
- `app_uri=<--app-uri, default http://127.0.0.1:8000>`
- `http_listen=<--listen, default 127.0.0.1:8000>`

`/opt/epusdt/.env` が既に存在する場合、インストールとアップグレードはそのままで行ってください。
`/opt/epusdt/.env.example` は、インストールまたはアップグレードのたびに、現在のリリースから更新されます。

## アップグレード時に何が行われるか {#what-happens-during-upgrade}

`upgrade` は次の手順を実行します。

1. 現在のCPUアーキテクチャを検出し、ターゲットのGitHubリリースアーカイブをダウンロードしてください。
2. `/tmp/epusdt/<tag>/extract/` に展開します
3. 既存の `/opt/epusdt/.env` が必要です。存在しない場合、コマンドは失敗し、「まず `install` を実行してください」と表示されます。
4. `/opt/epusdt/epusdt` を
5. `/opt/epusdt/.env.example` を置き換える。
6. `/opt/epusdt/.env` を保持してください。
7. `epusdt.service` をリフレッシュし、`systemctl daemon-reload` を実行してください。
8. `epusdt` を、デフォルトで直ちに再起動する。

追加の行動：

- `upgrade` では `.env` の作成と `systemctl enable` の実行は行われなくなりました。
- `upgrade --no-restart` オプションを使用すると、ファイルのみを更新し、手動での再起動を促すメッセージが表示されます。
- `upgrade --prompt-restart` オプションを使用すると、「インタラクティブなターミナルが利用可能になった場合に再起動するかどうか」と確認されます。
- アップグレード後に再起動が失敗した場合、スクリプトは以前のバイナリである `.env.example` とユニットファイルを復元を試みます。

## systemd サービスの詳細 {#systemd-service-details}

このサービス名は `epusdt.service` と固定されており、以下の基本的な設定を使用します。

```ini
WorkingDirectory=/opt/epusdt
ExecStart=/opt/epusdt/epusdt http start
User=epusdt
Group=epusdt
Restart=always
RestartSec=3
```

作業ディレクトリは `/opt/epusdt` に固定されています。プログラムは、バイナリの隣に `www/` 関連のファイルを抽出するためです。

## `init-password` の動作 {#what-init-password-does}

`epctl init-password` は、ローカルのHTTPルートのみを呼び出します。

```text
GET /admin/api/v1/auth/init-password
```

データベースを直接読み取らない。

`/opt/epusdt/.env` から `http_listen` の設定を読み取り、それをローカルのリクエストターゲットとして正規化します。

- `:8000` -> `127.0.0.1:8000`
- `0.0.0.0:8000` -> `127.0.0.1:8000`

APIから「`10040`」という値が返ってきた場合、ブートストラップの平文パスワードは利用できなくなります。よくある理由としては：

- 管理者パスワードは、すでに変更されています。
- 初期のパスワードは既に消費されており、再度取得することはできません。

その場合、`epctl` は診断のために、元のHTTPエラーボディを表示します。

## Docker 検証スクリプト {#docker-validation-script}

このリポジトリには、以下のものが含まれています。

```bash
./epctl-docker-test.sh <install-tag> [upgrade-tag]
```

例：

```bash
./epctl-docker-test.sh v2.1.0
./epctl-docker-test.sh --lang en v2.0.0 v2.1.0
```

ローカルの機械で、これらのチェックを実行します。

- `ubuntu:24.04` から直接開始し、コンテナの初期化時に systemd とテスト依存関係をインストールします。
- 特権的なコンテナを開始する
- `epctl self-install` コマンドをコンテナ内で実行する
- GitHub Release の関連ファイルをダウンロードします。
- `epusdt` のインストール
- `upgrade-tag` が指定された場合、`upgrade --no-restart`、デフォルトの非インタラクティブな `upgrade`、および `upgrade --prompt-restart` の `n` / Enter 経路を検証します。
- `www/index.html` などの systemd サービス、設定出力、ログ、およびステータスを検証します。
- `init-password` が一度成功することを確認し、管理者パスワードを変更した後で、`10040` を返す。

要件：

- ローカルにDockerをインストールしました。
- Dockerの実行許可
- GitHub Releases への外部アクセス

## 推奨 {#recommendations}

- 明確な `--tag` の値を自動化で利用することを推奨します。
- インストール後、`./epctl show-config` を一度実行して、現在使用されている `.env` ファイルを確認してください。
- 初期のパスワードを取得した直後に、管理者パスワードをすぐに変更してください。
- インストーラ自体を検証したい場合は、まず `./epctl-docker-test.sh` を実行してください。
