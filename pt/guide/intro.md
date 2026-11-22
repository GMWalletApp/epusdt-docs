---
description: "Identifique as redes e tokens que o EPUSDT suporta, configure os endereços de recebimento e siga uma ordem do checkout até a notificação de pagamento assinado."
title: "Redes suportadas, tokens e checkout de comerciantes."
---

# Introdução {#introduction}

EPUSDT é um gateway de pagamento auto-hospedado. Um comerciante cria um pedido, o comprador efetua o pagamento no momento da compra, e o gateway envia uma notificação assinada após a verificação do pagamento. Os pagamentos diretos na blockchain são enviados para o endereço de recebimento do comerciante.

Para implantar com Codex, Claude Code, Cursor ou OpenCode, forneça ao agente o [guia de implantação e a lista de verificação](https://epusdt.com/agent-setup/prompt.md).

## Configure seu primeiro pagamento. {#set-up-your-first-payment}

1. [Implante o gateway](/pt/guide/installation/docker) e configure a URL HTTPS pública da página de pagamento.
2. No console de administração, ative uma rede e um ativo, e adicione um endereço de recebimento. Crie uma chave de API para o comerciante e mantenha seu `pid` e `secret_key` no seu servidor.
3. [Crie um pedido no GMPay](/pt/api/payment#create) e redirecione o comprador para `payment_url`. Para uma integração existente com o EPay, use o [fluxo de redirecionamento do EPay](/pt/guide/integration/epay).

## Correntes e tokens suportados {#networks}

O checkout oferece um recurso de pagamento direto quando sua rede e o ativo estão habilitados, e um endereço de recebimento é configurado. Estas são as configurações padrão em uma instalação inicial. Consulte `data.supported_assets` a partir de `GET /payments/gmpay/v1/config` para as opções do seu gateway.

O travessão indica um ativo nativo sem contrato. O comprador deve enviar o pagamento ao endereço informado no pedido. Os identificadores na tabela servem para conferir o ativo.

<div class="asset-directory">

| Rede (ID na API) | Token | Contrato / ID do ativo | Casas decimais |
| --- | --- | --- | ---: |
<!--@include: @/.vitepress/data/asset-rows.md-->

</div>

Arc aceita USDC nativo e USDC ERC-20. Na Polygon, o USDC e o USDC.e são ativos distintos.

### A7A5 (TRC-20 / ERC-20) {#a7a5}

O A7A5 é atrelado ao rublo russo. Ative o A7A5 separadamente em cada rede que pretende usar (TRON ou Ethereum) e adicione uma carteira de recebimento nessa rede. Se usar câmbio fixo, adicione uma cotação `a7a5` para cada moeda de cobrança. O valor indica quantos A7A5 correspondem a uma unidade dessa moeda.

Nas versões com A7A5, use estes campos para selecionar o ativo em um pedido GMPay. Instalações anteriores podem precisar de uma atualização.

| GMPay `network` | GMPay `token` | EPay `type` |
| --- | --- | --- |
| `tron` | `A7A5` | `a7a5.tron` |
| `ethereum` | `A7A5` | `a7a5.ethereum` |

[TRONSCAN](https://tronscan.org/#/token20/TLeVfrdym8RoJreJ23dAGyfJDygRtiWKBZ) · [Etherscan](https://etherscan.io/token/0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9)

### Métodos de pagamento hospedados {#hosted-payment-methods}

O OKX OnchainOS na Camada X suporta USDC, USDT e USDG. O OKPay suporta USDT e TRX por padrão. Habilite cada provedor separadamente. Consulte suas opções em `data.xlayer` ou `data.okpay`.

## De transferência à conclusão {#from-transfer-to-fulfillment}

ChainScanner opera por padrão dentro do EPUSDT. Quando detecta uma transferência correspondente, a ordem é movida para **5 · Confirmando**. Com a verificação rigorosa habilitada (que é o padrão), é necessário a profundidade de confirmação e os resultados de correspondência de dois nós independentes para **2 · Pago**. Após duas rodadas malsucedidas, a ordem é movida para **6 · Revisão manual**. Só realize a ordem após verificar a chamada de retorno de sucesso assinada.

## Capturas de tela {#screenshots}

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="Visão geral do painel" height="200"><br>
      <sub>Visão geral do painel</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="Painel de administração" height="200"><br>
      <sub>Painel de administração</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="Página de Finalização" height="200"><br>
      <sub>Página de Finalização</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="Página de Pagamento" height="200"><br>
      <sub>Página de Pagamento</sub>
    </td>
  </tr>
</table>

## Projetos relacionados e auditoria {#related-projects-and-audit}

- [GMPay Edge](/pt/gmpay-edge/) · Gateway de pagamentos para Workers ou Bun.
- [GMShop Edge](/pt/gmshop-edge/) · Loja de produtos digitais.
- [Auditoria de segurança do EPUSDT, maio de 2026](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
