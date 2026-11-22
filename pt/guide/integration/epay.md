---
description: "Conecte um sistema de comerciante compatível com EPay ao EPUSDT utilizando o endpoint de checkout redirecionado e os parâmetros de solicitação assinados."
title: "Checkout de redirecionamento compatível com EPay"
---

# Integração compatível com EPay por redirecionamento {#epay-compatible-integration-redirect-checkout}

Utilize este fluxo somente quando o sistema upstream exigir uma entrada de pedido de redirecionamento no estilo EPay.

## Rota {#route}

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Requisito de credencial de comerciante {#merchant-credential-requirement}

As solicitações de entrada **não** são validadas utilizando chaves de ambiente desatualizadas, como `epay_pid` ou `epay_key`.

A fonte atual faz o seguinte:

1. Leia o `pid` em trânsito.
2. Encontre a linha `api_keys` habilitada com aquele PID.
3. Verifique `sign` usando a `secret_key` desse registro
4. Aplicar verificação opcional de lista de IPs permitidos

## Campos obrigatórios {#required-incoming-fields}

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

Campos opcionais comuns:

- `return_url`
- `name`
- `type`
- `token`
- `network`
- `currency`
- `sign_type`

`type` aceita dois formatos:

- `alipay` — valor de compatibilidade; token/rede são resolvidos a partir dos parâmetros de solicitação explícitos `token` + `network`, e, em seguida, a partir das configurações padrão do EPay do administrador.
- O seletor `token.network` como, por exemplo, `usdt.tron` – é aceito somente quando essa combinação de token/rede é atualmente suportada. Um seletor válido substitui `token`, `network`, `epay.default_token` e `epay.default_network`.

Outros valores não vazios para `type` são rejeitados como parâmetros inválidos. O `type` selecionado ou compatível é armazenado no pedido para callbacks futuros de retorno/notificação do EPay.

## As configurações padrão do EPay. {#epay-defaults}

Após a verificação da assinatura ser bem-sucedida, a fonte atual constrói o payload de pedido interno compartilhado, incluindo as configurações administrativas:

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

Ordem de resolução para o EPay submit.php é:

1. Suportado o seletor `type=token.network`, caso seja fornecido.
2. Solicitação explícita dos parâmetros `token` / `network`.
3. Administrar `epay.default_token` / `epay.default_network`
4. Se ambos os tokens e a rede ainda estiverem vazios, crie um pedido de status “`4`” como placeholder para o fluxo de seleção do caixa.

A moeda é independente: solicitar `currency` → `epay.default_currency` → `cny`.

## Comportamento de sucesso {#success-behavior}

Em caso de sucesso, o destino redireciona o navegador para:

```text
/pay/checkout-counter/{trade_id}
```

At a fonte, esse caminho agora é a entrada de redirecionamento para a SPA (aplicação web) de caixa. Os dados da página de checkout são servidos através de:

```text
/pay/checkout-counter-resp/{trade_id}
```


## Escolhas diretas de token/rede {#direct-token-network-choices}

Para as listas de métodos de pagamento "New API" upstream, expor opções separadas, onde o `type` é um seletor `token.network` suportado. Por exemplo, `usdt.tron` cria uma ordem USDT TRON diretamente, enquanto `usdt.binance` cria uma ordem USDT Binance/BSC quando esse ativo é habilitado.

Lista de métodos de origem:

```json
[
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay", "type": "custom1" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.binance", "type": "usdt.binance" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.tron", "type": "usdt.tron" }
]
```

`custom1` é apenas um nome genérico de opção de nível superior. Não envie-o sem alterações para o submit.php do EPay; não envie sem um `type`, `type=alipay`, ou um seletor válido como `usdt.tron`.

## Verificação de callbacks {#callback-verification}

Quando o pedido criado contém `payment_type = Epay`, o processo em segundo plano chama a sua `notify_url` com parâmetros de consulta no formato EPay. A assinatura usa a **mesma `secret_key` do lojista**.

O campo `type` do callback reproduz o tipo armazenado na requisição: `alipay` ou um seletor aceito, como `usdt.tron`. Se a requisição omitir `type`, os callbacks enviados usam `alipay` por compatibilidade.

Não verifique essas chamadas de retorno com uma antiga `epay_key` isolada.
