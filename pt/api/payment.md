---
description: "Crie um pedido GMPay, leia o status de pagamento e verifique as chamadas de EPUSDT. Inclui parâmetros de solicitação do comerciante, regras de assinatura e exemplos."
title: "API de pagamento para comerciantes, assinaturas e callbacks."
---

# API para lojistas {#merchant-api}

Utilize o endpoint de configuração pública para descobrir as opções de pagamento, criar um pedido no seu servidor e enviar o comprador para a URL de checkout retornada. Verifique a notificação assinada antes de processar o pedido. [Exemplo de pedido em Python](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/sdk/python/gmpay_create_order.py) · [Especificação OpenAPI](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/docs/swagger.json)

[Assinar um pedido](#signing) · [Criar um pedido GMPay](#create) · [Status da enquete](#status) · [Retorno de pagamentos dos comerciantes](#callbacks)

## Endpoints {#endpoints}

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

## The quick brown fox jumps over the lazy dog. {#response-format}

Os endpoints JSON retornam `status_code` (200 em caso de sucesso), `message`, `data` (objeto ou null), e o `request_id` gerado pelo servidor. Assinaturas inválidas retornam um código HTTP 401. Erros de negócio geralmente retornam um código HTTP 400 com um código de erro da aplicação.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {},
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<a id="signing"></a>

## Assinar uma requisição {#sign-a-request}

Utilize a chave de comerciante associada ao `pid` da solicitação. Uma nova instalação inicializa um comerciante padrão com PID `1000`. Mantenha o segredo no servidor do comerciante.

O **GMPay** usa HMAC-SHA256. Exclua o campo `signature`, as strings vazias e os valores nulos. Ordene os nomes dos campos restantes em ordem ASCII crescente, respeitando maiúsculas e minúsculas. Una os pares `key=value` sem escape com `&`. Use `secret_key` como chave HMAC e codifique o resultado em 64 caracteres hexadecimais minúsculos. Inclua `pid` e qualquer `payment_type` não vazio. Em JSON, o servidor interpreta um número como `100.00` como `100`. A codificação de formulário permite enviar a representação original como string.

Exemplos de campos, string canônica e assinatura utilizando a chave de demonstração `epusdt_secret_key`:

```text
pid=1000
order_id=ORD202605230001
currency=cny
token=usdt
network=tron
amount=100
notify_url=https://merchant.example/notify
redirect_url=https://merchant.example/return
name=VIP
```

```text
amount=100&currency=cny&name=VIP&network=tron&notify_url=https://merchant.example/notify&order_id=ORD202605230001&pid=1000&redirect_url=https://merchant.example/return&token=usdt
```

```text
signature=6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d
```

### Exemplos em PHP {#php-examples}

GMPay:

```php
function gmpaySign(array $params, string $secretKey): string
{
    unset($params['signature']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return hash_hmac('sha256', implode('&', $pairs), $secretKey);
}
```

EPay exclui `sign` e `sign_type`, adiciona o segredo do comerciante à string canônica e utiliza MD5.

```php
function epaySign(array $params, string $secretKey): string
{
    unset($params['sign'], $params['sign_type']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

<a id="create"></a>

## Criar um pedido no GMPay {#create-a-gmpay-order}

`POST /payments/gmpay/v1/order/create-transaction` aceita JSON e `application/x-www-form-urlencoded`.

```json
{
  "pid": "1000",
  "order_id": "ORD202605230001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example/notify",
  "redirect_url": "https://merchant.example/return",
  "name": "VIP",
  "signature": "6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d"
}
```

<!-- #region create-fields -->

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `pid` | String | Sim | O PID do comerciante era usado para consultar a chave de assinatura. |
| `order_id` | String | Sim | Identificador único de pedido de comerciante, até 32 caracteres. |
| `currency` | String | Sim | Moeda fiduciária, por exemplo `usd` ou `cny`. |
| `token` | String | Condicional | Ativo recebido. Combinar com a rede ou omitir ambos. |
| `network` | String | Condicional | ID da rede a partir da configuração pública, por exemplo, `binance`. |
| `amount` | Número | Sim | Valor do Fiat superior a 0,01. |
| `notify_url` | String | Sim | URL de callback de sucesso assíncrono. |
| `redirect_url` | String | Não | URL de retorno do navegador. |
| `name` | String | Não | Nome do produto ou pedido. |
| `payment_type` | String | Não | Utiliza GMPay por padrão. EPay (em qualquer formato de letra) seleciona o formato de callback de EPay e requer um PID numérico. Inclua qualquer valor não vazio na assinatura. |
| `signature` | String | Sim | Assinatura HMAC-SHA256 de 64 caracteres em minúsculas. |

<!-- #endregion create-fields -->

Forneça tanto o `token` quanto a `network` para alocar um endereço imediatamente. Omita ambos para criar um marcador (status 4) contendo o valor fiat e a moeda. Fornecer apenas um é inválido. Verifique `data.supported_assets` na configuração pública antes de selecionar um par.

### Resposta {#response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "order_id": "ORD202605230001",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.29,
    "receive_address": "TTestTronAddress001",
    "token": "USDT",
    "status": 1,
    "expiration_time": 1779530812,
    "payment_url": "https://pay.example.com/pay/checkout-counter/20260523171652123456001"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `trade_id` | String | ID da transação EPUSDT. |
| `order_id` | String | ID do pedido no sistema do lojista. |
| `amount` | Número | Valor do Fiat apresentado. |
| `currency` | String | Moeda fiduciária. |
| `actual_amount` | Número | Valor a pagar em criptomoeda. |
| `receive_address` | String | Endereço de entrega. |
| `token` | String | Símbolo de ativo. |
| `status` | Inteiro | Estado do pedido. Um valor de 4 significa "aguardando seleção". |
| `expiration_time` | Inteiro | Validade como timestamp Unix em segundos. |
| `payment_url` | String | URL para abrir no navegador. |

Um marcador não possui endereço ou token e um `actual_amount` de zero. A expiração ou o fechamento manual o move para o status 3, sem liberar uma reserva de pagamento. A seleção de checkout determina o endereço ou a URL hospedada.

## Configuração de checkout público {#public-checkout-configuration}

`GET /payments/gmpay/v1/config` retorna as marcações de checkout, os ativos disponíveis na cadeia, as configurações padrão do EPay e as configurações públicas dos provedores `okpay` e `xlayer`. Cada entrada em `supported_assets` requer uma cadeia habilitada, um endereço de recebimento disponível e um token configurado para pagamento. Os métodos hospedados expõem sua própria flag `enabled` e a lista `allow_tokens`.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "supported_assets": [
      {
        "network": "tron",
        "display_name": "TRON",
        "tokens": ["TRX", "USDT"]
      },
      {
        "network": "solana",
        "display_name": "Solana",
        "tokens": ["SOL", "USDC", "USDT"]
      }
    ],
    "site": {
      "cashier_name": "Acme Cashier",
      "logo_url": "https://cdn.example.com/logo.png",
      "website_title": "Acme Payments",
      "support_link": "https://example.com/support",
      "background_color": "#0f172a",
      "background_image_url": "https://cdn.example.com/background.png",
      "withdrawal_reminder_enabled": true
    },
    "epay": {
      "default_token": "",
      "default_currency": "cny",
      "default_network": ""
    },
    "okpay": {
      "enabled": false,
      "allow_tokens": ["USDT", "TRX"]
    },
    "xlayer": {
      "enabled": false,
      "allow_tokens": ["USDC", "USDT0", "USDG"]
    },
    "version": "v2.1.0"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### Aviso sobre saques de corretoras {#exchange-withdrawal-reminder}

Após carregar a configuração, exibir o lembrete somente quando `site.withdrawal_reminder_enabled` for verdadeiro, se o pedido on-chain estiver aguardando pagamento, um endereço de recebimento estiver disponível e `actual_amount > 0`. Tratar a ausência da flag em versões mais antigas como verdadeiro. Exibir o valor líquido total recebido após as taxas de troca, utilizando a mesma precisão e token do pedido. [Prévia clara](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-light.png) · [Prévia escura](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-dark.png)

Administradores acessam `GET /admin/api/v1/settings?group=brand`. O valor armazenado de `brand.withdrawal_reminder_enabled` é a string `"true"` ou `"false"`. Para alterá-lo, envie a seguinte requisição `PUT /admin/api/v1/settings` autenticada. Verifique a flag `ok` do item retornado e reabra o processo de checkout.

```json
{"items":[{"group":"brand","key":"brand.withdrawal_reminder_enabled","type":"bool","value":false}]}
```

## Abra a área de checkout e revise o pedido. {#open-checkout-and-read-the-order}

A `payment_url` retornada na criação aponta para `GET /pay/checkout-counter/{trade_id}`. Ao abri-la em um navegador, retorna um redirecionamento 301 para:

```text
/cashier/{trade_id}
```

Obtenha `GET /pay/checkout-counter-resp/{trade_id}` para exibir os detalhes. Esta resposta utiliza **milissegundos** para `created_at` e `expiration_time`. Verifique o endpoint de status para alterações subsequentes.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 14.29,
    "token": "USDT",
    "currency": "CNY",
    "receive_address": "TTestTronAddress001",
    "network": "tron",
    "status": 1,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

Para um marcador, o mesmo ID do pai é retornado com campos on-chain vazios. Tanto GMPay quanto EPay podem criar este estado.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 0,
    "token": "",
    "currency": "CNY",
    "receive_address": "",
    "network": "",
    "status": 4,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

O processo de checkout retorna `payment_type` em letras minúsculas (`gmpay` ou `epay`), o que seleciona o formato de callback do comerciante. Para o OKX OnchainOS na Camada X, abra a URL hospedada retornada pelo servidor. O EPUSDT verifica a ordem de negociação do provedor antes de creditar.

<a id="status"></a>

## Consultar o status periodicamente {#poll-status}

`GET /pay/check-status/{trade_id}`

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "status": 1
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<!-- #region order-states -->

| Status | Significado |
| --- | --- |
| 1 | Aguardando pagamento |
| 2 | Pago |
| 3 | Expirado |
| 4 | Aguardando a seleção de uma rede, ativo ou fornecedor. |
| 5 | Foi observada uma transferência correspondente, e está sendo confirmada. |
| 6 | Duas rodadas de verificação rigorosa não foram suficientes. É necessária uma revisão manual. |

<!-- #endregion order-states -->

No nível 5, continue monitorando e exibir "Confirmando" para que o comprador saiba que a transferência foi visualizada. Por padrão, EPUSDT verifica a profundidade de confirmação necessária e verifica a transação com dois nós independentes antes de creditá-la. Aguardar a profundidade não consome nenhuma tentativa. Os tentos de verificação e os primeiros IDs de nós persistem após reinicializações. No nível 6, a verificação automática e as chamadas de retorno de sucesso são pausadas. Um administrador pode inspecionar `review_transaction_hash` e rever a transação após investigar.

Para um hash fornecido pelo comprador, envie `block_transaction_id` para `POST /pay/submit-tx-hash/{trade_id}`. O servidor verifica a transferência. A rota de retorno do navegador, `GET /pay/return/{trade_id}`, envia um redirecionamento HTTP 302.

## Envie Hash da Transação do Caixa {#submit-cashier-transaction-hash}

`POST /pay/submit-tx-hash/{trade_id}`

Este endpoint permite que o caixa hospedado envie um hash de transação on-chain para verificação manual. Ele é intencionalmente mais limitado do que a ação "marcar como pago" do administrador.

- A ordem deve ser uma ordem on-chain.
- A ordem ainda deve ter `status=1`, aguardando pagamento.
- Pedidos expirados são rejeitados antes da verificação da cadeia.
- As ordens do OkPay/provedor não são suportadas.

### Solicitar Hash de Transação {#submit-transaction-hash-request}

```json
{
  "block_transaction_id": "0xabc123..."
}
```

### Resposta de Sucesso: Transação Enviada {#submit-transaction-hash-success-response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "block_transaction_id": "0xabc123...",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

O TON aceita referências canônicas no formato `ton:<receive_raw>:<lt>:<hash>`, referências `lt:hash` ou uma referência exclusiva e recente, apenas com hash, para o endereço de recebimento da ordem. O Aptos aceita um hash de transação.

## Mudar a rede ou provedor de pagamento. {#switch-payment-network-or-provider}

`POST /pay/switch-network` aceita um `trade_id` pai, um `token` de destino e a `network`. Para checkout hospedado, selecione `okpay` ou `xlayer` com um token autorizado por esses provedores.

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "solana"
}
```

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "okpay"
}
```

- Apenas um pedido de um cliente em aberto (status 1 ou 4) pode ser transferido. Um pedido de criança não pode ser transferido novamente.
- A primeira seleção em um marcador completa o mesmo pedido original e o move para o status 1. O checkout na blockchain agora aloca um endereço e um valor. O checkout hospedado retorna a URL de pagamento do provedor. Para o OKPay, o campo do endereço de recebimento contém "`OKPAY`".
- O espaço reservado (placeholder) permanece inicialmente com `is_selected=false`. Ao selecionar o mesmo alvo novamente, retorna a ordem existente e marca-o como selecionado. Mudar para um alvo diferente pode criar no máximo um filho por pai.
- A resposta tem a estrutura "checkout-detail". Os pedidos on-chain possuem um `payment_url` vazio.

## Checkout compatível com EPay {#epay-compatible-checkout}

Envie uma consulta GET ou um formulário POST para `/payments/epay/v1/order/create-transaction/submit.php`. O sucesso retorna um código HTTP 302 para:

```text
/pay/checkout-counter/{trade_id}
```

<!-- #region epay-fields -->

| Campo | Localização | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- | --- |
| `pid` | Consulta ou formulário | String | Sim | ID do comerciante PID. Utilize um PID numérico para as chamadas de retorno. |
| `money` | Consulta ou formulário | Número | Sim | Valor do Fiat. |
| `out_trade_no` | Consulta ou formulário | String | Sim | ID do pedido no sistema do lojista. |
| `notify_url` | Consulta ou formulário | String | Sim | URL de callback do lojista. |
| `return_url` | Consulta ou formulário | String | Não | URL de retorno do navegador. |
| `name` | Consulta ou formulário | String | Não | Nome do produto ou pedido. |
| `type` | Consulta ou formulário | String | Não | Vazio, `alipay`, ou um seletor `token.network` habilitado. |
| `token` | Consulta ou formulário | String | Não | Solicitado token quando nenhum seletor foi encontrado. |
| `network` | Consulta ou formulário | String | Não | Solicitando rede quando nenhum seletor corresponde. |
| `currency` | Consulta ou formulário | String | Não | Substitui a moeda padrão do EPay. |
| `sign` | Consulta ou formulário | String | Sim | Assinatura EPay MD5. |
| `sign_type` | Consulta ou formulário | String | Não | Normalmente, `MD5`. |

<!-- #endregion epay-fields -->

Inclua no cálculo MD5 todos os parâmetros recebidos que tenham valor, inclusive campos de plugins como `sitename`. Exclua apenas `sign` e `sign_type`. O exemplo abaixo mostra a entrada canônica com a chave secreta de demonstração, seguida da assinatura.

```text
money=100&name=VIP&notify_url=https://merchant.example/notify&out_trade_no=ORD202605230001&pid=1000&return_url=https://merchant.example/return&type=alipayepusdt_secret_key
```

```text
sign=b865b0acbb2b01554c35a1bd33351452
```

**Seleção de ativo.** Um seletor `token.network` aceito no campo `type` tem precedência sobre o token e a rede explícitos e sobre os valores padrão. Um tipo desconhecido e não vazio, como `usdt-tron`, retorna `10009`. Se o tipo estiver vazio ou for `alipay`, cada campo ausente recebe o respectivo padrão do EPay. Se ambos continuarem vazios, o servidor cria um pedido provisório. Se faltar apenas um, a requisição é rejeitada. Para a moeda, a ordem é o valor enviado, o padrão configurado e, por fim, `cny`.

Instalações novas inicializam `cny` e deixam o token e a rede padrão vazios. As configurações existentes são preservadas durante as atualizações. O servidor define `payment_type=Epay` após a verificação da assinatura. Assine qualquer `type`, `token`, `network` e `currency` que você realmente envie.

<a id="callbacks"></a>

## Callbacks para o lojista {#merchant-callbacks}

EPUSDT notifica a URL `notify_url` da ordem após o pagamento bem-sucedido. Verifique a assinatura, compare a ordem e o valor, e processe as notificações repetidas de forma idempotente. Responda com HTTP 200 e um corpo contendo `ok` ou `success` (insensível a maiúsculas/minúsculas). Se a entrega falhar, tente novamente de acordo com `order_notice_max_retry` e `callback_retry_base_seconds`, com retrocesso exponencial limitado a cinco minutos.

### GMPay {#gmpay}

O GMPay envia JSON via POST. Consulte a chave do comerciante local usando o `pid` e verifique o HMAC utilizando a mesma canonização utilizada na criação do pedido. O corpo omite o `payment_type`.

```json
{
  "pid": "1000",
  "trade_id": "20260523171652123456001",
  "order_id": "ORD202605230001",
  "amount": 100,
  "actual_amount": 14.29,
  "receive_address": "TTestTronAddress001",
  "token": "USDT",
  "block_transaction_id": "0xabc123...",
  "signature": "498975a97bc34563bdb14df53fc18054645df9684d6c67d9b9dd90ec62be1018",
  "status": 2
}
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `pid` | String | Identificador de chave de comerciante. |
| `trade_id` | String | ID da transação EPUSDT. |
| `order_id` | String | ID do pedido no sistema do lojista. |
| `amount` | Número | Valor do Fiat. |
| `actual_amount` | Número | Valor recebido em criptomoeda. |
| `receive_address` | String | Endereço de entrega. |
| `token` | String | Bem recebido. |
| `block_transaction_id` | String | Referência de hash ou provedor na cadeia. |
| `signature` | String | Hash HMAC-SHA256. |
| `status` | Inteiro | Pago (2). |

