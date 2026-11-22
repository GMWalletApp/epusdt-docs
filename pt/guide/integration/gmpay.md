---
description: "Integre o endpoint da ordem EPUSDT GMPay, valide as solicitações dos comerciantes e redirecione o comprador para a URL de checkout retornada pelo gateway."
---

# Integração com GMPay (recomendada) {#gmpay-integration-recommended}

Utilize o GMPay para todas as novas integrações.

## Rota {#route}

```text
POST /payments/gmpay/v1/order/create-transaction
```

## Requisito de credencial de comerciante {#merchant-credential-requirement}

Antes de chamar a API, crie ou consulte uma chave de API no painel de administração.

Você precisa:

- `pid`
- `secret_key`

Envie `pid` na requisição e use `secret_key` como chave de assinatura.

## Solicitação mínima. {#minimal-request-body}

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "signature": "hmac-sha256-hex(...)"
}
```

## Regra de assinatura {#signature-rule}

> A partir da versão `v2.0.0`, o GMPay utiliza HMAC-SHA256 em vez de MD5. É necessário atualizar os clientes antes de implementar a versão v2, caso contrário, eles receberão a mensagem `401 Unauthorized`. As solicitações compatíveis com EPay não serão afetadas.

1. Mantenha todos os campos não vazios, exceto `signature`
2. Ordene as chaves pela ordem ASCII
3. Concatene os pares no formato `key=value&...`
4. Calcule o HMAC-SHA256 usando a `secret_key` do lojista como chave HMAC
5. Envie o resumo hexadecimal de 64 caracteres em minúsculas no campo `signature`

## Rotas de companhia úteis {#useful-companion-routes}

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

Se o cliente precisar de opções de rede/tokens dinâmicas, leia-as de `data.supported_assets` na resposta do `/payments/gmpay/v1/config`.

Consulte `data.site` para a identidade visual e `data.epay`, `data.okpay` e `data.xlayer` para as configurações de checkout.

## Verificação de callbacks {#callback-verification}

As chamadas de retorno do GMPay são enviadas como JSON `POST` para o `notify_url`.

Verifique a assinatura HMAC-SHA256, confira se o pagamento corresponde ao pedido e processe-o de forma idempotente. Confirme o recebimento com HTTP 200 e o texto simples `ok` ou `success`, sem distinção entre maiúsculas e minúsculas.

## Anotação de resposta bem-sucedida {#success-response-note}

A fonte atual inclui `payment_url` nas respostas de criação de pedidos bem-sucedidas, permitindo que o chamador tenha um destino de redirecionamento de checkout hospedado, em vez de reconstruir essa URL manualmente.
