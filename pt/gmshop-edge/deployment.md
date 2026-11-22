---
title: "Implemente a loja no Workers ou no Bun."
description: "Implemente o GMShop Edge nos Workers ou Bun, e configure o armazenamento, as filas e as tarefas em segundo plano para a loja de produtos digitais."
titleTemplate: ":title | GMShop Edge"
---

# Implantação {#deployment}

O GMShop Edge suporta dois ciclos de produção:

- **Autohostagem de Bun/Nitro**: SQLite, objetos locais privados, uma fila local durável e um diretório de dados persistente, utilizando Docker ou um método de implantação com um gerenciador de serviços.
- **Cloudflare Workers**: D1, KV, R2, Filas, Gatilhos Cron, e opção para enviar e-mail.

Ambos os ambientes de execução expõem a mesma loja, contas de clientes, processo de checkout, gerenciamento de pedidos, console de administração, API de fornecedores, integração com Telegram e o fluxo `/install`.

## Docker Compose {#docker-compose}

O pacote público [GHCR](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) suporta `linux/amd64` e `linux/arm64`. Salve o seguinte em `compose.yml`:

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMSHOP_DATA_DIR: /var/lib/gmshop
    volumes:
      - gmshop-data:/var/lib/gmshop

volumes:
  gmshop-data:
```

Inicie e verifique o serviço:

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

O container é executado como um usuário não-root. O diretório `GMSHOP_DATA_DIR` contém `gmshop.sqlite`, objetos privados, estado durável da fila e todos os dados de execução. Faça backup e preserve o volume `gmshop-data` sempre que o container for atualizado ou recriado.

`GMSHOP_DATA_DIR` é a única variável de ambiente Bun pública. Configure as configurações de Origin, Hosts Permitidos, e-mail, pagamento, fornecedor, Telegram e automação através de `/install` ou `/admin`.

O Bun é executado em uma única instância; a implantação em réplica múltipla e o armazenamento em rede compartilhada não são suportados. Leia [operações de dados do Bun](./node-data-operations.md) antes de atualizar, restaurar ou migrar uma implantação.

## Implantação no Bun a partir do código-fonte {#bun-source-deployment}

Você pode executar o servidor de produção diretamente a partir do código-fonte, sem utilizar o Docker. Instale o Git e o Bun 1.3 ou superior; o Node.js é necessário apenas se você optar por usar o PM2 como gerenciador de processos.

```bash
git clone https://github.com/GMWalletApp/gmshop-edge.git
cd gmshop-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -m 0700 -o "$USER" -g "$USER" /var/lib/gmshop
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  bun run start:bun
```

O último comando é executado em primeiro plano. Mantenha-o sob systemd, Supervisor, PM2 ou outro gerenciador de serviços em produção. Preserve e faça backup do diretório `GMSHOP_DATA_DIR` da mesma forma que você preservaria um volume Docker. O ambiente de tempo de execução Bun permanece apenas em uma instância; a implantação em réplicas múltiplas e o armazenamento em rede compartilhado não são suportados.

### PM2 {#pm2}

O PM2 em si requer Node.js e npm, mas o GMShop Edge continua funcionando com o Bun. Mantenha a opção explícita `--interpreter bun` para que o PM2 não tente iniciar o servidor gerado com Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

Execute o comando impresso pelo `pm2 startup`, e depois execute novamente o comando `pm2 save`. Utilize `pm2 logs gmshop-edge` e `curl --fail http://127.0.0.1:3000/healthz` para verificar se o serviço está funcionando.

Para atualizar um deployment de origem:

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Botão de enviar/publicar {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

O fluxo guiado prepara o projeto Worker. Após a implantação, abra `/install` e verifique as seguintes configurações:

- D1 `gmshop-edge` como `DB`.
- KV `gmshop-edge-cache` como `CACHE`.
- Privado R2 `gmshop-edge-files` como `FILES`.
- Enfile `gmshop-edge-commerce` como `COMMERCE_QUEUE`, com `gmshop-edge-commerce-dlq` como sua fila de mensagens mortas.
- Cron de 1 minuto, e, ao selecionar, Cloudflare Envio de E-mail como `EMAIL`.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

O hook `predeploy` cria ou reutiliza os recursos nomeados, aplica as migrações remotas e constrói o Worker. Os IDs D1/KV resolvidos são injetados apenas em `dist/server/wrangler.json`; os IDs específicos da conta não são escritos no `wrangler.jsonc` portátil.

## Primeira instalação {#first-install}

Após o Docker ou Bun iniciar, abra `http://your-host:3000/install`. Após a implantação dos Workers, abra `/install` no URL do Worker. Verifique o endereço público detectado e os Hosts Permitidos antes de criar o primeiro administrador raiz.

A instalação cria o primeiro administrador raiz, funções internas de storefront protegidas, segredos em tempo de execução, e valores padrão para comércio, taxas de câmbio, autenticação e notificações. No entanto, não cria produtos falsos, inventário, credenciais de fornecedores ou configurações de pagamento.

Após a instalação:

1. Revise as configurações do sistema gerado no `/admin` e faça um backup da configuração em tempo de execução.
2. Configure as marca, registro, autenticação, e-mail, comércio, logística, retenção e configurações do provedor.
3. Crie um rascunho de produto com itens e estoque que podem ser vendidos, arquivos ou configuração de automação; realize as verificações de publicação antes de torná-lo público.
4. Configure um adaptador de pagamento e finalize um pedido de aceitação de um provedor real antes de abrir a loja.

Antes da produção, verifique as regras exatas de Host/Origem, um e-mail de pagamento e recuperação real, a execução de pedidos/downloads/automatizações, repetição de filas e recuperação em caso de falha, reembolsos, entitlements expirados, restauração de backups, tanto as localizações de aplicação quanto os temas, comportamento no dispositivo móvel, navegação por teclado e recuperação do administrador.
