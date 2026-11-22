---
description: "Siga um pedido da GMShop Edge, do início ao fim, incluindo o processo de checkout, alocação de estoque, entrega digital, gerenciamento de direitos e suporte pós-venda."
titleTemplate: ":title | GMShop Edge"
---

# Vendas e entrega {#commerce-and-fulfillment}

GMShop Edge oferece um catálogo, processo de checkout, controle de estoque, gestão de direitos, compras de fornecedores, logística de entrega e suporte pós-venda, tudo em uma única instalação.

## Produtos e direitos {#products-and-entitlements}

Os tipos de produto são:

- `stock`: aloca de forma atômica textos criptografados previamente cadastrados, como chaves de licença, contas, códigos de ativação ou credenciais.
- `download`: concede acesso limitado a arquivos privados.
- `automation`: executa implantações, scripts, provisionamento de recursos ou fluxos de compilação com políticas de artefatos `none | optional | required`.

As permissões podem ser permanentes, por prazo determinado, limitadas, ilimitadas, gratuitas, únicas ou renovadas pelo cliente. Os pedidos preservam instantâneos imutáveis de definição de entrada, preços, permissões, execução e automação.

## Propriedade do cliente e poder de compra. {#customer-ownership-and-wallet}

As ordens registradas direcionam as referências diretamente para os usuários "Better Auth". As ordens de convidados mantêm um e-mail de verificação e podem ser reivindicadas por uma conta verificada correspondente; não é criado um banco de dados de clientes ocultos.

Cada conta pode utilizar a carteira da loja. O livro razão registra movimentos menores em unidades inteiras e suporta pagamentos, reembolsos e ajustes administrativos sem dinheiro com ponto flutuante.

## Aquisição de fornecedores {#supplier-sourcing}

O GMShop Edge suporta:

- ACG `3.5.5` V4 API Aberta.
- Dujiao Next `v1.3.1`.
- Integração nativa GMShop entre fornecedores.

O provedor nativo da API utiliza chaves de API criadas pelos administradores, pontos de extremidade HTTP autenticados, acesso ao catálogo e operações de pedido idempotentes. Outra instância GMShop Edge pode utilizar seu adaptador nativo de provedor para sincronizar produtos e processar os pedidos através desta API.

Para cada fonte/provedor, as contas elegíveis formam uma pilha de prioridade igual. A sincronização de catálogo, a compra, a comunicação de retorno/reconciliação e a entrega passam por máquinas de estado duráveis e a pipeline unificada de registro de entrega.

## Satisfação e operações {#fulfillment-and-operations}

As filas e tarefas agendadas lidam com a alocação de estoque, compras de fornecedores, entrega de downloads privados, tarefas automatizadas, notificações, reembolsos, tentativas de recuperação, expiração, cancelamento, retenção e recuperação manual. As chaves de objetos privadas nunca são selecionadas por entrada do cliente.

Para a aceitação local:

```bash
bun run seed:local
```

O comando é específico para um ambiente local e idempotente. Ele cria contas de fornecedores desativadas com origens `.example.invalid` e não pode entrar em contato com servidores upstream reais até que as credenciais sejam substituídas e as contas sejam explicitamente habilitadas.
