---
description: "EPUSDT のリリースノートを確認し、自社ホストのゲートウェイをアップグレードする前に、データベース、デプロイメント、および決済 API の変更を確認してください。"
---

# リリースノート {#release-notes}

## v2.1.1 {#v2-1-1}

2026-11-21 · [リリースノート](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.1)

EPUSDTは現在、SQLiteのみを使用しています。既存のSQLiteユーザーの方は、設定やデータベースを保持できます。MySQLまたはPostgreSQLをご利用の方は、アップグレード前にバックアップ、移行、データを確認してください。

## v2.1.0 {#v2-1-0}

2026-11-21 · [リリースノート](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

- 埋め込まれた ChainScanner は、保存された進行状況から復元し、欠落しているブロックを再試行します。厳格な検証により、確認と手動レビューの状況が追加されます。
- 八つの新しい直接支払いネットワークを追加することで、合計は16となります。チェックアウトでは、OKX OnchainOS (X Layer) もサポートされ、オプションで取引時の手数料を通知することも可能です。
- SQLiteのロック競合と、期限切れの注文による新しい注文の金額予約の解除を修正します。v2.0.0からアップグレードするユーザーは、コンテナを再作成する前に、データを移行する必要があります。

## v2.0.0 {#v2-0-0}

- リリースタグ: `v2.0.0`
- 公開日時: `2026-07-23T06:04:47Z`
- 公式リリースノート: `Breaking change for GMPay integrations: GMPay signatures changed from MD5 to HMAC-SHA256`
- 変更履歴の全文: `https://github.com/GMWalletApp/epusdt/compare/v1.0.10...v2.0.0`

### ユーザー向けの変更点 {#user-visible-changes}

- **GMPay署名変更**: GMPayの要求と応答の署名が、`secret_key` を HMAC キーとして使用する HMAC-SHA256 に変更されました。既存の MD5 ベースの GMPay クライアントは、アップグレードされるまで `401 Unauthorized` エラーを受け取ります。
- EPayに対応したリクエストと返信は影響を受けず、MD5を用いた `sign` / `sign_type` を引き続き使用します。
- ホストされたレジの初期化データが更新され、`server_time`が含まれるようになりました。これにより、クライアントはサーバー時刻に基づいてカウントダウンを計算できるようになり、ローカルブラウザの時刻に依存する必要がなくなります。
- `sdk/python/gmpay_create_order.py` で、標準ライブラリのみを使用する Python GMPay の注文作成例を追加しました。
- EVMの支払い復元プロセスが改善され、中断されたスキャン窓をより確実に復元できるようになりました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes}

- v2.0.0の展開前に、GMPayのクライアントをアップグレードしてください。`signature`を削除し、空の値を削除し、ASCIIキーの順でパラメータをソートし、`key=value&key=value`で結合し、`secret_key`を使用して小文字のHEX形式のHMAC-SHA256を計算してください。
- 現在、レート設定は `rate.mode=fixed|auto` と `rate.cache_ttl_seconds` (`10`～`86400`秒) をサポートしています。固定モードでは `rate.forced_rate_list` を使用し、自動モードでは `rate.api_url` を取得し、永続的なキャッシュを保持します。
- 自動評価によるリフレッシュは、プロバイダーからの応答が不完全な場合でも、以前の成功したレートを保持し、リフレッシュや永続化が失敗した場合でも、最後の耐久性キャッシュを継続して提供します。

### API の変更点 {#api-changes}

- `POST /payments/gmpay/v1/order/create-transaction` では、GMPay の `signature` の検証方式が MD5 から HMAC-SHA256 に変わりました。
- GMPayの obchod者からのコールバックは、同じ HMAC-SHA256 の標準パラメータルールで検証する必要があります。
- `GET /pay/checkout-counter-resp/{trade_id}` のレスポンスデータに、「`server_time`」が追加されました。
- Admin APIは、レートキャッシュの状況確認のための `GET /admin/api/v1/settings/rate/status` と、強制的なリフレッシュのための `POST /admin/api/v1/settings/rate/refresh` を追加しました。

### 参照元 {#evidence-used}

- GitHub リリース `v2.0.0`
- PR `#104`（開発版の統合）および PR `#99`（EVM復旧）
- コミット: `44d90b6`（EVM バックフィルの復旧）、`f086d8b`（決済画面の `server_time`）、`3dc8ab0`（永続フォールバックキャッシュを使う自動レート設定）、`58141cd`（GMPay の HMAC-SHA256 署名）、`2353d85`（Python 版 GMPay SDK の例）
- ファイル: `src/middleware/check_sign.go`, `src/util/sign/sign.go`, `src/model/service/epay_return.go`, `src/model/response/pay_response.go`, `src/config/rate.go`, `src/controller/admin/settings_controller.go`, `src/route/router.go`, `src/task/listen_evm_backfill.go`, `sdk/python/gmpay_create_order.py`


## v1.0.10 {#v1-0-10}

- リリースタグ: `v1.0.10`
- 公開日時: `2026-07-10T13:24:42Z`
- 公式リリースノート: `Allow admin to mark expired on-chain orders as paid and seed rates`
- 変更履歴の全文: `https://github.com/GMWalletApp/epusdt/compare/v1.0.9...v1.0.10`

### ユーザー向けの変更点 {#user-visible-changes-1}

- 管理者用マニュアル：期限切れのオンチェーン注文の修復が可能になりました。トランザクションハッシュの検証後に、提出されたトランザクションハッシュに基づいて、期限切れの注文を修復できます。しかし、公開トランザクションハッシュの提出経路は、依然として待機中の注文のみを受け付け、期限切れの注文やOkPay/プロバイダーの注文は拒否します。
- CNYステーブルコインの安定的な変換における、内蔵された強制換率のデフォルト値は、`cny.usdt` と `cny.usdc` が `0.14705882352941177` に設定されます。
- `rate.forced_rate_list` がレート設定が更新された場合、または設定が削除された場合、内部の CNY 安定通貨のデフォルト値に戻ります。また、空でないカスタム JSON はユーザーが所有し、統合または上書きされません。
- `rate.api_url` はオプションで、指定された場合でも、公開されているHTTP/HTTPS URLである必要があります。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-1}

