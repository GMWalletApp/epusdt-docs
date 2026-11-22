---
description: "Consulte os endpoints descontinuados do EPUSDT e as rotas atuais da API para lojistas que os substituem."
---

# Migração da API {#api-migration}

A fonte atual **não registra** a rota antiga `POST /api/v1/order/create-transaction`.

Também **não registra** a rota de compatibilidade antiga: `POST /payments/epusdt/v1/order/create-transaction`.

## Substitua as integrações antigas por um destes novos caminhos. {#replace-old-integrations-with-one-of-these-live-routes}

| Caso de uso | Rota vigente |
| --- | --- |
| API JSON nativa (recomendada) | `POST /payments/gmpay/v1/order/create-transaction` |
| Redirecionar / Fluxo no estilo EPay | `GET/POST /payments/epay/v1/order/create-transaction/submit.php` |

## Mudanças significativas na migração {#important-migration-changes}

1. Cada solicitação de pedido de entrada deve identificar o comerciante com o `pid`.
2. **A assinatura é verificada com a `secret_key` do registro correspondente em `api_keys`.** A antiga chave global específica da rota deixou de ser usada.
3. As redes/tokens suportados são determinados pela administração, portanto, consulte `/payments/gmpay/v1/config` e leia `data.supported_assets` em vez de assumir uma lista fixa.
4. As configurações do EPay agora vêm das configurações administrativas (`epay.default_token`, `epay.default_currency`, `epay.default_network`), e não das chaves de ambiente desativadas como `epay_pid` / `epay_key`.
