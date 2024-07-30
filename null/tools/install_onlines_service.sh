#!/bin/bash

# Atualiza os repositórios
apt update

# Instala o Node.js e o npm
apt install nodejs npm -y

# Instala o Express globalmente
npm install -g express

# Instala o PM2 globalmente
npm install -g pm2

# Cria o diretório para o servidor
mkdir -p ~/api-server

# Navega até o diretório do servidor
cd ~/api-server

# Inicializa um novo projeto Node.js
npm init -y

# Instala o Express localmente no projeto
npm install express

# Cria o arquivo do servidor
touch server.js

# Adiciona o código do servidor
echo '

' >server.js

# Cria o script shell para atualizar os valores
echo '#!/bin/bash

fun_online() {
    local _ons=$(ps -x | grep sshd | grep -v root | grep priv | wc -l)
    local CURRENT_ONLINES=$(echo "$_ons" | sed -e 's/[[:space:]]*$//')
    echo "$CURRENT_ONLINES" > ~/api-server/online.txt
}


while true; do
    echo '"'"'verificando...'"'"'
    fun_online > /dev/null 2>&1
    sleep 60s
done
' >update_online.sh

# Dá permissão de execução ao script shell
chmod +x update_online.sh

# Cria o arquivo de configuração do PM2
echo '
{
  "apps": [
    {
      "name": "api-server",
      "script": "server.js",
      "watch": true,
      "restart_delay": 3000,
      "ignore_watch": ["online.txt"]
    },
    {
      "name": "update-online",
      "script": "update_online.sh"
    }
  ]
}
' >pm2.config.json

# Inicia a API e o script shell com PM2
pm2 start pm2.config.json ; pm2 save ; pm2 startup

echo "Instalação e configuração concluídas!"