- `epctl upgrade` のアップグレードは、現在存在している `/opt/epusdt/.env` が必要になるため、アップグレード時に新しい設定ファイルは作成されません。 新しいマシンではまず `install` を実行してください。
- `epctl upgrade` コマンドは、デフォルトでリリースファイルを置き換え、`epusdt` を再起動します。 `--no-restart` を指定すると、再起動せずにファイルを適用できます。または、インタラクティブなターミナルで確認を求める `--prompt-restart` を指定することも可能です。
- 現在のバイナリ、`.env.example`、および systemd ユニットの復元用バックアップを、デプロイのアップデート時に保持します。ファイルデプロイや再起動に失敗した場合、`epctl` は以前のリリースファイルを復元を試みます。

### API の変更点 {#api-changes-1}

- Adminマークによる支払いを受け付けた注文（保留中および期限切れのオンチェーン注文）は、チェーン取引の検証後に受け付けます。
- `POST /pay/submit-tx-hash/{trade_id}` の対象は支払い待ちのオンチェーン注文だけです。期限切れの注文は検証前に拒否されます。
- Rate設定のドキュメントでは、`rate.api_url`をオプションとして扱い、`rate.forced_rate_list`のデフォルト復元動作について説明しています。

### 参照元 {#evidence-used-1}

- GitHub リリース `v1.0.10`
- PR `#97` (開発の統合)
- コミット：`392240e` (管理者による、期限切れのオンチェーン注文の支払い)、`d18965d` (CNYステーブルコインのデフォルト強制レート)、`6589ad1` (epctl のアップグレード再起動とロールバック安全なデプロイ)、`8f03599` / `5668a2a` (フロントエンドのビルド同期)
- ファイル: `src/controller/admin/order_controller.go`, `src/controller/comm/pay_controller.go`, `src/model/service/order_service.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/model/dao/mdb_table_init.go`, `src/controller/admin/settings_controller.go`, `epctl`, `wiki/EPCTL.md`, `wiki/EPCTL.en.md`


## v1.0.9 {#v1-0-9}

- リリースタグ: `v1.0.9`
- 公開日時: `2026-06-29T10:11:08Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.8...v1.0.9`

### ユーザー向けの変更点 {#user-visible-changes-2}

- EPay のタイプ選択：EPay submit.php は、`type=alipay` または、サポートされている `type=token.network` 選択子（例：`usdt.tron`）を使用できるようになりました。有効な選択子は、直接支払いトークン/ネットワークを選択します。
- EPay のリターンと通知のコールバックでは、一律に `alipay` を返していた従来の動作が変わり、保存済みのリクエストの `type` を返すようになりました。
- インストールプロセスは、初回設定時に初期管理者パスワードを返すことができる。また、公開されている管理者APIは、フロントエンドの警告用として、初期パスワードのハッシュエンドポイントのみを保持する。
- `epctl` Linuxのバイナリインストーラ/サービスマネージャーに加え、Dockerベースの包括的な検証のための`epctl-docker-test.sh`を追加しました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-2}

- `epctl` は、`/opt/epusdt` にリリースされたバイナリをインストールし、`epusdt.service` を作成します。また、インストールまたはアップグレード時に既存の `/opt/epusdt/.env` を保持し、グローバルに `/usr/local/bin/epctl` にインストールすることも可能です。
- EPay の `epay.default_token` および `epay.default_network` は、有効な `type=token.network` 選択子が指定された場合、無視されます。しかし、`epay.default_currency` は依然として通貨の代替を提供します。
- 新しい環境変数は不要です。

### API の変更点 {#api-changes-2}

- `GET` / `POST /payments/epay/v1/order/create-transaction/submit.php` は、空でない `type` を `alipay` または現在サポートされている `token.network` セレクターに制限します。
- `GET /pay/return/{trade_id}` と EPay の非同期通知は、保存された `type` を使います。`type` が未指定の場合は `alipay` を使います。
- `GET /admin/api/v1/auth/init-password-hash` は、初期パスワードの状態を公開するエンドポイントとして機能します。このリリースでは、以前の平文形式の `init-password` 管理ルートは登録されていません。

### 参照元 {#evidence-used-2}

- GitHub リリース `v1.0.9`
- PR `#92` (開発版マージ)
- コミット：`2dc538c` (EPay タイプセレクター), `73aef80` (サブミットタイプの制限), `15de0e6` (初期パスワードの保持), `7d09adf` (初期管理者パスワードの復元), `1cdb1ed` (epctl インストーラーおよびドキュメント)
- ファイル: `src/route/router.go`, `src/controller/comm/order_controller.go`, `src/model/service/epay_return.go`, `src/install/installer.go`, `epctl`, `epctl-docker-test.sh`, `wiki/EPCTL.md`


## v1.0.8 {#v1-0-8}

- リリースタグ: `v1.0.8`
- 公開日時: `2026-06-20T06:31:53Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.7...v1.0.8`

### ユーザー向けの変更点 {#user-visible-changes-3}

- Aptosブロックチェーンは、USDTとUSCの決済をサポートするようになりました。このシステムには、トークンの設定、RPCルーティング、およびAptos Moveベースのアセット向けのオンチェーントランザクションのスクリーニング機能が含まれています。
- Aptos トークンのサポートとRPCルーティングは、管理者設定のチェーンとchain_tokenの設定に基づいて行われるようになり、スキャナーにハードコードされたコントラクトアドレスが不要になりました。
- 手動による支払い確認が、Aptos 取引の検証をサポートします。
- READMEのドキュメントが更新され、Aptosを他のサポートされているチェーンとともに記載されるようになりました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-3}

