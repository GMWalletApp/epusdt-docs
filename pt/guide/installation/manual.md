---
description: "Execute a versão Linux do EPUSDT utilizando seu próprio gerenciador de serviços e configure o diretório de trabalho e as configurações do gateway."
---

# Instalação manual no Linux {#manual-linux-installation}

Utilize este procedimento para executar o binário liberado sob seu próprio gerenciador de serviços. Para uma instalação gerenciada do systemd, siga o [guia do epctl](/pt/guide/installation/epctl).

## Prepare a pasta do aplicativo. {#prepare-the-application-directory}

Baixe o arquivo do Linux para a sua arquitetura de [Releases](https://github.com/GMWalletApp/epusdt/releases). Extraia-o em um diretório de aplicativo privado, como `/opt/epusdt`. Configure uma conta de serviço dedicada com acesso de escrita aos diretórios de configuração e SQLite. Mantenha esses diretórios fora da raiz web pública.

## Configure e teste {#configure-and-test}

Ao instalar, copie a cópia de exemplo inclusa, e então edite a cópia. Mantenha um arquivo `.env` existente durante as atualizações.

```sh
cd /opt/epusdt
chmod +x epusdt
cp -n .env.example .env
```

Para um serviço configurado atrás de um proxy HTTPS, defina as seguintes entradas no arquivo `.env` e utilize seu domínio público. A primeira inicialização cria as tabelas SQLite.

```dotenv
app_uri=https://pay.example.com
http_listen=127.0.0.1:8000
runtime_root_path=./runtime
sqlite_database_filename=epusdt.db
install=false
```

Execute `./epusdt http start` no diretório da aplicação. A partir de outro terminal, verifique `curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config`. Pare o processo em primeiro plano antes de iniciar o serviço gerenciado.

## Mantenha o serviço em funcionamento. {#keep-the-service-running}

Para o Supervisor, utilize a seguinte definição de programa e substitua `epusdt` no campo do usuário pela conta de serviço que você preparou. Execute `supervisorctl reread`, seguido de `supervisorctl update`.

```ini
[program:epusdt]
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
user=epusdt
autostart=true
autorestart=true
redirect_stderr=true
```

Configure seu host HTTPS para apontar para `http://127.0.0.1:8000`. Para o Nginx, utilize esta localização dentro do bloco de servidor TLS. Reinicie o serviço após editar a configuração. Faça um backup das configurações e dos diretórios de dados antes de fazer a atualização.

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
