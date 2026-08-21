# Node 数据操作

Node 运行时将权威 SQLite 数据库保存在 `$GMSHOP_DATA_DIR/gmshop.sqlite`，私有对象也位于同一数据目录。请使用维护中的 `bun run data -- …` CLI，不要复制正在运行的 SQLite 文件。

## 备份与恢复

备份或恢复前先停止容器，确保数据库、私有对象和持久队列状态处于同一逻辑时间点。

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

备份输出必须位于数据目录之外。恢复只接受全新或空目标，绝不会覆盖已有实例。Manifest 会校验每个文件；恢复还会检查 SQLite 完整性、外键和不可变迁移校验和。

发布镜像包含相同 CLI：

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

备份中包含凭据、用户记录、订单、预置库存、私有下载和自动化产物。应加密保存、限制访问，并定期测试恢复。

CLI 使用 `$GMSHOP_DATA_DIR/.maintenance.lock`。如果主机崩溃后遗留锁文件，请先确认没有服务器或数据命令正在使用该目录，再仅删除过期锁文件。

## 导入 Cloudflare 导出数据

将 D1 导出为 SQL，并把 R2 对象导出到相对路径与原始键一致的本地目录。只能导入到全新或空的 Node 数据目录：

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

实例没有对象时可省略 `--r2-dir`。`--r2-manifest` 也可省略，但使用时必须同时提供 `--r2-dir`；它用于保留 R2 HTTP 和自定义元数据。

导入程序会验证仓库迁移、SQLite 完整性和外键，再把 R2 键转换为私有哈希对象布局。它会拒绝不安全路径、未知元数据、缺少对应对象的元数据和非空目标；不提供覆盖模式或双向同步。
