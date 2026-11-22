---
description: "Realiza una copia de seguridad y restauración de los datos de GMShop Edge SQLite y los objetos privados en Bun, y revisa las rutas de importación desde Cloudflare D1 y R2."
titleTemplate: ":title | GMShop Edge"
---

# Gestión de datos en Bun {#bun-data-operations}

El entorno de ejecución de Bun mantiene su base de datos SQLite autoritaria en `$GMSHOP_DATA_DIR/gmshop.sqlite` y los objetos privados en el mismo directorio de datos. Utilice el comando CLI de Bun `bun run data -- …` en lugar de copiar un archivo SQLite en vivo.

## Copia de seguridad y restauración {#backup-and-restore}

Detenga el contenedor antes de realizar copias de seguridad o restauraciones, para mantener la base de datos, los objetos privados y el estado de la cola duradera en un único punto de tiempo lógico.

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

La copia de seguridad solo acepta una nueva o vacía, y nunca sobrescribe una instancia existente. El manifiesto verifica cada archivo; la restauración también comprueba la integridad de SQLite, las claves foráneas y los checksums de migraciones inmutables.

La imagen publicada incluye la misma CLI:

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

Las copias de seguridad contienen credenciales, registros de clientes, pedidos, inventario predefinido, descargas privadas y artefactos de automatización. Cifralas mientras están en reposo, restrinja el acceso y prueba la restauración regularmente.

La CLI utiliza `$GMSHOP_DATA_DIR/.maintenance.lock`. Si un fallo provoca que el archivo de bloqueo quede atrás, primero verifica que ninguna instrucción de servidor o datos esté utilizando el directorio, y luego elimina únicamente el archivo de bloqueo obsoleto.

## Importar exportación de Cloudflare {#import-a-cloudflare-export}

Exporta el D1 como objetos SQL y el R2 como objetos en un directorio local, donde las rutas relativas coincidan con las claves originales. Importa únicamente en un nuevo o directorio de datos vacío de Bun:

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` es opcional cuando la instancia no tiene objetos. `--r2-manifest` también es opcional, pero requiere `--r2-dir`; este preserva los metadatos HTTP de R2 y los metadatos personalizados.

El importador valida las migraciones de repositorio, la integridad de SQLite y las claves foráneas, y luego convierte las claves R2 en el esquema de objetos hasheados privados. Rechaza rutas inseguras, metadatos desconocidos, metadatos sin un objeto asociado, y objetivos no vacíos. No hay modo de sobrescribir ni sincronización bidireccional.
