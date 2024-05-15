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
const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 8888;
const ONLINE_FILE_PATH = __dirname + "/online.txt";

// Middleware para habilitar o CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Função para obter o número de usuários online via PHP
function getOnlineFromPHP(callback) {
  exec("php /opt/DragonCore/menu.php onlines", (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Erro ao executar o comando PHP:", error || stderr);
      callback(null);
      return;
    }
    const onlineUsers = parseInt(stdout.trim());
    callback(onlineUsers);
  });
}

// Função para obter o número de usuários online do arquivo
function getOnlineFromFile(callback) {
  fs.readFile(ONLINE_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o número de usuários online do arquivo:", err);
      callback(null);
      return;
    }
    const onlineUsers = parseInt(data.trim());
    callback(onlineUsers);
  });
}

// Rota para obter o número de usuários online
app.get("/online", (req, res) => {
  getOnlineFromPHP((onlineUsersFromPHP) => {
    if (onlineUsersFromPHP !== null) {
      res.json({ onlineUsers: onlineUsersFromPHP });
    } else {
      getOnlineFromFile((onlineUsersFromFile) => {
        if (onlineUsersFromFile !== null) {
          res.json({ onlineUsers: onlineUsersFromFile });
        } else {
          res.status(500).send("Erro ao obter o número de usuários online");
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor API rodando na porta ${PORT}`);
});
' >server.js

# Cria o script shell para atualizar os valores
echo '#!/bin/bash

fun_online() {
    _ons=$(ps -x | grep sshd | grep -v root | grep priv | wc -l)
    [[ -e /etc/openvpn/openvpn-status.log ]] && _onop=$(grep -c "10.8.0" /etc/openvpn/openvpn-status.log) || _onop="0"
    [[ -e /etc/default/dropbear ]] && _drp=$(ps aux | grep dropbear | grep -v grep | wc -l) _ondrp=$(($_drp - 1)) || _ondrp="0"
    _onli=$(($_ons + $_onop + $_ondrp))
    _onlin=$(printf '"'"'%-5s'"'"' "$_onli")
    CURRENT_ONLINES="$(echo -e "${_onlin}" | sed -e '"'"'s/[[:space:]]*$//'"'"')"
    echo $CURRENT_ONLINES > ~/api-server/online.txt
}

while true; do
    echo '"'"'verificando...'"'"'
    fun_online > /dev/null 2>&1
    sleep 15s
done
' >update_online.sh

# Dá permissão de execução ao script shell
chmod +x update_online.sh

# Cria o serviço systemd para o script shell
echo '[Unit]
Description=Atualização de usuários online

[Service]
Type=simple
ExecStart=/bin/bash /home/user/api-server/update_online.sh
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
' | tee /etc/systemd/system/online-update.service

# Habilita e inicia o serviço
systemctl enable online-update
systemctl start online-update

# Cria o arquivo de configuração do PM2
echo '
{
  "apps": [
    {
      "name": "api-server",
      "script": "server.js",
      "watch": true,
      "restart_delay": 3000
    },
    {
      "name": "update-online",
      "script": "update_online.sh"
    }
  ]
}
' >pm2.config.json

# Inicia a API e o script shell com PM2
pm2 start pm2.config.json

echo "Instalação e configuração concluídas!"