- Aptosチェーンは、管理パネルで設定されたRPCエンドポイントを必要とします。スキャナーは、Aptos リーダーのバージョンを追跡し、トークンの送受信に関するMoveモジュールのイベントをスキャンします。
- 新しい環境変数は不要です。Aptosチェーンおよびトークンの設定は、既存の管理者チェーン/トークンの設定フローに従います。

### API の変更点 {#api-changes-3}

- Aptosは、サポートされている資産リストおよび注文エンドポイントにおいて、チェーンオプションとして利用可能になりました。
- 管理者チェーンとトークン管理のエンドポイントが、Aptos固有の設定フィールドに対応しました。

### 参照元 {#evidence-used-3}

- GitHub リリース `v1.0.8`
- PR `#91` (開発版マージ)
- コミット：`de96a5d`（Aptos サポート）、`8216c91`（設定ベースのトークンサポート）
- ファイル: `README.md`, `README.en.md`, `src/controller/admin/chain_token_controller.go`, `src/model/service/aptos_task.go`, `src/task/listen_aptos_scanner.go`, `src/util/address/move.go`


## v1.0.7 {#v1-0-7}

- リリースタグ: `v1.0.7`
- 公開日時: `2026-06-16T11:37:43Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.6...v1.0.7`

### ユーザー向けの変更点 {#user-visible-changes-4}

- GMPay および EPay の注文作成エンドポイントが、プレースホルダー注文をサポートするように更新されました。注文は、実際の支払い方法が選択される前に、オンチェーンの支払いアドレスをすぐに必要とすることなく作成できるようになり、注文IDを事前に必要とする統合を可能にします。
- プレースホルダー注文は、登録ユーザーがレジフローで支払いネットワークを選択した場合、実際のオンチェーン注文に変換されます。
- 注文のワークフローが、ネットワークの選択を遅延できるようになり、販売者はまず注文を作成し、その後、顧客が支払い方法を選択できるようにしました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-4}

- 新しい環境変数は不要です。
- GMPay および EPay のフローでは、デフォルトでプレースホルダー注文のサポートが有効になっています。

### API の変更点 {#api-changes-4}

- `POST /payments/gmpay/v1/order/create-transaction` および EPay の注文作成エンドポイントは、現在、`network` や `token` パラメータを事前に必要とせずに、注文を受け付けます。これらのパラメータを省略すると、プレースホルダーの注文が作成されます。
- プレースホルダー注文は、`trade_id` とレジストレーションURLを返しますが、顧客がネットワークを選択するまでウォレットアドレスは含まれません。
- `POST /pay/switch-network` は、プレースホルダー注文を、選択されたネットワークを割り当てて支払いアドレスを生成することで、本格的なオンチェーン注文に変換します。

### 参照元 {#evidence-used-4}

- GitHub リリース `v1.0.7`
- PR `#89` (開発版マージ)
- コミット：`3ab3659` (プレースホルダー注文サポート)
- ファイル: `src/model/service/order_service.go`, `src/controller/comm/order_controller.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data.go`, `wiki/API.md`


## v1.0.6 {#v1-0-6}

- リリースタグ: `v1.0.6`
- 公開日時: `2026-06-11T16:51:24Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.5...v1.0.6`

### ユーザー向けの変更点 {#user-visible-changes-5}

- このシステムは、TONブロックチェーンおよびUSDT Jettonの決済をサポートするようになり、liteclientベースのトランザクションスキャン、TONアドレスの正規化（生の形式/ユーザーフレンドリー形式/転送可能な形式）、およびJettonコントラクトの検証機能を備えています。
- 手動による支払い確認の際、今ではTON txの検証と、オンチェーンでの証明の確認が含まれるようになりました。
- 管理設定パネルで、サーバーを再起動せずに、実行ログレベルを調整できるようになりました。ログレベルの変更は、現在アクティブなすべてのロガーで、即座に反映されます。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-5}

- TON liteclientは、パブリックのliteserver設定（メインネットまたはテストネット）を必要とします。スキャナーは、最新のマスターチェーンブロックから開始し、Jettonの送金に伴うシャードチェーンを追跡します。
- 新しい環境変数は不要です。TONチェーンとトークンの設定は、既存のRPCノードとチェーントークンの設定フローに従います。

### API の変更点 {#api-changes-5}

- TONは、サポートされているアセットのリストおよび注文エンドポイントにおいて、チェーンオプションとして利用可能になりました。
- 管理設定APIが、実行時のログ調整のための`log_level`を追加しました。（有効な値：`debug`、`info`、`warn`、`error`）

### 参照元 {#evidence-used-5}

- GitHub リリース `v1.0.6`
- PR `#87` (開発版マージ)
- コミット：`9b397bd` (TONサポート)、`9ac9894` (実行時ログレベル)
- ファイル: `src/task/listen_ton.go`, `src/util/address/ton.go`, `src/model/service/ton_task.go`, `src/util/log/log.go`, `src/controller/admin/settings_controller.go`


## v1.0.5 {#v1-0-5}

- リリースタグ: `v1.0.5`
- 公開日時: `2026-06-09T16:25:25Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.4...v1.0.5`

### ユーザー向けの変更点 {#user-visible-changes-6}

- 管理ダッシュボードが、Server-Sent Events (SSE) エンドポイントを通じて、リアルタイムのRPCノードの実行統計情報を公開するようになりました。これにより、フロントエンドはポーリングなしで、RPC呼び出しの数、成功率、およびエラー統計をリアルタイムで表示できます。
- Solana RPCにおけるタスク統計は、各ノードおよび各操作（署名スキャン、トランザクション取得、確認取得）の呼び出し回数と、エラーイベントを追跡します。
- EVMのWebSocketおよびブロックスキャンタスクが、メモリ内の統計追跡機能にRPC呼び出しのメトリクスを報告するようになりました。
- READMEが、セキュリティ監査の情報と新しいスクリーンショットで更新されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-6}

- 新しい環境変数は不要です。
- SSE エンドポイントは、`/api/admin/v1/rpc/stats/stream` でアクセス可能ですが、管理者用 JWT による認証が必要です。

