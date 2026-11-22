---
title: "Gateway de pagamento GMPay Edge para Trabalhadores e Bun"
description: "Explore o GMPay Edge, um gateway de pagamento independente e auto-hospedado para Cloudflare Workers ou Bun, com uma API de comerciante GMPay e compatibilidade com EPay."
---

# GMPay Edge {#gmpay-edge}

[GMPay Edge](https://github.com/GMWalletApp/gmpay-edge) é um gateway de pagamentos em criptomoedas auto-hospedado e de locatário único, para **Cloudflare Workers ou Bun/Nitro no Docker**.

É um projeto independente do Epusdt. Utilize o Epusdt quando desejar um gateway Go documentado por este site; avalie o GMPay Edge quando precisar de um gateway TypeScript que possa ser implantado tanto em Cloudflare Workers quanto como um contêiner Docker com persistência local baseada em SQLite.

> O GMPay Edge está em desenvolvimento ativo. As integrações embutidas indicam que a funcionalidade já existe no projeto; no entanto, o uso em produção ainda requer pontos de extremidade (endpoints) e credenciais de somente leitura, pertencentes ao responsável pelo deploy, juntamente com a configuração de métodos de recebimento, backups, monitoramento e testes de aceitação na plataforma real.

## O que oferece {#what-it-provides}

- APIs de comerciantes GMPay assinado com JSON e entrada de formulário.
- Compatibilidade EPay na fronteira da API, sem a necessidade de manter um modelo de pedido separado.
- Checkout responsivo, console de administração, páginas de status públicas e documentação OpenAPI em tempo de execução.
- Entrega robusta de Webhooks através de uma fila, utilizando um padrão "outbox", com histórico de tentativas, redefinição manual e registros de auditoria.
- Escaneamento de pagamentos, verificação de validade, limpeza, monitoramento da conexão e sincronização de taxas através de filas e agendadores específicos para a execução.
- Melhor Autenticação, TOTP e RBAC dinâmica multi-funções para administração.
- Automação de bots do Telegram com grammY, incluindo pedidos inline, comandos públicos e assinaturas de notificações.
- Seis localidades de UI.

## Seções de documentação {#documentation-sections}

- [Arquitetura](./architecture.md): serviços em Workers e Bun, filas, callbacks e limites entre protocolos.
- [Implantação](./deployment.md): Docker Compose, imagens do GHCR, Botão de Implantação, CLI Wrangler, desenvolvimento local e a primeira instalação.
- [Gestão de dados no Bun](./node-data-operations.md): backup, restauração e importação do Cloudflare D1/R2.
- [API para lojistas](./merchant-api.md): criação e consulta de pedidos do GMPay, assinaturas, callbacks e compatibilidade com EPay.
- [Integrações de pagamento](./payment-integrations.md): catálogo de adaptadores integrados para pagamentos on-chain, corretoras e carteiras.

## Links {#links}

- Repositório: [GMWalletApp/gmpay-edge](https://github.com/GMWalletApp/gmpay-edge)
- README em inglês: [README.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.md)
- README em chinês: [README.zh-CN.md](https://github.com/GMWalletApp/gmpay-edge/blob/main/README.zh-CN.md)
