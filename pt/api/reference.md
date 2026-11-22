---
description: "Verifique as rotas e os métodos HTTP para pedidos de comerciantes, processo de checkout e status de pagamento, e em seguida, abra os exemplos de assinatura e callback."
title: "Referência do endpoint da API de pagamento"
---

# Referência da API {#api-reference}

Consulte [API de Varejo](/pt/api/payment) para exemplos de assinatura, estados de pedidos e verificação de callbacks.

## Rotas públicas em tempo real {#live-public-routes}

| Finalidade | Método | Caminho | Autenticação |
| --- | --- | --- | --- |
| [Criar um pedido GMPay](/pt/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | HMAC-SHA256 do lojista |
| [Consultar configuração](/pt/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | Público |
| [Abrir o checkout](/pt/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | Público |
| [Consultar os dados do checkout](/pt/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | Público |
| [Consultar status do pedido](/pt/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | Público |
| [Selecionar rede ou provedor](/pt/api/endpoints/switch-network) | POST | `/pay/switch-network` | Público |
| [Enviar o hash da transação](/pt/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | Público |
| [Voltar à loja](/pt/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | Redirecionamento de navegador |
| [Criar um pedido EPay](/pt/api/endpoints/epay-order) | GET ou POST | `/payments/epay/v1/order/create-transaction/submit.php` | MD5 do lojista |
| [Receber uma notificação do OKPay](/pt/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | Assinatura do OKPay |

## Interface da API de administração {#admin-api-surface}

As APIs de gerenciamento estão localizadas em `/admin/api/v1/*` e são protegidas por JWT, exceto os pontos de extremidade de login e a configuração inicial da senha.

Grupos-chave visíveis na fonte atual:

- O caixa público aceita um hash para uma ordem pendente na blockchain. Um administrador também pode verificar uma ordem expirada ou um candidato em revisão manual.
- Taxas de câmbio: `rate.mode` aceita `fixed` ou `auto`. O modo fixo usa `rate.forced_rate_list`. O automático consulta `rate.api_url`, armazena em cache as respostas válidas por moeda-base e conserva o último cache persistente se a atualização falhar. Deixar `rate.forced_rate_list` vazio restaura a taxa padrão em CNY para USDT e USDC.
- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- gerenciamento de cadeias / tokens de cadeia
- gerenciamento de endereço de carteira
- gerenciamento de configurações

## Regras sobre credenciais de comerciantes {#merchant-credential-rules}

### GMPay {#gmpay}

- ID obrigatório do lojista: `pid`
- Campo de assinatura: `signature`
- Algoritmo de assinatura desde a versão `v2.0.0`: HMAC-SHA256 sobre a string de parâmetros canônica e não vazia, criptografada com a chave do `api_keys.secret_key`, que corresponde ao `pid`.
- Os clientes GMPay MD5 pré-v2 devem ser atualizados antes de implantar a versão `v2.0.0` ou posterior.

### Fluxo compatível com EPay {#epay-compatible-flow}

- ID obrigatório do lojista: `pid`
- Campo de assinatura: `sign`
- Chave de assinatura: a `secret_key` das linhas `api_keys` habilitadas que correspondem ao `pid`.
- `sign_type` é aceito e geralmente é `MD5`.
- EPay `type` aceita `alipay` ou um seletor suportado do `token.network` como `usdt.tron`. Os seletores aceitos são preservados nos callbacks de retorno/notificação do EPay.

## Ordem de integração recomendada {#recommended-integration-order}

1. Crie ou verifique os credenciais de comerciantes no painel de administração (`pid` + `secret_key`).
2. Consulta `/payments/gmpay/v1/config` e leia `data.supported_assets` se o cliente precisar de opções de rede/token dinâmicas.
3. Prefira o GMPay para novas integrações.
4. Utilize o redirecionamento compatível com EPay apenas quando o sistema upstream (original) exigir esse fluxo.
5. Verifique os callbacks com a mesma `secret_key` do lojista