### API の変更点 {#api-changes-6}

- `GET /api/admin/v1/rpc/stats/stream` (SSE) は、RPC ノードの実行統計に関する JSON ストリームを返します。各イベントには、ノードID、呼び出し回数、成功回数、エラー回数、および最終確認時刻が含まれます。

### 参照元 {#evidence-used-6}

- GitHub リリース `v1.0.5`
- PR `#86` (開発版マージ)
- コミット：`08d409d` (RPC 統計 SSE)、`54b83f8` (README の更新)、`3879853` (アセットファイル)
- ファイル: `src/controller/admin/dashboard_controller.go`, `src/model/data/rpc_runtime_stats.go`, `src/task/listen_sol_job.go`, `src/task/listen_evm_ws.go`, `README.md`


## v1.0.4 {#v1-0-4}

- リリースタグ: `v1.0.4`
- 公開日時: `2026-06-03T13:01:37Z`
- 公式リリースノート: `feat(www): enable RPC node create and edit actions — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.3...v1.0.4`

### ユーザー向けの変更点 {#user-visible-changes-7}

- 管理画面が、ブラウザ内で直接RPCノードの作成と編集を可能にしました。これまでは、これらの操作はフロントエンドで無効または不完全でした。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-7}

- 新しい環境変数やバックエンドの変更は不要です。これは、フロントエンドのみのアップデートです。

### API の変更点 {#api-changes-7}

- API 経路は追加または削除されていません。現在、フロントエンドは既存のRPCノード管理エンドポイントを正しく呼び出しています。

### 参照元 {#evidence-used-7}

- GitHub リリース `v1.0.4`
- PR `#85`: feat(www): RPCノードの作成と編集機能を有効化
- コミット：`3e85bf7` (アセット更新)
- ファイル: `src/www/assets/*` (フロントエンドバンドル更新)


## v1.0.3 {#v1-0-3}

- リリースタグ: `v1.0.3`
- 公開日時: `2026-05-27T11:42:43Z`
- 公式リリースノート: `docs: update payment API integration guide — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.2...v1.0.3`

### ユーザー向けの変更点 {#user-visible-changes-8}

- 注文用IDは、現在、暗号的に安全な乱数を用いて生成され、URLで安全なBase64でエンコードされます。これにより、以前のタイムスタンプベースの形式に比べて、衝突のリスクを減らし、匿名性を向上させます。
- RPCノードは、`purpose`フィールドを導入しました。（`general`、`manual_verify`、または`both`のいずれか）これにより、オペレーターは、スキャン/WSS/健康チェックのトラフィックに影響を与えることなく、手動での支払い確認に特化したノードを使用できるようになります。
- 支払いの手動検証には `manual_verify` の RPC ノードを優先し、専用ノードがなければ `general` を使用します。専用ノードを用意すると検証とスキャンの負荷を分散できます。
- レジでの支払いページが、ユーザーが取引ハッシュを手動で送信できるように変更されました。送信されたハッシュは、注文が完了する前に、ブロックチェーン上で検証されます。
- ダッシュボードのトレンド集計クエリは、MySQL/PostgreSQL/SQLiteといったデータベース固有のSQLを使用することで、すべてのサポートされているデータベースで正確な日付の切り詰めを実現しています。
- 支払い確認とレートAPIのURLは、プライベートIPアドレスの範囲（RFC 1918）を拒否するように検証され、ユーザーが制御するコールバックURLによるSSRF攻撃を防ぐようになりました。
- リポジトリのREADMEにおける、決済API連携に関する説明が、より分かりやすい例とエンドポイントの説明で更新されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-8}

- 新しい環境変数は不要です。
- オペレーターは、管理パネルで RPC ノードに `purpose: manual_verify` というタグを付与することで、検証トラフィックとスキャントラフィックを分離できるようになりました。

### API の変更点 {#api-changes-8}

- `POST /api/admin/v1/order/update-trade-status` および `POST /payments/gmpay/v1/pay/submit-hash` は、手動でのハッシュ送信のための `tx_hash` パラメータを受け付けます。ハッシュはステータス変更の前に、ブロックチェーン上で検証されます。
- RPC ノードの作成・更新 API に `purpose` が追加されました。値は `general`、`manual_verify`、`both` のいずれかで、既定値は `general` です。

### 参照元 {#evidence-used-8}

- GitHub リリース `v1.0.3`
- PR `#81` (開発の統合)
- コミット：`c69b0d6` (RPC 用の分離)、`13c81ee` (暗号化された取引ID)、`fca75a9` (レジストラのハッシュ送信)、`b70995f` (ダッシュボードのSQL方言の修正)、`0d97237` (README の更新)、`7fcb7b3` (決済APIのドキュメント
- ファイル: `src/model/mdb/rpc_node.go`, `src/model/data/rpc_node_data.go`, `src/controller/admin/rpc_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data_stats.go`, `src/controller/comm/pay_controller.go`, `README.md`


## v1.0.2 {#v1-0-2}

- リリースタグ: `v1.0.2`
- 公開日時: `2026-05-22T15:16:34Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.1...v1.0.2`

### ユーザー向けの変更点 {#user-visible-changes-9}

- 管理 API は従来の `Bearer <token>` に加え、`Authorization` ヘッダーに JWT を直接渡す形式（`Bearer ` の接頭辞なし）にも対応しました。トークンをそのまま送るクライアントでも、この形式が原因の認証エラーは発生しません。
- EVM ERC20 の送金スキャンが、注文作成前に到着した送金をスキップすることで、古いブロックチェーンイベントによる誤った支払いとのマッチングを排除します。
- OkPayによる注文完了後に、通知が正しく送信されるようになりました。
- ソラナの署名処理が、一時的なエラー発生時に自動で再試行されるようになりました。注文のマッチングと支払い処理が完全に完了した後にのみ、署名が処理されたとマークされるため、一時的なエラーによる支払い拒否が、もう黙って発生しなくなります。
- レート設定が、複数の通貨に対する強制的なレートリストをサポートするようになり、オペレーターは複数の通貨のレートを同時に固定できるようになりました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-9}

