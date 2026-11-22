---
description: "Conecte as lojas GMShop Edge através da API de fornecedores nativa para solicitações de catálogo, pedidos e canais de pagamento assinados."
titleTemplate: ":title | GMShop Edge"
---

# API nativa de fornecedores {#native-supplier-api}

O GMShop Edge pode funcionar como um fornecedor digital upstream para outra instância do GMShop Edge. O protocolo nativo expõe as operações de catálogo, pedido, canal de pagamento e recarga de carteira sob `/api/v1/supplier/*`; é um protocolo de fornecimento de loja, e não uma API de gateway de pagamento.

## Ativar e fornecer credenciais {#enable-and-issue-credentials}

Ative a API do fornecedor nas configurações de administração, e então crie uma chave de API para a conta do cliente que fará compras nesta loja. A chave secreta é exibida apenas no momento da criação e é armazenada de forma criptografada. As chaves podem ser revogadas, e é possível definir uma origem de callback permitida (opcional) para restringir os locais para os quais as respostas de fulfillment são enviadas.

A instância GMShop Edge, que utiliza o adaptador de fornecedor `gmshop_edge`, armazena o ID da chave e o segredo emitidos em sua configuração de execução criptografada.

## Solicitação de assinatura {#request-signing}

Todas as solicitações devem utilizar HTTPS sem especificar uma porta e enviar:

- `GMShop-Edge-Api-Key`: ID da chave emitida.
- `GMShop-Edge-Timestamp`: timestamp Unix de 10 dígitos, em segundos.
- `GMShop-Edge-Nonce`: valor alfanumérico/com hífen único, com 16 a 100 caracteres.
- `GMShop-Edge-Signature`: resumo HMAC-SHA256 em hexadecimal minúsculo.

Construa o payload de assinatura combinando estes valores com caracteres de nova linha:

```text
UPPERCASE_HTTP_METHOD
PATH_WITH_RAW_QUERY
UNIX_TIMESTAMP
NONCE
SHA256_HEX_OF_RAW_BODY
```

Calcule o HMAC-SHA256 sobre aquele payload usando o segredo API fornecido. O servidor aceita um desvio de tempo de até 60 segundos e armazena cada nonce como um recibo de repetição. Reutilizar uma nonce retorna um conflito. As limitações de taxa atuais são 120 solicitações por chave por minuto e 300 solicitações por usuário por minuto.

## Endpoints {#endpoints}

| Operação | HTTP | Caminho |
| --- | --- | --- |
| Verificar credenciais | POST | `/api/v1/supplier/ping` |
| Listar categorias | GET | `/api/v1/supplier/categories` |
| Listar produtos | GET | `/api/v1/supplier/products` |
| Consultar um produto | GET | `/api/v1/supplier/products/{productId}` |
| Criar um pedido | POST | `/api/v1/supplier/orders` |
| Consultar um pedido | GET | `/api/v1/supplier/orders/{orderId}` |
| Cancelar um pedido | POST | `/api/v1/supplier/orders/{orderId}/cancel` |
| Listar canais de pagamento | GET | `/api/v1/supplier/payment-channels` |
| Criar uma recarga | POST | `/api/v1/supplier/topups` |
| Consultar uma recarga | GET | `/api/v1/supplier/topups/{id}` |

A criação de pedidos e as operações de recarga são idempotentes. Ao tentar novamente um pedido incerto, mantenha a referência à idempotência; não crie um novo pedido de fornecedor apenas porque o cliente expirou.

## Referência da API {#api-reference}

A instância implantada redireciona `/openapi` para sua referência de API interativa. O repositório também publica o documento completo [OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml), que abrange autenticação, atendimento ao cliente, callbacks de fornecedores, administração, suporte web e o protocolo nativo de fornecedores.
