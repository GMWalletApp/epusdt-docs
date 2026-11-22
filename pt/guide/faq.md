---
description: "Obtenha informações sobre o GMPay e o EPay, credenciais de comerciantes, ativos habilitados e verificação de callback ao integrar o EPUSDT."
title: "Perguntas Frequentes sobre Integração de Comerciantes"
---

# FAQ {#faq}

## Qual endpoint devo usar? {#which-route-should-i-use}

- Utilize o GMPay para todas as novas integrações.
- Utilize o redirecionamento compatível com EPay apenas quando o sistema upstream exigir um redirecionamento de pagamento no estilo EPay.
- Não crie novas integrações no caminho `/payments/epusdt/v1/order/create-transaction`, pois essa rota não está mais registrada na versão atual.

## De onde vêm as chaves `pid` e de assinatura? {#where-do-pid-and-signing-keys-come-from}

Consulte os registros de chaves de API no painel de administração. Cada lojista possui um `pid` e a respectiva `secret_key`.

## Por que a configuração do GMPay difere entre os ambientes? {#why-does-the-gmpay-config-differ-between-environments}

Como `GET /payments/gmpay/v1/config` é calculado a partir dos seus próprios dados administrativos.

A lista `data.supported_assets` depende das cadeias habilitadas, dos tokens de cadeia habilitados e dos endereços de carteira disponíveis naquele ambiente.

## Quais nós são necessários? {#which-nodes-do-i-need}

O ChainScanner integrado inclui nós públicos. O TRON pode utilizar um endpoint público suportado sem a chave TronGrid. Ao adicionar um nó, selecione a rede e o protocolo que o provedor realmente oferece. Uma assinatura WebSocket pode anunciar um novo bloco, enquanto um endpoint HTTP separado o lê.

O painel exibe o progresso da varredura e alerta quando o atraso observado excede cinco minutos. Para consultas frequentes de Solana, TON ou Plasma, configure nós de fallback de dois provedores independentes e verifique seus limites.

## Como as taxas de câmbio são definidas? {#how-are-exchange-rates-set}

Escolha `fixed` para usar `rate.forced_rate_list` ou `auto` para buscar as taxas de `rate.api_url`. O modo automático mantém as taxas mais recentes em cache caso a atualização falhe. Uma lista vazia de taxas forçadas restaura as taxas padrão para CNY com USDT e USDC.