- 新しい環境変数は不要です。
- 多通貨の強制換率機能を使用する場合、以前は単一の強制USDT換率を使用していた場合は、管理画面の設定で換率の構成を更新する必要があるかもしれません。

### API の変更点 {#api-changes-9}

- 管理 API の JWT ミドルウェアは、`Authorization: Bearer <token>` と、トークンをそのまま渡す `Authorization: <token>` の両方に対応しました。
- 新しい公共ルートは追加も削除もありませんでした。

### 参照元 {#evidence-used-9}

- GitHub リリース `v1.0.2`
- PR `#80` (開発の統合)
- コミット: `f4ef71b3`, `4b4701f5`, `449d22a4`, `dec1b97b`, `8a486116`, `2a00a033`
- 変更：Admin JWT ミドルウェア、EVM ERC20 ブロックリスナー、OkPay 通知ハンドラー、Solana 署名再試行ロジック、レート設定モデル


## v1.0.1 {#v1-0-1}

- リリースタグ: `v1.0.1`
- 公開日時: `2026-05-21T11:40:39Z`
- 公式リリースノート: `feat: expose build version in public config — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.0...v1.0.1`

### ユーザー向けの変更点 {#user-visible-changes-10}

- `GET /payments/gmpay/v1/config` のレスポンスに、実行中のサーバービルドを示す `version` フィールド（例: `"version": "v1.0.1"`）が追加されました。
- 削除された設定の記録が、upsertによって復元されるようになり、以前の削除後に、設定の変更が正しく反映されるように改善されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-10}

- Dockerイメージの公開は、`v*` タグへのプッシュのみに制限されています。バージョンタグのないビルドは、コンテナレジストリへの公開はなくなりました。
- コンパイル時に、DockerとGoReleaserによるビルドによってバージョンが組み込まれるため、API応答で報告されるバージョンは、リリースタグと一致します。

### API の変更点 {#api-changes-10}

- `GET /payments/gmpay/v1/config` の応答に、「`version`」（文字列）が追加され、サーバーのビルドバージョンを反映しています。

### 参照元 {#evidence-used-10}

- GitHub リリース `v1.0.1`
- PR `#72`: 機能を実装：公開設定におけるビルドバージョンを明示
- コミット: `85b81e66`, `09642d4c`, `c19a7e5f`
- ファイル: `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/data/settings_data.go`, `.github/workflows/docker-alpine.yml`, `src/.goreleaser.yaml`

## v1.0.0 {#v1-0-0}

- リリースタグ: `v1.0.0`
- 公開日時: `2026-05-20T16:09:00Z`
- 公式リリースノート: `feat: verify manual mark-paid payments — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.7...v1.0.0`

### ユーザー向けの変更点 {#user-visible-changes-11}

- 管理者マニュアル：支払い処理は、現在、注文を支払いとしてマークする前に、オンチェーンでの検証を実行します。取引ハッシュがチェーン上で検証され、ステータス変更が承認される前に確認されます。
- 検証のための確認項目として、受取アドレス、トークンコントラクトアドレス、支払い金額、確認回数、および取引タイムスタンプを確認することで、誤検知を防ぐ。
- 同一のトランザクションハッシュは拒否されます。つまり、同じオンチェーンのトランザクションを複数の注文を完了済みにすることはできません。
- オンチェーンで作成されていない注文は、手動での確認プロセスから除外されます（オフチェーンの注文タイプは認められません）。
- `supported_assets` のレスポンスに、既存の `network` キーに加えて、`display_name` フィールドが追加されました。これにより、フロントエンドは、基本的なネットワーク識別子を変更することなく、人間が理解しやすいチェーン名を表示することが容易になります。
- サポートされている資産リストにおいて、BSCネットワークキーは `bsc` から `binance` に変更されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-11}

- 新しい環境変数は不要です。
- Dockerイメージの構成やdocker-composeの設定は変更しません。

### API の変更点 {#api-changes-11}

- 管理者による支払いエンドポイントは、有効な `tx_hash` パラメータを必要とし、リクエストを受け入れる前に、オンチェーンでの検証を行います。無効な、または重複したハッシュの場合、エラーメッセージを返します。
- `GET /payments/gmpay/v1/config` の対応資産の各項目に `display_name` が追加されました。
- BSCネットワークの評価対象資産の範囲が、`bsc` から `binance` に変更されました。

### 参照元 {#evidence-used-11}

- GitHub リリース `v1.0.0`
- PR `#70`: 修正: 手動で支払われた支払い内容の確認
- コミット: `049a15c`
- ファイル: `src/controller/admin/order_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`

## v0.9.7 {#v0-9-7}

- リリースタグ: `v0.9.7`
- 公開日時: `2026-05-13T09:01:26Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.6...v0.9.7`

### ユーザー向けの変更点 {#user-visible-changes-12}

- `README.zh-CN.md` は削除されました。現在、`README.md` が唯一のメインの README ファイルとなり、ドキュメントを単一のエントリポイントに統合しています。
- フロントエンド管理用アセット（サービスワーカーのプリキャッシュマニフェストと、すべてのバンドルされたJSチャンク）を、更新されたコンテンツハッシュで再構築しました。これにより、以前に管理パネルを読み込んだユーザーにおける、古いキャッシュの問題を解決しました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-12}

- 新しい環境変数はありませんでした。
- 実行時の動作は変わりません — これは、フロントエンドの資産の更新と、ドキュメントの整理のみを目的としています。

### API の変更点 {#api-changes-12}

- API 関連のルートは追加、削除、または変更されていません。

### 参照元 {#evidence-used-12}

- GitHub リリース `v0.9.7`
- 差分の比較 `v0.9.6...v0.9.7`
- コミット: `52b171b`, `4a69b7c`, `b0093c4`, `864eb59`
- ファイル: `README.md`, `README.zh-CN.md`, `src/www/sw.js`, `src/www/index.html`, `src/www/assets/*`

