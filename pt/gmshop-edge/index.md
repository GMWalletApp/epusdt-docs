---
title: "Loja digital GMShop Edge"
description: "Explore o GMShop Edge, uma loja virtual de produtos digitais auto-hospedada, com funcionalidades de checkout, gerenciamento de pedidos e integração com fornecedores, ideal para Workers ou Bun."
---

# GMShop Edge {#gmshop-edge}

[GMShop Edge](https://github.com/GMWalletApp/gmshop-edge) é uma loja digital auto-hospedada, de implantação única e com modelo de tenancy, projetada para **Cloudflare Workers**ou um**container Docker Bun/Nitro**.

Um sistema de implantação oferece uma loja pública responsiva, contas de clientes, processo de checkout e entrega, integração com Telegram, operações de fornecedores e um console de administração baseado em permissões.

É um projeto complementar independente de Epusdt e GMPay Edge. Utilize o GMShop Edge quando o produto que você precisa operar é uma loja de bens digitais com catálogo, processo de checkout, entrega e fluxos de trabalho com fornecedores.

> O GMShop Edge está em desenvolvimento ativo. Os adaptadores integrados indicam a existência de caminhos de integração; no entanto, o uso em produção ainda exige credenciais, backups, monitoramento e testes de aceitação com o provedor real.

## O que oferece {#what-it-provides}

- Produtos de estoque que alocam atomicamente texto pré-definido criptografado, produtos de download privado e produtos de automação com políticas de artefatos explícitas.
- Direitos permanentes, por prazo determinado, limitados, ilimitados, gratuitos, únicos e renováveis pelos clientes.
- Visão de convidado e checkout registrado, cupons, reembolsos, atendimento pós-venda, consulta de pedidos privada e acesso à entrega baseado na conta.
- Pagamentos de carteira da loja, além de Stripe, Cryptomus, GMpay, EPay, adaptadores Alipay (Página/WAP) e WeChat (Nativo/H5).
- Sincronização e atendimento de pedidos do catálogo de fornecedores através do ACG `3.5.5`, Dujiao Next `v1.3.1`, ou a API de fornecedores nativa GMShop Edge.
- Autenticação via e-mail/senha configurada em tempo de execução, redes sociais, OIDC, OIDC do Telegram, Widget de Login do Telegram e Mini App do Telegram.
- Um bot do webhook da grammY com comandos localizados, botões do Mini App e suporte ao cliente baseado em tópicos de fórum, sem armazenar o conteúdo das mensagens.
- RBAC multi-função dinâmico para `/admin`, com proteção de conta raiz, verificações de permissão no servidor, reautenticação e registros de auditoria.
- Localizações de aplicativos em inglês (`en-US`) e chinês simplificado (`zh-CN`).

Todas as funcionalidades listadas acima fazem parte do projeto de código aberto; não existe uma camada Pro ou Enterprise separada.

## Seções de documentação {#documentation-sections}

- [Arquitetura](./architecture.md): pilha de aplicações compartilhada, bindings para Workers, adaptadores Bun, propriedade de dados e limites de execução.
- [Implantação](./deployment.md): Workers, Bun/Docker, instalação e testes de aceitação em produção.
- [Gestão de dados no Bun](./node-data-operations.md): backup, restauração e importação do Cloudflare D1/R2.
- [API de fornecedor nativo](./supplier-api.md): integração para operações de catálogo, pedidos, canais de pagamento e recargas entre instâncias GMShop Edge.
- [Comércio e atendimento ao cliente](./commerce-fulfillment.md): produtos, estoque, fornecedores, registros de entrega, direitos e automação.
- [Finalização e provedores](./checkout-providers.md): carteira e pagamentos externos, cotações em moeda local, e-mail, autenticação e suporte via Telegram.

## Links {#links}

- Repositório: [GMWalletApp/gmshop-edge](https://github.com/GMWalletApp/gmshop-edge)
- Lista de verificação para implantação: [`docs/DEPLOYMENT.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/DEPLOYMENT.md)
- Operações de dados relevantes: [`docs/NODE_DATA_OPERATIONS.md`](https://github.com/GMWalletApp/gmshop-edge/blob/main/docs/NODE_DATA_OPERATIONS.md)
- OpenAPI YAML: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)
