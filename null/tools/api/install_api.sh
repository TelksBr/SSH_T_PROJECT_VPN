

#!/bin/bash

mkdir /online_api
wget -p /online_api https://raw.githubusercontent.com/TelksBr/SSH_T_PROJECT_VPN/page/null/tools/api/onlines_api
chmod +x onlines_api

SERVICE_NAME="api-server"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
BINARY_PATH="/online_api/onlines_api"
WORKING_DIR="/online_api"
USER="root"  # Substitua pelo nome do usuário que executará o serviço
GROUP="root"  # Substitua pelo grupo do usuário
PORT=8880

# Função para criar o arquivo de serviço
create_service_file() {
    echo "Criando o arquivo de serviço ${SERVICE_FILE}..."

    sudo tee ${SERVICE_FILE} > /dev/null <<EOF
[Unit]
Description=API Server
After=network.target

[Service]
ExecStart=${BINARY_PATH}
WorkingDirectory=${WORKING_DIR}
Restart=always
User=${USER}
Group=${GROUP}
Environment=PORT=${PORT}

[Install]
WantedBy=multi-user.target
EOF
}

# Função para recarregar systemd e iniciar o serviço
reload_and_start_service() {
    echo "Recarregando systemd..."
    sudo systemctl daemon-reload

    echo "Iniciando o serviço ${SERVICE_NAME}..."
    sudo systemctl start ${SERVICE_NAME}

    echo "Habilitando o serviço ${SERVICE_NAME} para inicialização automática..."
    sudo systemctl enable ${SERVICE_NAME}

    echo "Status do serviço ${SERVICE_NAME}:"
    sudo systemctl status ${SERVICE_NAME}
}

# Executa as funções
create_service_file
reload_and_start_service

echo "Configuração do serviço ${SERVICE_NAME} concluída!"