## v0.9.6 {#v0-9-6}

- リリースタグ: `v0.9.6`
- 公開日時: `2026-05-11T10:09:43Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.5...v0.9.6`

### ユーザー向けの変更点 {#user-visible-changes-13}

- 初回実行のブートストラップが、初期の管理者情報とコンソールに出力されるようになり、データベースを調査しなくても、初回ログインを簡単に見つけられるようになりました。
- 管理画面の外観設定で `background_color` と `background_image_url` を指定して、決済画面の背景を変更できるようになりました。
- 支払い金額の精度は、現在設定可能になりました。オペレーターは、支払い金額を生成する際に適用される小数点以下の桁数を設定できます。
- ブロックリスナーにおいて、TRONチェーントークンの解決が動的になったため、起動時にトークンコントラクトのアドレスをハードコードする必要がなくなりました。
- `README.md`は、簡体字のメインのREADMEファイルとして変更されました。英語の読者向けには、別個の`README.en.md`が存在します。`README.zh-CN.md`は、後続のコミット（4a69b7c8）で削除されました。
- `plugins/` フォルダと、同梱されている `dujiaoka` プラグインのサンプルは、リポジトリから削除されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-13}

- 新しい環境変数は不要です。
- このREADMEの再構成は、ドキュメントに関するものであり、実行時の動作には影響しません。

### API の変更点 {#api-changes-13}

- `GET /payments/gmpay/v1/config` のレスポンスに、外観設定の `background_color` と `background_image_url` が追加されました。
- `GET /payments/gmpay/v1/config` のレスポンスに、決済設定の `payment_amount_precision` が追加されました。
- 経路は追加も削除もありません。

### 参照元 {#evidence-used-13}

- GitHub リリース `v0.9.6`
- 差分の比較 `v0.9.5...v0.9.6`
- コミット: `1a35cab`, `2d546e3`, `a8a3b86`, `3e0be9b`, `7c9e3e1`, `84972ea`, `1c805ed`, `8d2ddbd`, `07d1d83`, `7a905ba`, `4dc1ba8`, `4a69b7c`
- ファイル: `src/bootstrap/bootstrap.go`, `src/controller/admin/settings_controller.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/task/listen_trc20_block.go`

## v0.9.5 {#v0-9-5}

- リリースタグ: `v0.9.5`
- 公開日時: `2026-05-09T13:51:58Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.4...v0.9.5`

### ユーザー向けの変更点 {#user-visible-changes-14}

- ホストされたチェックアウトが、既存のオンチェーンネットワーク選択フローに加えて、`okpay`の決済連携パスも提供されます。
- 決済フローは、チェックアウトの応答で `payment_url` を返すことができるようになりました。これにより、OkPayなどのサードパーティ決済における子注文など、現地のレジ情報のみに依存せず、明確なリダイレクト先を持つことが可能になります。
- 公開設定の応答が、現在、ウェブサイトを面向したレジのメタデータ（名前、ロゴURL、ウェブサイトタイトル、およびサポートリンク）を公開しています。これにより、フロントエンドのブランディング/設定の表示が、より柔軟になり、ハードコーディングが少なくなります。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-14}

- この例の環境ファイルは、古い PostgreSQL および MySQL の設定ブロックを削除しました。 現在の公開されている設定のガイダンスは、データベースバックエンドの使用ではなく、SQLite に焦点を当てた実行時のデフォルト設定を反映しています。
- Dockerfile のクリーンアップにより、現在のアクティブなフロントエンドのデリバリーパスと一致しなくなった、冗長な `static` コピーのステップが削除されました。
- README のメンテナンスでは、ロゴや免責事項の内容も更新しましたが、これらは上記の実実行/支払い変更の二次的なものです。

### API の変更点 {#api-changes-14}

- Public GMPay フロントエンドの設定は、以前のスタンドアロンの資産参照ではなく、`GET /payments/gmpay/v1/config` から取得されるようになりました。
- `GET /payments/gmpay/v1/config` にアクセスすると、サイトのブランディング、EPay のデフォルト設定、および OkPay の公開設定フィールドとともに、`supported_assets` が返されます。
- OkPay のコールバック登録を追加: `POST /payments/okpay/v1/notify`
- `POST /pay/switch-network` は、オンチェーンのネットワーク値に加えて、`network=okpay` も記録/適用します。
- チェックアウト時のレスポンスに、`payment_url` が含まれるようになりました。

### 参照元 {#evidence-used-14}

- GitHub リリース `v0.9.5`
- 差分の比較 `v0.9.4...v0.9.5`
- コミット `377176a`, `3623a54`, `51ad344`, `ff157c3`, `1a35cab`, `2d546e3`
- 該当するソースファイル: `src/route/router.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/response/order_response.go`, `src/model/response/support_response.go`, `src/.env.example`

## v0.9.4 {#v0-9-4}

- リリースタグ: `v0.9.4`
- 公開日時: `2026-04-28T16:37:20Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### ユーザー向けの変更点 {#user-visible-changes-15}

- 現在のソース履歴において、TRONの支払いスキャンがブロックベースのリスナーパスに戻りました。そのため、以前の新しいTRONフローの一時的なリバートは、もう有効な上流の状態ではありません。
- 支払い処理のフォローアップ機能が、支払い完了後に注文通知の動作を調整しました。
- ホストされたチェックアウトへのアクセスが、`/pay/checkout-counter/:trade_id` から直接、SPA（シングルページアプリケーション）の会計フローにリダイレクトされるようになりました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-15}

- ホストされたチェックアウトフローは、以前の専用の静的アセットパスである `static/` ではなく、SPAベースの `www/` へのデリバリーパスを使用しています。
- Dockerイメージは、その後、不要な`static`のコピー手順を削除することで、現在のSPAチェックアウト配信パスに合致しないものを整理しました。

### API の変更点 {#api-changes-15}

- `GET /pay/checkout-counter/:trade_id` は、現金のSPA（ユーザーインターフェース）へのリダイレクトとして機能します。
- 現在の情報源は、新しいSPAチェックアウトフローで使用されるJSONレスポンスエンドポイントとして、`GET /pay/checkout-counter-resp/:trade_id` を示しています。
- このリリースでは、新しい商取引の署名フィールドや、コールバック契約の導入は行われていません。

### 参照元 {#evidence-used-15}

- GitHub リリース `v0.9.4`
- 差分の比較 `v0.9.3...v0.9.4`
- コミット: `9e885d8`, `de9c45a`, `96ea748`, `51a2acc`, `d17d212`, `9c533a7`, `ff68279`
- 上流の問題 `#55`：Docker デプロイメントにおけるチェックアウトファイルの欠如

