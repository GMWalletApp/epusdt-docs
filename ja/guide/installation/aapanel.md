---
description: "aaPanelでEPUSDTチェックアウトドメインを設定し、HTTPSを設定し、リバースプロキシをゲートウェイプロセスに接続してください。"
---

# aaPanel でインストール {#install-using-aapanel}

## サイトを作成してください。 {#create-the-site}

チェックアウトドメイン用の静的サイトを作成し、DNSとHTTPSを設定してください。EPUSDTは、SQLiteを使用して別個のプロセスとして動作します。バイナリ、設定ファイル、およびデータベースは、サイトの公開ディレクトリの外に置いてください。

![決済用ドメインを追加する](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## プロセスを設定する {#configure-the-process}

1. aaPanelにSupervisorマネージャーをインストールしてください。お使いのアーキテクチャ用のリリースをダウンロードし、展開してください。 [インストールガイド](/ja/guide/installation/manual)を参照して、サービスアカウント、書き込み可能なディレクトリ、および `.env` を準備してください。
2. `app_uri` に決済画面の HTTPS URL を指定し、`http_listen=127.0.0.1:8000` を設定します。Supervisor の作業ディレクトリにはインストール先を指定します。コマンドには実行ファイルの絶対パスに続けて `http start` を指定し、自動起動と自動再起動を有効にしてください。
3. スーパーバイザーで、プロセスの状況とログを確認してください。

![Supervisor のプロセス設定](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## リバースプロキシを追加し、確認してください。 {#add-the-reverse-proxy-and-verify}

サイトの設定に、`http://127.0.0.1:8000` へのリバースプロキシを追加してください。`https://YOUR-DOMAIN/payments/gmpay/v1/config` を開き、`status_code: 200` であることを確認してください。設定の変更後に、Supervisor から EPUSDT を再起動してください。

![リバースプロキシの設定](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
