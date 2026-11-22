---
description: "Integre as credenciais do comerciante do GMPay Edge, as assinaturas de solicitações HMAC e as chamadas de retorno de pedidos, ou utilize o adaptador de compatibilidade do EPay."
titleTemplate: ":title | GMPay Edge"
---

# API para lojistas {#merchant-api}

GMPay é o protocolo de comércio principal. EPay é um adaptador de compatibilidade que utiliza o mesmo credencial, serviço de pedidos, regras de idempotência, máquina de estados, processo de checkout, comportamento de consulta e pipeline de callback.

Para campos e valores de status de fontes confiáveis, utilize a página `/docs` da instância implantada ou o contrato OpenAPI rastreado no repositório: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml).

## Assinaturas GMPay {#gmpay-signatures}

As requisições do GMPay incluem um `pid` numérico e uma `signature` HMAC-SHA256 em minúsculas.

Para assinar um pedido:

1. Exclua `signature` e os valores vazios.
2. Classificar os campos pela ordem de chave ASCII.
3. Una os pares `key=value` com `&`.
4. Utilize o credencial "Secret" como a chave HMAC.
5. Calcular HMAC-SHA256 em letras minúsculas.

## Crie ordem. {#create-order}

<span class="api-route"><b>POST</b> <code>/payments/gmpay/v1/order/create-transaction</code></span>

Reutilizar um `order_id` existente não cria um segundo pedido. Excluir tanto o `token` quanto o `network` cria um pedido selecionável; o GMPay Edge não define silenciosamente para a TRON.

## Consulta de pedido {#query-order}

<span class="api-route"><b>GET</b> <code>/payments/gmpay/v1/order/query</code></span>

Informe apenas um dos campos, `trade_id` ou `order_id`, e assine a requisição com a mesma credencial. Cada credencial só pode consultar os pedidos que criou.

## Receber retornos/ligações de volta {#receive-callbacks}

O comerciante fornece o `notify_url` ao criar um pedido. Os destinos de callback devem passar a instância SSRF e a política de segurança.

Os eventos entregues possuem assinaturas determinísticas, tentativas preservadas, tentativas limitadas, e um caminho de repetição manual auditado. Os manipuladores devem verificar a assinatura, processar eventos duplicados de forma idempotente, e somente confirmar após a atualização do estado local.

Para as chamadas de retorno do GMPay, retorne um texto simples "`ok`" com código HTTP 200 após o processamento bem-sucedido.

## Compatibilidade EPay {#epay-compatibility}

A compatibilidade do EPay utiliza a mesma credencial e fluxo de pedidos, mas mantém o sistema de fronteira MD5 do EPay legado para solicitações de entrada e callbacks compatíveis.