## v0.9.3 {#v0-9-3}

- リリースタグ: `v0.9.3`
- 公開日時: `2026-04-25T10:50:34Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### ユーザー向けの変更点 {#user-visible-changes-16}

- インストール後にルートを設定を修正したため、`GET /` は常にSPAを配信し、バックエンドのルートハンドラによってインターセプトされるのを防ぐようになりました。
- インストールモードは、依然としてルートパスを`/install`にリダイレクトするため、初回設定の流れはそのままに維持されます。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-16}

- このリリースでは、新しいパブリックな環境変数やデプロイメントフラグは公開されていません。
- 主な実行ルートの動作が調整され、インストールされたインスタンスがウェブアプリに、より安定して表示されるようになりました。

### API の変更点 {#api-changes-16}

- このリリースでは、新しいパブリックAPIのルートは導入されていません。
- バックエンドのルーティングが、`Any("/")` スタイルの汎用的なハンドラーから、`POST("/")` のバックエンドハンドラーに変更されました。これにより、通常のブラウザの `GET /` へのアクセスは、SPA 側で処理されるようになりました。

### 参照元 {#evidence-used-16}

- GitHub リリース `v0.9.3`
- 差分の比較 `v0.9.2...v0.9.3`
- `95879e3`を含むコミット、マージタグ `67263da`

## v0.9.2 {#v0-9-2}

- リリースタグ: `v0.9.2`
- 公開日時: `2026-04-24T16:14:34Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### ユーザー向けの変更点 {#user-visible-changes-17}

- 管理レートの設定が、強制的にUSDTのレートを設定できるように変更されました。
- Docker のデプロイ例は、現在利用されている `gmwallet/epusdt:latest` イメージを参照した状態のままです。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-17}

- リリースノートには、新しい公開環境変数の情報が明示的に記載されていません。
- 既存のDockerアップグレード例は、引き続き `gmwallet/epusdt:latest` を使用しています。

### API の変更点 {#api-changes-17}

- このリリースノートや差分比較には、新しいパブリックAPIのルートは表示されていません。

### 参照元 {#evidence-used-17}

- GitHub リリース `v0.9.2`
- 差分の比較 `v0.9.1...v0.9.2`
- `dd1bf70` および `143bc84` などのコミット

## v0.9.1 {#v0-9-1}

- リリースタグ: `v0.9.1`
- 公開日時: `2026-04-22T18:29:39Z`

### ユーザー向けの変更点 {#user-visible-changes-18}

- 組み込みのインストールウィザード：初回実行時に有効な設定ファイルがない場合でも、Webベースのセットアップフローが開始されます。現在の形式では、`app_name`、`app_uri`、バインドアドレス/ポート、実行パス、ログパス、有効期限、およびコールバック再試行設定に焦点を当てています。
- Dockerイメージは、`docker pull gmwallet/epusdt:latest` で直接取得できるようになりました。初期のデプロイには、`.env` のマウントは不要です。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-18}

- 初めて送信すると、インストールウィザードは自動的に `.env` ファイルを作成します。その後、再起動すると、ウィザードをスキップして通常モードで起動します。
- `docker-compose.yaml` の `.env` へのボリュームマウントは、オプションとなりました。 初回の、シンプルなウィザードベースでの実行には、この設定を省略してください。

### API の変更点 {#api-changes-18}

- このリリースには、新しいパブリックAPIのルートは含まれていません。

## v0.9.0 {#v0-9-0}

- リリースタグ: `v0.9.0`
- 公開日時: `2026-04-21T20:23:33Z`
- 公式リリースノート: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### ユーザー向けの変更点 {#user-visible-changes-19}

- APIキー、チェーン、チェーントークン、ウォレット、注文、RPCノード、設定、通知、およびダッシュボードの統計を管理するための、包括的な管理者パネルを追加しました。
- マルチチェーン対応がさらに強化され、より広範なEVMリスナーの対応に加え、管理者向けのチェーン/トークン管理機能が追加されました。
- テレグラムの通知チャンネルが追加され、設定のアップデートとの連携が導入されました。
- 初回設定を簡単にするための、新規導入のインストール手順が導入されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-19}

- `.env.example` の設定フラグのデフォルト値を、初回設定フローでは有効にしました。
- 実行時間には、RPCノードの健康状態の確認と、自動フェイルオーバー機能が追加されました。
- サーバー実行時に、静的な管理用アセットが追加されました。
- 管理ユーザー、APIキー、チェーン、チェーントークン、RPCノード、設定、および通知チャンネル向けの、新しい永続性モデルが導入されました。

### API の変更点 {#api-changes-19}

- 認証、APIキー、チェーン、チェーントークン、ウォレット、注文、RPCノード、設定、ダッシュボードの統計情報、および通知を含む、包括的な管理REST APIの機能を追加しました。
- JWTベースの管理者認証と、APIキー認証ミドルウェアを追加しました。
- 支払い、サポート対象資産、ウォレット、および注文に関連する応答/リクエストの構造が、管理業務の範囲内で拡張されました。

### 参照元 {#evidence-used-18}