### EPay {#epay}

O EPay envia uma solicitação GET com um `type` numérico. Utilize um `pid` de comerciante numérico para os pedidos do EPay e do GMPay, selecionando `payment_type=Epay`. A chamada de retorno utiliza o tipo salvo no pedido ou retorna para `alipay`. Verifique a assinatura MD5 como para um pedido de EPay de entrada.

```text
pid=1000
trade_no=20260523171652123456001
out_trade_no=ORD202605230001
type=alipay
name=VIP
money=100.0000
trade_status=TRADE_SUCCESS
sign=cc44fab3f264615d859f8a1fd36d2f08
sign_type=MD5
```

## Callback do provedor OKPay {#okpay-provider-callback}

Configure `POST /payments/okpay/v1/notify` no OKPay. Ele aceita JSON, formulário codificado em URL, formulário de partes múltiplas ou um corpo de string de consulta. O EPUSDT verifica a assinatura do provedor com o token da loja, processa o pedido correspondente e aciona a chamada de retorno do comerciante. Isso cobre um pedido de substituição concluído ou um pedido filho hospedado.

Resposta bem-sucedida.

```text
success
```

Erro (HTTP 400):

```text
fail
```

## Códigos de erro de aplicação {#application-error-codes}

| Código | HTTP | Significado |
| --- | --- | --- |
| `200` | 200 | Sucesso |
| `400` | 400 | Erro no sistema ou de validação. |
| `401` | 401 | Assinatura inválida |
| `10001` | 400 | O endereço da carteira já existe. |
| `10002` | 400 | O pedido já existe |
| `10003` | 400 | Sem endereço de entrega disponível. |
| `10004` | 400 | Valor abaixo da precisão do pagamento |
| `10005` | 400 | Nenhuma combinação de endereço/valor disponível. |
| `10006` | 400 | Cálculo da taxa de câmbio não foi possível. |
| `10007` | 400 | Bloco já processado. |
| `10008` | 400 | Pedido não encontrado |
| `10009` | 400 | Parâmetros inválidos |
| `10010` | 400 | Estado do pedido alterado |
| `10011` | 400 | Limite de pedidos infantil atingido. |
| `10012` | 400 | Não é possível alternar entre redes em um pedido infantil. |
| `10013` | 400 | O pedido não está pendente |
| `10014` | 400 | Rede desativada |
| `10016` | 400 | Recurso não encontrado |
| `10017` | 400 | O provedor de pagamento foi desativado. |
| `10018` | 400 | Configuração do provedor de pagamento incompleta. |
| `10019` | 400 | Token ou rede do provedor não suportada. |
| `10038` | 400 | Verificação do hash da transação falhou. |
| `10039` | 400 | A verificação manual requer um pedido na blockchain. |
| `10041` | 400 | URL de notificação inválida. |
| `10042` | 400 | A criação do pedido do fornecedor falhou. |
| `10044` | 400 | URL de redirecionamento inválida. |
| `10045` | 400 | Chave do comerciante indisponível. |
| `10046` | 400 | Impossibilidade de definir os parâmetros de retorno do EPay. |

[Lista completa de erros da aplicação](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/util/constant/errno.go)

Para listas e precedência de métodos EPay, consulte o [guia de integração EPay](/pt/guide/integration/epay).
