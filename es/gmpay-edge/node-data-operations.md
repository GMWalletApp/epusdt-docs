---
description: "Localice la base de datos SQLite de GMPay Edge y los objetos privados en un despliegue de Bun, y siga los procedimientos de copia de seguridad, restauración y migración."
titleTemplate: ":title | GMPay Edge"
---

# Gestión de datos en Bun {#bun-data-operations}

La implementación de Bun mantiene su base de datos SQLite en `$GMPAY_DATA_DIR/gmpay.sqlite` y los objetos privados en `$GMPAY_DATA_DIR/objects`. Tanto la CLI mantenida como el servidor de aplicaciones se ejecutan con Bun y su controlador SQLite.

## Copia de seguridad y restauración {#backup-and-restore}

Detenga el contenedor GMPay Edge antes de realizar una copia de seguridad o restauración, para mantener la base de datos y los archivos de objetos en el mismo punto lógico en el tiempo.

```bash
GMPAY_DATA_DIR=/srv/gmpay bun run data -- backup --output /srv/backups/gmpay-backup
GMPAY_DATA_DIR=/srv/gmpay-restored bun run data -- restore --input /srv/backups/gmpay-backup
```

La imagen publicada contiene el mismo CLI. Después de detener el servicio, monte un directorio de copia de seguridad externo y ejecute:

```bash
docker compose stop gmpay-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmpay-edge bun run data -- backup --output /backups/gmpay-backup
```

La ruta de entrada o salida siempre es explícita. La copia de seguridad de la salida debe estar fuera del directorio de datos. La restauración solo acepta un nuevo o directorio vacío, y nunca sobrescribe un directorio no vacío. El manifiesto verifica cada archivo; la restauración también ejecuta comprobaciones de integridad, claves foráneas y checksum de migraciones de SQLite.

Las copias de seguridad contienen credenciales, datos de usuarios, registros de pagos y subidas privadas. Cifralas mientras están en reposo, limita el acceso y prueba la restauración regularmente.

## Importar exportación de Cloudflare {#import-a-cloudflare-export}

Exporte el D1 como SQL y exporte los objetos R2 a un directorio local cuyas rutas relativas sean las claves originales de los objetos. Luego, importe estos a un nuevo o directorio de datos vacío de Bun.

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMPAY_DATA_DIR=/srv/gmpay bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` es opcional cuando la instancia no tiene objetos. `--r2-manifest` también es opcional, pero requiere `--r2-dir`; se utiliza para conservar los metadatos HTTP de R2 y los metadatos personalizados. Es un objeto JSON con claves basadas en la clave original del objeto R2.

```json
{
  "evidence/receipt.txt": {
    "httpMetadata": {
      "contentType": "text/plain; charset=utf-8",
      "cacheExpiry": "2026-09-01T00:00:00.000Z"
    },
    "customMetadata": { "orderId": "order-123" }
  }
}
```

Los campos HTTP admitidos son `contentType`, `contentLanguage`, `contentDisposition`, `contentEncoding`, `cacheControl` y `cacheExpiry` en formato ISO 8601. Se rechazan los campos desconocidos, los metadatos personalizados que no sean cadenas y las claves del manifiesto sin un objeto exportado correspondiente. Sin este archivo auxiliar se importan los bytes y las claves de los objetos, pero no se pueden reconstruir los metadatos de R2.

La importación verifica que todas las migraciones del repositorio existan en la exportación D1, registra sus checksums para el ejecutor de migración Bun, valida las claves foráneas y convierte las rutas de clave R2 en el esquema de objeto privado hasheado. Se niega un objetivo vacío, por lo que una importación fallida o repetida no puede sobrescribir una instancia existente.
