---
description: "Faça backup e restaure os dados SQLite do GMShop Edge e os objetos privados no Bun, e revise as rotas de importação do Cloudflare D1 e R2."
titleTemplate: ":title | GMShop Edge"
---

# Gestão de dados no Bun {#bun-data-operations}

O runtime do Bun mantém seu banco de dados SQLite autoritário em `$GMSHOP_DATA_DIR/gmshop.sqlite` e objetos privados no mesmo diretório de dados. Utilize o comando CLI `bun run data -- …` (mantido) em vez de copiar um arquivo SQLite ativo.

## Backup e restauração {#backup-and-restore}

Pare de executar o contêiner antes de fazer backup ou restauração, para garantir que o banco de dados, objetos privados e o estado da fila durável permaneçam em um único ponto de tempo.

```bash
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- backup \
  --output /srv/backups/gmshop-2026-08-21

GMSHOP_DATA_DIR=/srv/gmshop-restored bun run data -- restore \
  --input /srv/backups/gmshop-2026-08-21
```

A cópia de segurança (backup) aceita apenas um novo ou vazio, e não sobrescreve uma instância existente. O manifesto verifica cada arquivo, e a restauração também verifica a integridade do SQLite, as chaves estrangeiras e os checksums de migrações imutáveis.

A imagem publicada inclui a mesma CLI:

```bash
docker compose stop gmshop-edge
docker compose run --rm --no-deps \
  --volume "$PWD/backups:/backups" \
  gmshop-edge bun run data -- backup --output /backups/gmshop-2026-08-21
```

As cópias de segurança contêm credenciais, registros de clientes, pedidos, estoque pré-definido, downloads privados e artefatos de automação. Criptografe-os em repouso, restrinja o acesso e teste a restauração regularmente.

O CLI utiliza `$GMSHOP_DATA_DIR/.maintenance.lock`. Se uma falha deixar o arquivo de bloqueio, primeiro verifique se nenhum comando de servidor ou dados está utilizando a pasta, e então remova apenas o arquivo de bloqueio obsoleto.

## Importar exportação do Cloudflare {#import-a-cloudflare-export}

Exporte o D1 como objetos SQL e o R2 como objetos para um diretório local, onde os caminhos relativos correspondam às chaves originais. Importe apenas para um novo ou diretório de dados Bun vazio:

```bash
wrangler d1 export DB --remote --output ./d1-export.sql
GMSHOP_DATA_DIR=/srv/gmshop bun run data -- import-cloudflare \
  --d1-sql ./d1-export.sql \
  --r2-dir ./r2-export \
  --r2-manifest ./r2-metadata.json
```

`--r2-dir` é opcional quando a instância não possui objetos. `--r2-manifest` também é opcional, mas requer `--r2-dir`; ele preserva os metadados HTTP do R2 e os metadados personalizados.

O importador valida as migrações do repositório, a integridade do SQLite e as chaves estrangeiras, e, em seguida, converte as chaves R2 para o layout de objetos com hash privado. Ele rejeita caminhos inseguros, metadados desconhecidos, metadados sem um objeto e alvos não vazios. Não há modo de sobrescrever ou sincronização bidirecional.