- GitHub リリース `v0.9.0`
- 差分の比較 `v0.0.8...v0.9.0`
- `6bb47d4`, `5edc9dc`, `b499bc0`, `6ea5637`, `9163943` へのコミット

## v0.0.8 {#v0-0-8}

- リリースタグ: `v0.0.8`
- 公開日時: `2026-04-15T10:44:56Z`
- 公式リリースノート: `- Enable polygon,plasma supports`

### ユーザー向けの変更点 {#user-visible-changes-20}

- `polygon` および `plasma` ネットワークのサポートを追加
- 決済ページネットワーク選択の行動が調整されました。
- EVMウォレットのアドレス保存ロジックが修正されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-20}

- リリースノートや差分比較には、新しい環境変数は見られませんでした。

### API の変更点 {#api-changes-20}

- 公式リリースノートには、新しいパブリックAPIルートが明確に記載されていません。
- `v0.0.7` の開発ワークフローにおいて、ネットワーク関連の動作は継続しています。

### 参照元 {#evidence-used-19}

- GitHub リリース `v0.0.8`
- 差分の比較 `v0.0.7...v0.0.8`
- `f7c5f67`、`097c716`を含むコミット

## v0.0.7 {#v0-0-7}

- リリースタグ: `v0.0.7`
- 公開日時: `2026-04-15T06:00:55Z`
- 公式リリースノート: `suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### ユーザー向けの変更点 {#user-visible-changes-21}

- `bsc`、`polygon`、および `plasma` のサポートを追加しました。
- EPayに対応したフォームのパラメータが追加され、より幅広い統合との互換性が実現されました。
- 支払いワークフローにおいて、テレグラムでのやり取りや、関連する支払い処理が更新されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-21}

- 新しいサポートネットワークでの作業において、ソース履歴に複数のEVMリスニングパスが追加されました。
- 公式リリースノートに、明確に記載された新しい`.env`変数は発表されていません。

### API の変更点 {#api-changes-21}

- サポートされているチェーン/アセットに関連するAPIの機能実装、ソース履歴に反映
- ルーターのロジックを更新し、EPayに対応した送信フローにおいて、`GET` と `POST` の両方のフォームをサポートするようにしました。

### 参照元 {#evidence-used-20}

- GitHub リリース `v0.0.7`
- 差分の比較 `v0.0.6...v0.0.7`
- `9c003fb`, `8cd816c`, `786c5e8`, `70f8ed4` へのコミット

## v0.0.6 {#v0-0-6}

- リリースタグ: `v0.0.6`
- 公開日時: `2026-04-12T20:06:08Z`
- 公式リリースノート：`v0.0.5...v0.0.6` の比較

### ユーザー向けの変更点 {#user-visible-changes-22}

- ホストされたチェックアウトUIを、2段階の支払いフローへと再設計しました。
- 複数のネットワークでの決済方法の切り替え機能が追加されました。
- ソラナの決済スキャン機能が、`USDT`と`USDC`に対応しました。
- Ethereum の ERC-20 支払いをスキャンする機能が `USDT` と `USDC` に追加されました。
- Telegramの支払い通知に、ネットワーク情報が追加されました。
- テレグラムウォレットの、複数のネットワークのアドレス検証が改善されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-22}

- 追加: `solana_rpc_url`
- 追加: `ethereum_ws_url`
- 追加: `epay_pid`
- 追加: `epay_key`
- 注文のロックと照合時に `network` が考慮されるようになりました。

### API の変更点 {#api-changes-22}

- `/payments/gmpay/v1/wallet/*` 以下のウォレット管理エンドポイントを追加しました。
- 追加: `POST /pay/switch-network`
- EPayに対応したルートを追加: `GET /payments/epay/v1/order/create-transaction/submit.php`
- チェックアウト時の応答に、「`is_selected`」という項目が追加されました。
- Create-orderフローは、オプションで`name`（名前）と`payment_type`（支払い方法）を受け付けます。
- 現在使用されている識別子はすべて小文字で表記されており、`tron`、`solana`、および`ethereum`などです。

### 参照元 {#evidence-used-21}

- GitHub リリース `v0.0.6`
- 差分の比較 `v0.0.5...v0.0.6`
- `3f071e6`, `32ca778`, `5e4d5df` などのコミット

## v0.0.5 {#v0-0-5}

- リリースタグ: `v0.0.5`
- 公開日時: `2026-04-03T17:05:30Z`
- 公式リリースノート: `test: fix macOS path assertion and wallet address unique index`

### ユーザー向けの変更点 {#user-visible-changes-23}

- 公式のリリースノートには、主要なエンドユーザー機能に関する記述は一切ありませんでした。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-23}

- 公式のリリースノートから、新しいデプロイ変数は見当たりませんでした。

### API の変更点 {#api-changes-23}

- コードの履歴において、ウォレットアドレスのユニークインデックスの動作が調整されました。

### 参照元 {#evidence-used-22}

- GitHub リリース `v0.0.5`
- 差分の比較 `v0.0.4...v0.0.5`

## v0.0.4 {#v0-0-4}

- リリースタグ: `v0.0.4`
- リリース名: `New UI Update`
- 公開日時: `2026-04-03T16:05:23Z`
- 公式リリースノート: `feat: change payment ui`

### ユーザー向けの変更点 {#user-visible-changes-24}

- 決済UIが更新されました。

### デプロイと設定の変更点 {#deployment-and-configuration-changes-24}

- リリースノートには、デプロイに関わる変更に関する記述はありません。

### API の変更点 {#api-changes-24}

- リリースノートには、API への変更に関する記述はありません。

### 参照元 {#evidence-used-23}

- GitHub リリース `v0.0.4`
- 公式リリースノート本文

## 保守者向けのメモ {#notes-for-maintainers}

今後のリリースにおいては、最も効果的な形式は：

1. ユーザー向けの変更点
2. デプロイメントまたは設定の変更
3. APIまたはスキーマの変更
4. アップデートに関するメモ、または変更点
