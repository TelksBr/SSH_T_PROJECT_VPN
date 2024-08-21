#!/bin/bash

mkdir /root/online_api
wget -O /root/online_api/onlines_api https://raw.githubusercontent.com/TelksBr/SSH_T_PROJECT_VPN/page/null/online_api/go_lang/onlines_api
chmod +x /root/online_api/onlines_api

SERVICE_NAME="api-server"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
BINARY_PATH="/root/online_api/onlines_api"
WORKING_DIR=/root"/online_api"
USER="root"  # Substitua pelo nome do usuário que executará o serviço
GROUP="root" # Substitua pelo grupo do usuário

# Função para criar o arquivo de serviço
create_service_file() {
    echo "Criando o arquivo de serviço ${SERVICE_FILE}..."

    tee ${SERVICE_FILE} >/dev/null <<EOF
[Unit]
Description=API Server
After=network.target

[Service]
ExecStart=${BINARY_PATH}
WorkingDirectory=${WORKING_DIR}
Restart=always
User=${USER}
Group=${GROUP}


[Install]
WantedBy=multi-user.target
EOF
}

# Função para recarregar systemd e iniciar o serviço
reload_and_start_service() {
    echo "Recarregando systemd..."
    systemctl daemon-reload

    echo "Iniciando o serviço ${SERVICE_NAME}..."
    systemctl start ${SERVICE_NAME}

    echo "Habilitando o serviço ${SERVICE_NAME} para inicialização automática..."
    systemctl enable ${SERVICE_NAME}

    echo "Status do serviço ${SERVICE_NAME}:"
    systemctl status ${SERVICE_NAME}
}

# Executa as funções
create_service_file
reload_and_start_service

echo "Configuração do serviço ${SERVICE_NAME} concluída!"
