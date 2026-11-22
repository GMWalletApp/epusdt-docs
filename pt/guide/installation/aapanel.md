---
description: "Configure um domínio de checkout EPUSDT no aaPanel, configure o HTTPS e conecte o proxy reverso ao processo de gateway."
---

# Instalação com aaPanel {#install-using-aapanel}

## Crie o site. {#create-the-site}

Crie um site estático para o seu domínio de checkout e configure DNS e HTTPS. O EPUSDT é executado como um processo separado com SQLite. Mantenha o binário, a configuração e os bancos de dados fora do diretório público do site.

![Adicionar o domínio da página de pagamento](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## Configure o processo. {#configure-the-process}

1. Instale o gerenciador Supervisor no aaPanel. Baixe e descompacte a versão para sua arquitetura. Siga o [manual de instalação](/pt/guide/installation/manual) para preparar a conta de serviço, as pastas acessíveis e o arquivo `.env`.
2. Defina a variável `app_uri` para a sua URL HTTPS de checkout e `http_listen=127.0.0.1:8000`. No Supervisor, defina o diretório de trabalho para o seu diretório de instalação e o comando para o caminho completo do binário, seguido de `http start`. Habilite a inicialização automática e a reinicialização.
3. Verifique o status do processo e os logs no Supervisor.

![Configurações do processo no Supervisor](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## Adicione o proxy reverso e verifique. {#add-the-reverse-proxy-and-verify}

Nas configurações do site, adicione um proxy reverso que aponte para `http://127.0.0.1:8000`. Abra `https://YOUR-DOMAIN/payments/gmpay/v1/config` e confira se a resposta contém `status_code: 200`. Adicione um endereço de recebimento para disponibilizar os ativos habilitados no checkout. Após alterar a configuração, reinicie o EPUSDT no Supervisor.

![Configurações do proxy reverso](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
