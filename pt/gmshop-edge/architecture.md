---
description: "Entenda como o GMShop Edge conecta a loja, a administração, o armazenamento e a logística em ambientes Workers e Bun."
titleTemplate: ":title | GMShop Edge"
---

# Arquitetura {#architecture}

O GMShop Edge utiliza o mesmo stack React/TanStack completo, seja na Cloudflare Workers ou no Bun/Nitro. Uma única implantação gerencia a loja pública, a área de contas do cliente, o processo de checkout, a gestão de pedidos, a integração com fornecedores, a integração com Telegram e o console de administração.

## Limites de aplicação compartilhados {#shared-application-boundaries}

As rotas permanecem limitadas. As páginas de funcionalidades, os esquemas, as funções do servidor e o comportamento do domínio residem em `src/features`; a infraestrutura de tempo de execução entre domínios está localizada em `src/server`; os esquemas do Drizzle residem em `src/db/schema`.

A aplicação mantém informações de identidade, RBAC, catálogo, pedidos, inventário, direitos de acesso, estado dos fornecedores, registro da carteira, notificações, proteção contra reprodução, limites de taxa, outbox e dados de auditoria no banco de dados principal. O dinheiro é armazenado como strings de inteiros decimais nas unidades menores e nunca é calculado com ponto flutuante.

## Adaptadores Cloudflare Workers {#cloudflare-workers-adapters}

A implantação dos trabalhadores utiliza:

- `DB`: D1 para aplicação e estado comercial autoritário.
- `FILES`: armazenamento privado no R2 para mídias de produtos, downloads, artefatos de automação e exportações.
- `CACHE`: Armazenamento de chave-valor para caches de leitura validados, versionados e com limites definidos; os limites de segurança permanecem baseados no banco de dados.
- `COMMERCE_QUEUE`: Fila para tarefas de entrega, automação, notificação, fornecedores e reembolso, com uma fila de mensagens mortas.
- `EMAIL`: binding opcional do Cloudflare Send Email.
- Gatilhos de 60 segundos do Cron para processamento e manutenção agendados.

## Adaptadores Bun/Nitro {#bun-nitro-adapters}

O tempo de execução Bun fornece adaptadores equivalentes dentro de um único diretório de dados:

- SQLite como o banco de dados principal/oficial.
- Cache limitada em desenvolvimento.
- Armazenamento local de objetos privado.
- Uma fila robusta, baseada em SQLite.
- Um agendador em tempo real de um minuto.

`GMSHOP_DATA_DIR` contém o banco de dados, objetos, estado da fila e dados de execução. O Bun é intencionalmente **apenas para uma instância**: a implantação em réplica múltipla e o armazenamento em rede compartilhado não são suportados.

## Dados e trabalho de fundo {#data-and-background-work}

Objetos privados são resolvidos através de registros de banco de dados autorizados; os clientes nunca selecionam chaves de objeto. A fila e o trabalho agendado lidam com a sincronização com fornecedores, compras, atendimento, notificações, reembolsos, tentativas, retenção, manutenção do Telegram e rotação de chaves fora das solicitações sincronizadas da loja.

A linha de base para a migração (limpeza) é `drizzle/0000_gmshop.sql`; as migrações subsequentes são aplicadas em ordem e seus checksums são validados pelas operações de dados do Bun.
