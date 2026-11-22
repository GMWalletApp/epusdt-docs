---
description: "Veja como o GMPay Edge compartilha sua lógica de pedidos e pagamentos entre os Workers e o Bun, e quais serviços de armazenamento e execução cada implantação utiliza."
titleTemplate: ":title | GMPay Edge"
---

# Arquitetura {#architecture}

O GMPay Edge opera como um único contêiner Worker ou um contêiner Bun/Nitro. Ambos os ambientes de execução compartilham as mesmas superfícies de produto e o núcleo de pedidos/pagamentos; apenas os adaptadores de infraestrutura são diferentes.

## Superfícies de produtos {#product-surfaces}

- Os clientes comerciais utilizam as fronteiras compatíveis com GMPay ou EPay.
- Os pagadores utilizam a plataforma de checkout hospedada.
- Os operadores utilizam `/admin`.
- Os usuários do Telegram interagem através do bot configurado.

## Serviços de tempo de execução {#runtime-services}

| Capacidade | Cloudflare Workers | Bun/Nitro Docker |
| --- | --- | --- |
| Banco de dados | D1 | SQLite em `GMPAY_DATA_DIR` |
| Cache | KV | Cache de execução local |
| Objetos pessoais | R2 | Armazenamento local de objetos persistente |
| Trabalho de fundo | Cloudflare Queues | Filas locais duráveis |
| Agendamento | Cron Triggers | Agendador eficiente |

O diretório de dados Bun também contém arquivos carregados e o estado durável da fila. É necessário que seja montado em um volume persistente e incluído em backups.

## Bindings da Cloudflare {#cloudflare-bindings}

| Binding | Produtos da Cloudflare | Finalidade |
| --- | --- | --- |
| `DB` | D1 | Dados autoritativos de aplicação, pagamento, autorização e entrega. |
| `CACHE` | KV | Caches validadas de curta duração e telemetria complementar. |
| `FILES` | R2 | Evidências de revisão de pagamentos privados e exportações geradas. |
| `PAYMENT_QUEUE` | Filas | Escaneamento de pagamentos assíncronos |
| `WEBHOOK_QUEUE` | Filas | Entrega assíncrona de Webhooks de comerciantes. |

## Trabalho de fundo {#background-work}

Filas e agendadores duráveis específicos para a execução, juntamente com a movimentação de verificações de pagamento e tentativas de Webhook fora de solicitações sincronizadas, também lidam com a expiração de pagamentos, limpeza, verificações de saúde da conexão e sincronização de taxa.

A entrega de webhooks utiliza uma caixa de saída durável com histórico de tentativas, redefinição manual e registros de auditoria em ambas as etapas.

## Modelo de dados e segurança {#data-and-security-model}

- D1 ou SQLite são considerados a referência para o ambiente de execução selecionado.
- O armazenamento em cache e o armazenamento de objetos privados utilizam os adaptadores da execução selecionada.
- Os adaptadores de pagamento são somente de leitura.
- A administração utiliza o Better Auth, TOTP e RBAC (controle de acesso baseado em função) dinâmico e multi-funções.

## Limites do protocolo {#protocol-boundaries}

O GMPay utiliza assinaturas **HMAC-SHA256**. A compatibilidade com EPay permanece como uma fronteira de **MD5** herdada. As chamadas de retorno (outbound callbacks) mantêm o formato de assinatura do protocolo original.
