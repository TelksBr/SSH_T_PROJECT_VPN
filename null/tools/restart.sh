#!/bin/sh
export PATH=/bin:/usr/bin:/usr/local/bin
# Obtém o caminho completo para o comando systemctl
SYSTEMCTL_CMD=$(which systemctl)

# Função para reiniciar um serviço com tratamento de erros
restart_service() {
    service_name=$1
    if $SYSTEMCTL_CMD restart $service_name; then
        echo "Serviço $service_name reiniciado com sucesso."
    else
        echo "Erro ao reiniciar o serviço $service_name."
    fi
}

# Reinicia os serviços desejados
restart_service proxy-443
restart_service proxy-80
restart_service proxy-8080
restart_service badvpn@7200
restart_service badvpn@7300
restart_service v2ray







