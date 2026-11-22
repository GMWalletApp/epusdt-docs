---
title: "Implemente o gateway em Workers ou Bun."
description: "Implemente o GMPay Edge na Cloudflare Workers ou em um host Bun. Compare a configuração em tempo de execução, os requisitos de armazenamento e as verificações de implantação."
titleTemplate: ":title | GMPay Edge"
---

# Implantação {#deployment}

O GMPay Edge suporta dois ciclos de produção:

- **Autohost de Bun/Nitro**: SQLite e um diretório de dados local persistente, utilizando Docker ou uma implantação direta com um gerenciador de serviços.
- **Cloudflare Workers**: D1, KV, R2, Filas e Gatilhos Cronológicos.

Ambos os ambientes de execução expõem as mesmas APIs de comerciantes, o fluxo de checkout, o console de administração, as tarefas em segundo plano e o fluxo `/install`.

## Docker Compose (recomendado) {#docker-compose-recommended}

O pacote público [GHCR](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) suporta `linux/amd64` e `linux/arm64`; não é necessário login em um registro.

Salve o seguinte como `compose.yml`:

```yaml
services:
  gmpay-edge:
    image: ghcr.io/gmwalletapp/gmpay-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMPAY_DATA_DIR: /var/lib/gmpay
    volumes:
      - gmpay-data:/var/lib/gmpay

volumes:
  gmpay-data:
```

Inicie o serviço:

```bash
docker compose pull
docker compose up -d
```

A tag `latest` aponta para a versão estável mais recente. Para tornar a implantação reproduzível, fixe uma versão completa, como `1.0.0`.

`GMPAY_DATA_DIR` contém SQLite, arquivos carregados, objetos privados, estado da fila e todos os outros dados de execução. É importante preservar e fazer backup do volume `gmpay-data` ao atualizar ou recriar o container.

Leia [Operações com dados Bun](./node-data-operations.md) antes de fazer backup, restaurar ou migrar um deployment.

Verifique o serviço e examine os logs utilizando:

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

Para atualizar, mantendo o volume de dados:

```bash
docker compose pull
docker compose up -d
```

### Comando Docker {#docker-command}

Se o Compose não estiver disponível, execute o container diretamente.

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Implantação no Bun a partir do código-fonte {#bun-source-deployment}

Você pode executar o servidor de produção diretamente a partir do código-fonte, sem utilizar o Docker. Instale o Git e o Bun 1.3 ou superior; o Node.js é necessário apenas se você optar por usar o PM2 como gerenciador de processos.

```bash
git clone https://github.com/GMWalletApp/gmpay-edge.git
cd gmpay-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -o "$USER" -g "$USER" /var/lib/gmpay
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  bun run start:bun
```

O último comando é executado em primeiro plano. Mantenha-o sob systemd, Supervisor, PM2 ou outro gerenciador de serviços em produção. Preserve e faça backup do diretório `GMPAY_DATA_DIR` da mesma forma que você preservaria um volume Docker.

### PM2 {#pm2}

O PM2 em si requer Node.js e npm, mas o GMPay Edge continua funcionando com Bun. Mantenha a opção explícita `--interpreter bun` para que o PM2 não tente iniciar o servidor gerado com Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

Execute o comando impresso pelo `pm2 startup`, e depois execute novamente o comando `pm2 save`. Utilize `pm2 logs gmpay-edge` e `curl --fail http://127.0.0.1:3000/healthz` para verificar se o serviço está funcionando.

Para atualizar um deployment de origem:

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Botão de enviar/publicar {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

As configurações de fluxo guiado fornecem os vínculos declarados no `wrangler.jsonc`, aplicam migrações D1 e constroem o Worker.

- Comando de compilação: `bun run build`
- Comando de implantação: `wrangler deploy`

Após a implantação, abra `/install` no URL do Worker para inicializar a instância.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

Se o D1 precisar ser preparado manualmente:

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

Não inclua o ID do banco de dados gerado. O hook de implantação cria ou reutiliza os recursos nomeados D1, KV, R2 e Queue, aplica a linha de base D1 e constrói o Worker antes da publicação.

## Desenvolvimento local {#local-development}

Requisitos:

- Bun 1.3 ou superior
- Um ambiente local, suportado pelo Wrangler para o ambiente de desenvolvimento.

```bash
bun install
bun run dev
```

`bun run dev` executa as migrações pendentes no banco de dados local `gmpay-edge` D1 e inicia a aplicação em `http://localhost:3000`.

## Primeira instalação {#first-install}

Após o Docker ou Bun iniciar, abra `http://your-host:3000/install`. Após a implantação dos Workers, abra `/install` no URL do Worker. Verifique o endereço público detectado e os Hosts Permitidos antes de criar o primeiro usuário raiz.

A instalação cria:

- O primeiro usuário.
- O papel protegido `root`.
- Segredos de execução.
- Pagamentos em atraso.
- Comandos públicos do Telegram e configurações padrão do Telegram.

Não cria um Bot do Telegram ou chama o Telegram. As configurações de segurança e e-mail são gerenciadas na interface de administração, e não como variáveis de ambiente do ambiente de contêiner.
