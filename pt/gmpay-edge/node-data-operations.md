---
description: "Localize o banco de dados SQLite do GMPay Edge e os objetos privados em um ambiente de implantação (deployment) do Bun, e siga os procedimentos de backup, restauração e migração."
titleTemplate: ":title | GMPay Edge"
---

# Gestão de dados no Bun {#bun-data-operations}

O deployment do Bun mantém seu banco de dados SQLite em `$GMPAY_DATA_DIR/gmpay.sqlite` e os objetos privados no diretório `$GMPAY_DATA_DIR/objects`. Tanto a CLI (interface de linha de comando) quanto o servidor de aplicação são executados utilizando o Bun e seu driver SQLite.

## Backup e restauração {#backup-and-restore}

Pare de executar o contêiner GMPay Edge antes de fazer backup ou restauração, para garantir que o banco de dados e os arquivos de objeto permaneçam no mesmo ponto lógico de tempo.

```bash
GMPAY_DATA_DIR=/srv/gmpay bun run data -- backup --output /srv/backups/gmpay-backup
GMPAY_DATA_DIR=/srv/gmpay-restored bun run data -- restore --input /srv/backups/gmpay-backup
```

A imagem publicada contém o mesmo CLI. Após interromper o serviço, monte um diretório de backup externo e execute:

```bash
docker compose stop gmpay-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmpay-edge bun run data -- backup --output /backups/gmpay-backup
```

O caminho de entrada ou de saída é sempre explícito. As cópias de segurança da saída devem estar fora do diretório de dados. A restauração aceita apenas um novo ou diretório vazio, e nunca sobrescreve um diretório não vazio. O manifesto verifica todos os arquivos; a restauração também executa verificações de integridade, chaves estrangeiras e checksums de migrações.

As cópias de segurança contêm credenciais, dados de usuário, registros de pagamentos e uploads privados. Criptografe-os em repouso, limite o acesso e teste a restauração regularmente.

## Importar exportação do Cloudflare {#import-a-cloudflare-export}

Exporte o D1 como SQL e exporte os objetos R2 para um diretório local, utilizando os caminhos relativos originais dos objetos como base. Em seguida, importe para um novo ou diretório de dados Bun:

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMPAY_DATA_DIR=/srv/gmpay bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` é opcional quando a instância não possui objetos. `--r2-manifest` também é opcional, mas requer `--r2-dir`; utilize-o para preservar os metadados HTTP do R2 e os metadados personalizados. É um objeto JSON, indexado pela chave original do objeto R2.

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

Os campos HTTP suportados são `contentType`, `contentLanguage`, `contentDisposition`, `contentEncoding`, `cacheControl` e um ISO 8601 `cacheExpiry`. Campos não suportados, metadados personalizados não-string e chaves de manifesta sem um objeto exportado correspondente são rejeitados. Sem este “sidecar”, os bytes do objeto e as chaves são importados, mas os metadados R2 não podem ser reconstruídos.

A import verifica se todas as migrações do repositório existem na exportação D1, registra seus checksums para o executador de migração Bun, valida as chaves estrangeiras e converte os caminhos de chaves R2 para o layout de objetos privados criptografados. Ela se recusa a um alvo vazio, portanto, uma importação malsucedida ou repetida não pode sobrescrever uma instância existente.
