# Node Data Operations

The Node runtime keeps its authoritative SQLite database at `$GMSHOP_DATA_DIR/gmshop.sqlite` and private objects under the same data directory. Use the maintained `bun run data -- …` CLI instead of copying a live SQLite file.

## Backup and restore

Stop the container before backup or restore so the database, private objects, and durable Queue state stay at one logical point in time.

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

Backup output must be outside the data directory. Restore accepts only a new or empty target and never overwrites an existing instance. The manifest verifies every file; restore also checks SQLite integrity, foreign keys, and immutable migration checksums.

The published image includes the same CLI:

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

Backups contain credentials, customer records, orders, preset stock, private downloads, and automation artifacts. Encrypt them at rest, restrict access, and test restoration regularly.

The CLI uses `$GMSHOP_DATA_DIR/.maintenance.lock`. If a crash leaves the lock behind, first verify that no server or data command is using the directory, then remove only the stale lock file.

## Import a Cloudflare export

Export D1 as SQL and R2 objects into a local directory whose relative paths match the original keys. Import only into a new or empty Node data directory:

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` is optional when the instance has no objects. `--r2-manifest` is also optional but requires `--r2-dir`; it preserves R2 HTTP and custom metadata.

The importer validates repository migrations, SQLite integrity, and foreign keys, then converts R2 keys into the private hashed-object layout. It rejects unsafe paths, unknown metadata, metadata without an object, and non-empty targets. There is no overwrite mode or bidirectional synchronization.
